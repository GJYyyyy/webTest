var tabsName="";
var lqfsDm = '';
var lgfsText = '';
var yjDdxx;
var FpzlArray;
var sqxh;
var djxh;
var gprXm;
var blxx={
    "zzsfpfsGrid":"",
    "fpzlxx":"",
    "otherFzMap":""
};
var otherFzData={
    "gprXm":"",
    "sqxh":"",
    "lqfs":""
};
$(function () {
    setTimeout(function () {
        initData();
    },10)
});
function initData(){
    urlParams = {urlParams : gldUtil.getParamFromUrl()};
    if(!!urlParams.urlParams.sxgzFlag){
        //事项跟踪页面进入功能
        tabsName="tabs-sxgz";
        gprXm=JSON.parse(sxgz_store.sqsxData.viewData)['gprxx'][0].gprxm;
        sqxh = sxgz_store.sqxh;
        djxh = sxgz_store.djxh;
        mini.get("zzsfpfsGrid").hideColumn(6);//隐藏发票发售信息的领用时间列
        dealSxgz(sqxh);
        queryFplyqk(djxh, sqxh);
    }else{
        tabsName="tabs1";
        gprXm=JSON.parse(sxsl_store.sqsxData.viewData)['gprxx'][0].gprxm;
        sqxh = sxsl_store.sqxh;
        djxh = sxsl_store.djxh;
        mini.get('bzzlBtn').hide();
        mini.get('shbjBtn').setText('核票保存');
        queryFplyqk(djxh, sqxh);
        //重写审核办结通用方法
        sxslbt_shbj.shbjcomFuc=function(storeObj){
            var fplyBlxx=getBlxx();
            if(fplyBlxx==null){
                return false;
            }
            var lcslId = storeObj.lcslId;
            var blzlUrl = storeObj.blzlUrl;
            var sqxh = storeObj.sqxh;
            var swsxDm = storeObj.swsxDm;
            var nsrsbh = storeObj.nsrsbh;
            var rwbh = storeObj.rwbh;

            var isNeedBlzl = true; // 是否需要补录资料， 增加额外控制开关

            //查看是否需要补录
            if (!!blzlUrl && isNeedBlzl) {
                // 打开补录页面
                mini.open({
                    url : blzlUrl,
                    title : "补录信息",
                    width : 900,
                    height : 600,
                    onload : function() {
                        var iframe = this.getIFrameEl();
                        iframe.contentWindow.setData(storeObj);
                    },
                    ondestroy : function(action) {
                        if ("ok" === action) {
                            mini.get("backBtn").doClick();
                        }
                        if ("cancel" !== action && "close" !== action && "ok" !== action) {
                            openSxbjSwsxtzs(action,WSYS_BLZT_DM.BLZT_SLTG,storeObj);
                        }
                    }
                });
                return;
            }
            openSxbjSwsxtzs(fplyBlxx,WSYS_BLZT_DM.BLZT_SLTG,storeObj);
        };
    }
}

