"use client"
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/stores/userStore";
import { 
  CheckSquareIcon, 
  PlusIcon, 
  ZapIcon, 
  ShieldCheckIcon,
  UsersIcon,
  ArrowRightIcon,
  StarIcon
} from "lucide-react";

function App() {
  const { authUser } = useUserStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Hero Badge */}
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
            <StarIcon className="w-4 h-4 mr-2" />
            Welcome to PeerTodo
          </Badge>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Organize Your Life with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Smart Todos
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your productivity with our intuitive todo management system. 
            Secure, simple, and designed to help you achieve more every day.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {authUser ? (
              <>
                <Link to="/all-todos">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    <CheckSquareIcon className="mr-2" size={20} />
                    View My Todos
                  </Button>
                </Link>
                <Link to="/create">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    <PlusIcon className="mr-2" size={20} />
                    Create New Todo
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Get Started Free
                    <ArrowRightIcon className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ZapIcon className="text-blue-600" size={32} />
              </div>
              <CardTitle className="text-xl">Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Create, edit, and manage your todos instantly. No lag, no waiting - just pure productivity.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <ShieldCheckIcon className="text-green-600" size={32} />
              </div>
              <CardTitle className="text-xl">Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Your data is protected with enterprise-grade security. Only you can access your todos.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <UsersIcon className="text-purple-600" size={32} />
              </div>
              <CardTitle className="text-xl">User Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Intuitive design that anyone can use. Spend time on what matters, not learning complex tools.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Join Thousands of Productive Users
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600 mb-2">100K+</div>
              <div className="text-gray-600">Todos Created</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!authUser && (
          <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Boost Your Productivity?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users who have transformed their daily workflow with PeerTodo.
            </p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                Start Your Journey Today
                <ArrowRightIcon className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        )}

        {authUser && (
          <div className="mt-20 text-center bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Welcome back, {authUser.name || authUser.email}! 👋
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Ready to tackle your goals today? Let's make it happen!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/all-todos">
                <Button size="lg" variant="secondary" className="px-8 py-4 text-lg">
                  <CheckSquareIcon className="mr-2" size={20} />
                  My Todos
                </Button>
              </Link>
              <Link to="/create">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-gray-900">
                  <PlusIcon className="mr-2" size={20} />
                  Add New Todo
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App