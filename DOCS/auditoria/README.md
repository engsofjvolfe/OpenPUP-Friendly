# README — Auditoria Narrativa de Sistemas Generativos

> Melhorar o OPENPUP pode significar aceitar limites, não superá-los

## Pasta: `/auditoria`

Este diretório contém **registros narrativos de incidentes** ocorridos durante o uso do protocolo OPENPUP em interação com diferentes sistemas de IA.

Esses documentos **não são relatórios de bug**, **não são instruções de correção** e **não devem ser usados para ajustes pontuais no protocolo**.

Eles existem para um único propósito:

> **Preservar observações sobre comportamento de sistemas generativos sob tensão,  
> de forma que padrões estruturais possam emergir ao longo do tempo,  
> sem induzir overfitting a casos específicos.**

---

## 1. O que este diretório É

Este diretório é:

- Um **arquivo de memória epistemológica**
- Um **repositório de fricção cognitiva**
- Um **instrumento de observação longitudinal**
- Uma **base empírica para reflexão futura**

Cada documento aqui registrado descreve:

- um contexto real
- uma intenção humana explícita
- um comportamento observado do sistema
- o processo pelo qual uma falha foi percebida e compreendida

Sem tentar resolver o problema.

---

## 2. O que este diretório NÃO É

Este diretório **não é**:

- Uma lista de erros para corrigir
- Um changelog do OPENPUP
- Um conjunto de regras adicionais
- Um manual de “como consertar IA”
- Um repositório de exceções codificáveis

⚠️ **Qualquer tentativa de transformar relatos individuais em regras diretas é considerada leitura incorreta deste material.**

---

## 3. Como ler os registros corretamente

Ao ler um registro de incidente, **NÃO pergunte**:

- “O que deu errado aqui?”
- “Qual regra faltou?”
- “Que instrução precisamos adicionar?”

Essas perguntas levam a **overfitting**.

### Perguntas corretas

Quem lê estes documentos deve perguntar coisas como:

#### Sobre o sistema generativo

- Que comportamento recorrente de sistemas generativos este caso torna visível?
- Que decisões o sistema tomou **sem ser explicitamente autorizado**?
- Onde o sistema avançou quando seria aceitável ou esperado parar?
- Onde houve **substituição de método por resultado**?
- Que tipo de falha **não é imediatamente perceptível**?
- O que este caso diz sobre os **limites estruturais** da automação?

#### Sobre o OPENPUP enquanto instrumento

- Em que momento o protocolo **não conseguiu impor consequência**?
- Que partes do protocolo foram tratadas pelo sistema como preferência, não como regra?
- Onde o protocolo foi claro, mas **não coercitivo**?
- Houve algum ponto em que o protocolo **presumia cooperação** do sistema?
- O protocolo ajudou o usuário a pensar e explicitar tudo o que precisava,
  ou apenas revelou o problema depois da falha?

#### Sobre a interação entre ambos

- Que tipo de falha o OPENPUP conseguiu revelar, mas não impedir?
- Que tipo de falha passou despercebida até a auditoria humana?
- O protocolo falhou em **detectar**, **impedir** ou apenas em **corrigir**?
- Este caso sugere um limite estrutural do protocolo
  ou apenas uma limitação contextual?

#### Sobre evolução (sem overfitting)

- Este comportamento aparece em outros registros,
  mesmo com versões ou sistemas diferentes?
- É possível formular o problema **sem citar o caso específico**?
- A observação aponta para:
  - um ajuste estrutural do protocolo?
  - ou um risco inerente à automação?

Essas perguntas visam **invariantes comportamentais**, não exceções.

---

## 4. Relação entre registros e o protocolo OPENPUP

Cada registro de incidente **referencia explicitamente**:

- a versão do OPENPUP em uso no momento
- o modo operacional (ex.: FAST, DETALHADO, THOROUGH)
- o sistema ou modelo testado
- o contexto da tarefa

Essas referências existem para:

- situar historicamente a observação
- permitir comparação entre versões
- **não** para justificar correções imediatas

Um registro **não implica** que:

- a versão do OPENPUP estava “errada”
- o sistema deveria ter se comportado diferente
- uma mudança seja necessária

Ele apenas registra o que aconteceu.

---

## 5. Versionamento e observações longitudinais

Este diretório pode conter:

- múltiplos registros sob a mesma versão do OPENPUP
- registros semelhantes em versões diferentes
- observações contraditórias entre sistemas

Isso é esperado.

### Importante

> **Mudanças no OPENPUP só devem ser consideradas quando padrões aparecem
> em múltiplos registros, atravessando sistemas, tarefas e contextos diferentes.**

Uma observação isolada **nunca** deve gerar uma alteração direta.

---

## 6. Uso por outras IAs ou colaboradores humanos

Este diretório foi projetado para ser lido também por:

- outras IAs (ex.: análise de padrões)
- colaboradores humanos
- versões futuras do próprio autor

Qualquer agente que utilize este material deve:

- tratar os registros como **dados qualitativos**
- evitar conclusões normativas imediatas
- operar em nível de abstração
- respeitar a distinção entre:
  - fato observado
  - interpretação do momento
  - hipótese aberta

---

## 7. Princípio central

Este diretório existe porque:

> **Sistemas generativos falham de maneiras que parecem normais
> até serem observadas com atenção.**

O valor não está em evitar falhas.  
Está em **preservar a capacidade de percebê-las**.

---

## 8. Nota sobre evolução do sistema

O OPENPUP é um sistema vivo.

Ele não evolui por:

- adição constante de regras
- aumento de verbosidade
- tentativa de prever todos os casos

Ele evolui por:

- observação cuidadosa
- comparação honesta
- resistência a soluções fáceis
- registro do que ainda não sabemos nomear

Este diretório é parte essencial desse processo.

---

## 9. Leitura recomendada antes de propor mudanças

Antes de sugerir qualquer modificação no OPENPUP:

1. Leia múltiplos registros
2. Identifique padrões recorrentes
3. Tente formular o problema sem mencionar sistemas específicos
4. Verifique se a observação se sustenta fora do caso original
5. Só então, considere implicações estruturais

Se não for possível cumprir esses passos, **não proponha mudanças**.

---

## 10. Encerramento

Este README não fecha nada.  
Ele apenas estabelece **como pensar** com este material.

Se no futuro ele parecer incompleto,  
isso significa que o sistema continuou aprendendo.

E isso é o comportamento esperado.
