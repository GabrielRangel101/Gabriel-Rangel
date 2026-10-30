/* =====================================================================
   BARBEARIA DEMO — Painel de Performance (Supabase)
   Os números vêm do sistema (atualização diária). Metas e
   acessos são cadastrados aqui pelo dono.
   ===================================================================== */
(function () {
  'use strict';
  const CFG = window.PAINEL_CONFIG || {};
  const app = document.getElementById('app');

  if (!window.supabase || !CFG.supabaseUrl || !CFG.supabaseKey || /COLE_AQUI/.test(CFG.supabaseKey)) {
    app.innerHTML = `<div class="login"><div class="logo"><img class="logo-img" src="logo.png" alt="Barbearia Demo"></div>
      <div class="login-card"><p class="err">Painel não configurado.</p><p class="mut sm">Preencha a URL e a chave publicável do Supabase no arquivo <b>config.js</b>.</p></div></div>`;
    return;
  }
  const sb = window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } });

  /* ------------------------------------------------------------ utilitários */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const n = v => +v || 0;
  const brl = v => n(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const pct = (v, d = 1) => n(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
  const int = v => Math.round(n(v)).toLocaleString('pt-BR');
  const money = s => { const t = String(s ?? '').replace(/[^\d,.-]/g, ''); if (!t) return 0; return +(t.includes(',') ? t.replace(/\./g, '').replace(',', '.') : t) || 0; };
  const moneyIn = v => n(v) ? n(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '';
  const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const pad = x => String(x).padStart(2, '0');
  const iso = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.slice(0, 10).split('-').map(Number); return new Date(y, m - 1, d); };
  const addDays = (s, k) => { const d = parse(s); d.setDate(d.getDate() + k); return iso(d); };
  const today = () => iso(new Date());
  const mesDe = s => s.slice(0, 7) + '-01';
  const mesAtual = () => mesDe(today());
  const segunda = s => { const d = parse(s); const w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return iso(d); };
  const ultimoDia = m => { const d = parse(m); return iso(new Date(d.getFullYear(), d.getMonth() + 1, 0)); };
  const mesLabel = m => { const d = parse(m); return `${cap(MESES[d.getMonth()])} de ${d.getFullYear()}`; };
  const dBR = s => s ? s.slice(0, 10).split('-').reverse().join('/') : '—';
  const dm = s => dBR(s).slice(0, 5);
  const semanaLabel = s => `${dm(s)} a ${dm(addDays(s, 6))}`;
  const iniciais = nome => String(nome || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(p => p[0]).join('').toUpperCase();
  const curto = nome => { const p = String(nome || '').split(/\s+/).filter(Boolean); return p.length > 1 ? `${p[0]} ${p[p.length - 1]}` : (p[0] || '—'); };
  const av = (nome, sz = 40) => `<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz * .38)}px">${esc(iniciais(nome))}</span>`;

  const SEG = [
    ['servicos', 'Serviços', '#f0efef'],
    ['produtos', 'Produtos', '#e49e2b'],
    ['extras', 'Extras', '#a8641c'],
    ['assinaturas', 'Assinaturas', '#6f9bb0']
  ];
  const PRO_COLORS = ['#e49e2b', '#f0efef', '#6f9bb0', '#d0662a', '#d8bf93', '#a9c27a', '#b38fd6', '#8f8883'];

  /* --------------------------------------------------------------- ícones */
  const P = {
    home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
    cash: 'M3 6h18v12H3zM7 12h.01M17 12h.01M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    bag: 'M5 8h14l-1 12H6zM9 8V6a3 3 0 0 1 6 0v2',
    crown: 'M3 8l4 4 5-7 5 7 4-4-2 11H5z',
    trophy: 'M8 4h8v5a4 4 0 0 1-8 0zM8 6H4v2a3 3 0 0 0 4 3M16 6h4v2a3 3 0 0 1-4 3M12 13v4M8 20h8',
    target: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z',
    users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a6 6 0 0 1 12 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
    star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    menu: 'M4 7h16M4 12h16M4 17h16',
    out: 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h11',
    edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
    key: 'M15 7a4 4 0 1 1-3.9 5H7v3H4v-3H2v-3h9.1A4 4 0 0 1 15 7z',
    x: 'M6 6l12 12M18 6L6 18',
    plus: 'M12 5v14M5 12h14',
    trash: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6',
    flag: 'M5 21V4M5 4h11l-2 4 2 4H5',
    doc: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6',
    down: 'M12 4v11M7 10l5 5 5-5M5 20h14',
    eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
    user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1',
    power: 'M12 3v9M6.3 6.3a8 8 0 1 0 11.4 0',
    trend: 'M3 17l6-6 4 4 8-8M14 7h7v7'
  };
  const ic = (k, s = 20) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${P[k]}"/></svg>`;

  /* --------------------------------------------------------------- estado */
  const S = {
    me: null, perfis: [], mensal: [], semanal: [], diario: [], metas: [], metasBarbearia: [], resultado: [], atualizado: null,
    per: { tipo: 'mes', mes: mesAtual(), semana: segunda(today()), dia: null },
    carregadoEm: 0, janelas: {}, dias: {}, horas: null
  };
  const isAdmin = () => S.me && S.me.role === 'admin';

  // Cadeiras do painel: perfis ativos ligados a um nome do sistema (o dono só entra se tiver o nome preenchido).
  // Sem perfis ligados ainda, usa os nomes que vêm dos dados.
  function pros() {
    const lig = S.perfis.filter(p => p.ativo && p.profissional);
    if (lig.length) return lig.map(p => ({ key: p.profissional, nome: p.nome, id: p.id, cadeira: p.cadeira })).sort((a, b) => a.nome.localeCompare(b.nome));
    const nomes = [...new Set(S.mensal.map(r => r.profissional))];
    return nomes.map(k => ({ key: k, nome: curto(k), id: null })).sort((a, b) => a.nome.localeCompare(b.nome));
  }
  const nomeDe = key => (pros().find(p => p.key === key) || {}).nome || curto(key);
  const corDe = key => PRO_COLORS[Math.max(0, pros().findIndex(p => p.key === key)) % PRO_COLORS.length];

  const VAZIO = { servicos: 0, produtos: 0, extras: 0, assinaturas: 0, participacao_pct: 0, comissao_pote: 0, atendimentos_clube: 0, atendimentos: 0, total: 0 };
  function linhas(per = S.per) {
    if (per.tipo === 'dia') return linhasDe((S.dias[per.dia] || {}).rows || []);
    return linhasDe(per.tipo === 'mes' ? S.mensal.filter(r => r.mes === per.mes) : S.semanal.filter(r => r.semana === per.semana));
  }
  function linhasDe(fonte) {
    return pros().map(p => {
      const r = fonte.find(x => x.profissional === p.key) || VAZIO;
      const o = { ...VAZIO, ...r, pro: p };
      SEG.forEach(([k]) => o[k] = n(o[k]));
      o.total = o.servicos + o.produtos + o.extras + o.assinaturas;
      o.vendas = o.produtos + o.extras;
      o.ticket = n(o.atendimentos) ? o.total / n(o.atendimentos) : 0;
      return o;
    });
  }
  const soma = (rows, k) => rows.reduce((a, r) => a + n(r[k]), 0);
  // Metas: linha '*' = valores padrão do mês; linha do profissional sobrepõe campo a campo (0/vazio = usa o padrão).
  // Mês sem lançamento herda o último mês lançado antes dele.
  const PADRAO = '*', CAMPOS_META = ['meta_cadeira', 'min_cadeira', 'min_produtos', 'min_extras'];
  const metaLinha = (key, mes) => S.metas.filter(m => m.profissional === key && m.mes <= mes).sort((a, b) => (a.mes < b.mes ? 1 : -1))[0] || null;
  function metaDe(key, mes) {
    const ind = metaLinha(key, mes) || {}, pad = metaLinha(PADRAO, mes) || {}, o = {};
    CAMPOS_META.forEach(c => o[c] = n(ind[c]) || n(pad[c]));
    return CAMPOS_META.some(c => o[c]) ? o : null;
  }
  // Alvo usado no ranking (% da meta / do mínimo)
  const ALVO_RANK = { total: ['meta_cadeira'], vendas: ['min_produtos', 'min_extras'], produtos: ['min_produtos'], extras: ['min_extras'] };
  function alvoRank(tipo, key, mes) { const m = mes && ALVO_RANK[tipo] && metaDe(key, mes); return m ? ALVO_RANK[tipo].reduce((a, c) => a + n(m[c]), 0) : 0; }
  /* ---------- VARIAÇÃO vs período anterior ---------- */
  const perAnt = (per = S.per) => per.tipo === 'dia' ? { tipo: 'dia', dia: diaAnterior(per.dia) }
    : per.tipo === 'mes' ? { tipo: 'mes', mes: mesDe(addDays(per.mes, -1)) } : { tipo: 'semana', semana: addDays(per.semana, -7) };
  const temPer = per => per.tipo === 'dia' ? !!S.dias[per.dia] && movimento(per.dia)
    : per.tipo === 'mes' ? S.mensal.some(r => r.mes === per.mes) : S.semanal.some(r => r.semana === per.semana);
  // Período em andamento: o anterior entra PROPORCIONAL aos mesmos dias (ex.: 9 dias de outubro x 9/30 de setembro)
  const ADITIVOS = ['servicos', 'produtos', 'extras', 'assinaturas', 'atendimentos', 'atendimentos_clube', 'comissao_pote'];
  // Último dia com dados do sistema e se ele está incompleto (atualização rodou antes do fim do expediente)
  // Atualizações de hora em hora, das 10h às 22h (seg a sáb): o dia só conta como completo depois da rodada das 22h.
  const HORA_DIA_COMPLETO = 21.5;
  function dataRef() {
    const at = S.atualizado ? new Date(S.atualizado) : null, hAt = at ? at.getHours() + at.getMinutes() / 60 : 24;
    if (S.dadosAte) {
      const d = new Date(String(S.dadosAte).replace(' ', 'T')), dia = iso(d), cut = dia < today() ? dia : today();
      return { cut, parcial: cut === today() && dia === today() && (!at || iso(at) !== today() || hAt < HORA_DIA_COMPLETO) };
    }
    const ref = at ? iso(at) : today(), cut = ref < today() ? ref : today();
    return { cut, parcial: !!at && cut === today() && hAt < HORA_DIA_COMPLETO };
  }
  function fracAnt(per = S.per) {
    if (per.tipo === 'dia') return null;
    const ini = per.tipo === 'mes' ? per.mes : per.semana, fim = per.tipo === 'mes' ? ultimoDia(per.mes) : addDays(per.semana, 6);
    const lim = dataRef().cut;
    if (lim >= fim || lim < ini) return null;
    const pa = perAnt(per), dias = Math.round((parse(lim) - parse(ini)) / 864e5) + 1;
    const lenAnt = per.tipo === 'mes' ? parse(ultimoDia(pa.mes)).getDate() : 7, lenAtual = per.tipo === 'mes' ? parse(fim).getDate() : 7;
    return { f: Math.min(1, dias / lenAnt), dias, lenAtual };
  }
  // Janela "mesmos dias" do período anterior (ex.: 01/09 a 09/09), calculada no banco
  function janelaAnt(per = S.per) {
    const fr = fracAnt(per); if (!fr) return null;
    const pa = perAnt(per), ini = pa.tipo === 'mes' ? pa.mes : pa.semana, fimAnt = pa.tipo === 'mes' ? ultimoDia(pa.mes) : addDays(pa.semana, 6);
    const fim = addDays(ini, fr.dias - 1) < fimAnt ? addDays(ini, fr.dias - 1) : fimAnt;
    return { ini, fim, key: ini + '|' + fim };
  }
  async function garantirJanelas() {
    const pers = [S.per, { tipo: 'mes', mes: S.per.tipo === 'mes' ? S.per.mes : mesAtual() }, { tipo: 'mes', mes: mesAtual() }];
    for (const per of pers) {
      const j = janelaAnt(per); if (!j || S.janelas[j.key]) continue;
      try {
        const [rows, res] = await Promise.all([
          q(sb.rpc('painel_janela', { p_inicio: j.ini, p_fim: j.fim })),
          isAdmin() ? q(sb.rpc('resultado_janela', { p_inicio: j.ini, p_fim: j.fim })) : Promise.resolve([])
        ]);
        S.janelas[j.key] = { rows, completo: rows.length > 0 && rows.every(r => r.completo), res: res[0] || null };
      } catch (e) { console.warn('painel_janela indisponível', e); S.janelas[j.key] = { rows: [], completo: false, res: null }; }
    }
  }
  const janelaDe = per => { const j = janelaAnt(per); return j ? S.janelas[j.key] || null : null; };
  // 'dias' = mesmos dias exatos | 'proporcional' = estimativa (sem dado diário) | 'cheio' = período fechado
  const modoAnt = (per = S.per) => per.tipo === 'dia' ? (corteDia(per) ? 'hora' : 'cheio') : !fracAnt(per) ? 'cheio' : ((janelaDe(per) || {}).completo ? 'dias' : 'proporcional');
  function anterior(per = S.per) {
    if (per.tipo === 'dia') return anteriorDia(per);
    const pa = perAnt(per); if (!temPer(pa)) return null;
    const modo = modoAnt(per);
    if (modo === 'dias') return linhasDe(janelaDe(per).rows);
    const rows = linhas(pa), fr = fracAnt(per); if (!fr) return rows;
    return rows.map(r => { const o = { ...r }; ADITIVOS.forEach(k => o[k] = n(o[k]) * fr.f);
      o.total = o.servicos + o.produtos + o.extras + o.assinaturas; o.vendas = o.produtos + o.extras; o.ticket = n(o.atendimentos) ? o.total / n(o.atendimentos) : 0; return o; });
  }
  const doPro = (rows, key) => rows ? (rows.find(r => r.pro.key === key) || null) : null;
  const somaAnt = (ant, k) => ant ? soma(ant, k) : null;
  // dv(atual, anterior, {inv: menor é melhor, pp: diferença em pontos percentuais, abs: diferença em unidades, fmt: formato do tooltip})
  function dv(cur, prev, o = {}) {
    if (prev === null || prev === undefined) return '';
    cur = n(cur); prev = n(prev);
    const fmt = o.fmt || (o.pp ? (v => pct(v)) : o.abs ? int : brl);
    let d, txt;
    if (o.pp || o.abs) { d = cur - prev; txt = o.pp ? pct(Math.abs(d)).replace('%', ' p.p.') : int(Math.abs(d)) + (o.suf ? (Math.abs(d) === 1 ? o.suf.replace(/s$/, '') : o.suf) : ''); }
    else {
      if (!prev && !cur) return '';
      if (!prev) return `<span class="dv good" title="Antes: ${esc(fmt(prev))}">novo</span>`;
      d = 100 * (cur - prev) / Math.abs(prev); txt = pct(Math.abs(d), Math.abs(d) >= 100 ? 0 : 1);
    }
    if (Math.abs(d) < 0.05) return `<span class="dv eq" title="Antes: ${esc(fmt(prev))}">= igual</span>`;
    const sobe = d > 0, bom = o.inv ? !sobe : sobe;
    return `<span class="dv ${bom ? 'good' : 'bad'}" title="Antes: ${esc(fmt(prev))}">${sobe ? '▲' : '▼'} ${txt}</span>`;
  }
  const dvl = h => h ? `<div class="dvl">${h}</div>` : '';              // variação em linha própria (embaixo do valor)
  const kpiVar = (lbl, val, h, sub, lead) => `<div class="kpi ${lead ? 'lead' : ''}"><span class="lbl">${lbl}</span><div class="num">${val}</div>${dvl(h)}<small>${sub}</small></div>`;
  // mudança de posição num ranking (positivo = subiu)
  const dvPos = (agora, antes) => !antes || !agora || antes === agora ? (antes ? '<span class="dv eq" title="Mesma posição">=</span>' : '')
    : `<span class="dv ${antes > agora ? 'good' : 'bad'}" title="Antes: ${antes}º">${antes > agora ? '▲' : '▼'}${Math.abs(antes - agora)}</span>`;
  function legendaVar(per = S.per) {
    if (per.tipo === 'dia') return legendaDia(per);
    const pa = perAnt(per), nomeAnt = per.tipo === 'mes' ? mesLabel(pa.mes) : 'semana de ' + semanaLabel(pa.semana);
    if (!temPer(pa)) return `<p class="varnote">Sem dados ${per.tipo === 'mes' ? 'do mês anterior' : 'da semana anterior'} para comparar.</p>`;
    const fr = fracAnt(per), modo = modoAnt(per), j = janelaAnt(per);
    const andamento = fr ? `. ${per.tipo === 'mes' ? 'O mês' : 'A semana'} ainda está em andamento (<b>${fr.dias} de ${fr.lenAtual} dias</b>), então ` +
      (modo === 'dias' ? `comparamos com os <b>mesmos dias: ${dm(j.ini)} a ${dm(j.fim)}</b>` : `comparamos com o anterior <b>proporcional a ${fr.dias} dias</b> (estimativa)`) : '';
    return `<p class="varnote"><span class="dv good">▲</span> <span class="dv bad">▼</span> Variação em relação ${per.tipo === 'mes' ? 'a' : 'à'} <b>${esc(nomeAnt)}</b>${andamento}. No computador, passe o mouse na seta para ver o valor anterior.</p>`;
  }
  /* ---------- PROJEÇÃO DE FECHAMENTO ----------
     Realizado até o último dia com dados + o que falta, estimado assim:
     • comandas: média de cada dia da semana nas últimas 4 semanas (de cada barbeiro);
       serviços/produtos/extras crescem na mesma proporção das comandas;
     • assinaturas: o que entrou nos MESMOS dias do período anterior (renovam no mesmo dia).
     Testado nos 12 meses anteriores: erro médio de ~9% no dia 10, ~5% no dia 20 (barbearia).
     A faixa provável vem desse teste: barbearia ±(2% + 13% × parte que falta), cadeira ±(4% + 27% × parte que falta). */
  const PROJ_SEMANAS = 4;
  function baseProj(per = S.per) {
    if (per.tipo === 'dia') return null;   // projeção do dia: projDia()
    const ini = per.tipo === 'mes' ? per.mes : per.semana, fim = per.tipo === 'mes' ? ultimoDia(per.mes) : addDays(per.semana, 6);
    const { cut, parcial } = dataRef();
    if (cut < ini || cut >= fim) return null;
    const resto = []; for (let d = addDays(cut, 1); d <= fim; d = addDays(d, 1)) resto.push(d);
    const total = Math.round((parse(fim) - parse(ini)) / 864e5) + 1, feitos = Math.round((parse(cut) - parse(ini)) / 864e5) + 1;
    return { ini, fim, cut, resto, parcial, feitos, total, rem: (resto.length + (parcial ? 0.5 : 0)) / total };
  }
  function mapaDiario() {   // dia -> { profissional: valor }
    if (S._mapaD && S._mapaD.src === S.diario) return S._mapaD.m;
    const m = {}; S.diario.forEach(r => { (m[r.dia] = m[r.dia] || {})[r.profissional] = n(r.valor_comandas); });
    S._mapaD = { src: S.diario, m }; return m;
  }
  const valDia = (d, key) => { const x = mapaDiario()[d]; if (!x) return 0; return key ? n(x[key]) : Object.values(x).reduce((a, v) => a + n(v), 0); };
  const DIAS_SEM = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const FECHADO = [0];   // a barbearia não abre domingo
  // dias fechados cadastrados (feriados etc.): valem como domingo nas metas, projeções e médias
  const feriado = d => !!(S.fechMap && S.fechMap[d]);
  const diaFechado = d => FECHADO.includes(parse(d).getDay()) || feriado(d);
  const folgaDe = key => { const p = key && S.perfis.find(x => x.profissional === key && x.ativo); return p && p.folga ? +p.folga : null; };
  function mediaSemana(key, ate) {   // média por dia da semana (0=dom) nas últimas PROJ_SEMANAS semanas até 'ate'
    const s = Array(7).fill(0), c = Array(7).fill(0);
    for (let k = 0; k < (PROJ_SEMANAS + 2) * 7; k++) { const d = addDays(ate, -k), wd = parse(d).getDay(); if (feriado(d) || c[wd] >= PROJ_SEMANAS) continue; s[wd] += valDia(d, key); c[wd]++; }
    const f = folgaDe(key);
    return s.map((v, wd) => FECHADO.includes(wd) || wd === f || !c[wd] ? 0 : v / c[wd]);
  }
  // dias de trabalho que faltam: sem domingo, sem a folga fixa (ou, sem folga cadastrada, sem os dias em que ele não costuma atender)
  function diasTrabalho(b, key, wa) {
    const f = folgaDe(key), mx = Math.max(...wa, 1);
    const trabalha = wd => !FECHADO.includes(wd) && (f ? wd !== f : wa[wd] > 0.15 * mx);
    return b.resto.filter(d => !feriado(d) && trabalha(parse(d).getDay())).length + (b.parcial && !feriado(b.cut) && trabalha(parse(b.cut).getDay()) ? 1 : 0);
  }
  // folga mais provável pelos dados das últimas 8 semanas (dia útil com menos movimento, se for quase sempre zero)
  function folgaDetectada(key) {
    if (!key) return null; const ate = dataRef().cut, zeros = Array(7).fill(0), tot = Array(7).fill(0);
    for (let k = 1; k <= 56; k++) { const d = addDays(ate, -k), wd = parse(d).getDay(); if (diaFechado(d) || !valDia(d, null)) continue; tot[wd]++; if (!valDia(d, key)) zeros[wd]++; }
    let best = null; for (let wd = 1; wd <= 6; wd++) if (tot[wd] >= 4 && zeros[wd] / tot[wd] >= 0.75 && (!best || zeros[wd] / tot[wd] > zeros[best] / tot[best])) best = wd;
    return best;
  }
  const somaDias = (ini, fim, key) => { let t = 0; for (let d = ini; d <= fim; d = addDays(d, 1)) t += valDia(d, key); return t; };
  const assD = d => { const x = (S.assDia || []).find(r => r.dia === d); return x ? n(x.valor) : 0; };
  const somaAss = (ini, fim) => (S.assDia || []).filter(r => r.dia >= ini && r.dia <= fim).reduce((a, r) => a + n(r.valor), 0);
  function projecao(per = S.per) {
    const ck = JSON.stringify(per) + S.carregadoEm; if (S.projCache && ck in S.projCache) return S.projCache[ck];
    const b = baseProj(per); let out = null;
    if (b) {
      const hist = b.parcial ? addDays(b.cut, -1) : b.cut;   // histórico só com dias completos
      const restoDe = key => { const wa = mediaSemana(key, hist); let r = b.resto.reduce((a, d) => a + (feriado(d) ? 0 : wa[parse(d).getDay()]), 0);
        if (b.parcial && !feriado(b.cut)) r += Math.max(0, wa[parse(b.cut).getDay()] - valDia(b.cut, key)); return r; };
      // assinaturas: mesmos dias do período anterior
      const pa = perAnt(per), pIni = pa.tipo === 'mes' ? pa.mes : pa.semana, pFim = pa.tipo === 'mes' ? ultimoDia(pa.mes) : addDays(pa.semana, 6);
      const assReal = S.assDia ? somaAss(b.ini, b.cut) : null;
      let assResto = 0, assModo = 'mesmos dias';
      if (S.assDia && S.assDia.some(r => r.dia >= pIni && r.dia <= pFim)) {
        const desde = addDays(pIni, b.feitos); assResto = desde <= pFim ? somaAss(desde, pFim) : 0;
        if (b.parcial) assResto += Math.max(0, assD(addDays(pIni, b.feitos - 1)) - assD(b.cut));
      } else { assModo = 'ritmo'; }
      const rows = linhas(per).map(r => {
        const key = r.pro.key, cReal = somaDias(b.ini, b.cut, key), cResto = restoDe(key);
        const f = cReal > 0 ? (cReal + cResto) / cReal : null;
        const semCat = r.servicos + r.produtos + r.extras <= 0;   // comandas sem vendas carregadas ainda: usa o valor das comandas
        const sv = semCat ? cReal + cResto : f ? r.servicos * f : r.servicos + cResto, pr = f && !semCat ? r.produtos * f : r.produtos, ex = f && !semCat ? r.extras * f : r.extras;
        let as;
        if (assModo === 'ritmo' || !assReal) as = r.assinaturas / Math.max(1, b.feitos) * b.total;
        else as = r.assinaturas * (assReal + assResto) / assReal;
        const total = sv + pr + ex + as, banda = 0.04 + 0.27 * b.rem, diasTrab = diasTrabalho(b, key, mediaSemana(key, hist));
        return { key, diasTrab, real: r.total, servicos: sv, produtos: pr, extras: ex, assinaturas: as, total, lo: total * (1 - banda), hi: total * (1 + banda), banda };
      });
      const abertos = b.resto.filter(d => !diaFechado(d)).length + (b.parcial && !diaFechado(b.cut) ? 1 : 0);
      const comandasResto = pros().reduce((t, p) => t + restoDe(p.key), 0), bandaB = 0.02 + 0.13 * b.rem;
      out = { b, rows, assResto, assModo, comandasResto, abertos, bandaB };
    }
    if (S.projCache) S.projCache[ck] = out; return out;
  }
  const projDe = (pj, key) => pj ? pj.rows.find(x => x.key === key) || null : null;
  // situação da projeção frente à meta
  function sitProj(proj, lo, hi, meta) {
    if (!meta) return null;
    if (lo >= meta) return ['Vai bater a meta', 'good'];
    if (proj >= meta) return ['Deve bater a meta', 'good'];
    if (hi >= meta) return ['No limite: precisa acelerar', 'warn'];
    return ['Abaixo do ritmo da meta', 'bad'];
  }
  const milhar = v => 'R$ ' + (n(v) / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' mil';
  function comoProjecao() {
    openModal('Como calculamos a projeção', `<div class="stack-txt">
      <p><b>Projeção = o que já entrou + o que deve entrar até o fim do período.</b></p>
      <p><b>Comandas (serviços, produtos e extras):</b> para cada dia que falta, usamos a média daquele dia da semana nas últimas 4 semanas de cada barbeiro. Ex.: uma sexta que falta vale a média das últimas 4 sextas. Domingo a barbearia não abre, e o dia de folga de cada barbeiro (cadastrado na Equipe) conta zero para ele.</p>
      <p><b>Assinaturas:</b> usamos o que foi cobrado nos mesmos dias do mês anterior, porque cada assinatura renova sempre no mesmo dia do mês. A parte de cada barbeiro segue a participação dele no clube até agora.</p>
      <p><b>Faixa provável:</b> testamos esse cálculo nos 12 meses anteriores. Para a barbearia, o erro médio foi de ~10% no começo do mês, ~9% no dia 10, ~5% no dia 20 e ~2% no dia 25. Por cadeira, o erro é maior (~16% no dia 10, ~10% no dia 20). A faixa mostra esse erro e vai estreitando ao longo do mês.</p>
      <p class="dim sm">Não prevê feriados, férias ou datas especiais (ex.: dezembro costuma superar a projeção).</p></div>`, null);
  }
  const ordem = (rows, k) => rows ? [...rows].sort((a, b) => n(b[k]) - n(a[k]) || a.pro.nome.localeCompare(b.pro.nome)).map(r => r.pro.key) : [];
  const posDe = (ord, key) => ord.indexOf(key) + 1;
  const perLabel = (per = S.per) => per.tipo === 'dia' ? diaLabel(per.dia) : per.tipo === 'mes' ? mesLabel(per.mes) : 'Semana ' + semanaLabel(per.semana);

  /* ---------- DIA (hoje x mesmo dia da semana anterior, até a mesma hora) ----------
     As comandas e assinaturas têm hora no sistema (faturamento_horas), então "hoje até 15:07"
     é comparado com o mesmo dia da semana passada até 15:07. Serviços/produtos/extras por barbeiro só
     existem por dia: no dia anterior eles entram na proporção das comandas do barbeiro até a hora. */
  const DIAS_CURTO = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const diaCurto = d => `${DIAS_CURTO[parse(d).getDay()]} ${dm(d)}`;
  const diaLabel = d => (d === today() ? 'Hoje · ' + diaCurto(d) : d === addDays(today(), -1) ? 'Ontem · ' + diaCurto(d) : cap(DIAS_SEM[parse(d).getDay()]) + ', ' + dm(d)) + (feriado(d) ? ' (fechado)' : '');
  const horaTxt = h => h.replace(':', 'h');
  const diaPadrao = () => { let d = today(); while (FECHADO.includes(parse(d).getDay())) d = addDays(d, -1); return d; };
  function horasIdx() {
    if (!S.horas) return {};
    if (S._hIdx && S._hIdx.src === S.horas.rows) return S._hIdx.m;
    const m = {}; S.horas.rows.forEach(r => (m[r.dia] = m[r.dia] || []).push(r));
    S._hIdx = { src: S.horas.rows, m }; return m;
  }
  // soma do faturamento de um dia | o: { tipo: 'Comanda'|'Assinatura', key: barbeiro, ate: 'HH:MM' (inclusive), desde: 'HH:MM' (exclusive), qtd: conta comandas }
  function somaH(d, o = {}) {
    let v = 0, c = 0;
    for (const r of horasIdx()[d] || []) {
      if (o.tipo && r.tipo !== o.tipo) continue;
      if (o.key !== undefined && r.profissional !== o.key) continue;
      if (o.ate && r.hora > o.ate) continue;
      if (o.desde && r.hora <= o.desde) continue;
      v += n(r.valor); c += n(r.comandas);
    }
    return o.qtd ? c : v;
  }
  const movimento = d => somaH(d, { tipo: 'Comanda' }) > 0 || valDia(d, null) > 0;
  // dia de comparação = o mesmo dia da semana anterior (terça x terça), pulando feriado e dia sem movimento;
  // sem nenhum nas últimas 8 semanas, cai no último dia em que a barbearia funcionou
  function diaAnterior(d) {
    for (let k = 1; k <= 8; k++) { const x = addDays(d, -7 * k); if (!diaFechado(x) && movimento(x)) return x; }
    for (let k = 1; k <= 14; k++) { const x = addDays(d, -k); if (!diaFechado(x) && movimento(x)) return x; }
    return addDays(d, -7);
  }
  // hora de corte: hoje ainda em andamento = hora da última atualização ('00:00' = ainda não atualizou hoje)
  function corteDia(per = S.per) {
    if (per.tipo !== 'dia' || per.dia !== today()) return null;
    const at = S.atualizado ? new Date(S.atualizado) : null;
    if (!at || iso(at) !== today()) return '00:00';
    if (at.getHours() + at.getMinutes() / 60 >= HORA_DIA_COMPLETO) return null;
    return pad(at.getHours()) + ':' + pad(at.getMinutes());
  }
  function anteriorDia(per) {
    const pa = perAnt(per); if (!temPer(pa)) return null;
    const rows = linhas(pa), cut = corteDia(per); if (!cut) return rows;
    const aDia = somaH(pa.dia, { tipo: 'Assinatura' }), fa = aDia ? somaH(pa.dia, { tipo: 'Assinatura', ate: cut }) / aDia : 0;
    return rows.map(r => {
      const k = r.pro.key, cDia = somaH(pa.dia, { tipo: 'Comanda', key: k }), f = cDia ? somaH(pa.dia, { tipo: 'Comanda', key: k, ate: cut }) / cDia : 0, o = { ...r };
      ['servicos', 'produtos', 'extras', 'atendimentos_clube'].forEach(x => o[x] = n(o[x]) * f);
      o.assinaturas = n(o.assinaturas) * fa; o.comissao_pote = n(o.comissao_pote) * fa;
      o.atendimentos = somaH(pa.dia, { tipo: 'Comanda', key: k, ate: cut, qtd: true });
      o.total = o.servicos + o.produtos + o.extras + o.assinaturas; o.vendas = o.produtos + o.extras; o.ticket = o.atendimentos ? o.total / o.atendimentos : 0;
      return o;
    });
  }
  // faturamento da barbearia no dia (e no dia de comparação, até a mesma hora)
  function resDia(d, ate) {
    const o = ate ? { ate } : {};
    return { total: somaH(d, o), comandas: somaH(d, { ...o, tipo: 'Comanda' }), assinaturas: somaH(d, { ...o, tipo: 'Assinatura' }), qtd: somaH(d, { ...o, tipo: 'Comanda', qtd: true }) };
  }
  function legendaDia(per) {
    const pa = perAnt(per);
    if (!temPer(pa)) return `<p class="varnote">Sem dados do dia anterior para comparar.</p>`;
    const cut = corteDia(per), mesmoWd = parse(pa.dia).getDay() === parse(per.dia).getDay(), pulou = pa.dia !== addDays(per.dia, -7);
    const quando = (!mesmoWd ? ', o último dia de funcionamento' : pulou ? `, a última ${DIAS_SEM[parse(per.dia).getDay()]} com a barbearia aberta` : ', o mesmo dia da semana passada') + (cut === '00:00' ? '. Ainda não houve atualização hoje (a primeira atualização é às 10h)'
      : cut ? `. O dia ainda está em andamento, então comparamos <b>até as ${horaTxt(cut)}</b> (horário da última atualização) dos dois dias`
      : ', dia inteiro');
    return `<p class="varnote"><span class="dv good">▲</span> <span class="dv bad">▼</span> Variação em relação a <b>${esc(diaCurto(pa.dia))}</b>${quando}. No computador, passe o mouse na seta para ver o valor anterior.</p>`;
  }
  async function garantirHoras(desde, ate) {
    if (!S.horas || desde < S.horas.desde || ate > S.horas.ate) {
      if (S.horas && !S.horas.erro) { desde = desde < S.horas.desde ? desde : S.horas.desde; ate = ate > S.horas.ate ? ate : S.horas.ate; }
      const partes = []; for (let i = desde; i <= ate; i = addDays(i, 14)) partes.push([i, addDays(i, 13) < ate ? addDays(i, 13) : ate]);
      try {
        const res = await Promise.all(partes.map(([a, b]) => q(sb.rpc('faturamento_horas', { p_inicio: a, p_fim: b }))));
        S.horas = { rows: res.flat(), desde, ate };
      } catch (e) { console.warn('faturamento_horas indisponível', e); S.horas = { rows: [], desde, ate, erro: true }; }
    }
  }
  async function garantirDia(d) {
    await garantirHoras(addDays(d, -63), today() > d ? today() : d);
    for (const x of [d, diaAnterior(d)]) {
      if (S.dias[x]) continue;
      try { S.dias[x] = { rows: await q(sb.rpc('painel_janela', { p_inicio: x, p_fim: x })) }; }
      catch (e) { console.warn('painel_janela indisponível', e); S.dias[x] = { rows: [] }; }
    }
  }
  /* ---------- PROJEÇÃO DO DIA ----------
     Já entrou + o que costuma entrar DEPOIS dessa hora:
     • comandas: média das últimas 4 vezes do mesmo dia da semana (de cada barbeiro), depois da hora de corte (somada ao realizado);
     • assinaturas: média dos últimos 14 dias depois da hora de corte (cobranças automáticas ao longo do dia).
     Testado em 5 meses de dados: sem viés; faixa provável barbearia ±(4% + 37% × parte que falta),
     cadeira ±(12% + 42% × parte que falta). */
  function projDia(per = S.per) {
    if (per.tipo !== 'dia' || per.dia !== today()) return null;
    const cut = corteDia(per), d = per.dia, wd = parse(d).getDay();
    if (!cut || diaFechado(d) || !S.horas || S.horas.erro) return null;
    const ck = 'dia' + d + cut + S.carregadoEm + S.horas.rows.length; if (S.projCache && ck in S.projCache) return S.projCache[ck];
    const prevs = []; for (let k = 1; k <= 8 && prevs.length < PROJ_SEMANAS; k++) { const x = addDays(d, -7 * k); if (!feriado(x) && somaH(x, { tipo: 'Comanda' }) > 0) prevs.push(x); }
    let out = null;
    if (prevs.length) {
      const media = f => prevs.reduce((a, x) => a + f(x), 0) / prevs.length;
      const cResto = pros().reduce((t, p) => folgaDe(p.key) === wd ? t : t + media(x => somaH(x, { tipo: 'Comanda', key: p.key, desde: cut })), 0);   // só quem trabalha hoje (equipe atual)
      let aResto = 0; for (let j = 1; j <= 14; j++) aResto += somaH(addDays(d, -j), { tipo: 'Assinatura', desde: cut }); aResto /= 14;
      const r0 = resDia(d), total = r0.total + cResto + aResto, rem = total ? (cResto + aResto) / total : 1, banda = 0.04 + 0.37 * rem;
      const hoje = linhas(per), temPart = soma(hoje, 'participacao_pct') > 0, mesRows = linhas({ tipo: 'mes', mes: mesDe(d) });
      const rows = hoje.map(r => {
        const key = r.pro.key, folga = folgaDe(key) === wd;
        const cReal = somaH(d, { tipo: 'Comanda', key }), cR = folga ? 0 : media(x => somaH(x, { tipo: 'Comanda', key, desde: cut }));
        // num dia só, somar o que costuma entrar é mais estável que multiplicar (poucas comandas distorcem a proporção)
        const semCat = r.servicos + r.produtos + r.extras <= 0, sv = (semCat ? cReal : r.servicos) + cR, pr = r.produtos, ex = r.extras;
        const part = temPart ? n(r.participacao_pct) : n((mesRows.find(x => x.pro.key === key) || {}).participacao_pct);
        const as = (r0.assinaturas + aResto) * part / 100, tot = sv + pr + ex + as;
        const bc = 0.12 + 0.42 * Math.max(0, tot ? 1 - r.total / tot : 1);
        return { key, folga, real: r.total, servicos: sv, produtos: pr, extras: ex, assinaturas: as, total: tot, lo: tot * (1 - bc), hi: tot * (1 + bc), banda: bc };
      });
      out = { d, cut, prevs, real: r0.total, cResto, aResto, total, lo: total * (1 - banda), hi: total * (1 + banda), banda, rows };
    }
    if (S.projCache) S.projCache[ck] = out; return out;
  }
  // Meta do dia (barbearia): fixa durante o dia = (meta do mês − faturado até ontem) ÷ dias de funcionamento que faltam, contando hoje
  const metaMesBarbearia = mes => { const res = S.resultado.find(r => r.mes === mes); return res && n(res.meta) ? n(res.meta) : n((S.metasBarbearia.find(x => x.mes === mes) || {}).meta); };
  const aberto = x => !diaFechado(x);
  function metaDiaBarbearia(d) {
    const mes = mesDe(d), meta = metaMesBarbearia(mes);
    if (!meta) return null;
    let antes = 0; for (let x = mes; x < d; x = addDays(x, 1)) antes += somaH(x);
    let dias = 0; for (let x = d; x <= ultimoDia(mes); x = addDays(x, 1)) if (aberto(x)) dias++;
    if (diaFechado(d)) return { meta, antes, dias, fechado: true, valor: 0 };
    return { meta, antes, dias, valor: dias ? Math.max(0, meta - antes) / dias : 0 };
  }

  /* ---------- SEMANA (resultado da barbearia) ----------
     Meta da semana = para cada mês que a semana toca: (meta do mês − faturado no mês antes da semana) ÷ dias de
     funcionamento que faltam no mês × dias de funcionamento da semana nesse mês. Fica fixa durante a semana.
     Projeção: já entrou + hoje depois da hora de corte (média das últimas 4 vezes do mesmo dia da semana) + dias que faltam
     (comandas: média das últimas 4 vezes de cada dia da semana; assinaturas: mesma data do mês anterior).
     Testado em 30 semanas: faixa provável ±(5% + 15% × parte que falta). */
  function mesmoDiaMesAnt(x) { const d = parse(x), alvo = new Date(d.getFullYear(), d.getMonth() - 1, 1), ult = new Date(alvo.getFullYear(), alvo.getMonth() + 1, 0).getDate(); alvo.setDate(Math.min(d.getDate(), ult)); return iso(alvo); }
  function metaSemanaBarbearia(ini) {
    // semana na virada do mês: soma a parte de cada mês; mês sem meta lançada usa o ritmo diário do outro mês
    const fim = addDays(ini, 6), partes = [...new Set([mesDe(ini), mesDe(fim)])].map(mes => {
      const meta = metaMesBarbearia(mes), desde = ini > mes ? ini : mes, ult = ultimoDia(mes);
      let antes = 0; for (let x = mes; x < desde; x = addDays(x, 1)) antes += somaH(x);
      let rest = 0, sem = 0; for (let x = desde; x <= ult; x = addDays(x, 1)) if (aberto(x)) { rest++; if (x <= fim) sem++; }
      return { meta, sem, ritmo: meta && rest ? Math.max(0, meta - antes) / rest : null };
    });
    const com = partes.filter(x => x.ritmo !== null); if (!com.length) return null;
    return { valor: partes.reduce((a, x) => a + (x.ritmo !== null ? x.ritmo : com[0].ritmo) * x.sem, 0) };
  }
  function resSemana(ini) {
    const fim = addDays(ini, 6), hoje = today(), cut = corteDia({ tipo: 'dia', dia: hoje });
    let total = 0, comandas = 0, assinaturas = 0;
    for (let x = ini; x <= fim && x <= hoje; x = addDays(x, 1)) { total += somaH(x); comandas += somaH(x, { tipo: 'Comanda' }); assinaturas += somaH(x, { tipo: 'Assinatura' }); }
    const anda = hoje >= ini && hoje <= fim, k = anda ? Math.round((parse(hoje) - parse(ini)) / 864e5) : 6, pIni = addDays(ini, -7);
    let ant = 0; for (let i = 0; i <= k; i++) { const x = addDays(pIni, i); ant += anda && i === k ? (cut ? (cut === '00:00' ? 0 : somaH(x, { ate: cut })) : somaH(x)) : somaH(x); }
    return { total, comandas, assinaturas, ant, anda, cut, k, pIni };
  }
  function projSemana(ini) {
    const fim = addDays(ini, 6), hoje = today(); if (hoje < ini || hoje > fim || !S.horas || S.horas.erro) return null;
    const cut = corteDia({ tipo: 'dia', dia: hoje }), prev = x => [1, 2, 3, 4, 5, 6].map(k => addDays(x, -7 * k)).filter(p => !feriado(p)).slice(0, 4);
    const media = (x, o) => { const ps = prev(x); return ps.length ? ps.reduce((a, p) => a + somaH(p, o), 0) / ps.length : 0; };
    // comandas só da equipe atual (quem saiu não entra) e sem a folga de cada um
    const mediaEq = (x, desde) => { const ps = prev(x), wd = parse(x).getDay(); return ps.length ? pros().reduce((t, pr) => folgaDe(pr.key) === wd ? t : t + ps.reduce((a, p) => a + somaH(p, { tipo: 'Comanda', key: pr.key, desde }), 0) / ps.length, 0) : 0; };
    let cr = 0, ar = 0;
    if (cut && aberto(hoje)) { cr += mediaEq(hoje, cut); let a = 0; for (let j = 1; j <= 14; j++) a += somaH(addDays(hoje, -j), { tipo: 'Assinatura', desde: cut }); ar += a / 14; }
    for (let x = addDays(hoje, 1); x <= fim; x = addDays(x, 1)) { if (aberto(x)) cr += mediaEq(x); ar += somaH(mesmoDiaMesAnt(x), { tipo: 'Assinatura' }); }
    const r = resSemana(ini), total = r.total + cr + ar, rem = total ? (cr + ar) / total : 1, banda = 0.05 + 0.15 * rem;
    if (!cr && !ar) return null;
    return { total, lo: total * (1 - banda), hi: total * (1 + banda), banda };
  }
  function heroSemana(ini) {
    const r0 = resSemana(ini), ms = metaSemanaBarbearia(ini), meta = ms ? ms.valor : 0, p = meta ? 100 * r0.total / meta : 0;
    const pj = projSemana(ini), pp = pj && meta ? 100 * pj.total / meta : 0, sit = pj && meta ? sitProj(pj.total, pj.lo, pj.hi, meta).map(x => x.replace('a meta', 'a meta da semana')) : null;
    const hojeTxt = r0.anda ? `${DIAS_CURTO[parse(today()).getDay()]}${r0.cut && r0.cut !== '00:00' ? ' ' + horaTxt(r0.cut) : ''}` : '';
    const vsTxt = r0.anda ? `vs semana anterior até ${hojeTxt}` : 'vs semana anterior';
    const blocoProj = pj ? `<div class="proj-box">
        <div class="proj-main"><span class="lbl">Projeção de fechamento da semana</span><b class="num">${brl(pj.total)}</b><small>faixa provável ${milhar(pj.lo)} a ${milhar(pj.hi)}</small></div>
        ${meta ? `<div class="proj-main"><span class="lbl">Projeção x meta da semana</span><b class="num">${pct(pp, 0)}</b>${pillSit(sit)}</div>
        <div class="proj-main"><span class="lbl">${pj.total >= meta ? 'Sobra prevista' : 'Falta prevista'}</span><b class="num ${pj.total >= meta ? 'good' : ''}">${brl(Math.abs(pj.total - meta))}</b><small>${r0.total >= meta ? 'meta da semana já batida ✓' : pj.total >= meta ? 'se a semana seguir o ritmo normal' : 'precisa vender acima do normal'}</small></div>` : ''}
        <button type="button" class="proj-help" data-comoproj title="Como calculamos" aria-label="Como calculamos a projeção da semana">?</button></div>` : '';
    return `<div class="sec"><h2>Resultado da barbearia · semana</h2><p>Faturamento da semana no sistema (comandas + assinaturas) contra a meta da semana.</p></div>
      <section class="hero"><div class="hero-top"><div><span class="lbl">Faturamento da barbearia · ${esc(semanaLabel(ini))}${r0.anda && r0.cut && r0.cut !== '00:00' ? ` · até ${esc(hojeTxt)}` : ''}</span><div class="num big">${brl(r0.total)}</div><div class="hero-var">${dv(r0.total, r0.ant)} <span>${esc(vsTxt)}</span></div></div>
        <div class="pos-badge"><span class="num">${meta ? pct(p, 0) : '—'}</span><small>da meta da semana</small></div></div>
        <div class="bar ${p >= 100 ? 'good' : ''}">${pp ? `<em class="bar-proj" style="width:${Math.min(100, pp)}%" title="Projeção: ${pct(pp, 0)} da meta da semana"></em>` : ''}<i style="width:${Math.min(100, p)}%"></i></div>
        <div class="hero-meta"><span>Atingimento ${meta ? pct(p, 1) : '—'}${pp ? ` <span class="proj-leg">· projeção ${pct(pp, 0)}</span>` : ''}</span><span>${brl(r0.total)} / ${meta ? brl(meta) : 'sem meta'}</span></div>
        ${blocoProj}
        <div class="hero-row"><div><span class="lbl">Meta da semana</span><b class="num">${meta ? brl(meta) : '—'}</b></div>
          <div><span class="lbl">${meta && r0.total >= meta ? 'Acima da meta da semana' : 'Faltam'}</span><b class="num">${meta ? brl(Math.abs(meta - r0.total)) : '—'}</b></div>
          <div><span class="lbl">Comandas · assinaturas</span><b class="num" style="font-size:15px">${brl(r0.comandas)} · ${brl(r0.assinaturas)}</b></div></div></section>
      <div class="row"><span class="dim sm">${ms ? 'Meta da semana = (meta do mês − faturado no mês antes da semana) ÷ dias de funcionamento que faltam no mês × dias de funcionamento desta semana. Fica fixa durante a semana.' : 'Sem meta da barbearia lançada para este mês.'}${r0.anda ? ` A variação compara com a semana anterior até o mesmo dia e horário (${esc(hojeTxt)}).` : ''}</span></div>`;
  }
  function comoProjecaoSemana() {
    openModal('Projeção e meta da semana', `<div class="stack-txt">
      <p><b>Projeção de fechamento da semana:</b> o que já entrou + o resto de hoje (o que costuma entrar depois deste horário, média das últimas 4 vezes do mesmo dia da semana) + os dias que faltam. Comandas: média das últimas 4 vezes de cada dia da semana (domingo não abre). Assinaturas: o que foi cobrado na mesma data do mês anterior, porque cada assinatura renova sempre no mesmo dia do mês.</p>
      <p><b>Faixa provável:</b> testamos o cálculo em 30 semanas. O erro típico é de ~19% na segunda, ~13% na quarta, ~10% na sexta e ~7% no sábado. A faixa vai estreitando ao longo da semana.</p>
      <p><b>Meta da semana:</b> a parte da meta do mês que cabe nesta semana, calculada no início dela: (meta do mês − faturado no mês até o domingo anterior) ÷ dias de funcionamento que faltam no mês × dias de funcionamento da semana. Semana na virada do mês soma a parte de cada mês.</p>
      <p><b>Variação:</b> semana anterior até o mesmo dia e horário da última atualização (ex.: seg a sáb 15h50 contra seg a sáb 15h50 da semana passada).</p></div>`, null);
  }
  // Meta do dia da cadeira (só para hoje): (meta da cadeira − faturado no mês até ontem) ÷ dias de trabalho que faltam, contando hoje (sem domingo e sem a folga)
  function metaDiaCadeira(r, d) {
    if (d !== today()) return null;
    const mes = mesDe(d), m = metaDe(r.pro.key, mes), meta = m ? n(m.meta_cadeira) : 0; if (!meta) return null;
    const mr = linhas({ tipo: 'mes', mes }).find(x => x.pro.key === r.pro.key), antes = Math.max(0, (mr ? mr.total : 0) - r.total);
    const f = folgaDe(r.pro.key), folgaHoje = f === parse(d).getDay() || diaFechado(d);
    let dias = 0; for (let x = d; x <= ultimoDia(mes); x = addDays(x, 1)) { const wd = parse(x).getDay(); if (aberto(x) && wd !== f) dias++; }
    return { meta, antes, dias, folgaHoje, valor: folgaHoje || !dias ? 0 : Math.max(0, meta - antes) / dias };
  }
  function comoProjecaoDia() {
    openModal('Projeção e meta do dia', `<div class="stack-txt">
      <p><b>Comparação:</b> hoje é comparado com o mesmo dia da semana passada (terça com terça, sábado com sábado; se foi feriado, com a anterior), <b>até o mesmo horário</b> da última atualização. Comandas e assinaturas têm a hora exata no sistema. Serviços, produtos e extras de cada barbeiro só vêm por dia, então no dia anterior eles entram na mesma proporção das comandas daquele barbeiro até esse horário.</p>
      <p><b>Projeção de fechamento do dia:</b> o que já entrou + o que costuma entrar depois desse horário. Comandas: média das últimas 4 vezes do mesmo dia da semana (ex.: as últimas 4 sextas depois das 15h). Assinaturas: média dos últimos 14 dias depois desse horário, porque são cobradas automaticamente ao longo do dia.</p>
      <p><b>Faixa provável:</b> testamos o cálculo em 5 meses de dados. Um dia sozinho varia bastante: o erro típico é de ~35% às 11h, ~25% às 15h, ~18% às 19h e ~8% às 21h. A faixa mostra esse erro e vai estreitando ao longo do dia.</p>
      <p><b>Meta do dia:</b> (meta do mês − faturado até ontem) ÷ dias de funcionamento que faltam, contando hoje. Ela fica fixa durante o dia. Na cadeira, conta só os dias de trabalho do barbeiro (sem domingo e sem a folga).</p></div>`, null);
  }
  // gráfico acumulado por hora (barbearia ou barbeiros)
  function graficoHoras(id, series) {
    const horas = []; for (let h = 8; h <= 23; h++) horas.push(h);
    const ds = series.map(s => ({ label: s.label, borderColor: s.cor, backgroundColor: s.cor + '22', fill: !!s.fill, tension: .3, pointRadius: 0, borderWidth: s.dash ? 1.8 : 2.5, borderDash: s.dash ? [6, 5] : undefined,
      data: horas.map(h => { const lim = pad(h) + ':59'; if (s.ate && pad(h) + ':00' > s.ate) return null; return +somaH(s.dia, { key: s.key, tipo: s.tipo, ate: lim }).toFixed(2); }) }));
    chart(id, { type: 'line', data: { labels: horas.map(h => h + 'h'), datasets: ds }, options: { interaction: { mode: 'index', intersect: false }, scales: { y: eixoBRL, x: { ticks: { maxTicksLimit: 9 } } } } });
  }


  /* ----------------------------------------------------------- interface */
  function toast(msg, tipo = '') {
    const t = document.createElement('div'); t.className = 'toast ' + tipo; t.textContent = msg;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 3800);
  }
  function openModal(titulo, corpo, onSave, rotulo = 'Salvar') {
    const bg = document.createElement('div'); bg.className = 'modal-bg';
    bg.innerHTML = `<form class="modal" novalidate><div class="modal-h"><h3>${esc(titulo)}</h3><button type="button" class="btn btn-ghost btn-sm" data-x aria-label="Fechar">${ic('x', 18)}</button></div>
      ${corpo}<p class="err" data-err hidden></p>
      <div class="modal-f">${onSave ? `<button type="button" class="btn" data-x>Cancelar</button><button class="btn btn-acc">${esc(rotulo)}</button>` : ''}</div></form>`;
    const close = () => bg.remove();
    bg.addEventListener('click', e => { if (e.target === bg || e.target.closest('[data-x]')) close(); });
    const f = bg.querySelector('form');
    f.addEventListener('submit', async e => {
      e.preventDefault(); if (!onSave) return;
      const btn = f.querySelector('.btn-acc'); btn.disabled = true;
      try { await onSave(Object.fromEntries(new FormData(f)), f); close(); }
      catch (err) { const p = f.querySelector('[data-err]'); p.textContent = err.message || String(err); p.hidden = false; }
      finally { btn.disabled = false; }
    });
    document.body.appendChild(bg);
    setTimeout(() => { const i = f.querySelector('input,select'); if (i) i.focus(); }, 50);
    return f;
  }

  const charts = [];
  function chart(id, cfg) {
    const el = document.getElementById(id); if (!el || !window.Chart) return;
    charts.push(new Chart(el, cfg));
  }
  function chartDefaults() {
    if (!window.Chart) return;
    Chart.defaults.color = '#aaa39c';
    Chart.defaults.borderColor = '#2d2a29';
    Chart.defaults.font.family = "'Manrope', system-ui, sans-serif";
    Chart.defaults.font.weight = 600;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.boxWidth = 8;
    Chart.defaults.plugins.tooltip.callbacks.label = c => `${c.dataset.label}: ${brl(c.parsed.y ?? c.parsed.x ?? c.parsed)}`;
    Chart.defaults.maintainAspectRatio = false;
  }
  const eixoBRL = { ticks: { callback: v => 'R$ ' + (Math.abs(v) >= 1000 ? (v / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' mil' : v) } };

  /* ------------------------------------------------------------- dados */
  async function q(promise) { const { data, error } = await promise; if (error) throw error; return data || []; }
  async function carregar() {
    const inicioDiario = mesDe(addDays(mesAtual(), -45));
    const [perfis, mensal, semanal, diario, assDia, metas, atual, resultado, metasBarbearia] = await Promise.all([
      q(sb.from('perfis').select('*')),
      q(sb.from('painel_mensal').select('*').order('mes', { ascending: false })),
      q(sb.from('painel_semanal').select('*').order('semana', { ascending: false }).limit(1000)),
      q(sb.from('painel_diario').select('*').gte('dia', inicioDiario).limit(2000)),
      q(sb.from('painel_assinaturas_dia').select('*').gte('dia', inicioDiario).limit(500)).catch(() => null),
      q(sb.from('metas_barbeiro').select('*')),
      q(sb.from('ultima_atualizacao').select('*')),
      isAdmin() ? q(sb.from('resultado_barbearia').select('*')) : Promise.resolve([]),
      isAdmin() ? q(sb.from('metas_barbearia').select('*')) : Promise.resolve([])
    ]);
    S.fechados = await q(sb.from('dias_fechados').select('*').order('dia')).catch(() => []);
    S.fechMap = Object.fromEntries((S.fechados || []).map(r => [r.dia, r.motivo || 'Feriado']));
    Object.assign(S, { perfis, mensal, semanal, diario, metas, resultado, metasBarbearia, atualizado: (atual[0] || {}).atualizado_em || null, dadosAte: (atual[0] || {}).dados_ate || null, diarioDesde: inicioDiario, carregadoEm: Date.now(), janelas: {}, dias: {}, horas: null, assDia, projCache: {}, metaHistCache: {} });
    if (S.per.tipo === 'mes' && !S.mensal.some(r => r.mes === S.per.mes) && S.mensal[0]) S.per.mes = S.mensal[0].mes;
    if (!S.semanal.some(r => r.semana === S.per.semana) && S.semanal[0]) S.per.semana = S.semanal[0].semana;
  }

  /* ------------------------------------------------------------ rotas */
  const ROTAS_ADMIN = [
    ['dashboard', 'Dashboard', 'home', vDashboard],
    ['crescimento', 'Crescimento', 'trend', vCrescimento],
    ['equipe', 'Equipe', 'users', vEquipe],
    ['faturamento', 'Faturamento', 'cash', vFaturamento],
    ['vendas', 'Vendas', 'bag', vVendas],
    ['clube', 'Clube', 'crown', vClube],
    ['ranking', 'Ranking', 'trophy', vRanking],
    ['cultura', 'Cultura', 'star', vCultura],
    ['metas', 'Metas', 'target', vMetas],
    ['relatorios', 'Relatórios', 'doc', vRelatorios]
  ];
  const ROTAS_PRO = [
    ['inicio', 'Início', 'home', vInicio],
    ['ranking', 'Ranking', 'trophy', vRanking],
    ['cultura', 'Cultura', 'star', vCultura]
  ];
  const rotas = () => isAdmin() ? ROTAS_ADMIN : ROTAS_PRO;
  const rotaAtual = () => { const h = location.hash.slice(1); return rotas().find(r => r[0] === h) || rotas()[0]; };

  function filtros(opts = {}) {
    const meses = [...new Set(S.mensal.map(r => r.mes))].sort().reverse();
    const semanas = [...new Set(S.semanal.map(r => r.semana))].sort().reverse().slice(0, 30);
    const soMes = opts.soMes, dias = [];
    for (let d = today(), k = 0; k < 45; k++, d = addDays(d, -1)) if (!FECHADO.includes(parse(d).getDay())) dias.push(d);
    return `<div class="filters">
      ${soMes ? '' : `<div class="chips">${[['mes', 'Mês'], ['semana', 'Semana'], ['dia', 'Dia']].map(([k, l]) => `<button class="chip ${S.per.tipo === k ? 'on' : ''}" data-tipo="${k}">${l}</button>`).join('')}</div>`}
      ${S.per.tipo === 'dia' && !soMes
        ? `<select data-per="dia" aria-label="Dia">${dias.map(d => `<option value="${d}" ${d === S.per.dia ? 'selected' : ''}>${esc(diaLabel(d))}</option>`).join('')}</select>`
        : S.per.tipo === 'mes' || soMes
        ? `<select data-per="mes" aria-label="Mês">${meses.map(m => `<option value="${m}" ${m === S.per.mes ? 'selected' : ''}>${mesLabel(m)}</option>`).join('')}</select>`
        : `<select data-per="semana" aria-label="Semana">${semanas.map(s => `<option value="${s}" ${s === S.per.semana ? 'selected' : ''}>${semanaLabel(s)}</option>`).join('')}</select>`}
    </div>`;
  }
  function ligarFiltros(root) {
    $$('[data-tipo]', root).forEach(b => b.onclick = () => { S.per.tipo = b.dataset.tipo; if (S.per.tipo === 'dia' && !S.per.dia) S.per.dia = diaPadrao(); render(); });
    $$('[data-per]', root).forEach(s => s.onchange = () => { S.per[s.dataset.per] = s.value; render(); });
  }

  /* ------------------------------------------------------------- telas */
  function vLogin(erro = '') {
    app.innerHTML = `<div class="login">
      <div><div class="logo"><img class="logo-img" src="logo.png" alt="Barbearia Demo"></div>
      <p class="login-tag">Painel de performance</p><div class="pole"></div></div>
      <form class="login-card" id="f-login" novalidate>
        <label class="fld"><span>Login</span><input name="login" autocomplete="username" autocapitalize="none" required></label>
        <label class="fld"><span>Senha</span><input name="senha" type="password" autocomplete="current-password" required></label>
        <p class="err" ${erro ? '' : 'hidden'}>${esc(erro)}</p>
        <button class="btn btn-acc btn-lg">Entrar</button>
      </form>
      <p class="login-foot">Números atualizados automaticamente a partir do sistema.</p></div>`;
    $('#f-login').onsubmit = async e => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(e.target)), btn = e.target.querySelector('button');
      const login = d.login.trim().toLowerCase();
      if (!login || !d.senha) return vLogin('Informe login e senha.');
      btn.disabled = true; btn.textContent = 'Entrando…';
      const email = login.includes('@') ? login : `${login}@${CFG.loginDomain}`;
      let error;
      try { ({ error } = await sb.auth.signInWithPassword({ email, password: d.senha })); }
      catch (e) { error = e; }
      if (error) {
        const msg = String(error.message || error);
        if (/invalid login credentials/i.test(msg)) vLogin('Login ou senha incorretos.');
        else if (/email not confirmed/i.test(msg)) vLogin('Usuário ainda não confirmado no Supabase (marque "Confirm email").');
        else if (/fetch|network|load failed/i.test(msg)) vLogin('Sem conexão com o servidor do painel. Verifique a internet e a URL no config.js.');
        else vLogin('Não foi possível entrar: ' + msg);
      }
    };
  }

  function shell(rota, conteudo) {
    const [id, titulo] = rota, rs = rotas();
    const nav = (cls) => rs.map(([k, l, i]) => `<a class="${cls} ${k === id ? 'on' : ''}" href="#${k}">${ic(i, cls === 'navlink' ? 20 : 22)}<span>${l}</span></a>`).join('');
    const bottom = rs.length > 5
      ? rs.slice(0, 4).map(([k, l, i]) => `<a class="${k === id ? 'on' : ''}" href="#${k}">${ic(i, 22)}<span>${l}</span></a>`).join('') + `<a href="#" data-mais class="${rs.slice(4).some(r => r[0] === id) ? 'on' : ''}">${ic('menu', 22)}<span>Mais</span></a>`
      : nav('') + `<a href="#" data-mais>${ic('menu', 22)}<span>Menu</span></a>`;
    const at = S.atualizado ? new Date(S.atualizado) : null;
    const velho = !at || (Date.now() - at.getTime()) > 40 * 3600e3;   // sábado 22h → segunda 10h = 36h (domingo não atualiza)
    const atTxt = at ? `${pad(at.getDate())}/${pad(at.getMonth() + 1)} ${pad(at.getHours())}:${pad(at.getMinutes())}` : 'sem dados';
    app.innerHTML = `<div class="shell">
      <aside class="side"><div class="logo"><img class="logo-img" src="logo.png" alt="Barbearia Demo"></div>
        <nav>${nav('navlink')}</nav>
        <div class="side-user">${av(S.me.nome, 36)}<div><b>${esc(curto(S.me.nome))}</b><small>${isAdmin() ? 'Administrador' : esc(S.me.cargo || 'Barbeiro')}</small></div>
          <button class="btn btn-ghost btn-sm" data-menu title="Minha conta">${ic('key', 18)}</button></div>
      </aside>
      <header class="top"><div class="logo"><img class="logo-img" src="logo.png" alt="Barbearia Demo"></div>
        <span class="top-title">${esc(titulo)}</span><span class="spacer"></span>
        <span class="live ${velho ? 'old' : ''}" title="Última atualização"><i></i>Atualizado ${atTxt}</span>
        <button class="me-btn" data-menu aria-label="Minha conta">${av(S.me.nome, 36)}</button></header>
      <main class="view"><div class="page">${conteudo}</div></main>
      <nav class="bnav">${bottom}</nav></div>`;
    $$('[data-menu]').forEach(b => b.onclick = menuConta);
    $$('[data-mais]').forEach(b => b.onclick = e => { e.preventDefault(); menuMais(); });
  }

  function menuMais() {
    const extra = rotas().length > 5 ? rotas().slice(4) : [];
    const f = openModal('Menu', `<div class="stack" style="display:grid;gap:6px">
      ${extra.map(([k, l, i]) => `<a class="navlink" href="#${k}" data-x>${ic(i)}${l}</a>`).join('')}
      <button type="button" class="navlink" style="background:none;border:0" data-senha>${ic('key')}Trocar minha senha</button>
      <button type="button" class="navlink" style="background:none;border:0" data-sair>${ic('out')}Sair</button></div>`);
    f.querySelector('[data-senha]').onclick = () => { f.parentElement.remove(); trocarSenha(); };
    f.querySelector('[data-sair]').onclick = () => { f.parentElement.remove(); sb.auth.signOut(); };
    $$('a[data-x]', f).forEach(a => a.addEventListener('click', () => f.parentElement.remove()));
  }
  function menuConta() {
    const f = openModal(curto(S.me.nome), `<p class="mut sm" style="margin-bottom:12px">Login: <b>${esc(S.me.login)}</b> · ${isAdmin() ? 'Administrador' : 'Profissional'}</p>
      <div style="display:grid;gap:6px"><button type="button" class="btn" data-senha>${ic('key', 18)}Trocar minha senha</button>
      <button type="button" class="btn" data-sair>${ic('out', 18)}Sair</button></div>`);
    f.querySelector('[data-senha]').onclick = () => { f.parentElement.remove(); trocarSenha(); };
    f.querySelector('[data-sair]').onclick = () => { f.parentElement.remove(); sb.auth.signOut(); };
  }
  function trocarSenha() {
    openModal('Trocar minha senha', `<div class="form-grid">
      <label class="fld full"><span>Nova senha</span><input name="nova" type="password" minlength="8" autocomplete="new-password" required></label>
      <label class="fld full"><span>Repita a nova senha</span><input name="rep" type="password" autocomplete="new-password" required></label></div>`,
      async d => {
        if ((d.nova || '').length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        if (d.nova !== d.rep) throw new Error('As senhas não conferem.');
        const { error } = await sb.auth.updateUser({ password: d.nova }); if (error) throw error;
        toast('Senha alterada.', 'good');
      }, 'Salvar senha');
  }

  /* ---------- blocos reutilizáveis ---------- */
  function tabelaCadeiras(rows, opts = {}) {
    const mes = S.per.tipo === 'mes' ? S.per.mes : null;
    const ord = [...rows].sort((a, b) => b.total - a.total), ant = anterior(), ordAnt = ordem(ant, 'total');
    const tot = k => brl(soma(rows, k));
    return `<div class="tbl-wrap"><table><thead><tr><th>#</th><th>Profissional</th>${SEG.map(s => `<th class="r">${s[1]}</th>`).join('')}<th class="r">Total cadeira</th>
      ${mes ? '<th class="r">% meta</th>' : ''}<th class="r">Atend.</th><th class="r">Ticket</th></tr></thead><tbody>
      ${ord.map((r, i) => { const m = mes && metaDe(r.pro.key, mes), mc = m ? n(m.meta_cadeira) : 0;
        const ra = doPro(ant, r.pro.key);
        return `<tr><td class="nowrap">${i + 1}º ${ant ? dvPos(i + 1, posDe(ordAnt, r.pro.key)) : ''}</td><td><b>${esc(r.pro.nome)}</b></td>${SEG.map(s => `<td class="r">${brl(r[s[0]])}</td>`).join('')}<td class="r"><b>${brl(r.total)}</b>${dvl(ra && dv(r.total, ra.total))}</td>
        ${mes ? `<td class="r ${mc && r.total >= mc ? 'good' : ''}" title="Meta ${mc ? brl(mc) : '—'}">${mc ? pct(100 * r.total / mc) : '—'}</td>` : ''}
        <td class="r">${int(r.atendimentos)}</td><td class="r">${brl(r.ticket)}</td></tr>`; }).join('')}
      </tbody><tfoot><tr><td></td><td>Total</td>${SEG.map(s => `<td class="r">${tot(s[0])}</td>`).join('')}<td class="r">${tot('total')}${dvl(dv(soma(rows, 'total'), somaAnt(ant, 'total')))}</td>${mes ? '<td></td>' : ''}<td class="r">${int(soma(rows, 'atendimentos'))}</td><td></td></tr></tfoot></table></div>`;
  }
  function kpisEquipe(rows) {
    const ord = [...rows].sort((a, b) => b.total - a.total), lider = ord[0], total = soma(rows, 'total'), ant = anterior();
    const vendas = soma(rows, 'vendas'), ass = soma(rows, 'assinaturas'), at = soma(rows, 'atendimentos');
    const liderAnt = ant && [...ant].sort((a, b) => b.total - a.total)[0];
    const subLider = lider ? brl(lider.total) + (liderAnt && liderAnt.total && lider.total ? (liderAnt.pro.key === lider.pro.key ? ' · mantém a liderança' : ` · antes: ${esc(liderAnt.pro.nome)}`) : '') : '';
    return `<div class="kpis k4">
      <div class="kpi lead"><span class="lbl">Líder em faturamento</span><div class="num">${lider && lider.total ? esc(lider.pro.nome) : '—'}</div><small>${subLider}</small></div>
      ${kpiVar('Soma das cadeiras', brl(total), dv(total, somaAnt(ant, 'total')), `${int(at)} atendimentos · ticket ${brl(at ? total / at : 0)}`)}
      ${kpiVar('Vendas (produtos + extras)', brl(vendas), dv(vendas, somaAnt(ant, 'vendas')), `${total ? pct(100 * vendas / total, 0) : '0%'} das cadeiras`)}
      ${kpiVar('Assinaturas (clube)', brl(ass), dv(ass, somaAnt(ant, 'assinaturas')), `${int(soma(rows, 'atendimentos_clube'))} atendimentos de clube`)}</div>`;
  }
  function graficoComposicao(id, rows) {
    const ord = [...rows].sort((a, b) => b.total - a.total);
    chart(id, { type: 'bar', data: { labels: ord.map(r => r.pro.nome), datasets: SEG.map(([k, l, c]) => ({ label: l, data: ord.map(r => +r[k].toFixed(2)), backgroundColor: c, borderRadius: 4, maxBarThickness: 46 })) },
      options: { indexAxis: 'y', scales: { x: { stacked: true, ...eixoBRL }, y: { stacked: true, grid: { display: false } } }, plugins: { tooltip: { callbacks: { label: c => `${c.dataset.label}: ${brl(c.parsed.x)}` } } } } });
  }
  function graficoEvolucao(id, keys, mes, metaTotal, fim = ultimoDia(mes)) {
    const hoje = today(), dias = [];
    for (let d = mes; d <= fim; d = addDays(d, 1)) dias.push(d);
    const ds = keys.map(k => {
      let acc = 0;
      return { label: nomeDe(k), borderColor: corDe(k), backgroundColor: corDe(k) + '26', fill: keys.length === 1, tension: .3, pointRadius: 0, borderWidth: 2.5,
        data: dias.map(d => { if (d > hoje) return null; acc += S.diario.filter(x => x.dia === d && x.profissional === k).reduce((a, x) => a + n(x.valor_comandas), 0); return +acc.toFixed(2); }) };
    });
    if (metaTotal) ds.push({ label: 'Meta', data: dias.map(() => metaTotal), borderColor: '#e8695d', borderDash: [6, 6], pointRadius: 0, borderWidth: 1.5, fill: false });
    chart(id, { type: 'line', data: { labels: dias.map(dm), datasets: ds }, options: { interaction: { mode: 'index', intersect: false }, scales: { y: eixoBRL, x: { ticks: { maxTicksLimit: 8 } } } } });
  }

  // acumulado de comandas de um barbeiro no período x mesmo período anterior (tracejado). Dia i do atual ↔ dia i do anterior.
  const comandasDoPro = key => d => S.diario.filter(x => x.dia === d && x.profissional === key).reduce((a, x) => a + n(x.valor_comandas), 0);
  function graficoComparado(id, v, ini, fim, iniAnt, fimAnt, lblAtual, lblAnt, rotulo, cor = '#e49e2b') {
    const hoje = today(), dias = [];
    for (let d = ini; d <= fim; d = addDays(d, 1)) dias.push(d);
    let a1 = 0, a2 = 0;
    const atual = dias.map(d => { if (d > hoje) return null; a1 += v(d); return +a1.toFixed(2); });
    const ant = dias.map((d, i) => { const x = addDays(iniAnt, i); if (x > fimAnt) return null; a2 += v(x); return +a2.toFixed(2); });
    chart(id, { type: 'line', data: { labels: dias.map(rotulo), datasets: [
      { label: lblAtual, data: atual, borderColor: cor, backgroundColor: cor + '26', fill: true, tension: .3, pointRadius: 0, borderWidth: 2.5 },
      { label: lblAnt, data: ant, borderColor: '#aaa39c', borderDash: [6, 5], fill: false, tension: .3, pointRadius: 0, borderWidth: 1.8 }] },
      options: { interaction: { mode: 'index', intersect: false }, scales: { y: eixoBRL, x: { ticks: { maxTicksLimit: 8 } } },
        plugins: { tooltip: { callbacks: { title: c => { const i = c[0].dataIndex, x = addDays(iniAnt, i); return `${rotulo(dias[i])}${x <= fimAnt ? ' x ' + rotulo(x) : ''}`; } } } } } });
  }

  // evolução acumulada da barbearia (o.tipo: 'Comanda' | 'Assinatura' | nada = total) no período x período anterior (tracejado)
  function graficoBarbearia(id, per, o = {}, cor = '#e49e2b') {
    if (!$('#' + id) || !S.horas || S.horas.erro) return;
    const v = d => somaH(d, o);
    if (per.tipo === 'dia') { const pa = perAnt(per).dia; graficoHoras(id, [{ label: diaCurto(per.dia), dia: per.dia, tipo: o.tipo, cor, fill: true, ate: corteDia(per) || undefined }, { label: diaCurto(pa), dia: pa, tipo: o.tipo, cor: '#aaa39c', dash: true }]); return; }
    if (per.tipo === 'semana') { const u = o.tipo === 'Comanda' ? 5 : 6; graficoComparado(id, v, per.semana, addDays(per.semana, u), addDays(per.semana, -7), addDays(per.semana, u - 7), 'Esta semana', 'Semana anterior', diaCurto, cor); return; }   // assinatura também cai no domingo
    const ma = mesDe(addDays(per.mes, -1)); graficoComparado(id, v, per.mes, ultimoDia(per.mes), ma, ultimoDia(ma), cap(MESES[parse(per.mes).getMonth()]), cap(MESES[parse(ma).getMonth()]), dm, cor);
  }
  const subEvo = per => per.tipo === 'dia' ? `${esc(diaCurto(per.dia))} x ${esc(diaCurto(perAnt(per).dia))} (tracejado), por hora`
    : per.tipo === 'semana' ? `semana ${esc(semanaLabel(per.semana))} x ${esc(semanaLabel(addDays(per.semana, -7)))} (tracejado), mesmo dia da semana`
    : `${esc(mesLabel(per.mes))} x ${esc(mesLabel(mesDe(addDays(per.mes, -1))))} (tracejado), mesmo dia do mês`;
  const painelEvo = (id, titulo, per, nota = '') => `<section class="panel"><h3 class="h2">${titulo}</h3><p class="dim sm" style="margin:-6px 0 10px">${nota}${subEvo(per)}</p><div class="chart"><canvas id="${id}"></canvas></div></section>`;

  /* ---------- DASHBOARD · DIA ---------- */
  const pillSit = sit => sit ? `<span class="pill ${sit[1] === 'good' ? 'ok' : sit[1] === 'bad' ? 'no' : 'acc'}">${sit[0]}</span>` : '';
  function heroDia(d) {
    const r0 = resDia(d), pa = perAnt(), cut = corteDia(), temAnt = temPer(pa), rA = temAnt ? resDia(pa.dia, cut) : null;
    if (feriado(d)) {
      let prox = addDays(d, 1); while (diaFechado(prox) && prox < addDays(d, 10)) prox = addDays(prox, 1);
      return `<div class="sec"><h2>Resultado da barbearia · ${esc(d === today() ? 'hoje' : diaCurto(d))}</h2><p>Dia marcado como fechado em Metas.</p></div>
      <section class="hero"><div class="hero-top"><div><span class="lbl">Barbearia fechada · ${esc(S.fechMap[d])}</span><div class="num big">${brl(r0.total)}</div><div class="hero-var"><span>só assinaturas (cobrança automática do clube)</span></div></div>
        <div class="pos-badge"><span class="num">—</span><small>sem meta hoje</small></div></div>
        <div class="hero-row"><div><span class="lbl">Meta do dia</span><b class="num">—</b></div><div><span class="lbl">Volta a abrir</span><b class="num" style="font-size:15px">${esc(diaCurto(prox))}</b></div>
          <div><span class="lbl">Comandas · assinaturas</span><b class="num" style="font-size:15px">${brl(r0.comandas)} · ${brl(r0.assinaturas)}</b></div></div></section>
      <div class="row"><span class="dim sm">Dia fechado não entra na meta do dia, na meta da semana nem nas projeções. As assinaturas cobradas hoje continuam somando no faturamento do mês. A meta do próximo dia aberto já considera o que faltou.</span></div>`;
    }
    const md = metaDiaBarbearia(d), meta = md ? md.valor : 0, p = meta ? 100 * r0.total / meta : 0;
    const pj = projDia(), pp = pj && meta ? 100 * pj.total / meta : 0, sit = pj && meta ? sitProj(pj.total, pj.lo, pj.hi, meta).map(x => x.replace('a meta', 'a meta do dia')) : null;
    const falta = Math.max(0, meta - r0.total), quando = d === today() ? 'hoje' : 'no dia';
    const vsTxt = temAnt ? `vs ${esc(diaCurto(pa.dia))}${cut && cut !== '00:00' ? ` até as ${horaTxt(cut)}` : cut ? '' : ' (dia inteiro)'}` : '';
    const blocoProj = pj ? `<div class="proj-box">
        <div class="proj-main"><span class="lbl">Projeção de fechamento do dia</span><b class="num">${brl(pj.total)}</b><small>faixa provável ${brl(pj.lo)} a ${brl(pj.hi)}</small></div>
        ${meta ? `<div class="proj-main"><span class="lbl">Projeção x meta do dia</span><b class="num">${pct(pp, 0)}</b>${pillSit(sit)}</div>
        <div class="proj-main"><span class="lbl">${pj.total >= meta ? 'Sobra prevista' : 'Falta prevista'}</span><b class="num ${pj.total >= meta ? 'good' : ''}">${brl(Math.abs(pj.total - meta))}</b><small>${r0.total >= meta ? 'meta do dia já batida ✓' : pj.total >= meta ? 'se o dia seguir o ritmo normal' : 'precisa vender acima do normal'}</small></div>` : ''}
        <button type="button" class="proj-help" data-comoproj title="Como calculamos" aria-label="Como calculamos a projeção do dia">?</button></div>` : '';
    return `<div class="sec"><h2>Resultado da barbearia · ${esc(d === today() ? 'hoje' : diaCurto(d))}</h2><p>Faturamento do dia no sistema (comandas + assinaturas) contra a meta do dia.</p></div>
      <section class="hero"><div class="hero-top"><div><span class="lbl">Faturamento da barbearia · ${esc(diaLabel(d))}${cut && cut !== '00:00' ? ` · até ${horaTxt(cut)}` : ''}</span><div class="num big">${brl(r0.total)}</div>${temAnt ? `<div class="hero-var">${dv(r0.total, rA.total)} <span>${vsTxt}</span></div>` : ''}</div>
        <div class="pos-badge"><span class="num">${meta ? pct(p, 0) : '—'}</span><small>da meta do dia</small></div></div>
        <div class="bar ${p >= 100 ? 'good' : ''}">${pp ? `<em class="bar-proj" style="width:${Math.min(100, pp)}%" title="Projeção: ${pct(pp, 0)} da meta do dia"></em>` : ''}<i style="width:${Math.min(100, p)}%"></i></div>
        <div class="hero-meta"><span>Atingimento ${meta ? pct(p, 1) : '—'}${pp ? ` <span class="proj-leg">· projeção ${pct(pp, 0)}</span>` : ''}</span><span>${brl(r0.total)} / ${meta ? brl(meta) : 'sem meta'}</span></div>
        ${blocoProj}
        <div class="hero-row"><div><span class="lbl">Meta do dia</span><b class="num">${meta ? brl(meta) : '—'}</b></div>
          <div><span class="lbl">${meta && r0.total >= meta ? 'Acima da meta do dia' : 'Faltam ' + quando}</span><b class="num">${meta ? brl(Math.abs(meta - r0.total)) : '—'}</b></div>
          <div><span class="lbl">Comandas · assinaturas</span><b class="num" style="font-size:15px">${brl(r0.comandas)} · ${brl(r0.assinaturas)}</b></div></div></section>
      <div class="row"><span class="dim sm">${md ? `Meta do dia = (meta do mês ${brl(md.meta)} − faturado até a véspera ${brl(md.antes)}) ÷ ${md.dias} dias de funcionamento que faltam, contando ${d === today() ? 'hoje' : 'este dia'}. Fica fixa durante o dia.` : 'Sem meta da barbearia lançada para este mês.'}</span></div>`;
  }
  function metasDiaHtml(rows, d) {
    if (d !== today()) return '';
    const pj = projDia(), lst = rows.map(r => ({ r, md: metaDiaCadeira(r, d), pr: projDe(pj, r.pro.key) })).filter(x => x.md);
    if (!lst.length) return '';
    return `<section class="panel"><div class="panel-head"><h3 class="h2">Meta do dia por cadeira</h3><a class="btn btn-sm" href="#metas">${ic('edit', 16)}Metas do mês</a></div>
      <div class="tbl-wrap"><table><thead><tr><th>Profissional</th><th class="r">Meta do dia</th><th class="r">Hoje</th><th class="r">% do dia</th>${pj ? '<th class="r">Projeção do dia</th>' : ''}<th class="r">Faltam</th></tr></thead><tbody>
      ${lst.map(({ r, md, pr }) => { const pc = md.valor ? 100 * r.total / md.valor : 0, sp = pr && md.valor && sitProj(pr.total, pr.lo, pr.hi, md.valor);
        return `<tr><td><b>${esc(r.pro.nome)}</b><div class="dim sm">meta do mês ${brl(md.meta)} · ${md.dias} dias de trabalho restantes</div></td>
          <td class="r">${md.folgaHoje ? `<span class="pill">${diaFechado(d) ? 'fechado' : 'folga'}</span>` : brl(md.valor)}</td><td class="r ${md.valor && r.total >= md.valor ? 'good' : ''}">${brl(r.total)}</td>
          <td class="r">${md.valor ? pct(pc, 0) : '—'}</td>
          ${pj ? `<td class="r" title="Faixa provável: ${pr ? brl(pr.lo) + ' a ' + brl(pr.hi) : '—'}"><span class="${sp ? sp[1] : ''}">${pr && !md.folgaHoje ? brl(pr.total) : '—'}</span>${pr && md.valor ? `<div class="dvl dim sm">${pct(100 * pr.total / md.valor, 0)} da meta</div>` : ''}</td>` : ''}
          <td class="r">${md.valor ? (r.total >= md.valor ? '<span class="good">✓ batida</span>' : brl(md.valor - r.total)) : '—'}</td></tr>`; }).join('')}
      </tbody></table></div><p class="dim sm" style="margin-top:10px">Meta do dia da cadeira = (meta do mês − faturado no mês até ontem) ÷ dias de trabalho que faltam, contando hoje (sem domingo e sem a folga). Fica fixa durante o dia.${pj ? ' Projeção: verde = deve bater · amarelo = no limite · vermelho = abaixo do ritmo.' : ''}</p></section>`;
  }

  /* ---------- DASHBOARD (dono) ---------- */
  function vDashboard() {
    const rows = linhas(), mes = S.per.tipo === 'mes' ? S.per.mes : null, dia = S.per.tipo === 'dia' ? S.per.dia : null;
    const res = mes && S.resultado.find(r => r.mes === mes);
    const sem = S.per.tipo === 'semana' ? S.per.semana : null;
    let hero = dia ? heroDia(dia) : sem && isAdmin() ? heroSemana(sem) : '';
    if (mes) {
      const fat = res ? n(res.faturamento_total) : 0, meta = res ? n(res.meta) : 0, p = meta ? 100 * fat / meta : 0;
      const pj = projecao(), pjTot = pj ? fat + pj.comandasResto + (pj.assModo === 'ritmo' ? n(res && res.assinaturas) / pj.b.feitos * pj.b.resto.length : pj.assResto) : null;
      const pjLo = pjTot && pjTot * (1 - pj.bandaB), pjHi = pjTot && pjTot * (1 + pj.bandaB), sit = pjTot && sitProj(pjTot, pjLo, pjHi, meta);
      const pp = meta && pjTot ? 100 * pjTot / meta : 0, porDia = meta && pj && pj.abertos ? Math.max(0, meta - fat) / pj.abertos : 0;
      const blocoProj = pjTot ? `<div class="proj-box">
          <div class="proj-main"><span class="lbl">Projeção de fechamento</span><b class="num">${brl(pjTot)}</b>
            <small>faixa provável ${milhar(pjLo)} a ${milhar(pjHi)}</small></div>
          ${meta ? `<div class="proj-main"><span class="lbl">Projeção x meta</span><b class="num">${pct(pp, 0)}</b>${sit ? `<span class="pill ${sit[1] === 'good' ? 'ok' : sit[1] === 'bad' ? 'no' : 'acc'}">${sit[0]}</span>` : ''}</div>
          <div class="proj-main"><span class="lbl">${fat >= meta ? 'Meta já batida' : 'Para bater a meta'}</span><b class="num">${fat >= meta ? '✓' : brl(porDia) + '<small class="pd">/dia</small>'}</b><small>${fat >= meta ? '' : `em ${pj.abertos} ${pj.abertos === 1 ? 'dia' : 'dias'} de funcionamento restantes`}</small></div>` : ''}
          <button type="button" class="proj-help" data-comoproj title="Como calculamos" aria-label="Como calculamos a projeção">?</button></div>` : '';
      const mAnt = perAnt().mes, resAnt = S.resultado.find(r => r.mes === mAnt), frA = fracAnt(), jA = janelaDe(S.per), jW = janelaAnt();
      const fatAnt = !resAnt ? null : !frA ? n(resAnt.faturamento_total) : (jA && jA.res ? n(jA.res.faturamento_total) : n(resAnt.faturamento_total) * frA.f);
      hero = `<div class="sec"><h2>Resultado da barbearia</h2><p>Faturamento total do sistema (comandas + assinaturas) contra a meta do mês.</p></div>
      <section class="hero"><div class="hero-top"><div><span class="lbl">Faturamento total da barbearia · ${esc(mesLabel(mes))}</span><div class="num big">${brl(fat)}</div>${resAnt ? `<div class="hero-var">${dv(fat, fatAnt)} <span>vs ${esc(mesLabel(mAnt))}${frA ? (jA && jA.res ? ` · mesmos dias (${dm(jW.ini)} a ${dm(jW.fim)})` : ` · proporcional a ${frA.dias} dias`) : ''}</span></div>` : ''}</div>
        <div class="pos-badge"><span class="num">${meta ? pct(p, 0) : '—'}</span><small>da meta</small></div></div>
        <div class="bar ${p >= 100 ? 'good' : ''}">${pp ? `<em class="bar-proj" style="width:${Math.min(100, pp)}%" title="Projeção: ${pct(pp, 0)} da meta"></em>` : ''}<i style="width:${Math.min(100, p)}%"></i></div>
        <div class="hero-meta"><span>Atingimento ${meta ? pct(p, 2) : '—'}${pp ? ` <span class="proj-leg">· projeção ${pct(pp, 0)}</span>` : ''}</span><span>${brl(fat)} / ${meta ? brl(meta) : 'sem meta'}</span></div>
        ${blocoProj}
        <div class="hero-row"><div><span class="lbl">Meta da barbearia</span><b class="num">${meta ? brl(meta) : '—'}</b></div>
          <div><span class="lbl">${fat >= meta ? 'Acima da meta' : 'Faltam'}</span><b class="num">${meta ? brl(Math.abs(meta - fat)) : '—'}</b></div>
          <div><span class="lbl">Comandas · assinaturas</span><b class="num" style="font-size:15px">${brl(res && res.comandas)} · ${brl(res && res.assinaturas)}</b></div></div></section>
      <div class="row"><button class="btn btn-sm" id="b-meta">${ic('edit', 16)}Meta da barbearia</button><span class="dim sm">Atualizado automaticamente · a meta é lançada por você.</span></div>`;
    }
    const metasHtml = mes ? `<section class="panel"><div class="panel-head"><h3 class="h2">Metas e mínimos individuais</h3><a class="btn btn-sm" href="#metas">${ic('edit', 16)}Editar</a></div>
      <div class="tbl-wrap"><table><thead><tr><th>Profissional</th><th class="r">Meta cadeira</th><th class="r">Faturamento</th>${projecao() ? '<th class="r">Projeção</th>' : ''}<th class="r">Mín. cadeira</th><th class="r">Produtos</th><th class="r">Mín. produtos</th><th class="r">Extras</th><th class="r">Mín. extras</th></tr></thead><tbody>
      ${rows.map(r => { const m = metaDe(r.pro.key, mes) || {}; const ok = (v, min) => n(min) ? (v >= n(min) ? 'good' : 'warn') : ''; const pr = projDe(projecao(), r.pro.key);
        const sp = pr && sitProj(pr.total, pr.lo, pr.hi, n(m.meta_cadeira));
        return `<tr><td><b>${esc(r.pro.nome)}</b></td><td class="r">${n(m.meta_cadeira) ? brl(m.meta_cadeira) : '—'}</td><td class="r ${ok(r.total, m.meta_cadeira)}">${brl(r.total)}${n(m.meta_cadeira) ? ` <span class="dim">(${pct(100 * r.total / n(m.meta_cadeira))})</span>` : ''}</td>
          ${projecao() ? `<td class="r" title="Faixa provável: ${pr ? milhar(pr.lo) + ' a ' + milhar(pr.hi) : '—'}"><span class="${sp ? sp[1] : ''}">${pr ? brl(pr.total) : '—'}</span>${n(m.meta_cadeira) && pr ? `<div class="dvl dim sm">${pct(100 * pr.total / n(m.meta_cadeira), 0)} da meta</div>` : ''}</td>` : ''}
          <td class="r">${n(m.min_cadeira) ? brl(m.min_cadeira) : '—'}</td><td class="r ${ok(r.produtos, m.min_produtos)}">${brl(r.produtos)}</td><td class="r">${n(m.min_produtos) ? brl(m.min_produtos) : '—'}</td>
          <td class="r ${ok(r.extras, m.min_extras)}">${brl(r.extras)}</td><td class="r">${n(m.min_extras) ? brl(m.min_extras) : '—'}</td></tr>`; }).join('')}
      </tbody></table></div><p class="dim sm" style="margin-top:10px">Verde = atingido · amarelo = abaixo do mínimo.${projecao() ? ' Projeção: verde = deve bater a meta · amarelo = no limite · vermelho = abaixo do ritmo.' : ''}</p></section>` : dia ? metasDiaHtml(rows, dia) : '';
    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">Painel do dono</p><h1 class="h1">${esc(perLabel())}</h1></div>${filtros()}</div>
      ${legendaVar()}
      ${hero}
      ${S.horas && !S.horas.erro ? `<div class="two">${painelEvo('c-bfat', `Evolução · faturamento total`, S.per, 'Comandas + assinaturas · ')}${painelEvo('c-bcom', `Evolução · comandas pagas`, S.per)}</div>` : ''}
      <div class="sec"><h2>Performance dos profissionais</h2><p>Faturamento da cadeira = serviços + produtos + extras + assinaturas.</p></div>
      ${kpisEquipe(rows)}
      <section class="panel"><div class="panel-head"><h3 class="h2">Ranking de faturamento · cadeiras</h3><a class="btn btn-sm btn-ghost" href="#faturamento">Detalhes</a></div>${tabelaCadeiras(rows)}</section>
      ${metasHtml}
      <div class="two">
        ${mes ? `<section class="panel"><h3 class="h2">Evolução no mês · comandas por barbeiro</h3><div class="chart"><canvas id="c-evo"></canvas></div></section>` : ''}
        <section class="panel"><h3 class="h2">Composição por cadeira</h3><div class="chart"><canvas id="c-comp"></canvas></div></section>
      </div>`);
    ligarFiltros(app);
    if (mes) graficoEvolucao('c-evo', pros().map(p => p.key), mes);
    graficoBarbearia('c-bfat', S.per); graficoBarbearia('c-bcom', S.per, { tipo: 'Comanda' }, '#f2efea');
    graficoComposicao('c-comp', rows);
    const b = $('#b-meta'); if (b) b.onclick = () => editarMetaBarbearia(mes);
    $$('[data-comoproj]').forEach(x => x.onclick = dia ? comoProjecaoDia : sem ? comoProjecaoSemana : comoProjecao);
  }
  function editarMetaBarbearia(mes) {
    const r = S.resultado.find(x => x.mes === mes) || { meta: (S.metasBarbearia.find(x => x.mes === mes) || {}).meta };
    openModal('Meta da barbearia', `<div class="form-grid"><p class="full note">${esc(mesLabel(mes))} · faturamento total da barbearia (comandas + assinaturas).</p>
      <label class="fld full"><span>Meta do mês (R$)</span><input name="meta" inputmode="decimal" placeholder="0,00" value="${moneyIn(r.meta)}"></label></div>`,
      async d => {
        const { error } = await sb.from('metas_barbearia').upsert({ mes, meta: money(d.meta) }); if (error) throw error;
        await carregar(); render(); toast('Meta da barbearia salva.', 'good');
      });
  }

  /* ---------- CRESCIMENTO (ano de 2026, mês a mês) ----------
     Barbearia: resultado_barbearia (faturamento do sistema). Cadeiras: painel_mensal.
     Mês em andamento: realizado + projeção do mês (mesmo cálculo do Dashboard), marcado como "parcial". */
  const ANO_INI = '2026-01-01';
  const MES_CURTO = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const mesAbr = m => MES_CURTO[parse(m).getMonth()];
  let crescCat = 'cosmetico';
  function projTotalMes(m) {
    const res = S.resultado.find(r => r.mes === m), fat = res ? n(res.faturamento_total) : 0, pj = projecao({ tipo: 'mes', mes: m });
    if (!pj) return null;
    return fat + pj.comandasResto + (pj.assModo === 'ritmo' ? n(res && res.assinaturas) / pj.b.feitos * pj.b.resto.length : pj.assResto);
  }
  const mediaArr = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
  function vCrescimento() {
    const atual = mesAtual(), meses = []; for (let m = ANO_INI; m <= atual; m = mesDe(addDays(ultimoDia(m), 1))) meses.push(m);
    const mensalDe = m => S.mensal.filter(r => r.mes === m && r.profissional !== 'Outros');
    const L = meses.map(m => {
      const r = S.resultado.find(x => x.mes === m) || {}, rows = mensalDe(m), parcial = m === atual;
      const fat = n(r.faturamento_total), at = rows.reduce((a, x) => a + n(x.atendimentos), 0), vendas = rows.reduce((a, x) => a + n(x.produtos) + n(x.extras), 0);
      return { m, parcial, fat, comandas: n(r.comandas), assinaturas: n(r.assinaturas), qtdAss: n(r.qtd_assinaturas), meta: n(r.meta), at, vendas,
        produtos: rows.reduce((a, x) => a + n(x.produtos), 0), extras: rows.reduce((a, x) => a + n(x.extras), 0),
        ticket: at ? n(r.comandas) / at : 0, proj: parcial ? projTotalMes(m) : null };
    });
    L.forEach((x, i) => { const a = L[i - 1]; x.ant = a ? a.fat : null; x.base = x.parcial && x.proj ? x.proj : x.fat; });
    const fech = L.filter(x => !x.parcial && x.fat > 0), acum = L.reduce((a, x) => a + x.fat, 0);
    const ult3 = fech.slice(-3), ant3 = fech.slice(-6, -3), mUlt3 = mediaArr(ult3.map(x => x.fat)), mAnt3 = mediaArr(ant3.map(x => x.fat));
    const melhor = fech.reduce((b, x) => !b || x.fat > b.fat ? x : b, null);
    const cur = L.find(x => x.parcial), restoMes = cur && cur.proj ? Math.max(0, cur.proj - cur.fat) : 0;
    const mesesFaltam = 11 - parse(atual).getMonth(), projAno = acum + restoMes + mesesFaltam * mUlt3;
    const lbl = x => `${cap(mesAbr(x.m))}${x.parcial ? '*' : ''}`;

    // cadeiras: equipe atual + ex-barbeiros/outros
    const keys = pros().map(p => p.key);
    const cad = pros().map(p => {
      const v = meses.map(m => { const r = S.mensal.find(x => x.mes === m && x.profissional === p.key); return r ? n(r.servicos) + n(r.produtos) + n(r.extras) + n(r.assinaturas) : 0; });
      const vf = v.slice(0, fech.length ? meses.indexOf(fech[fech.length - 1].m) + 1 : 0).filter(Boolean);
      return { p, v, tot: v.reduce((a, b) => a + b, 0), t3: mediaArr(vf.slice(-3)), a3: mediaArr(vf.slice(-6, -3)) };
    });
    const outros = meses.map(m => S.mensal.filter(x => x.mes === m && x.profissional !== 'Outros' && !keys.includes(x.profissional)).reduce((a, r) => a + n(r.servicos) + n(r.produtos) + n(r.extras) + n(r.assinaturas), 0));
    const totCad = cad.reduce((a, c) => a + c.tot, 0) + outros.reduce((a, b) => a + b, 0);
    const tend = (a, b) => b ? dv(a, b) : '<span class="dim sm">—</span>';

    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">Ano de 2026</p><h1 class="h1">Crescimento</h1></div></div>
      <p class="varnote">Faturamento total do sistema (comandas + assinaturas) de janeiro até hoje. ${cur ? `<b>${cap(mesAbr(cur.m))}*</b> ainda está em andamento: aparece o realizado e, em destaque claro, o que falta pela projeção do mês.` : ''} A variação de cada mês é contra o mês anterior.</p>
      <div class="kpis k4">
        ${kpiVar('Acumulado em 2026', brl(acum), '', `${meses.length} ${meses.length === 1 ? 'mês' : 'meses'} · média ${milhar(mediaArr(fech.map(x => x.fat)))}/mês (meses fechados)`, true)}
        ${kpiVar('Tendência', ult3.length ? milhar(mUlt3) + '<small class="pd">/mês</small>' : '—', ant3.length ? dv(mUlt3, mAnt3) : '', ult3.length ? `média de ${ult3.map(x => mesAbr(x.m)).join(', ')} vs ${ant3.map(x => mesAbr(x.m)).join(', ') || '—'}` : 'precisa de meses fechados')}
        ${kpiVar('Melhor mês', melhor ? cap(MESES[parse(melhor.m).getMonth()]) : '—', '', melhor ? brl(melhor.fat) : '')}
        ${kpiVar('Projeção de 2026', milhar(projAno), '', `acumulado + resto de ${cur ? mesAbr(cur.m) : 'mês'} + ${mesesFaltam} ${mesesFaltam === 1 ? 'mês' : 'meses'} na média dos últimos 3 · estimativa`)}</div>
      <div class="two">
        <section class="panel"><h3 class="h2">Faturamento por mês</h3><p class="dim sm" style="margin:-6px 0 10px">Comandas + assinaturas${cur && cur.proj ? ` · ${cap(mesAbr(cur.m))}*: parte clara = projeção do que falta` : ''}</p><div class="chart tall"><canvas id="c-cmes"></canvas></div></section>
        <section class="panel"><h3 class="h2">Acumulado no ano</h3><p class="dim sm" style="margin:-6px 0 10px">Soma do faturamento desde janeiro</p><div class="chart tall"><canvas id="c-cacum"></canvas></div></section>
      </div>
      <section class="panel"><h3 class="h2">Mês a mês · barbearia</h3><div class="tbl-wrap"><table><thead><tr><th>Mês</th><th class="r">Faturamento</th><th class="r">Comandas</th><th class="r">Assinaturas</th><th class="r">Cobranças clube</th><th class="r">Atendimentos</th><th class="r">Ticket comanda</th><th class="r">Vendas (prod. + extras)</th><th class="r">Vendas / atend.</th></tr></thead><tbody>
        ${L.map((x, i) => { const a = L[i - 1]; const va = (k, o) => a ? dv(x[k], a[k], o) : '';
          return `<tr><td><b>${lbl(x)}</b>${x.meta ? `<div class="dim sm">meta ${milhar(x.meta)}</div>` : ''}</td>
          <td class="r"><b>${brl(x.fat)}</b>${x.parcial ? (x.proj ? `<div class="dim sm">proj. ${milhar(x.proj)}</div>${dvl(a ? dv(x.proj, a.fat) + ' <span class="dim sm">proj.</span>' : '')}` : '') : dvl(va('fat'))}</td>
          <td class="r">${brl(x.comandas)}${x.parcial ? '' : dvl(va('comandas'))}</td><td class="r">${brl(x.assinaturas)}${x.parcial ? '' : dvl(va('assinaturas'))}</td>
          <td class="r">${int(x.qtdAss)}${x.parcial ? '' : dvl(va('qtdAss', { abs: true }))}</td><td class="r">${int(x.at)}${x.parcial ? '' : dvl(va('at', { fmt: int }))}</td>
          <td class="r">${brl(x.ticket)}${dvl(va('ticket'))}</td><td class="r">${brl(x.vendas)}${x.parcial ? '' : dvl(va('vendas'))}</td>
          <td class="r">${brl(x.at ? x.vendas / x.at : 0)}${dvl(a && a.at ? dv(x.at ? x.vendas / x.at : 0, a.vendas / a.at) : '')}</td></tr>`; }).join('')}
        </tbody><tfoot><tr><td>2026</td><td class="r">${brl(acum)}</td><td class="r">${brl(L.reduce((a, x) => a + x.comandas, 0))}</td><td class="r">${brl(L.reduce((a, x) => a + x.assinaturas, 0))}</td><td class="r">${int(L.reduce((a, x) => a + x.qtdAss, 0))}</td><td class="r">${int(L.reduce((a, x) => a + x.at, 0))}</td><td></td><td class="r">${brl(L.reduce((a, x) => a + x.vendas, 0))}</td><td></td></tr></tfoot></table></div>
        <p class="dim sm" style="margin-top:10px">* mês em andamento: variações só no fechamento (a do faturamento usa a projeção). Ticket comanda = comandas ÷ atendimentos. Cobranças clube = assinaturas cobradas no mês. Vendas e atendimentos somam todos os barbeiros, inclusive quem já saiu.</p></section>
      <section class="panel"><h3 class="h2">Acumulado por cadeira</h3><p class="dim sm" style="margin:-6px 0 10px">Faturamento da cadeira (serviços + produtos + extras + assinaturas) somado mês a mês · equipe atual</p><div class="chart tall"><canvas id="c-ccad"></canvas></div>
        <div class="tbl-wrap" style="margin-top:14px"><table><thead><tr><th>Profissional</th>${meses.map(m => `<th class="r">${cap(mesAbr(m))}${m === atual ? '*' : ''}</th>`).join('')}<th class="r">Acumulado</th><th class="r">% das cadeiras</th><th class="r" title="Média dos últimos 3 meses fechados vs os 3 anteriores">Tendência</th></tr></thead><tbody>
          ${cad.sort((a, b) => b.tot - a.tot).map(c => { const mx = Math.max(...c.v); return `<tr><td><b>${esc(c.p.nome)}</b></td>${c.v.map(v => `<td class="r ${v && v === mx ? 'good' : v ? '' : 'dim'}">${v ? milhar(v).replace('R$ ', '') : '—'}</td>`).join('')}
            <td class="r"><b>${brl(c.tot)}</b></td><td class="r">${totCad ? pct(100 * c.tot / totCad, 0) : '—'}</td><td class="r">${tend(c.t3, c.a3)}</td></tr>`; }).join('')}
          ${outros.some(Boolean) ? `<tr><td class="dim">Ex-barbeiros e outros</td>${outros.map(v => `<td class="r dim">${v ? milhar(v).replace('R$ ', '') : '—'}</td>`).join('')}<td class="r dim">${brl(outros.reduce((a, b) => a + b, 0))}</td><td class="r dim">${totCad ? pct(100 * outros.reduce((a, b) => a + b, 0) / totCad, 0) : '—'}</td><td></td></tr>` : ''}
        </tbody></table></div><p class="dim sm" style="margin-top:10px">Valores mensais em mil reais · verde = melhor mês da cadeira · tendência = média dos últimos 3 meses fechados contra os 3 anteriores.</p></section>
      <div class="two">
        <section class="panel"><h3 class="h2">Clube por mês</h3><p class="dim sm" style="margin:-6px 0 10px">Receita de assinaturas (receita recorrente)</p><div class="chart"><canvas id="c-cclube"></canvas></div></section>
        <section class="panel"><h3 class="h2">Produtos e extras por mês</h3><p class="dim sm" style="margin:-6px 0 10px">Vendas somadas de todas as cadeiras</p><div class="chart"><canvas id="c-cvend"></canvas></div></section>
      </div>
      <section class="panel"><div class="panel-head"><h3 class="h2">Mais vendidos em 2026</h3></div>
        <div class="chips" style="margin-bottom:12px">${[['cosmetico', 'Produtos'], ['servico_extra', 'Extras']].map(([k, l]) => `<button class="chip ${crescCat === k ? 'on' : ''}" data-ccat="${k}">${l}</button>`).join('')}</div>
        <div id="c-itens"><p class="empty">Carregando itens…</p></div></section>`);
    const lab = L.map(lbl);
    chart('c-cmes', { type: 'bar', data: { labels: lab, datasets: [
      { label: 'Comandas', data: L.map(x => +x.comandas.toFixed(2)), backgroundColor: '#e49e2b', borderRadius: 4, maxBarThickness: 46 },
      { label: 'Assinaturas', data: L.map(x => +x.assinaturas.toFixed(2)), backgroundColor: '#6f9bb0', borderRadius: 4, maxBarThickness: 46 },
      ...(cur && cur.proj ? [{ label: 'Projeção (falta)', data: L.map(x => x.parcial ? +Math.max(0, x.proj - x.fat).toFixed(2) : null), backgroundColor: 'rgba(228,158,43,.22)', borderColor: 'rgba(228,158,43,.6)', borderWidth: 1, borderDash: [4, 3], borderRadius: 4, maxBarThickness: 46 }] : [])] },
      options: { scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, ...eixoBRL } }, plugins: { legend: { position: 'bottom' } } } });
    let ac = 0; const acData = L.map(x => +(ac += x.fat).toFixed(2));
    chart('c-cacum', { type: 'line', data: { labels: lab, datasets: [{ label: 'Acumulado 2026', data: acData, borderColor: '#e49e2b', backgroundColor: '#e49e2b22', fill: true, tension: .25, pointRadius: 3, borderWidth: 2.5 }] },
      options: { plugins: { legend: { display: false } }, scales: { y: { ...eixoBRL, beginAtZero: true }, x: { grid: { display: false } } } } });
    chart('c-ccad', { type: 'line', data: { labels: lab, datasets: cad.map(c => { let s = 0; return { label: c.p.nome, data: c.v.map(v => +(s += v).toFixed(2)), borderColor: corDe(c.p.key), backgroundColor: corDe(c.p.key), tension: .25, pointRadius: 3, borderWidth: 2.5 }; }) },
      options: { interaction: { mode: 'index', intersect: false }, scales: { y: { ...eixoBRL, beginAtZero: true }, x: { grid: { display: false } } }, plugins: { legend: { position: 'bottom' } } } });
    chart('c-cclube', { type: 'bar', data: { labels: lab, datasets: [{ label: 'Assinaturas', data: L.map(x => +x.assinaturas.toFixed(2)), backgroundColor: '#6f9bb0', borderRadius: 4, maxBarThickness: 40 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { afterLabel: c => `${int(L[c.dataIndex].qtdAss)} cobranças` } } }, scales: { y: eixoBRL, x: { grid: { display: false } } } } });
    chart('c-cvend', { type: 'bar', data: { labels: lab, datasets: [
      { label: 'Produtos', data: L.map(x => +x.produtos.toFixed(2)), backgroundColor: '#e49e2b', borderRadius: 4, maxBarThickness: 40 },
      { label: 'Extras', data: L.map(x => +x.extras.toFixed(2)), backgroundColor: '#a8641c', borderRadius: 4, maxBarThickness: 40 }] },
      options: { scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, ...eixoBRL } }, plugins: { legend: { position: 'bottom' } } } });
    $$('[data-ccat]').forEach(b => b.onclick = () => { crescCat = b.dataset.ccat; vCrescimento(); });
    (async () => {
      try {
        const data = await q(sb.from('vendas_itens').select('*').eq('categoria', crescCat).gte('mes', ANO_INI).limit(5000));
        const ag = {}; data.forEach(r => { const a = ag[r.item] = ag[r.item] || { item: r.item, q: 0, v: 0 }; a.q += n(r.quantidade); a.v += n(r.valor); });
        const lista = Object.values(ag).sort((a, b) => b.v - a.v || b.q - a.q), max = lista[0] ? lista[0].v || 1 : 1, tot = lista.reduce((a, x) => a + x.v, 0);
        const el = $('#c-itens'); if (!el) return;
        el.innerHTML = lista.length ? `<div class="rlist">${lista.slice(0, 12).map((x, i) => `<div class="rrow"><span class="rp">${i + 1}</span><span class="av" style="width:40px;height:40px;font-size:13px">${int(x.q)}</span>
          <div class="rn"><b>${esc(x.item)}</b><small>${int(x.q)} unid. · média ${brl(x.q ? x.v / x.q : 0)} · ${tot ? pct(100 * x.v / tot, 0) : '—'} do total</small></div><span class="rv num">${brl(x.v)}</span><div class="rb"><i style="width:${100 * x.v / max}%"></i></div></div>`).join('')}</div>`
          : '<p class="empty">Nenhum item vendido em 2026 nesta categoria.</p>';
      } catch (e) { const el = $('#c-itens'); if (el) el.innerHTML = `<p class="empty">Não foi possível carregar os itens (${esc(e.message)}).</p>`; }
    })();
  }

  /* ---------- FATURAMENTO (layout do site original) ---------- */
  let fatHist = '';   // filtro do histórico: '' = todos, ou chave do profissional
  async function garantirDiario(inicio) {
    if (S.diarioDesde && inicio >= S.diarioDesde) return false;
    const fim = S.diarioDesde ? addDays(S.diarioDesde, -1) : today();
    const extra = await q(sb.from('painel_diario').select('*').gte('dia', inicio).lte('dia', fim).limit(3000));
    S.diario = S.diario.concat(extra); S.diarioDesde = inicio; return true;
  }
  function vFaturamento() {
    const rows = linhas(), mes = S.per.tipo === 'mes' ? S.per.mes : null, dia = S.per.tipo === 'dia' ? S.per.dia : null;
    const semRef = dia ? segunda(dia) : S.per.semana;
    const ini = dia || mes || S.per.semana, fim = dia || (mes ? ultimoDia(mes) : addDays(S.per.semana, 6));
    const tot = k => soma(rows, k), totAt = tot('atendimentos');
    const ant = anterior(), mAnt = perAnt().mes, pj = dia ? projDia() : projecao();
    const pjSoma = pj ? pj.rows.reduce((a, x) => a + x.total, 0) : 0;
    const kpi = (lbl, v, sub, lead, k) => kpiVar(lbl, brl(v), dv(v, somaAnt(ant, k)), sub, lead);
    const part = k => tot('total') ? pct(100 * tot(k) / tot('total'), 0) + ' das cadeiras' : '—';

    const cards = pros().map((p, i) => {
      const r = rows.find(x => x.pro.key === p.key), m = mes && metaDe(p.key, mes), meta = m ? n(m.meta_cadeira) : 0, pm = meta ? 100 * r.total / meta : 0;
      const ra = doPro(ant, p.key), mA = mes && ra && metaDe(p.key, mAnt), metaA = mA ? n(mA.meta_cadeira) : 0;
      const lin = (l, v, h, cls = '') => `<dt class="${cls}">${l}</dt><dd class="${cls}">${v}</dd><dd class="dvc ${cls}">${h || ''}</dd>`;
      const md = dia && metaDiaCadeira(r, dia), metaD = md ? md.valor : 0, pd = metaD ? 100 * r.total / metaD : 0;
      const pr = projDe(pj, p.key), sp = pr && sitProj(pr.total, pr.lo, pr.hi, dia ? metaD : meta), metaP = dia ? metaD : meta;
      return `<article class="pcard fcard"><div class="pcard-h">${av(p.nome, 44)}<div style="min-width:0;flex:1"><b>${esc(p.nome)}</b><small>Cadeira ${p.cadeira || i + 1}</small></div><div class="r"><b class="num ftot">${brl(r.total)}</b>${dvl(ra && dv(r.total, ra.total))}</div></div>
        ${mes ? `<div class="bar ${pm >= 100 ? 'good' : ''}" title="${meta ? pct(pm) + ' da meta' : 'Sem meta lançada'}">${pr && meta ? `<em class="bar-proj" style="width:${Math.min(100, 100 * pr.total / meta)}%"></em>` : ''}<i style="width:${Math.min(100, pm)}%"></i></div>` : ''}
        ${md ? `<div class="bar ${pd >= 100 ? 'good' : ''}" title="${md.folgaHoje ? 'Folga hoje' : pct(pd) + ' da meta do dia'}">${pr && metaD ? `<em class="bar-proj" style="width:${Math.min(100, 100 * pr.total / metaD)}%"></em>` : ''}<i style="width:${Math.min(100, pd)}%"></i></div>` : ''}
        ${pr && !(md && md.folgaHoje) ? `<div class="proj-line ${sp ? sp[1] : ''}" title="Faixa provável: ${dia ? brl(pr.lo) + ' a ' + brl(pr.hi) : milhar(pr.lo) + ' a ' + milhar(pr.hi)}"><span>Projeção ${dia ? 'do dia' : mes ? 'do mês' : 'da semana'}</span><div><b>${brl(pr.total)}</b>${metaP ? `<em>${pct(100 * pr.total / metaP, 0)} da meta${dia ? ' do dia' : ''}</em>` : ''}</div></div>` : ''}
        <dl class="kv kv3">${lin('Serviços', brl(r.servicos), ra && dv(r.servicos, ra.servicos))}${lin('Produtos', brl(r.produtos), ra && dv(r.produtos, ra.produtos))}
          ${lin('Extras / procedimentos', brl(r.extras), ra && dv(r.extras, ra.extras))}${lin('Assinaturas', brl(r.assinaturas), ra && dv(r.assinaturas, ra.assinaturas))}
          ${lin('Total da cadeira', brl(r.total), ra && dv(r.total, ra.total), 'tot')}
          ${lin('Clientes', int(r.atendimentos), ra && dv(r.atendimentos, ra.atendimentos, { fmt: int }))}${lin('Ticket médio', brl(r.ticket), ra && dv(r.ticket, ra.ticket))}
          ${mes ? lin('Meta', meta ? brl(meta) : '—', '') + lin('% da meta', `<span class="${meta && pm >= 100 ? 'good' : ''}">${meta ? pct(pm) : '—'}</span>`, meta && metaA ? dv(pm, 100 * ra.total / metaA, { pp: true }) : '') : ''}
          ${md ? lin('Meta do dia', md.folgaHoje ? 'folga' : brl(metaD), '') + lin('% da meta do dia', `<span class="${metaD && pd >= 100 ? 'good' : ''}">${metaD ? pct(pd) : '—'}</span>`, '') : ''}</dl></article>`;
    }).join('');

    // Histórico: semanas do mês (ou últimas 8 semanas no modo semana), com filtro por profissional
    const sems = mes
      ? [...new Set(S.semanal.filter(r => mesDe(r.semana) === mes || mesDe(addDays(r.semana, 6)) === mes).map(r => r.semana))].sort().reverse()
      : [...new Set(S.semanal.map(r => r.semana))].filter(s => s <= semRef).sort().reverse().slice(0, 8);
    const hist = sems.map(s => ({ s, rows: linhas({ tipo: 'semana', semana: s }) }));
    if (fatHist && !pros().some(p => p.key === fatHist)) fatHist = '';
    const histTabela = fatHist
      ? `<thead><tr><th>Semana</th>${SEG.map(x => `<th class="r">${x[1]}</th>`).join('')}<th class="r">Total</th><th class="r">Clientes</th></tr></thead><tbody>
        ${hist.map(h => { const r = h.rows.find(x => x.pro.key === fatHist); return `<tr><td>${semanaLabel(h.s)}</td>${SEG.map(x => `<td class="r">${brl(r[x[0]])}</td>`).join('')}<td class="r"><b>${brl(r.total)}</b></td><td class="r">${int(r.atendimentos)}</td></tr>`; }).join('')}`
      : `<thead><tr><th>Semana</th>${pros().map(p => `<th class="r">${esc(p.nome)}</th>`).join('')}<th class="r">Total</th></tr></thead><tbody>
        ${hist.map(h => `<tr><td>${semanaLabel(h.s)}</td>${h.rows.map(r => `<td class="r">${brl(r.total)}</td>`).join('')}<td class="r"><b>${brl(soma(h.rows, 'total'))}</b></td></tr>`).join('')}`;

    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">Performance dos profissionais</p><h1 class="h1">Faturamento das cadeiras</h1></div>${filtros()}</div>
      ${legendaVar()}
      <p class="note">Os valores entram automaticamente do sistema de hora em hora, das 10h às 22h — não precisa lançar nada. Faturamento da cadeira = serviços + produtos + extras + assinaturas. O resultado total da barbearia fica no Dashboard.</p>
      <div class="kpis k5">
        ${kpi('Soma das cadeiras', tot('total'), `${int(totAt)} atendimentos${pj ? ` · <b>projeção ${milhar(pjSoma)}</b>` : ''}`, true, 'total')}
        ${kpi('Serviços', tot('servicos'), part('servicos'), false, 'servicos')}
        ${kpi('Produtos', tot('produtos'), part('produtos'), false, 'produtos')}
        ${kpi('Extras / procedimentos', tot('extras'), part('extras'), false, 'extras')}
        ${kpi('Assinaturas', tot('assinaturas'), part('assinaturas'), false, 'assinaturas')}</div>
      <section class="panel"><div class="panel-head"><div><h3 class="h2">Comparativo das cadeiras</h3><p class="dim sm" style="margin:4px 0 0">Serviços + Produtos + Extras + Assinaturas = Faturamento total da cadeira</p></div></div>
        <div class="cards">${cards}</div>
        ${pj ? `<p class="dim sm" style="margin:12px 0 0">${dia ? 'Projeção do dia: o que já entrou + o que costuma entrar depois deste horário (média das últimas 4 vezes do mesmo dia da semana) + assinaturas no ritmo dos últimos 14 dias. Meta do dia = (meta do mês − faturado até ontem) ÷ dias de trabalho que faltam.' : 'Projeção: o que já entrou + média de cada dia da semana nas últimas 4 semanas (comandas) + assinaturas dos mesmos dias do mês anterior.'} Passe o mouse para ver a faixa provável. <a href="#" data-comoproj class="acc">Como calculamos</a></p>` : ''}</section>
      <div class="two">
        <section class="panel"><h3 class="h2">Evolução por profissional</h3><p class="dim sm" style="margin:-6px 0 10px">Comandas pagas acumuladas ${dia ? 'ao longo do dia' : 'no período'}</p><div class="chart tall"><canvas id="c-evo"></canvas></div></section>
        <section class="panel"><h3 class="h2">Composição por cadeira</h3><p class="dim sm" style="margin:-6px 0 10px">Serviços · Produtos · Extras/procedimentos · Assinaturas</p><div class="chart tall"><canvas id="c-comp"></canvas></div></section>
      </div>
      <section class="panel"><div class="panel-head"><h3 class="h2">Histórico semanal</h3>
        <select id="f-hist" aria-label="Profissional"><option value="">Todos os profissionais</option>${pros().map(p => `<option value="${esc(p.key)}" ${p.key === fatHist ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}</select></div>
        <div class="tbl-wrap"><table>${histTabela}${hist.length ? '' : '<tr><td colspan="9" class="empty">Sem semanas neste período.</td></tr>'}</tbody></table></div>
        <p class="dim sm" style="margin-top:10px">Semanas de segunda a domingo · semanas na virada do mês aparecem inteiras.</p></section>`);
    ligarFiltros(app);
    $('#f-hist').onchange = e => { fatHist = e.target.value; render(); };
    $$('[data-comoproj]').forEach(x => x.onclick = e => { e.preventDefault(); dia ? comoProjecaoDia() : comoProjecao(); });
    if (dia) graficoHoras('c-evo', pros().map(p => ({ label: p.nome, dia, key: p.key, tipo: 'Comanda', cor: corDe(p.key), ate: corteDia() || undefined })));
    else graficoEvolucao('c-evo', pros().map(p => p.key), ini, 0, fim);
    graficoComposicaoV('c-comp', rows);
    garantirDiario(ini).then(mudou => { if (mudou && rotaAtual()[0] === 'faturamento') render(); }).catch(() => {});
  }
  function graficoComposicaoV(id, rows) {
    chart(id, { type: 'bar', data: { labels: rows.map(r => r.pro.nome), datasets: SEG.map(([k, l, c]) => ({ label: k === 'extras' ? 'Extras/procedimentos' : l, data: rows.map(r => +r[k].toFixed(2)), backgroundColor: c, borderRadius: 4, maxBarThickness: 64 })) },
      options: { scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, ...eixoBRL } }, plugins: { legend: { position: 'bottom' } } } });
  }
  const cabecalho = (titulo, eyebrow, opts) => `<div class="page-head"><div><p class="eyebrow">${esc(eyebrow)}</p><h1 class="h1">${esc(titulo)}</h1></div>${filtros(opts)}</div>`;

  /* ---------- CULTURA (ocorrências disciplinares: quanto menor, melhor) ---------- */
  let culturaSel = '', culturaHist = '';
  async function carregarCultura() {
    const [cats, camps, cfg, oc] = await Promise.all([
      q(sb.from('cultura_categorias').select('*').order('ordem')),
      q(sb.from('campanhas').select('*').order('inicio', { ascending: false })),
      q(sb.from('cultura_config').select('*')),
      q(sb.from('cultura_ocorrencias').select('*').order('data', { ascending: false }).limit(1000))
    ]);
    S.cultura = { cats, camps, oc, limitePadrao: n((cfg[0] || {}).limite_padrao) || 20 };
  }
  function periodosCultura(selId = culturaSel) {
    const C = S.cultura, hoje = today();
    const camps = C.camps.map(c => ({ id: 'c' + c.id, nome: c.nome, inicio: c.inicio, fim: c.fim, limite: n(c.limite_cultura), camp: c }));
    const meses = [...new Set([mesAtual(), ...C.oc.map(o => mesDe(o.data))])]
      .map(m => ({ id: 'm' + m, nome: mesLabel(m), inicio: m, fim: ultimoDia(m), limite: C.limitePadrao, camp: null }));
    const todos = [...camps, ...meses].sort((a, b) => (a.inicio < b.inicio ? 1 : -1));
    const ativo = camps.find(c => c.inicio <= hoje && c.fim >= hoje) || meses.find(m => m.inicio === mesAtual());
    return { todos, sel: todos.find(t => t.id === selId) || ativo };
  }
  function statusCultura(pts, lim) {
    const r = lim ? pts / lim : 0;
    if (!pts) return ['Sem ocorrências', 'good'];
    if (r >= 1) return ['Limite atingido', 'bad'];
    if (r > .75) return ['Crítico', 'bad'];
    if (r > .5) return ['Atenção', 'warn'];
    if (r > .25) return ['Bom', 'good'];
    return ['Excelente', 'good'];
  }
  async function vCultura() {
    if (!S.cultura) { shell(rotaAtual(), '<div class="loading">Carregando…</div>'); await carregarCultura(); }
    const C = S.cultura, adm = isAdmin(), { todos, sel } = periodosCultura(), lim = sel.limite;
    const noPer = C.oc.filter(o => o.data >= sel.inicio && o.data <= sel.fim);
    const lista = adm ? pros() : pros().filter(p => p.key === S.me.profissional);
    const rank = lista.map(p => { const os = noPer.filter(o => o.profissional === p.key); return { p, pts: os.reduce((a, o) => a + n(o.pontos), 0), qtd: os.length }; })
      .sort((a, b) => a.pts - b.pts || a.p.nome.localeCompare(b.p.nome));
    const pior = [...rank].sort((a, b) => b.pts - a.pts)[0];
    const plural = (k, s, pl) => `${k} ${k === 1 ? s : pl}`;

    const kpi1 = adm
      ? `<div class="kpi"><span class="lbl">Mais próximo do limite</span><div class="num">${pior && pior.pts ? esc(pior.p.nome) : '—'}</div>
          <small>${pior && pior.pts ? `${pior.pts}/${lim} · ${pior.pts >= lim ? 'Atingiu o limite.' : `Está a ${lim - pior.pts} ${lim - pior.pts === 1 ? 'ponto' : 'pontos'} do limite.`}` : 'Ninguém pontuou neste período.'}</small></div>`
      : `<div class="kpi"><span class="lbl">Sua pontuação</span><div class="num">${rank[0] ? rank[0].pts : 0}<span class="dim" style="font-size:.6em">/${lim}</span></div><small>${rank[0] ? statusCultura(rank[0].pts, lim)[0] : ''}</small></div>`;

    const ranking = rank.map((r, i) => { const [st, cl] = statusCultura(r.pts, lim), w = lim ? Math.min(100, 100 * r.pts / lim) : 0;
      return `<div class="crow"><span class="cpos">${i + 1}º</span><div class="cmid"><div class="ctop"><b>${esc(r.p.nome)}</b><span class="num cpts">${r.pts}<small>/${lim}</small></span></div>
        <div class="bar cbar ${cl}"><i style="width:${w}%"></i></div><small class="dim">${plural(r.qtd, 'ocorrência', 'ocorrências')} · <span class="${cl}">${st}</span></small></div>
        ${adm ? `<button class="btn btn-sm cadd" data-add="${esc(r.p.key)}" title="Lançar ocorrência para ${esc(r.p.nome)}" aria-label="Lançar ocorrência">${ic('plus', 18)}</button>` : ''}</div>`; }).join('') || '<p class="empty">Nenhum profissional ativo.</p>';

    const porCat = Object.values(noPer.reduce((a, o) => { const c = a[o.categoria] || (a[o.categoria] = { nome: o.categoria, qtd: 0, pts: 0 }); c.qtd++; c.pts += n(o.pontos); return a; }, {}))
      .sort((a, b) => b.pts - a.pts || b.qtd - a.qtd);

    const nomesHist = [...new Set([...lista.map(p => p.key), ...C.oc.map(o => o.profissional)])].filter(k => adm || k === S.me.profissional);
    if (culturaHist && !nomesHist.includes(culturaHist)) culturaHist = '';
    const hist = C.oc.filter(o => !culturaHist || o.profissional === culturaHist)
      .sort((a, b) => (a.data === b.data ? (a.criado_em < b.criado_em ? 1 : -1) : (a.data < b.data ? 1 : -1)));

    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">Cultura da equipe</p><h1 class="h1">Cultura</h1>
        <p class="sm" style="margin:0"><b class="good">Quanto menor, melhor.</b> <span class="mut">Cada ocorrência soma pontos. Limite ${sel.camp ? 'da campanha' : 'do mês'}: ${lim}.</span></p></div>
        <div class="filters"><select id="cul-per" aria-label="Período">${todos.map(t => `<option value="${t.id}" ${t.id === sel.id ? 'selected' : ''}>${esc(t.camp ? 'Campanha · ' + t.nome : t.nome)}</option>`).join('')}</select>
        ${adm ? `<button class="btn" id="cul-camp">${ic('flag', 18)}Nova campanha</button><button class="btn btn-acc" id="cul-add">${ic('plus', 18)}Lançar ocorrência</button>` : ''}</div></div>
      <div class="kpis k3">${kpi1}
        <div class="kpi"><span class="lbl">Ocorrências ${sel.camp ? 'na campanha' : 'no mês'}</span><div class="num">${noPer.length}</div><small>${dm(sel.inicio)} a ${dm(sel.fim)}</small></div>
        <div class="kpi"><span class="lbl">Limite atual</span><div class="num">${lim} pts</div><small>${adm ? `<a href="#" id="cul-lim" class="acc">Alterar ${sel.camp ? 'na campanha' : 'o limite padrão'}</a>` : (sel.camp ? esc(sel.nome) : 'limite padrão do mês')}</small></div></div>
      <div class="two">
        <section class="panel"><h3 class="h2">Ranking de cultura</h3><p class="mut sm" style="margin:-6px 0 12px">Menor pontuação = melhor posição.</p><div class="clist">${ranking}</div></section>
        <section class="panel"><h3 class="h2">Evolução da pontuação</h3><div class="chart tall"><canvas id="c-cul"></canvas></div></section></div>
      <section class="panel"><h3 class="h2">Ocorrências por categoria (${sel.camp ? 'campanha' : 'mês'})</h3>
        <div class="tbl-wrap"><table><thead><tr><th>Categoria</th><th class="r">Ocorrências</th><th class="r">Pontos</th></tr></thead><tbody>
        ${porCat.map(c => `<tr><td>${esc(c.nome)}</td><td class="r">${c.qtd}</td><td class="r bad"><b>+${c.pts}</b></td></tr>`).join('') || '<tr><td colspan="3" class="empty">Nenhuma ocorrência neste período.</td></tr>'}
        </tbody></table></div></section>
      <section class="panel"><div class="panel-head"><h3 class="h2">Histórico de ocorrências</h3>
        ${nomesHist.length > 1 ? `<select id="cul-hist" aria-label="Profissional"><option value="">Todos</option>${nomesHist.map(k => `<option value="${esc(k)}" ${k === culturaHist ? 'selected' : ''}>${esc(nomeDe(k))}</option>`).join('')}</select>` : ''}</div>
        <div class="hlist">${hist.map(o => `<div class="hrow"><span class="hpts num">+${n(o.pontos)}</span>
          <div class="hmid"><b>${esc(nomeDe(o.profissional))} · ${esc(o.categoria)}</b><p>“${esc(o.descricao)}”${o.observacao ? ` — ${esc(o.observacao)}` : ''}</p>
          <small class="dim">${dm(o.data)}${o.data.slice(0, 4) !== today().slice(0, 4) ? '/' + o.data.slice(0, 4) : ''} · lançado por ${esc(o.lancado_nome || '—')}</small></div>
          ${adm ? `<div class="hact"><button class="btn btn-ghost btn-sm" data-edit="${o.id}" aria-label="Editar">${ic('edit', 18)}</button><button class="btn btn-ghost btn-sm bad" data-del="${o.id}" aria-label="Excluir">${ic('trash', 18)}</button></div>` : ''}</div>`).join('')
          || '<p class="empty">Nenhuma ocorrência lançada.</p>'}</div></section>`);

    $('#cul-per').onchange = e => { culturaSel = e.target.value; render(); };
    const h = $('#cul-hist'); if (h) h.onchange = e => { culturaHist = e.target.value; render(); };
    if (adm) {
      $('#cul-add').onclick = () => formOcorrencia();
      $('#cul-camp').onclick = () => formCampanha(null);
      $('#cul-lim').onclick = e => { e.preventDefault(); sel.camp ? formCampanha(sel.camp) : formLimitePadrao(); };
      $$('[data-add]').forEach(b => b.onclick = () => formOcorrencia({ profissional: b.dataset.add }));
      $$('[data-edit]').forEach(b => b.onclick = () => formOcorrencia(C.oc.find(o => String(o.id) === b.dataset.edit)));
      $$('[data-del]').forEach(b => b.onclick = () => excluirOcorrencia(C.oc.find(o => String(o.id) === b.dataset.del)));
    }
    graficoCultura('c-cul', rank.map(r => r.p.key), noPer, sel, lim);
  }
  function graficoCultura(id, keys, oc, sel, lim) {
    const fim = sel.fim < today() ? sel.fim : today(), dias = [];
    for (let d = sel.inicio; d <= fim; d = addDays(d, 1)) dias.push(d);
    const ds = keys.map(k => { let acc = 0;
      return { label: nomeDe(k), borderColor: corDe(k), backgroundColor: corDe(k), stepped: true, pointRadius: 0, borderWidth: 2.2, fill: false,
        data: dias.map(d => { acc += oc.filter(o => o.data === d && o.profissional === k).reduce((a, o) => a + n(o.pontos), 0); return acc; }) }; });
    ds.push({ label: 'Limite', data: dias.map(() => lim), borderColor: '#e8695d', backgroundColor: 'transparent', borderDash: [6, 6], pointRadius: 0, borderWidth: 1.5, fill: false });
    chart(id, { type: 'line', data: { labels: dias.map(dm), datasets: ds },
      options: { interaction: { mode: 'index', intersect: false }, plugins: { legend: { position: 'bottom' }, tooltip: { callbacks: { label: c => `${c.dataset.label}: ${c.parsed.y} pts` } } },
        scales: { y: { beginAtZero: true, suggestedMax: lim, ticks: { precision: 0 } }, x: { ticks: { maxTicksLimit: 6 }, grid: { display: false } } } } });
  }
  async function recarregarCultura(msg) { await carregarCultura(); render(); toast(msg, 'good'); }
  function formOcorrencia(o = {}) {
    const C = S.cultura, cats = C.cats.filter(c => c.ativo || c.nome === o.categoria);
    const opcoes = [...new Set([...pros().map(p => p.key), ...(o.profissional ? [o.profissional] : [])])];
    const pts0 = o.pontos || (cats.find(c => c.nome === o.categoria) || cats[0] || {}).pontos || 1;
    const f = openModal(o.id ? 'Editar ocorrência' : 'Lançar ocorrência', `<div class="form-grid">
      <label class="fld full"><span>Profissional</span><select name="profissional" required>${o.profissional ? '' : '<option value="">Selecione…</option>'}${opcoes.map(k => `<option value="${esc(k)}" ${k === o.profissional ? 'selected' : ''}>${esc(nomeDe(k))}</option>`).join('')}</select></label>
      <label class="fld"><span>Data</span><input name="data" type="date" value="${esc(o.data || today())}" max="${today()}" required></label>
      <label class="fld"><span>Pontos</span><input name="pontos" type="number" min="1" max="50" step="1" value="${pts0}" required></label>
      <label class="fld full"><span>Categoria</span><select name="categoria" required>${cats.map(c => `<option value="${esc(c.nome)}" data-pts="${c.pontos}" ${c.nome === o.categoria ? 'selected' : ''}>${esc(c.nome)} (${c.pontos} pt${c.pontos > 1 ? 's' : ''})</option>`).join('')}</select></label>
      <label class="fld full"><span>O que aconteceu</span><textarea name="descricao" rows="3" maxlength="500" required>${esc(o.descricao || '')}</textarea></label>
      <label class="fld full"><span>Regra / orientação (opcional)</span><input name="observacao" maxlength="200" value="${esc(o.observacao || '')}" placeholder="ex.: compromisso com horário"></label></div>`,
      async d => {
        const reg = { profissional: d.profissional, data: d.data, categoria: d.categoria, pontos: Math.round(n(d.pontos)), descricao: (d.descricao || '').trim(), observacao: (d.observacao || '').trim() || null };
        if (!reg.profissional) throw new Error('Escolha o profissional.');
        if (!reg.descricao) throw new Error('Descreva o que aconteceu.');
        if (reg.pontos < 1 || reg.pontos > 50) throw new Error('Pontos devem ficar entre 1 e 50.');
        if (!reg.data || reg.data > today()) throw new Error('Data inválida.');
        const { error } = o.id ? await sb.from('cultura_ocorrencias').update(reg).eq('id', o.id) : await sb.from('cultura_ocorrencias').insert(reg);
        if (error) throw error;
        await recarregarCultura(o.id ? 'Ocorrência atualizada.' : 'Ocorrência lançada.');
      }, o.id ? 'Salvar' : 'Lançar');
    const cat = f.querySelector('[name=categoria]'), pts = f.querySelector('[name=pontos]');
    cat.onchange = () => { pts.value = cat.selectedOptions[0].dataset.pts; };
  }
  function excluirOcorrencia(o) {
    if (!o) return;
    openModal('Excluir ocorrência', `<p class="mut">Excluir a ocorrência de <b>${esc(nomeDe(o.profissional))}</b> (${esc(o.categoria)}, +${n(o.pontos)}) de ${dBR(o.data)}? Isso não pode ser desfeito.</p>`,
      async () => { const { error } = await sb.from('cultura_ocorrencias').delete().eq('id', o.id); if (error) throw error; await recarregarCultura('Ocorrência excluída.'); }, 'Excluir');
  }
  function formCampanha(c) {
    const m = mesAtual();
    openModal(c ? 'Editar campanha' : 'Nova campanha', `<div class="form-grid">
      <label class="fld full"><span>Nome</span><input name="nome" maxlength="60" required value="${esc(c ? c.nome : '')}" placeholder="ex.: Campanha de outubro"></label>
      <label class="fld"><span>Início</span><input name="inicio" type="date" required value="${esc(c ? c.inicio : m)}"></label>
      <label class="fld"><span>Fim</span><input name="fim" type="date" required value="${esc(c ? c.fim : ultimoDia(m))}"></label>
      <label class="fld full"><span>Limite de pontos de cultura</span><input name="limite_cultura" type="number" min="1" max="500" required value="${c ? c.limite_cultura : S.cultura.limitePadrao}"></label></div>`,
      async d => {
        const reg = { nome: (d.nome || '').trim(), inicio: d.inicio, fim: d.fim, limite_cultura: Math.round(n(d.limite_cultura)) };
        if (!reg.nome || !reg.inicio || !reg.fim) throw new Error('Preencha nome, início e fim.');
        if (reg.fim < reg.inicio) throw new Error('O fim precisa ser depois do início.');
        if (reg.limite_cultura < 1) throw new Error('Limite inválido.');
        const { data, error } = c ? await sb.from('campanhas').update(reg).eq('id', c.id).select() : await sb.from('campanhas').insert(reg).select();
        if (error) throw error;
        if (data && data[0]) culturaSel = 'c' + data[0].id;
        await recarregarCultura(c ? 'Campanha atualizada.' : 'Campanha criada.');
      });
  }
  function formLimitePadrao() {
    openModal('Limite padrão', `<div class="form-grid"><p class="full note">Vale para os meses sem campanha cadastrada.</p>
      <label class="fld full"><span>Limite de pontos</span><input name="lim" type="number" min="1" max="500" required value="${S.cultura.limitePadrao}"></label></div>`,
      async d => { const v = Math.round(n(d.lim)); if (v < 1) throw new Error('Limite inválido.');
        const { error } = await sb.from('cultura_config').upsert({ id: 1, limite_padrao: v }); if (error) throw error; await recarregarCultura('Limite padrão salvo.'); });
  }

  /* ---------- VENDAS ---------- */
  const CATS = [['cosmetico', 'Produtos'], ['servico_extra', 'Extras'], ['barbearia', 'Barbearia'], ['bebidas', 'Bebidas'], ['gorjeta', 'Gorjeta']];
  let vendasFiltro = { cat: 'cosmetico', pro: '' };
  async function vVendas() {
    const rows = linhas(), mes = S.per.tipo === 'mes' ? S.per.mes : null, ant = anterior();
    const porAt = rs => soma(rs, 'atendimentos') ? soma(rs, 'vendas') / soma(rs, 'atendimentos') : 0;
    shell(rotaAtual(), cabecalho('Vendas', 'Produtos e extras') + legendaVar() + `
      <div class="kpis k4">
        ${kpiVar('Produtos', brl(soma(rows, 'produtos')), dv(soma(rows, 'produtos'), somaAnt(ant, 'produtos')), 'cosméticos vendidos', true)}
        ${kpiVar('Extras', brl(soma(rows, 'extras')), dv(soma(rows, 'extras'), somaAnt(ant, 'extras')), 'procedimentos pagos à parte')}
        ${kpiVar('Vendas totais', brl(soma(rows, 'vendas')), dv(soma(rows, 'vendas'), somaAnt(ant, 'vendas')), 'produtos + extras')}
        ${kpiVar('Por atendimento', brl(porAt(rows)), ant ? dv(porAt(rows), porAt(ant)) : '', 'vendas ÷ atendimentos')}</div>
      <section class="panel"><h3 class="h2">Por profissional · ${esc(perLabel())}</h3><div class="tbl-wrap"><table><thead><tr><th>Profissional</th><th class="r">Produtos</th>${mes ? '<th class="r">Mín.</th>' : ''}<th class="r">Extras</th>${mes ? '<th class="r">Mín.</th>' : ''}<th class="r">Vendas</th><th class="r">% da cadeira</th></tr></thead><tbody>
        ${[...rows].sort((a, b) => b.vendas - a.vendas).map(r => { const m = mes && metaDe(r.pro.key, mes) || {}; const c = (v, min) => n(min) ? (v >= n(min) ? 'good' : 'warn') : ''; const ra = doPro(ant, r.pro.key);
          return `<tr><td><b>${esc(r.pro.nome)}</b></td><td class="r"><span class="${c(r.produtos, m.min_produtos)}">${brl(r.produtos)}</span>${dvl(ra && dv(r.produtos, ra.produtos))}</td>${mes ? `<td class="r dim">${n(m.min_produtos) ? brl(m.min_produtos) : '—'}</td>` : ''}
            <td class="r"><span class="${c(r.extras, m.min_extras)}">${brl(r.extras)}</span>${dvl(ra && dv(r.extras, ra.extras))}</td>${mes ? `<td class="r dim">${n(m.min_extras) ? brl(m.min_extras) : '—'}</td>` : ''}<td class="r"><b>${brl(r.vendas)}</b>${dvl(ra && dv(r.vendas, ra.vendas))}</td>
            <td class="r">${r.total ? pct(100 * r.vendas / r.total, 0) : '—'}${dvl(ra && ra.total && r.total ? dv(100 * r.vendas / r.total, 100 * ra.vendas / ra.total, { pp: true }) : '')}</td></tr>`; }).join('')}
      </tbody></table></div></section>
      <section class="panel"><div class="panel-head"><h3 class="h2">Itens vendidos</h3>
        <select id="v-pro" style="width:auto"><option value="">Todos os profissionais</option>${pros().map(p => `<option value="${esc(p.key)}" ${vendasFiltro.pro === p.key ? 'selected' : ''}>${esc(p.nome)}</option>`).join('')}</select></div>
        <div class="chips" style="margin-bottom:12px">${CATS.map(([k, l]) => `<button class="chip ${vendasFiltro.cat === k ? 'on' : ''}" data-cat="${k}">${l}</button>`).join('')}</div>
        <div id="v-itens"><p class="empty">Carregando itens…</p></div></section>`);
    ligarFiltros(app);
    $$('[data-cat]').forEach(b => b.onclick = () => { vendasFiltro.cat = b.dataset.cat; vVendas(); });
    $('#v-pro').onchange = e => { vendasFiltro.pro = e.target.value; vVendas(); };
    try {
      let qy = sb.from(S.per.tipo === 'dia' ? 'vendas_itens_dia' : 'vendas_itens').select('*').eq('categoria', vendasFiltro.cat);
      qy = S.per.tipo === 'dia' ? qy.eq('dia', S.per.dia) : S.per.tipo === 'mes' ? qy.eq('mes', S.per.mes) : qy.eq('semana', S.per.semana);
      if (vendasFiltro.pro) qy = qy.eq('profissional', vendasFiltro.pro);
      const data = await q(qy.limit(2000));
      const ag = {}; data.forEach(r => { const a = ag[r.item] = ag[r.item] || { item: r.item, q: 0, v: 0 }; a.q += n(r.quantidade); a.v += n(r.valor); });
      const lista = Object.values(ag).sort((a, b) => b.v - a.v || b.q - a.q), max = lista[0] ? lista[0].v || 1 : 1;
      const el = $('#v-itens'); if (!el) return;
      el.innerHTML = lista.length ? `<div class="rlist">${lista.slice(0, 25).map((x, i) => `<div class="rrow"><span class="rp">${i + 1}</span><span class="av" style="width:40px;height:40px;font-size:13px">${int(x.q)}</span>
        <div class="rn"><b>${esc(x.item)}</b><small>${int(x.q)} unid. · média ${brl(x.q ? x.v / x.q : 0)}</small></div><span class="rv num">${brl(x.v)}</span><div class="rb"><i style="width:${100 * x.v / max}%"></i></div></div>`).join('')}</div>`
        : '<p class="empty">Nenhum item nesta categoria no período.</p>';
    } catch (e) { const el = $('#v-itens'); if (el) el.innerHTML = `<p class="empty">Não foi possível carregar os itens (${esc(e.message)}).</p>`; }
  }

  /* ---------- CLUBE ---------- */
  function vClube() {
    const rows = linhas(), ass = soma(rows, 'assinaturas'), pote = ass * (CFG.percentualPote || .45), at = soma(rows, 'atendimentos_clube');
    const ord = [...rows].sort((a, b) => n(b.participacao_pct) - n(a.participacao_pct)), ant = anterior();
    const assA = somaAnt(ant, 'assinaturas'), atA = somaAnt(ant, 'atendimentos_clube'), potePct = CFG.percentualPote || .45;
    shell(rotaAtual(), cabecalho('Clube', 'Assinaturas e divisão do pote') + legendaVar() + `
      <div class="kpis k4">
        ${kpiVar('Faturamento do clube', brl(ass), dv(ass, assA), 'assinaturas recebidas no período', true)}
        ${kpiVar(`Pote (${pct(100 * potePct, 0)})`, brl(pote), dv(pote, ant ? assA * potePct : null), 'dividido pela participação')}
        ${kpiVar('Atendimentos de clube', int(at), dv(at, atA, { fmt: int }), 'serviços feitos para assinantes')}
        ${kpiVar('Receita por atendimento', brl(at ? ass / at : 0), ant && atA ? dv(at ? ass / at : 0, assA / atA) : '', 'assinaturas ÷ atendimentos')}</div>
      <section class="panel"><h3 class="h2">Divisão por profissional · ${esc(perLabel())}</h3><div class="tbl-wrap"><table><thead><tr><th>Profissional</th><th class="r">Atend. clube</th><th class="r">Participação</th><th class="r">Faturamento clube</th><th class="r">Comissão do pote</th></tr></thead><tbody>
        ${ord.map(r => { const ra = doPro(ant, r.pro.key); return `<tr><td><b>${esc(r.pro.nome)}</b></td><td class="r">${int(r.atendimentos_clube)}${dvl(ra && dv(r.atendimentos_clube, ra.atendimentos_clube, { fmt: int }))}</td>
          <td class="r">${pct(r.participacao_pct, 2)}${dvl(ra && dv(r.participacao_pct, ra.participacao_pct, { pp: true }))}</td><td class="r"><b>${brl(r.assinaturas)}</b>${dvl(ra && dv(r.assinaturas, ra.assinaturas))}</td><td class="r">${brl(r.comissao_pote)}${dvl(ra && dv(r.comissao_pote, ra.comissao_pote))}</td></tr>`; }).join('')}
      </tbody><tfoot><tr><td>Total</td><td class="r">${int(at)}</td><td class="r">${pct(soma(rows, 'participacao_pct'), 2)}</td><td class="r">${brl(ass)}</td><td class="r">${brl(soma(rows, 'comissao_pote'))}</td></tr></tfoot></table></div>
        <p class="note" style="margin-top:12px">A participação segue a regra do clube: cada atendimento de clube vale fichas (corte e barba = 1, raspar na máquina = 0,75, pezinho = 0,25). Serviços pagos à parte pelo assinante entram em Extras.</p></section>
      ${S.horas && !S.horas.erro ? painelEvo('c-cevo', 'Evolução do clube · assinaturas recebidas', S.per) : ''}
      <section class="panel"><h3 class="h2">Participação no pote</h3><div class="chart"><canvas id="c-pote"></canvas></div></section>`);
    ligarFiltros(app);
    graficoBarbearia('c-cevo', S.per, { tipo: 'Assinatura' }, '#6b9bb5');
    chart('c-pote', { type: 'bar', data: { labels: ord.map(r => r.pro.nome), datasets: [{ label: 'Participação', data: ord.map(r => n(r.participacao_pct)), backgroundColor: ord.map(r => corDe(r.pro.key)), borderRadius: 6, maxBarThickness: 60 }] },
      options: { plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => pct(c.parsed.y, 2) } } }, scales: { y: { ticks: { callback: v => v + '%' } }, x: { grid: { display: false } } } } });
  }

  /* ---------- RANKING ---------- */
  const TIPOS = [['total', 'Faturamento'], ['vendas', 'Vendas'], ['produtos', 'Produtos'], ['extras', 'Extras'], ['assinaturas', 'Clube'], ['atendimentos', 'Atendimentos']];
  let rankTipo = 'total';
  function vRanking() {
    const rows = linhas(), [tk, tl] = TIPOS.find(t => t[0] === rankTipo), fmt = tk === 'atendimentos' ? int : brl;
    const mes = S.per.tipo === 'mes' ? S.per.mes : null, rot = tk === 'total' ? 'da meta' : 'do mínimo';
    const ating = r => { const a = alvoRank(tk, r.pro.key, mes); return a ? `${pct(100 * n(r[tk]) / a, 0)} ${rot}` : ''; };
    const ord = [...rows].sort((a, b) => n(b[tk]) - n(a[tk]) || a.pro.nome.localeCompare(b.pro.nome)), max = n(ord[0] && ord[0][tk]) || 1;
    const eu = S.me.profissional, top = [ord[1], ord[0], ord[2]], ant = anterior(), ordAnt = ordem(ant, tk);
    const vr = r => { const ra = doPro(ant, r.pro.key); return ra ? dv(r[tk], ra[tk], tk === 'atendimentos' ? { fmt: int } : {}) : ''; };
    const pv = (r, i) => ant ? dvPos(i + 1, posDe(ordAnt, r.pro.key)) : '';
    shell(rotaAtual(), `<div class="page-head"><div><p class="eyebrow">${esc(perLabel())}</p><h1 class="rank-title">Ranking<i>.</i></h1></div>${filtros()}</div>
      <div class="chips">${TIPOS.map(([k, l]) => `<button class="chip ${k === rankTipo ? 'on' : ''}" data-rt="${k}">${l}</button>`).join('')}</div>
      ${legendaVar()}
      <div class="podium">${top.map((r, i) => r ? `<div class="pod p${[2, 1, 3][i]} ${r.pro.key === eu ? 'me' : ''}">${i === 1 ? `<span class="crown">${ic('crown', 18)}</span>` : ''}${av(r.pro.nome, [52, 64, 48][i])}<span class="nm">${esc(r.pro.nome)}</span>
        <div class="step"><span class="posn">${[2, 1, 3][i]}º</span><span class="val num">${fmt(r[tk])}</span>${dvl(vr(r))}${ating(r) ? `<span class="sub">${ating(r)}</span>` : ''}</div></div>` : '<div></div>').join('')}</div>
      <section class="panel"><h3 class="h2">Classificação · ${esc(tl)}</h3><div class="rlist">
        ${ord.map((r, i) => `<div class="rrow ${i === 0 ? 'top1' : ''} ${r.pro.key === eu ? 'me' : ''}"><span class="rp">${i + 1}º${pv(r, i) ? `<i class="rpv">${pv(r, i)}</i>` : ''}</span>${av(r.pro.nome)}
          <div class="rn"><b>${esc(r.pro.nome)}${r.pro.key === eu ? '<span class="you">Você</span>' : ''}</b><small>${ating(r) ? ating(r) + ' · ' : ''}${int(r.atendimentos)} atendimentos · ticket ${brl(r.ticket)}</small></div>
          <span class="rv"><span class="num">${fmt(r[tk])}</span>${dvl(vr(r))}</span><div class="rb"><i style="width:${100 * n(r[tk]) / max}%"></i></div></div>`).join('')}
      </div></section>`);
    ligarFiltros(app);
    $$('[data-rt]').forEach(b => b.onclick = () => { rankTipo = b.dataset.rt; vRanking(); });
  }

  /* ---------- METAS (dono) ---------- */
  let metasMes = null;
  function vMetas() {
    const opcoes = []; let m = mesDe(addDays(mesAtual(), 40));
    for (let i = 0; i < 14; i++) { opcoes.push(m); m = mesDe(addDays(m, -1)); }
    metasMes = metasMes || mesAtual();
    const anterior = mesDe(addDays(metasMes, -1)), pad = metaLinha(PADRAO, metasMes) || {};
    const ROT = [['meta_cadeira', 'Meta da cadeira'], ['min_cadeira', 'Mínimo da cadeira'], ['min_produtos', 'Mínimo de produtos'], ['min_extras', 'Mínimo de extras']];
    shell(rotaAtual(), `<div class="page-head"><div><p class="eyebrow">Período: ${esc(mesLabel(metasMes))}</p><h1 class="h1">Metas individuais</h1></div>
      <div class="filters"><select id="m-mes" aria-label="Mês">${opcoes.map(o => `<option value="${o}" ${o === metasMes ? 'selected' : ''}>${mesLabel(o)}</option>`).join('')}</select>
      <button type="button" class="btn" id="m-barb">${ic('cash', 18)}Meta da barbearia</button></div></div>
      <p class="note">Você lança aqui a <b>meta</b> e os <b>mínimos</b> de cada profissional. O valor atual é calculado sozinho pela cadeira: meta e mínimo da cadeira pelo faturamento total (serviços + produtos + extras + assinaturas), mínimo de produtos pelos produtos e mínimo de extras pelos extras. A meta da barbearia é separada (Dashboard) e não usa nenhum destes valores.</p>
      <form class="stack" id="f-metas" style="display:grid;gap:18px">
        <section class="panel"><div class="panel-head"><h3 class="h2">Valores padrão</h3><button type="button" class="btn btn-sm" id="m-copiar">Copiar de ${esc(mesLabel(anterior))}</button></div>
          <div class="form-grid" data-k="${PADRAO}">${ROT.map(([c, l]) => `<label class="fld"><span>${l}</span><input name="${c}" inputmode="decimal" placeholder="0,00" value="${moneyIn(pad[c])}"></label>`).join('')}</div>
          <p class="dim sm" style="margin-top:10px">Valem para quem ficar com o campo em branco abaixo. Deixe 0 ou vazio para não usar.</p></section>
        <section class="panel"><h3 class="h2">Por profissional</h3>
          <div class="tbl-wrap"><table><thead><tr><th>Profissional</th>${ROT.map(([, l]) => `<th class="r">${l}</th>`).join('')}</tr></thead><tbody>
          ${pros().map(p => { const x = metaLinha(p.key, metasMes) || {}; return `<tr data-k="${esc(p.key)}"><td><b>${esc(p.nome)}</b></td>
            ${ROT.map(([c]) => `<td class="r"><input name="${c}" inputmode="decimal" placeholder="padrão" value="${moneyIn(x[c])}"></td>`).join('')}</tr>`; }).join('')}
          </tbody></table></div>
          <p class="dim sm" style="margin-top:10px">Em branco = usa o valor padrão. Preencha só para quem tem meta diferente.</p>
          <div class="modal-f"><button class="btn btn-acc">Salvar metas</button></div></section>
      </form>
      ${painelFechados()}`);
    ligarFechados();
    $('#m-mes').onchange = e => { metasMes = e.target.value; vMetas(); };
    $('#m-barb').onclick = () => editarMetaBarbearia(metasMes);
    $('#m-copiar').onclick = () => {
      $$('#f-metas [data-k]').forEach(el => { const x = metaLinha(el.dataset.k, anterior) || {}; $$('input', el).forEach(i => i.value = moneyIn(x[i.name])); });
      toast('Valores copiados. Confira e clique em Salvar.');
    };
    $('#f-metas').onsubmit = async e => {
      e.preventDefault(); const btn = e.target.querySelector('.btn-acc'); btn.disabled = true;
      try {
        const lin = $$('#f-metas [data-k]').map(el => { const o = { mes: metasMes, profissional: el.dataset.k }; $$('input', el).forEach(i => o[i.name] = money(i.value)); return o; });
        const r = await sb.from('metas_barbeiro').upsert(lin); if (r.error) throw r.error;
        await carregar(); toast('Metas salvas.', 'good'); vMetas();
      } catch (err) { toast('Erro ao salvar: ' + err.message, 'bad'); } finally { btn.disabled = false; }
    };
  }

  /* ---------- DIAS FECHADOS (feriados) ----------
     Dia cadastrado vale como domingo: sai da meta do dia, da meta da semana, das projeções e das médias por dia da semana.
     As assinaturas cobradas nesse dia continuam somando no faturamento do mês. */
  function pascoa(y) {   // algoritmo de Meeus (calendário gregoriano)
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return `${y}-${pad(mes)}-${pad(dia)}`;
  }
  function feriadosNacionais(y) {
    const p = pascoa(y);
    return [[`${y}-01-01`, 'Confraternização Universal'], [addDays(p, -48), 'Carnaval (segunda)'], [addDays(p, -47), 'Carnaval (terça)'], [addDays(p, -2), 'Sexta-feira Santa'],
      [`${y}-04-21`, 'Tiradentes'], [`${y}-05-01`, 'Dia do Trabalho'], [addDays(p, 60), 'Corpus Christi'], [`${y}-09-07`, 'Independência'], [`${y}-10-12`, 'Nossa Senhora Aparecida'],
      [`${y}-11-02`, 'Finados'], [`${y}-11-15`, 'Proclamação da República'], [`${y}-11-20`, 'Consciência Negra'], [`${y}-12-25`, 'Natal']];
  }
  function painelFechados() {
    const hoje = today(), ate = addDays(hoje, 366), y = +hoje.slice(0, 4);
    const sug = [...feriadosNacionais(y), ...feriadosNacionais(y + 1)].filter(([d]) => d >= hoje && d <= ate && !FECHADO.includes(parse(d).getDay()) && !feriado(d)).sort((a, b) => (a[0] < b[0] ? -1 : 1)).slice(0, 8);
    const cad = (S.fechados || []).filter(r => r.dia >= addDays(hoje, -90)).sort((a, b) => (a.dia < b.dia ? -1 : 1));
    const nomeDia = d => `${cap(DIAS_SEM[parse(d).getDay()])}, ${dBR(d)}`;
    return `<section class="panel"><div class="panel-head"><h3 class="h2">Dias fechados (feriados)</h3></div>
      <p class="dim sm" style="margin:-6px 0 14px">Marque os dias em que a barbearia <b>não abre</b>. Eles passam a valer como domingo: saem da meta do dia, da meta da semana e das projeções. As assinaturas cobradas nesses dias continuam no faturamento do mês. Feriado em que a barbearia abre <b>não</b> precisa ser marcado.</p>
      <div class="two" style="gap:18px">
        <div><h4 class="lbl" style="margin-bottom:8px">Cadastrados</h4>
          ${cad.length ? `<div class="tbl-wrap"><table><tbody>${cad.map(r => `<tr><td><b>${esc(nomeDia(r.dia))}</b><div class="dim sm">${esc(r.motivo || 'Feriado')}${r.dia < hoje ? ' · já passou' : ''}</div></td>
            <td class="r"><button class="btn btn-ghost btn-sm bad" data-delfech="${r.dia}" aria-label="Remover" title="Remover">${ic('trash', 16)}</button></td></tr>`).join('')}</tbody></table></div>`
            : '<p class="empty">Nenhum dia fechado cadastrado.</p>'}
          <form id="f-fech" class="form-grid" style="margin-top:14px">
            <label class="fld"><span>Dia</span><input name="dia" type="date" required min="${addDays(hoje, -90)}"></label>
            <label class="fld"><span>Motivo</span><input name="motivo" maxlength="60" placeholder="ex.: Feriado municipal"></label>
            <div class="full"><button class="btn btn-acc btn-sm">${ic('plus', 16)}Marcar dia fechado</button></div></form></div>
        <div><h4 class="lbl" style="margin-bottom:8px">Próximos feriados nacionais</h4>
          ${sug.length ? `<div class="tbl-wrap"><table><tbody>${sug.map(([d, nome]) => `<tr><td><b>${esc(nomeDia(d))}</b><div class="dim sm">${esc(nome)}</div></td>
            <td class="r"><button class="btn btn-sm" data-addfech="${d}" data-motivo="${esc(nome)}">Vai fechar</button></td></tr>`).join('')}</tbody></table></div>` : '<p class="empty">Nenhum feriado nacional pendente.</p>'}
          <p class="dim sm" style="margin-top:10px">Só marque se a barbearia realmente fechar. Feriados estaduais e municipais: use o formulário ao lado.</p></div></div></section>`;
  }
  async function salvarFechado(dia, motivo) {
    const { error } = await sb.from('dias_fechados').upsert({ dia, motivo: (motivo || '').trim() || 'Feriado' });
    if (error) throw new Error(/relation|does not exist|schema cache/i.test(error.message) ? 'Rode o arquivo 10_dias_fechados.sql no Supabase primeiro.' : error.message);
    await carregar(); render(); toast(`${dBR(dia)} marcado como fechado.`, 'good');
  }
  function ligarFechados() {
    const f = $('#f-fech'); if (!f) return;
    f.onsubmit = async e => { e.preventDefault(); const d = Object.fromEntries(new FormData(f)); if (!d.dia) return toast('Escolha o dia.', 'bad');
      try { await salvarFechado(d.dia, d.motivo); } catch (err) { toast(err.message, 'bad'); } };
    $$('[data-addfech]').forEach(b => b.onclick = async () => { b.disabled = true; try { await salvarFechado(b.dataset.addfech, b.dataset.motivo); } catch (err) { toast(err.message, 'bad'); b.disabled = false; } });
    $$('[data-delfech]').forEach(b => b.onclick = () => openModal('Remover dia fechado', `<p class="mut">Voltar a contar <b>${esc(dBR(b.dataset.delfech))}</b> como dia de funcionamento?</p>`,
      async () => { const { error } = await sb.from('dias_fechados').delete().eq('dia', b.dataset.delfech); if (error) throw error; await carregar(); render(); toast('Dia removido.', 'good'); }, 'Remover'));
  }

  /* ---------- EQUIPE (dono) ---------- */
  async function adminEquipe(body) {
    let res;
    try { res = await sb.functions.invoke('admin-equipe', { body }); } catch (e) { res = { error: e }; }
    const { data, error } = res;
    if (error) {
      let msg = error.message || String(error);
      try { const j = await error.context.json(); if (j && j.erro) msg = j.erro; } catch (_) { }
      if (/failed to send|fetch|not found|404/i.test(msg)) msg = 'A função "admin-equipe" não está publicada no Supabase (veja o passo a passo).';
      throw new Error(msg);
    }
    if (data && data.erro) throw new Error(data.erro);
    return data;
  }
  async function recarregarEquipe(msg) { await carregar(); render(); toast(msg, 'good'); }
  const fatCadeira = (key, mes) => { const r = key && S.mensal.find(x => x.mes === mes && x.profissional === key); return r ? n(r.servicos) + n(r.produtos) + n(r.extras) + n(r.assinaturas) : 0; };

  async function vEquipe() {
    if (!S.cultura) { try { await carregarCultura(); } catch (_) { S.cultura = null; } }
    const mes = S.mensal.some(r => r.mes === mesAtual()) ? mesAtual() : ((S.mensal[0] || {}).mes || mesAtual());
    const cult = S.cultura ? periodosCultura('').sel : null, mAnt = mesDe(addDays(mes, -1)), temAnt = S.mensal.some(r => r.mes === mAnt);
    const perE = { tipo: 'mes', mes }, antE = anterior(perE), jE = janelaAnt(perE), pjE = projecao(perE);
    const cultAnt = cult && !cult.camp ? (jE ? { inicio: jE.ini, fim: jE.fim } : { inicio: mAnt, fim: ultimoDia(mAnt) }) : null;   // cultura: compara com o mês anterior (em campanha, sem comparação)
    const ptsEm = (key, per) => S.cultura.oc.filter(o => o.profissional === key && o.data >= per.inicio && o.data <= per.fim).reduce((a, o) => a + n(o.pontos), 0);
    const porNome = (a, b) => a.nome.localeCompare(b.nome);
    const equipe = S.perfis.filter(p => p.role !== 'admin').sort(porNome), admins = S.perfis.filter(p => p.role === 'admin').sort(porNome);
    const ativos = equipe.filter(p => p.ativo).length;

    const card = p => {
      const fat = fatCadeira(p.profissional, mes), m = p.profissional && metaDe(p.profissional, mes), meta = m ? n(m.meta_cadeira) : 0;
      const pts = cult ? ptsEm(p.profissional, cult) : 0;
      const [, cl] = cult ? statusCultura(pts, cult.limite) : ['', ''];
      const rA = p.profissional && antE ? antE.find(r => r.pro.key === p.profissional) : null;
      const fatA = rA ? rA.total : (temAnt && p.profissional && !jE ? fatCadeira(p.profissional, mAnt) : null), mA = fatA !== null && metaDe(p.profissional, mAnt), metaA = mA ? n(mA.meta_cadeira) : 0;
      const lin = (l, v, h, cls = '') => `<dt>${l}</dt><dd><span class="${cls}">${v}</span>${dvl(h)}</dd>`;
      return `<article class="pcard ecard ${p.ativo ? '' : 'off'}"><div class="pcard-h">${av(p.nome, 52)}<div style="min-width:0;flex:1"><b>${esc(p.nome)}</b>
          <small>${esc(p.cargo || 'Barbeiro')} · Cadeira ${p.cadeira || '—'} · @${esc(p.login)}${p.folga ? ` · folga ${DIAS_SEM[p.folga].slice(0, 3)}` : ''}</small></div><span class="pill ${p.ativo ? 'ok' : 'no'}">${p.ativo ? 'Ativo' : 'Inativo'}</span></div>
        ${p.profissional ? '' : '<p class="sm warn" style="margin:0">Sem ligação com o sistema — clique em Editar.</p>'}
        <dl class="kv ekv">${lin('Faturamento da cadeira', brl(fat), dv(fat, fatA))}${lin('Meta', meta ? pct(100 * fat / meta) : '—', meta && metaA ? dv(100 * fat / meta, 100 * fatA / metaA, { pp: true }) : '')}
          ${(() => { const pr = projDe(pjE, p.profissional); if (!pr || !p.ativo) return ''; const sp = sitProj(pr.total, pr.lo, pr.hi, meta);
            return `<dt>Projeção do mês</dt><dd title="Faixa provável: ${milhar(pr.lo)} a ${milhar(pr.hi)}"><span class="${sp ? sp[1] : ''}">${brl(pr.total)}</span>${meta ? `<div class="dvl dim sm">${pct(100 * pr.total / meta, 0)} da meta</div>` : ''}</dd>`; })()}
          ${lin('Cultura (menor é melhor)', cult ? `${pts}/${cult.limite}` : '—', cultAnt && p.profissional ? dv(pts, ptsEm(p.profissional, cultAnt), { abs: true, inv: true, suf: ' pts', fmt: v => v + ' pts' }) : '', cl)}</dl>
        <div class="eacts"><div class="row"><button class="btn btn-sm" data-perfil="${p.id}">${ic('eye', 17)}Perfil</button><button class="btn btn-sm" data-ed="${p.id}">${ic('edit', 17)}Editar</button></div>
          <button class="btn btn-ghost btn-sm" data-senha="${p.id}">${ic('user', 17)}Redefinir senha</button>
          <div class="row"><button class="btn btn-ghost btn-sm" data-ativo="${p.id}">${ic('power', 17)}${p.ativo ? 'Desativar' : 'Ativar'}</button><button class="btn btn-ghost btn-sm bad" data-del="${p.id}" aria-label="Excluir acesso" title="Excluir acesso">${ic('trash', 17)}</button></div></div></article>`;
    };

    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">${ativos} ${ativos === 1 ? 'ativo' : 'ativos'}</p><h1 class="h1">Equipe</h1></div>
        <button class="btn btn-acc" id="eq-novo">${ic('plus', 18)}Cadastrar profissional</button></div>
      ${legendaVar({ tipo: 'mes', mes })}
      <div class="cards">${equipe.map(card).join('') || '<p class="empty">Nenhum profissional cadastrado.</p>'}</div>
      <section class="panel"><h3 class="h2">Administradores</h3><div class="hlist">
        ${admins.map(p => `<div class="hrow">${av(p.nome, 40)}<div class="hmid"><b>${esc(p.nome)}${p.id === S.me.id ? ' <span class="dim sm">(você)</span>' : ''}</b><small class="dim">@${esc(p.login)} · ${esc(p.cargo || 'Administrador')}${p.ativo ? '' : ' · <span class="bad">inativo</span>'}</small></div>
          <div class="hact">${p.id === S.me.id ? '' : `<button class="btn btn-ghost btn-sm" data-senha="${p.id}" title="Redefinir senha" aria-label="Redefinir senha">${ic('user', 17)}</button>`}<button class="btn btn-sm" data-ed="${p.id}" title="Editar" aria-label="Editar">${ic('edit', 17)}</button></div></div>`).join('')}</div></section>`);

    const acha = id => S.perfis.find(x => x.id === id);
    $('#eq-novo').onclick = () => formPerfil(null);
    $$('[data-ed]').forEach(b => b.onclick = () => formPerfil(acha(b.dataset.ed)));
    $$('[data-perfil]').forEach(b => b.onclick = () => verPerfil(acha(b.dataset.perfil), mes, cult));
    $$('[data-senha]').forEach(b => b.onclick = () => redefinirSenha(acha(b.dataset.senha)));
    $$('[data-ativo]').forEach(b => b.onclick = () => alternarAtivo(acha(b.dataset.ativo)));
    $$('[data-del]').forEach(b => b.onclick = () => excluirPerfil(acha(b.dataset.del)));
  }

  function formPerfil(p) {
    const novo = !p; p = p || { role: 'pro', cargo: 'Barbeiro', ativo: true };
    const nomesCB = [...new Set([...S.mensal.map(r => r.profissional), ...S.perfis.map(x => x.profissional)].filter(Boolean))].sort();
    const usados = new Set(S.perfis.filter(x => x.id !== p.id && x.ativo).map(x => x.profissional));
    const f = openModal(novo ? 'Cadastrar profissional' : 'Editar ' + (p.role === 'admin' ? 'administrador' : 'profissional'), `<div class="form-grid">
      <label class="fld full"><span>Nome</span><input name="nome" value="${esc(p.nome || '')}" maxlength="60" required placeholder="ex.: Rafael Monteiro"></label>
      ${novo ? `<label class="fld"><span>Login</span><input name="login" autocapitalize="none" autocomplete="off" maxlength="30" required placeholder="ex.: rafael"></label>
        <label class="fld"><span>Senha inicial</span><input name="senha" type="password" autocomplete="new-password" minlength="8" required placeholder="mín. 8 caracteres"></label>`
        : `<p class="full sm mut" style="margin:0">Login: <b>@${esc(p.login)}</b> (não muda)</p>`}
      <label class="fld"><span>Cargo</span><input name="cargo" value="${esc(p.cargo || '')}" maxlength="40"></label>
      <label class="fld"><span>Cadeira nº</span><input name="cadeira" type="number" min="1" max="50" value="${esc(p.cadeira || '')}"></label>
      ${p.role !== 'admin' ? (() => { const det = folgaDetectada(p.profissional); return `<label class="fld full"><span>Folga semanal</span><select name="folga"><option value="">— sem folga fixa —</option>
        ${[1, 2, 3, 4, 5, 6].map(d => `<option value="${d}" ${+p.folga === d ? 'selected' : ''}>${cap(DIAS_SEM[d])}${det === d ? ' (pelos atendimentos)' : ''}</option>`).join('')}</select>
        <small class="dim">${det ? `Pelos atendimentos das últimas 8 semanas, a folga parece ser <b>${DIAS_SEM[det]}</b>.` : 'Usada na projeção do mês. Domingo a barbearia já não abre.'}</small></label>`; })() : ''}
      <label class="fld full"><span>Nome no sistema</span><select name="profissional"><option value="">— nenhum (fora do faturamento e ranking) —</option>
        ${nomesCB.map(k => `<option value="${esc(k)}" ${k === p.profissional ? 'selected' : ''}>${esc(k)}${usados.has(k) ? ' (já ligado a outra pessoa)' : ''}</option>`).join('')}</select></label>
      <label class="fld full"><span>Nível de acesso</span><select name="role"><option value="pro" ${p.role !== 'admin' ? 'selected' : ''}>Profissional (vê só os próprios números)</option><option value="admin" ${p.role === 'admin' ? 'selected' : ''}>Administrador (vê e edita tudo)</option></select></label>
      ${novo ? `<p class="full note" style="margin:0">A pessoa entra com o login e a senha inicial e pode trocar a senha no próprio painel.</p>` : ''}</div>`,
      async d => {
        const reg = { nome: (d.nome || '').trim(), cargo: (d.cargo || '').trim() || 'Barbeiro', cadeira: Math.round(n(d.cadeira)) || null, profissional: d.profissional || null, role: d.role === 'admin' ? 'admin' : 'pro' };
        if ('folga' in d) reg.folga = +d.folga || null;
        if (!reg.nome) throw new Error('Informe o nome.');
        if (novo) {
          const login = (d.login || '').trim().toLowerCase();
          if (!/^[a-z0-9._-]{2,30}$/.test(login)) throw new Error('Login: só letras minúsculas, números, ponto ou traço (sem espaço).');
          if (S.perfis.some(x => x.login === login)) throw new Error('Já existe alguém com esse login.');
          if ((d.senha || '').length < 8) throw new Error('A senha inicial precisa ter pelo menos 8 caracteres.');
          const { folga, ...semFolga } = reg;
          const novoId = await adminEquipe({ acao: 'criar', login, senha: d.senha, ...semFolga });
          if (folga && novoId && novoId.id) await sb.from('perfis').update({ folga }).eq('id', novoId.id);
          await recarregarEquipe(`${reg.nome} cadastrado. Login: ${login}`);
        } else {
          if (p.id === S.me.id && reg.role !== 'admin') throw new Error('Você não pode tirar o seu próprio acesso de administrador.');
          const { error } = await sb.from('perfis').update(reg).eq('id', p.id); if (error) throw error;
          await recarregarEquipe('Cadastro atualizado.');
        }
      }, novo ? 'Cadastrar' : 'Salvar');
    if (novo) {
      const nome = f.querySelector('[name=nome]'), login = f.querySelector('[name=login]'); let mexeu = false;
      login.oninput = () => { mexeu = true; };
      nome.oninput = () => { if (!mexeu) login.value = (nome.value.trim().split(/\s+/)[0] || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9._-]/g, ''); };
    }
  }
  function verPerfil(p, mes, cult) {
    const r = S.mensal.find(x => x.mes === mes && x.profissional === p.profissional) || {};
    const fat = fatCadeira(p.profissional, mes), m = p.profissional && metaDe(p.profissional, mes) || {}, at = n(r.atendimentos);
    const oc = S.cultura ? S.cultura.oc.filter(o => o.profissional === p.profissional) : [];
    const pts = cult ? oc.filter(o => o.data >= cult.inicio && o.data <= cult.fim).reduce((a, o) => a + n(o.pontos), 0) : 0;
    const linha = (l, v) => `<dt>${l}</dt><dd>${v}</dd>`;
    openModal(p.nome, `<div class="pcard-h" style="margin-bottom:14px">${av(p.nome, 52)}<div><b>${esc(p.nome)}</b><small class="dim">${esc(p.cargo || 'Barbeiro')} · Cadeira ${p.cadeira || '—'} · @${esc(p.login)} · ${p.ativo ? 'ativo' : 'inativo'}</small></div></div>
      <h4 class="lbl" style="margin:0 0 8px">${esc(mesLabel(mes))}</h4>
      <dl class="kv">${linha('Serviços', brl(r.servicos))}${linha('Produtos', brl(r.produtos))}${linha('Extras / procedimentos', brl(r.extras))}${linha('Assinaturas', brl(r.assinaturas))}
        <dt class="tot">Total da cadeira</dt><dd class="tot">${brl(fat)}</dd>${linha('Clientes', int(at))}${linha('Ticket médio', brl(at ? fat / at : 0))}
        ${linha('Meta', n(m.meta_cadeira) ? `${brl(m.meta_cadeira)} · ${pct(100 * fat / n(m.meta_cadeira))}` : '—')}
        ${linha('Mín. produtos', n(m.min_produtos) ? brl(m.min_produtos) : '—')}${linha('Mín. extras', n(m.min_extras) ? brl(m.min_extras) : '—')}
        ${cult ? linha('Cultura (menor é melhor)', `${pts}/${cult.limite}`) : ''}</dl>
      ${oc.length ? `<h4 class="lbl" style="margin:16px 0 4px">Últimas ocorrências</h4><div class="hlist">${oc.slice(0, 4).map(o => `<div class="hrow"><span class="hpts num">+${n(o.pontos)}</span><div class="hmid"><b>${esc(o.categoria)}</b><p>“${esc(o.descricao)}”</p><small class="dim">${dm(o.data)}</small></div></div>`).join('')}</div>` : ''}`, null);
  }
  function redefinirSenha(p) {
    openModal('Redefinir senha', `<div class="form-grid"><p class="full mut sm" style="margin:0">Nova senha para <b>${esc(p.nome)}</b> (@${esc(p.login)}). Passe para a pessoa pessoalmente; ela pode trocar depois no painel.</p>
      <label class="fld full"><span>Nova senha</span><input name="nova" type="password" minlength="8" autocomplete="new-password" required></label>
      <label class="fld full"><span>Repita a nova senha</span><input name="rep" type="password" autocomplete="new-password" required></label></div>`,
      async d => {
        if ((d.nova || '').length < 8) throw new Error('A senha precisa ter pelo menos 8 caracteres.');
        if (d.nova !== d.rep) throw new Error('As senhas não conferem.');
        await adminEquipe({ acao: 'senha', id: p.id, senha: d.nova });
        toast('Senha redefinida.', 'good');
      }, 'Redefinir');
  }
  function alternarAtivo(p) {
    if (p.id === S.me.id) return toast('Você não pode desativar o seu próprio acesso.', 'bad');
    const ativar = !p.ativo;
    openModal(ativar ? 'Ativar acesso' : 'Desativar acesso', `<p class="mut">${ativar
        ? `<b>${esc(p.nome)}</b> volta a entrar no painel e a aparecer no faturamento e ranking.`
        : `<b>${esc(p.nome)}</b> deixa de entrar no painel e sai do faturamento e ranking. O histórico continua guardado e dá para reativar depois.`}</p>`,
      async () => { const { error } = await sb.from('perfis').update({ ativo: ativar }).eq('id', p.id); if (error) throw error; await recarregarEquipe(ativar ? 'Acesso ativado.' : 'Acesso desativado.'); },
      ativar ? 'Ativar' : 'Desativar');
  }
  function excluirPerfil(p) {
    if (p.id === S.me.id) return toast('Você não pode excluir o seu próprio acesso.', 'bad');
    openModal('Excluir acesso', `<p class="mut">Excluir o acesso de <b>${esc(p.nome)}</b> (@${esc(p.login)})? O login deixa de existir. Faturamento e ocorrências de cultura continuam guardados.</p>
      <p class="note" style="margin-top:10px">Se for só um afastamento, prefira <b>Desativar</b>.</p>`,
      async () => { await adminEquipe({ acao: 'excluir', id: p.id }); await recarregarEquipe('Acesso excluído.'); }, 'Excluir');
  }

  /* ---------- RELATÓRIOS (histórico mês a mês) ---------- */
  let relMeses = 6;
  const brl0 = v => n(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const mesCurto = m => { const d = parse(m); return `${MESES[d.getMonth()].slice(0, 3)}/${String(d.getFullYear()).slice(2)}`; };
  function vRelatorios() {
    const todosMeses = [...new Set([...S.resultado.map(r => r.mes), ...S.metasBarbearia.map(r => r.mes), ...S.mensal.map(r => r.mes)])].sort().reverse();
    const meses = todosMeses.slice(0, relMeses).reverse();   // do mais antigo ao mais novo (gráfico e tabela)
    // cadeiras: todos os perfis ligados ao sistema (inclusive inativos, para manter o histórico)
    const cad = S.perfis.filter(p => p.profissional).map(p => ({ key: p.profissional, nome: p.nome, ativo: p.ativo })).sort((a, b) => a.nome.localeCompare(b.nome));
    const val = (key, m) => fatCadeira(key, m);

    const linhasRes = todosMeses.slice(0, Math.max(relMeses, 6)).map(m => {
      const r = S.resultado.find(x => x.mes === m), meta = n((S.metasBarbearia.find(x => x.mes === m) || {}).meta), fat = r ? n(r.faturamento_total) : 0;
      const p = meta ? 100 * fat / meta : 0, dif = fat - meta;
      return `<tr><td>${esc(mesLabel(m))}${m === mesAtual() ? ' <span class="pill acc">em andamento</span>' : ''}</td><td class="r"><b>${r ? brl(fat) : '—'}</b></td>
        ${meta ? `<td class="r">${brl(meta)}</td><td class="r ${p >= 100 ? 'good' : ''}">${pct(p)}</td><td class="r ${dif < 0 ? '' : 'good'}">${dif < 0 ? '-' : ''}${brl(Math.abs(dif))}</td>
          <td class="r nowrap"><button class="btn btn-ghost btn-sm" data-meta="${m}" aria-label="Editar meta" title="Editar meta">${ic('edit', 16)}</button><button class="btn btn-ghost btn-sm bad" data-delmeta="${m}" aria-label="Apagar meta" title="Apagar meta">${ic('trash', 16)}</button></td>`
        : `<td class="r dim" colspan="3">meta não lançada</td><td class="r"><button class="btn btn-ghost btn-sm" data-meta="${m}" aria-label="Lançar meta" title="Lançar meta">${ic('plus', 16)}</button></td>`}</tr>`;
    }).join('');

    shell(rotaAtual(), `
      <div class="page-head"><div><p class="eyebrow">Histórico de performance</p><h1 class="h1">Relatórios</h1></div>
        <div class="filters"><div class="chips">${[6, 12].map(k => `<button class="chip ${relMeses === k ? 'on' : ''}" data-rm="${k}">${k} meses</button>`).join('')}</div>
        <button class="btn" id="rel-csv">${ic('down', 18)}Exportar (CSV)</button></div></div>
      ${painelPPT()}
      <section class="panel"><div class="panel-head"><h3 class="h2">Resultado da barbearia por mês</h3></div>
        <div class="tbl-wrap"><table><thead><tr><th>Mês</th><th class="r">Faturamento</th><th class="r">Meta</th><th class="r">Atingimento</th><th class="r">Faltou / sobrou</th><th></th></tr></thead>
        <tbody>${linhasRes || '<tr><td colspan="6" class="empty">Sem dados ainda.</td></tr>'}</tbody></table></div>
        <p class="dim sm" style="margin-top:10px">Faturamento total do sistema (comandas + assinaturas), atualizado automaticamente. A meta é lançada por você.</p></section>
      <section class="panel"><h3 class="h2">Faturamento das cadeiras · comparativo entre meses</h3><div class="chart tall"><canvas id="c-rel"></canvas></div></section>
      <section class="panel"><h3 class="h2">Faturamento das cadeiras por mês</h3>
        <div class="tbl-wrap"><table><thead><tr><th>Profissional</th>${meses.map(m => `<th class="r">${mesCurto(m)}</th>`).join('')}</tr></thead><tbody>
        ${cad.map(c => `<tr><td>${esc(c.nome)}${c.ativo ? '' : ' <span class="dim sm">(inativo)</span>'}</td>${meses.map(m => `<td class="r">${brl0(val(c.key, m))}</td>`).join('')}</tr>`).join('')}
        </tbody><tfoot><tr><td>Soma das cadeiras</td>${meses.map(m => `<td class="r">${brl0(cad.reduce((a, c) => a + val(c.key, m), 0))}</td>`).join('')}</tr></tfoot></table></div>
        <p class="dim sm" style="margin-top:10px">Faturamento da cadeira = serviços + produtos + extras + assinaturas.</p></section>`);

    $$('[data-rm]').forEach(b => b.onclick = () => { relMeses = +b.dataset.rm; render(); });
    $$('[data-meta]').forEach(b => b.onclick = () => editarMetaBarbearia(b.dataset.meta));
    $$('[data-delmeta]').forEach(b => b.onclick = () => openModal('Apagar meta', `<p class="mut">Apagar a meta da barbearia de <b>${esc(mesLabel(b.dataset.delmeta))}</b>? O faturamento não muda.</p>`,
      async () => { const { error } = await sb.from('metas_barbearia').delete().eq('mes', b.dataset.delmeta); if (error) throw error; await carregar(); render(); toast('Meta apagada.', 'good'); }, 'Apagar'));
    $('#rel-csv').onclick = () => exportarCSV(cad, todosMeses);
    $$('[data-ppt]').forEach(b => b.onclick = () => { pptTipo = b.dataset.ppt; render(); });
    $('#ppt-ref').onchange = e => { pptRef[pptTipo] = e.target.value; };
    $('#ppt-go').onclick = () => exportarPPT(pptTipo, $('#ppt-ref').value);
    $('#ppt-gs').onclick = () => exportarSlides(pptTipo, $('#ppt-ref').value);
    preCarregarGoogle();
    chart('c-rel', { type: 'bar', data: { labels: meses.map(mesCurto), datasets: cad.map((c, i) => ({ label: c.nome, data: meses.map(m => +val(c.key, m).toFixed(2)), backgroundColor: PRO_COLORS[i % PRO_COLORS.length], borderRadius: 4, maxBarThickness: 34 })) },
      options: { plugins: { legend: { position: 'bottom' } }, scales: { y: eixoBRL, x: { grid: { display: false } } } } });
  }
  function exportarCSV(cad, meses) {
    const num = v => n(v).toFixed(2).replace('.', ',');
    const cel = v => /[;"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v);
    const linhas = [['mes', 'profissional', 'nome_sistema', 'servicos', 'produtos', 'extras', 'assinaturas', 'total_cadeira', 'atendimentos', 'meta_cadeira', 'faturamento_barbearia', 'meta_barbearia']];
    [...meses].sort().forEach(m => {
      const r = S.resultado.find(x => x.mes === m) || {}, mb = n((S.metasBarbearia.find(x => x.mes === m) || {}).meta);
      cad.forEach(c => { const x = S.mensal.find(y => y.mes === m && y.profissional === c.key); if (!x) return; const mt = metaDe(c.key, m);
        linhas.push([m, c.nome, c.key, num(x.servicos), num(x.produtos), num(x.extras), num(x.assinaturas), num(fatCadeira(c.key, m)), int(x.atendimentos), num(mt ? mt.meta_cadeira : 0), num(r.faturamento_total), num(mb)]); });
    });
    const csv = '﻿' + linhas.map(l => l.map(cel).join(';')).join('\r\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `barbearia-demo-relatorio-${today()}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
    toast('Relatório exportado.', 'good');
  }

  /* ---------- FECHAMENTO EM APRESENTAÇÃO (diário e semanal: 11 slides · mensal: 12 slides; PowerPoint ou Google Slides) ----------
     Monta os números com as MESMAS funções das telas (Dashboard, Vendas, Clube, Cultura) e entrega
     para o relatorio-ppt.js desenhar os slides. A biblioteca (pptxgen.bundle.js) só carrega no clique. */
  let pptTipo = 'semana', pptRef = { dia: null, semana: null, mes: null };
  const carregarScript = src => new Promise((ok, erro) => {
    if (document.querySelector(`script[data-src="${src}"]`)) return ok();
    const s = document.createElement('script'); s.src = src; s.dataset.src = src; s.onload = ok; s.onerror = () => erro(new Error('Não foi possível carregar ' + src)); document.head.appendChild(s);
  });
  async function imagemBase64(url) {
    try { const b = await (await fetch(url)).blob(); return await new Promise(ok => { const r = new FileReader(); r.onload = () => ok(r.result); r.readAsDataURL(b); }); } catch (e) { return null; }
  }
  const varPct = (a, b) => b === null || b === undefined || !n(b) ? null : 100 * (n(a) - n(b)) / Math.abs(n(b));
  async function montarFechamento(tipo, ref) {
    const per = tipo === 'mes' ? { tipo: 'mes', mes: ref } : tipo === 'dia' ? { tipo: 'dia', dia: ref } : { tipo: 'semana', semana: ref };
    const ini = ref, fim = tipo === 'mes' ? ultimoDia(ref) : tipo === 'dia' ? ref : addDays(ref, 6), hoje = today();
    const salvo = S.per; S.per = { ...S.per, ...per };
    try { if (tipo === 'dia') await garantirDia(ref); else await garantirJanelas(); } finally { S.per = salvo; }
    await garantirHoras(addDays(ini, tipo === 'mes' ? -63 : -70), fim < hoje ? fim : hoje);
    if (!S.cultura) { try { await carregarCultura(); } catch (e) { console.warn('cultura indisponível', e); } }

    // o dono fica fora das apresentações (pelo nome no sistema, ou perfil administrador ligado a um nome): cadeiras, ranking, metas,
    // vendas, cultura e participação no pote. Os totais da barbearia (faturamento, comandas, assinaturas, clube) continuam completos.
    const fora = CFG.foraDasApresentacoes || ['Marcos Tavares Nogueira'];   // nome no sistema de quem não entra (o dono)
    const ehDono = key => fora.includes(key) || S.perfis.some(p => p.profissional === key && p.role === 'admin');
    const rowsAll = linhas(per), antAll = anterior(per), rows = rowsAll.filter(r => !ehDono(r.pro.key)), ant = antAll ? antAll.filter(r => !ehDono(r.pro.key)) : antAll;
    const modo = modoAnt(per), fr = fracAnt(per), j = janelaAnt(per);
    const anda = hoje >= ini && hoje <= fim, pj = tipo === 'dia' ? projDia(per) : projecao(per);
    const doPer = { mes: 'do mês', semana: 'da semana', dia: 'do dia' }[tipo];
    const ref0 = dataRef(), at = S.atualizado ? new Date(S.atualizado) : null;
    const atTxt = at ? `${dm(iso(at))} às ${pad(at.getHours())}h${pad(at.getMinutes())}` : '';

    // ---- barbearia
    let barb, hist, compara;
    if (tipo === 'mes') {
      const res = S.resultado.find(r => r.mes === ref) || {}, fat = n(res.faturamento_total), meta = metaMesBarbearia(ref);
      const mAnt = perAnt(per).mes, resAnt = S.resultado.find(r => r.mes === mAnt), jA = janelaDe(per);
      const fatAnt = !resAnt ? null : !fr ? n(resAnt.faturamento_total) : (jA && jA.res ? n(jA.res.faturamento_total) : n(resAnt.faturamento_total) * fr.f);
      const pt = anda ? projTotalMes(ref) : null;
      barb = { fat, ant: fatAnt, meta, comandas: n(res.comandas), assinaturas: n(res.assinaturas),
        proj: pt ? { total: pt, lo: pt * (1 - pj.bandaB), hi: pt * (1 + pj.bandaB) } : null,
        porDia: meta && pj && pj.abertos && fat < meta ? (meta - fat) / pj.abertos : 0, diasRest: pj ? pj.abertos : 0 };
      compara = !resAnt ? '' : fr ? (jA && jA.res ? `${mesLabel(mAnt)} · mesmos dias (${dm(j.ini)} a ${dm(j.fim)})` : `${mesLabel(mAnt)} · proporcional a ${fr.dias} dias`) : mesLabel(mAnt);
      const ms = [...new Set(S.resultado.map(r => r.mes))].filter(m => m <= ref).sort().slice(-6);
      hist = ms.map(m => { const r = S.resultado.find(x => x.mes === m) || {}; return { rot: cap(MES_CURTO[parse(m).getMonth()]) + (m === mesAtual() ? '*' : ''), fat: n(r.faturamento_total), meta: metaMesBarbearia(m) }; });
    } else if (tipo === 'dia') {
      const r0 = resDia(ref), pa = perAnt(per).dia, cut = corteDia(per), rA = resDia(pa, cut && cut !== '00:00' ? cut : undefined), md = metaDiaBarbearia(ref);
      barb = { fat: r0.total, ant: cut === '00:00' ? null : rA.total, meta: md && !md.fechado ? md.valor : 0, comandas: r0.comandas, assinaturas: r0.assinaturas, qtd: r0.qtd,
        proj: pj ? { total: pj.total, lo: pj.lo, hi: pj.hi } : null, porDia: 0, diasRest: 0, antDia: pa };
      compara = `${diaCurto(pa)}${cut && cut !== '00:00' ? ' até as ' + horaTxt(cut) : ''}`;
      hist = []; for (let k = 5; k >= 0; k--) { const x = addDays(ref, -7 * k); hist.push({ rot: dm(x) + (k === 0 && anda ? '*' : ''), fat: somaH(x), meta: k === 0 ? barb.meta : null }); }
    } else {
      const r0 = resSemana(ref), ms = metaSemanaBarbearia(ref), ps = projSemana(ref);
      barb = { fat: r0.total, ant: r0.ant, meta: ms ? ms.valor : 0, comandas: r0.comandas, assinaturas: r0.assinaturas, proj: ps ? { total: ps.total, lo: ps.lo, hi: ps.hi } : null, porDia: 0, diasRest: 0 };
      if (anda && barb.meta && barb.fat < barb.meta) { let d = 0; for (let x = hoje; x <= fim; x = addDays(x, 1)) if (aberto(x)) d++; barb.diasRest = d; barb.porDia = d ? (barb.meta - barb.fat) / d : 0; }
      const hojeTxt = r0.anda ? `${DIAS_CURTO[parse(hoje).getDay()]}${r0.cut && r0.cut !== '00:00' ? ' ' + horaTxt(r0.cut) : ''}` : '';
      compara = `semana ${semanaLabel(addDays(ref, -7))}${r0.anda ? ' · até ' + hojeTxt : ''}`;
      hist = [];
      for (let k = 5; k >= 0; k--) { const s = addDays(ref, -7 * k); let t = 0; for (let x = s; x <= addDays(s, 6) && x <= hoje; x = addDays(x, 1)) t += somaH(x); hist.push({ rot: dm(s) + (k === 0 && anda ? '*' : ''), fat: t, meta: k === 0 ? barb.meta : null }); }
    }

    // ---- cadeiras
    const ordAnt = ordem(ant, 'total');
    const cad = [...rows].filter(r => r.total > 0 || n(r.atendimentos) > 0).sort((a, b) => b.total - a.total).map((r, i) => {
      const ra = doPro(ant, r.pro.key), m = tipo === 'mes' ? (metaDe(r.pro.key, ref) || {}) : {}, pr = projDe(pj, r.pro.key);
      return { nome: r.pro.nome, total: r.total, ant: ra ? ra.total : null, servicos: r.servicos, produtos: r.produtos, extras: r.extras, assinaturas: r.assinaturas,
        vendas: r.vendas, vendasAnt: ra ? ra.vendas : null, atend: n(r.atendimentos), atendAnt: ra ? n(ra.atendimentos) : null, ticket: r.ticket, ticketAnt: ra ? ra.ticket : null,
        meta: n(m.meta_cadeira), minCad: n(m.min_cadeira), minProd: n(m.min_produtos), minExtras: n(m.min_extras),
        proj: pr ? pr.total : null, pos: i + 1, posAnt: ra && ra.total > 0 ? posDe(ordAnt, r.pro.key) || null : null,
        part: n(r.participacao_pct), assAnt: ra ? ra.assinaturas : null, comissao: n(r.comissao_pote), atendClube: n(r.atendimentos_clube) };
    });

    // ---- itens vendidos (produtos e extras)
    const itens = {};
    for (const cat of ['cosmetico', 'servico_extra']) {
      try {
        let qy = sb.from('vendas_itens').select('*').eq('categoria', cat);
        qy = tipo === 'dia' ? sb.from('vendas_itens_dia').select('*').eq('categoria', cat).eq('dia', ref) : tipo === 'mes' ? qy.eq('mes', ref) : qy.eq('semana', ref);
        const data = await q(qy.limit(3000)), ag = {};
        data.forEach(r => { const a = ag[r.item] = ag[r.item] || { item: r.item, q: 0, v: 0, por: {} }; a.q += n(r.quantidade); a.v += n(r.valor); a.por[r.profissional] = (a.por[r.profissional] || 0) + n(r.valor); });
        itens[cat] = Object.values(ag).map(x => { const top = Object.entries(x.por).filter(([k]) => !ehDono(k)).sort((a, b) => b[1] - a[1])[0]; return { item: x.item, q: x.q, v: x.v, quem: top ? nomeDe(top[0]) : '' }; })
          .sort((a, b) => b.v - a.v || b.q - a.q);
      } catch (e) { console.warn('vendas_itens', e); itens[cat] = []; }
    }
    const somaR = (rs, k) => rs ? soma(rs, k) : null, porAt = rs => rs && soma(rs, 'atendimentos') ? soma(rs, 'vendas') / soma(rs, 'atendimentos') : null;
    const vendas = { produtos: soma(rows, 'produtos'), extras: soma(rows, 'extras'), prodAnt: somaR(ant, 'produtos'), extAnt: somaR(ant, 'extras'),
      porAt: porAt(rows), porAtAnt: porAt(ant), topProd: (itens.cosmetico || []).slice(0, 5), topExtras: (itens.servico_extra || []).slice(0, 5),
      qtdProd: (itens.cosmetico || []).reduce((a, x) => a + x.q, 0), qtdExtras: (itens.servico_extra || []).reduce((a, x) => a + x.q, 0) };

    // ---- clube
    const potePct = CFG.percentualPote || .45, ass = soma(rowsAll, 'assinaturas'), atC = soma(rowsAll, 'atendimentos_clube');
    const clube = { fat: ass, ant: somaR(antAll, 'assinaturas'), potePct, pote: ass * potePct, atend: atC, atendAnt: somaR(antAll, 'atendimentos_clube'),
      porAtend: atC ? ass / atC : 0, linhas: [...cad].filter(c => c.part > 0 || c.assinaturas > 0).sort((a, b) => b.part - a.part).map(c => ({ nome: c.nome, part: c.part, fat: c.assinaturas, comissao: c.comissao, atend: c.atendClube, ant: c.assAnt })) };

    // ---- cultura (pontuação acumulada no mês/campanha até o fim do período)
    let cultura = null;
    if (S.cultura) {
      const C = S.cultura, alvo = fim < hoje ? fim : hoje, { todos } = periodosCultura();
      const sel = C.camps.length && todos.find(t => t.camp && t.inicio <= alvo && t.fim >= alvo) || { nome: mesLabel(mesDe(alvo)), inicio: mesDe(alvo), fim: ultimoDia(mesDe(alvo)), limite: C.limitePadrao, camp: null };
      const oc = C.oc.filter(o => o.data >= sel.inicio && o.data <= alvo && !ehDono(o.profissional)), noPer = oc.filter(o => o.data >= ini && o.data <= fim);
      const lst = pros().filter(p => !ehDono(p.key)).map(p => { const os = oc.filter(o => o.profissional === p.key); return { nome: p.nome, pts: os.reduce((a, o) => a + n(o.pontos), 0), qtd: os.length, noPer: noPer.filter(o => o.profissional === p.key).reduce((a, o) => a + n(o.pontos), 0) }; })
        .sort((a, b) => a.pts - b.pts || a.nome.localeCompare(b.nome));
      const porCat = Object.values(oc.reduce((a, o) => { const c = a[o.categoria] || (a[o.categoria] = { nome: o.categoria, qtd: 0, pts: 0 }); c.qtd++; c.pts += n(o.pontos); return a; }, {})).sort((a, b) => b.pts - a.pts).slice(0, 4);
      cultura = { nome: sel.camp ? 'Campanha ' + sel.nome : sel.nome, limite: n(sel.limite) || 20, ate: dm(alvo), linhas: lst, porCat, ocPer: noPer.length, ptsPer: noPer.reduce((a, o) => a + n(o.pontos), 0) };
    }

    // ---- dia a dia (comandas por dia; semana: contra o mesmo dia da semana anterior · mês: cada dia + média por dia da semana)
    const limDia = anda ? hoje : fim, temH = S.horas && !S.horas.erro;
    const dias = [];
    if (temH && tipo !== 'dia') for (let x = ini; x <= fim; x = addDays(x, 1)) {
      if (parse(x).getDay() === 0 && !somaH(x, { tipo: 'Comanda' })) continue;   // domingo fechado sai do gráfico
      const xa = tipo === 'mes' ? null : addDays(x, -7), fut = x > limDia;
      dias.push({ d: x, rot: tipo === 'mes' ? dm(x).slice(0, 2) : DIAS_CURTO[parse(x).getDay()] + ' ' + dm(x), fut, fechado: feriado(x) ? S.fechMap[x] : '',
        comandas: fut ? 0 : somaH(x, { tipo: 'Comanda' }), total: fut ? 0 : somaH(x), qtd: fut ? 0 : somaH(x, { tipo: 'Comanda', qtd: true }),
        ant: xa ? somaH(xa, { tipo: 'Comanda' }) : null, antTot: xa ? somaH(xa) : null });
    }
    const abertosP = dias.filter(x => !x.fut && !x.fechado && x.comandas > 0 && !(anda && x.d === hoje));
    const melhorDia = abertosP.reduce((b, x) => !b || x.comandas > b.comandas ? x : b, null), piorDia = abertosP.reduce((b, x) => !b || x.comandas < b.comandas ? x : b, null);
    let porDiaSemana = null;
    if (tipo === 'mes' && temH) {
      const mA = mesDe(addDays(ref, -1)), media = (m0, m1) => [1, 2, 3, 4, 5, 6].map(w => { let t = 0, c = 0; for (let x = m0; x <= m1 && x <= limDia; x = addDays(x, 1)) if (parse(x).getDay() === w && !feriado(x) && !(anda && x === hoje)) { t += somaH(x, { tipo: 'Comanda' }); c++; } return c ? t / c : 0; });
      porDiaSemana = { atual: media(ref, fim), ant: media(mA, ultimoDia(mA)), rot: ['seg', 'ter', 'qua', 'qui', 'sex', 'sáb'] };
    }
    // dia: ao longo do dia (acumulado por hora x dia de comparação) + movimento por hora
    let horas = null;
    if (tipo === 'dia' && temH) {
      const pa = perAnt(per).dia, cut = corteDia(per), hs = []; for (let h = 8; h <= 22; h++) hs.push(h);
      const faixa = (d, h, o) => somaH(d, { ...o, desde: pad(h - 1) + ':59', ate: pad(h) + ':59' });
      const acum = (d, o, lim) => { let a = 0; return hs.map(h => { if (lim && pad(h) + ':00' > lim) return null; a += faixa(d, h, o); return Math.round(a * 100) / 100; }); };
      const qh = hs.map(h => faixa(ref, h, { tipo: 'Comanda', qtd: true })), vh = hs.map(h => faixa(ref, h, { tipo: 'Comanda' }));
      const iP = vh.reduce((b, v, i) => v > vh[b] ? i : b, 0);
      horas = { rot: hs.map(h => h + 'h'), atual: acum(ref, {}, cut && cut !== '00:00' ? cut : null), ant: acum(pa, {}), antRot: diaCurto(pa), atualRot: diaCurto(ref),
        comandasHora: vh, qtdHora: qh, pico: vh[iP] > 0 ? { h: hs[iP], v: vh[iP], q: qh[iP] } : null,
        primeira: (() => { const i = qh.findIndex(v => v > 0); return i >= 0 ? hs[i] : null; })(), cut: cut && cut !== '00:00' ? horaTxt(cut) : null };
    }
    const fechadosP = Object.keys(S.fechMap || {}).filter(x => x >= ini && x <= fim).sort().map(x => ({ dia: dm(x), motivo: S.fechMap[x] }));
    const atend = soma(rows, 'atendimentos'), atendAnt = somaR(ant, 'atendimentos');
    const prodCom = rs => rs ? soma(rs, 'servicos') + soma(rs, 'produtos') + soma(rs, 'extras') : null;
    const operacao = { atend, atendAnt, ticket: atend ? prodCom(rows) / atend : 0, ticketAnt: ant && atendAnt ? prodCom(ant) / atendAnt : null,
      porDiaAberto: abertosP.length ? abertosP.reduce((a, x) => a + x.comandas, 0) / abertosP.length : 0, diasAbertos: abertosP.length };

    // ---- ranking por categoria (posição de cada barbeiro em cada critério)
    const CRIT = [['total', 'Faturamento'], ['servicos', 'Serviços'], ['produtos', 'Produtos'], ['extras', 'Extras'], ['assinaturas', 'Clube'], ['atend', 'Atendimentos'], ['ticket', 'Ticket']];
    const ranking = { crit: CRIT.map(c => c[1]), linhas: cad.map(c => ({ nome: c.nome, pos: CRIT.map(([k]) => 1 + cad.filter(o => n(o[k]) > n(c[k])).length), val: CRIT.map(([k]) => n(c[k])) })) };
    ranking.linhas.forEach(l => { l.ouros = l.pos.filter(p => p === 1).length; });

    // ---- metas das cadeiras (semana: meta realista do histórico · mês: meta lançada + projeção + mínimo)
    const metasCad = cad.map(c => {
      const key = (rows.find(r => r.pro.nome === c.nome) || { pro: {} }).pro.key;
      if (tipo === 'mes') return { nome: c.nome, total: c.total, meta: c.meta, proj: c.proj, minCad: c.minCad };
      if (tipo === 'dia') { const md = key ? metaRealDia(key, ref) : null; return { nome: c.nome, total: c.total, meta: md && !md.folga ? md.valor : 0, folga: !!(md && md.folga), proj: c.proj }; }
      const ms = key ? metaRealSemana(key, ref) : null;
      return { nome: c.nome, total: c.total, meta: ms ? ms.valor : 0, dias: ms ? ms.dias : 0, proj: c.proj };
    });

    // ---- ano (só no mensal): mês a mês desde janeiro até o mês do fechamento
    let ano = null;
    if (tipo === 'mes') {
      const ms = []; for (let m = mesDe(ref.slice(0, 4) + '-01-01'); m <= ref; m = mesDe(addDays(ultimoDia(m), 1))) ms.push(m);
      const L = ms.map(m => { const r = S.resultado.find(x => x.mes === m) || {}; return { m, rot: cap(mesAbr(m)) + (m === mesAtual() ? '*' : ''), fat: n(r.faturamento_total), comandas: n(r.comandas), assinaturas: n(r.assinaturas), parcial: m === mesAtual() }; }).filter(x => x.fat > 0);
      const fech = L.filter(x => !x.parcial), acum = L.reduce((a, x) => a + x.fat, 0), melhor = fech.reduce((b, x) => !b || x.fat > b.fat ? x : b, null);
      const ult3 = fech.slice(-3).map(x => x.fat), ant3 = fech.slice(-6, -3).map(x => x.fat);
      ano = { ano: ref.slice(0, 4), meses: L, acum, media: mediaArr(fech.map(x => x.fat)), melhor: melhor ? { rot: cap(MESES[parse(melhor.m).getMonth()]), fat: melhor.fat } : null,
        tend: ult3.length && ant3.length ? varPct(mediaArr(ult3), mediaArr(ant3)) : null, ult3: mediaArr(ult3), posicao: fech.length ? 1 + fech.filter(x => x.fat > (L.find(y => y.m === ref) || {}).fat).length : null, nFech: fech.length };
    }

    // ---- destaques e alertas (regras simples e explicáveis)
    const D = [], A = [], fmtP = v => (v >= 0 ? '+' : '−') + pct(Math.abs(v), Math.abs(v) >= 100 ? 0 : 1);
    const vB = varPct(barb.fat, barb.ant), pB = barb.meta ? 100 * barb.fat / barb.meta : 0, pP = barb.proj && barb.meta ? 100 * barb.proj.total / barb.meta : 0;
    const nomePer = { mes: 'mês', semana: 'semana', dia: 'dia' }[tipo];
    if (barb.meta && barb.fat >= barb.meta) D.push(['Meta ' + doPer + ' batida', `${brl(barb.fat)}: ${brl(barb.fat - barb.meta)} acima da meta (${pct(pB, 0)}).`]);
    else if (barb.meta && anda && pP >= 100) D.push(['No ritmo para bater a meta', `Projeção de ${brl(barb.proj.total)} (${pct(pP, 0)} da meta).`]);
    else if (barb.meta && anda && barb.proj) A.push(['Abaixo do ritmo da meta', `Projeção de ${brl(barb.proj.total)} (${pct(pP, 0)} da meta).${barb.porDia ? ` Precisa de ${brl(barb.porDia)} por dia nos ${barb.diasRest} dias que faltam.` : ''}`]);
    else if (barb.meta && !anda) A.push(['Meta ' + doPer + ' não batida', `Faltaram ${brl(barb.meta - barb.fat)} (${pct(pB, 0)} da meta).`]);
    if (vB !== null && vB >= 3) D.push([`Barbearia cresceu ${fmtP(vB)}`, `${brl(barb.fat)} contra ${brl(barb.ant)} (${compara}).`]);
    if (vB !== null && vB <= -3) A.push([`Barbearia caiu ${fmtP(vB)}`, `${brl(barb.fat)} contra ${brl(barb.ant)} (${compara}).`]);
    if (cad[0]) D.push([`${cad[0].nome} lidera o faturamento`, `${brl(cad[0].total)} na cadeira${cad[0].meta ? ` · ${pct(100 * cad[0].total / cad[0].meta, 0)} da meta` : ''}.`]);
    const cresc = cad.filter(c => c.ant).map(c => ({ c, v: varPct(c.total, c.ant) })).sort((a, b) => b.v - a.v);
    if (cresc[0] && cresc[0].v >= 5 && cresc[0].c !== cad[0]) D.push([`${cresc[0].c.nome} foi quem mais cresceu`, `${fmtP(cresc[0].v)} vs período anterior (${brl(cresc[0].c.total)}).`]);
    cresc.filter(x => x.v <= -10).slice(0, 2).forEach(x => A.push([`${x.c.nome} caiu ${fmtP(x.v)}`, `${brl(x.c.total)} contra ${brl(x.c.ant)} no período anterior.`]));
    const topV = [...cad].sort((a, b) => b.vendas - a.vendas)[0];
    if (topV && topV.vendas > 0) D.push([`${topV.nome} é destaque em vendas`, `${brl(topV.vendas)} em produtos + extras.`]);
    if (vendas.topProd[0]) D.push([`Produto mais vendido: ${vendas.topProd[0].item}`, `${int(vendas.topProd[0].q)} unid. · ${brl(vendas.topProd[0].v)}.`]);
    if (tipo === 'mes') {
      cad.forEach(c => {
        if (c.meta && !anda && c.total < c.meta) A.push([`${c.nome} abaixo da meta da cadeira`, `${pct(100 * c.total / c.meta, 0)} da meta (faltaram ${brl(c.meta - c.total)}).`]);
        else if (c.meta && anda && c.proj && c.proj < c.meta * 0.9) A.push([`${c.nome}: projeção abaixo da meta`, `Projeção ${brl(c.proj)} = ${pct(100 * c.proj / c.meta, 0)} da meta.`]);
        if (c.minProd && c.produtos < c.minProd && !anda) A.push([`${c.nome} não bateu o mínimo de produtos`, `${brl(c.produtos)} de ${brl(c.minProd)}.`]);
      });
      cad.filter(c => c.meta && c.total >= c.meta).forEach(c => D.push([`${c.nome} bateu a meta da cadeira`, `${brl(c.total)} (${pct(100 * c.total / c.meta, 0)}).`]));
    }
    const vC = varPct(clube.fat, clube.ant);
    if (vC !== null && vC <= -5) A.push([`Clube caiu ${fmtP(vC)}`, `${brl(clube.fat)} em assinaturas contra ${brl(clube.ant)}.`]);
    if (vC !== null && vC >= 5) D.push([`Clube cresceu ${fmtP(vC)}`, `${brl(clube.fat)} em assinaturas.`]);
    const vT = varPct(vendas.porAt, vendas.porAtAnt);
    if (vT !== null && vT <= -10) A.push([`Venda por atendimento caiu ${fmtP(vT)}`, `${brl(vendas.porAt)} por atendimento em produtos + extras.`]);
    if (cultura) {
      const lim = cultura.limite;
      cultura.linhas.filter(l => l.pts / lim > .5).sort((a, b) => b.pts - a.pts).forEach(l => A.push([`${l.nome} com ${l.pts} de ${lim} pontos de cultura`, l.pts >= lim ? 'Atingiu o limite de desclassificação.' : `Está a ${lim - l.pts} ${lim - l.pts === 1 ? 'ponto' : 'pontos'} do limite.`]));
      const zero = cultura.linhas.filter(l => !l.pts).map(l => l.nome);
      if (zero.length) D.push([zero.length === cultura.linhas.length ? 'Toda a equipe sem ocorrências de cultura' : `Sem ocorrências de cultura: ${zero.map(x => x.split(' ')[0]).join(', ')}`, `Nenhum ponto em ${cultura.nome.toLowerCase()} até ${cultura.ate}.`]);
    }

    if (melhorDia && abertosP.length > 1) D.push([`Melhor dia: ${DIAS_SEM[parse(melhorDia.d).getDay()]}, ${dm(melhorDia.d)}`, `${brl(melhorDia.comandas)} em comandas (${int(melhorDia.qtd)} comandas).`]);
    const vAt = varPct(operacao.atend, operacao.atendAnt), vTk = varPct(operacao.ticket, operacao.ticketAnt);
    if (vAt !== null && vAt >= 5) D.push([`Atendimentos subiram ${fmtP(vAt)}`, `${int(operacao.atend)} atendimentos contra ${int(operacao.atendAnt)}.`]);
    if (vAt !== null && vAt <= -8) A.push([`Atendimentos caíram ${fmtP(vAt)}`, `${int(operacao.atend)} atendimentos contra ${int(operacao.atendAnt)}.`]);
    if (vTk !== null && vTk >= 5) D.push([`Ticket médio subiu ${fmtP(vTk)}`, `${brl(operacao.ticket)} por atendimento (serviços + produtos + extras).`]);
    if (vTk !== null && vTk <= -8) A.push([`Ticket médio caiu ${fmtP(vTk)}`, `${brl(operacao.ticket)} por atendimento contra ${brl(operacao.ticketAnt)}.`]);
    if (tipo !== 'mes') metasCad.filter(m => m.meta && !anda && m.total >= m.meta).forEach(m => D.push([`${m.nome} bateu a meta ${doPer}`, `${brl(m.total)} (${pct(100 * m.total / m.meta, 0)} da meta de ${brl(m.meta)}).`]));
    if (tipo !== 'mes') metasCad.filter(m => m.meta && !anda && m.total < m.meta * 0.85).forEach(m => A.push([`${m.nome} abaixo da meta ${doPer}`, `${pct(100 * m.total / m.meta, 0)} da meta (faltaram ${brl(m.meta - m.total)}).`]));
    if (horas && horas.pico) D.push([`Horário de pico: ${horas.pico.h}h às ${horas.pico.h + 1}h`, `${brl(horas.pico.v)} em ${int(horas.pico.q)} ${horas.pico.q === 1 ? 'comanda' : 'comandas'} nessa hora.`]);
    if (fechadosP.length && tipo !== 'dia') A.push([`${fechadosP.length} ${fechadosP.length === 1 ? 'dia fechado' : 'dias fechados'} no período`, fechadosP.map(f => `${f.dia} (${f.motivo})`).join(', ') + '. Comparações e metas já descontam.']);
    if (tipo === 'mes' && ano && ano.posicao === 1 && ano.nFech > 1 && !anda) D.push([`Melhor mês do ano`, `${brl(barb.fat)}: maior faturamento de ${ano.ano}.`]);
    const peso = t => /^(Abaixo do ritmo|Meta |Barbearia caiu)/.test(t) ? 0 : /pontos de cultura/.test(t) ? 1 : /^(Clube caiu|Venda por atendimento)/.test(t) ? 2 : / caiu /.test(t) ? 3 : 4;
    A.sort((x, y) => peso(x[0]) - peso(y[0]));
    return {
      tipo, titulo: tipo === 'mes' ? mesLabel(ref) : tipo === 'dia' ? `${cap(DIAS_SEM[parse(ref).getDay()])}, ${dBR(ref)}` : 'Semana ' + semanaLabel(ref), nomePer, doPer,
      periodo: tipo === 'dia' ? dBR(ref) : `${dBR(ini)} a ${dBR(fim)}`, horas, fechadoDia: tipo === 'dia' && feriado(ref) ? S.fechMap[ref] : '',
      andamento: anda, parcialTxt: anda ? `Parcial · dados até ${atTxt || dm(ref0.cut)}` : 'Período fechado',
      geradoEm: `${dBR(hoje)} ${pad(new Date().getHours())}h${pad(new Date().getMinutes())}`,
      compara, modoAnt: modo, barb, hist, cad, vendas, clube, cultura, dias, melhorDia, piorDia, porDiaSemana, fechados: fechadosP, operacao, ranking, metasCad, ano, destaques: D.slice(0, 7), alertas: A.slice(0, 7)
    };
  }
  function painelPPT() {
    const hoje = today();
    const ops = pptTipo === 'mes'
      ? [...new Set(S.mensal.map(r => r.mes))].sort().reverse().slice(0, 12).map(m => [m, mesLabel(m) + (m === mesAtual() ? ' (em andamento)' : '')])
      : pptTipo === 'dia'
        ? Array.from({ length: 35 }, (_, k) => addDays(hoje, -k)).filter(x => parse(x).getDay() !== 0).map(x => [x, diaLabel(x) + (x === hoje ? ' (em andamento)' : '')])
        : [...new Set([segunda(hoje), ...S.semanal.map(r => r.semana)])].sort().reverse().slice(0, 10).map(s => [s, 'Semana ' + semanaLabel(s) + (s === segunda(hoje) ? ' (em andamento)' : '')]);
    const sel = pptRef[pptTipo] && ops.some(o => o[0] === pptRef[pptTipo]) ? pptRef[pptTipo] : (ops[0] || [''])[0];
    const nSl = pptTipo === 'mes' ? 12 : 11;
    return `<section class="panel"><div class="panel-head"><h3 class="h2">Fechamento em apresentação</h3></div>
      <p class="dim sm" style="margin:-6px 0 14px">Apresentação pronta para a reunião, com os números atualizados do painel: resultado e meta, variação, projeção, ${pptTipo === 'dia' ? 'ao longo do dia' : 'dia a dia'}${pptTipo === 'mes' ? ', ano até agora' : ''}, cadeiras, ranking, metas das cadeiras, vendas, top produtos, clube, cultura, destaques e pontos de atenção · ${nSl} slides. Sai em PowerPoint ou direto no Google Slides.</p>
      <div class="filters" style="justify-content:flex-start"><div class="chips">${[['dia', 'Diário'], ['semana', 'Semanal'], ['mes', 'Mensal']].map(([k, l]) => `<button class="chip ${pptTipo === k ? 'on' : ''}" data-ppt="${k}">${l}</button>`).join('')}</div>
        <select id="ppt-ref" aria-label="Período do fechamento">${ops.map(([v, l]) => `<option value="${v}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>
        <button class="btn btn-acc" id="ppt-go">${ic('down', 18)}PowerPoint</button>
        <button class="btn" id="ppt-gs">${ic('doc', 18)}Google Slides</button></div></section>`;
  }
  async function gerarApresentacao(tipo, ref, comoBlob) {
    await carregarScript('pptxgen.bundle.js');
    await carregarScript('relatorio-ppt.js?v=2');
    const dados = await montarFechamento(tipo, ref);
    dados.logo = await imagemBase64('logo.png');
    return window.RelatorioPPT.gerar(dados, window.PptxGenJS, { blob: comoBlob });
  }
  async function exportarPPT(tipo, ref) {
    const btn = $('#ppt-go'); if (btn) { btn.disabled = true; btn.dataset.txt = btn.innerHTML; btn.innerHTML = 'Gerando…'; }
    try { const nome = await gerarApresentacao(tipo, ref, false); toast('PowerPoint gerado: ' + nome, 'good'); }
    catch (e) { console.error(e); toast('Não foi possível gerar o PowerPoint: ' + (e.message || e), 'bad'); }
    finally { if (btn) { btn.disabled = false; btn.innerHTML = btn.dataset.txt; } }
  }

  /* ---------- GOOGLE SLIDES ----------
     Com googleClientId no config.js: pede permissão ao Google (só para criar arquivos deste painel no Drive, escopo drive.file),
     gera a mesma apresentação e sobe para o Drive já convertida em Google Slides. Sem o client id: baixa o .pptx e mostra
     como abrir no Google Slides (Drive > Novo > Upload). */
  const GS_ESCOPO = 'https://www.googleapis.com/auth/drive.file';
  let gToken = null;
  function preCarregarGoogle() { if (CFG.googleClientId) carregarScript('https://accounts.google.com/gsi/client').catch(() => {}); }
  function pedirTokenGoogle() {   // precisa ser chamado direto no clique (o Google abre um pop-up)
    if (gToken && gToken.ate > Date.now() + 60e3) return Promise.resolve(gToken.token);
    return new Promise((ok, erro) => {
      if (!window.google || !google.accounts || !google.accounts.oauth2) return erro(new Error('Login do Google ainda carregando. Tente de novo em alguns segundos.'));
      const tc = google.accounts.oauth2.initTokenClient({ client_id: CFG.googleClientId, scope: GS_ESCOPO,
        callback: r => { if (r.error) return erro(new Error(r.error_description || r.error)); gToken = { token: r.access_token, ate: Date.now() + (n(r.expires_in) || 3600) * 1000 }; ok(r.access_token); },
        error_callback: e => erro(new Error(e && e.type === 'popup_closed' ? 'Janela do Google fechada antes de autorizar.' : (e && (e.message || e.type)) || 'Login do Google cancelado.')) });
      tc.requestAccessToken({ prompt: gToken ? '' : 'consent' });
    });
  }
  async function subirParaSlides(token, nome, blob) {
    const b = 'cb' + Date.now(), meta = { name: nome.replace(/\.pptx$/, '').replace(/_/g, ' '), mimeType: 'application/vnd.google-apps.presentation' };
    const corpo = new Blob([`--${b}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(meta)}\r\n--${b}\r\nContent-Type: application/vnd.openxmlformats-officedocument.presentationml.presentation\r\n\r\n`, blob, `\r\n--${b}--`]);
    const r = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink', { method: 'POST', headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/related; boundary=' + b }, body: corpo });
    if (r.status === 401) { gToken = null; throw new Error('Permissão do Google expirou. Clique de novo.'); }
    if (!r.ok) throw new Error('Google Drive respondeu ' + r.status + ': ' + (await r.text()).slice(0, 160));
    const j = await r.json(); return j.webViewLink || `https://docs.google.com/presentation/d/${j.id}/edit`;
  }
  async function exportarSlides(tipo, ref) {
    const btn = $('#ppt-gs'), trava = t => { if (!btn) return; if (t) { btn.disabled = true; btn.dataset.txt = btn.innerHTML; btn.innerHTML = t; } else { btn.disabled = false; btn.innerHTML = btn.dataset.txt; } };
    if (!CFG.googleClientId) {   // sem integração: baixa e explica como abrir no Slides
      trava('Gerando…');
      try {
        const nome = await gerarApresentacao(tipo, ref, false);
        openModal('Abrir no Google Slides', `<div class="stack-txt"><p>O arquivo <b>${esc(nome)}</b> foi baixado. Para abrir no Google Slides:</p>
          <ol><li>Abra o <b>Google Drive</b> (botão abaixo).</li><li>Clique em <b>Novo › Upload de arquivo</b> e escolha o arquivo baixado.</li><li>Clique duas vezes no arquivo e escolha <b>Abrir com › Apresentações Google</b>.</li></ol>
          <p class="dim sm">Para cair direto no Google Slides com um clique, o administrador do painel precisa ligar a integração com o Google (googleClientId no config.js).</p>
          <p><a class="btn btn-acc" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener">Abrir o Google Drive</a></p></div>`, null);
      } catch (e) { console.error(e); toast('Não foi possível gerar a apresentação: ' + (e.message || e), 'bad'); }
      finally { trava(null); }
      return;
    }
    let token;
    try { token = await pedirTokenGoogle(); }   // primeiro o pop-up do Google, ainda dentro do clique
    catch (e) { toast(e.message || String(e), 'bad'); return; }
    trava('Enviando ao Google…');
    try {
      const { nome, blob } = await gerarApresentacao(tipo, ref, true);
      const link = await subirParaSlides(token, nome, blob);
      openModal('Apresentação criada no Google Slides', `<div class="stack-txt"><p><b>${esc(nome.replace(/\.pptx$/, '').replace(/_/g, ' '))}</b> está no seu Google Drive, já em Google Slides.</p>
        <p><a class="btn btn-acc" href="${esc(link)}" target="_blank" rel="noopener">Abrir no Google Slides</a></p>
        <p class="dim sm">Lá dentro dá para editar, compartilhar com a equipe e usar o Gemini do Google Slides para ajustar o visual.</p></div>`, null);
    } catch (e) { console.error(e); toast('Não foi possível criar no Google Slides: ' + (e.message || e), 'bad'); }
    finally { trava(null); }
  }

  /* ---------- META DA SEMANA DA CADEIRA ----------
     Mesma lógica da barbearia: (meta da cadeira − faturado no mês antes da semana) ÷ dias de trabalho que faltam no mês
     × dias de trabalho da semana (sem domingo, sem a folga e sem dias fechados). Fica fixa durante a semana.
     "Faturado antes da semana" = total do mês − semanas a partir desta (semana na virada do mês entra pela parte do mês,
     estimada pelas comandas do barbeiro em cada dia; sem dado diário, pelos dias). */
  function fracSemanaNoMes(ini, m, key) {
    let vm = 0, vt = 0, dm0 = 0;
    for (let x = ini; x <= addDays(ini, 6); x = addDays(x, 1)) { const v = valDia(x, key); vt += v; if (mesDe(x) === m) { vm += v; dm0++; } }
    return vt ? vm / vt : dm0 / 7;
  }
  function metaSemanaCadeira(key, ini) {
    const fim = addDays(ini, 6), f = folgaDe(key), trab = x => aberto(x) && parse(x).getDay() !== f;
    const totSem = s => { const r = linhas({ tipo: 'semana', semana: s }).find(x => x.pro.key === key); return r ? r.total : 0; };
    const partes = [...new Set([mesDe(ini), mesDe(fim)])].map(m => {
      const mt = metaDe(key, m), meta = mt ? n(mt.meta_cadeira) : 0;
      const mr = linhas({ tipo: 'mes', mes: m }).find(x => x.pro.key === key), totMes = mr ? mr.total : 0;
      let depois = 0; for (let s = ini; s <= ultimoDia(m); s = addDays(s, 7)) depois += totSem(s) * (mesDe(s) === m && mesDe(addDays(s, 6)) === m ? 1 : fracSemanaNoMes(s, m, key));
      const antes = Math.max(0, totMes - depois), desde = ini > m ? ini : m;
      let rest = 0, sem = 0; for (let x = desde; x <= ultimoDia(m); x = addDays(x, 1)) if (trab(x)) { rest++; if (x <= fim) sem++; }
      return { meta, sem, ritmo: meta && rest ? Math.max(0, meta - antes) / rest : null };
    });
    const com = partes.filter(x => x.ritmo !== null); if (!com.length) return null;
    return { valor: partes.reduce((a, x) => a + (x.ritmo !== null ? x.ritmo : com[0].ritmo) * x.sem, 0), dias: partes.reduce((a, x) => a + x.sem, 0) };
  }

  /* ---------- META REALISTA (visão do barbeiro): dia e semana pelo histórico de cada um ----------
     Base = últimas 8 semanas fechadas antes da semana escolhida: faturamento da cadeira por dia de trabalho.
     Serviços + produtos + extras seguem o peso de cada dia da semana (média das comandas das últimas 4 vezes
     daquele dia); o clube entra por igual em todo dia de trabalho. Em cima disso, 5% de desafio.
     Folga, domingo e dias fechados não têm meta. A meta do mês continua sendo a lançada pelo dono. */
  const META_SEMANAS = 8, META_DESAFIO = 0.05;
  function pesoDias(key, ate) {
    const m = mediaSemana(key, ate), f = folgaDe(key), wds = [1, 2, 3, 4, 5, 6].filter(w => w !== f && m[w] > 0);
    const med = wds.length ? wds.reduce((a, w) => a + m[w], 0) / wds.length : 0;
    return [0, 1, 2, 3, 4, 5, 6].map(w => med && m[w] > 0 ? m[w] / med : 1);
  }
  function baseHistorica(key, ini) {
    S.metaHistCache = S.metaHistCache || {}; const ck = key + '|' + ini;
    if (ck in S.metaHistCache) return S.metaHistCache[ck];
    const f = folgaDe(key), trab = x => aberto(x) && parse(x).getDay() !== f, hoje = today();
    let prod = 0, clube = 0, dias = 0, sems = 0;
    for (let k = 1; k <= 26 && sems < META_SEMANAS; k++) {
      const s = addDays(ini, -7 * k); if (addDays(s, 6) >= hoje) continue;   // só semanas já fechadas
      const r = S.semanal.find(x => x.semana === s && x.profissional === key); if (!r) continue;
      const p = n(r.servicos) + n(r.produtos) + n(r.extras), c = n(r.assinaturas); if (p + c <= 0) continue;   // férias / ainda não trabalhava
      let d = 0; for (let x = s; x <= addDays(s, 6); x = addDays(x, 1)) if (trab(x)) d++; if (!d) continue;
      prod += p; clube += c; dias += d; sems++;
    }
    return S.metaHistCache[ck] = dias ? { prodDia: prod / dias, clubeDia: clube / dias, sems, peso: pesoDias(key, addDays(ini, -1)) } : null;
  }
  function metaRealDia(key, d) {
    const f = folgaDe(key), wd = parse(d).getDay();
    if (diaFechado(d) || wd === f) return { folga: true, fechado: diaFechado(d), valor: 0 };
    const b = baseHistorica(key, segunda(d)); if (!b) return null;
    const prod = b.prodDia * b.peso[wd];
    return { valor: (prod + b.clubeDia) * (1 + META_DESAFIO), prod, clube: b.clubeDia, sems: b.sems, wd };
  }
  function metaRealSemana(key, ini) {
    const b = baseHistorica(key, ini); if (!b) return null;
    let valor = 0, dias = 0;
    for (let x = ini; x <= addDays(ini, 6); x = addDays(x, 1)) { const m = metaRealDia(key, x); if (m && m.valor) { valor += m.valor; dias++; } }
    return { valor, dias, sems: b.sems };
  }

  /* ---------- INÍCIO (profissional): mês, semana ou dia ---------- */
  function vInicio() {
    const eu = S.me.profissional;
    if (!eu) { shell(rotaAtual(), `<p class="empty">Seu acesso ainda não está ligado a uma cadeira. Fale com a administração.</p>`); return; }
    const tipo = S.per.tipo, hoje = today();
    const per = tipo === 'dia' ? { tipo, dia: S.per.dia } : tipo === 'semana' ? { tipo, semana: S.per.semana } : { tipo: 'mes', mes: S.per.mes };
    const ini = tipo === 'dia' ? per.dia : tipo === 'semana' ? per.semana : per.mes, fim = tipo === 'dia' ? per.dia : tipo === 'semana' ? addDays(per.semana, 6) : ultimoDia(per.mes);
    const anda = hoje >= ini && hoje <= fim;
    const rows = linhas(per), meu = rows.find(r => r.pro.key === eu) || { ...VAZIO, total: 0, ticket: 0, vendas: 0, pro: { key: eu } };
    const ord = [...rows].sort((a, b) => b.total - a.total), pos = meu.total > 0 ? ord.findIndex(r => r.pro.key === eu) + 1 : 0;
    const ant = anterior(per), ma = doPro(ant, eu), posA = ant && ma && ma.total > 0 ? posDe(ordem(ant, 'total'), eu) : 0;
    const mMes = metaDe(eu, mesDe(ini)) || {};
    const nomeP = { mes: 'do mês', semana: 'da semana', dia: 'do dia' }[tipo];
    const f = folgaDe(eu), wdHoje = parse(hoje).getDay();

    // meta, projeção e "por dia" de cada visão
    let meta = 0, notaMeta = '', pr = null, diasRest = 0, aviso = '';
    if (tipo === 'mes') {
      meta = n(mMes.meta_cadeira); pr = projDe(projecao(per), eu); diasRest = pr ? Math.max(1, pr.diasTrab) : 0;
      notaMeta = 'Meta do mês lançada pelo dono.';
    } else if (tipo === 'semana') {
      const ms = metaRealSemana(eu, per.semana); meta = ms ? ms.valor : 0; pr = projDe(projecao(per), eu);
      if (anda) for (let x = hoje; x <= fim; x = addDays(x, 1)) if (aberto(x) && parse(x).getDay() !== f && (x > hoje || corteDia({ tipo: 'dia', dia: hoje }))) diasRest++;
      notaMeta = ms ? `Meta da semana = soma das suas metas do dia nos ${ms.dias} dias de trabalho desta semana. Cada meta do dia é o que você costuma faturar naquele dia da semana (média das suas últimas ${ms.sems} semanas, com o clube) + 5%. Folga e feriado não entram.` : 'Ainda não há semanas suficientes no seu histórico para calcular a meta.';
    } else {
      const md = metaRealDia(eu, per.dia); meta = md && !md.folga ? md.valor : 0;
      const pd = projDia(per), passado = per.dia < hoje; pr = projDe(pd, eu);
      if (md && md.folga) aviso = md.fechado ? (feriado(per.dia) ? `Barbearia fechada ${passado ? 'neste dia' : 'hoje'} (${esc(S.fechMap[per.dia])}). Sem meta do dia.` : 'Barbearia fechada. Sem meta do dia.') : `${passado ? 'Dia de folga' : per.dia === hoje ? 'Hoje é sua folga' : 'Dia de folga'}. Sem meta do dia.`;
      notaMeta = md ? (md.folga ? '' : `Meta do dia = o que você costuma faturar ${md.wd === 6 ? "no" : "na"} ${DIAS_SEM[md.wd]} (${brl(md.prod)} em serviços, produtos e extras, pela média das suas últimas semanas) + seu clube médio por dia (${brl(md.clube)}) + 5%.`) : 'Ainda não há semanas suficientes no seu histórico para calcular a meta.';
      if (feriado(per.dia) && !aviso) aviso = `Barbearia fechada neste dia (${esc(S.fechMap[per.dia])}).`;
    }
    const p = meta ? 100 * meu.total / meta : 0, falta = Math.max(0, meta - meu.total);
    const sp = pr && meta ? sitProj(pr.total, pr.lo, pr.hi, meta) : null, ppr = pr && meta ? 100 * pr.total / meta : 0;

    // textos de comparação
    let vsTxt = '';
    if (ma) {
      if (tipo === 'mes') vsTxt = `vs ${mesLabel(perAnt(per).mes)}${fracAnt(per) ? (modoAnt(per) === 'dias' ? ' · mesmos dias' : ' · proporcional') : ''}`;
      else if (tipo === 'semana') vsTxt = `vs semana ${semanaLabel(perAnt(per).semana)}${fracAnt(per) ? (modoAnt(per) === 'dias' ? ' · mesmos dias' : ' · proporcional') : ''}`;
      else { const cut = corteDia(per); vsTxt = `vs ${diaCurto(perAnt(per).dia)}${cut && cut !== '00:00' ? ' até as ' + horaTxt(cut) : ''}`; }
    }
    const titulo = tipo === 'mes' ? mesLabel(per.mes) : tipo === 'semana' ? 'semana ' + semanaLabel(per.semana) : diaLabel(per.dia);
    const cutTxt = tipo === 'dia' && corteDia(per) && corteDia(per) !== '00:00' ? ` · até ${horaTxt(corteDia(per))}` : '';
    const kMin = (l, v, min, k) => tipo === 'mes'
      ? `<div class="kpi ${n(min) && v >= n(min) ? 'lead' : ''}"><span class="lbl">${l}</span><div class="num">${brl(v)}</div>${dvl(ma && dv(v, ma[k]))}<small>${n(min) ? (v >= n(min) ? 'Mínimo atingido ✓' : `Mínimo ${brl(min)} · faltam ${brl(n(min) - v)}`) : 'sem mínimo definido'}</small></div>`
      : kpiVar(l, brl(v), ma && dv(v, ma[k]), k === 'produtos' ? `${pct(meu.total ? 100 * v / meu.total : 0, 0)} da cadeira` : 'procedimentos à parte');
    const porDiaLbl = tipo === 'dia' ? 'Atendimentos' : (diasRest && falta ? `Por dia (${diasRest} ${diasRest === 1 ? 'dia' : 'dias'} de trabalho)` : 'Ticket médio');
    const porDiaVal = tipo === 'dia' ? int(meu.atendimentos) : (diasRest && falta ? brl(falta / diasRest) : brl(meu.ticket));
    const semAtual = tipo === 'mes' ? linhas({ tipo: 'semana', semana: segunda(hoje) }).find(r => r.pro.key === eu) : null;

    shell(rotaAtual(), `<div class="page-head"><div><p class="eyebrow">Olá, ${esc(S.me.nome.split(' ')[0])}</p><h1 class="h1">Minha performance</h1></div>${filtros()}</div>
      ${legendaVar(per)}
      ${aviso ? `<p class="note">${aviso}</p>` : ''}
      <section class="hero"><div class="hero-top"><div><span class="lbl">Faturamento da cadeira · ${esc(titulo)}${cutTxt}</span><div class="num big">${brl(meu.total)}</div>${ma ? `<div class="hero-var">${dv(meu.total, ma.total)} <span>${esc(vsTxt)}</span></div>` : ''}</div>
        <div class="pos-badge"><span class="num">${pos ? pos + 'º' : '—'}</span><small>no ranking ${tipo === 'mes' ? '' : nomeP}</small>${posA && pos ? `<small>${dvPos(pos, posA)}</small>` : ''}</div></div>
        <div class="bar ${p >= 100 ? 'good' : ''}">${ppr ? `<em class="bar-proj" style="width:${Math.min(100, ppr)}%" title="Projeção: ${pct(ppr, 0)} da meta ${nomeP}"></em>` : ''}<i style="width:${Math.min(100, p)}%"></i></div>
        <div class="hero-meta"><span>Atingimento ${meta ? pct(p, 1) : '—'}${ppr ? ` <span class="proj-leg">· projeção ${pct(ppr, 0)}</span>` : ''}</span><span>${brl(meu.total)} / ${meta ? brl(meta) : 'sem meta'}</span></div>
        ${pr ? `<div class="proj-box"><div class="proj-main"><span class="lbl">Projeção ${nomeP}</span><b class="num">${brl(pr.total)}</b><small>faixa provável ${tipo === 'dia' ? brl(pr.lo) + ' a ' + brl(pr.hi) : milhar(pr.lo) + ' a ' + milhar(pr.hi)}</small></div>
          ${meta ? `<div class="proj-main"><span class="lbl">Projeção x meta ${nomeP}</span><b class="num">${pct(ppr, 0)}</b>${pillSit(sp)}</div>
          <div class="proj-main"><span class="lbl">${pr.total >= meta ? 'Sobra prevista' : 'Falta prevista'}</span><b class="num ${pr.total >= meta ? 'good' : ''}">${brl(Math.abs(pr.total - meta))}</b><small>${meu.total >= meta ? `meta ${nomeP} já batida ✓` : pr.total >= meta ? 'se seguir o seu ritmo normal' : 'precisa vender acima do normal'}</small></div>` : ''}
          <button type="button" class="proj-help" data-comoproj aria-label="Como calculamos a projeção">?</button></div>` : ''}
        <div class="hero-row"><div><span class="lbl">Meta ${nomeP}</span><b class="num">${meta ? brl(meta) : '—'}</b></div>
          <div><span class="lbl">${meta && falta === 0 ? `Meta ${nomeP} batida ✓` : 'Faltam'}</span><b class="num">${meta ? (falta ? brl(falta) : '✓') : '—'}</b></div>
          <div><span class="lbl">${porDiaLbl}</span><b class="num">${porDiaVal}</b></div></div></section>
      ${notaMeta ? `<div class="row"><span class="dim sm">${notaMeta}</span></div>` : ''}
      <div class="kpis k4">${kMin('Produtos', meu.produtos, mMes.min_produtos, 'produtos')}${kMin('Extras', meu.extras, mMes.min_extras, 'extras')}
        ${kpiVar('Serviços', brl(meu.servicos), ma && dv(meu.servicos, ma.servicos), `${int(meu.atendimentos)} atendimentos · ticket ${brl(meu.ticket)}`)}
        <div class="kpi"><span class="lbl">Clube</span><div class="num">${brl(meu.assinaturas)}</div>${dvl(ma && dv(meu.assinaturas, ma.assinaturas))}<small>${pct(meu.participacao_pct, 2)} do pote${tipo === 'dia' ? '' : ' · comissão ' + brl(meu.comissao_pote)}</small></div></div>
      <section class="panel"><h3 class="h2">Composição da minha cadeira · ${esc(tipo === 'mes' ? 'mês' : tipo === 'semana' ? 'semana' : 'dia')}</h3>
        <div class="comp">${SEG.map(([k, , c]) => `<i style="width:${meu.total ? 100 * meu[k] / meu.total : 0}%;background:${c}"></i>`).join('')}</div>
        <div class="legend">${SEG.map(([k, l, c]) => `<span style="--c:${c}">${l} ${brl(meu[k])}</span>`).join('')}</div></section>
      ${semAtual ? `<section class="panel"><h3 class="h2">Esta semana · ${semanaLabel(segunda(hoje))}</h3><dl class="kv">
        ${SEG.map(([k, l]) => `<dt>${l}</dt><dd>${brl(semAtual[k])}</dd>`).join('')}<dt class="tot">Total</dt><dd class="tot">${brl(semAtual.total)}</dd></dl></section>` : ''}
      ${tipo === 'mes' ? `<section class="panel"><h3 class="h2">Evolução no mês · minhas comandas</h3><p class="dim sm" style="margin:-6px 0 10px">${esc(mesLabel(per.mes))} x ${esc(mesLabel(mesDe(addDays(per.mes, -1))))} (tracejado), mesmo dia do mês</p><div class="chart"><canvas id="c-evo"></canvas></div></section>` : ''}
      ${tipo === 'semana' ? `<section class="panel"><h3 class="h2">Evolução na semana · minhas comandas</h3><p class="dim sm" style="margin:-6px 0 10px">semana ${esc(semanaLabel(per.semana))} x ${esc(semanaLabel(addDays(per.semana, -7)))} (tracejado), mesmo dia da semana</p><div class="chart"><canvas id="c-sem"></canvas></div></section>` : ''}
      ${tipo === 'dia' && S.horas && !S.horas.erro ? `<section class="panel"><h3 class="h2">Ao longo do dia · minhas comandas</h3><p class="dim sm" style="margin:-6px 0 10px">${esc(diaCurto(per.dia))} x ${esc(diaCurto(perAnt(per).dia))} (tracejado)</p><div class="chart"><canvas id="c-hora"></canvas></div></section>` : ''}`);
    ligarFiltros(app);
    const desenhaEvo = () => {
      if (tipo === 'mes' && $('#c-evo')) { const ma0 = mesDe(addDays(per.mes, -1)); graficoComparado('c-evo', comandasDoPro(eu), per.mes, ultimoDia(per.mes), ma0, ultimoDia(ma0), mesLabel(per.mes), mesLabel(ma0), dm); }
      if (tipo === 'semana' && $('#c-sem')) graficoComparado('c-sem', comandasDoPro(eu), per.semana, addDays(per.semana, 5), addDays(per.semana, -7), addDays(per.semana, -2), 'Esta semana', 'Semana anterior', diaCurto);
    };
    desenhaEvo();
    const iniAntEvo = tipo === 'mes' ? mesDe(addDays(per.mes, -1)) : tipo === 'semana' ? addDays(per.semana, -7) : null;
    if (iniAntEvo && S.diarioDesde && iniAntEvo < S.diarioDesde) garantirDiario(iniAntEvo).then(ok => ok && desenhaEvo()).catch(() => {});
    if (tipo === 'dia' && $('#c-hora')) graficoHoras('c-hora', [{ label: diaCurto(per.dia), dia: per.dia, key: eu, tipo: 'Comanda', cor: '#e49e2b', fill: true, ate: corteDia(per) || undefined }, { label: diaCurto(perAnt(per).dia), dia: perAnt(per).dia, key: eu, tipo: 'Comanda', cor: '#aaa39c', dash: true }]);
    $$('[data-comoproj]').forEach(x => x.onclick = tipo === 'dia' ? comoProjecaoDia : tipo === 'semana' ? comoProjecaoSemana : comoProjecao);
  }

  /* ------------------------------------------------------------- ciclo */
  async function render() {
    charts.splice(0).forEach(c => c.destroy());
    if (!S.me) return;
    try { await garantirJanelas(); } catch (_) { }
    if (S.per.tipo === 'dia') { if (!S.per.dia) S.per.dia = diaPadrao(); try { await garantirDia(S.per.dia); } catch (e) { console.warn(e); } }
    if (S.per.tipo === 'semana' && rotaAtual()[0] === 'dashboard') { const f = addDays(S.per.semana, 6); try { await garantirHoras(addDays(S.per.semana, -63), f < today() ? f : today()); } catch (e) { console.warn(e); } }
    if (S.per.tipo === 'semana' && rotaAtual()[0] === 'clube') { const f = addDays(S.per.semana, 6); try { await garantirHoras(addDays(S.per.semana, -7), f < today() ? f : today()); } catch (e) { console.warn(e); } }
    if (S.per.tipo === 'mes' && ['dashboard', 'clube'].includes(rotaAtual()[0])) { const f = ultimoDia(S.per.mes); try { await garantirHoras(mesDe(addDays(S.per.mes, -1)), f < today() ? f : today()); } catch (e) { console.warn(e); } }
    try { await rotaAtual()[3](); } catch (e) { console.error(e); toast('Erro ao montar a tela: ' + e.message, 'bad'); }
    window.scrollTo({ top: 0 });
  }
  async function entrar(session) {
    if (!session) { S.me = null; vLogin(); return; }
    app.innerHTML = '<div class="loading">Carregando…</div>';
    try {
      const { data, error } = await sb.from('perfis').select('*').eq('id', session.user.id).maybeSingle();
      if (error) throw error;
      if (!data || !data.ativo) {
        await sb.auth.signOut();
        vLogin(data ? 'Seu acesso está desativado. Fale com a administração.' : 'Seu usuário ainda não tem perfil no painel. Fale com a administração.');
        return;
      }
      S.me = data; S.cultura = null;
      await carregar();
      if (!rotas().some(r => r[0] === location.hash.slice(1))) location.hash = rotas()[0][0];  // dispara o render via hashchange
      else render();
    } catch (e) { console.error(e); app.innerHTML = `<div class="login"><div class="login-card"><p class="err">Não foi possível carregar o painel.</p><p class="mut sm">${esc(e.message)}</p><button class="btn" onclick="location.reload()">Tentar de novo</button></div></div>`; }
  }

  chartDefaults();
  window.addEventListener('hashchange', () => { if (S.me) render(); });
  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && S.me && Date.now() - S.carregadoEm > 10 * 60e3) { try { await carregar(); render(); } catch (e) { } }
  });
  let ultimoUser = undefined;
  sb.auth.onAuthStateChange((evento, session) => {
    const uid = session ? session.user.id : null;
    if (uid === ultimoUser && evento !== 'SIGNED_IN') return;   // ignora renovação de token
    if (uid === ultimoUser && S.me) return;
    ultimoUser = uid; setTimeout(() => entrar(session), 0);
  });
})();
