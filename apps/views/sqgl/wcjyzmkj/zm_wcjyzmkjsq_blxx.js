$(document).ready(function() {
	mini.parse();
	doCustomizeInit();
});

var loginUser;
var nsrZgswskfjDm;
var nsrxx;
var roleZgswjDm;
// 初始化 页面
function doCustomizeInit(){
    /*$.ajax({
     type : "GET",
     url : "/wtgl/dbsx/getSession.do",
     success : function(result) {
     loginUser = mini.decode(result).data;
     },
     error: function(result) {
     showMessageAtMiddle("获取税局管理员登录信息失败，请稍后再试！");
     }
     });*/
}
var wcjydxzqh;
var wcjyzmkj_blxx = {};
function setData(storeObj){

    wcjyzmkj_blxx.wcjydxzqh = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.wcjydxzqhszDm;//外出经营地行政区划
    wcjyzmkj_blxx.jdxzDm = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.jdxzDm;//外出经营地街道乡镇 代码
    wcjyzmkj_blxx.wcjyd = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.wcjyd;//外出经营地街道乡镇
    mini.get("xzqhszDm").setValue(wcjyzmkj_blxx.wcjydxzqh);
    var jdxzObj = {};
    jdxzObj[wcjyzmkj_blxx.jdxzDm] = wcjyzmkj_blxx.wcjyd;
    mini.get("jdxzDm").setData([{"ID":wcjyzmkj_blxx.jdxzDm, "MC":wcjyzmkj_blxx.wcjyd}]);
    mini.get("jdxzDm").setValue(wcjyzmkj_blxx.jdxzDm);
    
    $.ajax({
        type: "POST",
        url: "/dzgzpt-wsys/api/wtgl/public/login/session",  
        data: {},
        async: false,
        success: function (data) {
            var returnData = mini.decode(data);
            if (returnData.success) {
            	var rtnData= mini.decode(returnData.value);
             	mini.get("RoleZgswjDm").setValue(rtnData.swjgDm);//当前税务人员主管税务局
				roleZgswjDm = rtnData.swjgDm.substr(0,7)+'0000';
             	//地税主管税务机关赋值
             	if(rtnData.swjgDm !='11300000000'){
					$.ajax({
						type: "GET",
						url: "/dzgzpt-wsys/api/baseCode/get/GsSwjgdmForDsSwjgdm",  
						data: {},
						async: false,
						success: function (data) {
							var dsZgswjg_dm;
							for (x in data)
							{
								if(data[x].GSZGSWJG_DM == roleZgswjDm){
									dsZgswjg_dm = data[x].DSZGSWJG_DM;
									break;
								}
							}
							mini.get("dszgswjDm").setValue(dsZgswjg_dm);
							$("#dszgswjDm").change(function () {  
								var dszgswskfjDm = mini.get("dszgswskfjDm");
								dszgswskfjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/DsSwjgKsForWgz/"+dsZgswjg_dm);
							});  
							$("#dszgswjDm").trigger("change");
						}});
             		
            	}
            } else {
                mini.alert("查询当前税务人员主管税务局失败!!!");
            }
        }
    });
    $.ajax({
        type: "POST",
        url: "/dzgzpt-wsys/api/wtgl/public/get/nsrxxByDjxh/"+mini.decode(storeObj.sqsxData.data).djxh,  
        data: {},
        async: false,
        success: function (data) {
            var returnData = mini.decode(data);
            if (returnData.success) {
            	nsrxx = data.value;
            	nsrZgswskfjDm = data.value.zgswskfjDm;//纳税人科所分局
            } else {
                mini.alert("查询纳税人信息失败!!!");
            }
        }
    });
    
    mini.get("zmyxqxq").setValue(mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.zmyxqxq);
    //zmyxqxz 需要用到纳税人信息，所以移到后面来了。
    mini.get("zmyxqxz").setValue(mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.zmyxqxz);
}


function onDateChanged(e){
	 if (!!e.sender.value && e.sender.value <= mini.get("zmyxqxq").getValue()){
         mini.get("zmyxqxz").setValue("");
         mini.alert("合同有效期止必须大于于合同有效期起");
         return;
     }
     
     if (!!e.sender.value && e.sender.value < new Date().getTime()){
     	 mini.get("zmyxqxz").setValue("");
          mini.alert("合同有效期限止必须大于当前日期");
          return;
     }
     
     var days = mini.get("zmyxqxz").getValue() - mini.get("zmyxqxq").getValue();
     var time = parseInt(days / (1000 * 60 * 60 * 24));
     //建筑行业不进行180天的校验。
     if (time > 180&&nsrxx.hyDm.indexOf("47")!=0&&nsrxx.hyDm.indexOf("48")!=0&&nsrxx.hyDm.indexOf("49")!=0&&nsrxx.hyDm.indexOf("50")!=0){
    	 mini.get("zmyxqxz").setValue("");
    	 mini.alert("有效期起止最大时间不能超过180天");
    	 return;
     }
}

