$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    blqktj.init();
});

var blqktj = {
    cxGrid : null,
    dbGrid : null,
    blqkForm: null,
    sqrqQ: null,
    param: null,
    init : function () {
        this.cxGrid = mini.get("cxGrid");
        this.dbGrid = mini.get("dbGrid");
        this.blqkForm = new mini.Form("#blqkForm");

        //~起默认当前日期前推1个月，最大当天、~止最大当天，最小大于起
        this.sqrqQ = mini.get("sqrqQ");
        this.sqrqZ = mini.get("sqrqZ");
        this.changeOther('init');

        //进入页面默认搜索
        this.doSearch();
    },
    openTjlb : function (record) {
        var formData = this.blqkForm.getData(true);
        var param = {
            "sqrqQ": formData.sqrqQ,
            "sqrqZ": formData.sqrqZ,
            "swjgdm": record.swjgdm
        }
        mini.open({
            url: "./tjlb.html",        //页面地址
            title: '新办纳税人申请统计列表',      //标题
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
                iframe.contentWindow.setData(param);
            },
            ondestroy: function (action) {  //弹出页面关闭前
            }
        });
    },
    startDayCheck: function (e) {
        if(!e.value) return;
        //实时更新~止最小值
        this.sqrqZ.setMinDate(e.value);
    },
    endDayCheck: function (e) {
        if(!e.value) return;
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
            this.cxGrid.setData('');
        }
    },
    doSearch: function () {
        this.blqkForm.validate();
        if(!this.blqkForm.isValid()){
            return false;
        }
        //日期跨度最大一年，超过一年提示"日期起止跨度不能大于1年。"
        var start = mini.formatDate(this.sqrqQ.getValue(),'yyyy-MM-dd');
        var end = mini.formatDate(this.sqrqZ.getValue(),'yyyy-MM-dd');
        if(oneYearCheck(start,end)){
            mini.alert("日期起止跨度不能大于1年。","范围提示");
        }

        var formData = this.blqkForm.getData(true);
        var self = this;
        //loading
        self.cxGrid.loading();
        $.ajax({
            url : "../../../../api/sh/wtgl/xbnsrtc/queryblqk",
            type : "post",
            data : formData,
            async:false,
            success : function(data) {
                if(!data) {
                    mini.alert("请求失败，请稍候重试", "错误提示");
                    return;
                }
                var resultData = mini.decode(data);
                var cxarr, dbarr = [];
                cxarr = resultData.blqk;
                resultData.dbqk ? dbarr.push(resultData.dbqk) : '';

                //合计行
                for(var i = 0; i < cxarr.length; i++) {
                    if (cxarr[i].swjgMc == "税务机关") {
                        cxarr[i].swjgMc == "合计总数";
                    }
                }

                if(cxarr.length > 2){
                    //admin用户调整表格高度, 隐藏调拨表格
                    cxarr = resultData.blqk;
                    $("#cxGrid").css({'height': '500px'});
                    // $("#dbGrid").css({'display': 'none'});
                }

                //硬展示0.5s加强用户感知
                setTimeout(function () {
                    self.cxGrid.unmask();
                },200,false);
                self.cxGrid.setData(cxarr);
                self.dbGrid.setData(dbarr);
            },
            err: function () {
                self.cxGrid.unmask();
            }
        });
    },
    doReset: function () {
        this.blqkForm.reset();
        this.cxGrid.setData('');
        this.dbGrid.setData('');
        this.changeOther('init');
    },
    exportFpqd: function(){
        /*var rows = grid.getSelecteds();*/
        if(blqktj.cxGrid == null || blqktj.cxGrid == ""){
            mini.alert("查询结果为空，无需导出文件！");
            return ;
        }

        var sqrqQ =  mini.formatDate(mini.get("sqrqQ").value,'yyyy-MM-dd');
        var sqrqZ =  mini.formatDate(mini.get("sqrqZ").value,'yyyy-MM-dd');
        window.open('/dzgzpt-wsys/api/sh/wtgl/export/blqk?sqrqQ=' +sqrqQ +
            '&sqrqZ=' + sqrqZ );
    }
};

function onActionRendererCkxq (e){
    var record = e.record;
    //合计行不显示
    if ( record.swjgMc === "合计总数" ) {
        return;
    } else {
        return '<a class="Delete_Button" onclick="blqktj.openTjlb(record)" href ="#">查看详情</a>';
    }
}

function oneYearCheck (start, end) {
    if(!start || !end) return;
    var diff = new Date(end)*1 - new Date(start)*1;
    if(diff > 31536000000){
        return true;
    }
    return false;
}

