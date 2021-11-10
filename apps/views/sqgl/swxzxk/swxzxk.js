/**
 * Created by jiangmq on 2017/3/2.
 */

var swxzxk = {};
var selectedItems;
var basic = {};
var flag = false;
var postData = {};
var fbzlGrid, ylfbzlgrid;
var flagBoolean = false;
stepNav.wizard = $('#wizard'); // 指定容器
stepNav.head = true;  // 是否加载 header
stepNav.foot = true;  // 是否加载 footer

stepNav.run = function () {
    //步骤
    stepNav.initSteps([
        { id: 0, title: '填写申请表', url: 'swxzxksqb.html', js: true },
        { id: 1, title: '上传附报资料', url: '../public/fbzl/FbzlView.html', js: true },
        { id: 2, title: '预览提交', url: 'swxzxkyltj.html', js: true, yltj: true },
        { id: 3, title: '完成', url: '../public/wc/wc.html', js: true }
    ]);

    // mini初始化
    mini.parse();
    blyjWindow = mini.get("blyj-window");
    swxzxk.sqbForm = new mini.Form("#sqb1");
    swxzxk.sqsx = mini.get('sqsx');

    /** 初始化附报资料-grid*/
    fbzlGrid = mini.get("fbzl-grid");
    ylfbzlgrid = mini.get("fbzl-yl-grid");

    swxzxk.init();

};

stepNav.onStepChanging = function (event, currentIndex, nexIndex) {
    //申请表填写
    if (currentIndex == 0) {
        // 申请表检验
        if (!swxzxk.validate()) {
            return false;
        }

        var data = swxzxk.sqbForm.getData();
        var sqbyl = new mini.Form("#sqb2");
        sqbyl.setData(data);

        /** 附报资料*/
        wssqUtil.currentSwsxDm = 'SX01'; //现在是固定写死的，正式上线时去掉就可以了
        var swsxMxDmList = []; //如果有税务事项明细代码请组织好
        //获取附报资料列表
        var datas = {
            'swsxDm': wssqUtil.currentSwsxDm,
            'swsxMxDmList': swsxMxDmList
        };
        fbzlAjax(datas, 'requestFbzllist');
        return true;
    } else if (currentIndex == 1) {
        //判断是否按要求上传附报资料
        if (!isCondition()) {
            return;
        }
        // ylfbzlgrid.setData(fbzldata);
    } else if (currentIndex == 2) {
        //提交表单数据
        swxzxk.tj();
        return flagBoolean;
    } else if (currentIndex == 3) {
    }

    return true;
}

stepNav.onStepChanged = function (event, currentIndex, newindex) {

}

stepNav.onFinished = function (event, currentIndex) {
    wssqUtil.showResult('您的申请已经成功提交，欢迎继续使用', '我的办税大厅', '/web-front/bszm-front/apps/views/home/home.html');
}

swxzxk.init = function () {
    //基本信息
    swxzxk.getBasicInfo();
    swxzxk.sqrmc = mini.get('sqrmc');
    swxzxk.nsrsbh = mini.get('nsrsbh');
    swxzxk.fddbr = mini.get('fddbr');


    swxzxk.sqrmc.setValue(basic.sqrmc);
    swxzxk.nsrsbh.setValue(basic.nsrsbh);
    swxzxk.fddbr.setValue(basic.fddbr);

    swxzxkService.canDoSwxzxksq(function (result) {

    }, function (result) {
        mini.alert(result.message)
    });


    swxzxk.setAllCheckDisabled();
}

swxzxk.getBasicInfo = function () {
    basic.nsrsbh = wssqUtil.nsrjbxx.nsrsbh.substring(2);
    basic.sqrmc = wssqUtil.nsrjbxx.nsrmc;
    basic.fddbr = wssqUtil.nsrjbxx.fddbrxm;
}

swxzxk.setAllCheckDisabled = function () {
    for (var i = 1; i < 8; i++) {
        var item = mini.get('sqcl-' + i);
        item.setValue(null);
        item.setEnabled(false);
    }
}

