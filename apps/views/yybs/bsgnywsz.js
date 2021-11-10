/**
 * Created by yanghui on 2017/5/12.
 */
var Yyflag = false;
var yszCKsxData;
var bsdtdmStr = "";
var qybzflag = "";
var tdtxxs = new Array();
$(function () {
    mini.parse();
    /*
     * 加载办税大厅数据
     * */
    yybsService.queryBsdt(mini.encode({}), function (res) {
        var result = mini.decode(res.value);
        if (res.success && result != null) {
        	tdtxxs = result;
            mini.get("#xzBsdt").setData(result);
        }

    }, function (res) {
        alert("请求大厅数据错误！");
    });
});
function clearData(bsdtdm, ckdm) {
    if (bsdtdm == "") {
        mini.get("#xzBsck").setData();//清空窗口
        var listbox1 = mini.get("#listbox1");
        var items1 = listbox1.getData();
        if (items1.length != 0) {
            listbox1.removeItems(items1);//情况第二个框
        }
        listbox1.removeItems(items1);//清空第一个框
        var listbox2 = mini.get("#listbox2");
        var items2 = listbox2.getData();
        if (items2.length != 0) {
            listbox2.removeItems(items2);//情况第二个框
        }
        mini.get("#rbl").setValue();
        mini.get("#datagridTime").setData([]);//清空表格数据
    }
    if (ckdm == "") {
        var listbox1 = mini.get("#listbox1");
        var items1 = listbox1.getData();
        if (items1.length != 0) {
            listbox1.removeItems(items1);
        }
        //清空第一个框
        var listbox2 = mini.get("#listbox2");
        var items2 = listbox2.getData();
        if (items2.length != 0) {
            listbox2.removeItems(items2);//情况第二个框
        }
        mini.get("#rbl").setValue();
        mini.get("#datagridTime").setData([]);//清空表格数据
    }

}

/*
 * 选择大厅代码
 * */

function bsdtChange() {
    bsdtdmStr = mini.get("#xzBsdt").getValue();
    clearData("");
    mini.get("#xzBsck").setValue("");
    if(bsdtdmStr!=""){
    	 var params = mini.encode({bsdtdm: bsdtdmStr});
    	    yybsService.queryAllCK(params, function (res) {
    	        var result = mini.decode(res.value);
    	        if (res.success && result != null) {
    	            mini.get("#xzBsck").setData(result.cks);
    	        }

    	    }, function (res) {
    	        alert("请求窗口数据错误！");
    	    });
    }
    if (bsdtdmStr != "" && mini.get("#xzBsck").getValue() == "") {
        clearData(bsdtdmStr, mini.get("#xzBsck").getValue());
    }
   
}

/*
 * 添加预约事项
 * */

function yyAdd() {
    var items = mini.get("listbox1").getSelecteds();
    if (items.length == 0) {
        alert("请选择业务");
        return false;
    }
    mini.get("listbox1").removeItems(items);
    mini.get("listbox2").addItems(items);
}
function yyAddAll() {
    var items = mini.get("listbox1").getData();
    mini.get("listbox1").removeItems(items);
    mini.get("listbox2").addItems(items);
}

function yyremove() {
    var items = mini.get("listbox2").getSelecteds();
    if (items.length == 0) {
        alert("请选择业务");
        return false;
    }
    mini.get("listbox2").removeItems(items);
    mini.get("listbox1").addItems(items);
}
function yyremoveAll() {
    var items = mini.get("listbox2").getData();
    mini.get("listbox2").removeItems(items);
    mini.get("listbox1").addItems(items);
}

function yyaddRow() {
    var newRow = {name: "New Row"};
    mini.get("#datagridTime").addRow(newRow, 0);
    mini.get("#datagridTime").beginEditCell(newRow, "LoginName");
}
function yyremoveRow() {
    var grid = mini.get("#datagridTime");
    var len = grid.getData().length;
    var row = grid.getSelecteds();
    var rows = grid.getSelecteds().length;
    if (rows == 0) {
        alert("请先选择要删除的数据！");
        return false;
    }
    if (len == rows) {
        alert("不能全部删除所有的时间设置！");
        return false;
    }
    mini.confirm("您确定要删除本记录吗？", "提示信息", function (action) {
        if (action == "ok") {
            grid.removeRows(row, true);
        }
    });
}


function valiTime(e) {
    var date = e.value;
    var fordate = date.format("yyyy-M-d hh:mm");
    var parrt = fordate.split(" ")[1];
    if (!(/:[3|0]0$/g.test(parrt))) {
        alert("时间只能设置为整点或者半点数");
        e.setIsValid(false);
        return false;
    }
    // e.setValue(parrt.split(":")[0]+":00");

}


