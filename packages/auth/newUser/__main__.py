# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
from supabase import create_client, Client

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

# Get environment variables. Ensure they are added in DO console.
url: str = environ.get("SUPABASE_URL")


first_settings = {
    "nickname": None,
    "language": "en",
    "vegan": False,
    "active_sessions": [],
    "restaurants": []
}

def setup_new_user_in_db(user_id):
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: Client = create_client(url, secret_key)
    try:
        return supa_backend.table("user_settings").insert({
            "id": user_id,
            "settings": first_settings}).execute()
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return


# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    key: str = environ.get("SUPABASE_KEY")
    sb_client: Client = create_client(url, key)

    try:
        response = sb_client.auth.sign_up({"email": email, "password": password})
        sb_client.postgrest.auth(response.session.access_token)
        setup_new_user_in_db(response.user.id)
    except Exception as e:
        if "Password should be at least 10 characters" in str(e):
            print('todo: error handling for small password')
        else:
            print(f'todo: handle other errors: {e}')
            # Raise custom error
            raise "Error creating user"
        response = None # TODO: handle error here and above
    return {"statusCode": 200,  # Status code not required by DO, required by convention.
            "body": {  # Required key
                'text': 'response'
                }
            }

# If doing any local testing, include this.
if __name__ == "__main__":
    main()

