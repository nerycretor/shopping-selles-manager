import { database } from "@/appwrite/appwrite"
import Sidebar from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import OpenDialogButtonForStock, { productResponseSchema } from "@/components/ui/open-dialog-button"
import { ProductType } from "@/components/ui/open-dialog-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SpokeSpinner } from "@/components/ui/spinner"
import useProducts from "@/hooks/use-products-hook"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"



const providerFormSchema = z.object({
    providerName: z.string().min(4).max(50),
    productQuantity: z.coerce.number()
})

export default function StockPage(){
    
    const [product, setProduct] = useProducts("products", [])

    useEffect(() => {
        async function getProducts(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '667be166000c6e985adb',
                []
            )

            const products = documents.map((product) => productResponseSchema.parse(product))

            setProduct(products)


        }
        getProducts()
    })

    return (
        <div className="w-screen h-screen flex">
            <Sidebar />
            <main className="p-8 flex flex-1 flex-col gap-10">
                <div className="flex gap-4">
                    <h1 className="font-bold text-3xl text-gray-800">Produtos Em Stock</h1>
                    <OpenDialogButtonForStock title="Cadastrar Produto"/>
                </div>
                
                <div className="flex flex-wrap gap-5 overflow-auto p-3">
                    { product ? product.map((product: z.infer<typeof productResponseSchema>) => (<ProductCard product={product} unityQuantity={product.productUnityNumber}/>)) : (<span>No data</span>)}
                </div>
            </main>
        </div>
    )
}

interface ProductCardProps {
    product: z.infer<typeof productResponseSchema>
    unityQuantity: number
}

function ProductCard({product,unityQuantity}: ProductCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{product.productName}</CardTitle>
                <CardDescription>Numero de Unidades Disponiveis:</CardDescription>
            </CardHeader>
            <CardContent>
                { unityQuantity <= 5 ? (<h1 className="font-bold text-2xl text-red-600">{unityQuantity} Unidades</h1>) : (<h1 className="font-bold text-2xl">{unityQuantity} Unidades</h1>)}
            </CardContent>
            <CardFooter>
                <ActionButtons productId={product.$id} />
            </CardFooter>
        </Card>
    )
}

interface ActionButtonsProps {
    productId: string
}

const productditFormSchema = z.object({
    productName: z.string().min(4),
    productUnity: z.coerce.number().min(1)
})

function ActionButtons({productId}: ActionButtonsProps){
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof productditFormSchema>>({
        resolver: zodResolver(productditFormSchema),
        defaultValues: {
            productName: "",
            productUnity: 0
        }
    })
    
    async function handleDeletButtonClick(){
        await database.deleteDocument(
            '6634de7500138831be5c',
            '667be166000c6e985adb',
            productId
        )
    }

    async function onSubmit(values: z.infer<typeof productditFormSchema>){
        setIsLoading(true)
        const data = {
            productName: values.productName,
            productUnityNumber: values.productUnity
        }
        await database.updateDocument(
            '6634de7500138831be5c',
            '667be166000c6e985adb',
            productId,
            data
        )
        setIsLoading(false)
    }
    return (
        <div className="flex gap-3">
            <Dialog>
                <DialogTrigger asChild>
                    <Button>Editar</Button>
                </DialogTrigger>
                <DialogContent className="w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Editar Produto</DialogTitle>
                        <DialogDescription>Alterar as informacoes do produto.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-2">
                            <FormField
                                control={form.control}
                                name="productName"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Nome do Produto</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Nome do Produto" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="productUnity"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Quantidade do Produto</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isLoading} className="w-full">{ isLoading ? (<span className="flex gap-3"><SpokeSpinner color="white" />Atualizando...</span>) : <span>Atualizar</span>}</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
            <Button onClick={handleDeletButtonClick} variant='destructive'>Deletar</Button>
        </div>
    )
}