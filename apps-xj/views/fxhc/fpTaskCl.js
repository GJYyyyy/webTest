/*
 * @Author: zhaojn
 * @Mobile: 17826856905
 * @Date: 2019-08-08 10:17:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 20:34:13
 * @Description: 
 */
var fpcl = {
    time: new Date($.ajax({ async: false }).getResponseHeader("Date")),
    zjlxList: [{
        "ID": "201",
        "MC": "居民身份证"
    }],
    openFigure: function () {
        // var query=gldUtil.getParamFromUrl()||{};
        // mini.open({
        //     // url: './hx.html',        //页面地址
        //     url: fpcl.hxUrl + '?nsrdzdah=' +Base64.encode(query.djxh)+'&qx_swjg_dm='+Base64.encode(fpcl.hxParams.qxSwjgDm)+'&current_swry_dm='+Base64.encode(fpcl.hxParams.czryDm),
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
        window.open(fpcl.hxUrl + '?nsrdzdah=' +Base64.encode(query.djxh)+'&qx_swjg_dm='+Base64.encode(fpcl.hxParams.qxSwjgDm)+'&current_swry_dm='+Base64.encode(fpcl.hxParams.czryDm));
    },
    init: function () {
        this.bind();
        this.getLocalData();
        this.initNsrData();
        this.renderForm();
        if (Tools.getUrlParamByName('sh') === 'Y') {
            $(".fhContainner").show();
            this.getLastData();//获取上次保存的数据
            $("td").removeClass("enable");
            $("html, body").animate({ scrollTop: $("#fxfctable").offset().top + "px" }, { duration: 800, easing: "swing" });
            // /*禁用spinner*/
            // mini.get("blxs2").disable();
            // mini.get("blxs3").disable();
            // mini.get("blxs4").disable();
            $(".box1,.box2,.box3,.box4").find("input,textarea").attr("disabled", "disabled");
            // mock.init();
            // /*去掉添加行按钮*/
            $(".gridBtn").remove();

            $(".jgcheckList ").eq(1).hide();
            $(".jgcheckList ").eq(2).hide();
            $(".jgcheckList ").eq(4).hide();
            $(".jgcheckList ").eq(5).hide();
        }
        // this.initFxxxTitle();
    },
    getLocalData: function () {
        fpcl.hyData = [];
        try {
            $.get("/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_GY_HY", "",
                function (value) {
                    fpcl.hyData = value
                });

            var res = $.get('/dzgzpt-wsys/api/baseCode/get/systemParam/NSRHX_URL', "");
            var res2 = $.get('/swmh/pages/index/user_info_get.json?logic-name=swmh_deskapp_query&type=user', "");
            fpcl.hxUrl = res.responseText;
            fpcl.hxParams=res2.responseJSON||{};
        } catch (e) { }

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
            if (id === 'level4' || id === 'level5') {
                $(".jgcheckList ").eq(2).show();
                $(".jgcheckList ").eq(1).hide();
                $("#xzcs_1").prop("checked", true).attr("disabled", "disabled");
            } else if (id === 'level1' || id === 'level2' || id === 'level3') {
                $(".jgcheckList ").eq(2).hide();
                $(".jgcheckList ").eq(1).show();
                $("#xzcs_1").prop("checked", false).removeAttr("disabled");
            }else if(id === 'level6'){
                $(".jgcheckList ").eq(1).hide();
                $(".jgcheckList ").eq(2).hide();
            }
        });

        $("input[name='f_fxLevel']").change(function (e) {
            var id = e.target.id;
            if (id === 'f_level4' || id === 'f_level5') {
                $(".jgcheckList ").eq(5).show();
                $(".jgcheckList ").eq(4).hide();
                $("#f_xzcs_1").prop("checked", true).attr("disabled", "disabled");
            } else if (id === 'f_level1' || id === 'f_level2' || id === 'f_level3') {
                $(".jgcheckList ").eq(4).show();
                $(".jgcheckList ").eq(5).hide();
                $("#f_xzcs_1").prop("checked", false).removeAttr("disabled");
            }else if(id === 'f_level6'){
                $(".jgcheckList ").eq(4).hide();
                $(".jgcheckList ").eq(5).hide();
            }
        });
    },
    /*初始化纳税人信息*/
    initNsrData: function () {
        var data = {};
        // var query=gldUtil.getParamFromUrl()||{};
        /* 接口获取纳税人信息 */
        ajax.get("/dzgzpt-wsys/api/sh/zhh/fx/getNsrxx" + '?djxh=' + query.djxh, "", function (result) {
            if (result.success && result.value) {
                data = result.value;
            } else {
                mini.alert(result.message);
            }
        });
        // $(".nsrxx1").text('2019-07-30');
        // $(".nsrxx2").text('2019-08-30');
        // $(".nsrxx3").text('FX20191001123201');
        $(".nsrxx4").text(data.shxydm || data.nsrsbh || '');
        $(".nsrxx5").text(data.nsrmc || '');
        $(".nsrxx6").text(query.rwlxDm === '03' ? '严重失信纳税人核查' : '发票风险');
        // if(query.rwlxDm==='03'){
        // 	parent.document.getElementsByClassName("label-content")[1].innerHTML='严重失信纳税人核查';
        // }
        // $(".nsrxx7").text(data.hyDm||'');
        $(".nsrxx8").text(data.zcdz || '');
        $(".nsrxx9").text(data.djrq || "");
        $(".nsrxx10").text(data.fddbrxm || '');
        $(".nsrxx11").text(data.nsrxxKzVO.fddbryddh || data.nsrxxKzVO.fddbrgddh || "");
        $(".nsrxx12").text(data.fddbrsfzjhm || "");
        $(".nsrxx13").text(data.nsrxxKzVO.cwfzrxm || '');
        $(".nsrxx14").text(data.nsrxxKzVO.cwfzryddh || data.nsrxxKzVO.cwfzrgddh || '');
        $(".nsrxx15").text(data.nsrxxKzVO.cwfzrsfzjhm || '');

        $(".tjrq").text(fpcl.time.format('yyyy-MM-dd'));//提交日期
        // var defaultHcdx=[{
        //     xm:data.nsrmc||'',
        //     zw:"法定代表人",
        //     lxdh:data.nsrxxKzVO.fddbryddh||data.nsrxxKzVO.fddbrgddh||"",
        //     zjlx:"201",
        //     zjhm:data.fddbrsfzjhm||""
        // }];
        // mini.get("person_grid").setData(defaultHcdx);

        $.each(fpcl.hyData, function (i, v) {
            if (v.ID == data.hyDm) {
                $(".nsrxx7").text(v.MC || "");
                return false;
            }
        });
    },
    // initFxxxTitle:function () {
    //     $(".fxTtitle1").text('高');
    //     $(".fxTtitle2").text('三级');
    //     $(".fxTtitle3").text('有走逃嫌疑');
    //     $(".fxTtitle4").text('有走逃嫌疑');
    // },
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
        $.each(fpcl.zjlxList, function (i, v) {
            if (e.value === v.ID) {
                mc = v.MC;
                return false;
            }
        });
        return mc;
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
        ajax.get("/dzgzpt-wsys/api/sh/zhh/fx/getFxxxList?djxh=" + query.djxh, "", function (result) {
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
                '    <td>\n' +
                '                        <input type="radio" name="item' + (i + 1) + '" value="1" id="item' + (i + 1) + '_1" checked><label for="item' + (i + 1) + '_1">排除风险</label>&nbsp;&nbsp;\n' +
                '                        <input type="radio" name="item' + (i + 1) + '" value="2" id="item' + (i + 1) + '_2"><label for="item' + (i + 1) + '_2">不能排除</label>&nbsp;&nbsp;\n' +
                '                        <input type="radio" name="item' + (i + 1) + '" value="3" id="item' + (i + 1) + '_3"><label for="item' + (i + 1) + '_3">风险升级</label>\n' +
                '                    </td>\n' +
                '                    <td class="enable">\n' +
                '                        <textarea name=""  cols="30" rows="10"></textarea>\n' +
                '                    </td>' +
                '                </tr>';

        });

        container.html(html ? html : ' <tr><td colspan="6" style="border:none;text-align: left;">未获取到风险列表</td></tr>');
    },
    /*获取上一环节保存的数据并展示*/
    getLastData: function () {
        // var query=gldUtil.getParamFromUrl()||{};
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
        ajax.get("/dzgzpt-wsys/api/sh/zhh/fx/getRwxx?taskId=" + window.preTaskId, "", function (result) {
            if (result.success && result.value) {
                allData = mini.decode(result.value.shnr);
            } else {
                mini.alert(result.message);
            }
        });
        $.each(allData.fxxx.checkbox, function (i, v) {
            $('#' + i).prop('checked', v);
        });
        $.each(allData.fxxx.textarea, function (i, v) {
            $("#fxTbody").find("textarea").eq(i).val(v);
        });
        $(".hcxMc").text(allData.hcdx.hcrmc);
        mini.get('lxsj').setValue(allData.hcdx.lxsj);
        mini.get("person_grid").setData(allData.hcdx.bhcrList || []);

        $(".box4").find("textarea").val(allData.chyj.chyj);
        setTimeout(function () {
            $(".box4 input[name=fxLevel]").eq(Number(allData.chyj.fxhsjg) - 1).prop("checked", true).change().attr("checked", "checked");
        }, 200);
        $(".box4 input[name=yxq]").eq(Number(allData.chyj.yxq) - 1).prop("checked", true);
        $.each(allData.chyj.table.xzcs, function (i, v) {
            $("#" + v).prop("checked", true);
        });
        // mini.get("blxs2").setValue(allData.chyj.table.blxs[0]);
        // mini.get("blxs3").setValue(allData.chyj.table.blxs[1]);
        // mini.get("blxs4").setValue(allData.chyj.table.blxs[2]);
        $.each(new Array(2), function (i, v) {
            mini.get('c_xy1_' + String(i + 1)).setValue(allData.chyj.table.yxq[i]);
        });
    }
};

