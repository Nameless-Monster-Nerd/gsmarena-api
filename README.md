
# gsm API (gsm.com)

gsm phone specification and finder. This project is still in early development.

The API basically reads from the GSM website and returns JSON data.

## Table of Contents

* [Implemented Features](#implemented-features)
* [Installation](#installation)
* [Usage](#usage)
* [Contact](#contact)
* [License](#license)

## Implemented Features

- [x] Get all brands
- [x] Get devices by brand
- [x] Get device specification
- [x] Find devices by keyword
- [x] Top of devices
- [x] Hot deals
- [x] Glossary
- [x] Glossary detail
- [ ] Find devices by advanced filters
- [ ] News
- [ ] Reviews

## Installation

```bash
npm i gsm-nameless
```

## Usage

### Import

```ts
import * as gsm from 'gsm-nameless';
```

### Brand list

```ts
const brands = await gsm.catalog.getBrands();
console.log(brands);
```

```json
[
  {
    "id": "apple-phones-48",
    "name": "Apple",
    "devices": 98
  }
]
```

### Device list by brand

```ts
const devices = await gsm.catalog.getBrand('apple-phones-48');
console.log(devices);
```

```json
[
  {
    "id": "apple_iphone_13_pro_max-11089",
    "name": "iPhone 13 Pro Max",
    "img": "https://fdn2.gsm.com/vv/bigpic/apple-iphone-13-pro-max.jpg",
    "description": "Apple iPhone 13 Pro Max smartphone. Announced Sep 2021..."
  }
]
```

### Device detail

```ts
const device = await gsm.catalog.getDevice('apple_iphone_13_pro_max-11089');
console.log(device);
```

```json
{
  "name": "Apple iPhone 13 Pro Max",
  "img": "https://fdn2.gsm.com/vv/bigpic/apple-iphone-13-pro-max.jpg",
  "quickSpec": [
    {
      "name": "Display size",
      "value": "6.7\""
    }
  ],
  "detailSpec": [
    {
      "category": "Network",
      "specifications": [
        {
          "name": "Technology",
          "value": "GSM / CDMA / HSPA / EVDO / LTE / 5G"
        }
      ]
    }
  ]
}
```

### Searching for device

```ts
const devices = await gsm.search.search('casio');
console.log(devices);
```

```json
[
  {
    "id": "casio_g_zone_ca_201l-5384",
    "name": "Casio G'zOne CA-201L",
    "img": "https://fdn2.gsm.com/vv/bigpic/casio-gzone-ca-201l.jpg",
    "description": "Casio G'zOne CA-201L Android smartphone. Announced Mar 2013..."
  }
]
```

### Top

```ts
const top = await gsm.top.get();
console.log(top);
```

```json
[
  {
    "category": "Top 10 by daily interest",
    "list": [
      {
        "position": 1,
        "id": "xiaomi_12-11285",
        "name": "Xiaomi 12",
        "dailyHits": 50330
      }
    ]
  }
]
```

### Deals

```ts
const deals = await gsm.deals.getDeals();
console.log(deals);
```

```json
[
  {
    "id": "oneplus_9-10747",
    "img": "https://m.media-amazon.com/images/I/31ICm7rK-hS._SL500_.jpg",
    "url": "https://www.amazon.co.uk/dp/B08V1NKHZF?tag=gsmcom-21&linkCode=osi&th=1&psc=1",
    "name": "OnePlus 9",
    "description": "OnePlus 9 5G (UK) SIM-Free Smartphone with Hasselblad Camera for Mobile - Arctic Sky...",
    "deal": {
      "memory": "128GB 8GB RAM",
      "storeImg": "https://fdn.gsm.com/imgroot/static/stores/amazon-uk1.png",
      "price": 449.00,
      "currency": "£",
      "discount": 24.6
    },
    "history": [
      {
        "time": "Previous",
        "price": 479.00,
        "currency": "£"
      }
    ]
  }
]
```

### Glossary

```ts
const glossary = await gsm.glossary.get();
console.log(glossary);
```

```json
[
  {
    "letter": "X",
    "list": [
      {
        "id": "xenon-flash",
        "name": "Xenon flash"
      }
    ]
  }
]
```

### Glossary detail

```ts
const term = await gsm.glossary.getTerm('xenon-flash');
console.log(term);
```

```json
{
  "title": "Xenon flash - definition",
  "html": "<p>A xenon flash produces an extremely intense full-spectrum white...</p>"
}
```

## Contact

Created by [@nordmarin](https://t.me/nordmarin) - feel free to contact me!

## License

gsm API is MIT licensed.

