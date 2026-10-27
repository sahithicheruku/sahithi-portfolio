"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useId, useState } from "react";

const diagrams = [
  { id: "system-architecture", label: "System architecture", source: `flowchart LR
  subgraph presentation[Presentation]
    direction LR
    frontend[React + TypeScript + Vite + Tailwind]
    nginx[Nginx frontend proxy]
    frontend -->|HTTP / SSE| nginx
  end
  subgraph application[Application and security]
    direction LR
    api[Spring Boot REST controllers]
    auth[JWT authentication and ownership]
    validation[Bean Validation]
    service[Transaction services]
    sse[Server-Sent Events]
    nginx --> api
    api --> auth
    api --> validation
    validation --> service
    api --> sse
  end
  subgraph data[Data and messaging]
    direction LR
    postgres[(PostgreSQL + Spring Data JPA)]
    redis[(Redis idempotency + rate limiting)]
    producer[Kafka producer]
    topic[(transaction.created)]
    consumer[Kafka consumer]
    retry[Retry topics]
    dlt[Dead-letter topic]
    service --> postgres
    service --> redis
    service --> producer
    producer -->|JSON event| topic
    topic --> consumer
    consumer --> postgres
    consumer --> retry
    retry --> consumer
    consumer --> dlt
  end
  subgraph operations[Infrastructure and operations]
    direction LR
    compose[Docker Compose]
    caddy[Caddy HTTPS in production]
    flyway[Flyway migrations]
    metrics[Actuator + Prometheus]
  end
  caddy --> nginx
  flyway --> postgres
  api --> metrics
  sse --> frontend` },
  { id: "transaction-lifecycle", label: "Transaction lifecycle", source: `sequenceDiagram
  participant UI as React frontend
  participant API as Spring Boot API
  participant R as Redis
  participant DB as PostgreSQL
  participant K as Kafka
  participant C as Kafka consumer
  UI->>API: Authenticated POST transaction
  API->>API: JWT and Bean Validation
  API->>R: Rate-limit and idempotency controls
  R-->>API: Allow or existing transaction
  API->>DB: Persist RECEIVED and history
  API->>K: Publish TransactionCreatedEvent
  API-->>UI: Return transaction response
  K-->>C: Consume transaction.created
  C->>DB: Persist VALIDATING
  C->>DB: Persist PROCESSING
  C->>DB: Persist COMPLETED
  DB-->>UI: SSE status updates through API
  C->>DB: Persist FAILED on validation failure` },
  { id: "failure-recovery", label: "Failure and recovery", source: `flowchart LR
  consume[Consumer processing failure]
  retry[Kafka retry topic and backoff]
  recovered[Successful retry]
  exhausted[Retries exhausted]
  dlt[Dead-letter topic]
  handler[Dead-letter handler]
  failure[Persist FAILED status, reason, and retry metadata]
  eligible{Retry count below service limit?}
  manual[POST /transactions/id/retry]
  received[Return to RECEIVED]
  publish[Republish TransactionCreatedEvent]
  retained[Remain FAILED for operator review]
  consume --> retry
  retry --> recovered
  retry --> exhausted
  recovered --> complete[Continue normal processing]
  exhausted --> dlt --> handler --> failure --> eligible
  subgraph recovery[Manual recovery]
    direction LR
    manual[POST /transactions/id/retry] --> received[Return to RECEIVED] --> publish[Republish TransactionCreatedEvent]
  end
  eligible -->|Yes| manual
  eligible -->|No| retained[Remain FAILED for operator review]` },
] as const;

const technologyGroups = [
  ["Backend", "Java 21", "Spring Boot", "Spring MVC", "Spring Security", "Spring Data JPA", "Bean Validation"],
  ["Frontend", "React", "TypeScript", "Vite", "Tailwind CSS"],
  ["Data & Messaging", "PostgreSQL", "Redis", "Apache Kafka", "Flyway"],
  ["Infrastructure & Deployment", "Docker", "Docker Compose", "Nginx", "Caddy"],
  ["Observability & Testing", "Spring Boot Actuator", "Prometheus", "JUnit", "Testcontainers"],
] as const;

