(function(window){
    function Lyric(path){
       return new Lyric.prototype.init(path);
    };
    Lyric.prototype={
        constructor:Lyric,
        init:function(path){
            this.path=path;
        },
        loadLyric:function(callBack){
            var $this=this;
            $.ajax({
                url:$this.path,
                dataType:'text',
                success:function(data){
                    // console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error:function(e){
                    console.log(e);
                }
            })
        },
        lyrics:[],
        times:[],
        index:-1,
        parseLyric:function(data){
            var $this=this;
            $this.lyrics=[];
            $this.times=[];
            var datas=data.split('\n');
            $.each(datas,function(index,value) {
                var lrc = datas[index].split(']')[1];
                if (lrc.length == 1) return;
                $this.lyrics.push(lrc);

                var timereg = /\[(\d*:\d*.\d*)\]/;
                var res = timereg.exec(value);
                if(res == null) return true;
                var timeStr = res[1]; // 00:00.92
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min + sec).toFixed(2)) ;
                $this.times.push(time);
            })
        },
        currentIndex:function(currentTime){
            if(currentTime >= this.times[0]){
                this.index++; // 0  1
                this.times.shift(); // 删除数组最前面的一个元素
            }
            return this.index; // 1
        }
    };
    Lyric.prototype.init.prototype=Lyric.prototype;
    window.Lyric=Lyric;
})(window);