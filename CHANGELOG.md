> Todos os conteúdos deste projeto, incluindo as mudanças registradas neste arquivo, estão sob Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Consulte LICENSE para mais informações.

# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo e seguem o formato [Keep a Changelog 1.1](https://keepachangelog.com/pt-BR/1.1.0/) e a [Versão Semântica 2.0.0](https://semver.org/lang/pt-BR/).

## Unreleased

_Nenhuma mudança pendente no momento. Consulte [TODO.md](TODO.md) para roadmap de funcionalidades planejadas._

## [2.1.0] – 2026-01-25

### Adicionado

#### Pré-visualização em Tempo Real

**Preview Humanizado:**
- **Visualização humanizada do protocolo** com ícones Font Awesome para melhor legibilidade
  - Substituição de emojis por ícones profissionais (fas fa-clipboard-list, fas fa-cog, fas fa-bullseye, etc.)
  - Seções organizadas visualmente: Configurações, Tarefa, Formato, Prioridades, Dados, Contexto, Restrições
  - Truncamento automático de textos longos para preview conciso
  - Contadores de critérios e informações contextuais
- **Atualização automática em tempo real** conforme usuário preenche campos
  - Debounce de 500ms para otimizar performance
  - Listeners em todos os campos do formulário (input, change, DOMSubtreeModified)
  - Preview atualiza sem necessidade de clicar "Gerar Prompt"
- **Toggle de visualização** (Material Design) para alternar entre modos:
  - Modo Humanizado: visualização amigável com ícones e formatação
  - Modo Técnico: protocolo completo com tags (TASK, DATA, etc.)
  - Switch animado com estados visuais claros
  - Ícones descritivos (fas fa-user, fas fa-code)
  - Aparece automaticamente após gerar protocolo
- **Modal informativo sobre cópia**:
  - Explica que o protocolo técnico é sempre copiado (não o humanizado)
  - Orientação sobre uso do toggle
  - Aparece quando usuário copia em modo humanizado

**Gerenciamento de Estado:**
- **Centralização do estado do preview** com funções DRY:
  - `loadTechnicalProtocol()`: carrega protocolo e atualiza UI
  - `resetToHumanMode()`: reseta para modo inicial
  - `switchToMode()`: alterna entre modos com scroll automático
- **State tracking**:
  - `state.previewMode`: "human" ou "technical"
  - `state.technicalProtocol`: armazena protocolo gerado
- **Integração com histórico**: ao carregar prompt do histórico, toggle aparece automaticamente

**Recursos Visuais:**
- **Font Awesome 6.5.1 CDN** integrado para biblioteca de ícones
- **Estilos do toggle** com transições suaves e estados hover/focus
- **CSS otimizado** para componentes de preview (cores, espaçamento, responsividade)

## [2.0.0] – 2026-01-17

> **VERSÃO ESTÁVEL - RECOMENDADA**
>
> Esta versão combina auditabilidade (v1) com melhorias substanciais de UX, validação e persistência.
> Mantém etapas 5-9 obrigatórias e visíveis, garantindo controle total do usuário sobre a IA.

### Contexto

Desenvolvida após análise dos incidentes da v2-experimental (documentados em `DOCS/auditoria/`), esta versão implementa a estratégia:

- **UI que guia pensamento** (antes de perguntar)
- **Prompt que mantém controle** (durante execução da IA)
- **Etapas que permitem auditoria** (depois de receber resposta)

### Adicionado

#### Interface de Usuário

**Estrutura e Layout:**

- **Header sticky** com `position: sticky`, `top: 0` e `z-index: 100` para manter navegação visível durante scroll
- **Header refatorado** com wrapper e organização de conteúdo separados para melhor estruturação
- **Estado compacto do header** (classe `.shrink`) aplicado dinamicamente ao rolar a página, reduzindo padding e font-size com transições suaves
- **Barra de progresso integrada ao header** mostrando percentual de completude quando a barra original sai da viewport
- **Biblioteca anime.min.js** incluída para suporte a animações futuras

