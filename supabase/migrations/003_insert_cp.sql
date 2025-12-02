-- 003_insert_cp.sql

-- Descobrir o id da norma CP
-- (em Supabase, você pode só rodar o SELECT para ver)
-- SELECT id FROM normas WHERE codigo = 'CP';

-- Aqui vou assumir que o id retornado é 1.
-- Se for diferente, ajuste o valor de norma_id nos INSERTs abaixo.

-- =========================
-- CRIMES CONTRA A VIDA (item 9)
-- =========================
INSERT INTO artigos_inelegiveis 
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '121',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),            -- homicídio simples (caput)
  (1, '121-A',NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),            -- induzimento a automutilação (inserido por lei nova)
  (1, '122',  '1',  NULL, NULL, 'Crimes contra a vida', '9', NULL),            -- §1º
  (1, '122',  '2',  NULL, NULL, 'Crimes contra a vida', '9', NULL),            -- §2º
  (1, '122',  '3',  NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '122',  '4',  NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '122',  '5',  NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '122',  '6',  NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '122',  '7',  NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '123',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '124',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '125',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '126',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL),
  (1, '127',  NULL, NULL, NULL, 'Crimes contra a vida', '9', NULL);

-- Exceções:
INSERT INTO artigos_excecoes
  (norma_id, artigo, paragrafo, inciso, alinea, motivo_excecao)
VALUES
  (1, '121', '3', NULL, NULL, 'Homicídio culposo (art. 121, §3º, CP)'),
  (1, '122', NULL, NULL, NULL, 'Forma simples (caput) não alcançada pela tabela – inelegibilidade apenas para §§1º a 7º');


-- =========================
-- CRIMES HEDIONDOS (item 7) vinculados à tabela (CP)
-- =========================
INSERT INTO artigos_inelegiveis 
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '129', '2', NULL, NULL, 'Lesão corporal gravíssima contra autoridade ou agente – crime hediondo', '7',
     'Crime definido como hediondo pela Lei 13.142/2015'),
  (1, '129', '3', NULL, NULL, 'Lesão corporal seguida de morte contra autoridade ou agente – crime hediondo', '7',
     'Crime definido como hediondo pela Lei 13.142/2015'),
  (1, '148', '1', 'IV', NULL, 'Sequestro e cárcere privado em circunstância hedionda', '7',
     'Incluído como hediondo em razão da Lei 13.142/2015 e Lei 14.811/2024');


-- =========================
-- CRIME DE REDUÇÃO À CONDIÇÃO ANÁLOGA À DE ESCRAVO / DIGNIDADE SEXUAL (itens 8 e 9)
-- =========================
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '149',  NULL, NULL, NULL, 'Redução à condição análoga à de escravo', '8 e 9', NULL),
  (1, '149-A',NULL, NULL, NULL, 'Crime contra a dignidade sexual (tráfico de pessoas)', '8 e 9',
     'Crime definido como hediondo pela Lei 14.811/2024');


-- =========================
-- CRIMES CONTRA O PATRIMÔNIO (item 1 e 2)
-- =========================
-- conforme tabela: Arts. 155, 157, 158, 159, 160, 162, 163, 168, 168-A, 171, 172, 173, 174, 175, 177, 178, 180, 180-A e 184
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '155',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '157',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '158',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '159',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '160',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '162',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '163',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '168',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '168-A', NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '171',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '172',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '173',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '174',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '175',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '177',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '178',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '180',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '180-A', NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL),
  (1, '184',   NULL, NULL, NULL, 'Crimes contra o patrimônio', '1 e 2', NULL);

-- Exceções de patrimônio, segundo a tabela:
--  Art. 163, caput
--  Art. 163, parágrafo único, IV
--  Art. 175, caput e incisos I e II
--  Art. 177, §2º
--  Art. 180, §3º
--  Art. 184, §4º
INSERT INTO artigos_excecoes
  (norma_id, artigo, paragrafo, inciso, alinea, motivo_excecao)
VALUES
  (1, '163', NULL, NULL, NULL, 'Dano simples – crime de menor potencial ofensivo'),
  (1, '163', NULL, 'IV', NULL, 'Forma privilegiada (mínima ofensividade)'),
  (1, '175', NULL, NULL, NULL, 'Fraude no comércio em forma simples – menor potencial ofensivo'),
  (1, '175', NULL, 'I',  NULL, 'Fraude no comércio – forma de menor gravidade'),
  (1, '175', NULL, 'II', NULL, 'Fraude no comércio – forma de menor gravidade'),
  (1, '177', '2', NULL, NULL, 'Hipótese de menor gravidade (prevista como exceção na tabela do TRE)'),
  (1, '180', '3', NULL, NULL, 'Receptação culposa'),
  (1, '184', '4', NULL, NULL, 'Violação de direito autoral – forma privilegiada (ex.: venda de CDs/DVDs etc.)');


