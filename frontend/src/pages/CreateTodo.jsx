"use client"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useUserStore } from "@/stores/userStore";
import { useTodoStore } from "@/stores/todoStore";
import { Loader2Icon } from "lucide-react";
import toast from "react-hot-toast";

const todoSchema = z.object({
    title: z.string().min(1, { message: "Title is required." }).max(100, { message: "Title must be less than 100 characters." }),
    description: z.string().min(1, { message: "Description is required." }).max(500, { message: "Description must be less than 500 characters." })
})

export default function CreateTodo() {
    const { authUser } = useUserStore()
    const { createTodo, isCreatingTodo } = useTodoStore()
    const navigate = useNavigate()

    const form = useForm({
        resolver: zodResolver(todoSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    })

    async function onSubmit(data) {
        if (!authUser) {
            toast.error("You must be logged in to create a todo")
            navigate("/login")
            return
        }

        try {
            await createTodo(data)
            
            // Reset form
            form.reset()
            
            // Redirect to todos page
            navigate("/all-todos")
        } catch (error) {
            console.log("Error creating todo:", error)
        }
    }

    return (
        <main className="flex min-h-screen justify-center items-center p-4">
            <Card className="mx-auto max-w-2xl w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Todo</CardTitle>
                    <CardDescription>
                        Add a new todo item to your list
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Title</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    placeholder="Enter todo title..." 
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Enter todo description..."
                                                    className="min-h-[100px]"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="flex gap-4">
                                    {isCreatingTodo && (
                                        <Button disabled className="flex-1">
                                            <Loader2Icon className="animate-spin mr-2" />
                                            Creating...
                                        </Button>
                                    )}
                                    {!isCreatingTodo && (
                                        <>
                                            <Button 
                                                type="button" 
                                                variant="outline" 
                                                className="flex-1"
                                                onClick={() => navigate("/all-todos")}
                                            >
                                                Cancel
                                            </Button>
                                            <Button type="submit" className="flex-1">
                                                Create Todo
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}
