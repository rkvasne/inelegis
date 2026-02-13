/**
 * dashboard-ui.js
 * Lógica de interface e carregamento de dados do painel admin
 */

export const dashboardUI = {
  async init() {
    await Promise.all([
      this.loadKPIs(),
      this.loadCharts(),
      this.loadAuditLog(),
      this.loadUptime(),
    ]);
  },

  /**
   * Carrega os indicadores principais (KPIs)
   */
  async loadKPIs() {
    const { data, error } = await window.supabase.rpc("get_dashboard_stats");

    if (data && data.length > 0) {
      const stats = data[0];
      document.getElementById("totalSearches").textContent =
        stats.total_searches.toLocaleString();
      document.getElementById("inelegiveisCount").textContent =
        stats.inelegiveis.toLocaleString();
      document.getElementById("elegiveisCount").textContent =
        stats.elegiveis.toLocaleString();
    }
  },

  /**
   * Carrega e inicializa os gráficos do Chart.js
   */
  async loadCharts() {
    // 1. Timeline Chart
    const { data: timelineData } = await window.supabase
      .from("analytics_timeline")
      .select("*");
    if (timelineData) {
      const labels = timelineData
        .map((item) => new Date(item.date).toLocaleDateString("pt-BR"))
        .reverse();
      const values = timelineData.map((item) => item.searches).reverse();

      new Chart(document.getElementById("timelineChart"), {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Consultas",
              data: values,
              borderColor: getComputedStyle(document.documentElement)
                .getPropertyValue("--primary")
                .trim(),
              backgroundColor: getComputedStyle(document.documentElement)
                .getPropertyValue("--glass")
                .trim(),
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: {
              grid: { display: false },
              ticks: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue("--text-muted")
                  .trim(),
              },
            },
          },
        },
      });
    }

    // 2. Distribution Chart
    const { data: distData } = await window.supabase
      .from("analytics_result_distribution")
      .select("*");
    if (distData) {
      const labels = distData.map((item) => item.resultado.toUpperCase());
      const values = distData.map((item) => item.count);

      new Chart(document.getElementById("distributionChart"), {
        type: "doughnut",
        data: {
          labels,
          datasets: [
            {
              data: values,
              backgroundColor: [
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--success")
                  .trim(),
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--danger")
                  .trim(),
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--warning")
                  .trim(),
                getComputedStyle(document.documentElement)
                  .getPropertyValue("--primary")
                  .trim(),
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: getComputedStyle(document.documentElement)
                  .getPropertyValue("--text-muted")
                  .trim(),
                boxWidth: 10,
              },
            },
          },
        },
      });
    }
  },

  /**
   * Carrega o log de auditoria detalhado
   */
  async loadAuditLog() {
    const { data, error } = await window.supabase
      .from("historico_consultas")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(50);

    const tbody = document.querySelector("#auditTable tbody");
    tbody.innerHTML = "";

    if (data) {
      data.forEach((log) => {
        const tr = document.createElement("tr");
        const badgeClass =
          log.resultado === "inelegivel"
            ? "badge-danger"
            : log.resultado === "elegivel"
              ? "badge-success"
              : "badge-warning";

        tr.innerHTML = `
                    <td style="font-size: 0.75rem; color: var(--text-muted);">
                        ${new Date(log.timestamp).toLocaleString("pt-BR")}
                    </td>
                    <td style="font-weight: 500;">
                        ${log.lei} - Art. ${log.artigo}
                    </td>
                    <td>
                        <span class="badge ${badgeClass}">${log.resultado}</span>
                    </td>
                    <td style="font-size: 0.875rem;">
                        ${log.tipo_crime || "Busca Manual"}
                    </td>
                    <td>
                        <button class="btn" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--glass);" 
                                onclick="alert('${log.motivo_detalhado || "Sem detalhes técnicos"}')">
                            🔍 Ver Fundamentação
                        </button>
                    </td>
                `;
        tbody.appendChild(tr);
      });
    }
  },

  /**
   * Carrega o status do sistema (Keepalive)
   */
  async loadUptime() {
    const { data } = await window.supabase
      .from("keepalive")
      .select("*")
      .single();

    if (data) {
      const statusEl = document.getElementById("uptimeStatus");
      const lastPing = new Date(data.last_ping_at);
      const now = new Date();
      const diffMin = Math.round((now - lastPing) / (1000 * 60));

      if (diffMin < 10) {
        statusEl.textContent = `Keepalive: Online (${diffMin}m atrás)`;
        statusEl.parentElement.style.color = "var(--success)";
      } else {
        statusEl.textContent = `Keepalive: Atencao (${diffMin}m atrás)`;
        statusEl.parentElement.style.color = "var(--warning)";
      }
    }
  },
};
