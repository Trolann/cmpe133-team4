from dotenv import load_dotenv
from os import environ
import supabase
import json

load_dotenv()  # Load environment variables

# Main function for the serverless logging
def main(args: list = None) -> dict:
    # Get environment variables. Ensure they are added in the DigitalOcean console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_SECRET_KEY")
    token: str = environ.get("SUPABASE_KEY")

    # Initialize Supabase client
    supa_backend = supabase.create_client(url, key)

    # Extracting information from args
    access_token = args.get('access_token')
    if access_token != token:
        return {
            "statusCode": 401,
            "body": {
                'text': 'Unauthorized: Please provide a valid access token.'
            }
        }
    function_name = args.get('function_name')
    given_args = args.get('given_args', 'No args given')
    message = args.get('message')
    level = args.get('level', 'INFO')  # Default level is INFO if not provided

    # Insert log entry into the database
    log_entry = {
        'function_name': function_name,
        'given_args': json.dumps(given_args),
        'message': message,
        'level': level
    }
    inserted_log = supa_backend.table("logs").insert(log_entry).execute()

    # Extracting the ID of the inserted log entry
    log_id = inserted_log.data[0]['id'] if inserted_log.data else None

    return {
        "statusCode": 200,
        "body": {
            'text': 'Log entry created',
            'log_id': log_id
        }
    }

if __name__ == "__main__":
    from get_auth import get_access_token
    args = {
        'access_token': environ.get("SUPABASE_KEY"),
        'function_name': 'test_function',
        'given_args': {'arg1': 'value1', 'arg2': 'value2'},
        'message': 'Test log message',
        'level': 'DEBUG'
    }
    print(main(args))
