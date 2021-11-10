$(document).ready(function() {
    mini.parse();
    doCustomizeInit();
});

var loginUser;
// 初始化 页面
function doCustomizeInit(){
     //
}
var wcjydxzqh;
var nsrZgswskfjDm;//纳税人主管税务分局科所
var wcjyzmkj_blxx = {};
var paramData={};
function setData(storeObj){
	// 纳税人是否同意修改行政区划
	var tyEditXzqh = mini.decode(storeObj.sqsxData.data).tyEditXzqh;
	if("Y"===tyEditXzqh){
		// 同意，则xzqhszDm、jdxzDm enabled改为true
		mini.get("xzqhszDm").setEnabled(true);
		mini.get("jdxzDm").setEnabled(true);
	}
	
    paramData=storeObj;
    wcjyzmkj_blxx.wcjydxzqh = mini.decode(storeObj.sqsxData.data).wcjjzmFormData.wcjydxzqhszDm;//外出经营地行政区划
    wcjyzmkj_blxx.jdxzDm = mini.decode(storeObj.sqsxData.data).wcjjzmFormData.jdxzDm;//外出经营地街道乡镇 代码
    wcjyzmkj_blxx.jdxzDmText = mini.decode(storeObj.sqsxData.data).wcjjzmFormData.jdxzDmText;//外出经营地街道乡镇
    $.ajax({
        type : "GET",
        url : "/dzgzpt-wsys/api/baseCode/get/getXjSjXzqh/"+wcjyzmkj_blxx.wcjydxzqh,
        async : false,
        success : function(result) {
            mini.get("xzqhszDm").setValue(result);
        },
        error: function(result) {
            showMessageAtMiddle("获取行政区划出现异常，请稍后再试！");
        }
    });
    var slzgswjDm = mini.get("zgswjDm");
    slzgswjDm.setValue("");
    slzgswjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/getXjXzqhSwjgDm/"+wcjyzmkj_blxx.wcjydxzqh);
    var jdxzObj = {};
    jdxzObj[wcjyzmkj_blxx.jdxzDm] = wcjyzmkj_blxx.jdxzDm;
    mini.get("jdxzDm").setValue(wcjyzmkj_blxx.jdxzDm);
    //console.log(storeObj);
}

function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxForm");
    blxxForm.validate();
    if(!blxxForm.isValid()){
        return;
    }
    var blxxData = blxxForm.getDataAndText(true);
    blxxData.lcslId=paramData.lcslId;
    $.ajax({
        type : "POST",
        url : "/dzgzpt-wsys/api/xj/wcjyby/lzrwbg",
        contentType:"application/x-www-form-urlencoded;charset=utf-8",
        async : false,
        data : blxxData,
        success : function(res) {
            if(res.success){
                alert("重新指定跨区域经营地主管税务机关成功！",function(){
                    CloseWindow("ok");
                });

            }else{
                alert(res.message,function(){
                	CloseWindow("cancel");
                });

            }
        },
        error : function(e){
            console.log(e);
        }
    });
}

function onXzqhChanged(e){
    var xzqhszDm = e.value;
    mini.get("jdxzDm").setValue("");
    // 街道乡镇下拉初始化
    $.ajax({
        type : "GET",
        url : "/dzgzpt-wsys/api/baseCode/get/jdxzByXzqhszdm/"+xzqhszDm,
        async : false,
        success : function(result) {
            mini.get("jdxzDm").setData(result);
        },
        error: function(result) {
            showMessageAtMiddle("获取街道乡镇出现异常，请稍后再试！");
        }
    });
    var slzgswjDm = mini.get("zgswjDm");
    slzgswjDm.setValue("");
    slzgswjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/getXjXzqhSwjgDm/"+xzqhszDm);
}

function doZgswjSelected(e){
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if(!gszgswjgJDm){
        return;
    }
    var nsrSwjgDm = mini.get("zgswskfjDm");
    nsrSwjgDm.setValue("");
    nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/"+gszgswjgJDm);
}

function doQxSwjgSelected(e){
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if(!gszgswjgJDm){
        return;
    }
    var qxSwjgDm = mini.get("zgswskfjDm");
    //判断他选择的分局是否为主管地税务分局，如果是提示税务人员 让他重新选择外出地税务分局
    //外出经营地分局校验
    if(nsrZgswskfjDm == qxSwjgDm.getValue()){
        alert("您选择的分局为主管地税务分局，请重新选择外出地税务分局！");
        qxSwjgDm.setValue("");
    }
    if (qxSwjgDm.getValue() == gszgswjgJDm) {
        alert("请选择区县级税务局！");
        qxSwjgDm.setValue("");
    }
}

function beforeZgswjgSelect(e){
    if (e.isLeaf == false) e.cancel = true;
}

function beforenodeselect(e) {
    //禁止选中父节点
    if (e.isLeaf == false) e.cancel = true;
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}

function onCancel(e) {
    CloseWindow("cancel");
}

/**
 * 自定义提示框，可根据页面滚动，自动定位居中
 * @param message
 */
function showMessageAtMiddle(message) {
    var win = mini.get("win1");
    var el = win.getBodyEl();
    el.innerHTML = message;
    // 当前页面居中显示，居中根据弹出框大小和当前位置计算(问题：Tab键切换下一单元格遮罩未起作用)
    win.show($(window).width()/2-180+"px", $(window).scrollTop()+($(window).height()-220)/2+"px");
}
