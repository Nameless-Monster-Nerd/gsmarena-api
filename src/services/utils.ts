// src/utils/gsmUtils.ts (or wherever you want to place it)

import axios from 'axios';

export const getDataFromUrl = async (url: string): Promise<string> => {
  const response = await axios.get(`https://www.gsmarena.com${url}`);
  return response.data;
};

export const getPrice = (text: string): { currency: string; price: number } => {
  const value = text.replace(',', '').split(' ');
  return {
    currency: value[0],
    price: parseFloat(value[1]),
  };
};
