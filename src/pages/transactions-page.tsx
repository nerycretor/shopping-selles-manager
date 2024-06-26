import { database } from "@/appwrite/appwrite";
import Sidebar from "@/components/sidebar/sidebar";
import { Transaction, columns, transactionSchema } from "@/components/transactions-table/columns";
import DataTable from "@/components/transactions-table/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useTransactions from "@/hooks/use-transactions-hook";
import { useEffect, useState } from "react";


export default function TransactionsPage(){
    const [transaction, setTransaction] = useTransactions("transactions", [])
    const [gains, setGains] = useState("")
    const [defice, setDefice] = useState("")

    useEffect(() =>{
        async function getData(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '667bdf75001afd808e21',
                []
            )

            const documentsList = documents.map((document) => transactionSchema.parse(document))

            const productsToSearchFor = documentsList.filter((document) => document.type == "Venda")
            const productPriceFromArray = productsToSearchFor.map((product) => product.price)

            const productsToCalculatedefice = documentsList.filter((document) => document.type == "Compra")
            const pricesfromCalculateDefice = productsToCalculatedefice.map((product) => product.price)

            if(productsToSearchFor.length > 1){
                setGains(productPriceFromArray.reduce((accumulator, current) => accumulator + current))
            }else{
                setGains(productsToSearchFor[0].price.toString())
            }

            if(productsToCalculatedefice.length > 1){
                setDefice(pricesfromCalculateDefice.reduce((accumulator, current) => accumulator + current))
            }else{
                setDefice(pricesfromCalculateDefice.toString())
            }
            console.log(productsToSearchFor)
            setTransaction(documentsList)
        }
        getData()
    }, [])
    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <main className="flex flex-col gap-5 flex-1 p-5">
                <div className="flex gap-3 h-[120px] ml-[173px]">
                    <Card>
                        <CardHeader>
                            <CardTitle>Arrecadado</CardTitle>
                        </CardHeader>
                        <CardContent className="w-[180px] h-[100px]">
                             {gains}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Gasto</CardTitle>
                        </CardHeader>
                        <CardContent className="w-[180px] h-[100px]">
                            {defice}
                        </CardContent>
                    </Card>
                </div>
                <div className="flex justify-center items-center scroll-auto">
                    <DataTable columns={columns} data={transaction}/>
                </div>
                    
            </main>
        </div>
    )
}

