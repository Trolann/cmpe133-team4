import requests
from json import loads

def get_access_token():
    url = "https://sea-lion-app-s86sj.ondigitalocean.app/auth/signIn"
    payload = {
        "email": "newemail@binge.app",
        "password": "ExtraLongPassword"
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, json=payload, headers=headers)
    args = loads(response.text)
    return args["text"]["access_token"]

if __name__ == '__main__':
    print(get_access_token())
