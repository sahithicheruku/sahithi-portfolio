import { Github, Linkedin, Mail, MapPin } from "lucide-react";

const contactItems = [
  {
    label: "Email",
    value: "sahithisricheruku08@gmail.com",
    href: "mailto:sahithisricheruku08@gmail.com",
    Icon: Mail,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/sahithi-cheruku",
    href: "https://www.linkedin.com/in/sahithi-cheruku",
    Icon: Linkedin,
  },
  {
    label: "GitHub",
    value: "github.com/sahithicheruku",
    href: "https://github.com/sahithicheruku",
    Icon: Github,
  },
] as const;

export function ContactSection() {
  return (
    <section id="contact" className="contact section-shell" aria-labelledby="contact-title">
      <div className="contact-heading">
        <div>
          <p className="section-index">05 / GET IN TOUCH</p>
          <h2 id="contact-title">Let&apos;s connect.</h2>
          <p className="contact-intro">
            I&apos;m open to Software Engineer, Backend Engineer, and Full Stack Developer opportunities. Feel free to reach out to discuss a role or connect professionally.
          </p>
        </div>
        <div className="contact-location" aria-label="Location">
          <MapPin size={17} aria-hidden="true" />
          <span>Dallas, Texas</span>
        </div>
      </div>

      <address className="contact-list">
        {contactItems.map(({ label, value, href, Icon }) => (
          <a className="contact-item" href={href} key={label} target={label === "Email" ? undefined : "_blank"} rel={label === "Email" ? undefined : "noreferrer"}>
            <Icon size={17} aria-hidden="true" />
            <span className="contact-item-label">{label}</span>
            <span className="contact-item-value">{value}</span>
          </a>
        ))}
      </address>
    </section>
  );
}
