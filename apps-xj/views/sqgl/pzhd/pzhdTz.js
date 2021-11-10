var pzhd = {};
$(function () {
    pzhd.isHasZgkpxesp();
});
pzhd.isHasZgkpxesp = function(){
    var fpList = mini.decode(sxsl_store.sqsxData.viewData)['yhdpz-grid-now'],
        isZgkpxesq = false;
    $.each(fpList,function(i,value){
        if(value.fpzlDm === '1130' || value.fpzlDm === '1160'){
            isZgkpxesq = true;
        }
    });
    if(isZgkpxesq){
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesq"),{visible: true});
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesqd"),{visible: true});
    }
};