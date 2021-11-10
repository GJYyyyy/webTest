$(function () {
    gldUtil.addWaterInPages();
    init();
});

var grid;
//日志数据维持数组
var klzzlArray;
var swjgDmValue;
var ywtblzData;

function init() {
    mini.parse();

    //获取办理事项下拉列表
    $.ajax({
        url: "../../../../api/xj/wtgl/sxsl/selectblsx",
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                var resArr = resultData.value;
                //去除 200036 出租居住用房发票开具、311050593001 城乡居民社保缴费证明打印、60060109 安置残疾人就业增值税即征即退、SB000001 个人住房房产税缴纳
                var arr = [];
                for (var i = 0; i < resArr.length; i++) {
                    if (resArr[i].blsxDm === "200036" || resArr[i].blsxDm === "311050593001" || resArr[i].blsxDm === "60060109" || resArr[i].blsxDm === "SB000001") continue;
                    arr.push(resArr[i]);
                }
                mini.get("blsx").setData(arr);
            }
        }
    });
    //获取表格dom
    grid = mini.get("sxslGrid");
    grid.on("drawcell", function (e) {
        if (e.field == "lzlxRadio") {
            var record = e.record;
            var uid = record._index
            var str = "<div>";
            $.each(record.lzlx, function (index, item) {
                checked = item.checked ? 'checked' : ''
                str += "<label><input type='radio' onclick='onValueChanged(" + uid + "\," + index + ")' " + checked + "/>" + item.lzlxmc + "</label>";
                if (index == record.lzlx.length - 1) {
                    str += "</div>";
                }
            })
            e.cellHtml = str
        }
    })

    if (getUrlParamList().from == 'hall') {
        $('.search').hide()
        $('#search').hide()
        $('#clear').hide()
        $('#save').show()
        ywtblzData = parent.ywtblzData || {}

        mini.get('nsrsbh').setValue(ywtblzData.nsrsbh || '')
        mini.get('nsrsbh').setReadOnly(true)
        mini.get('blsx').setValue(ywtblzData.blsx || '')
        mini.get('blsx').setReadOnly(true)

        Getsxbllz()
    }
}

//输入纳税人识别号后，自动带出纳税人名称，主管税务机关。
function nsrsbhBlur(e) {
    //空值判定
    if (!e.value) return;

    if (validator.isNsrsbh(e.value) == false) {
        e.errorText = "请输入正确的纳税人识别号";
        mini.alert("请输入正确的纳税人识别号");
        return;
    }

    var nsrmc = mini.get("nsrmc");
    var swjgdm = mini.get("swjgdm");
    //清空之前的信息
    nsrmc.setValue("");
    swjgdm.setValue("");
    var nsrsbh = e.value || mini.get("nsrsbh").value();

    //发起请求获取信息
    $.ajax({
        url: "../../../../api/xj/wtgl/sxsl/querymcjg?nsrsbh=" + nsrsbh,
        type: "get",
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            if (data.success && resultData.value.length) {
                if (resultData.value[0].nsrztDm != '03') {
                    mini.alert('当前纳税人登记状态不正常，不能办理此业务')
                    return false
                }
                nsrmc.setValue(resultData.value[0] ? resultData.value[0].nsrmc : "");
                // swjgdm.setData([{swjgdm:resultData.value[0].zgswjDm,swjgmc:baseCode.getMcById('DM_GY_SWJG_GT3',resultData.value[0].zgswjDm)}]);
                swjgDmValue = resultData.value[0].zgswjDm;
                var swjgmc = baseCode.getMcById('DM_GY_SWJG_GT3', resultData.value[0].zgswjDm);
                swjgdm.setValue(resultData.value[0] ? swjgmc : "");

                // nsrmc.setReadOnly(true);
                // swjgdm.setReadOnly(true);
            } else {
                mini.alert("获取失败，请稍候再试", "错误提示");
            }
        },
        error: function (data) {
            mini.alert("获取失败，请稍候再试", "错误提示");
        }
    });
}

