# Migration Guide: OPENPUP v2.0 → v2.1 Layer Zero

**Data:** 2026-01-26
**Tipo:** Minor version (additive, breaking changes apenas em formato de prompt)
**Motivação:** Aumentar taxa de enforcement de ~5% para >70% via guards máquina-legíveis

---

## Resumo das Mudanças

### O que mudou para o usuário final?

**UI (sem mudanças visíveis):**

- Interface permanece idêntica
- Campos e opções não mudaram
- Workflow continua o mesmo: preencher → gerar → copiar → colar

**Validação (melhorias):**

- UI agora detecta e bloqueia conflitos ANTES de gerar
- Mensagens de erro mais claras e acionáveis
- Detecta DATA vazio + fontes externas negadas automaticamente

**Prompt gerado (BREAKING CHANGE):**

- Steps 5-8 agora são JSON (antes eram linguagem natural)
- Step 9 (entrega) continua linguagem natural
- Guards YAML adicionados antes Step 5
- Meta-constraints agora como referências (DRY)

---

## Por que essa mudança?

### Problema identificado (v2.0):

Múltiplos sistemas de IA (ChatGPT, DeepSeek, Le Chat, Claude) sistematicamente **ignoravam instruções narrativas** do protocolo:

```
Cenário real (incident 2026-01-25):
IA ignorou "certifique-se de que..."
IA pulou Step 7 (checklist)
IA marcou checklist sem verificar (dissociação)
IA gerou entrega especulativa mesmo bloqueada
IA usou fontes externas quando policy=negado
```

**Taxa de enforcement baseline:** ~5% (IAs respeitam bloqueios em <1 de cada 20 casos)

### Solução (v2.1 Layer Zero):

**Enforcement estrutural** via YAML guards + JSON schemas que LLMs processam como **sintaxe** (não narrativa):

```yaml
OPENPUP_GUARDS:
  invariants:
    INV_001:
      violation_if: "external_sources == 'negado' AND (<DATA>.empty OR <DATA>.is_placeholder)"
      output: DIAGNOSTIC_INV_001
```

**Taxa de enforcement esperada:** 75-85% (via defense-in-depth + cross-validation)

---

## Mudanças Detalhadas

### 1. UI Prevalidation (Zero Breaking Changes)

**Antes (v2.0):**

```javascript
// Validava apenas campos obrigatórios
if (!form.objetivo.value) {
  alert("Preencha o objetivo");
}
```

**Depois (v2.1):**

```javascript
// Valida conflitos lógicos ANTES de gerar
if (external_sources == "negado" && isEmpty(dados)) {
  error("CONFLITO: Configure dados OU permita fontes externas");
}

if (hasMustConflict(criterios)) {
  warning("Critérios M conflitantes: max 200 palavras vs min 500");
}
```

**Impacto:** ~30% redução em prompts inválidos gerados

---

### 2. Guards YAML (BREAKING: novo bloco no prompt)

**Antes (v2.0):**

```markdown
## 4) RESTRIÇÕES

external_sources: negado

---

## 5) ANÁLISE

IA — Apresente em formato de tabela:
...
```

**Depois (v2.1):**

````markdown
## 4) RESTRIÇÕES

external_sources: negado

---

```yaml
OPENPUP_GUARDS:
  version: "2.1.0"

  invariants:
    INV_001:
      violation_if: "external_sources == 'negado' AND (<DATA>.empty OR <DATA>.is_placeholder)"
      output: DIAGNOSTIC_INV_001

  state_machine:
    current: PREVALIDATION

    PREVALIDATION:
      allowed_steps: []
      required_checks: [INV_001, INV_002, INV_003, INV_004]
      on_pass: VALIDATION_PHASE
      on_fail: BLOCKED
```
````

**Impacto:** IAs processam guards como estrutura sintática (maior enforcement)

---

### 3. JSON Schemas (BREAKING: Steps 5-8 agora JSON)

**Antes (v2.0) - Step 5 narrativo:**

