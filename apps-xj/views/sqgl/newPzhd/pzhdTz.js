var pzhd = {};
$(function () {
    mini.get("bzzlBtn").hide();
    setTimeout(function () {
        pzhd.isHasZgkpxesp();
    },200)

});
pzhd.isHasZgkpxesp = function(){
    var fpList = mini.decode(sxsl_store.sqsxData.viewData)['pzhdhdbxx'],
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