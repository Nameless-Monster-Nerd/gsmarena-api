// src/services/glossary.ts

import * as cheerio from 'cheerio';
import { getDataFromUrl } from './utils';

interface GlossaryTerm {
  id: string;
  name: string;
}

interface GlossarySection {
  letter: string;
  list: GlossaryTerm[];
}

interface GlossaryEntry {
  title: string;
  html: string | null;
}

export const get = async (): Promise<GlossarySection[]> => {
  const html = await getDataFromUrl('/glossary.php3');
  const $ = cheerio.load(html);
  const json: GlossarySection[] = [];

  const parentTerms = $('#body').find('.st-text');
  parentTerms.children().each((index, el) => {
    if (index % 2 === 0) {
      json.push({ letter: $(el).text(), list: [] });
    } else {
      const terms = $(el).find('a');
      terms.each((i, ele) => {
        const id = $(ele).attr('href')?.replace('glossary.php3?term=', '') ?? '';
        const name = $(ele).text();

        json[Math.floor(index / 2)].list.push({ id, name });
      });
    }
  });

  return json;
};

export const getTerm = async (term: string): Promise<GlossaryEntry> => {
  const html = await getDataFromUrl(`/glossary.php3?term=${encodeURIComponent(term)}`);
  const $ = cheerio.load(html);
  const body = $('#body');
  const title = body.find('.review-header .article-hgroup h1').text();
  const text = body.find('.st-text').first().html();

  return {
    title,
    html: text,
  };
};


get()