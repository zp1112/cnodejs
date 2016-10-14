$('.loginButton').click(function(){
  $.ajax({
    url: 'https://cnodejs.org/api/v1/accesstoken',
    type: 'post',
    data: {
      accesstoken: $('.accessToken').val()
    },
    dataType: 'json',
    success: function(data){
      const json = {
        username: data.loginname,
        avatar_url: data.avatar_url,
        id: data.id,
        accesstoken: $('.accessToken').val()
      };
      localStorage.setItem('userInfo', JSON.stringify(json));
      window.location = 'index.html';
    }
  })
});
