import chalk from 'chalk';
import mdLinks from './mdLinks.js';
import { statsLinks } from './mdLinks.js';

const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
}


mdLinks(path, options)
  .then((results) => {
    if (options.validate && options.stats) {
      const statsLink = statsLinks(results);
      console.log(chalk.gray('Total links:' + statsLink.total));
      console.log(chalk.gray('Unique links:' + statsLink.unique));
      console.log(chalk.redBright('Broken links:' + statsLink.broken));

    } else if (options.validate) {
      results.forEach((link) => {
        if (link.error !== undefined) {
          console.log(chalk.red(link.error));
          console.log(chalk.red(link.file));
        } else {
          console.log(chalk.gray('File:' + link.file));
          console.log(chalk.gray('Text:' + link.text));
          console.log(chalk.gray('Href:' + link.href));

          if (link.ok === 'FAIL') {
            console.log(chalk.red('Status HTTP:' + link.status))
            console.log(chalk.red('OK:' + link.ok))
          } else {
            console.log(chalk.gray('Status HTTP:' + link.status));
            console.log(chalk.gray('OK:' + link.ok));
          }
          console.log('------------------------------------------------------------------------');
        }
      });
    } else if (options.stats) {
      console.log(chalk.gray('Total links:' + results.total));
      console.log(chalk.gray('Unique links:' + results.unique));

    } else {
      console.log(results);
      console.log('------------------------------------------------------------------------');
    }
  })
  .catch((error) => {
    console.log(error);
  });