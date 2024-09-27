# Markdown Links

## Índice

* [1. Prefácio](#1-prefácio)
* [2. Guia de instalação e uso](#2-guia-de-instalação-e-uso)
* [3. Fluxograma](#3-fluxograma)
* [4. Ferramentas utilizadas](#4-ferramentas-utilizadas)


***

## 1. Prefácio

[Markdown](https://pt.wikipedia.org/wiki/Markdown) é uma linguagem de marcação
muito popular entre os programadores. É usada em muitas plataformas que
manipulam texto (GitHub, fórum, blogs e etc) e é muito comum encontrar arquivos
com este formato em qualquer repositório (começando pelo tradicional
`README.md`).

Os arquivos `Markdown` normalmente contém _links_ que podem estar
quebrados, ou que já não são válidos, prejudicando muito o valor da
informação que está ali.

Sendo assim,o objetivo deste projeto foi desenvolver uma biblioteca que lê arquivos Markdown através de uma CLI (command-line interface) que possiblita a execução da biblioteca no terminal, a partir de um módulo do Node.js, no qual, este irá fazer a leitura dos arquivos em formato `Markdown('.md')`, verificando a existência de links e estatisticas que nele existem.


## 2. Guia de instalação e uso

Instale a biblioteca no terminal através do comando: <strong>`npm install md-links-`</strong>

1. Rode o comando <strong>`mdlinks` + o caminho do seu arquivo </strong>, e será retornado o caminho, text e o link do arquivo seleciondao. Veja o exemplo abaixo:  


2. Se você deseja validar os links desse arquivo, utilize a propriedade <strong>--validade</strong>, esta fará uma requisição HTTP e retornará o status e ok do seu link. <br>
Comando: <br>
`md-links <caminho-do-arquivo> --validate` <br>


3. Se você deseja verificar as estatistiscas dos links desse arquivo, utilize a propriedade <strong>--stats</strong>, esta retornará o total de links encontrados no arquivo e quais desses são unicos. <br>
Comando: <br>
`md-links <caminho-do-arquivo> --stats` <br>


4. Se você deseja verificar as estatistiscas e validar os links desse arquivo, utilize a propriedade <strong>--validade --stats</strong>, esta retornará o total de links encontrados no arquivo, quais desses são unicos e quais estão quebrados. <br>
Comando: <br>
`md-links <caminho-do-arquivo> --validate --stats` <br>
 

## 3. Fluxograma


## 4. Ferramentas utilizadas

 <img alt="JS" height="50" src="https://cdn2.iconfinder.com/data/icons/designer-skills/128/code-programming-javascript-software-develop-command-language-256.png"> <img alt="git" height="40" src="https://cdn3.iconfinder.com/data/icons/social-media-2169/24/social_media_social_media_logo_git-256.png"/> <img alt="github" height="45" src="https://cdn1.iconfinder.com/data/icons/unicons-line-vol-3/24/github-256.png"/> <img alt="nodejs" height="45" src="https://cdn.icon-icons.com/icons2/2415/PNG/512/nodejs_plain_logo_icon_146409.png"/> 