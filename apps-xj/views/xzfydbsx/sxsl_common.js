/**
 * 事项受理公共
 * @type {{urlParams}}
 */
var sxslcommon = {
    urlParams: gldUtil.getParamFromUrl()
};

/**
 * sxsl初始化后插入的数据，供后续使用
 */
var sxsl_store = {
    /*lcslId:"",
     sqxh:"",
     bzzlUrl:"",
     rwbh:"",
     blztDm:"",
     swsxDm:"",
     nsrsbh:"",
     fzxxUrl:"",
     sxshfsDm:"",
     viewData:""*/
};

/**
 * 准予受理事件实现
 */
var sxslbt_zysl = {};
var sxslbt_sxbj = {};
var sxslbt_shbj = {};
var sxslbt_bzzl = {};
var sxslbt_bysl = {};

/**
 * 申请序号
 */
var fbzlSqxh = "";

/**
 * 请求文书申请基本信息
 */
sxslcommon.swsxsqJbxx = sxslService.queryWssqJbxx(sxslcommon.urlParams.lcslId);

/**
 * 初始化页面
 * @param data 对象
 */
sxslcommon.initSxslPage = function (data) {
    var flag = true;
    if (!!data) {
        // 未受理的展示当前日期  已受理的展示受理日期
        if (sxslcommon.urlParams.slsj) {
            data.blqx = sxslcommon.urlParams.slsj
        } else {
            data.blqx = new Date().format('yyyy-MM-dd')
        }
        // 头部加入受理名称
        $("#swsxMc").text(data.swsxMc);
        // 基本信息中加入查出的信息
        $('#nsrjbxx span').each(function (i, v) {
            $(v).text(data[$(v).attr('id')]);
        });

        // 将数据存到对应的对象中
        sxsl_store.lcslId = sxslcommon.urlParams.lcslId;
        sxsl_store.rwbh = sxslcommon.urlParams.rwbh;
        // 补录资料URL地址，为空说明不需要补录：
        sxsl_store.sqxh = data.sqxh;
        sxsl_store.swsxDm = data.swsxDm;
        sxsl_store.nsrsbh = data.sqr;
        sxsl_store.sxshfsDm = data.sxshfsDm;
        //sxsl_store.nsrmc=data.nsrmc;
        fbzlSqxh = data.sqxh;
        sxsl_store.rwztDm = data.rwztDm;
        sxsl_store.djxh = data.djxh;
        // 加载信息特色信息
        ajax.get('../../data/swsxDm.json', {},
            function (responseJson) {
                responseJson = mini.decode(responseJson);
                sxsl_store.ylUrl = responseJson[sxsl_store.swsxDm].ylView;
                sxsl_store.ylJs = responseJson[sxsl_store.swsxDm].ylJs;
                sxsl_store.blzlUrl = responseJson[sxsl_store.swsxDm].blxx;
            }
        )
        var tabs = mini.get("tabs1");
        if(tabs){
            // 附报资料Tab页加载
            var fbzlTab = tabs.getTab(1);
            tabs.loadTab("../fbzl/fbzlPage.html", fbzlTab);
            mini.parse($('#tabs1'));
            if ($.inArray(data.swsxDm,['110113','110133','110212','110213','110214','110207','110208','200006',
                '200007','200001'])>-1) {//外经证申报则不显示第二个tab页
                tabs.removeTab(1);
            }
            // 操作按钮显示初始化
            displayButton(data.swsxDm, data.sxshfsDm);
        }

        //初始化 文书申请信息
        sxsl_store.sqsxData = sxslService.queryWssqxxData(sxsl_store.sqxh);
        sxsl_store.sqsxData = mini.decode(sxsl_store.sqsxData);
        //跨区域涉税事项反馈显示联系手机号码   http://192.168.2.82:8080/redmine/issues/269295
        if(data.swsxDm == "110806"){
            $(".kqysxfk").show();
            $("#lxdh").text(sxsl_store.sqsxData.sjhm||"");
        }else{
            $(".kqysxfk").hide();
        }

        if (!sxsl_store.sqsxData.viewData) {
            flag = false;
        } else {
            // 加载预览页面js
            if (!!sxsl_store.ylJs) {
                gldUtil.loadScript(sxsl_store.ylJs);
            }
            sqzl.initPage(sxsl_store.ylUrl, mini.decode(sxsl_store.sqsxData.viewData),sxsl_store);
        }
    }
    return flag;
};

//======按钮事件方法接口start==
/**
 * 准予受理入口
 * @param xx
 */
sxslcommon.zysl = function () {
    var storeObj = sxsl_store;
    lcslId = storeObj.lcslId;
    rwbh = storeObj.rwbh;
    var result = sxslbt_zysl.zylscomFuc(lcslId, rwbh);
    if (!!result) {
        mini.alert("准予受理成功", '提示信息');
    }
};

/**
 * 事项办结入口
 * @param xx
 */
