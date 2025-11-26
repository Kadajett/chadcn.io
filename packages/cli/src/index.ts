import { Command } from 'commander';
import { init } from './commands/init.js';
import { add } from './commands/add.js';
import { diff } from './commands/diff.js';

const program = new Command();

program
  .name('chadcn')
  .description('CLI for adding chadcn hyper-dense UI components to your project')
  .version('0.0.1');

program
  .command('init')
  .description('Initialize chadcn in your project')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-d, --defaults', 'Use default configuration')
  .option('-t, --theme <theme>', 'Set default theme (photoshop, blender, gimp, vscode, light)', 'photoshop')
  .option('-c, --cwd <cwd>', 'The working directory', process.cwd())
  .action(init);

program
  .command('add')
  .description('Add components to your project')
  .argument('[components...]', 'Components to add')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-o, --overwrite', 'Overwrite existing files')
  .option('-a, --all', 'Add all available components')
  .option('-p, --path <path>', 'Path to add components to')
  .option('-c, --cwd <cwd>', 'The working directory', process.cwd())
  .action(add);

program
  .command('diff')
  .description('Check for updates to components')
  .argument('[component]', 'Component to check')
  .option('-c, --cwd <cwd>', 'The working directory', process.cwd())
  .action(diff);

program.parse();
