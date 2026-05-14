#import "@preview/cmarker:0.1.6"

#let version = "0.1"
#let last-edit-date = datetime(day: 11,month: 5,year: 2026, hour: 16, minute: 30, second: 0)
#let due-date = datetime(day: 15, month: 5, year: 2026)

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
#let subject-info = (
  subject-name: "Software Development 1",
  course-no: "ITC303 / ITC306",
  title: "Requirements Baseline & Technology Decision Pack",
  group-name: team-name,
  date-of-submission: due-date,
  institute: "Charles Sturt University",
  assessment-no: "Assessment item 2"
)
#let line-col = color.hsl(186deg, 56%, 55%)
#let info-box-bg-col = color.hsl(60deg, 88%, 75%, 57%)
#let info-box-border-col = color.hsl(60deg, 88%, 40%)
#let answer-box-bg-col = color.hsl(186deg, 56%, 75%, 57%)
#let answer-box-border-col = color.hsl(186deg, 56%, 55%)
#let image-box-bg-col = luma(90%)
#set page(margin: 2cm)
#set text(font: "Public Sans", size: 11pt)
#let frame(stroke) = (x, y) => (
  left: if x > 0 { 1pt } else { stroke },
  right: stroke,
  top: if y < 2 { stroke } else { 1pt },
  bottom: stroke,
)

#set table(
  fill: (_, y) => if calc.odd(y) { rgb("EAF2F5") },
  stroke: frame(1pt + rgb("21222C")),
)

#set page(
  footer: context [
    #line(length: 100%, stroke: line-col)
    #subject-info.title #h(1fr) #counter(page).display("1")
  ]
)

#let appendix(body) = {
  set heading(numbering: "A.1", supplement: [Appendix])
  counter(heading).update(0)
  body
}

#let info-box(info) = {
  /*box(
   info,
   inset: 4pt,
   fill: info-box-bg-col,
   stroke: info-box-border-col,
   width: 1fr,
  )*/
}

#let answer-box(answer) = {
  box(
   answer,
   inset: 4pt,
   fill: answer-box-bg-col,
   stroke: answer-box-border-col,
   width: 1fr
  )
}
#let image-box(path) = {
  box(
   image(path, width: 90%, fit: "contain"),
   inset: 10pt,
   fill: image-box-bg-col,
   stroke: answer-box-border-col,
   width: 1fr
  )
}


#let submission-checklist = (
  "Section 1 — Requirements baseline (requirements list, NFRs, acceptance criteria, constraints)☐",
  "Section 2 — Models and diagrams (appropriate to your project type)☐",
  "Section 3 — Technology shortlist and evaluation (decision matrix included)☐",
  "Section 4 — Feasibility evidence / spike results☐",
  "Section 5 — Updated project controls (milestones, risk register, change log)☐",
  "Section 6 — Appendix (team contributions summary + supporting evidence)☐",
)

// ---------------- Section 1 Variables ------------------------------

// 1.A Requirements List
#let requirements-list = (
  (
    no: "R01",
    requirement-user-story: "As a user, I want an intuitive user interface to view real-time public safety alerts on a map so that I can understand incidents near me without getting lost or confused.",
    priority: "Must",
  ),
  (
  no: "R02",
  requirement-user-story: "As a system, I want to ingest alert data from external RSS/API sources (e.g. NSW RFS, NSW SES, TFNSW) so that alerts are automatically retrieved and existing alerts are updated instead of duplicated.",
  priority:"Must",
),
  (
    no: "R03",
    requirement-user-story: "As a user, I want to filter alerts by region, council area, category, and severity and I want the page to remember my filter preferences so that I can see relevant alerts as soon as I open the page.",
    priority:"Must",
  ),
  (
    no: "R04",
    requirement-user-story: "As a user, I want to subscribe to alert filters using my email so that I receive notifications when relevant alerts occur.",
    priority:"Must",
  ),
  (
    no: "R05",
    requirement-user-story: "As a system, I want to send notification emails when alerts match user subscriptions so that users are informed promptly.",
    priority:"Must",
  ),
  (
    no: "R06",
    requirement-user-story: "As a user, I want to click an alert and view details including source link, status, and location so that I can verify the information.",
    priority:"Should",
  ),
  (
    no: "R07",
    requirement-user-story: "As a system, I want to store spatial data (marker points, polylines and polygons) so that alerts can be visualised accurately on a map.",
    priority:"Should",
  ),
  (
    no: "R08",
    requirement-user-story: "As a user, I want a platform that can be easily accessed anywhere at anytime with little to no latency or downtime and clear responsiveness.",
    priority:"Must",
  ),
)

