
(function() {
  const id = getUrlParam('topicId');
  $.ajax({
    url: `https://cnodejs.org/api/v1/topic/${id}?mdrender=true`,
    type: 'get',
    dataType: 'json',
    success: function(data){
      console.log(data);
      html = template('topicDetail', data);
      html = fixImgSrc(html);
      $('#container_left').html(html);
      html = template('topicReply', data);
      html = fixImgSrc(html);
      $('#container_bottom').html(html);
      $('.collect').eq(0).on('click', function(){
        if(this.className.indexOf('is_collect') !== -1){
          $('.collect').eq(0).text('收藏');
          this.className = this.className.replace(' is_collect', '');
        } else {
          $('.collect').eq(0).text('取消收藏');
          this.className = this.className + ' is_collect';
        }
      });
      getUserInfo(data.data.author.loginname);
      stopLoading();
      if(data.data.replies.length > 0){
        initEditor();
      }
      const loginname = JSON.parse(localStorage.getItem('userInfo')).username;
      const replyItemLength = $('.reply_spe').length;
      for(let i=0;i < replyItemLength; i++){
        if(loginname === $('.reply_spe').eq(i).attr("data-author")){
          $('.reply_delete').eq(i).css('display', 'block');
        }
        if($('.upscount').eq(i).val() == 0){
          $('.upscount').eq(i).css('visibility', 'hidden');
        }
        (function(i){
          $('.ups').eq(i).on('click', function() {
            if(loginname === $('.reply_spe').eq(i).attr("data-author")){
              alert('不能给自己点赞哦！')
            } else {
              const options = {
                accesstoken: JSON.parse(localStorage.getItem('userInfo')).accesstoken
              }
              $.ajax({
                url: `https://cnodejs.org/api/v1/reply/${$('.ups').eq(i).attr("data-id")}/ups`,
                type: 'post',
                data: options,
                dataType: 'json',
                success: function(data){
                  console.log(data.action);
                  if(data.action === 'up'){
                    $('.upscount').eq(i).css('visibility', 'visible');
                    $('.upscount').eq(i).html(parseInt($('.upscount').eq(i).html(), 10)+1);
                  } else {
                    $('.upscount').eq(i).html(parseInt($('.upscount').eq(i).html(), 10)-1);
                    if($('.upscount').eq(i).html() == 0){
                      $('.upscount').eq(i).css('visibility', 'hidden');
                    }
                  }
                }
              })
            }
          })
        })(i)
      }
      reply(data.data.id);
      prereply(data.data.id);
    }
  });
})()

function prereply(topicId){
  const replyList = $('.reply_spe');
  for(let i =0; i < replyList.length; i++){
    (function(i){
      replyList[i].onclick = function(){
        const editorReplyAt = '@' + $(this).attr("data-author");
        editor.codemirror.setValue(editorReplyAt + ' ');
        editor.codemirror.setCursor({line:0, ch: editorReplyAt.length + 1});
        editor.codemirror.focus();
        reply(topicId, $(this).attr("data-id"));
      }
    })(i)
  }
}


function reply(topicId, replyId){
  $('.reply-btn').on('click', function(){
    const accesstoken = JSON.parse(localStorage.getItem('userInfo')).accesstoken;
    const options = {
      accesstoken,
      content: editor.codemirror.getValue()
    }
    if(replyId){
      options.rely_id = replyId;
    }
    $.ajax({
      url: `https://cnodejs.org/api/v1/topic/${topicId}/replies`,
      type: 'post',
      data: options,
      dataType: 'json',
      success: function(){
        window.location = `topicinfo.html?topicId=${topicId}`
      }
    })
  })
}
function getUserInfo(name){
  $.ajax({
    url: `https://cnodejs.org/api/v1/user/${name}`,
    type: 'get',
    dataType: 'json',
    success: function(data){
      console.log(data);
      html = template('topicAuthor', data);
      html = fixImgSrc(html);
      $('#container_right').html(html);
    }
  })
}

var initEditor = function() {
    var area = document.getElementById('replyArea');
    editor = new Editor({
        element: area,
        autofocus: false,
        toolbar: [
            {name: 'bold', action: Editor.toggleBold},
            {name: 'italic', action: Editor.toggleItalic},
            '|',

            {name: 'quote', action: Editor.toggleBlockquote},
            {name: 'unordered-list', action: Editor.toggleUnOrderedList},
            {name: 'ordered-list', action: Editor.toggleOrderedList},
            '|',

            {name: 'link', action: Editor.drawLink},
            {name: 'image', action: Editor.drawImage},
            '|',

            {name: 'info', action: 'http://lab.lepture.com/editor/markdown'},
            {name: 'preview', action: Editor.togglePreview}
        ]
    });
    editor.codemirror.setOption('autofocus', false);
};
