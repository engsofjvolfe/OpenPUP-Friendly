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

- [x] **Pré-visualização em tempo real**
  - Atualizar preview automaticamente assim que o usuário preenche cada campo
  - Modo humanizado com ícones Font Awesome para melhor legibilidade
  - Toggle para alternar entre visualização humanizada e técnica
  - Rolagem automática ao alternar modos

- [ ] **Menu de navegação colapsável**
  - Criar menu principal com seções: Home, Documentação Oficial, Exemplos de Uso, Guias
  - Implementar navegação entre páginas
  - Criar páginas adicionais com conteúdo estruturado

- [ ] **Menu de navegação no topo**
  - Links para: explicação, guias, manifesto, documentação
  - Navegação entre seções
  - Acesso a vídeos tutoriais e explicações sobre o projeto

- [ ] **Adição de banner do projeto**
  - Visual identity
  - Hero section com branding

- [ ] **Mensagem de tooltip para títulos truncados no histórico de prompts**
  - Exibir tooltip ao passar mouse sobre títulos longos

- [ ] **Modal de verificação antes de exclusão de itens do histórico**
  - Confirmação antes de deletar prompt do histórico

- [ ] **Ajuste/remoção/substituição de emojis**
  - Migrar para Font Awesome onde apropriado
  - Padronizar iconografia

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

- [ ] **Refatoração massiva de todas as partes do código para módulos genéricos**
  - Longo prazo
  - Separação completa em módulos ES6
  - Sistema de build otimizado

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

- [ ] **Campo para exibir média de tokens, palavras, caracteres**
  - Estatísticas em tempo real do prompt gerado
  - Alertas de overflow baseados em limites conhecidos de IAs

- [x] **Campo de restrições avançadas com gatilhos mais duros**
  - Investigar tipos de interação mais eficazes para controle de comportamento da IA
  - Implementar campo ou seção dedicada a constraints absolutas
  - Avaliar uso de triggers, fail-safes e validações estritas
  - Pesquisar melhores práticas de prompt engineering para enforcement
  - **Status:** Implementado em v2.1 como Guards YAML com invariantes estruturais

---

## Estrutura do Protocolo

- [ ] **Alteração do fluxo da etapa 9**
  - Deixá-la como última a ser gerada (após o prompt principal)
  - Revisão da ordem de execução

---

## Protocolo OpenPUP v2.2 - Hardening & Elasticidade Controlada

> **Contexto:** O OPENPUP v2.2 já possui controle estrutural forte, porém ainda apresenta pontos de rigidez excessiva que podem gerar bloqueios indevidos mesmo quando a IA está agindo de boa-fé e seguindo a intenção do usuário. Os ajustes abaixo são **estruturais**, não cosméticos.

### [ ] 1. Tornar checklist do Step 7 condicional à política ativa

**Problema:**

- Itens do checklist são tratados como universais, mesmo quando dependem de configurações explícitas do usuário (ex: `external_sources`)
- `uso_exclusivo_dados` é avaliado mesmo quando `external_sources: permitido`
- Isso cria deadlocks artificiais

**Ação:**
Introduzir lógica de ativação condicional por item de checklist

**Proposta:**

```yaml
uso_exclusivo_dados:
  active_if: external_sources == 'negado'
```

**Resultado esperado:**

- Checklist reflete a política ativa
- Elimina bloqueios falsos positivos
- Mantém rigor quando necessário

### [ ] 2. Classificar MUSTs por criticidade semântica

**Problema:**

- Todos os MUSTs têm o mesmo peso lógico
- Bloqueio total por falha não-crítica
- Perda de utilidade do protocolo

**Ação:**
Introduzir **tipos de MUST**

**Proposta:**

- `M-CORE` → sem isso, a entrega perde sentido
- `M-SUPPORT` → melhora qualidade, mas não deve bloquear execução

**Regra de decisão:**

- Falha em `M-CORE` → bloqueio
- Falha em `M-SUPPORT` → alerta + limitação explícita na entrega

### [ ] 3. Refinar INV_003 (conflito entre MUSTs)

**Problema:**

- Qualquer conflito entre MUSTs = bloqueio (excessivamente agressivo)

**Ação:**
Introduzir **arbitragem de conflito**

**Proposta:**
Classificar conflitos em:

- **Conflito resolúvel por política ativa** (ex: usar inferência quando fonte confiável não é possível)
- **Conflito lógico insolúvel** (ex: MUSTs que se negam mutuamente)

**Regra:**

- Conflito resolúvel → aplicar política, registrar decisão
- Conflito insolúvel → bloqueio

### [ ] 4. Tornar explícita a política de degradação controlada

**Problema:**

- Sistema só conhece dois estados: executar plenamente ou bloquear
- Falta estado intermediário explícito

**Ação:**
Definir **modo degradado controlado**

**Proposta:**

```json
"execution_mode": "full | degraded | blocked"
```

**Uso:**

- `degraded` quando M-SUPPORT falhou ou dados incompletos mas suficientes
- Entrega final deve declarar limitações e não fingir completude

### [ ] 5. Formalizar camada de política ativa (Policy Resolver)

**Problema:**

- Decisões já tomadas implicitamente, mas sem camada nomeada

**Ação:**
Introduzir conceito explícito de **Policy Resolver**

**Responsabilidades:**