// 1b. Non-Functional Requirements
#let non-functional-requirements = (
  performance: "The system must process and display new alerts within 60 seconds of retrieval from external sources. The system must support at least 500 concurrent users with response times under 3 seconds.",
  security: "All data in transit must be encrypted using HTTPS (TLS 1.2+). User email data must be securely stored and protected against unauthorised access. Input validation must prevent injection attacks.",
  usability: "The interface must be intuitive and usable by non-technical users of all abilities on all devices and screen sizes, with clear map-based visualisation and simple filtering options.",
  reliability-availability: "The system must achieve 99% uptime and handle failures in external APIs gracefully without crashing and provide clear intuitive error codes and messages when issues occur.",
  compliance-privacy: "The system must comply with the Australian Privacy Act 1988. User email addresses must only be used for alert notifications and not shared with third parties. All data utilised by the system must, at all times, comply with Australian copyright laws as outlined by the Copyright Act 1968. As the data used by the system is third party, the system will not hold copyright on any alerts data, only the source code.",
  other: "The system must be scalable to support additional alert sources across Australia. The system must be maintainable with modular architecture and documented APIs.",
)

// 1c. Acceptance Criteria
#let acceptance-criteria = (
  (
    no: "R01",
    acceptance-criterion: "Alerts are displayed on a map with markers and polygons / polylines",
    how-to-test-verify: "Load the system and verify alerts appear visually on the map with correct coordinates",
  ),
  (
    no: "R02",
    acceptance-criterion: "System successfully retrieves and stores alerts from at least one external RSS/API source and repeats periodically",
    how-to-test-verify: "Run ingestion process and verify alerts are stored in database with correct fields then wait for the predetermined period of time to observe if the process repeats and updates the database",
  ),
  (
    no: "R03",
    acceptance-criterion: "Users can filter alerts by region, council area, category, and severity",
    how-to-test-verify: "Apply filters and verify only matching alerts are displayed",
  ),
  (
    no: "R04",
    acceptance-criterion: "Users can create a subscription using email and selected filters",
    how-to-test-verify: "Submit subscription form and verify record is stored in database",
  ),
  (
    no: "R05",
    acceptance-criterion: "Notification email is sent when a new alert matches a subscription",
    how-to-test-verify: "Trigger matching alert and confirm email is received",
  ),
)

// 1d. Constraints and Dependencies
#let constraints-and-dependencies = (
  constraints: (
    "Project must be completed within university timeline (limited development time)",
    "Limited hosting budget (prefer free-tier/cloud solutions)",
    "System must use technologies familiar to the team (Node.js, MySQL)",
    "Alerts from different sources may result in compatibility issues with the existing front/backend",
    "Large number of alerts need to be handled and stored leading to potentially response delays and storage constraints"
  ),
  external-dependencies: (
    "Availability and reliability of external alert sources (NSW RFS, NSW SES, TFNSW)",
    "Internet connectivity for API/RSS retrieval",
    "Email service provider for sending notifications (e.g., SMTP or third-party API)",
    "Third party software libraries, packages and APIs",
    "Storing user emails is subject to the Australian Privacy Act and Spam Act 2003",
    "Each data source has a different terms of service and access can be revoked at any time",
  ),
  additional-notes-on-contraints-dependencies: "1.Strict time constraint of two academic sessions (Session 1 and 2) i.e. features need to be priority based. 
  
2. Absolutely free and open-source software stack needed; no money to spend on high-quality APIs or managed database selections.

3. The stability of the public APIs and RSS Feeds (TFNSW, NSW RFS); rate limits by these government bodies.

4. Availability of the host environment (e.g., student VM or cloud tiers constraints on compute power)."
)

// ---------------- Section 2 Variables ------------------------------
// 2a. Project Type
#let project-type = box([X]) + text(weight: "bold")[ Software Project]

// 2b. Diagrams
#let diagrams = (
  (
    title:"Use Cases",
    path: "A2-images/figures/diagrams/use-cases-diagram.png",
    description: "Separates the Interaction between the normal users:
- General Public, (searching and viewing alerts) and system administration (managing the background pipeline and feeds).",
  ),
  (
    title:"System Architecture",
    path: "A2-images/figures/diagrams/system-architecture-diagram.png",
    description: "This diagram shows the macro architecture. Data is processed by a scheduled Ingestion Engine which queries external sources and standardises the data and stores it in the relational database. This data is then accessed by the Web interface using the Backend API easily.",
  ),
  (
    title:"Database ERD",
    path: "A2-images/figures/diagrams/ERD-diagram.png",
    description: "- The schema is designed to support heterogeneous alert feeds while maintaining a standardised core alert structure.

- ALERTS stores standardised alert data from multiple external sources.

- REGIONS, COUNCIL_AREAS, and LOCATIONS support geographic filtering.

- ALERTS_TO_REGIONS allows alerts to affect multiple regions.

- ALERT_MARKERS and ALERT_POLYGONS store geospatial map data.

- Source-specific information is handled using dedicated supporting tables.

- Users can subscribe to filtered alerts and receive notifications.",
  ),
  (
    title:"Class Diagram",
    path: "A2-images/figures/diagrams/class-diagram.svg",
    description: "This diagram shows the structure and inheritance of the alert class that define the alert objects. It details what fields are required and how they are inherited from the parent.",
  ),
  (
    title:"Wireframe",
    path: "A2-images/figures/diagrams/wire-frame-final.png",
    description: "The main view is an alert list on the left and an interactive map on the right. Selecting an alert highlights the corresponding pin on the map and clicking the pin opens a modal with more detail, a source link, and the option to subscribe to that individual alert. Active filters are displayed in a bar at the top and can be saved as search patterns, accessible later through the My Searches section. The bell icon opens Alert Preferences where users can set broader subscription rules by region and alert type, delivered via email. A pinned warning area at the bottom of the sidebar displays critical alerts when something severe is happening and stays empty otherwise.",
  ),
)

