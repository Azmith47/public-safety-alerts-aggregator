# Meeting 3 – Project Charter & Plan Draft

**Date:** Sunday, 22 March, 2026 
**Time:** 7:30 PM
**Location:** Online

**Chair:** Ettore Vescio
**Minutes recorded by:** Ettore Vescio
**Attendees:**

- Ettore Vescio (Team Leader)
- Christian Finocchiaro
- Thomas Smith
- Pradip Pandey

---

## Agenda

- Client Requirements Review
- Discuss project charter sections
- Draft Project Plan (Section 2)
- Plan next steps

## Discussion

### Client Requirements Review
- The team reviewed the client requirements and confirmed the following key requirements:
- Alerts must include both active and historical data
- Users must be able to subscribe via filters (region, category, severity)
- System must handle unavailable data sources and show last refresh time
- Prototype should include 3 data sources
- System should focus on NSW, with future scalability
- Alert updates should update existing records, not create duplicates

### Project Planning
The team continued drafting the Project Charter and Project Plan.
Progress includes:

- Drafted Project Charter sections (Problem Statement, Objectives, Stakeholders, Scope, Constraints)
- Began drafting Project Plan sections:
  - Main Milestones
  - Work Breakdown Summary
  - Schedule Snapshot
  - Risks and Mitigations
  - Communication Cadence
  - Change Control Approach

---

## Decisions Made

- Selected initial data sources:
  - Bureau of Meteorology (BoM)
  - NSW Rural Fire Service (RFS)
  - State Emergency services (SES)
- Confirmed Node.js (backend) and React (frontend) as the technology stack
- Current team roles remain unchanged
- Project Plan will be finalised in the next meeting

### Technical Direction (Preliminary)

The team agreed on a preliminary system architecture:

- Data ingestion layer (RSS/API collection)
- Normalisation process for standardising alert formats
- MySQL database for persistent storage
- Back-end API (Node.js)
- Front-end web interface (React)

---

## Open Questions

The following items will be clarified with the project sponsor:

- Clarify difference between Milestones (2.1) and Schedule Snapshot (2.3)?
- Confirm how far the project schedule should extend (Session 1 only vs full project timeline)
- Request feedback from the client on the current draft
- Confirm availability of the Assignment 2 template

---

## Action Items
| Task | Owner | Due |
|---|---|---|
| Finalise Project Plan sections | All | Before next meeting |
| Refine milestones and schedule | Ettore | Before next meeting |
| Update Miro board with current tasks | All | Ongoing |

---

## Next Meeting

**Date:** Sunday, March 29, 2026  
**Time:** 7:30 PM

**Minutes stored in:**  
GitHub → /docs/meeting-minutes/