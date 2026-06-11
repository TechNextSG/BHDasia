(function(){
  // Inject top bar into header
  var header = document.getElementById('main-header');
  if(header){
    var topbar = document.createElement('div');
    topbar.id = 'header-topbar';
    topbar.innerHTML = '<div class="container"><span class="topbar-tagline">Business &amp; Human Development · Asia Pacific</span><div class="topbar-contact"><a href="tel:+818065151778"><span class="tc-icon">&#9990;</span> +81 806515 1778</a><a href="mailto:isabelle@bhdasia.com"><span class="tc-icon">&#9993;</span> isabelle@bhdasia.com</a></div></div>';
    header.insertBefore(topbar, header.firstChild);
  }

  // Scroll shadow
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
})();
