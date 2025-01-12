Todo V1
=======

* Abbrechen des Unit-Bearbeitungsformulars

Zukünftige Features
===================

* Frontend absichern: Wenn eine neue Transaktion gesichert wird und während des Requests ein Fehler auftritt,
  kann es passieren, dass die Transaktion gesichert wurde, das FE aber einen Fehler erhält. In diesem Fall würde
  ein erneutes Speichern zu einem Duplikat in der DB führen.
* Umbau zur Webapp, so dass FE unabh. von Internetverbindung ist

TMP
===

Features

* Nutzer mit Anmeldung
* Anlegen von mehreren Events (Flohmärkten)
* Verkäufer bearbeiten
* Transaktionsliste: bearbeiten, löschen, editieren
  * Transaktion bearbeiten / neu
    * Paypal / Kasse
    * Verkäufernummer + Betrag eingeben
    * speichern
* Verkäuferlist: read only
* Scanning
  * Jeder Scan bezieht sich auf einen Nutzer 
  * es kann nur eingescannt werden, wenn Nutzer Transaktion bearbeitet 


curl -X POST --location "http://localhost:8000/login" \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-d '{
"username": "floh",
"password": "qwertz"
}'

curl -X PUT --location "http://localhost:8000/queued-unit" \
-H "Accept: application/json" \
-H "Authorization: Bearer 72a79e7511bdfc965ee2a6fd731938b2" \
-H "Content-Type: application/json" \
-d '{
"userId": 1,
"sellerId": 1,
"amount": 5.2
}'