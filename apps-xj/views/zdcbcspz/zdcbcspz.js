$(function () {
    mini.parse();
    pzObj.init();
});

pzObj = {
    init: function () {
        this.dataGrid = mini.get("cxGrid");
        this.historyWin = mini.get("history-win");
        this.historyGrid = mini.get("historyGrid");

        this.getCbpz()
    },
    getCbpz: function () {
        // 查询自动催报参数配置
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jqr/cspz',
            type: 'get',
            success: function (res) {
                if (res.success) {
                    pzObj.dataGrid.setData(res.value || [])
                } else {
                    mini.alert(res.message || "系统异常，请稍后再试~", "提示");
                }
            }
        })
    },
    editRow: function (row_uid) {
        var row = this.dataGrid.getRowByUID(row_uid);
        if (row) {
            this.dataGrid.cancelEdit();
            this.dataGrid.beginEditRow(row);
        }
    },
    cancelRow: function (row_uid) {
        this.getCbpz()
    },
    updateRow: function (row_uid) {
        this.dataGrid.commitEdit();
        var row = this.dataGrid.getRowByUID(row_uid);
        this.dataGrid.loading("保存中，请稍后......");
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jqr/update/pz',
            type: 'post',
            data: mini.encode(row),
            contentType: "application/json",
            success: function (res) {
                pzObj.dataGrid.unmask()
                pzObj.getCbpz()
                if (!res.success) {
                    mini.alert(res.message || "修改失败，请稍后再试~", "提示");
                }

            },
            error: function (error) {
                pzObj.dataGrid.unmask()
                pzObj.getCbpz()
            }
        })
    },
    showHistory: function (record) {
        // 查询参数配置历史记录
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/jqr/lspz/' + record.swjgdm,
            type: 'get',
            success: function (res) {
                if (res.success) {
                    pzObj.historyGrid.setData(res.value || [])
                    pzObj.historyWin.show()
                } else {
                    mini.alert(res.message || "系统异常，请稍后再试~", "提示");
                }
            }
        })
    }
}

function onActionRenderer(e) {
    var record = e.record
    var str = ""

    if (record.zxbz == 'Y') {
        str = "<a href='javascript:;' onclick='pzObj.showHistory(record)'>查看历史记录</a>"
    } else {
        str = "<a href='javascript:;' style='margin-right:10px;' onclick='pzObj.showHistory(record)'>查看历史记录</a>" + "<a href='javascript:;' onclick='pzObj.editRow(record._uid)'>修改</a>"
    }


    if (pzObj.dataGrid.isEditingRow(record)) {
        str = "<a href='javascript:;' style='margin-right:10px;' onclick='pzObj.updateRow(record._uid)'>确认</a>" + "<a href='javascript:;' onclick='pzObj.cancelRow(record._uid)'>放弃</a>"
    }
    return str
}