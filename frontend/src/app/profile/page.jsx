"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Loader2 } from 'lucide-react'
import { auth, db } from "../../utils/firebase"
import { getDoc, doc } from "firebase/firestore"

export default function ProfilePage() {
  // User profile state
  const [profile, setProfile] = useState({
    Name: "",
    email: "",
    avatar: "/placeholder.svg?height=96&width=96"
  })

  // Loading state
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true)
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          // Redirect to login if no user is logged in
          window.location.href = '/signup'
          return
        }

        // Get additional user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (userDoc.exists()) {
          const userData = userDoc.data()
          
          // Update profile state with user data
          setProfile({
            Name: userData.name || "",
            email: currentUser.email || "",
            avatar: userData.avatar || "/placeholder.svg?height=96&width=96"
          })
        } else {
          // Set profile with minimal data if document doesn't exist
          setProfile({
            ...profile,
            email: currentUser.email || ""
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">User Profile</h1>
      
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} alt={`${profile.Name}`} />
            <AvatarFallback>{profile.Name?.[0] || ''}</AvatarFallback>
          </Avatar>
          
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-base">{profile.Name || 'Not set'}</p>
              </div>
            
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{profile.email || 'Not set'}</p>
            </div>
            
          </div>
        </CardContent>
      </Card>
    </div>
  )
}