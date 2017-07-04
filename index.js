//  浏览器兼容性  事件注册
var addEvent =  document.addEventListener?
    function(elem,type,listener,useCapture) {
      elem.addEventListener(type,listener,useCapture);
    } :
    function(elem,type,listener,useCapture) {
      elem.attachEvent('on' + type,listener);
    };


// 获取className兼容
function getElementsByClassName(element,names) {
  if (element.getElementsByClassName) {           // 优先使用W3C规范
    return element.getElementsByClassName(name);
  } else {
      var elements = element.getElementsByTagName('*');
      var result = [];
      var element,
          classNameStr,
          flag;
      names = names.split(' ');
      for (var i = 0; element = elements[i]; i++) {
        classNameStr = ' ' + element.className + ' ';
        flag = true;
        for (var j = 0,name; name = names[j]; j++) {
          if (classNameStr.indexOf(' ' + name + ' ') == -1 ) {
            flag = false;
            break;
          }
        }
        if (flag) {
          result.push(element);
        }
      }
    return result;
  }
}

// 关闭的顶广告
function popup() {
  var oPopup = document.querySelector('#j-display');
  var oBtn = oPopup.querySelector('.close');
  if (getCookie('off')) {
    oPopup.style.display = 'none';
  } else {
    addEvent(oBtn,'click',function() {  
      oPopup.style.display = 'none';
      setCookie('off',true,36500 );
    },false)
  }
} 
popup();


function setCookie(name,value,time) {  //  设置cookie
  var oDate = new Date();
  oDate.setDate( oDate.getDate() + time)
  document.cookie = name + '=' + value + ';expires=' + oDate.toGMTString();
}



function removeCookie (key) {   //删除cookie
  setCookie(kye,'',-1);
}