**Formulário:**

- **Decomposição do objetivo em 3 campos reflexivos**:
  - "O que a IA deve fazer" (`objetivo_o_que`) - tarefa específica
  - "Por que você precisa disso" (`objetivo_por_que`) - contexto e propósito
  - "Como você saberá que ficou bom" (`objetivo_criterio`) - critério de sucesso
  - Placeholders com perguntas reflexivas ao invés de exemplos diretos
- **Seção "Contexto Implícito"** (`contexto_implicito`):
  - Campo dedicado para informações que o usuário sabe mas a IA não
  - Exemplos: área de atuação, nível de conhecimento, preferências, restrições
  - Reduz assunções incorretas da IA sobre o contexto do usuário
- **Legenda visual de critérios** com exemplos práticos para códigos M, S, A, D e escala de pesos

**Indicadores Visuais:**

- **Indicador de completude** (`.completeness-indicator`) com:
  - Barra de progresso visual mostrando % de campos preenchidos
  - Sistema de pesos (campos essenciais têm peso maior)
  - Mensagens contextuais conforme completude aumenta
  - Estado `.complete` quando todos os campos obrigatórios estão preenchidos
  - Animação de "subida" para transição suave
- **Estados visuais para campos inválidos**:
  - Borda vermelha
  - Fundo claro
  - Animação "shake" para feedback imediato de erro
- **Modal de validação** (Material Design):
  - Header com gradiente e ícone de alerta
  - Corpo organizado em seções de **Erros** (bloqueiam geração) e **Avisos** (confirmáveis)
  - Rodapé com botões primário ("Continuar") e secundário ("Revisar")
  - Feedback claro sobre o que falta antes de gerar o prompt

**Histórico:**

- **Botão flutuante (FAB)** para acesso rápido ao histórico de prompts
  - Ícone e contagem de itens
  - Animações de hover e active
  - Posicionamento fixo e responsivo
- **Painel lateral (sidebar)** de histórico com:
  - Overlay para escurecer fundo ao abrir
  - Header com título e botão de fechar
  - Corpo com lista de itens e texto de ajuda
  - Rodapé com botão para limpar histórico completo
  - Ajustes responsivos para mobile (largura ajustada, posicionamento)
- **Itens do histórico** com:
  - Header mostrando título, data e ações
  - Preview e conteúdo completo do prompt
  - Botões para expandir, carregar e deletar itens individuais
  - Animações e estados de hover
- **Persistência em localStorage**:
  - Últimos 5 prompts gerados salvos automaticamente
  - Persiste entre sessões do navegador
  - Funcionalidades: salvar, carregar, deletar individual, limpar tudo

**Acessibilidade:**

- **Atributos ARIA** adicionados em todos os novos elementos interativos
- **Navegação por teclado** completa para todos os componentes (modais, sidebar, FAB, campos)
- **Gerenciamento de foco**:
  - Trap de foco em modais (`trapFocus`)
  - Navegação por lista via teclado (`enableListNavigation`)
  - Foco restaurado ao elemento que abriu o modal após fechamento
- **Tooltips dinâmicos e acessíveis** com posicionamento correto e visibilidade controlada

#### Funcionalidades JavaScript

**Arquitetura de Código:**

- **Constante `CONFIG`** centralizando configurações do sistema:
  - `HISTORY_KEY` - chave para localStorage
  - `MAX_HISTORY` - limite máximo de itens (5)
  - `COMPLETENESS_THRESHOLDS` - limiares de completude
  - `FEEDBACK_TIMEOUT` - duração do feedback visual
  - `MODAL_CLOSE_DELAY` - atraso para fechamento
  - `SCROLL_OFFSET` - offset para ativar efeitos
  - `VALID_CODES` - códigos válidos (M, S, A, D)
