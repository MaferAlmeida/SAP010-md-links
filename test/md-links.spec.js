import {mdLinks, trataErro, extraiLinks, validaLinks} from '../src/mdLinks';

jest.mock('axios');

describe('extraiLinks', () => {
  it('Extrai links e retorna um href e text com tratamento de erro', () => {
    const texto = 'Olá, https://www.exemplo.com este é um exemplo de link em um texto';
    const resultado = extraiLinks(texto);
    expect(Array.isArray(resultado)).toBe(true);
    expect(resultado[0]).toEqual({ href: 'https://www.exemplo.com', text: 'este é um exemplo de link' });
  });
  it('Retorna mensagem de erro quando não há links', () => {
    const texto = 'Este texto não contém links';
    expect(() => extraiLinks(texto)).toThrowError('não há links no arquivo');
  });
});


/*describe('trataErro', () => {
  it('Deve lançar um erro com a mensagem correta', () => {
    const erro = { code: 400 };
    const mensagemErro = 'não há links no arquivo';
  
    expect(() => {
      trataErro(erro, mensagemErro);
    }).toThrowError('400 não há links no arquivo');
  });
});*/

describe('validaLinks', () => {
  it('should return status "ok" after validate a valid link', () => {
    const links = [
      { link: 'https://exemplo.com/valido' },
      { link: 'https://exemplo.com/invalido' },
    ];
    validaLinks(links)
    .then((response) => {
      expect(response).toEqual([
        {
          link: 'https://exemplo.com/valido',
          status: 200,
          ok: 'OK',
        },
        {
          link: 'https://exemplo.com/invalido',
          status: 404,
          ok: 'FAIL',
        }
      ]);
    })
    .catch((error) => {
      error.message;
    });
  });
});