$(function () {
    window.query = gldUtil.getParamFromUrl() || {};
    fpcl.init();
});

// window.saveData=function(params) {
//     if(Tools.getUrlParamByName('sh') === 'Y'){
//         return window.saveDataTemp ();
//     }
//     return true;
// }

// window.sendResult=function (flag) { 
//     if(flag&&Tools.getUrlParamByName('sh') !== 'Y'){
//         window.saveDataTemp ();
//     }
//  }
/*提供给外面接口的函数,须返回true/false */
window.saveData = function () {
    var result = false;


    if (!window.validate()) {
        return false;
    }

    var allData = {
        fxxx: {
            checkbox: {},
            textarea: {}
        },
        hcdx: {
            hcrmc: $(".hcxMc").text(),
            lxsj: mini.get('lxsj').text,
            bhcrList: mini.get("person_grid").getData() || []
        },
        chyj: {
            chyj: $(".box4").find("textarea").val(),
            fxhsjg: $(".box4 input[name=fxLevel]:checked").val(),
            yxq: $(".box4 input[name=yxq]:checked").val(),
            table: {
                xzcs: [],
                // blxs: [mini.get("blxs2").getValue(),mini.get("blxs3").getValue(),mini.get("blxs4").getValue()],
                yxq: []
            }
        },
        fhyj: {
            fhyj: $(".fhContainner").find("textarea").val(),
            fxhsjg: $(".fhContainner input[name=fxLevel]:checked").val(),
            yxq: $(".fhContainner input[name=f_yxq]:checked").val(),
            table: {
                xzcs: [],
                // blxs: [mini.get("f_blxs2").getValue(),mini.get("f_blxs3").getValue(),mini.get("f_blxs4").getValue()],
                yxq: []
            }
        }
    };

    $.each($("#fxTbody").find("input[type='radio']"), function (i, v) {
        allData.fxxx.checkbox[$(v).attr("id")] = $(v).prop("checked");
    });

    $.each($("#fxTbody").find("textarea"), function (i, v) {
        allData.fxxx.textarea[i] = $(v).val();
    });

    $.each($(".box4 input[name=xzcs]:checked"), function (i, v) {
        allData.chyj.table.xzcs.push($(v).attr("id"));
    });

    $.each(new Array(2), function (i, v) {
        allData.chyj.table.yxq.push(mini.get('c_xy1_' + String(i + 1)).text)
    });



    // var query=gldUtil.getParamFromUrl()||{};
    var req = {
        "taskId": query.taskId,
        "fxdj": ($("#level4").prop("checked") || $("#level5").prop("checked") || $("#level6").prop("checked")) ? '1' : '0',//高风险1 ,其他为0
        "shnr": mini.encode(allData),
        "hdqz": mini.get('c_xy1_1').text || '',
    };

    if ($("#level6").prop("checked")) {
        req.fxhsjgzlDm = '03';
    } else if($("#level1").prop("checked")){
        req.fxhsjgzlDm = '01';
    }else if($("#level4").prop("checked")){
        req.fxhsjgzlDm = '02';
    }

    // var yxq = $("input[name=yxq][type='radio']:checked").val();
    // if (yxq && $("#level1").prop("checked")) {
    //     var mon = "";
    //     if (yxq == '1') {
    //         mon = 1;
    //     } else if (yxq == '2') {
    //         mon = 3;
    //     } else if (yxq == '3') {
    //         mon = 6;
    //     } else if (yxq == '4') {
    //         mon = 12;
    //     }
    //     req.fxpcqz = getJzDate(mon);
    // }


    /* 初审不是这一环节时 */
    if (query.taskId != window.preTaskId) {
        req.processInstanceId = query.processInstanceId || '';
        req.djxh = query.djxh || "";
        req.fxxxbh = query.fxxxbh || '';
        req.rwlxDm = query.rwlxDm || "02";
    }

    /* 初审插入限制措施 */
    var rwxzcsDtos = [];
    if ($("#level4").prop("checked")) {
        $("#fxhctable").eq(0).find('input[name=xzcs]').each(function (i, v) {
            if ($(v).prop("checked")) {
                rwxzcsDtos.push({
                    "processInstanceId": query.processInstanceId || '',
                    "taskId": query.taskId || '',
                    "djxh": query.djxh || '',
                    "fxhcxzcsDm": "0" + $(v).val(),
                    "xzqq": fpcl.time.format('yyyy-MM-dd'),
                    "xzqz": mini.get("c_xy1_" + $(v).val()).text,
                })
            }
        })
    }


    //转决策二包
    // if ($("#level6").prop("checked")) {
    //     rwxzcsDtos.push({
    //         "processInstanceId": query.processInstanceId || '',
    //         "taskId": query.taskId || '',
    //         "djxh": query.djxh || '',
    //         "xzqq": new Date().format('yyyy-MM-dd'),
    //         "xzqz": new Date().format('yyyy-MM-dd'),
    //         "fxhcxzcsDm": '03'
    //     });
    // }


    req.rwxzcsDtos = rwxzcsDtos;

    if (Tools.getUrlParamByName('sh') !== 'Y') {
        ajax.post("/dzgzpt-wsys/api/sh/zhh/fx/mergeFxhcrwxx", mini.encode(req), function (res) {
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
            "rwlxDm": query.rwlxDm || "02",
            "fxdj": ($("#f_level4").prop("checked") || $("#f_level5").prop("checked")|| $("#f_level6").prop("checked")) ? '1' : '0',//高风险1 ,其他为0
            "zsbz": "Y",
            "shnr": mini.encode(allData),
            "hdqz": mini.get('f_xy1_1').text || ''

        };

        if ($("#f_level6").prop("checked")) {
            req.fxhsjgzlDm = '03';
        } else if($("#f_level1").prop("checked")){
            req.fxhsjgzlDm = '01';
        }else if($("#f_level4").prop("checked")){
            req.fxhsjgzlDm = '02';
        }
        
        // var yxq2 = $("input[name=f_yxq][type='radio']:checked").val();
        // if (yxq2 && $("#f_level1").prop("checked")) {
        //     var mon2 = "";
        //     if (yxq2 == '1') {
        //         mon2 = 1;
        //     } else if (yxq2 == '2') {
        //         mon2 = 3;
        //     } else if (yxq2 == '3') {
        //         mon2 = 6;
        //     } else if (yxq2 == '4') {
        //         mon2 = 12;
        //     }
        //     req.fxpcqz = getJzDate(mon2);
        // }

        /* 复审插入限制措施 */
        var rwxzcsDtos = [];
        if ($("#f_level4").prop("checked")) {
            $("#fxfctable").eq(0).find('input[name=xzcs]').each(function (i, v) {
                if ($(v).prop("checked")) {
                    rwxzcsDtos.push({
                        "processInstanceId": query.processInstanceId || '',
                        "taskId": query.taskId || '',
                        "djxh": query.djxh || '',
                        "fxhcxzcsDm": "0" + $(v).val(),
                        "xzqq": fpcl.time.format('yyyy-MM-dd'),
                        "xzqz": mini.get("f_xy1_" + $(v).val()).text,
                    });
                }
            })
        }

        //转决策二包
        // if ($("#f_level6").prop("checked")) {
        //     rwxzcsDtos.push({
        //         "processInstanceId": query.processInstanceId || '',
        //         "taskId": query.taskId || '',
        //         "djxh": query.djxh || '',
        //         "xzqq": new Date().format('yyyy-MM-dd'),
        //         "xzqz": new Date().format('yyyy-MM-dd'),
        //         "fxhcxzcsDm": '03'
        //     });
        // }

        req.rwxzcsDtos = rwxzcsDtos;

        ajax.post("/dzgzpt-wsys/api/sh/zhh/fx/mergeFxhcrwxx", mini.encode(req), function (res) {
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
        if (!$("#level1").prop("checked") && !$("#level4").prop("checked") && !$("#level6").prop("checked")) {
            mini.alert("请选择风险核实结果！");
            return false;
        }

        if ($("#level4").prop("checked") && !mini.get("c_xy1_1").text) {
            mini.alert("请选择限制期限！");
            mini.get("c_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#level4").prop("checked") && $("#xzcs_2").prop("checked") && !mini.get("c_xy1_2").text) {
            mini.alert("请选择限制期限！");
            mini.get("c_xy1_2").setIsValid(false);
            return false;
        }

        // if ($("#level1").prop("checked") && !$("#yxq1").prop("checked") && !$("#yxq2").prop("checked") && !$("#yxq3").prop("checked") && !$("#yxq4").prop("checked")) {
        //     mini.alert("请选择有效期！（注：有效期内，同样的风险不再下发风险核查任务）");
        //     return false;
        // }

        if ($("#level4").prop("checked") && mini.get("c_xy1_1").text && mini.get("c_xy1_1").text < fpcl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("c_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#level4").prop("checked") && $("#xzcs_2").prop("checked") && mini.get("c_xy1_2").text && mini.get("c_xy1_2").text < fpcl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("c_xy1_2").setIsValid(false);
            return false;
        }

    } else {
        if (!$("#f_level1").prop("checked") && !$("#f_level4").prop("checked") && !$("#f_level6").prop("checked")) {
            mini.alert("请选择风险核实结果！");
            return false;
        }

        if ($("#f_level4").prop("checked") && !mini.get("f_xy1_1").text) {
            mini.alert("请选择限制期限！");
            mini.get("f_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#f_level4").prop("checked") && $("#f_xzcs_2").prop("checked") && !mini.get("f_xy1_2").text) {
            mini.alert("请选择限制期限！");
            mini.get("f_xy1_2").setIsValid(false);
            return false;
        }

        // if ($("#f_level1").prop("checked") && !$("#f_yxq1").prop("checked") && !$("#f_yxq2").prop("checked") && !$("#f_yxq3").prop("checked") && !$("#f_yxq4").prop("checked")) {
        //     mini.alert("请选择有效期！（注：有效期内，同样的风险不再下发风险核查任务）");
        //     return false;
        // }

        if ($("#f_level4").prop("checked") && mini.get("f_xy1_1").text && mini.get("f_xy1_1").text < fpcl.time.format('yyyy-MM-dd')) {
            mini.alert("限制期限所选日期不能小于当前日期，请修改！");
            mini.get("f_xy1_1").setIsValid(false);
            return false;
        }

        if ($("#f_level4").prop("checked") && $("#f_xzcs_2").prop("checked") && mini.get("f_xy1_2").text && mini.get("f_xy1_2").text < fpcl.time.format('yyyy-MM-dd')) {
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

var getJzDate = function (month) {
    var d = new Date($.ajax({ async: false }).getResponseHeader("Date"));
    d.setMonth(d.getMonth() + Number(month));
    return d.format("yyyy-MM-dd");
}


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