import { database } from "@/appwrite/appwrite"
import Sidebar from "@/components/sidebar/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SpokeSpinner } from "@/components/ui/spinner"
import useProviders from "@/hooks/use-providers-page"
import { zodResolver } from "@hookform/resolvers/zod"
import { DotsVertical } from "@mynaui/icons-react"
import { ID } from "appwrite"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import emailjs from "@emailjs/browser"

export const providerSchema = z.object({
    providerName: z.string().min(4).max(50),
    providerProducts: z.string().min(4).max(50),
    providerEmail: z.string().min(4).max(50).email()
})

export const providerResponseSchema = z.object({
    $id: z.string(),
    providerName: z.string().min(4).max(50),
    providerProducts: z.string().min(4).max(50),
    providerEmail: z.string().min(4).max(50).email()
})

export type Provider = z.infer<typeof providerSchema>

export default function ProvidersPage(){
    const [isLoading, setisLoading] = useState(false)
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
        setisLoading(true)

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

        setisLoading(false)
    }

    useEffect(()=> {
        async function getProviders(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '664205300002d575cd0c',
                []
            )

            const formatedDocuments = documents.map((document) => providerResponseSchema.parse(document))
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
                                <DialogTitle>Cadastrar Fornecedor</DialogTitle>
                                <DialogDescription>Cadastre Fornecedores para seus produtos.</DialogDescription>
                            </DialogHeader>
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

                                    <Button disabled={isLoading} type="submit" className="w-full mt-3">{ isLoading ? (<span className="flex gap-3"><SpokeSpinner color="white" />Cadastrando...</span>) : <span>Cadastrar</span>}</Button>
                    
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex gap-5 flex-wrap scroll-auto">
                    { providers ? providers.map((provider: z.infer<typeof providerResponseSchema>) => ( <ProviderCard key={provider.$id} provider={provider} products={provider.providerProducts}/>)) : (<span>No Results</span>)}
                </div>
            </main>
        </div>
    )
}

interface ProviderCardProps {
    provider: z.infer<typeof providerResponseSchema>
    products: string
}

const providerEdictFormSchema = z.object({
    providerName: z.string().min(4),
    providerEmail: z.string().email().min(8),
    providerProduct: z.string().min(4)
})

function ProviderCard({ provider, products }: ProviderCardProps){
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof providerEdictFormSchema>>({
        resolver: zodResolver(providerEdictFormSchema),
        defaultValues: {
            providerName: "",
            providerEmail: "",
            providerProduct: ""
        }
    })

    async function onSubmit(values: z.infer<typeof providerEdictFormSchema>){
        setIsLoading(true)
        const data = {
            providerName: values.providerName,
            providerEmail: values.providerEmail,
            providerProducts: values.providerProduct
        }

        await database.updateDocument(
            '6634de7500138831be5c',
            '664205300002d575cd0c',
            provider.$id,
            data
        )
        setIsLoading(false)
    }

    async function handleProviderDeleteButton(){
        await database.deleteDocument(
            '6634de7500138831be5c',
            '664205300002d575cd0c',
            provider.$id,
        )
    }

    function handleContactProviderButton(){
        const templateParams = {
            to_name: provider.providerEmail,
            from_name: "BCODER SHOPP"
        }
        emailjs
            .send("service_qg0wjuj","request_product_template",templateParams, {
                publicKey: "mEIcqMi0xvReLfpzM"
            }).then(() => console.log("email sent"), (error) => console.error(error))
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{provider.providerName}</CardTitle>
                <CardDescription>{ products }</CardDescription>
            </CardHeader>
            <CardFooter>
                <div className="flex justify-between items-center">
                    <Button onClick={handleContactProviderButton}>Contactar</Button>
                    <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <DotsVertical className="cursor-pointer" size={32}/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Editar Informacoes</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onClick={handleProviderDeleteButton}>Deletar Fornecedor</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DialogContent className="w-[350px]">
                            <DialogHeader>
                                <DialogTitle>Editar Fornecedor.</DialogTitle>
                                <DialogDescription>Editar as informacoes do Fornecedor.</DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                                    <FormField
                                        control={form.control}
                                        name="providerName"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Nome do Fornecedor</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="providerEmail"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Email do Fornecedor</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="providerProduct"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Produtos</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <Button disabled={isLoading} type="submit" className="w-full">{ isLoading ? (<span className="flex gap-3"><SpokeSpinner color="white" />Atualizando...</span>) : <span>Atualizar</span>}</Button>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                   
                </div> 
            </CardFooter>
        </Card>
    )
}
