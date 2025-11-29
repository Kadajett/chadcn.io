import fs from 'fs-extra';
import path from 'path';
import { cosmiconfig } from 'cosmiconfig';
import { z } from 'zod';

const configSchema = z.object({
  style: z.string().default('default'),
  theme: z.string().default('photoshop'),
  tailwind: z.object({
    config: z.string().optional(), // Optional for Tailwind v4
    css: z.string(),
    baseColor: z.string().default('slate'),
    version: z.enum(['3', '4']).optional(), // Track which version
  }),
  aliases: z.object({
    components: z.string(),
    utils: z.string(),
  }),
  typescript: z.boolean().default(true),
});

export type TailwindVersion = '3' | '4';

export interface TailwindDetectionResult {
  version: TailwindVersion;
  hasVitePlugin: boolean;
  hasConfig: boolean;
  configPath?: string;
  cssPath?: string;
}

/**
 * Detect Tailwind CSS version from project dependencies and files
 */
export async function detectTailwindVersion(cwd: string): Promise<TailwindDetectionResult> {
  const result: TailwindDetectionResult = {
    version: '3',
    hasVitePlugin: false,
    hasConfig: false,
  };

  // Check package.json for dependencies
  const packageJsonPath = path.join(cwd, 'package.json');
  if (await fs.pathExists(packageJsonPath)) {
    try {
      const packageJson = await fs.readJSON(packageJsonPath);
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies,
      };

      // Check for @tailwindcss/vite (v4 indicator)
      if (allDeps['@tailwindcss/vite']) {
        result.version = '4';
        result.hasVitePlugin = true;
      }

      // Check tailwindcss version
      const twVersion = allDeps['tailwindcss'];
      if (twVersion) {
        // v4 starts with 4.x or ^4 or ~4
        if (twVersion.match(/^[\^~]?4/)) {
          result.version = '4';
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
  }

  // Check for existing tailwind config files (v3 indicator)
  const configFiles = [
    'tailwind.config.js',
    'tailwind.config.ts',
    'tailwind.config.mjs',
    'tailwind.config.cjs',
  ];

  for (const configFile of configFiles) {
    const configPath = path.join(cwd, configFile);
    if (await fs.pathExists(configPath)) {
      result.hasConfig = true;
      result.configPath = configFile;
      // If config exists but no v4 indicators, assume v3
      if (!result.hasVitePlugin) {
        result.version = '3';
      }
      break;
    }
  }

  // Check for common CSS file locations
  const cssLocations = [
    'src/index.css',
    'src/styles/globals.css',
    'src/app/globals.css',
    'app/globals.css',
    'styles/globals.css',
    'src/styles.css',
  ];

  for (const cssPath of cssLocations) {
    if (await fs.pathExists(path.join(cwd, cssPath))) {
      result.cssPath = cssPath;
      break;
    }
  }

  return result;
}

export type Config = z.infer<typeof configSchema>;

const explorer = cosmiconfig('chadchin', {
  searchPlaces: [
    'chadchin.json',
    '.chadchinrc',
    '.chadchinrc.json',
    // Also support legacy chadcn config files
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
