(function(){
  if(!localStorage.getItem('userInfo')){
    window.location = 'login.html';
  }
  $('#logout').on('click', function(){
    localStorage.removeItem('userInfo');
    window.location = 'login.html';
  })
})()
