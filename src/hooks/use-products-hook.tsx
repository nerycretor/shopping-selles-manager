import { useEffect, useState } from "react";

export default function useProducts(key: string, value: any){
    const [product, setProduct] = useState(() => {
        let currentValue;

        try {
            currentValue = JSON.parse(localStorage.getItem(key) || String(value))
        } catch (error) {
            currentValue = value
        }

        return currentValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(product))
    }, [product, setProduct])

    return [product, setProduct]
}