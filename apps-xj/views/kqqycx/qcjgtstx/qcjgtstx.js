var qcjgtstx = {
    initPage: function () {
        qcjgtstx.queryGrid();
    },
    queryGrid: function () {
        var sqxh = getQueryString('sqxh');
        // var sqxh = '9b268ebb43214d1081b70b5681d83737'
        if(sqxh){
            $.ajax({
                url: '/hgzx-gld/api/hgzx/kqqyqy/sqxx/' + sqxh + '/get',
                type: 'GET',
                success: function (data, textStatus, request) {
                    if (!!data.success && data.value) {
                        data.value = JSON.parse(data.value.data);
                        $('#nsrsbh').html(data.value.nsrsbh);
                        $('#nsrmc').html(data.value.nsrmc);
                        $('#qcdzcdzxzqhszDm').html(data.value.qcdzcdzxzqhszmc);
                        $('#qrdzcdzxzqhszDm').html(data.value.qrdzcdzxzqhszmc);
                        $('#qcdzcdz').html(data.value.qcdzcdz);
                        $('#qrdzcdz').html(data.value.qrdzcdz);
                        $('#jbrmc').html(data.value.jbrmc);
                        $('#sjhm').html(data.value.sjhm);
                        $('#zjhm').html(data.value.zjhm);
                        $('#cktslx').html(data.value.cktslx == 'N'?'否':'是');
                    } else{
                        mini.alert(data.message || '接口异常，请稍后重试');
                    }
                },
                error:function(error){
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });
        }
    }
};
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

function closeWin() {
    if (window.history.go(-1)) {
        return;
    }
    //tstxgl调用兼容处理
    if (window.CloseOwnerWindow) {
        return window.CloseOwnerWindow();
    } else {
        Owner.closeWin();
    }
}

$(function () {
    qcjgtstx.initPage()
});