//判断他选择的分局是否为主管地税务分局，如果是提示税务人员 让他重新选择外出地税务分局
function validateZgswskfjDm() {
	
	//外出经营地分局校验
	if(nsrZgswskfjDm == mini.get("zgswskfjDm").getValue()){
		mini.alert("您选择的分局为主管地税务分局，请重新选择外出地税务分局！");
		return false;
	}
	return true;
}

function nextShowSwsxtzs() {
	if(!validateZgswskfjDm()){
		return;
	}
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxForm");
    blxxForm.validate();
    if(!blxxForm.isValid()){
        return;
    }
    var blxxData = blxxForm.getDataAndText(true);
    blxxData.zgswjDm = mini.get("RoleZgswjDm").getValue().substr(0,7)+'0000';
    CloseWindow(blxxData);
}

//地税主管税务机关选择事件
function doDsZgswjSelected(e){
	var dszgswjDm = mini.get("dszgswjDm").getValue().substr(0,7);
	if(!dszgswjDm){
		return;
	}
	var dszgswskfjDm = mini.get("dszgswskfjDm");
	dszgswskfjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/DsSwjgKsForWgz/"+(dszgswjDm.substr(0,7)+'0000'));
}

function doZgswjSelected(e){
	//zgswjDm选择的主管税务机关zgswskfjDmOld税务人员的主管税务机关
	var tempZgswj = mini.get("zgswjDm").getValue().substr(0,7);
	var tempRoleZgswj = mini.get("RoleZgswjDm").getValue().substr(0,7);
	if(!tempZgswj){
		return;
	}
	//辛集
	if(tempRoleZgswj!='1130000' && (tempRoleZgswj=='1130181'||tempZgswj=='1130181') && tempZgswj!=tempRoleZgswj){
		mini.get("zgswjDm").setValue('');
		mini.alert("您选择的外出经营地主管税务局与当前税务人员的主管税务机关不匹配，请重新选择外出经营地主管税务局！");
		return;
	}
	//定州
	if(tempRoleZgswj!='1130000' && (tempRoleZgswj=='1130682'||tempZgswj=='1130682') && tempZgswj!=tempRoleZgswj){
		mini.get("zgswjDm").setValue('');
		mini.alert("您选择的外出经营地主管税务局与当前税务人员的主管税务机关不匹配，请重新选择外出经营地主管税务局！");
		return;
	}
	//其它地市
	if(tempRoleZgswj!='1130000' && tempZgswj.substr(0,5)!=tempRoleZgswj.substr(0,5)){
		mini.get("zgswjDm").setValue('');
		mini.alert("您选择的外出经营地主管税务局与当前税务人员的主管税务机关不匹配，请重新选择外出经营地主管税务局！");
		return;
	}
	//var gszgswjgJDm = mini.get("zgswjDm").getValue();
	var gszgswjgJDm = mini.get("RoleZgswjDm").getValue();//当前用户的主管税务局
	if(!gszgswjgJDm){
		return;
	}
	if(gszgswjgJDm =='11300000000'){
		var nsrSwjgDm = mini.get("zgswskfjDm");
		nsrSwjgDm.setValue("");
		nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/"+mini.get("zgswjDm").getValue());
	}else{
		var nsrSwjgDm = mini.get("zgswskfjDm");
		nsrSwjgDm.setValue("");
		nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKsForWgz/"+(gszgswjgJDm.substr(0,7)+'0000'));
	}
	
}


function doQxSwjgSelected(e){
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if(!gszgswjgJDm){
        return;
    }

    var qxSwjgDm = mini.get("zgswskfjDm");
    if (qxSwjgDm == gszgswjgJDm) {
        mini.alert("请选择区县级税务局！");
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


function onXzqhChanged(e){
    var xzqhszDm = e.value;
    //mini.get("jdxzDm").setValue("");
    // 街道乡镇下拉初始化
    $.ajax({
        type : "GET",
        url : "/baseCode/get/jdxzByXzqhszdm/"+xzqhszDm,
        async : false,
        success : function(result) {
            mini.get("jdxzDm").setData(result);
        },
        error: function(result) {
            showMessageAtMiddle("获取街道乡镇出现异常，请稍后再试！");
        }
    });

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



/*电话号码校验*/
function onLxdhValidation(e) {
    if (e.isValid) {
        if (isLxdh(e.value.trim()) == false) {
            e.errorText = "请输入正确的联系方式，如0571-88886666或88886666或13712312311";
            e.isValid = false;
        }
    }
};
function isLxdh(val) {
    if(val != ''){
        var isPhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        //var isMob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
        var isMob=/^((\+?86)|(\(\+86\)))?(13[0-9]{9}|15[0-9]{9}|18[0-9]{9}|14[0-9]{9}|17[0-9]{9})$/;
        if(isPhone.test(val) || isMob.test(val))
            return true;
        return false;
    }
};