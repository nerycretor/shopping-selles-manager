import { account, database } from "@/appwrite/appwrite";
import Sidebar from "@/components/sidebar/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SpokeSpinner } from "@/components/ui/spinner";
import useEmployees from "@/hooks/use-employees-hook";
import { zodResolver } from "@hookform/resolvers/zod";
import { DotsVertical } from "@mynaui/icons-react";
import { ID } from "appwrite";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";





export const employeeResponseSchema = z.object({
    $id: z.string(),
    employeeName: z.string().min(4).max(50),
    employeeEmail: z.string().email().min(10).max(50),
    employeeNumber: z.coerce.number().min(9),
    employeeRole: z.string().min(4).max(20),
    employeePassword: z.string().min(8)
})


export default function EmployeePage(){
    const [employees, setEmployees] = useEmployees("employees", [])

    useEffect(() =>{
        async function getEmployees(){
            const { documents } = await database.listDocuments(
                '6634de7500138831be5c',
                '665494910029404d6608',
                []
            )

            const employeesList = documents.map((document) => employeeResponseSchema.parse(document))
            setEmployees(employeesList)
        }
        getEmployees()
    },[])
    return (
        <div className="w-screen h-screen flex flex-1">
            <Sidebar />
            <main className="p-8 flex flex-col gap-10">
                <div className="flex gap-4">
                    <h1 className="font-bold text-3xl text-gray-800">Funcionarios</h1>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant={"outline"} className="flex gap-2"><Plus className="size-3"/>Cadastrar Funcionarios</Button>
                        </DialogTrigger>
                        <DialogContent className="w-[350px]">
                            <DialogHeader>
                                <DialogTitle>Cadastrar Funcionario</DialogTitle>
                                <DialogDescription>Cadastre um Funcionario da Empresa.</DialogDescription>
                            </DialogHeader>
                            <EmployeeCardForm />
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex flex-wrap gap-3">
                    { employees ? employees.map((employee: z.infer<typeof employeeResponseSchema>) => <EmployeeCard key={employee.$id} Employee={employee} />) : <span>No Employee</span>}
                </div>
            </main>
        </div>
    )
}

export const employeeSchema = z.object({
    employeeName: z.string().min(4).max(50),
    employeeEmail: z.string().email().min(10).max(50),
    employeeNumber: z.coerce.number().min(9),
    employeeRole: z.string().min(4).max(20),
    employeePassword: z.string().min(8)
})
export type Employee = z.infer<typeof employeeSchema>

function EmployeeCardForm(){
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            employeeName: "",
            employeeEmail: "",
            employeeNumber: 925958769,
            employeeRole: "",
            employeePassword: ""
        }
    })

    async function onSubmit(values: z.infer<typeof employeeSchema>){
        setIsLoading(true)
        const data = {
            employeeName: values.employeeName,
            employeeEmail: values.employeeEmail,
            employeeNumber: values.employeeNumber,
            employeeRole: values.employeeRole,
            employeePassword: values.employeePassword,
        }

        await database.createDocument(
            '6634de7500138831be5c',
            '665494910029404d6608',
            ID.unique(),
            data
        )
        setIsLoading(false)

        await account.create(
            ID.unique(),
            data.employeeEmail,
            data.employeePassword,
            data.employeeRole
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                <FormField 
                    control={form.control}
                    name="employeeName"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="Nome do Funcionario" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />
                <FormField 
                    control={form.control}
                    name="employeeEmail"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="@email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />
                <FormField 
                    control={form.control}
                    name="employeePassword"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />
                 <FormField 
                    control={form.control}
                    name="employeeNumber"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Numero de Telefone</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />
                <FormField 
                    control={form.control}
                    name="employeeRole"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Privilegios</FormLabel>
                            <FormControl>
                            <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Privilegio"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Admin">Admin</SelectItem>
                                        <SelectItem value="Attendent">Attendent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                />
                <Button disabled={isLoading}>{ isLoading ? (<span className="flex gap-3"><SpokeSpinner color="white" />Cadastrando...</span>) : <span>Cadastrar</span>}</Button>
            </form>
        </Form>
    )
}

interface EmployeeProps {
    Employee: z.infer<typeof employeeResponseSchema>
}

function EmployeeCard({Employee}: EmployeeProps){
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof employeeSchema>>({
        resolver: zodResolver(employeeSchema),
        defaultValues: {
            employeeName: "",
            employeeEmail: "",
            employeeNumber: 955324708,
            employeeRole: "Attendent",
            employeePassword: ""
        }
    })

    async function onSubmit(values: z.infer<typeof employeeSchema>){
        setIsLoading(true)
        const data = {
            employeeName: values.employeeName,
            employeeEmail: values.employeeEmail,
            employeeNumber: values.employeeNumber,
            employeeRole: values.employeeRole,
            employeePassword: values.employeePassword
        }

        await database.updateDocument(
            '6634de7500138831be5c',
            '665494910029404d6608',
            Employee.$id,
            data
        )
        setIsLoading(false)
    }
    async function handleDeleteButtonClick(){
        await database.deleteDocument(
            '6634de7500138831be5c',
            '665494910029404d6608',
            Employee.$id,
        )
    }

    return (
        <Card className="w-[300px]">
            <CardHeader>
                <CardTitle>{Employee.employeeName}</CardTitle>
                <CardDescription>{ Employee.employeeEmail }</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-between">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Ver Detalhes</Button>
                    </DialogTrigger>
                    <DialogContent className="w-[350px]">
                        <DialogHeader>
                            <DialogTitle>{Employee.employeeName}</DialogTitle>
                            <DialogDescription>Funcionario da Empresa BCoder.</DialogDescription>
                        </DialogHeader>
                        
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                                <Label>Email</Label>
                                <span>{Employee.employeeEmail}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Funcao</Label>
                                <span>{Employee.employeeRole}</span>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Numero do Telefone</Label>
                                <span>{Employee.employeeNumber}</span>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <DotsVertical className="cursor-pointer" size={32}/>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Editar Informacoes</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem onClick={handleDeleteButtonClick}>Deletar Funcionario</DropdownMenuItem>
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
                                        name="employeeName"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Nome do Empregado</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employeeEmail"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Email do Empregado</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employeeNumber"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Numero</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employeePassword"
                                        render={({field}) =>(
                                            <FormItem>
                                                <FormLabel>Palavra Passe</FormLabel>
                                                <FormControl>
                                                    <Input type="password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} 
                                    />
                                    <FormField
                                        control={form.control}
                                        name="employeeRole"
                                        render={({field}) =>(
                                            <FormItem>
                                            <FormLabel>Privilegios</FormLabel>
                                            <FormControl>
                                            <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Privilegio"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                        <SelectItem value="Attendent">Attendent</SelectItem>
                                                    </SelectContent>
                                                </Select>
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
            </CardFooter>
        </Card>
    )
}