# Portfolio Redesign Plan: Brittany-Inspired Structure, Zain-Specific Identity

## Summary
Redesign the current static portfolio into a cleaner, more professional single-page site that is structurally close to Brittany Chiang’s portfolio, but with your own copy, priorities, and slightly more modern “tech edge.” The implementation will stay in plain HTML/CSS/JS, remove the current effect-heavy patterns, and replace GitHub-driven project rendering with curated content stored in one central JavaScript data module.

The finished homepage will use a two-column desktop layout:
- Left sticky rail: your name, role, short tagline, vertical nav, resume link, and social links
- Right scroll column: About, Experience, Featured Projects, and a minimal footer
- Mobile: collapses into a single-column flow with the left rail content becoming the page header

## Key Changes

### 1. Information architecture and page structure
- Replace the current `Home / About / Projects / Contact` stack with four primary sections:
  - About
  - Experience
  - Projects
  - Footer
- Remove the dedicated Contact section entirely.
- Remove the large hero block as a separate “landing” section.
- Treat the left rail as the persistent identity/intro area on desktop rather than a conventional hero.
- Keep the resume/CV link, but place it in the left rail or footer instead of repeating it in multiple sections.
- Keep your social links in the left rail only; do not repeat them in the footer.

### 2. Layout implementation
- Rebuild the page shell as a split layout with one sticky column and one scrolling content column.
- Desktop behavior:
  - Outer container centered with a max width close to the current site’s width budget.
  - Left column remains sticky within viewport height.
  - Right column contains all section content with comfortable vertical rhythm.
- Mobile/tablet behavior:
  - Collapse to one column.
  - Sticky behavior is removed.
  - Nav becomes a simpler inline or compact top section; avoid the current slide-out hamburger unless testing proves it is necessary.
- Remove the fixed top navbar entirely.

### 3. Left rail content and behavior
- Left rail content order:
  - Name
  - Role/title
  - One-sentence positioning statement
  - Vertical section nav
  - Resume link
  - Social links
- Use small uppercase section labels for the nav.
- Implement the active nav state with a horizontal line indicator plus text color change.
- Nav scrolling behavior:
  - Clicking a nav item scrolls to the corresponding section.
  - Active state is driven by section intersection, not by manual click state only.
- Keep one subtle spotlight effect across the page, but remove the custom cursor follower dot.

### 4. Content model and rendering
- Add a new central JS data module for curated content.
- This module will own repeatable structured content for:
  - Experience entries
  - Featured projects
  - Social links
  - Optional resume/archive URLs
- Keep long-form section copy in HTML where readability matters most:
  - Name/title/tagline
  - About paragraphs
  - Footer note
- Render repeatable lists from the JS data file into placeholders in the markup.

Recommended content interfaces:

```js
export const profile = {
  name: "Zain Nawaz",
  role: "Computer Science Student & Developer",
  tagline: "Short one-line positioning statement",
  resumeUrl: "...",
  socialLinks: [
    { label: "GitHub", url: "...", icon: "github" }
  ]
};

export const experience = [
  {
    period: "2024 - Present",
    title: "Role name",
    organization: "Org name",
    organizationUrl: "...",
    summary: "1-2 sentence proof-focused description",
    tags: ["Leadership", "Web", "ML"]
  }
];

export const featuredProjects = [
  {
    name: "Project Name",
    url: "...",
    description: "Concise, outcome-oriented description",
    tags: ["Python", "ML", "Flask"],
    image: "images/project-x.jpg",
    imageAlt: "Screenshot of ..."
  }
];
```

### 5. About section redesign
- Replace the current card-based about layout with plain flowing paragraphs.
- Remove:
  - Education stats box
  - Specialization pills in the current form
  - Frontend/backend skill cards
  - Progress bars
  - About-section resume button
- Write the About section as 2-4 concise paragraphs that explain:
  - what you study/build
  - what kind of work excites you
  - the crossover between ML, games, and web/software engineering
  - what you are looking for or growing toward
- Inline-link important references where relevant instead of placing them in separate UI boxes.

### 6. Experience section addition
- Add a new Experience section between About and Projects.
- Use a vertical list of entries, each with:
  - date range in a narrow column
  - role/title + organization link
  - 1-2 sentence description
  - small tech/context tags
- Since formal work may be limited, define “experience” to include internships, leadership, major shipped builds, serious freelance work, or substantial academic/product work.
- Hover treatment should be subtle:
  - soft tinted background
  - mild border or outline emphasis
  - very small movement, if any
- Include a “View Full Resume” link below the section.

