# WebView 1 — Etapas (OpenPUP v2 · UI/UX e Montagem do Protocolo)

> **Versão:** OpenPUP v2
> **Objetivo:** **guiar o usuário passo a passo** pelo OpenPUP, **montar um prompt 100% compatível** com IAs comerciais (ChatGPT, Claude, Gemini, etc.), e **permitir copiar/colar** o protocolo final sem HTML ou metadados invisíveis (esta parte de visualização imediata será implementada em breve).
>
> **Formato do prompt gerado:** `<!-- OPENPUP v2 -->` ... `<!-- /OPENPUP -->`

---

## Princípios MUST

- **Compatível com IAs comerciais**: a saída precisa ser **texto puro** (sem tags HTML), respeitando exatamente o formato do OpenPUP (passos 0→9, delimitadores e instruções).
- **“Gerar protocolo completo”**: a UI deve montar **um bloco único** com todo o conteúdo (0 a 9), pronto para **copiar/colar** na IA escolhida.
- **Fidelidade do fluxo**: a ordem, rótulos e marcadores devem seguir o **PROTOCOLO.txt** e o **GUIA_EXPLICATIVO.md** (inclusive `<TASK>`, `<DATA>`, `<<READY_EXEC>>`, checklists, etc.).

---

## Layout recomendado

- **Painel Esquerdo (Form Steps)**: wizard com as **10 etapas (0 a 9)**.
- **Painel Direito (Prompt Preview)**: **pré-visualização ao vivo** do protocolo final **em texto**, montado incrementalmente e sempre **colável**.
- **Header**: botões de **Copiar Protocolo**, **Exportar .md**, **Exportar .txt**, **Resetar**, **Salvar Template**.
- **Footer**: contador de caracteres e estimativa de **tokens** (heurística), aviso de **overflow** (aplicar política escolhida no passo 0).

---

## Estado (schema de dados)

```json
{
  "step0": {
    "modo": "FAST",
    "idioma": "PT-BR",
    "publico": "tecnico",
    "overflow": "resumir_dados_nao_criticos",
    "contexto_conversa": "primeira_vez"
  },
  "step1": {
    "objetivo_o_que": "",
    "objetivo_por_que": "",
    "objetivo_criterio": "",
    "formato_saida": "Markdown",
    "tamanho_alvo": "200–300 palavras"
  },
  "step2": {
    "criterios_fixos": [
      {
        "codigo": "M1",
        "peso": 1.0,
        "descricao": "A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8."
      },
      {
        "codigo": "M2",
        "peso": 1.0,
        "descricao": "A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas."
      }
    ],
    "criterios": [
      { "codigo": "M3", "peso": 1.0, "descricao": "Até 300 palavras" },
      { "codigo": "S1", "peso": 0.5, "descricao": "3 exemplos práticos" },
      {
        "codigo": "A1",
        "peso": -1.0,
        "descricao": "Linguagem técnica excessiva"
      }
    ]
  },
  "step3": {
    "data_raw": "",
    "contexto_implicito": ""
  },
  "step4": {
    "external_sources": "permitido",
    "clarification_policy": { "max_questions": 3, "if_no_response": "assume" },
    "scope_limits": [],
    "tools_required": [],
    "other_conditions": []
  },
  "step5": {
    "analise": { "lacunas": [], "assuncoes": [], "riscos": [] }
  },
  "step6": {
    "plano": [],
    "estimativa_tamanho": "",
    "ready_exec": false
  },
  "step7": {
    "checklist": {
      "etapas_anteriores": false,
      "musts": false,
      "shoulds": false,
      "avoid": false,
      "tamanho_formato": false,
      "uso_exclusivo_dados": false,
      "incertezas_qualificadas": false
    },
    "custom_checklist": []
  },
  "step8": {
    "bloqueado": false,
    "motivo": "",
    "proposta": ""
  },
  "step9": {
    "entrega": ""
  }
}
```

> Observação: `step5`, `step6`, `step7`, `step8` e `step9` são **executados pela IA** após receber o prompt. A UI não pré-preenche essas seções - elas são instruções para a IA sobre como processar a tarefa. A exceção é `custom_checklist` em `step7`, que o usuário pode definir antecipadamente.

