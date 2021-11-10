var xqcx = {
    initPage: function(){
        xqcx.xqGird = mini.get('btgxq-info');
        if (!getQueryString('isBtgjlqc')) search();
    }
};
function setData(value){
    var gridData = mini.decode(value);
    xqcx.xqGird.setData(gridData);
}
function search(){
    $.ajax({
        url: '/hgzx-gld/api/hgzx/kqqyqy/list/qsxx/' + getQueryString('djxh'),
        type: 'GET',
        success: function (data, textStatus, request) {
            if (!!data.success && data.value) {
                xqcx.xqGird.setData(data.value);
            } else{
                mini.alert(data.message || '接口异常，请稍后重试');
            }
        },
        error:function(error){
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
}
function closeWin(){
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1 || isIE11 || isIE10 ||isIE9 ||isIE8 ) {
        top.close();//直接调用JQUERY close方法关闭
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
$("#actions").on('click','#iknowBtn',function(){
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow();
    }
    else {
        closeWin();
    }
});
$(function () {
    xqcx.initPage()
});
