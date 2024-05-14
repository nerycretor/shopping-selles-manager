import { database } from "@/appwrite/appwrite"
import Sidebar from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useProviders from "@/hooks/use-providers-page"
import { zodResolver } from "@hookform/resolvers/zod"
import { ID } from "appwrite"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const providerSchema = z.object({
    providerName: z.string().min(4).max(50),
    providerProducts: z.string().min(4).max(50),
    providerEmail: z.string().min(4).max(50).email()
})

export type Provider = z.infer<typeof providerSchema>

export default function ProvidersPage(){
    const [providers, setProviders] = useProviders("providers", [])

    const form = useForm<z.infer<typeof providerSchema>>({
        resolver: zodResolver(providerSchema),
        defaultValues: {
            providerName: "",
            providerProducts: "",
            providerEmail: ""
        }
    })

    async function onSubmit(values: z.infer<typeof providerSchema>){
        console.log(values)

        const data = {
            providerName: values.providerName,
            providerProducts: values.providerProducts,
            providerEmail: values.providerEmail
        }

        await database.createDocument(
            '6634de7500138831be5c',
            '664205300002d575cd0c',
            ID.unique(),
            data
        )
    }

    function ProviderCardRegister(){
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <FormField 
                        control={form.control}
                        name="providerName"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Nome do Fornecedor" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
    
                    <FormField 
                        control={form.control}
                        name="providerProducts"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Produtos</FormLabel>
                                <FormControl>
                                    <Input {...field} placeholder="Produtos que o Fornecedor Comercializa" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
    
                    <div className="flex justify-between">
                        <FormField 
                            control={form.control}
                            name="providerEmail"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Email do Fornecedor" />
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

    useEffect(()=> {
        async function getProviders(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '664205300002d575cd0c',
                []
            )

            const formatedDocuments = documents.map((document) => providerSchema.parse(document))
            setProviders(formatedDocuments)
        }
        getProviders()
    })

    return (
        <div className="flex w-screen h-screen">
            <Sidebar />

            <main className="p-8 flex flex-col gap-10">
                <div className="flex gap-4">
                    <h1 className="font-bold text-3xl text-gray-800">Fornecedores</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} className="flex gap-2"><Plus className="size-3"/>Cadastrar Fornecedores</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[350px]">
                            <DialogHeader>
                                <DialogTitle>Cadastrar Produto</DialogTitle>
                                <DialogDescription>Cadastre um Produto para Aumentar no Stock.</DialogDescription>
                            </DialogHeader>
                            <ProviderCardRegister />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-5">
                    { providers ? providers.map((provider: Provider) => ( <ProviderCard key={provider.providerEmail} provider={provider.providerName} products={provider.providerProducts}/>)) : (<span>No Results</span>)}
                </div>
            </main>
        </div>
    )
}

interface ProviderCardProps {
    provider: string
    products: string
}

function ProviderCard({ provider, products }: ProviderCardProps){
    return (
        <Card>
            <CardHeader>
                <CardTitle>{provider}</CardTitle>
                <CardDescription>{ products }</CardDescription>
            </CardHeader>
            <CardFooter>
                <Button>Contactar</Button>
            </CardFooter>
        </Card>
    )
}