"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";

type LinkItem = { label: string; href: string };
type Diagram = { id: string; label: string; source: string };

function Diagram({ diagram, expanded = false }: { diagram: Diagram; expanded?: boolean }) {
  const generatedId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");
  useEffect(() => {
    let active = true;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "base", themeVariables: { background: "#0B0C10", mainBkg: "#1B1B1E", primaryColor: "#1B1B1E", primaryTextColor: "#F3F0EA", primaryBorderColor: "#C8AE87", lineColor: "#C8AE87", edgeLabelBackground: "#1B1B1E", secondaryColor: "#0B0C10", tertiaryColor: "#302D2B", actorBkg: "#1B1B1E", actorBorder: "#C8AE87", actorTextColor: "#F3F0EA", signalColor: "#C8AE87", signalTextColor: "#F3F0EA", labelBoxBkgColor: "#1B1B1E", labelTextColor: "#F3F0EA", entityBkg: "#1B1B1E", entityBorder: "#C8AE87", attributeBackgroundColor: "#302D2B", attributeBorderColor: "#C8AE87", relationshipLabelBackground: "#1B1B1E", relationshipLabelColor: "#F3F0EA", textColor: "#F3F0EA", fontFamily: "Arial, sans-serif", fontSize: "16px" } });
      try { const result = await mermaid.render(`secondary-${diagram.id}-${generatedId}`, diagram.source); if (active) setSvg(result.svg); } catch { if (active) setSvg(`<pre>${diagram.source}</pre>`); }
    });
    return () => { active = false; };
  }, [diagram.id, diagram.source, generatedId]);
  return <div className={`secondary-diagram${expanded ? " secondary-diagram-expanded" : ""}`} role="img" aria-label={`${diagram.label} diagram`}>{svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <p>Rendering diagram…</p>}</div>;
}

function DiagramViewer({ diagram }: { diagram: Diagram }) {
  const [open, setOpen] = useState(false);
  return <><div className="secondary-diagram-toolbar"><button type="button" className="pulseops-diagram-button" onClick={() => setOpen(true)}>View Full Diagram</button></div><Diagram diagram={diagram} />{open && <div className="pulseops-diagram-dialog" role="dialog" aria-modal="true" aria-label={`Full ${diagram.label} diagram`}><div className="pulseops-dialog-header"><p>{diagram.label}</p><button type="button" className="pulseops-diagram-button" onClick={() => setOpen(false)}>Close Diagram</button></div><Diagram diagram={diagram} expanded /></div>}</>;
}

