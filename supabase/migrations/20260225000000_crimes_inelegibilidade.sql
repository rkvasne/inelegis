-- =====================================================
-- Migration: crimes_inelegibilidade + verificar_elegibilidade
-- =====================================================
-- Tabela oficial CRE-SP + RPC de verificação.
-- Apenas o que é pertinente à inelegibilidade.
-- Data: 25/02/2026
-- =====================================================

DROP FUNCTION IF EXISTS public.verificar_elegibilidade(VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS public.verificar_elegibilidade(TEXT, TEXT, TEXT, TEXT, TEXT);
DROP TABLE IF EXISTS crimes_inelegibilidade CASCADE;

CREATE TABLE crimes_inelegibilidade (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    lei TEXT NOT NULL,
    artigo VARCHAR(50) NOT NULL,
    paragrafo VARCHAR(50),
    inciso VARCHAR(50),
    alinea VARCHAR(50),
    eh_excecao BOOLEAN DEFAULT FALSE,
    artigo_inteiro_impeditivo BOOLEAN DEFAULT TRUE,
    tipo_crime TEXT NOT NULL,
    item_alinea_e VARCHAR(10) NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

COMMENT ON COLUMN crimes_inelegibilidade.artigo_inteiro_impeditivo IS 'FALSE = artigo com apenas combinações específicas impeditivas (ex.: 149-A); não usar fallback "artigo inteiro"';

CREATE INDEX idx_crimes_ssot ON crimes_inelegibilidade(codigo, artigo);

-- CÓDIGO PENAL (DECRETO-LEI 2.848/40)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '121', NULL, FALSE, 'Crimes contra a vida', '9', 'Homicídio'),
('CP', 'Código Penal (DL 2.848/40)', '121', '3', TRUE, 'Crimes contra a vida', '9', 'Exceção: Homicídio culposo'),
('CP', 'Código Penal (DL 2.848/40)', '121-A', NULL, FALSE, 'Crimes contra a vida', '9', 'Feminicídio (Lei 14.994/24)'),
('CP', 'Código Penal (DL 2.848/40)', '122', NULL, TRUE, 'Crimes contra a vida', '9', 'Exceção: Ação penal privada (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '122', '1', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '2', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '3', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '4', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '5', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '6', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '122', '7', FALSE, 'Crimes contra a vida', '9', 'Induzimento qualificado'),
('CP', 'Código Penal (DL 2.848/40)', '123', NULL, FALSE, 'Crimes contra a vida', '9', 'Infanticídio'),
('CP', 'Código Penal (DL 2.848/40)', '124', NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto'),
('CP', 'Código Penal (DL 2.848/40)', '125', NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto'),
('CP', 'Código Penal (DL 2.848/40)', '126', NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto'),
('CP', 'Código Penal (DL 2.848/40)', '127', NULL, FALSE, 'Crimes contra a vida', '9', 'Aborto');

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '129', '2', FALSE, 'Crime hediondo', '7', 'Lesão gravíssima (c/c §12)'),
('CP', 'Código Penal (DL 2.848/40)', '129', '3', FALSE, 'Crime hediondo', '7', 'Lesão morte (c/c §12)'),
('CP', 'Código Penal (DL 2.848/40)', '149', NULL, FALSE, 'Redução escravidão e dignidade sexual', '8 e 9', NULL);

-- Art. 148: somente § 1º, inciso IV impeditivo (Padrão C)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, eh_excecao, artigo_inteiro_impeditivo, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '148', '1', 'IV', FALSE, FALSE, 'Crime hediondo', '7', '§ 1º, inciso IV (Sequestro)');

-- Art. 149-A: apenas combinação "caput I a V c.c. § 1º, II" impeditiva (Padrão C — sem linha artigo-inteiro)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, eh_excecao, artigo_inteiro_impeditivo, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '149-A', '1', 'II', FALSE, FALSE, 'Crime hediondo', '7', 'Caput I a V c.c. § 1º, II (Lei 14.811/24)');

-- Arts. 163 e 175: artigo inteiro impeditivo; exceções caput/incisos em linhas separadas
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, eh_excecao, artigo_inteiro_impeditivo, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '163', NULL, NULL, FALSE, TRUE, 'Crimes contra o patrimônio', '1', 'Art. inteiro; exceções caput e p.único IV'),
('CP', 'Código Penal (DL 2.848/40)', '163', 'unico', 'IV', TRUE, TRUE, 'Crimes contra o patrimônio', '1', 'Exceção: § único, inciso IV (Ação Privada)'),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, NULL, FALSE, TRUE, 'Crimes contra o patrimônio', '1', 'Art. inteiro; exceções caput e incisos I/II'),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, 'I', TRUE, TRUE, 'Crimes contra o patrimônio', '1', 'Exceção inciso I'),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, 'II', TRUE, TRUE, 'Crimes contra o patrimônio', '1', 'Exceção inciso II');

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '155', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Furto'),
('CP', 'Código Penal (DL 2.848/40)', '157', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Roubo'),
('CP', 'Código Penal (DL 2.848/40)', '158', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Extorsão'),
('CP', 'Código Penal (DL 2.848/40)', '159', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Extorsão sequestro'),
('CP', 'Código Penal (DL 2.848/40)', '160', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Extorsão indireta'),
('CP', 'Código Penal (DL 2.848/40)', '162', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '163', NULL, TRUE, 'Crimes contra o patrimônio', '1', 'Exceção: Dano simples (caput)'),
('CP', 'Código Penal (DL 2.848/40)', '168', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Apropriação indébita'),
('CP', 'Código Penal (DL 2.848/40)', '168-A', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Apropriação previdenciária'),
('CP', 'Código Penal (DL 2.848/40)', '171', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Estelionato'),
('CP', 'Código Penal (DL 2.848/40)', '172', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '173', NULL, FALSE, 'Crimes contra o patrimônio', '1', 'Abuso incapazes'),
('CP', 'Código Penal (DL 2.848/40)', '174', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '175', NULL, TRUE, 'Crimes contra o patrimônio', '1', 'Exceção: Caput, I e II'),
('CP', 'Código Penal (DL 2.848/40)', '177', '2', TRUE, 'Crimes contra o patrimônio', '1', 'Exceção'),
('CP', 'Código Penal (DL 2.848/40)', '178', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '180', '3', TRUE, 'Crimes contra o patrimônio', '1', 'Exceção: Receptação culposa'),
('CP', 'Código Penal (DL 2.848/40)', '180-A', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '184', '4', TRUE, 'Crimes contra o patrimônio', '1', 'Exceção');

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CP', 'Código Penal (DL 2.848/40)', '213', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '214', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '215', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '216', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '216-A', TRUE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '216-B', TRUE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '217', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '218', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '218-A', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '218-B', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '218-C', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '219', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '220', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '223', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '227', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '228', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '229', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '230', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '231', FALSE, 'Crimes contra a dignidade sexual', '9'),
('CP', 'Código Penal (DL 2.848/40)', '231-A', FALSE, 'Crimes contra a dignidade sexual', '9');

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CP', 'Código Penal (DL 2.848/40)', '267', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '267', '2', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '270', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '270', '2', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '271', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '271', 'unico', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '272', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '272', '2', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '273', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '273', '2', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '274', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '275', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '276', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '277', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '278', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '278', 'unico', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '280', NULL, FALSE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '280', 'unico', TRUE, 'Crimes contra a saúde pública', '3'),
('CP', 'Código Penal (DL 2.848/40)', '288', NULL, FALSE, 'Crimes praticados por quadrilha ou bando', '10'),
('CP', 'Código Penal (DL 2.848/40)', '288-A', NULL, FALSE, 'Crimes praticados por quadrilha ou bando', '10');

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CP', 'Código Penal (DL 2.848/40)', '289', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '289', '2', TRUE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '290', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '291', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '293', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '293', '4', TRUE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '294', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '296', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '297', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '298', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '299', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '300', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '303', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '304', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '305', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '306', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '309', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '310', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '311', NULL, FALSE, 'Crimes contra a fé pública', '1'),
('CP', 'Código Penal (DL 2.848/40)', '311-A', NULL, FALSE, 'Crimes contra a fé pública', '1');

-- Exceção condicional do art. 304 (nas figuras dos arts. 301 e 302) exige análise manual
UPDATE crimes_inelegibilidade
SET observacoes = 'Exceção condicional: elegível apenas nas figuras dos arts. 301 e 302 (análise manual).'
WHERE codigo = 'CP'
  AND artigo = '304'
  AND paragrafo IS NULL
  AND inciso IS NULL
  AND alinea IS NULL
  AND eh_excecao = FALSE;

INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CP', 'Código Penal (DL 2.848/40)', '312', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '312', '2', TRUE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '313', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '313-A', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '314', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '316', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '317', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '317', '2', TRUE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '318', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '322', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '323', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '323', NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Caput'),
('CP', 'Código Penal (DL 2.848/40)', '323', '1', TRUE, 'Crimes contra a administração pública', '1', 'Exceção: § 1º'),
('CP', 'Código Penal (DL 2.848/40)', '325', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '325', NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Caput'),
('CP', 'Código Penal (DL 2.848/40)', '325', '1', TRUE, 'Crimes contra a administração pública', '1', 'Exceção: § 1º'),
('CP', 'Código Penal (DL 2.848/40)', '328', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '328', NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Caput'),
('CP', 'Código Penal (DL 2.848/40)', '332', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '333', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '334', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '334-A', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '337', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '337-A', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '337-B', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '337-C', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '338', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '339', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '342', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '343', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '344', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '347', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '347', NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Caput'),
('CP', 'Código Penal (DL 2.848/40)', '351', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '351', NULL, TRUE, 'Crimes contra a administração pública', '1', 'Exceção: Caput'),
('CP', 'Código Penal (DL 2.848/40)', '351', '4', TRUE, 'Crimes contra a administração pública', '1', 'Exceção: § 4º'),
('CP', 'Código Penal (DL 2.848/40)', '353', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '355', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '356', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '357', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '359-C', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '359-D', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '359-G', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL),
('CP', 'Código Penal (DL 2.848/40)', '359-H', NULL, FALSE, 'Crimes contra a administração pública', '1', NULL);

-- CÓDIGO PENAL MILITAR (DL 1.001/69)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '205', NULL, FALSE, 'Crimes contra a vida', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '207', NULL, FALSE, 'Crimes contra a vida', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '208', NULL, FALSE, 'Crimes hediondos', '7', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '232', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '233', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '234', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '235', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '238', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '239', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '400', NULL, FALSE, 'Crimes contra a vida', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '401', NULL, FALSE, 'Crimes hediondos', '7', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '402', NULL, FALSE, 'Crimes hediondos', '7', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '404', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '405', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '406', NULL, FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '407', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '408', NULL, FALSE, 'Crimes contra a dignidade sexual', '9', NULL);

-- CPM: Crimes contra o patrimônio (arts. 240-254, 257-267) - Exceções: 262, 263, 264, 265 quando c/c art. 266 (culposos)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '240', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '241', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '242', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '243', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '244', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '245', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '246', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '247', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '248', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '249', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '250', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '251', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '252', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '253', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '254', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '257', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '258', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '259', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '260', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '261', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '262', FALSE, 'Crimes contra o patrimônio', '1', 'Exceção: quando c/c art. 266 culposo'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '263', FALSE, 'Crimes contra o patrimônio', '1', 'Exceção: quando c/c art. 266 culposo'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '264', FALSE, 'Crimes contra o patrimônio', '1', 'Exceção: quando c/c art. 266 culposo'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '265', FALSE, 'Crimes contra o patrimônio', '1', 'Exceção: quando c/c art. 266 culposo'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '266', FALSE, 'Crimes contra o patrimônio', '1', NULL),
('CPM', 'Código Penal Militar (DL 1.001/69)', '267', FALSE, 'Crimes contra o patrimônio', '1', NULL);

-- CPM: Crimes contra meio ambiente e saúde pública (arts. 290-297) - Exceções: 292§2, 293§3, 294 p.único, 295 p.único, 296 p.único
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '290', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '291', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '292', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '292', '2', TRUE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '293', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '293', '3', TRUE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '294', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '294', 'unico', TRUE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '295', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '295', 'unico', TRUE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '296', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '296', 'unico', TRUE, 'Crimes contra o meio ambiente e saúde pública', '3'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '297', NULL, FALSE, 'Crimes contra o meio ambiente e saúde pública', '3');

-- CPM: Crimes contra administração pública e fé pública (arts. 298-322, 324-354) - Exceções: 303§3, 332§2, 352 p.único
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CPM', 'Código Penal Militar (DL 1.001/69)', '298', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '299', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '300', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '301', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '302', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '303', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '303', '3', TRUE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '304', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '305', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '306', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '307', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '308', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '309', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '310', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '311', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '312', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '313', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '314', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '315', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '316', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '317', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '318', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '319', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '320', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '321', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '322', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '324', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '325', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '326', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '327', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '328', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '329', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '330', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '331', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '332', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '332', '2', TRUE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '333', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '334', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '335', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '336', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '337', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '338', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '339', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '340', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '341', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '342', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '343', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '344', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '345', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '346', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '347', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '348', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '349', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '350', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '351', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '352', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '352', 'unico', TRUE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '353', NULL, FALSE, 'Crimes contra administração e fé pública', '1'),
('CPM', 'Código Penal Militar (DL 1.001/69)', '354', NULL, FALSE, 'Crimes contra administração e fé pública', '1');

-- CÓDIGO ELEITORAL (LEI 4.737/65)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CE', 'Código Eleitoral (Lei 4.737/65)', '289', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '291', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '298', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '299', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '301', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '302', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '307', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '308', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '309', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '315', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '316', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '317', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '339', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '340', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '348', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '349', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '350', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '352', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '353', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '354', FALSE, 'Crimes eleitorais', '4'),
('CE', 'Código Eleitoral (Lei 4.737/65)', '354-A', FALSE, 'Crimes eleitorais', '4');

-- LEIS ESPECIAIS (conforme tabela CRE-SP out/2024)

-- CLT (DL 5.452/43)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('CLT', 'CLT (DL 5.452/43)', '49', FALSE, 'Crimes contra a fé pública', '1');

-- DL 7.661/45 - Lei Falimentar (revogada pela Lei 11.101/05)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('DL_7661_45', 'DL 7.661/45 - Lei Falimentar (revogada)', '186', FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Lei revogada pela 11.101/05'),
('DL_7661_45', 'DL 7.661/45 - Lei Falimentar (revogada)', '187', FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Lei revogada pela 11.101/05'),
('DL_7661_45', 'DL 7.661/45 - Lei Falimentar (revogada)', '188', FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Lei revogada pela 11.101/05'),
('DL_7661_45', 'DL 7.661/45 - Lei Falimentar (revogada)', '189', FALSE, 'Crimes previstos na lei que regula a falência', '2', 'Lei revogada pela 11.101/05');

-- DL 201/67
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('DL_201_67', 'DL 201/67 - Crimes de responsabilidade', '1', FALSE, 'Crimes contra a administração pública', '1');

-- LC 105/01
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LC_105_01', 'LC 105/01', '10', FALSE, 'Crimes contra a fé pública', '1');

-- Lei 1.521/51
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_1521_51', 'Lei 1.521/51 - Economia popular', '3', FALSE, 'Crimes contra a economia popular', '1');

-- Lei 4.591/64
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_4591_64', 'Lei 4.591/64 - Condomínios', '65', FALSE, 'Crimes contra a economia popular', '1');

-- Lei 4.595/64
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_4595_64', 'Lei 4.595/64 - Sistema financeiro', '34', FALSE, 'Crimes contra o sistema financeiro', '2');

-- Lei 4.728/65
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_4728_65', 'Lei 4.728/65 - Mercado de capitais', '66-B', FALSE, 'Crimes contra o mercado de capitais', '2'),
('LEI_4728_65', 'Lei 4.728/65 - Mercado de capitais', '73', FALSE, 'Crimes contra o mercado de capitais', '2'),
('LEI_4728_65', 'Lei 4.728/65 - Mercado de capitais', '74', FALSE, 'Crimes contra o mercado de capitais', '2');

-- Lei 4.898/65
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, inciso, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_4898_65', 'Lei 4.898/65 - Abuso de autoridade', '6', '3', 'c', FALSE, 'Crimes de abuso de autoridade', '5');

-- Lei 6.091/74
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, inciso, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_6091_74', 'Lei 6.091/74 - Transporte eleitores', '11', 'III', FALSE, 'Crimes eleitorais', '4'),
('LEI_6091_74', 'Lei 6.091/74 - Transporte eleitores', '11', 'V', FALSE, 'Crimes eleitorais', '4');

-- Lei 6.368/76 - Drogas (revogada pela Lei 11.343/06)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_6368_76', 'Lei 6.368/76 - Drogas (revogada)', '12', FALSE, 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela 11.343/06'),
('LEI_6368_76', 'Lei 6.368/76 - Drogas (revogada)', '13', FALSE, 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela 11.343/06'),
('LEI_6368_76', 'Lei 6.368/76 - Drogas (revogada)', '14', FALSE, 'Crimes de tráfico de entorpecentes', '7', 'Lei revogada pela 11.343/06');

-- Lei 6.385/76
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_6385_76', 'Lei 6.385/76 - CVM', '27-C', FALSE, 'Crimes contra o mercado de capitais', '2'),
('LEI_6385_76', 'Lei 6.385/76 - CVM', '27-D', FALSE, 'Crimes contra o mercado de capitais', '2');

-- Lei 6.766/79
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_6766_79', 'Lei 6.766/79 - Parcelamento solo', '50', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_6766_79', 'Lei 6.766/79 - Parcelamento solo', '51', FALSE, 'Crimes contra a administração pública', '1');

-- Lei 6.996/82
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_6996_82', 'Lei 6.996/82 - Processamento eletrônico', '15', FALSE, 'Crimes eleitorais', '4');

-- Lei 7.492/86 - Colarinho Branco
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '2', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '3', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '4', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '5', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '6', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '7', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '8', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '9', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '10', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '11', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '12', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '13', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '14', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '15', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '16', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '17', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '18', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '19', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '20', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '21', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '22', FALSE, 'Crimes contra o sistema financeiro', '2'),
('LEI_7492_86', 'Lei 7.492/86 - Colarinho Branco', '23', FALSE, 'Crimes contra o sistema financeiro', '2');

-- ECA (Lei 8.069/90)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_8069_90', 'Lei 8.069/90 - ECA', '240', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '241', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '241-A', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '241-B', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '241-C', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '241-D', FALSE, 'Crimes contra a dignidade sexual', '9'),
('LEI_8069_90', 'Lei 8.069/90 - ECA', '244-A', FALSE, 'Crimes contra a dignidade sexual', '9');

-- Lei 8.137/90 - Ordem tributária (Exceção: art. 7º p.único)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '1', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '3', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '4', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '5', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '6', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '7', NULL, FALSE, 'Crimes contra a economia popular', '1'),
('LEI_8137_90', 'Lei 8.137/90 - Ordem tributária', '7', 'unico', TRUE, 'Crimes contra a economia popular', '1');

-- Lei 8.176/91 (arts. 5º e 6º revogados pela Lei 12.529/2011)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_8176_91', 'Lei 8.176/91 - Ordem econômica', '1', FALSE, 'Crimes contra a economia popular e patrimônio', '1', 'Arts. 5º e 6º revogados pela 12.529/11'),
('LEI_8176_91', 'Lei 8.176/91 - Ordem econômica', '2', FALSE, 'Crimes contra a economia popular e patrimônio', '1', 'Arts. 5º e 6º revogados pela 12.529/11');

-- Lei 8.666/93
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '89', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '90', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '92', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '94', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '95', FALSE, 'Crimes contra a administração pública', '1'),
('LEI_8666_93', 'Lei 8.666/93 - Licitações', '96', FALSE, 'Crimes contra a administração pública', '1');

-- Lei 9.504/97 - Lei Eleitoral
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_9504_97', 'Lei 9.504/97 - Lei Eleitoral', '57-H', '1', FALSE, 'Crimes eleitorais', '4'),
('LEI_9504_97', 'Lei 9.504/97 - Lei Eleitoral', '72', NULL, FALSE, 'Crimes eleitorais', '4');

-- Lei 11.101/05 - Lei Falimentar
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '168', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '169', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '170', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '171', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '172', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '173', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '174', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '175', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '176', FALSE, 'Crimes previstos na lei que regula a falência', '2'),
('LEI_11101_05', 'Lei 11.101/05 - Lei Falimentar', '177', FALSE, 'Crimes previstos na lei que regula a falência', '2');

-- Lei 13.260/16 - Terrorismo
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e) VALUES
('LEI_13260_16', 'Lei 13.260/16 - Terrorismo', '2', FALSE, 'Crimes de terrorismo', '7'),
('LEI_13260_16', 'Lei 13.260/16 - Terrorismo', '3', FALSE, 'Crimes de terrorismo', '7'),
('LEI_13260_16', 'Lei 13.260/16 - Terrorismo', '4', FALSE, 'Crimes de terrorismo', '7'),
('LEI_13260_16', 'Lei 13.260/16 - Terrorismo', '5', FALSE, 'Crimes de terrorismo', '7'),
('LEI_13260_16', 'Lei 13.260/16 - Terrorismo', '6', FALSE, 'Crimes de terrorismo', '7');

-- LEI_2889_56, LEI_7716_89, LEI_9455_97, LEI_11343_06, LEI_9613_98, LEI_12850_13, LEI_9605_98, LEI_9503_97, LEI_8429_92, LEI_10826_03
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_2889_56', 'Lei 2.889/56 - Genocídio', '1', FALSE, 'Crimes hediondos', '7', NULL),
('LEI_2889_56', 'Lei 2.889/56 - Genocídio', '2', FALSE, 'Crimes hediondos', '7', 'Exceção condicional no caput: quando se referir ao art. 1º, alínea "e" (análise manual).'),
('LEI_2889_56', 'Lei 2.889/56 - Genocídio', '3', FALSE, 'Crimes hediondos', '7', 'Exceção condicional no caput: quando se referir ao art. 1º, alínea "e" (análise manual).'),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '2-A', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '3', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '4', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '5', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '6', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '7', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '8', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '9', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '10', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '11', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '12', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '13', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '14', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_7716_89', 'Lei 7.716/89 - Racismo', '20', FALSE, 'Crimes de racismo', '7', NULL),
('LEI_9455_97', 'Lei 9.455/97 - Tortura', '1', FALSE, 'Crimes de tortura', '7', NULL),
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '33', FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL),
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '34', FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL),
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '35', FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL),
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '36', FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL),
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '37', FALSE, 'Crimes de tráfico de entorpecentes', '7', NULL),
('LEI_9613_98', 'Lei 9.613/98 - Lavagem', '1', FALSE, 'Crimes de lavagem ou ocultação de bens', '6', NULL),
('LEI_12850_13', 'Lei 12.850/13 - Org. Crim.', '2', FALSE, 'Crimes praticados por organização criminosa', '10', NULL),
('LEI_9503_97', 'Lei 9.503/97 - CTB', '302', FALSE, 'Crimes de trânsito', '8', NULL),
('LEI_8429_92', 'Lei 8.429/92 - Improbidade', '10', FALSE, 'Atos de improbidade', '1', 'Prejuízo ao erário');

