# Portfolio Asset Library

This folder is the reusable index for the portfolio site. It does not move or rename the existing media files, so the current site paths keep working.

## How to use it

1. Read `catalog.json` as the single source of truth for projects, media, ownership, role fit, and publication status.
2. Use `directions/ai-product.json` for the AI product manager portfolio and `directions/ai-operations.json` for the AI operations portfolio.
3. Keep one asset in the catalog once, then reference it from either direction. Do not upload the same image or video twice.
4. Before publishing company work, check `visibility` and `publicationNote`. Haivis official account assets are work evidence, but their public display still needs company permission.

## Status meanings

- `direct`: already exists in this repository and can be referenced by a portfolio build.
- `refresh`: exists, but the copy or statistics should be updated before public display.
- `external`: stored in the workbench or another project location; add the final public URL when available.
- `archive`: keep for history, but do not lead with it on a job-focused homepage.

## Direction rules

- AI product manager: lead with product problems, user scenarios, information architecture, AI boundaries, interaction, validation, and implementation decisions.
- AI operations: lead with content planning, platform adaptation, production volume, data, user feedback, product education, and review loops.
- Personal accounts and Haivis official work must remain separate. They can be summarized together only when the target JD calls for multi-platform content experience.

## External workbench records

These projects are intentionally referenced without copying company or client code into this repository:

| Project | Workbench record | Current state |
| --- | --- | --- |
| Haivis official account operation | `liying-evidence-records` | Latest 37-day data is in the workbench |
| Haivis official website | `liying-evidence-records` | Add approved screenshots and public URL when ready |
| Haivis promotional animation | `liying-evidence-records` | Video is available; original collaborative code is not owned by this portfolio |
| Juicer brand independent site | `liying-evidence-records` | External project, in progress |

Do not describe the website user total or activated user total as traffic caused by Xiaohongshu until channel attribution exists.
