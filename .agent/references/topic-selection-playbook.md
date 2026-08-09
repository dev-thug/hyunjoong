# Topic Selection Playbook

Select at most one topic per scheduled run. Publishing nothing is better than publishing weak or repetitive content.

## Candidate Sources

1. A concrete engineering decision or failure observed while building this repository or Specify.app
2. A repeated customer problem around GS certification, public/enterprise delivery, SDLC evidence, or code-documentation drift
3. A new primary-source change in an AI, cloud, or web platform that materially changes implementation choices
4. A reusable quality, security, or automation workflow backed by real execution

## Score Each Candidate (0–10)

| Dimension | Points | Question |
| --- | ---: | --- |
| Audience relevance | 0–3 | Does this help a senior engineer, technical founder, or the current Specify ICP? |
| First-hand depth | 0–3 | Can the article include a real design decision, trade-off, failure, or executed test? |
| Source quality | 0–2 | Are current claims supported by primary sources? |
| Novelty | 0–1 | Is the thesis distinct from all existing posts? |
| Actionability | 0–1 | Can the reader apply a checklist, test, or architecture pattern? |

Publish only a candidate scoring at least 7, with no zero in first-hand depth or source quality.

## Topic Guardrails

Reject a candidate when any of these is true:

- The article would mostly summarize generic AI news.
- The title or central thesis duplicates an existing post.
- The argument depends on an unverified customer, metric, benchmark, or product result.
- The only sources are secondary commentary when a primary source is available.
- The post exists mainly to target a keyword rather than answer a real engineering or product question.

## Preferred Formats

- Failure analysis with a reproducible test
- Architecture decision record with alternatives and trade-offs
- Evidence-led product validation lesson
- Certification/documentation workflow with explicit human approval boundaries
- Operational checklist derived from a real release or incident
