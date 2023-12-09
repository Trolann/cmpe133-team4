# __main.py__ template for Digitalocean serverless functions
from os import environ
from dotenv import load_dotenv
from supabase import create_client, Client
from attrs import define, field, asdict, validators
from datetime import datetime
from json import dumps as json_dumps
from binge_log import Logger
from logging import Logger as Log
log = Log('signIn', level='DEBUG')

load_dotenv()  # .env file for local use, not remote testing (production env's in DO console)


def is_json_serializable(instance, attribute, value):
    log.debug(f'Checking if {attribute.name} is JSON serializable')
    try:
        json_dumps(value)
    except TypeError:
        raise TypeError(f"{attribute.name} must be JSON serializable")

@define
class BingeAuthResponse:
    id = field(type=str, validator=validators.instance_of(str))
    email = field(type=str, validator=validators.instance_of(str))
    last_sign_in_at = field(type=datetime, validator=validators.instance_of(datetime))
    role = field(type=str, validator=validators.instance_of(str))
    updated_at = field(type=datetime, validator=validators.instance_of(datetime))
    access_token = field(type=str, validator=validators.instance_of(str))
    refresh_token = field(type=str, validator=validators.instance_of(str))
    token_type = field(type=str, validator=validators.instance_of(str))
    expires_at_epoch = field(type=float, validator=validators.instance_of(float), converter=float)
    # data dict field with a validator to make sure it's json serializable
    data = field(type=dict, validator=is_json_serializable, converter=dict)
    response_code = field(type=int, validator=validators.instance_of(int), default=200)


    def to_dict(self):
        d = asdict(self)
        d['last_sign_in_at'] = self.last_sign_in_at.isoformat()
        d['updated_at'] = self.updated_at.isoformat()
        d['status_code'] = 200
        log.debug(f'Converted to dict: {d}')
        return d

# must have main() function with args: list = None.
# Must return a JSON serializable object (dict, json.dumps, etc)
# Additional functions can be added/imported, but must be called from main()
def main(args) -> dict:
    logger = Logger('signIn')
    log.info(f'Starting with args: {args}')
    url: str = environ.get("SUPABASE_URL")
    key: str = environ.get("SUPABASE_KEY")
    sb_client: Client = create_client(url, key)
    log.debug(f'Supabase client created with url: {url}', given_args=str(sb_client))
    logger.debug(f'Supabase client created with url: {url}', given_args=str(sb_client))
    email = args.get('email', "No email provided")
    log.debug('Extracted args successfully')

    try:
        logger.debug(f"Attempting to sign in with email: {email}")
        log.debug(f'Attempting to sign in with email: {email}')
        response = sb_client.auth.sign_in_with_password({"email": args["email"], "password": args["password"]})
        logger.debug(f"Sign in response: {response}")
        log.debug(f'Sign in response: {response}')
        sb_client.postgrest.auth(response.session.access_token)
        logger.info(f"Authenticated for user {email}")
        log.info(f'Authenticated for user {email}')
    except Exception as e:
        logger.error(f"Error signing in user {email}: {e}")
        log.error(f'Error signing in user {email}: {e}')
        return {"statusCode": 400,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'Unable to sign in.'
                    }
                }

    try:
        log.debug(f'Attempting to get user and session info for user {email}')
        user, session = response
        user = user[1]
        session = session[1]

        auth_object = BingeAuthResponse(
            id=user.id,
            email=user.email,
            last_sign_in_at=user.last_sign_in_at,
            role=user.role,
            updated_at=user.updated_at,
            access_token=session.access_token,
            refresh_token=session.refresh_token,
            expires_at_epoch=session.expires_at,
            token_type=session.token_type,
            data=sb_client.table("user_settings").select("*").execute().model_dump()["data"][0]
        )
        logger.info(f'Returning 200 for user {email}')
        return {"statusCode": 200,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': auth_object.to_dict()
                    }
                }
    except Exception as e:
        logger.error(f"Error signing in user {email}: {e}")
        return {"statusCode": 400,  # Status code not required by DO, required by convention.
                "body": {  # Required key
                    'text': 'Unable to sign in.'
                    }
                }

# If doing any local testing, include this.
if __name__ == "__main__":
    main()

