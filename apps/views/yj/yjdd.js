var grid;
var exportIFrame;
var win;
var form;
var fromdatas;
var ddh;
var yjhm;
var _swjgmc;
var dysjrlxdh;

$(function () {
    mini.parse();
    $("#yjGrid").removeAttr("tabindex");
    init();
});

function init() {
    grid = mini.get("yjGrid");
    form = new mini.Form("#searchdiv");
    win = mini.get("editWindow");
    grid.setUrl("/dzgzpt-wsys/api/wtgl/yj/queryYjDdxxLogic");

    //税务机关下拉
    var $swjgdm = mini.get("swjgdm");
    $.ajax({
        url: "/dzgzpt-wsys/api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
        data: "",
        type: "post",
        async: false,
        success: function (obj) {
            var datas = mini.decode(obj);
            $swjgdm.loadList(datas, "jgDm", "PID");
            $swjgdm.setValue(datas[0].jgDm);
        },
        error: function () {
        }
    });
    search();
}

function onClzt(e) {
    var record = e.record;
    var s = "";
    if (record.clzt == "1") {//小于5的状态都认为是未处理
        s = '未处理';
    } else if (record.clzt == "4") {
        s = "订单发送失败";
    } else if (record.clzt == "5") {
        s = '已出票待邮寄';
    }
    else if (record.clzt == "6") {
        s = '已投递';
    } else if (record.clzt == "7") {
        s = '已签收';
    }
    return s;
}


function onActionRenderer(e) {
    var record = e.record;
    var sqxh = record.sqxh;
    var s = "";
    if (record.clzt == "5") {//已出票待邮寄才能打印面单
        s = "<a class='mini-button toolBtn-blue' href='javascript:dykdmd(" + mini.encode(record) + ")'>打印面单</a>";
    } else if (record.clzt == "6" || record.clzt == "7") {
        s = "<a class='mini-button' style='margin-right: 5px;' href='javascript:dykdmd(" + mini.encode(record) + ")'>查看面单</a><a class='mini-button toolBtn-blue' href='javascript:ViewWlxx(" + mini.encode(sqxh) + ")'>物流查询</a>";
    }
    return s;
}


/**
 * 查看物流信息
 * @param e
 */

function ViewWlxx(sqxh) {
    $.ajax({
        url: "/dzgzpt-wsys/api/wtgl/yj/queryExpressqk",
        contentType: 'application/json;charset=utf-8',
        type: "post",
        async: false,
        data: mini.encode({"sqxh": sqxh}),
        success: function (data) {
            var resultData = mini.decode(data);
            if (!resultData.success) {
                mini.alert(resultData.message, '提示信息');
            } else {
                var data = mini.decode(resultData.value); // 反序列化成对象
                mini.open({
                    url: "yjwlxx.html",
                    title: "查看物流",
                    width: 450,
                    height: 560,
                    onload: function () {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.setData(data);
                    }
                });
            }
        },
        error: function (data) {
            mini.alert("出现系统错误，请稍后再试。。。。。", "提示信息", function () {
            });
        }
    });
}

/**
 * 打印快递面单
 * @param record
 */