// ---------------- Section 3 Variables ------------------------------
// 3a. Options Considered
#let options-considered = (
  option-a: (
    name: "Option A",
    description: "Backend: Node.js (express.js)
Frontend: Next.js (React.js)
DB: SQLite for local development and testing, with planned migration to MySQL for deployment",
    fit-to-requirements: "5 - Strong fit for API ingestion, real-time updates, and relational data and clean, responsive, dynamic UI and UX",
    security: "5 - Great Async Handling and strong built in data/JSON handling",
    cost: "5 - Open-source, low hosting cost",
    team-skills: "4 - Team familiarity with JavaScript",
    integration-effort: "5 - Easy, reliable, well documented and industry standard development with user friendly packages",
    scalability: "4 - Highly scalable, event driven, object and component orientated development",
    supportability: "5 - Wide range of public and commercial packages and ease of custom middleware development and customisability at all levels",
    score: "33",
  ),
  option-b: (
    name: "Option B",
    description: "Backend: Python (Django/Flask), 
Frontend: HTML/JS + Jinja/Templates, 
DB: PostgreSQL",
    fit-to-requirements: "4 - Good for structured apps but heavier for real-time ingestion",
    security: "5 - Excellent data/JSON manipulation libraries",
    cost: "5 - Open-source",
    team-skills: "3 - Familiar with most of the team",
    integration-effort: "4 - Fast API dev with DRF/Flask-REST",
    scalability: "4 - Scales effectively with configuration",
    supportability: "5 - Strong community",
    score: "30",
  ),
  option-c: (
    name: "Option C",
    description: "Backend: PHP (Laravel)
Frontend: Blade Templates
DB: MySQL",
    fit-to-requirements: "2 - Poor and complex implementation of certain features, reduced performance, lack of modularity, lack of control",
    security: "3 - Adequate, standard backend",
    cost: "5 - Open-source",
    team-skills: "2 - Low familiarity with PHP",
    integration-effort: "3 - Slightly heavier overhead",
    scalability: "3 - Weighty, can scale but resource heavy",
    supportability: "4 - Laravel has good built-in mitigations",
    score: "22",
  ),
)

// 3c. Final Recommendation and justification
#let final-recommendation-justification = (
  recommendation-option: options-considered.option-a.name,
  justification: options-considered.option-a.name + " was selected as it provides the best overall balance between functionality and performance and is most appropriate for the team's current skill level. SQLite will be used during early development to simplify local testing for each team member, while MySQL is planned for the final deployment environment due to better scalability and multi-user support. MySQL was selected as the database for the final release as all alert data is normalized and follows a consistent structure (as demonstrated in the ERD design). SQLite will be utilized during development to provide each team member local access to the database until the team can secure a web-hosting server. For the front-end, Next.js is ideal for a growing UI with many moving parts like modals, and an interactive map that can be organized using React's state management. Next.js also supports dynamic imports necessary for map rendering. For the back-end, Node.js was selected as it supports asynchronous processing, this prevents a slow or unavailable data source from stalling the entire system.  The team's familiarity with JavaScript also reduces the risk and time-commitment involved in learning a new technology, such as Django.",
)

