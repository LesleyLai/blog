// Helpers to process projects data

import { languages, type Language } from "@i18n/i18n";
import { getCollection, type CollectionEntry } from "astro:content";

class Projects {
  projects: CollectionEntry<"projects">[];
  projectCountByTags: Map<string, number>;

  constructor(projects: CollectionEntry<"projects">[]) {
    this.projects = projects;

    this.projectCountByTags = (() => {
      const map = new Map<string, number>();
      for (const project of this.projects) {
        for (const tag of project.data.tags) {
          if (map.has(tag)) {
            map.set(tag, map.get(tag)! + 1);
          } else {
            map.set(tag, 1);
          }
        }
      }

      return map;
    })();
  }

  get tags() {
    return Array.from(this.projectCountByTags.keys());
  }
}

// Projects are sorted by their last modified date
const ALL_PROJECTS = (await getCollection("projects")).sort((a, b) => {
  const aDate = a.data.modified ?? a.data.created;
  const bDate = b.data.modified ?? b.data.created;

  return bDate.valueOf() - aDate.valueOf();
});

export const PROJECT_BY_LANG: Record<Language, Projects> = Object.fromEntries(
  languages.map((lang) => {
    const projects = ALL_PROJECTS.filter((project) => project.slug.endsWith(`/${lang}`));
    return [lang, new Projects(projects)];
  })
) as Record<Language, Projects>;

export const ALL_PROJECT_TAGS = PROJECT_BY_LANG["en"].tags;
