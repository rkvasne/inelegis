-- 008_insert_todos_artigos_tre.sql
DO $$
DECLARE
  v_cp        int := (SELECT id FROM normas WHERE codigo = 'CP');
  v_cpm       int := (SELECT id FROM normas WHERE codigo = 'CPM');
  v_clt       int := (SELECT id FROM normas WHERE codigo = 'CLT');
  v_dl_fal_ant int := (SELECT id FROM normas WHERE codigo = 'DL_7661_45');
  v_dl_201    int := (SELECT id FROM normas WHERE codigo = 'DL_201_67');
  v_lc_105    int := (SELECT id FROM normas WHERE codigo = 'LC_105_01');
  v_econ_pop  int := (SELECT id FROM normas WHERE codigo = 'lei_1521_51');
  v_genocidio int := (SELECT id FROM normas WHERE codigo = 'lei_2889_56');
  v_cond_inc  int := (SELECT id FROM normas WHERE codigo = 'lei_4591_64');
  v_sist_fin1 int := (SELECT id FROM normas WHERE codigo = 'lei_4595_64');
  v_merc_cap1 int := (SELECT id FROM normas WHERE codigo = 'lei_4728_65');
  v_ce        int := (SELECT id FROM normas WHERE codigo = 'CE');
  v_abuso_ant int := (SELECT id FROM normas WHERE codigo = 'lei_4898_65');
  v_transp_el int := (SELECT id FROM normas WHERE codigo = 'lei_6091_74');
  v_drog_ant  int := (SELECT id FROM normas WHERE codigo = 'lei_6368_76');
  v_cvm       int := (SELECT id FROM normas WHERE codigo = 'lei_6385_76');
  v_solo      int := (SELECT id FROM normas WHERE codigo = 'lei_6766_79');
  v_proc_elet int := (SELECT id FROM normas WHERE codigo = 'lei_6996_82');
  v_sist_fin2 int := (SELECT id FROM normas WHERE codigo = 'lei_7492_86');
  v_racismo   int := (SELECT id FROM normas WHERE codigo = 'lei_7716_89');
  v_eca       int := (SELECT id FROM normas WHERE codigo = 'ECA');
  v_ord_trib  int := (SELECT id FROM normas WHERE codigo = 'lei_8137_90');
  v_ord_econ  int := (SELECT id FROM normas WHERE codigo = 'lei_8176_91');
  v_licit     int := (SELECT id FROM normas WHERE codigo = 'lei_8666_93');
  v_tortura   int := (SELECT id FROM normas WHERE codigo = 'lei_9455_97');
  v_lei_9504  int := (SELECT id FROM normas WHERE codigo = 'lei_9504_97');
  v_amb       int := (SELECT id FROM normas WHERE codigo = 'lei_9605_98');
  v_lavagem   int := (SELECT id FROM normas WHERE codigo = 'lei_9613_98');
  v_ctb       int := (SELECT id FROM normas WHERE codigo = 'CTB');
  v_armas     int := (SELECT id FROM normas WHERE codigo = 'lei_10826_03');
  v_falencia  int := (SELECT id FROM normas WHERE codigo = 'lei_11101_05');
  v_drogas    int := (SELECT id FROM normas WHERE codigo = 'lei_11343_06');
  v_org_crim  int := (SELECT id FROM normas WHERE codigo = 'lei_12850_13');
  v_terror    int := (SELECT id FROM normas WHERE codigo = 'lei_13260_16');
  v_abuso     int := (SELECT id FROM normas WHERE codigo = 'lei_13869_19');