//选择具体办理事项时，填充“可亮证资料”表格
function blsxChange(e) {
    if (getUrlParamList().from == 'hall') {
        return
    }
    var nsrsbh = mini.get("nsrsbh");
    if (!nsrsbh.value) {
        if (this.value) mini.alert("请先填写纳税人识别号。", "提醒");
        this.setValue("");
        return;
    }

    if (!e.value) return;
    var data = { blsxdm: e.value, fbzlDm: [] }
    if (getUrlParamList().from == 'hall') {
        var arr = []
        $.each(ywtblzData.lzzlList, function (index, item) {
            arr.push(item.fbzlDm)
        })
        data = { blsxdm: e.value, fbzlDm: arr }
    }
    //发起请求获取信息
    $.ajax({
        url: "../../../../api/xj/wtgl/sxsl/selectzl",
        data: mini.encode(data),
        type: "post",
        contentType: 'application/json;charset=UTF-8',
        async: false,
        success: function (data) {
            var resultData = mini.decode(data);
            //拷贝一份可亮证资料数组
            klzzlArray = JSON.parse(JSON.stringify(resultData.data));
            //设置表格数据
            grid.setData(resultData.data);
        }
    });
}

//大厅版亮证调用
function Getsxbllz() {
    var arr = []
    $.each(ywtblzData.lzzlList, function (index, item) {
        arr.push(item.fbzlDm)
    })
    data = { fbzlDm: arr }
    //发起请求获取信息
    $.ajax({
        url: "/dzgzpt-wsys/api/xj/wtgl/sxbllz/get",
        data: mini.encode(data),
        type: "post",
        contentType: 'application/json;charset=UTF-8',
        async: false,
        success: function (data) {
            if (data.success && data.value && data.value.length) {
                //拷贝一份可亮证资料数组
                klzzlArray = JSON.parse(JSON.stringify(data.value));
                $.each(klzzlArray, function (index, item) {
                    item.blsxDm = ywtblzData.blsx || ''
                })
                //设置表格数据
                grid.setData(klzzlArray);
            }
        }
    });
}

//保存日志: PDF地址，证照基本信息，操作人员信息
function doSearch() {
    var form = new mini.Form("#sxslForm");
    form.validate();
    if (!form.isValid()) {
        return false;
    }
    //前置校验
    if (!klzzlArray) return;

    //获取表单控件数据
    var form = new mini.Form("#sxslForm");
    var data = form.getData();

    //
    var filepathLength = 0;
    for (var j = 0; j < klzzlArray.length; j++) {
        if (klzzlArray[j].filePath) {
            filepathLength++;
        }
    }
    if (!filepathLength) {
        mini.alert("没有亮任何证件，请至少亮一个证件再保存日志。");
        return;
    }

    //整合需要的日志数据
    var rzdata = [];
    for (var i = 0; i < klzzlArray.length; i++) {
        // 前置校验，提示缺失
        // if(!klzzlArray[i].filePath) {
        //     mini.alert(klzzlArray[i].klzzl + "未亮证，请亮证");
        //     return;
        // }
        var obj = {}, selectedLzlxDm = '';
        $.each(klzzlArray[i].lzlx, function (index, item) {
            item.checked && (selectedLzlxDm = item.lzlxdm)
        })
        $.extend(obj, {
            "nsrsbh": data.nsrsbh,
            "nsrmc": data.nsrmc,
            "blsx_Dm": klzzlArray[i].blsxDm,
            "swjg_Dm": swjgDmValue,
            "lzlx_Dm": selectedLzlxDm,
            "klzzl_Dm": klzzlArray[i].klzzlDm,
            "zjlu": klzzlArray[i].filePath,
            "uuid": klzzlArray[i].uuid
        });
        rzdata.push(obj);
    }

    $.ajax({
        url: "../../../../api/xj/wtgl/sxsl/bcrz",
        type: "post",
        data: JSON.stringify(rzdata),
        async: false,
        contentType: "application/json",
        success: function (data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                mini.alert("保存成功", "提示", function () {
                    doReset();
                });
            } else {
                mini.alert("保存失败，请重新保存");
            }
        },
        error: function (data) {
            mini.alert("错误信息：" + data);
        }
    });
}

function doReset() {
    if (klzzlArray) {
        window.location.reload();
    }
    var form = new mini.Form("#sxslForm");
    form.reset();
}

