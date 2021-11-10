$(function () {
    gldUtil.addWaterInPages();
    mini.parse();
    zsqkcxtj.init();
});

var zstzscxApi = {
    // 查询待终审事项列表
    queryZssx: '/dzgzpt-wsys/api/sh/zfzstzs/query/zssx',
    // 查询税务事项
    getSwsx: "/dzgzpt-wsys/api/sh/zfzstzs/get/swsx",
}

var zsqkcxtj = {
    cxGrid: null,
    cxtjForm: null,
    sdrqQ: null,
    sdrqZ: null,
    param: null,
    init: function () {
        this.cxGrid = mini.get("cxGrid");
        this.cxtjForm = new mini.Form("#cxtjForm");

        //~起默认当前日期前推1个月，最大当天、~止最大当天，最小大于起
        this.sdrqQ = mini.get("sdrqQ");
        this.sdrqZ = mini.get("sdrqZ");
        this.changeOther('init');
        this.slzt = mini.get("slzt")
        this.getSwsx()
    },
    getSwsx: function () {
        $.ajax({
            url: zstzscxApi.getSwsx,
            type: "GET",
            success: function (res) {
                mini.get('swsxdm').load(res.value)
            },
            error: function (err) {
                mini.alert('网络异常，请稍后再试！')
            }
        })

    },
    changeOther: function (option) {
        if (option === 'reset') {
            // 置空不可输入
            this.sdrqQ.setValue('');
            this.sdrqQ.setReadOnly(true);
            this.sdrqZ.setValue('');
            this.sdrqZ.setReadOnly(true);
        } else {
            // ~起默认当前日期前推1个月，最大当天、~止最大当天，最小大于起
            var now = new Date(), delay = new Date();
            delay.setMonth(delay.getMonth() - 1);
            this.sdrqQ.setValue(mini.formatDate(delay, 'yyyy-MM-dd'));
            // this.sdrqQ.setMaxDate(now);
            this.sdrqZ.setValue(mini.formatDate(now, 'yyyy-MM-dd'));
            // this.sdrqZ.setMinDate(delay);
            // this.sdrqZ.setMaxDate(now);
        }
    },
    doSearch: function () {
        // if(!this.cxtjForm.isValid()){
        //     return false;
        // }
        if (this.sdrqQ.value > this.sdrqZ.value) {
            mini.alert("收到日期起大于收到日期止，请重新选择！", "提示");
        }
        var formData = this.cxtjForm.getData(true);

        this.cxGrid.setUrl(zstzscxApi.queryZssx);
        this.cxGrid.load(formData, function (data) {
            if (data.total == '0') {
                mini.alert("暂无数据！")
                return
            }
            zsqkcxtj.showsearch();
        });
    },
    doReset: function () {
        this.cxtjForm.reset();
        this.cxGrid.setData('');
        this.changeOther('init');
    },
    showsearch: function () {
        if ($(".searchdiv").is(":hidden")) {
            $(".searchdiv").slideDown();
        } else {
            $(".searchdiv").slideUp();
        }
    },
    openTzs: function (record, tag) {
        mini.open({
            url: './zstzs.html',        //页面地址
            // title: '通知',      //标题
            width: "70%",      //宽度
            height: 600,     //高度
            allowResize: false,       //允许尺寸调节
            allowDrag: false,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.init(record, tag);
            },
            ondestroy: function (action) {  //弹出页面关闭前
                if (action == 'ok') {
                    zsqkcxtj.cxGrid.reload()
                }
            }
        });
    }
};

function onActionRenderer(e) {
    var record = e.record
    if (record.blztDm == "01") {
        return `
        <a onclick="zsqkcxtj.openTzs(record,'Y')" href ="#" style="margin-right:10px;">终审同意</a>
        <a onclick="zsqkcxtj.openTzs(record,'N')" href ="#">终审不同意</a>
        `;
    } else {
        return `<span></span>`
    }
}