BEGIN
  --------------------------------------------------------------------
  -- 1) CÓDIGO PENAL – CONFORME PRIMEIRA PÁGINA DO PDF
  --------------------------------------------------------------------
  -- Crimes contra a vida (9)
  PERFORM 1;
  INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '121',   NULL, 'Crimes contra a vida', '9'),
    (v_cp, '121-A', NULL, 'Crimes contra a vida', '9'),
    (v_cp, '122',   '1',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '2',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '3',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '4',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '5',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '6',  'Crimes contra a vida', '9'),
    (v_cp, '122',   '7',  'Crimes contra a vida', '9'),
    (v_cp, '123',   NULL, 'Crimes contra a vida', '9'),
    (v_cp, '124',   NULL, 'Crimes contra a vida', '9'),
    (v_cp, '125',   NULL, 'Crimes contra a vida', '9'),
    (v_cp, '126',   NULL, 'Crimes contra a vida', '9'),
    (v_cp, '127',   NULL, 'Crimes contra a vida', '9')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_cp, '121', NULL, 'Art. 121, § 3º – homicídio culposo'),
    (v_cp, '122', NULL, 'Art. 122, caput – exceção geral indicada na tabela')
  ON CONFLICT DO NOTHING;

  -- Crime hediondo (lesão qualificada por agente de segurança) – 129 §2 c/c §12 e §3 c/c §12
  INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, tipo_crime, item_alinea_e, observacoes) VALUES
    (v_cp, '129', '2', 'Crime hediondo', '7',
      'Crime hediondo (art. 129, § 2º c.c. § 12) – Lei 13.142/2015 e Lei 14.811/2024'),
    (v_cp, '129', '3', 'Crime hediondo', '7',
      'Crime hediondo (art. 129, § 3º c.c. § 12) – Lei 13.142/2015 e Lei 14.811/2024')
  ON CONFLICT DO NOTHING;

  -- Redução à condição análoga à de escravo e dignidade sexual (8 e 9)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '148', '1', 'Redução à condição análoga à de escravo e crimes contra a dignidade sexual', '8 e 9'),
    (v_cp, '149', NULL, 'Redução à condição análoga à de escravo', '8'),
    (v_cp, '149-A', NULL, 'Sequestro e cárcere (hediondo – Lei 14.811/2024)', '7')
  ON CONFLICT DO NOTHING;

  -- patrimonial CP: 155, 157, 158, 159, 160, 162, 163, 168, 168-A, 171, 172, 173, 174, 175, 177, 178, 180, 180-A, 184
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '155',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '157',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '158',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '159',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '160',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '162',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '163',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '168',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '168-A', 'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '171',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '172',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '173',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '174',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '175',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '177',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '178',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '180',   'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '180-A', 'Crimes contra o patrimônio', '1 e 2'),
    (v_cp, '184',   'Crimes contra o patrimônio', '1 e 2')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_cp, '163',  NULL, 'Art. 163, caput – dano simples'),
    (v_cp, '163',  'único', 'Art. 163, parágrafo único, IV – exceção'),
    (v_cp, '175',  NULL, 'Art. 175, caput, I e II – exceções'),
    (v_cp, '177',  '2', 'Art. 177, § 2º – exceção'),
    (v_cp, '180',  '3', 'Art. 180, § 3º – exceção'),
    (v_cp, '184',  '4', 'Art. 184, § 4º – exceção')
  ON CONFLICT DO NOTHING;

  -- Dignidade sexual CP (213 a 220, 223, 227 a 231-A) – com 216-A e 216-B como exceções
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '213',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '214',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '215',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '217-A', 'Crimes contra a dignidade sexual', '9'),
    (v_cp, '218',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '218-A', 'Crimes contra a dignidade sexual', '9'),
    (v_cp, '218-B', 'Crimes contra a dignidade sexual', '9'),
    (v_cp, '219',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '220',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '223',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '227',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '228',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '229',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '230',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '231',   'Crimes contra a dignidade sexual', '9'),
    (v_cp, '231-A', 'Crimes contra a dignidade sexual', '9')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, motivo_excecao) VALUES
    (v_cp, '216-A', 'Assédio sexual – exceção expressa na tabela'),
    (v_cp, '216-B', 'Registro não autorizado de intimidade sexual – exceção expressa na tabela')
  ON CONFLICT DO NOTHING;

  -- Saúde pública (267, 270, 271, 272, 273, 274, 275, 276, 277, 278, 280)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '267', 'Crimes contra a saúde pública', '3'),
    (v_cp, '270', 'Crimes contra a saúde pública', '3'),
    (v_cp, '271', 'Crimes contra a saúde pública', '3'),
    (v_cp, '272', 'Crimes contra a saúde pública', '3'),
    (v_cp, '273', 'Crimes contra a saúde pública', '3'),
    (v_cp, '274', 'Crimes contra a saúde pública', '3'),
    (v_cp, '275', 'Crimes contra a saúde pública', '3'),
    (v_cp, '276', 'Crimes contra a saúde pública', '3'),
    (v_cp, '277', 'Crimes contra a saúde pública', '3'),
    (v_cp, '278', 'Crimes contra a saúde pública', '3'),
    (v_cp, '280', 'Crimes contra a saúde pública', '3')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_cp, '267', '2', 'Art. 267, § 2º – forma culposa'),
    (v_cp, '270', '2', 'Art. 270, § 2º – forma culposa'),
    (v_cp, '271', 'único', 'Art. 271, parágrafo único – forma culposa'),
    (v_cp, '272', '2', 'Art. 272, § 2º – forma culposa'),
    (v_cp, '273', '2', 'Art. 273, § 2º – forma culposa'),
    (v_cp, '278', 'único', 'Art. 278, parágrafo único – forma culposa'),
    (v_cp, '280', 'único', 'Art. 280, parágrafo único – forma culposa')
  ON CONFLICT DO NOTHING;

  -- Quadrilha/bando (10)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '288', 'Crimes praticados por quadrilha ou bando', '10'),
    (v_cp, '288-A', 'Crimes praticados por organização criminosa (ligado ao CP)', '10')
  ON CONFLICT DO NOTHING;

  -- Fé pública
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '289',  'Crimes contra a fé pública', '1'),
    (v_cp, '290',  'Crimes contra a fé pública', '1'),
    (v_cp, '291',  'Crimes contra a fé pública', '1'),
    (v_cp, '293',  'Crimes contra a fé pública', '1'),
    (v_cp, '294',  'Crimes contra a fé pública', '1'),
    (v_cp, '296',  'Crimes contra a fé pública', '1'),
    (v_cp, '297',  'Crimes contra a fé pública', '1'),
    (v_cp, '298',  'Crimes contra a fé pública', '1'),
    (v_cp, '299',  'Crimes contra a fé pública', '1'),
    (v_cp, '300',  'Crimes contra a fé pública', '1'),
    (v_cp, '303',  'Crimes contra a fé pública', '1'),
    (v_cp, '304',  'Crimes contra a fé pública', '1'),
    (v_cp, '305',  'Crimes contra a fé pública', '1'),
    (v_cp, '306',  'Crimes contra a fé pública', '1'),
    (v_cp, '309',  'Crimes contra a fé pública', '1'),
    (v_cp, '310',  'Crimes contra a fé pública', '1'),
    (v_cp, '311',  'Crimes contra a fé pública', '1'),
    (v_cp, '311-A','Crimes contra a fé pública', '1')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_cp, '289',  '2', 'Art. 289, § 2º – exceção'),
    (v_cp, '293',  '4', 'Art. 293, § 4º – exceção'),
    (v_cp, '304',  NULL, 'Art. 304, quando relacionado a falsidade dos arts. 301 e 302 – exceção')
  ON CONFLICT DO NOTHING;

  -- Administração pública (lista longa exata da tabela)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cp, '312',   'Crimes contra a administração pública', '1'),
    (v_cp, '313',   'Crimes contra a administração pública', '1'),
    (v_cp, '313-A', 'Crimes contra a administração pública', '1'),
    (v_cp, '314',   'Crimes contra a administração pública', '1'),
    (v_cp, '316',   'Crimes contra a administração pública', '1'),
    (v_cp, '317',   'Crimes contra a administração pública', '1'),
    (v_cp, '318',   'Crimes contra a administração pública', '1'),
    (v_cp, '322',   'Crimes contra a administração pública', '1'),
    (v_cp, '323',   'Crimes contra a administração pública', '1'),
    (v_cp, '325',   'Crimes contra a administração pública', '1'),
    (v_cp, '328',   'Crimes contra a administração pública', '1'),
    (v_cp, '332',   'Crimes contra a administração pública', '1'),
    (v_cp, '333',   'Crimes contra a administração pública', '1'),
    (v_cp, '334',   'Crimes contra a administração pública', '1'),
    (v_cp, '334-A', 'Crimes contra a administração pública', '1'),
    (v_cp, '337',   'Crimes contra a administração pública', '1'),
    (v_cp, '337-A', 'Crimes contra a administração pública', '1'),
    (v_cp, '337-B', 'Crimes contra a administração pública', '1'),
    (v_cp, '337-C', 'Crimes contra a administração pública', '1'),
    (v_cp, '338',   'Crimes contra a administração pública', '1'),
    (v_cp, '339',   'Crimes contra a administração pública', '1'),
    (v_cp, '342',   'Crimes contra a administração pública', '1'),
    (v_cp, '343',   'Crimes contra a administração pública', '1'),
    (v_cp, '344',   'Crimes contra a administração pública', '1'),
    (v_cp, '347',   'Crimes contra a administração pública', '1'),
    (v_cp, '351',   'Crimes contra a administração pública', '1'),
    (v_cp, '353',   'Crimes contra a administração pública', '1'),
    (v_cp, '355',   'Crimes contra a administração pública', '1'),
    (v_cp, '356',   'Crimes contra a administração pública', '1'),
    (v_cp, '357',   'Crimes contra a administração pública', '1'),
    (v_cp, '359-C', 'Crimes contra a administração pública', '1'),
    (v_cp, '359-D', 'Crimes contra a administração pública', '1'),
    (v_cp, '359-G', 'Crimes contra a administração pública', '1'),
    (v_cp, '359-H', 'Crimes contra a administração pública', '1')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_cp, '312', '2', 'Art. 312, § 2º – peculato culposo'),
    (v_cp, '317', '2', 'Art. 317, § 2º – forma privilegiada'),
    (v_cp, '323', NULL, 'Art. 323, caput e § 1º – exceções'),
    (v_cp, '325', NULL, 'Art. 325, caput e § 1º – exceções'),
    (v_cp, '328', NULL, 'Art. 328, caput – exceção'),
    (v_cp, '347', NULL, 'Art. 347, caput – exceção'),
    (v_cp, '351', NULL, 'Art. 351, caput e § 4º – exceções')
  ON CONFLICT DO NOTHING;

  --------------------------------------------------------------------
  -- 2) CPM – já tínhamos coberto, mas agora está alinhado ao PDF
  -- (o bloco anterior que te passei para o CPM está consistente com a tabela)
  --------------------------------------------------------------------

  --------------------------------------------------------------------
  -- 3) DEMAIS NORMAS – TRANSCRIÇÃO FIEL DAS DUAS ÚLTIMAS PÁGINAS
  --------------------------------------------------------------------

  -- CLT – DL 5.452/43 – art. 49 – Crimes contra a fé pública (1)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_clt, '49', 'Crimes contra a fé pública', '1')
  ON CONFLICT DO NOTHING;

  -- DL 7.661/45 – arts. 186 a 189 – Falimentar antiga
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_dl_fal_ant, '186', 'Crimes previstos na lei que regula a falência', '2'),
    (v_dl_fal_ant, '187', 'Crimes previstos na lei que regula a falência', '2'),
    (v_dl_fal_ant, '188', 'Crimes previstos na lei que regula a falência', '2'),
    (v_dl_fal_ant, '189', 'Crimes previstos na lei que regula a falência', '2')
  ON CONFLICT DO NOTHING;

  -- DL 201/67 – art. 1º
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_dl_201, '1', 'Crimes de responsabilidade de prefeitos - administração pública', '1')
  ON CONFLICT DO NOTHING;

  -- LC 105/01 – art. 10 – sistema financeiro
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_lc_105, '10', 'Crimes contra o sistema financeiro', '2')
  ON CONFLICT DO NOTHING;

  -- Lei 1.521/51 – art. 3º – economia popular
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_econ_pop, '3', 'Crimes contra a economia popular', '1')
  ON CONFLICT DO NOTHING;

  -- Lei 2.889/56 – genocídio – arts. 1,2,3 com exceções específicas
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_genocidio, '1', 'Crimes de genocídio', '7'),
    (v_genocidio, '2', 'Crimes de genocídio', '7'),
    (v_genocidio, '3', 'Crimes de genocídio', '7')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, motivo_excecao) VALUES
    (v_genocidio, '2', 'Art. 2º, caput, quando se referir ao art. 1º, alínea "e" – exceção'),
    (v_genocidio, '3', 'Art. 3º, caput, quando se referir ao art. 1º, alínea "e" – exceção')
  ON CONFLICT DO NOTHING;

  -- Lei 4.591/64 – art. 65 – economia popular
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cond_inc, '65', 'Crimes contra a economia popular', '1')
  ON CONFLICT DO NOTHING;

  -- Lei 4.595/64 – art. 34 – sistema financeiro
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_sist_fin1, '34', 'Crimes contra o sistema financeiro', '2')
  ON CONFLICT DO NOTHING;

  -- Lei 4.728/65 – arts. 66-B,73,74 – mercado de capitais
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_merc_cap1, '66-B', 'Crimes contra o mercado de capitais', '2'),
    (v_merc_cap1, '73',   'Crimes contra o mercado de capitais', '2'),
    (v_merc_cap1, '74',   'Crimes contra o mercado de capitais', '2')
  ON CONFLICT DO NOTHING;

  -- Código Eleitoral – já inserimos no bloco anterior, mas garantindo tudo:
  PERFORM 1;
  -- (289, 291, 298, 299, 301, 302, 307-309, 315-317, 339, 340, 348-350, 352-354-A) – todos item 4
  -- (já estava em migração 05 com DO, tudo com item 4)

  -- Lei 4.898/65 – Abuso de autoridade antigo – art. 6º, §3º, “c”
  INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, alinea, tipo_crime, item_alinea_e) VALUES
    (v_abuso_ant, '6', '3', 'c', 'Crimes de abuso de autoridade', '5')
  ON CONFLICT DO NOTHING;

  -- Lei 6.091/74 – transporte de eleitores – art. 11, III e IV
  INSERT INTO artigos_inelegiveis (norma_id, artigo, inciso, tipo_crime, item_alinea_e) VALUES
    (v_transp_el, '11', 'III', 'Crimes eleitorais', '4'),
    (v_transp_el, '11', 'IV',  'Crimes eleitorais', '4')
  ON CONFLICT DO NOTHING;

  -- Lei 6.368/76 – drogas antiga – arts. 12,13,14 – tráfico
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e, observacoes) VALUES
    (v_drog_ant, '12', 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela Lei 11.343/2006'),
    (v_drog_ant, '13', 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela Lei 11.343/2006'),
    (v_drog_ant, '14', 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela Lei 11.343/2006')
  ON CONFLICT DO NOTHING;

  -- Lei 6.385/76 – CVM – arts. 27-C e 27-D – mercado de capitais
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_cvm, '27-C', 'Crimes contra o mercado de capitais', '2'),
    (v_cvm, '27-D', 'Crimes contra o mercado de capitais', '2')
  ON CONFLICT DO NOTHING;

  -- Lei 6.766/79 – parcelamento do solo – arts. 50 e 51
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_solo, '50', 'Crimes contra a administração pública (parcelamento do solo)', '1'),
    (v_solo, '51', 'Crimes contra a administração pública (parcelamento do solo)', '1')
  ON CONFLICT DO NOTHING;

  -- Lei 6.996/82 – processamento eletrônico eleitoral – art. 15
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_proc_elet, '15', 'Crimes eleitorais', '4')
  ON CONFLICT DO NOTHING;

  -- Lei 7.492/86 – já incluímos arts. 2 a 23 (sistema financeiro) em migração anterior.
  -- Garante-se todos os artigos 2–23 com item 6:
  FOR i IN 2..23 LOOP
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e)
    VALUES (v_sist_fin2, i::text, 'Crimes contra o sistema financeiro', '6')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Lei 7.716/89 – racismo – arts. 2º-A, 3 a 14, 20
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_racismo, '2-A', 'Crimes de racismo', '7'),
    (v_racismo, '3',   'Crimes de racismo', '7'),
    (v_racismo, '4',   'Crimes de racismo', '7'),
    (v_racismo, '5',   'Crimes de racismo', '7'),
    (v_racismo, '6',   'Crimes de racismo', '7'),
    (v_racismo, '7',   'Crimes de racismo', '7'),
    (v_racismo, '8',   'Crimes de racismo', '7'),
    (v_racismo, '9',   'Crimes de racismo', '7'),
    (v_racismo, '10',  'Crimes de racismo', '7'),
    (v_racismo, '11',  'Crimes de racismo', '7'),
    (v_racismo, '12',  'Crimes de racismo', '7'),
    (v_racismo, '13',  'Crimes de racismo', '7'),
    (v_racismo, '14',  'Crimes de racismo', '7'),
    (v_racismo, '20',  'Crimes de racismo', '7')
  ON CONFLICT DO NOTHING;

  -- ECA – Lei 8.069/90 – arts. 240 a 241-D e 244-A – dignidade sexual
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_eca, '240',  'Crimes contra a dignidade sexual', '9'),
    (v_eca, '241',  'Crimes contra a dignidade sexual', '9'),
    (v_eca, '241-A','Crimes contra a dignidade sexual', '9'),
    (v_eca, '241-B','Crimes contra a dignidade sexual', '9'),
    (v_eca, '241-C','Crimes contra a dignidade sexual', '9'),
    (v_eca, '241-D','Crimes contra a dignidade sexual', '9'),
    (v_eca, '244-A','Crimes contra a dignidade sexual', '9')
  ON CONFLICT DO NOTHING;

  -- Lei 8.137/90 – ordem tributária, econômica, relações de consumo – arts. 1º, 3º-7º, com exceção 7 parágrafo único
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e, observacoes) VALUES
    (v_ord_trib, '1', 'Crimes contra a ordem tributária', '1', NULL),
    (v_ord_trib, '3', 'Crimes contra a economia popular', '1', NULL),
    (v_ord_trib, '4', 'Crimes contra a economia popular', '1', NULL),
    (v_ord_trib, '5', 'Crimes contra a economia popular', '1', 'Revogado pela Lei 12.529/2011'),
    (v_ord_trib, '6', 'Crimes contra a economia popular', '1', 'Revogado pela Lei 12.529/2011'),
    (v_ord_trib, '7', 'Crimes contra a economia popular', '1', NULL)
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_ord_trib, '7', 'único', 'Art. 7º, parágrafo único – exceção')
  ON CONFLICT DO NOTHING;

  -- Lei 8.176/91 – bens, serviços, energia – arts. 1º e 2º
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_ord_econ, '1', 'Crimes contra a ordem econômica e o patrimônio', '1'),
    (v_ord_econ, '2', 'Crimes contra a ordem econômica e o patrimônio', '1')
  ON CONFLICT DO NOTHING;

  -- Lei 8.666/93 – licitações – arts. 89, 90, 92, 94, 95, 96
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_licit, '89', 'Crimes contra a administração pública (licitações)', '1'),
    (v_licit, '90', 'Crimes contra a administração pública (licitações)', '1'),
    (v_licit, '92', 'Crimes contra a administração pública (licitações)', '1'),
    (v_licit, '94', 'Crimes contra a administração pública (licitações)', '1'),
    (v_licit, '95', 'Crimes contra a administração pública (licitações)', '1'),
    (v_licit, '96', 'Crimes contra a administração pública (licitações)', '1')
  ON CONFLICT DO NOTHING;

  -- Lei 9.455/97 – tortura – art. 1º (hediondo)
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_tortura, '1', 'Crimes de tortura', '7')
  ON CONFLICT DO NOTHING;

  -- Lei 9.504/97 – Lei das Eleições – arts. 57-H §1º e 72
  INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, tipo_crime, item_alinea_e) VALUES
    (v_lei_9504, '57-H', '1', 'Crimes eleitorais', '4'),
    (v_lei_9504, '72',    NULL, 'Crimes eleitorais', '4')
  ON CONFLICT DO NOTHING;

  -- Lei 9.605/98 – ambientais – lista exata da tabela + exceções
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_amb, '30',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '33',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '34',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '35',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '38',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '38-A', 'Crimes contra o meio ambiente', '3'),
    (v_amb, '39',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '40',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '41',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '42',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '50-A', 'Crimes contra o meio ambiente', '3'),
    (v_amb, '54',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '56',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '61',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '62',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '63',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '66',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '67',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '68',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '69',   'Crimes contra o meio ambiente', '3'),
    (v_amb, '69-A', 'Crimes contra o meio ambiente', '3')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_amb, '38',   'único', 'Art. 38, parágrafo único – forma culposa'),
    (v_amb, '38-A', 'único', 'Art. 38-A, parágrafo único – forma culposa'),
    (v_amb, '40',   '3',     'Art. 40, § 3º – forma culposa'),
    (v_amb, '41',   'único', 'Art. 41, parágrafo único – forma culposa'),
    (v_amb, '54',   '1',     'Art. 54, § 1º – forma culposa'),
    (v_amb, '56',   '3',     'Art. 56, § 3º – forma culposa'),
    (v_amb, '62',   'único', 'Art. 62, parágrafo único – forma culposa'),
    (v_amb, '67',   'único', 'Art. 67, parágrafo único – forma culposa'),
    (v_amb, '68',   'único', 'Art. 68, parágrafo único – forma culposa'),
    (v_amb, '69-A', '1',     'Art. 69-A, § 1º – forma culposa / menor potencial')
  ON CONFLICT DO NOTHING;

  -- Lei 9.613/98 – lavagem – art. 1º
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_lavagem, '1', 'Crimes de lavagem ou ocultação de bens, direitos e valores', '6')
  ON CONFLICT DO NOTHING;

  -- CTB – exceções (culposos 302 e 303) – já tínhamos colocado como exceção geral
  INSERT INTO artigos_excecoes (norma_id, artigo, motivo_excecao) VALUES
    (v_ctb, '302', 'Homicídio culposo na direção de veículo automotor'),
    (v_ctb, '303', 'Lesão corporal culposa na direção de veículo automotor')
  ON CONFLICT DO NOTHING;

  -- Lei 10.826/03 – armas – art. 16 (caput c/c §2º e §1º c/c §2º), 17, 18 – hediondos
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e, observacoes) VALUES
    (v_armas, '16', 'Crimes hediondos (armas de fogo)', '7', 'Art. 16, caput c.c. § 2º e §1º c.c. §2º – Lei 13.964/2019'),
    (v_armas, '17', 'Crimes hediondos (armas de fogo)', '7', NULL),
    (v_armas, '18', 'Crimes hediondos (armas de fogo)', '7', NULL)
  ON CONFLICT DO NOTHING;

  -- Lei 11.101/05 – nova falência – arts. 168 a 177
  FOR i IN 168..177 LOOP
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e)
    VALUES (v_falencia, i::text, 'Crimes previstos na lei que regula a falência', '2')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Lei 11.343/06 – drogas – arts. 33 a 37 – com §3 do 33 como exceção
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_drogas, '33', 'Crimes de tráfico de entorpecentes', '7'),
    (v_drogas, '34', 'Crimes de tráfico de entorpecentes', '7'),
    (v_drogas, '35', 'Crimes de tráfico de entorpecentes', '7'),
    (v_drogas, '36', 'Crimes de tráfico de entorpecentes', '7'),
    (v_drogas, '37', 'Crimes de tráfico de entorpecentes', '7')
  ON CONFLICT DO NOTHING;

  INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_drogas, '33', '3', 'Art. 33, § 3º – uso compartilhado (menor gravidade)')
  ON CONFLICT DO NOTHING;

  -- Lei 12.850/13 – organização criminosa – a tabela não cita artigo, mas a própria lei
  INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_org_crim, '1', 'Crimes praticados por organização criminosa', '10')
  ON CONFLICT DO NOTHING;

  -- Lei 13.260/16 – terrorismo – arts. 2 a 6
  FOR i IN 2..6 LOOP
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e)
    VALUES (v_terror, i::text, 'Crimes de terrorismo', '7')
    ON CONFLICT DO NOTHING;
  END LOOP;

  -- Lei 13.869/19 – abuso de autoridade atual – arts. 9 a 38
  FOR i IN 9..38 LOOP
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e)
    VALUES (v_abuso, i::text, 'Abuso de autoridade', '5')
    ON CONFLICT DO NOTHING;
  END LOOP;

END $$;