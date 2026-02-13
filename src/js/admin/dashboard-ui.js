/**
 * dashboard-ui.js
 * Lógica de interface e carregamento de dados do painel admin
 */

export const dashboardUI = {
  async init() {
    this.allLogs = [];
    await Promise.all([
      this.loadKPIs(),
      this.loadCharts(),
      this.loadAuditLog(),
      this.loadUptime(),
    ]);

    this.setupEventListeners();
  },

  /**
   * Helper para obter variáveis do tema CSS
   */
  getThemeColor(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },

  setupEventListeners() {
    const filterLei = document.getElementById("filterLei");
    const filterResultado = document.getElementById("filterResultado");
    const searchArtigo = document.getElementById("searchArtigo");
    const closeModal = document.getElementById("closeModal");
    const modalOverlay = document.getElementById("detailsModal");

    const applyFilters = () => {
      const lei = filterLei.value;
      const res = filterResultado.value;
      const term = searchArtigo.value.toLowerCase();

      const filtered = this.allLogs.filter((log) => {
        const matchLei = !lei || log.lei === lei;
        const matchRes = !res || log.resultado === res;
        const matchArt =
          !term ||
          log.artigo?.toLowerCase().includes(term) ||
          log.tipo_crime?.toLowerCase().includes(term);
        return matchLei && matchRes && matchArt;
      });

      this.renderLogTable(filtered);
    };

    filterLei.addEventListener("change", applyFilters);
    filterResultado.addEventListener("change", applyFilters);
    searchArtigo.addEventListener("input", applyFilters);

    closeModal.addEventListener("click", () => {
      modalOverlay.classList.remove("active");
    });

    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) modalOverlay.classList.remove("active");
    });
  },

  /**
   * Carrega os indicadores principais (KPIs)
   */
  async loadKPIs() {
    const { data } = await window.supabase.rpc("get_dashboard_stats");

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
    const chartColors = {
      primary: this.getThemeColor("--primary"),
      success: this.getThemeColor("--success"),
      danger: this.getThemeColor("--danger"),
      warning: this.getThemeColor("--warning"),
      muted: this.getThemeColor("--text-muted"),
      glass: this.getThemeColor("--glass"),
    };

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
              borderColor: chartColors.primary,
              backgroundColor: "rgba(99, 102, 241, 0.1)",
              fill: true,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: chartColors.primary,
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
              ticks: { color: chartColors.muted },
            },
          },
        },
      });
    }

    // 2. Top 5 Laws Chart (Optimized via View in v0.3.12)
    const { data: topLawsData } = await window.supabase.from("analytics_top_leis").select("*");
    if (topLawsData) {
      new Chart(document.getElementById("lawsChart"), {
        type: "bar",
        data: {
          labels: topLawsData.map(l => (l.lei?.substring(0, 10) || "Desconhecido") + "..."),
          datasets: [{
            data: topLawsData.map(l => l.count),
            backgroundColor: chartColors.primary,
            borderRadius: 5,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { display: false },
            x: { grid: { display: false }, ticks: { color: chartColors.muted } }
          }
        }
      });
    }

    // 3. Distribution Chart
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
                chartColors.success,
                chartColors.danger,
                chartColors.warning,
                chartColors.primary,
              ],
              borderWidth: 0,
              hoverOffset: 4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
              labels: { color: chartColors.muted, boxWidth: 10, padding: 15 },
            },
          },
          cutout: "70%",
        },
      });
    }
  },

  /**
   * Carrega o log de auditoria detalhado
   */
  async loadAuditLog() {
    const { data } = await window.supabase
      .from("historico_consultas")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100);

    if (data) {
      this.allLogs = data;
      this.populateLeiFilter(data);
      this.renderLogTable(data);
    }
  },

  populateLeiFilter(logs) {
    const filterLei = document.getElementById("filterLei");
    const uniqueLeis = [...new Set(logs.map((l) => l.lei))].sort();

    uniqueLeis.forEach((lei) => {
      const opt = document.createElement("option");
      opt.value = lei;
      opt.textContent = lei;
      filterLei.appendChild(opt);
    });
  },

  renderLogTable(logs) {
    const tbody = document.querySelector("#auditTable tbody");
    document.getElementById("logCount").textContent =
      `${logs.length} registros encontrados`;
    tbody.innerHTML = "";

    logs.forEach((log, index) => {
      const tr = document.createElement("tr");
      tr.className = "stagger-in";
      tr.style.animationDelay = `${index * 0.05}s`;

      const badgeClass =
        log.resultado === "inelegivel"
          ? "badge-danger"
          : log.resultado === "elegivel"
            ? "badge-success"
            : "badge-warning";

      // Formatação centralizada via utilitário
      const device = window.ArtigoFormatter?.formatLegalDevice(log) || `Art. ${log.artigo}`;

      tr.innerHTML = `
                <td style="font-size: 0.75rem; color: var(--text-muted);">
                    ${new Date(log.timestamp).toLocaleString("pt-BR")}
                </td>
                <td style="font-weight: 500;">
                    <div style="font-size: 0.7rem; opacity: 0.6;">${log.lei}</div>
                    ${device}
                </td>
                <td>
                    <span class="badge ${badgeClass}">${log.resultado}</span>
                </td>
                <td style="font-size: 0.875rem;">
                    ${log.tipo_crime || "Busca Manual"}
                </td>
                <td>
                    <button class="btn show-details" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; background: var(--glass);" data-id="${log.id}">
                        🔍 Ver Fundamentação
                    </button>
                </td>
            `;

      tr.querySelector(".show-details").onclick = () =>
        this.showModalDetails(log);
      tbody.appendChild(tr);
    });
  },

  showModalDetails(log) {
    const modal = document.getElementById("detailsModal");
    const device = window.ArtigoFormatter?.formatLegalDevice(log) || `Art. ${log.artigo}`;

    document.getElementById("modalLegal").textContent = `${log.lei} - ${device}`;
    document.getElementById("modalVerdict").innerHTML =
      `<span class="badge ${log.resultado === "inelegivel" ? "badge-danger" : log.resultado === "elegivel" ? "badge-success" : "badge-warning"}">${log.resultado}</span>`;
    document.getElementById("modalCrime").textContent =
      log.tipo_crime || "Não especificado";
    document.getElementById("modalReason").textContent =
      log.motivo_detalhado || "Sem detalhes da fundamentação jurídica.";
    document.getElementById("modalObs").textContent =
      log.observacoes || "Nenhuma observação cadastrada.";
    document.getElementById("modalTimestamp").textContent = new Date(
      log.timestamp,
    ).toLocaleString("pt-BR");
    document.getElementById("modalId").textContent = `ID: ${log.id}`;

    if (log.excecoes_citadas) {
      document.getElementById("modalExcecoesGroup").style.display = "block";
      document.getElementById("modalExcecoes").textContent =
        log.excecoes_citadas;
    } else {
      document.getElementById("modalExcecoesGroup").style.display = "none";
    }

    modal.classList.add("active");
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
        statusEl.textContent = `Keepalive: Atenção (${diffMin}m atrás)`;
        statusEl.parentElement.style.color = "var(--warning)";
      }
    }
  },
};
