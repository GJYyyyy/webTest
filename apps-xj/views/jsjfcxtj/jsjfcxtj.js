$(function () {
    mini.parse();
    cxtj.init();
});

var cxtj = {
    issk: '',   //是否所科人员，0/1
    isfj: '',   //是否分局人员，0/1
    sjtotalUrl: 'sjtotal', //市局
    fjtotalUrl: 'fjtotal', //分局
    sktotalUrl: 'sktotal', //所科
    urlPath: '', //局所查询path
    swjgDm: '',
    init: function () {
        this.qymdGrid = mini.get("qymdGrid");
        this.qymdFrom = new mini.Form("#qymdFrom");

        this.tsdw = mini.get("zgswjg");
        this.tsrqQ = mini.get("tsrqQ");
        this.tsrqZ = mini.get("tsrqZ");

        this.issk = __ps.issws;
        this.isfj = __ps.isfj;
        this.swjgDm = this.getSession().swjgDm;

        this.checkUrl();
        this.tspcInit();
        this.doSearch();
    },
    checkUrl: function () {
        this.urlPath = this.sjtotalUrl;
        if (this.issk == '1') {
            this.urlPath = this.sktotalUrl;
        }
        if (this.isfj == '1') {
            this.urlPath = this.fjtotalUrl;
        }
    },
    tspcInit: function () {
        $.ajax({
            url : "../../../../api/sh/jsjf/query/tspc",
            data : "",
            type : "POST",
            data: mini.encode({
                "issws" : cxtj.issk
            }),
            success : function(obj) {
                var datas = mini.decode(obj);
                cxtj.tsdw.setData(datas);
            },
            error : function() {
            }
        });
    },
    swjgInit: function () {
        if (cxtj.issk != '1' && cxtj.isfj != '1') {
            cxtj.tsdw.setUrl('/dzgzpt-wsys/api/baseCode/get/getQj');
            cxtj.tsdw.setTextField('MC');
            cxtj.tsdw.setValueField('ID');
        }
        $.ajax({
            url : "../../../../api/baseCode/getUserSwjgAndAllXsSwjgWithCode",
            data : "",
            type : "POST",
            success : function(obj) {
                var datas = mini.decode(obj);
                cxtj.tsdw.loadList(datas, "jgDm", "PID");
                //判断是否税务所人员
                if (cxtj.issk == '1') {
                    cxtj.tsdw.setValue(cxtj.getSession().swjgDm);
                    cxtj.tsdw.setReadOnly(true);
                }
                /*swjgDm = datas[0].YXW;
                $swjgdm.setValue(swjgDm);*/
            },
            error : function() {
            }
        });
    },
    getSession: function () {
        $.ajax({
            type: "GET",
            url: "../../../../api/wtgl/dbsx/getSession",
            success: function (data) {
                //获取当前登录账号以及tableid
                var loginUsers = mini.decode(data);
                if (loginUsers.success) {
                     loginUser = mini.decode(loginUsers.value);
                } else {
                    mini.alert("获取税局管理员登录信息失败！");
                }
            },
            error: function (result) {
                mini.alert("获取税局管理员登录信息失败！");
            }
        });
        return loginUser;
    },
    doSearch: function () {
        cxtj.qymdFrom.validate();
        if (!cxtj.qymdFrom.isValid()) {
            return false;
        }
        var formData = cxtj.qymdFrom.getData(true);
        var param = mini.decode(formData);

        cxtj.qymdGrid.setUrl("../../../../api/sh/jsjf/query/" + cxtj.urlPath);
        cxtj.qymdGrid.load({
            tsrqQ:param.sqrqQ,
            tsrqZ:param.sqrqZ,
            tsswjg:cxtj.swjgDm,   //主管税务机关
            tspc:param.zgswjg,   //主管税务机关
        }, function (res) {
            // this.setData(res.data);
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });

    },
    doReset: function () {
        mini.get("sqrqQ").setValue("");
        mini.get("sqrqZ").setValue("");
        cxtj.qymdGrid.setData('');
        cxtj.tsdw.setValue('');

    },
    openTip: function (record) {
        mini.open({
            url: "./tjgl.html",        //页面地址
            title: '减税降费推送户次统计管理',      //标题
            iconCls: '',    //标题图标
            width: "98%",      //宽度
            height: "98%",     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: true,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: true,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow:false,      //是否在本地弹出页面,默认false
            effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(record.swjgdm, cxtj.issk, mini.get('zgswjg').getValue());
            },
            ondestroy: function (action) {  //弹出页面关闭前
                // clcl.queryYjlx();
            }
        });
    },
    onActionRendererYq: function (e) {
        var record = e.record;
        var value = e.value || '';
        return '<a class="Delete_Button" onclick="cxtj.openTip(record)" href ="#">' +value+ '</a>';
        console.log(e);
    }
};

function onActionRendererYq (e){
    var record = e.record;
    return '<a class="Delete_Button" onclick="zfjlqc.openTip(record)" href ="#">查看</a>';
    // return '<a class="Delete_Button" onclick="kqqybtgjlqc.openQ(record)" href ="#">查看详情</a>';
}

//form展示隐藏
$(document).ready(function() {
    $(".search").click(function() {
        showsearch();
    });
});
function showsearch() {
    if ($(".searchdiv").is(":hidden")) {
        $(".searchdiv").slideDown();
        $('.searchC').html('隐藏查询条件');
    } else {
        $(".searchdiv").slideUp();
        $('.searchC').html('显示查询条件');
    }
}
