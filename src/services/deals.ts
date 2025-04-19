// src/services/deals.ts

import * as cheerio from 'cheerio';
import { getDataFromUrl, getPrice } from './utils';

interface DealInfo {
  memory: string;
  storeImg: string | undefined;
  price: number;
  currency: string;
  discount: number;
}

interface HistoryEntry {
  time: string;
  price?: number;
  currency?: string;
}

interface DealDevice {
  id: string;
  img: string | undefined;
  url: string | undefined;
  name: string;
  description: string;
  deal: DealInfo;
  history: HistoryEntry[];
}

export const getDeals = async (): Promise<DealDevice[]> => {
  const html = await getDataFromUrl('/deals.php3');
  const $ = cheerio.load(html);
  const json: DealDevice[] = [];

  const devices = $('#body').find('.pricecut');

  devices.each((i, el) => {
    const img = $(el).find('.row a img').attr('src');
    const url = $(el).find('.row a.image').attr('href');
    const name = $(el).find('.row .phone div h3').text();
    const id = $(el).find('.row .phone div a').attr('href')?.replace('.php', '') || '';
    const description = $(el).find('.row .phone p a').text();

    const price = getPrice($(el).find('.row .phone .deal a.price').text());

    const deal: DealInfo = {
      memory: $(el).find('.row .phone .deal a.memory').text(),
      storeImg: $(el).find('.row .phone .deal a.store img').attr('src'),
      price: price.price,
      currency: price.currency,
      discount: parseFloat($(el).find('.row .phone .deal a.discount').text()),
    };

    const device: DealDevice = {
      id,
      img,
      url,
      name,
      description,
      deal,
      history: [],
    };

    const historyList = $(el).find('.history .stats');

    historyList.children().each((index, elem) => {
      if (index % 2 === 0) {
        device.history.push({ time: $(elem).text() });
      } else {
        const historyPrice = getPrice($(elem).text());
        const entry = device.history[Math.floor(index / 2)];
        entry.price = historyPrice.price;
        entry.currency = historyPrice.currency;
      }
    });

    json.push(device);
  });

  return json;
};
