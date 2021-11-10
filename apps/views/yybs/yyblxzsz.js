/**
 * Created by yanghui on 2017/5/12.
 */

var yysxDm = "";
var zj = false;

$(function () {
    var params = {
            "needZj": "true"
    };
    yybsService.queryBsdt(mini.encode(params), function (res) {
        var result = mini.decode(res.value);
        if (res.success) {
            mini.get("#xzBsdt").setData(result);
        }
    }, function (res) {
        alert("获取大厅数据失败！")
    });

});

function chooseBsdt() {
    /*重置*/
    $("#sxMc").html("");
    $(".nicEdit-main").html("");

    var params = {
        "bsdtdm": mini.get("#xzBsdt").getValue()
    };
    yybsService.queryCkTree(mini.encode(params), function (res) {
        var result = mini.decode(res.value);
        if (res.success) {
            if (params.bsdtdm == "16500000000") {
                zj = true;
                mini.get("#tree1").hide();
                mini.get("#listbox1").setData(result);
                mini.get("#listbox1").show();
            } else {
                mini.get("#tree1").show();
                mini.get("#listbox1").hide();
                mini.get("#tree1").setData(result);
            }
        }
    }, function (res) {
        alert("获取窗口数据失败！")
    });
}

function onSelectNode(e) {
    $("#sxMc").html("");
    $(".nicEdit-main").html("");
    var tree = e.sender;
    var node = e.node;
    if (tree.hasChildren(node)) {
        $("#sxMc").html("");
        return false;
        // e.cancel = true;
    }
    yysxDm = tree.getSelectedNode().id;
    $("#sxMc").html(tree.getSelectedNode().text);
    queryXz(yysxDm);
}

function chooseListIterm(e) {
    $("#sxMc").html("");
    $(".nicEdit-main").html("");
    var tree = e.sender;
    yysxDm = tree.getSelected().id;
    $("#sxMc").html(tree.getSelected().text);
    queryXz(yysxDm);
}

function queryXz(str) {
    var params = {
        "bsdtdm": mini.get("#xzBsdt").getValue(),
        "yysxdm": str
    };
    yybsService.queryyyYwxzcx(mini.encode(params), function (res) {
        var result = mini.decode(res.value);
        if (res.success) {
            $(".nicEdit-main").html(result.xznr);
        }
    }, function (res) {
        alert(res.message)
    });
}


function saveYyxz() {
    var params = {
        "bsdtdm": mini.get("#xzBsdt").getValue(),
        "yysxdm": yysxDm,
        "xznr": $(".nicEdit-main").html()
    };
    if(params.bsdtdm == ""||params.bsdtdm == undefined){
        alert("请选择办税大厅！");
        return false;
    }
    if(params.yysxdm == ""||params.yysxdm == undefined){
        alert("请选择办税事项！");
        return false;
    }

    yybsService.yyYwxzsz(mini.encode(params), function (res) {
        var result = res.value;
        if (res.success) {
            $(".nicEdit-main").html(result.xznr);
            alert("设置办理须知内容成功！",function () {
                location.reload();
            });
        } else {
            alert("设置办理须知内容失败！",function () {
                location.reload();
            });
        }
    }, function (res) {
        alert("设置办理须知内容失败！",function () {
            location.reload();
        });
    });
}
