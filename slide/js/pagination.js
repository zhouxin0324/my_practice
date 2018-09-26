;(function(_){

    //将HTML转化为节点
    function html2node(str){
        var container=document.createElement('div');
        container.innerHTML=str;
        return container.children[0];
    }

    var template=
    `<ul class="m-page">
        <li class="prev"><</li>
        <li class="page">1</li>
        <li class="page">2</li>
        <li class="page">3</li>
        <li class="page">4</li>
        <li class="page">5</li>
        <li class="page">6</li>
        <li class="page">7</li>
        <li class="page">8</li>
        <li class="page">9</li>
        <li class="page">10</li>
        <li class="next">></li>
    </ul>`


    class Pagination{
        constructor(opt){
            _.extend(this,opt);
            this.container=this.container||document.body;
            this.pager=this._layout.cloneNode(true);
            this.container.appendChild(this.pager);
            this.pages=[].slice.call(this.pager.querySelectorAll('.page'));
            this.prev=this.pager.querySelector('.prev');
            this.next=this.pager.querySelector('.next');

            //记录当前页
            this.pageIndex=1;
            _.addClass(this.pages[0],'z-active');
        }
    }

    _.extend(Pagination.prototype,_.emitter);
    _.extend(Pagination.prototype,{
        _layout:html2node(template),

        nav:function(){
            var pageIndex=this.pageIndex;
            var pages=this.pages;
            //pages.forEach(function(page,index){
            //    pageIndex=index+1;
            //})
                this._oppage();

        },

       _prev:function(){
            //this.pageIndex-=1;
            if(this.pageIndex>1){
                this.pageIndex-=1;
            }else{
                this.pageIndex=1;
            }
            this._oppage();
       },

       _next:function(){
           if(this.pageIndex>=10){
               this.pageIndex=10;
           }else{
               this.pageIndex+=1;
           }
           this._oppage();
        },

        _oppage:function(){
            var pages=this.pages;
            var pageIndex=this.pageIndex;
            console.log(pageIndex);
             //当前page添加‘z-active’的className
             pages.forEach(function(node){_.delClass(node,'z-active')});
             _.addClass(pages[pageIndex-1],'z-active');
        }
    });

    window.Pagination=Pagination;

})(util);