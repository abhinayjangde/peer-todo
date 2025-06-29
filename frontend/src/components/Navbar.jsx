import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import { Link } from "react-router";
import { Button } from "./ui/button";
import { 
  UserIcon, 
  HomeIcon, 
  CheckSquareIcon, 
  PlusIcon, 
  LogOutIcon,
  LogInIcon,
  UserPlusIcon,
  Loader2Icon
} from "lucide-react";

export default function Navbar() {
  const { authUser, checkAuth, logout, isCheckingAuth } = useUserStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={"/"} className="hover:opacity-80 transition-opacity">
          <div className="text-white text-lg font-bold flex items-center gap-2">
            <CheckSquareIcon size={24} />
            PeerTodo
          </div>
        </Link>
        
        <div className="flex items-center space-x-4">
          {/* Navigation Links */}
          <Link 
            to="/" 
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700"
          >
            <HomeIcon size={18} />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link 
            to="/all-todos" 
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700"
          >
            <CheckSquareIcon size={18} />
            <span className="hidden sm:inline">Todos</span>
          </Link>
          
          <Link 
            to="/create" 
            className="text-gray-300 hover:text-white transition-colors flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-700"
          >
            <PlusIcon size={18} />
            <span className="hidden sm:inline">Create</span>
          </Link>

          {/* User Section */}
          {isCheckingAuth && (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2Icon className="animate-spin" size={18} />
              <span className="hidden sm:inline">Loading...</span>
            </div>
          )}

          {authUser && !isCheckingAuth && (
            <div className="flex items-center gap-4">
              {/* User Info */}
              <div className="flex items-center gap-2 text-gray-300">
                <div className="bg-gray-600 p-2 rounded-full">
                  <UserIcon size={18} />
                </div>
                <span className="hidden md:inline font-medium">
                  {authUser.name || authUser.email}
                </span>
              </div>
              
              {/* Logout Button */}
              <Button 
                onClick={logout} 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"
              >
                <LogOutIcon size={16} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          )}

          {!authUser && !isCheckingAuth && (
            <div className="flex items-center gap-2">
              <Link to={"/login"}>
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 bg-transparent border-gray-600 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
                >
                  <LogInIcon size={16} />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
              
              <Link to={"/register"}>
                <Button 
                  size="sm"
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  <UserPlusIcon size={16} />
                  <span className="hidden sm:inline">Register</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}