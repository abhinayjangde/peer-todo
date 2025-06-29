

"use client"
import { useEffect, useState } from "react";
import { Link } from "react-router";
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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useTodoStore } from "@/stores/todoStore";
import { useUserStore } from "@/stores/userStore";
import { 
    Loader2Icon, 
    PlusIcon, 
    SearchIcon, 
    EditIcon, 
    TrashIcon, 
    CheckIcon,
    XIcon
} from "lucide-react";
import toast from "react-hot-toast";

export default function AllTodos() {
    const { 
        todos, 
        isFetchingTodos, 
        isUpdatingTodo,
        isDeletingTodo,
        isTogglingTodo,
        getAllTodos, 
        updateTodo, 
        deleteTodo, 
        toggleTodoCompletion,
        clearTodos 
    } = useTodoStore();
    
    const { authUser } = useUserStore();
    
    const [searchTerm, setSearchTerm] = useState("");
    const [editingTodo, setEditingTodo] = useState(null);
    const [editForm, setEditForm] = useState({ title: "", description: "" });
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Fetch todos on component mount only if user is logged in
    useEffect(() => {
        if (authUser) {
            getAllTodos();
        } else {
            // Clear todos if user is not logged in
            clearTodos();
        }
    }, [getAllTodos, clearTodos, authUser]);

    // Filter todos based on search term
    const filteredTodos = todos.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle edit todo
    const handleEditTodo = (todo) => {
        setEditingTodo(todo);
        setEditForm({ title: todo.title, description: todo.description });
        setIsEditDialogOpen(true);
    };

    // Handle update todo
    const handleUpdateTodo = async () => {
        if (!editForm.title.trim() || !editForm.description.trim()) {
            toast.error("Title and description are required");
            return;
        }

        try {
            await updateTodo(editingTodo._id, editForm);
            setIsEditDialogOpen(false);
            setEditingTodo(null);
            setEditForm({ title: "", description: "" });
        } catch (error) {
            console.log("Error updating todo:", error);
        }
    };

    // Handle delete todo
    const handleDeleteTodo = async (todoId) => {
        try {
            await deleteTodo(todoId);
        } catch (error) {
            console.log("Error deleting todo:", error);
        }
    };

    // Handle toggle completion
    const handleToggleCompletion = async (todoId) => {
        try {
            await toggleTodoCompletion(todoId);
        } catch (error) {
            console.log("Error toggling todo:", error);
        }
    };

    if (isFetchingTodos) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <Loader2Icon className="animate-spin mx-auto mb-4" size={40} />
                    <p>Loading todos...</p>
                </div>
            </div>
        );
    }

    // Show login prompt if user is not authenticated
    if (!authUser) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Card className="max-w-md mx-auto">
                    <CardContent className="text-center py-12">
                        <div className="text-gray-500">
                            <XIcon className="mx-auto mb-4" size={48} />
                            <h3 className="text-lg font-medium mb-2">Access Denied</h3>
                            <p className="mb-4">You need to be logged in to view your todos</p>
                            <div className="flex gap-2 justify-center">
                                <Link to="/login">
                                    <Button>Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline">Register</Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold">My Todos</h1>
                    <p className="text-gray-600 mt-1">
                        {todos.length} {todos.length === 1 ? 'todo' : 'todos'} total
                    </p>
                </div>
                <Link to="/create">
                    <Button className="flex items-center gap-2">
                        <PlusIcon size={16} />
                        Add New Todo
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                    placeholder="Search todos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Todos List */}
            {filteredTodos.length === 0 ? (
                <Card className="text-center py-12">
                    <CardContent>
                        <div className="text-gray-500">
                            {searchTerm ? (
                                <>
                                    <SearchIcon className="mx-auto mb-4" size={48} />
                                    <h3 className="text-lg font-medium mb-2">No todos found</h3>
                                    <p>Try adjusting your search terms</p>
                                </>
                            ) : (
                                <>
                                    <PlusIcon className="mx-auto mb-4" size={48} />
                                    <h3 className="text-lg font-medium mb-2">No todos yet</h3>
                                    <p className="mb-4">Create your first todo to get started</p>
                                    <Link to="/create">
                                        <Button>Create Todo</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredTodos.map((todo) => (
                        <Card key={todo._id} className={`transition-all ${todo.completed ? 'opacity-75' : ''}`}>
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Checkbox */}
                                    <Checkbox
                                        checked={todo.completed}
                                        onCheckedChange={() => handleToggleCompletion(todo._id)}
                                        className="mt-1"
                                        disabled={isTogglingTodo}
                                    />
                                    
                                    {/* Todo Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-lg font-semibold mb-2 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                                    {todo.title}
                                                </h3>
                                                <p className={`text-gray-600 ${todo.completed ? 'line-through' : ''}`}>
                                                    {todo.description}
                                                </p>
                                                <div className="flex items-center gap-2 mt-3">
                                                    <Badge variant={todo.completed ? "secondary" : "default"}>
                                                        {todo.completed ? "Completed" : "Pending"}
                                                    </Badge>
                                                    {todo.createdAt && (
                                                        <span className="text-sm text-gray-400">
                                                            Created {new Date(todo.createdAt).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                {/* Edit Button */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleEditTodo(todo)}
                                                    disabled={isUpdatingTodo}
                                                >
                                                    <EditIcon size={16} />
                                                </Button>
                                                
                                                {/* Delete Button */}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            disabled={isDeletingTodo}
                                                        >
                                                            <TrashIcon size={16} />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Todo</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                Are you sure you want to delete "{todo.title}"? This action cannot be undone.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeleteTodo(todo._id)}
                                                                className="bg-red-600 hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Edit Todo Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Todo</DialogTitle>
                        <DialogDescription>
                            Make changes to your todo. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Title</label>
                            <Input
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Todo title..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                placeholder="Todo description..."
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditDialogOpen(false)}
                            disabled={isUpdatingTodo}
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdateTodo}
                            disabled={isUpdatingTodo}
                        >
                            {isUpdatingTodo && <Loader2Icon className="animate-spin mr-2" size={16} />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}