import fs from 'fs-extra';
import path from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

const configSchema = z.object({
  style: z.string().default('default'),
  theme: z.string().default('photoshop'),
  tailwind: z.object({
    config: z.string(),
    css: z.string(),
    baseColor: z.string().default('slate'),
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
  }),
  typescript: z.boolean().default(true),
});

export type Config = z.infer<typeof configSchema>;

const explorer = cosmiconfig('chadcn', {
  searchPlaces: [
    'chadcn.json',
    '.chadcnrc',
    '.chadcnrc.json',
  ],
});

export async function getConfig(cwd: string): Promise<Config | null> {
  try {
    const result = await explorer.search(cwd);
    if (!result) return null;

    return configSchema.parse(result.config);
  } catch {
    return null;
  }
}

export async function resolveConfigPaths(
  cwd: string,
  config: Config
): Promise<{
  tailwindConfig: string;
  tailwindCss: string;
  components: string;
  utils: string;
}> {
  return {
    tailwindConfig: path.resolve(cwd, config.tailwind.config),
    tailwindCss: path.resolve(cwd, config.tailwind.css),
    components: path.resolve(cwd, config.aliases.components.replace('@/', 'src/')),
    utils: path.resolve(cwd, config.aliases.utils.replace('@/', 'src/')),
  };
}