### 7. Projects section redesign
- Replace the current auto-fetched GitHub repo grid with a curated featured-project list.
- Remove:
  - GitHub API fetching
  - project filter tabs
  - tag-click filtering interactions
  - loading state for project fetch
- Use a stacked project list with each entry containing:
  - project title as a link
  - concise description
  - technology tags
  - optional screenshot thumbnail
- Keep the homepage limited to a small number of featured projects for quality over quantity.
- End the section with a “View More on GitHub” or archive-style link rather than showing all repositories on the homepage.

### 8. Visual system redesign
- Keep the dark overall mood, but shift from blue-heavy/glass-heavy styling to a restrained teal-led palette.
- Visual rules:
  - one body font family only
  - use Inter only; remove Poppins
  - headings are strong through weight/size/spacing, not gradients
  - left-aligned typography across the site
  - section labels are small uppercase with letter spacing
- Remove or greatly reduce:
  - gradient text
  - glassmorphism panels
  - oversized glow shadows
  - morphing headshot frame
  - decorative blob backgrounds
- Adopt a flatter surface model:
  - base dark background
  - transparent sections
  - hover tint panels only where needed
- “Subtle tech edge” should come from:
  - precise spacing
  - crisp hover states
  - spotlight follow effect
  - selective project imagery
  - cleaner transitions
  - not from layered gimmick effects

### 9. Interaction and motion changes
- Remove entirely:
  - loading screen
  - scroll progress bar
  - particle system
  - cursor follower dot
  - typed text effect
  - large hover lifts and glow bursts
- Keep:
  - smooth scrolling
  - active section tracking
  - subtle spotlight background
  - restrained reveal transitions only if they remain lightweight and consistent
- Transition rules:
  - prefer 150-200ms timing
  - prioritize opacity/color/background changes over motion
  - if translate is used, keep it minimal

### 10. Script architecture changes
- Simplify the app bootstrap so it no longer manages remote project loading or filter state.
- `PortfolioApp` should become a light coordinator for:
  - navigation section tracking
  - optional spotlight setup
  - rendering structured content from the data module
- Project-related logic should be repurposed rather than expanded:
  - remove fetch-based `ProjectService`
  - replace renderer responsibility with curated list rendering from local data
- Keep modular JS, but reduce behavioral complexity so the site becomes easier to maintain.

### 11. SEO, accessibility, and metadata updates
- Preserve the current good baseline:
  - semantic HTML
  - Open Graph and Twitter metadata
  - JSON-LD person schema
  - keyboard focus visibility
- Update metadata to match the redesigned positioning and page summary.
- Ensure the left-rail nav remains accessible:
  - proper `aria-label`
  - active state reflected for keyboard/screen readers where appropriate
- Add alt text for any curated project thumbnails.
- Respect reduced-motion preferences by disabling spotlight/reveal extras if needed.

## Important Interface / Public Changes
- Add one new structured content module for curated site data.
- Remove the homepage dependency on the GitHub API.
- Remove filter-button and project-category interfaces from the UI and JS logic.
- Replace the current “project card from repo object” rendering model with a curated “featured project entry” model.
- Replace the navbar interaction model with section-aware in-page rail navigation.

## Test Plan
- Desktop layout:
  - left rail remains sticky
  - right column scrolls cleanly
  - active nav updates as sections enter view
- Mobile layout:
  - page collapses cleanly to one column
  - no sticky overlap or clipped sections
  - nav remains usable without the desktop rail pattern
- Content rendering:
  - curated experience and project entries render correctly from the JS data file
  - missing optional thumbnail does not break layout
- Accessibility:
  - keyboard navigation reaches nav, resume link, social links, project links
  - visible focus states remain strong
  - reading order is logical on mobile and desktop
- Performance:
  - no loading screen dependency
  - no runtime dependency on remote GitHub data
  - spotlight and any reveals do not cause obvious jank
- Visual QA:
  - no remaining gradient-text/glass-card artifacts in legacy sections
  - typography, spacing, and hover states are consistent across sections

## Assumptions and Defaults
- The redesign should be structurally close to the reference, but not a clone in copy or identity.
- Your content will be unique and manually curated.
- The site will remain a static plain HTML/CSS/JS site; no framework migration is included.
- Resume link stays visible.
- Headshot/photo is removed from the main experience.
- Experience entries may include internships, leadership, or major builds if formal work history is limited.
- Featured projects are curated manually, with a GitHub/archive link for everything else.
- Visual direction is minimal dark editorial with teal accents and a subtle modern tech edge.