const decisions = [
  ["Kafka", "Asynchronous event processing lets the API publish a transaction-created event without coupling the request to the consumer’s full processing path. That boundary adds retry-topic, backoff, and dead-letter handling that the application must make visible."],
  ["PostgreSQL", "Transactions and status history are persisted in relational storage so refreshes and detail views reconstruct state from durable records. Spring Data JPA repositories provide the persistence boundary used by the service."],
  ["Redis", "Redis reserves idempotency keys and coordinates the configurable transaction-creation rate limit. It is operational request state, not the authoritative transaction store."],
  ["JWT authentication", "The API validates bearer JWTs and uses the authenticated subject as the owner key for transaction queries and operations. This keeps transaction reads and actions scoped to the requesting user."],
  ["Server-Sent Events", "The status stream sends persisted status-history changes to the browser over SSE. This gives the detail view live updates without replacing PostgreSQL with browser-only state."],
  ["Retry and dead-letter handling", "Spring Kafka retry topics apply configured attempts and backoff before exhausted events reach the dead-letter handler. Eligible failed transactions can be reset to RECEIVED and republished for controlled manual recovery."],
] as const;

const walkthroughGroups = [
  { title: "Operations Dashboard", description: "A consolidated view of transaction activity, processing states, recent events, failures, and service health.", images: [
    { src: "/images/pulseops/dashboard-overview.png", width: 1908, height: 755, title: "Dashboard Overview", caption: "Provides a centralized view of transaction activity, including total volume, completed and in-flight transactions, failure counts, and the event-driven processing pipeline." },
    { src: "/images/pulseops/dashboard-status-distribution.png", width: 1610, height: 357, title: "Status Distribution", caption: "Visualizes transaction states and recent processing activity, helping users understand how transactions are distributed across different stages." },
    { src: "/images/pulseops/dashboard-recent-activity.png", width: 1910, height: 777, title: "Recent Activity", caption: "Displays recent transaction records alongside status-change events, providing visibility into transaction processing and lifecycle progression." },
    { src: "/images/pulseops/dashboard-failure-operations.png", width: 1618, height: 570, title: "Failure Operations", caption: "Highlights failed transactions, recorded failure reasons, retry attempts, and service health to support operational troubleshooting." },
  ] },
  { title: "Operational Analytics", description: "Historical transaction data summarized through volume, throughput, reliability, latency, currency, and status views.", images: [
    { src: "/images/pulseops/analytics-overview.png", width: 1913, height: 813, title: "Analytics Overview", caption: "Presents transaction volume, throughput, success and failure rates, and processing latency using historical transaction data." },
    { src: "/images/pulseops/analytics-details.png", width: 1608, height: 724, title: "Analytics Details", caption: "Provides additional breakdowns of transaction currencies, processing states, recorded failures, and average and P95 processing latency." },
  ] },
  { title: "Transaction Management", description: "Authenticated workflows for reviewing, filtering, investigating, and submitting transactions.", images: [
    { src: "/images/pulseops/transactions-ledger.png", width: 1920, height: 960, title: "Transactions Ledger", caption: "Offers a searchable, filterable view of transaction records, including amounts, currencies, processing statuses, timestamps, and failure information." },
    { src: "/images/pulseops/create-transaction.png", width: 1925, height: 960, title: "Create Transaction", caption: "Allows authenticated users to initiate a transaction by specifying an amount, selecting a currency, and providing an optional description." },
  ] },
] as const;

function MermaidDiagram({ id, source, expanded = false }: { id: string; source: string; expanded?: boolean }) {
  const generatedId = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => {
    let active = true;
    import("mermaid").then(async ({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "base", themeVariables: { background: "#0B0C10", mainBkg: "#1B1B1E", primaryColor: "#1B1B1E", primaryTextColor: "#F3F0EA", primaryBorderColor: "#C8AE87", lineColor: "#C8AE87", edgeLabelBackground: "#1B1B1E", secondaryColor: "#0B0C10", tertiaryColor: "#302D2B", actorBkg: "#1B1B1E", actorBorder: "#C8AE87", actorTextColor: "#F3F0EA", signalColor: "#C8AE87", signalTextColor: "#F3F0EA", labelBoxBkgColor: "#1B1B1E", labelTextColor: "#F3F0EA", entityBkg: "#1B1B1E", entityBorder: "#C8AE87", attributeBackgroundColor: "#302D2B", attributeBorderColor: "#C8AE87", relationshipLabelBackground: "#1B1B1E", relationshipLabelColor: "#F3F0EA", textColor: "#F3F0EA", fontFamily: "Arial, sans-serif", fontSize: "16px" } });
      try { const result = await mermaid.render(`pulseops-${id}-${generatedId}`, source); if (active) setSvg(result.svg); } catch { if (active) setError(true); }
    });
    return () => { active = false; };
  }, [generatedId, id, source]);
  return <div className={`pulseops-diagram${expanded ? " pulseops-diagram-expanded" : ""}`} role="img" aria-label={`${id} architecture diagram`}>{error ? <pre>{source}</pre> : svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : <p className="pulseops-diagram-loading">Rendering diagram…</p>}</div>;
}

