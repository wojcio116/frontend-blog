import { Avatar, Badge } from "@gi-org-pl/athena";
import {
  AUTHOR_AVATAR_IMAGE_TEST_ID,
  AUTHOR_DECORATIVE_BADGE_TEST_ID,
  AUTHOR_HERO_TEST_ID,
} from "./AuthorHero.constants";

export interface AuthorLink {
  label: string;
  href: string;
}

export interface AuthorHeroProps {
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  avatarAlt?: string;
  links?: AuthorLink[];
}

export const AuthorHero = ({
  name,
  role,
  bio,
  avatarUrl,
  avatarAlt,
  links = [],
}: AuthorHeroProps) => {
  return (
    <header
      data-testid={AUTHOR_HERO_TEST_ID}
      className="w-full rounded-xl border border-gi-dark-ash bg-white p-6 shadow-xs sm:p-8"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
        <div className="relative shrink-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={avatarAlt ?? `${name} portrait`}
              data-testid={AUTHOR_AVATAR_IMAGE_TEST_ID}
              className="size-20 rounded-full border border-gi-dark-ash object-cover"
            />
          ) : (
            <Avatar name={name} fallback="initials" size="large" />
          )}
          <span
            aria-hidden="true"
            data-testid={AUTHOR_DECORATIVE_BADGE_TEST_ID}
            className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border border-white bg-gi-primary text-xs font-bold text-white"
          >
            *
          </span>
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-center sm:items-start">
          <div className="mb-2">
            <Badge type="info" variant="secondary" size="regular">
              {role}
            </Badge>
          </div>

          <h1 className="w-full min-w-0 break-words wrap-anywhere text-2xl font-bold tracking-tight text-gi-dark-primary sm:text-3xl md:text-4xl">
            {name}
          </h1>

          <p className="mt-3 w-full min-w-0 break-words wrap-anywhere text-base leading-relaxed text-gi-dark-gray">
            {bio}
          </p>

          {links.length > 0 && (
            <nav
              aria-label="Author links"
              className="mt-5 flex flex-wrap justify-center gap-4 sm:justify-start"
            >
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-sm font-medium text-gi-primary underline underline-offset-4 transition-colors hover:text-gi-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gi-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};
