/* GDPR consent (client request 2026-10-20, Isabelle Claus Teixeira).
   Adds the two marketing-consent boxes + the withdrawal notice to EVERY form on the page that collects an
   email address (forms drawn later by JavaScript too), and gates ticket links (Stripe, webshops, PayPal, Wise)
   behind the same two boxes.
   - Event / registration / ticket forms: BOTH boxes required (the form cannot be sent until ticked).
   - Newsletter sign-up (email only): box 1 required, box 2 optional.
   - Contact / enquiry / booking forms: both optional (unticked by default).
   The choice is written into a hidden field "gdpr_consent" in the form (sent with the lead) and kept in
   window.gdprConsentSummary() for the forms that build their payload by hand. A form sent with both boxes
   ticked, or the ticket pop-up, remembers the consent on this browser so the payment links open directly. */
(function () {
  'use strict';
  var PRIVACY = '/privacy#partners';
  var COMPANY = 'Business &amp; Human Development Consulting Pte Ltd';
  var EMAIL = 'bonjour@bhdasia.com';
  var KEY = 'gdpr-consent-v1';
  var TICKET = 'a[href*="buy.stripe.com"],a[href*="checkout.stripe.com"],a[href*="atelierdesuflet.ro/"][href$=".html"],a[href*="paypal.com"],a[href*="paypal.me"],a[href*="wise.com/pay"],a[href*="eventbrite."],a[data-ticket]';

  var TXT_MKT = 'I agree to receive newsletters, promotional offers, and direct marketing communications from ' + COMPANY + ' via email and SMS.';
  var TXT_JV = 'I agree that ' + COMPANY + ' may share my personal contact details (email and phone number) with our trusted partners, associates, and joint venture (JV) partners so they may send me marketing communications directly. You can view our full list of partner categories in our <a href="' + PRIVACY + '" target="_blank" rel="noopener">Privacy Policy</a>.';
  var TXT_NOTE = 'You can withdraw your consent or unsubscribe at any time by clicking the &ldquo;Unsubscribe&rdquo; link at the bottom of any marketing email or by contacting us at <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>. For more information on how we handle your personal data, please read our <a href="' + PRIVACY + '" target="_blank" rel="noopener">Privacy Policy</a>.';

  function store(v) {
    try { if (v === undefined) return JSON.parse(localStorage.getItem(KEY) || 'null'); localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
    return null;
  }
  function both() { var s = store(); return !!(s && s.m && s.p); }
  function summary(m, p, ts) {
    return 'Marketing email/SMS: ' + (m ? 'YES' : 'no') + ' | Share with partners/JV: ' + (p ? 'YES' : 'no') + ' | ' + (ts || new Date().toISOString());
  }
  var last = '';
  window.gdprConsentSummary = function (form) {
    if (form) { var h = form.querySelector('input[name="gdpr_consent"]'); if (h && h.value) return h.value; }
    return last;
  };

  function css() {
    if (document.getElementById('gdpr-css')) return;
    var s = document.createElement('style'); s.id = 'gdpr-css';
    s.textContent =
      '.gdpr-box{display:flex;flex-direction:column;gap:.55rem;margin:.35rem 0 .9rem;flex:1 1 100%;width:100%;grid-column:1/-1;text-align:left;font-size:13px;line-height:1.5;color:inherit;text-transform:none;letter-spacing:0;font-weight:400}' +
      '.gdpr-box label{display:flex!important;gap:.6rem;align-items:flex-start;cursor:pointer;margin:0;font:inherit;color:inherit;text-transform:none;letter-spacing:0;font-weight:400;width:auto}' +
      '.gdpr-box input[type=checkbox]{flex:0 0 auto;width:18px!important;height:18px!important;min-width:18px;margin:.1rem 0 0!important;padding:0!important;accent-color:currentColor;cursor:pointer;appearance:auto;-webkit-appearance:checkbox}' +
      '.gdpr-box span{flex:1;min-width:0;overflow-wrap:anywhere}' +
      '.gdpr-box b.gdpr-req{color:#c0392b;font-weight:700}' +
      '.gdpr-box a,.gdpr-pop a{color:inherit;text-decoration:underline;font-weight:600}' +
      '.gdpr-note{margin:0;opacity:.85;font-size:12px}' +
      '.gdpr-err{margin:0;color:#c0392b;font-weight:600;font-size:12.5px}' +
      '.gdpr-pop{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(10,20,35,.6)}' +
      '.gdpr-pop>div{background:#fff;color:#1d2433;max-width:520px;width:100%;max-height:calc(100vh - 32px);overflow:auto;border-radius:14px;padding:22px 22px 18px;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:inherit}' +
      '.gdpr-pop h2{font-size:19px;line-height:1.3;margin:0 0 6px;color:#1d2433}' +
      '.gdpr-pop p.gdpr-lead{font-size:14px;margin:0 0 12px;color:#4a5263}' +
      '.gdpr-pop .gdpr-box{color:#1d2433;margin-bottom:14px}' +
      '.gdpr-acts{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
      '.gdpr-acts button{font:inherit;font-size:14px;font-weight:700;border-radius:8px;padding:10px 16px;cursor:pointer;border:1px solid #1d2433}' +
      '.gdpr-go{background:#1d2433;color:#fff}.gdpr-go[disabled]{opacity:.45;cursor:not-allowed}' +
      '.gdpr-no{background:#fff;color:#1d2433}' +
      '.gdpr-pop button:focus-visible,.gdpr-box input:focus-visible{outline:2px solid #e0a800;outline-offset:2px}';
    document.head.appendChild(s);
  }

  /* what kind of form is this? */
  function kind(form) {
    var fields = Array.prototype.filter.call(form.querySelectorAll('input,textarea,select'), function (f) {
      return f.type !== 'hidden' && f.type !== 'checkbox' && f.type !== 'radio' && f.type !== 'submit' && f.type !== 'button' && f.name !== '_honey' && f.style.display !== 'none';
    });
    if (fields.length === 1 && fields[0].type === 'email') return 'news';
    var path = location.pathname.toLowerCase();
    if (form.id === 'evt-reg-form' || form.hasAttribute('data-gform') || form.closest('.dt-gate,#register,.evt-reg,.reg-step1,#reg-step1') ||
        /event|ticket|certification|module|register/.test(path)) return 'reg';
    return 'enq';
  }

  function box(req1, req2, idp) {
    var d = document.createElement('div'); d.className = 'gdpr-box';
    var star = ' <b class="gdpr-req" aria-hidden="true">*</b>';
    d.innerHTML =
      '<label><input type="checkbox" data-gdpr="m"' + (req1 ? ' required aria-required="true"' : '') + ' id="' + idp + 'm"><span>' + TXT_MKT + (req1 ? star : '') + '</span></label>' +
      '<label><input type="checkbox" data-gdpr="p"' + (req2 ? ' required aria-required="true"' : '') + ' id="' + idp + 'p"><span>' + TXT_JV + (req2 ? star : '') + '</span></label>' +
      '<p class="gdpr-note">' + TXT_NOTE + '</p>' +
      '<p class="gdpr-err" role="alert" hidden></p>';
    return d;
  }

  var n = 0;
  function add(form) {
    if (form.__gdpr || !form.querySelector('input[type="email"]')) return;
    form.__gdpr = 1; n++;
    var k = kind(form), r1 = k !== 'enq', r2 = k === 'reg';
    /* the old optional "Keep me informed about future events" box is replaced by the marketing box */
    var upd = form.querySelector('input[type="checkbox"][name="updates"]');
    if (upd) { var ul = upd.closest('label'); if (ul) ul.parentNode.removeChild(ul); }
    var hid = document.createElement('input'); hid.type = 'hidden'; hid.name = 'gdpr_consent';
    hid.value = summary(false, false);
    var b = box(r1, r2, 'gdpr' + n);
    form.appendChild(hid);
    var btn = form.querySelector('button[type="submit"],input[type="submit"],button:not([type])');
    /* put the box above the button, but keep it a direct child of the form (or of the button's wrapper) */
    var anchor = btn; while (anchor && anchor.parentNode !== form && anchor.parentNode && anchor.parentNode.parentNode !== form) anchor = anchor.parentNode;
    /* a one-line newsletter bar (email + button) keeps its shape: the boxes go right under the form
       (checked by __gdprCheck below, so they still gate this form's submit) */
    if (k === 'news') { b.style.margin = '.8rem 0 0'; form.parentNode.insertBefore(b, form.nextSibling); }
    else if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(b, anchor);
    else form.appendChild(b);
    var m = b.querySelector('[data-gdpr="m"]'), p = b.querySelector('[data-gdpr="p"]'), err = b.querySelector('.gdpr-err');
    function sync() { hid.value = summary(m.checked, p.checked); last = hid.value; if (err) err.hidden = true; }
    m.addEventListener('change', sync); p.addEventListener('change', sync);
    form.__gdprCheck = function () {
      var miss = (r1 && !m.checked) ? m : (r2 && !p.checked) ? p : null;
      if (miss) {
        err.textContent = r2 ? 'Please tick both consent boxes to continue.' : 'Please tick the consent box to subscribe.';
        err.hidden = false; miss.focus(); return false;
      }
      var ts = new Date().toISOString();
      hid.value = summary(m.checked, p.checked, ts); last = hid.value;
      if (m.checked && p.checked) store({ m: 1, p: 1, ts: ts, page: location.pathname });
      return true;
    };
  }

  function scan(root) {
    var forms = (root && root.querySelectorAll) ? root.querySelectorAll('form') : [];
    if (root && root.tagName === 'FORM') add(root);
    Array.prototype.forEach.call(forms, add);
  }

  /* runs before the site's own submit handlers (capture phase on document) */
  document.addEventListener('submit', function (e) {
    var f = e.target;
    if (!f || !f.__gdprCheck) return;
    if (!f.__gdprCheck()) { e.preventDefault(); e.stopImmediatePropagation(); }
  }, true);

  /* ticket links: both boxes first */
  function pop(go) {
    css();
    var prev = document.activeElement;
    var w = document.createElement('div'); w.className = 'gdpr-pop';
    w.innerHTML = '<div role="dialog" aria-modal="true" aria-labelledby="gdpr-pop-h"><h2 id="gdpr-pop-h">Before you buy your ticket</h2>' +
      '<p class="gdpr-lead">Please tick both boxes to continue to the secure payment page.</p></div>';
    var inner = w.firstChild, b = box(true, true, 'gdprpop');
    b.querySelector('.gdpr-err').remove();
    inner.appendChild(b);
    var acts = document.createElement('div'); acts.className = 'gdpr-acts';
    acts.innerHTML = '<button type="button" class="gdpr-no">Cancel</button><button type="button" class="gdpr-go" disabled>Continue to payment</button>';
    inner.appendChild(acts);
    document.body.appendChild(w);
    var m = b.querySelector('[data-gdpr="m"]'), p = b.querySelector('[data-gdpr="p"]'), ok = acts.querySelector('.gdpr-go');
    function sync() { ok.disabled = !(m.checked && p.checked); }
    m.addEventListener('change', sync); p.addEventListener('change', sync);
    function close() { document.removeEventListener('keydown', key, true); w.remove(); if (prev && prev.focus) prev.focus(); }
    function key(e) {
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      if (e.key === 'Tab') {
        var f = inner.querySelectorAll('input,button:not([disabled]),a[href]'), a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    }
    document.addEventListener('keydown', key, true);
    w.addEventListener('click', function (e) { if (e.target === w) close(); });
    acts.querySelector('.gdpr-no').addEventListener('click', close);
    ok.addEventListener('click', function () {
      if (!(m.checked && p.checked)) return;
      var ts = new Date().toISOString();
      store({ m: 1, p: 1, ts: ts, page: location.pathname }); last = summary(true, true, ts);
      close(); go();
    });
    m.focus();
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest(TICKET) : null;
    if (!a || both()) return;
    e.preventDefault(); e.stopImmediatePropagation();
    pop(function () {
      if (a.target === '_blank') window.open(a.href, '_blank', 'noopener'); else window.location.href = a.href;
    });
  }, true);

  function init() {
    css(); scan(document);
    if (window.MutationObserver) new MutationObserver(function (list) {
      list.forEach(function (r) { Array.prototype.forEach.call(r.addedNodes, function (x) { if (x.nodeType === 1) scan(x); }); });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
