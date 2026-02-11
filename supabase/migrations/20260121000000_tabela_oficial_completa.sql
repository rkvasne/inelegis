-- =====================================================
-- Migration 002: Tabela Oficial Completa e Corrigida
-- =====================================================
-- Baseado na Tabela Exemplificativa da Corregedoria Regional Eleitoral de São Paulo
-- LC 64/90, atualizada pela LC 135/2010
-- Última atualização da tabela: outubro/2024
-- Data da migration: 05/02/2026

-- Drop da tabela antiga e recriação com estrutura melhorada
DROP TABLE IF EXISTS crimes_inelegibilidade CASCADE;
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(character varying, character varying, character varying, character varying, character varying);

-- Nova estrutura otimizada
CREATE TABLE IF NOT EXISTS crimes_inelegibilidade (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,           -- Código da lei (CP, CE, lei_9503_97, etc)
    lei TEXT NOT NULL,                     -- Nome completo da lei
    artigo VARCHAR(50) NOT NULL,           -- Número do artigo
    paragrafo VARCHAR(50),                 -- Parágrafo (NULL = caput, 'unico', '1', '2', etc)
    inciso VARCHAR(50),                    -- Inciso (I, II, III, IV, V, etc)
    alinea VARCHAR(50),                    -- Alínea (a, b, c, etc)
    eh_excecao BOOLEAN DEFAULT FALSE,      -- TRUE = Exceção (ELEGÍVEL), FALSE = Impeditivo (INELEGÍVEL)
    tipo_crime TEXT NOT NULL,              -- Tipo do crime (ex: "Crimes contra a vida")
    item_alinea_e VARCHAR(10) NOT NULL,    -- Item da alínea "e" (1, 2, 3, 4, 7, 8, 9, 10)
    observacoes TEXT,                      -- Observações adicionais
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_crimes_codigo ON crimes_inelegibilidade(codigo);
CREATE INDEX idx_crimes_artigo ON crimes_inelegibilidade(artigo);
CREATE INDEX idx_crimes_codigo_artigo ON crimes_inelegibilidade(codigo, artigo);
CREATE INDEX idx_crimes_excecao ON crimes_inelegibilidade(eh_excecao);

-- =====================================================
-- CÓDIGO PENAL (Decreto-Lei 2.848/40)
-- =====================================================

-- ─────────────────────────────────────────────────────
-- Crimes contra a vida (9)
-- NORMA: Arts. 121, 121-A, 122 §1º a §7º, 123 a 127
-- EXCEÇÕES: Art. 121 §3º, Art. 122 caput
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
-- Art. 121 - Homicídio
('CP', 'Código Penal (DL 2.848/40)', '121', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio'),
('CP', 'Código Penal (DL 2.848/40)', '121', '1', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '121', '2', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '121', '3', NULL, NULL, TRUE, 'Crimes contra a vida', '9', 'Exceção: Homicídio culposo'),
('CP', 'Código Penal (DL 2.848/40)', '121', '4', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '121', '5', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '121', '6', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '121', '7', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio qualificado'),

-- Art. 121-A - Feminicídio
('CP', 'Código Penal (DL 2.848/40)', '121-A', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Feminicídio'),

-- Art. 122 - Induzimento ao suicídio
('CP', 'Código Penal (DL 2.848/40)', '122', NULL, NULL, NULL, TRUE, 'Crimes contra a vida', '9', 'Exceção: Crime de ação penal privada (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '122', '1', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '2', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '3', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '4', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '5', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '6', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),
('CP', 'Código Penal (DL 2.848/40)', '122', '7', NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada'),

-- Arts. 123 a 127
('CP', 'Código Penal (DL 2.848/40)', '123', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Infanticídio'),
('CP', 'Código Penal (DL 2.848/40)', '124', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto provocado pela gestante'),
('CP', 'Código Penal (DL 2.848/40)', '125', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto provocado por terceiro'),
('CP', 'Código Penal (DL 2.848/40)', '126', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto provocado com consentimento'),
('CP', 'Código Penal (DL 2.848/40)', '127', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', 'Forma qualificada de aborto');

-- ─────────────────────────────────────────────────────
-- Crime hediondo (7) - Lesão corporal
-- NORMA: Art. 129 §2º c.c. §12 e Art. 129 §3º c.c. §12
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '129', '2', NULL, NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 13.142/2015 e Lei 14.811/2024 (c.c. §12)'),
('CP', 'Código Penal (DL 2.848/40)', '129', '3', NULL, NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 13.142/2015 e Lei 14.811/2024 (c.c. §12)'),
('CP', 'Código Penal (DL 2.848/40)', '148', '1', 'IV', NULL, FALSE, 'Crime hediondo', '7', 'Sequestro e cárcere privado');

-- ─────────────────────────────────────────────────────
-- Crimes de redução à condição análoga à de escravo (8 e 9)
-- NORMA: Art. 149
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '149', NULL, NULL, NULL, FALSE, 'Crime de redução à condição análoga à de escravo e contra dignidade sexual', '8 e 9', 'Redução à condição análoga à de escravo');

-- ─────────────────────────────────────────────────────
-- Crime hediondo (7) - Tráfico de pessoas
-- NORMA: Art. 149-A caput I a V c.c. §1º, II
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '149-A', NULL, 'I', NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 14.811/2024 (c.c. §1º, II)'),
('CP', 'Código Penal (DL 2.848/40)', '149-A', NULL, 'II', NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 14.811/2024 (c.c. §1º, II)'),
('CP', 'Código Penal (DL 2.848/40)', '149-A', NULL, 'III', NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 14.811/2024 (c.c. §1º, II)'),
('CP', 'Código Penal (DL 2.848/40)', '149-A', NULL, 'IV', NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 14.811/2024 (c.c. §1º, II)'),
('CP', 'Código Penal (DL 2.848/40)', '149-A', NULL, 'V', NULL, FALSE, 'Crime hediondo', '7', 'Obs.: crime definido como hediondo pela Lei 14.811/2024 (c.c. §1º, II)');

-- ─────────────────────────────────────────────────────
-- Crimes contra o patrimônio (1 e 2)
-- NORMA: Arts. 155 a 184
-- EXCEÇÕES: Art. 163 caput, Art. 175 caput e 175 I e II, Art. 177 §2º, Art. 180 §3º, Art. 184 §4º
--           Art. 304 nas figuras dos arts. 301 e 302
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
-- Arts. 155 a 162
('CP', 'Código Penal (DL 2.848/40)', '155', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Furto - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '157', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Roubo - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '158', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Extorsão - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '159', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Extorsão mediante sequestro - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '160', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Extorsão indireta - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '162', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Supressão ou alteração de marca - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),

-- Art. 163 - Dano (EXCEÇÃO: caput)
('CP', 'Código Penal (DL 2.848/40)', '163', NULL, NULL, NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: Dano simples (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '163', 'unico', 'IV', NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: Parágrafo único IV'),

-- Arts. 168, 168-A, 171 a 175
('CP', 'Código Penal (DL 2.848/40)', '168', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Apropriação indébita - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '168-A', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Apropriação indébita previdenciária - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '171', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Estelionato - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '172', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Duplicata simulada - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '173', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Abuso de incapazes - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '174', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Induzimento à especulação - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),

-- Art. 175 - Fraude no comércio (EXCEÇÃO: caput, I, II)
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, NULL, NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: Fraude no comércio (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, 'I', NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: Inciso I'),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, 'II', NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: Inciso II'),

-- Arts. 177, 178, 180, 180-A, 184
('CP', 'Código Penal (DL 2.848/40)', '177', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Fraudes e abusos - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '177', '2', NULL, NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: §2º'),
('CP', 'Código Penal (DL 2.848/40)', '178', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Emissão irregular de conhecimento - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '180', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Receptação - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '180', '3', NULL, NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: §3º'),
('CP', 'Código Penal (DL 2.848/40)', '180-A', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Receptação de animal - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '184', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Violação de direito autoral - Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '184', '4', NULL, NULL, TRUE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção: §4º');

-- ─────────────────────────────────────────────────────
-- Crimes contra a dignidade sexual (9)
-- NORMA: Arts. 213 a 220, 223, 227 a 231-A
-- EXCEÇÕES: Art. 216-A, Art. 216-B
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '213', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '215', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),

-- Exceções (crimes culposos, de menor potencial ofensivo ou de ação penal privada)
('CP', 'Código Penal (DL 2.848/40)', '216-A', NULL, NULL, NULL, TRUE, 'Crimes contra a dignidade sexual', '9', 'Exceção'),
('CP', 'Código Penal (DL 2.848/40)', '216-B', NULL, NULL, NULL, TRUE, 'Crimes contra a dignidade sexual', '9', 'Exceção'),

('CP', 'Código Penal (DL 2.848/40)', '218', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '218-A', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '218-B', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '218-C', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '221', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '227', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', 'Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC'),
('CP', 'Código Penal (DL 2.848/40)', '228', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '229', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '230', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CP', 'Código Penal (DL 2.848/40)', '231-A', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', 'Obs.: entendimento firmado pelo TSE no Recurso Especial Eleitoral nº 145-94.2016.6.24.0074/SC');

-- ─────────────────────────────────────────────────────
-- Crimes contra a saúde pública (3)
-- NORMA: Arts. 267 a 280
-- EXCEÇÕES: Art. 267 §2º, Art. 270 §2º, Art. 271 parágrafo único,
--           Art. 272 §2º, Art. 273 §2º, Art. 278 parágrafo único, Art. 280 parágrafo único
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '267', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Epidemia'),
('CP', 'Código Penal (DL 2.848/40)', '267', '2', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Forma culposa'),
('CP', 'Código Penal (DL 2.848/40)', '270', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Envenenamento de água potável'),
('CP', 'Código Penal (DL 2.848/40)', '270', '2', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Forma culposa'),
('CP', 'Código Penal (DL 2.848/40)', '271', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Corrupção ou poluição de água potável'),
('CP', 'Código Penal (DL 2.848/40)', '271', 'unico', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Parágrafo único'),
('CP', 'Código Penal (DL 2.848/40)', '272', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Falsificação, corrupção, adulteração ou alteração de produto destinado a fins terapêuticos'),
('CP', 'Código Penal (DL 2.848/40)', '272', '2', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Forma culposa'),
('CP', 'Código Penal (DL 2.848/40)', '273', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Falsificação, corrupção, adulteração ou alteração de substância alimentícia'),
('CP', 'Código Penal (DL 2.848/40)', '273', '2', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Forma culposa'),
('CP', 'Código Penal (DL 2.848/40)', '274', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Emprego de processo proibido'),
('CP', 'Código Penal (DL 2.848/40)', '275', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Invólucro ou recipiente com falsa indicação'),
('CP', 'Código Penal (DL 2.848/40)', '276', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Produto ou substância nas condições dos artigos anteriores'),
('CP', 'Código Penal (DL 2.848/40)', '277', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Substância destinada à falsificação'),
('CP', 'Código Penal (DL 2.848/40)', '278', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Outras substâncias nocivas à saúde pública'),
('CP', 'Código Penal (DL 2.848/40)', '278', 'unico', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Parágrafo único'),
('CP', 'Código Penal (DL 2.848/40)', '280', NULL, NULL, NULL, FALSE, 'Crimes contra a saúde pública', '3', 'Substância avariada'),
('CP', 'Código Penal (DL 2.848/40)', '280', 'unico', NULL, NULL, TRUE, 'Crimes contra a saúde pública', '3', 'Exceção: Parágrafo único');

-- ─────────────────────────────────────────────────────
-- Crimes praticados por quadrilha ou bando (10)
-- NORMA: Art. 288 e 288-A
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '288', NULL, NULL, NULL, FALSE, 'Crimes praticados por quadrilha ou bando', '10', 'Associação criminosa'),
('CP', 'Código Penal (DL 2.848/40)', '288-A', NULL, NULL, NULL, FALSE, 'Crimes praticados por quadrilha ou bando', '10', 'Constituição de milícia privada');

-- ─────────────────────────────────────────────────────
-- Crimes contra a fé pública (1)
-- NORMA: Arts. 289 a 311-A
-- EXCEÇÕES: Art. 289 §2º, Art. 293 §4º, Art. 304 nas figuras dos arts. 301 e 302
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '289', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Moeda falsa'),
('CP', 'Código Penal (DL 2.848/40)', '289', '2', NULL, NULL, TRUE, 'Crimes contra a fé pública', '1', 'Exceção: Forma culposa'),
('CP', 'Código Penal (DL 2.848/40)', '290', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Crimes assimilados ao de moeda falsa'),
('CP', 'Código Penal (DL 2.848/40)', '291', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Fabricação de aparelhos para falsificação'),
('CP', 'Código Penal (DL 2.848/40)', '293', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Petrechos para falsificação de moeda'),
('CP', 'Código Penal (DL 2.848/40)', '293', '4', NULL, NULL, TRUE, 'Crimes contra a fé pública', '1', 'Exceção: §4º'),
('CP', 'Código Penal (DL 2.848/40)', '294', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Emissão de título ao portador sem permissão legal'),
('CP', 'Código Penal (DL 2.848/40)', '296', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Supressão de documento'),
('CP', 'Código Penal (DL 2.848/40)', '297', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Falsificação de documento público'),
('CP', 'Código Penal (DL 2.848/40)', '298', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Falsificação de documento particular'),
('CP', 'Código Penal (DL 2.848/40)', '299', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Falsidade ideológica'),
('CP', 'Código Penal (DL 2.848/40)', '300', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Falso reconhecimento de firma ou letra'),
('CP', 'Código Penal (DL 2.848/40)', '303', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Uso de documento falso'),
('CP', 'Código Penal (DL 2.848/40)', '304', NULL, NULL, NULL, TRUE, 'Crimes contra a fé pública', '1', 'Exceção: Uso de documento falso nas figuras dos arts. 301 e 302'),
('CP', 'Código Penal (DL 2.848/40)', '305', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Supressão de documento'),
('CP', 'Código Penal (DL 2.848/40)', '306', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Falsificação do sinal empregado no contraste de metal precioso ou na fiscalização alfandegária'),
('CP', 'Código Penal (DL 2.848/40)', '309', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Fraude de lei sobre estrangeiros'),
('CP', 'Código Penal (DL 2.848/40)', '310', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Adulteração de sinal identificador de veículo automotor'),
('CP', 'Código Penal (DL 2.848/40)', '311', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Adulteração de sinal identificador de veículo automotor'),
('CP', 'Código Penal (DL 2.848/40)', '311-A', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', 'Fraude em certames de interesse público');

-- ─────────────────────────────────────────────────────
-- Crimes contra a administração pública (1)
-- NORMA: Arts. 312 a 359-H
-- EXCEÇÕES: Art. 312 §2º, Art. 317 §2º, Art. 323 caput e §1º,
--           Art. 325 caput e §1º, Art. 328 caput, Art. 347 caput, Art. 351 caput e §4º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '312', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Peculato'),
('CP', 'Código Penal (DL 2.848/40)', '312', '2', NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Peculato culposo'),
('CP', 'Código Penal (DL 2.848/40)', '313', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Peculato mediante erro de outrem'),
('CP', 'Código Penal (DL 2.848/40)', '313-A', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Inserção de dados falsos em sistema de informações'),
('CP', 'Código Penal (DL 2.848/40)', '314', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Extração de minérios sem autorização'),
('CP', 'Código Penal (DL 2.848/40)', '316', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Concussão'),
('CP', 'Código Penal (DL 2.848/40)', '317', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Corrupção passiva'),
('CP', 'Código Penal (DL 2.848/40)', '317', '2', NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: §2º'),
('CP', 'Código Penal (DL 2.848/40)', '318', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Facilitação de contrabando ou descaminho'),
('CP', 'Código Penal (DL 2.848/40)', '322', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Violação de sigilo funcional'),
('CP', 'Código Penal (DL 2.848/40)', '323', NULL, NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Abandono de função (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '323', '1', NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: §1º'),
('CP', 'Código Penal (DL 2.848/40)', '325', NULL, NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Violação de sigilo de proposta de concorrência (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '325', '1', NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: §1º'),
('CP', 'Código Penal (DL 2.848/40)', '328', NULL, NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Usurpação de função pública (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '332', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Tráfico de influência'),
('CP', 'Código Penal (DL 2.848/40)', '333', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Corrupção ativa'),
('CP', 'Código Penal (DL 2.848/40)', '334', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Descaminho'),
('CP', 'Código Penal (DL 2.848/40)', '334-A', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Contrabando ou descaminho de agrotóxico'),
('CP', 'Código Penal (DL 2.848/40)', '337', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Subtração ou inutilização de livro ou documento'),
('CP', 'Código Penal (DL 2.848/40)', '337-A', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Sonegação de contribuição previdenciária'),
('CP', 'Código Penal (DL 2.848/40)', '337-B', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Apropriação de contribuição previdenciária descontada'),
('CP', 'Código Penal (DL 2.848/40)', '337-C', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Apropriação de recursos destinados ao pagamento de salários'),
('CP', 'Código Penal (DL 2.848/40)', '338', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Sonegação de papel ou objeto de valor probatório'),
('CP', 'Código Penal (DL 2.848/40)', '339', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Denunciação caluniosa'),
('CP', 'Código Penal (DL 2.848/40)', '342', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Falso testemunho ou falsa perícia'),
('CP', 'Código Penal (DL 2.848/40)', '343', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Corrupção ativa de testemunha ou perito'),
('CP', 'Código Penal (DL 2.848/40)', '344', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Coação no curso do processo'),
('CP', 'Código Penal (DL 2.848/40)', '347', NULL, NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Fraude processual (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '347', 'unico', NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Parágrafo único'),
('CP', 'Código Penal (DL 2.848/40)', '351', NULL, NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Motim de presos (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '351', '4', NULL, NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: §4º'),
('CP', 'Código Penal (DL 2.848/40)', '353', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Corrupção ativa em transação comercial internacional'),
('CP', 'Código Penal (DL 2.848/40)', '355', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Tráfico de influência em transação comercial internacional'),
('CP', 'Código Penal (DL 2.848/40)', '356', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Impedimento, perturbação ou fraude de concorrência'),
('CP', 'Código Penal (DL 2.848/40)', '357', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Violação de sigilo de proposta'),
('CP', 'Código Penal (DL 2.848/40)', '359-C', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Inserção de dados falsos em sistemas de informações'),
('CP', 'Código Penal (DL 2.848/40)', '359-D', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Modificação não autorizada de sistema de informações'),
('CP', 'Código Penal (DL 2.848/40)', '359-G', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Contratação de operação de crédito'),
('CP', 'Código Penal (DL 2.848/40)', '359-H', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Ordenação de despesa não autorizada');

-- =====================================================
-- CÓDIGO PENAL MILITAR (Decreto-Lei 1.001/69)
-- =====================================================
-- Obs.: o conceito de crime de menor potencial ofensivo não se aplica
-- conforme dispõe o art. 90-A, da Lei 9.099/95

-- ─────────────────────────────────────────────────────
-- Crimes contra a vida (9) - CPM
-- NORMA: Arts. 205 e 207
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '205', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '207', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes hediondos (7) - CPM
-- NORMA: Art. 208
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '208', NULL, NULL, NULL, FALSE, 'Crimes hediondos', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a dignidade sexual (9) - CPM
-- NORMA: Arts. 232 a 235, 238 e 239
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '232', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '233', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '234', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '235', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '238', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '239', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o patrimônio (1 e 2) - CPM
-- NORMA: Arts. 240 a 254, 257 a 267
-- EXCEÇÕES: Arts. 262 a 265 quando combinados com art. 266 (crimes culposos)
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '240', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '241', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '242', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '243', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '244', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '245', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '246', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '247', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '248', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '249', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '250', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '251', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '252', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '253', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '254', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '257', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '258', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '259', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '260', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '261', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),

-- Exceções quando combinados com art. 266 (crimes culposos)
('CPM', 'Código Penal Militar (DL 1.001/69)', '262', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção quando combinado com art. 266'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '263', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção quando combinado com art. 266'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '264', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção quando combinado com art. 266'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '265', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', 'Exceção quando combinado com art. 266'),

('CPM', 'Código Penal Militar (DL 1.001/69)', '267', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o meio ambiente e a saúde pública (3) - CPM
-- NORMA: Arts. 290 a 297
-- EXCEÇÕES: Art. 292 §2º, Art. 293 §3º, Art. 294 parágrafo único, Art. 295 parágrafo único, Art. 296 parágrafo único
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '290', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '291', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '292', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '292', '2', NULL, NULL, TRUE, 'Crimes contra o meio ambiente e a saúde pública', '3', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '293', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '293', '3', NULL, NULL, TRUE, 'Crimes contra o meio ambiente e a saúde pública', '3', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '294', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '294', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente e a saúde pública', '3', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '295', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '295', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente e a saúde pública', '3', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '296', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '296', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente e a saúde pública', '3', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '297', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente e a saúde pública', '3', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a administração pública e a fé pública (1) - CPM
-- NORMA: Arts. 298 a 322, 324 a 354
-- EXCEÇÕES: Art. 303 §3º, Art. 332 §2º, Art. 352 parágrafo único
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '298', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '299', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '300', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '301', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '302', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '303', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '303', '3', NULL, NULL, TRUE, 'Crimes contra a administração pública e a fé pública', '1', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '304', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '305', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '306', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '307', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '308', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '309', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '310', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '311', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '312', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '313', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '314', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '315', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '316', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '317', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '318', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '319', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '320', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '321', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '322', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '324', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '325', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '326', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '327', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '328', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '329', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '330', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '331', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '332', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '332', '2', NULL, NULL, TRUE, 'Crimes contra a administração pública e a fé pública', '1', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '333', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '334', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '335', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '336', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '337', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '338', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '339', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '340', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '341', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '342', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '343', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '344', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '345', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '346', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '347', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '348', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '349', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '350', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '351', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '352', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '352', 'unico', NULL, NULL, TRUE, 'Crimes contra a administração pública e a fé pública', '1', 'Exceção'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '353', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '354', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública e a fé pública', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a administração militar (1) - CPM
-- NORMA: Art. 400
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '400', NULL, NULL, NULL, FALSE, 'Crimes contra a vida', '9', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes hediondos (7) - CPM  
-- NORMA: Arts. 401 e 402
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '401', NULL, NULL, NULL, FALSE, 'Crimes hediondos', '7', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '402', NULL, NULL, NULL, FALSE, 'Crimes hediondos', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o patrimônio (1 e 2) - CPM
-- NORMA: Arts. 404 e 406
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '404', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '406', NULL, NULL, NULL, FALSE, 'Crimes contra o patrimônio', '1 e 2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a dignidade sexual (9) - CPM
-- NORMA: Arts. 407 e 408
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '407', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '408', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL);

-- =====================================================
-- LEIS ESPECIAIS
-- =====================================================

-- ─────────────────────────────────────────────────────
-- Crimes contra a fé pública (1)
-- DL 5.452/43 - CLT art. 49
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CLT', 'Decreto-Lei 5.452/43 - CLT', '49', NULL, NULL, NULL, FALSE, 'Crimes contra a fé pública', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes previstos na lei que regula a falência (2)
-- DL 7.661/45 - arts. 186 a 189 (Lei Falimentar)
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_7661_45', 'Decreto-Lei 7.661/45 - Lei Falimentar', '186', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Obs.: Lei revogada pela Lei 11.101, de 09/02/2006'),
('lei_7661_45', 'Decreto-Lei 7.661/45 - Lei Falimentar', '187', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Obs.: Lei revogada pela Lei 11.101, de 09/02/2006'),
('lei_7661_45', 'Decreto-Lei 7.661/45 - Lei Falimentar', '188', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Obs.: Lei revogada pela Lei 11.101, de 09/02/2006'),
('lei_7661_45', 'Decreto-Lei 7.661/45 - Lei Falimentar', '189', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Obs.: Lei revogada pela Lei 11.101, de 09/02/2006');

-- ─────────────────────────────────────────────────────
-- Crimes contra a administração pública (1)
-- DL 201/67 - art. 1º (Crimes de Responsabilidade dos Prefeitos)
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('dl_201_67', 'Decreto-Lei 201/67 - Crimes de Responsabilidade dos Prefeitos', '1', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o sistema financeiro (2)
-- Lei Complementar 105/01 - art. 10
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lc_105_01', 'Lei Complementar 105/01', '10', NULL, NULL, NULL, FALSE, 'Crimes contra o sistema financeiro', '2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a economia popular (1)
-- Lei 1.521/51 - art. 3º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_1521_51', 'Lei 1.521/51 - Crimes contra a Economia Popular', '3', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes hediondos (7)
-- Lei 2.889/56 - arts. 1º, 2º e 3º (Define crimes de genocídio)
-- EXCEÇÕES: Art. 2º caput (quando se referir ao art. 1º alínea "e"), Art. 3º caput (quando se referir ao art. 1º alínea "e")
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_2889_56', 'Lei 2.889/56 - Define crimes de genocídio', '1', NULL, NULL, NULL, FALSE, 'Crimes hediondos', '7', NULL),
('lei_2889_56', 'Lei 2.889/56 - Define crimes de genocídio', '2', NULL, NULL, NULL, TRUE, 'Crimes hediondos', '7', 'Exceção: caput quando se referir ao art. 1º alínea "e"'),
('lei_2889_56', 'Lei 2.889/56 - Define crimes de genocídio', '3', NULL, NULL, NULL, TRUE, 'Crimes hediondos', '7', 'Exceção: caput quando se referir ao art. 1º alínea "e"');

-- ─────────────────────────────────────────────────────
-- Crimes contra a economia popular (1)
-- Lei 4.591/64 - art. 65
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_4591_64', 'Lei 4.591/64 - Condomínios e Incorporações', '65', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o sistema financeiro (2)
-- Lei 4.595/64 - art. 34
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_4595_64', 'Lei 4.595/64 - Sistema Financeiro Nacional', '34', NULL, NULL, NULL, FALSE, 'Crimes contra o sistema financeiro', '2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o mercado de capitais (2)
-- Lei 4.728/65 - arts. 66-B, 73 e 74
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_4728_65', 'Lei 4.728/65 - Mercado de Capitais', '66-B', NULL, NULL, NULL, FALSE, 'Crimes contra o mercado de capitais', '2', NULL),
('lei_4728_65', 'Lei 4.728/65 - Mercado de Capitais', '73', NULL, NULL, NULL, FALSE, 'Crimes contra o mercado de capitais', '2', NULL),
('lei_4728_65', 'Lei 4.728/65 - Mercado de Capitais', '74', NULL, NULL, NULL, FALSE, 'Crimes contra o mercado de capitais', '2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes eleitorais (4)
-- Lei 4.737/65 - Código Eleitoral - arts. 289 a 364-A
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CE', 'Código Eleitoral (Lei 4.737/65)', '289', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '290', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '291', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '292', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '293', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '294', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '295', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '296', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '297', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '298', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '299', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '300', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '301', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '302', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '303', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '304', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '305', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '306', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '307', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '308', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '309', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '310', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '311', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '312', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '313', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '314', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '315', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '316', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '317', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '318', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '319', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '320', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '321', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '322', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '323', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '324', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '325', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '326', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '327', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '328', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '329', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '330', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '331', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '332', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '333', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '334', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '335', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '336', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '337', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '338', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '339', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '340', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '341', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '342', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '343', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '344', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '345', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '346', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '347', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '348', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '349', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '350', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '351', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '352', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '353', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '354', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '355', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '356', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '357', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '358', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '359', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '360', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '361', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '362', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '363', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '364', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('CE', 'Código Eleitoral (Lei 4.737/65)', '364-A', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes de racismo (7)
-- Lei 7.716/89 - arts. 2º-A, 3º a 14 e 20
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '2-A', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '3', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '4', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '5', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '6', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '7', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '8', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '9', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '10', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '11', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '12', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '13', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '14', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL),
('lei_7716_89', 'Lei 7.716/89 - Define crimes de racismo', '20', NULL, NULL, NULL, FALSE, 'Crimes de racismo', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a dignidade sexual (9)
-- Lei 8.069/90 - ECA - arts. 240 a 241-D e 244-A
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '240', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '241', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '241-A', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '241-B', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '241-C', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '241-D', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('ECA', 'Lei 8.069/90 - Estatuto da Criança e do Adolescente', '244-A', NULL, NULL, NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a economia popular (1)
-- Lei 8.137/90 - arts. 1º, 3º e 7º
-- EXCEÇÃO: Art. 7º parágrafo único
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_8137_90', 'Lei 8.137/90 - Crimes contra a ordem tributária', '1', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular', '1', 'Obs.: arts. 5º e 6º revogados pela Lei 12.529, de 30/11/2011'),
('lei_8137_90', 'Lei 8.137/90 - Crimes contra a ordem tributária', '3', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular', '1', NULL),
('lei_8137_90', 'Lei 8.137/90 - Crimes contra a ordem tributária', '7', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular', '1', NULL),
('lei_8137_90', 'Lei 8.137/90 - Crimes contra a ordem tributária', '7', 'unico', NULL, NULL, TRUE, 'Crimes contra a economia popular', '1', 'Exceção');

-- ─────────────────────────────────────────────────────
-- Crimes contra a economia popular (1) e patrimônio (2)
-- Lei 8.176/91 - arts. 1º e 2º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_8176_91', 'Lei 8.176/91 - Crimes contra a ordem econômica', '1', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular e contra o patrimônio', '1 e 2', NULL),
('lei_8176_91', 'Lei 8.176/91 - Crimes contra a ordem econômica', '2', NULL, NULL, NULL, FALSE, 'Crimes contra a economia popular e contra o patrimônio', '1 e 2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra a administração pública (1)
-- Lei 8.666/93 - arts. 89 a 96
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '89', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '90', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '91', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '92', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '93', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '94', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '95', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('lei_8666_93', 'Lei 8.666/93 - Licitações e Contratos', '96', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes de tortura (7)
-- Lei 9.455/97 - art. 1º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_9455_97', 'Lei 9.455/97 - Define crimes de tortura', '1', NULL, NULL, NULL, FALSE, 'Crimes de tortura', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes eleitorais (4)
-- Lei 9.504/97 - arts. 57-H, §1º e 72
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_9504_97', 'Lei 9.504/97 - Lei das Eleições', '57-H', '1', NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL),
('lei_9504_97', 'Lei 9.504/97 - Lei das Eleições', '72', NULL, NULL, NULL, FALSE, 'Crimes eleitorais', '4', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes contra o meio ambiente (3)
-- Lei 9.605/98 - arts. 29 a 69-A
-- EXCEÇÕES: Art. 38 parágrafo único, Art. 38-A parágrafo único, Art. 40 §3º,
--           Art. 41 parágrafo único, Art. 54 §1º, Art. 56 §3º, Art. 62 parágrafo único,
--           Art. 67 parágrafo único, Art. 68 parágrafo único, Art. 69-A §1º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '29', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '30', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '31', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '32', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '33', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '34', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '35', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '36', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '37', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '38', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '38', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '38-A', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '38-A', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '39', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '40', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '40', '3', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '41', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '41', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '42', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '43', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '44', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '45', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '46', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '47', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '48', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '49', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '50', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '50-A', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '51', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '52', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '53', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '54', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '54', '1', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '55', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '56', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '56', '3', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '57', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '58', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '59', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '60', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '61', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '62', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '62', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '63', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '64', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '65', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '66', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '67', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '67', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '68', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '68', 'unico', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '69', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '69-A', NULL, NULL, NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('lei_9605_98', 'Lei 9.605/98 - Lei Ambiental', '69-A', '1', NULL, NULL, TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção');

-- ─────────────────────────────────────────────────────
-- Crimes de lavagem ou ocultação de bens, direitos e valores (6)
-- Lei 9.613/98 - art. 1º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_9613_98', 'Lei 9.613/98 - Lavagem de dinheiro', '1', NULL, NULL, NULL, FALSE, 'Crimes de lavagem ou ocultação de bens, direitos e valores', '6', NULL);

-- ─────────────────────────────────────────────────────
-- Crime hediondo (7)
-- Lei 10.826/03 - art. 16 caput c.c. §2º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_10826_03', 'Lei 10.826/03 - Estatuto do Desarmamento', '16', NULL, NULL, NULL, FALSE, 'Crime hediondo', '7', 'Obs.: arts. 5º e 6º revogados pela Lei 12.529/11 de 30/11/2011');

-- ─────────────────────────────────────────────────────
-- Crimes previstos na lei que regula a falência (2)
-- Lei 11.101/05 - arts. 168 a 177
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_11101_05', 'Lei 11.101/05 - Falências', '168', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '169', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '170', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '171', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '172', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '173', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '174', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '175', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '176', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL),
('lei_11101_05', 'Lei 11.101/05 - Falências', '177', NULL, NULL, NULL, FALSE, 'Crimes previstos na lei que regula a falência', '2', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes de tráfico de entorpecentes (7)
-- Lei 11.343/06 - arts. 33 e 37
-- EXCEÇÃO: Art. 33 §3º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_11343_06', 'Lei 11.343/06 - Lei de Drogas', '33', NULL, NULL, NULL, FALSE, 'Crimes de tráfico de entorpecentes', '7', 'Obs.: Lei revogada pela Lei 11.343, de 23/08/2006'),
('lei_11343_06', 'Lei 11.343/06 - Lei de Drogas', '33', '3', NULL, NULL, TRUE, 'Crimes de tráfico de entorpecentes', '7', 'Exceção'),
('lei_11343_06', 'Lei 11.343/06 - Lei de Drogas', '37', NULL, NULL, NULL, FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes Praticados por Organização Criminosa (10)
-- Lei 12.850/13
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_12850_13', 'Lei 12.850/13 - Organização Criminosa', '2', NULL, NULL, NULL, FALSE, 'Crimes Praticados por Organização Criminosa', '10', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes de terrorismo
-- Lei 13.260/16 - arts. 2º a 6º
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_13260_16', 'Lei 13.260/16 - Lei Antiterrorismo', '2', NULL, NULL, NULL, FALSE, 'Crimes de terrorismo', '7', NULL),
('lei_13260_16', 'Lei 13.260/16 - Lei Antiterrorismo', '3', NULL, NULL, NULL, FALSE, 'Crimes de terrorismo', '7', NULL),
('lei_13260_16', 'Lei 13.260/16 - Lei Antiterrorismo', '4', NULL, NULL, NULL, FALSE, 'Crimes de terrorismo', '7', NULL),
('lei_13260_16', 'Lei 13.260/16 - Lei Antiterrorismo', '5', NULL, NULL, NULL, FALSE, 'Crimes de terrorismo', '7', NULL),
('lei_13260_16', 'Lei 13.260/16 - Lei Antiterrorismo', '6', NULL, NULL, NULL, FALSE, 'Crimes de terrorismo', '7', NULL);

-- ─────────────────────────────────────────────────────
-- Crimes de Trânsito (CTB)
-- Lei 9.503/97 - arts. 302, 303, 306 a 312
-- ─────────────────────────────────────────────────────
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '302', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', 'Crime contra a vida'),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '303', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', 'Crime contra a vida'),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '306', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '307', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '308', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '309', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '310', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '311', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL),
('CTB', 'Lei 9.503/97 - Código de Trânsito Brasileiro', '312', NULL, NULL, NULL, FALSE, 'Crimes de Trânsito', '8', NULL);

-- ─────────────────────────────────────────────────────
-- Leis especiais complementares (baseado na tabela oficial)
-- ─────────────────────────────────────────────────────

-- Lei 12.037/09 - Identificação criminal
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_12037_09', 'Lei 12.037/09 - Identificação criminal', '1', NULL, NULL, NULL, FALSE, 'Crimes diversos', '11', 'Obs.: não consta na tabela oficial, mas está relacionada');

-- Lei 12.527/11 - Lei de Acesso à Informação
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_12527_11', 'Lei 12.527/11 - Acesso à Informação', '32', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', NULL);

-- Lei 12.846/13 - Lei Anticorrupção
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, alinea, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('lei_12846_13', 'Lei 12.846/13 - Lei Anticorrupção', '5', NULL, NULL, NULL, FALSE, 'Crimes contra a administração pública', '1', 'Obs.: crimes relacionados à corrupção');

-- =====================================================
-- FUNÇÃO VERIFICAR_ELEGIBILIDADE (Corrigida)
-- =====================================================

-- Drop da função antiga (todas as sobrecargas)
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS public.verificar_elegibilidade;

CREATE OR REPLACE FUNCTION public.verificar_elegibilidade(
    p_codigo_norma VARCHAR,
    p_artigo VARCHAR,
    p_paragrafo VARCHAR DEFAULT NULL,
    p_inciso VARCHAR DEFAULT NULL,
    p_alinea VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    resultado VARCHAR,
    tipo_crime TEXT,
    observacoes TEXT,
    mensagem TEXT,
    item_alinea_e VARCHAR,
    excecoes_artigo TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_record record;
    v_excecoes_list TEXT;
BEGIN
    -- 1. Buscar o registro mais específico
    -- REGRA CRÍTICA: Se p_paragrafo IS NULL, buscar apenas registros com paragrafo NULL ou 'caput'
    -- Isso garante que buscar "Art. 122" sem parágrafo = buscar caput (não qualquer parágrafo)
    SELECT 
        t.eh_excecao, t.tipo_crime, t.observacoes, t.item_alinea_e
    INTO v_record
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = p_codigo_norma 
      AND t.artigo = p_artigo
      AND (
          -- Se parágrafo especificado: buscar exatamente esse parágrafo
          (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo)
          OR
          -- Se parágrafo NÃO especificado: buscar o caput (paragrafo NULL)
          (p_paragrafo IS NULL AND t.paragrafo IS NULL)
      )
      AND (p_inciso IS NULL OR t.inciso = p_inciso)
      AND (p_alinea IS NULL OR t.alinea = p_alinea)
    ORDER BY 
      (t.paragrafo IS NOT DISTINCT FROM p_paragrafo) DESC,
      (t.inciso IS NOT DISTINCT FROM p_inciso) DESC,
      (t.alinea IS NOT DISTINCT FROM p_alinea) DESC,
      t.eh_excecao ASC 
    LIMIT 1;

    -- 2. Buscar TODAS as exceções para este artigo (para exibir no modal)
    SELECT string_agg(
        CASE 
            WHEN t2.paragrafo IS NOT NULL AND t2.paragrafo != '' THEN 
                CASE 
                    WHEN t2.paragrafo = 'unico' THEN 'Parágrafo único'
                    ELSE 'Parágrafo ' || t2.paragrafo 
                END
            WHEN t2.inciso IS NOT NULL THEN 'Inciso ' || t2.inciso 
            WHEN t2.alinea IS NOT NULL THEN 'Alínea ' || t2.alinea 
            ELSE 'Caput'
        END || COALESCE(' (' || t2.observacoes || ')', ''), 
        '; '
    ) INTO v_excecoes_list
    FROM public.crimes_inelegibilidade t2
    WHERE t2.codigo = p_codigo_norma 
      AND t2.artigo = p_artigo 
      AND t2.eh_excecao = TRUE;

    -- 3. Se não encontrou registro, retornar NAO_CONSTA
    IF v_record IS NULL THEN
        RETURN QUERY SELECT 
            'NAO_CONSTA'::VARCHAR, 
            NULL::TEXT, 
            NULL::TEXT, 
            'Artigo não mapeado como impeditivo.'::TEXT,
            NULL::VARCHAR,
            NULL::TEXT;
        RETURN;
    END IF;

    -- 4. Retornar resultado estruturado
    RETURN QUERY 
    SELECT 
      (CASE WHEN v_record.eh_excecao THEN 'ELEGIVEL' ELSE 'INELEGIVEL' END)::VARCHAR, 
      v_record.tipo_crime::TEXT, 
      v_record.observacoes::TEXT, 
      ('Artigo consta na tabela de inelegibilidade (Item ' || COALESCE(v_record.item_alinea_e, '?') || ' da alínea "e")')::TEXT,
      v_record.item_alinea_e::VARCHAR,
      v_excecoes_list::TEXT;
END;
$$;

-- Comentários para documentação
COMMENT ON TABLE crimes_inelegibilidade IS 'Tabela de crimes que ensejam inelegibilidade eleitoral conforme LC 64/90 atualizada pela LC 135/2010';
COMMENT ON COLUMN crimes_inelegibilidade.eh_excecao IS 'TRUE = Exceção (ELEGÍVEL), FALSE = Impeditivo (INELEGÍVEL)';
COMMENT ON COLUMN crimes_inelegibilidade.paragrafo IS 'NULL = caput, "unico" = parágrafo único, "1", "2", etc = números';
COMMENT ON FUNCTION verificar_elegibilidade IS 'Verifica se um artigo causa inelegibilidade. Quando parágrafo não especificado, busca pelo caput.';

-- Permissões
GRANT ALL ON TABLE crimes_inelegibilidade TO postgres, service_role;
GRANT EXECUTE ON FUNCTION verificar_elegibilidade TO postgres, service_role, anon, authenticated;

-- Estatísticas finais
DO $$
DECLARE
    total_records INTEGER;
    total_excecoes INTEGER;
    total_impeditivos INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_records FROM crimes_inelegibilidade;
    SELECT COUNT(*) INTO total_excecoes FROM crimes_inelegibilidade WHERE eh_excecao = TRUE;
    SELECT COUNT(*) INTO total_impeditivos FROM crimes_inelegibilidade WHERE eh_excecao = FALSE;
    
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Migration 002 concluída com sucesso!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Total de registros: %', total_records;
    RAISE NOTICE 'Exceções (ELEGÍVEL): %', total_excecoes;
    RAISE NOTICE 'Impeditivos (INELEGÍVEL): %', total_impeditivos;
    RAISE NOTICE '========================================';
END $$;
