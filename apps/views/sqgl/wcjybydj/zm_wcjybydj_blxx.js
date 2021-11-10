$(document).ready(function() {
	mini.parse();
	doCustomizeInit();
});

var loginUser;
var loginUserSwjgDm;
// 初始化 页面
function doCustomizeInit(){
	$.ajax({
        type: "POST",
        url: "/dzgzpt-wsys/api/wtgl/public/login/session",  
        data: {},
        async: false,
        success: function (data) {
            var returnData = mini.decode(data);
            if (returnData.success) {
            	var rtnData= mini.decode(returnData.value);
            	loginUserSwjgDm = rtnData.swjgDm;//当前税务人员主管税务局
            } else {
                mini.alert("查询当前税务人员主管税务局失败!!!");
            }
        }
    });
	if(loginUserSwjgDm == '11300000000'){
    	var zgswjgObj = mini.get("zgswjDm");
        var swjgdm = loginUserSwjgDm.substring(0, 5) + "000000";
    	// 辛集市、 定州市 特殊处理下
        if(loginUserSwjgDm.substring(0, 7) == "1130181" || loginUserSwjgDm.substring(0, 7) == "1130682"){
            swjgdm = loginUserSwjgDm.substring(0, 7) + "0000";
        }

        zgswjgObj.setValue(swjgdm);
        zgswjgObj.disable();


        var nsrSwjgDm = mini.get("zgswskfjDm");
        nsrSwjgDm.setValue("");
        nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/"+swjgdm);
    }else{
    	var zgswjgObj = mini.get("zgswjDm");
        var swjgdm = loginUserSwjgDm.substring(0, 5) + "000000";
    	// 辛集市、 定州市 特殊处理下
        if(loginUserSwjgDm.substring(0, 7) == "1130181" || loginUserSwjgDm.substring(0, 7) == "1130682"){
            swjgdm = loginUserSwjgDm.substring(0, 7) + "0000";
        }

        zgswjgObj.setValue(swjgdm);
        zgswjgObj.disable();


        var nsrSwjgDm = mini.get("zgswskfjDm");
        nsrSwjgDm.setValue("");
        nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKsForWgz/"+(loginUserSwjgDm.substring(0, 7) + "0000"));
        
        //地税主管税务机关赋值
		$.ajax({
			type: "GET",
			url: "/dzgzpt-wsys/api/baseCode/get/GsSwjgdmForDsSwjgdm",  
			data: {},
			async: false,
			success: function (data) {
				var dsZgswjg_dm;
				var roleZgswjDm = loginUserSwjgDm.substr(0,7)+'0000';
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
			}
		});
    }
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


var wcjydxzqh;
var wcjyzmkj_blxx = {};
function setData(storeObj){

    /*wcjyzmkj_blxx.wcjydxzqh = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.wcjydxzqhszDm;//外出经营地行政区划
    wcjyzmkj_blxx.wcjyd = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.wcjyd;//外出经营地街道乡镇
    mini.get("xzqhszDm").setValue(wcjyzmkj_blxx.wcjydxzqh);
    mini.get("jdxzDm").setValue(wcjyzmkj_blxx.wcjyd);*/
    //console.log(storeObj);
}

function setDataExt(wcjydxzqh,wcjydxxdzDm){
    mini.get("xzqhszDm").setValue(wcjydxzqh);
    onXzqhChanged({value:wcjydxzqh});
	mini.get("jdxzDm").setValue(wcjydxxdzDm);
}


var zgswjDm_new ;
function doZgswfjSelected(e){
    zgswjDm_new = loginUserSwjgDm.substring(0, 7) + "0000";
}
function nextShowSwsxtzs() {
    //1.取补录信息数据
    var blxxForm = new mini.Form("#blxxForm");
    blxxForm.validate();
    if(!blxxForm.isValid()){
        return;
    }
    var blxxData = blxxForm.getDataAndText(true);
    if (!!zgswjDm_new) {
        blxxData.zgswjDm = zgswjDm_new;
    }else {
        mini.alert("主管税务分局选择有误，请核实后重新选择")
        return false;
    }
    CloseWindow(blxxData);
}


function doZgswjSelected(e) {
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if (!gszgswjgJDm) {
        return;
    }

    var nsrSwjgDm = mini.get("zgswskfjDm");
    nsrSwjgDm.setValue("");
    nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/" + gszgswjgJDm);
    


}


function doZgswjksfjSelected(e) {
    var zgfjObj = mini.get("zgswskfjDm");
    var selectNode = zgfjObj.getSelectedNode();
    var parentNode = zgfjObj.getParentNode(selectNode);
    zgswjDm_new = parentNode.ID;
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