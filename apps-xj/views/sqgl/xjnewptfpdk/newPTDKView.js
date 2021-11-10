var link = document.createElement('link')  ;
link.href = '../sqgl/xjnewptfpdk/newPTDK.css';
link.rel = "stylesheet"
//var link = '<link rel=stylesheet href="../sqgl/newzyfpdk/newZYDK.css" />'
// document.head.appendChild(link);
// $('body').append( link );

$("head")[0].appendChild( link );
//上面的要删除
function getSqxh(sqzl){
	var tsqxh="";
	if(sqzl.blzt){
		tsqxh=sqzl.blzt.sqxh;
	}else{
		tsqxh=sqxh;
	}
	return tsqxh;
}

	
$('body').on('click', '.go-upload', function(){
		$(window).scrollTop(0);
		mini.open({
			url: "../sqgl/xjnewptfpdk/ptfphwlwqdView.html",        //页面地址
			title: "货物劳务清单查看",      //标题
			//iconCls: String,    //标题图标
			width: 1110,      //宽度
			height: 500,     //高度
			allowResize: false,       //允许尺寸调节
			allowDrag: false,         //允许拖拽位置
			showCloseButton: true,   //显示关闭按钮
			showMaxButton: false,     //显示最大化按钮
			showModal: true,         //显示遮罩
			loadOnRefresh: false,       //true每次刷新都激发onload事件
			onload: function () {       //弹出页面加载完成
				var iframe = this.getIFrameEl();
                var data = {"sqxh":getSqxh(sqzl)};
                iframe.contentWindow.SetData(data);
			},
			ondestroy: function (action) {
				
			}
			
		})
	});
//只读文本框增加冒泡提示
$('span.mini-textbox').attr('title', function () {
    var input = $(this).find('input')[1];
    return !!input ? input.value : '';
});

function onDrawSummaryCell(e) {
    var data = e.sender.getData();
    //客户端汇总计算
    if (e.field == "se") {
        var ybs = 0;
        $.each(data, function(i, obj){
            ybs += parseFloat( obj.se||0 );
        })
        ybs = ybs.toFixed( 2 ) ;
        e.cellHtml = "税额合计: " + ybs;
    }
}