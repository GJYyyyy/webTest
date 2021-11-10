var data, shnr = "", tznr = "";
var xzcs = [];
var xzcsMap = {};
var query = gldUtil.getParamFromUrl() || {};
var gldData=$.get('/swmh/pages/index/user_info_get.json?logic-name=swmh_deskapp_query&type=user', "").responseJSON;
var TZNR = {
    tzyy: '',
    tzhrq1: '',
    tzhrq2: '',
    jc1: false,
    jc2: true
}
$(function () {
    $.get("/sxsq-wsys/api/fxhc/xzcs/taskXzcsList/" + query.taskid, "",
        function (res) {
            if (res.success && res.value) {
                xzcs = res.value;
                $.each(xzcs, function (i, v) {
                    xzcsMap[v.fxhcxzcsDm] = v;
                })
            }else{
                mini.alert(res.message)
            }
        });

    bindEvent();

    init();
});
function bindEvent(){
    $("input[name=jc]").change(function(e){
        if(e.target.checked){
            if(data.shzt !== '00'){
                mini.get("f_xy1_"+$(e.target).attr('id').split("_")[2]+"_tzh").setValue(new Date().format('yyyy-MM-dd'));
            }
            mini.get("f_xy1_"+$(e.target).attr('id').split("_")[2]+"_tzh").disable();
        }else{
            mini.get("f_xy1_"+$(e.target).attr('id').split("_")[2]+"_tzh").enable();
        }
    })
}
function doBack() {
    window.history.go(-1);
}

function save() {
    var flag = true;
    $.each(xzcs, function (i, v) {
        if (v.fxhcxzcsDm === '01') {
            if (!mini.get('f_xy1_1_tzh').getValue() && !$("#f_xzcs_1_jc").prop("checked")) {
                mini.alert('请输入调整后的限制期限止！');
                flag = false;
                return false;
            }

        } else if (v.fxhcxzcsDm === '02') {
            if (!mini.get('f_xy1_2_tzh').getValue() && !$("#f_xzcs_2_jc").prop("checked")) {
                mini.alert('请输入调整后的限制期限止！');
                flag = false;
                return false;
            }
        }
    });


    if (!flag) {
        return false;
    }

    if(!$("#tzyy").val()){
        mini.alert("请输入调整原因！");
        return false;
    }


    if (data.shzt === '00') {//审批
        ajax.post("/sxsq-wsys/api/fxhc/xzcs/approve", mini.encode({
            shzt: $("#shjg_Y").prop("checked") ? '01' : '02',
            shbz: $("#shbz").val()+'  【审核人】:'+gldData.userName,
            taskid: query.taskid
        }),
            function (res) {
                if (res.success) {
                    mini.alert('审核完成', "提示", function () {
                        doBack();
                    })
                } else {
                    mini.alert(res.message || '提交失败！');
                }
            });
        return;
    }


    var req = {
        taskid: query.taskid,
        tznr: "",
        tzyy: $("#tzyy").val(),
        fxhcxzcsTzmxList: []
    }

    if (xzcsMap['01']) {
        req.fxhcxzcsTzmxList.push({
            fxhcxzcsDm: '01',
            xzqq: xzcsMap['01'].xzqq,
            xzqz: mini.get('f_xy1_1_tzh').text
        })
    }


    if (xzcsMap['02']) {
        req.fxhcxzcsTzmxList.push({
            fxhcxzcsDm: '02',
            xzqq: xzcsMap['02'].xzqq,
            xzqz: mini.get('f_xy1_2_tzh').text
        })
    }


    
    TZNR.tzyy = $("#tzyy").val();
    TZNR.tzhrq1 = mini.get('f_xy1_1_tzh').text;
    TZNR.tzhrq2 = mini.get('f_xy1_2_tzh').text;
    TZNR.jc1 = $("#f_xzcs_1_jc").prop("checked");
    TZNR.jc2 = $("#f_xzcs_2_jc").prop("checked");
    TZNR.tzrMc=gldData.userName||'';
    TZNR.fxhcxzcsTzmxList=req.fxhcxzcsTzmxList;
    req.tznr=mini.encode(TZNR);



    ajax.post("/sxsq-wsys/api/fxhc/xzcs/update", mini.encode(req),
        function (res) {
            if (res.success) {
                mini.alert('提交成功', "提示", function () {
                    doBack();
                })
            } else {
                mini.alert(res.message || '提交失败！');
            }
        });
}

function init() {
    var miniData=new Date().format('yyyy-MM-dd');
    data = mini.decode(store.getSession('tzData'));
    shnr = mini.decode(data.shnr);
    tznr = mini.decode(data.tznr);

    $(".tzrmc").text(gldData.userName);
    $(".tzsj").text(new Date().format('yyyy-MM-dd'));
    if(tznr&&data.shzt === '00'){
        $(".tzrmc").text(tznr.tzrMc);
        $(".tzsj").text(new Date(data.tzsj).format('yyyy-MM-dd')); 
    }

    if (data.shzt === '00') {//审批
        $("#tzyy").attr("disabled", "disabled").val(mini.decode(data.tznr).tzyy);
    } else {
        $(".fxhcsh_bz,.fxhcsh_jg").hide();
        mini.get('f_xy1_1_tzh').setMinDate(miniData);
        mini.get('f_xy1_2_tzh').setMinDate(miniData);
    }

    $(".box4").find("textarea").val(shnr.fhyj.fhyj);
    $.each(xzcs, function (i, v) {
        if (v.fxhcxzcsDm === '01') {
            $("#f_xzcs_1").prop("checked", true);
            mini.get('f_xy1_1').setValue(v.xzqz);
            if (data.shzt !== '00') {
                mini.get('f_xy1_1_tzh').enable();
                $("#f_xzcs_1_jc").removeAttr("disabled");
            }
        } else {
            $("#f_xzcs_2").prop("checked", true);
            mini.get('f_xy1_2').setValue(v.xzqz);
            if (data.shzt !== '00') {
                mini.get('f_xy1_2_tzh').enable();
                $("#f_xzcs_2_jc").removeAttr("disabled");
            }
        }
    });

    if (data.shzt === '00') {
        mini.get('f_xy1_1_tzh').setValue(tznr.tzhrq1);
        mini.get('f_xy1_2_tzh').setValue(tznr.tzhrq2);
        if (tznr.jc1) {
            $("#f_xzcs_1_jc").prop("checked", true)
        }
        if (tznr.jc2) {
            $("#f_xzcs_2_jc").prop("checked", true)
        }
    }
};




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