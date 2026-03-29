#import "@preview/cmarker:0.1.6"

#let version = "0.1"
#let last-edit-date = datetime(day: 29,month: 3,year: 2026, hour: 20, minute: 30, second: 0)
#let due-date = datetime(day: 30, month: 3, year: 2026)

#let students = (
  (
    name: "Ettore Vescio",
    email: link("tv00047@gmail.com"),
    student_id: [11799221]
  ),
  (
    name: "Christian Finocchiaro",
    email: link("cajfino@gmail.com"),
    student_id: [11854560]
  ),
  (
    name: "Thomas Smith",
    email: link("thomas1134smith@gmail.com"),
    student_id: [11787500]
  ),
  (
    name: "Pradip Pandey",
    email:link("pradippandey555@gmail.com"),
    student_id: [11831987]
  ),  
)
#let teacher = "Jason Howarth"
#let team-name = "Critical Signal"
#let project-name = "2026-16 – Public Safety Alerts Aggregator & Explorer"

#set page(margin: 1cm)
#set text(font: "Public Sans", size: 11pt)
#set page(footer: context [
  #team-name #h(1fr)
  #counter(page).display("1") #h(1fr)
])

#let appendix(body) = {
  set heading(numbering: "A.1", supplement: [Appendix])
  counter(heading).update(0)
  body
}

// ------------- Section 1 ------------------------------------
#let problem-opportunity-statement = "Users currently must visit multiple government and emergency websites to access public safety alerts (e.g., weather warnings, bushfires, floods, road incidents). Alerts are published in different formats, making it hard to quickly identify relevant hazards. During emergencies, this fragmentation can delay decisions. A unified alert aggregation system would consolidate trusted sources in one interface, improving awareness and enabling faster safety decisions."

#let objectives-and-success-criteria = (
  (
    objective:"Aggregate public safety alerts from multiple sources", 
    success-measure:"System collects alerts from at least three public sources (e.g., BoM, NSW RFS)"
  ),
  (
    objective:"Store alerts in a structured database", 
    success-measure:"Alerts stored in MySQL or equivalent with fields for category, region, and time"
  ),
  (
    objective:"Provide a web interface for viewing and filtering alerts", 
    success-measure:"Users filter alerts by category, region, and status"
  ),
  (
    objective:"Demonstrate end-to-end data pipeline", 
    success-measure:"System performs ingestion → normalisation → storage → API → web interface"
  ),
  (
    objective:"Provide clear alert detail pages", 
    success-measure:"Users see issuing agency, time, region, description, and official source link"
  ),
)

#let stakeholders = (
  (
    stakeholder: "Jason Howarth",
    role: "Project Sponsor / Client",
    responsibilities: "Defines requirements, reviews progress, provides feedback",
    contact: "e: jhowarth@csu.edu.au\nph: 0265829453"
  ),
  (
    stakeholder: team-name + " team",
    role: "Development Team",
    responsibilities: "Design and implement system features",
    contact: "Discord / email"
  ),
  (
    stakeholder: "CSU Students & Staff",
    role: "End Users",
    responsibilities: "Access alerts relevant to their region",
    contact: "Feedback via email, survey, or verbally"
  ),
  (
    stakeholder: "Government Emergency Alert Providers (BoM, NSW RFS, SES)",
    role: "External Data Providers",
    responsibilities: "Provide original public safety alerts",
    contact: "Public feeds and documentation"
  ),
)

#let scope-boundaries = (
  (
    in-scope: "Data collection via RSS feeds and public APIs",
    out-of-scope: "Real-time push notifications via messaging platforms",
  ),
  (
    in-scope: "Web UI for searching, filtering, and viewing alerts",
    out-of-scope: "Mobile app development",
  ),
  (
    in-scope: "Data ingestion and normalisation",
    out-of-scope: "Integration with private or restricted data sources",
  ),
  (
    in-scope: "Back-end API for alert queries",
    out-of-scope: "Acting as an official alert authority",
  ),
  (
    in-scope: "Three genuine alert sources",
    out-of-scope: "Advanced geospatial modelling beyond feed data",
  ),
  (
    in-scope: "Basic ingestion logging and monitoring",
    out-of-scope: "Machine learning or predictive hazard analytics",
  ),
)

