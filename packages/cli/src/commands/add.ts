import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';
import { getConfig } from '../utils/config.js';
import {
  COMPONENTS,
  fetchComponentFiles,
  getAllDependencies,
  resolveComponentDependencies,
  getComponentsByCategory,
} from '../utils/registry.js';

interface AddOptions {
  yes?: boolean;
  overwrite?: boolean;
  all?: boolean;
  path?: string;
  cwd: string;
}

export async function add(components: string[], options: AddOptions) {
  const cwd = path.resolve(options.cwd);

  // Check for config
  const config = await getConfig(cwd);
  if (!config) {
    console.log(chalk.red('Error:'), 'chadchin is not initialized.');
    console.log('Run', chalk.cyan('npx chadchin init'), 'to get started.');
    process.exit(1);
  }

  // Get components to add
  let selectedComponents: string[] = [];

  if (options.all) {
    selectedComponents = COMPONENTS.map((c) => c.name);
    console.log();
    console.log(chalk.bold('Adding all components...'));
  } else if (components.length === 0) {
    // Interactive selection with categories
    const categories = getComponentsByCategory();
    const categoryLabels: Record<string, string> = {
      input: 'Input Components',
      layout: 'Layout Components',
      navigation: 'Navigation Components',
      overlay: 'Overlay Components',
      feedback: 'Feedback Components',
      creative: 'Creative Tool Components',
      utility: 'Utility Components',
    };

    // Build choices with category headers
    const choices: prompts.Choice[] = [];
    for (const [category, categoryComponents] of Object.entries(categories)) {
      choices.push({
        title: chalk.bold.gray(`─── ${categoryLabels[category] || category} ───`),
        value: `__header_${category}`,
        disabled: true,
      });
      for (const comp of categoryComponents) {
        choices.push({
          title: comp.name,
          value: comp.name,
          description: comp.description,
        });
      }
    }

    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Which components would you like to add?',
      choices: choices.filter((c) => !c.disabled),
      hint: '- Space to select. Return to submit',
      instructions: false,
    });

    if (!selected || selected.length === 0) {
      console.log(chalk.gray('No components selected.'));
      return;
    }

    selectedComponents = selected;
  } else {
    // Validate provided component names
    const validComponents = COMPONENTS.map((c) => c.name);
    const invalidComponents = components.filter((c) => !validComponents.includes(c));

    if (invalidComponents.length > 0) {
      console.log(chalk.red('Error:'), 'Invalid component(s):', invalidComponents.join(', '));
      console.log();
      console.log('Available components:');
      const categories = getComponentsByCategory();
      for (const [category, comps] of Object.entries(categories)) {
        console.log(chalk.gray(`  ${category}:`), comps.map((c) => c.name).join(', '));
      }
      process.exit(1);
    }

    selectedComponents = components;
  }

  // Resolve all dependencies
  const allComponents = new Set<string>();
  for (const name of selectedComponents) {
    const deps = resolveComponentDependencies(name);
    deps.forEach((d) => allComponents.add(d));
  }

  // Show what will be installed
  const additionalDeps = [...allComponents].filter((c) => !selectedComponents.includes(c));
  if (additionalDeps.length > 0 && !options.yes) {
    console.log();
    console.log(chalk.yellow('The following dependencies will also be added:'));
    console.log(chalk.gray('  ' + additionalDeps.join(', ')));
    console.log();

    const { proceed } = await prompts({
      type: 'confirm',
      name: 'proceed',
      message: 'Continue?',
      initial: true,
    });

    if (!proceed) {
      console.log(chalk.gray('Installation cancelled.'));
      return;
    }
  }

  const spinner = ora('Fetching components...').start();

  try {
    // Determine paths
    const hasSrcDir = await fs.pathExists(path.join(cwd, 'src'));
    const componentsAlias = config.aliases?.components?.replace('@/', '') || 'components/ui';
    const targetDir = options.path
      ? path.join(cwd, options.path)
      : path.join(cwd, hasSrcDir ? 'src' : '', componentsAlias);

    await fs.ensureDir(targetDir);

    let addedCount = 0;
    let skippedCount = 0;
    const addedComponents: string[] = [];
    const skippedComponents: string[] = [];

    // Process each component
    for (const componentName of allComponents) {
      spinner.text = `Fetching ${componentName}...`;

      const files = await fetchComponentFiles(componentName);

      for (const file of files) {
        // Convert path (e.g., "Button/Button.tsx" -> target structure)
        const targetPath = path.join(targetDir, file.name);

        // Check if file exists
        if (await fs.pathExists(targetPath)) {
          if (!options.overwrite) {
            skippedCount++;
            if (!skippedComponents.includes(componentName)) {
              skippedComponents.push(componentName);
            }
            continue;
          }
        }

        // Transform imports based on config
        let content = file.content;
        if (config.aliases?.utils) {
          content = content.replace(
            /from ['"]@\/lib\/utils['"]/g,
            `from '${config.aliases.utils}'`
          );
        }
        if (config.aliases?.components) {
          content = content.replace(
            /from ['"]@\/components\/ui\/([^'"]+)['"]/g,
            `from '${config.aliases.components}/$1'`
          );
        }

        // Write file
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, content);
        addedCount++;

        if (!addedComponents.includes(componentName)) {
          addedComponents.push(componentName);
        }
      }
    }

    spinner.succeed(`Added ${addedCount} file(s)`);

    // Show results
    if (addedComponents.length > 0) {
      console.log();
      console.log(chalk.green('Added components:'));
      console.log(chalk.gray('  ' + addedComponents.join(', ')));
    }

    if (skippedCount > 0) {
      console.log();
      console.log(chalk.yellow(`Skipped ${skippedCount} file(s) that already exist.`));
      if (skippedComponents.length > 0) {
        console.log(chalk.gray('  ' + skippedComponents.join(', ')));
      }
      console.log(chalk.gray('  Use --overwrite to replace existing files.'));
    }

    // Get and show npm dependencies
    const { npm: npmDeps, dev: devDeps } = getAllDependencies([...allComponents]);

    if (npmDeps.length > 0) {
      console.log();
      console.log(chalk.bold('Install required dependencies:'));
      console.log();
      console.log(chalk.cyan(`  npm install ${npmDeps.join(' ')}`));
      console.log(chalk.gray('  # or'));
      console.log(chalk.cyan(`  pnpm add ${npmDeps.join(' ')}`));

      // Ask to install automatically
      if (!options.yes) {
        console.log();
        const { autoInstall } = await prompts({
          type: 'confirm',
          name: 'autoInstall',
          message: 'Would you like to install dependencies now?',
          initial: true,
        });

        if (autoInstall) {
          const installSpinner = ora('Installing dependencies...').start();
          try {
            // Detect package manager
            const hasPnpmLock = await fs.pathExists(path.join(cwd, 'pnpm-lock.yaml'));
            const hasYarnLock = await fs.pathExists(path.join(cwd, 'yarn.lock'));
            const hasBunLock = await fs.pathExists(path.join(cwd, 'bun.lockb'));

            let pm = 'npm';
            let installCmd = 'install';
            if (hasPnpmLock) {
              pm = 'pnpm';
              installCmd = 'add';
            } else if (hasYarnLock) {
              pm = 'yarn';
              installCmd = 'add';
            } else if (hasBunLock) {
              pm = 'bun';
              installCmd = 'add';
            }

            await execa(pm, [installCmd, ...npmDeps], { cwd });
            installSpinner.succeed('Dependencies installed!');
          } catch (error) {
            installSpinner.fail('Failed to install dependencies');
            console.log(chalk.gray('Please install manually with the command above.'));
          }
        }
      }
    }

    console.log();
    console.log(chalk.green('✓'), 'Components added successfully!');
    console.log();

    // Usage example
    if (addedComponents.length > 0) {
      const exampleComponent = addedComponents[0];
      const componentDef = COMPONENTS.find((c) => c.name === exampleComponent);
      if (componentDef) {
        // Convert kebab-case to PascalCase
        const pascalName = exampleComponent
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join('');

        console.log(chalk.bold('Usage example:'));
        console.log();
        console.log(chalk.gray(`  import { ${pascalName} } from '${config.aliases?.components || '@/components/ui'}/${pascalName}'`));
        console.log();
      }
    }
  } catch (error) {
    spinner.fail('Failed to add components');
    console.error(error);
    process.exit(1);
  }
}
