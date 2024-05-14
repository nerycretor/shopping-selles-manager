import { database } from "@/appwrite/appwrite"
import Sidebar from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import OpenDialogButtonForStock from "@/components/ui/open-dialog-button"
import { ProductType, productSchema } from "@/components/ui/open-dialog-button"
import useProducts from "@/hooks/use-products-hook"
import { useEffect, useState } from "react"

export default function StockPage(){
    
    const [product, setProduct] = useProducts("products", [])

    useEffect(() => {
        async function getProducts(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '663fada3003b4cfa0168',
                []
            )

            const products = documents.map((product) => productSchema.parse(product))

            setProduct(products)


        }
        getProducts()
    },[])

    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <main className="p-8 flex flex-col gap-10">
                <div className="flex gap-4">
                    <h1 className="font-bold text-3xl text-gray-800">Produtos Em Stock</h1>
                    <OpenDialogButtonForStock title="Cadastrar Produto"/>
                </div>
                
                <div className="flex flex-wrap gap-5">
                    { product ? product.map((product: ProductType) => (<ProductCard product={product.productName} unityQuantity={product.productUnityNumber}/>)) : (<span>No data</span>)}
                </div>
            </main>
        </div>
    )
}

interface ProductCardProps {
    product: string
    unityQuantity: number
}

function ProductCard({product,unityQuantity}: ProductCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{product}</CardTitle>
                <CardDescription>Numero de Unidades Disponiveis:</CardDescription>
            </CardHeader>
            <CardContent>
                <h1 className="font-bold text-2xl">{unityQuantity} Unidades</h1>
            </CardContent>
            <CardFooter>
                <Button>Encomendar</Button>
            </CardFooter>
        </Card>
    )
}