#let constraints-and-assumptions = (
  (
    item: "Selected public feeds remain active",
    type: "Assumption",
    feasibility: "Alternative sources needed if a feed becomes unavailable",
  ),
  (
    item: "Focus on Australian public safety feeds (BoM, NSW RFS)",
    type: "Assumption",
    feasibility: "Data limited to one state reduces collection scope (NSW)",
  ),
  (
    item: "No budget",
    type: "Constraint",
    feasibility: "Limited to free services/resources",
  ),
  (
    item: "System depends on third-party public feeds",
    type: "Constraint",
    feasibility: "API changes may affect ingestion",
  ),
  (
    item: "Public feed rate limits",
    type: "Constraint",
    feasibility: "System must schedule requests and apply rate limiting",
  ),
)

#let product-vision = (
  (
    who-for: "CSU staff, students, teachers, and regional community members needing quick access to public safety alerts",
    solution: "Web-based alert aggregation system collecting multiple public alerts, storing in a structured database, with a searchable interface",
    provides: "Single, reliable location to view and understand current safety alerts",
  )
)

#let highlevel-deliverables = (
  (
    deliverable: "Prototype Demonstration",
    description: "Web system collecting alerts from multiple sources into MySQL",
    evidence: "Live demo and GitHub repo",
  ),
  (
    deliverable: "Technical documentation",
    description: "Architecture and design docs",
    evidence: "GitHub documentation",
  ),
  (
    deliverable: "Alert ingestion pipeline",
    description: "Collect, normalise, and store alerts from multiple feeds",
    evidence: "Ingestion logs and database records",
  ),
  (
    deliverable: "Back-end API",
    description: "Retrieve and filter data from back-end to front-end",
    evidence: "Live API data retrieval",
  ),
  (
    deliverable: "Web Alert Explorer UI",
    description: "Browse and filter alerts via web interface",
    evidence: "UI demo with filtering and detail view",
  ),
  (
    deliverable: "Database Schema",
    description: "Structured design supporting alert storage and queries",
    evidence: "ER diagram and schema documentation",
  ),
)

#let definition-of-success = "Success is achieved when users can access a working web prototype aggregating multiple public alerts, storing them in a structured database, and filtering/searching via a clear web interface."

// ------------------- Section 2 ---------------------------------------

