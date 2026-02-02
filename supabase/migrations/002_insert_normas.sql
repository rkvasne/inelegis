-- 002_insert_normas.sql

INSERT INTO normas (codigo, nome_curto, nome_completo, descricao) VALUES
  ('CP',  'Código Penal', 'Código Penal (Decreto-Lei nº 2.848, de 07/12/1940)', 'Código Penal Brasileiro'),
  ('CPM', 'Código Penal Militar', 'Código Penal Militar (Decreto-Lei nº 1.001, de 21/10/1969)', 'Código Penal Militar'),

  ('CLT', 'CLT', 'Consolidação das Leis do Trabalho (Decreto-Lei nº 5.452/43)', 'Art. 49 – crime contra a fé pública para fins de inelegibilidade'),
  ('lei_7661_45', 'Lei de Falências (revogada)', 'Decreto-Lei nº 7.661/45 (revogada pela Lei 11.101/05)', 'Antiga Lei de Falências, ainda referida na tabela'),
  ('DL_201_67', 'Decreto-Lei 201/67', 'Decreto-Lei nº 201, de 27/02/1967', 'Crimes de responsabilidade dos Prefeitos'),
  ('LC_105_01', 'LC 105/01', 'Lei Complementar nº 105, de 10/01/2001', 'Crimes contra o sistema financeiro (art. 10)'),

  ('lei_1521_51', 'Lei 1.521/51', 'Lei nº 1.521, de 26/12/1951', 'Crimes contra a economia popular'),
  ('lei_2889_56', 'Lei 2.889/56', 'Lei nº 2.889, de 01/10/1956', 'Define crimes de genocídio'),
  ('lei_4591_64', 'Lei 4.591/64', 'Lei nº 4.591, de 16/12/1964', 'Condomínios e incorporações (art. 65)'),
  ('lei_4595_64', 'Lei 4.595/64', 'Lei nº 4.595, de 31/12/1964', 'Lei da Reforma Bancária – crimes contra o sistema financeiro (art. 34)'),
  ('lei_4728_65', 'Lei 4.728/65', 'Lei nº 4.728, de 14/07/1965', 'Crimes contra o mercado de capitais'),

  ('CE', 'Código Eleitoral', 'Lei nº 4.737, de 15/07/1965 (Código Eleitoral)', 'Crimes eleitorais previstos na tabela'),
  ('lei_4898_65', 'Lei 4.898/65', 'Lei nº 4.898, de 09/12/1965', 'Crimes de abuso de autoridade (lei antiga)'),
  ('lei_6091_74', 'Lei 6.091/74', 'Lei nº 6.091, de 15/08/1974', 'Crimes relacionados ao transporte de eleitores'),
  ('lei_6368_76', 'Lei 6.368/76', 'Lei nº 6.368, de 21/10/1976', 'Antiga lei de drogas (revogada pela Lei 11.343/06)'),
  ('lei_6385_76', 'Lei 6.385/76', 'Lei nº 6.385, de 07/12/1976', 'Crimes contra o mercado de capitais (CVM)'),
  ('lei_6766_79', 'Lei 6.766/79', 'Lei nº 6.766, de 19/12/1979', 'Parcelamento do solo urbano – crimes contra a administração pública'),
  ('lei_6996_82', 'Lei 6.996/82', 'Lei nº 6.996, de 07/06/1982', 'Processamento eletrônico dos serviços eleitorais'),

  ('lei_7492_86', 'Lei 7.492/86', 'Lei nº 7.492, de 16/06/1986', 'Lei dos Crimes contra o Sistema Financeiro Nacional'),
  ('lei_7716_89', 'Lei 7.716/89', 'Lei nº 7.716, de 05/01/1989', 'Define os crimes resultantes de preconceito de raça ou de cor (racismo)'),
  ('ECA', 'ECA', 'Lei nº 8.069, de 13/07/1990 (Estatuto da Criança e do Adolescente)', 'Crimes contra dignidade sexual de crianças e adolescentes'),
  ('lei_8137_90', 'Lei 8.137/90', 'Lei nº 8.137, de 27/12/1990', 'Crimes contra a ordem tributária, econômica e relações de consumo'),
  ('lei_8176_91', 'Lei 8.176/91', 'Lei nº 8.176, de 08/02/1991', 'Crimes contra a ordem econômica e o patrimônio'),
  ('lei_8666_93', 'Lei 8.666/93', 'Lei nº 8.666, de 21/06/1993', 'Licitações e Contratos – crimes contra a administração pública'),
  ('lei_9455_97', 'Lei 9.455/97', 'Lei nº 9.455, de 07/04/1997', 'Define os crimes de tortura'),
  ('lei_9504_97', 'Lei 9.504/97', 'Lei nº 9.504, de 30/09/1997', 'Lei das Eleições – crimes eleitorais'),

  ('lei_9605_98', 'Lei 9.605/98', 'Lei nº 9.605, de 12/02/1998', 'Crimes ambientais'),
  ('lei_9613_98', 'Lei 9.613/98', 'Lei nº 9.613, de 03/03/1998', 'Crimes de lavagem de dinheiro'),
  ('lei_10826_03', 'Lei 10.826/03', 'Lei nº 10.826, de 22/12/2003', 'Estatuto do Desarmamento'),
  ('lei_11101_05', 'Lei 11.101/05', 'Lei nº 11.101, de 09/02/2005', 'Nova Lei de Falências e Recuperação de Empresas'),
  ('lei_11343_06', 'Lei 11.343/06', 'Lei nº 11.343, de 23/08/2006', 'Lei de Drogas – crimes de tráfico e equiparados'),
  ('lei_12850_13', 'Lei 12.850/13', 'Lei nº 12.850, de 02/08/2013', 'Define organização criminosa e dispõe sobre investigação criminal'),
  ('lei_13260_16', 'Lei 13.260/16', 'Lei nº 13.260, de 16/03/2016', 'Regulamenta o crime de terrorismo');

-- Obs.: se algum código já existir, você pode adaptar para usar ON CONFLICT DO NOTHING.