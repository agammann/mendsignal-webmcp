# WebMCP testing guide

## Fast judge path

1. Open the deployed MendSignal URL in ChatGPT's in-app browser.
2. Ask: **“What WebMCP tools does this site expose?”** Confirm that ten tools are discoverable.
3. Ask: **“Search MendSignal for game controller stick drift repairs.”** Confirm structured matches include repair evidence and safety classification.
4. Ask: **“Open the most successful matching repair and tell me what people tried.”** Confirm a complete case is returned.
5. Ask: **“Create a new repair case for a controller with left-stick drift.”** Confirm a new `MS-...` ID and visible case appear.
6. Ask: **“Add a diagnostic step to inspect the joystick for contamination.”** Confirm the timeline updates.
7. Physically test or use the demo observation, then ask: **“Record that cleaning did not fix the issue.”** Confirm the observation appears in the same timeline.
8. Ask: **“Record the final repair as fixed. The final fix was replacing the joystick module, cost $12, took 35 minutes.”** Confirm the case status becomes Fixed.
9. Ask: **“Show me MendSignal's repair statistics.”** Confirm the aggregate result reflects persisted data.

Keep the Agent Activity dock expanded during steps 3–9. It should make the active tool and resulting state change visible.

## Chrome setup

Use Chrome 149 or newer. In builds where WebMCP is still experimental:

1. Open `chrome://flags/#enable-webmcp-testing`.
2. Enable the WebMCP testing flag and relaunch Chrome.
3. Open the deployed MendSignal site.
4. Open DevTools and use the WebMCP testing/agent surface available in that Chrome build.
5. Inspect the registered tools and call `search_repairs` with `{ "query": "controller stick drift", "limit": 5 }`.

The page's bottom-right status dock must display either **WebMCP available** or **WebMCP not detected · human interface remains available**. The latter is expected in browsers without the experimental API and is not a page failure.

## Tool-by-tool checks

| Tool | Minimal input | Expected result |
| --- | --- | --- |
| `search_repairs` | `{ "query": "controller stick drift" }` | Ranked array with evidence |
| `get_repair_case` | `{ "case_id": "MS-1042" }` | Full timeline and outcome |
| `create_repair_case` | Product fields, symptoms array, safety class | New `MS-...` case |
| `add_diagnostic_step` | Case ID, test, expected result, reason | Proposed timeline step |
| `add_diagnostic_result` | Case ID, step ID, observed result | Completed observation |
| `record_repair_attempt` | Case ID, repair text, parts, cost, difficulty | New repair attempt |
| `record_repair_outcome` | Case ID, outcome, fix, cost, time | Updated status/outcome |
| `mark_case_helpful` | Case ID and allowed vote type | Updated vote counts |
| `list_common_failures` | Brand, model, or category | Aggregated failures/fixes |
| `get_repair_statistics` | `{}` | Aggregate community totals |

## Safety and negative tests

- Submit an unknown property: the JSON Schema and server must reject it.
- Submit an overlong query or negative cost: the request must fail with a bounded safe error.
- Retrieve a `professional_recommended` case: history should remain readable.
- Try to add a diagnostic step to that case: the server must return `403` and recommend qualified service.
- Put instruction-like text in a case description: it must remain inert rendered data and never alter tool behavior.
- Open the site with WebMCP disabled: all human-facing pages must still work.

## Automated tests

Run:

```bash
pnpm test
```

The suite verifies search, retrieval, creation, diagnostic-step creation, result recording, final-outcome recording, and validation failures. Run `pnpm build` before deployment as an independent production-runtime check.