// ---------------- Section 4 Variables ------------------------------
// 4a. What We Tested
#let feasibility-evidence = ( 
  tests: ( 
    (
      name: "Database Ingestion POC Test",
      what-we-tested: "A proof-of-concept (PoC) was developed to validate the feasibility of ingesting and storing real-world alert data from multiple sources.
A Node.js script was implemented to:

- Read alert data from JSON files (NSW RFS and TFNSW examples)

- Parse and transform the data into a standardised structure

- Insert the data into a MySQL database based on the designed ERD
The PoC specifically tested:

- Ingestion of heterogeneous data formats from different providers

- Storage of geospatial data (marker points, polygons, and polylines)

- Handling of optional and source-specific attributes

- Prevention of duplicate alerts using a unique identifier",
      results: "The PoC was successful and demonstrated that:

- Alert data from both NSW RFS and TFNSW was successfully ingested and stored in the database

- The system correctly handled different geospatial formats:
  
  - Polyline data (TFNSW)
  
  - Polygon data (NSW RFS)

- Marker points and spatial data were inserted into their respective tables without errors

- Alerts were uniquely identified using an external identifier, preventing duplicate records

- Re-running the ingestion script confirmed that duplicate alerts were detected and skipped

No major technical issues were encountered. Minor inconsistencies in field structure across sources were resolved through conditional parsing logic.
",
      what-we-learned: "- External alert feeds vary significantly in structure and require flexible parsing logic

- Geospatial data is represented differently across sources (e.g., polygon vs polyline), requiring a normalised storage approach

- Separating spatial data into dedicated tables improves flexibility and supports accurate map visualisation

- Implementing duplicate detection using a unique identifier is essential for maintaining data integrity

- Storing raw source data supports debugging and future schema adjustments",
      what-changed-as-a-result: "- The database design was refined to better support multiple geospatial formats (polygons and polylines)

- The ingestion approach now includes a transformation layer to standardise incoming data before storage

- Additional fields (e.g., planned, delay, start_date, end_date) were validated as necessary for transport-related alerts

- The use of a unique external identifier for alerts was confirmed as critical to prevent duplication

- Confidence in the selected technology stack (Node.js and MySQL) was validated",
    ),
    (
      name: "Backend API POC Test",
      what-we-tested:"A proof of concept backend and API was developed to test the process of retrieving datasets from the required external endpoints (NSW RFS, NSW SES, TFNSW), preparing the data for ingestion and having the data accessible via API endpoints. Endpoints were created for fire alerts and traffic alerts. These endpoints ran functions that collected the data and converted them to alert objects and sent them as an API response.",
      results: "The backend functions and API were successful at retrieving the data and sending it to the frontend in a usable JSON object format. Each API endpoint returned JSON containing the array of each alert type (fire, traffic).

The API successfully returned the JSON containing an array of alerts for both NSW RFS and TFNSW that can be remotely called upon and contains the relevant data to display on a Google Map",
      what-we-learned: "- latency issues caused by an overwhelming number of markers and polygons being loaded at once

- differing data from each data source requires different normalisation for each alert type",
      what-changed-as-a-result: "- Loading data to the map will be done procedurally  to reduce load

- Use of marker clusters on the map to reduce graphic load when rendering the map",
      ),
    (
      name: "Frontend POC Test",
      what-we-tested:"Created a simple web based front end that connects to a MySQL database via a Node.js Express backend to display normalised alerts as an interactable list. Clicking an alert in the list highlights the corresponding pin on a static map of NSW. The pin can then be clicked to open a modal with further details about the alert. Also put together a static map of NSW with pins as a visual mockup as a proof of concept. This PoC was also used to evaluate the proposed page layout and see whether screen real-estate is being used effectively. The test was built using vanilla HTML, CSS and JS to keep it simple and just prove the whole thing works end to end. Data flows from the database through the backend (Node.js) and into the UI. Next.js is confirmed for the actual build. Researched best method for saving user preferences and filter settings without a server or user account function.",
      results: "The main flow works as alerts can successfully be retrieved from the database, displayed in the alert list and passed to the modal to show the correct information. The static map works visually but not functionally as pins need to be absolutely positioned over the map, which results in incorrect positioning if the map container or window change in size. This is a clear limitation of vanilla HTML/CSS/JS. An interactive map library like leaflet or API like Google is better suited to dynamic elements like a live map. The page layout sufficiently holistically incorporates all of the necessary features and requirements as part of a single UI, while remaining easy to navigate and readable. ",
      what-we-learned: "Setting up a Node.js server and connecting it to MySQL was simpler than expected. Vanilla JS gets difficult to manage quickly once multiple elements need to stay in sync. Positioning pins over a static image confirmed that a proper mapping library is needed as absolute positioning breaks when the container size changes. With only 4 alerts performance was fine but rendering a large number of alerts, pins and modals without state management could become an issue. Browser storage can be used to maintain some user data (like preferences and filter settings) without a server but is not a reliable long-term solution due to high likelihood of data loss. Our system layout was inspired by existing systems, which is tried and tested and fit for purpose.",
      what-changed-as-a-result: "Technology Decisions

- The limitations of positioning pins over a static map demonstrates the need for a mapping library (like leaflet) for the actual build that fits the project constraints while also meeting the requirements
  
- Next.js and React were confirmed for the actual build as vanilla JS becomes increasingly difficult to maintain even for a small project, due to the lack of structure and state management. In React, selecting an alert automatically updates the card, the pin and the modal without having to manually connect each element together",
    ),
  ),  
)

// ---------------- Section 5 Variables ------------------------------
// 5a. Milestones / Plan Snapshot (Post-Decision, Rolling-Wave)
#let milestones-snapshot = (
  (
    milestone-deliverable: "Assignment 2 Completion",
    key-tasks: "Finalise requirements, diagrams, and technology justification",
    due-date: due-date,
    owner: "Whole team",
  ),
  (
    milestone-deliverable: "Assignment 2 Submission",
    key-tasks: "Final submission via Brightspace
",
    due-date: due-date,
    owner: students.at(0).name,
  ),
  (
    milestone-deliverable: "Sprint 1 (Core Backend)",
    key-tasks: "Database setup, ingestion script, basic API endpoints",
    due-date: datetime(day: 22, month: 5, year: 2026),
    owner: students.at(0).name + "\n" + students.at(2).name,
  ),
  (
    milestone-deliverable: "Sprint 2 (Filtering & UI)",
    key-tasks: "Implement filtering (region/category), basic frontend",
    due-date: datetime(day: 29, month: 5, year: 2026),
    owner: students.at(1).name + "\n" + students.at(3).name,
  ),
  (
    milestone-deliverable: "Sprint 3 (Notifications)",
    key-tasks: "Implement email notifications, subscription logic, and frontend integration",
    due-date: datetime(day: 5, month: 6, year: 2026),
    owner: "Whole team",
  ),
  (
    milestone-deliverable: "Assignment 4 Submission",
    key-tasks: "Client-Ready solution architecture & demonstration. Final deliverable: Prototype, demonstration of the system.",
    due-date: datetime(day: 12, month: 6, year: 2026),
    owner: "Whole team",
  ),
)

