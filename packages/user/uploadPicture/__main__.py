# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ, remove
import supabase
from base64 import b64decode

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)

def upload(f, filename):
    url: str = environ.get("SUPABASE_URL")
    secret_key: str = environ.get("SUPABASE_SECRET_KEY")
    supa_backend: supabase.Client = supabase.create_client(url, secret_key)

    try:
        supa_backend.storage.from_("avatar").upload(file=f, path=filename, file_options={"content-type": "image/png"})
    except supabase.StorageException as e:
        supa_backend.storage.from_("avatar").remove(filename)
        supa_backend.storage.from_("avatar").upload(file=f, path=filename, file_options={"content-type": "image/png"})
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
    FILENAME = f"{user_id}.png"
    # Decode the image
    image = b64decode(args['image_encoded'])

    # Write to temp file
    with open(FILENAME, "wb") as fh:
        fh.write(image)

    sb_client = supabase.create_client(url, key)
    sb_client.postgrest.auth(access_token)

    with open(FILENAME, 'rb') as f:
        upload(f, FILENAME)

    # Delete FILENAME
    remove(FILENAME)

    try:
        return {"statusCode": 200,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'Image uploaded successfully'
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
    from encoded_string import encoded_test_string
    parser = argparse.ArgumentParser()
    parser.add_argument("--user_id", help="User ID", required=True)
    parser.add_argument("--access_token", help="Access Token", required=True)
    parsed_args = parser.parse_args()
    args = vars(parsed_args)
    args['image_encoded'] = encoded_test_string
    # pass args to main()
    main(args)


