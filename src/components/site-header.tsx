import Link from "next/link";

const links = ["About", "Experience", "Projects", "Skills", "Contact"];

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="#home" aria-label="Back to top">Sahithisri<span>.</span></Link>
      <nav aria-label="Primary navigation">
        {links.map((link) => <Link key={link} href={`#${link.toLowerCase()}`}>{link}</Link>)}
      </nav>
    </header>
  );
}
