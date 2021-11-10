
var sxgzFlag = '';
$(function(){
    mini.parse();
    var result = sxslcommon.initSxslPage(sxslcommon.swsxsqJbxx);
    if(!result){
        mini.alert("初始化页面失败，申请信息为空！");
        return;
    }

    mini.get("sxbjBtn").on('click',sxslcommon.sxbj);
    mini.get("shbjBtn").on('click',sxslcommon.shbj);
    // mini.get("bzzlBtn").on('click',sxslcommon.bzzl);
    mini.get("byslBtn").on('click',sxslcommon.bysl);

    // $("#bzzlBtn").hide();

    sxgzFlag= Tools.getUrlParamByName('sxgzMark');

    if(sxgzFlag == 'Y') {
        var btns = $(".dbsx-actions").find('a');
        btns.each(function () {
            if ($(this).attr('id') !== 'backBtn') {
                $(this).hide();
            }
        })

        var tabs = mini.get($('.mini-tabs').get(0));
        var html = loadTabTemplate("../sxgz/slxx.html");
        mini.parse($(tabs));

        //初始化 文书申请信息
        sxslcommon.sqsxData = queryWssqxxData(sxslcommon.sqxh);
        sxslcommon.sqsxData = mini.decode(sxslcommon.sqsxData);

        var tab = {title: "受理信息",name:"2"};
        tab = tabs.addTab(tab);
        var el = tabs.getTabBodyEl(tab);
        el.innerHTML = html;
        initSlxxPage(sxslcommon);


        if(sxslcommon.blztDm == '02' ||sxslcommon.blztDm == '06'){
            $("#download").show();
        }else{
            $("#download").hide();
        }

    }
    if(Tools.getUrlParamByName('bysl') === 'bysl'){
        $('#shbjBtn').hide();
    }
});

function onActionRenderer(e) {
    var record = e.record;
    var lcslId = record.lcslid;
    var rwztDm = record.rwztDm;
    var swsxDm = record.swsxdm;
    var rwbh = record.rwbh;
    var index = record._index;

    // 任务状态为已办理时，不显示操作链接。
    if(record.swsxdm === "110001"){
        return '<a class="Delete_Button" onclick="showYjbs(\''+record.lcslid+'\')" href="#">受理</a>';
    }

    if ("01" == rwztDm) {
        return '<a class="Delete_Button" href="#">-</a>';
    }

    if ("00" == rwztDm) {
        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' + lcslId
            + '\',\'' + rwbh + '\',\'' + index + '\')" href="#">受理</a>';
    }
}



/**
 * Go to 事项受理页面
 * @param lcslId
 * @param blztDm
 * @param rwbh
 */
function showSwsxSqxx(lcslId,isDw) {
    var loadingId = mini.loading("处理中", "提示");
    var url = '';
    checkDbsxslzt(lcslId, function(){
        url = "dbsx_sxsl_yjbs.html?lcslId=" + lcslId;
        openDbsxsl(url,isDw);
    });
    mini.hideMessageBox(loadingId);
}

//弹出待办事项受理页面


/**
 * 任务状态渲染
 * @param e
 * @returns {String}
 */
function rwztRenderer(e) {
    var record = e.record;
    var rwztDm = record.rwztDm;
    if ("00" == rwztDm) {
        return "未受理";
    }
    if ("01" == rwztDm) {
        return "已受理";
    }
    if ("02" == rwztDm) {
        return "待税种认定";
    }
    return "";
}

/**
 * 重置查询条件
 */
function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
}

/**
 * 刷新待办任务状态
 */
function reflashDbrwzt(){
    var reflash = mini.Cookie.get("reflash");
    if ("ok" == reflash) {
        var dbsxGrid = mini.get("dbsxGrid");
        var index = Number(mini.Cookie.get("_index"));
        var row = dbsxGrid.getRow(index);
        dbsxGrid.updateRow(row._index,"rwztDm","01");
    }
    mini.Cookie.set("reflash", "ng");
}