-- Lei 11.343/06: art. 33, § 3º é exceção expressa
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_11343_06', 'Lei 11.343/06 - Drogas', '33', '3', TRUE, 'Crimes de tráfico de entorpecentes', '7', 'Exceção: § 3º');

-- Lei 9.605/98 - Ambiental (arts. 30, 33-35, 38-42, 50-A, 54, 56, 61-63, 66-69-A + exceções)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '30', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '33', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '34', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '35', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '38', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '38', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '38-A', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '38-A', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '39', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '40', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '40', '3', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção §3º'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '41', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '41', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '42', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '50-A', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '54', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '54', '1', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção §1º'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '56', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '56', '3', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção §3º'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '61', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '62', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '62', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '63', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '66', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '67', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '67', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '68', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '68', 'unico', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção'),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '69', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '69-A', NULL, FALSE, 'Crimes contra o meio ambiente', '3', NULL),
('LEI_9605_98', 'Lei 9.605/98 - Ambiental', '69-A', '1', TRUE, 'Crimes contra o meio ambiente', '3', 'Exceção §1º');

-- Lei 10.826/03 Art. 16: somente caput e §1º impeditivos (Padrão C)
INSERT INTO crimes_inelegibilidade (codigo, lei, artigo, paragrafo, eh_excecao, artigo_inteiro_impeditivo, tipo_crime, item_alinea_e, observacoes) VALUES
('LEI_10826_03', 'Lei 10.826/03 - Desarmamento', '16', NULL, FALSE, FALSE, 'Crime hediondo', '7', 'Referência; impeditivos: caput e §1º'),
('LEI_10826_03', 'Lei 10.826/03 - Desarmamento', '16', '1', FALSE, FALSE, 'Crime hediondo', '7', 'Caput e §1º c.c. §2º'),
('LEI_10826_03', 'Lei 10.826/03 - Desarmamento', '17', NULL, FALSE, TRUE, 'Crime hediondo', '7', NULL),
('LEI_10826_03', 'Lei 10.826/03 - Desarmamento', '18', NULL, FALSE, TRUE, 'Crime hediondo', '7', NULL);

