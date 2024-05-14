import { useEffect, useState } from "react";

export default function useProviders(key: string, value: any){
    const [provider, setProvider] = useState(() =>{
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
        localStorage.setItem(key, JSON.stringify(provider))
    }, [provider, setProvider])

    return [provider, setProvider]
}