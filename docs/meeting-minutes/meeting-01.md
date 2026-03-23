# Meeting 1 – Project Kick-off

**Date:** Sunday, 8 March 2026
**Time:** 7:30 PM
**Location:** Online

**Chair:** Ettore Vescio  
**Minutes recorded by:** Christian Finocchiaro
**Attendees:**

* Ettore Vescio
* Christian Finocchiaro
* Thomas Smith
* Pradip Pandey

## Meeting Objective:
  
Establish the project team, review the project brief, identify initial data sources,
discuss the technical approach, and assign initial setup tasks.

---

## 1. Team Introductions

Each team member introduced their background and relevant technical skills.

* **Ettore (Tory)** – Embedded software engineer at NSW Police with ~8 years of R&D experience in software and electronic systems. Skills include Python, JavaScript, SQL, HTML, and Java across front-end and back-end development.
* **Pradip (Patrick)** – Final year Cybersecurity major working in logistics. Skills include Python, JavaScript, HTML/CSS, networking, and firewall configuration.
* **Tom** – Final year Cybersecurity major with a Software Development minor. Experience with JavaScript, TypeScript, Node.js, React, Next.js, and Java. Interested in full-stack development.
* **Christian** – Final year Web Development major with experience in HTML, CSS, JavaScript, Java, and C#. Background in IT support.

The team agreed to aim for a **High Distinction** grade for the project.

---

## 2. Team Leadership

Ettore (Tory) was nominated and unanimously selected as **Team Leader**.

---

## 3. Project Overview

The team discussed the project **Public Safety Alerts Aggregator & Explorer**, which will:

* Collect public safety alerts from open RSS feeds and APIs.
* Store alert data in a MySQL database.
* Provide a web-based interface to explore alerts by region and category.
* Display alerts visually on a map.

Potential alert types include bushfires, severe weather warnings, and road incidents.

---

## 4. Data Sources (Initial)

The following data sources were identified:

* Bureau of Meteorology RSS – https://www.bom.gov.au/rss/
* NSW Rural Fire Service RSS – https://www.rfs.nsw.gov.au/news-and-media/stay-up-to-date/feeds
* NSW Live Traffic Hazards API – https://opendata.transport.nsw.gov.au/dataset/live-traffic-hazards

The team agreed to initially integrate **BoM and RFS feeds**, with additional sources added if time permits.

---

## 5. Technical Discussion

### Data Collection

* RSS feeds will be used for BoM and RFS alerts.
* APIs or permitted scraping may be used for additional sources.

### Front-End

* Web-based interface.
* **React** suggested as the preferred framework (final decision pending).

### Back-End

* Backend language under consideration:

  * Python
  * Node.js

### Notifications

* Potential alert notifications via **Discord API** were discussed.
* Need to confirm whether notifications should be in-app or external (e.g., email or SMS).

---

## 6. Preliminary Role Allocation

| Team Member | Role                                                          |
| ----------- | ------------------------------------------------------------- |
| Ettore      | Team Leader, database design, full-stack development          |
| Tom         | Full-stack development                                        |
| Christian   | Front-end development                                         |
| Pradip      | Security testing, monitoring, and general development support |

---

## 7. Key Decisions Summary

- Ettore confirmed as Team Leader.
- Initial alert sources will be Bureau of Meteorology (BoM) and NSW Rural Fire Service (RFS) RSS feeds.
- React selected as the preferred front-end framework (pending confirmation).
- Backend technology decision deferred to next meeting.
- GitHub repository and Miro project board established.

---

## 8. Open Questions

The following questions will be clarified with the project supervisor:

* Are external notifications (Discord/email/SMS) acceptable?
* Is a **user login system** required?
* Confirmation of the **final project due date** and milestones.

---

## 9. Action Items

| Task | Owner | Due Date |
|-----|------|------|
Create GitHub repository and add team members | Ettore | Completed |
Create project board (Miro) | Ettore | Completed |
Research alert data sources and APIs | All | 12 March 2026 |
Confirm requirements with supervisor | Ettore | 12 March 2026 |

---

## 10. Next Meeting

**Date:** Sunday, 15 March 2026
**Time:** 7:30 PM

**Minutes stored in:**  
GitHub → /docs/meeting-minutes/