---

## Especificação por Etapa (UI/UX)

### Etapa 0 — META

- **Inputs**:
  - `modo`: radio (FAST | THOROUGH)
  - `idioma`: autocomplete input (PT-BR | EN | ES | FR | DE | IT | JA | KO | ZH | RU | …)
  - `publico`: select (leigo | intermediario | tecnico)
  - `overflow`: select (p.ex. `resumir_dados_nao_criticos`)
  - `contexto_conversa`: select (primeira_vez | continuidade)
- **UX**: tooltips com resumos do Guia; preview atualiza bloco "## 0) META".&#x20;

### Etapa 1 — Tarefa

- **Inputs**:
  - `objetivo_o_que` (textarea) — O que a IA deve fazer
  - `objetivo_por_que` (textarea) — Por que isso importa / contexto
  - `objetivo_criterio` (textarea) — Critério de sucesso / como saber que está pronto
  - `formato_saida` (select: Markdown | tabela | JSON | lista | texto)
  - `tamanho_alvo` (input text, ex.: "200–300 palavras")
- **Validação**: pelo menos `objetivo_o_que` obrigatório; formato obrigatório.
- **Preview**: renderiza dentro de `<TASK>` delimiter com três campos estruturados.&#x20;

### Etapa 2 — Prioridades

- **Critérios Fixos** (sempre incluídos no protocolo):
  - **M1**: A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8. (peso = 1.0)
  - **M2**: A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas. (peso = 1.0)

- **Inputs** (critérios personalizados):
  - Tabela dinâmica para itens `M`, `S`, `A`, `D` com `codigo`, `peso` (slider -1.0…1.0 em steps de 0.1) e `descricao`.
- **UX**:
  - Destaque visual para `peso >= 1.0` (MUST) e `peso <= -1.0` (AVOID).
  - Aviso de conflito (ex.: dois critérios mutuamente exclusivos ambos com peso alto).
- **Preview**: lista textual com legenda `M=MUST | S=SHOULD | A=AVOID | D=DATA`, seguida dos critérios fixos e depois os personalizados. &#x20;

### Etapa 3 — Dados (fonte da verdade)

- **Inputs**:
  - `data_raw` (textarea grande) e **opção de upload** (.txt, .md, .csv, .json). A UI envolve o conteúdo em `<DATA> ... </DATA>`.
- **UX**:
  - Indicar que **somente** o que está dentro de `<DATA>` será usado (salvo permitir fontes externas na Etapa 4).

### Etapa 3.5 — Contexto Implícito (opcional)

- **Inputs**:
  - `contexto_implicito` (textarea) — informações contextuais que a IA pode usar para tomar decisões mais informadas, mas que não fazem parte dos dados primários.
- **UX**:
  - Campo opcional que aparece apenas se o usuário clicar para expandir ou adicionar.
  - Diferente de `<DATA>`, este contexto é interpretativo e não é a fonte primária da verdade.
- **Preview**: Se preenchido, renderiza como "## 3.5) CONTEXTO IMPLÍCITO" após a seção 3.

### Etapa 4 — Restrições e Condições

- **Inputs**:
  - `external_sources`: select (permitido | negado)
  - `clarification_policy.max_questions`: number
  - `clarification_policy.if_no_response`: select (assume | string livre)
  - `scope_limits`: textarea (uma linha por limite)
  - `tools_required`: textarea (uma linha por ferramenta)
  - `other_conditions`: textarea (uma linha por condição)
  - `custom_checklist`: textarea (itens adicionais para checklist da Etapa 7)
- **Preview**: bloco em formato YAML conforme o protocolo.

### Etapa 5 — Análise (IA)

- **Exibição**:
  - 3 listas: **Lacunas**, **Assunções**, **Riscos**.
  - Se houver lacuna crítica, a IA pode incluir até **max_questions** perguntas objetivas e pausar.
- **Modo FAST**: Formato de tabela compacto
- **Modo THOROUGH**: Formato descritivo com blocos separados e explicações detalhadas&#x20;

### Etapa 6 — Plano de Execução (IA)

