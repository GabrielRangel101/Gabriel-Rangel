import { cases } from "./cases";
import { publishedProjects } from "./projects";

export type ToolUsage = {
  tool: string;
  projects: { slug: string; title: string }[];
};

// Une variações do mesmo nome: "Python 3.13" e "Python" viram "Python";
// "Supabase (Postgres, Auth, RLS)" vira "Supabase".
const normalize = (raw: string) =>
  raw
    .replace(/\s*\(.*\)\s*$/, "")
    .replace(/\s+v?\d+(\.\d+)*$/, "")
    .trim();

// Para cada ferramenta, os projetos publicados cuja stack a inclui. Tudo vem da stack declarada
// em cada case, então a página nunca diz que uma ferramenta foi usada onde não foi.
export function toolUsage(): ToolUsage[] {
  const map = new Map<string, Map<string, string>>();
  for (const project of publishedProjects) {
    const study = cases[project.slug];
    if (!study) continue;
    for (const raw of study.stack) {
      const tool = normalize(raw);
      if (!map.has(tool)) map.set(tool, new Map());
      map.get(tool)!.set(project.slug, project.title);
    }
  }
  return [...map.entries()]
    .map(([tool, projects]) => ({
      tool,
      projects: [...projects.entries()].map(([slug, title]) => ({ slug, title })),
    }))
    .sort((a, b) => b.projects.length - a.projects.length || a.tool.localeCompare(b.tool, "pt-BR"));
}
