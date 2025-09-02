> Todos os conteúdos deste projeto, incluindo as mudanças registradas neste arquivo, estão sob Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Consulte LICENSE para mais informações.

# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo e seguem o formato [Keep a Changelog 1.1](https://keepachangelog.com/pt-BR/1.1.0/) e a [Versão Semântica 2.0.0](https://semver.org/lang/pt-BR/).

## Unreleased

- Alteração do campo Legenda dos códigos no HTML
- Otimização do modal de pré-visualização de prompt (textos exibidos para o usuário)
- Modularização e padronização de idioma do código
- Refatoração dos códigos para reduzir duplicidades e aplicação de melhores práticas
- Refatoração dos códigos para aperfeiçoar mobile first
- Tradução do projeto para Espanho e Inglês
- Melhorias na tabela de legendas do campo Critérios de priorização
- Histórico de logs com data e título (minímo) para registro dos prompts
- Menu de navegação no topo com campos para explicação, guias, manifesto
- Implementação de seleção por idioma (EN e ES primeiro)
- Campo para exibir média de tokens, palavras, caracteres por prompt gerado
- Adição de banner do projeto
- Alteração do fluxo da etapa 9 deixando-a como última a ser gerada (após o prompt principal)
- Adicão de botão para mostrar/esconder pré-visualização de prompt

## [1.4.3] – 2025-09-02

### Adicionado

- **Header fixo e responsivo**: agora permanece visível no topo em todas as telas
- **Comportamento "shrink"**: cabeçalho reduz suavemente o tamanho ao rolar a página, liberando espaço de leitura

### Modificado

- **Estilo do título (`header h1`)**: ajustado para se adaptar ao estado compacto, preservando clareza e legibilidade
- **Transições do header**: aplicadas para `padding` e `font-size`, resultando em UX mais fluida

_Todas as alterações seguem a abordagem mobile first já utilizada no projeto, sem afetar negativamente layouts existentes_

### Modificado

## [1.4.2] – 2025-09-02

### Modificado

- **Estrutura do `script.js`**: Reorganizado em seções lógicas e bem comentadas (ex: Funções Auxiliares, Modal de Introdução).
- **Funções utilitárias**: Agrupadas e documentadas (`formatField`, `validateCode`, `trapFocus`)
- **Lógica de modais**: Padronizada para abertura, fechamento e acessibilidade
- **Tooltips**: Melhorias no posicionamento e visibilidade
- **Estilos**: Ajustes nas classes e IDs relativos ao botão que realiza cópia dos prompt `#copy-prompt` e `#copy-feedback` para alinhamento com `script.js`. Melhorias na proporção do ícone de informação com adição do elemento e classe `button.info` para visual mais limpo

_Todas as alterações são internas e não afetam o comportamento visível ou funcionalidades existentes_

## [1.4.1] – 2025-09-01

### Adicionado

- Ícone no header para reabrir caixa de boas vindas (instruções)
- Estilos para o ícone adicionado
- Função para reabrir a caixa de boas vindas(instruções) - `reopenIntroBtn`

### Modificado

- Ajustado tooltip customizado para position: fixed com max-width: calc(100vw - 2rem), garantindo exibição correta e responsiva em dispositivos móveis. JS modificado no bloco `// Tooltips customizados para ícones de informação`
- Ajuste no tamanho do ícone de informação do modal de boas vindas para melhorar o design

## [1.4.0] – 2025-09-01

### Adicionado

- **Modal de introdução interativo** substituindo a caixa estática de boas-vindas, utilizando `<div id="intro-modal" class="modal" role="dialog" aria-labelledby="intro-title">`
- Estilos dedicados para `#intro-modal`, `.modal-content`, `.intro-text`, `.intro-minor-text` e `.intro-close` em `styles.css`, garantindo visual limpo, responsivo e acessível
- Script para controle de abertura/fechamento do modal de introdução, com gerenciamento de foco (`trapFocus`) e persistência do estado no `localStorage`
- Adicionados todos os campos para visualização no modal de confirmação com ajustes na função `buildModalSummary` no `script.js` , para exibição correta e otimizada dos elementos

### Modificado

- **Estrutura de exibição da introdução**: Substituição da caixa fixa no topo da janela por um modal centralizado, com animação de entrada (`fadeInScale`)
- Estilos do modal adicionados para abordagem **mobile first**, com breakpoints para tablets e desktops
- Tamanhos de fonte em cabeçalhos de seção revisados para melhor legibilidade e hierarquia visual
- Script principal atualizado para integrar a lógica do modal de introdução, mantendo consistência com a interface existente
- Ajustes no gerenciamento de foco e acessibilidade para garantir que o modal seja fechado corretamente (via botão ou tecla `ESC`)
- Centralização dos estilos do modal
- Refatoração completa do css (DRY e mobile first) - há espaços para melhorias

## [1.3.0] – 2025-08-31

### Adicionado

- Caixa de boas-vindas com instrução rápida ao usuário, utilizando `<div class="card intro-box" role="note" aria-label="Introdução ao OpenPUP">`
- Estilos dedicados para `.intro-box`, `.intro-close`, `.intro-text`, `.intro-minor-text` em `styles.css`, garantindo visual limpo e acessível
- Script para exibir/esconder a caixa de introdução com botão de fechar, mantendo foco e acessibilidade
- Labels HTML revisados para esclarecer o uso de cada campo ao usuário médio

### Modificado

- Posição do campo EXEMPLOS na seção de Códigos e Pesos ajustada para melhorar o fluxo de leitura
- Estilo da folha de estilos atualizado para suportar a nova CAIXA DE BOAS VINDAS sem interferir no layout existente
- Script principal ajustado para integrar a lógica da introdução (BOAS VINDAS) e manter consistência com o restante da interface
- Textos explicativos nos ícones de ajuda ("i") foram ampliados para maior clareza
- Botão **"Copiar Prompt"** reposicionada para testar melhora em experiência do usuário
- Footer reestruturado com abordagem mobile first, melhorias de acessibilidade, responsividade e inclusão de ícones GitHub, Discord e e-mail

### Corrigido

- Ajustes visuais e semânticos em labels e descrições para melhorar compreensão geral
- Pequenas correções de espaçamento e alinhamento em elementos interativos
- Removido bloco duplicado no JS `// ---------- Sugestões de idioma ----------` no fim do arquivo
- Ajuste da função `showLanguageSuggestions()` para atualizar atributos ARIA corretamente
- Estes dois últimos ajustes visam corrigir a exibição da lista de idiomas

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
