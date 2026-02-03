/**
 * Supabase Maintenance API
 * Endpoint para tarefas de manutenção e limpeza (Retenção de dados)
 *
 * Deploy: Vercel Serverless Function
 * @version 2.1.0
 */

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis do Supabase não configuradas");
  }

  return createClient(supabaseUrl, supabaseKey);
}

const RETENTION_DAYS = parseInt(process.env.HISTORY_RETENTION_DAYS || "90", 10);

export default async function handler(req, res) {
  // Verificar token de cron
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.authorization;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = getSupabase();

    // Calcular data limite para retenção
    const retentionDate = new Date();
    retentionDate.setDate(retentionDate.getDate() - RETENTION_DAYS);

    // Deletar registros antigos
    const { data, error, count } = await supabase
      .from("historico_consultas")
      .delete()
      .lt("timestamp", retentionDate.toISOString())
      .select("id", { count: "exact" });

    if (error) {
      throw new Error(`Supabase delete error: ${error.message}`);
    }

    // Estatísticas
    const { count: totalRecords } = await supabase
      .from("historico_consultas")
      .select("*", { count: "exact", head: true });

    return res.status(200).json({
      success: true,
      message: `Manutenção concluída`,
      details: {
        deletedRecords: count || 0,
        retentionDays: RETENTION_DAYS,
        totalRecordsAfter: totalRecords,
        executedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("❌ Erro na manutenção:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
