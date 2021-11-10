var pzhd = {};
mini.VTypes["bigThanZero"] = function (v) {
    //不对空值进行校验
    return !!v && v != 0 ? v >= 0 : true;
};
$(function () {
    //todo 票种核定调整是否有补正资料，先当作有
    mini.get("bzzlBtn").hide();
    //不存在不可调整的票种核定信息时隐藏
    var viewObj = JSON.parse(sxsl_store.sqsxData.viewData);
    if (viewObj['bktzData'].length === 0) {
        $('.readOnlyPzhdxxGridArea').hide();
    }
    setTimeout(function () {
        pzhd.isHasZgkpxesp();
    },200);
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
});
pzhd.isHasZgkpxesp = function(){
    var isZgkpxesq = mini.decode(sxsl_store.sqsxData.viewData)['isHasZgkpxesq'];
    if(isZgkpxesq && isZgkpxesq === 'Y'){
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
	var tjData = {
	    qsrq: qsrq,
        zzrq: zzrq,
        djxh: djxh
	};
    $.ajax({
        url: "/dzgzpt-wsys/api/pzhd/queryPzhdSqjlxx",
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(tjData),
        success: function(data){
            if(data.success){
                mini.get("jqtz-grid").setData(data.value);
            }else{
                mini.get("jqtz-grid").setData('');
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

};
pzhd.doSearch = function(){
    pzhd.getPzhdTz(mini.get("tzrqq").getText(),mini.get("tzrqz").getText());
};