-- =========================
-- CRIMES CONTRA A DIGNIDADE SEXUAL (item 9)
-- =========================
-- Tabela: Arts. 213 a 220, 223, 227 a 231-A; e menciona 216-A, 216-B
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '213',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '214',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'art. revogado – permanece referência histórica na tabela'),
  (1, '215',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '216-A', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'assédio sexual (com ajustes na tabela em 2024)'),
  (1, '216-B', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'registro não autorizado de intimidade sexual (ajuste 2024)'),
  (1, '217-A', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '218',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '218-A', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '218-B', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '219',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'revogado – referência histórica'),
  (1, '220',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'revogado – referência histórica'),
  (1, '221',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '222',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '223',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'revogado – referência histórica'),
  (1, '224',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '225',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '226',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '227',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '228',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '229',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '230',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', NULL),
  (1, '231',   NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'revogado – referência histórica'),
  (1, '231-A', NULL, NULL, NULL, 'Crimes contra a dignidade sexual', '9', 'revogado – referência histórica');


-- =========================
-- CRIMES CONTRA A SAÚDE PÚBLICA (item 3)
-- =========================
-- Tabela: Arts. 267, 270, 271, 272, 273, 274, 275, 276, 277, 278 e 280
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '267', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '270', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '271', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '272', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '273', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '274', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '275', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '276', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '277', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '278', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL),
  (1, '280', NULL, NULL, NULL, 'Crimes contra a saúde pública', '3', NULL);

-- Exceções de saúde pública:
-- 267 §2º; 270 §2º; 271 par. ún.; 272 §2º; 273 §2º; 278 par. ún.; 280 par. ún.
INSERT INTO artigos_excecoes
  (norma_id, artigo, paragrafo, inciso, alinea, motivo_excecao)
VALUES
  (1, '267', '2', NULL, NULL, 'Hipótese de menor gravidade prevista como exceção na tabela'),
  (1, '270', '2', NULL, NULL, 'Hipótese de menor gravidade prevista como exceção na tabela'),
  (1, '271', NULL, NULL, NULL, 'Parágrafo único considerado de menor ofensividade na tabela'),
  (1, '272', '2', NULL, NULL, 'Hipótese de menor gravidade prevista como exceção na tabela'),
  (1, '273', '2', NULL, NULL, 'Hipótese de menor gravidade prevista como exceção na tabela'),
  (1, '278', NULL, NULL, NULL, 'Parágrafo único considerado exceção (menor potencial)'),
  (1, '280', NULL, NULL, NULL, 'Parágrafo único considerado exceção (menor potencial)');


-- =========================
-- CRIMES CONTRA A FÉ PÚBLICA (item 1) – CP
-- =========================
-- Tabela: Arts. 289, 290, 291, 293, 294, 296 a 300, 303, 304, 305, 306, 309, 310, 311, 311-A
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '289', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '290', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '291', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '293', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '294', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '296', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '297', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '298', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '299', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '300', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '303', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '304', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '305', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '306', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '309', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '310', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '311', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL),
  (1, '311-A', NULL, NULL, NULL, 'Crimes contra a fé pública', '1', NULL);

-- Exceções: 289 §2º; 293 §4º; 304 quando baseada em 301 e 302
INSERT INTO artigos_excecoes
  (norma_id, artigo, paragrafo, inciso, alinea, motivo_excecao)
VALUES
  (1, '289', '2', NULL, NULL, 'Forma privilegiada do crime de moeda falsa'),
  (1, '293', '4', NULL, NULL, 'Hipótese de menor gravidade de falsificação de selo ou sinal'),
  (1, '304', NULL, NULL, NULL, 'Quando o documento se enquadra nos arts. 301 e 302 (forma de menor gravidade)');
  

-- =========================
-- CRIMES CONTRA A ADMINISTRAÇÃO PÚBLICA (item 1) – CP
-- =========================
-- Tabela: Arts. 312, 313, 313-A, 314, 316, 317, 318, 322, 323, 325, 328, 332, 333,
--         334, 334-A, 337, 337-A, 337-B, 337-C, 338, 339, 342, 343, 344, 347 (par. ún),
--         351, 353, 355, 356, 357, 359-C, 359-D, 359-G, 359-H
INSERT INTO artigos_inelegiveis
  (norma_id, artigo, paragrafo, inciso, alinea, tipo_crime, item_alinea_e, observacoes)
VALUES
  (1, '312',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '313',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '313-A', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '314',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '316',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '317',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '318',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '322',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '323',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '325',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '328',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '332',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '333',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '334',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '334-A', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '337',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '337-A', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '337-B', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '337-C', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '338',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '339',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '342',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '343',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '344',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '347',   '0', NULL, NULL, 'Crimes contra a administração pública', '1', 'considera-se o parágrafo único como núcleo relevante'),
  (1, '351',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '353',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '355',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '356',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '357',   NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '359-C', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '359-D', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '359-G', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL),
  (1, '359-H', NULL, NULL, NULL, 'Crimes contra a administração pública', '1', NULL);

-- Exceções de administração pública:
--  Art. 312, §2º; 317 §2º; 323 caput e §1º; 325 caput e §1º; 328 caput; 347 caput; 351 caput e §4º
INSERT INTO artigos_excecoes
  (norma_id, artigo, paragrafo, inciso, alinea, motivo_excecao)
VALUES
  (1, '312', '2', NULL, NULL, 'Forma privilegiada do peculato'),
  (1, '317', '2', NULL, NULL, 'Forma privilegiada da corrupção passiva'),
  (1, '323', NULL, NULL, NULL, 'Forma de menor gravidade de abandono de função'),
  (1, '323', '1', NULL, NULL, 'Hipótese de menor gravidade (§1º)'),
  (1, '325', NULL, NULL, NULL, 'Violação de sigilo funcional de menor gravidade'),
  (1, '325', '1', NULL, NULL, 'Hipótese de menor gravidade (§1º)'),
  (1, '328', NULL, NULL, NULL, 'Usurpação de função pública – forma simples excecionada pela tabela'),
  (1, '347', NULL, NULL, NULL, 'Caput como exceção (só parágrafo único considerado inelegível)'),
  (1, '351', NULL, NULL, NULL, 'Caput e §4º excepcionados em razão de menor gravidade');