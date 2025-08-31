# WebView 1 — Etapas (OpenPUP · UI/UX e Montagem do Protocolo)

> Objetivo: **guiar o usuário passo a passo** pelo OpenPUP, **montar um prompt 100% compatível** com IAs comerciais (ChatGPT, Claude, Gemini, etc.), e **permitir copiar/colar** o protocolo final sem HTML ou metadados invisíveis.

---

## Princípios MUST

- **Compatível com IAs comerciais**: a saída precisa ser **texto puro** (sem tags HTML), respeitando exatamente o formato do OpenPUP (passos 0→9, delimitadores e instruções).
- **“Gerar protocolo completo”**: a UI deve montar **um bloco único** com todo o conteúdo (0 a 9), pronto para **copiar/colar** na IA escolhida.  
- **Fidelidade do fluxo**: a ordem, rótulos e marcadores devem seguir o **PROTOCOLO.txt** e o **GUIA_EXPLICATIVO.md** (inclusive `<TASK_BEGIN>`, `<DATA>`, `<<READY_EXEC>>`, checklists, etc.). 

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
    "objetivo": "",
    "formato_saida": "Markdown",
    "tamanho_alvo": "200–300 palavras"
  },
  "step2": {
    "criterios": [
      { "codigo": "M1", "peso": 1.0, "descricao": "Até 300 palavras" },
      { "codigo": "M2", "peso": 1.0, "descricao": "3 exemplos práticos" },
      { "codigo": "M3", "peso": 1.0, "descricao": "Linguagem clara em PT-BR" }
    ],
    "regras_dados": [
      { "codigo": "D1", "peso": 0.5, "descricao": "Usar dados de X antes de Y" }
    ]
  },
  "step3": {
    "data_raw": ""
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
    "plano": [] ,
    "estimativa_tamanho": "",
    "ready_exec": false
  },
  "step7": {
    "checklist": {
      "musts": false,
      "shoulds": false,
      "avoid": false,
      "tamanho_formato": false,
      "uso_exclusivo_dados": false,
      "incertezas_qualificadas": false,
      "custom": []
    }
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

> Observação: `step5`, `step6`, `step7`, `step8` e `step9` são **preenchidos pela IA** (com exceção de marcar/ajustar checklist no 7 se o usuário quiser). A UI precisa apenas **exibir e permitir editar/confirmar** quando aplicável.;

---

## Especificação por Etapa (UI/UX)

### Etapa 0 — Modo e Idioma

* **Inputs**:
  * `modo`: radio (FAST | THOROUGH)
  * `idioma`: select (PT-BR | EN | …)
  * `publico`: select (leigo | intermediario | tecnico)
  * `overflow`: select (p.ex. `resumir_dados_nao_criticos`)
  * `contexto_conversa`: select (primeira\_vez | continuidade)
* **UX**: tooltips com resumos do Guia; preview atualiza bloco “## 0) Modo e Idioma”.&#x20;

### Etapa 1 — Tarefa

* **Inputs**:
  * `objetivo` (textarea)
  * `formato_saida` (select: Markdown | tabela | JSON | lista | texto)
  * `tamanho_alvo` (input text, ex.: “200–300 palavras”)
* **Validação**: objetivo obrigatório; formato obrigatório.
* **Preview**: renderiza entre `<TASK_BEGIN>` e `<TASK_END>`.&#x20;

### Etapa 2 — Critérios

* **Inputs**:
  * Tabela dinâmica para itens `M`, `S`, `A`, `D` com `codigo`, `peso` (slider -1.0…1.0 em steps de 0.1) e `descricao`.
* **UX**:
  * Destaque visual para `peso >= 1.0` (MUST) e `peso <= -1.0` (AVOID).
  * Aviso de conflito (ex.: dois critérios mutuamente exclusivos ambos com peso alto).
* **Preview**: lista textual exatamente como no modelo do protocolo. &#x20;

### Etapa 3 — Dados (fonte da verdade)

* **Inputs**:
  * `data_raw` (textarea grande) e **opção de upload** (.txt, .md, .csv, .json). A UI envolve o conteúdo em `<DATA> ... </DATA>`.
* **UX**:
  * Indicar que **somente** o que está dentro de `<DATA>` será usado (salvo permitir fontes externas na Etapa 4).&#x20;

### Etapa 4 — Restrições e Condições

* **Inputs**:
  * `external_sources`: select (permitido | negado)
  * `clarification_policy.max_questions`: number
  * `clarification_policy.if_no_response`: select (assume | string livre)
  * `scope_limits`: lista (chips)
  * `tools_required`: lista (chips)
  * `other_conditions`: lista (chips)
* **Preview**: bloco YAML conforme o protocolo.&#x20;

### Etapa 5 — Análise Prévia (IA)
* **Exibição**:
  * 3 listas: **Lacunas**, **Assunções**, **Riscos**.
  * Se houver lacuna crítica, a IA pode incluir até **3 perguntas objetivas** e pausar.&#x20;

### Etapa 6 — Plano de Execução (IA)

* **Exibição**:
  * Tabela `passo | acao | meta`.
  * Campo “Como atenderá MUST/SHOULD/AVOID” (texto curto).
  * “Estimativa de tamanho final”.
  * Botão “Marcar **<\<READY\_EXEC>>**” (toggle que insere a marca no preview).&#x20;

### Etapa 7 — Auto-checagem (IA + Usuário)

* **Checklist** (marcar em Markdown):
  * Cumpriu todos os MUST
  * SHOULD atendidos quando possível
  * Nenhum AVOID violado
  * Tamanho e formato conforme Tarefa
  * Uso exclusivo dos Dados
  * Incertezas qualificadas
  * **Demais critérios definidos por você** (lista custom)&#x20;
* **UX**: usuário pode adicionar itens custom e marcar/desmarcar.

### Etapa 8 — Regra de Parada (IA)

* **Exibição**:
  * **Bloqueado** (true/false)
  * **Motivo**
  * **Proposta** (pedir dados, versão parcial segura etc.)
* **Regras**: se `bloqueado = true`, **não** gerar Entrega.&#x20;

### Etapa 9 — Entrega (IA)

* **Exibição**:
  * Campo somente leitura contendo a saída final **conforme a Tarefa**, usando **apenas `<DATA>`** e respeitando critérios/restrições.
  * Só aparece se **<\<READY\_EXEC>>** estiver marcado **e** checklist da Etapa 7 estiver OK **e** `bloqueado = false`.&#x20;

---

## Montagem do Prompt (Preview → Texto final)

A cada alteração, a WebView recompõe o **prompt completo** nestes blocos:

```
<!-- INÍCIO DO PROMPT OPENPUP -->
## 0) Modo e Idioma
[Yaml preenchido do passo 0]

## 1) Tarefa (o que produzir e em que formato)
### <TASK_BEGIN>
Objetivo: [objetivo]
Formato de saída: [formato]
Tamanho-alvo: [tamanho]
### <TASK_END>

## 2) Critérios (priorização do que importa)
[lista textual dos critérios M/S/A/D com pesos e descrições]

## 3) Dados (fonte da verdade)
<DATA>
[data_raw]
</DATA>

## 4) Restrições e Condições
[bloco YAML de restrições]

## 5) Análise Prévia (não é a entrega)
[Lacunas / Assunções / Riscos — gerados pela IA]

## 6) Plano de Execução (antes de escrever)
[tabela passo|acao|meta + explicação + estimativa]
<<READY_EXEC>> (se marcado)

## 7) Auto-checagem (antes de enviar)
[checklist em Markdown]

## 8) Regra de Parada
[Bloqueado / Motivo / Proposta]

## 9) Entrega (somente após <<READY_EXEC>>)
[conteúdo final]
<!-- FIM DO PROMPT -->
```

> Observações de conformidade:
>
> * Mantém **títulos, ordem e marcadores** do Protocolo.&#x20;
> * **Delimitadores críticos** preservados: `<TASK_BEGIN>…</TASK_END>`, `<DATA>…</DATA>`, `<<READY_EXEC>>`.&#x20;
> * A entrega (9) só aparece após o plano (6) indicar `<<READY_EXEC>>` e a checagem (7).&#x20;

---

## Ações Globais

* **Copiar Protocolo**: copia **apenas** o preview de texto (sem comentários da UI).
* **Exportar .md / .txt**: baixa o preview como arquivo.
* **Salvar Template**: persiste `step0…step4` e presets de `step2` para reutilização.
* **Resetar**: limpa todo o estado.

---

## Recomendações Técnicas
                                                                                                          
* **Frontend**: React/Vue + estado centralizado. Campos com autosave e validação leve.
* **Backend (opcional)**: Node/Python apenas se precisar de upload, versionamento, auth ou chamadas a provedores de IA.
* **Compatibilidade de saída**: normalizar quebras de linha `\n`, evitar caracteres invisíveis, garantir **texto puro** na área de preview/export.
* **Contagem de tokens**: heurística local (ex.: tiktoken/approx) apenas para **alerta**; aplicar política `overflow` (passo 0) se ultrapassar o limite.&#x20;
* **Privacidade**: se houver upload em 3, permitir “processar localmente” quando possível; avisar sobre uso externo se `external_sources = permitido`.&#x20;
* **Acessibilidade**: navegação por teclado, ARIA roles, contraste AA.
* **i18n**: textos da UI traduzíveis; **o prompt final segue o idioma definido no passo 0**.&#x20;

---

## Melhores Práticas de UX incorporadas

* **Pré-visualização constante** para reduzir “surpresas” na hora de colar.
* **Placeholders e exemplos** nas etapas 1 e 2 (ex.: “Gerar um resumo sobre \[tema]…”, pesos 1.0/0.5/–1.0).&#x20;
* **Guard rails**: bloquear Entrega quando `bloqueado = true` ou `<<READY_EXEC>>` ausente.&#x20;
* **Avisos de conflito** nos critérios (ex.: limites de tamanho vs. número de exemplos).
* **Templates** por domínio (marketing, produto, dados…) para acelerar preenchimento.

---

## Exemplo de Saída (trecho)

```text
## 0) Modo e Idioma

modo: FAST
idioma: PT-BR
publico: tecnico
overflow: resumir_dados_nao_criticos
contexto_conversa: primeira_vez

## 1) Tarefa (o que produzir e em que formato)
### <TASK_BEGIN>
Objetivo: Gerar um resumo sobre o impacto de X em Y.
Formato de saída: Markdown
Tamanho-alvo: 250–300 palavras
### <TASK_END>
```

> Este exemplo demonstra **formatação idêntica** ao protocolo original para otimizar **copiar/colar** em IAs comerciais.&#x20;

---

> Este projeto é licenciado sob:
- **Documentação**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Implementações em software**: [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
