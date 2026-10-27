import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { PulseOpsCaseStudy } from "@/components/pulseops-case-study";
import { JobSyncCaseStudy, LendLoopCaseStudy } from "@/components/secondary-case-study";

export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: `${project.name} | Sahithisri Cheruku`, description: project.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <main className="case-study section-shell"><Link className="back-link" href="/#projects"><ArrowLeft size={15} aria-hidden="true" /> Back to selected work</Link>{slug === "pulseops" ? <><h1 className="pulseops-page-title">PulseOps</h1><PulseOpsCaseStudy /></> : slug === "jobsync" ? <><h1 className="secondary-page-title">JobSync</h1><JobSyncCaseStudy /></> : slug === "lendloop" ? <><h1 className="secondary-page-title">LendLoop</h1><LendLoopCaseStudy /></> : <><p className="section-index">Case Study / {project.name}</p><h1>{project.title}</h1><p className="case-study-lead">{project.description}</p><div className="case-study-grid"><section><p className="detail-label">Technology stack</p><div className="project-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></section><section><p className="detail-label">Key implementation details</p><ul className="case-study-list">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></section></div><div className="case-study-placeholder" aria-label="Project screenshots will be added when verified assets are available"><span>Project screenshots<br />to come</span></div><section className="case-study-note"><p className="detail-label">Verification note</p><p>{project.verificationNote ?? "Public project information is documented above."}</p></section>{project.links.length > 0 && <div className="project-actions">{project.links.map((link) => <a className="text-link" href={link.href} target="_blank" rel="noreferrer" key={link.label}>{link.label}</a>)}</div>}</>}</main>;
}
