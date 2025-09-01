/*
OpenPUP - Protocolo Universal de Prompt  
Licença: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International  
Autor: Jeanco Volfe 
Repositório: https://github.com/engsofjvolfe/OpenPUP.git 
*/

// script.js
document.addEventListener("DOMContentLoaded", function () {
  let languages = [];

  // Carregar lista de idiomas do JSON
  fetch("../data/languages.json")
    .then((response) => response.json())
    .then((data) => {
      languages = data;
    })
    .catch((err) => console.error("Erro ao carregar languages.json:", err));

  const idiomaInput = document.getElementById("idioma_input");
  const suggestionsBox = document.getElementById("idioma-suggestions");

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
    otherConditions: document.querySelector(
      'textarea[name="other_conditions"]'
    ),
    customChecklist: document.querySelector(
      'textarea[name="custom_checklist"]'
    ),
    preview: document.getElementById("protocol-preview"),
    criteriosTable: document.querySelector("#criterios-table tbody"),
  };

  function buildModalSummary() {
    // Função auxiliar para campos opcionais
    const formatField = (field) =>
      field && field.value ? field.value : "<em>Não definido</em>";

    // Contagem de critérios
    const countCriterios =
      formElements.criteriosTable.querySelectorAll("tr").length;
    const criteriosText =
      countCriterios === 1 ? "1 adicionado" : `${countCriterios} adicionados`;

    const resumoHTML = `
    <div class="info-box">
      <strong>Modo:</strong> ${formElements.modo().value}<br>
      <strong>Idioma:</strong> ${formElements.idiomaHidden.value}<br>
      <strong>Público:</strong> ${formElements.publico.value}<br>
      <strong>Overflow:</strong> ${formElements.overflow.value}<br>
      <strong>Contexto:</strong> ${formElements.contexto.value}<br>
      <strong>Objetivo:</strong> ${formatField(formElements.objetivo)}<br>
      <strong>Formato:</strong> ${formatField(formElements.formato)}<br>
      <strong>Tamanho:</strong> ${formatField(formElements.tamanho)}<br>
      <strong>Critérios:</strong> ${criteriosText}<br>
      <strong>Dados:</strong> ${
        formElements.dados.value ? "Preenchido" : "<em>Não definido</em>"
      }<br>
      <strong>Fontes externas:</strong> ${
        formElements.externalSources.value
      }<br>
      <strong>Máx. de perguntas:</strong> ${formElements.maxQuestions.value}<br>
      <strong>Se não houver resposta:</strong> ${
        formElements.ifNoResponse.value
      }<br>
      <strong>Limites de escopo:</strong> ${formatField(
        formElements.scopeLimits
      )}<br>
      <strong>Ferramentas necessárias:</strong> ${formatField(
        formElements.toolsRequired
      )}<br>
      <strong>Outras condições:</strong> ${formatField(
        formElements.otherConditions
      )}<br>
      <strong>Checklist personalizado:</strong> ${
        formElements.customChecklist.value
      }<br>
    </div>
  `;

    summaryBox.innerHTML = resumoHTML;
  }

  function clearField(field) {
    if (field.tagName === "TEXTAREA" || field.tagName === "INPUT") {
      field.value = "";
    }
  }

  function clearChecklistAndCriterios() {
    formElements.customChecklist.value = "";
    formElements.criteriosTable.innerHTML = "";
  }

  function showLanguageSuggestions(query) {
    const matches = languages
      .filter(
        (lang) =>
          lang.name.toLowerCase().includes(query) ||
          lang.code.toLowerCase().startsWith(query)
      )
      .slice(0, 10);

    suggestionsBox.innerHTML = "";

    if (matches.length === 0) {
      suggestionsBox.style.display = "none";
      idiomaInput.setAttribute("aria-expanded", "false");
      return;
    }

    matches.forEach((lang, index) => {
      const div = document.createElement("div");
      div.classList.add("suggestion-item");
      div.setAttribute("role", "option");
      div.id = `idioma-option-${index}`;
      div.textContent = `${lang.name} (${lang.code})`;
      div.dataset.code = lang.code;
      div.dataset.name = lang.name;
      div.tabIndex = 0;

      div.addEventListener("click", () => {
        idiomaInput.value = lang.name;
        formElements.idiomaHidden.value = lang.code;
        suggestionsBox.innerHTML = "";
        suggestionsBox.style.display = "none";
        idiomaInput.setAttribute("aria-expanded", "false");
      });

      suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "block";
    idiomaInput.setAttribute("aria-expanded", "true");
  }

  idiomaInput.addEventListener("input", () => {
    const query = idiomaInput.value.toLowerCase();
    if (query.length < 1) {
      suggestionsBox.style.display = "none";
      return;
    }
    showLanguageSuggestions(query);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-group")) {
      suggestionsBox.innerHTML = "";
      suggestionsBox.style.display = "none";
    }
  });

  // ---------- Modal de introdução ----------
  const introModal = document.getElementById("intro-modal");
  const closeIntroBtn = document.getElementById("close-intro");
  const focusReturn = document.getElementById("intro-focus-return");

  if (!introModal || !closeIntroBtn || !focusReturn) {
    // se não existir, sai (evita erros)
    console.warn("intro modal elements missing");
  } else {
    let lastFocusedElementIntro = null;
    let releaseIntroFocus = null; // função para remover o trap de foco

    // Função robusta de trap de foco que devolve um cleanup.
    // Se você já tem uma função trapFocus(...) global, tentamos reutilizá-la
    // e usar seu retorno — caso não exista retorno, usamos fallback simples.
    function trapFocusReturn(modal) {
      // tenta usar trapFocus existente (se retornar cleanup)
      if (typeof trapFocus === "function") {
        try {
          const maybeCleanup = trapFocus(modal);
          if (typeof maybeCleanup === "function") return maybeCleanup;
        } catch (e) {
          // se trapFocus lançar ou não retornar cleanup, prosseguimos com fallback
        }
      }

      // fallback: implementação simples de trancamento de tab
      const focusableSelector =
        'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
      const nodes = Array.from(modal.querySelectorAll(focusableSelector));
      if (!nodes.length) return null;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      function onKey(e) {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
        if (e.key === "Escape") {
          closeIntroModal();
        }
      }

      modal.addEventListener("keydown", onKey);
      return () => modal.removeEventListener("keydown", onKey);
    }

    // Abre o modal
    function openIntroModal() {
      lastFocusedElementIntro = document.activeElement; // guarda quem estava focado
      // mostra visualmente (CSS usa aria-hidden para exibir, mas mantemos display também)
      introModal.style.display = "flex";
      introModal.setAttribute("aria-hidden", "false");

      // impede scrolling no body enquanto modal aberto (opcional)
      document.body.style.overflow = "hidden";

      // aplica trap de foco e guarda função de release
      releaseIntroFocus = trapFocusReturn(introModal);

      // foca o título (tem tabindex="-1")
      const modalTitle =
        introModal.querySelector("#intro-title") ||
        introModal.querySelector("h2");
      modalTitle?.focus();
    }

    // Fecha o modal (com cuidado: remove trap, move foco pra fora, só então set aria-hidden)
    function closeIntroModal() {
      // 1) remove trap de foco imediatamente (para liberar o foco)
      if (typeof releaseIntroFocus === "function") {
        try {
          releaseIntroFocus();
        } catch (e) {
          /* nada */
        }
        releaseIntroFocus = null;
      }

      // 2) determina alvo para devolver foco (fallback: elemento dedicado ou document.body)
      const returnTarget =
        lastFocusedElementIntro || focusReturn || document.body;
      const addedTabindex =
        !returnTarget.hasAttribute || !returnTarget.hasAttribute("tabindex");

      // 3) garante que o returnTarget seja focável e foca nele
      try {
        if (
          !returnTarget.hasAttribute ||
          !returnTarget.hasAttribute("tabindex")
        ) {
          returnTarget.setAttribute("tabindex", "-1");
        }
        returnTarget.focus({ preventScroll: true });
      } catch (e) {
        // foco pode falhar; seguimos adiante
      }

      // 4) Pequeno atraso para garantir que o navegador atualize foco antes de setar aria-hidden
      setTimeout(() => {
        // esconde visualmente e para leitores de tela
        introModal.setAttribute("aria-hidden", "true");
        introModal.style.display = "none";

        // restaura overflow do body
        document.body.style.overflow = "";

        // marca persistência
        localStorage.setItem("introClosed", "true");

        // limpa tabindex adicionado se era só temporário (não remova do fallback `focusReturn`)
        if (returnTarget !== focusReturn && returnTarget !== document.body) {
          // apenas remove se adicionamos temporariamente
          try {
            if (
              returnTarget.getAttribute &&
              returnTarget.getAttribute("tabindex") === "-1" &&
              returnTarget !== lastFocusedElementIntro
            ) {
              returnTarget.removeAttribute("tabindex");
            }
          } catch (e) {}
        }
      }, 20); // 20ms é suficiente para dar tempo ao navegador de atualizar o foco
    }

    // abre automaticamente se nunca foi fechado
    window.addEventListener("DOMContentLoaded", () => {
      const introClosed = localStorage.getItem("introClosed");
      if (!introClosed) {
        openIntroModal();
      }
    });

    // eventos do botão fechar
    closeIntroBtn?.addEventListener("click", closeIntroModal);

    // ESC global (caso não esteja tratado pelo trap)
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        introModal.getAttribute("aria-hidden") === "false"
      ) {
        closeIntroModal();
      }
    });

    // Botão para reabrir o modal de introdução
    const reopenIntroBtn = document.getElementById("reopen-intro");
    if (reopenIntroBtn) {
      reopenIntroBtn.addEventListener("click", () => {
        // Remove flag do localStorage para que o modal não fique bloqueado
        localStorage.removeItem("introClosed");
        openIntroModal();
      });
    }
  }

  // Gerar Protocolo
  function generateProtocol() {
    const criterios = [];
    formElements.criteriosTable.querySelectorAll("tr").forEach((row) => {
      const codigo = row.cells[0].textContent;
      const peso = row.cells[1].textContent;
      const descricao = row.cells[2].textContent;
      criterios.push(`${codigo}: ${descricao} # peso = ${peso}`);
    });

    const scopeLimits = formElements.scopeLimits.value
      .split("\n")
      .filter((line) => line.trim() !== "");
    const toolsRequired = formElements.toolsRequired.value
      .split("\n")
      .filter((line) => line.trim() !== "");
    const otherConditions = formElements.otherConditions.value
      .split("\n")
      .filter((line) => line.trim() !== "");
    const customChecklist = formElements.customChecklist.value
      .split("\n")
      .filter((line) => line.trim() !== "");

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
- M = MUST
- S = SHOULD
- A = AVOID
- D = DATA (instruções de como os dados serão utilizados)

M: A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8. # peso = 1.0  
M: A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas. # peso = 1.0
${criterios.map((c) => `${c}`).join("\n")}

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
${scopeLimits.map((sl) => `  - ${sl}`).join("\n")}
tools_required:
${toolsRequired.map((tr) => `  - ${tr}`).join("\n")}
other_conditions:
${otherConditions.map((oc) => `  - ${oc}`).join("\n")}

---
## 5) Análise Prévia (não é a entrega) — ETAPA OBRIGATÓRIA
IA — faça:  
- Com base nos itens 1–4, identifique pontos críticos antes de produzir qualquer conteúdo.  
- Apresente sua análise separando claramente os seguintes blocos:

  - **Lacunas** → o que está faltando e pode impedir a entrega correta  
  - **Assunções** → decisões que você (IA) vai tomar por conta própria, se não houver resposta  
  - **Riscos** → pontos que podem gerar erro, ambiguidade ou violar alguma regra

- Use formato escaneável e organizado — como listas com títulos — para facilitar a leitura humana.  

Se houver lacuna crítica que impeça um MUST:  
- Faça perguntas objetivas, a quantidade de perguntas foi definida em "clarification_policy: max_questions:" e pare.  
- Se não houver resposta, declare as assunções necessárias e siga com a tarefa.

---
## 6) Plano de Execução (antes de escrever) — ETAPA OBRIGATÓRIA
IA — faça:  
- Apresente um plano estruturado com 1 linha por passo, em formato de tabela com 3 colunas:

  | passo | acao | meta |  
1 | Introdução | contextualizar público | ... |
2 | ... | ... | ... |

- Explique como atenderá MUSTs, SHOULDs e evitará AVOIDs.  
- Estime o tamanho final.

Finalize com a marca: 
<<READY_EXEC>>

---
## 7) Auto-checagem (antes de enviar) — ETAPA OBRIGATÓRIA
IA — faça (marque a lista em Markdown e explicar brevemente e com verdade cada item ticado ou não):
- [ ] Etapas 5 a 6 concluídas integralmente antes da entrega
- [ ] Cumpriu todos os MUST
- [ ] SHOULD atendidos quando possível
- [ ] Nenhum AVOID violado
- [ ] Tamanho e formato conforme Tarefa
- [ ] Uso exclusivo dos Dados
- [ ] Incertezas qualificadas
${customChecklist.map((cc) => `- [ ] ${cc}`).join("\n")}
- [ ] Etapa 7 concluída sem pular itens

---
## 8) Regra de Parada — ETAPA OBRIGATÓRIA
IA — faça: 
- Apresente sua análise separando claramente os seguintes blocos:

  - **Bloqueado** → true (se bloqueado) ou false (nao e necessario realizar essa etapa)  
  - **Motivo** →  Explicacao objetiva do motivo do bloqueio
  - **Proposta** → solicitação de dados adicionais, perguntas ou sugestão de versão parcial segura

- Use formato escaneável e organizado — como listas com títulos — para facilitar a leitura humana.  
Não gere uma entrega especulativa

---
## 9) Entrega (somente após <<READY_EXEC>>) — ETAPA OBRIGATÓRIA
IA — faça:  
### Respeitar o esquema indicado anteriormente.

- Produza a saída conforme:  
  - O formato definido na Tarefa  
  - Os dados delimitados em <DATA>  
  - Os critérios e restrições definidos antes

<!-- FIM DO PROMPT -->`;

    formElements.preview.textContent = protocol;
  }

  //   Copiar Prompt
  document.getElementById("copy-prompt").addEventListener("click", () => {
    const text = formElements.preview.textContent;
    navigator.clipboard.writeText(text).then(() => {
      const feedback = document.getElementById("copy-feedback");
      feedback.style.display = "inline";
      setTimeout(() => (feedback.style.display = "none"), 2000);
    });
  });

  // Validação de Códigos e pesos
  const codigoInput = document.getElementById("crit-codigo");
  const addButton = document.getElementById("add-criterio");

  // Função para validar o código
  function validateCode(codigo) {
    const codigosValidos = ["M", "S", "A", "D"];
    return codigosValidos.includes(codigo.toUpperCase());
  }

  // Validação em tempo real
  codigoInput.addEventListener("input", function () {
    const valor = this.value.toUpperCase();

    if (valor && !validateCode(valor)) {
      this.style.borderColor = "red";
      addButton.disabled = true;
    } else {
      this.style.borderColor = "";
      addButton.disabled = false;
    }
  });

  // Validação ao sair do campo
  codigoInput.addEventListener("blur", function () {
    if (this.value && !validateCode(this.value)) {
      this.setCustomValidity("Digite apenas M, S, A ou D");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });

  // Tooltip de ajuda
  codigoInput.title =
    "Digite apenas: M (Must), S (Should), A (Avoid) ou D (Data)";

  document
    .getElementById("add-criterio")
    .addEventListener("click", function () {
      const codigo = document.getElementById("crit-codigo").value;
      const peso = document.getElementById("crit-peso").value;
      const descricao = document.getElementById("crit-desc").value;

      // Validação final antes de adicionar
      if (codigo && peso && descricao && validateCode(codigo)) {
        const newRow = formElements.criteriosTable.insertRow();
        newRow.innerHTML = `
      <td>${codigo.toUpperCase()}</td>
      <td>${peso}</td>
      <td>${descricao}</td>
      <td><button class="rem-crit">Remover</button></td>
    `;
        document.getElementById("crit-codigo").value = "";
        document.getElementById("crit-peso").value = "1.0";
        document.getElementById("crit-desc").value = "";
      }
    });

  formElements.criteriosTable.addEventListener("click", function (e) {
    if (e.target.classList.contains("rem-crit")) {
      e.target.closest("tr").remove();
    }
  });

  document.querySelectorAll(".reset").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelector('input[name="modo"][value="FAST"]').checked = true;
      idiomaInput.value = "";
      formElements.idiomaHidden.value = "pt";
      formElements.publico.value = "tecnico";
      formElements.overflow.value = "resumir_dados_nao_criticos";
      formElements.contexto.value = "primeira_vez";
      clearField(formElements.objetivo);
      formElements.formato.value = "Markdown";
      clearField(formElements.tamanho);
      clearField(formElements.dados);
      formElements.externalSources.value = "permitido";
      formElements.maxQuestions.value = "3";
      formElements.ifNoResponse.value = "assume";
      clearField(formElements.scopeLimits);
      clearField(formElements.toolsRequired);
      clearField(formElements.otherConditions);
      clearField(formElements.scopeLimits);
      clearField(formElements.toolsRequired);
      clearField(formElements.otherConditions);
      clearChecklistAndCriterios();
      formElements.preview.textContent = "";
    });
  });

  // Modal de confirmação
  const modal = document.getElementById("confirmation-modal");
  const confirmBtn = document.getElementById("confirm-generate");
  const cancelBtn = document.getElementById("cancel-modal");
  const summaryBox = document.getElementById("modal-summary");

  // Exibir modal com resumo
  document.querySelectorAll(".generate").forEach((button) => {
    button.addEventListener("click", () => {
      buildModalSummary();
      modal.style.display = "flex";
    });
  });

  // Confirmar e gerar
  confirmBtn.addEventListener("click", () => {
    generateProtocol();
    modal.style.display = "none";
  });

  // Cancelar
  cancelBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // Tooltips customizados para ícones de informação
  document.querySelectorAll(".info").forEach((infoIcon) => {
    const tooltipText = infoIcon.getAttribute("title");
    if (!tooltipText) return;

    infoIcon.removeAttribute("title");

    const tooltip = document.createElement("div");
    tooltip.className = "tooltip-box";
    tooltip.textContent = tooltipText;
    document.body.appendChild(tooltip);

    function positionTooltip() {
      const rect = infoIcon.getBoundingClientRect();
      const spacing = 8;
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      // Centraliza abaixo do ícone
      let top = rect.bottom + scrollY + spacing;
      let left = rect.left + scrollX + rect.width / 2 - tooltip.offsetWidth / 2;

      // Limites horizontais (mantém 8px das bordas)
      const minLeft = scrollX + spacing;
      const maxLeft =
        scrollX + window.innerWidth - tooltip.offsetWidth - spacing;
      left = Math.max(minLeft, Math.min(left, maxLeft));

      // Se estourar embaixo, posiciona acima
      const bottom = top + tooltip.offsetHeight;
      const viewportBottom = scrollY + window.innerHeight - spacing;
      if (bottom > viewportBottom) {
        top = rect.top + scrollY - tooltip.offsetHeight - spacing;
      }

      // Nunca acima do topo visível
      const minTop = scrollY + spacing;
      if (top < minTop) top = minTop;

      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    function toggleTooltip(e) {
      e.stopPropagation();
      const isVisible = tooltip.classList.contains("visible");

      // Fecha outros abertos
      document
        .querySelectorAll(".tooltip-box.visible")
        .forEach((t) => t.classList.remove("visible"));

      if (!isVisible) {
        // 1) Mostra invisível para medir corretamente
        tooltip.classList.add("visible");
        tooltip.style.visibility = "hidden";

        // Força reflow para garantir medidas (opcional, mas ajuda)
        // eslint-disable-next-line no-unused-expressions
        tooltip.offsetWidth;

        // 2) Agora posiciona com width/height reais
        positionTooltip();

        // 3) Exibe
        tooltip.style.visibility = "";
      }
    }

    // agora basta 1 evento: click (funciona no desktop e mobile)
    infoIcon.addEventListener("click", toggleTooltip);

    // fecha clicando fora
    document.addEventListener("click", (e) => {
      if (!infoIcon.contains(e.target) && !tooltip.contains(e.target)) {
        tooltip.classList.remove("visible");
      }
    });

    // Adiciona evento de scroll para fechar todos os tooltips
    window.addEventListener("scroll", () => {
      document.querySelectorAll(".tooltip-box.visible").forEach((t) => {
        t.classList.remove("visible");
      });
    });

    // reposiciona em resize ou scroll
    window.addEventListener("resize", () => {
      if (tooltip.classList.contains("visible")) positionTooltip();
    });
    window.addEventListener("scroll", () => {
      if (tooltip.classList.contains("visible")) positionTooltip();
    });
  });

  /* ===================================================
   Ajustes de Acessibilidade
   =================================================== */

  // ---------- Modal acessível ----------
  const modalContent = modal?.querySelector(".modal-content");
  const openGenerateBtn = document.querySelector(".generate");
  let lastFocusedElement = null;

  function openModal() {
    lastFocusedElement = document.activeElement;
    modal.style.display = "block";
    modal.setAttribute("aria-hidden", "false");

    // foco no título do modal
    const modalTitle = modal.querySelector("h2");
    modalTitle?.focus();

    // prender foco dentro do modal
    trapFocus(modal);
  }

  function closeModal() {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  function trapFocus(element) {
    const focusableEls = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstEl = focusableEls[0];
    const lastEl = focusableEls[focusableEls.length - 1];

    element.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstEl) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }
    });
  }

  // evento global para fechar modal com ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.style.display === "block") {
      closeModal();
    }
  });

  // eventos do modal
  openGenerateBtn?.addEventListener("click", openModal);
  cancelBtn?.addEventListener("click", closeModal);
  confirmBtn?.addEventListener("click", () => {
    closeModal();
    // aqui a geração original do prompt continua funcionando normalmente
  });

  // ---------- Feedback de cópia ----------
  const copyBtn = document.getElementById("copy-prompt");
  const copyFeedback = document.getElementById("copy-feedback");
  const protocolPreview = document.getElementById("protocol-preview");

  // inicializa o botão como desabilitado
  if (copyBtn) copyBtn.disabled = true;

  // observar mudanças no conteúdo do preview
  const observer = new MutationObserver(() => {
    const content = protocolPreview.innerText.trim();
    copyBtn.disabled = content.length === 0;
  });

  if (protocolPreview) {
    observer.observe(protocolPreview, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  copyBtn?.addEventListener("click", () => {
    const text = protocolPreview.innerText.trim();
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
      copyFeedback.classList.add("active");
      copyFeedback.textContent = "Prompt copiado com sucesso!";
      setTimeout(() => {
        copyFeedback.classList.remove("active");
        copyFeedback.textContent = "";
      }, 2000);
    });
  });

  // ---------- Botões de info acessíveis ----------
  document.querySelectorAll("button.info").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });
});

/*  
Este projeto é licenciado sob:
- Documentação: CC BY-NC-SA 4.0
- Implementações em software: AGPL-3.0  
*/