function dykdmd(record) {
    var sqxh = record.sqxh;
    var yjlx = record.yjlx;
    $("#fpxx").hide();
    $("#printId").show();
    var flag = new Boolean(true);
    if (yjlx == "1") {
        //初始化票据
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/yj/queryFpxx",
            contentType: 'application/json;charset=utf-8',
            type: "post",
            async: false,
            data: mini.encode({"sqxh": sqxh}),
            success: function (data) {
                var json = mini.decode(data);
                if (json.success) {
                    var list = json.value;
                    if (list != null) {
                        var grid = mini.get("datagrid_fp");
                        grid.setData(list);
                        var divStr = "";
                        $.each(list, function (i, item) {
                            divStr += "<span>" + item.fpzlmc + "</span><br>";
                            divStr += "<span>数量:" + (item.hffs) + "</span><br>";

                        });
                        $("#fphmWrap").html(divStr);
                    } else {
                        mini.alert("未核票，不能进行邮寄！");
                        flag = false;
                    }
                } else {
                    mini.alert("未核票，不能进行邮寄！");
                    flag = false;
                }
            },
            error: function (data) {
                mini.alert("出现系统错误，请稍后再试。。。。。", "提示信息", function () {
                });
                flag = false;
            }
        });

    } else if (yjlx == "2") {
        var list = new Array();
        var djz = new Object();
        djz.hffs = 1;
        djz.fpdwzl = 0.04;
        djz.fpzlmc = "税务登记证";
        list.push(djz);
        var grid = mini.get("datagrid_fp");
        grid.setData(list);
        var pjxx = list[0];
        $(".fpzlmc").html(pjxx.fpzlmc);
        $(".hffs").html(pjxx.hffs);
        flag = true;
    }

    if (flag == false) {
        return;
    }
    var ddFlag = true;

    //初始化订单信息
    $.ajax({
        url: "/dzgzpt-wsys/api/wtgl/yj/queryYjDdxxBySqxh",
        contentType: 'application/json;charset=utf-8',
        type: "post",
        async: false,
        data: mini.encode({"sqxh": sqxh}),
        success: function (data) {
            var json = mini.decode(data);
            if (json.success) {
                var yjDdXxVo = json.value;
                if (yjDdXxVo != null) {
                    //查询寄件方地址
                    $.ajax({
                        url: "/dzgzpt-wsys/api/wtgl/yj/queryJjrdz",
                        contentType: 'application/json;charset=utf-8',
                        type: "post",
                        async: false,
                        data: mini.encode({"swjgDm": yjDdXxVo.swjgDm}),
                        success: function (data) {
                            var json = mini.decode(data);
                            if (json.success) {
                                var addressVo = json.value;
                                $('#jjrname').html(addressVo.name);
                                $('#jjrdh').html(addressVo.phone);
                                $('#jjrdz').html(addressVo.address);
                                $('#jjrname2').html(addressVo.name);
                                $('#jjrdh2').html(addressVo.phone);
                                $('#jjrdz2').html(addressVo.address);
                            } else {
                                ddFlag = false;
                                mini.alert("匹配寄件方地址时失败，请稍后再试。。。。。");
                                return;
                            }
                        },
                        error: function (data) {
                            ddFlag = false;
                            mini.alert("匹配寄件方地址时发生错误，请稍后再试。。。。。", "提示信息", function () {
                                return;
                            });
                        }
                    });
                    //查询地址失败
                    if (!ddFlag) {
                        return;
                    }
                    ddh = yjDdXxVo.ddh;
                    yjhm = yjDdXxVo.yjhm;
                    dysjrlxdh = yjDdXxVo.dysjrlxdh;
                    var barCodeUrl = "/dzgzpt-wsys/api/wtgl/barcode/getBarCode?msg=" + yjhm + "&height=8mm&hrsize=3pt&mw=0.15mm&wf=0.5&qz=1mm";
                    $('#ydbarcode1').attr("src", barCodeUrl);
                    $('#ydbarcode2').attr("src", barCodeUrl);
                    var _sjcsqh = yjDdXxVo.sjcsqh;
                    if (!_sjcsqh) {
                        _sjcsqh = "";
                    }
                    var sjrdz = yjDdXxVo.sjcs + _sjcsqh + yjDdXxVo.sjrdz;
                    $('#sjrname').html(yjDdXxVo.dysjrxm);
                    $('#sjrdh').html(yjDdXxVo.dysjrlxdh);
                    $("#sjrdz").html(sjrdz);

                    var ddhBarCodeUrl = "/dzgzpt-wsys/api/wtgl/barcode/getBarCode?msg=" + ddh + "&height=6mm&hrsize=3pt&mw=0.1mm&wf=0.5&qz=1mm";
                    $('#ddhbarcode').attr("src", ddhBarCodeUrl);

                    $('#sjrname2').html(yjDdXxVo.dysjrxm);
                    $('#sjrdh2').html(yjDdXxVo.dysjrlxdh);
                    $("#sjrdz2").html(sjrdz);
                    $("#bz").html(yjDdXxVo.bz);
                    var msg = "sq|" + sqxh
                    var qrCodeUrl = "/dzgzpt-wsys/api/wtgl/barcode/getBarCode?type=QR&msg=" + msg;
                    $('#qrcode').attr("src", qrCodeUrl);
                    var _jfzl = Math.ceil(yjDdXxVo.yjzl / 1000);
                    $('#jfzl').html(_jfzl);
                    $('#ysyf').html(yjDdXxVo.yjzf);
                    $('#ysyfdx').html(numberTransformUppercase(yjDdXxVo.yjzf));
                }
            } else {
                ddFlag = false;
                mini.alert("查询邮寄地址失败");
            }
        },
        error: function (data) {
            ddFlag = false;
            mini.alert("出现系统错误，请稍后再试。。。。。", "提示信息", function () {
            });
        }
    });
    if (ddFlag) {
        mini.get("sqxh").setValue(sqxh);
        mini.get("editWindow").show();
    }
}

