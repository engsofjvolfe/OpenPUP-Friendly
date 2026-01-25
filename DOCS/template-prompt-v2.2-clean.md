# OPENPUP v2.1 Layer Zero - Template Estrutural

**Princípio:** Control is structural, not narrative. Human-readable text only at I/O boundaries.

---

<!-- OPENPUP v2.1 Layer Zero -->
## 0) META
modo: ${modo}
idioma: ${idioma}
publico: ${publico}
overflow: ${overflow}
contexto_conversa: ${contexto_conversa}

---
## 1) TAREFA
<TASK>
O quê: ${objetivo_o_que}
Por quê: ${objetivo_por_que}
Critério de sucesso: ${objetivo_criterio}

Formato de saída: ${formato}
Tamanho-alvo: ${tamanho}
</TASK>

---
## 2) CRITERIA_REGISTRY
**Legenda:** M=MUST | S=SHOULD | A=AVOID

**Meta-Constraints:**
[[M-PROTO-1]]: Executar etapas 5-9 sequencialmente. Falha bloqueia em step 8. # peso=1.0
[[M-PROTO-2]]: Interromper se etapa anterior incompleta ou inválida. # peso=1.0

**Task-Constraints:**
${criterios_customizados}

**REGISTRY_RULE:** All criterion references in steps 5-8 MUST exist in this registry. Reference to non-existent criterion := HALT.

---
## 3) DADOS
<DATA>
${dados}
</DATA>

${contexto_implicito}

---
## 4) RESTRIÇÕES
external_sources: ${external_sources}

clarification_policy:
  max_questions: ${max_questions}
  if_no_response: ${if_no_response}

scope_limits:
${scope_limits}

tools_required:
${tools_required}

other_conditions:
${other_conditions}

---
```yaml
OPENPUP_GUARDS:
  version: "2.1.0"

  invariants:
    INV_001:
      violation_if: "external_sources == 'negado' AND (<DATA>.empty OR <DATA>.is_placeholder)"
      output: DIAGNOSTIC_INV_001

    INV_002:
      violation_if: "EXISTS M WHERE NOT satisfiable(M, available_resources)"
      output: DIAGNOSTIC_INV_002

    INV_003:
      violation_if: "EXISTS (M_i, M_j) WHERE conflict(M_i, M_j)"
      output: DIAGNOSTIC_INV_003

    INV_004:
      violation_if: "EXISTS reference WHERE reference NOT IN CRITERIA_REGISTRY"
      output: DIAGNOSTIC_INV_004

  state_machine:
    current: PREVALIDATION

    PREVALIDATION:
      allowed_steps: []
      required_checks: [INV_001, INV_002, INV_003]
      on_pass: VALIDATION_PHASE
      on_fail: BLOCKED

    VALIDATION_PHASE:
      allowed_steps: [5, 6, 7, 8]
      response_format: JSON_ONLY
      on_pass:
        condition: "step8.bloqueado == false"
        then: EXECUTION_PHASE
        else: BLOCKED

    EXECUTION_PHASE:
      allowed_steps: [9]
      prerequisite: "step8.bloqueado == false"
      response_format: NATURAL_LANGUAGE

    BLOCKED:
      allowed_steps: []
      output_mode: DIAGNOSTIC_ONLY
```

---
## 5) ${step5_title}

```json
{
  "step": "5_analysis",
  "_meta": {
    "version": "2.1.0",
    "format": "strict_json",
    "text_outside_json_forbidden": true
  },
  "data_validation": {
    "data_section_empty": boolean,
    "data_is_placeholder": boolean,
    "data_content_preview": string,
    "external_sources_policy": "permitido|negado",
    "policy_conflict_detected": boolean,
    "conflict_reason": string|null
  },
  "lacunas": [{
    "item": string,
    "criticidade": "alta|media|baixa",
    "impede_must": [string]
  }],
  "assuncoes": [{
    "item": string,
    "justificativa": string
  }],
  "riscos": [{
    "item": string,
    "probabilidade": "alta|media|baixa",
    "impacto": "alto|medio|baixo"
  }],
  "must_validation": [{
    "codigo": string,
    "satisfazivel": boolean,
    "justificativa": string,
    "resource_check": {
      "required": [string],
      "available": [string],
      "missing": [string]
    }
  }],
  "registry_validation": {
    "all_referenced_criteria_exist": boolean,
    "invalid_references": [string]
  }
}
```

Constraints:
- must_validation[].codigo: MUST exist in CRITERIA_REGISTRY (section 2)
- lacunas[].impede_must[]: MUST reference valid criterion codes
- registry_validation.all_referenced_criteria_exist: IF false THEN HALT

