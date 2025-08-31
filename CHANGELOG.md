> Todos os conteúdos deste projeto, incluindo as mudanças registradas neste arquivo, estão sob Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0). Consulte LICENSE para mais informações.

# Changelog

Todas as mudanças significativas neste projeto serão documentadas neste arquivo e seguem o formato [Keep a Changelog 1.1](https://keepachangelog.com/pt-BR/1.1.0/) e a [Versão Semântica 2.0.0](https://semver.org/lang/pt-BR/).

## Unreleased
-  Acessibilidade
-  Melhorias na tabela de legendas do campo Critérios de priorização
-  Histórico de logs com data e título (minímo) para registro dos prompts
-  Menu de navegação no topo com campos para explicação, guias, manifesto
-  Implementação de seleção por idioma (EN e ES primeiro)
-  Campor de média de tokens, palavras, caracteres por prompt gerado
-  Adição de redes e contatos no footer
-  Adição de banner do projeto
-  Alteração do fluxo da etapa 9 deixando-a como última a ser gerada (após o prompt principal)

## [1.1.0] – 2025-08-31

### Adicionado
- Implementada validação nos campos **Código** para garantir integridade dos dados adicionados no campo Critérios de Priorização 
- Criada a função `validateCode` em `script.js`, responsável por validar os códigos permitidos (`M`, `A`, `S`, `D`) e converter automaticamente a entrada do usuário para letras maiúsculas.

### Modificado
- Refinamento geral no design da interface para melhorar a experiência do usuário em dispositivos móveis e desktop.
- Atualização visual do ícone de informação para maior clareza e consistência com o estilo do projeto.
- Inclusão de classes `.card` na seção `<!--Etapa 2-->` do `index.html`, aprimorando a organização visual e a legibilidade dos elementos.


## [1.0.0] - 2025-08-31
### Adicionado
- Interface web implementada em HTML/CSS/JS com layout responsivo e adaptável.
- Organização de campos conforme estrutura do protocolo OpenPUP, garantindo consistência semântica.
- Geração automatizada de prompt estruturado com base nos parâmetros definidos pelo usuário.
- Inclusão de botão de cópia rápida para exportação do prompt e uso em qualquer ambiente de IA.
- Estilo visual otimizado para legibilidade, com foco em clareza, simplicidade e compatibilidade cross-device.
