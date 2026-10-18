# Earth Last Exam

A research-agent benchmark in Earth science, initiated by EvolventAI and developed with domain researchers. This repository contains the project website, an original typhoon task overview, and contribution forms.

The website introduces our research aim, professional environments, original task and ways to contribute. A warm, light masthead pairs the large green project title with NASA's full-disk Earth observation in a pale circular frame. The first screen introduces the research question and its two entry points; an attribution strip leads into the research sections and a data-driven typhoon study. Every page is available in English, Chinese, Japanese, Korean, French and Spanish.

## Pages

- `src/index.html` — project showcase, interactive domain environments, original task, broad research areas and collaboration invitation.
- `src/benchmark.html` — domain environments, task package structure, rubric and evaluation protocol.
- `src/typhoon.html` — original research task, inputs, research files and eight evaluation criteria.
- `src/contribute.html` — scientific advisory invitation, task proposals and local or GitHub submission drafts.

The typhoon page specifies a research task. The website repository does not include the large datasets, model installation or an executed benchmark run.

## Run locally

Use Node.js 22 or newer. No packages need to be installed.

```sh
npm run build
npm run check
npm test
npm run preview
```

Open `http://127.0.0.1:4173`. On Windows, `./preview.ps1` also locates a compatible Node runtime. Stop the preview with Ctrl+C.

## Publish with GitHub Pages

Create a public repository and push these files to its `main` branch. In **Settings → Pages → Build and deployment**, select **GitHub Actions**. The Website workflow builds and checks the four pages, tests proposal generation, then deploys only `dist/`. Pull requests run the same checks without deploying.

The build uses `GITHUB_REPOSITORY` to connect the live website to its own repository and Issues. Local previews keep GitHub submission controls hidden unless `ELE_REPOSITORY=owner/repository` is set. An optional contact email or external portal can be set in `src/config.js`.

For the initial Windows publication, `./publish.ps1` performs the local checks, initializes this folder as its own Git repository, creates the repository and enables Pages. It requires a logged-in GitHub CLI. `./publish.ps1 -CheckOnly` runs local checks without publishing. The default repository name is `earth-last-exam-website` under the authenticated account, leaving `earth-last-exam` for the separate task repository; the script stops if that remote repository already exists.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Researchers can suggest a question, provide research materials or develop a complete task. Advisors help with research priorities and scientific review; engineering collaborators help build environments and verifiers.

The contribution form comes first and requires only a research question. Links and a reply email are optional; other details sit inside a disclosure section. Drafts stay in the current browser tab through `sessionStorage`, with a clear-draft control. Blank fields are left out of the generated text.

`src/config.js` selects the primary handoff: a configured HTTPS form, then a project email, then GitHub Issues. Without a destination, the form explicitly offers a local draft. Email opens the visitor's mail app; GitHub opens an issue draft for review. Neither action claims that a contribution has been received. Long drafts remain copyable, and a Markdown download is always available. The email field is excluded from public GitHub text. An external portal receives no form data automatically; the visitor copies it across.

## Maintain

Typography uses a locally hosted Inter variable font with system fallbacks for Chinese. The font and its SIL Open Font License are in `src/fonts/`; reading the site does not require a font CDN. Shared type tokens set reading copy at 23 px and card copy at 21 px on desktop, falling to 21 px and 20 px on small screens. The hero scales independently, keeping the title and Earth image together on narrow screens. Captions retain source links. The hero's CSS frame excludes the empty black space around Earth, while the full original image remains available on click.

Japanese and Korean use appropriate system font fallbacks. On phones, the language selector stays beside the project identity, the navigation can scroll, and the two hero actions share equal-width columns. Longer translations can wrap inside cards and controls.

## Languages

`src/locales/catalog.json` records the English and Chinese source messages with stable IDs. The `ja.json`, `ko.json`, `fr.json` and `es.json` files hold translations under the same IDs. The build compiles these files into one local `locales.js` script, so language selection works when opening `dist/index.html` directly as well as on a web server. No translation service is called.

The language selector updates page titles, body text, image descriptions, navigation, form labels, validation messages and community cards. It remembers the selected language across pages. A URL such as `index.html?lang=ja` selects a language explicitly. Changing language preserves form input and any draft already prepared; a newly prepared or downloaded draft uses the selected language.

To edit copy, keep the HTML's English and Chinese attributes aligned with the catalog, then update the four translated entries. New messages receive new IDs. Preserve filenames, formulas, scientific thresholds and named placeholders such as `{email}`. The build and tests check translation coverage and placeholder consistency. Figure labels embedded in scientific SVGs remain in English; their surrounding descriptions and captions are translated.

Seven credited observation images and reproducible JMA track and central-pressure charts provide the scientific imagery. The homepage includes hydrology, ocean and geological observation plates; the evaluation page includes a glacier image. Source images are stored locally without pixel edits and open at their supplied resolution. Observation plates preserve their full frame; only the hero applies circular framing around the Earth disk. See [image credits](src/images/CREDITS.md) for instruments, observation times and reuse terms. Captions support all six languages; labels inside the JMA data charts remain in English.

