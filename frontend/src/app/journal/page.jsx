"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Textarea } from "../../components/ui/textarea"
import { Label } from "../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { CalendarIcon, Save, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { format } from "date-fns"
import { cn } from "../../lib/utils"
import { Calendar } from "../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover"
import { useToast } from "../../components/ui/use-toast"
import { Badge } from "../../components/ui/badge"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { auth, db } from "../../utils/firebase"
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  Timestamp, 
  deleteDoc,
  doc
} from "firebase/firestore"
import { onAuthStateChanged } from "firebase/auth"

export default function JournalPage() {
  const [date, setDate] = useState(new Date())
  const [mood, setMood] = useState("neutral")
  const [journalEntry, setJournalEntry] = useState("")
  const [pastEntries, setPastEntries] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState({})
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)
  const { toast } = useToast()

  // Check for authenticated user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsLoadingUser(false)
    })
    
    return () => unsubscribe()
  }, [])

  // Fetch journal entries when user is authenticated
  useEffect(() => {
    if (currentUser) {
      fetchJournalEntries()
    } else if (!isLoadingUser) {
      setPastEntries([])
    }
  }, [currentUser, isLoadingUser])

  const fetchJournalEntries = async () => {
    if (!currentUser) return
    
    setIsLoading(true)
    try {
      const journalRef = collection(db, "journal")
      const q = query(
        journalRef,
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      )
      
      const querySnapshot = await getDocs(q)
      const entries = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        entries.push({
          id: doc.id,
          date: data.date.toDate(),
          mood: data.mood,
          entry: data.entry,
          createdAt: data.createdAt.toDate()
        })
      })
      
      setPastEntries(entries)
    } catch (error) {
      console.error("Error fetching journal entries:", error)
      toast({
        title: "Error",
        description: "Failed to load journal entries. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to save journal entries.",
        variant: "destructive"
      })
      return
    }
    
    if (!journalEntry.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something in your journal entry.",
        variant: "destructive"
      })
      return
    }
    
    setIsSaving(true)
    
    try {
      // Create a new journal entry in Firestore
      const journalRef = collection(db, "journal")
      const newEntry = {
        userId: currentUser.uid,
        date: Timestamp.fromDate(new Date(date)),
        mood,
        entry: journalEntry,
        createdAt: Timestamp.fromDate(new Date())
      }
      
      const docRef = await addDoc(journalRef, newEntry)
      
      // Add the new entry to the state
      const entryWithId = {
        id: docRef.id,
        date: new Date(date),
        mood,
        entry: journalEntry,
        createdAt: new Date()
      }
      
      setPastEntries([entryWithId, ...pastEntries])
      setJournalEntry("")
      setMood("neutral")
      setDate(new Date())
      
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      })
    } catch (error) {
      console.error("Error adding journal entry:", error)
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!currentUser) return
    
    setIsDeleting(prev => ({ ...prev, [entryId]: true }))
    
    try {
      // Delete the entry from Firestore
      await deleteDoc(doc(db, "journal", entryId))
      
      // Remove the entry from state
      setPastEntries(pastEntries.filter(entry => entry.id !== entryId))
      
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting journal entry:", error)
      toast({
        title: "Error",
        description: "Failed to delete your journal entry. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsDeleting(prev => ({ ...prev, [entryId]: false }))
    }
  }

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😊"
      case "neutral":
        return "😐"
      case "sad":
        return "😔"
      case "stressed":
        return "😫"
      case "energetic":
        return "⚡"
      default:
        return "😐"
    }
  }

  const getMoodColor = (mood) => {
    switch (mood) {
      case "happy":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "neutral":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "sad":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "stressed":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "energetic":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  if (isLoadingUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    )
  }

  if (!currentUser) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mood Journal</h1>
          <p className="text-muted-foreground">
            Track your mood and reflect on your day. Regular journaling helps improve mental wellbeing.
          </p>
        </div>
        
        <Alert className="bg-amber-50">
          <AlertDescription className="text-center py-4">
            Please log in to use the mood journal feature.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Mood Journal</h1>
        <p className="text-muted-foreground">
          Track your mood and reflect on your day. Regular journaling helps improve mental wellbeing.
        </p>
      </div>

      <Tabs defaultValue="new-entry" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="new-entry">New Entry</TabsTrigger>
          <TabsTrigger value="past-entries">Past Entries</TabsTrigger>
        </TabsList>

        <TabsContent value="new-entry">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>How are you feeling today?</CardTitle>
                <CardDescription>Record your mood and thoughts for {format(date, "MMMM d, yyyy")}</CardDescription>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-[240px] justify-start text-left font-normal mt-2", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                  </PopoverContent>
                </Popover>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Select your mood</Label>
                  <RadioGroup
                    defaultValue="neutral"
                    className="flex flex-wrap gap-4"
                    value={mood}
                    onValueChange={setMood}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <RadioGroupItem value="happy" id="happy" className="sr-only" />
                      <Label
                        htmlFor="happy"
                        className={`text-4xl cursor-pointer ${mood === "happy" ? "scale-125" : ""} transition-transform`}
                      >
                        😊
                      </Label>
                      <span className="text-xs">Happy</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <RadioGroupItem value="neutral" id="neutral" className="sr-only" />
                      <Label
                        htmlFor="neutral"
                        className={`text-4xl cursor-pointer ${mood === "neutral" ? "scale-125" : ""} transition-transform`}
                      >
                        😐
                      </Label>
                      <span className="text-xs">Neutral</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <RadioGroupItem value="sad" id="sad" className="sr-only" />
                      <Label
                        htmlFor="sad"
                        className={`text-4xl cursor-pointer ${mood === "sad" ? "scale-125" : ""} transition-transform`}
                      >
                        😔
                      </Label>
                      <span className="text-xs">Sad</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <RadioGroupItem value="stressed" id="stressed" className="sr-only" />
                      <Label
                        htmlFor="stressed"
                        className={`text-4xl cursor-pointer ${mood === "stressed" ? "scale-125" : ""} transition-transform`}
                      >
                        😫
                      </Label>
                      <span className="text-xs">Stressed</span>
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <RadioGroupItem value="energetic" id="energetic" className="sr-only" />
                      <Label
                        htmlFor="energetic"
                        className={`text-4xl cursor-pointer ${mood === "energetic" ? "scale-125" : ""} transition-transform`}
                      >
                        ⚡
                      </Label>
                      <span className="text-xs">Energetic</span>
                    </div>
                  </RadioGroup>
                  <div className="mt-2">
                    <Badge className={cn("px-3 py-1", getMoodColor(mood))}>
                      {getMoodEmoji(mood)} {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="journal-entry">Journal Entry</Label>
                  <Textarea
                    id="journal-entry"
                    placeholder="Write about your day, challenges, achievements, or anything on your mind..."
                    className="min-h-[200px]"
                    value={journalEntry}
                    onChange={(e) => setJournalEntry(e.target.value)}
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {journalEntry.length} characters
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button 
                  type="submit" 
                  className="ml-auto" 
                  disabled={isSaving || !journalEntry.trim()}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Entry
                    </>
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="past-entries">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Your Journal History</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchJournalEntries}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Loading entries...</span>
            </div>
          ) : pastEntries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">You haven't created any journal entries yet.</p>
                <Button 
                  className="mt-4" 
                  variant="outline"
                  onClick={() => document.querySelector('[value="new-entry"]').click()}
                >
                  Create Your First Entry
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pastEntries.map((entry) => (
                <Card key={entry.id} className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                        <span>{format(entry.date, "MMMM d, yyyy")}</span>
                        <Badge className={cn("ml-2", getMoodColor(entry.mood))}>
                          {entry.mood}
                        </Badge>
                      </CardTitle>
                      <span className="text-sm text-muted-foreground">
                        {format(entry.createdAt, "h:mm a")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{entry.entry}</p>
                  </CardContent>
                  <CardFooter className="flex justify-end pt-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-100"
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={isDeleting[entry.id]}
                    >
                      {isDeleting[entry.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                      <span className="ml-1">Delete</span>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

