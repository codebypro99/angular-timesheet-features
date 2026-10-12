# Angular Timesheet Feature Samples

Angular and NGXS excerpts demonstrating timesheet loading actions, selector-based state access, and conversion of shared filters into API request parameters.

## Purpose

These samples show how I separate list-loading operations from filter preparation and API access. They retain the original patient-domain identifiers without including patient records.

## Loading Actions

**Source:** [timesheets.actions.ts](./features/timesheets.actions.ts)

Defines GetTimesheets for general list loading and GetTimesheetsByPatientId for loading with an explicit patient identifier.

**What this demonstrates:** expressing list operations as named actions with explicit inputs.

## State and Selectors

**Source:** [timesheets.state.ts](./features/timesheets.state.ts)

- Stores two list/count pairs with empty defaults.
- Exposes selectors for both pairs.
- Injects the NGXS store and a dedicated timesheet API service.
- Reads a different shared filter model for each loading action.
- Returns the API observable and patches state after a successful response.

**What this demonstrates:** coordinating shared filter state, data access, and list state through action handlers.

## Filter Preparation

The getFilters method builds request parameters from the shared filter model:

- Preserves page and page-size values.
- Formats supplied date bounds as YYYY-MM-DD through a shared helper.
- Includes non-empty caregiver, status, and coordinator arrays using bracketed parameter names.
- Trims string search input and omits empty searches.
- Includes sorting only when both order and direction are supplied.
- Adds a patient identifier when requested.
- Removes empty parameter values through a shared utility.

**What this demonstrates:** centralizing request normalization instead of repeating it across loading operations.

## Technologies

Angular dependency injection, NGXS actions and selectors, TypeScript, and RxJS tap.

## Excerpt Context and Behavior Boundaries

The API service, shared filters, date conversion, empty-value helper, state registration, and consuming UI belong to the surrounding application.

In the supplied implementation, GetTimesheets updates listByPatientId and totalByPatientId, while GetTimesheetsByPatientId updates list and total. This naming mismatch is preserved and should be considered when reviewing the selectors.

List values and filter inputs use broad or implicit types. Loading state, error handling, overlapping-request coordination, and pagination reset policy are not implemented here.

Original code and imports are preserved. Descriptions are based on source inspection; the excerpts have not been compiled or executed in isolation.

## Portfolio Message

I can organize Angular list-loading features around explicit actions, shared filter normalization, and selector-based access to results.
