# 1000 Fires: Technical Strategy & Gap Analysis
**Status:** Pre-Alpha / Planning
**Date:** November 2025
**Target:** Phase 1 Development Kickoff

---

## 1. Feature Gap Analysis (Spec vs. Current Code)

The current codebase is a **UI Shell**. It demonstrates *intent* and *user flow*, but lacks the backend logic, database connections, and complex feature sets required for the MVP.

### 🔴 Critical Missing Core Features (Must-Haves for MVP)

1.  **Backend & Authentication**
    *   **Current:** Hardcoded `CURRENT_USER` in `constants.ts`.
    *   **Missing:** Real authentication (Auth0/Firebase/Supabase), User Registration, Role Management logic (switching between "Camp Lead" and "Ranger" contexts).
    *   **Database:** No actual database (Firestore/Postgres) exists. All data resets on refresh.

2.  **Interactive Mapping (The "Dust" Parity)**
    *   **Current:** A static placeholder (`MapInterface.tsx`).
    *   **Missing:** Mapbox/Leaflet integration, GPS Blue Dot location, Offline Vector Tile caching, Custom Pin dropping, Navigation routing.

3.  **Real Volunteer Portal**
    *   **Current:** Admin view only (`DepartmentDashboard`).
    *   **Missing:** The "Volunteer" persona view. The ability for a user to browse open shifts, sign up, and see "My Schedule" populated.

4.  **Financial Infrastructure**
    *   **Current:** UI Mockups (`FinanceModule.tsx`) that simulate transactions.
    *   **Missing:** Stripe Connect integration, Plaid integration for ACH, Ledger logic to prevent double-spending, Report generation (PDF/CSV).

5.  **Camp Onboarding Workflow**
    *   **Current:** View an existing camp.
    *   **Missing:** The "Create Camp" wizard, Invite links for members, Approval workflow from Event Organizers.

---

## 2. Technical Architecture & Data Design (Section 6.7)

### Q1: Multi-Role User Management
*   **Problem:** User is a Camp Lead, a Ranger, and an Artist simultaneously.
*   **Architecture Solution:**
    *   **Data Model:** Separate `User` records from `Roles`.
        *   `User`: Global profile (Name, Email, ID).
        *   `RoleMembership`: Join table `{ userId, entityId, roleType, permissions }`.
        *   *Example:* User "Sparky" has one entry in `RoleMembership` for "Camp Entropy" (LEAD) and another for "Rangers" (VOLUNTEER).
    *   **UX Pattern:** **Context Switcher**. The top navigation bar will feature a dropdown allowing the user to toggle their "Active Context" (e.g., "Viewing as Camp Lead" vs "Viewing as Ranger").
    *   **Scheduling:** The "My Schedule" view aggregates *all* contexts. Logic will prevent booking a Ranger shift if it overlaps with a Camp shift.

### Q2: Offline Conflict Resolution
*   **Problem:** Two leads edit the same schedule offline.
*   **Strategy:** **Hybrid Field-Level Resolution**.
    *   **Non-Critical Data:** Last-Write-Wins based on UTC timestamp.
    *   **Append-Only Lists:** Logs and Chat are append-only; no conflicts possible.
    *   **Critical Operational Data (Shifts/Finance):**
        *   If Lead A assigns "Shift 1" to User X, and Lead B assigns "Shift 1" to User Y:
        *   The server accepts the first sync.
        *   Lead B receives a **"Sync Conflict"** error modal (already implemented in `Layout.tsx`).
        *   Lead B must choose to "Overwrite" or "Discard" their change.

### Q3: Real-Time Data Requirements
*   **Vehicle Tracking:** **WebSockets (Socket.io or Firestore Realtime)**. Requirements: < 5s latency. Disabled when app is in "Offline Mode".
*   **Emergency Ping:** **Multi-Channel Fallback**.
    1.  Attempt HTTPS API call.
    2.  If offline/fail, trigger native OS SMS with pre-filled GPS payload to Dispatch Server.
*   **Standard Data (Shifts/Finance):** **REST/GraphQL Polling**. Sync on app open, then every 5 minutes, or on "Pull to Refresh".

