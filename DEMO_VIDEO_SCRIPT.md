# MendSignal demo video script

Target length: **2:45**. Keep the WebMCP activity dock open and the browser zoom at 100%. Record at 1440p or 1080p with clear narration.

## 0:00–0:15 — The idea

**Screen:** MendSignal homepage, then hover over the Repair Evidence card.

**Narration:** “This is MendSignal, an open repair memory built for humans and AI agents. Humans test the fix. Agents remember what worked.”

## 0:15–0:32 — Why WebMCP

**Screen:** Open `/webmcp`; show the ten registered tools and the permission model.

**Narration:** “Instead of forcing an agent to understand our interface visually, MendSignal exposes its real capabilities through WebMCP. These are typed application tools—not browser scraping and not a fake demo layer.”

## 0:32–0:58 — Search evidence

**Screen:** In ChatGPT's in-app browser, ask: “My controller has stick drift. Search MendSignal for similar repairs.” Show `search_repairs`, results, and Agent Activity.

**Narration:** “The agent searches structured repair evidence: matching symptoms, previous attempts, fixed and failed outcomes, repair time, cost, and safety classification.”

## 0:58–1:18 — Inspect a real history

**Screen:** Ask: “Open the most successful matching repair and tell me what people tried.” Show the repair timeline and evidence counts.

**Narration:** “A generic confidence score would hide the useful information. MendSignal shows the evidence: what was attempted, what worked, what did not, and how the community verified it.”

## 1:18–1:42 — Create a shared case

**Screen:** Ask: “Create a repair case for my controller with left-stick drift.” Open the returned case.

**Narration:** “Now the agent creates a real persisted repair case through `create_repair_case`. The same record is immediately visible in the human interface.”

## 1:42–2:04 — Human observation

**Screen:** Ask the agent to add a safe inspection step. Then say: “I tried it. Cleaning did not fix the issue.” Show the diagnostic result appear.

**Narration:** “The agent organizes the diagnostic plan, but the human supplies the physical-world observation. The timeline and activity panel update as the WebMCP mutation completes.”

## 2:04–2:27 — Outcome becomes knowledge

**Screen:** Ask: “Record the repair as fixed. Replacing the joystick module cost twelve dollars and took thirty-five minutes.” Show Fixed state, then dashboard statistics.

**Narration:** “The final outcome becomes shared repair evidence. Future agents can retrieve this successful path—and the failed cleaning attempt—instead of starting from scratch.”

## 2:27–2:45 — Close

**Screen:** Homepage hero, then MendSignal social card.

**Narration:** “The agent handled structured knowledge and record keeping. The person interacted with the physical object. MendSignal remembered the result for everybody. MendSignal: the open repair memory for humans and agents.”

## Recording checklist

- Keep the final edit under three minutes.
- Include spoken audio; captions are recommended.
- Show at least one read tool and two mutating tools.
- Make the returned case ID, activity dock, timeline update, and final status legible.
- Avoid displaying unrelated tabs, account details, credentials, or private notifications.
- Upload publicly or unlisted to YouTube, then use the real URL in Devpost and `DEVPOST_SUBMISSION.md`.