---
## 6) ${step6_title}

```json
{
  "step": "6_plan",
  "_meta": {
    "version": "2.1.0",
    "format": "strict_json",
    "text_outside_json_forbidden": true
  },
  "steps": [{
    "numero": number,
    "acao": string,
    "entregavel": string,
    "addresses_criteria": [string],
    "depends_on_step": number|null,
    "success_criteria": string
  }],
  "tamanho_estimado": string,
  "dependencies_check": {
    "step5_completed": boolean,
    "step5_registry_valid": boolean,
    "data_sufficient_for_plan": boolean,
    "all_musts_addressed": boolean,
    "no_blocks_detected": boolean
  },
  "ready_exec": boolean
}
```

Constraints:
- ready_exec := AND(dependencies_check.step5_completed, dependencies_check.step5_registry_valid, dependencies_check.data_sufficient_for_plan, dependencies_check.all_musts_addressed, dependencies_check.no_blocks_detected)
- steps[].addresses_criteria[]: MUST reference criteria from CRITERIA_REGISTRY

---
## 7) ${step7_title}

```json
{
  "step": "7_checklist",
  "_meta": {
    "version": "2.1.0",
    "format": "strict_json",
    "text_outside_json_forbidden": true
  },
  "items": [{
    "id": string,
    "label": string,
    "checked": boolean,
    "verification_evidence": string,
    "honest_assessment": boolean,
    "data_sources_used": [string]
  }],
  "overall_honesty_declaration": string,
  "detected_violations": [string],
  "failure_propagation": {
    "any_honest_assessment_false": boolean,
    "any_checked_false": boolean,
    "force_block_step8": boolean
  }
}
```

Standard items: etapas_anteriores | musts_cumpridos | shoulds_atendidos | avoid_nao_violado | tamanho_formato | uso_exclusivo_dados | incertezas_qualificadas
${custom_checklist_items}

Constraints:
- honest_assessment: IF any(doubt) THEN false
- failure_propagation.any_honest_assessment_false := EXISTS item WHERE honest_assessment==false
- failure_propagation.any_checked_false := EXISTS item WHERE checked==false AND id IN ["musts_cumpridos", "avoid_nao_violado", "uso_exclusivo_dados"]
- failure_propagation.force_block_step8 := OR(failure_propagation.any_honest_assessment_false, failure_propagation.any_checked_false)

---
## 8) ${step8_title}

```json
{
  "step": "8_stop_decision",
  "_meta": {
    "version": "2.1.0",
    "format": "strict_json",
    "text_outside_json_forbidden": true
  },
  "integrity_test": {
    "all_musts_really_met": boolean,
    "used_only_authorized_data": boolean,
    "have_objective_justification_for_unblock": boolean,
    "reasoning": string
  },
  "validation_summary": {
    "step5_data_validation_passed": boolean,
    "step5_registry_validation_passed": boolean,
    "step6_ready_exec_true": boolean,
    "step7_all_honest_true": boolean,
    "step7_force_block": boolean,
    "any_critical_issues": boolean,
    "issues_list": [string]
  },
  "bloqueado": boolean,
  "motivo": string,
  "proposta": string,
  "explicacao_humana": string
}
```

Decision algorithm:
```
bloqueado := (
  NOT integrity_test.all_musts_really_met OR
  NOT integrity_test.used_only_authorized_data OR
  NOT validation_summary.step5_data_validation_passed OR
  NOT validation_summary.step5_registry_validation_passed OR
  NOT validation_summary.step6_ready_exec_true OR
  NOT validation_summary.step7_all_honest_true OR
  validation_summary.step7_force_block OR
  validation_summary.any_critical_issues OR
  (EXISTS source IN step7.data_sources_used WHERE source CONTAINS "external" AND policy == "negado")
)

IF any(doubt) THEN bloqueado := true
```

---
## 9) ${step9_title}

Preconditions:
- state == EXECUTION_PHASE
- step8.bloqueado == false
- step8.integrity_test.all(true)
- step8.validation_summary.step5_registry_validation_passed == true
- step8.validation_summary.step7_force_block == false
- step8.validation_summary.any_critical_issues == false

IF preconditions.all(true):
  Generate deliverable:
    format: ${formato}
    size: ${tamanho}
    source: <DATA> + contexto_implicito
    compliance: ALL(M/S/A from CRITERIA_REGISTRY)
    plan: EXACT_MATCH(step6.steps)

ELSE:
  OUTPUT: step8.explicacao_humana

<!-- /OPENPUP v2.1 -->
