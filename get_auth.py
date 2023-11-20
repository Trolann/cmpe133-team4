import requests
url = "https://sea-lion-app-s86sj.ondigitalocean.app/auth/signIn"
payload = {
    "email": "newemail@binge.app",
    "password": "ExtraLongPassword"
}
headers = {
    "Content-Type": "application/json"
}
if __name__ == '__main__':
    response = requests.get(url, json=payload, headers=headers)
    print(response.text)