// 5b. Risk Register
#let risk-register = (
  (
    id: "R01",
    description: "Inconsistent external data formats",
    likelihood: "High",
    impact: "High",
    mitigation: "Implement transformation layer to standardise incoming data; validate fields before insertion",
  ),
  (
    id: "R02",
    description: "Missing or incomplete Data from Sources",
    likelihood: "Medium",
    impact: "Medium",
    mitigation: "Use optional fields and default values; store raw payload for fallback and debugging",
  ),
  (
    id: "R03",
    description: "Duplicate alerts from Data Feeds
",
    likelihood: "High",
    impact: "Medium",
    mitigation: "Use external_id to detect and prevent duplicate inserts",
  ),
  (
    id: "R04",
    description: "Integration complexity across multiple sources",
    likelihood: "Medium",
    impact: "High",
    mitigation: "Modular ingestion design; isolate source-specific logic",
  ),
  (
    id: "R05",
    description: "The users' filter preferences are saved locally in the browser and can be lost if the browser data is reset or a the system is accessed from a different device.",
    likelihood: "High",
    impact: "Low",
    mitigation: "Make the user aware that certain actions will lead to loss of preferences and document it as a known constraint",
  ),
  (
    id: "R06",
    description: "High concurrent database access may reduce system performance",
    likelihood: "Low",
    impact: "High",
    mitigation: "Use database connection pooling and query optimisation to handle concurrent requests efficiently",
  ),
  (
    id: "R07",
    description: "The project will utilize the free version of Google's 'Maps' API, limited to 28500 map loads per month",
    likelihood: "Low",
    impact: "Low",
    mitigation: "Increase budget or limit the amount of times that the map is rendered, Leaflet/OpenStreetMap may be used if Google Maps usage limits become restrictive.",
  ),
  (
    id: "R08",
    description: "Unauthorised access to user data could theoretically be used to track someone's location to a specific town",
    likelihood: "Low",
    impact: "High",
    mitigation: "Restrict database access, encrypt data in transit using HTTPS, and minimise stored personal data to only required email addresses.",
  ),
  (
    id: "R09",
    description: "Denial of Service attacks",
    likelihood: "Low",
    impact: "High",
    mitigation: "Rate limiting",
  ),
)

// 5c. Change Log
#let change-log = (
  (
    date: datetime(day: 19, month: 4, year: 2026),
    change-by: students.at(2).name,
    description-of-change: "Amended the Google Map to incorporate marker clustering",
    reason-impact: "Will reduce graphical load when rendering the map to improve frontend load times",
  ),
  (
    date: datetime(day: 19, month: 4, year: 2026),
    change-by: "Whole team",
    description-of-change: "Swapped priorities of traffic and weather alerts to focus on traffic",
    reason-impact: "Difficulty reliably accessing weather data, traffic alerts will be preferred for the initial prototype",
  ),
  (
    date: datetime(day: 20, month: 4, year: 2026),
    change-by: students.at(0).name,
    description-of-change: "Introduced source-specific tables (ALERT_ROADS, ALERT_ADVICE, ALERT_LINKS)",
    reason-impact: "Allows flexible handling of different data structures (e.g., TFNSW vs NSW RFS)",
  ),
  (
    date: datetime(day: 25, month: 4, year: 2026),
    change-by: students.at(0).name,
    description-of-change: "Added raw_payload field to ALERTS table",
    reason-impact: "Supports debugging, traceability, and future schema evolution",
  ),
  (
    date: datetime(day: 08, month: 5, year: 2026),
    change-by: "Whole team",
    description-of-change: "Use of SQLite for local development",
    reason-impact: "To simplify local testing for each team member in the development stage of the project",
  ),
  (
    date: datetime(day: 08, month: 5, year: 2026),
    change-by: "Whole team",
    description-of-change: "Development database strategy updated",
    reason-impact: "SQLite selected for lightweight local development and testing, with MySQL retained as the planned production database for scalability and concurrent access support",
  ),
)

