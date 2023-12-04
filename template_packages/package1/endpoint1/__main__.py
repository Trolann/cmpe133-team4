# __main.py__ template for Digitalocean serverless functions
from dotenv import load_dotenv
from os import environ
load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)



# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args: list = None) -> dict:
    # Get environment variables. Ensure they are added in DO console.
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")

    return {"statusCode": 200,  # Status code not required by DO, required by convention.
            "body": {  # Required key
                'text': 'response'
                }
            }

# If doing any local testing, include this.
if __name__ == "__main__":
    main()

