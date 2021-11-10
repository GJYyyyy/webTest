var addObject = {
    key: true, // 防止多次点击
    selectedRows: [],
    GridDatas: { data: [], total: 0 },
    onpagechanged: function (e) {
        addObject.pageIndex = e.pageIndex;
        addObject.pageSize = e.pageSize;
        addObject.fillData(addObject.pageIndex, addObject.pageSize, addObject.GridDatas, addObject.dataGrid);
    },
    hasKey: function () {
        addObject.key = false;
        setTimeout(function () {
            addObject.key = true;
        }, 1000);
    },
    onbeforeload: function (e) {
        e.cancel = true;
    },
    doReset: function () {
        addObject.searchForm.reset()
        addObject.dataGrid.setData([]);
    },
    getSxList: function () {
        // 事项下拉
        $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/querySxList",
            // data: mini.encode(params),
            type: "get",
            success: function (res) {
                if (res.success) {
                    addObject.sxList = res.value || []
                }
            },
            error: function () {
            }
        });
    },
    getSfList: function () {
        // 获取身份id下拉
        var accountId = mini.get('accountId').getValue()
        accountId && $.ajax({
            url: "/dzgzpt-wsys/api/robot/account/querySfList?accountId=" + accountId,
            type: "get",
            success: function (res) {
                if (res.success) {
                    addObject.sfList = res.value || []
                }
            },
            error: function () {
            }
        });
    },
    addAccount: function () {
        // 确认 保存
        addObject.searchForm.validate();
        if (!addObject.searchForm.isValid()) {
            return false;
        }
        var formData = addObject.searchForm.getData(true);
        var dataSource = addObject.GridDatas.data
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
                    $.each(addObject.sxList, function (i, val) {
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
            url: "/dzgzpt-wsys/api/robot/account/addAccount",
            data: mini.encode(params),
            type: "post",
            contentType: "application/json; charset=utf-8",
            success: function (res) {
                if (res.success) {
                    closeWindow('ok')
                } else {
                    mini.alert(res.message || '修改失败！')
                }
            },
            error: function () {
            }
        });
    },
    cancle: function () {
        // 取消
        addObject.searchForm.reset()
        addObject.fillData(addObject.dataGrid.getPageIndex(), addObject.dataGrid.getPageSize(), { data: [], total: 0 }, addObject.dataGrid);
        closeWindow('cancel')
    },
    addRow: function () {
        // 新增
        addObject.GridDatas.data.unshift({ serviceId: '', rysfmc: '', swrysfDm: '' })
        addObject.GridDatas.total = addObject.GridDatas.total + 1
        addObject.fillData(addObject.dataGrid.getPageIndex(), addObject.dataGrid.getPageSize(), addObject.GridDatas, addObject.dataGrid);
    },
    deleteData: function () {
        addObject.selectedRows = addObject.dataGrid.getSelecteds()
        if (addObject.selectedRows.length < 1) {
            mini.alert('请选择需要删除的记录！')
            return
        }
        mini.confirm('确认删除选中的账户记录吗？', '提示', function (action) {
            if (action == 'ok') {
                addObject.dataGrid.removeRows(addObject.selectedRows)
                for (var index = addObject.selectedRows.length - 1; index >= 0; index--) {
                    addObject.GridDatas.data.splice(addObject.selectedRows[index]._index, 1)
                    addObject.GridDatas.total = addObject.GridDatas.total - 1
                }
                addObject.fillData(addObject.dataGrid.getPageIndex(), addObject.dataGrid.getPageSize(), addObject.GridDatas, addObject.dataGrid, 'del');
            } else {
                addObject.dataGrid.deselectAll()
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
            addObject.fillData(pageIndex - 1, pageSize, dataResult, grid)
            return
        }
        grid.setTotalCount(totalCount);
        grid.setPageIndex(pageIndex);
        grid.setPageSize(pageSize);
        grid.setData(arr);
    },
    cellendedit: function (sender) {
        // 单元格编辑结束 addObject.GridDatas赋值
        addObject.GridDatas.data[sender.rowIndex][sender.field] = sender.value
        if (sender.field == "swrysfDm") {
            var selectedSf = addObject.sfList.find(function (item) { return item.swrysfDm == sender.value })
            addObject.GridDatas.data[sender.rowIndex].rysfmc = selectedSf.rysfmc
            addObject.GridDatas.data[sender.rowIndex].sfswjgDm = selectedSf.sfswjgDm
            addObject.GridDatas.data[sender.rowIndex].swjgmc = selectedSf.swjgmc
        }
        addObject.fillData(addObject.dataGrid.getPageIndex(), addObject.dataGrid.getPageSize(), addObject.GridDatas, addObject.dataGrid);
    },
    changePwd: function (e, name) {
        mini.get(name).setValue(e.value)
    }
}
function initData() {
    mini.parse()
    addObject.dataGrid = mini.get("addObject-grid");
    addObject.dataGrid.setData([])
    addObject.searchForm = new mini.Form("#searchForm");

    // 控制密码显示隐藏
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



    addObject.getSxList()
}

function closeWindow(action) {
    // 关闭弹框
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else {
        window.close();
    }
}

function beforeshowpopup(e) {
    mini.get(e.sender.id).setData(addObject.sfList)
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