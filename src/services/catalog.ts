// src/services/brands.ts

import * as  cheerio from 'cheerio';
import { getDataFromUrl } from './utils';

interface Brand {
  id: string;
  name: string;
  devices: number;
}

interface Device {
  id: string;
  name: string;
  img?: string;
  description?: string;
}

interface Spec {
  name: string;
  value: string;
}

interface SpecCategory {
  category: string;
  specifications: Spec[];
}

interface DeviceDetails {
  name: string;
  img?: string;
  detailSpec: SpecCategory[];
  quickSpec: Spec[];
}

export const getBrands = async (): Promise<Brand[]> => {
  const html = await getDataFromUrl('/makers.php3');
  const $ = cheerio.load(html);
  const json: Brand[] = [];

  const brands = $('table').find('td');

  brands.each((_, el) => {
    const aBlock = $(el).find('a');
    json.push({
      id: aBlock.attr('href')?.replace('.php', '') || '',
      name: aBlock.text().replace(' devices', '').replace(/[0-9]/g, '').trim(),
      devices: parseInt($(el).find('span').text().replace(' devices', ''), 10),
    });
  });

  return json;
};

const getNextPage = ($: cheerio.CheerioAPI): string | false => {
  const nextPage = $('a.prevnextbutton[title="Next page"]').attr('href');
  return nextPage ? nextPage.replace('.php', '') : false;
};

const getDevices = ($: cheerio.CheerioAPI, devicesList:any): Device[] => {
  const devices: Device[] = [];

  devicesList.each((_, el) => {
    const imgBlock = $(el).find('img');
    devices.push({
      id: $(el).find('a').attr('href')?.replace('.php', '') || '',
      name: $(el).find('span').text(),
      img: imgBlock.attr('src'),
      description: imgBlock.attr('title'),
    });
  });

  return devices;
};

export const getBrand = async (brand: string): Promise<Device[]> => {
  let html = await getDataFromUrl(`/${brand}.php`);
  let $ = cheerio.load(html);
  let json: Device[] = [];

  let devices = getDevices($, $('.makers').find('li'));
  json = [...json, ...devices];

  while (getNextPage($)) {
    html = await getDataFromUrl(`/${getNextPage($)}.php`);
    $ = cheerio.load(html);
    devices = getDevices($, $('.makers').find('li'));
    json = [...json, ...devices];
  }

  return json;
};

export const getDevice = async (device: string): Promise<DeviceDetails> => {
  const html = await getDataFromUrl(`/${device}.php`);
  const $ = cheerio.load(html);

  const quickSpec: Spec[] = [
    { name: 'Display size', value: $('span[data-spec=displaysize-hl]').text() },
    { name: 'Display resolution', value: $('div[data-spec=displayres-hl]').text() },
    { name: 'Camera pixels', value: $('.accent-camera').text() },
    { name: 'Video pixels', value: $('div[data-spec=videopixels-hl]').text() },
    { name: 'RAM size', value: $('.accent-expansion').text() },
    { name: 'Chipset', value: $('div[data-spec=chipset-hl]').text() },
    { name: 'Battery size', value: $('.accent-battery').text() },
    { name: 'Battery type', value: $('div[data-spec=battype-hl]').text() },
  ];

  const name = $('.specs-phone-name-title').text();
  const img = $('.specs-photo-main a img').attr('src');

  const detailSpec: SpecCategory[] = [];

  $('table').each((_, el) => {
    const category = $(el).find('th').text();
    const specN = $(el).find('tr');

    const specList: Spec[] = [];
    specN.each((_, ele) => {
      specList.push({
        name: $('td.ttl', ele).text(),
        value: $('td.nfo', ele).text(),
      });
    });

    if (category) {
      detailSpec.push({
        category,
        specifications: specList,
      });
    }
  });

  return {
    name,
    img,
    detailSpec,
    quickSpec,
  };
};
