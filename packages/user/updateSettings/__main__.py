# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
import supabase
load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def update_db(user_id, new_settings):
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

# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    print(args)
    user_id = args['user_id']
    access_token = args['access_token']
    new_settings = args['settings']
    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)

    current_settings = sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]
    print(current_settings["settings"])

    # ['settings']['restaurants'] = {"restaurant1": int, "restaurant2": int, "restaurant3": int}
    # For each value in new_settings['restaurants'], increment the value in current_settings['restaurants']
    # If the key isn't in current_settings, add it with a value of 1
    for restaurant in new_settings['restaurants']:
        if restaurant in current_settings["settings"]['restaurants']:
            current_settings["settings"]['restaurants'][restaurant] += 1
        else:
            current_settings["settings"]['restaurants'][restaurant] = 1

    # Update the database with the new settings except for the restaurants
    for key in new_settings:
        if key != "restaurants":
            current_settings["settings"][key] = new_settings[key]
    try:
        # Update the database with the new settings
        update_db(user_id, current_settings["settings"])
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
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", help="User ID", required=True)
    parser.add_argument("--access_token", help="Access Token", required=True)
    parsed_args = parser.parse_args()
    args = vars(parsed_args)
    args['settings'] = {"AWESOME NEW SETTING": "bananas"}
    args['settings']['restaurants'] = {"resturant13": 1}
    # pass args to main()
    main(args)