- Resolver conflitos leves
- Aplicar prioridades (external_sources, scope_limits, etc.)
- Registrar decisões para auditoria

### [ ] 6. Criar "Protocol Lint" (regras de escrita)

**Objetivo:**
Evitar que o autor do protocolo introduza deadlocks

**Exemplos de regras:**

- Todo item obrigatório deve declarar dependências e política associada
- Nenhum checklist pode ser universal sem justificativa
- MUST sem impacto real não deve ser CORE

**Estado atual:**

- [x] Bug crítico de `data_sources_used` corrigido
- [x] Estrutura base sólida
- [ ] Falta elasticidade formalizada
- [ ] Falta diferenciação de falha crítica vs qualitativa

**Próximo passo sugerido:**

- Consolidar essas mudanças como **OPENPUP v2.3**
- Ou manter v2.2 e aplicar essas regras como "policy overlay"

---

## Auditoria Ética e Coleta de Dados

> **Objetivo:** Permitir auditoria e melhoria contínua do OPENPUP a partir de dados fornecidos voluntariamente pelos usuários, com consentimento explícito, minimização de coleta e retenção limitada.

### 1. Definição de Escopo de Coleta

- [ ] Definir claramente quais dados **podem** ser coletados:
  - [ ] Template OPENPUP preenchido (input do usuário)
  - [ ] Metadados não identificáveis (ex: idioma, modo, versão do template)
  - [ ] Resposta da IA **apenas se o usuário optar por compartilhar**
  - [ ] Data e hora de uso
  - [ ] Em qual IA será colado o prompt gerado (opcional para o usuário)
  - [ ] Local de acesso para análise agregada

- [ ] Documentar explicitamente quais dados **não serão coletados**:
  - Identidade pessoal
  - IP, fingerprint, localização precisa
  - Dados fora do que o usuário colar manualmente

### 2. Consentimento Explícito e Granular

- [ ] Implementar consentimento separado para cada tipo de dado:
  - [ ] Compartilhar prompt/template preenchido
  - [ ] Compartilhar resposta da IA
  - [ ] Compartilhar metadados de uso

- [ ] Garantir que nenhuma opção venha pré-marcada
- [ ] Garantir que o uso da ferramenta **não dependa** do consentimento
- [ ] Exibir aviso claro antes do envio:
  - A resposta da IA pode conter dados identificáveis
  - O projeto não garante anonimato absoluto

### 3. Modelo de Retenção de Dados

- [ ] Definir política fixa de retenção (ex: 3 meses)
- [ ] Documentar que:
  - Não há exclusão individual imediata após envio
  - Os dados são excluídos automaticamente ao fim do prazo
- [ ] Implementar rotina técnica de expurgo automático
- [ ] Tornar o prazo visível ao usuário antes do consentimento

### 4. Minimização e Redução de Risco

- [ ] Tornar opcional o compartilhamento da resposta completa da IA
- [ ] Oferecer alternativas de menor risco:
  - [ ] Compartilhar apenas steps 5–8
  - [ ] Compartilhar apenas status (bloqueado / não bloqueado)
  - [ ] Compartilhar trechos selecionados manualmente
- [ ] Nunca coletar respostas automaticamente

### 5. Transparência Técnica (Open Source)

- [ ] Documentar no repositório:
  - O que é coletado
  - Onde é armazenado
  - Por quanto tempo
  - Para que é usado
- [ ] Garantir que o código de coleta seja auditável
- [ ] Evitar qualquer coleta "implícita" ou indireta

### 6. Uso dos Dados (Finalidade Única)

- [ ] Restringir uso dos dados a:
  - Análise estrutural do protocolo
  - Identificação de falhas recorrentes
  - Melhoria de regras e invariantes
- [ ] Proibir explicitamente:
  - Uso comercial dos dados
  - Compartilhamento com terceiros
  - Treinamento de modelos proprietários

### 7. Questionário de Experiência (Primeiro Acesso)

- [ ] Implementar questionário opcional, curto e único:
  - Clareza do protocolo
  - Facilidade de uso
  - Confiança gerada
  - Principais dificuldades
- [ ] Garantir que respostas não sejam vinculadas a prompts específicos
- [ ] Não reapresentar o questionário após o primeiro envio

### 8. Comunicação Clara com o Usuário

- [ ] Criar texto de consentimento curto, direto e honesto
- [ ] Evitar promessas técnicas impossíveis (ex: anonimato absoluto)
- [ ] Deixar explícito que:
  - Compartilhar dados é um favor ao projeto
  - Não compartilhar não gera penalidade alguma

### 9. Revisão Ética Contínua

- [ ] Revisar política de coleta periodicamente
- [ ] Ajustar escopo se novos riscos forem identificados
- [ ] Preferir perder dados a comprometer confiança

**Princípio norteador:**

> Coletar o mínimo necessário, com máxima clareza, pelo menor tempo possível.

---

## Notas

- **Priorização**: Itens não estão ordenados por prioridade
- **Status**: Todos os itens estão pendentes (não iniciados) exceto quando marcados
- **Contribuições**: Issues e PRs são bem-vindos para qualquer item desta lista

---

> **Última atualização:** 01-02-2026

> Este projeto é licenciado sob:
>
> - **Documentação**: [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
> - **Implementações em software**: [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html)