var selectRecord = {};  //操作行数据
//调用扫码枪,获取uid请求接口获取pdf url
function openScan(record, bz) {
    selectRecord = $.extend(true, {}, record);
    var selectedLzlxDm = ''
    $.each(selectRecord.lzlx, function (index, item) {
        item.checked && (selectedLzlxDm = item.lzlxdm)
    })
    if (!selectedLzlxDm) {
        mini.alert('请先选择亮证类型～')
        return
    }
    //扫码校验，如果已经成功扫码，不再重复进入扫码逻辑
    // for(var i = 0; i < klzzlArray.length; i++){
    //     if(klzzlArray[i].klzzl == selectRecord.klzzl){
    //         if(!klzzlArray[i].filePath) return;
    //     }
    // }

    //弹出模态输入框
    var message = mini.showMessageBox({
        width: 400,
        title: "请扫码...",
        buttons: [],
        message: record.klzzl,
        html: "<div class=\"smbox\"><p>1、点击开始扫描前请将输入法调至<span style=\"color: red\">英文</span>；</p><p>2、点击开始扫描后使用扫码枪扫码；</p><p>3、点击开始扫描后请勿操作鼠标；</p><input id=\"smsr\" name=\"smsr\" type=\"text\" autocomplete=\"off\"/><a class=\"mini-button smbutton\" id=\"smbutton\">开始扫描</a></div>"
    });
    $("#smsr").attr('disabled', true);

    $("#smbutton").bind("click", function () {
        $("#smsr").attr('disabled', false);
        $("#smsr").focus();
    });

    //处理扫码枪输入uid
    var lastTime = null;
    var nextTime = null;
    var code = '';
    $('#smsr').bind('keyup', function (e) {
        var keycode = e.keyCode || e.which || e.charCode;

        nextTime = new Date();
        if (keycode === 13) {
            if (lastTime && (nextTime - lastTime < 200)) {
                // 成功调用扫码枪
                getPdf($('#smsr').val(), bz);
                mini.hideMessageBox(message);
            } else {
                //键盘
                $('#smsr').val("");
                mini.alert("扫码失败, 请重新扫码");
            }
            code = '';
            lastTime = null;
            e.preventDefault();
        } else {
            if (!lastTime) {
                code = String.fromCharCode(keycode);
            } else {
                if (nextTime - lastTime < 200) {
                    if (code.length > 15) {
                        $("#smsr").css("color", "black");
                    }
                    code += String.fromCharCode(keycode);
                } else {
                    code = '';
                    $('#smsr').val("");

                }
            }
            lastTime = nextTime;
        }
    });
}

//调用接口获取pdf
var zzqdObj = {
    "居民身份证": "310105109000100",
    "营业执照": "310100717000200",
    "残疾人证": "310101360000100",
    "不动产权证": "310100488000100",
    "不动产登记证": "310100488000100",
    "印刷经营许可证或其它印刷品许可证": "310100779000100",
    "来料加工免税证明": "310196414554500",
    "中华人民共和国道路运输经营许可证": "310100896000101",
    "中华人民共和国机动车行驶证": "310100209000100",
    "税收完税证明（表格式）": "310193490271500",
    "中华人民共和国道路运输证": "310100896000102",
    "出口货物退运已补税（未退税）证明": "310196079870500",
    "上海市危险废物经营许可证": "310100458000100",
    "中华人民共和国水路运输经营许可证": "310100924000100",
    "中华人民共和国护照": "310100192004100"
};
function getPdf(code, bz) {
    //整合post请求数据
    var form = new mini.Form("#sxslForm");
    var data = form.getData();
    var selectedLzlxDm = ''
    $.each(selectRecord.lzlx, function (index, item) {
        item.checked && (selectedLzlxDm = item.lzlxdm)
    })
    var updata = {
        "blsxDm": selectRecord.blsxDm || '',    //办理事项代码
        "certQrCode": code, //扫描之后获取的那串编码
        "klzzllx": selectedLzlxDm || '',    //可亮证资料类型
        "nsrsbh": data.nsrsbh,  //纳税人识别号
        "zgswjgDm": swjgDmValue,   //传办理分局的swjgdm
        "type": selectedLzlxDm,//zzqdObj[selectRecord.lzlx]
        bz,
        "sqxh": ywtblzData ? ywtblzData.sqxh : '',
        "fbzlDm": selectRecord.fbzlDm || ''
    };

    $.ajax({
        url: "../../../../api/xj/wtgl/sxbllz/get/lzzlxx",
        type: "post",
        data: JSON.stringify(updata),
        async: false,
        contentType: "application/json",
        success: function (data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                //根据klzzl存入klzzlArray数组
                for (var i = 0; i < klzzlArray.length; i++) {
                    if (klzzlArray[i].klzzl == record.klzzl) {
                        klzzlArray[i].filePath = resultData.value.filePath || '';
                        klzzlArray[i].fileName = resultData.value.fileName || '';
                        klzzlArray[i].uuid = resultData.value.uuid || '';
                        klzzlArray[i].fbzlDm = resultData.value.fbzlDm || '';
                    }
                }
                grid.setData(klzzlArray);

            } else {
                mini.alert(resultData.message, "提示");
            }
        },
        error: function (result) {
            mini.alert("获取失败，请重新扫码" + result.message, '错误信息');
        }
    });
};

