# TODO — OpenPUP v2

> **Roadmap de funcionalidades planejadas e melhorias futuras**
>
> Este documento registra tarefas pendentes, ideias e melhorias identificadas durante o desenvolvimento do OpenPUP v2. Os itens não estão priorizados e podem ser implementados conforme necessidade e disponibilidade.

---

## Interface e Usabilidade

- [ ] **Melhoria geral de design (UI/UX)**
  - Avaliar e decidir quais elementos precisam de redesign
  - Revisar paleta de cores, tipografia, espaçamentos
  - Melhorar hierarquia visual e fluxo de leitura

- [ ] **Alteração do campo Legenda dos códigos no HTML**
  - Melhorar a apresentação visual e clareza da legenda M/S/A/D

- [ ] **Otimização do modal de pré-visualização de prompt**
  - Melhorar textos exibidos para o usuário
  - Revisar layout e responsividade

- [ ] **Adição de botão para mostrar/esconder pré-visualização de prompt**
  - Permitir colapsar/expandir preview para economizar espaço de tela

- [ ] **Pré-visualização em tempo real**
  - Atualizar preview automaticamente assim que o usuário preenche cada campo
  - Eliminar necessidade de "gerar" para ver resultado

- [ ] **Menu de navegação colapsável**
  - Criar menu principal com seções: Home, Documentação Oficial, Exemplos de Uso, Guias
  - Implementar navegação entre páginas
  - Criar páginas adicionais com conteúdo estruturado

---

## Arquitetura e Código

- [ ] **Modularização e padronização de idioma do código**
  - Separar código em módulos coesos
  - Padronizar nomenclatura (português vs inglês)

- [ ] **Refatoração dos códigos para reduzir duplicidades**
  - Aplicar princípio DRY (Don't Repeat Yourself)
  - Implementar melhores práticas de clean code

- [ ] **Refatoração dos códigos para aperfeiçoar mobile first**
  - Revisar breakpoints
  - Otimizar layouts para dispositivos móveis

---

## Internacionalização (i18n)

- [ ] **Tradução do projeto para Espanhol e Inglês**
  - Interface do usuário
  - Documentação
  - Exemplos e placeholders

- [ ] **Implementação de seleção por idioma**
  - Prioridade: EN e ES
  - Sistema de troca de idioma persistente

---

## Funcionalidades Novas

- [ ] **Exportar prompt em formatos diferentes**
  - Botão para baixar como .md (Markdown)
  - Botão para baixar como .txt (texto puro)
  - Garantir que exportação seja sem HTML, YAML ou metadados invisíveis

- [ ] **Salvar e carregar templates**
  - Permitir salvar configurações dos campos (seções 0-4) como template
  - Gerenciar múltiplos templates salvos
  - Carregar template pré-configurado com um clique

- [ ] **Melhorias na função Copiar Protocolo**
  - Garantir que cópia seja sempre texto puro (sem HTML, YAML, metadados)
  - Feedback visual melhorado ao copiar
  - Opções de cópia (com/sem comentários, com/sem formatação)

- [ ] **Melhorias na tabela de legendas do campo Critérios de priorização**
  - Tornar mais intuitiva
  - Adicionar exemplos inline

- [ ] **Histórico de logs com data e título**
  - Registro mínimo dos prompts gerados
  - Metadados: timestamp, título, modo usado

- [ ] **Menu de navegação no topo**
  - Links para: explicação, guias, manifesto
  - Navegação entre seções

- [ ] **Campo para exibir média de tokens, palavras, caracteres**
  - Estatísticas em tempo real do prompt gerado
  - Alertas de overflow baseados em limites conhecidos de IAs

- [ ] **Adição de banner do projeto**
  - Visual identity
  - Hero section com branding

---

## Estrutura do Protocolo

- [ ] **Alteração do fluxo da etapa 9**
  - Deixá-la como última a ser gerada (após o prompt principal)
  - Revisão da ordem de execução

---

## Notas

- **Priorização**: Itens não estão ordenados por prioridade
- **Status**: Todos os itens estão pendentes (não iniciados)
- **Contribuições**: Issues e PRs são bem-vindos para qualquer item desta lista

---

> **Última atualização:** 23-01-2026

> Este projeto é licenciado sob:
>
> - **Documentação**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
> - **Implementações em software**: [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