### Q4: Data Volume & Storage
*   **Estimates (1000 participants):** ~15MB of raw JSON text data.
*   **Strategy:**
    *   **Text:** Cache 100% of text data in `SQLite` or `AsyncStorage`. 15MB is negligible.
    *   **Maps:** Use **Vector Tiles** (Protocol Buffers) instead of images. Reduces map size from ~500MB to ~50MB for typical playa area.
    *   **Images:** Cache thumbnails only. Load full-res on demand.

---

## 3. Security & Compliance (Section 6.8)

### Q5: Data Ownership
*   **Policy:**
    *   **Event Organizers** own aggregate operational data (Ticket counts, Shift fill rates).
    *   **Users** own their PII and profile data (GDPR/CCPA compliance).
    *   **Camps** own their internal roster and budget data.
*   **Retention:** Data is "Frozen" (Read-Only) 1 year after event, then PII is scrubbed.

### Q6: Medical Data Handling (HIPAA)
*   **Assessment:** Storing "Patient has broken leg" puts us in HIPAA territory.
*   **Strategy: Avoidance.**
    *   1000 Fires tracks **Dispatch Logistics** (Time, GPS Location, "Medical Team Requested"), NOT **Clinical Records**.
    *   Clinical notes must be recorded on paper or a dedicated HIPAA-compliant ePCR system, *not* inside this app.
    *   *Disclaimer:* "This app is for logistical coordination only. Do not enter Patient Health Information (PHI)."

### Q7: Payment Data Flow (PCI)
*   **Scope:** **SAQ A** (Lowest burden).
*   **Strategy:**
    *   We use **Stripe Elements** / Native Pay.
    *   The app *never* touches or stores raw credit card numbers.
    *   We only handle the `payment_method_id` token returned by Stripe.

---

## 4. User Experience Strategy (Section 6.9)

### Q8: Onboarding Experience
*   **Flow:**
    1.  **Global Sign Up:** Email/Password.
    2.  **Event Selection:** "I am attending Minnesota Burn."
    3.  **Role Selection:** "I am a..." (Participant / Camp Lead / Volunteer).
    4.  **Contextual Wizard:**
        *   *Camp Lead:* "Create your Camp" flow.
        *   *Participant:* "Join a Camp" or "Browse Map."

### Q9: Feature Discovery
*   **Strategy:** **Empty States & Progressive Disclosure.**
    *   Don't show a blank screen. If there are no tasks, show a graphic: "Create your first task."
    *   **Coach Marks:** On first login, dim screen and highlight "Offline Toggle" and "SOS Button".

### Q10: Mobile Limitations
*   **Philosophy:**
    *   **Mobile App:** Focus on *Execution* (View schedule, mark task done, SOS, view map).
    *   **Desktop Web Portal:** Focus on *Management* (Create budget, set up department structure, upload assets).
    *   *Communication:* "For advanced setup, please visit 1000fires.app on your desktop."

---

## 5. Technology Stack Decisions (Section 6.11)

**Recommendation for Approval:**

1.  **Mobile Framework:** **React Native (Expo)**.
    *   *Rationale:* Single codebase for iOS/Android. Excellent offline libraries (`@tanstack/react-query`, `expo-sqlite`).
2.  **Backend:** **Node.js (NestJS) + Supabase (PostgreSQL)**.
    *   *Rationale:* Supabase provides Auth, Database, and Realtime subscriptions out of the box. Postgres Relational DB is superior for the complex relationships (Camps <-> Users <-> Shifts) compared to NoSQL.
3.  **Hosting:** **Vercel** (Web/API) + **Supabase** (DB).
    *   *Rationale:* Low cost, zero DevOps overhead for Phase 1.

---

## 6. Risk Analysis (Section 13)

### Top Technical Risks
1.  **Offline Sync Failures:** Data loss during conflict resolution. *Mitigation:* Aggressive local logging and "Conflict Copy" creation (never delete data automatically).
2.  **GPS Battery Drain:** Real-time tracking kills battery. *Mitigation:* aggressive throttling (update location only every 5 mins unless in "SOS" mode).

### Top Business Risks
1.  **Camp Adoption:** Camps refuse to pay/use the tool. *Mitigation:* Ensure the *Free* tier is better than Google Sheets (easier roster management).
2.  **Liability:** App blamed for failed emergency response. *Mitigation:* Strict TOS, "Best Effort" disclaimers, and clear UI separation between "App Dispatch" and "Calling 911".
