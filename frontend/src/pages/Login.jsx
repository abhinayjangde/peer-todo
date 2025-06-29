
"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useUserStore } from "@/stores/userStore";
import { Loader2Icon } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8)
})

export default function Login() {

    const {login, isLogging} = useUserStore()
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })


    // Login User
    async function onSubmit(data) {
        try {
            await login(data)
            // Redirect to home page after successful login
            navigate("/")
        } catch (error) {
            console.log("Login failed:", error)
        }
    }


    return (
        <main className="flex h-screen justify-center items-center">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Login</CardTitle>
                    <CardDescription>
                        Login and staring creating todos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Password" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {
                                        isLogging && <Button size="sm" disabled>
                                            <Loader2Icon className="animate-spin" />
                                            Please wait
                                        </Button>
                                    }
                                    {
                                        !isLogging && <Button type="submit" className="w-full">
                                            Login
                                        </Button>
                                    }
                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="underline">
                            Register
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}