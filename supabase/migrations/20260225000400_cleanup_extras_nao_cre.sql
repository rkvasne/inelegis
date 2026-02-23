-- =====================================================
-- Migration: cleanup extras não previstos na tabela CRE
-- =====================================================
-- Remove registros que não constam na tabela oficial CRE-SP (out/2024)
-- e que não fazem parte da interpretação operacional adotada no Inelegis.
-- Data: 25/02/2026
-- =====================================================

DELETE FROM public.crimes_inelegibilidade
WHERE codigo IN ('LEI_9503_97', 'LEI_8429_92');
