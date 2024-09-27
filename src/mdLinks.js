import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import axios from 'axios';

//função que extrai os links do arquivo markdown
export function extraiLinks(texto) {
  const regex = /\[([^[\]]+)\]\((https?:\/\/[^\s/$.?#].[^\s]*)\)/g;
  const capturas = [...texto.matchAll(regex)];
  const resultado = capturas.map(captura => ({ href: captura[2], text: captura[1] }));
  return resultado.length !== 0 ? resultado : [{ erro: 'Este arquivo não contém links.' }];
}

//função que lida com os erros
export function trataErro(erro, mensagemErro) {
  console.log(erro);
  return new Error(erro.code, mensagemErro);
}

export function processarArquivo(caminhoDoArquivo) {
  const extensoesPermitidas = ['.md', '.mkd', '.mdwn', '.mdown', '.mdtxt', '.mdtext', '.markdown', '.text'];
  if (extensoesPermitidas.includes(path.extname(caminhoDoArquivo))) {
    const caminhoAbsoluto = path.resolve(caminhoDoArquivo);
    return fsp
      .readFile(caminhoAbsoluto, 'utf-8')
      .then((texto) => {
        let links = extraiLinks(texto);
        links.forEach((link) => {
          link.file = caminhoAbsoluto;
        });
        return links;
      })
      .catch((erroDeLeitura) => {
        return trataErro(erroDeLeitura, 'Houve um problema de leitura');
      });
  } else {
    return trataErro({ code: 404 }, 'Este arquivo não contém extensão Markdown');
  }
}

//função que valida os links encontrados e retorna uma promessa
export function validaLinks(links) {
  const promises = links.map((link) => {
    if (link.erro === undefined) {
      axios.get(link.href)
        .then((response) => {
          link.status = response.status;
          link.ok = response.status === 200 ? 'OK' : 'FAIL';
          return link;
        })
        .catch(() => {
          link.status = 404;
          link.ok = 'FAIL';
          return link;
        });
    } else {
      return link;
    }
  });
  return Promise.all(promises);
}

//função que analisa se é arquivo ou diretório, se é markdown, se tem link, valida os links. Se é diretório, 
//lê e analisa se está com 
function mdLinks(caminhoDoArquivo, options) {
  if (fs.statSync(caminhoDoArquivo).isFile()) {
    const lista = processarArquivo(caminhoDoArquivo);
    if (options.validate === true) {
      return lista.then((data) => {
        return validaLinks(data)
          .then((data) => {
            return data;
          })
      });
    } else {
      return lista;
    }

  } else if (fs.statSync(caminhoDoArquivo).isDirectory()) {
    try {
      let promises = [];
      const arquivos = fs.readdirSync(caminhoDoArquivo);
      arquivos.forEach((nomeDeArquivo) => {
        if (fs.statSync(`${caminhoDoArquivo}/${nomeDeArquivo}`).isDirectory()) {
          promises.push(mdLinks(`${caminhoDoArquivo}/${nomeDeArquivo}`, options));
        } else {
          promises.push(processarArquivo(`${caminhoDoArquivo}/${nomeDeArquivo}`));
        }
      });
      return Promise.all(promises)
        .then((results) => {
          const linksArray = results.reduce(
            (accumulator, links) => accumulator.concat(links),
            [],
          );
          return linksArray;
        });
    } catch (erroDeLeitura) {
      trataErro(erroDeLeitura, 'Houve um problema de leitura');
    }
  }
}

export default mdLinks;