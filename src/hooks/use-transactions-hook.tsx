import { useEffect, useState } from "react";

export default function useTransactions(key: string, value: any){
    const [ transaction, settransaction ] = useState(()=> {
        let currentValue;

        try {
            currentValue = JSON.parse(
                localStorage.getItem(key) || String(value)
            )
        } catch (error) {
            currentValue = value
        }

        return currentValue
    })

    useEffect(() =>{
        localStorage.setItem(key, JSON.stringify(transaction))
    }, [transaction, settransaction])

    return [transaction, settransaction]
}