#let main-milestones = (
  (
    milestone: "Project Charter & Plan Submission",
    target-date: datetime(day: 30, month: 3, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "Finalised project charter and plan",
    owner: students.at(0).name,
    success-evidence: "Submitted on time and meets assessment requirements",
  ),
  (
    milestone: "Requirements & Scope Baseline Approved",
    target-date: datetime(day: 6, month: 4, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "Confirmed requirements, scope boundaries, and selected data sources",
    owner: "Team",
    success-evidence: "Documented requirements and agreed system scope",
  ),
  (
    milestone: "Architecture & Data Model Approved",
    target-date: datetime(day: 20, month: 4, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "System architecture diagram, database schema, and API design",
    owner: "Team",
    success-evidence: "Reviewed and agreed design artefacts",
  ),
  (
    milestone: "Data Ingestion & Storage Operational",
    target-date: datetime(day: 27, month: 4, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "Automated ingestion pipeline storing alerts from multiple sources",
    owner: "Team",
    success-evidence: "Database populated with alerts and ingestion logs verified",
  ),
  (
    milestone: "Integrated Prototype Functional",
    target-date: datetime(day: 15, month: 5, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "End-to-end working system (ingestion → database → API → UI)",
    owner: "Team",
    success-evidence: "Demonstration of working system with filtering and alert display",
  ),
  (
    milestone: "Final Demo & Presentation",
    target-date: datetime(day: 1, month: 6, year: 2026).display("[day]/[month]/[year]"),
    deliverable: "Final system demonstration and presentation",
    owner: "Team",
    success-evidence: "Successful demonstration meeting project objectives",
  ),
)

#let work-breakdown-summary = (
  (
    work-stream: "Project Management",
    description: "Planning, documentation, risk management, and stakeholder communication",
    owner: students.at(0).name,
    notes: "Includes meetings and charter",
  ),
  (
    work-stream: "Data Ingestion",
    description: "Collect alerts from RSS feeds/APIs and handle scheduling and logging",
    owner: students.at(2).name,
    notes: "Core pipeline component",
  ),
  (
    work-stream: "Data Processing & Storage",
    description: "Normalise alerts and store in MySQL",
    owner: students.at(0).name,
    notes: "Includes deduplication and update handling",
  ),
  (
    work-stream: "Back-end API",
    description: "Provide endpoints for querying alerts and triggering subscriptions",
    owner: students.at(2).name,
    notes: "Supports frontend filtering",
  ),
  (
    work-stream: "Front-end Web Application",
    description: "UI for browsing, filtering, and viewing alert details",
    owner: students.at(1).name,
    notes: "React-based interface",
  ),
  (
    work-stream: "Testing & Quality Assurance",
    description: "System testing, debugging, and validation of ingestion and UI",
    owner: students.at(3).name,
    notes: "Includes logging verification",
  ),
)

#let schedule-snapshot = (
  (
    week: "Week 5",
    key-date: datetime(day: 30, month: 3, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Assessment 1 Submission",
    notes: "Project Charter & Plan due",
  ),
  (
    week: "Week 6",
    key-date: datetime(day: 6, month: 4, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Requirements & Scope Baseline",
    notes: "Finalise system scope, data sources, and requirements",
  ),
  (
    week: "Week 8–9",
    key-date: datetime(day: 20, month: 4, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Architecture & Design Complete",
    notes: "Architecture, schema, and API design finalised",
  ),
  (
    week: "Week 9–10",
    key-date: datetime(day: 27, month: 4, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Ingestion Pipeline Operational",
    notes: "Alerts successfully flowing into database",
  ),
  (
    week: "Week 11",
    key-date: datetime(day: 15, month: 5, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Assessment 2 Submission",
    notes: "Working end-to-end prototype",
  ),
  (
    week: "Week 14",
    key-date: datetime(day: 1, month: 6, year: 2026).display("[day]/[month]/[year]"),
    major-deadline: "Final Demo",
    notes: "Presentation and system demonstration",
  ),
)

#let risks-and-mitigations = (
  (
    risk: "External data source downtime or unreliability",
    likelihood: "Medium",
    impact: "High",
    mitigation-action: "Display last successful refresh time and fallback to cached data when sources are unavailable.",
    owner: students.at(3).name,
  ),
  (
    risk: "Data Schema Changes by External Sources",
    likelihood: "Medium",
    impact: "High",
    mitigation-action: "Use adaptable parsers; robust error handling; log unrecognized formats.",
    owner: students.at(0).name,
  ),
  (
    risk: "Data Quality and Inconsistent Formats from Sources",
    likelihood: "High",
    impact: "High",
    mitigation-action: "Use robust normalisation and fallback handling for inconsistent data",
    owner: students.at(2).name,
  ),
  (
    risk: "Mapping Implementation Complexity",
    likelihood: "Medium",
    impact: "Medium",
    mitigation-action: "Start with simple region text filtering before attempting polygon mapping.",
    owner: students.at(1).name,
  ),
  (
    risk: "Team Capability/Skills Gaps",
    likelihood: "Medium",
    impact: "High",
    mitigation-action: "Opt for familiar stack (e.g., Python/Node) and hold pair programming sessions.",
    owner: students.at(0).name,
  ),
)

#let communication-cadence = (
  (
    meeting-touchpoint: "Stand-up meetings",
    purpose: "Track progress, plan tasks, and resolve blockers",
    attendees: "Entire team",
    frequency: "Weekly",
    artefact-output: "Meeting minutes and action items",
    tool-link: "Discord",
  ),
  (
    meeting-touchpoint: "Client Progress Update",
    purpose: "Maintain stakeholder visibility of progress",
    attendees: students.at(0).name,
    frequency: "Fortnightly",
    artefact-output: "Short email progress summary",
    tool-link: "Email",
  ),
  (
    meeting-touchpoint: "Client Clarification / Review",
    purpose: "Resolve uncertainties and validate key decisions",
    attendees: students.at(0).name + ", Sponsor",
    frequency: "Ad hoc (as required)",
    artefact-output: "Email responses or meeting notes",
    tool-link: "Email / Zoom",
  ),
  (
    meeting-touchpoint: "Code Review",
    purpose: "Ensure code quality and consistency",
    attendees: "Team members",
    frequency: "Weekly",
    artefact-output: "Review comments and approvals",
    tool-link: "GitHub",
  ),
)

#let change-control-approach = "Any proposed changes to scope, requirements, or deliverables will be recorded in the project issue tracker to ensure traceability. The impact on timeline and resources will be assessed by the Team Leader, and all significant changes must be reviewed and approved by the project sponsor before implementation."

// ------------------ Section 3 ----------------------------------------

#let workspace-evidence-links = (
  (
    evidence-item: "First Meeting Minutes",
    link-location: "GitHub",
    screenshot-ref: "Appendix A",
    notes: "Notes from first stand-up including decisions, action items, and responsibilities."
  ),
  (
    evidence-item: "Second Meeting Minutes",
    link-location: "GitHub",
    screenshot-ref: "Appendix B",
    notes: "Notes from second stand-up, including decisions, action items, and responsibilities."
  ),
  (
    evidence-item: "Third Meeting Minutes",
    link-location: "GitHub",
    screenshot-ref: "Appendix C",
    notes: "Notes from third stand-up, including decisions, action items, and responsibilities."
  ),
  (
    evidence-item: "Fourth Meeting Minutes",
    link-location: "GitHub",
    screenshot-ref: "Appendix D",
    notes: "Notes from fourth stand-up, including decisions, action items, and responsibilities."
  ),
  (
    evidence-item: "Project Management Board Setup (Miro)",
    link-location: link("https://miro.com/app/board/uXjVG1LxTxY=/?share_link_id=849242558963"),
    screenshot-ref: "Appendix Figure 1",
    notes: "Initial board setup with project sections, workflow columns, and task cards."
  ),
  (
    evidence-item: "Onboarding / Team Roles",
    link-location: link("https://miro.com/app/board/uXjVG1LxTxY=/?share_link_id=849242558963"),
    screenshot-ref: "Appendix Figure 2",
    notes: "Team members added, roles assigned, and responsibilities documented on board."
  ),
  (
    evidence-item: "Repository / Artefact Space (GitHub)",
    link-location: link("https://github.com/Azmith47/public-safety-alerts-aggregator.git"),
    screenshot-ref: "Appendix Figure 3",
    notes: "Repository created with README, initial branches, and folder structure."
  ),  
  (
    evidence-item: "First Tasks Created",
    link-location: link("https://miro.com/app/board/uXjVG1LxTxY=/?share_link_id=849242558963"),
    screenshot-ref: "Appendix Figure 4",
    notes: "Initial tasks for data ingestion, UI design, and backend API setup logged."
  ),
  
  (
    evidence-item: "Communication / Chat Evidence",
    link-location: link("https://discord.gg/TcwBP3zZ") + "\nDiscord Server",
    screenshot-ref: "Appendix Figure 5",
    notes: "Discord discussion threads showing progress updates, and Q&A."
  ),
)

// ------------------ File ---------------------------------------------
#v(10em)
#align(center)[#text(24pt)[*#project-name.slice(11)*]]
#align(center + horizon)[
  #set text(18pt, luma(30%))
  Course: Software Development 1  - ITC303 / ITC306 \
  Assessment item 1 - Group Project : Project Charter and Plan \
  Due Date: #due-date.display("[month repr:long] [day], [year]") \
  
  Author: #team-name \
  Institute: Charles Sturt University \
  
  Instructor: #teacher \
  
]
#v(5em)
#grid(
  columns: (1fr, 1fr),
  column-gutter: 1cm,
  ..students.map(student => [
    #align(center)[
      *#student.name* \
      #student.email \
      #student.student_id \
      #v(0.5cm)
    ]
  ])
)
#pagebreak()
#block(breakable: false)[
== Project Details
/*
Instructions: Replace all [Enter...] placeholders with your content. Remove guidance text before submission. Keep the Project Charter to max 2 pages and the Project Plan to max 1 page (excluding evidence).
*/

#table(
  columns: (1fr,1fr),
  [*Field*], [*Your entry*],

  [Project ID / Project Name], [#project-name],
  [Client / Sponsor], [#teacher],
  [Team name], [ #team-name],
  [Team leader], [#students.at(0).name],
  [Deputy team leader], [#students.at(2).name],
  [Team members], [#students.map(s => s.name).join(", ")],
  [Submission date], [#due-date.display("[month repr:long] [day], [year]")],
  [Version], [#version],
  //[Modified at], [#last-edit-date.display("[day]/[month]/[year] [hour]:[minute]:[second]")]
)
]
== 1. Project Charter //(max 2 pages)

=== 1.1 Problem / Opportunity Statement
/*
Write a short situation + impact + why now description 
that a non-technical stakeholder can understand.
*/
#problem-opportunity-statement


=== 1.2 Objectives and Success Criteria //(3–6)
/*
List 3-6 objectives. Each objective must include a measurable success indicator
*/
#table(
  columns: (1fr,1fr),
  [*Objective*], [*Success measure (how you will know it is achieved)*],
  ..for ob in objectives-and-success-criteria {
    ( [ #ob.objective ], [ #ob.success-measure ] )
  }
)

=== 1.3 Stakeholders and Roles
/*
Identify who cares, who decides, who uses the outcome, 
and who must approve it.
*/
#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Stakeholder*], [*Role (care/decide/use/approve)*], 
  [*Responsibilities / interests*], [*Contact / channel*],

  ..for s in stakeholders {
    ( [ #s.stakeholder ], [ #s.role ], [ #s.responsibilities ], [ #s.contact ] )
  }
)

=== 1.4 Scope Boundaries (Current)
/*
Be explicit. Clear in-scope / out-of-scope boundaries help prevent scope creep.
*/
#table(
  columns: (1fr,1fr),
  [*In scope*], [*Out of scope*],

  ..for b in scope-boundaries {
    ( [ #b.in-scope ], [ #b.out-of-scope ] )
  }
)

=== 1.5 Constraints and Assumptions
/*
Include time, access, tools/licensing, compliance/privacy, 
skills, and other assumptions that affect feasibility.
*/
#table(
  columns: (1fr,1fr,1fr),
  [*Item*], [*Type (Constraint / Assumption)*], 
  [*Implication for approach / feasibility*],

  ..for con in constraints-and-assumptions {
    ( [ #con.item ], [ #con.type ], [ #con.feasibility ] )
  }
)

=== 1.6 Solution Context //(Project Type)
/*
Software projects: include a short product vision (who it is for, what it does, benefit). 
Non-software: define the target environment and evidence sources.
*/
==== Software Project Product Vision //(if applicable)

*For*: #product-vision.who-for

*The solution*: #product-vision.solution

*Provides*: #product-vision.provides

=== 1.7 High-Level Deliverables //(4–8)
/*
List tangible outputs you intend to produce 
(artefacts, prototype/demo, validation evidence).
*/
#table(
  columns: (1fr,1fr,1fr),
  [*Deliverable*], [*Description*], 
  [*Evidence of completion (what you will show)*],

  ..for d in highlevel-deliverables {
    ( [ #d.deliverable ], [ #d.description ], [ #d.evidence ] )
  }
)

=== 1.8 Definition of Success //(1–2 lines)
/*
Summarise what 'good looks like' at end of session as a client-ready statement.
*/

#definition-of-success

== 2. Project Plan //(max 1 page)

=== 2.1 Main Milestones (Phase Gates)

#table(
  columns: (1fr,1fr,1fr,1fr,1fr),
  [*Milestone / phase gate*], [*Target week/date*], 
  [*Deliverable/decision*], [*Owner*], [*Success evidence*],

  ..for m in main-milestones {
    ( [ #m.milestone ], [ #m.target-date ], [ #m.deliverable ], [#m.owner], [#m.success-evidence] )
  }
  
)

=== 2.2 Work Breakdown Summary (Major Work Streams)

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Work stream*], [*Description*], [*Owner*], [*Notes*],
  ..for w in work-breakdown-summary {
    ( [ #w.work-stream ], [ #w.description ], [#w.owner], [#w.notes] )
  }
  
)

=== 2.3 Schedule Snapshot (Key Dates Only)

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Week*], [*Key date*], 
  [*Major deadline / internal milestone*], [*Notes*],

  ..for s in schedule-snapshot {
    ( [ #s.week ], [ #s.key-date ], [ #s.major-deadline ], [#s.notes] )
  }
)

=== 2.4 Top 5 Risks and Mitigations

#table(
  columns: (1fr,1fr,1fr,1fr,1fr),
  [*Risk*], [*Likelihood*], [*Impact*], 
  [*Mitigation action*], [*Owner*],

  ..for r in risks-and-mitigations {
    ( [ #r.risk ], [ #r.likelihood ], [ #r.impact ], [#r.mitigation-action], [#r.owner] )
  }
)

=== 2.5 Communication Cadence

#table(
  columns: (1fr,1fr,1fr,1fr,1fr,1fr),
  [*Meeting / touchpoint*], [*Purpose*], [*Attendees*], 
  [*Frequency*], [*Artefact/output*], [*Tool/link*],
  
  ..for c in communication-cadence {
    ( [ #c.meeting-touchpoint ], [ #c.purpose ], [ #c.attendees ], [#c.frequency], [#c.artefact-output], [#c.tool-link] )
  }
)

=== 2.6 Change Control Approach// (1–2 sentences)
/*
Describe how changes will be proposed, assessed, 
and approved (including who approves).
*/
#change-control-approach

#pagebreak()

== 3. Workspace and Collaboration Evidence //(max 2 pages OR links + screenshots)
/*
Provide evidence that the team is set up to work effectively. 
You can paste links below and include screenshots as needed.
*/
=== Workspace Evidence Links

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Evidence item*], [*Link / location*], 
  [*Screenshot ref (if used)*], [*Notes*],

  ..for w in workspace-evidence-links {
    ( [ #w.evidence-item ], [ #w.link-location ], [ #w.screenshot-ref ], [#w.notes] )
  }
)


#pagebreak()
= Appendix

#show: appendix
// 2. List of markdown files to include
#let md_files = (
  "meeting-minutes/meeting-01.md", 
  "meeting-minutes/meeting-02.md", 
  "meeting-minutes/meeting-03.md",
  "meeting-minutes/meeting-04.md"
)

#for file in md_files [
  == #file
  #cmarker.render(read(file))
  #pagebreak(weak: true)
]
#let appendix_images = (
  (
    path: "figures/miro-board-setup.png", 
    caption: workspace-evidence-links.at(4).notes
  ),  
  (
    path: "figures/miro-board-onboarding.png", 
    caption: workspace-evidence-links.at(5).notes,
  ),
  (
    path: "figures/github-repo-overview.png", 
    caption: workspace-evidence-links.at(6).notes
  ),
  (
    path: "figures/miro-board-first-tasks.png", 
    caption: workspace-evidence-links.at(7).notes,
  ),
  (
    path: "figures/discord-chat.png", 
    caption: workspace-evidence-links.at(8).notes,
  ),

)

#for img in appendix_images [
  #figure(
    image(img.path, width: 90%),
    caption: img.caption,
  )
  #pagebreak(weak: true) // Optional: starts each image on a new page
]

/*
Evidence Items to Cover

- PM tool/board setup  
- Repository/artefact space  
- Onboarding (members added, roles set)  
- First tasks  
- First minutes  
- Evidence trail location  

Submission Checklist

- All placeholders replaced; guidance removed.  
- Project Charter within max 2 pages; Project Plan within max 1 page (excluding evidence section).  
- Milestones are phase gates (deliverables/decisions), not feature lists.  
- Risks are project-specific with clear owners and mitigations.  
- Links/screenshots show board, repo, artefact structure, onboarding and minutes.
*/