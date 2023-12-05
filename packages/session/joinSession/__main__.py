# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
import supabase
from time import time
from binge_log import Logger
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
    logger = Logger('joinSession')
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    user_id = args['user_id']
    access_token = args['access_token']
    session_id = int(args['session_id'])
    logger.debug("Extracted args from request", given_args=args)

    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)
    sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]["settings"]["restaurants"]
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)
    current_session_info = supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0]

    logger.debug(f'Got session info for session {session_id}', given_args=current_session_info["data"])

    if not float(current_session_info["data"]["timer"]) > 0:
        #current epoch time
        print('starting timer')
        logger.debug(f'Starting timer for session {session_id}')
        current_session_info["data"]["timer"] = time()

    if user_id not in current_session_info["data"]["users"]:
        logger.debug(f'Adding user {user_id} to session {session_id}')
        current_session_info["data"]["users"].append(user_id)

    try:
        # Update the database with the new settings
        update_db(session_id, current_session_info["data"])
        logger.info(f'Updated session {session_id} with new user {user_id} settings', given_args=current_session_info["data"])
        return {"statusCode": 200,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'User settings updated.'
                }
                }
    except Exception as e:
                logger.error(f'Unable to update session {session_id} with new user {user_id} settings', given_args=current_session_info["data"])
                return {"statusCode": 401,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'Unable to get user settings.'
                    }
                }

# If doing any local testing, include this.
if __name__ == "__main__":
    from get_auth import get_access_token
    args = {
        'user_id': '71f87b7c-55bf-488d-a562-7cd8e120495d',
        "access_token": get_access_token(),
        "session_id": "144"

    }
    print(main(args))



