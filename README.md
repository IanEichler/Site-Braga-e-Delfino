# Braga & Delfino Advocacia

Site institucional do escritório Braga & Delfino Advocacia, desenvolvido em HTML, CSS e JavaScript. O layout é responsivo e utiliza **Manrope, uma fonte sem serifa**, em títulos e textos. O cabeçalho e o rodapé exibem o logotipo fornecido pelo usuário, preservado no arquivo original.

A identidade visual combina **verde profundo (`#12352b`)**, **verde-lima (`#b1e580`)** e tons claros de verde-sálvia, inspirados nas referências fornecidas pelo usuário.

A edição atual é executada localmente em [http://127.0.0.1:4173](http://127.0.0.1:4173).

O layout segue as referências visuais fornecidas pelo usuário: menu flutuante em cápsula, hero fotográfico centralizado, carrossel de serviços, cartões claros alternados com fotografias, equipe, conteúdos, primeiros passos e painel de contato. A paleta verde e lima, a logo oficial e a tipografia sem serifa foram preservadas. As animações respeitam a preferência de movimento reduzido do navegador e podem ser pausadas pelo visitante.

## Padrão tipográfico

A fonte Manrope segue uma escala centralizada em `dist/styles.css`. Títulos de seção compartilham o mesmo tamanho; subtítulos, textos, controles e legendas também seguem seus respectivos papéis. Os valores em `rem` respeitam o tamanho de texto padrão do navegador.

| Papel | Tamanho com a base de 16 px |
| --- | --- |
| Título principal | 48–72 px, conforme a largura da tela |
| Títulos de seção | 40–56 px, conforme a largura da tela |
| Subtítulos e áreas de atuação | 24–28 px |
| Texto de destaque | 22 px |
| Parágrafos | 16 px |
| Menu, links e botões | 14 px |
| Legendas e informações auxiliares | 12 px |

Para alterar o padrão, edite as variáveis `--font-*` e `--leading-*` em `:root`, em vez de definir tamanhos diferentes por seção.

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
| `dist/app.js` | Menu mobile, carrossel de serviços, animações, contato e privacidade |
| `dist/assets/` | Imagens, favicon e fontes locais |
| `.openai/hosting.json` | Configuração da hospedagem no Sites |

O contato utiliza o WhatsApp **(66) 99640-3398**, vinculado no perfil do escritório. Os botões abrem a conversa com uma mensagem inicial; o visitante confirma o envio no WhatsApp. Ao alterar o número, atualize as referências em `index.html` e `app.js`.

## Publicar

Para hospedar em um serviço de sites estáticos, publique o conteúdo de `dist`. Não há comando de build. O arquivo `.openai/hosting.json` registra a configuração histórica do projeto no Sites. A edição local não publica automaticamente nessa hospedagem.

## Fontes e créditos

O conteúdo e as imagens do escritório têm como referência o [perfil oficial no Instagram](https://www.instagram.com/bd_advocaciaa/) e o [Linktree da bio](https://linktr.ee/cpbdadvocacia). As fotografias de floresta, folhas, campos e arquitetura são ilustrativas; seus créditos estão em `dist/assets/FOTOGRAFIAS.md`. A paisagem agrícola original é de Matic / Unsplash. A fonte Manrope é distribuída sob a SIL Open Font License, incluída em `dist/assets/Manrope-LICENSE.txt`.

Os créditos completos e as observações sobre o conteúdo estão em [README.txt](README.txt).