COMMENT ON TABLE crimes_inelegibilidade IS 'SSoT: Tabela Oficial da Corregedoria (v0.3.25)';
GRANT ALL ON TABLE crimes_inelegibilidade TO postgres, service_role;

-- verificar_elegibilidade (interpretação CRE - docs/references/interpretacao-tabela-oficial.md)
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
    v_artigo_existe BOOLEAN;
    v_artigo_inteiro_impeditivo record;
    v_eh_excecao BOOLEAN;
    v_mensagem TEXT;
BEGIN
    SELECT t.eh_excecao, t.tipo_crime, t.observacoes, t.item_alinea_e
    INTO v_record
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND (
          (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
          (p_paragrafo IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = LOWER(TRIM(p_paragrafo)))
      )
      AND (
          (p_inciso IS NULL AND t.inciso IS NULL) OR
          (p_inciso IS NOT NULL AND UPPER(TRIM(t.inciso)) = UPPER(TRIM(p_inciso)))
      )
      AND (
          (p_alinea IS NULL AND t.alinea IS NULL) OR
          (p_alinea IS NOT NULL AND UPPER(TRIM(t.alinea)) = UPPER(TRIM(p_alinea)))
      )
    ORDER BY
      (p_paragrafo IS NOT NULL AND t.paragrafo = p_paragrafo) DESC NULLS LAST,
      (p_inciso IS NOT NULL AND t.inciso = p_inciso) DESC NULLS LAST,
      (p_alinea IS NOT NULL AND t.alinea = p_alinea) DESC NULLS LAST,
      t.eh_excecao DESC
    LIMIT 1;

    IF FOUND THEN
        SELECT string_agg(
            CASE
                WHEN t2.paragrafo IS NOT NULL THEN
                    CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t2.paragrafo END
                WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                WHEN t2.alinea IS NOT NULL THEN 'alínea ' || t2.alinea
                ELSE 'caput'
            END,
            '; '
        ) INTO v_excecoes_list
        FROM public.crimes_inelegibilidade t2
        WHERE t2.codigo = UPPER(p_codigo_norma)
          AND t2.artigo = p_artigo
          AND t2.eh_excecao = TRUE;

        RETURN QUERY SELECT
            (CASE WHEN v_record.eh_excecao THEN 'ELEGIVEL' ELSE 'INELEGIVEL' END)::VARCHAR,
            v_record.tipo_crime::TEXT, v_record.observacoes::TEXT,
            ('Artigo consta na Tabela Oficial da Corregedoria (Item ' || COALESCE(v_record.item_alinea_e, '?') || ' da alínea "e")')::TEXT,
            v_record.item_alinea_e::VARCHAR, v_excecoes_list::TEXT;
        RETURN;
    END IF;

    SELECT EXISTS (
        SELECT 1 FROM public.crimes_inelegibilidade t
        WHERE t.codigo = UPPER(p_codigo_norma) AND t.artigo = p_artigo
    ) INTO v_artigo_existe;

    IF NOT v_artigo_existe THEN
        RETURN QUERY SELECT
            'NAO_CONSTA'::VARCHAR, NULL::TEXT, NULL::TEXT,
            'Artigo não consta na tabela de inelegibilidade.'::TEXT,
            NULL::VARCHAR, NULL::TEXT;
        RETURN;
    END IF;

    SELECT t.tipo_crime, t.item_alinea_e INTO v_artigo_inteiro_impeditivo
    FROM public.crimes_inelegibilidade t
    WHERE t.codigo = UPPER(p_codigo_norma)
      AND t.artigo = p_artigo
      AND t.paragrafo IS NULL
      AND t.inciso IS NULL
      AND t.alinea IS NULL
      AND t.eh_excecao = FALSE
      AND COALESCE(t.artigo_inteiro_impeditivo, TRUE) = TRUE
    LIMIT 1;

    IF FOUND THEN
        SELECT EXISTS (
            SELECT 1 FROM public.crimes_inelegibilidade t
            WHERE t.codigo = UPPER(p_codigo_norma)
              AND t.artigo = p_artigo
              AND t.eh_excecao = TRUE
              AND (
                  (p_paragrafo IS NULL AND t.paragrafo IS NULL) OR
                  (p_paragrafo IS NOT NULL AND LOWER(TRIM(t.paragrafo)) = LOWER(TRIM(p_paragrafo)))
              )
              AND (
                  (p_inciso IS NULL AND t.inciso IS NULL) OR
                  (p_inciso IS NOT NULL AND UPPER(TRIM(t.inciso)) = UPPER(TRIM(p_inciso)))
              )
              AND (
                  (p_alinea IS NULL AND t.alinea IS NULL) OR
                  (p_alinea IS NOT NULL AND UPPER(TRIM(t.alinea)) = UPPER(TRIM(p_alinea)))
              )
        ) INTO v_eh_excecao;

        IF v_eh_excecao THEN
            RETURN QUERY SELECT
                'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
                'Dispositivo consta como exceção na Tabela Oficial.'::TEXT,
                NULL::VARCHAR, NULL::TEXT;
            RETURN;
        END IF;

        v_mensagem := 'Art. ' || p_artigo ||
            COALESCE(' § ' || p_paragrafo, '') ||
            COALESCE(', inc. ' || p_inciso, '') ||
            COALESCE(', al. ' || p_alinea, '') ||
            ' não consta explicitamente na tabela; conforme interpretação (artigo inteiro impeditivo), trata-se como inelegível.';
        RETURN QUERY SELECT
            'INELEGIVEL'::VARCHAR,
            v_artigo_inteiro_impeditivo.tipo_crime::TEXT,
            NULL::TEXT, v_mensagem::TEXT,
            v_artigo_inteiro_impeditivo.item_alinea_e::VARCHAR,
            (SELECT string_agg(
                CASE
                    WHEN t2.paragrafo IS NOT NULL THEN
                        CASE WHEN LOWER(TRIM(t2.paragrafo)) = 'unico' THEN 'parágrafo único' ELSE '§ ' || t2.paragrafo END
                    WHEN t2.inciso IS NOT NULL THEN 'inciso ' || t2.inciso
                    WHEN t2.alinea IS NOT NULL THEN 'alínea ' || t2.alinea
                    ELSE 'caput'
                END,
                '; '
            ) FROM public.crimes_inelegibilidade t2
            WHERE t2.codigo = UPPER(p_codigo_norma) AND t2.artigo = p_artigo AND t2.eh_excecao = TRUE)::TEXT;
        RETURN;
    END IF;

    v_mensagem := 'Dispositivo não consta na enumeração impeditiva da tabela; fora do rol explícito, trata-se como elegível.';
    RETURN QUERY SELECT
        'ELEGIVEL'::VARCHAR, NULL::TEXT, NULL::TEXT,
        v_mensagem::TEXT, NULL::VARCHAR, NULL::TEXT;
END;
$$;

COMMENT ON FUNCTION public.verificar_elegibilidade IS 'Verifica elegibilidade conforme interpretação CRE (docs/references/interpretacao-tabela-oficial.md).';
GRANT EXECUTE ON FUNCTION public.verificar_elegibilidade TO postgres, service_role, anon, authenticated;
