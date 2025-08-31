// script.js
document.addEventListener('DOMContentLoaded', function () {
  let languages = [];

  // Carregar lista de idiomas do JSON
  fetch('../data/languages.json')
    .then(response => response.json())
    .then(data => {
      languages = data;
    })
    .catch(err => console.error("Erro ao carregar languages.json:", err));

  const idiomaInput = document.getElementById('idioma_input');
  const suggestionsBox = document.getElementById('idioma-suggestions');

  const formElements = {
    modo: () => document.querySelector('input[name="modo"]:checked'),
    idiomaHidden: document.querySelector('input[name="idioma"]'),
    publico: document.querySelector('select[name="publico"]'),
    overflow: document.querySelector('select[name="overflow"]'),
    contexto: document.querySelector('select[name="contexto"]'),
    objetivo: document.querySelector('textarea[name="objetivo"]'),
    formato: document.querySelector('[name="formato"]'),
    tamanho: document.querySelector('input[name="tamanho"]'),
    dados: document.querySelector('textarea[name="dados"]'),
    externalSources: document.querySelector('select[name="external_sources"]'),
    maxQuestions: document.querySelector('input[name="max_questions"]'),
    ifNoResponse: document.querySelector('select[name="if_no_response"]'),
    scopeLimits: document.querySelector('textarea[name="scope_limits"]'),
    toolsRequired: document.querySelector('textarea[name="tools_required"]'),
    otherConditions: document.querySelector('textarea[name="other_conditions"]'),
    customChecklist: document.querySelector('textarea[name="custom_checklist"]'),
    preview: document.getElementById('protocol-preview'),
    criteriosTable: document.querySelector('#criterios-table tbody')
  };

  function buildModalSummary() {
    const resumoHTML = `
        <div class="info-box">
        <strong>Modo:</strong> ${formElements.modo().value}<br>
        <strong>Idioma:</strong> ${formElements.idiomaHidden.value}<br>
        <strong>Público:</strong> ${formElements.publico.value}<br>
        <strong>Objetivo:</strong> ${formElements.objetivo.value || '<em>Não definido</em>'}<br>
        <strong>Formato:</strong> ${formElements.formato.value}<br>
        <strong>Tamanho:</strong> ${formElements.tamanho.value || '<em>Não definido</em>'}<br>
        <strong>Critérios:</strong> ${formElements.criteriosTable.querySelectorAll('tr').length} adicionados<br>
        <strong>Dados:</strong> ${formElements.dados.value ? 'Preenchido' : '<em>Não definido</em>'}
        </div>`;
    summaryBox.innerHTML = resumoHTML;
   }

  function clearField(field) {
    if (field.tagName === 'TEXTAREA' || field.tagName === 'INPUT') {
      field.value = '';
    }
  }

  function clearChecklistAndCriterios() {
    formElements.customChecklist.value = '';
    formElements.criteriosTable.innerHTML = '';
  }

  function showLanguageSuggestions(query) {
    const matches = languages.filter(lang =>
      lang.name.toLowerCase().includes(query) ||
      lang.code.toLowerCase().startsWith(query)
    ).slice(0, 10);

    suggestionsBox.innerHTML = '';
    if (matches.length === 0) {
      suggestionsBox.style.display = 'none';
      return;
    }

    matches.forEach(lang => {
      const div = document.createElement('div');
      div.classList.add('suggestion-item');
      div.textContent = `${lang.name} (${lang.code})`;
      div.dataset.code = lang.code;
      div.dataset.name = lang.name;
      div.tabIndex = 0;
      div.addEventListener('click', () => {
        idiomaInput.value = lang.name;
        formElements.idiomaHidden.value = lang.code;
        suggestionsBox.innerHTML = '';
        suggestionsBox.style.display = 'none';
      });
      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = 'block';
  }

  idiomaInput.addEventListener('input', () => {
    const query = idiomaInput.value.toLowerCase();
    if (query.length < 1) {
      suggestionsBox.style.display = 'none';
      return;
    }
    showLanguageSuggestions(query);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.input-group')) {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';
    }
  });

  function generateProtocol() {
    const criterios = [];
    formElements.criteriosTable.querySelectorAll('tr').forEach(row => {
      const codigo = row.cells[0].textContent;
      const peso = row.cells[1].textContent;
      const descricao = row.cells[2].textContent;
      criterios.push(`${codigo}: ${descricao} # peso = ${peso}`);
    });

    const scopeLimits = formElements.scopeLimits.value.split('\n').filter(line => line.trim() !== '');
    const toolsRequired = formElements.toolsRequired.value.split('\n').filter(line => line.trim() !== '');
    const otherConditions = formElements.otherConditions.value.split('\n').filter(line => line.trim() !== '');
    const customChecklist = formElements.customChecklist.value.split('\n').filter(line => line.trim() !== '');

    let protocol = `<!-- INÍCIO DO PROMPT OPENPUP -->
## 0) Modo e Idioma
modo: ${formElements.modo().value}
idioma: ${formElements.idiomaHidden.value}
publico: ${formElements.publico.value}
overflow: ${formElements.overflow.value}
contexto_conversa: ${formElements.contexto.value}

---
## 1) Tarefa (o que produzir e em que formato)
### <TASK_BEGIN>
Objetivo: ${formElements.objetivo.value}
Formato de saída: ${formElements.formato.value}
Tamanho-alvo: ${formElements.tamanho.value}
### <TASK_END>

---
## 2) Critérios (priorização do que importa)
${criterios.map(c => `  ${c}`).join('\n')}

---
## 3) Dados (fonte da verdade)
<DATA>
${formElements.dados.value}
</DATA>

---
## 4) Restrições e Condições
external_sources: ${formElements.externalSources.value}
clarification_policy: max_questions: ${formElements.maxQuestions.value}
if_no_response: ${formElements.ifNoResponse.value}
scope_limits:
${scopeLimits.map(sl => `  - ${sl}`).join('\n')}
tools_required:
${toolsRequired.map(tr => `  - ${tr}`).join('\n')}
other_conditions:
${otherConditions.map(oc => `  - ${oc}`).join('\n')}

---
## 5) Análise Prévia (não é a entrega)
\`\`\`json
{
  "lacunas": [],
  "assuncoes": [],
  "riscos": []
}
\`\`\`

---
## 6) Plano de Execução (antes de escrever)
| passo | acao | meta |
|-------|------|------|
| 1 | Introdução | contextualizar público |
| 2 | Desenvolvimento | atender critérios MUST |
| 3 | Revisão | evitar AVOIDs e validar SHOULDs |
<<READY_EXEC>>

---
## 7) Auto-checagem (antes de enviar)
- [ ] Cumpriu todos os MUST
- [ ] SHOULD atendidos quando possível
- [ ] Nenhum AVOID violado
- [ ] Tamanho e formato conforme Tarefa
- [ ] Uso exclusivo dos Dados
- [ ] Incertezas qualificadas
${customChecklist.map(cc => `- [ ] ${cc}`).join('\n')}

---
## 8) Regra de Parada
\`\`\`json
{
  "bloqueado": false,
  "motivo": "",
  "proposta": ""
}
\`\`\`

---
## 9) Entrega (somente após <<READY_EXEC>>)
<!-- FIM DO PROMPT -->`;

   formElements.preview.textContent = protocol;
  }

  //   Copiar Prompt
  document.getElementById('copy-prompt').addEventListener('click', () => {
    const text = formElements.preview.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const feedback = document.getElementById('copy-feedback');
            feedback.style.display = 'inline';
            setTimeout(() => feedback.style.display = 'none', 2000);
        });
    });

  document.getElementById('add-criterio').addEventListener('click', function () {
    const codigo = document.getElementById('crit-codigo').value;
    const peso = document.getElementById('crit-peso').value;
    const descricao = document.getElementById('crit-desc').value;

    if (codigo && peso && descricao) {
      const newRow = formElements.criteriosTable.insertRow();
      newRow.innerHTML = `
        <td>${codigo}</td>
        <td>${peso}</td>
        <td>${descricao}</td>
        <td><button class="rem-crit">Remover</button></td>
      `;
      document.getElementById('crit-codigo').value = '';
      document.getElementById('crit-peso').value = '1.0';
      document.getElementById('crit-desc').value = '';
    }
  });

  formElements.criteriosTable.addEventListener('click', function (e) {
    if (e.target.classList.contains('rem-crit')) {
      e.target.closest('tr').remove();
    }
  });

  document.querySelectorAll('.reset').forEach(button => {
    button.addEventListener('click', function () {
      document.querySelector('input[name="modo"][value="FAST"]').checked = true;
      idiomaInput.value = '';
      formElements.idiomaHidden.value = 'pt';
      formElements.publico.value = 'tecnico';
      formElements.overflow.value = 'resumir_dados_nao_criticos';
      formElements.contexto.value = 'primeira_vez';
      clearField(formElements.objetivo);
      formElements.formato.value = 'Markdown';
      clearField(formElements.tamanho);
      clearField(formElements.dados);
      formElements.externalSources.value = 'permitido';
      formElements.maxQuestions.value = '3';
      formElements.ifNoResponse.value = 'assume';
      clearField(formElements.scopeLimits);
      clearField(formElements.toolsRequired);
      clearField(formElements.otherConditions);
      clearField(formElements.scopeLimits);
      clearField(formElements.toolsRequired);
      clearField(formElements.otherConditions);
      clearChecklistAndCriterios();
      formElements.preview.textContent = '';
    });
  });

  // Modal de confirmação
  const modal = document.getElementById('confirmation-modal');
  const confirmBtn = document.getElementById('confirm-generate');
  const cancelBtn = document.getElementById('cancel-modal');
  const summaryBox = document.getElementById('modal-summary');

  // Exibir modal com resumo
    document.querySelectorAll('.generate').forEach(button => {
        button.addEventListener('click', () => {
            buildModalSummary();
            modal.style.display = 'flex';
        });
    });

  // Confirmar e gerar
  confirmBtn.addEventListener('click', () => {
    generateProtocol();
    modal.style.display = 'none';
  });

  // Cancelar
  cancelBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});