- **Objeto `state`** gerenciando estado global:
  - Lista de idiomas
  - Visibilidade do progresso no header
- **Objeto `elements`** com cache de referências DOM para otimização de performance
- **Módulos funcionais organizados**:
  - `utils` - funções utilitárias genéricas (formatField, clearField, splitLines, validateCode, setElementState, etc.)
  - `accessibility` - trapFocus, enableListNavigation
  - `tooltips` - criação e gerenciamento dinâmico
  - `modals` - padronização (addCloseListeners, setup)
  - `validation` - cálculo de completude, validação de obrigatórios, feedback visual, destacamento de inválidos
  - `autocomplete` - sugestões de idiomas dinâmicas
  - `history` - save, load, delete, clear, render
  - `protocol` - buildSummary, generate (FAST/THOROUGH)
  - `clipboard` - cópia com fallback e feedback visual
  - `criterios` - validação e adição à tabela

**Validação e Feedback:**

- **Sistema de validação robusto** com:
  - Validação de campos obrigatórios
  - Cálculo de completude em tempo real
  - Modal de validação mostrando erros (bloqueiam) e avisos (confirmáveis)
  - Feedback visual em campos inválidos (borda, fundo, shake)
  - Destacamento automático de campos que precisam de atenção
- **Feedback visual para ações**:
  - Cópia de prompt (mensagem de confirmação com timeout)
  - Validações (modal e destaque de campos)
  - Ações de histórico (confirmações visuais)

**Geração de Protocolo:**

- **Modo FAST (compacto mas auditável)**:
  - Etapas 5-9 em formato de tabelas
  - Checklist inline mais conciso
  - Economia ~30% de tokens sem perder visibilidade
- **Modo THOROUGH (detalhado)**:
  - Etapas 5-9 expandidas com explicações completas
  - Blocos separados para cada análise
  - Pontos de parada explícitos
- **CRÍTICO: Ambos os modos mantêm etapas obrigatórias VISÍVEIS**
  - IA deve MOSTRAR análise (lacunas, assunções, riscos)
  - IA deve MOSTRAR plano antes de executar
  - IA deve MOSTRAR checklist e justificativas
  - Sem "verificação interna" - tudo é auditável
- **Construção de objetivo composto** dos 3 campos reflexivos
- **Inclusão de contexto implícito** quando preenchido
- **Salvamento automático** no histórico após geração

**Persistência:**

- **Histórico em localStorage** com limite de 5 itens
- **Operações disponíveis**: salvar, visualizar, carregar, deletar individual, limpar tudo
- **Renderização dinâmica** da lista de histórico
- **Compatibilidade** entre sessões do navegador

#### Estilos CSS

**Componentes:**

- **Classe utilitária `.hidden`** para esconder elementos (`display: none !important`)
- **Header sticky** com transições suaves para padding e font-size
- **Modais expandidos**: max-width e max-height aumentados, padding interno, overflow controlado, scrollbar webkit personalizada
- **Sidebar de histórico** com overlay, header, body e footer estilizados
- **FAB (Floating Action Button)** com ícone, contagem, animações de hover/active
- **Modal de validação Material Design** com header gradiente, seções organizadas, botões estilizados
- **Barra de progresso no header** com container, label, percentual, gradiente e animação de preenchimento

**Estados e Animações:**

- **Estado `.shrink`** do header (redução de padding e font-size)
- **Estado `.complete`** para barras de progresso (gradiente verde)
- **Animação "shake"** para campos inválidos (feedback visual de erro)
- **Transições suaves** em todos os elementos interativos
- **Animação de "subida"** para indicador de completude

**Responsividade:**

- **Mobile first** em todos os componentes novos
- **Ajustes específicos** para:
  - Header (tamanho de fonte, padding)
  - Barra de progresso (esconde label, reduz altura)
  - Sidebar (largura, posicionamento)
  - Modais (tamanho, padding, alinhamento)
  - FAB (posicionamento)
  - Campos de formulário (font-size, padding)

