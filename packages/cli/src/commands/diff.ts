import chalk from 'chalk';
import { getConfig } from '../utils/config.js';
import path from 'path';

interface DiffOptions {
  cwd: string;
}

export async function diff(component: string | undefined, options: DiffOptions) {
  const cwd = path.resolve(options.cwd);

  const config = await getConfig(cwd);
  if (!config) {
    console.log(chalk.red('Error:'), 'chadcn is not initialized.');
    console.log('Run', chalk.cyan('npx chadcn init'), 'to get started.');
    process.exit(1);
  }

  console.log();
  console.log(chalk.yellow('Note:'), 'Diff functionality coming soon!');
  console.log('This will compare your local components with the latest versions.');
  console.log();

  if (component) {
    console.log(`Checking ${chalk.cyan(component)} for updates...`);
  } else {
    console.log('Checking all components for updates...');
  }
}
