var yqTaskCl = {
    time: new Date($.ajax({ async: false }).getResponseHeader("Date")),
    zjlxList: [{
        "ID": "201",
        "MC": "居民身份证"
    }],
    openFigure: function () {
        // var query=gldUtil.getParamFromUrl()||{};
        // mini.open({
        //     // url: './hx.html',        //页面地址
        //     url: yqTaskCl.hxUrl + '?nsrdzdah=' + Base64.encode(query.djxh)+'&qx_swjg_dm='+Base64.encode(yqTaskCl.hxParams.qxSwjgDm)+'&current_swry_dm='+Base64.encode(yqTaskCl.hxParams.czryDm),
        //     title: '纳税人画像',      //标题
        //     width: '1200',
        //     height: '700',
        //     showMaxButton: Boolean,
        //     onload: function () {       //弹出页面加载完成
        //         var iframe = this.getIFrameEl();
        //         //调用弹出页面方法进行初始化
        //         // iframe.contentWindow.SetData(data);
        //     }
        // })
        window.open(yqTaskCl.hxUrl + '?nsrdzdah=' + Base64.encode(query.djxh)+'&qx_swjg_dm='+Base64.encode(yqTaskCl.hxParams.qxSwjgDm)+'&current_swry_dm='+Base64.encode(yqTaskCl.hxParams.czryDm));
    },
    init: function () {
        this.bind();
        this.getLocalData();
        this.initNsrData();
        this.renderForm();

        if (Tools.getUrlParamByName('sh') === 'Y') {
            $(".fhContainner").show();
            this.getLastData(); //获取上次保存的数据
            $("td").removeClass("enable");
            $("html, body").animate({
                scrollTop: $(".fhContainner").offset().top + "px"
            }, {
                duration: 800,
                easing: "swing"
            });

            $(".box1,.box2,.box3,.box4").find("input,textarea").attr("disabled", "disabled");
            $(".gridBtn").remove();

            $(".jgcheckList").eq(1).hide();
            $(".jgcheckList").eq(2).hide();
            $(".jgcheckList").eq(4).hide();
            $(".jgcheckList").eq(5).hide();
        
        }
    },
    getLocalData: function () {
        yqTaskCl.hyData = [];
        try {
            $.get("/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_GY_HY", "",
                function (value) {
                    yqTaskCl.hyData = value
                });

            var res = $.get('/dzgzpt-wsys/api/baseCode/get/systemParam/NSRHX_URL', "");
            var res2 = $.get('/swmh/pages/index/user_info_get.json?logic-name=swmh_deskapp_query&type=user', "");
            yqTaskCl.hxUrl = res.responseText;
            yqTaskCl.hxParams = res2.responseJSON || {};
        } catch (e) { }

    },
    /*添加被核查对象*/
    addBhcdx: function () {
        var form = new mini.Form("#addRow-form");
        form.validate();
        if (form.isValid() === false) return false;
        var obj = form.getDataAndText(true);
        var data = mini.get("person_grid").getData();
        data.push(obj);
        mini.get("person_grid").setData(data);
        form.reset();
        mini.get("#addRow-win").hide();
    },
    /*删除行*/
    deleteBhcdx: function () {
        var selectRows = mini.get("person_grid").getSelecteds();
        if (selectRows.length > 0) {
            mini.confirm("确定要删除选中的数据吗？", "提示", function (res) {
                if (res === 'ok') {
                    mini.get("person_grid").removeRows(selectRows, false);
                }
            });
        } else {
            alert("请选中一条记录");
        }
    },
    addRow: function () {
        var addRow = new mini.Form("#addRow-form");
        mini.get("#addRow-win").show();
    },
    onZjlxRender: function (e) {
        var mc = "";
        $.each(yqTaskCl.zjlxList, function (i, v) {
            if (e.value === v.ID) {
                mc = v.MC;
                return false;
            }
        });
        return mc;
    },
    bind: function () {
        $("body").on("click", ".expaned", function () {
            if (/收起/.test($(this).text())) {
                $(this).attr('h', $(this).parent().parent().height() + 'px');
                $(this).parent().parent().animate({ height: "125px" });
                $(this).parent().parent().addClass("divOverflow");
                $(this).text("展开▼");
            } else {
                var _this = this;
                $(this).parent().parent().animate({ height: $(this).attr("h") }, function () {
                    $(_this).parent().parent().css({ "height": "auto" });
                });
                $(this).parent().parent().removeClass("divOverflow");
                $(this).text("收起▲");
            }
        });


        $("input[name='fxLevel']").change(function (e) {
            var id = e.target.id;
            if (id === 'level2') {
                $(".jgcheckList ").eq(2).show();
                $(".jgcheckList ").eq(1).hide();
                $("#xzcs_1").prop("checked", true).attr("disabled", "disabled");
            } else{
                $(".jgcheckList ").eq(1).hide();
                $(".jgcheckList ").eq(2).hide();
                $("#xzcs_1").prop("checked", false).removeAttr("disabled");
            }
        });

        $("input[name='f_fxLevel']").change(function (e) {
            var id = e.target.id;
            if (id === 'f_level2') {
                $(".jgcheckList ").eq(5).show();
                $(".jgcheckList ").eq(4).hide();
                $("#f_xzcs_1").prop("checked", true).attr("disabled", "disabled");
            } else {
                $(".jgcheckList ").eq(4).hide();
                $(".jgcheckList ").eq(5).hide();
                $("#f_xzcs_1").prop("checked", false).removeAttr("disabled");
            }
        });
    },
    /*初始化纳税人信息*/
    initNsrData: function () {
        var data = {};
        /* 接口获取纳税人信息 */
        ajax.get("/sxsq-wsys/api/sh/zhh/fx/getNsrxx" + '?djxh=' + query.djxh, "", function (result) {
            if (result.success && result.value) {
                data = result.value;
            } else {
                mini.alert(result.message);
            }
        });
 
        $(".nsrxx4").text(data.shxydm || data.nsrsbh || '');
        $(".nsrxx5").text(data.nsrmc || '');
        $(".nsrxx6").text('逾期风险');

        $(".nsrxx8").text(data.zcdz || '');
        $(".nsrxx9").text(data.djrq || "");
        $(".nsrxx10").text(data.fddbrxm || '');
        $(".nsrxx11").text(data.nsrxxKzVO.fddbryddh || data.nsrxxKzVO.fddbrgddh || "");
        $(".nsrxx12").text(data.fddbrsfzjhm || "");
        $(".nsrxx13").text(data.nsrxxKzVO.cwfzrxm || '');
        $(".nsrxx14").text(data.nsrxxKzVO.cwfzryddh || data.nsrxxKzVO.cwfzrgddh || '');
        $(".nsrxx15").text(data.nsrxxKzVO.cwfzrsfzjhm || '');

        $(".tjrq").text(yqTaskCl.time.format('yyyy-MM-dd'));//提交日期


        $.each(yqTaskCl.hyData, function (i, v) {
            if (v.ID == data.hyDm) {
                $(".nsrxx7").text(v.MC || "");
                return false;
            }
        });
    },
    /**
     * @description: 获取风险列表并渲染
     * @param {type}
     * @return:
     */
    renderForm: function (param) {
        var data = [];
        // var query=gldUtil.getParamFromUrl()||{};
        var container = $("#fxTbody");
        var html = "";
        /* 接口获取风险列表信息 */
        ajax.get("/sxsq-wsys/api/sh/zhh/fx/getYqFxxxList?djxh=" + query.djxh + "&fxmxBh=" + query.fxxxbh, "", function (result) {
            // "/dzgzpt-wsys/api/sh/zhh/fx/getFxxxList?processInstanceId="+query.processInstanceId,""
            if (result.success && result.value) {
                data = result.value || [];
            } else {
                mini.alert(result.message);
            }
        });

        $.each(data, function (i, v) {
            html += '           <tr fxCode="' + v.fxCode + '">\n' +
                '                    <td>' + (i + 1) + '</td>\n' +
                '                    <td>' + v.fxly + '</td>\n' +
                '                    <td>' + v.fxlx + '</td>\n' +
                '                    <td class="txt-l" width="20%">' + v.fxnr + '</td>\n' +
                '<td>' + v.zbsc + '</td>\n' +
                '<td>' + v.state + '</td>\n' +
                '<td>' + v.gzqx + '</td>\n' +
                '<td>' + v.smsj + '</td>\n' +
                '<td>' + v.smzq + '</td>\n' +
                '<td>' + v.scxfrq + '</td>\n' +
                '<td>' + (v.qsrq || '') + '</td>\n' +
                '                </tr>';

        });

        container.html(html ? html : ' <tr><td colspan="6" style="border:none;text-align: left;">未获取到风险列表</td></tr>');
    },
    /*获取上一次保存的数据*/
    getLastData: function () {
        // var query = gldUtil.getParamFromUrl() || {};
        window.preTaskId = "";
        ajax.get("/workflow/web/workflow/engine/task/relation/by/processInsId/list?processInsId=" + query.processInstanceId + "&taskId=" + query.taskId, "", function (res) {
            var d = res.data;
            $.each(d, function (i, v) {
                if (v.taskId == query.taskId) {
                    if (v.preTaskId == 0) {
                        window.preTaskId = v.taskId;
                    } else {
                        window.preTaskId = v.preTaskId;
                    }
                    return false;
                }
            })
        });
        if (!window.preTaskId) {
            mini.alert('获取上一环节任务ID失败！');
            return;
        }
        ajax.get("/sxsq-wsys/api/sh/zhh/fx/getRwxx?taskId=" + window.preTaskId, "", function (result) {
            if (result.success && result.value) {
                allData = mini.decode(result.value.shnr);
            } else {
                mini.alert(result.message);
            }
        });
        $(".hcxMc").text(allData.hcdx.hcrmc);
        mini.get('lxsj').setValue(allData.hcdx.lxsj);
        mini.get("person_grid").setData(allData.hcdx.bhcrList || []);
        $(".box4").find("textarea").val(allData.chyj.chyj);
        setTimeout(function () {
            $(".box4 input[name=fxLevel]").eq(Number(allData.chyj.fxhsjg) - 1).prop("checked", true).change().attr("checked", "checked");
        }, 200);
        $.each(allData.chyj.table.xzcs, function (i, v) {
            $("#" + v).prop("checked", true);
        });
        $.each(new Array(2), function (i, v) {
            mini.get('c_xy1_' + String(i + 1)).setValue(allData.chyj.table.yxq[i]);
        });
    }
};
/*提供给外面接口的函数,须返回true/false */
window.saveData = function () {
    var result = false;


    if (!window.validate()) {
        return false;
    }

    var allData = {
        hcdx: {
            hcrmc: $(".hcxMc").text(),
            lxsj: mini.get('lxsj').text,
            bhcrList: mini.get("person_grid").getData() || []
        },
        chyj: {
            chyj: $(".box4").find("textarea").val(),
            fxhsjg: $(".box4 input[name=fxLevel]:checked").attr("index"),
            table: {
                xzcs: [],
                // blxs: [mini.get("blxs2").getValue(),mini.get("blxs3").getValue(),mini.get("blxs4").getValue()],
                yxq: []
            }
        },
        fhyj: {
            fhyj: $(".fhContainner").find("textarea").val(),
            fxhsjg: $(".fhContainner input[name=fxLevel]:checked").attr("index"),
            table: {
                xzcs: [],
                // blxs: [mini.get("f_blxs2").getValue(),mini.get("f_blxs3").getValue(),mini.get("f_blxs4").getValue()],
                yxq: []
            }
        }
    };


    
    $.each($(".box4 input[name=xzcs]:checked"), function (i, v) {
        allData.chyj.table.xzcs.push($(v).attr("id"));
    });

    $.each(new Array(2), function (i, v) {
        allData.chyj.table.yxq.push(mini.get('c_xy1_' + String(i + 1)).text)
    });

    // var query=gldUtil.getParamFromUrl()||{};
    var req = {
        "taskId": query.taskId,
        "fxdj": $("#level2").prop("checked") ? '1' : '0',//高风险1 ,其他为0
        "shnr": mini.encode(allData),
        "hdqz": '',
        "fxhsjgzlDm":"",
        "processInstanceId":query.processInstanceId || '',
        "djxh":query.djxh || "",
        "fxxxbh":query.fxxxbh || '',
        "rwlxDm" :query.rwlxDm || "04",
        "rwxzcsDtos":[]
    };

    if ($("#level1").prop("checked")) {
        req.fxhsjgzlDm = '03';
    } else if($("#level4").prop("checked")){
        req.fxhsjgzlDm = '01';
    }else if($("#level2").prop("checked")){
        req.fxhsjgzlDm = '02';
    }

    var rwxzcsDtos = [];
    if ($("#level2").prop("checked")) {
        $("#fxhctable").eq(0).find('input[name=xzcs]').each(function (i, v) {
            if ($(v).prop("checked")) {
                rwxzcsDtos.push({
                    "processInstanceId": query.processInstanceId || '',
                    "taskId": query.taskId || '',
                    "djxh": query.djxh || '',
                    "fxhcxzcsDm": "0" + $(v).val(),
                    "xzqq": yqTaskCl.time.format('yyyy-MM-dd'),
                    "xzqz": mini.get("c_xy1_" + $(v).val()).text,
                })
            }
        });
    }

    req.rwxzcsDtos = rwxzcsDtos;


    if (Tools.getUrlParamByName('sh') !== 'Y') {
        ajax.post("/sxsq-wsys/api/sh/zhh/fx/mergeFxhcrwxx", mini.encode(req), function (res) {
            if (res.success && res.value) {
                result = res.value;
                // mini.alert("保存成功！");
            } else {
                mini.alert(res.message);
            }
        });

    } else {
        /*复审时才保存复核的数据*/
        $.each($(".fhContainner input[name=xzcs]:checked"), function (i, v) {
            allData.fhyj.table.xzcs.push($(v).attr("id"));
        });

        $.each(new Array(2), function (i, v) {
            allData.fhyj.table.yxq.push(mini.get('f_xy1_' + String(i + 1)).text)
        });
        req = {
            "processInstanceId": query.processInstanceId || '',
            "taskId": query.taskId || '',
            "djxh": query.djxh || '',
            "fxxxbh": query.fxxxbh,
            "rwlxDm": "04",
            "fxdj": $("#f_level2").prop("checked") ? '1' : '0',//高风险1 ,其他为0
            "zsbz": "Y",
            "shnr": mini.encode(allData),
            "fxhsjgzlDm":"",
            "rwxzcsDtos":[],
            "hdqz": ''
        };
        if ($("#f_level1").prop("checked")) {
            req.fxhsjgzlDm = '03';
        } else if($("#f_level4").prop("checked")){
            req.fxhsjgzlDm = '01';
        }else if($("#f_level2").prop("checked")){
            req.fxhsjgzlDm = '02';
        }

        var rwxzcsDtos = [];
        if ($("#f_level2").prop("checked")) {
            $("#fxfctable").eq(0).find('input[name=xzcs]').each(function (i, v) {
                if ($(v).prop("checked")) {
                    rwxzcsDtos.push({
                        "processInstanceId": query.processInstanceId || '',
                        "taskId": query.taskId || '',
                        "djxh": query.djxh || '',
                        "fxhcxzcsDm": "0" + $(v).val(),
                        "xzqq": yqTaskCl.time.format('yyyy-MM-dd'),
                        "xzqz": mini.get("f_xy1_" + $(v).val()).text,
                    })
                }
            })
        }
        req.rwxzcsDtos = rwxzcsDtos;

        ajax.post("/sxsq-wsys/api/sh/zhh/fx/mergeFxhcrwxx", mini.encode(req), function (res) {
            if (res.success && res.value) {
                result = res.value;
                // mini.alert("保存成功！");
            } else {
                mini.alert(res.message);
            }
        });
    }

    return result;
};

