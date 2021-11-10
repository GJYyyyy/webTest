function setData(formData, qx, swjgdm) {
    mini.parse();
    nextTable.formData = formData
    nextTable.qx = qx
    nextTable.swjgdm = swjgdm
    nextTable.init();
}

var cxlcxApi = {
    // A\B级页面查询接口
    searchAB: '/dzgzpt-wsys/api/dntj/pzhd/tjlshz',
    // C级页面查询接口
    searchC: '/dzgzpt-wsys/api/dntj/pzhd/tjls',
}

var nextTable = {
    formData: '',
    init: function () {
        this.grid = mini.get("cxtjGrid");
        var obj = '', data
        if (this.qx == 'A') {
            this.grid.setUrl(cxlcxApi.searchAB);
            obj = { sjswjgdm: this.swjgdm }
        } else {
            this.grid.setUrl(cxlcxApi.searchC);
            obj = { zgswjgDm: this.swjgdm }
        }
        data = $.extend({}, this.formData, obj)
        this.grid.load(data, function (res) {
            if (res.result.value.total == 0) {
                mini.alert("无数据");
                return
            }
            this.setData(res.result.value.data);
            this.setTotalCount(res.result.value.total);
        }, function (res) {
            mini.alert(mini.decode(res.errorMsg).message, "", function () {
                window.CloseOwnerWindow && window.CloseOwnerWindow();
            });
        });

        this.grid.on('load', function (res) {
            var data = res.result;
            var gridSource = res.source;
            if (data.success) {
                var returnData = data.value;
                this.setData(returnData.data);
                this.setTotalCount(returnData.total);
                this.setPageIndex(gridSource.pageIndex);
            } else if (data.message) {
                mini.alert((data.message), '提示信息', function () { });
            }
        })
    },
    onActionRenderer: function (e) {
        var record = e.record;
        var swjgjc = record.swjgjc
        var swjgdm = record.swjgdm
        return '<a onclick="nextTable.showSwsxSqxx(\'' + swjgdm + '\')" href="#">' + swjgjc + '</a>';

    },
    showSwsxSqxx: function (swjgdm) {
        mini.open({
            url: './thirdGrid.html',        //页面地址
            title: '查询详情',      //标题
            iconCls: '',    //标题图标
            width: '100%',      //宽度
            height: 400,     //高度
            allowResize: true,       //允许尺寸调节
            allowDrag: false,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: false,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            effect: 'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                //调用弹出页面方法进行初始化
                iframe.contentWindow.setData(nextTable.formData, "C", swjgdm);
            },
            ondestroy: function (action) {  //弹出页面关闭前
            }
        });
    },
}


