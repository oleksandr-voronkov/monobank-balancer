import { PersonalBalance, Transaction } from '@/types';
import { sub } from 'date-fns';

const DESCRIPTION_RESTRICTIONS = ['steam', 'epoch']

export const fetchPersonalBalance = async (): Promise<PersonalBalance> => {
  const response = await fetch("https://api.monobank.ua/personal/client-info", {
    next: { revalidate: 10 },
    headers: {
      'X-Token': process.env.MONOBANK_API_KEY
    }
  });

  return response.json();
}

export const fetchTransactions = async (accountId: string): Promise<Transaction[]> => {
  const from = sub(new Date(), { days: 31 }).getTime();

  const response = await fetch(`https://api.monobank.ua/personal/statement/${accountId}/${from}`, {
    next: { revalidate: 10 },
    headers: {
      'X-Token': process.env.MONOBANK_API_KEY
    }
  });

  const data = await response.json() as Transaction[];

  return data
    .filter(item =>
      !DESCRIPTION_RESTRICTIONS.some(r =>
        item.description.toLowerCase().includes(r)
      )
    )
    .map(item => ({
      ...item,
      time: item.time * 1000
    }))
    .sort((a, b) => b.time - a.time);
}