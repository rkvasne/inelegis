"use strict";

// Mapeamento de nomes amigáveis das leis
export const LEIS_DISPONIVEIS = [
  { value: "CP", text: "Código Penal (Decreto-Lei 2.848/40)" },
  { value: "CPM", text: "Código Penal Militar (Decreto-Lei nº 1.001/69)" },
  { value: "LEI_5452", text: "Decreto-Lei 5.452/43 (CLT)" },
  {
    value: "LEI_7661",
    text: "Decreto-Lei 7.661/45 (Lei Falimentar - Revogada)",
  },
  {
    value: "LEI_201",
    text: "Decreto-Lei 201/67 (Crimes de responsabilidade dos Prefeitos)",
  },
  { value: "LEI_105", text: "Lei Complementar 105/01 (Sigilo Bancário)" },
  {
    value: "LEI_1521",
    text: "Lei 1.521/51 (Crimes contra a economia popular)",
  },
  { value: "LEI_2889", text: "Lei 2.889/56 (Crimes de genocídio)" },
  { value: "LEI_4591", text: "Lei 4.591/64 (Condomínios e incorporações)" },
  { value: "LEI_4595", text: "Lei 4.595/64 (Sistema Financeiro)" },
  { value: "LEI_4728", text: "Lei 4.728/65 (Mercado de Capitais)" },
  { value: "LEI_4737", text: "Lei 4.737/65 (Código Eleitoral)" },
  { value: "LEI_4898", text: "Lei 4.898/65 (Abuso de autoridade)" },
  { value: "LEI_6091", text: "Lei 6.091/74 (Transporte de eleitores)" },
  { value: "LEI_6368", text: "Lei 6.368/76 (Lei de Drogas - Revogada)" },
  { value: "LEI_6385", text: "Lei 6.385/76 (CVM)" },
  { value: "LEI_6766", text: "Lei 6.766/79 (Parcelamento do solo urbano)" },
  {
    value: "LEI_6996",
    text: "Lei 6.996/82 (Processamento eletrônico eleitoral)",
  },
  { value: "LEI_7492", text: "Lei 7.492/86 (Lei do Colarinho Branco)" },
  { value: "LEI_7716", text: "Lei 7.716/89 (Crimes de racismo)" },
  {
    value: "LEI_8069",
    text: "Lei 8.069/90 (Estatuto da Criança e do Adolescente)",
  },
  {
    value: "LEI_8137",
    text: "Lei 8.137/90 (Crimes contra a ordem tributária)",
  },
  { value: "LEI_8176", text: "Lei 8.176/91 (Ordem econômica)" },
  { value: "LEI_8666", text: "Lei 8.666/93 (Licitações e Contratos)" },
  { value: "LEI_9455", text: "Lei 9.455/97 (Tortura)" },
  { value: "LEI_9504", text: "Lei 9.504/97 (Lei Eleitoral)" },
  { value: "LEI_9605", text: "Lei 9.605/98 (Lei Ambiental)" },
  { value: "LEI_9613", text: "Lei 9.613/98 (Lavagem de dinheiro)" },
  { value: "LEI_10826", text: "Lei 10.826/03 (Armas de Fogo)" },
  { value: "LEI_11101", text: "Lei 11.101/05 (Lei Falimentar)" },
  { value: "LEI_11343", text: "Lei 11.343/06 (Lei de Drogas)" },
  { value: "LEI_12850", text: "Lei 12.850/13 (Organização Criminosa)" },
  { value: "LEI_13260", text: "Lei 13.260/16 (Terrorismo)" },
];

