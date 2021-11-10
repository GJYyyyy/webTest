var cjrlz = {
    gridData: null,
    swjgDmValue: undefined,
    zzqdObj: {
        "居民身份证": "310105109000100",
        "营业执照": "310100717000200",
        "残疾人证": "310101360000100",
        "不动产权证": "310100488000100",
        "不动产登记证": "310100488000100"
    },
    init: function () {
        //获取办理事项下拉列表
        this.blsx = mini.get("blsx");
        this.setBlsx();

        //设置亮证类型
        this.lzlx = mini.get("lzlx");
        this.setLzlx();

        this.nsrmc = mini.get("nsrmc");
        this.swjgdm = mini.get("swjgdm");
        this.nsrsbh = mini.get("nsrsbh");
        this.blsx = mini.get("blsx");

        this.form = new mini.Form("#sxslForm");

        //获取表格dom
        this.grid = mini.get("sxslGrid");
    },
    //办理事项下拉框
    setBlsx: function () {
        $.ajax({
            url: "../../../../api/xj/wtgl/sxsl/selectblsx",
            type: "get",
            async: false,
            success: function (data) {
                var resultData = mini.decode(data);
                if (resultData.success) {
                    var value = resultData.value;
                    for (var i = 0; i < value.length; i++) {
                        //暂时写死，只显示残疾人就业增值税即征即退
                        if (value[i].blsxDm === '110110110') {
                            var czwArray = [];
                            czwArray.push(value[i]);
                        }
                    }
                    cjrlz.blsx.setData(czwArray);
                }
            }
        });
    },
    //亮证类型下拉框
    setLzlx: function () {
        this.lzlx.setValue([{
            ID: "310101360000100",
            MC: "残疾人证"
        }]);
    },
    //纳税人识别号valuechange回调
    nsrsbhBlur: function (e) {
        //空值判定
        if (!e.value) return;

        if (validator.isNsrsbh(e.value) == false) {
            e.errorText = "请输入正确的纳税人识别号";
            mini.alert("请输入正确的纳税人识别号");
            return;
        }

        //清空之前的信息
        cjrlz.nsrmc.setValue("");
        cjrlz.swjgdm.setValue("");
        var nsrsbhValue = e.value || cjrlz.nsrsbh.value();

        //发起请求获取信息
        $.ajax({
            url: "../../../../api/xj/wtgl/sxsl/querymcjg?nsrsbh=" + nsrsbhValue,
            type: "get",
            async: false,
            success: function (data) {
                var resultData = mini.decode(data);
                if (data.success) {
                    cjrlz.nsrmc.setValue(resultData.value[0] ? resultData.value[0].nsrmc : "");
                    // cjrlz.swjgdm.setValue(resultData.value[0] ? resultData.value[0].zgswjDm : "");
                    cjrlz.swjgDmValue = resultData.value[0].zgswjDm;
                    var swjgmc = baseCode.getMcById('DM_GY_SWJG_GT3', resultData.value[0].zgswjDm);
                    cjrlz.swjgdm.setValue(resultData.value[0] ? swjgmc : "");
                } else {
                    mini.alert("获取失败，请稍候再试", "错误提示");
                }
            },
            error: function (data) {
                mini.alert("获取失败，请稍候再试", "错误提示");
            }
        });
    },
    //办理事项valuechange，填充“可亮证资料”表格
    blsxChange: function (e, str) {
        var nsrsbhValue = cjrlz.nsrsbh.value;
        var blsxValue = e.value;

        if (!nsrsbhValue) {
            if (cjrlz.blsx.value || str === "add") mini.alert("请先填写纳税人识别号。", "提醒");
            cjrlz.blsx.setValue("");
            return;
        }
        if (!blsxValue) {
            mini.alert("请选择办理事项。", "提醒");
            return;
        }

        //发起请求获取信息
        $.ajax({
            url: "../../../../api/xj/wtgl/sxsl/selectzl?blsx_dm=" + blsxValue,
            type: "get",
            async: false,
            success: function (data) {
                var resultData = mini.decode(data);
                //设置表格数据
                if (str === "add") {
                    //如果都删完了
                    if (cjrlz.gridData.length == 0) {
                        //加key
                        resultData.data[0]._key = 0;
                        cjrlz.gridData = resultData.data;
                        cjrlz.grid.setData(resultData.data);
                    } else {
                        //加key
                        resultData.data[0]._key = cjrlz.gridData[cjrlz.gridData.length - 1]._key + 1;
                        // cjrlz.gridData.push(resultData.data[0]);     //addRow会同时更新dom和添加数据
                        cjrlz.grid.addRow(resultData.data[0]);
                    }
                } else {
                    //加key
                    resultData.data[0]._key = 0;
                    cjrlz.gridData = resultData.data;
                    cjrlz.grid.setData(resultData.data);
                }
            }
        });
    },
    //增加行
    addT: function () {
        cjrlz.blsxChange(cjrlz.blsx, "add");
    },
    //删除行
    removeT: function () {
        var rows = cjrlz.grid.getSelecteds();
        var row = rows[0];
        if (rows.length > 0) {
            mini.confirm('确定删除选中的记录吗？', '提示', function (action) {
                if (action === 'ok') {
                    cjrlz.grid.removeRows(rows, false); // false 不会自动选中下一条记录

                    //获取数组中数据的下标
                    var index = cjrlz.gridData.indexOf(row);
                    //删除数据
                    if (index > -1) {
                        cjrlz.gridData.splice(index, 1);
                    }

                    // showTips('删除成功', '表格数据删除成功', 'success', 2000);
                    mini.alert('删除成功', '表格数据删除成功');
                }
            });
        } else {
            mini.alert("请选中一条记录");
        }
    },
    //清空
    doReset: function () {
        if (cjrlz.gridData) {
            window.location.reload();
        }
        cjrlz.nsrmc.setValue("");
        cjrlz.swjgdm.setValue("");
        cjrlz.nsrsbh.setValue("");
        cjrlz.blsx.setValue("");

    },
    //调用扫码枪,获取uid请求接口获取pdf url
    // openScan: function(record) {
    //     //弹出模态输入框
    //     var message = mini.showMessageBox({
    //         width: 250,
    //         title: "请扫码，扫码过程中请勿操作键盘。",
    //         buttons: [],
    //         message: record.klzzl,
    //         html: "<input id=\"smsr\" name=\"smsr\" style=\"width: 100%;\" type=\"text\" autocomplete=\"off\" />"
    //     });

    //     $("#smsr").focus();
    //     $('#smsr').bind('keyup', function (e) {
    //         var keycode = e.keyCode || e.which || e.charCode;
    //         //回车判定
    //         if (keycode === 13) {
    //             // 扫码枪
    //             //调用API传入code获取pdf地址
    //             getPdf($('#smsr').val());
    //             mini.hideMessageBox(message);
    //         }
    //     });
    // },
    openScan: function (e) {
        //获取当前点击行的key值
        var key = e._key;

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
                    cjrlz.getPdf($('#smsr').val(), key);
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
    },
    getPdf: function (code, key) {
        if (!code && key) return;
        //获取点击行
        var clickRow;
        for (var i = 0; i < cjrlz.gridData.length; i++) {
            if (cjrlz.gridData[i]._key == key) {
                clickRow = cjrlz.gridData[i];
            }
        }

        //整合post请求数据
        var data = cjrlz.form.getData();
        var updata = {
            "blsxDm": clickRow.blsxDm || '', //办理事项代码
            "certQrCode": code, //扫描之后获取的那串编码
            "klzzllx": clickRow.lzlxDm || '', //可亮证资料类型
            "nsrsbh": data.nsrsbh, //纳税人识别号
            "zgswjgDm": cjrlz.swjgDmValue, //传办理分局的swjgdm
            "type": "310101360000100"
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
                    clickRow.filePath = resultData.value.filePath || '';
                    clickRow.uuid = resultData.value.uuid || '';
                    cjrlz.grid.setData(cjrlz.gridData);
                } else {
                    mini.alert(resultData.message, "提示");
                }
            },
            error: function (result) {
                mini.alert("获取失败，请重新扫码" + result.message, '错误信息');

            }
        });
    },
    //点击打开新窗口查看pdf
    openPdf: function (record) {
        var data = cjrlz.form.getData();
        var filedata = {
            "filePath": record.filePath,
            "klzzllx": record.lzlxDm,
            "uuid": record.uuid,
            "nsrsbh": data.nsrsbh,
            "zgswjgDm": cjrlz.swjgDmValue //传办理分局的swjgdm
        };
        var parString = "?data=" + JSON.stringify(filedata);
        var url = "/dzgzpt-wsys/api/xj/wtgl/sxbllz/download/lzzl" + parString;

        mini.open({
            url: "./pdfyl.html", //页面地址
            title: 'PDF预览   注：数据加载慢请稍等！', //标题
            iconCls: '', //标题图标
            width: 1000, //宽度
            height: 800, //高度
            allowResize: true, //允许尺寸调节
            allowDrag: true, //允许拖拽位置
            showCloseButton: true, //显示关闭按钮
            showMaxButton: true, //显示最大化按钮
            showModal: true, //显示遮罩
            currentWindow: false, //是否在本地弹出页面,默认false
            effect: 'none', //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () { //弹出页面加载完成

                $("body").parent().css("overflow-y", "hidden");
                // $(document).scroll(function() {
                //     $(document).scrollTop(0);
                // });
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(url);
            },
            ondestroy: function (action) { //弹出页面关闭前
            }
        });
    },
    //保存日志
    doSearch: function () {
        cjrlz.form.validate();
        if (!cjrlz.form.isValid()) {
            return false;
        }
        if (cjrlz.gridData.length == 0) return;

        //
        var filepathLength = 0;
        for (var j = 0; j < cjrlz.gridData.length; j++) {
            if (cjrlz.gridData[j].filePath) {
                filepathLength++;
            }
        }
        if (!filepathLength) {
            mini.alert("没有亮任何证件，请至少亮一个证件再保存日志。");
            return;
        }

        //整合需要的日志数据
        var formData = cjrlz.form.getData();
        var rzdata = [];
        for (var i = 0; i < cjrlz.gridData.length; i++) {
            // 前置校验，提示缺失
            // if(!klzzlArray[i].filePath) {
            //     mini.alert(klzzlArray[i].klzzl + "未亮证，请亮证");
            //     return;
            // }

            var obj = {};
            $.extend(obj, {
                "nsrsbh": formData.nsrsbh,
                "nsrmc": formData.nsrmc,
                "blsx_Dm": cjrlz.gridData[i].blsxDm,
                "swjg_Dm": cjrlz.swjgDmValue,
                "lzlx_Dm": cjrlz.gridData[i].lzlxDm,
                "klzzl_Dm": cjrlz.gridData[i].klzzlDm,
                "zjlu": cjrlz.gridData[i].filePath,
                "uuid": cjrlz.gridData[i].uuid
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
};

function onActionRendererLz(e) {
    var record = e.record;
    //传入亮证需要的参数
    return '<a class="Delete_Button lz" onclick="cjrlz.openScan(record)" href="#">随申办亮证</a>';
}

function onActionRendererZj(e) {
    var record = e.record;
    if (record.filePath) {
        return '<a class="Delete_Button" onclick="cjrlz.openPdf(record)" href ="#">查看副本信息</a>';
    } else {
        return '<a class="Delete_Button"  style="color: #9f9f9f; cursor:default;" href ="#">查看副本信息</a>';
    }
}


function onnsrsbhValidation(e) {
    if (!e.value) return;
    if (validator.isNsrsbh(e.value) == false) {
        e.errorText = "请输入正确的纳税人识别号";
        mini.alert("请输入正确的纳税人识别号");
        return;
    }
}

function onMcValidation(e) {
    if (!e.value) return;
    if (validator.isChinese(e.value) == false) {
        e.errorText = "请输入正确的姓名";
        mini.alert("请输入正确的姓名");
        return;
    }
}

function onZjhmValidation(e) {
    if (!e.value) return;
    if (validator.isZjhm(e.value) == false || validator.isSfzhm(e.value) == false) {
        e.errorText = "请输入正确的证件号码";
        mini.alert("请输入正确的证件号码");
        return;
    }
}

$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    cjrlz.init();
});