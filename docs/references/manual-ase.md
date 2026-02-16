---
category: reference
scope: manual-ase
status: active
version: 0.3.11
---

# 📘 Manual ASE - Sistema Eleitoral

Guia de referência dos códigos ASE (Atos do Sistema Eleitoral) utilizados pela Justiça Eleitoral.

---

## 📋 Índice

- [ASE 337 - Suspensão de Direitos Políticos](#ase-337---suspensão-de-direitos-políticos)
- [ASE 370 - Cessação do Impedimento](#ase-370---cessação-do-impedimento---suspensão)
- [ASE 540 - Ocorrência a ser Examinada](#ase-540---ocorrência-a-ser-examinada-em-pedido-de-registro-de-candidatura)
- [ASE 019 - Cancelamento por Falecimento](#ase-019---cancelamento---falecimento)

---

## ASE 337 - SUSPENSÃO DE DIREITOS POLÍTICOS

### Descrição

Registrar a suspensão de direitos políticos nas hipóteses decorrentes do sistema constitucional vigente e da legislação ordinária.

### Efeitos no Eleitor

- Impede a quitação eleitoral
- Altera situação da inscrição regular para suspensa
- Impede o exercício do voto
- Descaracteriza os débitos relativos à ausência às urnas e trabalhos eleitorais entre a data de ocorrência e a data de lançamento deste ASE

### Efeitos em Outro ASE

- Inativa o(s) ASE(s): 094, 442 com data de ocorrência posterior a este ASE

### Dependência de ASE

- Não depende de outro ASE

### Dependência de RAE

- A inscrição que possui RAE pendente de processamento não pode receber este ASE

### Comando Duplo

- A inscrição não pode ter duplicidade deste ASE com a mesma data de ocorrência e o mesmo complemento

### Situação da Inscrição

- A inscrição deve estar em alguma da(s) situação(ões): CANCELADA, REGULAR, SUSPENSA

### Permissão Comando

- **Manual:** Somente pela zona eleitoral da inscrição

### Contra ASE

- Será inativado pelo ASE 370 indicado

### Data de Ocorrência

- Deve ser igual ou anterior à data atual
- O eleitor deve possuir 18 anos completos até a data de ocorrência
- Dever ser:
  - A data do trânsito em julgado da sentença: nas hipóteses de condenação criminal e improbidade administrativa, ou
  - A data informada na comunicação feita pelo Ministério da Justiça: na hipótese de opção pelo Estatuto de Igualdade entre brasileiros e portugueses, ou
  - A data da decretação da suspensão dos direitos políticos: na hipótese de recusa de cumprimento de obrigação a todos imposta ou de prestação alternativa
  - A data em que foi firmado ou homologado o acordo (para os motivos 9 e 10)

### Complemento

- Informação com o número do processo em que houve a condenação criminal ou da improbidade administrativa, no formato: `Proc. nº /ano-órgão/local/UF`
- Ou número do documento que comunicou à Justiça Eleitoral a suspensão dos direitos políticos nas hipóteses de opção pelo Estatuto de Igualdade
- Ou número do documento que declarou a suspensão, no caso de recusa de cumprimento de obrigação a todos imposta
- Informação com o número do processo/procedimento em que foi firmado o acordo e o prazo de duração (para os motivos 9 e 10)

### Motivo/Forma

Indica a situação causadora da suspensão:

- **2** - Condenação criminal
- **3** - Improbidade administrativa
- **5** - Recusa de cumprimento de obrigação a todos imposta ou de prestação alternativa
- **7** - Condenação criminal (LC nº 64/90, art. 1º, I, e)
- **8** - Condenação criminal eleitoral
- **9** - Acordo de não persecução penal (art. 28-A do CPP)
- **10** - Acordo de não persecução cível (art. 17, § 1º, da Lei nº 8.429/1992)

### Observação

- Os motivos/forma 1 e 6 permanecem apenas para consulta (1 - incapacidade civil absoluta; 6 - outros)
- Embora os crimes eleitorais figurem entre os que geram inelegibilidade após o cumprimento da pena (LC nº 64/90, art. 1º, I, e), seu registro far-se-á por intermédio do motivo/forma 8

---

## ASE 370 - CESSAÇÃO DO IMPEDIMENTO - SUSPENSÃO

### Descrição

Registrar a cessação da circunstância que causou a suspensão da inscrição, nos seguintes casos:

- Cumprimento do serviço militar obrigatório ou regularização da situação daqueles que se recusaram a cumpri-lo
- Fim da incapacidade civil absoluta
- Extinção da punibilidade, se decorrente de condenação criminal
- Cumprimento da pena, na hipótese de improbidade administrativa
- Fim da opção pelo exercício dos direitos políticos em Portugal

Utilizado para registrar a verificação de homonímia no caso de inscrição cancelada pelo batimento em agrupamento que envolva suspensão de direitos políticos.

### Efeitos no Eleitor

- Altera situação da inscrição para: Regular (a regularização só se dará quando for inativado o último registro de suspensão ou de cancelamento (ASE 027 - motivo/forma 2) constante do histórico da inscrição e não existir registro de outro ASE de cancelamento em situação "ativo" no histórico)

### Efeitos em Outro ASE

- Inativa o(s) ASE(s): 027 ou 043 ou 337 indicado
- Inativa o ASE 027 com motivo/forma 2 indicado
- Gera o ASE 540 com motivo 4, quando lançado ASE 370 com motivo 1 para inativar ASE 337 com motivo 7

### Dependência de ASE

- Depende do(s) ASE(s) 043 ou 337 ativo(s)
- Depende dos ASEs 027 (motivo/forma 2)

### Comando Duplo

- Permitido

### Situação da Inscrição

- A inscrição deve estar em alguma da(s) situação(ões): CANCELADA, SUSPENSA

### Permissão Comando

- **Manual:** Somente pela zona eleitoral da inscrição

### Contra ASE

- Será registrado com a situação "inativo"

### Data de Ocorrência

- Deve ser igual ou anterior à data atual
- Deve ser:
  - A data do licenciamento ou do engajamento: se for relativa ao código de ASE 043, ou
  - A data da sentença de levantamento da interdição ou de alteração de seus limites para incapacidade relativa, ou da data de deferimento de pedido de requerimento: se for relativa ao motivo/forma 1 do ASE 337, ou
  - A data da sentença de extinção da punibilidade ou do efetivo cumprimento da pena, quando não houver sentença de extinção: se for relativa aos motivos/formas 2, 7 ou 8 do ASE 337, ou
  - A data do termo final do prazo de suspensão determinado na sentença: se for relativa ao motivo/forma 3 do ASE 337
  - A data da sentença do juiz eleitoral que reconhecer a extinção da causa de restrição: se for relativa aos motivos/formas 4 ou 5 do ASE 337
  - A data da decisão da autoridade judiciária eleitoral: se for relativa à identificação de homonímia

### Complemento

Informação seguindo as seguintes regras, no formato: `Proc. nº/ano-órgão/local/UF` ou `Of. nº/ano-órgão/local/UF`:

- Número do documento que comunicou/comprovou a regularização da situação militar do eleitor (no caso de recusa ou de conscrição), ou
- Número do processo que declarou o fim da incapacidade civil absoluta, ou
- Número do processo em que houve a condenação criminal, ou
- Número do processo de condenação por improbidade administrativa, ou
- Número do documento que comunicou o fim da opção pelo exercício dos direitos políticos em Portugal ou do processo da zona em que foi apreciado o cumprimento dessa condição, ou
- Número do processo em que verificada a homonímia

### Motivo/Forma

Indica a cessação do impedimento:

- **1** - Extinção da causa de restrição
- **2** - Eleitor diverso

### ASE a ser Inativado

- Deve ser indicado o ASE que será inativado, através da listagem com os ASEs 027 (motivo2), 043 e 337 ativos

### Observação

- O comando do código de ASE 370 ensejará tão somente a inativação dos códigos de ASE 337, 043 ou 027 correspondentes à sequência informada
- O código de ASE 370 deverá ser comandado para cada uma das ocorrências indicadoras de suspensão de direitos políticos registradas no histórico da inscrição
- O Sistema Elo não permitirá o comando do ASE 370, motivo/forma 1, com data de ocorrência anterior à data do primeiro código de restrição dos direitos políticos
- Após registrar o ASE 370 para ASE 337, motivo/forma 7 ou 8, deverá ser comandado o ASE 540, caso subsista a inelegibilidade

---

## ASE 540 - OCORRÊNCIA A SER EXAMINADA EM PEDIDO DE REGISTRO DE CANDIDATURA

### Descrição

Registro das comunicações enviadas pelos órgãos competentes relativamente a situações fáticas previstas no art. 1º, inciso I, da Lei Complementar nº 64/1990.

### Efeitos no Eleitor

- Não altera a situação da inscrição

### Efeitos em Outro ASE

- Não ativa/inativa outro ASE

### Dependência de ASE

- Não depende de outro ASE

### Dependência de RAE

- A inscrição que possui RAE pendente de processamento não pode receber este ASE

### Comando Duplo

- A inscrição não pode ter duplicidade deste ASE ativo com a mesma data de ocorrência, complemento e motivo/forma

### Situação da Inscrição

- A inscrição deve estar em alguma da(s) situação(ões): CANCELADA, REGULAR, SUSPENSA

### Permissão Comando

- **Manual:** Somente pela zona eleitoral da inscrição
- **Automático:** Pelo sistema quando no lançamento do ASE 370 com motivo 1 para inativação do ASE 337 com motivo 7 (a data de ocorrência e complemento devem ser iguais a do ASE 370 e o motivo deve ser o 4)

### Contra ASE

- Será inativado pelo ASE 558 indicado

### Data de Ocorrência

- Deve ser igual ou anterior à data atual
- O eleitor deve possuir 18 anos completos até a data de ocorrência
- Deve ser a data da decisão que reconheceu a situação fática prevista na Lei Complementar nº 64/1990 ou do ou do trânsito em julgado, quando a lei assim o exigir
- Deve ser a data em que foi firmado ou homologado o acordo (para os motivos 10 e 11)

### Complemento

- Informação com o número do processo ou do ato em que foi reconhecida a situação ensejadora do registro, no formato: `Proc. ou ato nº/ano-órgão/local/UF`
- Informação com o número do processo/procedimento em que foi firmado o acordo e o prazo de duração (para os motivos 10 e 11)

### Motivo/Forma

Indica a natureza da ocorrência:

- **1** - LC 64/90, art. 1º, I, b (Perda de mandato de Deputado Federal, Estadual, Distrital e Vereador)
- **2** - LC 64/90, art. 1º, I, c (Perda de mandato de Governador e Vice, Prefeito e Vice)
- **3** - LC 64/90, art. 1º, I, d, h (Condenação em ação por abuso de poder econômico, político e uso indevido dos meios de comunicação)
- **4** - LC 64/90, art. 1º, I, e (Condenação criminal)
- **5** - LC 64/90, art. 1º, I, g (Contas rejeitadas)
- **6** - LC 64/90, art. 1º, I, j (Condenação por corrupção eleitoral, captação ilícita de sufrágio, captação e gasto ilícito de recursos de campanha e conduta vedada, quando implicar na cassação do registro ou diploma)
- **7** - LC 64/90, art. 1º, I, l (Condenação em ação de improbidade administrativa)
- **8** - LC 64/90, art. 1º, I, o (Condenação em processo administrativo ou judicial que importe demissão do serviço público)
- **9** - LC 64/90, art. 1º, I, (Demais alíneas do inciso I, art. 1º da Lei Complementar 64/90)
- **10** - Inelegibilidade-Acordo de não persecução penal (art. 28-A do CPP)
- **11** - Inelegibilidade- Acordo de não persecução cível (art. 17, § 1º, da Lei nº 8.429/1992)

### Observação

- O comando do ASE 540 não configura inelegibilidade, cujo reconhecimento somente se fará por ocasião do exame, pela autoridade competente, de eventual pedido de registro de candidatura
- O comando do ASE 540 é anotação de situação fática que possa se enquadrar nas hipóteses previstas no art. 1º, inciso I Lei Complementar 64/90
- O comando não importa declaração de inelegibilidade, ante seu caráter meramente informativo
- O Motivo/forma 1 deverá ser anotado nos casos em que a perda do mandato decorrer de violação do contido no art. 55, incisos I e II da Constituição
- O Motivo/forma 4 deverá ser anotado nos casos de condenação em ação penal, com decisão transitada em julgado ou proferida por órgão colegiado
- O comando do ASE 540 Motivo/forma 4 e Motivo/forma 7, não se confunde com comando de ASE 337-Suspensão dos Direitos Políticos

---

## ASE 019 - CANCELAMENTO - FALECIMENTO

### Descrição

Registrar a ocorrência de falecimento de eleitor.

### Efeitos no Eleitor

- Altera a situação da inscrição para: CANCELADA
- Impede o exercício do voto
- Descaracteriza os débitos relativos à ausência às urnas e aos trabalhos eleitorais entre a data de ocorrência e a data de lançamento deste ASE
- A inscrição cancelada pelo ASE 019 pode ser regularizada por: Operação de RAE (transferência ou revisão), inexistindo outra inscrição liberada, não liberada, regular ou suspensa para o eleitor; ou por ASE 361

### Efeitos em Outro ASE

- Inativa o(s) ASE(s): 094, 442 com data de ocorrência igual ou posterior a este ASE

### Dependência de ASE

- Não depende de outro ASE

### Comando Duplo

- A inscrição não pode ter duplicidade deste ASE ativo

### Situação da Inscrição

- A inscrição deve estar em alguma da(s) situação(ões): CANCELADA, REGULAR, SUSPENSA

### Permissão Comando

- **Manual:** Somente pela zona eleitoral da inscrição
- **Automático:** Pelo sistema, quando por meio de convênio com o INSS ou outros órgãos, a Justiça Eleitoral tomar conhecimento de óbito de eleitor

### Contra ASE

- Será inativado pelo ASE 361 indicado
- Será inativado por uma operação de RAE (revisão ou transferência) com data posterior a este ASE

### Data de Ocorrência

- Deve ser igual ou anterior à data atual
- Deve ser posterior à última operação de RAE do eleitor
- Deve ser a data do óbito: Na hipótese excepcional de a data do óbito estar ausente ou incompleta no documento que atesta o falecimento do eleitor, a data de ocorrência a ser utilizada será a do registro do óbito no Cartório de Registro Civil

### Complemento

Informação com indicação do documento de registro do óbito, no formato:

- `Certidão (ou Termo) nº/seu emissor/Município/UF`
- Documento que comunicou a ocorrência à zona eleitoral, no formato: `Of. nº/ano-órgão/local/UF`
- Processo em que foi determinado o comando, no formato: `Proc. nº/ano-ZE/UF`
- Ou, ainda, no formato fornecido pelo INSS ou órgão conveniado

---

## 📚 Referências

- Lei Complementar nº 64/1990 (Lei de Inelegibilidade)
- Lei Complementar nº 135/2010 (Lei da Ficha Limpa)
- Sistema Elo - Justiça Eleitoral

---

**Documento de Referência - Uso Interno**  
**Fonte:** Manual do Sistema Eleitoral

---

_Última atualização: 15/02/2026 • v0.3.20 (Hub v0.5.8)_
_Editado via: Antigravity | Modelo: claude-3.5-sonnet | OS: Windows 11_
