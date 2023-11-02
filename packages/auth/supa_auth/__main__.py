import os
from dotenv import load_dotenv
from supabase import create_client, Client
from supabase_backend import setup_new_user_in_db
from attrs import define, field, asdict, validators
from datetime import datetime
from json import dumps as json_dumps

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
sb_client: Client = create_client(url, key)


def is_json_serializable(instance, attribute, value):
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

    def to_dict(self):
        d = asdict(self)
        d['last_sign_in_at'] = self.last_sign_in_at.isoformat()
        d['updated_at'] = self.updated_at.isoformat()
        return d

def new_user_by_email(email, password):
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
        auth_resp = new_user_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))
    except Exception as e:
        print(f"Error creating user: {e}")
        auth_resp = sign_in_by_email(email=os.getenv("UTILITY_ACCT"), password=os.getenv("UTILITY_PASS"))

    user, session = auth_resp
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

    #setup_new_user_in_db(session) # TODO: Trying to get this to work as called when signing up

    sb_client.auth.sign_out()
    # return a dict of the response

    return auth_object.to_dict()

    # return {"statusCode": 202,
    #         "body": {
    #             # Unpack BingeAuthResponse object
    #             "id": auth_object.id,
    #             "email": auth_object.email,
    #             "last_sign_in_at": datetime_serializer(auth_object.last_sign_in_at),
    #             "role": auth_object.role,
    #             "updated_at": datetime_serializer(auth_object.updated_at),
    #             "access_token": auth_object.access_token,
    #             "refresh_token": auth_object.refresh_token,
    #             "expires_at_epoch": auth_object.expires_at_epoch,
    #             "token_type": auth_object.token_type
    #             }
    #         }

if __name__ == "__main__":
    main()