swxzxk.doCheckChanged = function (e) {
    swxzxk.setAllCheckDisabled();
    for (var i = 1; i <= 7; i++) {
        var blyj = "blyj-list-" + i;
        $("#" + blyj).css("display", "none");
    }
    // 申请材料多选
    selectedItems = e.sender.getSelecteds();
    for (var i = 0; i < selectedItems.length; i++) {
        mini.get("sqcl-" + selectedItems[i].id).setEnabled(true);
        var blyj = "blyj-list-" + selectedItems[i].id;
        $("#" + blyj).css("display", "block");
    }
}

swxzxk.validate = function () {
    swxzxk.sqbForm.validate();
    if (!swxzxk.sqbForm.isValid()) {
        return false;
    }

    if (mini.get("sqsx").getSelecteds().length == 0) {
        mini.alert('请选择申请事项!');
        return false;
    } else {
        for (var i = 0; i < selectedItems.length; i++) {
            if (mini.get("sqcl-" + selectedItems[i].id).getSelecteds().length == 0) { //申请材料没有选择
                var a = selectedItems[i].id;
                mini.alert("请选择申请材料中的第 " + a + " 条！");
                return false;
            }
        }
    }
    if (!flag) {
        blyjWindow.show();
    }

    return flag;
}

swxzxk.tj = function () {
    var tmpdata = swxzxk.sqbForm.getData();
    postData.sqrmc = basic.sqrmc;
    postData.nsrsbh = basic.nsrsbh;
    postData.fddbr = basic.fddbr;
    postData.dzyzbm = tmpdata.dzyzbm;
    postData.jbr = tmpdata.jbr;
    postData.jbr_sfzh = tmpdata.jbr_sfzh;
    postData.jbr_lxdz = tmpdata.jbr_lxdz;
    postData.jbr_lxdh = tmpdata.jbr_lxdh;
    postData.wtdlr = tmpdata.wtdlr;
    postData.wtdlr_sfzh = tmpdata.wtdlr_sfzh;
    postData.wtdlr_lxdh = tmpdata.wtdlr_lxdh;
    postData.wtdlr_lxdz = tmpdata.wtdlr_lxdz;
    postData.sqrq = new Date().Format("yyyy-MM-dd HH:mm:ss");

    //申请事项
    var sqsxData = [];
    for (var i = 0; i < selectedItems.length; i++) {
        j = parseInt(selectedItems[i].id);
        var sqsxObj = new Object();
        sqsxObj.sqsxmc = selectedItems[i].text;
        sqsxObj.id = selectedItems[i].id;
        sqsxData.push(sqsxObj);
    }
    postData.sqsx = sqsxData;

    //申请材料
    var sqclData = getYwsxList();
    postData.sqcl = sqclData;
    var formdata = mini.encode(postData);

    swxzxkService.tj(mini.encode(formdata), function (data) {
        var result = mini.decode(data);
        if (result.success) {
            swxzxkService.submitSwxzxk(formdata, function (result) {
                // console.dir(result);
                flagBoolean = true;
            }, function (result) {
                mini.alert(result.message);
            });
            return true;
        } else {
            console.dir(data);
            mini.alert(result.message);
            return false;
        }
    });
}

function closeBlyjWin() {
    blyjWindow.hide();
    flag = true;
    stepNav.wizard.steps('next');
}

function getYwsxList(stepNav) {
    var sqclData = new Array();
    var sqclObj1 = new Object();
    sqclObj1.sqclmc = '经办人身份证件';
    sqclObj1.ywsxDm = '001';
    sqclData.push(sqclObj1);
    var sqclObj2 = new Object();
    sqclObj2.sqclmc = '代理委托书及代理人身份证件';
    sqclObj2.ywsxDm = '002';
    sqclData.push(sqclObj2);
    for (var i = 0; i < selectedItems.length; i++) {
        var selectSqcl = mini.get('sqcl-' + selectedItems[i].id).getSelecteds();
        for (var j = 0; j < selectSqcl.length; j++) {
            var sqclObj = new Object();
            sqclObj.sqclmc = selectSqcl[j].text;
            sqclObj.ywsxDm = selectSqcl[j].id;
            sqclData.push(sqclObj);
        }
    }
    return sqclData;
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

