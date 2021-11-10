$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    tstxgl.init();
});

var tstxgl = {
    GridDatas: {
        data: [],
        total: 0
    },
    selectMaps: [],
    init: function () {
        this.qymdGrid = mini.get("yqqkGrid");
        this.qymdFrom = new mini.Form("yqqkForm");

        this.xxztDom = mini.get("xxzt");
        this.sxmcDom = mini.get("swsxmc");
        this.xxztDom.setData([{"ID":"已读","MC":"已读"},{"ID":"未读","MC":"未读"}]);
        this.sxmcDom.setData([{"swsxdm":"110148","swsxmc":"一般纳税人转小规模纳税人"},{"swsxdm":"110113","swsxmc":"增值税一般纳税人登记"},{"swsxdm":"110104","swsxmc":"变更税务登记"},{"swsxdm":"30130103","swsxmc":"跨区迁移企业税务事项报告"}]);

        //默认税务机关
        this.swjgInit();
        this.sqrqXz();
        this.doSearch();
    },
    sqrqXz: function () {
        var sdrqQ = mini.get("sqrqQ");
        var sdrqZ = mini.get("sqrqZ");
        var now = new Date(),delay = new Date();
        delay.setMonth(delay.getMonth() - 1);
        sdrqQ.setValue(mini.formatDate(delay,'yyyy-MM-dd'));
        sdrqQ.setMaxDate(now);
        sdrqZ.setValue(mini.formatDate(now,'yyyy-MM-dd'));
        sdrqZ.setMinDate(delay);
        sdrqZ.setMaxDate(now);
    },
    swjgInit: function () {
        var $swjgdm = mini.get("swjgdm");
        $.ajax({
            url : "../../../../api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
            data : "",
            type : "POST",
            success : function(obj) {
                var datas = mini.decode(obj);
                $swjgdm.loadList(datas, "jgDm", "PID");
                $swjgdm.setValue(datas[0].jgDm);
                /*swjgDm = datas[0].YXW;
                $swjgdm.setValue(swjgDm);*/
            },
            error : function() {
            }
        });
    },
    sqrqQChange: function (e) {
        mini.get("sqrqZ").setMinDate(e.value);
    },
    sqrqZChange: function (e) {
        mini.get("sqrqQ").setMaxDate(e.value);
    },
    sxrqQChange: function (e) {
        mini.get("sxrqZ").setMinDate(e.value);
    },
    sxrqZChange: function (e) {
        mini.get("sxrqQ").setMaxDate(e.value);
    },
    //表格数据加载前
    onGridLoad: function (e) {
        var rows = tstxgl.selectMaps[tstxgl.qymdGrid.getPageIndex()];
        if (rows) {
            for (var i = 0; i < tstxgl.qymdGrid.data.length; i++) {
                for (var j = 0; j < rows.length; j++) {
                    if (tstxgl.qymdGrid.data[i].autorowno == rows[j].autorowno) {
                        tstxgl.qymdGrid.setSelected(tstxgl.qymdGrid.getRow(i));
                    }
                }
            }
        }
        else {
            tstxgl.setChose();
        }
    },
    //获得选中数据
    getData: function () {
        var rowss = [];
        for (var i = 0; i < tstxgl.selectMaps.length; i++) {
            var irow = tstxgl.selectMaps[i];
            for (var j = 0; j < irow.length; j++) {
                rowss.push(irow[j]);
            }
        }
        return rowss;
    },
    //复选框选中时记录所选数据
    onSelectoinChanged: function (e) {
        var rows = tstxgl.qymdGrid.getSelecteds();
        tstxgl.selectMaps[tstxgl.qymdGrid.getPageIndex()] = rows;
    },
    setChose: function () {
        //根据条件获取行数组（示例获取“男”，也可以获取id，改变条件即可）
        var rows = tstxgl.qymdGrid.findRows(function (row) {
            if (row.IsSelect === "1") return true;
            else return false;
        });
        tstxgl.qymdGrid.selects(rows);
    },
    doSearch: function () {
        tstxgl.qymdFrom.validate();
        if (!tstxgl.qymdFrom.isValid()) {
            return false;
        }
        var formData = tstxgl.qymdFrom.getData(true);
        var param = mini.decode(formData);
        tstxgl.qymdGrid.setUrl("/dzgzpt-wsys/api/sh/tstx/query/wsTstxList");
        tstxgl.qymdGrid.load({
            nsrsbh:param.nsrsbh,   //对应页面上统一社会信用代码
            swsxDm:param.swsxmc,      //企业名称
            sqrqQ:param.sqrqQ,      //事项大类
            sqrqZ:param.sqrqZ,      //事项大类
            sxrqQ:param.sxrqQ,      //事项大类
            sxrqZ:param.sxrqZ,      //事项大类
            swjgdm:param.swjgdm,
            ssglydm:param.ssglydm,
            xxzt:param.xxzt

        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
    },
    doReset: function () {
        mini.get("nsrsbh").setValue("");
        mini.get("nsrmc").setValue("");
        mini.get("swsxmc").setValue("");
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        mini.get("sxrqQ").setValue("");
        mini.get("sxrqZ").setValue("");
        mini.get("swjgdm").setValue("");
        mini.get("ssglydm").setValue("");
        mini.get("xxzt").setValue("");
        tstxgl.selectMaps = [];
        tstxgl.qymdGrid.setData('');
    },
    exportFpqd: function () {
        var rows = tstxgl.qymdGrid.getSelecteds();

        //前置校验
        if (!tstxgl.qymdGrid.data) {
            mini.alert("请先查询");
            return;
        }

        if(tstxgl.qymdGrid == null || tstxgl.qymdGrid == ""){
            mini.alert("查询结果为空，无需导出文件！");
            return ;
        }
        var swsxmc = mini.get("swsxmc").value;
        var nsrsbh = mini.get("nsrsbh").value;
        var sqrqQ = mini.formatDate(mini.get("sqrqQ").value,"yyyy-MM-dd");
        var sqrqZ = mini.formatDate(mini.get("sqrqZ").value,"yyyy-MM-dd");
        var sxrqQ = mini.formatDate(mini.get("sxrqQ").value,"yyyy-MM-dd");
        var sxrqZ = mini.formatDate(mini.get("sxrqZ").value,"yyyy-MM-dd");
        var swjgdm = mini.get("swjgdm").value;
        var ssglydm = mini.get("ssglydm").value;
        var xxzt = mini.get("xxzt").value;
        var pageIndex = tstxgl.qymdGrid.pageIndex;
        var pageSize = tstxgl.qymdGrid.pageSize;
        var ip = window.location.protocol + "//" + window.location.host;

        if (rows.length == 0 || rows.length == pageSize) {
            window.open('/dzgzpt-wsys/api/sh/tstx/export/wsTstxList?swsxDm='+ swsxmc +'&nsrsbh=' +nsrsbh +'&xxzt=' +xxzt
                + '&sqrqQ='+sqrqQ+ '&sqrqZ='+sqrqZ+ '&sxrqQ='+sxrqQ+ '&sxrqZ='+sxrqZ+ '&swjgdm='+swjgdm+ '&ssglydm='+ssglydm
                + '&pageIndex=' + pageIndex + '&pageSize=' + pageSize + "&ip=" + ip);
        } else {
            openPostWindow('/dzgzpt-wsys/api/sh/tstx/export/wsTstxList', Base64.encode(mini.encode(rows)),'name');
        }
    },
    //标为已读
    unLock: function (record) {
        var rows = [];

        //批量判定
        if (record.type == "click") {
            var selectData = tstxgl.selectMaps;
            for (var i = 0; i < selectData.length; i++) {
                if (selectData[i] && selectData[i].length > 0) {
                    for (var j = 0; j < selectData[i].length; j++) {
                        rows.push(selectData[i][j]['sqxh']);
                    }
                }
            }
        } else {
            rows.push(record.sqxh);
        }

        //前置校验
        if (tstxgl.qymdGrid.data.length === 0) {
            mini.alert("查询结果为空！");
            return;
        }
        if (rows.length === 0) {
            mini.alert("请选择需要标为已读的条目！");
            return;
        }

        $.ajax({
            url: "/dzgzpt-wsys/api/sh/tstx/update/xxzt",
            async: false,
            contentType:"application/json",
            type:"POST",
            data: mini.encode(rows),
            success: function (data) {
                if(data.success){
                    mini.alert("标记成功！","提醒",function () {
                        // window.location.reload();
                        //表单重新加载
                        tstxgl.qymdGrid.load({
                            pageIndex: tstxgl.qymdGrid.pageIndex,
                            pageSize: tstxgl.qymdGrid.pageSize
                        });
                        tstxgl.selectMaps = [];

                    });
                } else {
                    mini.alert(data.message || "接口异常，请稍候再试");
                }
            },
            error: function (e) {
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });
    },
    openWin: function (record) {
        var url = window.location.protocol + "//" + window.location.host;
        var str = record.xxsm.replace(/跨区迁移企业税务事项报告@/, url);
        mini.open({
            url: str,        //页面地址
            title: '跨区迁移企业税务事项报告',      //标题
            width: '100%',      //宽度
            height: '100%',     //高度
            allowResize: false,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: false,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
            },
            ondestroy:function (e) {

            }
        });
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    if (record.xxzt == '已读') {
        return '';
    }else{
        return '<a class="Delete_Button" onclick="tstxgl.unLock(record)" href ="#">标为已读</a>';
    }
}

function onActionRendererSm(e) {
    var record = e.record;
    if (record.swsxMc === '跨区迁移企业税务事项报告') {
        return '<a class="Delete_Button" onclick="tstxgl.openWin(record)" href ="#">查看详情</a>';
    }else{
        return record.xxsm;
    }
}

//form展示隐藏
$(document).ready(function() {
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

function oneYearCheck(start, end) {
    if (!start || !end) return;
    var diff = new Date(end) * 1 - new Date(start) * 1;
    if (diff > 31536000000) {
        return true;
    }
    return false;
}

function nsrsbhValidate(e) {
    if (e.value == false) return;
    if (e.isValid) {
        if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
            e.errorText = "社会信用代码必须为15到20位的字母或数字！";
            e.isValid = false;
            return;
        }
    }
}

function openPostWindow(url, data, name) {
    var tempForm = document.createElement('form');
    tempForm.id = 'tempForm1';
    tempForm.method = 'post';
    tempForm.action = url;
    tempForm.target = name;

    var hideInput = document.createElement('input');
    hideInput.type = 'hidden';
    hideInput.name = 'content';

    hideInput.value = data;
    tempForm.appendChild(hideInput);
    $(tempForm).bind('onsubmit', function() {
        openWindow(name);
    });
    document.body.appendChild(tempForm);

    //tempForm.fireEvent('onsubmit');
    $(tempForm).submit();
    document.body.removeChild(tempForm);
}

function openWindow(name) {
    window.open(
        'about:blank',
        name,
        'height=400, width=400, top=0, left=0, toolbar=yes, menubar=yes, scrollbars=yes, resizable=yes,location=yes, status=yes'
    );
}


