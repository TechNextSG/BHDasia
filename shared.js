(function(){
  // Skip-to-content link (accessibility)
  var skip = document.createElement('a');
  skip.href = '#et-main-area';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);

  // Inject top bar into header
  var header = document.getElementById('main-header');
  if(header){
    var topbar = document.createElement('div');
    topbar.id = 'header-topbar';
    topbar.innerHTML = '<div class="container"><span class="topbar-tagline">Business &amp; Human Development · Asia Pacific</span><div class="topbar-contact"><a href="tel:+818065151778"><span class="tc-icon">&#9990;</span> +81 806515 1778</a><a href="mailto:isabelle@bhdasia.com"><span class="tc-icon">&#9993;</span> isabelle@bhdasia.com</a></div></div>';
    header.insertBefore(topbar, header.firstChild);
  }

  // Scroll shadow / topbar collapse
  function updateHeader(){
    if(window.scrollY > 10){
      header.classList.add('et-fixed-header');
    } else {
      header.classList.remove('et-fixed-header');
    }
  }
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();

  // Close mobile nav on link click
  document.querySelectorAll('#top-menu a').forEach(function(a){
    a.addEventListener('click', function(){
      document.body.classList.remove('mobile-nav-open');
    });
  });

  // Scroll-reveal — animate sections into view
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var srSelectors = [
    '.pillar-card','.partner-card','.event-card','.value-card',
    '.service-category','.coaching-package','.team-member',
    '.interview-grid','.stats-bar','.countdown-section',
    '.et_pb_section','.et_pb_section_grey',
    '.featured-wrap','.isabelle-section','.contact-grid',
    '.section-head','.page-intro','.mission-card',
    '.newsletter-section','.blurb-item','.clients-section',
  ];
  if(!prefersReducedMotion){
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },{threshold:0.08,rootMargin:'0px 0px -40px 0px'});
    srSelectors.forEach(function(sel){
      document.querySelectorAll(sel).forEach(function(el,i){
        el.classList.add('sr');
        if(i<4) el.classList.add('sr-d'+(i+1));
        observer.observe(el);
      });
    });
  }

  // Parallax — disable on mobile or when user prefers reduced motion
  var isMobile = window.matchMedia('(max-width:980px)').matches;
  var parallaxBg = document.getElementById('parallax-bg');
  if(parallaxBg && !prefersReducedMotion && !isMobile){
    window.addEventListener('scroll', function(){
      parallaxBg.style.transform = 'translateY(' + (window.scrollY * .28) + 'px)';
    }, {passive:true});
  }
})();

