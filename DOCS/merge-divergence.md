# Divergência de Branches: v2-experimental → v2-correcao

**Data:** 2026-01-24
**Status:** Documentado

## Resumo

A branch `v2-correcao` foi criada a partir de `v2-experimental`, mas **não inclui todas as mudanças de código** da experimental. Apenas a documentação de auditoria (`DOCS/auditoria/`) foi migrada manualmente.

## Commits NÃO presentes em v2-correcao

### 1. `30479a3` - feat(v2): implementação experimental com otimização de tokens
**Branch:** v2-experimental
**Modificações não migradas:**
- Objetivo decomposto em 3 campos separados (o_que, por_que, criterio)
- Campo "contexto implícito" (seção 3.5)
- Validações inteligentes antes de gerar prompt
- Alertas visuais de validação no modal de confirmação
- Renomeação de valores: `RAPIDO/DETALHADO` → `FAST/THOROUGH`
- Novo texto do modal de introdução

**Arquivos afetados:** `index.html`, `web/script.js`, `web/styles.css`

### 2. `8f773ae` - feat(header): torna cabeçalho fixo e responsivo (v1.4.3)
**Branch:** main, v2-experimental
**Modificações não migradas:**
- Header com `position: sticky`
- Classe `.shrink` aplicada dinamicamente no scroll
- Transições suaves de padding e font-size

**Arquivos afetados:** `index.html`, `web/script.js`, `web/styles.css`

**Nota:** Este commit também está presente em `main` como v1.4.3. No merge de v2-correcao → main, este código precisará ser preservado.

## Documentação migrada

**DOCS/auditoria/** - Completa
- Incidentes documentados (ChatGPT, DeepSeek, LeChat)
- Análise comparativa
- README e template de incidentes
- Justificativa da quebra de auditabilidade

## Decisão

A versão atual (`v2-correcao`) **está funcional e operacional**. Algumas funcionalidades da `v2-experimental` foram descartadas devido aos problemas de auditabilidade documentados em `DOCS/auditoria/README.md` bem como inconsistências na escrita do código.

A v2-experimental existe para preservar o experimento, não para uso em produção.

---

**Referências:**
- Branch experimental: `v2-experimental`
- Branch de correção: `v2-correcao`
- Documentação de auditoria: `DOCS/auditoria/README.md`