var editObject = {
    key: true, // 防止多次点击
    selectedRows: [],
    GridDatas: { data: [], total: 0 },
    onpagechanged: function (e) {
        editObject.pageIndex = e.pageIndex;
        editObject.pageSize = e.pageSize;
        editObject.fillData(editObject.pageIndex, editObject.pageSize, editObject.GridDatas, editObject.dataGrid);
    },
    onbeforeload: function (e) {
        e.cancel = true;
    },
    doReset: function () {
        editObject.searchForm.reset()
        editObject.dataGrid.setData([]);
    },
    getSxList: function () {
        $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/querySxList",
            // data: mini.encode(params),
            type: "get",
            success: function (res) {
                if (res.success) {
                    editObject.sxList = res.value || []
                }
            },
            error: function () {
            }
        });
    },
    getSfList: function (accountId) {
        // 获取身份id下拉
        $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/querySfList?accountId=" + accountId,
            type: "get",
            success: function (res) {
                if (res.success) {
                    editObject.sfList = res.value || []
                }
            },
            error: function () {
            }
        });
    },
    addAccount: function () {
        editObject.searchForm.validate();
        if (!editObject.searchForm.isValid()) {
            return false;
        }
        var formData = editObject.searchForm.getData(true);
        var dataSource = editObject.GridDatas.data
        var flag = true
        dataSource.length && $.each(dataSource, function (i, val) {
            if (!val.swrysfDm) {
                mini.alert('请选择第' + (i + 1) + '行的金三身份ID')
                flag = false
                return false
            }
            if (!val.serviceId) {
                mini.alert('请选择第' + (i + 1) + '行的支持机器人自动办理的事项')
                flag = false
                return false
            }
        })
        if (!flag) {
            return
        }
        // 根据选择serviceId处理成一条条数据
        var identityList = []
        $.each(dataSource, function (i, v) {
            if (v.serviceId) {
                var arr = v.serviceId.split(',')
                $.each(arr, function (index, ele) {
                    var item = mini.clone(v)
                    $.each(editObject.sxList, function (i, val) {
                        ele == val.serviceId && (item.serviceName = val.serviceName)
                    })
                    item.serviceId = ele
                    identityList.push(item)
                })
            }
        })

        var params = {
            accountId: formData.accountId,
            accountName: formData.accountName,
            accountPwd: formData.accountPwd,
            identityList
        };
        flag && $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/modifyAccount",
            data: mini.encode(params),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    closeWindow('ok')
                } else {
                    mini.alert(res.message || '新增失败！')
                }
            },
            error: function () {
            }
        });
    },
    cancle: function () {
        // 取消
        editObject.searchForm.reset()
        editObject.fillData(editObject.dataGrid.getPageIndex(), editObject.dataGrid.getPageSize(), { data: [], total: 0 }, editObject.dataGrid);
        closeWindow('cancel')
    },
    addRow: function () {
        // 新增
        editObject.GridDatas.data.unshift({ serviceId: '', rysfmc: '', swrysfDm: '' })
        editObject.GridDatas.total = editObject.GridDatas.total + 1
        editObject.fillData(editObject.dataGrid.getPageIndex(), editObject.dataGrid.getPageSize(), editObject.GridDatas, editObject.dataGrid);
    },
    deleteData: function () {
        editObject.selectedRows = editObject.dataGrid.getSelecteds()
        if (editObject.selectedRows.length < 1) {
            mini.alert('请选择需要删除的记录！')
            return
        }
        mini.confirm('确认删除选中的账户记录吗？', '提示', function (action) {
            if (action == 'ok') {
                editObject.dataGrid.removeRows(editObject.selectedRows)
                for (var index = editObject.selectedRows.length - 1; index >= 0; index--) {
                    editObject.GridDatas.data.splice(editObject.selectedRows[index]._index, 1)
                    editObject.GridDatas.total -= 1
                }
                editObject.fillData(editObject.dataGrid.getPageIndex(), editObject.dataGrid.getPageSize(), editObject.GridDatas, editObject.dataGrid, 'del');
            } else {
                editObject.dataGrid.deselectAll()
            }
        })
    },
    //假分页显示当前页数据
    fillData: function (pageIndex, pageSize, dataResult, grid, type) {
        var data = dataResult.data;
        var totalCount = data.length;
        var arr = [];
        var start = pageIndex * pageSize,
            end = start + pageSize;
        for (var i = start, l = end; i < l; i++) {
            var record = data[i];
            if (!record) continue;
            arr.push(record);
        }
        if (type == 'del' && arr.length < 1) {
            editObject.fillData(pageIndex - 1, pageSize, dataResult, grid)
            return
        }
        grid.setTotalCount(totalCount);
        grid.setPageIndex(pageIndex);
        grid.setPageSize(pageSize);
        grid.setData(arr);
    },
    cellendedit: function (sender) {
        // 单元格编辑结束 editObject.GridDatas赋值
        editObject.GridDatas.data[sender.rowIndex][sender.field] = sender.value
        if (sender.field == "swrysfDm") {
            var selectedSf = editObject.sfList.find(function (item) { return item.swrysfDm == sender.value })
            editObject.GridDatas.data[sender.rowIndex].rysfmc = selectedSf.rysfmc
            editObject.GridDatas.data[sender.rowIndex].sfswjgDm = selectedSf.sfswjgDm
            editObject.GridDatas.data[sender.rowIndex].swjgmc = selectedSf.swjgmc
        }
        editObject.fillData(editObject.dataGrid.getPageIndex(), editObject.dataGrid.getPageSize(), editObject.GridDatas, editObject.dataGrid);
    },
    queryAccountInfo: function (record) {
        // 获取初始化数据
        var params = $.extend({}, {
            pageIndex: (editObject.pageIndex || editObject.dataGrid.getPageIndex()) + 1,
            pageSize: editObject.pageSize || editObject.dataGrid.getPageSize()
        }, record);
        $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/queryAccountInfo?pageIndex=" + params.pageIndex + "&pageSize=" + params.pageSize + "&accountId=" + params.accountId,
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    editObject.GridDatas = {
                        data: res.value && res.value.identityList ? res.value.identityList || [] : [],
                        total: res.value && res.value.identityList ? res.value.identityList.length || 0 : 0
                    }
                    editObject.fillData(editObject.dataGrid.getPageIndex(), editObject.dataGrid.getPageSize(), editObject.GridDatas, editObject.dataGrid);
                } else {
                    mini.alert(res.message || '新增失败！')
                }
            },
            error: function () {
            }
        });
    },
    changePwd: function (e, name) {
        mini.get(name).setValue(e.value)
    }
}
function initData(record) {
    mini.parse()
    editObject.dataGrid = mini.get("editObject-grid");
    editObject.dataGrid.setData([])
    editObject.searchForm = new mini.Form("#searchForm");

    // 控制密码可见  不可见
    var pwdIpt = mini.get('accountPwd')
    var pwdShowIpt = mini.get('accountPwdshow')
    var imgs = $('#eyes');
    var flag = 0;
    imgs.on("click", '', function () {
        if (flag == 0) {
            pwdIpt.hide()
            pwdShowIpt.show()
            eyes.src = '../../images/eye2.png';
            flag = 1;
        } else {
            pwdIpt.show()
            pwdShowIpt.hide()
            eyes.src = '../../images/eye1.png';
            flag = 0;
        }
    })

    editObject.searchForm.setData(record)
    editObject.getSxList()
    editObject.getSfList(record.accountId)
    editObject.queryAccountInfo(record)
}

function closeWindow(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else {
        window.close();
    }
}

Array.prototype.find = function (conditionFunc) {
    for (var i = 0; i < this.length; i++) {
        // 每循环一次要执行一次条件函数, 如果有一次执行返回的是ture就执行下面的代码
        if (conditionFunc(this[i], i)) {
            // 如果为true，就返回this[i]，遍历完都没有就是undefined
            return this[i]
        }
    }
}