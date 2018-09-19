$(function(){
//监听textarea的输入
    $('body').delegate('.comment','input propertychange',function(){
        //监听当前输入框是否输入内容
        if($(this).val().length>0){
            $('input').prop('disabled',false);
        }else{
            $("input").prop('disabled',true);
        }
    })
    //监听按钮点击事件
    $('.send').click(function(){
        let $text=$('.comment').val();
        $('.comment').val('');
        $("input").prop('disabled',true);

        // weibo.php?act=add&content=xxx	添加一条
        // 返回：{error:0, id: 新添加内容的ID, time: 添加时间}
        // {error: 0, id: 4, time: 1536761971, acc: 0, ref: 0}
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'add',content:$text},
            success:function(msg){
                var obj=eval("("+msg+")");
                console.log(obj);
                obj.content=$text;
                let message=createEle(obj);
                message.get(0).obj=obj;
                $('.messageList').prepend(message);
                getMesList(1);
                // $.addCookie('pageName',1);
                window.location.hash=1;
                creatPage();
            }
        })
    })
    function createEle(obj){
        let $info=$("<div class=\"info\">\n"+
                        "<p class=\"infoText\"> "+obj.content+"</p>\n"+
                        "<p class=\"infoOperation\">\n"+
                            "<span class=\"infoTime\">"+formatDate(obj.time*1000)+"</span>\n"+
                            "<span class=\"infoHandle\">\n"+
                                "<a href=\"javascript:;\" class=\"atop\">"+obj.acc+"</a>\n"+
                                "<a href=\"javascript:;\" class=\"adow\">"+obj.ref+"</a>\n"+
                                "<a href=\"javascript:;\" class=\"adele\">删除</a>\n"+
                             "</span>\n"+
                        "</p>\n"+
            "</div>");
        return $info;
    }
    function formatDate(time) {
        let date = new Date(time);

        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hour = date.getHours();
        let min = date.getMinutes();
        let sec = date.getSeconds();
        let arr = [year + "-", month + "-", day + " ", hour + ":", min + ":", sec ];
        let newdate = arr.join("");
        return newdate;
    }
    //监听点赞按钮
    $('body').delegate('.atop','click',function(){
        $(this).text(parseInt($(this).text())+1);
        let obj=$(this).parents('.info').get(0).obj;
        // weibo.php?act=acc&id=12			顶某一条数据
        // 返回：{error:0}
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'acc',id:obj.id},
        })
    })
    //监听点down按钮
    $('body').delegate('.adow','click',function(){
        $(this).text(parseInt($(this).text())+1);
        let obj=$(this).parents('.info').get(0).obj;
        // weibo.php?act=ref&id=12			踩某一条数据
        // 返回：{error:0}
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'ref',id:obj.id},
        })
    })
    //监听删除按钮
    $('body').delegate('.adele','click',function(){
        $(this).parents('.info').remove();
        let obj=$(this).parents('.info').get(0).obj;
        let num=$('.cur').text();
        // weibo.php?act=del&id=12			删除一条数据
        // 返回：{error:0}
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'del',id:obj.id},
            success:function(msg){
                getMesList(num);
                creatPage();
            }
        })

    });
    //监听页码点击事件
    $('.page').delegate('a','click',function(){
        $(this).addClass('cur');
        $(this).siblings().removeClass('cur');
        let num = $('.cur').text();
        getMesList(num);
        // $.addCookie('pageName',num);
        window.location.hash=num;
    })

    creatPage();
    //创建底部页码
    function creatPage(){
        $('.page').html("");
        //获取页数
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'get_page_count'},
            success:function(msg){
                let count=eval("("+msg+")").count;
                //创建动态页码icon
                for(let i=0;i<count;i++){
                    let tem=$("<a href=\"javascript:;\">"+(i+1)+"</a>");
                    $('.page').append(tem);
                    // if(i===($.getCookie('pageName')-1)){
                    if(i===(window.location.hash.substring(1)-1)){
                        $('.page>a').eq(i).addClass('cur');
                    }
                }
            }
        })

    }
    // let numInit=$.getCookie('pageName')||1;
    let numInit=window.location.hash.substring(1);
    getMesList(numInit);

    //获取第num页数据
    function getMesList(num){
        $('.messageList').html("");
        // weibo.php?act=get&page=1		获取一页数据
        // 返回：[{id: ID, content: "内容", time: 时间戳, acc: 顶次数, ref: 踩次数}, {...}, ...]
        $.ajax({
            type:'get',
            url:'weibo.php',
            data:{act:'get',page:num},
            success:function(msg){
                let res=eval("("+msg+")");
                $.each(res,function(index,val){
                    let message=createEle(val);
                    message.get(0).obj=val;
                    $('.messageList').append(message);
                })
            }
        })
    }
})