//点击打开新窗口查看pdf
function openPdf(record) {
    //整合post请求数据
    var filePath;
    var klzzllx;
    var uuid;
    for (var i = 0; i < klzzlArray.length; i++) {
        if (klzzlArray[i].klzzl == record.klzzl) {
            filePath = klzzlArray[i].filePath;
            if (!filePath) {
                mini.alert("未扫码，请扫码后点击查看", "提示信息");
                return
            }
            $.each(klzzlArray[i].lzlx, function (index, item) {
                item.checked && (klzzllx = item.lzlxdm)
            })
            // klzzllx = klzzlArray[i].lzlxdm || '';
            uuid = klzzlArray[i].uuid || '';
        }
    }
    var form = new mini.Form("#sxslForm");
    var data = form.getData();

    var filedata = {
        "filePath": filePath,
        "klzzllx": klzzllx,
        "nsrsbh": data.nsrsbh,
        "uuid": uuid,
        "zgswjgDm": swjgDmValue   //传办理分局的swjgdm
    };

    var parString = "?data=" + JSON.stringify(filedata);
    var url = "/dzgzpt-wsys/api/xj/wtgl/sxbllz/download/lzzl" + parString;

    mini.open({
        url: "./pdfyl.html",        //页面地址
        title: 'PDF预览   注：数据加载慢请稍等！',      //标题
        iconCls: '',    //标题图标
        width: 1000,      //宽度
        height: 800,     //高度
        allowResize: true,       //允许尺寸调节
        allowDrag: true,         //允许拖拽位置
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: true,     //显示最大化按钮
        showModal: true,         //显示遮罩
        currentWindow: false,      //是否在本地弹出页面,默认false
        effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
        onload: function () {       //弹出页面加载完成

            $("body").parent().css("overflow-y", "hidden");
            // $(document).scroll(function() {
            //     $(document).scrollTop(0);
            // });
            var iframe = this.getIFrameEl();
            //调用弹出页面方法进行初始化
            iframe.contentWindow.setData(url);
        },
        ondestroy: function (action) {  //弹出页面关闭前
        }
    });
}

function onActionRendererLz(e) {
    var record = e.record;
    //传入亮证需要的参数
    return '<a class="Delete_Button lz" onclick="openScan(record,\'ssb\')" href="javascript:;">随申办亮证</a><a class="Delete_Button lz" style="margin-left:10px;" onclick="openScan(record,\'ssm\')" href="javascript:;">随申码亮证</a>';
}

function onActionRendererZj(e) {
    var record = e.record;
    if (record.filePath) {
        return '<a class="Delete_Button" onclick="openPdf(record)" href ="#">查看副本信息</a>';
    } else {
        return '<a class="Delete_Button"  style="color: #9f9f9f; cursor:default;" href="javascript:;">查看副本信息</a>';

    }
}

function onValueChanged(uid, index) {
    var row = grid.getRow(uid);
    if (!row) return;
    $.each(row.lzlx, function (index, item) {
        item.checked = false
    })
    row.lzlx[index].checked = true

    // 手动重新绘制表格
    klzzlArray[uid] = row
    grid.setData(klzzlArray)
}

function doSaveAndClose() {
    // 保存并关闭
    doSearch()
    var resData = grid.getData()
    parent && parent.closeYwtblz && parent.closeYwtblz(resData)
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};


function getUrlParamList(url) {
    url = url === undefined ? window.location.href : url;
    url = window.decodeURIComponent(url);
    var queryStr = url.split('?');
    if (queryStr.length <= 1) {
        return {};
    }
    var paramList = {};
    var params = queryStr[1].split('&');
    $.each(params, function (index, val) {
        var param = val.split('=');
        if (param.length > 1) {
            paramList[param[0].trim()] = param[1].trim();
        }
    })
    return paramList;
}