;(function($,window){
    $.extend({
        addCookie:function (name,value,day,domain,path){
            let cookieText=name+"="+value;
            if(day){
                let date=new Date();
                date.setDate(date.getDate()+day);
                cookieText+=";expires="+date.toGMTString();
            }
            if(domain){
                //默认值document.domain
                cookieText+=";domain="+domain;
            }
            if(path) {
                //默认值window.location.pathname
                cookieText += ";path=" + path;
            }
            document.cookie=cookieText;
        },
        getCookie:function (name){
            let value;
            let res=document.cookie.split(';');
            res.forEach(function (val,index) {
                let tem=val.split('=');
                if(tem[0].trim()===name) {
                    value=tem[1];
                }
            })
            return value;
        },
        delCookie:function (name,path){
            addCookie(name,getCookie(name),-1,null,path);
        }
    });
})(jQuery,window);