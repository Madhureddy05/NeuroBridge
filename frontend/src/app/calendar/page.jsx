"use client"

import { useState, useEffect } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Calendar } from "../../components/ui/calendar"
import { Badge } from "../../components/ui/badge"
import { ScrollArea } from "../../components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { format, isSameDay, parseISO, addMinutes } from "date-fns"
import { CalendarIcon, Clock, Plus, Loader2, ExternalLink, Trash2 } from 'lucide-react'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import FormLabel from "../../components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Input } from "../../components/ui/input"
import { Textarea } from "../../components/ui/textarea"
import { useToast } from "../../components/ui/use-toast"

export default function CalendarPage() {
  const [date, setDate] = useState(new Date())
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleConnected, setIsGoogleConnected] = useState(false)
  const [newEventDialogOpen, setNewEventDialogOpen] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: new Date(),
    startTime: "09:00",
    duration: "30",
    type: "work"
  })

  // Google Calendar API Client ID - in a real app, you'd want to store this in an environment variable
  const GOOGLE_API_CLIENT_ID = "601860501210-hls31flt1ri1ccsisg291p5rvo72fcr1.apps.googleusercontent.com";
  const GOOGLE_API_SCOPES = "https://www.googleapis.com/auth/calendar";

  // Initialize Google API client
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://apis.google.com/js/api.js";
    script.async = true;
    script.defer = true;
    script.onload = initGoogleAPI;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initGoogleAPI = () => {
    window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        apiKey: "AIzaSyAfMYBkhmtgSfROFU7C8ZRbvB-AHMFYMOs",
        clientId: GOOGLE_API_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: GOOGLE_API_SCOPES
      }).then(() => {
        // Check if user is already signed in
        if (window.gapi.auth2.getAuthInstance().isSignedIn.get()) {
          setIsGoogleConnected(true);
          fetchEvents();
        } else {
          setIsLoading(false);
        }

        // Listen for sign-in state changes
        window.gapi.auth2.getAuthInstance().isSignedIn.listen((isSignedIn) => {
          setIsGoogleConnected(isSignedIn);
          if (isSignedIn) {
            fetchEvents();
          }
        });
      }).catch(error => {
        console.error("Error initializing Google API", error);
        setIsLoading(false);
        useToast({
          title: "Error connecting to Google Calendar",
          description: "Please try again later.",
          variant: "destructive"
        });
      });
    });
  };

  // Sign in to Google
  const handleGoogleSignIn = () => {
    if (window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signIn().catch(error => {
        console.error("Error signing in", error);
        useToast({
          title: "Error signing in to Google",
          description: "Please try again later.",
          variant: "destructive"
        });
      });
    }
  };

  // Sign out from Google
  const handleGoogleSignOut = () => {
    if (window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut().then(() => {
        setEvents([]);
        useToast({
          title: "Signed out from Google Calendar",
          description: "Your calendar is no longer synced."
        });
      });
    }
  };

  // Fetch events from Google Calendar
  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      // Get events from the primary calendar
      // Set time range from 30 days ago to 60 days in the future
      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30);
      
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 60);
      
      const response = await window.gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: 'startTime'
      });

      // Convert Google Calendar events to our app format
      const googleEvents = response.result.items.map(event => {
        let eventType = "work"; // Default type
        
        // Try to determine the event type based on available data
        if (event.colorId === "9" || event.colorId === "10") {
          eventType = "wellness";
        } else if (event.colorId === "5" || event.colorId === "6") {
          eventType = "personal";
        }
        
        return {
          id: event.id,
          title: event.summary || "Untitled Event",
          description: event.description || "",
          date: event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date),
          endTime: event.end.dateTime ? new Date(event.end.dateTime) : null,
          type: eventType,
          googleEvent: true
        };
      });

      setEvents(googleEvents);
    } catch (error) {
      console.error("Error fetching events", error);
      useToast({
        title: "Error fetching calendar events",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new event in Google Calendar
  const createGoogleEvent = async (eventData) => {
    try {
      // Convert our event format to Google Calendar format
      const startDateTime = new Date(eventData.date);
      const [hours, minutes] = eventData.startTime.split(':').map(Number);
      startDateTime.setHours(hours, minutes, 0, 0);
      
      const endDateTime = new Date(startDateTime);
      endDateTime.setMinutes(endDateTime.getMinutes() + parseInt(eventData.duration));
      
      // Set color ID based on event type
      let colorId = "0"; // Default blue
      if (eventData.type === "wellness") {
        colorId = "9"; // Purple
      } else if (eventData.type === "personal") {
        colorId = "5"; // Yellow
      }
      
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: startDateTime.toISOString()
        },
        end: {
          dateTime: endDateTime.toISOString()
        },
        colorId: colorId
      };
      
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });
      
      // Add the new event to our state
      const newEvent = {
        id: response.result.id,
        title: eventData.title,
        description: eventData.description,
        date: startDateTime,
        endTime: endDateTime,
        type: eventData.type,
        googleEvent: true
      };
      
      setEvents([...events, newEvent]);
      
      useToast({
        title: "Event created",
        description: "Your event has been added to Google Calendar."
      });
      
      return true;
    } catch (error) {
      console.error("Error creating event", error);
      useToast({
        title: "Error creating event",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Delete an event from Google Calendar
  const deleteGoogleEvent = async (eventId) => {
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      
      // Remove the event from our state
      setEvents(events.filter(event => event.id !== eventId));
      
      useToast({
        title: "Event deleted",
        description: "Your event has been removed from Google Calendar."
      });
      
      return true;
    } catch (error) {
      console.error("Error deleting event", error);
      useToast({
        title: "Error deleting event",
        description: "Please try again later.",
        variant: "destructive"
      });
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEvent.title) {
      useToast({
        title: "Title required",
        description: "Please enter a title for your event.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    const success = await createGoogleEvent(newEvent);
    setIsLoading(false);
    
    if (success) {
      setNewEventDialogOpen(false);
      setNewEvent({
        title: "",
        description: "",
        date: new Date(),
        startTime: "09:00",
        duration: "30",
        type: "work"
      });
    }
  };

  // Handle input changes for new event form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  // Get events for the selected date
  const selectedDateEvents = events
    .filter((event) => isSameDay(event.date, date))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Function to get badge color based on event type
  const getBadgeVariant = (type) => {
    switch (type) {
      case "work":
        return "default"
      case "personal":
        return "secondary"
      case "wellness":
        return "outline"
      default:
        return "default"
    }
  };

  // Function to format time
  const formatTime = (date) => {
    return format(date, "h:mm a");
  };

  // Function to check if a date has events
  const hasEvents = (date) => {
    return events.some((event) => isSameDay(event.date, date));
  };

  // Render loading state
  if (isLoading && !events.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your schedule, manage tasks, and find time for wellness activities.
        </p>
      </div>

      {!isGoogleConnected && (
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CalendarIcon className="h-12 w-12 mx-auto text-primary opacity-80" />
              <div className="space-y-2">
                <h3 className="text-xl font-medium">Connect Google Calendar</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Sync with your Google Calendar to view and manage all your events in one place.
                  Your events will be synchronized across all your devices.
                </p>
              </div>
              <Button 
                onClick={handleGoogleSignIn}
                className="bg-primary text-primary-foreground hover:bg-primary/90 mt-2"
              >
                Connect Google Calendar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {isGoogleConnected && (
              <div className="w-full pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleGoogleSignOut} 
                  className="w-full text-xs border border-input bg-background hover:bg-accent hover:text-accent-foreground"
                >
                  Disconnect Google Calendar
                </Button>
              </div>
            )}

        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>{format(date, "MMMM d, yyyy")}</CardTitle>
              {isGoogleConnected && (
                <Dialog open={newEventDialogOpen} onOpenChange={setNewEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Event
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Add New Event</DialogTitle>
                      <DialogDescription>
                        Create a new event in your Google Calendar.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <FormLabel htmlFor="title">Event Title</FormLabel>
                          <Input
                            id="title"
                            name="title"
                            placeholder="Enter event title"
                            value={newEvent.title}
                            onChange={handleInputChange}
                            className="w-full"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <FormLabel htmlFor="description">Description (optional)</FormLabel>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder="Enter event description"
                            value={newEvent.description}
                            onChange={handleInputChange}
                            className="resize-none h-20"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <FormLabel htmlFor="startTime">Start Time</FormLabel>
                            <Input
                              id="startTime"
                              name="startTime"
                              type="time"
                              value={newEvent.startTime}
                              onChange={handleInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <FormLabel htmlFor="duration">Duration (minutes)</FormLabel>
                            <Select 
                              name="duration" 
                              value={newEvent.duration}
                              onValueChange={(value) => setNewEvent({...newEvent, duration: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="15">15 minutes</SelectItem>
                                <SelectItem value="30">30 minutes</SelectItem>
                                <SelectItem value="45">45 minutes</SelectItem>
                                <SelectItem value="60">1 hour</SelectItem>
                                <SelectItem value="90">1.5 hours</SelectItem>
                                <SelectItem value="120">2 hours</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <FormLabel htmlFor="type">Event Type</FormLabel>
                          <Select 
                            name="type" 
                            value={newEvent.type}
                            onValueChange={(value) => setNewEvent({...newEvent, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select event type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="work">Work</SelectItem>
                              <SelectItem value="personal">Personal</SelectItem>
                              <SelectItem value="wellness">Wellness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          disabled={isLoading}
                          className="bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Create Event
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <CardDescription>
              {selectedDateEvents.length > 0
                ? `You have ${selectedDateEvents.length} event${selectedDateEvents.length > 1 ? "s" : ""} scheduled`
                : "No events scheduled for this day"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="schedule">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Schedule</TabsTrigger>
                <TabsTrigger value="tasks" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Tasks</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : selectedDateEvents.length > 0 ? (
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="space-y-4 mt-4">
                      {selectedDateEvents.map((event) => (
                        <Card key={event.id}>
                          <CardHeader className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-base">{event.title}</CardTitle>
                                <CardDescription className="flex items-start flex-col mt-1">
                                  <span className="flex items-center">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {formatTime(event.date)}
                                    {event.endTime && ` - ${formatTime(event.endTime)}`}
                                  </span>
                                  {event.description && (
                                    <span className="mt-1 text-xs">{event.description}</span>
                                  )}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={getBadgeVariant(event.type)}>{event.type}</Badge>
                                {event.googleEvent && (
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7"
                                    onClick={() => deleteGoogleEvent(event.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-muted-foreground">No events scheduled for this day. Enjoy some free time!</p>
                    <div className="mt-4">
                      <p className="text-sm">Suggestions:</p>
                      <ul className="text-sm text-muted-foreground list-disc list-inside mt-2">
                        <li>Take a short walk outside</li>
                        <li>Try a 5-minute meditation</li>
                        <li>Catch up with a colleague</li>
                        <li>Work on a personal project</li>
                      </ul>
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="tasks">
                <div className="py-12 text-center">
                  <p className="text-muted-foreground">Task management coming soon!</p>
                  {isGoogleConnected && (
                    <Button 
                      variant="link" 
                      className="mt-4"
                      onClick={() => window.open("https://calendar.google.com/calendar/u/0/r/tasks", "_blank")}
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open Google Tasks
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


