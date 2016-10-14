const fixImgSrc = function(html) {
  var imgReg = new RegExp('<img.*>', 'gm');
  var srcReg = new RegExp('src=[\"\']//', 'gm');
  var imgs = html.match(imgReg);
  if (imgs) {
    for (var i = 0; i < imgs.length; i++) {
      var img = imgs[i];
      replaceImg = img.replace(srcReg, 'src=\"https://');
      html = html.replace(img, replaceImg);
    }
  }
  return html;
}
const getUrlParam = function(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
  var r = window.location.search.substr(1).match(reg);  //匹配目标参数
  if (r != null) return unescape(r[2]); return null; //返回参数值
}
