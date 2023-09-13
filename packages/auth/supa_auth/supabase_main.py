import os
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase_backend import setup_new_user_in_db

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")


def new_user_by_email(email, password):
    try:
        response = supabase.auth.sign_up({"email": email, "password": password})
        supabase.postgrest.auth(response.session.access_token)
        setup_new_user_in_db(response)
    except Exception as e:
        if "Password should be at least 10 characters" in str(e):
            print('todo: error handling for small password')
        else:
            print(f'todo: handle other errors: {e}')
            # Raise custom error
            raise "Error creating user"
        response = None # TODO: handle error here and above
        exit(1)
    return response

def sign_in_by_email(email, password):
    try:
        response = supabase.auth.sign_in_with_password({"email": email, "password": password})
        supabase.postgrest.auth(response.session.access_token)

    except Exception as e:
        print(f'todo: handle other errors: {e}')
        response = None  # TODO: handle error here and above
        exit(1)
    return response
    

if __name__ == "__main__":
    supabase: Client = create_client(url, key)

    try:
        session = new_user_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))
    except Exception as e:
        print(f"Error creating user: {e}")
        session = sign_in_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))

    print(supabase.table("user_settings").select("*").execute())
    #setup_new_user_in_db(session) # TODO: Trying to get this to work as called when signing up


    print(supabase.table("user_settings").select("*").execute())

    supabase.auth.sign_out()