function TechGroups({ groups }: { groups: readonly (readonly string[])[] }) {
  return <div className="pulseops-tech-groups">{groups.map(([label, ...items]) => <div className="pulseops-tech-group" key={label}><p>{label}</p><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div>;
}

function Links({ items }: { items: LinkItem[] }) { return <div className="pulseops-links">{items.map((item) => item.href.startsWith("/") ? <Link className="text-link" href={item.href} key={item.label}>{item.label}</Link> : <a className="text-link" href={item.href} target="_blank" rel="noreferrer" key={item.label}>{item.label}</a>)}</div>; }

const jobsyncDiagrams: Diagram[] = [
  { id: "jobsync-architecture", label: "JobSync system architecture", source: `flowchart LR
    browser[Next.js React TypeScript UI] -->|Authenticated request| app[Next.js application and server actions]
    app -->|Prisma queries| db[(PostgreSQL)]
    app -->|HTTP analysis request| ml[Python FastAPI ML service]
    ml --> extract[PDF text extraction and skill extraction]
    extract --> spacy[spaCy processing]
    extract --> embed[Sentence Transformers all-MiniLM-L6-v2]
    embed --> score[Semantic similarity scoring]
    score --> app
    app -->|Structured provider request when configured| ai[OpenAI Responses API or Ollama]
    ai --> app
    app --> dashboard[Analysis and insights dashboard]
    docker[Docker Compose] -. runs .-> app
    docker -. runs .-> ml` },
  { id: "jobsync-analysis", label: "JobSync resume analysis workflow", source: `sequenceDiagram
    participant U as User
    participant N as Next.js route
    participant DB as PostgreSQL / Prisma
    participant ML as FastAPI ML service
    participant M as NLP models
    U->>N: Select resume and job
    N->>DB: Load account-owned context
    N->>ML: Send resume or job text
    ML->>M: Extract text, skills, and embeddings
    M-->>ML: Evidence and similarity data
    ML-->>N: Validated analysis response
    N->>N: Compute evidence-based rubric scores
    N->>DB: Persist analysis snapshot
    N-->>U: Show match, ATS-style checks, gaps, and suggestions` },
  { id: "jobsync-validation", label: "JobSync validation and failure handling", source: `flowchart LR
    request[Analysis request] --> input{Valid input and account ownership?}
    input -->|No| reject[Return validation or authorization error]
    input -->|Yes| provider[Call analysis provider]
    provider --> result{Provider and model response valid?}
    result -->|No| unavailable[Disclose unavailable analysis]
    result -->|Yes| evidence[Validate evidence citations and output schema]
    evidence -->|Invalid| invalid[Reject unsupported or malformed output]
    evidence -->|Valid| persist[Persist analysis snapshot and content hashes]
    persist --> dashboard[Display results]` },
];

const lendloopDiagrams: Diagram[] = [
  { id: "lendloop-architecture", label: "LendLoop system architecture", source: `flowchart LR
    browser[Browser React UI] --> next[Next.js App Router]
    next --> auth[NextAuth Google OAuth and session]
    next --> actions[Server components and API actions]
    actions --> guard[Session, ownership, and state checks]
    guard --> prisma[Prisma ORM]
    prisma --> db[(PostgreSQL)]
    vercel[Vercel hosting] -. deploys .-> next` },
  { id: "lendloop-lifecycle", label: "LendLoop borrowing lifecycle", source: `flowchart TB
    create[Owner creates item] --> available[Item AVAILABLE]
    available --> request[Authenticated user submits request]
    request --> requested[Item REQUESTED / request PENDING]
    requested -->|Owner approves| borrowed[Item BORROWED / request APPROVED]
    requested -->|Owner declines| available
    requested -->|Requester cancels| available
    borrowed -->|Owner or borrower returns| returned[Request RETURNED]
    returned --> available
    request -. cannot request own item .-> denied[403 authorization response]` },
  { id: "lendloop-data", label: "LendLoop data model and authorization", source: `erDiagram
    USER ||--o{ ITEM : owns
    USER ||--o{ BORROW_REQUEST : submits
    ITEM ||--o{ BORROW_REQUEST : receives
    USER { string id string email UserRole role }
    ITEM { string id string ownerId ItemStatus status string title }
    BORROW_REQUEST { string id string itemId string requesterId BorrowRequestStatus status }
    USER ||--o{ ACCOUNT : authenticates
    USER ||--o{ SESSION : holds` },
];

const jobsyncTech = [["Frontend", "Next.js 15", "React 19", "TypeScript", "Tailwind CSS", "Radix UI", "Recharts", "Nivo"], ["Backend & APIs", "Next.js App Router", "Route handlers", "Auth.js / NextAuth", "Python", "FastAPI", "Zod"], ["AI & NLP", "spaCy", "Sentence Transformers", "all-MiniLM-L6-v2", "RapidFuzz", "OpenAI Responses API", "Ollama"], ["Database", "Prisma 6", "PostgreSQL"], ["Infrastructure & Testing", "Docker Compose", "Playwright", "Jest", "React Testing Library"]] as const;
const lendloopTech = [["Frontend", "Next.js", "React", "TypeScript", "Tailwind CSS v4"], ["Application", "Next.js App Router", "Server Components", "Client Components"], ["Authentication", "NextAuth 4", "Google OAuth", "JWT sessions"], ["Database", "Prisma ORM 5", "PostgreSQL"], ["Deployment", "Vercel-compatible configuration"]] as const;

const jobsyncScreenshotGroups = [
  { title: "A / JOB SEARCH WORKSPACE", images: [
    { title: "Dashboard Overview", src: "/images/jobsync/dashboard-overview.png", width: 1921, height: 959, caption: "The dashboard brings together application statistics, weekly activity, application-stage distribution, and recent job-search activity in one workspace." },
    { title: "Application Tracking", src: "/images/jobsync/my-jobs.png", width: 1869, height: 897, caption: "The application tracker organizes job opportunities by company, position, location, application stage, and source, providing a structured record of the job search." },
  ] },
  { title: "B / AI & CAREER INTELLIGENCE", images: [
    { title: "AI-Assisted Resume Analysis", src: "/images/jobsync/resume-analysis.png", width: 974, height: 847, caption: "Resume evaluation combines structured ATS-readiness checks with evidence-based feedback on relevant experience, missing details, and opportunities for improvement. The internal five-check heuristic is not a commercial ATS score or a hiring probability." },
    { title: "Career Intelligence", src: "/images/jobsync/career-intelligence.png", width: 1919, height: 771, caption: "Career intelligence combines application outcomes with saved job-match evaluations to identify best-fit roles, recurring skill gaps, and learning priorities." },
  ] },
  { title: "C / ANALYSIS HISTORY & COMPARISON", images: [
    { title: "Match Score History", src: "/images/jobsync/match-history.png", width: 1266, height: 411, caption: "Saved resume-to-job evaluations provide a historical view of matching results across different roles and resume contexts." },
    { title: "Resume Analysis Comparison", src: "/images/jobsync/resume-comparison.png", width: 1357, height: 953, caption: "Versioned analysis snapshots preserve scoring breakdowns, supporting evidence, and recommendations so users can compare resume evaluations across analysis runs." },
  ] },
  { title: "D / CAREER PREPARATION & ACTIVITY", images: [
    { title: "Mock Interview", src: "/images/jobsync/mock-interview.png", width: 1228, height: 806, caption: "The interview-practice workspace provides structured prompts and an interface for submitting responses as part of job preparation." },
    { title: "Activity Tracking", src: "/images/jobsync/activities.png", width: 1918, height: 842, caption: "Time-stamped activity records track job-search tasks, activity categories, and time spent, providing a chronological view of recorded progress." },
  ] },
] as const;

function JobSyncWalkthrough() {
  const [selected, setSelected] = useState<(typeof jobsyncScreenshotGroups)[number]["images"][number] | null>(null);
  useEffect(() => { if (!selected) return; const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); }; document.addEventListener("keydown", close); return () => document.removeEventListener("keydown", close); }, [selected]);
  return <>
    <div className="secondary-screenshot-groups">{jobsyncScreenshotGroups.map((group) => <div className="secondary-screenshot-group" key={group.title}><p className="detail-label">{group.title}</p><div className="secondary-screenshots">{group.images.map((image, index) => <figure className={index === 0 && group === jobsyncScreenshotGroups[0] ? "secondary-screenshot-featured" : ""} key={image.src}><button type="button" className="pulseops-screenshot-button" onClick={() => setSelected(image)} aria-label={`Enlarge ${image.title}`}><Image src={image.src} alt={`${image.title} screen from the JobSync application`} width={image.width} height={image.height} sizes="(max-width: 760px) 100vw, 50vw" /></button><figcaption><strong>{image.title}</strong><span>{image.caption}</span></figcaption></figure>)}</div></div>)}</div>
    {selected && <div className="pulseops-image-dialog" role="dialog" aria-modal="true" aria-label={`Enlarged ${selected.title}`} onClick={() => setSelected(null)}><div className="pulseops-image-dialog-inner" onClick={(event) => event.stopPropagation()}><div className="pulseops-dialog-header"><p>{selected.title}</p><button type="button" className="pulseops-diagram-button" onClick={() => setSelected(null)}>Close Image</button></div><Image src={selected.src} alt={`${selected.title} screen from the JobSync application`} width={selected.width} height={selected.height} sizes="90vw" /></div></div>}
  </>;
}

