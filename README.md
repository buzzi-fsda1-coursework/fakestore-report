# Fake Store Report

Applicazione TypeScript che scarica i dati di [Fake Store API](https://fakestoreapi.com/) e produce due report in JSON: i 3 prodotti più venduti e i 3 clienti con la spesa più alta, sia per tutto lo storico sia per l'ultimo mese.

I report si possono ottenere in due modi: nel browser (pagina e console) oppure come file JSON scritti da uno script Node.

Costruita con Vite 8.3.5 (template `vanilla-ts`). Unica dipendenza aggiunta: `@types/node`, solo per il controllo dei tipi dello script.

## Requisiti

- Node.js con supporto all'esecuzione diretta di TypeScript (22.18 / 23.6 o successivi) e npm. Testato con Node v26.12.0.
- Connessione a internet, perché i dati vengono letti dall'API a ogni avvio

## Installazione

Dalla cartella del progetto:

```bash
npm install
```

## Avvio

### Nel browser

```bash
npm run dev
```

Apri nel browser l'URL indicato dal terminale (di solito `http://localhost:5173`). I due report compaiono nella pagina e nella console del browser (F12). In caso di errore, ad esempio se l'API non risponde, il messaggio viene mostrato nella pagina e in console.

### Su file

```bash
npm run report
```

Scrive i due report in `reports/top-products.json` e `reports/top-customers.json`, sovrascrivendo quelli esistenti. In caso di errore stampa il messaggio nel terminale e termina con codice di uscita 1.

## Report di esempio

La cartella `reports/` contiene i due report generati con `npm run report`, per consultare l'output senza eseguire il programma. Sono un'istantanea: il campo `generatedAt` indica quando sono stati prodotti. Per aggiornarli basta rilanciare il comando.

## Regole adottate

**Ultimo mese.** Sono i 30 giorni (30 × 24 ore, calcolati in UTC) che terminano con la data dell'ordine più recente presente nei dati, estremi inclusi: con i dati attuali va dal 2020-02-01T00:00:00.000Z al 2020-03-02T00:00:00.000Z.

**Tie-break.**

- Prodotti: unità vendute decrescenti, poi fatturato decrescente, poi id prodotto crescente.
- Clienti: spesa totale decrescente, poi id utente crescente.

I confronti avvengono sui valori non arrotondati.

**Dati mancanti.**

- Prodotto presente in un carrello ma assente dal catalogo: la riga viene ignorata (non conta per unità, pezzi o spesa) e viene segnalata con un `console.warn`.
- Utente presente in un carrello ma assente dall'anagrafica: resta in classifica con `username`, `fullName` ed `email` a `null`.

**Arrotondamento.** Fatturato e spesa totale sono arrotondati a 2 decimali solo in output; tutti i calcoli e gli ordinamenti usano i valori pieni.

## Forma del JSON

I due report hanno la stessa struttura. Cambiano l'etichetta (`report`) e gli elementi della classifica.

```json
{
  "report": "top-products",
  "generatedAt": "...",
  "anchorDate": "2020-03-02T00:00:00.000Z",
  "allTime": {
    "range": null,
    "ranking": []
  },
  "lastMonth": {
    "range": {
      "start": "2020-02-01T00:00:00.000Z",
      "end": "2020-03-02T00:00:00.000Z"
    },
    "ranking": []
  }
}
```

- `report`: `"top-products"` oppure `"top-customers"`.
- `generatedAt`: momento di generazione del report.
- `anchorDate`: data dell'ordine più recente, usata come ancoraggio per l'ultimo mese.
- `range`: intervallo del periodo; `null` per l'all time.
- `ranking`: fino a 3 elementi.
  - Prodotti: `rank`, `productId`, `title`, `category`, `unitPrice`, `unitsSold`, `revenue`.
  - Clienti: `rank`, `userId`, `username`, `fullName`, `email`, `orderCount`, `itemsPurchased`, `totalSpent`.

