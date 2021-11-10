$(document).ready(function() {
    mini.parse();
    doCustomizeInit();
});

var loginUser;
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
var nsrZgswskfjDm;//纳税人主管税务分局科所
var wcjyzmkj_blxx = {};
function setData(storeObj){

    wcjyzmkj_blxx.wcjydxzqh = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.wcjydxzqhszDm;//外出经营地行政区划
    wcjyzmkj_blxx.jdxzDm = mini.decode(storeObj.sqsxData.data).wjcyzmsqb.zmWcjyhdssglzmxxVO.jdxzDm;//外出经营地街道乡镇 代码
    wcjyzmkj_blxx.wcjyd = mini.decode(storeObj.sqsxData.viewData).step_yl_form.wcjyd;//外出经营地街道乡镇
    mini.get("wcjyzm_blxx_grid").setData(mini.decode(storeObj.sqsxData.viewData).wcjyzm1_grid); //外出经营证明grid赋值
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
    jdxzObj[wcjyzmkj_blxx.jdxzDm] = wcjyzmkj_blxx.wcjyd;
    mini.get("jdxzDm").setData([{"ID":wcjyzmkj_blxx.jdxzDm, "MC":wcjyzmkj_blxx.wcjyd}]);
    mini.get("jdxzDm").setValue(wcjyzmkj_blxx.jdxzDm);
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
    blxxData.wcjyzmGridData = mini.get("wcjyzm_blxx_grid").getData();
    CloseWindow(blxxData);
}


function doZgswjSelected(e){
    var gszgswjgJDm = mini.get("zgswjDm").getValue();
    if(!gszgswjgJDm){
        return;
    }

    var nsrSwjgDm = mini.get("zgswskfjDm");
    nsrSwjgDm.setValue("");
    nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/"+gszgswjgJDm);

    /*var jdxzDm = mini.get("jdxzDm");
     jdxzDm.setValue("");
     jdxzDm.setUrl("/wtgl/common/getDmJdxz.do?swjgDm="+gszgswjgJDm);*/
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