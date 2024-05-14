import { database } from "@/appwrite/appwrite";
import Sidebar from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductType } from "@/components/ui/open-dialog-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useProducts from "@/hooks/use-products-hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { ID } from "appwrite";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function Homepage(){

    const formSchema = z.object({
        product: z.string().min(4).max(50),
        clientName: z.string().min(4).max(50),
        quantity: z.coerce.number(),
        price: z.coerce.number(),
        transactionType: z.string()
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product: "",
            clientName: "",
            quantity: 0,
            price: 0.00,
            transactionType: "Venda"
        }
    })

    async function onSubmit(values: z.infer<typeof formSchema>){
        const data = {
            type: values.transactionType,
            productName: values.product,
            owner: "Cornelio Teixeira",
            receiver: values.clientName,
            price: values.price,
            quantity: values.quantity
        }

        await database.createDocument(
            '6634de7500138831be5c',
            '663e36b50027d4a52e7a',
            ID.unique(),
            data
        )
        console.log(values)
    }

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
                                                <Select {...field}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Massa" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        { productsInStock ? productsInStock.map((product: ProductType) => (<SelectItem value={product.productName}>{product.productName}</SelectItem>)) : (<span>No Products</span>)}
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
                                                    <Input {...field} className="w-[100px]"/>
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

                                <Button type="submit">Vender</Button>

                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}