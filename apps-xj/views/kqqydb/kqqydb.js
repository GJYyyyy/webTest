//01:迁入未划户 02:同意迁移但未划户 03 多次审核不通过
var kqqydb = {
    selectTabNumber: '',
    kqqyWin: null,
    init: function () {
        //进入页面根据用户权限决定需要展示的tab页
        $.ajax({
            url: "../../../../api/sh/kqqytjbb/get/tab",
            type: "get",
            async: false,
            success: function (data) {
                data = mini.decode(data);
                if (data && data.length > 0) {
                    // data = ['02', '03'];
                    for (var i = 0; i < data.length; i++) {
                        data[i] === '01' && $("#qrwhh").show();
                        data[i] === '02' && $("#tyqydwhh").show();
                        data[i] === '03' && $("#dcshbtg").show();
                    }
                    kqqydb.selectTabNumber = data[0];
                    $(".tab-bar a").eq(parseInt(data[0]) - 1).click();
                } else {
                    mini.alert(data.message || "请求失败，请稍候再试。");
                }
            },
            error: function (e) {
                mini.alert(e.message || "请求失败，请稍候再试。");
            }
        });

        // $(".searchdiv").slideUp();
        // $('.searchC').html('显示查询条件111');
        // $(".search").click(function () {
        //     showsearch();
        // });

    },
    doSearch: function (th) {
        $('.searchC').html('显示查询条件');
        if (th != "search") {
            var tabid = th.id;
            switch (tabid) {
                case 'qrwhh':
                    kqqydb.selectTabNumber = '01';
                    break;
                case 'tyqydwhh':
                    kqqydb.selectTabNumber = '02';
                    break;
                case 'dcshbtg':
                    kqqydb.selectTabNumber = '03';
                    break;
            }
            if (tabid != 'search') {
                $(".tab-bar .active").removeClass("active");
                document.getElementById(tabid).className = 'active';
            }
            var tabid = $(".tab-bar .active")[0].id;//获取当选选中的tabs
            mini.Cookie.set("ctableid", tabid);//存入缓存中
        }

        var form = new mini.Form("#cxtjForm");
        form.validate();
        if(!form.isValid()){
            return false;
        }
        var formData = form.getData(true);
        var data = {
            nsrsbh: formData.nsrsbh,
            wsh: formData.wsh,
            sdrqQ: formData.sdrqQ,
            sdrqZ: formData.sdrqZ,
            // qyjglx: mini.get("kqqyswsxDm").value ? mini.get("kqqyswsxDm").value : '',
            qyjglx: kqqydb.selectTabNumber,
            swjgdm: formData.swjgdm,
            blqxQ: formData.blqxQ,
            blqxZ: formData.blqxZ
        };
        gridzr = mini.get("dbsxGridkqqy");
        gridzr.setUrl("../../../../api/sh/kqqytjbb/query/dbsx");
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
        var formData = form.getData(true);
        mini.get("dbsxGridkqqy").load({
            pageIndex: mini.get("dbsxGridkqqy").pageIndex,
            pageSize: mini.get("dbsxGridkqqy").pageSize,
            nsrsbh: formData.nsrsbh,
            wsh: formData.wsh,
            sdrqQ: formData.sdrqQ,
            sdrqZ: formData.sdrqZ,
            qyjglx: kqqydb.selectTabNumber,
            swjgdm: formData.swjgdm,
            blqxQ: formData.blqxQ,
            blqxZ: formData.blqxZ
        });
    },
    showQyjg: function (record) {
        if (record.qyjglx == "01") {
            window.location.href = "/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/qrjgdb/qrjgdb.html" + "?sqxh=" + record.sqxh;
        } else {
            kqqydb.kqqyWin = mini.open({
                url: record.qyjglx == "02" || record.qyjglx == "99" ? './tyqywhhMes.html' : './dcshbtg.html',        //页面地址
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
                    kqqydb.doSearch('search')
                    // if (action == "close") {       //如果点击“确定”
                    // }
                }

            });
        }
    }
};
$(document).ready(function() {
    gldUtil.addWaterInPages();
	$(".search").click(function() {
		showsearch();
	});
});

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

function closeWin(success) {
    kqqydb.kqqyWin.hide();
    kqqydb.doSearch('search');
    if (success) mini.get("dbsxGridkqqy").load({
        pageIndex: mini.get("dbsxGridkqqy").pageIndex,
        pageSize: mini.get("dbsxGridkqqy").pageSize
    });
}

$(function () {
    mini.parse();
    kqqydb.init();
});