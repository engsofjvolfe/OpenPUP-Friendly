# Estratégia de Merge: v2-correcao → main

**Data:** 2026-01-24
**Branches envolvidas:** v2-correcao, main

## Situação Atual

### Branch v2-correcao (branch atual)

- ✅ v2.0.0 - Versão completa documentada
- ✅ v1.4.2 - Refatoração do script.js
- ✅ v1.4.1 - Botão reabrir modal
- ✅ v1.4.0 - Modal de introdução
- ❌ v1.4.3 - **NÃO ESTÁ NESTA BRANCH** (commit `8f773ae` não existe aqui)

### Branch main

- ❌ v2.0.0 - **NÃO ESTÁ EM MAIN**
- ✅ v1.4.3 - Header sticky (commit `8f773ae`)
- ✅ v1.4.2 - Refatoração do script.js
- ✅ v1.4.1 - Botão reabrir modal
- ✅ v1.4.0 - Modal de introdução

## Conflito Esperado

Ao fazer merge de `v2-correcao` → `main`, haverá conflito no `CHANGELOG.md`:

**v2-correcao (incoming):**

```markdown
## [2.0.0] – 2026-01-17

[conteúdo extenso da v2.0.0]

## [1.4.2] – 2025-09-02

[...]
```

**main (current):**

```markdown
## [1.4.3] – 2025-09-02

[header sticky]

## [1.4.2] – 2025-09-02

[...]
```

## Resolução do Conflito

Manter **AMBAS** as versões na ordem cronológica correta:

```markdown
## Unreleased

_Nenhuma mudança pendente no momento. Consulte [TODO.md](TODO.md) para roadmap de funcionalidades planejadas._

## [2.0.0] – 2026-01-17

> **VERSÃO ESTÁVEL - RECOMENDADA**
>
> Esta versão combina auditabilidade (v1) com melhorias substanciais de UX, validação e persistência.
> Mantém etapas 5-9 obrigatórias e visíveis, garantindo controle total do usuário sobre a IA.

[CONTEÚDO COMPLETO DA v2.0.0 DA BRANCH v2-correcao]

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

## [1.4.2] – 2025-09-02

[resto do changelog...]
```

## Comandos Git

### PASSO 1: Commitar v2.0.0 em v2-correcao

```bash
# 1. Garantir que estamos em v2-correcao
git checkout v2-correcao

# 2. Verificar mudanças
git status

# 3. Adicionar todos os arquivos
git add CHANGELOG.md TODO.md "WebView 1 - etapas.md" index.html web/script.js web/styles.css
git add DOCS/auditoria/
git add DOCS/merge-divergence.md MERGE-STRATEGY.md

# 4. Criar commit v2.0.0
git commit -m "$(cat <<'EOF'
feat(v2.0.0): versão estável com UX aprimorada e auditabilidade mantida

BREAKING CHANGE: Esta versão introduz mudanças significativas na interface.

Principais adições:
- Decomposição do objetivo em 3 campos reflexivos
- Campo de contexto implícito (seção 3.5)
- Sistema robusto de validação com modal Material Design
- Indicador de completude visual
- Histórico de prompts em localStorage (últimos 5)
- FAB e sidebar para gerenciar histórico
- Header sticky com estado compacto (.shrink)
- Barra de progresso integrada ao header
- 13 módulos JavaScript organizados
- Navegação por teclado completa
- Responsividade mobile aprimorada

Documentação:
- DOCS/auditoria/ com filosofia e incidentes documentados
- DOCS/merge-divergence.md explicando divergência de branches
- TODO.md com roadmap de funcionalidades planejadas
- WebView 1 - etapas.md atualizado para v2

Arquitetado com princípios:
- Auditabilidade não negociável (etapas 5-9 sempre visíveis)
- Fricção necessária (UI guia pensamento)
- Consequências observáveis (template força IA a mostrar raciocínio)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"

# 5. Criar tag v2.0.0
git tag -a v2.0.0 -m "OpenPUP v2.0.0 - Versão estável recomendada"

# 6. Verificar
git log --oneline -3
git tag -l | grep v2
```

### PASSO 2: Merge para main

