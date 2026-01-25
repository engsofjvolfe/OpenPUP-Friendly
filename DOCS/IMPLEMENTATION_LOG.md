# OPENPUP v2.1 Layer Zero - Implementation Log

**Data início:** 2026-01-25
**Objetivo:** Implementar enforcement coercivo via guards máquina-legíveis + UI validation
**Target:** >70% taxa de bloqueio apropriado (vs 5% atual)

---

## Mudanças Planejadas

### FASE 1: UI Prevalidation ✅ Zero Breaking Changes
- **Arquivo:** `web/script.js`
- **Linhas:** ~100-545
- **Objetivo:** Bloquear geração de prompts inválidos ANTES de gastar tokens

**Mudanças:**
1. Adicionar módulo `validationRules` (linha ~100)
   - `isEmpty(value)`
   - `isPlaceholder(value)`
   - `dataPolicyConflict(externalSources, dadosContent)`
   - `criteriaConflicts(criterios)`

2. Modificar `validation.validateBeforeGenerate()` (linha ~414)
   - Usar regras DRY
   - Detectar DATA vazio + external_sources:negado
   - Detectar M-criteria conflitantes

**Impacto esperado:** ~30% redução em prompts inválidos gerados

---

### FASE 2: Guards + JSON Schemas ⚠️ BREAKING CHANGE
- **Arquivo:** `web/script.js`
- **Linhas:** ~1000-1350
- **Objetivo:** Enforcement real via guards + respostas estruturadas

**Mudanças:**
1. Adicionar configurações (linha ~1000):
   - `guardConfig` (invariantes INV_001, INV_002, INV_003)
   - `PROTOCOL_META_CONSTRAINTS` (M1/M2 como refs)
   - `schemaFactory` (gerador de JSON schemas)
   - `templateBuilder` (builder DRY)
   - `renderGuardYAML(config)` (gerador YAML)
   - `buildPriorities(criterios)` (Step 2 generator)

2. Refatorar `protocol.generate()` (linha ~1037):
   - Usar builders DRY
   - Incorporar guards YAML antes Step 5
   - Steps 5-8 como JSON com campos human-readable
   - Step 9 continua natural language

**Schemas com explicações humanas:**
- Todos os bloqueios têm campo `explicacao_humana`
- Guards têm `diagnostic_message` em português
- Step 8 tem `motivo` + `proposta` detalhados

**Cross-validation para >70% enforcement:**
- Step 8 valida cruzado com Step 7
- IF step7.honest_assessment=false → FORCE bloqueado=true
- IF step7.data_sources_used ≠ policy → FORCE bloqueado=true
- DEFAULT: "quando em dúvida, bloqueado=true"

**Impacto esperado:** 75-85% taxa de bloqueio apropriado

---

### FASE 3: Documentação
- **Arquivos novos:**
  - `DOCS/migration-v2.0-to-v2.1.md`
  - `DOCS/guards-specification.md`
- **Arquivos modificados:**
  - `CHANGELOG.md` (adicionar seção [2.1.0])
  - `README.md` (adicionar seção sobre enforcement)

---

## Log de Implementação

### [2026-01-25 - Início]

**Status:** Criando log, preparando implementação
**Próximo:** FASE 1 - UI Prevalidation

---

### [2026-01-25 14:30 - FASE 1 COMPLETA] ✅

**Arquivo modificado:** `web/script.js`

**Mudanças realizadas:**

1. **Adicionado módulo `validationRules`** (linhas 121-221)
   - `isEmpty(value)` - detecta campos vazios
   - `isPlaceholder(value)` - detecta placeholders genéricos em 7 línguas
   - `dataPolicyConflict(externalSources, dadosContent)` - valida conflito DATA policy
   - `criteriaConflicts(criterios)` - detecta M-criteria mutuamente exclusivos

2. **Modificado `validation.validateBeforeGenerate()`** (linhas 516-557)
   - Agora usa `validationRules.dataPolicyConflict()`
   - Agora usa `validationRules.criteriaConflicts()`
   - Mensagens de erro human-readable com ações sugeridas

**Resultado:**
- ✅ UI agora bloqueia geração se DATA vazio + external_sources:negado
- ✅ UI detecta conflitos entre M-criteria (tamanho, tom, público)
- ✅ Mensagens claras explicam ao HUMANO o que fazer

**Próximo:** FASE 2 - Guards YAML + JSON Schemas

---

### [2026-01-26 - FASE 2 COMPLETA] ✅

**Arquivo modificado:** `web/script.js`

**Mudanças realizadas:**

