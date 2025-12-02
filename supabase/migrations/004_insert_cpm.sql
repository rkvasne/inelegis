-- 004_insert_cpm.sql
-- Assumindo norma_id = 2 para CPM

-- =========================
-- CRIMES CONTRA A VIDA (item 9)
-- =========================
INSERT INTO artigos_inelegiveis (norma_id, artigo, paragrafo, tipo_crime, item_alinea_e) VALUES
(2, '205', NULL, 'Crimes contra a vida (CPM)', '9'),
(2, '207', NULL, 'Crimes contra a vida (CPM)', '9'),
(2, '400', NULL, 'Crimes contra a vida (CPM)', '9');

-- =========================
-- CRIMES HEDIONDOS (item 7)
-- =========================
INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
(2, '208', 'Crimes hediondos (CPM)', '7'),
(2, '401', 'Crimes hediondos (CPM)', '7'),
(2, '402', 'Crimes hediondos (CPM)', '7');

-- =========================
-- CRIMES CONTRA A DIGNIDADE SEXUAL (item 9)
-- =========================
INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
(2, '232', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '233', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '234', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '235', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '238', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '239', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '407', 'Crimes contra a dignidade sexual (CPM)', '9'),
(2, '408', 'Crimes contra a dignidade sexual (CPM)', '9');

-- =========================
-- CRIMES CONTRA O PATRIMÔNIO (item 1 e 2)
-- =========================
INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
(2, '240', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '241', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '242', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '243', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '244', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '245', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '246', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '247', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '248', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '249', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '250', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '251', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '252', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '253', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '254', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '257', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '258', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '259', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '260', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '261', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '262', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '263', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '264', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '265', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '266', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '267', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '404', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '405', 'Crimes contra o patrimônio (CPM)', '1 e 2'),
(2, '406', 'Crimes contra o patrimônio (CPM)', '1 e 2');

-- =========================
-- CRIMES CONTRA A ADMINISTRAÇÃO E FÉ PÚBLICA (item 1)
-- =========================
-- Arts. 298 a 322 e 324 a 354
DO $$
BEGIN
   FOR i IN 298..322 LOOP
      INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) 
      VALUES (2, i::text, 'Crimes contra a administração/fé pública (CPM)', '1')
      ON CONFLICT DO NOTHING;
   END LOOP;
   FOR i IN 324..354 LOOP
      INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) 
      VALUES (2, i::text, 'Crimes contra a administração/fé pública (CPM)', '1')
      ON CONFLICT DO NOTHING;
   END LOOP;
END $$;

-- =========================
-- EXCEÇÕES CPM
-- =========================
INSERT INTO artigos_excecoes (norma_id, artigo, motivo_excecao) VALUES
(2, '262', 'Quando combinado com art. 266 (crime culposo)'),
(2, '263', 'Quando combinado com art. 266 (crime culposo)'),
(2, '264', 'Quando combinado com art. 266 (crime culposo)'),
(2, '265', 'Quando combinado com art. 266 (crime culposo)'),
(2, '292', 'Parágrafo 2º (exceção prevista na tabela)'),
(2, '293', 'Parágrafo 3º (exceção prevista na tabela)'),
(2, '294', 'Parágrafo único (exceção prevista na tabela)'),
(2, '295', 'Parágrafo único (exceção prevista na tabela)'),
(2, '296', 'Parágrafo único (exceção prevista na tabela)'),
(2, '303', 'Parágrafo 3º (exceção prevista na tabela)'),
(2, '332', 'Parágrafo 2º (exceção prevista na tabela)'),
(2, '352', 'Parágrafo único (exceção prevista na tabela)');