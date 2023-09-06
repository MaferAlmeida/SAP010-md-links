import { extraiLinks, validaLinks, processarArquivo, lerArquivo, lerDiretorio, statsLinks } from '../src/mdLinks';
import axios from 'axios';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

jest.mock('axios');
jest.mock('fs/promises');


//passou
describe('extraiLinks', () => {
  it('deve retornar um array de objetos contendo href e text', () => {
    const texto = 'Este é um [exemplo de link](https://www.exemplo.com)';
    const resultado = extraiLinks(texto);
    expect(resultado).toEqual([{ href: 'https://www.exemplo.com', text: 'exemplo de link' }]);
  });

  it('deve retornar um array vazio quando o texto não contém links', () => {
    const texto = 'Este texto não contém nenhum link';
    const resultado = extraiLinks(texto);
    expect(resultado).toEqual([{ error: 'Este arquivo não contém links.' }]);
  });

  it('deve retornar um array vazio para um texto vazio', () => {
    const texto = '';
    const resultado = extraiLinks(texto);
    expect(resultado).toEqual([{ error: 'Este arquivo não contém links.' }]);
  });
});


//passou
describe('validaLinks', () => {
  it('deve retornar os links válidos com status 200', async () => {
    const links = [
      { href: 'http://www.google.com' },
      { href: 'http://www.facebook.com' },
    ];

    // Mock da resposta do axios para simular uma requisição bem-sucedida
    axios.get.mockImplementation((url) => {
      if (url === 'http://www.google.com') {
        return Promise.resolve({ status: 200 });
      } else if (url === 'http://www.facebook.com') {
        return Promise.resolve({ status: 200 });
      }
    });

    const result = await validaLinks(links);

    expect(result).toEqual([
      { href: 'http://www.google.com', status: 200, ok: 'OK' },
      { href: 'http://www.facebook.com', status: 200, ok: 'OK' },
    ]);
  });

  it('deve retornar os links inválidos com status 404', async () => {
    const links = [
      { href: 'http://www.github.com' },
      { href: 'http://www.nonexistent.com' },
    ];

    // Mock da resposta do axios para simular uma requisição com erro 404
    axios.get.mockImplementation((url) => {
      return Promise.reject(new Error('Request failed with status 404'));
    });

    const result = await validaLinks(links);

    expect(result).toEqual([
      { href: 'http://www.github.com', status: 404, ok: 'FAIL' },
      { href: 'http://www.nonexistent.com', status: 404, ok: 'FAIL' },
    ]);
  });
});

//falhou o primeiro
describe('processarArquivo', () => {
  it('Deve retornar array de links quando o arquivo é válido', () => {
    const caminhoDoArquivo = 'arquivo.md';
    const resultado = processarArquivo(caminhoDoArquivo);
    return resultado.then((links) => {
      expect(Array.isArray(links)).toBe(true);
    });
  });
  it('Deve rejeitar a promise quando ocorre um erro na leitura do arquivo', () => {
    const caminhoDoArquivo = 'arquivo.md';
    const resultado = processarArquivo(caminhoDoArquivo);
    return resultado.catch((error) => {
      expect(error).toBeDefined();
    });
  });
  it('deve retornar uma mensagem de erro se a extensão não for permitida', () => {
    const caminhoDoArquivo = './arquivo.txt';

    const resultado = processarArquivo(caminhoDoArquivo);

    expect(resultado).toEqual([{ error: 'Este arquivo não contém extensão Markdown' }]);
  });
});

//passou
describe('statsLinks', () => {
  test('Deve retornar estatísticas corretas para uma lista de links', () => {
    const links = [
      { href: 'https://www.google.com', ok: 'OK' },
      { href: 'https://www.example.com', ok: 'OK' },
      { href: 'https://www.google.com', ok: 'OK' },
      { href: 'https://www.example.com', ok: 'FAIL' },
    ];

    const result = statsLinks(links);

    expect(result.total).toBe(4);
    expect(result.unique).toBe(2);
    expect(result.broken).toBe(1);
  });
});

//não passou
describe('lerArquivo', () => {
  it('deve ler e processar o arquivo corretamente', async () => {
    const caminhoDoArquivo = './arquivo.md';

    const resultado = await lerArquivo(caminhoDoArquivo);

    expect(resultado).toEqual(['linha 1', 'linha 2', 'linha 3']);
  });

  it('deve retornar um erro caso ocorra algum problema na leitura do arquivo', async () => {
    const caminhoDoArquivo = 'caminho/inexistente.txt';

    const resultado = await lerArquivo(caminhoDoArquivo);

    expect(resultado).toBeInstanceOf(Error);
  });
});

describe('lerDiretorio', () => {
  it('deve retornar um array de links', async () => {
    const caminhoDoDiretorio = 'C:\Users\Maila Ferreira\desktop\SAP010-md-links\testes.arquivos\testdiretorio';
    const options = {
      validate: true,
      stats: false
    };

    const resultado = await lerDiretorio(caminhoDoDiretorio, options);

    expect(resultado).toBeInstanceOf(Array);
    expect(resultado.length).toBeGreaterThan(0);
    expect(resultado[0]).toHaveProperty('href');
    expect(resultado[0]).toHaveProperty('text');
    expect(resultado[0]).toHaveProperty('file');
    expect(resultado[0]).toHaveProperty('status');
  });

  it('deve retornar um array vazio se não houver links', async () => {
    const caminhoDoDiretorio = 'C:\Users\Maila Ferreira\desktop\SAP010-md-links\testes.arquivos\testdiretorio';
    const options = {
      validate: true,
      stats: false
    };

    const resultado = await lerDiretorio(caminhoDoDiretorio, options);

    expect(resultado).toBeInstanceOf(Array);
    expect(resultado.length).toBe(0);
  });

  it('deve retornar um array de links validados', async () => {
    const caminhoDoDiretorio = 'C:\Users\Maila Ferreira\desktop\SAP010-md-links\testes.arquivos\testdiretorio';
    const options = {
      validate: true,
      stats: false
    };

    const resultado = await lerDiretorio(caminhoDoDiretorio, options);

    expect(validaLinks).toHaveBeenCalledWith(resultado);
  });
});

