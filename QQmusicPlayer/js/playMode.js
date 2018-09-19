(function(window){
    function playMode(audio){
        return new playMode.prototype.init(audio);
    }
    playMode.prototype={
        constructor:playMode,
        init:function(audio){
            this.$audio=audio;
            this.audio=audio.get(0);
        },
        srcs:[],
        //获取音频链接数组
        getSrc:function(music){

        }
    }
    playMode.prototype.init.prototype=playMode.prototype;
    window.playMode=playMode;
})(window)