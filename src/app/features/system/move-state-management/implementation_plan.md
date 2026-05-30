# Implementation Plan: Move State Management (Master-Detail CRUD)

This plan outlines the architecture and execution strategy for building the "Move State Management" module. It will follow the Master-Detail (Parent/Child) pattern specified, allowing users to configure high-level Move Phases (Parents) and detailed Move Statuses (Children) for each phase.

## User Review Required

> [!IMPORTANT]
> **API Integration**: Currently, I plan to build a mock service that perfectly mimics the `AdminMovePhaseController` and `AdminMoveStatusController` JSON payload specs you provided. This ensures the frontend is fully functional and ready to connect. If you have an active backend API running locally (e.g., `http://localhost:8080/api`), please provide the base URL so I can hook it up directly!

> [!NOTE]
> **Design Assets**: The screenshot shows a dual-column layout with beautifully styled header banners (blue gradients) and distinct active states. I will recreate this premium enterprise design aesthetic using standard HTML/CSS alongside the reusable `<app-button>`, `<app-form-input>`, and `<app-dropdown-menu>` components we just built.

## Proposed Changes

---

### Move State Management Module
This encapsulates the new feature.

#### [NEW] `src/app/features/system/move-state-management/move-state-management.module.ts`
- Encapsulates the UI components, dialogs, and models for the Move State feature.
- Imports `SharedModule` for access to the reusable form and button components.

#### [NEW] `src/app/features/system/move-state-management/move-state-management-routing.module.ts`
- Defines the route `/system/move-states` mapping to the `MoveStateListPage` component.

#### [MODIFY] `src/app/features/system/system-routing.module.ts`
- Add lazy-loaded route `move-states` mapping to the new module.

---

### Data Models & Services
Implementing the exact JSON specifications provided.

#### [NEW] `src/app/features/system/move-state-management/models/move-state.model.ts`
- Defines `MovePhaseRequest`, `MovePhaseResponse`, `MoveStatusRequest`, and `MoveStatusResponse` interfaces based strictly on the payload specs provided.

#### [NEW] `src/app/features/system/move-state-management/services/move-state.service.ts`
- An Angular Service handling CRUD operations.
- `getPhases()`, `createPhase()`, `updatePhase()`, `deletePhase()`
- `getStatusesByPhaseId()`, `createStatus()`, `updateStatus()`, `deleteStatus()`
- Returns `Observable` types to seamlessly match typical Angular HTTP patterns.

---

### User Interface Components

#### [NEW] `src/app/features/system/move-state-management/pages/move-state-list/move-state-list.page.ts` (and `.html`, `.css`)
- **Left Column**: Renders the list of `MovePhaseResponse` objects. Displays the active selection using a highlighted styling block.
- **Right Column**: Listens for the selection of a phase, then fetches and renders the associated `MoveStatusResponse` list.
- Implements the "+ New Parent" (Phase) and "+ New Child" (Status) buttons in the column headers.
- Implements Edit/Delete icons per row.

#### [NEW] `src/app/features/system/move-state-management/dialogs/phase-dialog/phase-dialog.component.ts` (and `.html`, `.css`)
- Reuses `<app-form-input>`.
- Fields: Name, Code, Sequence No, Active (checkbox).

#### [NEW] `src/app/features/system/move-state-management/dialogs/status-dialog/status-dialog.component.ts` (and `.html`, `.css`)
- Reuses `<app-form-input>`.
- Fields: Name, Code, Description, Sequence No, Color Code (color picker/hex input).
- Checkboxes: isFinal, customerVisible, internalOnly, active.

## Verification Plan

### Automated Tests
- The components will be verified via standard Angular build checks (`ng build`).

### Manual Verification
1. Navigate to the new `/system/move-states` route.
2. Verify the 50/50 dual-column "Enterprise Categories Management" layout matches the provided screenshot's intent.
3. Test creating a new Phase (Parent).
4. Select the Phase and test creating a new Status (Child).
5. Verify that clicking different Phases correctly updates the right-hand Status column.
6. Test editing and deleting items.