var refDbrwzt = setInterval(function(){
    reflashDbrwzt();
}, 1000);


function showYjbs(id,isDw) {
    mini.open({
        showMaxButton : true,
        title : "新办户一键办税",
        url : '../xkhnsryjbs/xknsryjbscx.html',
        showModal : true,
        width : "100%",
        height : "100%",
        onload : function() {
            var iframe = this.getIFrameEl();
            iframe.contentWindow.initYjbs(id,isDw);
        },
        ondestroy : function(action) {
            unlockDbsxslzt();
        }
    });
}

//受理信息部分单独处理了
/**
 * 加载html模板
 * */
function loadTabTemplate(url) {
    var html='';
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        dataType: 'html',
        success: function (response) {
            html = response;
        },
        error: function () {
            //console.log('加载html出错');
        }
    });
    return html;
}
function getSwjgmc(swjgdm) {
    var swjgmc = "";
    ajax.get("/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect2/DM_GY_SWJG_GT3", {}, function(result) {
        if(!!result){
            for(var i=0;i<result.length;i++){
                if(result[i].ID===swjgdm){
                    swjgmc=result[i].MC;
                }
            }
        }
    });
    return swjgmc;
}

function getSwsxtzsNr(sqxh) {
    var swsxtzs="";
    ajax.get("../../../../api/xj/wtgl/sxgz/getSwsxtzs/"+sqxh, {}, function(result) {
        if(result.success){
            if(result.value && result.value.length >0){
                swsxtzs= result.value[0].swsxtzsnr;
                $('#slrq').html(result.value[0].sqrq)
            }

        }
    });
    return swsxtzs;
}

var sqxh="";
var swsxdm="";
var blztDm="";
function initSlxxPage(sxgz_store) {
    mini.parse();
    sqxh=sxgz_store.sqxh;
    swsxdm=sxgz_store.swsxDm;
    blztDm = sxgz_store.sqsxData.blztDm;
    var slxx =mini.decode(sxgz_store.sqsxData.data);
    var blxx=mini.decode(slxx.blxx);
    $("#slswjg").text(getSwjgmc(blxx==undefined ? "":blxx.slswjgDm));
    $("#slr").text(blxx==undefined ? "":blxx.slrDm);
//需求让改成是通知数据中的内容，不是状态名称 根据流程实例id和办理状态代码获取通知书内容
    $("#sljg").text(getSwsxtzsNr(sxgz_store.sqxh));
    //$("#sljg").text(sxgz_store.sqsxData.blztMc);
    $("#slrq").text(blxx==undefined ? "":blxx.slrq);
    if(isShowButton(blztDm,swsxdm)){//如果是受理中，受理通过和一照一码不显示下载通知书按钮。因为没有通知书
        $('#download').hide();
    }
};
function isShowButton(blztDm,swsxDm){
    var arr = new Array('00', '01', '03','07','10','30','31','32','99','12','11','15','33','34');  //没有通知书的状态
    if(contains(arr,blztDm)||swsxDm=="110101"||swsxDm=="110121"){
        return true
    }
    return false;
}
function contains(arr, obj) {
    var i = arr.length;
    while (i--) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}
function doBack() {
    onCancel('ok');
}
$('body').on('click', '#download', function(){
    window.open('/dzgzpt-wsys/api/xj/wtgl/sxgz/tzspdf/download/' + sqxh+'/'+swsxdm+'/'+blztDm);
});


function queryWssqxxData(sqxh) {
    var params = {
        sqxh : sqxh
    };
    var data = null;
    ajax.post("../../../../api/wtgl/dbsx/queryWssqViewData", params, function(result) {
        if (result.success && result.value) {
            data = mini.decode(result.value);
        } else {
            mini.alert(result.message);
            return false;
        }
    });
    return data;
};


function onCancel(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}