window.validate = function () {
    if (Tools.getUrlParamByName('sh') !== 'Y') {
        if (!$("#level1").prop("checked") && !$("#level4").prop("checked")&& !$("#level2").prop("checked")) {
            mini.alert("请选择风险核实结果！");
            return false;
        }

        if ($("#level2").prop("checked") && $("#xzcs_2").prop("checked") && !mini.get("c_xy1_2").text) {
            mini.alert("请选择限制期限！");
            mini.get("c_xy1_2").setIsValid(false);
            return false;
        }

        
        if ($("#level2").prop("checked") && $("#xzcs_1").prop("checked") && !mini.get("c_xy1_1").text) {
            mini.alert("请选择限制期限！");
            mini.get("c_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#level2").prop("checked") && mini.get("c_xy1_1").text && mini.get("c_xy1_1").text < yqTaskCl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("c_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#level2").prop("checked") && $("#xzcs_2").prop("checked") && mini.get("c_xy1_2").text && mini.get("c_xy1_2").text < yqTaskCl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("c_xy1_2").setIsValid(false);
            return false;
        }

        


    } else {
        if (!$("#f_level1").prop("checked") && !$("#f_level4").prop("checked")&& !$("#f_level2").prop("checked")) {
            mini.alert("请选择风险核实结果！");
            return false;
        }

        if ($("#f_level2").prop("checked") && $("#f_xzcs_2").prop("checked") && !mini.get("f_xy1_2").text) {
            mini.alert("请选择限制期限！");
            mini.get("f_xy1_2").setIsValid(false);
            return false;
        }

        if ($("#f_level2").prop("checked") && $("#f_xzcs_1").prop("checked") && !mini.get("f_xy1_1").text) {
            mini.alert("请选择限制期限！");
            mini.get("f_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#f_level2").prop("checked") && mini.get("f_xy1_1").text && mini.get("f_xy1_1").text < yqTaskCl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("f_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#f_level2").prop("checked") && $("#f_xzcs_2").prop("checked") && mini.get("f_xy1_2").text && mini.get("f_xy1_2").text < yqTaskCl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("f_xy1_2").setIsValid(false);
            return false;
        }

    }

    return true;
}
ajax.post = function (url, params, successCallback, errCallback) {
    $.ajax({
        url: url,
        data: params,
        contentType: "application/json",
        success: function (res) {
            successCallback(res);
        },
        error: function (res) {
            errCallback(res)
        }
    })
};
$(function () {
    window.query = gldUtil.getParamFromUrl() || {};
    yqTaskCl.init();
});


