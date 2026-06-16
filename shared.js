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