The original Earth mark combines a circular outline, flowing geological layers and an observation point. `src/logo.svg` is the dark-green version and `src/logo-light.svg` is the pale-green version; both have transparent backgrounds. Headers and footers use inline copies that inherit the theme color. The favicon omits the lowest layer to stay clear at small sizes. `brand/` contains a visual preview and transparent PNG exports for presentation materials.

The typhoon task includes eight atmospheric investigations, M01–M08: error structure,
environmental steering, potential-vorticity budgets, shear and convection, total-water
budgets, surface and terrain interventions, trajectory branches, and mechanism transfer.
Native disclosures keep the detailed analyses readable on narrow screens and usable
without JavaScript. Scientific evidence carries 40 points, with explicit 0–5 anchors
for each investigation. Forecast thresholds remain in force. The detailed task
specification and atmospheric-analysis notes are maintained in the separate task repository.

The official EvolventAI wordmark appears in the homepage attribution and the company wordmark and symbol appear in every footer. Their origin is documented in [brand/evolvent-source.md](brand/evolvent-source.md). Regenerate the scientific charts with `python scripts/plot-observed-tracks.py` and `python scripts/plot-observed-pressure.py` (Matplotlib is required only for chart generation). Extracted observations, provenance and basemap rings are in `figure-data/`.

The task section shows a file inventory with short descriptions. The public build does not include task archives or individual task documents, and the pages do not offer source or template downloads. Existing local archives remain separate from the published assets; `scripts/build.mjs` removes the former downloads from an existing preview when rebuilding. Source code and complete task documents are maintained in the separate ELE task repository.

Edit the HTML, CSS and JavaScript in `src/`. `src/typhoon.html` presents the research requirements, scoring conventions and deliverable filenames. Implementation instructions and file schemas belong in the task repository.

The public build contains the website and its display assets. Local outreach, research notes and implementation records are excluded by `.gitignore`, and the build copies an explicit list of public assets. Research data and reference answers use their own task release and access process.

## Community directory

`src/community-data.js` holds three arrays: `institutions`, `advisors` and `contributors`. All are initially empty. The public section displays honest invitations until confirmed participants are added. An individual's affiliation does not imply that their institution has joined the project. Add institutional entries only after that participation is confirmed.

Each approved entry supports bilingual `name` and `detail`, an HTTPS `url`, and an optional local `image` path under `images/`. Names and details are rendered as text, never HTML. Add new public assets to the shared allowlist in `scripts/public-assets.mjs`, used by the builder and checker. Do not commit private contact details.

The directory supports native touch/trackpad scrolling, previous/next buttons and keyboard arrows/Home/End when the rail is focused. Motion follows the user's reduced-motion preference; it never auto-scrolls. Its static invitations remain readable if JavaScript is unavailable. The roster is independent of the contribution form.

## Task contract

The homepage and task page now show the existing real-data development experiments: calibrated Himawari-9 infrared scans, full GEFS ensemble tracks and diagnostics of competing storm centers. The figures are copied unchanged from the task repository, with source credits and the GSHHG license in `src/images/`.

The task page's research notebook supports three figure tabs, keyboard navigation and a fit/detail toggle on phones. Data preparation and completed tracking work are described separately from the remaining WRF integrations and Docker/Harbor trials. These paragraphs, captions and controls are available in all six site languages. Acquisition tools, diagnostics and the numerical scorer remain in the task repository.

The typhoon specification covers 0–96 h inference, data preparation, storm-tracking controls, a 2×2 model experiment, resolution/physics sensitivity, probability calibration, first-landfall geometry, transfer to new storms, controlled input losses and independent replay. Its metrics and eight evaluation criteria are specified inline. The full meteorological environment and reference experiments are being developed separately.

The typhoon reading guide links the supplied environment, paired experiment design, artifacts and acceptance criteria. Its 2×2 diagram states interventions without inventing experimental results. The central-pressure figure reuses the attributed JMA records on a shared vertical scale. Image frames preserve the originals; on narrow screens the pressure figure and experiment table scroll within their own panels.

The task also specifies refitting within each leave-one-storm-out fold, paired complete-storm bootstrap intervals, and the influence of individual storms on the reported improvement. Removing a storm from existing predictions measures influence; it is distinct from refitting the method in a validation fold. The task repository provides tested metric helpers and a synthetic comparison example for these calculations.

The evaluation page explains the task selection standard: a consequential research question, expert judgment, sustained experiments and a useful scientific result. Rubric items describe full and partial progress and allow alternative valid methods. The homepage and contribution page use the same research language. Run commands and file-transfer conventions appear inside closed technical disclosures, alongside the complete Harbor authoring route.

## Motion and research files

The task structure and typhoon deliverables are simple filename-and-purpose lists. Rows enter once as they reach the viewport and stack vertically on phones. There are no file-content previews or command examples. The website is a presentation of the task; it is not the source for regenerating the full repository specification.

`src/motion.js` observes elements marked `data-enter`. Entrances take 650 ms, with an optional `data-enter-delay` capped at 240 ms. Content is visible before initialization and stays available when JavaScript or IntersectionObserver is unavailable. System reduced-motion settings disable the effects, including when changed while reading.

Buttons and observation frames have small hover responses. Environment tabs have short transitions. Scientific images remain still; their source files are unchanged by the hero's circular presentation.
