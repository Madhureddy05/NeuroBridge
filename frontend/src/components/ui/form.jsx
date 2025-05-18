// Form.jsx
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Loader2 } from "lucide-react";

const GOOGLE_CLIENT_ID = "295227370178-g9b2av44v5k30q98ig6u2uvtd18hnsfg.apps.googleusercontent.com";
const GOOGLE_API_KEY = "AIzaSyAfMYBkhmtgSfROFU7C8ZRbvB-AHMFYMOs";
const GOOGLE_API_SCOPES = "https://www.googleapis.com/auth/calendar";

const Form = ({ setOpen }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    summary: "",
    description: "",
    location: "",
    start: "",
    end: "",
  });

  const loadGapiScript = () => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("client:auth2", initClient);
    };
    document.body.appendChild(script);
  };

  const initClient = () => {
    window.gapi.client
      .init({
        apiKey: GOOGLE_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        scope: GOOGLE_API_SCOPES,
      })
      .then(() => {
        console.log("GAPI client initialized");
      })
      .catch((error) => console.error("Error initializing GAPI client", error));
  };

  useEffect(() => {
    loadGapiScript();
  }, []);

  const handleGoogleSignIn = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signIn().then(() => {
        console.log("User signed in");
      });
    }
  };

  const handleGoogleSignOut = () => {
    if (window.gapi && window.gapi.auth2) {
      window.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log("User signed out");
      });
    }
  };

  const createCalendarEvent = async () => {
    const { summary, description, location, start, end } = eventDetails;

    const event = {
      summary,
      location,
      description,
      start: {
        dateTime: new Date(start).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(end).toISOString(),
        timeZone: "Asia/Kolkata",
      },
    };

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      console.log("Event created:", response);
      alert("Event created successfully!");
      setEventDetails({
        summary: "",
        description: "",
        location: "",
        start: "",
        end: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating event", error);
      alert("Failed to create event.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const isSignedIn = window.gapi.auth2.getAuthInstance().isSignedIn.get();
      if (!isSignedIn) {
        await window.gapi.auth2.getAuthInstance().signIn();
      }
      await createCalendarEvent();
    } catch (err) {
      console.error(err);
      alert("Authentication or event creation failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Event Title</Label>
        <Input
          type="text"
          placeholder="Meeting with team"
          value={eventDetails.summary}
          onChange={(e) => setEventDetails({ ...eventDetails, summary: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          placeholder="Discuss project updates"
          value={eventDetails.description}
          onChange={(e) => setEventDetails({ ...eventDetails, description: e.target.value })}
        />
      </div>

      <div>
        <Label>Location</Label>
        <Input
          type="text"
          placeholder="Conference Room"
          value={eventDetails.location}
          onChange={(e) => setEventDetails({ ...eventDetails, location: e.target.value })}
        />
      </div>

      <div>
        <Label>Start Time</Label>
        <Input
          type="datetime-local"
          value={eventDetails.start}
          onChange={(e) => setEventDetails({ ...eventDetails, start: e.target.value })}
          required
        />
      </div>

      <div>
        <Label>End Time</Label>
        <Input
          type="datetime-local"
          value={eventDetails.end}
          onChange={(e) => setEventDetails({ ...eventDetails, end: e.target.value })}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Event"
          )}
        </Button>
        <Button type="button" variant="outline" onClick={handleGoogleSignIn}>
          Connect Google Calendar
        </Button>
        <Button type="button" variant="destructive" onClick={handleGoogleSignOut}>
          Disconnect
        </Button>
      </div>
    </form>
  );
};

export default Form;