```markdown
## 5) ANÁLISE — ETAPA OBRIGATÓRIA

IA — Apresente em formato de tabela:

| Categoria | Itens Identificados |
| --------- | ------------------- |
| Lacunas   | [liste o que falta] |
| Assunções | [decisões próprias] |
| Riscos    | [pontos críticos]   |
```

**Depois (v2.1) - Step 5 JSON:**

````markdown
## 5) ANÁLISE — ETAPA OBRIGATÓRIA

IA — Responda EXCLUSIVAMENTE em JSON conforme schema abaixo

```json
{
  "step": "5_analysis",
  "_meta": {
    "version": "2.1.0",
    "format": "strict_json",
    "text_outside_json_forbidden": true
  },
  "data_validation": {
    "data_section_empty": "boolean",
    "data_is_placeholder": "boolean",
    "external_sources_policy": "permitido|negado",
    "policy_conflict_detected": "boolean",
    "conflict_reason": "string|null"
  },
  "lacunas": [
    {
      "item": "string",
      "criticidade": "alta|media|baixa",
      "impede_must": ["array of M-codes"]
    }
  ],
  "must_validation": [
    {
      "codigo": "string (M-code)",
      "satisfazivel": "boolean",
      "justificativa": "string"
    }
  ]
}
```
````

**CRITICAL:**

- Campo data_validation DEVE ser preenchido honestamente
- Campo must_validation: avaliar CADA M-criterion individualmente

````

**Impacto:** Campos estruturados permitem cross-validation automática

---

### 4. Cross-Validation (NOVO: Step 8 valida Step 7)

**Antes (v2.0):**
```markdown
## 8) PARADA
**Bloqueado?** [true/false]
**Motivo:** [se bloqueado, explique]
````

_(IA decide livremente sem validação cruzada)_

**Depois (v2.1):**

```json
{
  "step": "8_stop_decision",
  "integrity_test": {
    "all_musts_really_met": "boolean",
    "used_only_authorized_data": "boolean",
    "have_objective_justification_for_unblock": "boolean",
    "reasoning": "string (DETALHADO)"
  },
  "bloqueado": "boolean",
  "explicacao_humana": "string (OBRIGATÓRIO)"
}
```

**CRITICAL DECISION RULES:**

- IF integrity_test.all_musts_really_met == false THEN bloqueado DEVE ser true
- IF step7.any honest_assessment == false THEN bloqueado DEVE ser true
- IF step7.data_sources_used contains external BUT policy=='negado' THEN bloqueado DEVE ser true
- DEFAULT SEGURO: quando em dúvida, bloqueado = true

**Impacto:** Defense-in-depth com múltiplas camadas de validação

---

### 5. CRITERIA_REGISTRY + INV_004 (NOVO: validação estrutural de referências)

**Antes (v2.0) - Seção 2 chamada PRIORIDADES:**

```markdown
## 2) PRIORIDADES

M: A IA deve cumprir todas as etapas # peso=1.0
M: A IA deve interromper se etapa anterior incompleta # peso=1.0
M: Meu critério customizado # peso=1.0
```

**Depois (v2.1) - Seção 2 chamada CRITERIA_REGISTRY:**

```markdown
## 2) CRITERIA_REGISTRY
**Legenda:** M=MUST | S=SHOULD | A=AVOID

**Meta-Constraints:**
[[M-PROTO-1]]: Executar etapas 5-9 sequencialmente. Falha bloqueia em step 8. # peso=1.0
[[M-PROTO-2]]: Interromper se etapa anterior incompleta ou inválida. # peso=1.0

**Task-Constraints:**
M: Meu critério customizado # peso=1.0

