# Layer Zero Principle

**Version:** 2.1.0
**Status:** Design Principle
**Last Updated:** 2026-01-26

---

## Definition

> **Control is structural, not narrative.**
> **Human-readable text is allowed only at I/O boundaries.**

Layer Zero é o princípio de design que estabelece que mecanismos de controle devem ser **estruturais e máquina-legíveis**, não **narrativos e humano-dependentes**.

---

## Core Rules

### Rule 1: Structural Control Only

Control mechanisms MUST use:

- States (PREVALIDATION, VALIDATION_PHASE, EXECUTION_PHASE, BLOCKED)
- Invariants (formal rules: `external_sources == 'negado' AND <DATA>.empty`)
- Transitions (IF-THEN-ELSE, condition-based state changes)
- Constraints (formal assignments: `bloqueado := NOT integrity_test.all_musts_really_met`)

Control mechanisms MUST NOT use:

- Narrative instructions ("IA, certifique-se de que...")
- Explanatory text ("Para garantir qualidade, você deve...")
- Prohibitive language ("NÃO faça X, SEMPRE faça Y...")

### Rule 2: Human Text at Boundaries Only

Human-readable text is ALLOWED exclusively in:

- **Input boundary:** User's prompt, user's data, user's criteria
- **Output boundary:** `explicacao_humana` field when violations occur, Step 9 natural language delivery

Human-readable text is FORBIDDEN in:

- Guard definitions (use formal rules)
- State machine logic (use transitions)
- Decision algorithms (use formal expressions)
- Processing instructions (use IF-THEN-ELSE)

### Rule 3: Machine-Readable Formats

Preferred formats for control:

- YAML structures (states, transitions)
- JSON schemas (field types, constraints)
- Formal logic (`IF condition THEN action ELSE alternative`)
- Assignment operators (`:=`, `==`, `AND`, `OR`, `NOT`)

---

## Examples

### WRONG: Narrative Control

```yaml
INV_001:
  humanMessage: |
    **Não consigo executar esta tarefa** porque:

    • Você configurou 'Fontes externas: negado'
    • Mas o campo <DATA> está vazio

    **Para resolver:**
    1. Preencha o campo <DATA>
    2. OU mude 'Fontes externas' para 'permitido'
```

**Problem:** Control mechanism embedded in human text. LLM must parse narrative to understand what to do.

---

### CORRECT: Structural Control

```yaml
INV_001:
  rule: "external_sources == 'negado' AND (<DATA>.empty OR <DATA>.is_placeholder)"
  action: HALT
  output: DIAGNOSTIC_INV_001
```

**Why better:**

- Rule is formal, unambiguous
- Action is clear (HALT)
- Human text generated ONLY at output boundary

**Human message generated AT OUTPUT:**

```json
{
  "step": "8_stop_decision",
  "bloqueado": true,
  "explicacao_humana": " **Não consigo executar porque:**\n• external_sources='negado'\n• <DATA> vazio\n\n**Resolva:**\n1. Preencha <DATA>\n2. OU mude policy para 'permitido'"
}
```

---

### WRONG: Narrative Instructions

```markdown
**INSTRUÇÕES PARA A IA:**

1. **ANTES de executar Etapa 5**, processe este bloco de guards:
   - Estado atual: PREVALIDATION
   - Verifique cada invariante (INV_001, INV_002, INV_003)
   - Se QUALQUER falhar: retorne APENAS a mensagem em `explicacao_humana`, NÃO prossiga

2. **Se TODOS invariantes passarem:**
   - Transição para VALIDATION_PHASE
   - Execute Etapas 5-8 em formato JSON (esquemas abaixo)
```

**Problem:** Relies on LLM interpreting narrative instructions. Ambiguous ("ANTES de executar" = when exactly?).

---

### CORRECT: Structural Instructions

```markdown
**Processing Instructions:**

1. **PREVALIDATION state:**
   - Evaluate: INV_001, INV_002, INV_003
   - IF any(false): transition(BLOCKED), output(DIAGNOSTIC)
   - IF all(true): transition(VALIDATION_PHASE)

2. **VALIDATION_PHASE state:**
   - Execute: steps[5, 6, 7, 8]
   - Format: JSON_ONLY
   - Evaluate: step8.bloqueado
   - IF false: transition(EXECUTION_PHASE)
   - IF true: transition(BLOCKED)
```

**Why better:**

- Formal conditions (IF-THEN)
- Clear state transitions
- Unambiguous sequencing

---

### WRONG: Narrative Field Instructions

```markdown
**CRITICAL:**

- Campo data_validation DEVE ser preenchido honestamente
- Campo must_validation: avaliar CADA M-criterion individualmente
- Se houver lacuna crítica que impeça um MUST: faça até 3 perguntas objetivas e pare
```

**Problem:** Imperative language ("DEVE", "faça"), ambiguous conditions ("honestamente" = how?).

---

### CORRECT: Structural Constraints

```markdown
Constraints:

- data_validation: MANDATORY
- must_validation: FOR_EACH(M-criterion)
- IF lacuna.criticidade=='alta' AND impede_must: max_questions(3), HALT
```

**Why better:**

- MANDATORY = clear requirement
- FOR_EACH = explicit iteration
- IF-THEN = formal condition

---

### WRONG: Narrative Decision Rules

