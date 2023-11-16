# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
from supabase import create_client, Client
load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def get_results(session_id, url):
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: Client = create_client(url, secret_key)
    try:
        session_data = supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0]
        session_data["data"]["restaurants"] = sorted(session_data["data"]["restaurants"], key=lambda x: x['rating'], reverse=True)
        return session_data
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return
    

def get_user(user_id, url, access_token):
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    sb_client = create_client(url, key)
    sb_client.postgrest.auth(access_token)

    try:
        return sb_client.table("user_settings").select("*").eq("id", user_id).execute().model_dump()["data"][0]["settings"]["restaurants"]
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

    user_id = args['user_id']
    access_token = args['access_token']
    session_id = args['session_id']

    session_data = get_results(session_id, url)
    user_results = get_user(user_id, url, access_token)

    session_data["data"]["restaurants"].sort(key=lambda x: user_results.get(x["name"], float('inf')))

    print(session_data["data"])

    return {"statusCode": 200,  # Status code not required by DO, required by convention.
            "body": session_data["data"]

                 # Return Dictionary of 2 keys: List of Sorted Rest., + Timer (Float)
            }

# If doing any local testing, include this.
if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", help="User ID", required=True)
    parser.add_argument("--access_token", help="Access Token", required=True)
    parsed_args = parser.parse_args()
    args = vars(parsed_args)
    args["session_id"] = 13
    main(args)

