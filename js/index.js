(function(){
  let pageNum = 1;
  getTopics(pageNum, {
    page: pageNum,
    tab: 'all',
    limit: 10,
    mdrender: true
  });
  pagelist({
    startNum: 1,
    endNum: 5,
    pageNum,
    tab: 'all'
  });
})()

function pagelist(options){
  $('#pager').html('');
  let startNum = options.startNum;
  let endNum = options.endNum;
  const pageNum = options.pageNum;
  let midNum = (endNum - startNum) / 2;
  if(pageNum > startNum){
    startNum = pageNum - midNum;
    endNum = pageNum + midNum;
  }
  if(startNum <= 0){
    startNum = 1;
    endNum = endNum + 1;
  }
  let buttonClass = 'pageButton';
  let buttonText = '';
  $('#pager').append('<li class="pageButton start"><a href="#"><<</a></li>');
  for(let page = startNum;page <= endNum; page++){
    const button = $('<li class=' + buttonClass + '></li>');
    const buttonContent = $('<a href="javascript:;"><span>' + buttonText + '</span></a>');
    button.append(buttonContent);
    if(page === pageNum){
      button[0].className = button[0].className + " current_page";
    }
    buttonContent.html(page);
    $('#pager').append(button);
  }
  $('#pager').append('<li class="pageButton end"><a href="#">>></a></li>');
}

function listenClick(tab, page){
  const pages = $('.pageButton');
  for(let i = 0; i < pages.length; i++){
    (function(i){
      pages[i].onclick = function(){
        startLoading();
        pageNum = parseInt($(this).children().eq(0).html(), 10);
        if(i === pages.length - 1){
          pageNum = page + 1;
        }
        if(i === 0){
          pageNum = page - 1;
        }
        getTopics(pageNum, {
          page: pageNum,
          tab,
          limit: 10,
          mdrender: true
        });
        pagelist({
          startNum: 1,
          endNum: 5,
          pageNum,
          tab
        })
      }
    })(i)
  }
}
function getTopics(page, options){
  $.ajax({
    url: `https://cnodejs.org/api/v1/topics?${$.param(options)}`,
    type: 'get',
    dataType: 'json',
    success: function(data){
      html = template('topicList', data);
      $('#list').html(html);
      listenClick(options.tab, page);
      stopLoading();
    }
  })
}


const tabs = $('.topic_tab');
for(let i =0; i < tabs.length; i++){
  (function(i){
    tabs[i].onclick = function(){
      pagelist({
        startNum: 1,
        endNum: 5,
        pageNum: 1,
        tab: this.className.split(' ')[1],
      })
      $('.current_tab')[0].className = $('.current_tab')[0].className.replace("current_tab", '');
      this.className = this.className + " current_tab";
      getTopics(1, {
        page: 1,
        tab: this.className.split(' ')[1],
        limit: 10,
        mdrender: true
      });
      listenClick(this.className.split(' ')[1]);
    }
  })(i)
}
$('#list').on('click', '.topic_title', function(){
  const id = $(this).attr("data-id");
  event.preventDefault();
  window.location = 'topicinfo.html?topicId=' + id;
})
