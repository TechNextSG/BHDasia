(function(){
  var header = document.getElementById('main-header');
  function updateHeader(){
    if(window.scrollY > 10){
      header.classList.add('et-fixed-header');
    } else {
      header.classList.remove('et-fixed-header');
    }
  }
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();
  document.querySelectorAll('#top-menu a').forEach(function(a){
    a.addEventListener('click', function(){
      document.body.classList.remove('mobile-nav-open');
    });
  });
})();
