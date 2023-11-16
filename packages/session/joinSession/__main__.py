# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
import supabase
from time import time
load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def update_db(session_id, new_session_data):
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
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    print(args)
    user_id = args['user_id']
    access_token = args['access_token']
    session_id = args['session_id']
    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)
    current_session_info = supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0]
    if not float(current_session_info["data"]["timer"]) > 0:
        #current epoch time
        current_session_info["data"]["timer"] = time()

    print(current_session_info["data"]["timer"])
    try:
        # Update the database with the new settings
        update_db(session_id, current_session_info["data"])
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
    args['session_id'] = 13
    # pass args to main()
    main(args)