- **Exibição**:
  - **Modo FAST**: Tabela compacta `# | Ação | Entregável | Como atende M/S/A`
  - **Modo THOROUGH**: Tabela `passo | acao | meta` com explicação separada
  - "Estimativa de tamanho final"
  - Marca de conclusão: `<<READY_EXEC>>`
- **UX**: A IA insere automaticamente `<<READY_EXEC>>` ao finalizar o plano.&#x20;

### Etapa 7 — Auto-checagem (IA)

- **Checklist** (marcar em Markdown):
  - **Modo FAST**:
    - Etapas 5-6 concluídas antes da entrega
    - Todos os MUST cumpridos
    - SHOULD atendidos quando possível
    - Nenhum AVOID violado
    - Tamanho e formato conforme Tarefa
    - Uso exclusivo dos Dados fornecidos
    - Incertezas qualificadas
    - [Itens custom adicionados pelo usuário]
  - **Modo THOROUGH**: Inclui item adicional "Etapa 7 concluída sem pular itens"
- **UX**: Usuário pode adicionar itens personalizados em `custom_checklist` que serão inseridos na lista.

### Etapa 8 — Parada (IA)

- **Exibição**:
  - **Modo FAST**: Formato compacto com campos diretos
  - **Modo THOROUGH**: Formato descritivo com blocos separados
  - **Bloqueado?** (true/false)
  - **Motivo** (se bloqueado)
  - **Proposta** (pedir dados, versão parcial segura, etc.)
- **Regras**: se `bloqueado = true`, **não** gerar Entrega na seção 9.&#x20;

### Etapa 9 — Entrega (IA)

- **Exibição**:
  - Conteúdo final **conforme a Tarefa**, usando **apenas `<DATA>`** (e `contexto_implicito` se fornecido) e respeitando critérios/restrições.
  - Só aparece se **`<<READY_EXEC>>`** estiver marcado **e** checklist da Etapa 7 estiver OK **e** `bloqueado = false`.
- **Modo FAST**: Instruções concisas
- **Modo THOROUGH**: Instruções mais detalhadas com lembrete de "Respeitar o esquema indicado anteriormente"&#x20;

---

## Diferenças entre Modos FAST e THOROUGH

As etapas 5-9 têm formatação diferente dependendo do modo escolhido:

### Modo FAST

