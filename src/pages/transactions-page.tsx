import { database } from "@/appwrite/appwrite";
import Sidebar from "@/components/sidebar/sidebar";
import { Transaction, columns, transactionSchema } from "@/components/transactions-table/columns";
import DataTable from "@/components/transactions-table/data-table";
import useTransactions from "@/hooks/use-transactions-hook";
import { useEffect, useState } from "react";


export default function TransactionsPage(){
    const [transaction, setTransaction] = useTransactions("transactions", [])

    useEffect(() =>{
        async function getData(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '663e36b50027d4a52e7a',
                []
            )

            const documentsList = documents.map((document) => transactionSchema.parse(document))
            setTransaction(documentsList)
        }
        getData()
    }, [])
    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <main className="flex flex-1 justify-center items-center">
                <DataTable columns={columns} data={transaction}/>
            </main>
        </div>
    )
}

