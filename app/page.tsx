import Image from 'next/image'

interface Balance {
  accounts: {
    type: string;
    balance: number;
  }[];
}

const fetchPersonalBalance = async (): Promise<Balance> => {
  try {
    const response = await fetch("https://api.monobank.ua/personal/client-info", {
      headers: {
        'X-Token': process.env.MONOBANK_API_KEY
      }
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);

    return {} as Balance;
  }
}

export default async function Home() {
  const data = await fetchPersonalBalance();

  const platinumCard = data.accounts.find(account => account.type === "platinum");

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h2 className="text-lg text-white">
        {(platinumCard?.balance ?? 0) / 100} UAH
      </h2>
    </main>
  )
}
