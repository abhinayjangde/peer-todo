import axiosIntance from "@/utils/axios"
import {create} from "zustand"
import toast from "react-hot-toast"

export const useUserStore = create((set)=>({
    authUser: null,
    isCheckingAuth: false,
    isLogging: false,
    isRegistering: false,

    checkAuth: async ()=>{
        set({isCheckingAuth: true})
        try {
            const response = await axiosIntance.get("/user/me")
            set({authUser: response.data.user})
        } catch (error) {
            set({authUser: null})
        }
        finally{
            set({isCheckingAuth: false})
        }
    },

    register: async (data)=>{
        set({isRegistering: true})
        try {
            const res = await axiosIntance.post("/user/register", data)
            toast.success("Account created successfully. Please verify your account.")
            return res.data // Return the response so the component can handle success
        } catch (error) {
            console.log("Error while registering user: ", error.response.data)
            toast.error(error.response.data.message)
            throw error // Throw error so component can handle it
        }
        finally{
            set({isRegistering: false})
        }
    },
    login: async (data)=>{
        set({isLogging: true})
        try {
            const res = await axiosIntance.post("/user/login", data)
            toast.success(res.data.message || "Login successful!")
            // Set the authenticated user after successful login
            if (res.data.user) {
                set({authUser: res.data.user})
            }
            return res.data // Return the response so the component can handle success
        } catch (error) {
            console.log("Error while login user: ", error)
            toast.error(error.response?.data?.message || "Error while login user.")
            throw error // Throw error so component can handle it
        }
        finally{
            set({isLogging: false})
        }
    },
    logout: async ()=>{
        try {
            const res = await axiosIntance.get("/user/logout")
            toast.success(res.data.message)
            set({authUser: null})
            // Clear todos when user logs out
            if (typeof window !== 'undefined') {
                const { useTodoStore } = await import('./todoStore.js')
                useTodoStore.getState().clearTodos()
            }
        } catch (error) {
            console.log("Error while logout user: ", error)
            toast.error("Error while logging out.")
        }
    }
}))