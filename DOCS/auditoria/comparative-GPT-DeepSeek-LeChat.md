# Análise Comparativa de Incidentes com Sistemas Generativos

## OPENPUP como Instrumento de Diagnóstico Comportamental

**Casos analisados:**

1. ChatGPT — Violação de rigor acadêmico (fontes não confiáveis)
2. DeepSeek — Quebra de fluxo condicional e lógica de controle
3. Le Chat (Mistral) — Falha de validação técnica de links

---

## 1. Visão Geral Comparativa

| Dimensão analisada     | ChatGPT                | DeepSeek                  | Le Chat                    |
| ---------------------- | ---------------------- | ------------------------- | -------------------------- |
| Tipo de tarefa         | Levantamento acadêmico | Execução de script lógico | Levantamento acadêmico     |
| Protocolo usado        | OPENPUP v2             | OPENPUP v2                | OPENPUP (variação v2)      |
| Tipo de falha          | Epistêmica             | Lógica / processual       | Técnica / infraestrutural  |
| A IA “entregou algo”?  | Sim                    | Sim                       | Sim                        |
| Deveria ter parado?    | Sim                    | Sim                       | Provavelmente              |
| A falha foi explícita? | Não (só após inspeção) | Sim (fluxo quebrado)      | Não (descoberta posterior) |

---

## 2. Caso 1 — ChatGPT

### Falha de Rigor Epistêmico

**O que falhou:**

- Uso de fontes proibidas (Wikipedia, ResearchGate)
- Tratamento implícito dessas fontes como confiáveis
- Violação direta de regras classificadas como críticas

**Comportamento observado:**

- Priorização de completude e fluidez
- Execução mesmo sob violação explícita
- Ausência de autointerrupção

**O que o caso realmente mediu:**

- Capacidade do sistema de **respeitar restrições epistemológicas**
- Tendência do modelo a “resolver” mesmo quando não deveria
- Interpretação de regras sem consequência como preferências

**Tipo de erro detectado:**

- Erro de autoridade
- Erro de critério
- Erro de confiança implícita

---

## 3. Caso 2 — DeepSeek

### Falha de Lógica de Controle

**O que falhou:**

- Não execução da etapa prevista para falha (perguntar ou declarar assunção)
- Ignorou explicitamente um fluxo `SE → ENTÃO` definido no protocolo
- Produziu conteúdo onde deveria parar

**Comportamento observado:**

- Contorno de bloqueio em vez de tratá-lo
- Substituição do processo pelo resultado
- “Utilidade” priorizada sobre fidelidade ao método

**O que o caso realmente mediu:**

- Capacidade da IA de **obedecer a fluxos condicionais definidos pelo usuário**
- Respeito a regras de parada explícitas
- Confiabilidade como executor de scripts lógicos

**Tipo de erro detectado:**

- Erro de controle
- Erro de sequência
- Violação de contrato de execução

---

## 4. Caso 3 — Le Chat (Mistral)

### Falha de Validação Técnica

**O que falhou:**

- Inclusão de link tecnicamente inseguro ou inacessível
- Ausência de checagem de certificado / acessibilidade
- Nenhuma sinalização de risco ou bloqueio

**Comportamento observado:**

- Validação semântica substituindo validação técnica
- Suposição implícita de segurança por domínio acadêmico
- Execução “silenciosa” do erro

**O que o caso realmente mediu:**

- Limites da IA na distinção entre:
  - relevância acadêmica
  - segurança técnica
- Dependência de validação humana fora do escopo cognitivo

**Tipo de erro detectado:**

- Erro infraestrutural
- Erro de suposição implícita
- Erro de escopo não declarado

---

## 5. Comparações Diretas (6 combinações)

### 5.1 ChatGPT × DeepSeek

- ChatGPT falha no **conteúdo**
- DeepSeek falha no **processo**
- Ambos avançam quando deveriam parar
- Diferença: DeepSeek quebra lógica explícita; ChatGPT quebra critério epistemológico

### 5.2 ChatGPT × Le Chat

- Ambos entregam algo “bom à primeira vista”
- ChatGPT erra na fonte
- Le Chat erra na infraestrutura
- Ambos exigem auditoria humana posterior

### 5.3 DeepSeek × Le Chat

- DeepSeek falha de forma explícita
- Le Chat falha de forma silenciosa
- Um quebra o fluxo
- O outro mantém o fluxo, mas com risco oculto

### 5.4 OPENPUP × ChatGPT

- OPENPUP revelou que regras sem consequência não são coercitivas
- O protocolo funcionou como detector, não como controlador

### 5.5 OPENPUP × DeepSeek

- OPENPUP funcionou como teste de fidelidade lógica
- O sistema falhou como executor de script

### 5.6 OPENPUP × Le Chat

- OPENPUP não previa validação técnica explícita
- O erro revelou um **ponto cego do protocolo**, não apenas do sistema

---

## 6. Padrões Emergentes Entre os Casos

1. **Todas as IAs priorizam entregar algo**
2. **Nenhuma interrompe espontaneamente sem gatilho forte**
3. **Falhas mais perigosas são as silenciosas**
4. **Protocolos revelam limites, mas não os eliminam**
5. **Auditoria humana continua sendo o gargalo inevitável**

---

## 7. O Que Esses Casos Dizem Sobre o OPENPUP

- O OPENPUP:
  - não falhou como instrumento
  - falhou apenas onde ainda não havia linguagem
- Ele atua melhor como:
  - sistema de diagnóstico
  - ferramenta de comparação entre IAs
  - registro de comportamento ao longo do tempo
- Não é um sistema de controle absoluto — e nunca será

---

## 8. Conclusão Aberta

Esses três casos não mostram que:

- a IA é inútil  
  nem que
- o protocolo é insuficiente

Eles mostram que:

- **pensamento humano continua sendo o elo mais caro**
- rigor exige fricção
- automação sem registro vira ilusão de controle

O valor não está em evitar falhas.  
Está em **saber reconhecê-las, nomeá-las e preservá-las**.

Este documento não encerra nada.  
Ele cria base para pensar melhor depois.
