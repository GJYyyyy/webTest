var selectTsgw = {
    gwxxList: [],
    lcslId: '',
    blztDm: '',
    rwztDm: '',
    data: {}
};

var selectedGwinfo;
selectTsgw.setData = function(gwxxList){
    mini.get('tsgw_grid').setData(gwxxList);
};

selectTsgw.checkSelectGw = function () {
    var selectRow = mini.get('tsgw_grid').getSelecteds();
    if(selectRow.length === 0){
        mini.alert('请先选择推送岗位');
        return;
    }
    selectedGwinfo = mini.encode(selectRow[0]);
    selectTsgw.onCancel('ok');
};

selectTsgw.getData = function(){
    return selectedGwinfo;
}

selectTsgw.onCancel = function (action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}