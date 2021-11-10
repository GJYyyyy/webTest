var tabsName="";
var lqfsDm = '';
var lgfsText = '';
var yjDdxx;
var FpzlArray;
var sqxh;
var djxh;
var sqData;
var kqqyObj = {};
$(function () {
    setTimeout(function () {
        initData();
    },10)
});
function initData(){
    sxsl_store.kqqyBlxxData = {};
    tabsName="tabs1";
    console.log(sxsl_store);
    sqData=JSON.parse(sxsl_store.sqsxData.data);
    mini.get('nsrsbh').setValue(sqData.nsrsbh);
    mini.get('nsrmc').setValue(sqData.nsrmc);
    mini.get('qcddz').setValue(sqData.bgqscjydz);
    mini.get('qrddz').setValue(sqData.bghscjydz);
    mini.get('bsry').setValue(sqData.jbrData.jbr);
    mini.get('zjhm').setValue(sqData.jbrData.zjhm);
    mini.get('lxrdh').setValue(sqData.jbrData.lxdh);
    mini.get('bgqXzqh').setValue(sqData.scjydzxzqhszDmText);
    mini.get('bghXzqh').setValue(sqData.bghscjydzxzqhszDmText);
    $('.qcddz').attr('title',sqData.bgqscjydz);
    $('.qrddz').attr('title',sqData.bghscjydz);
    $('#bzzlBtn').remove();
    $.ajax({
        url: "/dzgzpt-wsys/api/sh/zhxxbg/get/sfcktsqy?djxh=" + sxsl_store.djxh,
        type: 'GET',
        success: function (data, textStatus, request) {
            if (!!data.success && data.value) {
                var dataValue = data.value;
                if(dataValue == 'Y'){
                    mini.get('cktslx').setValue('是');
                } else{
                    mini.get('cktslx').setValue('否');
                }
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
    $.ajax({
        url: "/dzgzpt-wsys/api/sh/wtgl/dbsx/workflow/step?rwbh="+sxsl_store.rwbh,
        type: 'GET',
        async:false,
        success: function (data, textStatus, request) {
            if (!!data.success && data.value) {
                var getSession = data.value;
                if(getSession == 1){
                    $('#jkjgTable').hide();
                } else {
                    $('#jkjgTable').show();
                    $.ajax({
                        url: "/dzgzpt-wsys/api/sh/zhxxbg/get/baseCode/swjgByXzqh/" + sqData.bghscjydzxzqhszDm,
                        type: 'GET',
                        success: function (data, textStatus, request) {
                            if (data) {
                                mini.get("zgswjgDm").setData(data);
                                mini.get("zgswjgDm").setValue(data[0].ID);
                            }
                        },
                        error:function(error){
                            mini.alert(error.message || '接口异常，请稍后重试');
                        }
                    });
                    $.ajax({
                        url: "/dzgzpt-wsys/api/sh/zhxxbg/qyqkjy?sqxh=" + sxsl_store.sqxh,
                        type: 'GET',
                        success: function (data, textStatus, request) {
                            if (!!data.success && data.value.length) {
                                var jkjgArr = data.value;
                                var yzPass = true;
                                var yzPasss = 0;
                                for(var x=0;x<jkjgArr.length;x++){
                                    if(jkjgArr[x].jkjg != '1'){
                                        $($('.description')[yzPasss]).html((yzPasss+1) + '.' + jkjgArr[x].description);
                                        $($('.jkjg')[yzPasss]).html('不通过');
                                        $($('.description')[yzPasss]).addClass('colorRed');
                                        $($('.jkjg')[yzPasss]).addClass('colorRed');
                                        $($('.tips')[yzPasss]).addClass('colorRed');
                                        $($('.tips')[yzPasss]).html("系统提示：" + jkjgArr[x].tips);
                                        yzPasss++;
                                    }
                                    if(jkjgArr[x].degree == '1' && jkjgArr[x].jkjg != '1'){
                                        yzPass = false;
                                    }
                                    if(!yzPass){
                                        mini.get('shbjBtn').setEnabled(false);
                                    }
                                }
                                for(var x=0;x<jkjgArr.length;x++){
                                    if(jkjgArr[x].jkjg == '1'){
                                        $($('.description')[yzPasss]).html((yzPasss+1) + '.' + jkjgArr[x].description);
                                        $($('.jkjg')[yzPasss]).html('通过');
                                        yzPasss++;
                                    }
                                }
                            }
                        },
                        error:function(error){
                            mini.alert(error.message || '接口异常，请稍后重试');
                        }
                    });
                }
                if(getSession == 2){
                    sxsl_store.kqqyBlxxData = {
                        zgswjgDm:'',
                        zgswjgDmText:''
                    }
                } else if(getSession == 3){
                    mini.get("zgswjgDm").setValue(JSON.parse(sqData.blxx).zgswjgDm);
                    mini.get("zgswjgDm").setEnabled(false);
                }
            } else{
                mini.alert('接口异常，请稍后重试');
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
}
kqqyObj.zgswjgDmChanged = function(e) {
    var value = e.value;
    if(!value){
        mini.get("zgswjgDm").setValue('');
        sxsl_store.kqqyBlxxData = {
            qrswjgDm:'',
            zgswjgDm:'',
            zgswjgDmText:''
        };
    } else{
        mini.get("zgswjgDm").setValue(value);
        sxsl_store.kqqyBlxxData = {
            qrswjgDm:value,
            zgswjgDm:value,
            zgswjgDmText:mini.get("zgswjgDm").getText()
        };
    }
};