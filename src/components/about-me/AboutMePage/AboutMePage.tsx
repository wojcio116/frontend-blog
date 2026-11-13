import { AboutSection } from "../AboutSection/AboutSection";
import { AuthorHero } from "../AuthorHero/AuthorHero";

const AUTHOR_LINKS = [
  { label: "GitHub Profile", href: "https://github.com/wojcio116" },
  {
    label: "Frontend Repository",
    href: "https://github.com/wojcio116/frontend-blog",
  },
];

const AUTHOR_INTERESTS = [
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "Accessibility (a11y)",
  "Unit & E2E Testing",
  "Clean Architecture",
];

const AUTHOR_PROJECTS = [
  {
    name: "Frontend Blog",
    description:
      "Personal page and blog frontend crafted with React Router 7, Tailwind CSS 4, and Athena UI components.",
    href: "https://github.com/wojcio116/frontend-blog",
  },
  {
    name: "Backend Blog API",
    description:
      "Backend REST API service designed to manage and serve blog posts.",
    href: "https://github.com/wojcio116/backend-blog",
  },
];

export const AboutMePage = () => {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-gi-light-gray px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col gap-6">
        <AuthorHero
          name="Wojciech Nizborski"
          role="Frontend Developer Intern"
          bio="Hi! I am Wojciech, a frontend developer focused on building accessible, responsive, and well-tested user interfaces. Outside of coding, I enjoy exploring modern web standards, UI design systems, and problem-solving."
          links={AUTHOR_LINKS}
        />
        <AboutSection
          interests={AUTHOR_INTERESTS}
          projects={AUTHOR_PROJECTS}
          note="Want to get in touch? Feel free to connect with me through my public GitHub profile above."
        />
      </div>
    </main>
  );
};
