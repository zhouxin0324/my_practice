$(function(){
    //监控开始游戏按钮
    $('.start').click(function() {
        //点击按钮，隐藏按钮
        $('.start').stop().fadeOut(100);
        //进度条递减
        processHandle();
        wolfAnimate();
    })


    //监听重新开始按钮
    $('.restart').click(function(){
        $('.mask').stop().fadeOut(100);
        processHandle();
        $('.score').text(0);
        wolfAnimate();
    })


    //监听游戏规则点击事件
    $('.rule').click(function(){
        $('.rules').stop().fadeIn(100);
    })


    //监听规则页的关闭按钮
    $('.close').click(function(){
        $('.rules').stop().fadeOut(100);
    })


    function processHandle(){
        let processWidth=180;
        $('.process').css('width',processWidth);
        let processTimer=setInterval(function(){
            processWidth-=1;
            $('.process').css('width',processWidth);
            if($('.process').width()==0){
                clearInterval(processTimer);
                $('.mask').stop().fadeIn(100);
                stopwolfAnimate();
            }
        },300);
    }

    var wolfTimer;
    function wolfAnimate(){
        var wolf_1=['./images/h0.png','./images/h1.png','./images/h2.png','./images/h3.png','./images/h4.png','./images/h5.png','./images/h6.png','./images/h7.png','./images/h8.png','./images/h9.png'];
        var wolf_2=['./images/x0.png','./images/x1.png','./images/x2.png','./images/x3.png','./images/x4.png','./images/x5.png','./images/x6.png','./images/x7.png','./images/x8.png','./images/x9.png'];
        // 2.定义一个数组保存所有可能出现的位置
        var arrPos = [
            {left:"100px",top:"115px"},
            {left:"20px",top:"160px"},
            {left:"190px",top:"142px"},
            {left:"105px",top:"193px"},
            {left:"19px",top:"221px"},
            {left:"202px",top:"212px"},
            {left:"120px",top:"275px"},
            {left:"30px",top:"295px"},
            {left:"209px",top:"297px"}
        ];
        let img=$('<img src="">');
        let posIndex=Math.round(Math.random()*8);
        img.css({
            position:'absolute',
            left:arrPos[posIndex].left,
            top:arrPos[posIndex].top
        });
        var wolfType = Math.round(Math.random()) === 0 ? wolf_1 : wolf_2;
            window.index = 0;
            window.wolfIndexEnd = 5;
            wolfTimer = setInterval(function () {
                if(index > wolfIndexEnd){
                    img.remove();
                    clearInterval(wolfTimer);
                    wolfAnimate();
                }
                img.attr("src", wolfType[index])
                index++;
        },300);
        $('.container').append(img);
        getScoreHandle(img);
    }


//监听拍打图片，得分情况
function getScoreHandle(img){
        img.one('click',function(){
            window.index = 5;
            window.wolfIndexEnd = 9;

            if($('img').attr('src').indexOf('h')>=0){
                $('.score').text(parseInt($('.score').text())+10);
            }else{
                $('.score').text(parseInt($('.score').text())-10);
            }
        })
    }
function stopwolfAnimate(){
    $('img').remove();
    clearInterval(wolfTimer);
}
})

