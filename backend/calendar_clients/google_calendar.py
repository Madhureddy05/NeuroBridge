import os
import msal
import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from flask import url_for, session
from googleapiclient.discovery import build

GOOGLE_CLIENT_SECRETS_FILE = r"NeuroBridge\backend\credentials\client_secret.json"
GOOGLE_SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"]

def get_google_auth_url():
    flow = Flow.from_client_secrets_file(
        GOOGLE_CLIENT_SECRETS_FILE,
        scopes=GOOGLE_SCOPES
    )
    flow.redirect_uri = url_for("google_oauth2callback", _external=True)

    auth_url, state = flow.authorization_url(
        access_type="offline",
        prompt="consent",
        include_granted_scopes="true"
    )
    session["google_oauth_state"] = state
    return auth_url

def get_google_token(auth_response_url):
    state = session.get("google_oauth_state")
    flow = Flow.from_client_secrets_file(
        GOOGLE_CLIENT_SECRETS_FILE,
        scopes=GOOGLE_SCOPES,
        state=state
    )
    flow.redirect_uri = url_for("google_oauth2callback", _external=True)
    flow.fetch_token(authorization_response=auth_response_url)
    credentials = flow.credentials

    # Store credentials in session (or DB)
    session["google_credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes
    }
    return credentials

def get_google_calendar_events():
    if "google_credentials" not in session:
        return None
    creds_data = session["google_credentials"]
    creds = Credentials(**creds_data)

    service = build("calendar", "v3", credentials=creds)
    events_result = service.events().list(
        calendarId="primary", maxResults=5, singleEvents=True, orderBy="startTime"
    ).execute()
    return events_result.get("items", [])