#### Documentação e Auditoria

**DOCS/auditoria/:**

- **README.md** estabelecendo filosofia de auditoria narrativa:
  - Registros como "arquivo de memória epistemológica"
  - Observação longitudinal de comportamento de sistemas generativos
  - Princípios para evitar overfitting
  - Perguntas corretas para análise de incidentes
  - Relação entre registros e evolução do protocolo
- **Incidentes documentados**:
  - `ChatGPT/incident-2026-01-16.md` - 226 linhas
  - `DeepSeek/incident-2026-01-16.md` - 213 linhas
  - `LeChat/incident-2026-01-16` - 232 linhas
- **Análise comparativa** (`comparative-GPT-DeepSeek-LeChat.md`) - 198 linhas
- **Template de incidentes** (`incident-template.md`) para padronização
- **Justificativa** sobre limites estruturais da auditabilidade e decisões de design

**DOCS/merge-divergence.md:**

- **Documentação da divergência** entre v2-experimental e v2-correcao
- **Lista de commits não migrados**:
  - `30479a3` - feat(v2): implementação experimental (objetivo decomposto, contexto implícito, validações)
  - `8f773ae` - feat(header): header fixo e responsivo
- **Justificativa** da decisão: v2-correcao está funcional, experimental tinha problemas de auditabilidade
- **Preservação** do experimento para referência futura

**WebView 1 - etapas.md:**

- Título atualizado para indicar versão v2 com formato do prompt gerado
- Seção 0 renomeada de "Modo e Idioma" para "META"
- Seção 1 (TAREFA) atualizada com delimitador `<TASK>` e estrutura de três campos reflexivos
- Seção 2 renomeada de "Critérios" para "PRIORIDADES" com documentação dos critérios fixos M1 e M2
- Seção 3.5 (CONTEXTO IMPLÍCITO) documentada como campo opcional
- Seção 4 atualizada para formato YAML e campo custom_checklist
- Seções 5-9 completamente reescritas documentando diferenças FAST vs THOROUGH
- Exemplos de saída atualizados com formato `<!-- OPENPUP v2 -->` ... `<!-- /OPENPUP -->`
- Schema JSON atualizado para todos os novos campos

**TODO.md:**

- Roadmap de funcionalidades planejadas
- Organizado por categorias: Interface, Arquitetura, i18n, Funcionalidades
- Itens movidos da seção Unreleased para rastreamento adequado

### Modificado

**HTML:**

- **DOCTYPE** normalizado para lowercase (`<!doctype html>`)
- **Modal de confirmação** migrado de `style="display: none"` para `class="modal hidden"` (padrão moderno)
- **Ícone de informação** com viewBox ajustado de `28x28` para `24x24`
- **Campo de idioma** com `id="idioma"` adicionado
- **Texto de ajuda** da seção Tarefa simplificado (remoção de referências a "Markdown, JSON")
- **Rodapé** atualizado com inclusão de licenças de forma mais clara

**JavaScript:**

- **Estrutura do protocolo** completamente reescrita com seções mais claras e detalhadas
- **Lógica de validação** mais robusta com feedback visual aprimorado
- **Gerenciamento de modais** refatorado para ser genérico e reutilizável
- **Autocomplete de idiomas** melhorado com lógica dinâmica e acessibilidade aprimorada
- **Clipboard** com cópia mais robusta e fallback para navegadores antigos
- **Reset de formulário** expandido para limpar novos campos (objetivo decomposto, contexto implícito) e estados
- **Geração de protocolo** (`generateProtocol`):
  - Constrói objetivo composto dos 3 campos reflexivos
  - Inclui seção opcional de contexto implícito
  - Salva automaticamente no histórico
  - Dispara validações antes de permitir geração
- **Modal de confirmação** (`buildModalSummary`):
  - Exibe os 3 campos do objetivo separadamente
  - Inclui contexto implícito no resumo
  - Melhor visualização antes de gerar