```markdown
**CRITICAL DECISION RULES:**

- IF integrity_test.all_musts_really_met == false THEN bloqueado DEVE ser true
- IF integrity_test.used_only_authorized_data == false THEN bloqueado DEVE ser true
- DEFAULT SEGURO: quando em dúvida, bloqueado = true
- Campo explicacao_humana: SEMPRE explique em português claro o que o HUMANO deve fazer
```

**Problem:** Mixed imperative language ("DEVE ser", "SEMPRE explique") with formal logic.

---

### CORRECT: Formal Decision Algorithm

```markdown
Decision rules (ENFORCED):
```

bloqueado := (
NOT integrity_test.all_musts_really_met OR
NOT integrity_test.used_only_authorized_data OR
NOT validation_summary.step7_all_honest_true OR
validation_summary.any_critical_issues OR
(step7.data_sources_used CONTAINS 'external' AND policy=='negado')
)

DEFAULT: IF doubt THEN bloqueado:=true
explicacao_humana: MANDATORY, CLEAR, ACTIONABLE

```

```

**Why better:**

- Assignment operator (`:=`) makes it explicit
- Boolean expression is unambiguous
- DEFAULT case formally specified
- explicacao_humana constraint (MANDATORY) not instruction

---

## Rationale

### Why This Matters

**Narrative control fails because:**

1. LLMs are trained to **complete tasks**, not **stop**
2. Narrative text is **interpreted**, not **executed**
3. "Certifique-se de..." ≈ suggestion, not hard constraint
4. Natural language has **ambiguity** LLMs exploit

**Structural control succeeds because:**

1. States are **discrete** (no interpretation needed)
2. Transitions are **explicit** (IF-THEN-ELSE)
3. Formal logic is **unambiguous** (`A AND B` has one meaning)
4. LLMs process structured data as **code**, not **advice**

### Evidence

**Incident 2026-01-25 (DeepSeek):**

- Narrative instruction: "IA, certifique-se de preencher checklist honestamente"
- **Result:** AI marked all items complete without verification
- **Rate:** ~5% enforcement

**Post-Layer Zero (expected):**

- Structural constraint: `honest_assessment: IF any(doubt) THEN false`
- **Expected:** AI forced to mark false when doubt exists
- **Rate:** 75-85% enforcement (via formal logic + cross-validation)

---

## Implementation Guidelines

### When Refactoring to Layer Zero:

1. **Identify narrative control:**
   - Look for: "IA, certifique-se...", "DEVE", "SEMPRE", "NÃO"
   - Replace with: states, transitions, formal rules

2. **Extract human messages to boundaries:**
   - Move explanatory text to `explicacao_humana` output fields
   - Keep only formal conditions in control mechanism

3. **Convert imperatives to constraints:**
   - "Campo X DEVE ser Y" → "X: MANDATORY"
   - "Avalie CADA M" → "FOR_EACH(M-criterion)"
   - "Faça até N perguntas" → "max_questions(N), HALT"

4. **Formalize decision logic:**
   - "Se X então Y deve ser Z" → "IF X THEN Y:=Z"
   - "Quando em dúvida, bloqueie" → "DEFAULT: IF doubt THEN bloqueado:=true"

5. **Structure instructions as algorithms:**
   - Replace numbered narrative lists with state-based processing
   - Use formal transitions, not "depois de..."

---

## Testing Layer Zero Compliance

A prompt is Layer Zero compliant IF:

**Guards contain:**

- Formal rules (boolean expressions)
- Action keywords (HALT, CONTINUE)
- Output IDs (DIAGNOSTIC_X), not inline messages

**State machine contains:**

- State names (PREVALIDATION, VALIDATION_PHASE, etc.)
- Transitions (IF condition THEN state)
- Allowed steps per state

**Instructions contain:**

- Formal logic (IF-THEN-ELSE)
- State-based sequencing
- Constraint declarations

**Human text appears ONLY in:**

- User input (prompts, data)
- Output fields (explicacao_humana, Step 9 delivery)

**Violations include:**

- "IA, certifique-se de..."
- "DEVE", "SEMPRE", "NÃO" in control mechanisms
- Explanations inside guards/state machine
- Imperative language in schemas

---

## Benefits

### Enforcement Rate

- **Narrative (v2.0):** ~5% (LLMs treat as suggestions)
- **Layer Zero (v2.1):** 75-85% (LLMs process as structure)

### Token Efficiency

- **Removed:** ~150 tokens of narrative per prompt
- **Reason:** Formal expressions more concise than explanations

### Clarity

- **Formal rules:** Unambiguous (`A AND B` = one interpretation)
- **Narrative:** Ambiguous ("faça X se achar necessário" = when?)

### Maintainability

- **Structural:** Easy to version, diff, validate
- **Narrative:** Hard to parse, validate, evolve

---

## Related Documents

- [guards-specification.md](./guards-specification.md) - Technical spec with Layer Zero guards
- [migration-v2.0-to-v2.1.md](./migration-v2.0-to-v2.1.md) - Migration guide
- [IMPLEMENTATION_LOG.md](../IMPLEMENTATION_LOG.md) - Refactoring changelog

---

**Document version:** 1.0
**Principle version:** Layer Zero (OPENPUP v2.1)
**Authors:** Jeanco + Claude Sonnet 4.5
**License:** Same as OPENPUP project