function WalkthroughGallery() {
  const [selected, setSelected] = useState<(typeof walkthroughGroups)[number]["images"][number] | null>(null);
  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [selected]);
  return <>
    <div className="pulseops-walkthrough-groups">{walkthroughGroups.map((group) => <div className="pulseops-walkthrough-group" key={group.title}>
      <h3>{group.title}</h3><p>{group.description}</p>
      <div className={`pulseops-screenshot-grid pulseops-screenshot-grid-${group.images.length}`}>
        {group.images.map((image, index) => <figure className={index === 0 ? "pulseops-screenshot-featured" : ""} key={image.src}><button type="button" className="pulseops-screenshot-button" onClick={() => setSelected(image)} aria-label={`Enlarge ${image.title}`}><Image src={image.src} alt={image.title} width={image.width} height={image.height} sizes="(max-width: 760px) 100vw, 80vw" /></button><figcaption><strong>{image.title}</strong><span>{image.caption}</span></figcaption></figure>)}
      </div>
    </div>)}</div>
    {selected && <div className="pulseops-image-dialog" role="dialog" aria-modal="true" aria-label={`Enlarged ${selected.title}`} onClick={() => setSelected(null)}><div className="pulseops-image-dialog-inner" onClick={(event) => event.stopPropagation()}><div className="pulseops-dialog-header"><p>{selected.title}</p><button type="button" className="pulseops-diagram-button" onClick={() => setSelected(null)}>Close Image</button></div><Image src={selected.src} alt={selected.title} width={selected.width} height={selected.height} sizes="90vw" /></div></div>}
  </>;
}

function DiagramViewer({ diagram }: { diagram: (typeof diagrams)[number] }) {
  const [expanded, setExpanded] = useState(false);
  return <><div className="pulseops-diagram-toolbar"><button type="button" className="pulseops-diagram-button" onClick={() => setExpanded(true)}>View Full Diagram</button></div><MermaidDiagram {...diagram} />{expanded && <div className="pulseops-diagram-dialog" role="dialog" aria-modal="true" aria-label={`Full ${diagram.label} diagram`}><div className="pulseops-dialog-header"><p>{diagram.label}</p><button type="button" className="pulseops-diagram-button" onClick={() => setExpanded(false)}>Close Diagram</button></div><MermaidDiagram {...diagram} expanded /></div>}</>;
}

