//01:迁入未划户 02:同意迁移但未划户 03 多次审核不通过
var kqqydb = {
    kqqyWin: null,
    init: function () {
        this.doSearch()
        $(".search").click(function () {
            showsearch();
        });
    },
    doSearch: function () {
        var form = new mini.Form("#cxtjForm");
        var formData = form.getData(true);
        var data = {
            nsrsbh: formData.nsrsbh,
            wsh: formData.wsh,
            sqrqQ: formData.sqrqQ,
            sqrqZ: formData.sqrqZ,
            // qyjglx: mini.get("kqqyswsxDm").value ? mini.get("kqqyswsxDm").value : '',
            qcswjgdm: formData.qcswjgdm,
            blqxQ: formData.blqxQ,
            blqxZ: formData.blqxZ
        };
        gridzr = mini.get("dbsxGridkqqy");
        gridzr.setUrl("/dzgzpt-wsys/api/sh/fzjgdlns/query/dbsx");
        gridzr.load(data, function () {
            $(".searchdiv").slideUp();
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        var form = new mini.Form("#cxtjForm");
        form.reset();
        mini.get("dbsxGridkqqy").setData("")
    },
    showQyjg: function (record) {
        kqqydb.kqqyWin = mini.open({
            url: './qrjgdb.html',        //页面地址
            title: '详情',      //标题
            iconCls: '',    //标题图标
            width: '100%',      //宽度
            height: '100%',     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(record);

            },
            ondestroy: function (action) {  //弹出页面关闭前
                kqqydb.doSearch()
                // if (action == "close") {       //如果点击“确定”
                // }
            }

        });
    }
};

function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
    }
}

function onActionRendererKqqy(e) {
    //新增跨区迁移
    //01:迁入未划户 02:同意迁移但未划户 03 多次审核不通过
    var record = e.record;
    return '<a class="Delete_Button" onclick="kqqydb.showQyjg(record)" href="#">受理</a>';
}

$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    kqqydb.init();
});