/* ── Floating WhatsApp button + website-aware assistant ─────── */
(function(){
  var WA = 'https://wa.me/818065151778?text=' + encodeURIComponent("Hi BHD Asia, I'd like to know more about your services.");

  // Rule-based knowledge base — scoped to BHD Asia website content.
  var KB = [
    {re:/\b(service|services|offer|offering|do you (do|provide)|help with|programmes?|programs?)\b/, a:"We focus on three areas: <strong>Organisation Development</strong>, <strong>Resilience Building</strong> (TRE®, somatic coaching, stress &amp; burnout), and <strong>Individual Development</strong> (executive, career &amp; transition coaching). See the <a href='services.html'>Services</a> page."},
    {re:/\b(tre|tension|trauma|somatic|tremor)\b/, a:"TRE® (Tension &amp; Trauma Releasing Exercises) is a neurogenic method that helps the body release deep tension and stress. We run open workshops — Module 1 (personal use) and Module 2/3 (provider certification). Details on the <a href='events.html'>Events</a> page."},
    {re:/\b(event|events|workshop|workshops|upcoming|module|when|date|dates)\b/, a:"Our next workshop is <strong>TRE® for Personal Use (Module 1)</strong> on <strong>29–30 August 2026</strong> in Singapore, followed by <strong>Certification (Module 2)</strong> on 26–27 September 2026. See <a href='events.html'>Events</a> to book."},
    {re:/\b(price|prices|pricing|cost|costs|fee|fees|how much|rate|sgd|dollar)\b/, a:"TRE® Module 1: Super Early Bird <strong>SGD 1,290</strong>, Early Bird 1,500, Normal 1,800. Our 8-week coaching package is <strong>SGD 2,200</strong>. Full pricing on <a href='services.html'>Services</a> and <a href='events.html'>Events</a>."},
    {re:/\b(contact|email|e-mail|phone|call|reach|whatsapp|enquire|inquire|message)\b/, a:"Email <a href='mailto:isabelle@bhdasia.com'>isabelle@bhdasia.com</a>, call or WhatsApp <strong>+81 80 6515 1778</strong>, or use our <a href='contact.html'>Contact</a> form."},
    {re:/\b(location|where|address|office|located|based)\b/, a:"We're based at <strong>50 Raffles Place, Singapore Land Tower #30-00, Singapore 048623</strong>, working with clients across Asia Pacific and beyond."},
    {re:/\b(isabelle|founder|founders|who runs|coach|coaches|rouviere|team|experience)\b/, a:"Isabelle Claus Teixeira is our co-founder &amp; director — 27+ years in HR and talent management, a certified leadership coach since 2012, and a Forbes Coaches Council contributor."},
    {re:/\b(about|company|bhd|background|history)\b/, a:"BHD Asia is a boutique HR consulting, executive coaching and leadership development firm, founded in Singapore in 2012. We co-design bespoke solutions — never off-the-shelf. More on the <a href='about.html'>About</a> page."},
    {re:/\b(book|booking|appointment|sign ?up|register|registration|enrol|enroll|reserve)\b/, a:"To book, use our <a href='contact.html'>Contact</a> form or our Calendly intake link for a free 1:1 call. You can also WhatsApp us at +81 80 6515 1778."},
    {re:/\b(partner|partners|associate|clients?)\b/, a:"We collaborate with a global network of associates and have worked with clients including ByteDance, Novartis, Philips, VISA and Mastercard. See <a href='partners.html'>Partners</a> and <a href='about.html'>About</a>."},
    {re:/\b(hi|hello|hey|hiya|greetings|good (morning|afternoon|evening))\b/, a:"Hello! I'm the BHD Asia assistant. I can help with our services, TRE® workshops, pricing, events, location and contact. What would you like to know?"},
    {re:/\b(thank|thanks|cheers|appreciate)\b/, a:"You're most welcome! Is there anything else I can help you with?"},
    {re:/\b(bye|goodbye|see you|farewell)\b/, a:"Thanks for visiting BHD Asia. Have a wonderful day!"}
  ];
  var FALLBACK = "I can help with our <strong>services</strong>, <strong>TRE® workshops</strong>, <strong>pricing</strong>, <strong>events</strong>, <strong>location</strong> and <strong>contact</strong>. For anything specific, reach Isabelle at <a href='mailto:isabelle@bhdasia.com'>isabelle@bhdasia.com</a> or WhatsApp +81 80 6515 1778.";

  function answer(text){
    var t = ' ' + text.toLowerCase() + ' ';
    for(var i=0;i<KB.length;i++){ if(KB[i].re.test(t)) return KB[i].a; }
    return FALLBACK;
  }

  // Floating action buttons
  var fab = document.createElement('div');
  fab.id = 'bhd-fab';
  fab.innerHTML =
    '<a class="bhd-fab-btn bhd-wa" href="' + WA + '" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 .4C7.4.4.5 7.3.5 15.9c0 2.8.7 5.5 2.1 7.9L.3 31.6l8-2.1c2.3 1.3 4.9 1.9 7.7 1.9 8.6 0 15.5-6.9 15.5-15.5S24.6.4 16 .4zm0 28.3c-2.5 0-4.9-.7-7-1.9l-.5-.3-4.7 1.2 1.3-4.6-.3-.5c-1.4-2.2-2.1-4.7-2.1-7.2C2.9 8.6 8.8 2.8 16 2.8s13.1 5.8 13.1 13.1S23.2 28.7 16 28.7zm7.2-9.8c-.4-.2-2.3-1.2-2.7-1.3-.4-.1-.6-.2-.9.2-.3.4-1 1.3-1.3 1.6-.2.2-.5.3-.9.1-.4-.2-1.6-.6-3.1-1.9-1.2-1-1.9-2.3-2.2-2.7-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.1-.3.1-.5 0-.7-.1-.2-.9-2.1-1.2-2.9-.3-.7-.6-.6-.9-.7h-.8c-.3 0-.7.1-1 .5-.4.4-1.4 1.3-1.4 3.2s1.4 3.7 1.6 4c.2.3 2.8 4.3 6.8 6 .9.4 1.7.6 2.3.8.9.3 1.8.2 2.5.2.8-.1 2.3-.9 2.6-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.4z"/></svg></a>' +
    '<button class="bhd-fab-btn bhd-chat-toggle" aria-label="Open chat assistant" title="Chat with us"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg></button>';
  document.body.appendChild(fab);

  // Chat panel
  var chat = document.createElement('div');
  chat.id = 'bhd-chat';
  chat.className = 'bhd-chat-closed';
  chat.setAttribute('role','dialog');
  chat.setAttribute('aria-label','BHD Asia assistant');
  chat.innerHTML =
    '<div class="bhd-chat-head"><div class="bhd-chat-head-info"><span class="bhd-chat-title">BHD Asia Assistant</span><span class="bhd-chat-status">Typically replies instantly</span></div><button class="bhd-chat-close" aria-label="Close chat">×</button></div>' +
    '<div class="bhd-chat-msgs" id="bhd-chat-msgs"></div>' +
    '<div class="bhd-chat-quick" id="bhd-chat-quick"></div>' +
    '<form class="bhd-chat-input" id="bhd-chat-form"><input type="text" id="bhd-chat-text" placeholder="Ask about our services..." autocomplete="off"/><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></form>';
  document.body.appendChild(chat);

  var msgs = chat.querySelector('#bhd-chat-msgs');
  var quick = chat.querySelector('#bhd-chat-quick');
  var form = chat.querySelector('#bhd-chat-form');
  var input = chat.querySelector('#bhd-chat-text');
  var toggle = fab.querySelector('.bhd-chat-toggle');
  var closeBtn = chat.querySelector('.bhd-chat-close');
  var greeted = false;

  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function addMsg(html, who){
    var d = document.createElement('div');
    d.className = 'bhd-msg bhd-msg-' + who;
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }
  function botReply(text){
    var typing = document.createElement('div');
    typing.className = 'bhd-chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function(){
      if(typing.parentNode) typing.parentNode.removeChild(typing);
      addMsg(answer(text), 'bot');
    }, 550);
  }
  function send(text){
    text = (text || '').trim();
    if(!text) return;
    addMsg(esc(text), 'user');
    botReply(text);
  }

  ['Services','TRE® workshops','Pricing','Events','Contact'].forEach(function(q){
    var b = document.createElement('button');
    b.className = 'bhd-quick-btn';
    b.type = 'button';
    b.textContent = q;
    b.addEventListener('click', function(){ send(q); });
    quick.appendChild(b);
  });

  function openChat(){
    chat.classList.remove('bhd-chat-closed');
    if(!greeted){ greeted = true; botReply('hello'); }
    setTimeout(function(){ input.focus(); }, 250);
  }
  function closeChat(){ chat.classList.add('bhd-chat-closed'); }

  toggle.addEventListener('click', function(){
    if(chat.classList.contains('bhd-chat-closed')) openChat(); else closeChat();
  });
  closeBtn.addEventListener('click', closeChat);
  form.addEventListener('submit', function(e){ e.preventDefault(); send(input.value); input.value = ''; });
})();