function getCookie (key) {    //获取cookie
  var  arr1= document.cookie.split(';');
  for (var i = 0; i < arr1.length;  i++) {
    var arr2 = arr1[i].split('=');
    if (arr2[0] === key ) {
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
  addEvent(oClose,'click',function() {
      oPop.style.display = 'none';
    },false);

  // oPop.style.display = 'none';
  if( !getCookie ('loginSuc') ) {  
    addEvent(oLogin,'click',function() {
    oInput[1].value = '';
    oInput[2].value = '';
    oPop.style.display = 'block';
      },false)
  } else { 
    oCancel.style.display = 'block';
    oLogin.value = '已关注';
    oLogin.disabled = false;
    oLogin.className = 'instatus f-fl';
    }


    // 隐藏文字
    function focus(i) {
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
  addEvent(oButn,'click',function() {
    var useName1 = hex_md5(oInput[1].value);
    var password1 = hex_md5(oInput[2].value);
    get('http://study.163.com/webDev/login.htm',{userName:useName1,password:password1},function(a){
      if (a == '1') {
        oPop.style.display = 'none';
          setCookie('loginSuc','1',36500)
          get('http://study.163.com/webDev/attention.htm','',function(b) {
            if (b == '1') {
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
  },false);

    // 取消两个字的事件效果
  addEvent(oCancel,'click',function() {
    setCookie('followSuc','',-1);
    setCookie('loginSuc','',-1);
    oCancel.style.display = 'none';
    oLogin.value = '关注';
    oLogin.disabled = false;
    },false);
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
  return o1;
}

var $ = function (select) {
  return [].slice.call(document.querySelectorAll(select))
}
// 下标指针

var cursors = $('.carousel-cursors .cursors');
var prev = $('.prev')[0];
var next = $('.next')[0];
var inner = document.getElementsByClassName('carousel-inner')[0];
var img = inner.getElementsByTagName('img');


// 触发事件
cursors.forEach(function(cursors,index) {
  addEvent(cursors,'click',function() {      //页面跳转
    slider.nav(index);
  },false);
})

addEvent(prev,'click',function() {   //上一页
  slider.prev();
},false);

addEvent(next,'click',function() {    //下一页
  slider.next();
},false);



var slider = new Slider;

/* 鼠标滑过事件 */


// 初始化事件
var time = null;
function startMove() {
    clearInterval(time);
    time = setInterval(function(){slider.next();},5000)

}
startMove();
// setInterval(function(){slider.next();},5000)

// 获取节点
function Slider() {
  // 获取图片
  this.item = $('.carousel-inner .item')
  this.pageIndex = this.pageIndex || 0;
  this.itemlength = this.item.length;
 }

// 原型扩展

extend( Slider.prototype,{
  // 指定跳转页面
  nav: function(pageIndex) {
    this.pageIndex = pageIndex;
    this.move(this.pageIndex);
  },

  // 下一页
  next: function() {
    this.pageIndex++;
    if( this.pageIndex >= this.itemlength ) {
      this.pageIndex = 0;
    }
    this.move(this.pageIndex);
  },

  // 上一页
  prev: function() {
    this.pageIndex--;
    if( this.pageIndex < 0 ) {
      this.pageIndex = 2;
    }
    this.move(this.pageIndex);
  },

  move: function(pageIndex) {
    for (var i = 0; i < cursors.length; i++) {
      cursors[i].className='cursors';
      this.item[i].className='item';
    }
    cursors[this.pageIndex].className = 'active';
    this.item[pageIndex].className = 'item active';

    img[pageIndex].onmouseover = function() {
     clearInterval(time)
    }
    img[pageIndex].onmouseout = function() {
      startMove();
    }
  }
})


 //  工作地点动画
var place = new Place;
var pTime = null;
function placemove() {
  clearInterval(pTime);
  pTime = setInterval(function() {place.moves()},100); 
}
placemove();

function Place() {
  this.oBox = document.getElementsByClassName('box')[0];
  this.oWplace = document.getElementById('wplace');
  this.oLi = $('#wplace li');
}

// 原型扩展
extend(Place.prototype,{
  moves:function(index) {
    if (this.oBox.offsetLeft < -1600) {
        this.oBox.style.left = 0;
    }
    this.oBox.style.left = this.oBox.offsetLeft - 4 + 'px'; 
      for (var i = 0; i < this.oLi.length; i++) {
        this.oLi[i].onmouseover = function() {      //鼠标触发目标事件
          clearInterval(pTime);
        }
        this.oLi[i].onmouseout = function() {       //鼠标离开目标事件
          placemove();
        } 
      }
  }   
});




// 课程内容数据获取

function tab() {
  var aTab = document.getElementById('j-tab');
  var aTabhd = aTab.getElementsByClassName('btn');
  var aDesign = aTab.getElementsByClassName('m-design');
  var alanguage = aTab.getElementsByClassName('m-language');
  var dTeam = aTab.getElementsByClassName('m-team');
  var aDesignid = document.getElementById('design');
  var alanguageid = document.getElementById('language');


    // 获取数据
    
  function setdata(page,num,element) {
    get('http://study.163.com/webDev/couresByCategory.htm',{pageNo:page,psize:20 ,type:num},function(data){
      var data = JSON.parse(data);

      for (var i = 0; i < data.list.length; i++) {
        var team = $('#j-tab .m-team');

        // 创建show1标签
        var oShowmes1 = document.createElement('div');
        var oP = document.createElement('p');
        var oSpan = document.createElement('span');
        var oH3 = document.createElement('h3');
        var oStrong = document.createElement('strong');
        var oImg = document.createElement('img');
        var oTeam = document.createElement('div');
        oTeam.className = 'm-team';
        oShowmes1.className = 'showmes1';
        oImg.src = data.list[i].middlePhotoUrl;
        oH3.className = 'name';
        oH3.innerHTML = data.list[i].name;
        oP.className = 'provider';
        oP.innerHTML = data.list[i].provider;
        oSpan.className = 'learnerCount';
        oSpan.innerHTML = data.list[i].learnerCount;
        oStrong.className = 'price'; 
        oStrong.innerHTML = data.list[i].price;


        var oShowmes2 = document.createElement('a');
        oShowmes2.className = 'showmes2'
        var pageNos = 1;
        var psizes = 1;
        var types = 10;

        if(!data.list[i].categoryName) {   //判断分类
          data.list[i].categoryName = '无';
        }

        if (data.list[i].price == 0) {     //判断价钱
          oStrong.innerHTML = '免费';
        } else {
          oStrong.innerHTML = '¥' + data.list[i].price;
        }

        // 创建showmes2
        oShowmes2.innerHTML = '<img src="'+ data.list[i].middlePhotoUrl +'"/ ><h3 class="name">' + data.list[i].name 
        + '</h3><span class="learnerCount">' + data.list[i].learnerCount + '人在学' +'</span><p class="show2-detail">' 
        + '<span class="provider">发布者： ' + data.list[i].provider +'</span><span class="categoryName">' + 
        '分类：' + data.list[i].categoryName + '</span></p><p class="description">' + data.list[i].description +'</p>';

        oTeam.appendChild(oImg);
        oTeam.appendChild(oH3);
        oTeam.appendChild(oP);
        oTeam.appendChild(oSpan);
        oTeam.appendChild(oStrong);
        oTeam.appendChild(oShowmes2);
        element.appendChild(oTeam);

        aTabhd[0].onclick = function() {   //产品设计点击事件
          console.log(aDesign[0]);
          aTabhd[1].className = "btn";
          this.className = "btn active";
          aDesign[0].style.display = "block";
          alanguage[0].style.display = "none";
        }

        aTabhd[1].onclick = function() {   //编程语言点击事件         
          aDesign[0].style.display = "none";
          alanguage[0].style.display = "block";
          this.className = "btn active";
          aTabhd[0].className = "btn";
        }
      }
    })  
  }
  setdata(0,10,aDesign[0]);
  setdata(0,20,alanguage[0]);

  //  页面跳转
  var nextpage = document.getElementById('nextpage');
  var prev = nextpage.getElementsByClassName('prev')[0];
  var next = nextpage.getElementsByClassName('next')[0];
  var dteam = aDesignid.getElementsByClassName('m-team');
  var pageIndex = pageIndex || 1;
  var nexta = $('.page-item');
  nexta[0].className = 'page-item active';
  // 页面跳转
  function nav(index) {
    console.log(index)
/*    if (index == 2) {
      index = 3;
    }*/
    index++;
    console.log(index)
    pageIndex = index;
    move(pageIndex);
  }
  //  移动函数
  function move(pageIndex) {
    
    aDesignid.innerHTML = '';
    alanguageid.innerHTML = '';
    console.log(pageIndex);
    for (var i = 0; i < nexta.length; i++) {
      nexta[i].className = 'page-item';
    };
    // pageIndex == 2?nexta[1].className = 'page-item active':nexta[pageIndex].className = 'page-item active';
    nexta[--pageIndex].className = 'page-item active';
    if (aDesign[0].style.display == "none") {
      console.log(pageIndex)
      setdata(pageIndex,20,alanguage[0]);
    }
    console.log(pageIndex)
    setdata(pageIndex,10,aDesign[0]);
    // console.log(1,10,aDesign[0])
  }
  addEvent(prev,'click',function() {   // 上一页
    pageIndex--;
    if (pageIndex < 0 ) {
      pageIndex = 0;
    };
    move(pageIndex);
  },false);

  addEvent(next,'click',function() {    //下一页
    pageIndex++;
    move(pageIndex);
  },false);

  nexta.forEach(function(nexta,index) {    //页面跳转
    addEvent(nexta,'click',function() {
      nav(index);
    },false)
  });
}
tab();


// 视频弹窗效果

function video() {

  var vVideo = document.getElementById('video');
  var vImg = vVideo.getElementsByTagName('img')[0];
  var vPop = document.getElementById('videopop');
  var vClose = vPop.getElementsByClassName('close')[0];
  var vVideopop = vPop.getElementsByTagName('video')[0];

  addEvent(vImg,'click',function() {    //打开视频弹窗
    vPop.style.display = 'block';
  },false);

  addEvent(vClose,'click',function() {    //关闭视频弹窗
    vPop.style.display = 'none';
    vVideopop.pause()
  },false);

  addEvent(vVideopop,'click',function() {    //点击视频播放和暂停
    if (vVideopop.paused) {
      vVideopop.play();
    } else {
      vVideopop.pause();
    }
  },false);
}
video();



// 最热排行
function listdata() {
  get('http://study.163.com/webDev/hotcouresByCategory.htm',{},function(data) {
    var data = JSON.parse(data);
    for (var i = 0; i < data.length; i++) {
      var listOl = document.getElementsByClassName('list-cont')[0];
      var listLi = document.createElement('li');
      listLi.innerHTML = '<img src="' + data[i].smallPhotoUrl +'"><h4 title="' + data[i].name +'">' + data[i].name +
      '</h4><span class="learnCount">' + data[i].learnerCount + '</span>'
      listOl.appendChild(listLi);
    }
  })
}
listdata();

// 热门排行滚动效果
setInterval(function() {   
  var listOl = document.getElementsByClassName('list-cont')[0];
  var listLi = listOl.getElementsByTagName('li')
  listOl.appendChild(listLi[0]);

},5000)
