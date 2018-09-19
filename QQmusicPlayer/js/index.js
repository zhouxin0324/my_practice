$(function(){

    var $audio=$('audio');
    var player=new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    getMusicList();
    //获取歌曲列表
    function getMusicList(){
        $.ajax({
            url:'./source/musiclist.json',
            dataType:'json',
            async:false,
            success:function(data){
                player.musicList=data;
                var $musicList = $(".slideLeft .dataList");
                $.each(data,function(index,ele){
                    var $item= createMusicItem(index, ele);
                    $musicList.append($item);
                })
                initMusicInfo(data[0]);
                initLryic(data[0]);
            },
            error(e){
                console.log(e);
            }
        })
    }

    //初始化音乐信息
    function initMusicInfo(music){
        //给对应元素赋值
        $('.music_progress_name').text(music.name);
        $('.time_total').text(music.time);
        $('.song_info_img img').attr('src',music.cover);
        $('.mask_bg').css('background','url('+music.cover+') no-repeat 0 0');
        $('.song_name').text(music.name);
        $('.songer_name1').text(music.singer);
        $('.album_name').text(music.album);
    };

    //初始化歌词信息
    function initLryic(music){
        lyric=new Lyric(music.link_lrc);
        lyric.loadLyric(function(){
            var $songLyric=$('.song_info_lyric');
            $songLyric.html("");
            $.each(lyric.lyrics,function(index,value){
                var item=$('<p>'+value+'</p>');
                $songLyric.append(item);
            });
        });
        $('.song_info_lyric').css({
            marginTop:0
        });
    }

    initProgress();
    //初始化进度条
    function initProgress(){
        var progressBar=$('.music_progress_bar');
        var progressLine=$('.music_progress_line');
        var progressDot=$('.music_progress_dot');
        progress =Progress(progressBar,progressLine,progressDot);

        progress.clickProgress(function (value) {
            player.musicSeekTo(value);
        });
        progress.moveProgress(function (value) {
            player.musicSeekTo(value);
        });

        var voiceProgressBar=$('.music_voice_bar');
        var voiceProgressLine=$('.music_voice_line');
        var voiceProgressDot=$('.music_voice_dot');
        voiceProgress=Progress(voiceProgressBar,voiceProgressLine,voiceProgressDot);
        voiceProgress.clickProgress(function(value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.moveProgress(function(value){
            player.musicSeekTo(value);
        })
    }

    initEvent();
    function initEvent(){
        //复选框选中高亮显示
        $('.dataList').delegate('input','click',function(){
            //复选框选中，高亮并解绑hover事件
            if($(this).is(':checked')){
                $(this).parent().parent().css({
                    opacity: '1'
                });
                $(this).parent().css({
                    background:'url(\'images/icon_sprite.png\') no-repeat  -19px -200px'
                });
                $(this).parent().parent().off('mouseenter').off('mouseleave');
            }
            //复选框未选中，添加hover事件
            else{
                $(this).parent().css({
                    background:'none'
                });
                $(this).parent().parent().on('mouseenter',function(){
                    $(this).css({
                        opacity: '1'
                    })
                });
                $(this).parent().parent().on('mouseleave',function(){
                    $(this).css({
                        opacity: '.3'
                    })
                })
            }
        });


        //hover进音乐列表的时候，显示list_menu
        $('.dataList').delegate('.musList_item','mouseenter',function(){
            $(this).find('.list_menu').stop().fadeIn(100);
            $(this).find('.musList_time').stop().fadeOut(100);
            $(this).find('.musList_del').stop().fadeIn(100);
            $(this).find('.musList_del').css({
                display:'inline-block'
            })
        })
        $('.dataList').delegate('.musList_item','mouseleave',function(){
            $(this).find('.list_menu').stop().fadeOut(100);
            $(this).find('.musList_time').stop().fadeIn(100);
            $(this).find('.musList_del').stop().fadeOut(100);
        });


        //listmenu,play按钮切换
        $('.dataList').delegate('.listMenu_a_play','click',function(){
            $(this).toggleClass('listMenu_a_play2');
            var $item=$(this).parents('.musList_item');
            $item.siblings().find('.listMenu_a_play').removeClass('listMenu_a_play2');
            console.log($item.get(0).music);
            //播放当前音乐高亮
            if($(this).hasClass('listMenu_a_play2')){
                $item.css('color','#fff');
                $item.siblings().css('color','rgba(255,255,255,.5)');
                $('.music_play').addClass('music_play2');
            }else{
                //未播放，当前音乐置灰
                $item.css('color','rgba(255,255,255,.5)');
                $('.music_play').removeClass('music_play2');
            }
            // 3.4切换序号的状态
            $item.find(".num").toggleClass("num2");
            $item.siblings().find(".num").removeClass("num2");
            //播放音乐
            player.playMusic($item.get(0).index,$item.get(0).music);
            //初始化音乐信息
            initMusicInfo($item.get(0).music);
            initLryic($item.get(0).music);
        });

        // 4.监听底部控制区域播放按钮的点击
        $('.music_play').click(function () {
            // 判断有没有播放过音乐
            if(player.currentIndex == -1){
                // 没有播放过音乐
                $(".musList_item").eq(0).find(".listMenu_a_play").trigger("click");
            }else{
                // 已经播放过音乐
                $(".musList_item").eq(player.currentIndex).find(".listMenu_a_play").trigger("click");
            }
        });

        //监听上一首按钮的点击
        $('.music_pre').click(function(){
            $(".musList_item").eq(player.preIndex()).find(".listMenu_a_play").trigger("click");
        })

        //监听下一首按钮的点击
        $('.music_next').click(function(){
            $(".musList_item").eq(player.nextIndex()).find(".listMenu_a_play").trigger("click");
        })


        $audio.on('ended',function(){
            $('.music_next').trigger('click');
        });
        //mode按钮点击切换
        $('.music_mode').click(function(){
            if($('.music_mode').get(0).className.indexOf("music_mode2")==-1){
                $(this).addClass('music_mode2');
            }
            else if($('.music_mode').get(0).className.indexOf("music_mode3")==-1){
                $(this).addClass('music_mode3');
                $audio.off('ended');
                $audio.on('ended',function(){
                    $(".musList_item").eq(player.randomLoop()).find(".listMenu_a_play").trigger("click");
                });
            }
            else if($('.music_mode').get(0).className.indexOf("music_mode4")==-1){
                $(this).addClass('music_mode4');
                $audio.off('ended');
                $audio.attr('loop','loop');
            }
            else{
                $(this).removeClass('music_mode2 music_mode3 music_mode4');
                $audio.off('ended');
                $audio.on('ended',function(){
                    $('.music_next').trigger('click');
                });
            }
        });

        //播放进度监听
        player.musicTimeUpdate(function (currentTime, duration, timeStr) {
            // 同步时间
            $(".time_cur").text(timeStr);
            // 同步进度条
            // 计算播放比例
            value = currentTime / duration * 100;
            progress.setProgress(value);
            //歌词同步
            var index=lyric.currentIndex(currentTime);
            var item=$('.song_info_lyric p').eq(index);
            item.addClass('lyric_cur');
            item.siblings().removeClass('lyric_cur');
            //歌词滚动
            if(index<0) return;
                $('.song_info_lyric').css({
                    marginTop:(-index)*34
                });

        })

        //voice_icon按钮的切换
        $('.music_voice_icon').click(function(){
            $(this).toggleClass('music_voice_icon2');
            if ($(this).hasClass('music_voice_icon2')) {
                player.musicVoiceSeekTo(0);
                voiceProgress.setProgress(0)
            } else {
                player.musicVoiceSeekTo(1);
                voiceProgress.setProgress(100);
            }
        });

    }



    //新建一个音乐
    function createMusicItem(index,music){
        var $item=
            $("<li class=\"musList_item\">\n"+
                    "<div class=\"musList_sel\">\n"+
                             "<label><input type=\"checkbox\" class=\"check\"></label>\n"+
                    "</div>\n"+
                    "<div class=\"num\">"+(index+1)+"</div>\n"+
                    "<div class=\"musList_song\">\n"+
                        "<span>"+music.name+"</span>\n"+
                        "<div class=\"list_menu\">\n"+
                            "<a href=\"javascript:;\" title=\"播放\" class=\"listMenu_a listMenu_a_play\">\n"+
                                "<i></i>\n"+
                            "</a>\n"+
                            "<a href=\"javascript:;\" title=\"添加到歌单\" class=\"listMenu_a\">\n"+
                                "<i class=\"listMenu_a_add\"></i>\n"+
                            "</a>\n"+
                            "<a href=\"javascript:;\" title=\"下载\" class=\"listMenu_a\">\n"+
                                 "<i class=\"listMenu_a_down\"></i>\n"+
                            "</a>\n"+
                            "<a href=\"javascript:;\" title=\"分享\" class=\"listMenu_a\">\n"+
                                 "<i class=\"listMenu_a_share\"></i>\n"+
                            "</a>\n"+
                        "</div>\n"+
                    "</div>\n"+
                    "<div class=\"musList_songer\">"+music.singer+"</div>\n"+
                    "<div class=\"musList_time\">"+music.time+"</div>\n"+
                    "<div class=\"musList_del\">\n"+
                        "<a href=\"javascript:;\" title=\"删除\" class=\"listMenu_a_del\">\n"+
                            "<i class=\"listMenu_a_del_icon\"></i>\n"+
                        "</a>\n"+
                    "</div>\n"+
            "</li>");
        $item.get(0).index=index;
        $item.get(0).music=music;
        return $item;
    };

})