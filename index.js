// 关闭的顶广告
function popup() {
  var oPopup = $('j-display');
  console.log(oPopup)
  var oBtn = oPopup.querySelector('.close')
  if (getCookie('off')) {
    oPopup.style.display = 'none';
  } else {
    oBtn.addEventListener('click',function() {
      
      oPopup.style.display = 'none';
      setCookie('off',true,36500 );
    })
  }
} 
popup();


function setCookie(name,value,time) {  //  设置cookie
  var oDate = new Date();
  oDate.setDate( oDate.getDate() + time)
  console.log(oDate.toGMTString())
  document.cookie = name + '=' + value + ';expires=' + oDate.toGMTString();
  console.log(document.cookie)
}



function removeCookie (key) {   //删除cookie
  setCookie(kye,'',-1);
}

function getCookie (key) {    //获取cookie
  var  arr1= document.cookie.split(';');
  console.log(arr1)
  for (var i = 0; i < arr1.length;  i++) {
    var arr2 = arr1[i].split('=');
    console.log(arr2)
    if (arr2[0] === key ) {
      console.log(decodeURI(arr2[1]))
      return decodeURI(arr2[1]);
    }
  }
}



// 关注按钮实现
/* 
1. 点击后判断cookie 是否有属性loginSuc，如果没有，跳出弹框
2. 输入账号和密码，调用ajax登录验证，成功登录后设置cookie
3. 调用登录api，设置关注变已关注状态，并设置关注成功的cookie(followSuc)

*/

// ajax
function get(url,option,callback) {
  console.log(option)
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 ) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        callback(xhr.responseText)
      } else {
        alert("requset failed: " + xhr.status)
        }
    }
  };
  console.log(url)
  xhr.open('get',url + '?' + serialize(option),true);
  xhr.send(null);
}

// 创建修改查询参数的函数封装
  function serialize(data) {
    if (!data) return "";
    var pairs =[];
    for (var name in data) {
      if (!data.hasOwnProperty(name)) continue;
      if (typeof data[name] === 'function') continue;
      var value = data[name].toString();
      name =  encodeURIComponent(name);
      console.log(name);
      value = encodeURIComponent(value);
      pairs.push(name + '=' + value);
    }
    return pairs.join('&');
  }  


// 弹窗效果
function login() {
  var oPop = document.querySelector('.m-popuplog')
  var oLogin = document.getElementById('j-input');
  /* 取消键 */
  var oCancel = document.querySelector('.cancel');
  var oButn = document.querySelector('.submit');
  var oLabel = document.getElementsByTagName('label');
  var oInput = document.getElementsByTagName('input'); 
  var oClose = oPop.querySelector('.close');
  
  // 关闭弹窗
  oClose.addEventListener('click',function() {
      oPop.style.display = 'none';
    })  

  // oPop.style.display = 'none';
  if( !getCookie ('loginSuc') ) {  
    oLogin.addEventListener('click',function() {
    oInput[1].value = '';
    oInput[2].value = '';
    oPop.style.display = 'block';
      })
  } else { 
    oCancel.style.display = 'block';
    oLogin.value = '已关注';
    oLogin.disabled = false;
    oLogin.className = 'instatus f-fl';
    }


    // 隐藏文字
    function focus(i) {
    console.log(oInput[2])
    oInput[i+1].onfocus = function(){oLabel[i].style.display = 'none';};
    oInput[i+1].onblur = function(){
      if(this.value ===''){
        oLabel[i].style.display = 'block';
      }
    };
  }
  focus(0);
  focus(1);

    // 登录按钮验证实现
    oButn.addEventListener('click',function() {

      var useName1 = hex_md5(oInput[1].value);
      var password1 = hex_md5(oInput[2].value);
      get('http://study.163.com/webDev/login.htm',{userName:useName1,password:password1},function(a){
        if (a == '1') {
          oPop.style.display = 'none'
          setCookie('loginSuc','1',36500)
          get('http://study.163.com/webDev/attention.htm','',function(b) {
            if (b == '1') {
              console.log(oLogin)
              setCookie('followSuc','1',36500)
              oCancel.style.display = 'block';
              oLogin.value = '已关注';
              oLogin.disabled = 'true';
            }
          })
        } else {
          alert ('帐号密码错误，请重新输入');
        }
      })
    })
    // 取消字的事件效果
    oCancel.addEventListener('click',function() {
      setCookie('followSuc','',-1);
      setCookie('loginSuc','',-1);
      oCancel.style.display = 'none';
      oLogin.value = '关注';
      oLogin.disabled = false;
    })
}
login()



// 轮播图
 /*
  1. 设置触发事件
  2. 初始化事件 
  3. 获取节点
  4. 原型扩展
 */
// 原型扩展赋值函数
var extend = function(o1,o2) {
  for(var i in o2) if (typeof o1[i] == 'undefined') {
    o1[i]=o2[i]
  }
  return o1
}

var $ = function (select) {
  return [].slice.call(document.querySelectorAll(select))
}
// 下标指针
var cursors = $('.carousel-cursors .cursors');
var prev = $('.carousel-cursors .prev');
var next = $('.carousel-cursors .next');
// 触发事件
cursors.forEach(function(cursors,index) {
  cursors.addEventListener('click',function() {
    slider.nav(index);
  })
})

prev.addEventListener('click',function() {
  slider.prev();
})

next.addEventListener('click',function() {
  slider.next();
})

setInterval(function(){
  
  // 下一页
  // slider.next();

},3000)

slider.nav(1);
// 初始化事件

var slider = new Slider



// 获取节点
function Slider() {
  // 获取图片
  this.item = $('.carousel-inner .item') 
  this.pageIndex = this.pageIndex || 0;
 }

// 原型扩展

extend(Slider.prototype, {
  // 指定跳转页面
  nav: function(index) {
  item[index].className = 'active'
  this.step(index)
  this._calcSlide()
  }

  // 下一页
  next: function() {
    this.step(1)
  }

  // 上一页
  prev: function() {
    this.step(-1)
  }

  step: function(offset) {
    this.pageIndex = offset
    var step = this
  }
  
  _calcSlide: function() {

  }
  // 实现渐变函数
  fadeout: function(element) {
    var val = 0;
    var change = function() {
      setOpacity(element,val)
      val += 0.1;
    }
    var intervalID = setInterval(change,100)
  // 改变图片透明度的函数
  setOpacity: function (element,val) {    //兼容测试IE
    element.filters?element.style.filter ='alpha(opacity='+100*value+')' : element.style.opacity = val;     
      }
  }

  }
