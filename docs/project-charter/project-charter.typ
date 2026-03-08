#let CUR_STUDENT = "Ett"
#let students = (
  (
    name: "Ettore Vescio",
    email: link("mailto:tv00047@gmail.com"),
    student_id: [11799221]
  ),
  (
    name: "Christian Finocchiaro",
    email: link("cajfino@gmail.com"),
    student_id: [11854560]
  ),
  (
    name: "Thomas Smith",
    email: link("mailto:thomas1134smith@gmail.com"),
    student_id: [12345678]
  ),
  (
    name: "Pradip Pandey",
    email:link("pradippandey555@gmail.com"),
    student_id: [12345678]
  ),  
)
#let current_student = students.find(d => d.name.contains(CUR_STUDENT))

#set page(margin: 2.5cm)
#set text(font: "Public Sans", size: 11pt)
#set page(footer: context [
  #current_student.name #h(1fr)
  #counter(page).display("1") #h(1fr)
  #current_student.student_id
])
#v(10em)
#align(center)[#text(24pt)[*Public Safety Alerts Aggregator & Explorer*]]
//#align(center)[April 2024]
#align(center + horizon)[
  #set text(18pt, luma(30%))
  Course: Software Development 1  - ITC303 / ITC306 \
  Assessment item 1 - Group Project : Project Charter and Plan \
  Due Date: 29 March 2026 \
  
  Author: #current_student.name \
  Student ID: #current_student.student_id \
  Institute: Charles Sturt University \
  
  Instructor: Jason Howarth \
  
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

== Project Details
/*
Instructions: Replace all [Enter...] placeholders with your content. Remove guidance text before submission. Keep the Project Charter to max 2 pages and the Project Plan to max 1 page (excluding evidence).
*/

#table(
  columns: (1fr,1fr),
  [*Field*], [*Your entry*],

  [Project ID / Project Name], [[Enter here]],
  [Client / Sponsor], [[Enter here]],
  [Team name], [[Enter here]],
  [Team leader], [#students.at(0).name],
  [Deputy team leader], [[Enter here]],
  [Team members], [[Enter here]],
  [Submission date], [[Enter here]],
  [Version], [[Enter here]],
)


== 1. Project Charter (max 2 pages)

=== 1.1 Problem / Opportunity Statement
/*
Write a short situation + impact + why now description 
that a non-technical stakeholder can understand.
*/
[Enter your problem/opportunity statement here]

=== 1.2 Objectives and Success Criteria (3–6)
/*
List 3-6 objectives. Each objective must include a measurable success indicator
*/
#table(
  columns: (1fr,1fr),
  [*Objective*], [*Success measure (how you will know it is achieved)*],

  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
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

  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)
#pagebreak()
=== 1.4 Scope Boundaries (Current)
/*
Be explicit. Clear in-scope / out-of-scope boundaries help prevent scope creep.
*/
#table(
  columns: (1fr,1fr),
  [*In scope*], [*Out of scope*],

  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
  [[Enter]], [[Enter]],
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

  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
)

=== 1.6 Solution Context (Project Type)
/*
Software projects: include a short product vision (who it is for, what it does, benefit). 
Non-software: define the target environment and evidence sources.
*/
==== Software Project Product Vision (if applicable)

For: [Enter target users / customer segment]

The solution: [Enter what the solution is / key capability]

Provides: [Enter the key benefit / value]

==== Non-Software Project Context (if applicable)

#table(
  columns: (1fr,1fr),
  [*Category*], [*Details*],

  [Target environment and evidence sources], [[Enter]],
  [In-scope systems / controls / boundaries], [[Enter]],
  [Expected evidence sources (logs/configs/policies/etc.)], [[Enter]],
)

=== 1.7 High-Level Deliverables (4–8)
/*
List tangible outputs you intend to produce 
(artefacts, prototype/demo, validation evidence).
*/
#table(
  columns: (1fr,1fr,1fr),
  [*Deliverable*], [*Description*], 
  [*Evidence of completion (what you will show)*],

  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]],
)

=== 1.8 Definition of Success (1–2 lines)
/*
Summarise what 'good looks like' at end of session as a client-ready statement.
*/

[Enter your definition of success here]
#pagebreak()
== 2. Project Plan (max 1 page)

=== 2.1 Main Milestones (Phase Gates)

#table(
  columns: (1fr,1fr,1fr,1fr,1fr),
  [*Milestone / phase gate*], [*Target week/date*], 
  [*Deliverable/decision*], [*Owner*], [*Success evidence*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)

=== 2.2 Work Breakdown Summary (Major Work Streams)

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Work stream*], [*Description*], [*Owner*], [*Notes*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)

=== 2.3 Schedule Snapshot (Key Dates Only)

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Week*], [*Key date*], 
  [*Major deadline / internal milestone*], [*Notes*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)

=== 2.4 Top 5 Risks and Mitigations

#table(
  columns: (1fr,1fr,1fr,1fr,1fr),
  [*Risk*], [*Likelihood*], [*Impact*], 
  [*Mitigation action*], [*Owner*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)

=== 2.5 Communication Cadence

#table(
  columns: (1fr,1fr,1fr,1fr,1fr,1fr),
  [*Meeting / touchpoint*], [*Purpose*], [*Attendees*], 
  [*Frequency*], [*Artefact/output*], [*Tool/link*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)

=== 2.6 Change Control Approach (1–2 sentences)
/*
Describe how changes will be proposed, assessed, 
and approved (including who approves).
*/
[Enter your change control approach here]
#pagebreak()
== 3. Workspace and Collaboration Evidence (max 2 pages OR links + screenshots)
/*
Provide evidence that the team is set up to work effectively. 
You can paste links below and include screenshots as needed.
*/
=== Workspace Evidence Links

#table(
  columns: (1fr,1fr,1fr,1fr),
  [*Evidence item*], [*Link / location*], 
  [*Screenshot ref (if used)*], [*Notes*],

  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
  [[Enter]], [[Enter]], [[Enter]], [[Enter]],
)
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