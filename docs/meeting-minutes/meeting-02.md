# Meeting 2 – Project Charter & Plan Draft

## Date & Attendees

**Date:** Sunday, 15 March, 2026 
**Time:** 7:30 PM
**Location:** Online

**Chair:** Ettore Vescio
**Minutes recorded by:** Pradip Pandey
**Attendees:**
- Ettore Vescio (Team Leader)
- Christian Finocchiaro
- Thomas Smith
- Pradip Pandey

## Agenda

1. Review project brief
2. Discuss project charter sections
3. Set up collaboration tools
4. Identify initial data sources
5. Plan next steps

---

## Discussion

### Collaboration Tools

The team confirmed the following collaboration tools:

- **GitHub** – source code repository and version control
- **Miro** – project planning board and task tracking
- **Discord** – team communication
- **Google Docs / Typst repository** – documentation drafting

The Miro board will be used to:
- Track tasks and responsibilities
- Visualise project workflow
- Monitor project progress

Each team member is responsible for updating their assigned tasks.

### Project Brief Review

The team reviewed the client brief and identified the key system requirements:

- Aggregating alerts from multiple public safety sources
- Normalising alert data into a consistent format
- Storing alerts in a structured database
- Providing a web interface for search and filtering
- Designing the system so it can be expanded in Session 2

### Project Planning

The team began drafting the **Project Charter and Project Plan**, including:

- Problem / opportunity statement
- Project objectives and success criteria
- Stakeholder identification
- Scope boundaries
- Constraints and assumptions
- High-level deliverables
- Definition of project success

---

## Decisions Made

- Team name confirmed as **Critical Signal**
- **Miro** selected as the project planning and task tracking platform
- Initial data sources will include:
  - Bureau of Meteorology (BoM)
  - NSW Rural Fire Service (RFS)
- Current team role assignments will remain unchanged
- Remaining sections of the Project Plan will be completed in the next meeting

### Technical Direction (Preliminary)

The team discussed the likely system architecture:

- **Data ingestion layer** to collect RSS feeds and APIs
- **Normalisation process** to standardise alert formats
- **MySQL database** for persistent storage
- **Back-end API** to expose alert data
- **React-based web interface** for users

Final technology decisions (Python vs Node backend) will be confirmed after further research.

---

## Open Questions

The following items will be clarified with the project sponsor:

- What should the system do if an alert source becomes temporarily unavailable?
- Does the **non-software project context section** apply to this project?

---

## Action Items

| Task | Owner | Due |
|-----|-----|-----|
| Contact project sponsor regarding open questions | Ettore | Before next meeting |
| Complete remaining sections of the project plan | Team | Next meeting |
| Finalise charter draft for submission review | Team | Before deadline |

---

## Next Meeting

**Date:** Sunday, March 22, 2026  
**Time:** 7:30 PM

**Minutes stored in:**  
GitHub → /docs/meeting-minutes/