(function(){
  // Skip-to-content link (accessibility)
  var skip = document.createElement('a');
  skip.href = '#et-main-area';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);

  // Header scroll: shadow + auto-hide on scroll down, reveal on scroll up
  var header = document.getElementById('main-header');
  var lastY = window.scrollY;
  function updateHeader(){
    var y = window.scrollY;
    if(y > 10){ header.classList.add('et-fixed-header'); }
    else { header.classList.remove('et-fixed-header'); }
    if(document.body.classList.contains('mobile-nav-open')){
      header.classList.remove('header-hidden');
      lastY = y; return;
    }
    if(y > 180 && y > lastY + 4){
      header.classList.add('header-hidden');
    } else if(y < lastY - 4 || y <= 10){
      header.classList.remove('header-hidden');
    }
    lastY = y;
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
    '.service-category','.coaching-package','.team-card','.team-member',
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

  // Suggestion pool — rotates randomly so repeats are minimised
  var ALL_SUG = [
    'What services do you offer?',
    'TRE® workshops',
    'Pricing & packages',
    'Upcoming events',
    'How to contact you',
    'About BHD Asia',
    'Who is Isabelle?',
    'Where are you located?',
    'How to book a session',
    'Tell me about coaching',
    'Partner organisations',
    'Team & experience'
  ];
  var usedSug = [];

  function freshSuggestions(){
    var available = ALL_SUG.filter(function(s){ return usedSug.indexOf(s) === -1; });
    if(available.length < 5){ usedSug = []; available = ALL_SUG.slice(); }
    // Shuffle
    for(var i = available.length - 1; i > 0; i--){
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = available[i]; available[i] = available[j]; available[j] = tmp;
    }
    var picked = available.slice(0, 5);
    picked.forEach(function(s){ usedSug.push(s); });
    return picked;
  }

  // Knowledge base with action buttons per topic
  var KB = [
    {
      re:/(service|services|offer|offering|programme|programs?|help with|what do you|what you do)/,
      a:"We focus on three areas: <strong>Organisation Development</strong>, <strong>Resilience Building</strong> (TRE®, somatic coaching, stress &amp; burnout), and <strong>Individual Development</strong> (executive, career &amp; transition coaching). Each solution is co-designed with you.",
      btns:[{t:'View All Services',u:'services.html'},{t:'Book a Free Call',u:'contact.html'}]
    },
    {
      re:/(tre|tension|trauma|somatic|tremor|neurogenic|releasing exercise)/,
      a:"<strong>TRE® (Tension &amp; Trauma Releasing Exercises)</strong> is a neurogenic method that helps the body release deep muscle tension and stress without detailed discussion of past events. We run open workshops — Module 1 (personal use) and Module 2/3 (provider certification).",
      btns:[{t:'See TRE® Events',u:'events.html'},{t:'Enquire Now',u:'contact.html'}]
    },
    {
      re:/(event|events|workshop|workshops|upcoming|module|when|next date|schedule|calendar)/,
      a:"Our next workshops are <strong>TRE® for Personal Use (Module 1)</strong> on <strong>29–30 Aug 2026</strong> and <strong>Certification (Module 2)</strong> on 26–27 Sep 2026 — both in Singapore.",
      btns:[{t:'View All Events',u:'events.html'},{t:'Reserve a Spot',u:'contact.html'}]
    },
    {
      re:/(price|pricing|cost|fee|how much|rate|sgd|dollar|package|invest)/,
      a:"TRE® Module 1: Super Early Bird <strong>SGD 1,290</strong>, Early Bird 1,500, Normal 1,800. Our 8-week individual coaching package is <strong>SGD 2,200</strong>. Group and corporate rates available on request.",
      btns:[{t:'Full Pricing',u:'services.html'},{t:'Ask About Rates',u:'contact.html'}]
    },
    {
      re:/(contact|email|phone|call|reach|whatsapp|enquire|inquire|message|get in touch)/,
      a:"You can reach us by email at <a href='mailto:isabelle@bhdasia.com'>isabelle@bhdasia.com</a>, call or WhatsApp <strong>+81 80 6515 1778</strong>, or fill in our online contact form.",
      btns:[{t:'Contact Form',u:'contact.html'}]
    },
    {
      re:/(location|where|address|office|located|based|singapore|raffles)/,
      a:"We are based at <strong>50 Raffles Place, Singapore Land Tower #30-00, Singapore 048623</strong> and work with clients across Asia Pacific, Japan, Europe and beyond.",
      btns:[{t:'Contact Us',u:'contact.html'},{t:'About BHD Asia',u:'about.html'}]
    },
    {
      re:/(isabelle|founder|who runs|co.?founder|director|coach|rouviere|team|staff|people)/,
      a:"<strong>Isabelle Claus Teixeira</strong> is our co-founder and director — 27+ years in HR leadership across nine countries, a certified leadership coach since 2012, TRE® certified provider, and Forbes Coaches Council contributor.",
      btns:[{t:'Meet Isabelle',u:'isabelle.html'},{t:'Our Team',u:'about.html#team'}]
    },
    {
      re:/(about|company|bhd|background|history|who are you|what is bhd)/,
      a:"<strong>BHD Asia</strong> is a boutique HR consulting, executive coaching and leadership development firm. Founded in Singapore in 2012 by Isabelle and Rouviere Teixeira, we co-design bespoke solutions for clients across Asia Pacific and globally.",
      btns:[{t:'About Us',u:'about.html'},{t:'Our Services',u:'services.html'}]
    },
    {
      re:/(book|booking|appointment|sign.?up|register|enrol|enroll|reserve|1.?on.?1|one.?on.?one|free call)/,
      a:"To book, use our <a href='contact.html'>Contact</a> form or reach us directly via WhatsApp at +81 80 6515 1778 to schedule a free discovery conversation.",
      btns:[{t:'Book a Free 1:1',u:'contact.html'}]
    },
    {
      re:/(partner|associate|network|client|clients|who.*(work|worked)|companies)/,
      a:"We’ve worked with global organisations including ByteDance (TikTok), Novartis, Philips, VISA, Mastercard, Heineken APAC and many more. Our global associate network spans coaching, facilitation and HR advisory.",
      btns:[{t:'Our Partners',u:'partners.html'},{t:'Our Story',u:'about.html'}]
    },
    {
      re:/(coaching|executive coaching|leadership|career|transition|performance|life coach)/,
      a:"Our coaching services include <strong>Executive Coaching</strong>, <strong>Transition Coaching</strong>, <strong>Performance Coaching</strong>, <strong>Career Coaching</strong>, Self-Awareness Development and 360° Debriefs. Packages are fully co-designed.",
      btns:[{t:'Coaching Services',u:'services.html'},{t:'Book a Consult',u:'contact.html'}]
    },
    {
      re:/(hi|hello|hey|hiya|greetings|good (morning|afternoon|evening)|how are you)/,
      a:"Hello! I’m the BHD Asia assistant 👋 I can help with services, TRE® workshops, pricing, events, our team, and how to get in touch. What would you like to know?",
      btns:[]
    },
    {
      re:/(thank|thanks|cheers|appreciate|great|perfect|helpful)/,
      a:"You’re very welcome! Feel free to ask anything else, or reach us directly at <a href='mailto:isabelle@bhdasia.com'>isabelle@bhdasia.com</a>.",
      btns:[]
    },
    {re:/(bye|goodbye|see you|farewell|that.s all)/, a:"Thanks for visiting BHD Asia. Have a wonderful day! 😊", btns:[]}
  ];

  var FALLBACK_A = "I can help with our <strong>services</strong>, <strong>TRE® workshops</strong>, <strong>pricing</strong>, <strong>events</strong>, <strong>location</strong> and <strong>contact</strong>. For anything specific, reach Isabelle at <a href='mailto:isabelle@bhdasia.com'>isabelle@bhdasia.com</a> or WhatsApp +81 80 6515 1778.";
  var FALLBACK_BTNS = [{t:'Services',u:'services.html'},{t:'Events',u:'events.html'},{t:'Contact Us',u:'contact.html'}];

  function answerFor(raw){
    // Normalise: lowercase, strip punctuation
    var t = raw.toLowerCase().replace(/['".,!?;:()–—]/g,' ').replace(/\s+/g,' ');
    for(var i=0;i<KB.length;i++){
      if(KB[i].re.test(t)) return {a:KB[i].a, btns:KB[i].btns};
    }
    return {a:FALLBACK_A, btns:FALLBACK_BTNS};
  }

  // FAB
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
    '<div class="bhd-chat-head"><div class="bhd-chat-head-info"><span class="bhd-chat-title">BHD Asia Assistant</span><span class="bhd-chat-status"><span class="bhd-status-dot"></span>Typically replies instantly</span></div><button class="bhd-chat-close" aria-label="Close chat">×</button></div>' +
    '<div class="bhd-chat-msgs" id="bhd-chat-msgs"></div>' +
    '<div class="bhd-chat-quick" id="bhd-chat-quick"></div>' +
    '<form class="bhd-chat-input" id="bhd-chat-form"><input type="text" id="bhd-chat-text" placeholder="Ask about our services…" autocomplete="off"/><button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg></button></form>';
  document.body.appendChild(chat);

  var msgs = chat.querySelector('#bhd-chat-msgs');
  var quick = chat.querySelector('#bhd-chat-quick');
  var form = chat.querySelector('#bhd-chat-form');
  var input = chat.querySelector('#bhd-chat-text');
  var toggle = fab.querySelector('.bhd-chat-toggle');
  var closeBtn = chat.querySelector('.bhd-chat-close');
  var greeted = false;

  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function addUserMsg(text){
    var d = document.createElement('div');
    d.className = 'bhd-msg bhd-msg-user';
    d.textContent = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addBotMsg(result){
    var d = document.createElement('div');
    d.className = 'bhd-msg bhd-msg-bot';
    var html = '<div class="bhd-msg-label">BHD Asia</div>' + result.a;
    if(result.btns && result.btns.length){
      html += '<div class="bhd-msg-btns">' +
        result.btns.map(function(b){
          return '<a href="' + b.u + '" class="bhd-msg-btn">' + b.t + '</a>';
        }).join('') + '</div>';
    }
    d.innerHTML = html;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function renderSuggestions(){
    quick.innerHTML = '';
    freshSuggestions().forEach(function(q){
      var b = document.createElement('button');
      b.className = 'bhd-quick-btn';
      b.type = 'button';
      b.textContent = q;
      b.addEventListener('click', function(){ send(q); });
      quick.appendChild(b);
    });
  }

  function botReply(text){
    var typing = document.createElement('div');
    typing.className = 'bhd-chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function(){
      if(typing.parentNode) typing.parentNode.removeChild(typing);
      addBotMsg(answerFor(text));
      renderSuggestions();
    }, 600);
  }

  function send(text){
    text = (text || '').trim();
    if(!text) return;
    addUserMsg(text);
    botReply(text);
  }

  renderSuggestions();

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
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var v = input.value;
    input.value = '';
    send(v);
  });
})();
