import { Plus } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogTitle } from "./dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./input";
import { database } from "@/appwrite/appwrite";
import { ID } from "appwrite";

export const productSchema = z.object({
    productName: z.string().min(4).max(50),
    productProvider: z.string().min(4).max(50),
    productPrice: z.coerce.number().min(1),
    productUnityNumber: z.coerce.number().min(1)
})

export type ProductType = z.infer<typeof productSchema>

interface OpenDialogButtonProps {
    title: string
}


export default function OpenDialogButtonForStock({title}:OpenDialogButtonProps){
    const form = useForm<z.infer<typeof productSchema>>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            productName: "",
            productProvider: "",
            productPrice: 0,
            productUnityNumber: 0
        }
    })

    async function onSubmit(values: z.infer<typeof productSchema>){
        console.log(values)

        const data = {
            productName: values.productName,
            productProvider: values.productProvider,
            productPrice: values.productPrice,
            productUnityNumber: values.productUnityNumber
        }


        await database.createDocument(
            '6634de7500138831be5c',
            '663fada3003b4cfa0168',
            ID.unique(),
            data
        )

    }
    
    function ProductCardRegister(){
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
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
                        name="productProvider"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome do Fornecedor</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nome do Fornecedor" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
    
                    <div className="flex justify-between">
                        <FormField 
                            control={form.control}
                            name="productPrice"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Preco</FormLabel>
                                    <FormControl>
                                        <Input {...field} className="w-[100px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
    
                        <FormField 
                            control={form.control}
                            name="productUnityNumber"
                            render={({field}) => (
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

                    <Button type="submit" className="w-full mt-3">Cadastrar</Button>
    
                </form>
            </Form>
        )
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="flex gap-2"><Plus className="size-3"/>{title}</Button>
            </DialogTrigger>
            <DialogContent className="w-[350px]">
                <DialogHeader>
                    <DialogTitle>Cadastrar Produto</DialogTitle>
                    <DialogDescription>Cadastre um Produto para Aumentar no Stock.</DialogDescription>
                </DialogHeader>
                <ProductCardRegister />
            </DialogContent>
        </Dialog>
    )
}

