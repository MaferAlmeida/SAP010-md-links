import chalk from 'chalk';
import mdLinks from './mdLinks.js';


const path = process.argv[2];
const options = {
  validate: process.argv.includes('--validate'),
  stats: process.argv.includes('--stats'),
  validateAndStats: process.argv.includes('--validate') && process.argv.includes('--stats'),
}

function statsLinks(links){
  const listaLinks = links.length;
  const uniqueLinks = [... new Set(links.map((link) => link.href))].length;
  const brokenLinks = links.filter((link) => link.ok === 'FAIL').length;
  return {
    total: listaLinks,
    unique: uniqueLinks,
    broken: brokenLinks,
  };
}

mdLinks(path, options)
.then((results) => {
  if (options.validateAndStats){
    const statsLink = statsLinks(results);
    console.log(chalk.gray('Total links:' + statsLink.total));
    console.log(chalk.gray('Unique links:' + statsLink.unique));
    console.log(chalk.bgGray('Broken links:' + statsLink.broken));

  } else if (options.validate){
    results.forEach((link) => {
      console.log(chalk.gray('File:' + link.file));
      console.log(chalk.gray('Text:' + link.text));
      console.log(chalk.gray('Href:' + link.href));
      
      if(link.ok === 'FAIL'){
        console.log(chalk.red('Status HTTP:' + link.status))
        console.log(chalk.red('OK:' + link.ok ))
      } else {
        console.log(chalk.gray('Status HTTP:' + link.status));
        console.log(chalk.gray('OK:' + link.ok));
      }
    });

  } else if (options.stats){
    const statsLink = statsLinks(results);
    console.log(chalk.gray('Total links:' + statsLink.total));
    console.log(chalk.gray('Unique links:' + statsLink.unique));

  } else {
    results.forEach((link) => {
      console.log(chalk.gray('File:' + link.file));
      console.log(chalk.gray('Text:' + link.text));
      console.log(chalk.gray('Href:' + link.href));      
    })
  }
})
.catch((error) => {
  console.error(error);
});