function chooseCk() {
    var yszCKsxData = new Array();
    var params = mini.encode({bsdtdm: bsdtdmStr});
    yybsService.queryhasSetsx(params, function (res) {
        var result = mini.decode(res.value);
        if (res.success && result != null) {
            yszCKsxData = result.yyszxxs;
        }

    }, function (res) {
    });
    yybsService.queryAllYysx("{}", function (res) {
        var result = mini.decode(res.value);
        if (res.success && result != null) {
            var filterData = result.yysxs;
            var filterArray = [];
            $.each(filterData, function (i, v) {
                var flag = true;
                $.each(yszCKsxData, function (m, n) {
                    if (v.yysxDm == n.yysxDm) {
                        flag = false;
                    }
                });
                if (flag) {
                    filterArray.push(filterData[i]);
                }
            });
            var listbox1 = mini.get("#listbox1");
            var items1 = listbox1.getData();
            listbox1.removeItems(items1);
            mini.get("#listbox1").addItems(filterArray);
        }

    }, function (res) {

    });

    var ck = mini.get("#xzBsck").getValue();
    var listbox2 = mini.get("#listbox2");
    var items = listbox2.getData();
    listbox2.removeItems(items);
    $.each(yszCKsxData, function (i, v) {
        if (v.yysxCkDm == ck) {
            mini.get("#listbox2").addItem(v);
        }
    });
    //选择大厅代码和窗口代码后需要带出下面的时间段设置信息和人数限制信息
    if (bsdtdmStr == "" || ck == "") {
        //如果没选择网厅和窗口则不去查询
        clearData(bsdtdmStr, ck);
    } else {
        yybsService.querySycksjdXx(mini.encode({
            "bsdtdm": bsdtdmStr,
            "ckdm": ck
        }), function (res) {
            var result = mini.decode(res.value);
            if (res.success && result != null) {
                var radio = result.qybz;
                qybzflag = result.qybz;
                mini.get("#rbl").setValue(radio);
                mini.get("#datagridTime").setData(result.cksxs);
            }

        }, function (res) {

        });
    }
}
function getMid(str) {
    var arr = str.split(":");
    return arr[1];
}
function getFirst(str) {
    var arr = str.split(":");
    return arr[0];
}
function validate() {
    var flag = true;
    var message = "";
    if (qybzflag == "N" && mini.get("#rbl").getValue() == qybzflag) {
        message = "请修改你的启用状态";
        flag = false;
        return {"flag": flag, "message": message};
    }
    if (mini.get("#xzBsdt").getValue() == "") {
        message = "办税大厅不能为空，请选择";
        flag = false;
        return {"flag": flag, "message": message};
    }
    if (mini.get("#xzBsck").getValue() == "") {
        message = "办税办税窗口不能为空，请选择";
        flag = false;
        return {"flag": flag, "message": message};
    }
    var yysxArray = mini.get("#listbox2").getData();
    if (mini.get("#rbl").getValue() == "Y" && yysxArray.length == 0) {
        message = "已选业务不能为空，请选择";
        flag = false;
        return {"flag": flag, "message": message};
    }
    var sjdsPreData = mini.get("#datagridTime").getData();
    $.each(sjdsPreData, function (i, v) {
        if (v.yysjdq == undefined) {
            message = "第" + (i + 1) + "行可选时间段起不能为空，请选择";
            flag = false;
            return {"flag": flag, "message": message};
        }
        if (v.yysjdz == undefined) {
            message = "第" + (i + 1) + "行可选时间段止不能为空，请选择";
            flag = false;
            return {"flag": flag, "message": message};
        }
        if (v.kyyrs == "" || v.kyyrs == undefined) {
            message = "第" + (i + 1) + "行可预约人数不能为空，请选择";
            flag = false;
            return {"flag": flag, "message": message};
        }
        var re = /^[0-9]*[1-9][0-9]*$/;
        if (!re.test(v.kyyrs)) {
            message = "第" + (i + 1) + "行可预约人数必须是正整数";
            flag = false;
            return {"flag": flag, "message": message};
        }
    });
    return {"flag": flag, "message": message};
}
function yyszTj() {
    var validator = validate();
    var sjdsPreData = mini.get("#datagridTime").getData();
    $.each(sjdsPreData, function (i, v) {
        if (v.yysjdq != undefined && v.yysjdz != undefined) {
            if ((getMid(v.yysjdq) == "30" || getMid(v.yysjdq) == "00") && (getMid(v.yysjdz) == "30" || getMid(v.yysjdz) == "00")) {
                sjdsPreData[i].yysjq = getFirst(v.yysjdq) + ":" + getMid(v.yysjdq);
                sjdsPreData[i].yysjz = getFirst(v.yysjdz) + ":" + getMid(v.yysjdz);
                sjdsPreData[i].yyrsxz = sjdsPreData[i].kyyrs;
            } else {
                validator.message = "时间段的起始时间只能是半点或者整点";
                validator.flag = false;
            }
        }

    });
    if (validator.flag) {
        var sjdsStr = mini.encode(sjdsPreData);
        var yysxArray = mini.get("#listbox2").getData();
        var yysxs = new Array();
        if (yysxArray.length > 0) {
            for (var i = 0; i < yysxArray.length; i++) {
                yysxs.push(yysxArray[i].yysxDm);
            }
        }
        var params = {
            "bsdtdm": bsdtdmStr,
            "ckdm": mini.get("#xzBsck").getValue() || "",
            "qybz": mini.get("#rbl").getValue(),
            "sjds": sjdsStr,
            "yysxs": mini.encode(yysxs)
        };
        var paramStr = {"data": mini.encode(params)};
        yybsService.yySetSubmit(mini.encode(paramStr), function (res) {
                var result = mini.decode(res.value);
                if (res.success) {
                    alert("保存成功", function () {
                        mini.get("#xzBsdt").setValue("");
                        mini.get("#xzBsdt").setData(tdtxxs);
                        clearData("");
                    });
                } else {
                    alert("保存失败", function () {
                        mini.get("#xzBsdt").setValue("");
                        mini.get("#xzBsdt").setData(tdtxxs);
                        clearData("");
                    });
                }
            }, function (res) {
                alert("保存失败", function () {
                    mini.get("#xzBsdt").setValue("");
                    mini.get("#xzBsdt").setData(tdtxxs);
                    clearData("");
                });
            });
    } else {
        alert(validator.message);
    }

}

