import os
import msal
import requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from flask import url_for, session

MS_CLIENT_ID = os.getenv("MS_CLIENT_ID", "cee2560c-51ff-48a0-82ea-b1b92fc80396")
MS_CLIENT_SECRET = os.getenv("MS_CLIENT_SECRET", "your_ms_client_secret_here")
MS_TENANT_ID = os.getenv("MS_TENANT_ID", "68105ae5-6a78-4378-b2d1-3154cd1dd030")
MS_AUTHORITY = f"https://login.microsoftonline.com/{MS_TENANT_ID}"
MS_SCOPES = ["Calendars.Read", "Mail.Read", "Chat.Read"]
MS_REDIRECT_URI = "http://localhost:5000/microsoft_callback"

msal_app = msal.ConfidentialClientApplication(
    client_id=MS_CLIENT_ID,
    client_credential=MS_CLIENT_SECRET,
    authority=MS_AUTHORITY
)

def get_microsoft_auth_url():
    auth_url = msal_app.get_authorization_request_url(
        scopes=MS_SCOPES,
        redirect_uri=MS_REDIRECT_URI
    )
    return auth_url

def get_microsoft_token(code):
    result = msal_app.acquire_token_by_authorization_code(
        code,
        scopes=MS_SCOPES,
        redirect_uri=MS_REDIRECT_URI
    )
    if "access_token" in result:
        session["ms_access_token"] = result["access_token"]
    return result

def get_microsoft_calendar_events():
    token = session.get("ms_access_token")
    if not token:
        return None
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(
        "https://graph.microsoft.com/v1.0/me/calendar/events",
        headers=headers
    )
    events = response.json().get("value", [])
    return events
