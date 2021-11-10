$(function() {
    init();
});

var SWSX_STORE={
    blxxData:"",
    rwbh:"",
    swsxdm:'',
    rwztdm:'',
    sqxh:"",
    blztdm:""
}


function init() {
    mini.parse();
}

/**
 * 查询税务事项通知书信息
 *
 * @param lcslId
 *            流程实例ID
 * @param blztDm
 *            办理状态代码
 *            ll补录信息
 */
/**
 * 查询税务事项通知书
 * @param lcslId 流程实例ID
 * @param rwbh 任务编号
 * @param blztDm 任务状态代码
 * @param swsxDm 税务事项代码
 * @param blxxData 补录信息
 */
function querySwsxtzsxx(sqxh, rwbh,blztFlag,swsxDm,blxxData,otherData,rwztDm,blztDm) {
    var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
    SWSX_STORE.blxxData = blxxData;
    SWSX_STORE.rwbh = rwbh;
    SWSX_STORE.swsxdm = swsxDm;
    SWSX_STORE.rwztdm = rwztDm;
    SWSX_STORE.blztdm = blztFlag;
    var blztDm=blztFlag;
    SWSX_STORE.sqxh = sqxh;
    var params = {
        sqxh : sqxh,
        blztDm : blztFlag
    };
    $.ajax({
        url : "../../../../api/xjYjbs/getSwsxtzsxx",
		data : mini.encode(params),
        contentType:"application/json",
        success : function(data) {
            var resultData = mini.decode(data);
            var result = mini.decode(resultData);
            if (!result.success) {
                mini.alert(result.message, '提示信息');
                return;
            }
            $("#title_swjgMc").text(result.value.swjgmc);
            $("#foot_swjgMc").text(result.value.swjgmc);
            $("#content_jg").text(result.value.jg);
            $("#content_zg").text(result.value.zg);
            $("#content_nsrmc").text(result.value.nsrmc);
            $("#content_nsrsbh").text(result.value.nsrsbh);
            $("#content_swsxMc").text(result.value.swsxmc);
            $("#content_swsxMc2").text(result.value.swsxmc);
            $("#content_sqrq").text(mini.formatDate(mini.parseDate(result.value.sqrq),"yyyy年MM月dd日"));
            $("#content_bjrq").text(mini.formatDate(mini.parseDate(result.value.bjrq),"yyyy年MM月dd日"));
            $("#content_flyj").html(result.value.flyj);

            mini.get("flyj").setValue(result.value.flyj);
            mini.get("sqxh").setValue(result.value.sqxh);
            mini.get("swjgDm").setValue(result.value.swjgdm);
            mini.get("jg").setValue(result.value.jg);
            mini.get("zg").setValue(result.value.zg);
            // mini.get("lcslId").setValue();


            //备注栏预先填写
            var tzsnr = "";
            //外出经营证明开具
            if("110801" == swsxDm && WSYS_BLZT_DM.BLZT_SLTG == blztDm){
                if (!!mini.decode(blxxData).zgswjDm){
                    tzsnr = "您的外出经营证明开具事项已审核办结，请查看待办事项，若未生成报验登记待办事项，请前往外出地大厅继续办理报验登记。";
                }else{
                    tzsnr = "您的外出经营证明开具事项已审核办结！";
                }
            }
            if("110804" == swsxDm && WSYS_BLZT_DM.BLZT_SLTG == blztDm){
                if (!!mini.decode(blxxData).zgswjDm){
                    tzsnr = "您的跨区域涉税事项报告事项已审核办结，请查看已办事项，若未生成报验登记已办事项，请前往外出地大厅继续办理报验登记。";
                }else{
                    tzsnr = "您的跨区域涉税事项报告事项已审核办结！";
                }
            }
            //票种核定
            if(("110207" === swsxDm || "200006" === swsxDm || "200007" === swsxDm) && WSYS_BLZT_DM.BLZT_DSP == blztDm){
                //票面金额不超过十万
                tzsnr="您的票种核定申请已受理，请携带税控设备前往主管税务机关办理发行业务。";
            }
            var form = new mini.Form("#swsxtzsForm");
            form.setData(mini.decode(result.value));
            mini.get("swsxtzsNr").setValue(tzsnr);
            mini.get("blztDm").setValue(blztDm);

            // 不予受理
            if (WSYS_BLZT_DM.BLZT_SLBTG == blztDm) {
                mini.get("swsxtzsNr").setRequired(true) ;
                $("#content_blzt").text("不予受理");
                $("#content_blzt_sm").text("不予受理原因：");
                mini.get('swsxtzsNr').requiredErrorText = '不予受理原因不能为空';
            }

            //补正资料
            if(WSYS_BLZT_DM.BLZT_BZZL==blztDm){
                mini.get("swsxtzsNr").setRequired(true) ;
                $("#content_blzt").text("补正资料");
                $("#content_blzt_sm").text("需要重新上传的资料列表如下：");
                mini.get('swsxtzsNr').requiredErrorText = '需要重新上传的资料列表不能为空';
            }

            //受理审核办结
            if(WSYS_BLZT_DM.BLZT_SLTG==blztDm){
                $("#content_blzt").text("审核通过");
                $("#content_blzt_sm").text("相关说明如下：");
                mini.get('swsxtzsNr').requiredErrorText = '相关说明如下不能为空';
            }

            // 待审批
            if (WSYS_BLZT_DM.BLZT_DSP == blztDm) {
                $("#content_blzt").text("受理通过，待审批");
                $("#content_blzt_sm").text("相关说明如下：");
                mini.get('swsxtzsNr').requiredErrorText = '相关说明如下不能为空';
            }

            mini.hideMessageBox(messageid);
        },
        error : function() {
            mini.hideMessageBox(messageid);
            mini.alert("查询税务事项通知书信息失败。", '提示信息');
        }
    });
}

function saveSwsxBj() {
    var form = new mini.Form("#swsxtzsForm");
    form.validate();
    var isValid = form.isValid();
    if(!isValid){
        return;
    }
    if(SWSX_STORE.swsxdm == '110207' || SWSX_STORE.swsxdm == '110208'){
        if(!!store.getSession('pzhdBlxxData')){
            SWSX_STORE.blxxData = mini.encode(store.getSession('pzhdBlxxData'));
        }

    }
    var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
    var submitData = mini.encode(form.getData(true));
    setTimeout(function () {//提交文书加遮罩
    	$.ajax({
            url : "../../../../api/xjYjbs/wtgl/dbsx/saveSwsxBl",
            type : "post",
            data : {
                data : submitData,
                blztDm : SWSX_STORE.blztdm,
                rwztDm : "01",
                sqxh : SWSX_STORE.sqxh,
                blxxData:SWSX_STORE.blxxData
            },
            success : function(data) {
                mini.hideMessageBox(messageid);
                var resultData = mini.decode(data);
                if(resultData.success){
                    if(WSYS_BLZT_DM.BLZT_DSP==mini.get("blztDm").getValue()){
                        var gwMc = resultData.resultMap.gwMc;
                        var jgMc = resultData.resultMap.jgMc;
                        mini.alert("受理成功！<br>下一环节的办理信息：<br>办理机关：【"+jgMc+"】<br>办理岗位：【"+gwMc+"】", '提示信息', function() {
                            onCancel('ok');
                        });
                    }else{
                        mini.alert("受理成功！", '提示信息', function() {
                            onCancel('ok');
                        });
                    }
                }else{
                    mini.alert(resultData.message, '提示信息', function() {});
                }
            }
        });
    },500);

}
function onCancel(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}
