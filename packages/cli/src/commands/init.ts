import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig, detectTailwindVersion, type TailwindVersion } from '../utils/config.js';
import { THEMES, COMPONENTS, getComponentsByCategory } from '../utils/registry.js';
import {
  UTILS_TEMPLATE,
  UTILS_TEMPLATE_JS,
  TAILWIND_CONFIG_TEMPLATE,
  TAILWIND_CONFIG_TEMPLATE_JS,
  generateCssContent,
  generateCssContentV4,
} from '../utils/templates.js';

interface InitOptions {
  yes?: boolean;
  defaults?: boolean;
  theme?: string;
  cwd: string;
}

export async function init(options: InitOptions) {
  const cwd = path.resolve(options.cwd);

  console.log();
  console.log(chalk.bold.cyan('     ██████╗██╗  ██╗ █████╗ ██████╗  ██████╗██╗  ██╗██╗███╗   ██╗'));
  console.log(chalk.bold.cyan('    ██╔════╝██║  ██║██╔══██╗██╔══██╗██╔════╝██║  ██║██║████╗  ██║'));
  console.log(chalk.bold.cyan('    ██║     ███████║███████║██║  ██║██║     ███████║██║██╔██╗ ██║'));
  console.log(chalk.bold.cyan('    ██║     ██╔══██║██╔══██║██║  ██║██║     ██╔══██║██║██║╚██╗██║'));
  console.log(chalk.bold.cyan('    ╚██████╗██║  ██║██║  ██║██████╔╝╚██████╗██║  ██║██║██║ ╚████║'));
  console.log(chalk.bold.cyan('     ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝'));
  console.log();
  console.log(chalk.gray('    Hyper-dense UI components for professional tools 🗿'));
  console.log();

  // Check if already initialized
  const existingConfig = await getConfig(cwd);
  if (existingConfig && !options.yes) {
    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'chadchin is already initialized. Do you want to reconfigure?',
      initial: false,
    });
    if (!proceed) {
      console.log(chalk.gray('Configuration cancelled.'));
      return;
    }
  }

  // Detect project type
  const hasPackageJson = await fs.pathExists(path.join(cwd, 'package.json'));
  const hasTsConfig = await fs.pathExists(path.join(cwd, 'tsconfig.json'));
  const hasNextConfig = await fs.pathExists(path.join(cwd, 'next.config.js')) ||
                        await fs.pathExists(path.join(cwd, 'next.config.mjs')) ||
                        await fs.pathExists(path.join(cwd, 'next.config.ts'));
  const hasSrcDir = await fs.pathExists(path.join(cwd, 'src'));

  if (!hasPackageJson) {
    console.log(chalk.yellow('Warning:'), 'No package.json found. Make sure you\'re in the right directory.');
  }

  // Detect Tailwind version
  const tailwindInfo = await detectTailwindVersion(cwd);
  console.log(
    chalk.gray('  Detected:'),
    tailwindInfo.version === '4'
      ? chalk.cyan('Tailwind CSS v4') + (tailwindInfo.hasVitePlugin ? chalk.gray(' (Vite plugin)') : '')
      : chalk.cyan('Tailwind CSS v3') + (tailwindInfo.hasConfig ? chalk.gray(` (${tailwindInfo.configPath})`) : '')
  );
  console.log();

  let config: {
    style: string;
    theme: string;
    tailwind: { config?: string; css: string; baseColor: string; version: TailwindVersion };
    aliases: { components: string; utils: string };
    typescript: boolean;
  };

  // Default CSS path based on detection or common locations
  const defaultCssPath = tailwindInfo.cssPath ||
    (hasSrcDir ? 'src/index.css' : 'index.css');

  if (options.defaults || options.yes) {
    config = {
      style: 'default',
      theme: options.theme || 'photoshop',
      tailwind: {
        // Only set config path for v3
        ...(tailwindInfo.version === '3' && {
          config: hasTsConfig ? 'tailwind.config.ts' : 'tailwind.config.js',
        }),
        css: defaultCssPath,
        baseColor: 'slate',
        version: tailwindInfo.version,
      },
      aliases: {
        components: '@/components/ui',
        utils: '@/lib/utils',
      },
      typescript: hasTsConfig,
    };
  } else {
    // Group themes by category for better UX
    const themeChoices = [
      { title: '─── Creative Tools ───', value: '', disabled: true },
      ...THEMES.filter((t) => t.category === 'creative').map((t) => ({
        title: `${t.label}`,
        value: t.name,
        description: t.description,
      })),
      { title: '─── DaisyUI Inspired ───', value: '', disabled: true },
      ...THEMES.filter((t) => t.category === 'daisyui').map((t) => ({
        title: `${t.label}`,
        value: t.name,
        description: t.description,
      })),
      { title: '─── Retro OS ───', value: '', disabled: true },
      ...THEMES.filter((t) => t.category === 'retro-os').map((t) => ({
        title: `${t.label}`,
        value: t.name,
        description: t.description,
      })),
      { title: '─── Accessibility ───', value: '', disabled: true },
      ...THEMES.filter((t) => t.category === 'accessibility').map((t) => ({
        title: `${t.label}`,
        value: t.name,
        description: t.description,
      })),
    ];

    const responses = await prompts([
      {
        type: 'select',
        name: 'tailwindVersion',
        message: 'Which Tailwind CSS version are you using?',
        choices: [
          {
            title: 'Tailwind CSS v4',
            value: '4',
            description: 'CSS-first config with @theme (Vite, newer projects)',
          },
          {
            title: 'Tailwind CSS v3',
            value: '3',
            description: 'JavaScript config file (tailwind.config.js)',
          },
        ],
        initial: tailwindInfo.version === '4' ? 0 : 1,
      },
      {
        type: 'select',
        name: 'theme',
        message: 'Which default theme would you like to use?',
        choices: themeChoices.filter((c) => c.value !== ''),
        initial: 0,
      },
      {
        type: (prev, values) => values.tailwindVersion === '3' ? 'text' : null,
        name: 'tailwindConfig',
        message: 'Where is your tailwind.config file?',
        initial: tailwindInfo.configPath || (hasTsConfig ? 'tailwind.config.ts' : 'tailwind.config.js'),
      },
      {
        type: 'text',
        name: 'tailwindCss',
        message: 'Where is your global CSS file?',
        initial: defaultCssPath,
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
        initial: hasTsConfig,
      },
    ]);

    if (!responses.theme) {
      console.log(chalk.gray('Configuration cancelled.'));
      return;
    }

    const selectedVersion = responses.tailwindVersion as TailwindVersion;

    config = {
      style: 'default',
      theme: responses.theme,
      tailwind: {
        // Only include config path for v3
        ...(selectedVersion === '3' && responses.tailwindConfig && {
          config: responses.tailwindConfig,
        }),
        css: responses.tailwindCss,
        baseColor: 'slate',
        version: selectedVersion,
      },
      aliases: {
        components: responses.componentsAlias,
        utils: responses.utilsAlias,
      },
      typescript: responses.typescript,
    };
  }

  const spinner = ora('Initializing chadchin...').start();

  try {
    // Create config file
    const configPath = path.join(cwd, 'chadchin.json');
    await fs.writeJSON(configPath, config, { spaces: 2 });
    spinner.text = 'Created chadchin.json';

    // Create CSS file with all theme variables (use v4 template if v4)
    const cssPath = path.join(cwd, config.tailwind.css);
    await fs.ensureDir(path.dirname(cssPath));
    const cssContent = config.tailwind.version === '4'
      ? generateCssContentV4(config.theme, true)
      : generateCssContent(config.theme, true);
    await fs.writeFile(cssPath, cssContent);
    spinner.text = config.tailwind.version === '4'
      ? 'Created CSS with @theme config (Tailwind v4)'
      : 'Created CSS with theme variables';

    // Create/update tailwind.config (only for v3)
    if (config.tailwind.version === '3' && config.tailwind.config) {
      const tailwindConfigPath = path.join(cwd, config.tailwind.config);
      const tailwindContent = config.typescript
        ? TAILWIND_CONFIG_TEMPLATE
        : TAILWIND_CONFIG_TEMPLATE_JS;
      await fs.writeFile(tailwindConfigPath, tailwindContent);
      spinner.text = 'Created tailwind.config';
    }

    // Create utils file
    const utilsAlias = config.aliases.utils.replace('@/', '');
    const utilsDir = path.join(cwd, hasSrcDir ? 'src' : '', utilsAlias.split('/').slice(0, -1).join('/'));
    await fs.ensureDir(utilsDir);

    const utilsContent = config.typescript ? UTILS_TEMPLATE : UTILS_TEMPLATE_JS;
    const utilsFileName = config.typescript ? 'utils.ts' : 'utils.js';
    const utilsPath = path.join(cwd, hasSrcDir ? 'src' : '', utilsAlias.replace('utils', utilsFileName));
    await fs.ensureDir(path.dirname(utilsPath));
    await fs.writeFile(utilsPath, utilsContent);
    spinner.text = 'Created utility functions';

    // Create components directory
    const componentsAlias = config.aliases.components.replace('@/', '');
    const componentsDir = path.join(cwd, hasSrcDir ? 'src' : '', componentsAlias);
    await fs.ensureDir(componentsDir);
    spinner.text = 'Created components directory';

    spinner.succeed('Initialization complete!');

    // Summary
    console.log();
    console.log(
      chalk.green('✓'),
      'chadchin has been initialized with the',
      chalk.cyan(config.theme),
      'theme',
      chalk.gray(`(Tailwind v${config.tailwind.version})`)
    );
    console.log();
    console.log('Created files:');
    console.log(chalk.gray('  •'), 'chadchin.json', chalk.gray('- Configuration'));
    console.log(
      chalk.gray('  •'),
      config.tailwind.css,
      chalk.gray(config.tailwind.version === '4' ? '- CSS with @theme config' : '- Theme CSS variables')
    );
    if (config.tailwind.version === '3' && config.tailwind.config) {
      console.log(chalk.gray('  •'), config.tailwind.config, chalk.gray('- Tailwind configuration'));
    }
    console.log(chalk.gray('  •'), utilsPath.replace(cwd + '/', ''), chalk.gray('- Utility functions'));
    console.log();

    // Install dependencies prompt
    console.log(chalk.bold('Install required dependencies:'));
    console.log();
    console.log(chalk.cyan('  npm install clsx tailwind-merge class-variance-authority'));
    console.log(chalk.gray('  # or'));
    console.log(chalk.cyan('  pnpm add clsx tailwind-merge class-variance-authority'));
    console.log();

    // Next steps
    console.log(chalk.bold('Next steps:'));
    console.log();
    console.log(chalk.gray('  1.'), 'Install the base dependencies above');
    console.log(chalk.gray('  2.'), 'Add components with', chalk.cyan('npx chadchin add <component>'));
    console.log(chalk.gray('  3.'), 'Or add all components with', chalk.cyan('npx chadchin add --all'));
    console.log();

    // Show components by category
    console.log(chalk.bold('Available components'), chalk.gray(`(${COMPONENTS.length} total)`));
    console.log();

    const categories = getComponentsByCategory();
    const categoryLabels: Record<string, string> = {
      input: 'Input',
      layout: 'Layout',
      navigation: 'Navigation',
      overlay: 'Overlay',
      feedback: 'Feedback',
      creative: 'Creative Tools',
      utility: 'Utility',
    };

    for (const [category, components] of Object.entries(categories)) {
      console.log(chalk.gray(`  ${categoryLabels[category] || category}:`));
      const names = components.map((c) => c.name).join(', ');
      console.log(`    ${names}`);
    }

    console.log();
    console.log(chalk.gray('Documentation:'), chalk.cyan('https://chadcn.io/docs'));
    console.log();
  } catch (error) {
    spinner.fail('Initialization failed');
    console.error(error);
    process.exit(1);
  }
}
