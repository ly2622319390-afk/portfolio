# Source Map

The current website references optimized versions for many images and original versions for videos. This map keeps that relationship explicit for future builds.

## Current site sections

| Section | Current source | Reusable direction |
| --- | --- | --- |
| AI exploration carousel | `index.html`, `ai-exploration.html` | AI product first; AI operations supporting |
| Data analysis | `index.html` | Archive or supporting evidence only |
| Operating experience | `index.html`, `运营/` | AI operations first |
| Video works | `index.html`, `视频作品/` | AI operations supporting / archive |
| Profile and resume | `个人照片.jpg`, `封面与简历/`, `李颖-AI.pdf` | Both directions |

## Asset path convention

- Original media stays under its existing Chinese-named folder.
- Optimized display media stays under `optimized/`.
- New portfolio pages should use the optimized image when available, and keep the original as a download or fallback source.
- Videos should be lazy-loaded and shown with a poster image where one exists.

## Reuse checklist

- [ ] Confirm whether the asset is personal, internship-official, or client work.
- [ ] Confirm that faces, private conversations, company dashboards, and third-party media can be shown.
- [ ] Replace old copy and placeholder metrics before publishing.
- [ ] Link each case to its evidence source or mark it as pending.
- [ ] Keep the same asset ID across the AI product and AI operations builds.