sxslcommon.sxbj = function () {
    var storeObj = sxsl_store;
    if(storeObj.swsxDm == '110207' || storeObj.swsxDm == '110208' ){
        var blxxObj = {
            "blxxData": ""
        };
        blxxObj.blxxData = mini.get('yhdpz-grid-now').getData();
        store.setSession('pzhdBlxxData', blxxObj);
    }
    var valid = true;
    if(storeObj.swsxDm === '200007'){
        var blxxObj = {
            "blxxData": ""
        };
        blxxObj.blxxData = mini.get('tzhData').getData();
        store.setSession('pzhdBlxxData', blxxObj);
        //判断离线开票限额校验
        var grid = mini.get("tzhData");
        grid.validate();
        valid =  grid.isValid();
    }
    if(!valid){
        mini.alert('离线开票时限、离线开票限额填写有误！')
        return;
    }
    if (storeObj.swsxDm === '30090107') {
        mini.showMessageBox({
            title: '提示',
            message: '请到金三系统中“非居民企业选择由其主要机构场所汇总缴纳企业所得税的申请”功能中录入纳税人的申请信息',
            buttons: ["我知道了", "已在金三录入"],
            callback: function (action) {
                if (action === '我知道了') {
                    //
                } else if (action === '已在金三录入') {
                    sxslbt_sxbj.sxbjcomFuc(storeObj)
                }
            }
        })
    } else {
        sxslbt_sxbj.sxbjcomFuc(storeObj);
    }
};

/**
 * 审核办结入口
 * @param xx
 */
sxslcommon.shbj = function () {
    var storeObj = sxsl_store;
    if(storeObj.swsxDm === '110809'){
        if(storeObj.kqqyBlxxData.zgswjgDm == ''){
            mini.alert('请选择迁入的主管税务机关');
            return;
        }
    }
    if (storeObj.swsxDm === '30090107') {
        mini.showMessageBox({
            title: '提示',
            message: '请到金三系统中“非居民企业选择由其主要机构场所汇总缴纳企业所得税的申请”功能中录入纳税人的申请信息',
            buttons: ["我知道了", "已在金三录入"],
            callback: function (action) {
                if (action === '我知道了') {
                    //
                } else if (action === '已在金三录入') {
                    sxslbt_shbj.shbjcomFuc(storeObj)
                }
            }
        })
    } else {
        sxslbt_shbj.shbjcomFuc(storeObj);
    }
};


/**
 * 补证资料入口
 * @param xx
 */
sxslcommon.bzzl = function () {
    var storeObj = sxsl_store;
    sxslbt_bzzl.bzzlcomFuc(storeObj);
};

/**
 * 不予受理入口
 * @param xx
 */
sxslcommon.bysl = function () {
    var storeObj = sxsl_store;
    sxslbt_bysl.byslcomFuc(storeObj);

};

//=======按钮方法=====


//=======================事项办结方法=================
/**
 *事项办结通用方法
 */
sxslbt_sxbj.sxbjcomFuc = function (storeObj) {

    openSxbjSwsxtzs("", WSYS_BLZT_DM.BLZT_DSP, storeObj);
}
//=============================审核办结方法（是否需要补录,要补正则先填写补正信息，然后填写税务事项通知书）=================
/**
 * 审核办结通用方法
 * @param storeObj
 */
sxslbt_shbj.shbjcomFuc = function (storeObj) {
    var lcslId = storeObj.lcslId;
    var blzlUrl = storeObj.blzlUrl;
    var sqxh = storeObj.sqxh;
    var swsxDm = storeObj.swsxDm;
    var nsrsbh = storeObj.nsrsbh;
    var rwbh = storeObj.rwbh;

    var isNeedBlzl = true; // 是否需要补录资料， 增加额外控制开关
    // 外出经营证明开具
    if ("110801" == swsxDm || "110804" == swsxDm) {
        // 当外出地非河北时，无需发起补充资料，直接办结即可
        var wcjydxzqh = mini.decode(storeObj.sqsxData.viewData).step_yl_form.wcjydxzqh;

        if (!("31" == wcjydxzqh.substr(0, 2))) {
            isNeedBlzl = false;
        }
    }


    //查看是否需要补录
    if (!!blzlUrl && isNeedBlzl) {
        // 打开补录页面
        mini.open({
            url: blzlUrl,
            title: "补录信息",
            width: 900,
            height: 600,
            onload: function () {
                var iframe = this.getIFrameEl();
                iframe.contentWindow.setData(storeObj);
            },
            ondestroy: function (action) {
                if ("ok" == action) {
                    mini.get("backBtn").doClick();
                }
                if ("cancel" != action && "close" != action && "ok" != action) {
                    openSxbjSwsxtzs(action, WSYS_BLZT_DM.BLZT_SLTG, storeObj);
                }
            }
        });
        return;
    }
    openSxbjSwsxtzs("", WSYS_BLZT_DM.BLZT_SLTG, storeObj);
}

//=====================补正资料方法==========================
/**
 * 补正资料通用实现方法
 * @param storeObj
 */
