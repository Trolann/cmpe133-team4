import os
from dotenv import load_dotenv
from supabase import create_client, Client

first_settings = {
    "nickname": None,
    "language": "en",
    "vegan": False,
    "active_sessions": [],
    "restaurants": []
}

load_dotenv()
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SECRET_KEY")
supa_backend: Client = create_client(url, key)

def setup_new_user_in_db(session):
    try:
        return supa_backend.table("user_settings").insert({
            "id": session.user.id,
            "settings": first_settings}).execute()
    except Exception as e:
        print(f'todo: handle other errors: {e}')
        return