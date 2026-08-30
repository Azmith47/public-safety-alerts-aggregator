# Backend

This folder contains the backend application responsible for:

- Providing API endpoints for retrieving alerts
- Handling requests from the frontend dashboard
- Processing alert data stored in the database
- Implementing business logic for filtering and searching alerts

Possible technologies:
- Python (Flask or FastAPI)
- Node.js (Express)

Example responsibilities:
- GET /alerts
- GET /alerts?region=
- GET /alerts?category=
- GET /alerts/{id}

---

## SMTP email notifications

Set these environment variables before starting the backend. Gmail and other
providers may require an app password rather than your normal password.

```text
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-app-password
EMAIL_FROM=your-email@example.com
EMAIL_FROM_NAME=Public Safety Alerts
APP_URL=http://localhost:3000
```

`POST /subscriptions` sends a confirmation email. The subscription remains
disabled until the user visits `GET /subscriptions/confirm/:token`.

New matching alerts are queued and sent as one digest per user, rather than as
one email per alert.

### How to set it up

1. Go to your Google Account Settings.
2. Enable 2-Step Verification (required for app passwords).
3. Search for App Passwords in the Google search bar.
4. Create a new app password called "Critical Signal" and copy the 16-character code.
5. Update the `.env` file.