**REGISTRY_RULE:** All criterion references in steps 5-8 MUST exist in this registry. Reference to non-existent criterion := HALT.
```

**O que mudou:**

1. **Nome da seção:** `PRIORIDADES` → `CRITERIA_REGISTRY`
2. **Meta-constraints como referências:** `[[M-PROTO-1]]`, `[[M-PROTO-2]]` (DRY)
3. **REGISTRY_RULE explícito:** Força validação estrutural de todas as referências

**Novo Invariante INV_004:**

```yaml
INV_004:
  violation_if: "EXISTS reference WHERE reference NOT IN CRITERIA_REGISTRY"
  output: DIAGNOSTIC_INV_004
```

**Novos campos JSON:**

**Step 5:**
```json
{
  "registry_validation": {
    "all_referenced_criteria_exist": "boolean",
    "invalid_references": ["array of invalid codes"]
  }
}
```

**Step 6:**
```json
{
  "dependencies_check": {
    "step5_registry_valid": "boolean",  // NOVO
    ...
  }
}
```

**Step 8:**
```json
{
  "validation_summary": {
    "step5_registry_validation_passed": "boolean",  // NOVO
    ...
  }
}
```

**Por que isso importa:**

- **Typos detectados:** Se você referencia `M-PROT0-1` mas existe `M-PROTO-1`, AI bloqueia
- **Referências válidas:** Step 5/6/7 só podem referenciar critérios que existem no registro
- **Validação estrutural:** Não depende de interpretação, é checagem de existência

**Impacto:** Elimina bugs silenciosos onde AI ignora critérios por typo/referência inválida

---

### 6. Step 9 Unchanged (continuidade)

**Antes e Depois são IDÊNTICOS:**

```markdown
## 9) ENTREGA — ETAPA CONDICIONAL

IA — Somente após verificar que step8.bloqueado == false

Gere o entregável conforme <TASK>:

- Formato: [conforme especificado]
- Tamanho: [conforme especificado]
- Fonte: exclusivamente <DATA>
```

**Por quê?** Step 9 é para o **usuário final ler**, então continua linguagem natural humana.

---

## Como Testar Após Migração

### Test Case 1: UI Blocking (NOVO comportamento)

**Setup:**

1. Abra OPENPUP v2.1
2. Configure: `Fontes externas: negado`
3. Deixe campo `DADOS` vazio
4. Clique "Gerar Protocolo"

**Expected (v2.1):**

```
CONFLITO DE DADOS: Você configurou 'Fontes externas: negado'
mas o campo <DADOS> está vazio.

