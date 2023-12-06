# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
import supabase
from binge_log import Logger
load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def update_user_settings(user_id, new_settings):
    url: str = environ.get("SUPABASE_URL")
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)
    try:
        return (supa_backend.table("user_settings")
                .update({"settings": new_settings})
                .eq("id", user_id).execute())
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return


def update_session_info(session_id, new_session_data):
    url: str = environ.get("SUPABASE_URL")
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)
    try:
        return (supa_backend.table("sessions")
                .update({"data": new_session_data})
                .eq("id", session_id).execute())
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return

# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    logger = Logger('likeRestaurant')
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    logger.debug(f'Attempting to extract args from request', given_args=args)

    user_id = args['user_id']
    access_token = args['access_token']
    restaurant = args['restaurant']
    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)
    current_session_info = supa_backend.table("sessions").select("*").execute().model_dump()["data"]
    #print(current_session_info)
    session_ids = list()
    for session in current_session_info:
        try:
            print(session['data']['users'])
            if user_id in session['data']['users']:
                session_ids.append(session['id'])
        except KeyError:
            continue

    print(session_ids)

    current_settings = sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]

    logger.debug(f'Got user settings for user {user_id}', given_args=current_settings["settings"])


    if restaurant in current_settings["settings"]['restaurants']:
        current_settings["settings"]['restaurants'][restaurant] += 1
    else:
        current_settings["settings"]['restaurants'][restaurant] = 1

    for session_id in session_ids:
        current_session_info = supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0]

        # Check if the restaurant is in google_results
        if restaurant not in str(current_session_info['data']['google_results']):
            print('not in')
            continue

        print('it is in')
        found = False
        #print(current_session_info['data'])
        # Iterate through each dictionary in the final_results list
        for result in current_session_info['data']['final_results']:
            #print(f'result: {result}')
            # Check if restaurant is in this dictionary
            if restaurant in result:
                print('adding to')
                #result[restaurant] += current_settings["settings"]['restaurants'][restaurant]
                result[restaurant] += 1
                found = True
                break  # Stop the loop as we found the restaurant

        # If the restaurant was not found in any dictionary, add it as a new dictionary
        if not found:
            print('creating it')
            current_session_info['data']['final_results'].append(
                {restaurant: current_settings["settings"]['restaurants'][restaurant]})

        # Sort the final_results list by the value of each dictionary in descending order
        current_session_info['data']['final_results'] = sorted(current_session_info['data']['final_results'],
                                                               key=lambda x: list(x.values())[0], reverse=True)

        # Uncomment the next line to update the session information
        update_session_info(session_id, current_session_info['data'])

        print(f'Placing {current_session_info["data"]} in session {session_id}')

    try:
        # Update the database with the new settings
        update_user_settings(user_id, current_settings["settings"])
        return {"statusCode": 200,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'User settings updated.'
                    }
                }
    except Exception as e:
                return {"statusCode": 401,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'Unable to get user settings.'
                    }
                }

# If doing any local testing, include this.
if __name__ == "__main__":
    from get_auth import get_access_token
    args = {
        #'user_id': '71f87b7c-55bf-488d-a562-7cd8e120495d',
        "user_id": "5ffd0c40-b021-4d5e-ac33-09b1bb228088",
        "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjMybjY0dTRXRnN2bytocG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAxODM4Nzg2LCJpYXQiOjE3MDE4MzUxODYsImlzcyI6Imh0dHBzOi8vZmZheGVwZ3pmYnV5YWNjcnR6cW0uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjVmZmQwYzQwLWIwMjEtNGQ1ZS1hYzMzLTA5YjFiYjIyODA4OCIsImVtYWlsIjoiamFpbWVlbGVwYW5vMjM1N0BnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6ImVtYWlsIiwicHJvdmlkZXJzIjpbImVtYWlsIl19LCJ1c2VyX21ldGFkYXRhIjp7fSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJwYXNzd29yZCIsInRpbWVzdGFtcCI6MTcwMTgzNTE4Nn1dLCJzZXNzaW9uX2lkIjoiNDM4NjUwNjUtMTY5MC00MTYzLWFmMjgtMzE4ZWRiMmExMjE1In0.SVYlBt07GX9P1CuxTvfg1yfnFIFpYtC1-PHe3DMlyj4",
        "restaurant": "Alice's Restaraunt"

    }
    print(main(args))


