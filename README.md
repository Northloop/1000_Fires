<div align="center">
  <img src="./logo.svg" alt="1000 Fires Logo" width="400" />
  <br />
  <h1>1000 Fires</h1>
  <p><strong>The All-in-One Operating System for Participatory Events</strong></p>
  
  <p>
    <a href="#vision">Vision</a> • 
    <a href="#features">Features</a> • 
    <a href="#architecture">Architecture</a> • 
    <a href="#tech-stack">Tech Stack</a>
  </p>
</div>

---

## Vision

**1000 Fires** is a comprehensive, mobile-first platform designed to streamline the organization of complex participatory events like regional Burns, festivals, and community gatherings.

While existing apps serve as simple directories for participants, 1000 Fires provides the robust backend infrastructure necessary for logistical, financial, and human resource challenges faced by organizers, camp leads, and safety teams.

## Features

### 🏕️ Camp Management
Empower theme camp leads with tools to manage their internal operations.
*   **Roster Management:** Track members, skills, and arrivals.
*   **Task Boards:** Assign build, strike, and daily chores.
*   **Finances:** Track dues, expenses, and budget allocation.
*   **LNT (Leave No Trace):** MOOP maps and departure checklists.

### 🛡️ Safety & Operations
A dedicated command center for event safety.
*   **SOS Beacon:** One-touch GPS location sharing for emergencies.
*   **Incident Logging:** Track medical, fire, and conflict incidents in real-time.
*   **Resource Mapping:** Locate nearby Ranger stations and medical tents.

### 👮 Department HQ
Tools for the volunteers who run the event.
*   **Shift Management:** Drag-and-drop scheduling for Rangers, Gate, and Greeters.
*   **Asset Tracking:** Manage radios, golf carts, and medical kits.
*   **KPI Dashboards:** Real-time view of shift fill rates and volunteer counts.

### 🗺️ Interactive Discovery
*   **Offline Maps:** Vector-based maps for navigation without internet.
*   **Event Schedule:** Personal agendas for workshops, music, and art.
*   **Search:** Find camps, art pieces, and friends.

## Architecture

1000 Fires is built with an **Offline-First** philosophy to withstand the challenging connectivity environments of remote events.

*   **Conflict Resolution:** Hybrid strategy using Last-Write-Wins for non-critical data and manual resolution modals for roster/financial conflicts.
*   **Data Sync:** Queued mutations and optimistic UI updates.
*   **Role-Based Access Control (RBAC):** Granular permissions for Event Organizers, Department Leads, Camp Leads, and Participants.

## Tech Stack

*   **Frontend:** React 18, TypeScript, Tailwind CSS
*   **Visualization:** Recharts (Data), Lucide React (Icons)
*   **Routing:** React Router DOM
*   **State/Sync:** Custom offline hooks (Simulation phase)

---

<div align="center">
  <h3>
    <a href="https://ai.studio/apps/drive/1vn_YLBnpeJvIg4Xms-5iQ2QrGTkIozQq">View Project on AI Studio</a>
  </h3>
</div>