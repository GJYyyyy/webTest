$(function () {
    mini.parse();
    cxtj.init();
});

var cxtj = {
    key: true, // 防止多次点击
    selectedRows: [],
    init: function () {
        this.dataGrid = mini.get("cxtj-grid");
        this.searchForm = new mini.Form("#searchForm");
    },
    onpagechanged: function (e) {
        cxtj.pageIndex = e.pageIndex;
        cxtj.pageSize = e.pageSize;
        cxtj.doSearch();
    },
    hasKey: function () {
        cxtj.key = false;
        setTimeout(function () {
            cxtj.key = true;
        }, 1000);
    },
    onbeforeload: function (e) {
        e.cancel = true;
    },
    doSearch: function () {
        if (!cxtj.key) return;
        cxtj.hasKey();
        var formData = cxtj.searchForm.getData(true);
        var params = $.extend({}, {
            pageIndex: (cxtj.pageIndex || cxtj.dataGrid.getPageIndex()) + 1,
            pageSize: cxtj.pageSize || cxtj.dataGrid.getPageSize()
        }, formData);
        $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/queryAccount?pageIndex=" + params.pageIndex + "&pageSize=" + params.pageSize + "&accountId=" + params.accountId + "&accountName=" + params.accountName,
            // data: mini.encode(params),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    cxtj.dataGrid.setData(res.value ? res.value.data : []);
                    cxtj.dataGrid.setTotalCount(res.value ? res.value.total : 0);
                    cxtj.dataGrid.setPageIndex(cxtj.dataGrid.pageIndex);
                } else {
                    mini.alert(res.message || '查询失败！')
                }
            },
            error: function () {
            }
        });
    },
    doReset: function () {
        cxtj.searchForm.reset()
        cxtj.dataGrid.setData([]);
    },
    deleteData: function () {
        cxtj.selectedRows = cxtj.dataGrid.getSelecteds()
        if (cxtj.selectedRows.length < 1) {
            mini.alert('至少选择一条数据')
            return
        }
        mini.confirm('确认删除选中的账户记录吗？', '提示', function (action) {
            if (action == 'ok') {
                var String = ''
                $.each(cxtj.selectedRows, function (i, v) {
                    String += v.accountId + ','
                })
                if (String.indexOf(',') != -1) {
                    String = String.substr(0, String.length - 1);
                }
                $.ajax({
                    url: "/dzgzpt-wsys/api/robot/account/deleteAccount?accountId=" + String,
                    // data: mini.encode({ accountId: record.accountId || '' }),
                    type: "post",
                    contentType: "application/json; charset=utf-8",
                    success: function (res) {
                        if (res.success) {
                            cxtj.doSearch()
                        } else {
                            mini.alert(res.message || '查询失败！')
                        }
                    },
                    error: function () {
                    }
                });
            } else {
                cxtj.dataGrid.deselectAll()
            }
        })
    },
    openAddPage: function () {
        // 新增
        mini.open({
            url: './pzjqrzhadd.html',        //页面地址
            title: '新增账户信息',      //标题
            iconCls: '',    //标题图标
            width: '100%',      //宽度
            height: "600",     //高度
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
                iframe.contentWindow.initData();
            },
            ondestroy: function (action) {  //弹出页面关闭前
                if (action == 'ok') {
                    cxtj.doSearch()
                }
            }
        });
    },
    openEditPage: function (record) {
        mini.open({
            url: './pzjqrzhedit.html',        //页面地址
            title: '修改账户信息',      //标题
            iconCls: '',    //标题图标
            width: '100%',      //宽度
            height: "600",     //高度
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
                iframe.contentWindow.initData(record);
            },
            ondestroy: function (action) {  //弹出页面关闭前
                if (action == 'ok') {
                    cxtj.doSearch()
                }
            }
        });
    }

}

function onActionRender() {
    return '<a class="mini-button toolBtn-blue editBtn" onclick="cxtj.openEditPage(record)">修改</a>'
}