export function JobSyncCaseStudy() {
  return <SecondaryCaseStudy project="jobsync" number="02" title="JobSync" subtitle="AI-Powered Job Search & Resume Analysis" description="A full-stack application combining job application management with NLP-based resume analysis, semantic job matching, ATS-style evaluation, and skills-gap recommendations." github="https://github.com/sahithicheruku/JobSync" live="https://job-sync-beige.vercel.app/dashboard" diagrams={jobsyncDiagrams} tech={jobsyncTech} />;
}

export function LendLoopCaseStudy() {
  return <SecondaryCaseStudy project="lendloop" number="03" title="LendLoop" subtitle="Community Lending Platform" description="A full-stack community lending application that enables authenticated users to discover available items, submit borrowing requests, manage approvals, and coordinate returns through ownership-aware workflows." github="https://github.com/sahithicheruku/LendLoop" live="https://lend-loop-bay.vercel.app/" diagrams={lendloopDiagrams} tech={lendloopTech} />;
}

function SecondaryCaseStudy({ project, number, title, subtitle, description, github, live, diagrams, tech }: { project: "jobsync" | "lendloop"; number: string; title: string; subtitle: string; description: string; github: string; live?: string; diagrams: Diagram[]; tech: readonly (readonly string[])[] }) {
  const jobsync = project === "jobsync";
  return <div className="secondary-case-study"><section className="pulseops-overview secondary-header"><p className="detail-label">ENGINEERING CASE STUDY / {number}</p><p className="pulseops-kicker">{subtitle}</p><p className="pulseops-lead">{description}</p><Links items={[...(live ? [{ label: "Live Website", href: live }] : []), { label: "GitHub Repository", href: github }]} /></section>
    <section className="pulseops-content-section"><p className="detail-label">01 / PROJECT OVERVIEW</p><h2>{jobsync ? "From application tracking to career intelligence." : "A structured way to lend and return items."}</h2><p>{jobsync ? "JobSync brings account-scoped job records, resumes, job requirements, and learning priorities into one workflow. Its analysis combines deterministic ATS text checks, evidence-aware rubric scoring, semantic similarity, optional provider-generated feedback, skills-gap identification, and course recommendations without presenting results as hiring probabilities." : "LendLoop addresses the coordination problem behind community borrowing by combining shared item discovery with owner-controlled requests. Server-side checks enforce authenticated access, item ownership, availability, and explicit approval, decline, cancellation, and return transitions."}</p></section>
    <section className="pulseops-content-section"><p className="detail-label">02 / TECHNOLOGY STACK</p><h2>Technology stack</h2><TechGroups groups={tech} /></section>
    <section className="pulseops-content-section"><p className="detail-label">03 / APPLICATION WALKTHROUGH</p><h2>Inside {title}</h2>{jobsync ? <JobSyncWalkthrough /> : <p className="pulseops-muted-note">Application screenshots will be added.</p>}</section>
    <section className="pulseops-content-section"><p className="detail-label">04 / SYSTEM ARCHITECTURE</p><h2>How {title} is structured</h2><DiagramViewer diagram={diagrams[0]} /><p className="pulseops-explanation">{jobsync ? "The Next.js application owns authenticated UI, server-side data access, and analysis routes. Prisma persists account-owned records in PostgreSQL, while the private FastAPI service handles PDF/text extraction, skill extraction, and embedding similarity. OpenAI or Ollama provider paths are used only where configured." : "The Next.js App Router serves the UI and server-side data reads. NextAuth manages Google OAuth sessions, server mutations enforce ownership and state checks, and Prisma maps users, items, and borrow requests to PostgreSQL. Vercel is the verified deployment target represented by the project configuration and live URL."}</p></section>
    <section className="pulseops-content-section"><p className="detail-label">05 / {jobsync ? "RESUME ANALYSIS WORKFLOW" : "BORROWING LIFECYCLE"}</p><h2>{jobsync ? "From resume input to explainable analysis." : "From available item to returned item."}</h2><DiagramViewer diagram={diagrams[1]} /><p className="pulseops-explanation">{jobsync ? "A signed-in user selects account-owned resume and job context. Text-based PDFs are extracted through FastAPI, spaCy identifies skills, and Sentence Transformers calculates cosine similarity with all-MiniLM-L6-v2. The Next.js layer validates evidence, computes the 40% skills / 25% experience / 10% education / 25% semantic rubric, applies deterministic ATS checks, persists analysis snapshots, and presents optional OpenAI or Ollama feedback separately. Unavailable components are excluded and remaining weights are normalized; the score is guidance, not a hiring probability." : "The implementation uses ItemStatus values AVAILABLE, REQUESTED, and BORROWED, alongside BorrowRequestStatus values PENDING, APPROVED, DECLINED, CANCELLED, and RETURNED. Server checks ensure only owners approve or decline, only requesters cancel, and only an owner or approved borrower can return an item."}</p></section>
    <section className="pulseops-content-section"><p className="detail-label">06 / {jobsync ? "VALIDATION & FAILURE HANDLING" : "DATA MODEL & AUTHORIZATION"}</p><h2>{jobsync ? "Invalid input stays visible and bounded." : "Ownership is part of every mutation."}</h2><DiagramViewer diagram={diagrams[2]} /><p className="pulseops-explanation">{jobsync ? "JobSync validates input ownership, provider responses, evidence citations, and structured output before persisting analysis. The repository documents unavailable-data behavior and provider failure handling; it does not claim an AI quality benchmark." : "User, Item, and BorrowRequest relationships make ownership explicit. The API derives ownership from the authenticated session rather than client input, rejects requests for a user’s own item, and checks owner/requester permissions before mutating item or request state."}</p></section>
    <section className="pulseops-content-section"><p className="detail-label">07 / ENGINEERING DECISIONS</p><h2>Implementation choices and boundaries</h2><div className="pulseops-decision-grid">{(jobsync ? [["Next.js + FastAPI", "Next.js owns authenticated workflows and persistence boundaries while FastAPI isolates PDF extraction, skill extraction, and embedding work."], ["Semantic matching", "Embedding similarity captures related language beyond exact keyword overlap, while extracted evidence keeps the result inspectable."], ["Weighted explainability", "The rubric assigns 40% to skills, 25% to experience, 10% to education, and 25% to semantic similarity, with unavailable components excluded and remaining weights normalized."], ["Deterministic ATS checks", "Five text-readiness checks provide a bounded heuristic without claiming commercial ATS compatibility or PDF layout analysis."], ["Provider boundaries", "OpenAI Responses API and Ollama are optional provider paths for generated feedback; their output is schema-validated and not presented as a hiring prediction."], ["PostgreSQL snapshots", "Prisma persists account-scoped jobs, resumes, recommendations, and analysis snapshots with content hashes and model metadata."]] : [["Next.js full-stack structure", "The App Router keeps authenticated reads and server-side mutations close to the application data boundary, while client components handle interactive item actions."], ["Prisma + PostgreSQL", "Relational models connect users, owned items, and borrow requests with explicit foreign keys, unique request constraints, and indexed status lookups."], ["NextAuth + Google OAuth", "Google sign-in supplies the authentication boundary, while Prisma-backed account and session relations support account-scoped access."], ["Ownership-aware authorization", "Server logic derives ownership from the authenticated session and checks owner/requester permissions before approving, declining, cancelling, returning, or deleting."], ["Explicit state transitions", "Separate item and request enums represent availability, pending requests, approvals, declines, cancellations, returns, and restored availability without relying on client-only state."], ["Availability filtering", "The browse flow queries available items while the dashboard separates owned items, incoming requests, active requests, borrowed items, and request history."]]).map(([heading, copy]) => <article key={heading}><h3>{heading}</h3><p>{copy}</p></article>)}</div></section>
    <section className="pulseops-content-section"><p className="detail-label">08 / TESTING &amp; DEPLOYMENT</p><h2>Verification and deployment evidence</h2>{jobsync ? <div className="pulseops-operations jobsync-verification-grid"><div><h3>Automated Testing</h3><p>Jest covers unit and route behavior across career scoring, job actions, authentication-adjacent flows, and API handlers. React Testing Library covers key UI workflows, while Playwright browser tests exercise sign-in, job management, profile flows, and the application’s end-to-end paths.</p></div><div><h3>ML Service &amp; Data Validation</h3><p>The FastAPI service includes a multipart upload test, and the application validates request payloads with Zod schemas before calling analysis routes. Account-ownership checks, evidence-citation validation, and structured provider-response checks keep unsupported or malformed analysis from being persisted as a valid result.</p></div><div><h3>Infrastructure &amp; Deployment</h3><p>Docker Compose defines the Next.js application, FastAPI ML service, PostgreSQL database, and supporting local runtime configuration. Prisma migrations provide the PostgreSQL schema history; no public JobSync deployment URL was verified, so none is presented.</p></div></div> : <p className="pulseops-muted-note">The repository includes Prisma migrations, NextAuth configuration, PostgreSQL environment wiring, and a Vercel-compatible Next.js deployment. No automated test suite was found in the repository; build validation and server-side authorization checks are the available verification evidence.</p>}</section>
    <section className="pulseops-final-links"><p className="detail-label">EXPLORE {title.toUpperCase()}</p>{live && <a className="text-link" href={live} target="_blank" rel="noreferrer">Live Website</a>}<a className="text-link" href={github} target="_blank" rel="noreferrer">GitHub Repository</a><Link className="text-link" href="/#projects">Back to Selected Projects</Link></section>
  </div>;
}
