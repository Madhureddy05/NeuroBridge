import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import  ModeToggle from "./mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Home, PenLine, Brain, MessageSquare, Sparkles, Calendar, BarChart, Bell, LogOut, User } from 'lucide-react';
import { cn } from "../lib/utils";
import { useAuth } from "../contexts/auth-context";


export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const routes = [
    { name: "Home", path: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Journal", path: "/journal", icon: <PenLine className="h-4 w-4 mr-2" /> },
    { name: "Exercises", path: "/exercises", icon: <Brain className="h-4 w-4 mr-2" /> },
    { name: "Chat", path: "/chat", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { name: "Games", path: "/games", icon: <Sparkles className="h-4 w-4 mr-2" /> },
    { name: "Calendar", path: "/calendar", icon: <Calendar className="h-4 w-4 mr-2" /> },
    { name: "Reports", path: "/reports", icon: <BarChart className="h-4 w-4 mr-2" /> },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };
  const profile = () => {
    profile();
    window.location.href = "/profile";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Brain className="h-6 w-6" />
            <span className="font-bold">WellnessHub</span>
          </Link>

          {user && (
            <nav className="hidden md:flex gap-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "text-sm font-medium transition-colors flex items-center",
                    location.pathname === route.path ? "text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {route.icon}
                  {route.name}
                </Link>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          {user ? (
            <>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem as={Link} to="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}