Para resolver, escolha uma opção:
1. Preencha o campo DADOS com informações concretas
2. OU mude 'Fontes externas' para 'permitido'
```

**Antes (v2.0):** Gerava prompt inválido sem avisar

---

### Test Case 2: Guards Enforcement (NOVO comportamento)

**Setup:**

1. Gere prompt válido com `external_sources: negado` + dados preenchidos
2. Cole em ChatGPT/Claude/DeepSeek
3. IA tenta usar fontes externas durante Step 5

**Expected (v2.1):**
IA deve parar em Step 8 com:

```json
{
  "bloqueado": true,
  "motivo": "Detectada violação de policy: tentei usar fontes externas mas external_sources=='negado'",
  "explicacao_humana": "Não posso gerar a entrega porque preciso de informações que não estão em <DATA>, mas você configurou fontes externas como 'negado'. Para resolver: (1) Adicione os dados necessários em <DATA>, ou (2) Mude a política para 'permitido'."
}
```

**Antes (v2.0):** IA frequentemente ignorava e gerava entrega especulativa

---

### Test Case 3: Cross-Validation (NOVO comportamento)

**Setup:**

1. Gere prompt
2. Cole na IA
3. IA marca Step 7 checklist mas com `honest_assessment: false` em algum item

**Expected (v2.1):**
Step 8 DEVE forçar bloqueio:

```json
{
  "integrity_test": {
    "all_musts_really_met": false,
    "reasoning": "Step 7 item 'musts_cumpridos' tem honest_assessment=false"
  },
  "bloqueado": true,
  "explicacao_humana": "Detectei que marquei checklist mas não tenho certeza absoluta. Bloqueando por segurança..."
}
```

**Antes (v2.0):** Sem cross-validation, IA podia ser desonesta sem consequências

---

## Breaking Changes e Compatibilidade

### Para usuários finais:

**NENHUMA MUDANÇA NA UI**

- Continue usando da mesma forma
- Mesmos campos, mesmas opções

**Prompts gerados SÃO DIFERENTES**

- Se você salvou prompts v2.0: continuam funcionando mas com enforcement menor
- Se você quer enforcement >70%: regenere usando v2.1

### Para integrações/automações:

**Se você parseava respostas Steps 5-8:**

- Antes: markdown tables/listas
- Depois: JSON estruturado
- **Ação necessária:** Atualizar parsers para ler JSON

**Step 9 (entrega final) NÃO mudou:**

- Continua linguagem natural
- Parsers de output final continuam funcionando

### Para prompts customizados:

**Se você editava prompts manualmente:**

- Guards YAML são **obrigatórios** para enforcement
- JSON schemas em Steps 5-8 são **obrigatórios**
- Step 2 agora usa referências `[[M-PROTO-1]]`

**Campos customizados continuam suportados:**

- Custom checklist items funcionam
- Critérios M/S/A customizados funcionam
- Contexto implícito funciona

---

## Métricas Esperadas

| Métrica                     | v2.0 Baseline | v2.1 Target        | Melhoria   |
| --------------------------- | ------------- | ------------------ | ---------- |
| Taxa de bloqueio apropriado | ~5%           | 75-85%             | **15-17x** |
| Prompts inválidos gerados   | ~30%          | <5%                | **6x**     |
| Data policy violations      | Alta          | Muito baixa        | **~10x**   |
| Checklist dissociation      | Comum         | Rara               | **~8x**    |
| Token waste (duplicação)    | Baseline      | -480 tokens/prompt | **~12%**   |

---

## Troubleshooting

### Problema: "IA ainda ignora guards"

**Diagnóstico:**

- Verifique se prompt tem bloco `OPENPUP_GUARDS` (procure por "```yaml")
- Verifique se está usando v2.1 (procure por "Layer Zero" no comentário)

**Solução:**

- Regenere prompt usando versão v2.1 atualizada
- Limpe cache do navegador se necessário

---

### Problema: "IA retorna markdown em vez de JSON nos Steps 5-8"

**Diagnóstico:**

- Alguns modelos resistem a JSON-only
- Especialmente comum em modo THOROUGH com modelos antigos

**Solução:**

- Use modelos mais recentes (GPT-4, Claude 3.5+, DeepSeek V3)
- Adicione ao início do prompt: "CRITICAL: Steps 5-8 MUST be pure JSON"

---

### Problema: "UI não está bloqueando conflitos"

**Diagnóstico:**

- Validação JS pode ter sido desabilitada por configuração

**Solução:**

- Recarregue página com Ctrl+F5 (hard reload)
- Verifique console do navegador por erros JS
- Confirme que está usando `web/script.js` atualizado

---

## Documentos Relacionados

- **[Guards Specification](./guards-specification.md)** - Detalhes técnicos dos guards
- **[IMPLEMENTATION_LOG.md](../IMPLEMENTATION_LOG.md)** - Log completo de mudanças
- **[TODO.md](../TODO.md)** - Roadmap e backlog

---

## Checklist de Migração

Para garantir migração bem-sucedida:

- [ ] Atualizei para versão v2.1
- [ ] Testei geração de prompt (verifica se tem "Layer Zero")
- [ ] Testei UI blocking (DATA vazio + negado)
- [ ] Testei prompt com IA (verifica JSON em Steps 5-8)
- [ ] Testei bloqueio por guards (external_sources violation)
- [ ] Atualizei parsers se faço integração automatizada
- [ ] Li [guards-specification.md](./guards-specification.md) para entender invariantes

---

**Última atualização:** 2026-01-26
**Versão documento:** 1.0
**Autores:** Jeanco + Claude Sonnet 4.5 (Layer Zero implementation)
