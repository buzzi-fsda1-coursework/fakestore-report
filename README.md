# Fake Store Report

Applicazione TypeScript che scarica i dati di [Fake Store API](https://fakestoreapi.com/) e produce due report in JSON: i 3 prodotti più venduti e i 3 clienti con la spesa più alta, sia per tutto lo storico sia per l'ultimo mese.

Costruita con Vite 8.3.5 (template `vanilla-ts`), senza altre dipendenze.

## Requisiti

- Node.js e npm (testato con Node v26.12.0)
- Connessione a internet, perché i dati vengono letti dall'API a ogni avvio

## Installazione

Dalla cartella del progetto:

```bash
npm install
```

## Avvio

```bash
npm run dev
```

Aprire nel browser l'URL indicato dal terminale: i due report compaiono nella pagina e nella console del browser (F12). In caso di errore, ad esempio se l'API non risponde, il messaggio viene mostrato nella pagina e in console.

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