- **Objetivo**: Respostas rápidas e diretas
- **Formato**: Tabelas compactas, instruções concisas
- **Etapa 5**: Tabela com 3 colunas (Categoria | Itens Identificados)
- **Etapa 6**: Tabela com 4 colunas (# | Ação | Entregável | Como atende M/S/A)
- **Etapa 7**: Checklist padrão de 7 itens + custom
- **Etapa 8**: Formato compacto com campos diretos
- **Etapa 9**: Instruções breves e diretas

### Modo THOROUGH

- **Objetivo**: Respostas detalhadas e explicadas
- **Formato**: Blocos descritivos, listas organizadas, explicações adicionais
- **Etapa 5**: Blocos separados para Lacunas/Assunções/Riscos com listas descritivas
- **Etapa 6**: Tabela de 3 colunas (passo | acao | meta) + explicação separada de como atende M/S/A
- **Etapa 7**: Checklist padrão de 8 itens (inclui "Etapa 7 concluída sem pular itens") + custom
- **Etapa 8**: Blocos descritivos separados para cada campo
- **Etapa 9**: Instruções detalhadas com lembrete de conformidade ao esquema

---

## Montagem do Prompt (Preview → Texto final)

A cada alteração, a WebView recompõe o **prompt completo** nestes blocos:

```
<!-- OPENPUP v2 -->
## 0) META
modo: [FAST|THOROUGH]
idioma: [PT-BR|EN|etc]
publico: [leigo|intermediario|tecnico]
overflow: [resumir_dados_nao_criticos|etc]
contexto_conversa: [primeira_vez|continuidade]

---
## 1) TAREFA
<TASK>
O quê: [objetivo_o_que]
Por quê: [objetivo_por_que]
Critério de sucesso: [objetivo_criterio]

Formato de saída: [formato]
Tamanho-alvo: [tamanho]
</TASK>

---
## 2) PRIORIDADES
**Legenda:** M=MUST | S=SHOULD | A=AVOID | D=DATA

M: A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8. # peso = 1.0
M: A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas. # peso = 1.0
[critérios personalizados no formato: CODIGO: descrição # peso = X.X]

---
## 3) DADOS
<DATA>
[data_raw]
</DATA>

[Se contexto_implicito preenchido:]
---
## 3.5) CONTEXTO IMPLÍCITO
[contexto_implicito]

---
## 4) RESTRIÇÕES
external_sources: [permitido|negado]
clarification_policy: max_questions: [número]
if_no_response: [assume|outro]

scope_limits:
  - [limite1]
  - [limite2]

tools_required:
  - [ferramenta1]
  - [ferramenta2]

other_conditions:
  - [condição1]
  - [condição2]

---
[Templates específicos para FAST ou THOROUGH — seções 5 a 9]

<!-- /OPENPUP -->
```

> Observações de conformidade:
>
> - Mantém **títulos, ordem e marcadores** do Protocolo.
> - **Delimitadores críticos** preservados: `<TASK>…</TASK>`, `<DATA>…</DATA>`, `<<READY_EXEC>>`.
> - A entrega (9) só aparece após o plano (6) indicar `<<READY_EXEC>>` e a checagem (7).
> - Seções 5-9 têm formatação diferente dependendo do modo FAST ou THOROUGH.&#x20;

---

## Ações Implementadas

- **Copiar Protocolo**: copia o preview de texto para a área de transferência
- **Resetar**: limpa todos os campos do formulário

> **Nota:** Funcionalidades adicionais planejadas (exportação, templates) estão listadas em [TODO.md](TODO.md)

---

## Recomendações Técnicas

- **Frontend**: React/Vue + estado centralizado. Campos com autosave e validação leve.
- **Backend (opcional)**: Node/Python apenas se precisar de upload, versionamento, auth ou chamadas a provedores de IA.
- **Compatibilidade de saída**: normalizar quebras de linha `\n`, evitar caracteres invisíveis, garantir **texto puro** na área de preview/export.
- **Contagem de tokens**: heurística local (ex.: tiktoken/approx) apenas para **alerta**; aplicar política `overflow` (passo 0) se ultrapassar o limite.&#x20;
- **Privacidade**: se houver upload em 3, permitir “processar localmente” quando possível; avisar sobre uso externo se `external_sources = permitido`.&#x20;
- **Acessibilidade**: navegação por teclado, ARIA roles, contraste AA.
- **i18n**: textos da UI traduzíveis; **o prompt final segue o idioma definido no passo 0**.&#x20;

---

## Melhores Práticas de UX incorporadas ()

- **Placeholders e exemplos** nas etapas 1 e 2 (ex.: “Gerar um resumo sobre \[tema]…”, pesos 1.0/0.5/–1.0).&#x20;
- **Guard rails**: bloquear Entrega quando `bloqueado = true` ou `<<READY_EXEC>>` ausente.&#x20;
- **Avisos de conflito** nos critérios (ex.: limites de tamanho vs. número de exemplos).
- **Templates** por domínio (marketing, produto, dados…) para acelerar preenchimento.

---

## Exemplo de Saída (trecho)

```text
<!-- OPENPUP v2 -->
## 0) META
modo: FAST
idioma: PT-BR
publico: tecnico
overflow: resumir_dados_nao_criticos
contexto_conversa: primeira_vez

---
## 1) TAREFA
<TASK>
O quê: Gerar um resumo sobre o impacto de X em Y
Por quê: Preciso entender a relação causal para decisão estratégica
Critério de sucesso: Resumo claro com pelo menos 3 evidências concretas

Formato de saída: Markdown
Tamanho-alvo: 250–300 palavras
</TASK>

---
## 2) PRIORIDADES
**Legenda:** M=MUST | S=SHOULD | A=AVOID | D=DATA

M: A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8. # peso = 1.0
M: A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas. # peso = 1.0
M: Incluir pelo menos 3 evidências concretas # peso = 1.0
S: Usar linguagem acessível # peso = 0.5
```

> Este exemplo demonstra **formatação idêntica** ao protocolo atual (v2) para otimizar **copiar/colar** em IAs comerciais.&#x20;

---

> Este projeto é licenciado sob:

- **Documentação**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Implementações em software**: [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
