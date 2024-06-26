import { account } from "@/appwrite/appwrite"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Toaster } from "@/components/ui/sonner"
import { SpokeSpinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

export function AuthPage() {
    const [isLoading, setisLoading] = useState(false)

    const loginFormSchema = z.object({
        userEmail: z.string().min(1).email(),
        userPassword: z.string().min(1)
    })

    
    const navigate = useNavigate()

    type LoginForm = z.infer<typeof loginFormSchema>

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            userEmail: "",
            userPassword: ""
        }
    })

    async function onSubmit(values: z.infer<typeof loginFormSchema>){
        setisLoading(true)
        try{
            await account.createEmailPasswordSession(
                values.userEmail,
                values.userPassword
            )
            const user = await account.get()
            if(user.name === "Admin"){
                navigate("/")
            }else{
                navigate("/attendent", {state: {email: values.userEmail}})
            }
        }catch(error){
            toast.error("Email ou Password Invalido")
        }
        setisLoading(false)
       
    }

    function goToHome(){

    }

    function LoginForm(){
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField 
                        control={form.control}
                        name="userEmail"
                        render={(({field}) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" placeholder="m@example.com" required />
                                </FormControl>
                            </FormItem>
                        ))}
                    />
                    <FormField 
                        control={form.control}
                        name="userPassword"
                        render={(({field}) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" required />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        ))}
                    />

                    <Button onClick={goToHome} disabled={isLoading} type="submit" className="w-full mt-4">{isLoading ? (<span className="flex gap-2"><SpokeSpinner color="white" />Sign in</span>) : (<span>Sign in</span>)}</Button>
                </form>
            </Form> 
        )
    }
    
  return (
    <div className="flex flex-col items-center justify-center w-screen h-screen">
        <Card className="w-full max-w-sm">
        <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
            Digite seu Email e Palavra Passe para entrar em sua conta.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <LoginForm />
        </CardContent>
        </Card>
        <Toaster position="bottom-center" richColors/>
    </div>
  )
}