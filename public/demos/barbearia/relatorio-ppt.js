/* =====================================================================
   BARBEARIA DEMO — Fechamento em PowerPoint
   Recebe os números já calculados pelo painel (app.js → montarFechamento)
   e desenha os slides com a biblioteca pptxgenjs.
   Diário e semanal: 11 slides · Mensal: 12 slides. Estilo da apresentação de desempenho
   (fundo preto, dourado, cards e frase-resumo no rodapé).
   ===================================================================== */
(function (raiz) {
  'use strict';

  const COR = { bg: '0D0D0D', card: '17171A', borda: '2A2A2E', ouroBg: '1D1910', ouro: 'E3A02D', branco: 'FFFFFF', texto: 'E6E6E6', mut: '9A9AA0',
    dim: '6E6E74', verde: '3CCB7F', verdeBg: '102018', verm: 'EF5350', vermBg: '221213', cinza: '3A3A40' };
  const FONTE = 'Arial';
  const W = 10, MX = 0.5, CW = W - 2 * MX;   // slide 16:9 = 10" x 5,625"

  const n = v => +v || 0;
  const brl = v => n(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace(/ /g, ' ');
  const brl0 = v => n(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0, minimumFractionDigits: 0 }).replace(/ /g, ' ');
  const pct = (v, d = 1) => n(v).toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d }) + '%';
  const int = v => Math.round(n(v)).toLocaleString('pt-BR');
  const varPct = (a, b) => b === null || b === undefined || !n(b) ? null : 100 * (n(a) - n(b)) / Math.abs(n(b));
  const corta = (s, k) => { s = String(s || ''); return s.length > k ? s.slice(0, k - 1).trim() + '…' : s; };
  const primeiro = s => String(s || '').split(/\s+/)[0];

  function gerar(D, PptxGenJS, opcoes = {}) {
    const pres = new PptxGenJS();
    pres.layout = 'LAYOUT_16x9';
    pres.author = 'Painel Barbearia Demo';
    pres.company = 'Barbearia Demo';
    pres.title = 'Fechamento ' + D.titulo;
    const mensal = D.tipo === 'mes', diario = D.tipo === 'dia', TOTAL = 11 + (mensal && D.ano ? 1 : 0);
    let num = 0;

    /* ---------------------------------------------------------- peças */
    const txt = (s, t, o) => s.addText(t, Object.assign({ fontFace: FONTE, color: COR.texto, margin: 0, isTextBox: true, valign: 'top' }, o));
    const caixa = (s, x, y, w, h, o = {}) => s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08,
      fill: { color: o.fill || (o.hi ? COR.ouroBg : o.red ? COR.vermBg : o.green ? COR.verdeBg : COR.card) },
      line: { color: o.line || (o.hi ? COR.ouro : o.red ? '5A2326' : o.green ? '1F4A33' : COR.borda), width: o.hi ? 1.25 : 0.75 } });
    const pilula = (s, x, y, t, o = {}) => {
      const w = o.w || Math.max(0.9, 0.075 * t.length + 0.3);
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.24, rectRadius: 0.05, fill: { color: o.fill || COR.ouro }, line: { color: o.fill || COR.ouro, width: 0 } });
      txt(s, t, { x, y, w, h: 0.24, fontSize: 7.5, bold: true, color: o.color || '15130F', align: 'center', valign: 'middle', charSpacing: 0.5 });
      return w;
    };
    const barra = (s, x, y, w, p, o = {}) => {   // barra de progresso (p em %) com marca opcional da projeção
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h: 0.11, rectRadius: 0.05, fill: { color: COR.cinza }, line: { color: COR.cinza, width: 0 } });
      if (o.proj) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: Math.max(0.12, w * Math.min(100, o.proj) / 100), h: 0.11, rectRadius: 0.05, fill: { color: COR.ouro, transparency: 70 }, line: { color: COR.ouro, width: 0 } });
      if (p > 0) s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: Math.max(0.12, w * Math.min(100, p) / 100), h: 0.11, rectRadius: 0.05, fill: { color: o.cor || (p >= 100 ? COR.verde : COR.ouro) }, line: { color: o.cor || (p >= 100 ? COR.verde : COR.ouro), width: 0 } });
    };
    // variação: "▲ 12,3% vs setembro"
    const varRun = (v, sufixo, o = {}) => {
      if (v === null || v === undefined || !isFinite(v)) return [{ text: o.semAnt || 'sem base de comparação', options: { color: COR.dim } }];
      const eq = Math.abs(v) < 0.05, sobe = v > 0, bom = o.inv ? !sobe : sobe;
      return [{ text: eq ? '= igual' : `${sobe ? '▲' : '▼'} ${pct(Math.abs(v), Math.abs(v) >= 100 ? 0 : 1)}`, options: { color: eq ? COR.mut : bom ? COR.verde : COR.verm, bold: true } },
        { text: sufixo ? '  ' + sufixo : '', options: { color: COR.mut } }];
    };
    function novoSlide(eyebrow, titulo) {
      const s = pres.addSlide(); num++;
      s.background = { color: COR.bg };
      if (eyebrow) txt(s, eyebrow.toUpperCase(), { x: MX, y: 0.32, w: CW, h: 0.22, fontSize: 9, bold: true, color: COR.ouro, charSpacing: 0.5 });
      if (titulo) txt(s, titulo.toUpperCase(), { x: MX, y: 0.55, w: CW, h: 0.5, fontSize: 22, bold: true, color: COR.branco });
      txt(s, `BARBEARIA DEMO · FECHAMENTO ${D.titulo.toUpperCase()}${D.andamento ? ' · PARCIAL' : ''}   ${num}/${TOTAL}`, { x: MX, y: 5.3, w: CW, h: 0.18, fontSize: 7, color: COR.dim, align: 'right', charSpacing: 0.3 });
      return s;
    }
    function frase(s, t, o = {}) {   // caixa de frase-resumo no rodapé (estilo da apresentação)
      const y = o.y || 4.62, h = o.h || 0.5;
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y, w: CW, h, fill: { color: o.fill || COR.card }, line: { color: o.fill || COR.card, width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y, w: 0.05, h, fill: { color: COR.ouro }, line: { color: COR.ouro, width: 0 } });
      txt(s, t, { x: MX + 0.25, y, w: CW - 0.45, h, fontSize: 11, bold: true, color: o.color || COR.branco, valign: 'middle', align: o.align || 'left' });
    }
    function kpi(s, x, y, w, h, rot, val, o = {}) {
      caixa(s, x, y, w, h, o);
      const c = o.compacto ? [0.1, 0.27, 0.32, 0.6] : [0.14, 0.36, 0.4, 0.8];
      txt(s, rot.toUpperCase(), { x: x + 0.18, y: y + c[0], w: w - 0.36, h: 0.2, fontSize: 7.5, bold: true, color: o.hi ? COR.ouro : COR.mut, charSpacing: 0.4 });
      txt(s, val, { x: x + 0.18, y: y + c[1], w: w - 0.36, h: c[2], fontSize: o.size || 18, bold: true, color: o.hi ? COR.ouro : COR.branco, valign: 'middle', fit: 'shrink' });
      if (o.runs) txt(s, o.runs, { x: x + 0.18, y: y + c[3], w: w - 0.36, h: 0.18, fontSize: o.compacto ? 7.5 : 8 });
      if (o.sub) txt(s, o.sub, { x: x + 0.18, y: y + (o.runs ? 1.0 : 0.8), w: w - 0.36, h: 0.2, fontSize: 7.5, color: COR.dim });
    }
    const nomeAnt = mensal ? 'mês anterior' : diario ? (D.barb.antDia ? 'mesmo dia da semana passada' : 'dia anterior') : 'semana anterior';
    const nomeAntCurto = mensal ? 'mês ant.' : diario ? 'sem. passada' : 'sem. ant.';

    /* ---------------------------------------------------------- 1. capa */
    {
      const s = novoSlide('', '');
      if (D.logo) s.addImage({ data: D.logo, x: MX, y: 0.45, w: 2.0, h: 0.72 });
      txt(s, `BARBEARIA DEMO • FECHAMENTO ${mensal ? 'MENSAL' : diario ? 'DIÁRIO' : 'SEMANAL'}`, { x: MX, y: 1.75, w: 5.6, h: 0.25, fontSize: 10, bold: true, color: COR.ouro, charSpacing: 0.5 });
      txt(s, [{ text: 'FECHAMENTO\n', options: { color: COR.branco } }, { text: mensal || diario ? D.titulo.toUpperCase() : D.titulo.replace(/^Semana /, 'DA SEMANA ').toUpperCase(), options: { color: COR.ouro } }],
        { x: MX, y: 2.05, w: 5.6, h: 1.25, fontSize: 32, bold: true, valign: 'top', lineSpacingMultiple: 0.95 });
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 3.45, w: 0.04, h: 0.62, fill: { color: COR.ouro }, line: { color: COR.ouro, width: 0 } });
      txt(s, (diario ? 'Resultado do dia, ao longo do dia, cadeiras, ranking, metas, vendas, top produtos, clube' : mensal ? 'Resultado, ano até agora, dia a dia, cadeiras, ranking, metas, vendas, top produtos, clube' : 'Resultado, dia a dia, cadeiras, ranking, metas, vendas, top produtos, clube') + (D.cultura ? ', cultura' : '') + ', destaques e alertas.', { x: MX + 0.2, y: 3.45, w: 5.2, h: 0.4, fontSize: 11, color: COR.texto });
      txt(s, `${D.periodo} · ${D.parcialTxt} · gerado em ${D.geradoEm}`, { x: MX + 0.2, y: 3.86, w: 5.4, h: 0.2, fontSize: 8, color: COR.mut });
      // resumo à direita
      const b = D.barb, p = b.meta ? 100 * b.fat / b.meta : 0, x = 6.35, w = 3.15;
      caixa(s, x, 1.75, w, 2.35, { hi: true });
      txt(s, ('FATURAMENTO ' + D.doPer.toUpperCase()), { x: x + 0.25, y: 1.95, w: w - 0.5, h: 0.2, fontSize: 8, bold: true, color: COR.ouro, charSpacing: 0.4 });
      txt(s, brl(b.fat), { x: x + 0.25, y: 2.2, w: w - 0.5, h: 0.5, fontSize: 22, bold: true, color: COR.branco, valign: 'middle', fit: 'shrink' });
      txt(s, varRun(varPct(b.fat, b.ant), 'vs ' + nomeAnt), { x: x + 0.25, y: 2.75, w: w - 0.5, h: 0.2, fontSize: 8.5 });
      if (b.meta) {
        barra(s, x + 0.25, 3.18, w - 0.5, p, { proj: b.proj ? 100 * b.proj.total / b.meta : 0 });
        txt(s, [{ text: pct(p, 0), options: { bold: true, color: p >= 100 ? COR.verde : COR.ouro } }, { text: ` da meta de ${brl0(b.meta)}`, options: { color: COR.mut } }], { x: x + 0.25, y: 3.38, w: w - 0.5, h: 0.2, fontSize: 9 });
        if (b.proj) txt(s, `Projeção: ${brl0(b.proj.total)} (${pct(100 * b.proj.total / b.meta, 0)})`, { x: x + 0.25, y: 3.62, w: w - 0.5, h: 0.2, fontSize: 8.5, color: COR.mut });
      } else txt(s, 'Sem meta lançada para o período.', { x: x + 0.25, y: 3.2, w: w - 0.5, h: 0.2, fontSize: 8.5, color: COR.mut });
    }

    /* ---------------------------------------------------------- 2. resultado da barbearia */
    {
      const b = D.barb, p = b.meta ? 100 * b.fat / b.meta : 0, pp = b.proj && b.meta ? 100 * b.proj.total / b.meta : 0, vB = varPct(b.fat, b.ant);
      const s = novoSlide('Resultado consolidado', mensal ? 'Faturamento total da barbearia' : diario ? 'Faturamento da barbearia no dia' : 'Faturamento da barbearia na semana');
      const xL = MX, wL = 4.3, xR = MX + wL + 0.3, wR = CW - wL - 0.3;
      // card realizado
      caixa(s, xL, 1.25, wL, 1.45, { hi: true });
      const st = b.meta ? (b.fat >= b.meta ? 'META ULTRAPASSADA' : D.andamento ? 'EM ANDAMENTO' : 'META NÃO BATIDA') : (D.andamento ? 'EM ANDAMENTO' : 'PERÍODO FECHADO');
      pilula(s, xL + 0.25, 1.42, st, b.meta && !D.andamento && b.fat < b.meta ? { fill: COR.verm, color: COR.branco } : {});
      txt(s, 'FATURAMENTO TOTAL REALIZADO' + (D.andamento ? ' (ATÉ AGORA)' : ''), { x: xL + 0.25, y: 1.76, w: wL - 0.5, h: 0.2, fontSize: 8, bold: true, color: COR.mut });
      txt(s, brl(b.fat), { x: xL + 0.25, y: 1.98, w: wL - 0.5, h: 0.45, fontSize: 26, bold: true, color: COR.ouro, valign: 'middle', fit: 'shrink' });
      txt(s, varRun(vB, 'vs ' + (D.compara || nomeAnt)), { x: xL + 0.25, y: 2.45, w: wL - 0.4, h: 0.2, fontSize: 8 });
      // card meta
      caixa(s, xL, 2.85, wL, 1.55);
      txt(s, 'META ' + D.doPer.toUpperCase(), { x: xL + 0.25, y: 3.0, w: 1.9, h: 0.2, fontSize: 8, bold: true, color: COR.mut });
      txt(s, b.meta ? brl(b.meta) : '—', { x: xL + 0.25, y: 3.2, w: 1.95, h: 0.35, fontSize: 15, bold: true, color: COR.branco, fit: 'shrink' });
      txt(s, b.meta ? (b.fat >= b.meta ? 'ACIMA DA META' : 'FALTAM') : 'ATINGIMENTO', { x: xL + 2.25, y: 3.0, w: 1.8, h: 0.2, fontSize: 8, bold: true, color: COR.mut });
      txt(s, b.meta ? brl(Math.abs(b.meta - b.fat)) : '—', { x: xL + 2.25, y: 3.2, w: 1.8, h: 0.35, fontSize: 15, bold: true, color: b.meta && b.fat >= b.meta ? COR.verde : COR.branco, fit: 'shrink' });
      if (b.meta) { barra(s, xL + 0.25, 3.68, wL - 0.5, p, { proj: pp }); }
      txt(s, b.meta ? [{ text: `Atingimento ${pct(p, 1)}`, options: { bold: true, color: p >= 100 ? COR.verde : COR.ouro } }, { text: pp ? `  ·  projeção ${pct(pp, 0)}` : '', options: { color: COR.mut } }] : 'Sem meta lançada', { x: xL + 0.25, y: 3.86, w: wL - 0.5, h: 0.2, fontSize: 8.5 });
      txt(s, `Comandas ${brl(b.comandas)}  ·  Assinaturas ${brl(b.assinaturas)}`, { x: xL + 0.25, y: 4.1, w: wL - 0.5, h: 0.2, fontSize: 8, color: COR.mut });
      // direita: projeção (se em andamento) + histórico
      let yC = 1.25;
      if (b.proj) {
        caixa(s, xR, 1.25, wR, 1.45);
        txt(s, 'PROJEÇÃO DE FECHAMENTO', { x: xR + 0.25, y: 1.4, w: 2.6, h: 0.2, fontSize: 8, bold: true, color: COR.mut });
        txt(s, brl(b.proj.total), { x: xR + 0.25, y: 1.62, w: 2.7, h: 0.4, fontSize: 20, bold: true, color: COR.branco, valign: 'middle', fit: 'shrink' });
        txt(s, `faixa provável ${brl0(b.proj.lo)} a ${brl0(b.proj.hi)}`, { x: xR + 0.25, y: 2.06, w: 2.8, h: 0.2, fontSize: 8, color: COR.mut });
        if (b.meta) {
          const ok = b.proj.lo >= b.meta ? ['VAI BATER A META', COR.verde] : b.proj.total >= b.meta ? ['DEVE BATER A META', COR.verde] : b.proj.hi >= b.meta ? ['NO LIMITE: PRECISA ACELERAR', COR.ouro] : ['ABAIXO DO RITMO DA META', COR.verm];
          txt(s, pct(pp, 0), { x: xR + wR - 1.45, y: 1.4, w: 1.2, h: 0.45, fontSize: 24, bold: true, color: ok[1], align: 'right' });
          txt(s, 'DA META', { x: xR + wR - 1.45, y: 1.86, w: 1.2, h: 0.18, fontSize: 7, bold: true, color: COR.mut, align: 'right' });
          txt(s, [{ text: ok[0], options: { bold: true, color: ok[1] } }, { text: b.porDia ? `  ·  precisa de ${brl0(b.porDia)}/dia nos ${b.diasRest} dias que faltam` : '', options: { color: COR.mut } }], { x: xR + 0.25, y: 2.35, w: wR - 0.4, h: 0.2, fontSize: 7.5 });
        }
        yC = 2.85;
      }
      caixa(s, xR, yC, wR, 4.4 - yC);
      txt(s, mensal ? 'ÚLTIMOS 6 MESES' : diario ? 'MESMO DIA NAS ÚLTIMAS 6 SEMANAS' : 'ÚLTIMAS 6 SEMANAS', { x: xR + 0.2, y: yC + 0.12, w: 2.5, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut });
      const h = D.hist || [], temMeta = h.some(x => n(x.meta));
      const series = [{ name: 'Faturamento', labels: h.map(x => x.rot), values: h.map(x => Math.round(n(x.fat))) }];
      if (temMeta) series.push({ name: 'Meta', labels: h.map(x => x.rot), values: h.map(x => Math.round(n(x.meta))) });
      s.addChart(pres.charts.BAR, series, { x: xR + 0.1, y: yC + 0.3, w: wR - 0.2, h: 4.4 - yC - 0.38, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 60,
        chartColors: temMeta ? [COR.ouro, '55555C'] : [COR.ouro], showLegend: temMeta, legendPos: 'r', legendFontSize: 7, legendColor: COR.mut, legendFontFace: FONTE,
        catAxisLabelColor: COR.mut, catAxisLabelFontSize: 7, catAxisLabelFontFace: FONTE, catAxisLineShow: false,
        valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
        showValue: !temMeta || h.length <= 4, dataLabelPosition: 'outEnd', dataLabelColor: COR.texto, dataLabelFontSize: 6.5, dataLabelFontFace: FONTE, dataLabelFormatCode: '#,##0' });
      if (h.some(x => /\*$/.test(x.rot))) txt(s, '* em andamento', { x: xR + wR - 1.3, y: yC + 0.12, w: 1.1, h: 0.18, fontSize: 6.5, color: COR.dim, align: 'right' });
      // frase
      let f;
      if (b.meta && b.fat >= b.meta) f = `Meta batida: ${brl(b.fat - b.meta)} acima da meta. Quando a gente vende mais, a gente cresce.`;
      else if (b.meta && b.proj) f = b.proj.total >= b.meta ? `No ritmo atual ${mensal ? 'o mês' : diario ? 'o dia' : 'a semana'} fecha em ${brl0(b.proj.total)}. Manter o ritmo até o fim.` : (b.porDia ? `Faltam ${brl(b.meta - b.fat)}: ${brl0(b.porDia)} por dia de funcionamento para bater a meta.` : `Faltam ${brl(b.meta - b.fat)} para a meta. A projeção indica ${brl0(b.proj.total)}.`);
      else if (b.meta) f = `Faltaram ${brl(b.meta - b.fat)} para a meta (${pct(p, 0)}).`;
      else f = vB === null ? 'Faturamento total do sistema: comandas + assinaturas.' : `${vB >= 0 ? 'Crescimento' : 'Queda'} de ${pct(Math.abs(vB), 1)} em relação ${mensal ? 'ao mês anterior' : diario ? 'a ' + D.compara : 'à semana anterior'}.`;
      frase(s, '“' + f + '”');
    }

    /* ---------------------------------------------------------- tabelas (estilo comum) */
    const TH = o => Object.assign({ fontFace: FONTE, fontSize: 7.5, color: COR.mut, bold: true, fill: { color: COR.bg }, border: { type: 'none' }, valign: 'middle' }, o);
    const TC = o => Object.assign({ fontFace: FONTE, fontSize: 8.5, color: COR.texto, fill: { color: COR.card }, border: [{ type: 'none' }, { type: 'none' }, { pt: 0.5, color: COR.borda }, { type: 'none' }], valign: 'middle' }, o);
    const eixoGraf = { catAxisLabelColor: COR.mut, catAxisLabelFontSize: 7, catAxisLabelFontFace: FONTE, catAxisLineShow: false, valAxisHidden: true, valGridLine: { style: 'none' }, catGridLine: { style: 'none' },
      legendFontSize: 7, legendColor: COR.mut, legendFontFace: FONTE, dataLabelColor: COR.texto, dataLabelFontSize: 6.5, dataLabelFontFace: FONTE, dataLabelFormatCode: '#,##0' };
    const OP = D.operacao || {};
    function kpisOperacao(s, x, y, w, h, extra) {   // coluna de KPIs da operação (atendimentos, ticket, +1)
      const ks = [['Atendimentos', int(OP.atend), varRun(varPct(OP.atend, OP.atendAnt), 'vs ' + nomeAntCurto)],
        ['Ticket médio', brl(OP.ticket), varRun(varPct(OP.ticket, OP.ticketAnt), 'vs ' + nomeAntCurto)]].concat(extra ? [extra] : []);
      const g = 0.15, kh = (h - g * (ks.length - 1)) / ks.length;
      ks.forEach((k, i) => kpi(s, x, y + i * (kh + g), w, kh, k[0], k[1], { runs: k[2], size: 16, compacto: true, hi: k[3] }));
    }

    /* ---------------------------------------------------------- ano até agora (mensal) */
    if (mensal && D.ano) {
      const A = D.ano, s = novoSlide('Crescimento', `${A.ano} até agora`);
      const wk = 2.0, g = 0.15, kh = (3.25 - 3 * g) / 4;
      [['Acumulado no ano', brl0(A.acum), [{ text: `${A.meses.length} ${A.meses.length === 1 ? 'mês' : 'meses'}`, options: { color: COR.dim } }], true],
        ['Média por mês', brl0(A.media), [{ text: 'meses fechados', options: { color: COR.dim } }]],
        ['Melhor mês', A.melhor ? A.melhor.rot : '—', [{ text: A.melhor ? brl0(A.melhor.fat) : '', options: { color: COR.dim } }]],
        ['Tendência', A.tend === null ? '—' : brl0(A.ult3) + '/mês', A.tend === null ? [{ text: 'precisa de 6 meses fechados', options: { color: COR.dim } }] : varRun(A.tend, 'últ. 3 vs 3 ant.')]]
        .forEach((k, i) => kpi(s, MX, 1.2 + i * (kh + g), wk + 0.4, kh, k[0], k[1], { runs: k[2], size: 15, compacto: true, hi: k[3] }));
      const xC = MX + wk + 0.6, wC = CW - wk - 0.6;
      caixa(s, xC, 1.2, wC, 3.25);
      txt(s, 'FATURAMENTO POR MÊS · COMANDAS + ASSINATURAS', { x: xC + 0.2, y: 1.32, w: wC - 0.4, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut });
      const lb = A.meses.map(m => m.rot);
      s.addChart(pres.charts.BAR, [{ name: 'Comandas', labels: lb, values: A.meses.map(m => Math.round(m.comandas)) }, { name: 'Assinaturas', labels: lb, values: A.meses.map(m => Math.round(m.assinaturas)) }],
        Object.assign({ x: xC + 0.1, y: 1.55, w: wC - 0.2, h: 2.82, barDir: 'col', barGrouping: 'stacked', barGapWidthPct: 55, chartColors: [COR.ouro, '6F9BB0'], showLegend: true, legendPos: 'b', showValue: false }, eixoGraf));
      const atual = A.meses[A.meses.length - 1];
      frase(s, '“' + (A.posicao && A.nFech > 1 && !D.andamento ? `${D.titulo} foi o ${A.posicao}º melhor mês de ${A.ano}${A.posicao === 1 ? ' — recorde do ano' : ''}. Acumulado: ${brl0(A.acum)}.` : `Acumulado de ${A.ano}: ${brl0(A.acum)}${atual && atual.parcial ? ` (${atual.rot.replace('*', '')} ainda em andamento)` : ''}.`) + '”');
    }

    /* ---------------------------------------------------------- ritmo: dia a dia / ao longo do dia */
    if (diario) {
      const H = D.horas, s = novoSlide('Ritmo do dia', 'Ao longo do dia');
      const wL = 5.75, xR = MX + wL + 0.25, wR = CW - wL - 0.25;
      caixa(s, MX, 1.2, wL, 3.25);
      if (H) {
        txt(s, [{ text: 'FATURAMENTO ACUMULADO  ', options: { bold: true, color: COR.mut } }, { text: H.atualRot, options: { bold: true, color: COR.ouro } }, { text: '  x  ' + H.antRot, options: { color: COR.mut } }], { x: MX + 0.2, y: 1.32, w: wL - 0.4, h: 0.2, fontSize: 7.5 });
        const nA = H.atual.filter(v => v !== null).length;
        s.addChart(pres.charts.LINE, [{ name: H.antRot, labels: H.rot, values: H.ant }, { name: H.atualRot, labels: H.rot.slice(0, nA), values: H.atual.slice(0, nA) }],
          Object.assign({ x: MX + 0.1, y: 1.55, w: wL - 0.2, h: 2.82, chartColors: ['77777E', COR.ouro], lineSize: 2, lineDataSymbol: 'none', showLegend: true, legendPos: 'b', valAxisHidden: false, valAxisLabelColor: COR.dim, valAxisLabelFontSize: 6.5, valAxisLabelFormatCode: '#,##0', valAxisLineShow: false }, eixoGraf, { valAxisHidden: false }));
      } else txt(s, 'Sem dados por hora para este dia.', { x: MX + 0.2, y: 2.5, w: wL - 0.4, h: 0.3, fontSize: 10, color: COR.mut, align: 'center' });
      const pico = H && H.pico;
      kpisOperacao(s, xR, 1.2, wR, 3.25, ['Horário de pico', pico ? `${pico.h}h às ${pico.h + 1}h` : '—', [{ text: pico ? `${brl0(pico.v)} · ${int(pico.q)} comandas` : 'sem comandas', options: { color: COR.mut } }], true]);
      const b = D.barb;
      frase(s, '“' + (D.fechadoDia ? `Barbearia fechada (${D.fechadoDia}). O que entrou foi de assinaturas.` : `${int(b.qtd || 0)} comandas e ${brl(b.comandas)} em comandas${H && H.primeira ? `, primeira às ${H.primeira}h` : ''}${pico ? `. Pico entre ${pico.h}h e ${pico.h + 1}h` : ''}.`) + '”');
    } else {
      const s = novoSlide('Ritmo ' + (mensal ? 'do mês' : 'da semana'), 'Dia a dia');
      const dias = (D.dias || []).filter(x => mensal || !x.fut), wL = 5.75, xR = MX + wL + 0.25, wR = CW - wL - 0.25;
      if (mensal) {
        caixa(s, MX, 1.2, wL, 1.85);
        txt(s, 'COMANDAS POR DIA', { x: MX + 0.2, y: 1.3, w: 3, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut });
        const dd = dias.filter(x => !x.fut);
        if (dd.length) s.addChart(pres.charts.BAR, [{ name: 'Comandas', labels: dd.map(x => x.rot), values: dd.map(x => Math.round(x.comandas)) }],
          Object.assign({ x: MX + 0.05, y: 1.5, w: wL - 0.1, h: 1.5, barDir: 'col', barGapWidthPct: 35, chartColors: [COR.ouro], showLegend: false, showValue: false }, eixoGraf, { catAxisLabelFontSize: 6 }));
        caixa(s, MX, 3.2, wL, 1.25);
        txt(s, [{ text: 'MÉDIA POR DIA DA SEMANA  ', options: { bold: true, color: COR.mut } }, { text: 'este mês x mês anterior', options: { color: COR.dim } }], { x: MX + 0.2, y: 3.28, w: wL - 0.4, h: 0.2, fontSize: 7.5 });
        const P = D.porDiaSemana;
        if (P) s.addChart(pres.charts.BAR, [{ name: 'Este mês', labels: P.rot, values: P.atual.map(Math.round) }, { name: 'Mês anterior', labels: P.rot, values: P.ant.map(Math.round) }],
          Object.assign({ x: MX + 0.05, y: 3.45, w: wL - 0.1, h: 0.98, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 50, chartColors: [COR.ouro, '55555C'], showLegend: true, legendPos: 'r', showValue: false }, eixoGraf));
      } else {
        caixa(s, MX, 1.2, wL, 3.25);
        txt(s, [{ text: 'COMANDAS POR DIA  ', options: { bold: true, color: COR.mut } }, { text: 'esta semana x semana anterior', options: { color: COR.dim } }], { x: MX + 0.2, y: 1.32, w: wL - 0.4, h: 0.2, fontSize: 7.5 });
        if (dias.length) s.addChart(pres.charts.BAR, [{ name: 'Esta semana', labels: dias.map(x => x.rot + (x.fechado ? ' (fechado)' : '')), values: dias.map(x => Math.round(x.comandas)) }, { name: 'Semana anterior', labels: dias.map(x => x.rot), values: dias.map(x => Math.round(n(x.ant))) }],
          Object.assign({ x: MX + 0.1, y: 1.55, w: wL - 0.2, h: 2.82, barDir: 'col', barGrouping: 'clustered', barGapWidthPct: 45, chartColors: [COR.ouro, '55555C'], showLegend: true, legendPos: 'b', showValue: true }, eixoGraf));
      }
      const md = D.melhorDia, pd = D.piorDia, DS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'], diaTxt = x => { const d = new Date(x.d + 'T12:00:00'); return `${DS[d.getDay()]} ${x.d.slice(8, 10)}/${x.d.slice(5, 7)}`; };
      kpisOperacao(s, xR, 1.2, wR, 3.25, ['Melhor dia', md ? diaTxt(md) : '—', [{ text: md ? `${brl0(md.comandas)} em comandas` : '', options: { color: COR.mut } }].concat(pd && pd !== md ? [{ text: `  ·  mais fraco: ${diaTxt(pd).split(' ')[0]} (${brl0(pd.comandas)})`, options: { color: COR.dim } }] : []), true]);
      const fx = D.fechados || [];
      frase(s, '“' + (OP.diasAbertos ? `Média de ${brl0(OP.porDiaAberto)} em comandas por dia aberto (${OP.diasAbertos} ${OP.diasAbertos === 1 ? 'dia' : 'dias'}).` : 'Sem dias com movimento no período.') + (fx.length ? ` Fechado: ${fx.map(f => f.dia + ' (' + f.motivo + ')').join(', ')}.` : '') + '”');
    }

    /* ---------------------------------------------------------- 3. cadeiras */
    {
      const s = novoSlide('Desempenho financeiro', 'Faturamento das cadeiras');
      const cad = D.cad.slice(0, 6), k = Math.max(1, cad.length), gap = 0.2, w = (CW - gap * (k - 1)) / k, pequeno = k >= 5;
      cad.forEach((c, i) => {
        const x = MX + i * (w + gap), y = 1.3, h = 3.1, lider = i === 0, pM = c.meta ? 100 * c.total / c.meta : 0, vC = varPct(c.total, c.ant);
        caixa(s, x, y, w, h, { hi: lider });
        const rot = lider ? '♛ MAIOR FATURAMENTO' : `${c.pos}º LUGAR`;
        pilula(s, x + (w - Math.min(w - 0.2, lider ? 1.75 : 0.9)) / 2, y + 0.18, rot, lider ? { w: Math.min(w - 0.2, 1.75) } : { w: 0.9, fill: COR.cinza, color: COR.texto });
        txt(s, c.nome, { x: x + 0.1, y: y + 0.52, w: w - 0.2, h: 0.32, fontSize: pequeno ? 12 : 14, bold: true, color: COR.branco, align: 'center', fit: 'shrink' });
        txt(s, brl(c.total), { x: x + 0.1, y: y + 0.86, w: w - 0.2, h: 0.4, fontSize: pequeno ? 14 : 17, bold: true, color: lider ? COR.ouro : COR.branco, align: 'center', valign: 'middle', fit: 'shrink' });
        const mv = c.posAnt && c.posAnt !== c.pos ? (c.posAnt > c.pos ? `  ▲${c.posAnt - c.pos} pos.` : `  ▼${c.pos - c.posAnt} pos.`) : '';
        txt(s, varRun(vC, mv ? '' : 'vs ' + nomeAntCurto).concat(mv ? [{ text: mv, options: { color: c.posAnt > c.pos ? COR.verde : COR.verm } }] : []), { x: x + 0.1, y: y + 1.3, w: w - 0.2, h: 0.2, fontSize: 8, align: 'center' });
        // detalhes
        const linhas = [['Serviços', brl0(c.servicos)], ['Produtos + extras', brl0(c.vendas)], ['Assinaturas', brl0(c.assinaturas)], ['Atendimentos', int(c.atend)], ['Ticket médio', brl0(c.ticket)]];
        linhas.forEach((l, j) => {
          const yy = y + 1.62 + j * 0.2;
          txt(s, l[0], { x: x + 0.18, y: yy, w: w * 0.55, h: 0.18, fontSize: 7.5, color: COR.mut });
          txt(s, l[1], { x: x + w * 0.45, y: yy, w: w * 0.55 - 0.18, h: 0.18, fontSize: 7.5, bold: true, color: COR.texto, align: 'right' });
        });
        if (c.meta) {
          barra(s, x + 0.18, y + 2.72, w - 0.36, pM, { proj: c.proj ? 100 * c.proj / c.meta : 0 });
          txt(s, [{ text: pct(pM, 0), options: { bold: true, color: pM >= 100 ? COR.verde : COR.ouro } }, { text: ' da meta' + (c.proj ? ` · proj. ${pct(100 * c.proj / c.meta, 0)}` : ''), options: { color: COR.mut } }],
            { x: x + 0.1, y: y + 2.86, w: w - 0.2, h: 0.18, fontSize: 7, align: 'center' });
        } else if (c.proj) txt(s, `Projeção ${brl0(c.proj)}`, { x: x + 0.1, y: y + 2.8, w: w - 0.2, h: 0.18, fontSize: 7.5, color: COR.mut, align: 'center' });
      });
      if (!cad.length) txt(s, 'Sem faturamento das cadeiras no período.', { x: MX, y: 2.5, w: CW, h: 0.3, fontSize: 12, color: COR.mut, align: 'center' });
      const somaC = D.cad.reduce((a, c) => a + c.total, 0), media = D.cad.length ? somaC / D.cad.length : 0;
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.62, w: CW, h: 0.5, fill: { color: COR.card }, line: { color: COR.card, width: 0 } });
      s.addShape(pres.shapes.RECTANGLE, { x: MX, y: 4.62, w: 0.05, h: 0.5, fill: { color: COR.ouro }, line: { color: COR.ouro, width: 0 } });
      txt(s, 'FATURAMENTO MÉDIO POR CADEIRA', { x: MX + 0.25, y: 4.62, w: 3.2, h: 0.5, fontSize: 10, bold: true, color: COR.branco, valign: 'middle' });
      txt(s, brl(media), { x: MX + 3.3, y: 4.62, w: 1.9, h: 0.5, fontSize: 14, bold: true, color: COR.ouro, valign: 'middle' });
      txt(s, [{ text: 'SOMA DAS CADEIRAS  ', options: { bold: true, color: COR.mut } }, { text: brl(somaC), options: { bold: true, color: COR.branco } }], { x: MX + 5.3, y: 4.62, w: CW - 5.5, h: 0.5, fontSize: 10, valign: 'middle', align: 'right' });
    }

    /* ---------------------------------------------------------- vendas */
    const V = D.vendas;
    function kpisVendas(s, y) {
      const w = (CW - 0.4) / 3;
      kpi(s, MX, y, w, 1.05, 'Produtos (cosméticos)', brl(V.produtos), { hi: true, runs: varRun(varPct(V.produtos, V.prodAnt), 'vs ' + nomeAnt), size: 17 });
      kpi(s, MX + w + 0.2, y, w, 1.05, 'Extras (procedimentos)', brl(V.extras), { runs: varRun(varPct(V.extras, V.extAnt), 'vs ' + nomeAnt), size: 17 });
      kpi(s, MX + 2 * (w + 0.2), y, w, 1.05, 'Vendas por atendimento', brl(V.porAt), { runs: varRun(varPct(V.porAt, V.porAtAnt), 'vs ' + nomeAnt), size: 17 });
    }
    function listaItens(s, x, y, w, h, titulo, itens, qtd) {
      caixa(s, x, y, w, h);
      txt(s, titulo.toUpperCase(), { x: x + 0.2, y: y + 0.12, w: w - 1.6, h: 0.2, fontSize: 8, bold: true, color: COR.ouro, charSpacing: 0.4 });
      if (qtd) txt(s, `${int(qtd)} unid. no total`, { x: x + w - 1.6, y: y + 0.12, w: 1.4, h: 0.2, fontSize: 7.5, color: COR.dim, align: 'right' });
      if (!itens.length) { txt(s, 'Nenhum item vendido no período.', { x: x + 0.2, y: y + 0.5, w: w - 0.4, h: 0.25, fontSize: 9, color: COR.mut }); return; }
      const max = itens[0].v || 1, lh = Math.min(0.48, (h - 0.45) / itens.length);
      itens.forEach((it, i) => {
        const yy = y + 0.42 + i * lh;
        txt(s, String(i + 1), { x: x + 0.2, y: yy, w: 0.25, h: 0.22, fontSize: 11, bold: true, color: i === 0 ? COR.ouro : COR.mut });
        txt(s, corta(it.item, w > 4 ? 46 : 30), { x: x + 0.5, y: yy, w: w - 1.85, h: 0.2, fontSize: 9, bold: true, color: COR.branco });
        txt(s, `${int(it.q)} unid.${it.quem ? ' · mais vendido por ' + primeiro(it.quem) : ''}`, { x: x + 0.5, y: yy + 0.19, w: w - 1.85, h: 0.16, fontSize: 7, color: COR.mut });
        txt(s, brl(it.v), { x: x + w - 1.35, y: yy, w: 1.15, h: 0.2, fontSize: 9, bold: true, color: i === 0 ? COR.ouro : COR.texto, align: 'right' });
        s.addShape(pres.shapes.RECTANGLE, { x: x + w - 1.35, y: yy + 0.24, w: 1.15, h: 0.05, fill: { color: COR.cinza }, line: { color: COR.cinza, width: 0 } });
        s.addShape(pres.shapes.RECTANGLE, { x: x + w - 1.35, y: yy + 0.24, w: Math.max(0.03, 1.15 * it.v / max), h: 0.05, fill: { color: COR.ouro }, line: { color: COR.ouro, width: 0 } });
      });
    }
    const topV = [...D.cad].sort((a, b) => b.vendas - a.vendas)[0];

    /* ---------------------------------------------------------- ranking por categoria */
    {
      const RK = D.ranking || { crit: [], linhas: [] }, s = novoSlide('Ranking', 'Quem liderou cada critério');
      const fmtR = (k, v) => k === 'Atendimentos' ? int(v) : brl0(v);
      const cab = [{ text: 'PROFISSIONAL', options: TH({ align: 'left' }) }].concat(RK.crit.map(c => ({ text: c.toUpperCase(), options: TH({ align: 'center' }) })));
      const corPos = p => p === 1 ? COR.ouro : p === 2 ? 'C9C9CF' : p === 3 ? 'B7814A' : COR.mut;
      const ls = RK.linhas.slice(0, 6).map(l => [{ text: l.nome, options: TC({ bold: true, color: COR.branco }) }].concat(l.pos.map((p, j) => ({
        text: [{ text: p + 'º', options: { bold: true, color: corPos(p), fontSize: 11, breakLine: true } }, { text: fmtR(RK.crit[j], l.val[j]), options: { color: COR.mut, fontSize: 7 } }],
        options: TC({ align: 'center', fill: { color: p === 1 ? COR.ouroBg : COR.card } }) }))));
      if (ls.length) s.addTable([cab].concat(ls), { x: MX, y: 1.25, w: CW, colW: [1.75].concat(RK.crit.map(() => (CW - 1.75) / RK.crit.length)), rowH: [0.3].concat(ls.map(() => 0.5)), margin: [0.02, 0.06, 0.02, 0.06] });
      else txt(s, 'Sem faturamento das cadeiras no período.', { x: MX, y: 2.5, w: CW, h: 0.3, fontSize: 12, color: COR.mut, align: 'center' });
      txt(s, 'Posição de cada barbeiro em cada critério (1º = maior valor). Ticket = faturamento da cadeira ÷ atendimentos.', { x: MX, y: 4.38, w: CW, h: 0.18, fontSize: 7, color: COR.dim });
      const lid = [...RK.linhas].sort((a, b) => b.ouros - a.ouros)[0];
      frase(s, '“' + (lid && lid.ouros ? `${lid.nome} ficou em 1º em ${lid.ouros} de ${RK.crit.length} critérios.` : 'Ranking do período por critério.') + '”');
    }

    /* ---------------------------------------------------------- metas das cadeiras */
    {
      const M = (D.metasCad || []).slice(0, 6), s = novoSlide('Metas', 'Metas das cadeiras ' + D.doPer);
      const temMeta = M.some(m => m.meta), y0 = 1.25, rh = Math.min(0.55, 3.15 / Math.max(1, M.length));
      if (!M.length) txt(s, 'Sem faturamento das cadeiras no período.', { x: MX, y: 2.5, w: CW, h: 0.3, fontSize: 12, color: COR.mut, align: 'center' });
      [['PROFISSIONAL', MX + 0.2, 1.6, 'left'], ['REALIZADO', MX + 1.85, 1.3, 'right'], ['META', MX + 3.2, 1.25, 'right'], ['ATINGIMENTO', MX + 4.7, 2.6, 'left'], [D.andamento ? 'PROJEÇÃO' : 'RESULTADO', MX + 7.45, 1.4, 'right']]
        .forEach(([t, x, w, al]) => txt(s, t, { x, y: y0, w, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut, align: al }));
      M.forEach((m, i) => {
        const y = y0 + 0.28 + i * rh, p = m.meta ? 100 * m.total / m.meta : 0, ok = m.meta && m.total >= m.meta;
        caixa(s, MX, y, CW, rh - 0.08, ok ? { green: true } : {});
        const yc = y + (rh - 0.08) / 2 - 0.1;
        txt(s, m.nome, { x: MX + 0.2, y: yc, w: 1.6, h: 0.2, fontSize: 9.5, bold: true, color: COR.branco });
        txt(s, brl0(m.total), { x: MX + 1.85, y: yc, w: 1.3, h: 0.2, fontSize: 9.5, bold: true, color: COR.branco, align: 'right' });
        txt(s, m.folga ? 'folga' : m.meta ? brl0(m.meta) : '—', { x: MX + 3.2, y: yc, w: 1.25, h: 0.2, fontSize: 9, color: COR.mut, align: 'right' });
        if (m.meta) { barra(s, MX + 4.7, yc + 0.05, 1.85, p, { proj: m.proj ? 100 * m.proj / m.meta : 0 }); txt(s, pct(p, 0), { x: MX + 6.6, y: yc, w: 0.7, h: 0.2, fontSize: 9.5, bold: true, color: p >= 100 ? COR.verde : COR.ouro }); }
        const res = D.andamento ? (m.proj ? `${brl0(m.proj)} (${m.meta ? pct(100 * m.proj / m.meta, 0) : '—'})` : '—') : !m.meta ? '—' : ok ? `+${brl0(m.total - m.meta)}` : `−${brl0(m.meta - m.total)}`;
        txt(s, res, { x: MX + 7.45, y: yc, w: 1.4, h: 0.2, fontSize: 8.5, bold: true, color: !D.andamento && m.meta ? (ok ? COR.verde : COR.verm) : COR.texto, align: 'right' });
      });
      txt(s, mensal ? 'Meta do mês lançada pelo dono. Faixa clara na barra = projeção de fechamento.' : `Meta ${D.doPer} = o que cada barbeiro costuma faturar ${diario ? 'nesse dia da semana' : 'nos seus dias de trabalho'} (média das últimas semanas, com o clube) + 5%.`, { x: MX, y: 4.38, w: CW, h: 0.18, fontSize: 7, color: COR.dim });
      const bat = M.filter(m => m.meta && m.total >= m.meta);
      frase(s, '“' + (!temMeta ? 'Sem metas para o período.' : bat.length ? `${bat.length} de ${M.filter(m => m.meta).length} ${bat.length === 1 ? 'cadeira bateu' : 'cadeiras bateram'} a meta ${D.doPer}: ${bat.map(m => primeiro(m.nome)).join(', ')}.` : D.andamento ? `Período em andamento: ninguém bateu a meta ${D.doPer} ainda.` : `Nenhuma cadeira bateu a meta ${D.doPer}.`) + '”');
    }

    /* ---------------------------------------------------------- vendas por cadeira */
    {
      const s = novoSlide('Performance comercial', 'Vendas: produtos + extras');
      kpisVendas(s, 1.2);
      const cab = mensal ? ['Profissional', 'Produtos', 'Mínimo', 'Extras', 'Mínimo', 'Vendas', 'Var.', '% da cadeira'] : ['Profissional', 'Produtos', 'Extras', 'Vendas', 'Var.', 'Atend.', 'Vendas/atend.', '% da cadeira'];
      const ok = (v, min) => !min ? COR.texto : v >= min ? COR.verde : COR.ouro;
      const linhasT = [...D.cad].sort((a, b) => b.vendas - a.vendas).slice(0, 6).map((c, i) => {
        const vv = varPct(c.vendas, c.vendasAnt), r = varRun(vv)[0], nome = { text: c.nome, options: TC({ bold: true, color: i === 0 ? COR.ouro : COR.branco }) };
        const vr = { text: vv === null ? '—' : r.text, options: TC({ align: 'right', color: vv === null ? COR.dim : r.options.color, bold: true }) }, pc = { text: c.total ? pct(100 * c.vendas / c.total, 0) : '—', options: TC({ align: 'right' }) };
        return mensal ? [nome, { text: brl(c.produtos), options: TC({ align: 'right', color: ok(c.produtos, c.minProd), bold: !!c.minProd }) }, { text: c.minProd ? brl0(c.minProd) : '—', options: TC({ align: 'right', color: COR.dim }) },
          { text: brl(c.extras), options: TC({ align: 'right', color: ok(c.extras, c.minExtras), bold: !!c.minExtras }) }, { text: c.minExtras ? brl0(c.minExtras) : '—', options: TC({ align: 'right', color: COR.dim }) },
          { text: brl(c.vendas), options: TC({ align: 'right', bold: true, color: COR.branco }) }, vr, pc]
          : [nome, { text: brl(c.produtos), options: TC({ align: 'right' }) }, { text: brl(c.extras), options: TC({ align: 'right' }) }, { text: brl(c.vendas), options: TC({ align: 'right', bold: true, color: COR.branco }) }, vr,
            { text: int(c.atend), options: TC({ align: 'right' }) }, { text: c.atend ? brl(c.vendas / c.atend) : '—', options: TC({ align: 'right' }) }, pc];
      });
      if (linhasT.length) s.addTable([cab.map((t, i) => ({ text: t.toUpperCase(), options: TH({ align: i ? 'right' : 'left' }) }))].concat(linhasT),
        { x: MX, y: 2.42, w: CW, colW: [1.6, 1.15, 1.05, 1.05, 1.0, 1.15, 0.9, 1.1], rowH: 0.27, margin: [0, 0.08, 0, 0.08] });
      txt(s, (mensal ? 'Verde = mínimo atingido · dourado = abaixo do mínimo' + (D.andamento ? ' (mês em andamento)' : '') + '. ' : '') + 'Variação de vendas vs ' + nomeAnt + '.', { x: MX, y: 4.38, w: CW, h: 0.18, fontSize: 7, color: COR.dim });
      frase(s, topV && topV.vendas ? `“${topV.nome} é o destaque em vendas: ${brl(topV.vendas)} em produtos + extras${topV !== D.cad[0] && D.cad[0] ? `, enquanto ${D.cad[0].nome} lidera o faturamento da cadeira` : ''}.”` : '“Sem venda de produtos e extras registrada no período.”');
    }
    /* ---------------------------------------------------------- top produtos e extras */
    {
      const s5 = novoSlide('O que mais vendeu', 'Top produtos e extras');
      const w2 = (CW - 0.3) / 2;
      listaItens(s5, MX, 1.25, w2, 3.2, 'Top 5 produtos', V.topProd, V.qtdProd);
      listaItens(s5, MX + w2 + 0.3, 1.25, w2, 3.2, 'Top 5 extras', V.topExtras, V.qtdExtras);
      const tp = V.topProd[0], te = V.topExtras[0];
      frase(s5, tp ? `“${tp.item} foi o produto mais vendido (${int(tp.q)} unid.)${te ? `; ${te.item} lidera os extras` : ''}.”` : te ? `“${te.item} lidera os extras (${int(te.q)}x). Nenhum produto vendido no período.”` : '“Sem venda de produtos e extras registrada no período.”');
    }

    /* ---------------------------------------------------------- clube */
    const CL = D.clube;
    function blocoClube(s, x, y, w, h, compacto) {
      const kw = compacto ? (w - 0.2) / 2 : (w - 0.6) / 4, kh = compacto ? 0.85 : 1.05, kg = compacto ? 0.12 : 0.2;
      const ks = [['Faturamento do clube', brl(CL.fat), varRun(varPct(CL.fat, CL.ant), 'vs ' + nomeAnt), true],
        [`Pote (${pct(100 * CL.potePct, 0)})`, brl(CL.pote), [{ text: 'dividido pela participação', options: { color: COR.dim } }]],
        ['Atendimentos de clube', int(CL.atend), varRun(varPct(CL.atend, CL.atendAnt), 'vs ' + nomeAnt)],
        ['Receita por atendimento', brl(CL.porAtend), [{ text: 'assinaturas ÷ atendimentos', options: { color: COR.dim } }]]];
      ks.forEach((k, i) => {
        const xx = compacto ? x + (i % 2) * (kw + 0.2) : x + i * (kw + 0.2), yy = compacto ? y + Math.floor(i / 2) * (kh + kg) : y;
        kpi(s, xx, yy, kw, kh, k[0], k[1], { hi: k[3], runs: k[2], size: compacto ? 13 : 16, compacto });
      });
      const yT = compacto ? y + 2 * (kh + kg) : y + kh + 0.2, hT = y + h - yT;
      caixa(s, x, yT, w, hT);
      txt(s, 'PARTICIPAÇÃO NO POTE', { x: x + 0.2, y: yT + 0.12, w: 3, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut, charSpacing: 0.4 });
      const ls = CL.linhas.slice(0, 6), lh = Math.min(0.32, (hT - 0.5) / Math.max(1, ls.length)), maxP = Math.max(1, ...ls.map(l => l.part));
      ls.forEach((l, i) => {
        const yy = yT + 0.42 + i * lh, bw = compacto ? w - 3.35 : w - 4.6;
        txt(s, l.nome, { x: x + 0.2, y: yy, w: 1.45, h: 0.2, fontSize: 8.5, bold: true, color: i === 0 ? COR.ouro : COR.branco });
        s.addShape(pres.shapes.RECTANGLE, { x: x + 1.7, y: yy + 0.06, w: Math.max(0.03, bw * l.part / maxP), h: 0.1, fill: { color: i === 0 ? COR.ouro : '8A6A2E' }, line: { width: 0, color: COR.bg } });
        txt(s, pct(l.part, 1), { x: x + 1.75 + bw * l.part / maxP, y: yy, w: 0.6, h: 0.2, fontSize: 8, bold: true, color: COR.texto });
        txt(s, compacto ? brl0(l.comissao) : `${brl(l.fat)} · comissão ${brl(l.comissao)} · ${int(l.atend)} atend.`, { x: x + w - (compacto ? 1.05 : 2.75), y: yy, w: compacto ? 0.85 : 2.55, h: 0.2, fontSize: 7.5, color: COR.mut, align: 'right' });
      });
      if (!ls.length) txt(s, 'Sem atendimentos de clube no período.', { x: x + 0.2, y: yT + 0.45, w: w - 0.4, h: 0.2, fontSize: 9, color: COR.mut });
      if (compacto && ls.length) txt(s, 'comissão', { x: x + w - 1.05, y: yT + 0.12, w: 0.85, h: 0.2, fontSize: 7, color: COR.dim, align: 'right' });
    }
    /* ---------------------------------------------------------- cultura */
    const CU = D.cultura;
    const stCult = (p, lim) => { const r = lim ? p / lim : 0; return !p ? ['SEM OCORRÊNCIAS', COR.verde] : r >= 1 ? ['LIMITE ATINGIDO', COR.verm] : r > .75 ? ['CRÍTICO', COR.verm] : r > .5 ? ['ATENÇÃO', COR.ouro] : r > .25 ? ['BOM', COR.verde] : ['EXCELENTE', COR.verde]; };
    function blocoCultura(s, x, y, w, h, compacto) {
      if (!CU) { caixa(s, x, y, w, h); txt(s, 'Cultura indisponível.', { x: x + 0.2, y: y + 0.2, w: w - 0.4, h: 0.3, fontSize: 10, color: COR.mut }); return; }
      const ls = CU.linhas.slice(0, 6);
      if (compacto) {
        caixa(s, x, y, w, h);
        txt(s, `PONTUAÇÃO · ${CU.nome.toUpperCase()} (ATÉ ${CU.ate})`, { x: x + 0.2, y: y + 0.12, w: w - 0.4, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut, charSpacing: 0.3, fit: 'shrink' });
        const lh = Math.min(0.5, (h - 0.95) / Math.max(1, ls.length));
        ls.forEach((l, i) => {
          const yy = y + 0.45 + i * lh, st = stCult(l.pts, CU.limite);
          txt(s, l.nome, { x: x + 0.2, y: yy, w: 1.6, h: 0.2, fontSize: 9, bold: true, color: COR.branco });
          txt(s, [{ text: String(l.pts), options: { bold: true, color: st[1] } }, { text: `/${CU.limite} pts`, options: { color: COR.mut } }], { x: x + w - 1.3, y: yy, w: 1.1, h: 0.2, fontSize: 9, align: 'right' });
          barra(s, x + 0.2, yy + 0.24, w - 0.4, 100 * l.pts / CU.limite, { cor: st[1] });
        });
        txt(s, `${CU.ocPer} ${CU.ocPer === 1 ? 'ocorrência' : 'ocorrências'} ${diario ? 'neste dia' : mensal ? 'neste mês' : 'nesta semana'} (+${CU.ptsPer} pts) · limite de desclassificação: ${CU.limite} pontos · quanto menor, melhor.`, { x: x + 0.2, y: y + h - 0.42, w: w - 0.4, h: 0.32, fontSize: 7.5, color: COR.mut });
        return;
      }
      const k = Math.max(1, ls.length), gap = 0.2, cw = (w - gap * (k - 1)) / k;
      ls.forEach((l, i) => {
        const xx = x + i * (cw + gap), st = stCult(l.pts, CU.limite), ruim = st[1] === COR.verm;
        caixa(s, xx, y, cw, 1.75, { red: ruim });
        txt(s, l.nome.toUpperCase(), { x: xx + 0.18, y: y + 0.18, w: cw - 0.36, h: 0.25, fontSize: 11, bold: true, color: COR.branco, fit: 'shrink' });
        txt(s, [{ text: String(l.pts), options: { bold: true, color: st[1], fontSize: 26 } }, { text: ` / ${CU.limite} pts`, options: { color: COR.mut, fontSize: 9 } }], { x: xx + 0.18, y: y + 0.5, w: cw - 0.36, h: 0.5, valign: 'middle' });
        barra(s, xx + 0.18, y + 1.1, cw - 0.36, 100 * l.pts / CU.limite, { cor: st[1] });
        txt(s, [{ text: st[0], options: { bold: true, color: st[1] } }, { text: l.qtd ? `  ·  ${l.qtd} ${l.qtd === 1 ? 'ocorrência' : 'ocorrências'}` : '', options: { color: COR.mut } }], { x: xx + 0.18, y: y + 1.32, w: cw - 0.36, h: 0.2, fontSize: 7.5 });
      });
      const yC = y + 1.95; caixa(s, x, yC, w, h - 1.95);
      txt(s, 'OCORRÊNCIAS MAIS COMUNS', { x: x + 0.2, y: yC + 0.12, w: 3, h: 0.2, fontSize: 7.5, bold: true, color: COR.mut, charSpacing: 0.4 });
      if (!CU.porCat.length) txt(s, 'Nenhuma ocorrência lançada no período. Padrão mantido por toda a equipe.', { x: x + 0.2, y: yC + 0.4, w: w - 0.4, h: 0.25, fontSize: 9.5, color: COR.verde, bold: true });
      CU.porCat.forEach((c, i) => {
        const xx = x + 0.2 + (i % 2) * (w / 2), yy = yC + 0.4 + Math.floor(i / 2) * 0.28;
        txt(s, [{ text: `+${c.pts} pts  `, options: { bold: true, color: COR.verm } }, { text: `${corta(c.nome, 38)} (${c.qtd}x)`, options: { color: COR.texto } }], { x: xx, y: yy, w: w / 2 - 0.3, h: 0.22, fontSize: 9 });
      });
    }

    {
      const s6 = novoSlide('Assinaturas', 'Clube e divisão do pote');
      blocoClube(s6, MX, 1.2, CW, 3.25, false);
      const top = CL.linhas[0], vC = varPct(CL.fat, CL.ant);
      frase(s6, top ? `“${top.nome} tem a maior participação no pote (${pct(top.part, 1)}). Clube ${vC === null ? 'sem base de comparação' : vC >= 0 ? `cresceu ${pct(vC, 1)}` : `caiu ${pct(Math.abs(vC), 1)}`} vs ${nomeAnt}.”` : '“Assinaturas são receita garantida: cuidar do assinante é cuidar do caixa.”');

      const s7 = novoSlide('Acompanhamento de conduta e padrão', 'Pontuação de cultura');
      blocoCultura(s7, MX, 1.2, CW, 3.25, false);
      frase(s7, CU ? `“${CU.ocPer ? `${CU.ocPer} ${CU.ocPer === 1 ? 'ocorrência' : 'ocorrências'} ${diario ? 'neste dia' : mensal ? 'neste mês' : 'nesta semana'} (+${CU.ptsPer} pts). ` : `Nenhuma ocorrência ${diario ? 'neste dia' : mensal ? 'neste mês' : 'nesta semana'}. `}Limite: ${CU.limite} pontos.”` : '“Alta performance = padrão + postura + responsabilidade.”');
    }

    /* ---------------------------------------------------------- destaques e alertas */
    {
      const s = novoSlide('Leitura do período', 'Pontos de destaque e de atenção');
      const w2 = (CW - 0.3) / 2;
      [[D.destaques, 'DESTAQUES', COR.verde, '✓', 'Nenhum destaque automático neste período.', { green: true }],
        [D.alertas, 'PONTOS DE ATENÇÃO', COR.verm, '!', 'Nenhum ponto de atenção. Tudo dentro do esperado.', { red: true }]].forEach(([lista, tit, cor, sim, vazio, est], c) => {
        const x = MX + c * (w2 + 0.3), y = 1.2, h = 3.25;
        caixa(s, x, y, w2, h, est);
        txt(s, tit, { x: x + 0.25, y: y + 0.16, w: w2 - 0.5, h: 0.22, fontSize: 10, bold: true, color: cor, charSpacing: 0.5 });
        if (!lista.length) txt(s, vazio, { x: x + 0.25, y: y + 0.55, w: w2 - 0.5, h: 0.3, fontSize: 9.5, color: COR.mut });
        const lh = Math.min(0.56, (h - 0.6) / Math.max(1, lista.length));
        lista.forEach(([t, d], i) => {
          const yy = y + 0.52 + i * lh;
          s.addShape(pres.shapes.OVAL, { x: x + 0.25, y: yy + 0.02, w: 0.22, h: 0.22, fill: { color: cor }, line: { color: cor, width: 0 } });
          txt(s, sim, { x: x + 0.25, y: yy + 0.02, w: 0.22, h: 0.22, fontSize: 9, bold: true, color: COR.bg, align: 'center', valign: 'middle' });
          txt(s, t, { x: x + 0.6, y: yy, w: w2 - 0.85, h: 0.2, fontSize: 9.5, bold: true, color: COR.branco, fit: 'shrink' });
          txt(s, d, { x: x + 0.6, y: yy + 0.19, w: w2 - 0.85, h: Math.max(0.18, lh - 0.22), fontSize: lista.length > 5 ? 7 : 7.5, color: COR.mut, fit: 'shrink' });
        });
      });
      frase(s, '“RESULTADO NÃO ACONTECE POR ACASO.”', { color: COR.ouro, align: 'center' });
    }

    const nome = 'Barbearia_Demo_Fechamento_' + (mensal ? D.titulo.replace(/ de /, '_') : D.titulo.replace(/,/g, '').replace(/\//g, '-')).replace(/\s+/g, '_') + (D.andamento ? '_parcial' : '') + '.pptx';
    if (opcoes.blob) return pres.write({ outputType: 'blob' }).then(blob => ({ nome, blob }));
    return pres.writeFile({ fileName: nome }).then(() => nome);
  }

  const api = { gerar };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  raiz.RelatorioPPT = api;
})(typeof window !== 'undefined' ? window : globalThis);
