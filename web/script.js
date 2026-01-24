/*
OpenPUP - Protocolo Universal de Prompt
Licença: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
Autor: Jeanco Volfe
Repositório: https://github.com/engsofjvolfe/OpenPUP.git
*/

// =============================================
// CONFIGURAÇÕES GLOBAIS
// =============================================
const CONFIG = {
  HISTORY_KEY: "openpup_prompt_history",
  MAX_HISTORY: 5,
  COMPLETENESS_THRESHOLDS: { HIGH: 70, MEDIUM: 40 },
  FEEDBACK_TIMEOUT: 2000,
  MODAL_CLOSE_DELAY: 20,
  SCROLL_OFFSET: 20,
  VALID_CODES: new Set(["M", "S", "A", "D"]),
};

// =============================================
// INICIALIZAÇÃO
// =============================================
document.addEventListener("DOMContentLoaded", function () {
  // Estado Global
  const state = {
    languages: [],
    isHeaderProgressVisible: false,
  };

  // Cache de Elementos DOM
  const elements = {
    idioma: {
      input: document.getElementById("idioma_input"),
      suggestions: document.getElementById("idioma-suggestions"),
    },
    modal: {
      summary: document.getElementById("modal-summary"),
      intro: document.getElementById("intro-modal"),
      confirm: document.getElementById("confirmation-modal"),
      validation: document.getElementById("validation-modal"),
    },
    progress: {
      original: document.getElementById("completeness-indicator-original"),
      header: {
        wrapper: document.getElementById("header-progress-wrapper"),
        fill: document.getElementById("header-progress-fill"),
        percent: document.getElementById("header-progress-percent"),
      },
      main: {
        bar: document.getElementById("completeness-bar"),
        percent: document.getElementById("completeness-percentage"),
        hint: document.getElementById("completeness-hint"),
      },
    },
    copy: {
      btn: document.getElementById("copy-prompt"),
      feedback: document.getElementById("copy-feedback"),
    },
    history: {
      fab: document.getElementById("history-fab"),
      sidebar: document.getElementById("history-sidebar"),
      overlay: document.getElementById("history-overlay"),
      list: document.getElementById("history-list"),
      clearBtn: document.getElementById("clear-history"),
      count: document.getElementById("history-count"),
      closeBtn: document.getElementById("close-history-sidebar"),
    },
    criterios: {
      codigo: document.getElementById("crit-codigo"),
      peso: document.getElementById("crit-peso"),
      desc: document.getElementById("crit-desc"),
      addBtn: document.getElementById("add-criterio"),
    },
    header: document.querySelector("header"),
  };

  // Elementos do Formulário
  const form = {
    modo: () => document.querySelector('input[name="modo"]:checked'),
    idiomaHidden: document.querySelector('input[name="idioma"]'),
    publico: document.querySelector('select[name="publico"]'),
    overflow: document.querySelector('select[name="overflow"]'),
    contexto: document.querySelector('select[name="contexto"]'),
    objetivo_o_que: document.querySelector('textarea[name="objetivo_o_que"]'),
    objetivo_por_que: document.querySelector('textarea[name="objetivo_por_que"]'),
    objetivo_criterio: document.querySelector('textarea[name="objetivo_criterio"]'),
    formato: document.querySelector('[name="formato"]'),
    tamanho: document.querySelector('input[name="tamanho"]'),
    dados: document.querySelector('textarea[name="dados"]'),
    contexto_implicito: document.querySelector('textarea[name="contexto_implicito"]'),
    externalSources: document.querySelector('select[name="external_sources"]'),
    maxQuestions: document.querySelector('input[name="max_questions"]'),
    ifNoResponse: document.querySelector('select[name="if_no_response"]'),
    scopeLimits: document.querySelector('textarea[name="scope_limits"]'),
    toolsRequired: document.querySelector('textarea[name="tools_required"]'),
    otherConditions: document.querySelector('textarea[name="other_conditions"]'),
    customChecklist: document.querySelector('textarea[name="custom_checklist"]'),
    preview: document.getElementById("protocol-preview"),
    criteriosTable: document.querySelector("#criterios-table tbody"),
  };

  // =============================================
  // UTILITÁRIOS GENÉRICOS
  // =============================================
  const utils = {
    formatField: (field) => (field?.value ? field.value : "<em>Não definido</em>"),

    clearField: (field) => {
      if (field?.tagName === "TEXTAREA" || field?.tagName === "INPUT") {
        field.value = "";
      }
    },

    splitLines: (text) => text.split("\n").filter((line) => line.trim()),

    validateCode: (codigo) => CONFIG.VALID_CODES.has(codigo.toUpperCase()),

    setElementState: (element, percentage) => {
      if (!element) return;
      element.style.width = `${percentage}%`;
      element.classList.toggle("complete", percentage === 100);
    },

    setModalState: (modal, isOpen) => {
      if (!modal) return;
      modal.classList.toggle("hidden", !isOpen);
      modal.setAttribute("aria-hidden", String(!isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    },

    setAriaHidden: (element, hidden) => {
      if (element) element.setAttribute("aria-hidden", String(hidden));
    },

    updateTextContent: (element, text) => {
      if (element) element.textContent = text;
    },
  };

  // =============================================
  // ACESSIBILIDADE
  // =============================================
  const accessibility = {
    trapFocus: (modal) => {
      const selector = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
      const nodes = Array.from(modal.querySelectorAll(selector));
      if (!nodes.length) return null;

      const [first, last] = [nodes[0], nodes[nodes.length - 1]];

      const onKey = (e) => {
        if (e.key === "Tab") {
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };

      modal.addEventListener("keydown", onKey);
      return () => modal.removeEventListener("keydown", onKey);
    },

    enableListNavigation: (container, itemSelector, onSelect, inputElement = null) => {
      const handler = (e) => {
        const items = Array.from(container.querySelectorAll(itemSelector));
        const currentIndex = items.indexOf(document.activeElement);

        const actions = {
          ArrowDown: () => {
            e.preventDefault();
            const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : (currentIndex === -1 && items.length > 0 ? 0 : currentIndex);
            items[nextIndex]?.focus();
          },
          ArrowUp: () => {
            e.preventDefault();
            if (currentIndex > 0) {
              items[currentIndex - 1]?.focus();
            } else if (inputElement) {
              inputElement.focus();
            }
          },
          Enter: () => {
            if (currentIndex >= 0) {
              e.preventDefault();
              onSelect(items[currentIndex]);
            }
          },
          Escape: () => {
            e.preventDefault();
            container.innerHTML = "";
            container.style.display = "none";
            inputElement?.focus();
          },
        };

        actions[e.key]?.();
      };

      container.addEventListener("keydown", handler);
      inputElement?.addEventListener("keydown", handler);

      return () => {
        container.removeEventListener("keydown", handler);
        inputElement?.removeEventListener("keydown", handler);
      };
    },
  };

  // =============================================
  // TOOLTIPS
  // =============================================
  const tooltips = {
    create: (infoIcon) => {
      const tooltipText = infoIcon.getAttribute("title");
      if (!tooltipText) return;

      infoIcon.removeAttribute("title");
      const tooltip = document.createElement("div");
      tooltip.className = "tooltip-box";
      tooltip.textContent = tooltipText;
      document.body.appendChild(tooltip);

      const position = () => {
        const rect = infoIcon.getBoundingClientRect();
        const spacing = 8;
        const scrollY = window.scrollY || document.documentElement.scrollTop;
        const scrollX = window.scrollX || document.documentElement.scrollLeft;

        let top = rect.bottom + scrollY + spacing;
        let left = rect.left + scrollX + rect.width / 2 - tooltip.offsetWidth / 2;

        left = Math.max(scrollX + spacing, Math.min(left, scrollX + window.innerWidth - tooltip.offsetWidth - spacing));

        if (top + tooltip.offsetHeight > scrollY + window.innerHeight - spacing) {
          top = rect.top + scrollY - tooltip.offsetHeight - spacing;
        }

        top = Math.max(scrollY + spacing, top);

        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
      };

      const toggle = (e) => {
        e.stopPropagation();
        const isVisible = tooltip.classList.contains("visible");
        document.querySelectorAll(".tooltip-box.visible").forEach((t) => t.classList.remove("visible"));

        if (!isVisible) {
          tooltip.classList.add("visible");
          tooltip.style.visibility = "hidden";
          tooltip.offsetWidth;
          position();
          tooltip.style.visibility = "";
        }
      };

      infoIcon.addEventListener("click", toggle);
      document.addEventListener("click", (e) => {
        if (!infoIcon.contains(e.target) && !tooltip.contains(e.target)) {
          tooltip.classList.remove("visible");
        }
      });

      const hideAll = () => document.querySelectorAll(".tooltip-box.visible").forEach((t) => t.classList.remove("visible"));

      window.addEventListener("scroll", hideAll, { passive: true });
      window.addEventListener("resize", () => {
        if (tooltip.classList.contains("visible")) position();
      });
    },
  };

  // =============================================
  // MODAIS
  // =============================================
  const modals = {
    addCloseListeners: (modalElement, closeCallback) => {
      const keyHandler = (e) => {
        if (e.key === "Escape" && modalElement.getAttribute("aria-hidden") === "false") {
          closeCallback();
        }
      };

      const clickHandler = (e) => {
        if (e.target === modalElement) {
          closeCallback();
        }
      };

      document.addEventListener("keydown", keyHandler);
      modalElement.addEventListener("click", clickHandler);
    },

    setup: (modalElement, openBtnSelector, closeBtnSelector, onOpenCallback, onCloseCallback) => {
      let lastFocusedElement = null;

      const openModal = () => {
        lastFocusedElement = document.activeElement;
        utils.setModalState(modalElement, true);
        accessibility.trapFocus(modalElement);
        (modalElement.querySelector("h2") || modalElement.querySelector(".modal-title"))?.focus();
        onOpenCallback?.();
      };

      const closeModal = () => {
        const returnTarget = lastFocusedElement || document.body;
        try {
          if (!returnTarget.hasAttribute("tabindex")) {
            returnTarget.setAttribute("tabindex", "-1");
          }
          returnTarget.focus({ preventScroll: true });
        } catch (e) {
          // Ignora erros de foco
        }

        setTimeout(() => {
          utils.setModalState(modalElement, false);
          onCloseCallback?.();
        }, CONFIG.MODAL_CLOSE_DELAY);
      };

      openBtnSelector && document.querySelectorAll(openBtnSelector).forEach((btn) => {
        btn.addEventListener("click", openModal);
      });

      closeBtnSelector && document.querySelectorAll(closeBtnSelector).forEach((btn) => {
        btn.addEventListener("click", closeModal);
      });

      modals.addCloseListeners(modalElement, closeModal);

      return { openModal, closeModal };
    },
  };

  // =============================================
  // VALIDAÇÃO E COMPLETUDE
  // =============================================
  const validation = {
    fields: [
      { element: form.objetivo_o_que, weight: 3, essential: true },
      { element: form.objetivo_por_que, weight: 2, essential: false },
      { element: form.objetivo_criterio, weight: 2, essential: false },
      { element: form.dados, weight: 3, essential: true },
      { element: form.contexto_implicito, weight: 2, essential: false },
    ],

    calculateCompleteness: () => {
      const countCriterios = form.criteriosTable.querySelectorAll("tr").length;
      const criteriosWeight = countCriterios > 0 ? 2 : 0;
      const totalWeight = validation.fields.reduce((sum, f) => sum + f.weight, 0) + criteriosWeight;

      let filledWeight = validation.fields.reduce((sum, field) => {
        return sum + (field.element?.value?.trim() ? field.weight : 0);
      }, 0);

      filledWeight += criteriosWeight;
      return Math.round((filledWeight / totalWeight) * 100);
    },

    getHintText: (percentage) => {
      if (percentage === 100) return "Formulário completo! Pronto para gerar o protocolo.";
      if (percentage >= CONFIG.COMPLETENESS_THRESHOLDS.HIGH) return "Quase lá! Preencha os campos restantes para melhorar o protocolo.";
      if (percentage >= CONFIG.COMPLETENESS_THRESHOLDS.MEDIUM) return "Bom progresso. Continue preenchendo os campos importantes.";
      return "Preencha os campos essenciais para gerar o protocolo.";
    },

    updateIndicator: () => {
      const percentage = validation.calculateCompleteness();

      utils.setElementState(elements.progress.main.bar, percentage);
      utils.setElementState(elements.progress.header.fill, percentage);
      utils.updateTextContent(elements.progress.main.percent, `${percentage}%`);
      utils.updateTextContent(elements.progress.header.percent, `${percentage}%`);
      utils.updateTextContent(elements.progress.main.hint, validation.getHintText(percentage));
    },

    validateBeforeGenerate: () => {
      const errors = [];
      const warnings = [];

      if (!form.objetivo_o_que.value.trim()) {
        errors.push("Campo 'O que a IA deve fazer' está vazio");
      }
      if (!form.dados.value.trim()) {
        errors.push("Campo 'Dados' está vazio - a IA não terá contexto para trabalhar");
      }

      if (!form.objetivo_por_que.value.trim()) {
        warnings.push("Campo 'Por que você precisa disso' está vazio - isso ajuda a IA a entender o contexto");
      }
      if (!form.objetivo_criterio.value.trim()) {
        warnings.push("Campo 'Como você saberá que ficou bom' está vazio - a IA não saberá o que você considera sucesso");
      }
      if (!form.contexto_implicito.value.trim()) {
        warnings.push("Campo 'Contexto Implícito' está vazio - a IA pode fazer assunções incorretas sobre seu nível e contexto");
      }

      const countCriterios = form.criteriosTable.querySelectorAll("tr").length;
      if (countCriterios === 0) {
        warnings.push("Nenhum critério adicional foi adicionado - apenas os MUSTs padrão serão aplicados");
      }

      return { errors, warnings };
    },

    highlightInvalid: () => {
      document.querySelectorAll('.input-group input.invalid, .input-group textarea.invalid').forEach(el => {
        el.classList.remove('invalid');
      });

      const requiredFields = [
        { element: form.objetivo_o_que },
        { element: form.dados }
      ];

      const firstInvalid = requiredFields.find(field => !field.element.value.trim());

      requiredFields.forEach(field => {
        if (!field.element.value.trim()) {
          field.element.classList.add('invalid');
        }
      });

      if (firstInvalid) {
        const headerHeight = elements.header?.offsetHeight || 60;
        const elementPosition = firstInvalid.element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        setTimeout(() => firstInvalid.element.focus(), 500);
      }
    },

    showFeedback: (errors, warnings) => {
      return new Promise((resolve) => {
        if (errors.length === 0 && warnings.length === 0) {
          resolve(true);
          return;
        }

        const modal = elements.modal.validation;
        if (!modal) {
          if (errors.length > 0) {
            alert("Corrija os erros antes de gerar o protocolo.");
            resolve(false);
          } else {
            resolve(confirm("Há avisos. Deseja continuar?"));
          }
          return;
        }

        const title = document.getElementById("validation-title");
        const errorsContainer = document.getElementById("validation-errors");
        const warningsContainer = document.getElementById("validation-warnings");
        const cancelBtn = document.getElementById("validation-cancel");
        const continueBtn = document.getElementById("validation-continue");

        errorsContainer.innerHTML = "";
        warningsContainer.innerHTML = "";
        errorsContainer.className = "validation-section";
        warningsContainer.className = "validation-section";

        if (errors.length > 0) {
          title.textContent = "Campos Obrigatórios Faltando";
          errorsContainer.classList.add("errors");
          errorsContainer.innerHTML = `
            <h3>Erros (corrija antes de gerar)</h3>
            <ul class="validation-list">
              ${errors.map(err => `<li class="validation-item error">${err}</li>`).join("")}
            </ul>
          `;
          continueBtn.classList.add("hidden");
          validation.highlightInvalid();
        } else {
          title.textContent = "Campos Recomendados Faltando";
          continueBtn.classList.remove("hidden");
        }

        if (warnings.length > 0) {
          warningsContainer.classList.add("warnings");
          warningsContainer.innerHTML = `
            <h3>Avisos (recomendado preencher)</h3>
            <ul class="validation-list">
              ${warnings.map(warn => `<li class="validation-item warning">${warn}</li>`).join("")}
            </ul>
          `;
        }

        utils.setModalState(modal, true);

        const closeModal = (result) => {
          utils.setModalState(modal, false);
          resolve(result);
        };

        cancelBtn.replaceWith(cancelBtn.cloneNode(true));
        continueBtn.replaceWith(continueBtn.cloneNode(true));

        const newCancelBtn = document.getElementById("validation-cancel");
        const newContinueBtn = document.getElementById("validation-continue");

        newCancelBtn.addEventListener("click", () => closeModal(false));
        newContinueBtn.addEventListener("click", () => closeModal(true));

        modals.addCloseListeners(modal, () => closeModal(false));

        newCancelBtn.focus();
      });
    },
  };

  // =============================================
  // AUTOCOMPLETE DE IDIOMAS
  // =============================================
  const autocomplete = {
    show: (query) => {
      const matches = state.languages
        .filter((lang) => lang.name.toLowerCase().includes(query) || lang.code.toLowerCase().startsWith(query))
        .slice(0, 10);

      elements.idioma.suggestions.innerHTML = "";

      if (matches.length === 0) {
        elements.idioma.suggestions.style.display = "none";
        return;
      }

      elements.idioma.suggestions.style.display = "block";

      matches.forEach((lang, index) => {
        const div = document.createElement("div");
        div.setAttribute("role", "option");
        div.id = `idioma-option-${index}`;
        div.textContent = `${lang.name} (${lang.code})`;
        div.dataset.code = lang.code;
        div.dataset.name = lang.name;
        div.tabIndex = 0;
        div.addEventListener("click", () => {
          elements.idioma.input.value = lang.name;
          form.idiomaHidden.value = lang.code;
          elements.idioma.suggestions.innerHTML = "";
          elements.idioma.suggestions.style.display = "none";
          validation.updateIndicator();
        });
        elements.idioma.suggestions.appendChild(div);
      });
    },
  };

  // =============================================
  // HISTÓRICO
  // =============================================
  const history = {
    save: (protocol) => {
      try {
        let data = JSON.parse(localStorage.getItem(CONFIG.HISTORY_KEY) || "[]");

        // Extrair preview legível
        let preview = "";

        // Tentar extrair o objetivo
        const taskMatch = protocol.match(/O quê:\s*([^\n]+)/);
        if (taskMatch && taskMatch[1].trim() && taskMatch[1].trim() !== "Não especificado") {
          preview = taskMatch[1].trim().substring(0, 100);
        }

        // Se não houver objetivo, tentar dados
        if (!preview) {
          const dataMatch = protocol.match(/<DATA>\s*([^<]+)/);
          if (dataMatch && dataMatch[1].trim()) {
            const dadosPreview = dataMatch[1].trim().replace(/\n/g, " ").substring(0, 100);
            preview = `Dados: ${dadosPreview}`;
          }
        }

        // Fallback: mostrar modo e idioma
        if (!preview) {
          const modoMatch = protocol.match(/modo:\s*(\w+)/);
          const idiomaMatch = protocol.match(/idioma:\s*(\w+)/);
          preview = `Modo ${modoMatch?.[1] || "?"} | Idioma ${idiomaMatch?.[1] || "?"}`;
        }

        const newEntry = {
          id: Date.now(),
          date: new Date().toISOString(),
          content: protocol,
          preview
        };

        data.unshift(newEntry);

        if (data.length > CONFIG.MAX_HISTORY) {
          data = data.slice(0, CONFIG.MAX_HISTORY);
        }

        localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(data));
        history.render();
      } catch (e) {
        console.error("Erro ao salvar histórico:", e);
      }
    },

    load: () => {
      try {
        return JSON.parse(localStorage.getItem(CONFIG.HISTORY_KEY) || "[]");
      } catch (e) {
        console.error("Erro ao carregar histórico:", e);
        return [];
      }
    },

    delete: (id) => {
      try {
        let data = history.load().filter(item => item.id !== id);
        localStorage.setItem(CONFIG.HISTORY_KEY, JSON.stringify(data));
        history.render();
      } catch (e) {
        console.error("Erro ao deletar item do histórico:", e);
      }
    },

    clear: () => {
      if (confirm("Tem certeza que deseja limpar todo o histórico de prompts?")) {
        localStorage.removeItem(CONFIG.HISTORY_KEY);
        history.render();
      }
    },

    render: () => {
      const data = history.load();

      if (!elements.history.list) return;

      if (elements.history.count) {
        elements.history.count.textContent = data.length > 0 ? data.length : "";
      }

      if (data.length === 0) {
        elements.history.list.innerHTML = '<p class="history-empty">Nenhum prompt gerado ainda.</p>';
        elements.history.clearBtn?.classList.add("hidden");
        return;
      }

      elements.history.list.innerHTML = "";
      elements.history.clearBtn?.classList.remove("hidden");

      data.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "history-item";
        itemEl.dataset.expanded = "false";

        const date = new Date(item.date);
        const dateStr = date.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        });

        let taskTitle = "Prompt sem título";
        const taskMatch = item.content.match(/## 1\) TAREFA[\s\S]*?<TASK>([\s\S]*?)<\/TASK>/);
        if (taskMatch) {
          const firstLine = taskMatch[1].trim().split('\n')[0].trim();
          taskTitle = firstLine.substring(0, 60) || "Prompt sem título";
        }

        itemEl.innerHTML = `
          <div class="history-item-header">
            <div class="history-item-title-group">
              <div class="history-item-title">${taskTitle}</div>
              <span class="history-item-date">${dateStr}</span>
            </div>
            <div class="history-item-actions">
              <button class="history-item-expand" data-id="${item.id}" aria-label="Expandir prompt" title="Expandir/Recolher">▼</button>
              <button class="history-item-delete" data-id="${item.id}" aria-label="Deletar este prompt" title="Deletar">🗑️</button>
            </div>
          </div>
          <div class="history-item-preview">${item.preview}...</div>
          <div class="history-item-content" style="display: none;">
            <pre class="history-item-full">${item.content}</pre>
          </div>
          <div class="history-item-footer">
            <button class="history-item-load" data-id="${item.id}">Carregar este prompt</button>
          </div>
        `;

        const expandBtn = itemEl.querySelector(".history-item-expand");
        const contentDiv = itemEl.querySelector(".history-item-content");
        const previewDiv = itemEl.querySelector(".history-item-preview");

        expandBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          const isExpanded = itemEl.dataset.expanded === "true";
          itemEl.dataset.expanded = String(!isExpanded);
          contentDiv.style.display = isExpanded ? "none" : "block";
          previewDiv.style.display = isExpanded ? "block" : "none";
          expandBtn.textContent = isExpanded ? "▼" : "▲";
          expandBtn.setAttribute("aria-label", isExpanded ? "Expandir prompt" : "Recolher prompt");
        });

        itemEl.querySelector(".history-item-load").addEventListener("click", (e) => {
          e.stopPropagation();
          form.preview.textContent = item.content;
          clipboard.updateState();
          history.closeSidebar();
        });

        itemEl.querySelector(".history-item-delete").addEventListener("click", (e) => {
          e.stopPropagation();
          history.delete(item.id);
        });

        elements.history.list.appendChild(itemEl);
      });
    },

    openSidebar: () => {
      utils.setAriaHidden(elements.history.sidebar, false);
      utils.setAriaHidden(elements.history.overlay, false);
      document.body.style.overflow = "hidden";
    },

    closeSidebar: () => {
      utils.setAriaHidden(elements.history.sidebar, true);
      utils.setAriaHidden(elements.history.overlay, true);
      document.body.style.overflow = "";
    },
  };

  // =============================================
  // GERAÇÃO DE PROTOCOLO
  // =============================================
  const protocol = {
    buildSummary: () => {
      const countCriterios = form.criteriosTable.querySelectorAll("tr").length;
      const criteriosText = countCriterios === 1 ? "1 adicionado" : `${countCriterios} adicionados`;

      return `
        <div class="info-box">
          <strong>Modo:</strong> ${form.modo().value}<br>
          <strong>Idioma:</strong> ${form.idiomaHidden.value}<br>
          <strong>Público:</strong> ${form.publico.value}<br>
          <strong>Overflow:</strong> ${form.overflow.value}<br>
          <strong>Contexto:</strong> ${form.contexto.value}<br>
          <strong>O que fazer:</strong> ${utils.formatField(form.objetivo_o_que)}<br>
          <strong>Por quê:</strong> ${utils.formatField(form.objetivo_por_que)}<br>
          <strong>Critério de sucesso:</strong> ${utils.formatField(form.objetivo_criterio)}<br>
          <strong>Formato:</strong> ${utils.formatField(form.formato)}<br>
          <strong>Tamanho:</strong> ${utils.formatField(form.tamanho)}<br>
          <strong>Critérios:</strong> ${criteriosText}<br>
          <strong>Dados:</strong> ${form.dados.value ? "Preenchido" : "<em>Não definido</em>"}<br>
          <strong>Contexto implícito:</strong> ${utils.formatField(form.contexto_implicito)}<br>
          <strong>Fontes externas:</strong> ${form.externalSources.value}<br>
          <strong>Máx. de perguntas:</strong> ${form.maxQuestions.value}<br>
          <strong>Se não houver resposta:</strong> ${form.ifNoResponse.value}<br>
          <strong>Limites de escopo:</strong> ${utils.formatField(form.scopeLimits)}<br>
          <strong>Ferramentas necessárias:</strong> ${utils.formatField(form.toolsRequired)}<br>
          <strong>Outras condições:</strong> ${utils.formatField(form.otherConditions)}<br>
          <strong>Checklist personalizado:</strong> ${form.customChecklist.value}<br>
        </div>
      `;
    },

    generate: () => {
      const modo = form.modo().value;
      const criterios = Array.from(form.criteriosTable.querySelectorAll("tr")).map((row) => {
        const [codigo, peso, descricao] = [row.cells[0].textContent, row.cells[1].textContent, row.cells[2].textContent];
        return `${codigo}: ${descricao} # peso = ${peso}`;
      });

      const scopeLimits = utils.splitLines(form.scopeLimits.value);
      const toolsRequired = utils.splitLines(form.toolsRequired.value);
      const otherConditions = utils.splitLines(form.otherConditions.value);
      const customChecklist = utils.splitLines(form.customChecklist.value);

      const objetivoCompleto = `
O quê: ${form.objetivo_o_que.value || "Não especificado"}
Por quê: ${form.objetivo_por_que.value || "Não especificado"}
Critério de sucesso: ${form.objetivo_criterio.value || "Não especificado"}
`.trim();

      const templates = {
        FAST: `## 5) ANÁLISE — ETAPA OBRIGATÓRIA
IA — Apresente em formato de tabela:

| Categoria  | Itens Identificados |
|------------|---------------------|
| Lacunas    | [liste o que falta e pode impedir entrega] |
| Assunções  | [liste decisões que tomará por conta própria] |
| Riscos     | [liste pontos que podem gerar erro ou ambiguidade] |

**Se houver lacuna crítica que impeça um MUST:**
- Faça até ${form.maxQuestions.value} perguntas objetivas e pare
- Se não houver resposta, declare as assunções e prossiga

---
## 6) PLANO — ETAPA OBRIGATÓRIA
IA — Tabela estruturada (1 linha por passo):

| # | Ação | Entregável | Como atende M/S/A |
|---|------|------------|-------------------|
| 1 | [ação] | [meta] | [justificativa] |
| 2 | [ação] | [meta] | [justificativa] |

**Tamanho estimado:** [estimativa]
**Marca de conclusão:** <<READY_EXEC>>

---
## 7) CHECKLIST — ETAPA OBRIGATÓRIA
IA — Marque e explique brevemente cada item:

- [ ] Etapas 5-6 concluídas antes da entrega
- [ ] Todos os MUST cumpridos
- [ ] SHOULD atendidos quando possível
- [ ] Nenhum AVOID violado
- [ ] Tamanho e formato conforme Tarefa
- [ ] Uso exclusivo dos Dados fornecidos
- [ ] Incertezas qualificadas
${customChecklist.map((cc) => `- [ ] ${cc}`).join("\n")}

---
## 8) PARADA — ETAPA OBRIGATÓRIA
IA — Formato compacto:

**Bloqueado?** [true/false]
**Motivo:** [se bloqueado, explique; senão: "N/A"]
**Proposta:** [se bloqueado: perguntas/dados adicionais; senão: "Prosseguir"]

**IMPORTANTE:** Não gere entrega especulativa se bloqueado.

---
## 9) ENTREGA — ETAPA OBRIGATÓRIA
IA — Somente após <<READY_EXEC>>:
- Formato: conforme definido na Tarefa
- Fonte: exclusivamente <DATA>
- Conformidade: todos os critérios e restrições acima`,
        THOROUGH: `## 5) Análise Prévia (não é a entrega) — ETAPA OBRIGATÓRIA
IA — faça:
- Com base nos itens 1–4, identifique pontos críticos antes de produzir qualquer conteúdo.
- Apresente sua análise separando claramente os seguintes blocos:
  - **Lacunas** → o que está faltando e pode impedir a entrega correta
  - **Assunções** → decisões que você (IA) vai tomar por conta própria, se não houver resposta
  - **Riscos** → pontos que podem gerar erro, ambiguidade ou violar alguma regra
- Use formato escaneável e organizado — como listas com títulos — para facilitar a leitura humana.

Se houver lacuna crítica que impeça um MUST:
- Faça perguntas objetivas, a quantidade de perguntas foi definida em "clarification_policy: max_questions: ${form.maxQuestions.value}" e pare.
- Se não houver resposta, declare as assunções necessárias e siga com a tarefa.

---
## 6) Plano de Execução (antes de escrever) — ETAPA OBRIGATÓRIA
IA — faça:
- Apresente um plano estruturado com 1 linha por passo, em formato de tabela com 3 colunas:

| passo | acao | meta |
|-------|------|------|
| 1 | Introdução | contextualizar público |
| 2 | ... | ... |

- Explique como atenderá MUSTs, SHOULDs e evitará AVOIDs.
- Estime o tamanho final.

Finalize com a marca:
<<READY_EXEC>>

---
## 7) Auto-checagem (antes de enviar) — ETAPA OBRIGATÓRIA
IA — faça (marque a lista em Markdown e explique brevemente e com verdade cada item ticado ou não):

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
  - **Bloqueado** → true (se bloqueado) ou false (não é necessário realizar essa etapa)
  - **Motivo** → Explicação objetiva do motivo do bloqueio
  - **Proposta** → solicitação de dados adicionais, perguntas ou sugestão de versão parcial segura
- Use formato escaneável e organizado — como listas com títulos — para facilitar a leitura humana.

**IMPORTANTE:** Não gere uma entrega especulativa se bloqueado.

---
## 9) Entrega (somente após <<READY_EXEC>>) — ETAPA OBRIGATÓRIA
IA — faça:
### Respeitar o esquema indicado anteriormente.
- Produza a saída conforme:
  - O formato definido na Tarefa
  - Os dados delimitados em <DATA>
  - Os critérios e restrições definidos antes`,
      };

      const output = `<!-- OPENPUP v2 -->
## 0) META
modo: ${modo}
idioma: ${form.idiomaHidden.value}
publico: ${form.publico.value}
overflow: ${form.overflow.value}
contexto_conversa: ${form.contexto.value}

---
## 1) TAREFA
<TASK>
${objetivoCompleto}

Formato de saída: ${form.formato.value}
Tamanho-alvo: ${form.tamanho.value}
</TASK>

---
## 2) PRIORIDADES
**Legenda:** M=MUST | S=SHOULD | A=AVOID | D=DATA

M: A IA deve cumprir todas as etapas do protocolo, com execução obrigatória das seções 5 a 9. Falhas nessas etapas devem acionar bloqueio na etapa 8. # peso = 1.0
M: A IA deve interromper o fluxo se qualquer etapa anterior estiver incompleta, inválida ou não validada. Não é permitido pular etapas. # peso = 1.0
${criterios.join("\n")}

---
## 3) DADOS
<DATA>
${form.dados.value}
</DATA>

${form.contexto_implicito.value ? `---
## 3.5) CONTEXTO IMPLÍCITO
${form.contexto_implicito.value}
` : ''}---
## 4) RESTRIÇÕES
external_sources: ${form.externalSources.value}
clarification_policy: max_questions: ${form.maxQuestions.value}
if_no_response: ${form.ifNoResponse.value}

scope_limits:
${scopeLimits.length > 0 ? scopeLimits.map((sl) => `  - ${sl}`).join("\n") : "  - Não definido"}

tools_required:
${toolsRequired.length > 0 ? toolsRequired.map((tr) => `  - ${tr}`).join("\n") : "  - Não definido"}

other_conditions:
${otherConditions.length > 0 ? otherConditions.map((oc) => `  - ${oc}`).join("\n") : "  - Não definido"}

---
${templates[modo]}

<!-- /OPENPUP -->`;

      form.preview.textContent = output;
      history.save(output);
      document.dispatchEvent(new Event("protocolGenerated"));
    },
  };

  // =============================================
  // CLIPBOARD
  // =============================================
  const clipboard = {
    updateState: () => {
      const content = form.preview.textContent.trim();
      if (elements.copy.btn) elements.copy.btn.disabled = content.length === 0;
    },

    copy: async (text) => {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(text);
          return true;
        } catch (e) {
          console.warn("Clipboard API falhou:", e);
        }
      }

      try {
        const ta = document.createElement("textarea");
        ta.value = text;
        Object.assign(ta.style, { position: "fixed", left: "-9999px", top: "0" });
        ta.setAttribute("aria-hidden", "true");
        document.body.appendChild(ta);
        ta.select();
        ta.setSelectionRange(0, ta.value.length);
        const successful = document.execCommand("copy");
        document.body.removeChild(ta);
        return successful;
      } catch (e) {
        console.error("Fallback de cópia falhou:", e);
        return false;
      }
    },

    showFeedback: (message, isSuccess) => {
      if (!elements.copy.feedback) return;
      elements.copy.feedback.textContent = message;
      elements.copy.feedback.classList.add("active");
      elements.copy.feedback.setAttribute("aria-hidden", String(!isSuccess));
      setTimeout(() => {
        elements.copy.feedback.classList.remove("active");
        elements.copy.feedback.textContent = "";
        elements.copy.feedback.removeAttribute("aria-hidden");
      }, CONFIG.FEEDBACK_TIMEOUT);
    },
  };

  // =============================================
  // CRITÉRIOS
  // =============================================
  const criterios = {
    validate: () => {
      const valor = elements.criterios.codigo.value.toUpperCase();
      const isValid = !valor || utils.validateCode(valor);
      elements.criterios.codigo.style.borderColor = isValid ? "" : "red";
      elements.criterios.addBtn.disabled = !isValid;
    },

    add: () => {
      const codigo = elements.criterios.codigo.value;
      const peso = elements.criterios.peso.value;
      const descricao = elements.criterios.desc.value;

      if (codigo && peso && descricao && utils.validateCode(codigo)) {
        const newRow = form.criteriosTable.insertRow();
        newRow.innerHTML = `
          <td>${codigo.toUpperCase()}</td>
          <td>${peso}</td>
          <td>${descricao}</td>
          <td><button class="rem-crit">Remover</button></td>
        `;
        elements.criterios.codigo.value = "";
        elements.criterios.peso.value = "1.0";
        elements.criterios.desc.value = "";
      }
    },

    remove: (e) => {
      if (e.target.classList.contains("rem-crit")) {
        e.target.closest("tr").remove();
      }
    },
  };

  // =============================================
  // RESET
  // =============================================
  const resetForm = () => {
    document.querySelector('input[name="modo"][value="FAST"]').checked = true;
    elements.idioma.input.value = "";
    form.idiomaHidden.value = "pt";
    form.publico.value = "tecnico";
    form.overflow.value = "resumir_dados_nao_criticos";
    form.contexto.value = "primeira_vez";
    [form.objetivo_o_que, form.objetivo_por_que, form.objetivo_criterio, form.tamanho, form.dados, form.contexto_implicito, form.scopeLimits, form.toolsRequired, form.otherConditions].forEach(utils.clearField);
    form.formato.value = "Markdown";
    form.externalSources.value = "permitido";
    form.maxQuestions.value = "3";
    form.ifNoResponse.value = "assume";
    form.customChecklist.value = "";
    form.criteriosTable.innerHTML = "";
    form.preview.textContent = "";
  };

  // =============================================
  // EVENT LISTENERS
  // =============================================

  // Remover marcação inválida ao digitar
  [form.objetivo_o_que, form.dados].forEach(input => {
    input?.addEventListener('input', function() {
      if (this.classList.contains('invalid') && this.value.trim()) {
        this.classList.remove('invalid');
      }
    });
  });

  // Carregar idiomas
  fetch("data/languages.json")
    .then((response) => response.json())
    .then((data) => {
      state.languages = data;
      console.log("Idiomas carregados:", data.length);
    })
    .catch((err) => console.error("Erro ao carregar languages.json:", err));

  // Autocomplete de idiomas
  elements.idioma.input.addEventListener("input", () => {
    const query = elements.idioma.input.value.toLowerCase();
    if (query.length < 1) {
      elements.idioma.suggestions.style.display = "none";
      return;
    }
    autocomplete.show(query);
  });

  accessibility.enableListNavigation(
    elements.idioma.suggestions,
    '[role="option"]',
    (item) => item.click(),
    elements.idioma.input
  );

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".input-group")) {
      elements.idioma.suggestions.innerHTML = "";
      elements.idioma.suggestions.style.display = "none";
    }
  });

  // Modal de introdução
  if (elements.modal.intro) {
    const introController = modals.setup(
      elements.modal.intro,
      null,
      "#close-intro",
      null,
      () => localStorage.setItem("introClosed", "true")
    );

    window.addEventListener("DOMContentLoaded", () => {
      if (!localStorage.getItem("introClosed")) {
        introController.openModal();
      }
    });

    document.getElementById("reopen-intro")?.addEventListener("click", () => {
      localStorage.removeItem("introClosed");
      introController.openModal();
    });
  }

  // Header shrink
  window.addEventListener("scroll", () => {
    elements.header?.classList.toggle("shrink", window.scrollY > CONFIG.SCROLL_OFFSET);
  }, { passive: true });

  // Barra de progresso no header
  const handleHeaderProgress = () => {
    if (!elements.progress.original || !elements.progress.header.wrapper) return;

    const rect = elements.progress.original.getBoundingClientRect();
    const isHidden = rect.top < (elements.header?.offsetHeight || 0);

    if (isHidden !== state.isHeaderProgressVisible) {
      state.isHeaderProgressVisible = isHidden;
      elements.header?.classList.toggle('with-progress-bar', isHidden);
      elements.progress.header.wrapper.classList.toggle('visible', isHidden);
    }
  };

  window.addEventListener("scroll", handleHeaderProgress, { passive: true });
  window.addEventListener("resize", handleHeaderProgress);

  // Modal de confirmação
  if (elements.modal.confirm) {
    document.querySelectorAll(".generate").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();

        const { errors, warnings } = validation.validateBeforeGenerate();
        const canProceed = await validation.showFeedback(errors, warnings);

        if (canProceed) {
          utils.setModalState(elements.modal.confirm, true);
          accessibility.trapFocus(elements.modal.confirm);
          elements.modal.summary.innerHTML = protocol.buildSummary();
          (elements.modal.confirm.querySelector("h2") || elements.modal.confirm.querySelector(".modal-title"))?.focus();
        }
      });
    });

    const closeConfirm = () => utils.setModalState(elements.modal.confirm, false);

    document.querySelectorAll("#cancel-modal").forEach((btn) => {
      btn.addEventListener("click", closeConfirm);
    });

    modals.addCloseListeners(elements.modal.confirm, closeConfirm);

    document.getElementById("confirm-generate")?.addEventListener("click", () => {
      protocol.generate();
      closeConfirm();
    });
  }

  // Critérios
  elements.criterios.codigo.addEventListener("input", criterios.validate);
  elements.criterios.codigo.addEventListener("blur", function() {
    if (this.value && !utils.validateCode(this.value)) {
      this.setCustomValidity("Digite apenas M, S, A ou D");
      this.reportValidity();
    } else {
      this.setCustomValidity("");
    }
  });
  elements.criterios.codigo.title = "Digite apenas: M (Must), S (Should), A (Avoid) ou D (Data)";
  elements.criterios.addBtn.addEventListener("click", criterios.add);
  form.criteriosTable.addEventListener("click", criterios.remove);

  // Reset
  document.querySelectorAll(".reset").forEach((btn) => {
    btn.addEventListener("click", () => {
      resetForm();
      setTimeout(validation.updateIndicator, 100);
    });
  });

  // Watchers de completude
  [form.objetivo_o_que, form.objetivo_por_que, form.objetivo_criterio, form.dados, form.contexto_implicito, form.formato, form.tamanho].forEach(field => {
    if (field) {
      field.addEventListener("input", validation.updateIndicator);
      field.addEventListener("change", validation.updateIndicator);
    }
  });

  form.criteriosTable.addEventListener("DOMSubtreeModified", validation.updateIndicator);
  validation.updateIndicator();

  // Histórico
  elements.history.clearBtn?.addEventListener("click", history.clear);
  elements.history.fab?.addEventListener("click", history.openSidebar);
  elements.history.closeBtn?.addEventListener("click", history.closeSidebar);
  elements.history.overlay?.addEventListener("click", history.closeSidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && elements.history.sidebar?.getAttribute("aria-hidden") === "false") {
      history.closeSidebar();
    }
  });

  history.render();

  // Tooltips
  document.querySelectorAll(".info").forEach(tooltips.create);

  document.querySelectorAll("button.info").forEach((btn) => {
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
    });
  });

  // Clipboard
  if (elements.copy.btn) {
    elements.copy.btn.disabled = true;
    elements.copy.feedback?.setAttribute("role", "status");
    elements.copy.feedback?.setAttribute("aria-live", "polite");

    const observer = new MutationObserver(clipboard.updateState);
    if (form.preview) {
      observer.observe(form.preview, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    document.addEventListener("protocolGenerated", clipboard.updateState);

    elements.copy.btn.addEventListener("click", async () => {
      const text = form.preview.textContent;
      if (!text) return;

      const ok = await clipboard.copy(text);
      clipboard.showFeedback(
        ok ? "Prompt copiado com sucesso!" : "Erro ao copiar! Verifique console ou contexto (HTTPS/localhost).",
        ok
      );
    });
  }

  // Navegação global por teclado
  document.addEventListener("keydown", (e) => {
    const { target, key } = e;

    if (key === "Enter" && target.tagName === "BUTTON" && !target.disabled) {
      e.preventDefault();
      target.click();
    }

    if (key === "Enter" && target.getAttribute("role") === "button") {
      e.preventDefault();
      target.click();
    }

    if (key === " " && target.getAttribute("role") === "checkbox") {
      e.preventDefault();
      target.click();
    }
  });

  document.querySelectorAll('[role="button"]:not([tabindex])').forEach(el => {
    el.setAttribute("tabindex", "0");
  });

  document.querySelectorAll(".reopen-intro").forEach(el => {
    if (!el.hasAttribute("tabindex")) {
      el.setAttribute("tabindex", "0");
    }
  });

  const reopenIntro = document.getElementById("reopen-intro");
  if (reopenIntro) {
    reopenIntro.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        reopenIntro.click();
      }
    });
  }
});

/*
Este projeto é licenciado sob:
- Documentação: CC BY-NC-SA 4.0
- Implementações em software: AGPL-3.0
*/
