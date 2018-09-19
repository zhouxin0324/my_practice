(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype={
        constructor:Progress,
        init:function($progressBar,$progressLine,$progressDot){
            this.$progressBar=$progressBar;
            this.$progressLine=$progressLine;
            this.$progressDot=$progressDot;
        },
        isMoving:false,
        //监听progress的点击事件
        clickProgress:function(callBack){
            var $this=this;
            this.$progressBar.click(function(event){
                //获取鼠标点击距离窗口左端的offset;
                var eventLeft=event.pageX;
                //获取progressBar距离窗口最左端的距离
                var barLeft=$(this).offset().left;
                //设置前景的width
                $this.$progressLine.css('width',eventLeft-barLeft);
                //设置原点的距离
                $this.$progressDot.css('left',eventLeft-barLeft);
                var value=(eventLeft-barLeft)/$(this).width();
                callBack(value);
            })
        },
        //监听progress的鼠标移动事件
        moveProgress:function(callBack){
            var barLeft=this.$progressBar.offset().left;
            var width=this.$progressBar.width();
            var eventLeft;
            var $this=this;
            this.$progressDot.mousedown(function(){
                $this.isMoving=true;
                $(document).mousemove(function(event){
                    eventLeft=event.pageX;
                    var offset=eventLeft-barLeft;
                    if(offset>=0&&offset<width){
                        //设置前景的width
                        $this.$progressLine.css('width',offset);
                        //设置原点的距离
                        $this.$progressDot.css('left',offset);
                    }
                });
            });
            // 3.监听鼠标的抬起事件
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                // 计算进度条的比例
                var value = (eventLeft - barLeft) / width;
                callBack(value);
            });
        },
        setProgress:function(value){
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$progressLine.css({
                width: value+"%"
            });
            this.$progressDot.css({
                left: value+"%"
            });
        }
    }
    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;
})(window)