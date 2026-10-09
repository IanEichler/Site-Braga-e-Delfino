# Braga & Delfino Advocacia

Site institucional do escritório Braga & Delfino Advocacia, desenvolvido em HTML, CSS e JavaScript. O layout é responsivo e utiliza **Manrope, uma fonte sem serifa**, em títulos e textos. O cabeçalho e o rodapé exibem o logotipo fornecido pelo usuário, preservado no arquivo original.

A identidade visual combina **verde profundo (`#12352b`)**, **verde-lima (`#b1e580`)** e tons claros de verde-sálvia, inspirados nas referências fornecidas pelo usuário.

A edição atual é executada localmente em [http://127.0.0.1:4173](http://127.0.0.1:4173).

A composição utiliza tipografia de grande escala, fotografias em recortes orgânicos, painéis interativos para as áreas de atuação e animações de entrada, de rolagem e de hover. As animações respeitam a preferência de movimento reduzido do navegador e podem ser pausadas pelo visitante.

## Executar localmente

No Windows, execute `INICIAR-LOCAL.cmd` e mantenha a janela do servidor aberta.

O projeto não precisa de instalação de dependências nem de uma etapa de build. Com Python disponível, execute na raiz do repositório:

```sh
python -m http.server 4173 --directory dist
```

Abra [http://localhost:4173](http://localhost:4173) no navegador. Também é possível utilizar qualquer servidor de arquivos estáticos, apontando sua pasta pública para `dist`.

## Editar o site

| Arquivo | Conteúdo |
| --- | --- |
| `dist/index.html` | Textos, estrutura da página, links e metadados |
| `dist/styles.css` | Cores, tipografia e layout responsivo |
| `dist/app.js` | Menu mobile, abas de atuação, animações, contato e privacidade |
| `dist/assets/` | Imagens, favicon e fontes locais |
| `.openai/hosting.json` | Configuração da hospedagem no Sites |

O contato utiliza o WhatsApp **(66) 99640-3398**, vinculado no perfil do escritório. Os botões abrem a conversa com uma mensagem inicial; o visitante confirma o envio no WhatsApp. Ao alterar o número, atualize as referências em `index.html` e `app.js`.

## Publicar

Para hospedar em um serviço de sites estáticos, publique o conteúdo de `dist`. Não há comando de build. O arquivo `.openai/hosting.json` registra a configuração histórica do projeto no Sites. A edição local não publica automaticamente nessa hospedagem.

## Fontes e créditos

O conteúdo e as imagens do escritório têm como referência o [perfil oficial no Instagram](https://www.instagram.com/bd_advocaciaa/) e o [Linktree da bio](https://linktr.ee/cpbdadvocacia). A paisagem agrícola é uma imagem ilustrativa de Matic / Unsplash. A fonte Manrope é distribuída sob a SIL Open Font License, incluída em `dist/assets/Manrope-LICENSE.txt`.

Os créditos completos e as observações sobre o conteúdo estão em [README.txt](README.txt).
