# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
from supabase import create_client, Client
from binge_log import Logger

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def get_results(session_id, url):
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: Client = create_client(url, secret_key)
    try:
        print(supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0])
        session_data = supa_backend.table("sessions").select("*").eq("id", session_id).execute().model_dump()["data"][0]
        session_data["data"]["google_results"] = sorted(session_data["data"]["google_results"], key=lambda x: x['rating'], reverse=True)
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
    return {"statusCode": 200, "body": {"text": "Hello, World!"}}
    # logger = Logger('getSessionInfo')
    # # Get environment variables. Ensure they are added in DO console.
    # url: str = environ.get("SUPABASE_URL")
    # key: str = environ.get("SUPABASE_KEY")

    # user_id = args['user_id']
    # access_token = args['access_token']
    # session_id = int(args['session_id'])
    # logger.debug("Extracted args from request", given_args=args)

    # session_data = get_results(session_id, url)
    # logger.debug(f'Got {len(session_data["data"]["google_results"])} restaurants for session {session_id}', given_args=session_data["data"])
    # user_results = get_user(user_id, url, access_token)
    # logger.debug(f'Got {len(user_results)} restaurants for user {user_id}', given_args=user_results)

    # print(session_data)
    # session_data["data"]["google_results"].sort(key=lambda x: user_results.get(x["name"], float('inf')))

    # logger.info(f'Sorted restaurants for session {session_id}', given_args=session_data["data"])

    # return {"statusCode": 200,  # Status code not required by DO, required by convention.
    #         "body": {
    #             'text': session_data["data"]
    #             }
    #              # Return Dictionary of 2 keys: List of Sorted Rest., + Timer (Float)
    #         }

# If doing any local testing, include this.
if __name__ == "__main__":
    from get_auth import get_access_token
    args = {
        "user_id": "71f87b7c-55bf-488d-a562-7cd8e120495d",
        "access_token": "eyJhbGciOiJIUzI1NiIsImtpZCI6IjMybjY0dTRXRnN2bytocG4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzAxNzQ4MDcyLCJpYXQiOjE3MDE3NDQ0NzIsImlzcyI6Imh0dHBzOi8vZmZheGVwZ3pmYnV5YWNjcnR6cW0uc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjcxZjg3YjdjLTU1YmYtNDg4ZC1hNTYyLTdjZDhlMTIwNDk1ZCIsImVtYWlsIjoibmV3ZW1haWxAYmluZ2UuYXBwIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoicGFzc3dvcmQiLCJ0aW1lc3RhbXAiOjE3MDE3NDQ0NzJ9XSwic2Vzc2lvbl9pZCI6IjM1ZGQwOGFjLTg0YWEtNDY0NS05MWYwLWFiYTU5MWU1ZmY1MyJ9.70CYCt-sdD1Vh_plvIMK_0CU1adtRTjsFLNjYdXSTfA",
        "session_id": "88"
    }
    print(main(args))