var Base64 = {
    // 转码表
    table : [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
        'I', 'J', 'K', 'L', 'M', 'N', 'O' ,'P',
        'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
        'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
        'w', 'x', 'y', 'z', '0', '1', '2', '3',
        '4', '5', '6', '7', '8', '9', '+', '/'
    ],
    UTF16ToUTF8 : function(str) {
        var res = [], len = str.length;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            if (code > 0x0000 && code <= 0x007F) {
                // 单字节，这里并不考虑0x0000，因为它是空字节
                // U+00000000 – U+0000007F 	0xxxxxxx
                res.push(str.charAt(i));
            } else if (code >= 0x0080 && code <= 0x07FF) {
                // 双字节
                // U+00000080 – U+000007FF 	110xxxxx 10xxxxxx
                // 110xxxxx
                var byte1 = 0xC0 | ((code >> 6) & 0x1F);
                // 10xxxxxx
                var byte2 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2)
                );
            } else if (code >= 0x0800 && code <= 0xFFFF) {
                // 三字节
                // U+00000800 – U+0000FFFF 	1110xxxx 10xxxxxx 10xxxxxx
                // 1110xxxx
                var byte1 = 0xE0 | ((code >> 12) & 0x0F);
                // 10xxxxxx
                var byte2 = 0x80 | ((code >> 6) & 0x3F);
                // 10xxxxxx
                var byte3 = 0x80 | (code & 0x3F);
                res.push(
                    String.fromCharCode(byte1),
                    String.fromCharCode(byte2),
                    String.fromCharCode(byte3)
                );
            } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                // 四字节
                // U+00010000 – U+001FFFFF 	11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                // 五字节
                // U+00200000 – U+03FFFFFF 	111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                // 六字节
                // U+04000000 – U+7FFFFFFF 	1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    UTF8ToUTF16 : function(str) {
        var res = [], len = str.length;
        var i = 0;
        for (var i = 0; i < len; i++) {
            var code = str.charCodeAt(i);
            // 对第一个字节进行判断
            if (((code >> 7) & 0xFF) == 0x0) {
                // 单字节
                // 0xxxxxxx
                res.push(str.charAt(i));
            } else if (((code >> 5) & 0xFF) == 0x6) {
                // 双字节
                // 110xxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var byte1 = (code & 0x1F) << 6;
                var byte2 = code2 & 0x3F;
                var utf16 = byte1 | byte2;
                res.push(Sting.fromCharCode(utf16));
            } else if (((code >> 4) & 0xFF) == 0xE) {
                // 三字节
                // 1110xxxx 10xxxxxx 10xxxxxx
                var code2 = str.charCodeAt(++i);
                var code3 = str.charCodeAt(++i);
                var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                var utf16 = ((byte1 & 0x00FF) << 8) | byte2
                res.push(String.fromCharCode(utf16));
            } else if (((code >> 3) & 0xFF) == 0x1E) {
                // 四字节
                // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else if (((code >> 2) & 0xFF) == 0x3E) {
                // 五字节
                // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                // 六字节
                // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
            }
        }

        return res.join('');
    },
    encode : function(str) {
        if (!str) {
            return '';
        }
        return str;
        var utf8    = this.UTF16ToUTF8(str); // 转成UTF8
        var i = 0; // 遍历索引
        var len = utf8.length;
        var res = [];
        while (i < len) {
            var c1 = utf8.charCodeAt(i++) & 0xFF;
            res.push(this.table[c1 >> 2]);
            // 需要补2个=
            if (i == len) {
                res.push(this.table[(c1 & 0x3) << 4]);
                res.push('==');
                break;
            }
            var c2 = utf8.charCodeAt(i++);
            // 需要补1个=
            if (i == len) {
                res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
                res.push(this.table[(c2 & 0x0F) << 2]);
                res.push('=');
                break;
            }
            var c3 = utf8.charCodeAt(i++);
            res.push(this.table[((c1 & 0x3) << 4) | ((c2 >> 4) & 0x0F)]);
            res.push(this.table[((c2 & 0x0F) << 2) | ((c3 & 0xC0) >> 6)]);
            res.push(this.table[c3 & 0x3F]);
        }

        return res.join('');
    },
    decode : function(str) {
        if (!str) {
            return '';
        }

        var len = str.length;
        var i   = 0;
        var res = [];

        while (i < len) {
            code1 = this.table.indexOf(str.charAt(i++));
            code2 = this.table.indexOf(str.charAt(i++));
            code3 = this.table.indexOf(str.charAt(i++));
            code4 = this.table.indexOf(str.charAt(i++));

            c1 = (code1 << 2) | (code2 >> 4);
            res.push(String.fromCharCode(c1));

            if (code3 != -1) {
                c2 = ((code2 & 0xF) << 4) | (code3 >> 2);
                res.push(String.fromCharCode(c2));
            }
            if (code4 != -1) {
                c3 = ((code3 & 0x3) << 6) | code4;
                res.push(String.fromCharCode(c3));
            }

        }

        return this.UTF8ToUTF16(res.join(''));
    }
};