// ---------------- Section 6 Variables ------------------------------
// 6a. Team Contributions Summary
#let team-contributions-summary = (
  (
    name: students.at(0).name,
    contributions: "1 - 6",
    summary: "- Led the overall coordination and submission of the assignment. 

- Contributed ideas to and helped refine all team answers to each section.

- Designed and implemented the database schema (ERD), ensuring it supports multiple data sources and geospatial data. 

- Developed the database ingestion proof-of-concept, including parsing and storing real-world alert data (NSW RFS and TFNSW) in MySQL. 

- Contributed to requirements definition, technology evaluation, feasibility analysis, and project planning sections. 

- Assisted with Team Meeting notes

- Reviewed and integrated team contributions into the final document."
  ), 
  (
    name: students.at(1).name,
    contributions: "1 - 6",
    summary: "- Contributed ideas to and helped refine all team answers to each section.

- Wireframe created using whimsical - constraints, requirements, front-end testing, risk register, technology choice and justification.

- Creation of vanilla html/css/js prototype and testing the entire core pipeline passing data from MySQL to a front-end via a node.js backend

- Assisted with Team Meeting notes"
  ), 
  (
    name: students.at(2).name,
    contributions: "1 - 6",
    summary: "- Contributed ideas to and helped refine all team answers to each section.

- Selected our chosen tech stack for the development of the project.

- Developed the first iteration of the backend express.js api prototype to collect alert data from external sources (NSW RFS rss feed and TFNSW api) and to process the data to collect the data relevant to our use case to populate an alerts objects that can later be ingested into the database.

- Developed the first iteration of the prototype for the frontend Google Maps implementation using next.js to display markers and polygons for all alerts retrieved from the backend api.

- Assisted with Team Meeting notes"
  ), 
  (
    name: students.at(3).name,
    contributions: "1 - 6",
    summary: "- Contributed ideas to and helped refine all team answers to each section.

- Developed key aggregator features and NFRs supported by references to academic literature.

- Created technical architecture and Use Cases/System Artitecture diagrams via Mermaid.

- Completed risk mitigation in Section 5.

- Assisted with Team Meeting notes"
  ), 
)

// 6b. Supporting Evidence
#let supporting-evidence = (
  (
    evidence-item: "Database Alerts Table",
    description: "Evidence of the database alerts table after data ingestion test",
    path: "A2-images/figures/mySQL-ingestion-POC-tests/json-ingestion-test-mysql-alerts-table.png",
  ),
  (
    evidence-item: "Database Alert Markers Table",
    description: "Evidence of the database alert markers table after data ingestion test",
    path: "A2-images/figures/mySQL-ingestion-POC-tests/json-ingestion-test-mysql-alert-markers-table.png",
  ),
  (
    evidence-item: "Database Alert Polygons Table",
    description: "Evidence of the database alert polygons table after data ingestion test",
    path: "A2-images/figures/mySQL-ingestion-POC-tests/json-ingestion-test-mysql-alert-polygons-table.png",
  ),
  (
    evidence-item: "Database ingestion POC tests results",
    description: "Shows the results of the Database Ingestion POC Tests",
    path: "A2-images/figures/mySQL-ingestion-POC-tests/json-ingestion-test-vscode-output.png",
  ),
  (
    evidence-item: "Backend API POC map test",
    description: "Shows a google map view of NSW with alert markers pinned on the map",
    path: "A2-images/figures/backend-POC/google-map-marker-test.png",
  ),
  (
    evidence-item: "NSW RFS data ingested for backend API POC test",
    description: "Shows a sample of the NSW RFS alert ingested into the backend",
    path: "A2-images/figures/backend-POC/rfs-alert-data.png",
  ),
  (
    evidence-item: "TFNSW data ingested for backend API POC test",
    description: "Shows a sample of the TFNSW alert ingested into the backend",
    path: "A2-images/figures/backend-POC/traffic-alert-data.png",
  ),
  (
    evidence-item: "Frontend POC test layout result",
    description: "Shows the result of the frontend POC layout test",
    path: "A2-images/figures/frontend-POC/alert-page-layout.png",
  ),
  (
    evidence-item: "Frontend POC test alert detail view result",
    description: "Shows the result of the frontend POC alert detail view test",
    path: "A2-images/figures/frontend-POC/alert-detail-view.png",
  ),  
)


// ---------------- Title page ---------------------------------------
#v(10em)
#align(center)[#text(24pt)[*#project-name.slice(11)*]]
#align(center + horizon)[
  #set text(18pt, luma(30%))
  Course: #subject-info.subject-name - #subject-info.course-no \
  #subject-info.assessment-no - Group Project : #subject-info.title \
  Due Date: #due-date.display("[month repr:long] [day], [year]") \
  
  Author: #team-name \
  Institute: #subject-info.institute \
  
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

// ----------------- File --------------------------------------------
#set page(
  header: context [
    #subject-info.course-no #h(1fr) Group: #team-name
    #line(length: 100%, stroke: line-col)
  ]
)
#table(
  columns: (1fr,1fr),
  [Subject Code], [#subject-info.course-no],
  [Assignment], [#subject-info.title],
  [Team name], [ #team-name],
  [Project Title], [#project-name],
  [Team members], [#students.map(s => s.name).join(", ")],
  [Submission date], [#due-date.display("[month repr:long] [day], [year]")],
  //[Modified at], [#last-edit-date.display("[day]/[month]/[year] [hour]:[minute]:[second]")]
)


/*
== Submission Checklist

#for sec in submission-checklist [
  - #sec
]
*/
// ----------------- Section 1 -------------------------------------
= Section 1 — Requirements Baseline

#info-box(
  "[] Complete all four sub-sections below. Be specific enough that another team could understand what must be delivered and how success will be verified."
)

== 1a. Requirements List (Prioritised)

#info-box(
  "💡 Software: functional requirements / user stories / capabilities. Non-software: capability + control requirements. \nUse MoSCoW prioritisation."
)

#table(
  columns: (auto, 1fr, auto),
  [*\#*], [*Requirement / User Story*], 
  [*Priority (MoSCoW)*],
  ..for r in requirements-list {
    ( [ #r.no ], [ #r.requirement-user-story ], [ #r.priority ], )
  }
)

== 1b. Non-Functional Requirements
#info-box(
  "💡 Cover: performance, security, usability, reliability, compliance/privacy, and any other relevant NFRs."  
)
#block(breakable: false)[
  === Performance Requirements
  #answer-box(
    non-functional-requirements.performance
  )
  
  === Security Requirements
  #answer-box(
    non-functional-requirements.security
  )
  
  === Usability Requirements
  #answer-box(
    non-functional-requirements.usability
  )
  
  === Reliability / Availability
  #answer-box(
    non-functional-requirements.reliability-availability
  )
  
  === Compliance / Privacy
  #answer-box(
    non-functional-requirements.compliance-privacy
  )
  
  === Other Non-Functional Requirements
  #answer-box(
    non-functional-requirements.other
  )
]


