> Todos os conteúdos deste projeto, incluindo as mudanças registradas neste arquivo, estão sob Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Consulte LICENSE para mais informações.

# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo e seguem o formato [Keep a Changelog 1.1](https://keepachangelog.com/pt-BR/1.1.0/) e a [Versão Semântica 2.0.0](https://semver.org/lang/pt-BR/).


## Unreleased
-  Melhorias na tabela de legendas do campo Critérios de priorização
-  Histórico de logs com data e título (minímo) para registro dos prompts
-  Menu de navegação no topo com campos para explicação, guias, manifesto
-  Implementação de seleção por idioma (EN e ES primeiro)
-  Campor de média de tokens, palavras, caracteres por prompt gerado
-  Adição de redes e contatos no footer
-  Adição de banner do projeto
-  Alteração do fluxo da etapa 9 deixando-a como última a ser gerada (após o prompt principal)


## [1.2.0] – 2025-08-31
### Adicionado
- Landmarks **ARIA** e rótulos associados no `index.html` para melhorar acessibilidade.
- Classe `.sr-only` e `.sr-only-focusable` em `styles.css` para suportar leitores de tela.
- Função de **trap de foco** no `script.js` para modais acessíveis.
- Observador `MutationObserver` em `script.js` para habilitar/desabilitar automaticamente o botão de copiar (`#copy-prompt`).
- Feedback de cópia dinâmico com `aria-live` e mensagem mais orgânica.

### Modificado
- Estilo de foco global para inputs, botões, selects e textareas, garantindo consistência sem alterar o design original.
- `#copy-feedback` agora usa cor neutra, itálico e transição suave, tornando o feedback visual mais integrado ao layout.
- Botão **"Copiar Prompt"** inicia desabilitado e só é ativado quando a pré-visualização contém conteúdo.

### Corrigido
- Modal agora fecha corretamente com tecla **Esc** e mantém foco restaurado no elemento que o abriu.
- Campo de seleção de idioma com sugestões passa a atualizar corretamente os atributos `aria-expanded` e `aria-activedescendant`.


## [1.1.0] – 2025-08-31
### Adicionado
- Implementada validação nos campos **Código** para garantir integridade dos dados adicionados no campo Critérios de Priorização 
- Criada a função `validateCode` em `script.js`, responsável por validar os códigos permitidos (`M`, `A`, `S`, `D`) e converter automaticamente a entrada do usuário para letras maiúsculas.

### Modificado
- Refinamento geral no design da interface para melhorar a experiência do usuário em dispositivos móveis e desktop.
- Atualização visual do ícone de informação para maior clareza e consistência com o estilo do projeto.
- Inclusão de classes `.card` na seção `<!--Etapa 2-->` do `index.html`, aprimorando a organização visual e a legibilidade dos elementos.


## [1.0.0] - 2025-08-31
### Adicionado
- Interface web implementada em HTML/CSS/JS com layout responsivo e adaptável.
- Organização de campos conforme estrutura do protocolo OpenPUP, garantindo consistência semântica.
- Geração automatizada de prompt estruturado com base nos parâmetros definidos pelo usuário.
- Inclusão de botão de cópia rápida para exportação do prompt e uso em qualquer ambiente de IA.
- Estilo visual otimizado para legibilidade, com foco em clareza, simplicidade e compatibilidade cross-device.