1. **Adicionado `PROTOCOL_META_CONSTRAINTS`** (linhas 830-848)
   - Define meta-constraints fixas do protocolo (M-PROTO-1, M-PROTO-2)
   - Permite referências em vez de duplicação (DRY)
   - Economia: ~80 tokens por prompt

2. **Adicionado `guardConfig`** (linhas 850-1024)
   - **INV_001: DATA_POLICY** - bloqueia se external_sources=negado mas DATA vazio/placeholder
   - **INV_002: MUST_FEASIBILITY** - bloqueia se MUSTs não satisfazíveis com recursos disponíveis
   - **INV_003: NO_CONFLICTS** - bloqueia se M-criteria mutuamente exclusivos
   - Cada guard tem `humanMessage` em português claro com ações sugeridas
   - State machine: PREVALIDATION → VALIDATION_PHASE → EXECUTION_PHASE → BLOCKED

3. **Adicionado função `renderGuardYAML(config)`** (linhas 1067-1126)
   - Gera bloco YAML com guards + state machine
   - Instruções claras para IA processar guards ANTES Step 5
   - Campo `explicacao_humana` obrigatório em todas violations

4. **Adicionado função `buildPriorities(userCriterios)`** (linhas 1129-1146)
   - Gera Step 2 com referências a meta-constraints
   - Separa constraints fixas (protocolo) vs customizadas (tarefa)
   - DRY: elimina duplicação de M-PROTO-1/M-PROTO-2

5. **Adicionado `schemaFactory`** (linhas 1154-1289)
   - **step5()**: Schema JSON para análise prévia com data_validation + must_validation
   - **step6()**: Schema JSON para plano com dependencies_check + ready_exec
   - **step7()**: Schema JSON para checklist com verification_evidence + honest_assessment
   - **step8()**: Schema JSON para stop decision com integrity_test + explicacao_humana
   - **render()**: Formata schemas JSON de forma legível
   - Campos de cross-validation para enforcement >70%

6. **Adicionado `templateBuilder`** (linhas 1294-1408)
   - **buildStep()**: Builder DRY para steps individuais
   - **buildTemplate()**: Gera Steps 5-9 completo usando schemas
   - Steps 5-8: JSON ONLY (machine-readable)
   - Step 9: natural language (human-readable)
   - Economia: ~400 tokens por prompt vs templates duplicados

7. **Refatorado `protocol.generate()`** (linhas 1644-1732)
   - Agora usa `buildPriorities(criterios)` para Step 2
   - Incorpora `renderGuardYAML(guardConfig)` antes Step 5
   - Usa `templateBuilder.buildTemplate()` para Steps 5-9
   - Prompts agora têm versão "v2.1 Layer Zero"
   - Estrutura: META → TASK → PRIORITIES → DATA → RESTRIÇÕES → **GUARDS** → Steps 5-9

**Características Layer Zero implementadas:**

✅ **Machine-readable enforcement:**
- YAML guards processados como estrutura sintática (não narrativa)
- JSON schemas com validação cruzada
- State machine explícita

✅ **Human-readable outputs:**
- Todo bloqueio tem campo `explicacao_humana` em português
- Mensagens com ações concretas ("Para resolver: 1. Faça X, 2. OU faça Y")
- Step 9 continua linguagem natural para entrega ao usuário

✅ **Cross-validation para >70% enforcement:**
- Step 8 valida honestidade do Step 7
- IF any honest_assessment=false → FORCE bloqueado=true
- IF data_sources_used ≠ policy → FORCE bloqueado=true
- IF integrity_test items false → FORCE bloqueado=true
- DEFAULT SAFE: "quando em dúvida, bloqueado=true"

✅ **DRY principles:**
- Meta-constraints como referências (não duplicados)
- Shared template builder
- Schema factory reutilizável
- Economia: ~480 tokens por prompt

**Resultado:**
- ✅ Guards YAML com enforcement structural
- ✅ JSON schemas para Steps 5-8 (backstage)
- ✅ Step 9 linguagem natural (delivery)
- ✅ Cross-validation multi-layer
- ✅ Explicações humanas em português em todos bloqueios
- ✅ Taxa esperada de enforcement: 75-85%

**Próximo:** Testar geração de protocolo + criar documentação

---

### [2026-01-26 - Refatoração Layer Zero Estrita] ✅

**Princípio aplicado:**
```
Layer Zero rule:
Control is structural, not narrative.
Human-readable text is allowed only at I/O boundaries.
```

**Arquivo modificado:** `web/script.js`

**Mudanças realizadas:**

