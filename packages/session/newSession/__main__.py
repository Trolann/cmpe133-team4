# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
import supabase
import googlemaps
from supabase import create_client, Client
from attrs import define, field, asdict, validators

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def is_int_or_float(inst, attribute, value):
    if not isinstance(value, (int, float)):
        raise TypeError(f"The {attribute.name} attribute must be int or float")

def enter_restaraunt_list(result, url):

    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: Client = create_client(url, secret_key)
    try:
        return supa_backend.table("sessions").insert({
            "data": result}).execute()
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return

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


# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    gmaps_key: str = environ.get("GOOGLE_MAPS_KEY")

    user_id = args['user_id']
    access_token = args['access_token']
    lat = args['lat']
    long = args['long']
    filter_distance = args['filter_distance']

    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)

    gmaps = googlemaps.Client(key=gmaps_key)
    google_result = gmaps.places(
            "restaurant",
            location= (lat, long),
            radius=filter_distance,
            region='US',
            language='en-US',
            open_now=True,
        )["results"]

    print(google_result)

    current_restaurants = sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]["settings"]["restaurants"]

    print(current_restaurants)
    results = []
    for result in google_result:
        #print(f'{result["price_level"]} level')
        results.append(RestaurantResult(
            name=result["name"],
            formatted_address=result["formatted_address"],
            icon=result["icon"],
            opening_hours=result["opening_hours"],
            #price_level=result["price_level"],
            rating=result["rating"],
            photos=result["photos"],
        ))

    enter_restaraunt_list(result, url)

    return {"statusCode": 200,  # Status code not required by DO, required by convention.
            "body": {  # Required key
                'text': 'response'
                }
            }

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", help="User ID", required=True)
    parser.add_argument("--access_token", help="Access Token", required=True)
    parsed_args = parser.parse_args()
    args = vars(parsed_args)
    args['lat'] = 37.334665328
    args['long'] = -121.875329832
    args['filter_distance'] = 10
    # pass args to main()
    main(args)
