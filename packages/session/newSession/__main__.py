# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ, remove
import supabase
import googlemaps
from supabase import create_client, Client
from attrs import define, field, asdict, validators
from threading import Thread
import queue
from binge_log import Logger

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)
base_url = "https://ffaxepgzfbuyaccrtzqm.supabase.co/storage/v1/object/public/avatar/"

def is_int_or_float(inst, attribute, value):
    if not isinstance(value, (int, float)):
        raise TypeError(f"The {attribute.name} attribute must be int or float")


def enter_restaraunt_list(result, url):
    url: str = environ.get("SUPABASE_URL")
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend = supabase.create_client(url, secret_key)

    try:
        print('got here')
        return supa_backend.table("sessions").insert({"data": result}).execute()
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return


def upload(filename):
    url: str = environ.get("SUPABASE_URL")
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend = supabase.create_client(url, secret_key)

    with open(filename, 'rb') as f:
        try:
            supa_backend.storage.from_("avatar").upload(file=f, path=filename, file_options={"content-type": "image/png"})
            return f"{base_url}{filename}"
        except supabase.StorageException as e:
            return f"{base_url}{filename}"

@define
class RestaurantResult:
    name = field(type=str, validator=validators.instance_of(str))
    formatted_address = field(type=str, validator=validators.instance_of(str))
    icon = field(type=str, validator=validators.instance_of(str))
    opening_hours = field(type=dict, validator=validators.instance_of(dict))
    #price_level = field(type=int, validator=validators.instance_of(int))
    rating = field(validator=is_int_or_float)
    photos = field(type=list, validator=validators.instance_of(list))

    def to_dict(self):
        d = asdict(self)
        return d

def fetch_photo(photo_ref, identifier, result_queue, gmaps, max_width=500):
    #gmaps_key: str = environ.get("GOOGLE_MAPS_KEY")
    #gmaps = googlemaps.Client(key=gmaps_key)
    try:
        photo = list(gmaps.places_photo(photo_ref, max_width=max_width))
        result_queue.put((identifier, photo))
    except Exception as e:
        print(f"Error fetching photo: {e}")
        result_queue.put([])

# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    logger = Logger('newSession')
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")


    user_id = args['user_id']
    access_token = args['access_token']
    lat = args['lat']
    long = args['long']
    filter_distance = args['filter_distance']
    logger.debug("Extracted args from request", given_args=args)

    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)
    current_restaurants = sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]["settings"]["restaurants"]
    logger.debug(f"Got {len(current_restaurants)} restaurants for user", given_args=current_restaurants)


    google_result = get_all_google_pages(filter_distance, lat, long)

    logger.debug(f"Got {len(google_result)} restaurants from Google", given_args=google_result)

    results = download_all_photos(google_result, logger)

    logger.debug(f'Created session with {len(results)} for {user_id}', given_args=results)
    final_results_dict = {
                            "google_results": results,
                            "users": [user_id],
                            "final_results": [],
                            "timer": 0
                          }
    session_id = enter_restaraunt_list(final_results_dict, url).data[0]["id"]
    from pprint import pprint
    #print(final_results_dict)
    print(session_id)

    logger.info(f'Created session with id {session_id}', given_args=final_results_dict)
    return {"statusCode": 200,  # Status code not required by DO, required by convention.
            "body": {  # Required key
                'text': session_id
                }
            }


def download_all_photos(google_result, logger):
    gmaps_key: str = environ.get("GOOGLE_MAPS_KEY")
    gmaps = googlemaps.Client(key=gmaps_key)
    photo_threads = []
    photo_queue = queue.Queue()
    photo_results = {}
    for index, result in enumerate(google_result):
        photo_ref = result["photos"][0]["photo_reference"]
        thread = Thread(target=fetch_photo, args=(photo_ref, index, photo_queue, gmaps))
        photo_threads.append(thread)
        thread.start()
    logger.debug(f"Started {len(photo_threads)} threads to fetch photos", given_args=photo_threads)
    for thread in photo_threads:
        thread.join()
    while not photo_queue.empty():
        identifier, photo = photo_queue.get()
        photo_results[identifier] = photo
    # Now construct RestaurantResult objects
    results = []
    for index, result in enumerate(google_result):
        photo = photo_results.get(index, [])  # Retrieve the photo using the index
        new_result = RestaurantResult(
            name=result["name"],
            formatted_address=result["formatted_address"],
            icon=result["icon"],
            opening_hours=result["opening_hours"],
            rating=result["rating"],
            photos=photo
        )
        results.append(new_result.to_dict())
    filenames = []
    photo_threads.clear()
    logger.debug(f'Uploading {len(results)} photos', given_args=results)
    for restaurant in results:
        stripped_name = ''.join(e for e in restaurant['name'] if e.isalnum())
        stripped_addy = ''.join(e for e in restaurant['formatted_address'] if e.isalnum())
        filename = f"{stripped_name}{stripped_addy[:16]}.png"
        f = open(filename, "wb")
        # print(restaurant['photos'])
        for chunk in restaurant['photos']:
            if chunk:
                f.write(chunk)
        f.close()
        restaurant['photos'] = [f'{base_url}{filename}']
        # remove the file
        filenames.append(filename)
    for filename in filenames:
        thread = Thread(target=upload, args=(filename,))
        photo_threads.append(thread)
        thread.start()
    for thread in photo_threads:
        thread.join()
    for filename in filenames:
        try:
            remove(filename)
        except Exception as e:
            continue
    return results


def get_all_google_pages(filter_distance, lat, long):
    gmaps_key: str = environ.get("GOOGLE_MAPS_KEY")
    gmaps = googlemaps.Client(key=gmaps_key)
    #raw_result = gmaps.places(
    #    "restaurant",
    #    location=(lat, long),
    #    radius=filter_distance,
    #    region='US',
    #    language='en-US',
    #    open_now=True,
    #)
    #google_result = raw_result["results"]
    #print('got first page')
    google_result = []
    raw_result = {}

    while (1):
        next_page_token = raw_result.get("next_page_token", None)
        print(f'next_page_token: {next_page_token}')
        try:
            print(f'filter_distance: {filter_distance}')
            raw_result = gmaps.places(
                "restaurant",
                location=(lat, long),
                radius=filter_distance,
                region='US',
                language='en-US',
                open_now=True,
                page_token=next_page_token
            )
            print('got another page')
            print(f'{raw_result.get("next_page_token", "next_page_token not found")}')
            # Only add the raw result if it is not already in the list
            for result in raw_result["results"]:
                print(f'one result: {result}')
                if result not in google_result:
                    google_result.append(result)
            #google_result.extend(raw_result["results"])

        except googlemaps.exceptions.ApiError as e:
            if len(google_result) < 20:
                filter_distance += (filter_distance / 5) # increase distance by 20%
                print(f'not enough results, increasing distance to {filter_distance}')
                continue
            print(f'Error: {e}')
            break
        except Exception as e:
            print(f'Uncaught Error: {e}')
            break


    #print(f'raw_result: {raw_result}')
    #print(f'len: {len(raw_result)}')
    print(f'google_result: {len(google_result)}')

    return google_result


if __name__ == "__main__":
    from get_auth import get_access_token
    args = {
        'lat': 32.77375862654402,
        'long': -117.07071418314115,
        'filter_distance': 11000,
        'user_id': '71f87b7c-55bf-488d-a562-7cd8e120495d',
        "access_token": get_access_token()

    }
    print(main(args))
# 32.77375862654402, -117.07071418314115
