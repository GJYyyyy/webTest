/**
 * Created by yanghui on 2017/5/12.
 */
//根据税务人员的信息获取大厅信息
var dtData = new Array();
$(function () {
    mini.parse();

    $.ajax({
        url: '/dzgzpt-wsys/api/yybs/dtxx',
        type: 'post',
        data:mini.encode({}),
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            var tdata = mini.decode(data.value);
            for (var i = 0; i < tdata.length; i++) {
                var obj = {};
                obj.ID = tdata[i].bsdtDm;
                obj.MC = tdata[i].bsdtMc;
                dtData.push(obj);
            }

        },
        error: function (data) {
            console.log("hh");
        }
    });
    mini.get("#xzBsdt").setData(dtData);
    var mm = [
        {"id": "Y", "text": "启用"},
        {"id": "N", "text": "不启用"}
    ];
    mini.get("#qybz").setData(mm);

});
function onDtdmChange() {
    var bsdtdm = mini.get("#xzBsdt").getValue();
    var qybz = "";
    var qxyysj = "";
    //根据大厅代码获取对应的设置启用信息
    var params = {
        "bsdtdm":bsdtdm
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/yybs/qyszcx',
        type: 'post',
        data: mini.encode(params),
        contentType : "application/json; charset=UTF-8",
        success: function (data) {
            var tdata = mini.decode(data.value);
            qybz = tdata.qybz;
            qxyysj = tdata.qxyysj;
        },
        error: function (data) {
            console.log("hh");
        }
    });
    mini.get("#qybz").setValue(qybz);
    mini.get("#qxyysj").setValue(qxyysj);
}
function saveData() {
    var bsdtdm = mini.get("#xzBsdt").getValue();
    var bsdtmc = mini.get("#xzBsdt").getText();
    if (bsdtdm == "") {
        alert("请选择办税大厅");
        return false;
    }
    var qybz = mini.get("#qybz").getValue();
    if (qybz == "") {
        alert("请选择是否启用预约");
        return false;
    }
    var qxyysj = mini.get("#qxyysj").getValue();
    if (qxyysj == "") {
        alert("请填写可取消预约的时间");
        return false;
    }
    if (qxyysj.length > 2) {
        alert("可取消预约的时间不能超过两位数");
        return false;
    }
    var re = /^[0-9]*[1-9][0-9]*$/;
    if (!re.test(qxyysj)) {
        alert("可取消预约的时间必须是正整数");
        return false;
    }
    //根据大厅代码获取对应的设置启用信息
    var params = {
        "bsdtdm":bsdtdm,
        "qybz":qybz,
        "qxyysj":qxyysj
    };
    $.ajax({
        url: '/dzgzpt-wsys/api/yybs/saveyyqysz',
        type: 'post',
        data: mini.encode(params),
        contentType: "application/json; charset=UTF-8",
        success: function (data) {
            if (data.success == true) {
                alert("大厅【" + bsdtmc + "】启用设置信息保存成功", function () {
                    mini.get("#xzBsdt").setValue("");
                    mini.get("#xzBsdt").setData(dtData);
                    mini.get("#qybz").setValue();
                    mini.get("#qxyysj").setValue();
                });
            }
        },
        error: function (data) {
            alert("大厅【" + bsdtmc + "】启用设置信息保存失败", '提示信息', function () {
                mini.get("#xzBsdt").setValue("");
                mini.get("#xzBsdt").setData(dtData);
                mini.get("#qybz").setValue();
                mini.get("#qxyysj").setValue();
            });
        }
    });
    mini.get("#qybz").setValue(qybz);
    mini.get("#qxyysj").setValue(qxyysj);
}


