$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    fxqymdhf.init();
});

var fxqymdhf = {
    GridDatas: {
        data: [],
        total: 0
    },
    selectMaps: [],
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.sqrqQ = mini.get("sqrqQ");
        this.sqrqZ = mini.get("sqrqZ");

        this.swjgInit();
        this.doSearch();
    },
    swjgInit: function () {
        // 税务机关下拉
        var $swjgdm = mini.get("zgswjg");
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
    //表格数据加载前
    onGridLoad: function (e) {
        console.log('onGridLoad', e.sender)
        var rows = fxqymdhf.selectMaps[fxqymdhf.qymdGrid.getPageIndex()];
        if (rows) {
            for (var i = 0; i < fxqymdhf.qymdGrid.data.length; i++) {
                for (var j = 0; j < rows.length; j++) {
                    if (fxqymdhf.qymdGrid.data[i].autorowno == rows[j].autorowno) {
                        fxqymdhf.qymdGrid.setSelected(fxqymdhf.qymdGrid.getRow(i));
                    }
                }
            }
        }
        else {
            fxqymdhf.setChose();
        }
    },
    //获得选中数据
    getData: function () {
        var rowss = [];
        for (var i = 0; i < fxqymdhf.selectMaps.length; i++) {
            var irow = fxqymdhf.selectMaps[i];
            for (var j = 0; j < irow.length; j++) {
                rowss.push(irow[j]);
            }
        }
        return rowss;
    },
    //复选框选中时记录所选数据
    onSelectoinChanged: function (e) {
        var rows = fxqymdhf.qymdGrid.getSelecteds();
        fxqymdhf.selectMaps[fxqymdhf.qymdGrid.getPageIndex()] = rows;
    },
    setChose: function () {
        //根据条件获取行数组（示例获取“男”，也可以获取id，改变条件即可）
        var rows = fxqymdhf.qymdGrid.findRows(function (row) {
            if (row.IsSelect === "1") return true;
            else return false;
        });
        fxqymdhf.qymdGrid.selects(rows);
    },
    wtdlChange: function (e) {
        console.log(e.value);
        var PID = e.value;
        $.ajax({
            url: "/dzgzpt-wsys/api/baseCode/get/wtsx",
            async: false,
            type:"get",
            success: function (data) {
                var data = mini.decode(data),arr = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].PID == PID) arr.push(data[i]);
                }
                mini.get("sssxxl").setData(arr);
            },
            error: function (e) {
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });

    },
    doSearch: function () {
        fxqymdhf.qymdFrom.validate();
        if (!fxqymdhf.qymdFrom.isValid()) {
            return false;
        }
        //日期跨度最大一年，超过一年提示"日期起止跨度不能大于1年。"
        //空值判定
        var start = mini.formatDate(fxqymdhf.sqrqQ.getValue(), 'yyyy-MM-dd');
        var end = mini.formatDate(fxqymdhf.sqrqZ.getValue(), 'yyyy-MM-dd');
        if (oneYearCheck(start, end)) {
            mini.alert("日期起止跨度不能大于1年。", "范围提示");
        }

        var formData = fxqymdhf.qymdFrom.getData(true);
        var param = mini.decode(formData);
        fxqymdhf.qymdGrid.setUrl("../../../../api/sh/fxqymd/query/jcmd");
        fxqymdhf.qymdGrid.load({
                nsrsbh:param.nsrsbh,   //对应页面上统一社会信用代码
                qymc:param.nsrmc,      //企业名称
                zgswjgDm:param.zgswjg,   //主管税务机关
                sxdl:param.sssxdl,      //事项大类
                sxxl:param.sssxxl,      //事项小类
                ydyxqQ:param.sqrqQ,  //应对有效期起
                ydyxqZ:param.sqrqZ   //应对有效期止

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
        // mini.get("zgswjg").setValue("");
        mini.get("sssxdl").setValue("");
        mini.get("sssxxl").setValue("");
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        fxqymdhf.selectMaps = [];
        fxqymdhf.qymdGrid.setData('');
    },
    exportFpqd: function () {
        /*var rows = grid.getSelecteds();*/
        if (fxqymdhf.qymdGrid == null || fxqymdhf.qymdGrid == "") {
            mini.alert("查询结果为空，无需导出文件！");
            return;
        }
        var pageIndex = fxqymdhf.qymdGrid.pageIndex;
        var pageSize = fxqymdhf.qymdGrid.pageSize;
        var nsrsbh = mini.get("nsrsbh").value;
        var sssxdl = mini.get("sssxdl").value;
        var sssxxl = mini.get("sssxxl").value;
        var sqrqQ = mini.formatDate(mini.get("sqrqQ").value, 'yyyy-MM-dd');
        var sqrqZ = mini.formatDate(mini.get("sqrqZ").value, 'yyyy-MM-dd');

        window.open('/dzgzpt-wsys/api/sh/wtgl/export/yqqk?nsrsbh=' + nsrsbh + '&sssxdl='
            + sssxdl + '&sssxxl=' + sssxxl + '&sqrqQ=' + sqrqQ +
            '&sqrqZ=' + sqrqZ + '&pageSize=' + pageSize + '&pageIndex=' + pageIndex);
    },
    //模拟上传文件控件点击事件
    openFlieSelect: function () {
        $(".mini-htmlfile .mini-htmlfile-file").click();
    },
    //导入
    startUpload: function () {
        //uploader.upload();
        var inputFile = $("#file1 > input:file")[0];
        $.ajaxFileUpload({
            url: '/wszx-web/api/xj/ywtbsmbs/uploadFile',                 //用于文件上传的服务器端请求地址
            fileElementId: inputFile,               //文件上传域的ID
            //data: { a: 1, b: true },            //附加的额外参数
            dataType: 'json',                   //返回值类型 一般设置为json
            success: function (data, status) {    //服务器成功响应处理函数
                if (data.success) {
                    uploadSuccessData = data.value;
                    mini.alert("恢复成功！");
                    window.location.reload();
                } else {
                    mini.alert(data.message || "接口异常，请稍候再试");
                }
            },
            error: function (data, status, e) {   //服务器响应失败处理函数
                var mess = mini.decode(data);
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });
    },
    //恢复
    unLock: function () {
        var rows = [];
        var selectData = fxqymdhf.selectMaps;
        for (var i = 0; i < selectData.length; i++) {
            if (selectData[i].length > 0) {
                for (var j = 0; j < selectData[i].length; j++) {
                    rows.push(selectData[i][j]);
                }
            }
        }

        //前置校验
        if (fxqymdhf.qymdGrid.data.length === 0) {
            mini.alert("查询结果为空！");
            return;
        }
        if (rows.length === 0) {
            mini.alert("请选择需要恢复的条目！");
            return;
        }

        $.ajax({
            url: "/dzgzpt-wsys/api/sh/fxqymd/hf/fxmd",
            async: false,
            contentType:"application/json",
            type:"POST",
            data: mini.encode(rows),
            success: function (data) {
                if(data.success){
                    //点击[确定]按钮，刷新页面，重新获取风险企业名单。
                    mini.alert("恢复成功！","提醒",function () {
                        window.location.reload();
                        // fxqymdhf.doReset();
                    });
                } else {
                    mini.alert(data.message || "接口异常，请稍候再试");
                }
            },
            error: function (e) {
                mini.alert(data.message || "接口异常，请稍候再试");
            }
        });

        // openPostWindow('/dzgzpt-wsys/api/sh/sbtc/export/wssdqk', Base64.encode(mini.encode(rows)), 'name');
    }
};

function onActionRendererYq(e) {
    var record = e.record;
    return '<a class="Delete_Button" onclick="fxqymdhf.openTcxq(record)" href ="#">查看</a>';
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
    $(tempForm).bind('onsubmit', function () {
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

