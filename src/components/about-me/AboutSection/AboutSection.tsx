import { Badge, InfoMessage, Section } from "@gi-org-pl/athena";
import { ABOUT_SECTION_TEST_ID } from "./AboutSection.constants";

export interface ProjectItem {
  name: string;
  description: string;
  href: string;
}

export interface AboutSectionProps {
  interests: string[];
  projects: ProjectItem[];
  note?: string;
}

export const AboutSection = ({
  interests,
  projects,
  note,
}: AboutSectionProps) => {
  return (
    <div
      data-testid={ABOUT_SECTION_TEST_ID}
      className="flex w-full flex-col gap-6"
    >
      <Section title="Interests & Technologies">
        <ul className="flex flex-wrap gap-2">
          {interests.map((interest) => (
            <li key={interest}>
              <Badge type="default" variant="outlined" size="regular">
                {interest}
              </Badge>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="What I Have Built">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.name}
              className="flex min-w-0 flex-col justify-between rounded-lg border border-gi-dark-ash bg-gi-light-gray p-4"
            >
              <div className="min-w-0">
                <h3 className="break-words wrap-anywhere text-lg font-semibold text-gi-dark-primary">
                  {project.name}
                </h3>
                <p className="mt-2 break-words wrap-anywhere text-sm leading-relaxed text-gi-dark-gray">
                  {project.description}
                </p>
              </div>
              <div className="mt-4">
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-sm text-sm font-medium text-gi-primary underline underline-offset-4 hover:text-gi-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gi-primary"
                >
                  View repository
                </a>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {note && <InfoMessage variant="info">{note}</InfoMessage>}
    </div>
  );
};
