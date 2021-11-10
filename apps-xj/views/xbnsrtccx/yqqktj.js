$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    yqqktj.init();
});

var yqqktj = {
    init: function () {
      //先获取办理分局，并设置为只读
      $.ajax({
          url: "../../../../api/xj/wtgl/sxbllz/get/blfj",
          type: "get",
          async: false,
          success: function (data) {
              var resultData = mini.decode(data);
              var blfj = mini.get("blfj");
              blfj.setData([{ID:resultData.blfjDm,MC:baseCode.getMcById('DM_GY_SWJG_GT3',resultData.blfjDm)}]);
              blfj.setValue(resultData?resultData.blfjDm:'');
              blfj.setReadOnly(true);
          }
      });

        this.yqqkGrid = mini.get("yqqkGrid");
        this.yqqkForm = new mini.Form("#yqqkForm");

        //~起默认当前日期前推1个月，最大当天、~止最大当天，最小大于起
        this.sqrqQ = mini.get("sqrqQ");
        this.sqrqZ = mini.get("sqrqZ");
        this.changeOther('init');

        this.doSearch();
    },
    changeOther: function (option) {
        if(option === 'reset') {
            // 置空不可输入
            this.sqrqQ.setValue('');
            this.sqrqQ.setReadOnly(true);
            this.sqrqZ.setValue('');
            this.sqrqZ.setReadOnly(true);
        } else {
            // ~起默认当前日期前推1个月，最大当天、~止最大当天，最小大于起
            var now = new Date(),delay = new Date();
            delay.setMonth(delay.getMonth() - 1);
            this.sqrqQ.setValue(mini.formatDate(delay,'yyyy-MM-dd'));
            this.sqrqQ.setMaxDate(now);
            this.sqrqZ.setValue(mini.formatDate(now,'yyyy-MM-dd'));
            this.sqrqZ.setMinDate(delay);
            this.sqrqZ.setMaxDate(now);

            this.sqrqQ.setReadOnly(false);
            this.sqrqZ.setReadOnly(false);
        }
    },
    startDayCheck: function (e) {
        if(!e.value) return;
        //实时更新~止最小值
        this.sqrqZ.setMinDate(e.value);
    },
    doSearch: function () {
        this.yqqkGrid.validate();
        if(!this.yqqkGrid.isValid()){
            return false;
        }
        //日期跨度最大一年，超过一年提示"日期起止跨度不能大于1年。"
        //空值判定
        var start = mini.formatDate(this.sqrqQ.getValue(),'yyyy-MM-dd');
        var end = mini.formatDate(this.sqrqZ.getValue(),'yyyy-MM-dd');
        if(oneYearCheck(start,end)){
            mini.alert("日期起止跨度不能大于1年。","范围提示");
        }

        var formData = this.yqqkForm.getData(true);
        var param = mini.encode(formData);
        this.yqqkGrid.setUrl("../../../../api/sh/wtgl/xbnsrtc/queryyqqk");
        this.yqqkGrid.load({
            data : param
        }, function(res) {
            // this.setData(res.data);
        },function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        this.yqqkGrid.setData('');
        this.changeOther('init');
    },
    exportFpqd: function(){
        /*var rows = grid.getSelecteds();*/
        if(this.yqqkGrid == null || this.yqqkGrid == ""){
            mini.alert("查询结果为空，无需导出文件！");
            return ;
        }
        var pageIndex = this.yqqkGrid.pageIndex;
        var pageSize = this.yqqkGrid.pageSize;
        var nsrsbh =  mini.get("nsrsbh").value;
        var sqrqQ =  mini.formatDate(mini.get("sqrqQ").value,'yyyy-MM-dd');
        var sqrqZ =  mini.formatDate(mini.get("sqrqZ").value,'yyyy-MM-dd');

        window.open('/dzgzpt-wsys/api/sh/wtgl/export/yqqk?nsrsbh='+ nsrsbh +'&sqrqQ=' +sqrqQ +
            '&sqrqZ=' + sqrqZ + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex);
    },
    oneYearCheck: function(start, end) {
        if(!start || !end) return;
        var diff = new Date(end)*1 - new Date(start)*1;
        if(diff > 31536000000){
            return true;
        }
        return false;
    },
    openTcxq: function (e) {
        var isYct = e.qdid === 'web' ? '1' : '2';
        //传参lcslId、rwbh，【新办管理端查看（isYct：1电子税务局2一窗通了）】
        var url = "../xbnsrcx/xbnsrtcSl.html?lcslId="+ e.lcslid + "&isYct=" + isYct + "&rwbh=" + e.rwbh + "&from=search";
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
    }
};

function onActionRendererYq (e){
    var record = e.record;
    return '<a class="Delete_Button" onclick="yqqktj.openTcxq(record)" href ="#">查看</a>';
}

function oneYearCheck (start, end) {
    if(!start || !end) return;
    var diff = new Date(end)*1 - new Date(start)*1;
    if(diff > 31536000000){
        return true;
    }
    return false;
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