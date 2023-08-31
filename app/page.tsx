import { fetchPersonalBalance, fetchTransactions } from '@/lib/api';
import { CardType } from '@/common/enums';
import { format } from 'date-fns';
import clsx from 'clsx';

export default async function Home() {
  const balance = await fetchPersonalBalance();

  if (!balance || !balance.accounts) {
    return <div>Please, try again later</div>
  }

  const account = balance.accounts.find((account) => account.type === CardType.Platinum);

  if (!account) {
    return <div>Please, try again later</div>
  }

  const transactions = await fetchTransactions(account.id);

  return (
    <main className="flex h-screen flex-col items-center justify-between bg-gradient-to-r from-5% from-[#8987FF] to-100% to-[#ED9BD6]">
      <div className="p-4 w-full">
        <div className="h-[170px] w-full bg-[#000117D9] rounded-xl py-2 px-4">
          <p className="text-white font-bold">monobank</p>

          <p className="text-white text-xl font-extrabold mt-4">
            {account.balance / 100} UAH
          </p>

          <p className="text-sm text-gray-400 mt-8">
            {account.maskedPan[0]}
          </p>

          <p className="text-sm text-gray-400">
            {balance.name}
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl w-full p-4 overflow-auto">
        {transactions?.map(transaction => (
          <div key={transaction.id} className="mb-4">
            <p className={clsx("text-sm font-bold", {
              "text-green-500": transaction.amount > 0,
              "text-red-500": transaction.amount < 0,
            })}>{transaction.amount / 100} UAH</p>

            <p className="text-xs text-gray-500">{transaction.description}</p>

            <p className="text-xs text-gray-500">{format(transaction.time, "dd.MM.yyyy HH:mm:ss")}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