1. **Refatorado `guardConfig` (linhas 973-1016)**
   - **ANTES:** humanMessage com textos longos (controle narrativo)
   - **DEPOIS:** rule (formal), action (HALT), output (ID) - controle estrutural
   - Eliminado: textos narrativos dentro do mecanismo
   - Mantido: output IDs para gerar mensagens humanas APENAS em boundaries

2. **Refatorado `renderGuardYAML()` (linhas 1048-1107)**
   - **ANTES:** "🤖 INSTRUÇÕES PARA A IA:" com texto narrativo
   - **DEPOIS:** "Processing Instructions:" com regras formais (IF-THEN-ELSE)
   - Formato: states, transitions, conditions (não explicações)

3. **Refatorado `templateBuilder.sharedInstructions` (linhas 1306-1309)**
   - **ANTES:** "IA — Responda EXCLUSIVAMENTE em JSON..." (narrativo)
   - **DEPOIS:** "Response format: JSON_ONLY" (estrutural)
   - **ANTES:** "NÃO adicione texto..." (proibitivo narrativo)
   - **DEPOIS:** "text_outside_json: FORBIDDEN" (constraint formal)

4. **Refatorado `templateBuilder.buildStep()` (linhas 1313-1342)**
   - Instruções CRITICAL convertidas para constraints formais
   - DecisionRules em bloco de código (```), não lista bullet
   - Formato: "field := expression", não "Campo X deve..."

5. **Refatorado Steps 5-9 (linhas 1353-1429)**
   - **Step 5-7 CRITICAL notes:**
     - ANTES: "Campo data_validation DEVE ser preenchido honestamente"
     - DEPOIS: "data_validation: MANDATORY"
     - ANTES: "Campo must_validation: avaliar CADA M-criterion"
     - DEPOIS: "must_validation: FOR_EACH(M-criterion)"

   - **Step 8 Decision Rules:**
     - ANTES: "IF integrity_test... THEN bloqueado DEVE ser true"
     - DEPOIS: Formato de atribuição formal:
       ```
       bloqueado := (
         NOT integrity_test.all_musts_really_met OR
         NOT integrity_test.used_only_authorized_data OR
         ...
       )
       ```

   - **Step 9:**
     - ANTES: "IA — Somente após verificar RIGOROSAMENTE..."
     - DEPOIS: Estrutura formal:
       ```
       Preconditions:
       - state == EXECUTION_PHASE
       - step8.bloqueado == false

       IF preconditions.all(true):
         Generate deliverable: ...
       ELSE:
         GOTO step8
         SET bloqueado := true
       ```

**Resultado:**
- ✅ Controle 100% estrutural (estados, transições, condições)
- ✅ Texto humano APENAS em I/O boundaries (explicacao_humana output)
- ✅ Instruções formais tipo código, não narrativas
- ✅ Sintaxe válida (node --check)
- ✅ Todos os 11 testes passaram

**Impacto esperado:**
- Enforcement ainda maior: LLMs processam estrutura como código
- Token efficiency: ~150 tokens economizados por remover narrativa
- Clareza: regras formais são inequívocas (vs interpretação de texto)

**Próximo:** Atualizar documentação com princípio Layer Zero

---

## Testes Planejados

### Test Cases (após implementação):

**TC1: Empty DATA + negado**
- Input: `<DATA></DATA>`, `external_sources: negado`
- Expected: UI bloqueia geração
- Success: Erro clear com ações sugeridas

**TC2: Placeholder DATA + negado**
- Input: `<DATA>Quaisquer dados necessários</DATA>`, `external_sources: negado`
- Expected: UI bloqueia geração
- Success: Detecta placeholder, sugere preenchimento

**TC3: Conflicting MUSTs**
- Input: `M: Max 200 palavras`, `M: Min 500 palavras`
- Expected: UI mostra warning
- Success: Lista conflitos detectados

**TC4: Valid input → Guards halt**
- Input: Válido mas IA detecta violation em runtime
- Expected: Guard INV_001 retorna JSON com explicacao_humana
- Success: Usuário entende o que fazer

**TC5: Cross-validation enforcement**
- Input: Valid → AI marks step7.honest_assessment=false
- Expected: Step 8 FORÇA bloqueado=true
- Success: Cross-validation funciona

---

## Métricas de Sucesso

**Baseline (v2.0):**
- Taxa de bloqueio apropriado: ~5%
- Data policy violations: HIGH
- Prompts inválidos gerados: ~30%

**Target (v2.1):**
- Taxa de bloqueio apropriado: >70% ✅
- Data policy violations: VERY LOW
- Prompts inválidos gerados: <5%

---

*Log será atualizado conforme implementação progride*