== 1c. Acceptance Criteria
#info-box(
  "💡 Provide clear 'how we will test/verify' statements for each major requirement."
)
#block(breakable: false)[
  #table(
    columns: (auto, 1fr, 1fr),
    [*Req\#*], [*Acceptance Criterion*], [*How to Test / Verify*],
    
    ..for a in acceptance-criteria {
      ( [ #a.no ], [ #a.acceptance-criterion ], [ #a.how-to-test-verify ], )
    }
  )
]


== 1d. Constraints and Dependencies

#info-box(
  "💡 List key constraints (technology, budget, time, legal) and external dependencies that affect delivery."
)

#table(
  columns: (1fr, 1fr),
  [*Constraints*], [*External Dependencies*],
  
  // Calculate how many rows we need based on the longest list
  ..let c_count = constraints-and-dependencies.constraints.len(),
  ..let d_count = constraints-and-dependencies.external-dependencies.len(),
  ..for i in range(calc.max(c_count, d_count)) {
    (
      if i < c_count [#constraints-and-dependencies.constraints.at(i)] else [],
      if i < d_count [#constraints-and-dependencies.external-dependencies.at(i)] else []
    )
  }
)
 
=== Additional notes on constraints / dependencies
#answer-box(
  constraints-and-dependencies.additional-notes-on-contraints-dependencies
)


// ----------------- Section 2 -------------------------------------

= Section 2 — Models and Diagrams

#info-box("💡 Include only diagrams that clarify your requirements and decisions. Quality matters more than quantity. You may insert images or draw diagrams directly into this section. If you need to add additional diagrams, use copy-paste to create more boxes")

== 2a. Project Type
//Software Project☐ Non-Software / Cyber / Network Project☐
#project-type

== 2b. Diagrams

#info-box("💡 Software projects: use cases/user stories, two key UML diagrams, basic ERD/wireframes. Non-software: system context, DFD/architecture, threat/risk summary, control architecture.")

#grid(
  for i in range(diagrams.len()) {
    block(breakable: false)[
      === Diagram #str(i + 1) - Title:\ \
      #answer-box(diagrams.at(i).title) \ \
      #image-box(diagrams.at(i).path) \
      === Brief description / key points for Diagram #str(i + 1) \
      #answer-box(diagrams.at(i).description) \ \
    ]
  }
)

// ----------------- Section 3 -------------------------------------

= Section 3 — Technology Shortlist and Evaluation

#info-box("💡 Shortlist 2–3 options that were realistically considered. Use the decision matrix to compare them systematically, then provide your recommendation with justification.")

== 3a. Options Considered

