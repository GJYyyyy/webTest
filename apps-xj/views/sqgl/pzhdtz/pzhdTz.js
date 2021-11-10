var pzhd = {};
$(function () {
    //todo 票种核定调整是否有补正资料，先当作有
    mini.get("bzzlBtn").show();

    //不存在不可调整的票种核定信息时隐藏
    var viewObj = JSON.parse(sxsl_store.sqsxData.viewData);
    if (viewObj['readOnlyPzhdxxGrid-show'].length === 0) {
        $('.readOnlyPzhdxxGridArea').hide();
    }
    pzhd.isHasZgkpxesp();
    var nowDate = new Date().format('yyyy-MM-dd'),
        dateArr = nowDate.split('-'),
        str,agoDate;
    if(dateArr[1]*1 < 4){
        //str = dateArr[1]-3+12+" "+dateArr[2]+","+(dateArr[0]-1);
        str = (dateArr[0]-1)+"/"+(dateArr[1]-3+12)+"/"+(dateArr[2]);
    }else{
        str = (dateArr[0])+"/"+(dateArr[1]-3)+"/"+(dateArr[2]);
        //str = dateArr[1]-3+" "+dateArr[2]+","+dateArr[0];
    }
    agoDate = new Date(str);
    mini.get("tzrqq").setValue(agoDate);
    mini.get("tzrqz").setValue(nowDate);
    //pzhd.doSearch();
});
pzhd.isHasZgkpxesp = function(){
    var isZgkpxesq = !!mini.decode(sxsl_store.sqsxData.viewData)['zgkpxesp-yl-form'].sqrq;
    if(isZgkpxesq){
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesq"),{visible: true});
        mini.get("tabsPzhd").updateTab(mini.get("tabsPzhd").getTab("zgkpxesqd"),{visible: true});
    }
};
pzhd.getPzhdTz = function(qsrq, zzrq){
    var djxh;
	if (window.sxgz_store) {
		djxh = sxgz_store.sqsxData.djxh;
	}
	if (window.sxsl_store) {
		djxh = sxsl_store.sqsxData.djxh;
	}
	console.log(djxh);
    $.ajax({
        url: "/dzgzpt-wsys/api/xj/pzhd/queryPzhdxx",
        type: "POST",
        data: {
            djxh: djxh,
            qsrq: qsrq,
            zzrq: zzrq
        },
        success: function(data){
            if(data.success){
                mini.get("jqtz-grid").setData(data.value);
            }else{
                mini.alert(data.message);
            }
        },
        error: function(error){
            mini.alert("请求错误！");
        }
    })
};
pzhd.onCzRenderer=function(e){
    var value = e.value;
    if (value=="0"){
        return "未修改";
    }else if(value=="1"){
        return "新增";
    }else if(value=="2"){
        return "修改";
    }else if(value=="3"){
        return "删除";
    }

}
pzhd.doSearch = function(){
    pzhd.getPzhdTz(mini.get("tzrqq").getText(),mini.get("tzrqz").getText());
};