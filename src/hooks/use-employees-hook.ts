import { useEffect, useState } from "react";

export default function useEmployees(key: string, value: any){
    const [employees, setEmployees] = useState(() => {
        let currentValue;
        
        try {
            currentValue = JSON.parse(localStorage.getItem(key) || String(value))
        } catch (error) {
            currentValue = value
        }

        return currentValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(employees))
    }, [employees, setEmployees])

    return [employees, setEmployees]
}