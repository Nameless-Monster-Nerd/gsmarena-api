import { load } from 'cheerio';
import { getDataFromUrl } from './utils';

interface RankElement {
  position: number;
  id: string;
  name: string;
  dailyHits?: number;
  favorites?: number;
}

interface CategoryData {
  category: string;
  list: RankElement[];
}

export const get = async (): Promise<CategoryData[]> => {
  const html = await getDataFromUrl('/deals.php3');
  const $ = load(html);
  const json: CategoryData[] = [];

  const categories = $('.sidebar.col.left').find('.module.module-rankings.s3');
  categories.each((i, el) => {
    const category = $(el).find('h4').text();
    const positions = $(el).find('tr');

    const ranks: RankElement[] = [];

    positions.each((ind, ele) => {
      const position = $('td[headers=th3a]', ele).text().replace('.', '');
      if (position) {
        const name = $('nobr', ele).text();
        const id = $('a', ele).attr('href')?.replace('.php', '') ?? '';
        const index = parseInt($('td[headers=th3c]', ele).text().replace(',', ''), 10);

        const element: RankElement = {
          position: parseInt(position, 10),
          id,
          name,
        };

        if (ind === 0) {
          element.dailyHits = index;
        } else {
          element.favorites = index;
        }

        ranks.push(element);
      }
    });

    json.push({
      category,
      list: ranks,
    });
  });

  return json;
};

// get().then(e => console.log(e))
