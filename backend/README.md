## Mailchimp email notifications

Set these environment variables before starting the backend:

```text
MAILCHIMP_API_KEY=your_marketing_api_key
MAILCHIMP_SERVER_PREFIX=your_datacenter_prefix
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_TRANSACTIONAL_API_KEY=your_mandrill_api_key
MAILCHIMP_FROM_EMAIL=alerts@example.com
MAILCHIMP_FROM_NAME=Public Safety Alerts
```

`POST /subscriptions` adds the address to the Mailchimp audience with
`status_if_new: pending`, so Mailchimp sends its double-opt-in email. Configure
a Mailchimp webhook for `POST /subscriptions/mailchimp/webhook`; the subscribe
event verifies the local user and enables their stored subscriptions.

New matching alerts are queued and sent as one digest per user, rather than as
one email per alert.
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