function queryFplyqk(djxh, sqxh) {
    var messageid = mini.loading("正在查询您的发票领用信息，请稍等", "查询领用信息");
    $.ajax({ type : "POST",
        url : "/dzgzpt-wsys/api/wtgl/fplyglbz/get/queryLyqk",
        contentType: 'application/json;charset=utf-8',
        data : mini.encode({
            djxh : djxh,
            sqxh : sqxh
        }),
        success : function(result) {

            var result = mini.decode(result);

            if (!result.success) {
                mini.alert(result.message);
                mini.hideMessageBox(messageid);
                return;
            }

            var data = mini.decode(result.value);
            // 设置领取方式
            lqfsDm = data.fpfsqk[0].lqfs;
            var tabs = mini.get(tabsName);
            //移除附报资料
            tabs.removeTab(1);
            if (lqfsDm === "01") {
                lgfsText = "大厅领取";
            } else if (lqfsDm === "03") {
                lgfsText = "邮寄领取";
                $.ajax({
                    type : "POST",
                    async: false,
                    url : "/dzgzpt-wsys/api/wtgl/yj/queryYjDdxxBySqxh",
                    contentType: 'application/json;charset=utf-8',
                    data : mini.encode({
                        sqxh : sqxh
                    }),
                    success : function(result) {
                        var result = mini.decode(result);
                        if (!result.success) {
                            mini.alert(result.message);
                            mini.hideMessageBox(messageid);
                            return false;
                        }
                        yjDdxx = mini.decode(result.value) || {};
                        yjDdxx.kdgs='ems';//快递公司默认
                        var tab = { title: "邮寄信息", url: '../fplygl-bz/fplyYjDdxx.html', showCloseButton: false };
                        tab.onload=function(e,obj){
                            var tabs=e.sender;
                            var iframe = tabs.getTabIFrameEl(e.tab);
                            iframe.contentWindow.initFplyYjDdxxTab();
                        };
                        tabs.addTab(tab);
                    },
                    error : function(e) {
                        mini.alert("获取发票邮寄订单信息发生错误，请联系技术运维人员！");
                        mini.hideMessageBox(messageid);
                    }
                });

            } else if (lqfsDm === "04") {
                lgfsText = "自助终端领取";
            }else if(lqfsDm === "05"){
                lgfsText = "在线领取";
            }
            var nsrjbxxTr = $('#nsrjbxx').find('tr');
            nsrjbxxTr.eq(0).append($('<th>购票人姓名：</th><td>' + gprXm + '</td>'));
            nsrjbxxTr.eq(1).append($('<th>发票领取方式：</th><td>' + lgfsText + '</td>'));

            FpzlArray=[];//存放增值税的发票资料代码
            for(var i=0;i< data.fpfsqk.length;i++){
                FpzlArray[FpzlArray.length] = {
                    fpzlDm : data.fpfsqk[i].fpzlDm
                };
            }
            mini.hideMessageBox(messageid);
        },
        error : function(e) {
            mini.hideMessageBox(messageid);
            mini.alert("获取普通发票领购信息失败!");
        }
    });
}
function dealSxgz(tempSqxh){
    $("#searchGt3Tip").hide();
    mini.get("searchGt3Button").hide();
    mini.get("searchGt3Instruction").hide();
    $.ajax({ type : "POST",
        url : "/dzgzpt-wsys/api/wtgl/fplyglbz/get/getFpfssqmx",
        contentType: 'application/json;charset=utf-8',
        data : mini.encode({
            sqxh : tempSqxh
        }),
        success : function(result) {
            var result = mini.decode(result);
            if(result.success){
                var list=result.value;
                $.each(list,function(index,value){
                    value.hffs=value.fpzh-value.fpqh+1;
                });
                mini.get("zzsfpfsGrid").setData(list);
            }else{
                mini.alert("获取发票发售信息失败!");
            }
        }
    });

}
function getBlxx(){
    otherFzData.gprXm=gprXm;
    otherFzData.sqxh=sqxh;
    otherFzData.lqfs=lqfsDm;
    blxx.otherFzMap=mini.encode(otherFzData);
    blxx.fpzlxx=mini.encode(FpzlArray);
    var zzsfpfsGrid = mini.get("zzsfpfsGrid");
    var rows =zzsfpfsGrid.getData();
    var lgxxGrid = mini.get("lgxxGrid");
    var lgData = lgxxGrid.getData();
    if(rows.length===0){
        mini.alert("请选择发票发售记录");
        return null;
    }
    if(rows.length > 0 && lgData.length > 0){
        var arr = JSON.parse(JSON.stringify(lgData));
        for (var i = 0; i<rows.length; i++){
            for (var j = 0; j<arr.length; j++){
                if(rows[i].fpzlDm === arr[j].fpzlDm){
                    arr.splice(j,1);
                    j = j - 1;
                }
            }
        }
        if(arr.length !== 0){
            mini.alert("实际核发发票种类与纳税人申请不符，请检查发售信息后重新做核票保存或直接做不予受理");
            return null;
        }
    }


    blxx.zzsfpfsGrid=mini.encode(rows);
    return blxx;
}
function showMessage() {
    mini.alert("发票领用操作说明<br>1.去金三核心征管系统前台完成发票发售操作<br>2.在本系统中点击【查询金三发票发售信息】按钮，选取上一步在金三系统中发售的记录，然后点击保存按钮");
}
function openSearchFpfsFromGt3(){
    mini.open({
        url : "../fplygl-bz/gt3_fpfsxx.html",
        title : "金三发票发售信息",
        width : 1380,
        height : 500,
        allowResize: false,       //允许尺寸调节
        allowDrag: false,         //允许拖拽位置
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: false,     //显示最大化按钮
        showModal: true,         //显示遮罩
        onload:function(){
            var iframe = this.getIFrameEl();
            iframe.contentWindow.setData(djxh,FpzlArray);
        },
        ondestroy: function (action) {  //弹出页面关闭前
            if (action == "ok") {       //如果点击“确定”
                var iframe = this.getIFrameEl();
                //获取选中、编辑的结果
                var data = iframe.contentWindow.getData();
                data = mini.clone(data);    //必须。克隆数据。
                mini.get("zzsfpfsGrid").setData(data);
            }
        }
    });
}