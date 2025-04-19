import { load } from 'cheerio';
import { getDataFromUrl } from './utils';

interface SearchResult {
  id: string;
  name: string;
  img?: string;
  description?: string;
}

export const search = async (searchValue: string): Promise<SearchResult[]> => {
  const html = await getDataFromUrl(`/results.php3?sQuickSearch=yes&sName=${encodeURIComponent(searchValue)}`);
  const $ = load(html);
  const json: SearchResult[] = [];

  const devices = $('.makers').find('li');
  devices.each((i, el) => {
    const imgBlock = $(el).find('img');
    const id = $(el).find('a').attr('href')?.replace('.php', '') ?? '';
    const name = $(el).find('span').html()?.split('<br>').join(' ') ?? '';
    const img = imgBlock.attr('src');
    const description = imgBlock.attr('title');

    json.push({ id, name, img, description });
  });

  return json;
};

// Run it (optional for testing)
// search('apple').then(console.log).catch(console.error);
