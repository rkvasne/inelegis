-- 005_insert_leis_especiais.sql

-- LEI DE DROGAS (lei_11343_06) - Assumindo ID conforme ordem de inserção na migration 02
-- Sugestão: Use subqueries para garantir o ID correto se não tiver certeza da ordem
DO $$
DECLARE
    v_id_drogas int := (SELECT id FROM normas WHERE codigo = 'lei_11343_06');
    v_id_eleitoral int := (SELECT id FROM normas WHERE codigo = 'CE');
    v_id_racismo int := (SELECT id FROM normas WHERE codigo = 'lei_7716_89');
    v_id_lavagem int := (SELECT id FROM normas WHERE codigo = 'lei_9613_98');
    v_id_armas int := (SELECT id FROM normas WHERE codigo = 'lei_10826_03');
    v_id_tortura int := (SELECT id FROM normas WHERE codigo = 'lei_9455_97');
    v_id_org_crim int := (SELECT id FROM normas WHERE codigo = 'lei_12850_13');
    v_id_terror int := (SELECT id FROM normas WHERE codigo = 'lei_13260_16');
BEGIN

    -- Lei de Drogas
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_drogas, '33', 'Tráfico de entorpecentes', '7'),
    (v_id_drogas, '34', 'Tráfico de entorpecentes', '7'),
    (v_id_drogas, '35', 'Tráfico de entorpecentes', '7'),
    (v_id_drogas, '36', 'Tráfico de entorpecentes', '7'),
    (v_id_drogas, '37', 'Tráfico de entorpecentes', '7');
    
    INSERT INTO artigos_excecoes (norma_id, artigo, paragrafo, motivo_excecao) VALUES
    (v_id_drogas, '33', '3', 'Uso compartilhado (exceção prevista na tabela)');

    -- Código Eleitoral
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_eleitoral, '289', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '291', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '298', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '299', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '301', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '302', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '307', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '308', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '309', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '315', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '316', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '317', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '339', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '340', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '348', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '349', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '350', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '352', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '353', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '354', 'Crimes Eleitorais', '4'),
    (v_id_eleitoral, '354-A', 'Crimes Eleitorais', '4');

    -- Racismo
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_racismo, '2-A', 'Crimes de Racismo', '7'),
    (v_id_racismo, '3', 'Crimes de Racismo', '7'),
    (v_id_racismo, '4', 'Crimes de Racismo', '7'),
    (v_id_racismo, '5', 'Crimes de Racismo', '7'),
    (v_id_racismo, '20', 'Crimes de Racismo', '7');

    -- Lavagem de Dinheiro
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_lavagem, '1', 'Lavagem ou ocultação de bens', '6');

    -- Armas de Fogo (Estatuto do Desarmamento)
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_armas, '16', 'Crime hediondo (Armas)', '7'),
    (v_id_armas, '17', 'Crime hediondo (Armas)', '7'),
    (v_id_armas, '18', 'Crime hediondo (Armas)', '7');

    -- Tortura
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_tortura, '1', 'Crimes de Tortura', '7');

    -- Organização Criminosa
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_org_crim, '1', 'Organização Criminosa', '10');

    -- Terrorismo
    INSERT INTO artigos_inelegiveis (norma_id, artigo, tipo_crime, item_alinea_e) VALUES
    (v_id_terror, '2', 'Crimes de Terrorismo', '7'),
    (v_id_terror, '3', 'Crimes de Terrorismo', '7'),
    (v_id_terror, '5', 'Crimes de Terrorismo', '7');

END $$;