sxslbt_bzzl.bzzlcomFuc = function (storeObj) {
    openSxbjSwsxtzs("", WSYS_BLZT_DM.BLZT_BZZL, storeObj);
}
//========================不予受理方法===========================
/**
 *不予受理通用方法
 * @param storeObj
 */
sxslbt_bysl.byslcomFuc = function (storeObj) {
    openSxbjSwsxtzs("", WSYS_BLZT_DM.BLZT_SLBTG, storeObj);
}


/**
 * 返回上一层
 */
function doBack() {
    CloseWindow("cancel");
}

/**
 * 打开受理通过处理页面 (税务事项通知书或回执页面)
 */

/**
 *用于打开回执的公用方法
 * @param blxxData(补录信息)
 * @param blztFlag（用来确定到底是什么类型的回执界面）
 * @param storeobj（之前初始化预存数据）
 * @param otherData（备注栏预先填写的事项）
 */
function openSxbjSwsxtzs(blxxData, blztFlag, storeobj, otherData) {
    var lcslId = storeobj.lcslId;
    var rwbh = storeobj.rwbh;
    var swsxDm = storeobj.swsxDm;
    var pageUrl = "swsxtzs.html";
    var blxxDataStr = !blxxData ? "" : mini.encode(blxxData);
    var title = "";
    if (WSYS_BLZT_DM.BLZT_SLTG == blztFlag) {
        title = "予以受理";
    } else if (WSYS_BLZT_DM.BLZT_SLBTG == blztFlag) {
        title = "不予受理";
    } else if (WSYS_BLZT_DM.BLZT_BZZL == blztFlag) {
        title = "补正资料";
    } else if (WSYS_BLZT_DM.BLZT_DSP == blztFlag) {
        title = "予以受理";
    }


                mini.open({
                    url: pageUrl,
                    title: title,
                    width: 900,
                    height: 450,
                    onload: function () {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.querySwsxtzsxx(lcslId, rwbh, blztFlag, swsxDm, blxxDataStr, otherData, sxsl_store.rwztDm,sxsl_store.djxh,sxsl_store);
                    },
                    ondestroy: function (action) {
                        if (typeof(action) == "object") {
                            action = mini.decode(action);
                        }
                        if ("ok" == action || "ok" == action.status) {
                            mini.Cookie.set("reflash", "ok");
                            CloseWindow("ok");
                        }
                    }
                });
            }

function displayButton(swsxDm, sxshfsDm) {
    // 初始化按钮为全部隐藏
    mini.get("sxbjBtn").hide();
    mini.get("shbjBtn").hide();
    mini.get("bzzlBtn").hide();
    mini.get("byslBtn").hide();
    mini.get("newSwjgBtn").hide();
    mini.get("sqbPrintBtn").hide();
    mini.get("yclBtn").hide();
    // 即办事项常规按钮
    if (WSYS_SLSHFS_DM.SLSHFS_JB == sxsl_store.sxshfsDm) {
        mini.get("shbjBtn").show();
        if (!(swsxDm == "110113" || swsxDm == "110133" || swsxDm == "110212"|| swsxDm == "110213"|| swsxDm == "110214" || swsxDm == "110805" || swsxDm == "110806" || swsxDm == '110403')) {//外经证申报不显示补正资料
            mini.get("bzzlBtn").show();
        }
        if (swsxDm == "110805") {//跨区域涉税事项报告显示重新指定税务机关按钮
            $('#newSwjgBtn').bind('click', function () {
        mini.open({
                    url: "../sqgl/kqysssxbg/xj_kqysssxbg_zdswjg.html",
                    title: "重新指定税务机关",
            width: 900,
                    height: 500,
            onload: function () {
                var iframe = this.getIFrameEl();
                        iframe.contentWindow.setData(sxsl_store);
            },
            ondestroy: function (action) {
                if (typeof(action) == "object") {
                    action = mini.decode(action);
                }
                if ("ok" == action || "ok" == action.status) {
                    mini.Cookie.set("reflash", "ok");
                    CloseWindow("ok");
                }
            }
        });



            });

            mini.get("newSwjgBtn").show();
        }
        mini.get("byslBtn").show();
    }

    // 非即办事项常规按钮
    if (WSYS_SLSHFS_DM.SLSHFS_FJB == sxsl_store.sxshfsDm) {
        mini.get("sxbjBtn").show();
        mini.get("bzzlBtn").show();
        mini.get("byslBtn").show();
        if(swsxDm === '200006' || swsxDm === '200007'){
            mini.get("bzzlBtn").hide();
        }
    }

    //辖区纳税人外出经营情况只有返回按钮
    var isXqnsrWcjy = gldUtil.getParamFromUrl();
    if (isXqnsrWcjy.ishidden == 'true') {
        mini.get("sxbjBtn").hide();
        mini.get("shbjBtn").hide();
        mini.get("bzzlBtn").hide();
        mini.get("byslBtn").hide();
        mini.get("sqbPrintBtn").hide();
    }
}

function CloseWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}
