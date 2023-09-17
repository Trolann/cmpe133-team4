import os
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase_backend import setup_new_user_in_db
import json

# load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
sb_client: Client = create_client(url, key)

def new_user_by_email(email, password):
    try:
        response = sb_client.auth.sign_up({"email": email, "password": password})
        sb_client.postgrest.auth(response.session.access_token)
        setup_new_user_in_db(response)
    except Exception as e:
        if "Password should be at least 10 characters" in str(e):
            print('todo: error handling for small password')
        else:
            print(f'todo: handle other errors: {e}')
            # Raise custom error
            raise "Error creating user"
        response = None # TODO: handle error here and above

    return response

def sign_in_by_email(email, password):
    try:
        response = sb_client.auth.sign_in_with_password({"email": email, "password": password})
        sb_client.postgrest.auth(response.session.access_token)


    except Exception as e:
        print(f'todo: handle other errors signin: {e}')
        response = None  # TODO: handle error here and above

    return response
    
def main(args: list = None):
    # supabase: Client = create_client(url, key)

    try:
        session = new_user_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))
    except Exception as e:
        print(f"Error creating user: {e}")
        session = sign_in_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))

    print(session)
    print(sb_client.table("user_settings").select("*").execute())
    #setup_new_user_in_db(session) # TODO: Trying to get this to work as called when signing up

    response = sb_client.table("user_settings").select("*").execute()
    print(sb_client.table("user_settings").select("*").execute())

    sb_client.auth.sign_out()
    # return a dict of the response
    return {"statusCode": 200,
            "body": {
                'response_type': 'in_channel',
                'text': str(response)
                }
            }

if __name__ == "__main__":
    main()

