import requests
import json

def format_events_for_prompt(events):
    if not events:
        return "There are no events scheduled today."

    prompt = "Here is my schedule for today:\n"
    for event in events:
        start = event['start'].get('dateTime', event['start'].get('date'))
        end = event['end'].get('dateTime', event['end'].get('date'))
        summary = event.get('summary', 'No Title')
        prompt += f"- {summary} from {start} to {end}\n"

    prompt += "\nCan you tell me how busy my day is and suggest ways to reduce workload or manage time better?"

    return ask_mistral(prompt)

def ask_mistral(prompt):
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={"model": "mistral", "prompt": prompt},
        stream=True
    )

    full_text = ""
    for line in response.iter_lines():
        if line:
            # decode bytes to string
            line_str = line.decode('utf-8')
            # parse json from the line
            json_obj = json.loads(line_str)
            # append the "response" part to full_text
            full_text += json_obj.get("response", "")

    return full_text