```bash
# 1. Atualizar main local
git checkout main
git pull origin main

# 2. Merge v2-correcao em main
git merge v2-correcao

# 3. Haverá conflitos em vários arquivos:
#    - CHANGELOG.md
#    - index.html
#    - web/script.js
#    - web/styles.css

# 4. Resolver conflitos (ver seção "Resolução do Conflito" acima)
#    Para cada arquivo:
#    - Abrir no editor
#    - Verificar se v2-correcao já contém mudanças de v1.4.3
#    - Aceitar versão v2-correcao (incoming) se for superset
#    - Mesclar manualmente se necessário

# 5. Após resolver todos os conflitos
git add .
git status  # verificar que todos os conflitos foram resolvidos

# 6. Finalizar merge
git commit -m "Merge branch 'v2-correcao' into main

Mescla a versão 2.0.0 estável com melhorias de UX e auditabilidade mantida.

Conflitos resolvidos:
- CHANGELOG.md: Mantidas ambas v2.0.0 e v1.4.3
- index.html: Aceita versão v2.0.0 (superset de v1.4.3)
- web/script.js: Aceita versão v2.0.0 (superset de v1.4.3)
- web/styles.css: Aceita versão v2.0.0 (superset de v1.4.3)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# 7. Verificar que ficou correto
git log --oneline --graph -10
cat CHANGELOG.md | head -50

# 8. Push para remote (branch e tags)
git push origin main
git push origin v2.0.0
git push origin v2-correcao  # se quiser manter a branch remota
```

### PASSO 3: Limpeza (opcional)

```bash
# Se quiser deletar branch v2-correcao local após merge bem-sucedido
git branch -d v2-correcao

# Se quiser deletar branch v2-correcao remota
git push origin --delete v2-correcao

# Deletar arquivos de documentação temporários
rm -f index.html.md script.js.md styles.css.md
git add .
git commit -m "chore: remove arquivos de documentação temporários"
git push origin main
```

## Outros Arquivos com Conflitos Esperados

### Arquivos SEM Conflito (adição automática)

- `DOCS/auditoria/` (pasta completa - nova)
- `DOCS/merge-divergence.md` (novo)
- `TODO.md` (novo)
- `WebView 1 - etapas.md` (atualizado apenas em v2-correcao)
- `*.md` na raiz (arquivos de documentação temporários - podem ser deletados após merge)

### Arquivos COM Conflito (resolução manual necessária)

#### 1. index.html

**main (v1.4.3):**

- Header com estrutura básica

**v2-correcao (v2.0.0):**

- Header refatorado com wrapper
- FAB (botão flutuante de histórico)
- Sidebar de histórico
- Modal de validação
- 3 campos de objetivo (objetivo_o_que, objetivo_por_que, objetivo_criterio)
- Campo contexto_implicito
- Barra de progresso no header

**Resolução:**

- **ACEITAR TODA a versão v2-correcao** (é superset de v1.4.3)
- Verificar se não há pequenos detalhes de v1.4.3 que foram perdidos

#### 2. web/script.js

**main (v1.4.3):**

- Lógica básica de shrink do header (12 linhas adicionadas)
- Event listener de scroll

**v2-correcao (v2.0.0):**

- 13 módulos funcionais (CONFIG, state, elements, utils, accessibility, tooltips, modals, validation, autocomplete, history, protocol, clipboard, criterios)
- Lógica de shrink integrada nos módulos
- Validação robusta
- Histórico em localStorage
- Navegação por teclado

**Resolução:**

- **ACEITAR TODA a versão v2-correcao** (é superset de v1.4.3)
- Verificar se a lógica de shrink está presente (deve estar)

#### 3. web/styles.css

**main (v1.4.3):**

- Estilos do header sticky (+22 linhas)
- Transições do header
- Classe `.shrink`

**v2-correcao (v2.0.0):**

- Estilos do header sticky (já incluídos)
- Classe `.shrink` (já incluída)
- Estilos do FAB
- Estilos da sidebar
- Estilos do modal de validação
- Estilos de animações (shake, complete, etc.)

**Resolução:**

- **ACEITAR TODA a versão v2-correcao** (é superset de v1.4.3)
- Verificar se estilos de v1.4.3 não foram perdidos

### Estratégia Geral de Resolução

Para arquivos HTML/CSS/JS:

```bash
# Durante o merge, quando houver conflito:
# 1. Abrir arquivo no editor
# 2. Verificar se v2-correcao JÁ CONTÉM as mudanças de v1.4.3
# 3. Se sim: aceitar versão v2-correcao (incoming)
# 4. Se não: mesclar manualmente as poucas linhas específicas de v1.4.3
```

**Dica:** Como v2-correcao foi desenvolvida com conhecimento de v1.4.3 (documentado nos .md), é MUITO PROVÁVEL que todas as funcionalidades de v1.4.3 já estejam incluídas na v2.0.0.

## Verificação Final

Após o merge, em `main`, o CHANGELOG deve ter:

- v2.0.0 (mais recente)
- v1.4.3
- v1.4.2
- v1.4.1
- v1.4.0
- v1.3.0
- v1.2.0
- v1.1.0
- v1.0.0

E o código deve conter:

- Todas as funcionalidades da v2.0.0 (de v2-correcao)
- Header sticky da v1.4.3 (de main)
- Documentação de auditoria (de v2-correcao)

---

**Importante:** Este arquivo (`MERGE-STRATEGY.md`) pode ser deletado após o merge bem-sucedido ou mantido como documentação histórica.