**CSS:**

- **Header** com padding, gap, flex-wrap e font-size ajustados, transições aplicadas
- **Modais** com max-width e max-height aumentados para melhor acomodação de conteúdo
- **Responsividade** aprimorada em todos os componentes para mobile e tablets

### Removido

**HTML:**

- **Atributo `aria-expanded`** obsoleto do campo de idioma
- **Estilo inline** `style="display: none"` dos modais (substituído por classe)

**JavaScript:**

- **Funções duplicadas** removidas e consolidadas em objetos específicos:
  - `formatField`, `clearField`, `validateCode` → `utils`
  - `trapFocus` → `accessibility`
  - `createTooltip` → `tooltips`
  - `setupModal` → `modals`
- **Código redundante** consolidado em funções genéricas
- **Lógica antiga** de tooltips, modais, validação e reset substituída por implementações modulares

**CSS:**

- **Código redundante** e não utilizado removido
- **Seções comentadas** como "inalterado" limpas

### Corrigido

- **Acessibilidade** em modais, tooltips, botões e navegação
- **Validação de campos** obrigatórios com feedback visual correto
- **Clipboard** com fallback funcional para navegadores sem Clipboard API
- **Histórico** com salvamento, carregamento e exclusão funcionando corretamente
- **Critérios** com adição e remoção na tabela funcionando
- **Reset** limpando todos os campos e estados corretamente
- **Navegação por teclado** abrangendo todos os elementos interativos
- **Barra de progresso** com atualização e exibição corretas
- **Tooltips** com posição e visibilidade corretas

### Arquitetura e Design

**Princípios aplicados:**

1. **Auditabilidade não negociável**: Etapas 5-9 sempre visíveis em ambos os modos
2. **Fricção necessária**: UI guia usuário a pensar ANTES de gerar prompt
3. **Consequências observáveis**: Template força IA a MOSTRAR raciocínio
4. **Validação humana**: Usuário pode auditar se IA seguiu o processo
5. **Modularização**: Código organizado em objetos funcionais específicos
6. **Performance**: Cache DOM, configurações centralizadas, reutilização de funções
7. **Acessibilidade**: ARIA, navegação por teclado, foco gerenciado

**Lições da v2-experimental aplicadas:**

- UI ajuda usuário explicitar objetivo (campo decomposto)
- UI ajuda usuário explicitar contexto (seção dedicada)
- Prompt mantém controle (etapas obrigatórias)
- Usuário consegue verificar (tudo visível na resposta)
- Documentação preserva aprendizados (DOCS/auditoria)

### Arquivos Modificados

- [index.html](index.html): Novos campos (objetivo decomposto, contexto implícito), header refatorado, barra de progresso, indicador de completude, modal de validação, FAB e sidebar de histórico, atributos ARIA, biblioteca anime.js
- [web/script.js](web/script.js): Arquitetura modular com 13 objetos principais (CONFIG, state, elements, utils, accessibility, tooltips, modals, validation, autocomplete, history, protocol, clipboard, criterios), lógica de validação robusta, geração diferenciada FAST/THOROUGH, histórico em localStorage, navegação por teclado completa
- [web/styles.css](web/styles.css): Header sticky, estados .shrink/.complete/.hidden, barra de progresso no header, indicador de completude, FAB e sidebar de histórico, modal de validação Material Design, estados inválidos com animação shake, responsividade mobile aprimorada

### Compatibilidade

- Mantém compatibilidade com estrutura OpenPUP v1
- Adiciona campos opcionais (não quebra prompts existentes)
- Etapas 5-9 permanecem no mesmo formato (auditável)
- Fallback para navegadores antigos (clipboard, APIs modernas)

---

_Esta versão representa a maturação do OpenPUP: experimentamos, quebramos, aprendemos, reconstruímos melhor._

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
