import requests
from get_auth import get_access_token
url = "https://sea-lion-app-s86sj.ondigitalocean.app/session/newSession"
payload = {
    'lat': 37.334665328,
    'long': -121.875329832,
    'filter_distance': 10000,
    'user_id': '71f87b7c-55bf-488d-a562-7cd8e120495d',
    "access_token": get_access_token()
}
headers = {
    "Content-Type": "application/json"
}

if __name__ == '__main__':
    response = requests.get(url, json=payload, headers=headers)
    print(response.text)