import { account, database } from "@/appwrite/appwrite";
import Sidebar from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductType, productResponseSchema } from "@/components/ui/open-dialog-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { SpokeSpinner } from "@/components/ui/spinner";
import useProducts from "@/hooks/use-products-hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID, Query } from "appwrite";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";





export default function Homepage(){
    const [dataToBill, setDataToBill] = useState({})
    const [userName, setUserName] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [productPrice, setProductPrice] = useState("")

    const formSchema = z.object({
        id: z.string().optional(),
        product: z.string().min(4).max(50),
        clientName: z.string().min(4).max(50),
        quantity: z.coerce.number().min(1),
        price: z.coerce.number(),
        transactionType: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            product: "",
            clientName: "",
            quantity: 0,
            price: 0,
            transactionType: "Venda"
        }
    })

    async function updateProductQuantity(productName: string, productUnityToSell: any){
        const { documents } = await database.listDocuments(
            '6634de7500138831be5c',
            '667be166000c6e985adb',
            [
                Query.equal("productName",[`${productName}`])
            ]
        )
    
        const productToUpdate = documents.map((product) => productResponseSchema.parse(product))
        const unityNumberToUpdate = productToUpdate[0].productUnityNumber - Number(productUnityToSell)
        
        await database.updateDocument(
            '6634de7500138831be5c',
            '667be166000c6e985adb',
            productToUpdate[0].$id,
            {productUnityNumber: unityNumberToUpdate}
        )
    }

    async function onSubmit(values: z.infer<typeof formSchema>){
        setIsLoading(true)
        const data = {
            type: values.transactionType,
            productName: values.product,
            owner: "BCODER SHOPP",
            receiver: values.clientName,
            price: values.quantity * Number(productPrice),
            quantity: values.quantity
        }
        setDataToBill(data)

        await database.createDocument(
            '6634de7500138831be5c',
            '667bdf75001afd808e21',
            ID.unique(),
            data
        )

        updateProductQuantity(values.product, values.quantity)
        setIsLoading(false)
        toast.success("Produto Vendido com Sucesso!")
    }

    async function handleSetProductPrice(productName: string){
        let productSelected = ""

        if(productName == ""){
            return
        }else if(productName != "" && productName != productSelected) {
            productSelected = productName
            const {documents} = await database.listDocuments(
                '6634de7500138831be5c',
                '667be166000c6e985adb',
                [
                    Query.equal('productName', productName)
                ]
            )
            const productToTakePrice = documents.map((product) => productResponseSchema.parse(product))
            setProductPrice(productToTakePrice[0].productPrice.toString())
        }else{
           return
        }
    }

    useEffect(() => {
        async function getUserName(){
            const user = await account.get()
            const userNameCompost = user.email.split("@")
            const userName = userNameCompost[0]
            setUserName(userName)
        }
        getUserName()
    },[])

    const [productsInStock] = useProducts("products", [])
    
    return (
        <div className="flex flex-1 w-screen h-screen">
            <Sidebar />
            <main className="flex flex-1 items-center justify-center">
                <Card>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <FormField 
                                    control={form.control}
                                    name="product"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormLabel>Produto</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    onOpenChange={() => handleSetProductPrice(field.value)}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Produto"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        { productsInStock ? productsInStock
                                                            .filter((product:ProductType) => product.productUnityNumber > 5)
                                                            .map((product: ProductType) => (<SelectItem key={product.id} value={product.productName}>{product.productName}</SelectItem>)) : (<span>No Products</span>)}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField 
                                    control={form.control}
                                    name="clientName"
                                    render={({field}) =>(
                                        <FormItem>
                                            <FormLabel>Nome do Cliente</FormLabel>
                                            <FormControl>
                                                <Input {...field} placeholder="Nome do Cliente"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-between">

                                    <FormField 
                                        control={form.control}
                                        name="price"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Preco</FormLabel>
                                                <FormControl>
                                                    <Input {...field} value={productPrice} className="w-[100px]"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField 
                                        control={form.control}
                                        name="quantity"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Quantidade</FormLabel>
                                                <FormControl>
                                                    <Input {...field} className="w-[100px]"/>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button disabled={isLoading} type="submit" className="flex gap-3">{ isLoading ? (<span className="flex gap-3"><SpokeSpinner color="white" />Vendendo...</span>) : <span>Vender</span>}</Button>
                                <Link to={"/bills"} state={dataToBill} className="w-full">
                                    <Button className="bg-pink-800 w-full">Gerar Fatura</Button>
                                </Link>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
                <Toaster position="top-right" richColors/>
            </main>
        </div>
    )
}