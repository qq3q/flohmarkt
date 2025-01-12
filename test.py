import requests

"""
 Python-Skript, um Verkäufernummer und Betrag mit Python an den Server zu senden. Bei jedem
 Sendevorgang werden Verkäufernummer, Betrag und ein Token versendet. Das Token wird
 zur Identifikation der Kasse verwendet, so dass mehrere Kassen / Scanner-Paare verwendet
 werden können (Jede Kasse erhält ihr eigenes Token).
 Wenn der Sendevorgang klappt, wird der Statuscode 201 zurückgegeben.

 Zum Testen können im Browser über folgende URL alle gesendeten Verkäufernummer/Betäge abgerufen werden:

 https://floh2.qq5q.de/queued-units/test_device_token
"""

# <Settings
host = "https://floh2.qq5q.de"
endpoint = "/queued-unit"
token =  "test_device_token"
# Settings>

url = f"{host}{endpoint}"
payload = {
    "token": token,
    "sellerId": 1,
    "amount": 5.2
}
headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
print(response.status_code)
print(response.text)