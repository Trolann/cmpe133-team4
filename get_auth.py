import requests
from json import loads

def get_access_token():
    url = "https://sea-lion-app-s86sj.ondigitalocean.app/auth/signIn"
    payload = {
        #"email": "newemail@binge.app",
        #"password": "ExtraLongPassword"
        #"email": "jaimeelepano2357@gmail.com",
        "email": "trevor2@binge.app",
        #"password": "Testpassword"
        "password": "Extralongpassword"
    }
    headers = {
        "Content-Type": "application/json"
    }
    response = requests.get(url, json=payload, headers=headers)
    args = loads(response.text)
    while(1):
        try:
            print(args['text']['id'])
            return args['text']['access_token']
        except:
            print(f'Error in get_access_token(): {args}')
            continue
    #return response.text

if __name__ == '__main__':
    print(get_access_token())
