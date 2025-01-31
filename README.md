Floh 2
======

## Getting started

```
  conmposer install
  npm install
  
  symfony serve
  npm run dev-server 
```

## External sources (i.e. Barcode scanner)

* example script to send data to the server can be found in folder: `resources/send-transaction-to-server.py`.

## Todos

* Stories für Komponenten nachrüsten
* Frontend absichern: Wenn eine neue Transaktion gesichert wird und während des Requests ein Fehler auftritt,
  kann es passieren, dass die Transaktion gesichert wurde, das FE aber einen Fehler erhält. In diesem Fall würde
  ein erneutes Speichern zu einem Duplikat in der DB führen.
* Umbau zur Webapp, so dass FE unabh. von Internetverbindung ist
