// Simula o supabase-js v2 (só o necessário para o painel) com dados locais.
(function () {
  const DB = window.__MOCK_DB;
  const USERS = { marcos: '11111111-1111-1111-1111-111111111111', diego: '22222222-2222-2222-2222-222222222222' };
  let session = null; const subs = [];
  const emit = (ev) => subs.forEach(f => f(ev, session));
  class Q {
    constructor(t) { this.t = t; this.f = []; this.lim = null; this.ord = null; this.single = false; this.op = 'select'; }
    select() { return this; }
    eq(c, v) { this.f.push(r => r[c] === v); return this; }
    gte(c, v) { this.f.push(r => r[c] >= v); return this; }
    lte(c, v) { this.f.push(r => r[c] <= v); return this; }
    order(c, o) { this.ord = [c, o && o.ascending === false ? -1 : 1]; return this; }
    limit(n) { this.lim = n; return this; }
    maybeSingle() { this.single = true; return this; }
    upsert(rows) { this.op = 'upsert'; this.rows = [].concat(rows); return this; }
    update(p) { this.op = 'update'; this.patch = p; return this; }
    insert(rows) { this.op = 'insert'; this.rows = [].concat(rows); return this; }
    delete() { this.op = 'delete'; return this; }
    then(res, rej) {
      try {
        const tab = DB[this.t] || (DB[this.t] = []);
        if (this.op === 'upsert') {
          this.rows.forEach(r => { const k = this.t === 'cultura_config' ? (x => x.id === r.id) : this.t === 'metas_barbeiro' ? (x => x.mes === r.mes && x.profissional === r.profissional) : (x => x.mes === r.mes);
            const i = tab.findIndex(k); if (i >= 0) tab[i] = { ...tab[i], ...r }; else tab.push(r);
            if (this.t === 'metas_barbearia') { const rb = DB.resultado_barbearia.find(x => x.mes === r.mes); if (rb) rb.meta = r.meta; } });
          return Promise.resolve({ data: null, error: null }).then(res, rej);
        }
        if (this.op === 'insert') { const ins = this.rows.map(r => ({ id: (window.__seq = (window.__seq || 100) + 1), criado_em: new Date().toISOString(), lancado_nome: 'Marcos Nogueira', ...r })); tab.push(...ins); return Promise.resolve({ data: ins, error: null }).then(res, rej); }
        if (this.op === 'delete') { for (let i = tab.length - 1; i >= 0; i--) if (this.f.every(f => f(tab[i]))) tab.splice(i, 1); return Promise.resolve({ data: null, error: null }).then(res, rej); }
        let out = tab.filter(r => this.f.every(f => f(r)));
        if (this.op === 'update') { out.forEach(r => Object.assign(r, this.patch)); return Promise.resolve({ data: null, error: null }).then(res, rej); }
        if (this.ord) { const [c, d] = this.ord; out = [...out].sort((a, b) => (a[c] > b[c] ? 1 : -1) * d); }
        if (this.lim) out = out.slice(0, this.lim);
        return Promise.resolve({ data: this.single ? (out[0] || null) : out, error: null }).then(res, rej);
      } catch (e) { return Promise.resolve({ data: null, error: e }).then(res, rej); }
    }
  }
  window.supabase = {
    createClient() {
      return {
        from: t => new Q(t),
        rpc(nome, a) {   // simula: mesma linha do mês anterior x 0,25 (completo) para testar o modo 'mesmos dias'
          const mes = a.p_inicio.slice(0, 7) + '-01';
          if (window.__RPC_FALHA) return Promise.resolve({ data: null, error: { message: 'function not found' } });
          if (nome === 'resultado_janela') { const r = DB.resultado_barbearia.find(x => x.mes === mes); return Promise.resolve({ data: r ? [{ faturamento_total: r.faturamento_total * .25 }] : [], error: null }); }
          const rows = DB.painel_mensal.filter(x => x.mes === mes).map(x => ({ profissional: x.profissional, servicos: x.servicos * .25, produtos: x.produtos * .25, extras: x.extras * .25, assinaturas: x.assinaturas * .25,
            participacao_pct: x.participacao_pct, comissao_pote: x.comissao_pote * .25, atendimentos_clube: Math.round(x.atendimentos_clube * .25), atendimentos: Math.round(x.atendimentos * .25), completo: true }));
          return Promise.resolve({ data: rows, error: null });
        },
        functions: { async invoke(nome, { body }) {
          const P = DB.perfis;
          if (body.acao === 'criar') { if (P.some(x => x.login === body.login)) return { data: null, error: { message: 'x', context: { json: async () => ({ erro: 'Já existe alguém com esse login.' }) } } };
            const { acao, senha, ...r } = body; P.push({ id: 'n' + Date.now(), ativo: true, ...r }); return { data: { ok: true }, error: null }; }
          if (body.acao === 'excluir') { const i = P.findIndex(x => x.id === body.id); P.splice(i, 1); return { data: { ok: true }, error: null }; }
          return { data: { ok: true }, error: null }; } },
        auth: {
          onAuthStateChange(f) { subs.push(f); setTimeout(() => f('INITIAL_SESSION', session), 0); return { data: { subscription: { unsubscribe() { } } } }; },
          async signInWithPassword({ email, password }) {
            const login = email.split('@')[0];
            if (!USERS[login] || password !== 'teste123') return { error: { message: 'Invalid login' } };
            session = { user: { id: USERS[login] } }; setTimeout(() => emit('SIGNED_IN'), 0); return { data: { session }, error: null };
          },
          async signOut() { session = null; setTimeout(() => emit('SIGNED_OUT'), 0); return { error: null }; },
          async updateUser() { return { error: null }; }
        }
      };
    }
  };
})();
