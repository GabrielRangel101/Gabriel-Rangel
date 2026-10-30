// DEMO: relógio congelado em 09/10/2026 15:20 (horário de Brasília) e fuso fixo UTC-3,
// para os números fictícios não "envelhecerem" e o horário ser igual em qualquer país.
(function () {
  var D = Date, OFF = -3 * 3600000, DELTA = D.parse('2026-10-09T15:20:00-03:00') - D.now(), P = D.prototype;
  var view = function (d) { return new D(P.getTime.call(d) + OFF); };
  var get = { getFullYear: 'getUTCFullYear', getMonth: 'getUTCMonth', getDate: 'getUTCDate', getDay: 'getUTCDay', getHours: 'getUTCHours', getMinutes: 'getUTCMinutes', getSeconds: 'getUTCSeconds', getMilliseconds: 'getUTCMilliseconds' };
  Object.keys(get).forEach(function (k) { P[k] = function () { return P[get[k]].call(view(this)); }; });
  var set = { setFullYear: 'setUTCFullYear', setMonth: 'setUTCMonth', setDate: 'setUTCDate', setHours: 'setUTCHours', setMinutes: 'setUTCMinutes', setSeconds: 'setUTCSeconds' };
  Object.keys(set).forEach(function (k) { P[k] = function () { var v = view(this); P[set[k]].apply(v, arguments); return P.setTime.call(this, P.getTime.call(v) - OFF); }; });
  P.getTimezoneOffset = function () { return 180; };
  ['toLocaleDateString', 'toLocaleTimeString', 'toLocaleString'].forEach(function (k) {
    var o = P[k]; P[k] = function (l, opt) { return o.call(this, l, Object.assign({ timeZone: 'America/Sao_Paulo' }, opt || {})); };
  });
  function F(a, b, c, d, e, f, g) {
    if (!(this instanceof F)) return new F().toString();
    var n = arguments.length, t;
    if (n === 0) t = D.now() + DELTA;
    else if (n === 1) {
      if (a instanceof D) t = P.getTime.call(a);
      else if (typeof a === 'string') t = /^\d{4}-\d{2}-\d{2}T[\d:.]+$/.test(a) ? D.parse(a + '-03:00') : D.parse(a);
      else t = +a;
    } else t = D.UTC(a, b, c === undefined ? 1 : c, d || 0, e || 0, f || 0, g || 0) - OFF;
    return new D(t);
  }
  F.prototype = P; F.now = function () { return D.now() + DELTA; }; F.parse = D.parse; F.UTC = D.UTC;
  window.Date = F;
})();
