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

const registerSchema = z.object({
    name: z.string().min(3, { message: "Name must be at least 3 characters." }),
    email: z.string().email(),
    password: z.string().min(8)
})
export default function Register() {

    const { register, isRegistering } = useUserStore()
    const navigate = useNavigate()
    const form = useForm({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    })

    async function onSubmit(data) {
        try {
            await register(data)
            console.log(data)
            // Redirect to login page after successful registration
            navigate("/login")
        } catch (error) {
            console.log("Registration failed:", error)
        }
    }

    return (
        <main className="flex h-screen justify-center items-center">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-xl">Register</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>

                                <div className="grid gap-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Full name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>


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
                                        isRegistering && <Button size="sm" disabled>
                                            <Loader2Icon className="animate-spin" />
                                            Please wait
                                        </Button>
                                    }
                                    {
                                        !isRegistering && <Button type="submit" className="w-full cursor-pointer">Create an account</Button>
                                    }

                                </div>
                            </form>
                        </Form>
                    </div>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}