export function PulseOpsCaseStudy() {
  return <div className="pulseops-case-study">
    <section className="pulseops-overview" aria-labelledby="pulseops-overview-title"><p className="detail-label">ENGINEERING CASE STUDY / 01</p><p className="pulseops-kicker">Event-Driven Transaction Processing</p><p id="pulseops-overview-title" className="pulseops-lead">A full-stack transaction-processing application built with Java 21, Spring Boot, Kafka, PostgreSQL, Redis, and React. The system combines authenticated REST APIs, asynchronous event handling, persistent transaction history, and real-time status updates.</p><div className="pulseops-links"><a className="text-link" href="https://frontend-three-psi-37.vercel.app" target="_blank" rel="noreferrer">Explore Demo</a><a className="text-link" href="https://github.com/sahithicheruku/pulseops" target="_blank" rel="noreferrer">GitHub Repository</a></div><p className="pulseops-demo-note">Click Explore Demo, then wait briefly for the application to load.</p></section>

    <section className="pulseops-content-section"><p className="detail-label">01 / PROJECT OVERVIEW</p><h2>Coordinating stateful transaction work.</h2><p>PulseOps addresses the challenges of building an event-driven transaction-processing system where requests must be authenticated, duplicate submissions controlled, and transaction states persisted reliably. The application separates API request handling from asynchronous processing through Kafka, uses Redis for idempotency and rate limiting, and maintains transaction records and status history in PostgreSQL. Its operational dashboard provides visibility into transaction activity, processing failures, and state transitions.</p><ul className="pulseops-capabilities"><li>Authenticated transaction operations</li><li>Ownership-aware authorization</li><li>Validation and state management</li><li>Kafka processing and recovery</li><li>Transaction history and monitoring</li></ul></section>

    <section className="pulseops-content-section"><p className="detail-label">02 / TECHNOLOGY STACK</p><h2>Technology stack</h2><div className="pulseops-tech-groups">{technologyGroups.map(([category, ...items]) => <div className="pulseops-tech-group" key={category}><p>{category}</p><div>{items.map((item) => <span key={item}>{item}</span>)}</div></div>)}</div></section>

    <section className="pulseops-content-section"><p className="detail-label">03 / APPLICATION WALKTHROUGH</p><h2>Inside PulseOps</h2><WalkthroughGallery /></section>

    <section className="pulseops-content-section"><p className="detail-label">04 / SYSTEM ARCHITECTURE</p><h2>How PulseOps is structured</h2><DiagramViewer diagram={diagrams[0]} /><p className="pulseops-explanation">The React operations console reaches Spring Boot through the Nginx frontend proxy over HTTP and SSE. The API authenticates and validates requests, uses Redis for request controls, persists transaction state in PostgreSQL, and publishes JSON events to Kafka. The consumer writes processing state back to PostgreSQL. Docker Compose, Caddy, Flyway, Actuator, and Prometheus support the runtime and operations around this single transaction-service application.</p></section>

    <section className="pulseops-content-section"><p className="detail-label">05 / TRANSACTION LIFECYCLE</p><h2>From request to completion</h2><DiagramViewer diagram={diagrams[1]} /><p className="pulseops-explanation">An authenticated request passes JWT and Bean Validation checks before Redis applies rate-limit and idempotency controls. PostgreSQL stores the transaction and initial history as RECEIVED, then Kafka carries the TransactionCreatedEvent to the consumer. The consumer persists VALIDATING, PROCESSING, and COMPLETED transitions. Validation failures are persisted as FAILED, and status-history changes can be sent back to the frontend through SSE. Kafka decouples transaction submission from downstream processing, allowing the API to return before processing completes while requiring separate handling for eventual status updates and failures.</p></section>

    <section className="pulseops-content-section"><p className="detail-label">06 / FAILURE &amp; RECOVERY</p><h2>Handling processing failures</h2><DiagramViewer diagram={diagrams[2]} /><p className="pulseops-explanation">A consumer exception is routed through Spring Kafka retry topics with the configured backoff. An event that exhausts retries reaches the dead-letter handler, which records FAILED status and failure metadata. Manual retry is available only while the transaction is FAILED and below the service retry limit; an eligible retry returns it to RECEIVED and republishes its event. Otherwise it remains available for operator review.</p></section>

    <section className="pulseops-content-section"><p className="detail-label">07 / ENGINEERING DECISIONS</p><h2>Design decisions and trade-offs</h2><div className="pulseops-decision-grid">{decisions.map(([title, copy]) => <article key={title}><h3>{title}</h3><p>{copy}</p></article>)}</div></section>

    <section className="pulseops-content-section"><p className="detail-label">08 / TESTING &amp; OPERATIONS</p><h2>Verification and operational readiness</h2><div className="pulseops-operations"><div><h3>Testing</h3><p>Service, controller, analytics, authentication, ownership, and Kafka producer/consumer tests are covered by the repository’s Surefire reports: 48 tests reported, 47 passed, 0 failed, and 1 skipped. The skipped test is the opt-in transaction creation load test; Testcontainers integration results are included in the reported suite without starting new infrastructure during this review.</p></div><div><h3>Database</h3><p>Flyway migrations manage schema evolution, indexes, ownership fields, failure metadata, and trace IDs. Production configuration uses Hibernate schema validation rather than update behavior.</p></div><div><h3>Observability</h3><p>Spring Boot Actuator and Prometheus endpoints expose operational metrics. Correlation and trace IDs are carried through transactions, Kafka events, logs, and status history.</p></div><div><h3>Deployment</h3><p>Docker Compose defines the application, frontend, PostgreSQL, Kafka, and Redis topology. Nginx proxies the frontend and API, while Caddy provides HTTPS routing in the production Compose configuration.</p></div></div></section>

    <section className="pulseops-final-links"><p className="detail-label">EXPLORE PULSEOPS</p><a className="text-link" href="https://frontend-three-psi-37.vercel.app" target="_blank" rel="noreferrer">Explore Demo</a><a className="text-link" href="https://github.com/sahithicheruku/pulseops" target="_blank" rel="noreferrer">GitHub Repository</a><Link className="text-link" href="/#projects">Back to Selected Projects</Link></section>
  </div>;
}
