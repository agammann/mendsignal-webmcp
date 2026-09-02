# Pulse submission checklist

## Build and application

- [x] Production worker build passes
- [x] Live public URL exists and loads without authentication
- [x] Production D1 initializes and contains at least 30 labeled demo cases
- [x] Production search, case detail, creation, timeline, outcome, and votes smoke-tested
- [x] Desktop interface visually checked
- [x] Mobile interface visually checked after final production build

## WebMCP

- [x] Current `document.modelContext.registerTool(...)` API verified against current Chrome documentation
- [x] Ten imperative tools registered with JSON Schema and annotations
- [x] Feature-detected ordinary-browser fallback
- [x] Read and mutation logic covered by automated workflow tests
- [x] Registered tools discovered in the deployed WebMCP environment
- [x] Deployed `search_repairs` read call succeeds
- [x] Deployed create → diagnostic result → outcome mutation loop succeeds
- [x] Visible repair timeline and Agent Activity update after tool mutation

## Repository

- [x] README, MIT license, AGENTS.md, WEBMCP_TESTING.md, SECURITY.md, and `.env.example`
- [x] Relational schema, migration, labeled seed corpus, and tests
- [x] No required API key
- [x] Public GitHub repository created and source pushed
- [x] Repository URL inserted in Devpost
- [x] Final secret scan and broken-link review

## Video and Devpost

- [x] Exact sub-three-minute demo script finalized
- [x] Record narration and screen capture
- [x] Upload a public or unlisted YouTube video with audio
- [x] Insert the real video URL in Devpost: https://youtu.be/HALFLa5KM6E
- [x] Devpost narrative copy drafted
- [x] Add production URL, GitHub URL, and video URL using real values only
- [x] Preview every saved field and verify the live links
- [x] Confirm license and challenge eligibility fields
- [x] Final Devpost submission explicitly confirmed by the entrant and verified via the `Project submitted!` success state
