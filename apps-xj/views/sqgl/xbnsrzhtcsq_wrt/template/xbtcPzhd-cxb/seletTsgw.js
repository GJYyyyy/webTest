var selectTsgw = {
    gwxxList: [],
    lcslId: '',
    blztDm: '',
    rwztDm: '',
    data: {}
};
selectTsgw.setData = function(lcslId, rwztDm, data,gwxxList){
    selectTsgw.lcslId = lcslId;
    selectTsgw.rwztDm = rwztDm;
    selectTsgw.data = data;
    selectTsgw.gwxxList = gwxxList;
    mini.get('tsgw_grid').setData(gwxxList);
};

selectTsgw.checkSelectGw = function () {
    var selectRow = mini.get('tsgw_grid').getSelecteds();
    if(selectRow.length === 0){
        mini.alert('请先选择推送岗位');
        return;
    }
    selectTsgw.save(selectRow[0]);
};

selectTsgw.save = function(gwObj){
    gwObj.sfzdsp = true;
    $.ajax({
        url: "/sxsq-wsys/api/wtgl/subTask/sxsl",
        type: 'post',
        data: {
            lcslId: selectTsgw.lcslId,
            blztDm: '03',
            rwztDm: selectTsgw.rwztDm,
            data: selectTsgw.data,
            blxxData: mini.encode(gwObj),
            defpljgpje:""
        },
        success: function (res) {
            res = mini.decode(res);
            if (res.success) {
                var gwMc = res.resultMap.gwMc;
                var jgMc = res.resultMap.jgMc;
                var msg = '受理成功！下一环节的办理信息：办理机关：【' +gwObj.jgMc + '】办理岗位：【' + gwObj.gwMc + '】';
                mini.alert(msg, '提示', function () {
                    selectTsgw.onCancel('ok')
                });
            } else {
                mini.alert(res.message, '提示信息')
            }
        },
        error: function (res) {
            mini.alert(res.message || '系统异常请稍后再试', '提示信息')
        }
    })
};

selectTsgw.onCancel = function (action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}