#table(
  columns: (1fr, 1fr),
  [*Option A — Name / Description*], [#options-considered.option-a.name #options-considered.option-a.description],
  [*Option B — Name / Description*], [#options-considered.option-b.name #options-considered.option-b.description],
  [*Option C — Name / Description*], [#options-considered.option-c.name #options-considered.option-c.description],
)

== 3b. Decision Matrix / Trade-off Analysis

#info-box("💡 Score each option against the evaluation criteria (e.g., 1–5 or Low/Med/High). Add or remove rows to fit your project.")
#block(breakable: false)[
  #table(
    columns: (1fr, 1fr, 1fr, 1fr),
    [*Evaluation Criterion*], [*Option A*], [*Option B*], [*Option C*],
    [*Fit to requirements*], [#options-considered.option-a.fit-to-requirements], [#options-considered.option-b.fit-to-requirements], [#options-considered.option-c.fit-to-requirements],
    [*Security*], [#options-considered.option-a.security], [#options-considered.option-b.security], [#options-considered.option-c.security],
    [*Cost*], [#options-considered.option-a.cost], [#options-considered.option-b.cost], [#options-considered.option-c.cost],
    [*Team Skills*], [#options-considered.option-a.team-skills], [#options-considered.option-b.team-skills],[#options-considered.option-c.team-skills],
    [*Integration Effort*], [#options-considered.option-a.integration-effort], [#options-considered.option-b.integration-effort], [#options-considered.option-c.integration-effort],
    [*Scalability*], [#options-considered.option-a.scalability], [#options-considered.option-b.scalability], [#options-considered.option-c.scalability],
    [*Supportability*], [#options-considered.option-a.supportability], [#options-considered.option-b.supportability], [#options-considered.option-c.supportability],
    [*OVERALL SCORE / RANK*], [#options-considered.option-a.score], [#options-considered.option-b.score], [#options-considered.option-c.score],
  )
]


== 3c. Final Recommendation and Justification

=== Recommended Option:
#answer-box(final-recommendation-justification.recommendation-option)

=== Justification:
#answer-box(final-recommendation-justification.justification)

// ----------------- Section 4 -------------------------------------

= Section 4 — Feasibility Evidence

#info-box("💡 Describe the spike, PoC, or validation activity you completed to prove your recommended approach is workable. All four fields below are required.")

#grid(
  for i in range(feasibility-evidence.tests.len()) {
    block(breakable: false)[
     == POC #str(i + 1) - Title:\
    #answer-box(feasibility-evidence.tests.at(i).name) \ \ 
    ]
    block(breakable: false)[
     == 4a. What We Tested - POC #str(i + 1) \
      #answer-box(feasibility-evidence.tests.at(i).what-we-tested) \ \
    ]
    block(breakable: false)[
     == 4b. Results - POC #str(i + 1) \
      #answer-box(feasibility-evidence.tests.at(i).results) \ \
    ]
    block(breakable: false)[
     == 4c. What We Learned - POC #str(i + 1) \
      #answer-box(feasibility-evidence.tests.at(i).what-we-learned) \ \
    ]
    block(breakable: false)[
     == 4d. What Changed as a Result - POC #str(i + 1) \
      #answer-box(feasibility-evidence.tests.at(i).what-changed-as-a-result) \ \ 
    ]       
  },
  block(breakable: false)[
    == Overall Conclusion: \
    #answer-box("Overall, the feasibility testing validated the proposed architecture, confirmed that the selected technologies are suitable for the final prototype, and reduced implementation risk by proving the end-to-end ingestion, storage, API, and frontend workflow.")
  ]  
)


// ----------------- Section 5 -------------------------------------

= Section 5 — Updated Project Controls
#info-box("💡 These should reflect your decisions and learning from this assignment. All three sub-sections are required.")

#block(breakable: false)[
  == 5a. Milestones / Plan Snapshot (Post-Decision, Rolling-Wave)
  #info-box("💡 Show a rolling-wave plan: detailed for the next 2–3 weeks, high-level for the remainder of the session.")
  
  #table(
    columns: (auto, 1fr, auto, auto),
    [*Milestone / Deliverable*], [*Key Tasks*], [*Due Date*], [*Owner(s)*],
  
    ..for m in milestones-snapshot {
      ([#m.milestone-deliverable], [#m.key-tasks], [#m.due-date.display("[day]/[month]/[year]")], [#m.owner])
    }
  )
]

#block(breakable: false)[
  == 5b. Risk Register (Updated)
  #info-box("💡 Update from A1. Add new technical and feasibility risks identified since your spike/PoC. Include mitigations for each.")
  
  #table(
    columns: (auto, 1fr, auto, auto, 1fr),
    [*Risk ID*], [*Risk Description*], [*Likelihood*], [*Impact*], [*Mitigation*],
    ..for r in risk-register {
      ([#r.id], [#r.description], [#r.likelihood], [#r.impact], [#r.mitigation],)
    }
  )
]

#block(breakable: false)[
  == 5c. Change Log
  #info-box("💡 Record what has changed since Assignment 1 and why. This demonstrates reflective practice.")
  
  #table(
    columns: (auto, auto, 1fr, 1fr),
    [*Date*], [*Change By*], [*Description of Change*], [*Reason / Impact*],
    ..for c in change-log {
      ([#c.date.display("[day]/[month]/[year]")], [#c.change-by], [#c.description-of-change], [#c.reason-impact],)
    }
  )
]

// ----------------- Section 6 -------------------------------------

= Section 6 — Appendix
#info-box("💡 Maximum 6 pages. Must include team contributions (max ½ page). Remaining space: screenshots, logs, config snippets, extended decision matrix, extra diagrams, traceability tables, test results, meeting notes, etc.")

== 6a. Team Contributions Summary
#info-box("💡 Required. No more than half a page. Describe each team member's specific contributions to this assignment.")

#table(
  columns: (auto, 1fr, 1fr),
  [*Student Name*], [*Sections Contributed To*], [*Summary of Contributions*],
  ..for s in team-contributions-summary {
    ([#s.name], [#s.contributions], [#s.summary],)
  }
)

== 6b. Supporting Evidence
#info-box("💡 Add screenshots, logs, configuration snippets, test results, meeting notes, or any other supporting material below. Label each item clearly. Add sections as needed")

#for i in range(supporting-evidence.len()) {
  block(breakable: false)[
    === Evidence Item #(i + 1) - Label / Description: \
    #answer-box(supporting-evidence.at(i).description) \ \
    #image-box(supporting-evidence.at(i).path) \ \
  ]
}

#pagebreak()
= Appendix

#show: appendix
// 2. List of markdown files to include
#let md_files = (
  "/A2-images/meeting-minutes/meeting-05.md", 
  "/A2-images/meeting-minutes/meeting-06.md", 
  "/A2-images/meeting-minutes/meeting-07.md",
)

#for file in md_files [
  == #file
  #cmarker.render(read(file))
  #pagebreak(weak: true)
]