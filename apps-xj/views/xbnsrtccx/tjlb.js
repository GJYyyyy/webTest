$(function () {
    mini.parse();
});
var sqtjlb = {
    grid: null,
    init: function (param) {
        this.paramData = param;
        this.grid = mini.get("dbsxGrid");
        this.grid.setUrl("../../../../api/sh/wtgl/xbnsrtc/querysqqk");
        //发起请求，获取并展示表格数据
        this.grid.load(
            param, function(res) {
            this.setData(res.data);
        },function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    openTcxq: function (e) {
        //传参lcslId、rwbh，【新办管理端查看（isYct：1电子税务局2一窗通了）】
        var isYct = '2'
        if (e.qdid === 'web' || e.qdid === 'xbweb') {
            isYct = '1'
        }
        var sqlymc = ''
        if (e.qdid === 'xbyct') {
            sqlymc = '一窗通（老网厅）'
        } else if (e.qdid == 'xbweb') {
            sqlymc = '电子税务局（老网厅）'
        } else if (e.qdid === 'web') {
            sqlymc = '电子税务局'
        } else {
            sqlymc = '一窗通'
        }
        var url = "../xbnsrcx/xbnsrtcSl.html?lcslId="+ e.lcslid + "&isYct=" + isYct + "&rwbh=" + e.rwbh + "&from=search&sqlymc=" + sqlymc;
        mini.open({
            url: url,        //页面地址
            title: '纳税人申请信息',      //标题
            iconCls: '',    //标题图标
            width: '100%',      //宽度
            height: '100%',     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: true,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow:false,      //是否在本地弹出页面,默认false
            effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                // iframe.contentWindow.setData(url);
            },
            ondestroy: function (action) {  //弹出页面关闭前
            }
        });
    },
    exportFpqd: function(){
        /*var rows = grid.getSelecteds();*/
        if(sqtjlb.grid.data == null || sqtjlb.grid == ""){
            mini.alert("查询结果为空，无需导出文件！");
            return ;
        }
        var pageIndex = sqtjlb.paramData.pageIndex;
        var pageSize = sqtjlb.paramData.pageSize;
        var swjgdm =  sqtjlb.paramData.swjgdm;
        var sqrqQ =  sqtjlb.paramData.sqrqQ;
        var sqrqZ =  sqtjlb.paramData.sqrqZ;

        window.open('/dzgzpt-wsys/api/sh/wtgl/export/sqqk?swjgdm='+ swjgdm +'&sqrqQ=' +sqrqQ +
            '&sqrqZ=' + sqrqZ + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex);
    }
};

function onActionRendererCk (e){
    var record = e.record;
    return '<a class="Delete_Button" onclick="sqtjlb.openTcxq(record)" href ="#">查看</a>';
}

function getSwryxm(str) {
    var MC = "TEST";
     $.ajax({
        url : "../../../../api/sh/wtgl/query/swrymc?swryDm=" + str,
        type : "get",
        async:false,
        success : function(data) {
            var resultData = mini.decode(data);
            MC =  "test";
        },
        err: function () {

        }
    });
     return MC;
}