//打印配置
var printConfig = {
    direct: 2,           // 打印方向： 1 正向 2 横向，默认 1
    display: 1,         // 显示方向：1 正向显示，0 横向显示
    view: 2,            // 预览方式：0 适高，1 正常，2 适
    zoom: 'Auto-Width',
    css: '',             // 额外的css样式 config.css='table tr td{padding:0}'
    cssLink: 'http://' + location.host + '/dzgzpt-wsys/apps-gs/views/yj/yj.css',      // 通过link引入的css样式文件
    style: true      // 是否引入页面的 <style></style> 标签
};

/**
 * 打印面单
 */
function printYjmd() {
    var sqxh = mini.get("sqxh").getValue();
    $.ajax({
        url: "/dzgzpt-wsys/api/wtgl/yj/updateState",
        contentType: 'application/json;charset=utf-8',
        type: "post",
        async: false,
        data: mini.encode({
            "ddh": ddh,
            "sqxh": sqxh,
            "yjhm": yjhm,
            "dysjrlxdh": dysjrlxdh,
            "clzt": "6" //打印面单默认已邮寄
        }),
        success: function (data) {
            var json = mini.decode(data);
            if (!json.success) {
                mini.alert("更新邮寄订单状态失败");
                return;
            }
        },
        error: function (data) {
            mini.alert("出现系统错误，请稍后再试。。。。。", "提示信息", function () {
            });
            return;
        }
    });

    $("#yjmd>table").jqprint({//这里要加入兼容性JS
    	importCSS : true,
    	printContainer : true
    });
}

/**
 * 批量打印发票清单
 */
function printFpqd() {
    var grid = mini.get("yjGrid");
    var grid2 = mini.get("yjqdGrid");
    var rows = grid.getSelecteds();
    var rowCopy = mini.clone(rows);

    if (rows.length <= 0) {
        mini.alert("请勾选要打印的数据行！");
        return false;
    }
    grid2.clearRows();
    grid2.addRows(rowCopy);


    var swjgcombo = mini.get("swjgdm");
    $('#p_swjg').html(swjgcombo.getText());
    var fssj = mini.get("fssj");
    $('#p_fssj').html(fssj.getText());

    $("#yjqd").jqprint({
    	importCSS : true,
    	printContainer : false
    });
}
/**
 * 查询
 */
function search() {
    form.validate();
    if (form.isValid() == false)
        return;
    fromdatas = form.getData(true);
    var param = mini.encode(fromdatas);
    grid.showEmptyText = "true";
    grid.load({
        data: param
    }, function (data) {
        grid.unmask();
    });
}

/**
 * 身份证号模糊
 */
function changeIDcardsNum(IDcardsNum) {
    var str1 = IDcardsNum.substr(0, 8);
    var str2 = IDcardsNum.substr(14, 4);
    var NewIDcardsNum = str1 + "******" + str2;
    return NewIDcardsNum;
}

function reset() {
    var yffpsh = mini.get("yffpsh");
    yffpsh.setValue("");
    var clzt = mini.get("clzt");
    clzt.setValue("");

    var jjrq = mini.get("fssj");
    jjrq.setValue(new Date());
    //税务机关下拉
    var $swjgdm = mini.get("swjgdm");
    $.ajax({
        url: "/dzgzpt-wsys/api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
        data: "",
        type: "post",
        async: false,
        success: function (obj) {
            var datas = mini.decode(obj);
            $swjgdm.loadList(datas, "jgDm", "PID");
            $swjgdm.setValue(datas[0].jgDm);
        },
        error: function () {
        }
    });
}

/**
 * 清空免单，每次打开免单重新加载数据
 */
function resetMd() {
    $("#fphmWrap").html("");
    $('#jjrname').html("");
    $('#jjrdh').html("");
    $('#jjrdz').html("");
    $('#jjrname2').html("");
    $('#jjrdh2').html("");
    $('#jjrdz2').html("");
    $('#ydbarcode1').attr("src", "");
    $('#ydbarcode2').attr("src", "");
    $('#sjrname').html("");
    $('#sjrdh').html("");
    $("#sjrdz").html("");
    $('#ddhbarcode').attr("src", "");
    $('#sjrname2').html("");
    $('#sjrdh2').html("");
    $("#sjrdz2").html("");
    $("#bz").html("");
    $('#qrcode').attr("src", "");
}