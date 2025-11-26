import chalk from 'chalk';
import ora from 'ora';
import prompts from 'prompts';
import fs from 'fs-extra';
import path from 'path';
import { getConfig } from '../utils/config.js';
import { COMPONENTS, getComponentFiles } from '../utils/registry.js';

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
    console.log(chalk.red('Error:'), 'chadcn is not initialized.');
    console.log('Run', chalk.cyan('npx chadcn init'), 'to get started.');
    process.exit(1);
  }

  // Get components to add
  let selectedComponents: string[] = [];

  if (options.all) {
    selectedComponents = COMPONENTS.map((c) => c.name);
  } else if (components.length === 0) {
    // Interactive selection
    const { selected } = await prompts({
      type: 'multiselect',
      name: 'selected',
      message: 'Which components would you like to add?',
      choices: COMPONENTS.map((c) => ({
        title: c.name,
        value: c.name,
        description: c.description,
      })),
      hint: '- Space to select. Return to submit',
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
      console.log('Available components:', validComponents.join(', '));
      process.exit(1);
    }

    selectedComponents = components;
  }

  // Add dependencies (collect all unique dependencies)
  const componentDefs = selectedComponents.map((name) =>
    COMPONENTS.find((c) => c.name === name)!
  );

  // Expand dependencies
  const allComponents = new Set<string>();
  const addWithDeps = (name: string) => {
    if (allComponents.has(name)) return;
    allComponents.add(name);
    const comp = COMPONENTS.find((c) => c.name === name);
    comp?.dependencies?.forEach(addWithDeps);
  };
  selectedComponents.forEach(addWithDeps);

  const spinner = ora('Adding components...').start();

  try {
    const componentPath = options.path || config.aliases.components.replace('@/', 'src/');
    const targetDir = path.join(cwd, componentPath);
    await fs.ensureDir(targetDir);

    let addedCount = 0;
    let skippedCount = 0;

    for (const componentName of allComponents) {
      const component = COMPONENTS.find((c) => c.name === componentName)!;
      const files = getComponentFiles(componentName);

      for (const file of files) {
        const targetPath = path.join(targetDir, file.name);

        // Check if file exists
        if (await fs.pathExists(targetPath)) {
          if (!options.overwrite) {
            spinner.text = `Skipping ${file.name} (already exists)`;
            skippedCount++;
            continue;
          }
        }

        // Write file
        await fs.ensureDir(path.dirname(targetPath));
        await fs.writeFile(targetPath, file.content);
        spinner.text = `Added ${file.name}`;
        addedCount++;
      }
    }

    spinner.succeed(`Added ${addedCount} file(s)`);

    if (skippedCount > 0) {
      console.log(chalk.yellow(`Skipped ${skippedCount} file(s) that already exist.`));
      console.log(chalk.gray('Use --overwrite to replace existing files.'));
    }

    // Show install command for npm dependencies
    const npmDeps = new Set<string>();
    for (const name of allComponents) {
      const comp = COMPONENTS.find((c) => c.name === name);
      comp?.npmDependencies?.forEach((d) => npmDeps.add(d));
    }

    if (npmDeps.size > 0) {
      console.log();
      console.log('Install required dependencies:');
      console.log(chalk.cyan(`npm install ${[...npmDeps].join(' ')}`));
    }

    console.log();
    console.log(chalk.green('✓'), 'Components added successfully!');
    console.log();
  } catch (error) {
    spinner.fail('Failed to add components');
    console.error(error);
    process.exit(1);
  }
}
