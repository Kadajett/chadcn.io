import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, resolveConfigPaths } from '../utils/config.js';
import { THEMES, COMPONENTS } from '../utils/registry.js';

interface InitOptions {
  yes?: boolean;
  defaults?: boolean;
  theme?: string;
  cwd: string;
}

export async function init(options: InitOptions) {
  const cwd = path.resolve(options.cwd);

  console.log();
  console.log(chalk.bold('Welcome to chadcn!'));
  console.log(chalk.gray('Hyper-dense UI components for control panels and professional tools.'));
  console.log();

  // Check if already initialized
  const existingConfig = await getConfig(cwd);
  if (existingConfig && !options.yes) {
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'chadcn is already initialized. Do you want to reconfigure?',
      initial: false,
    });
    if (!proceed) {
      console.log(chalk.gray('Configuration cancelled.'));
      return;
    }
  }

  let config: {
    style: string;
    theme: string;
    tailwind: { config: string; css: string; baseColor: string };
    aliases: { components: string; utils: string };
    typescript: boolean;
  };

  if (options.defaults || options.yes) {
    config = {
      style: 'default',
      theme: options.theme || 'photoshop',
      tailwind: {
        config: 'tailwind.config.ts',
        css: 'src/styles/globals.css',
        baseColor: 'slate',
      },
      aliases: {
        components: '@/components/ui',
        utils: '@/lib/utils',
      },
      typescript: true,
    };
  } else {
    const responses = await prompts([
      {
        type: 'select',
        name: 'theme',
        message: 'Which theme would you like to use?',
        choices: THEMES.map((t) => ({
          title: t.label,
          value: t.name,
          description: t.description,
        })),
        initial: 0,
      },
      {
        type: 'text',
        name: 'tailwindConfig',
        message: 'Where is your tailwind.config file?',
        initial: 'tailwind.config.ts',
      },
      {
        type: 'text',
        name: 'tailwindCss',
        message: 'Where is your global CSS file?',
        initial: 'src/styles/globals.css',
      },
      {
        type: 'text',
        name: 'componentsAlias',
        message: 'Configure the import alias for components:',
        initial: '@/components/ui',
      },
      {
        type: 'text',
        name: 'utilsAlias',
        message: 'Configure the import alias for utilities:',
        initial: '@/lib/utils',
      },
      {
        type: 'confirm',
        name: 'typescript',
        message: 'Are you using TypeScript?',
        initial: true,
      },
    ]);

    config = {
      style: 'default',
      theme: responses.theme,
      tailwind: {
        config: responses.tailwindConfig,
        css: responses.tailwindCss,
        baseColor: 'slate',
      },
      aliases: {
        components: responses.componentsAlias,
        utils: responses.utilsAlias,
      },
      typescript: responses.typescript,
    };
  }

  const spinner = ora('Initializing chadcn...').start();

  try {
    // Create config file
    const configPath = path.join(cwd, 'chadcn.json');
    await fs.writeJSON(configPath, config, { spaces: 2 });
    spinner.text = 'Created chadcn.json';

    // Resolve paths
    const resolvedPaths = await resolveConfigPaths(cwd, config);

    // Create CSS file with theme variables
    const cssPath = path.join(cwd, config.tailwind.css);
    await fs.ensureDir(path.dirname(cssPath));

    const cssContent = generateCssContent(config.theme);
    await fs.writeFile(cssPath, cssContent);
    spinner.text = 'Created CSS with theme variables';

    // Create utils file
    const utilsDir = path.join(cwd, config.aliases.utils.replace('@/', 'src/'));
    await fs.ensureDir(path.dirname(utilsDir));

    const utilsContent = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;
    const utilsPath = path.join(utilsDir, `utils.${config.typescript ? 'ts' : 'js'}`);
    await fs.ensureDir(path.dirname(utilsPath));
    await fs.writeFile(utilsPath, utilsContent);
    spinner.text = 'Created utility functions';

    spinner.succeed('Initialization complete!');

    console.log();
    console.log(chalk.green('✓'), 'chadcn has been initialized');
    console.log();
    console.log('Next steps:');
    console.log(chalk.gray('  1.'), 'Add components with', chalk.cyan('npx chadcn add <component>'));
    console.log(chalk.gray('  2.'), 'Import styles in your app:', chalk.cyan(`import '${config.tailwind.css}'`));
    console.log();
    console.log('Available components:');
    COMPONENTS.forEach((c) => {
      console.log(chalk.gray('  •'), c.name, chalk.gray(`- ${c.description}`));
    });
    console.log();
  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(error);
    process.exit(1);
  }
}

function generateCssContent(theme: string): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

/* CHADCN Theme: ${theme} */
/* Generated by chadcn CLI */

@layer base {
  :root,
  [data-theme="${theme}"] {
    /* Theme variables are loaded from @chadcn/ui */
    /* Import the full theme CSS or customize below */
  }
}

/* Import chadcn styles */
/* @import '@chadcn/ui/styles.css'; */
`;
}
