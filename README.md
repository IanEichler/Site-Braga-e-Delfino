# Braga & Delfino Advocacia

Site institucional do escritório Braga & Delfino Advocacia, desenvolvido em HTML, CSS e JavaScript. O layout é responsivo e utiliza **Manrope, uma fonte sem serifa**, em títulos, textos e assinaturas tipográficas.

[Visualizar o site no Sites](https://braga-delfino-advocacia.theodoroeporto.chatgpt.site/)

## Executar localmente

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
| `dist/app.js` | Menu mobile, áreas expansíveis, contato e privacidade |
| `dist/assets/` | Imagens, favicon e fontes locais |
| `.openai/hosting.json` | Configuração da hospedagem no Sites |

O contato utiliza o WhatsApp **(66) 99640-3398**, vinculado no perfil do escritório. Os botões abrem a conversa com uma mensagem inicial; o visitante confirma o envio no WhatsApp. Ao alterar o número, atualize as referências em `index.html` e `app.js`.

## Publicar

Para hospedar em um serviço de sites estáticos, publique o conteúdo de `dist`. Não há comando de build. A configuração incluída em `.openai/hosting.json` aponta para o projeto existente no Sites; as permissões de acesso da hospedagem são gerenciadas nesse serviço.

## Fontes e créditos

O conteúdo e as imagens do escritório têm como referência o [perfil oficial no Instagram](https://www.instagram.com/bd_advocaciaa/) e o [Linktree da bio](https://linktr.ee/cpbdadvocacia). A paisagem agrícola é uma imagem ilustrativa de Matic / Unsplash. A fonte Manrope é distribuída sob a SIL Open Font License, incluída em `dist/assets/Manrope-LICENSE.txt`.

Os créditos completos e as observações sobre o conteúdo estão em [README.txt](README.txt).
