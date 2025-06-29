import axiosIntance from "@/utils/axios";
import { create } from "zustand";
import toast from "react-hot-toast";

export const useTodoStore = create((set, get) => ({
    todos: [],
    isFetchingTodos: false,
    isCreatingTodo: false,
    isUpdatingTodo: false,
    isDeletingTodo: false,
    isTogglingTodo: false,

    // Get all todos
    getAllTodos: async () => {
        set({ isFetchingTodos: true })
        try {
            const res = await axiosIntance.get("/todo/get-todos")
            set({ todos: res.data.todos || res.data })
            return res.data
        } catch (error) {
            console.log("Error while fetching todos: ", error)
            toast.error(error.response?.data?.message || "Error while fetching todos.")
            throw error
        } finally {
            set({ isFetchingTodos: false })
        }
    },

    // Get todos by current user
    getTodosByUser: async () => {
        set({ isFetchingTodos: true })
        try {
            const res = await axiosIntance.get("/todo/get-todos-by-user")
            set({ todos: res.data.todos || res.data })
            return res.data
        } catch (error) {
            console.log("Error while fetching user todos: ", error)
            toast.error(error.response?.data?.message || "Error while fetching your todos.")
            throw error
        } finally {
            set({ isFetchingTodos: false })
        }
    },

    // Create new todo
    createTodo: async (data) => {
        set({ isCreatingTodo: true })
        try {
            const res = await axiosIntance.post("/todo/create-todo", data)
            toast.success("Todo created successfully!")
            
            // Add the new todo to the current todos list
            const currentTodos = get().todos
            set({ todos: [...currentTodos, res.data.todo || res.data] })
            
            return res.data
        } catch (error) {
            console.log("Error while creating todo: ", error)
            toast.error(error.response?.data?.message || "Error while creating todo.")
            throw error
        } finally {
            set({ isCreatingTodo: false })
        }
    },

    // Update todo
    updateTodo: async (id, data) => {
        set({ isUpdatingTodo: true })
        try {
            const res = await axiosIntance.put(`/todo/update-todo/${id}`, data)
            toast.success("Todo updated successfully!")
            
            // Update the todo in the current todos list
            const currentTodos = get().todos
            const updatedTodos = currentTodos.map(todo => 
                todo._id === id ? (res.data.todo || res.data) : todo
            )
            set({ todos: updatedTodos })
            
            return res.data
        } catch (error) {
            console.log("Error while updating todo: ", error)
            toast.error(error.response?.data?.message || "Error while updating todo.")
            throw error
        } finally {
            set({ isUpdatingTodo: false })
        }
    },

    // Delete todo
    deleteTodo: async (id) => {
        set({ isDeletingTodo: true })
        try {
            const res = await axiosIntance.delete(`/todo/delete-todo/${id}`)
            toast.success("Todo deleted successfully!")
            
            // Remove the todo from the current todos list
            const currentTodos = get().todos
            const updatedTodos = currentTodos.filter(todo => todo._id !== id)
            set({ todos: updatedTodos })
            
            return res.data
        } catch (error) {
            console.log("Error while deleting todo: ", error)
            toast.error(error.response?.data?.message || "Error while deleting todo.")
            throw error
        } finally {
            set({ isDeletingTodo: false })
        }
    },

    // Toggle todo completion
    toggleTodoCompletion: async (id) => {
        set({ isTogglingTodo: true })
        try {
            const res = await axiosIntance.put(`/todo/toggle-todo/${id}`)
            toast.success("Todo status updated!")
            
            // Update the todo completion status in the current todos list
            const currentTodos = get().todos
            const updatedTodos = currentTodos.map(todo => 
                todo._id === id ? (res.data.todo || res.data) : todo
            )
            set({ todos: updatedTodos })
            
            return res.data
        } catch (error) {
            console.log("Error while toggling todo: ", error)
            toast.error(error.response?.data?.message || "Error while updating todo status.")
            throw error
        } finally {
            set({ isTogglingTodo: false })
        }
    },

    // Get single todo by ID
    getTodoById: async (id) => {
        try {
            const res = await axiosIntance.get(`/todo/get-todo/${id}`)
            return res.data
        } catch (error) {
            console.log("Error while fetching todo: ", error)
            toast.error(error.response?.data?.message || "Error while fetching todo.")
            throw error
        }
    },

    // Clear todos (useful for logout)
    clearTodos: () => {
        set({ todos: [] })
    }
}))