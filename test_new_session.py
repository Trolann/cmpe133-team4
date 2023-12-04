import requests
from get_auth import get_access_token
url = "https://sea-lion-app-s86sj.ondigitalocean.app/session/getSessionInfo"
args = {
    'user_id': '71f87b7c-55bf-488d-a562-7cd8e120495d',
    "access_token": get_access_token(),
    "session_id": "88"
}
headers = {
    "Content-Type": "application/json"
}

if __name__ == '__main__':
    response = requests.get(url, json=args, headers=headers)
    print(response.text)