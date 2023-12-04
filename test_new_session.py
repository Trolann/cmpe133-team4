import requests
from dotenv import load_dotenv
from os import environ

load_dotenv()

#url = "https://sea-lion-app-s86sj.ondigitalocean.app/session/getSessionInfo"
#url = "https://faas-sfo3-7872a1dd.doserverless.co/api/v1/web/fn-08e1e9bb-6c28-49dc-ab50-0b63fac3c390/auth/log"
url = "https://sea-lion-app-s86sj.ondigitalocean.app/auth/log"
args = {
    'access_token': environ.get("SUPABASE_KEY"),
    'function_name': 'test_function',
    #'given_args': {'arg1': 'value1', 'arg2': 'value2'},
    'message': 'App URL',
    'level': 'INFO'
}
headers = {
    "Content-Type": "application/json"
}

if __name__ == '__main__':
    response = requests.get(url, json=args, headers=headers)
    print(response.text)