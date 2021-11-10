var sbtcsjql = {
    selectMaps: [],
    GridDatas: [],
    initPage: function () {
        this.fpfsWin = mini.get("fpfs-win")
        sbtcsjql.fpfsWin.show()
        $("#hssj").html(new Date().format('yyyy年MM月'))
        sbtcsjql.detailWin = mini.get("detail-win");

        this.ssglyDm = mini.get("ssglyDm");
        this.srarchGlyRowForm = new mini.Form("srarchGlyRow-form");
        this.sbtcsjqlGrid = mini.get('sbtcsjql_grid');
        this.checkSwryWin = mini.get("sbtcsjqlChangeGly-win");
        this.ssglyChange();

    },
    djrqChange: function () {
        var date = new Date();
        this.djrqDom.setValue(mini.formatDate(date, "yyyy-MM"));
    },
    //税源管理员下拉框添加其他选项。
    ssglyChange: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySyglyBySwjgDm',
            type: 'GET',
            async: false,
            success: function (data) {
                if (data) {
                    for (var i = 0; i < data.length; i++) {
                        data[i].swryxm = data[i].swryxm + "(" + data[i].swryDm + ")";
                    }
                    data.push({
                        "swryDm": "99",
                        "swryxm": "其他"
                    });
                    sbtcsjql.ssglyDm.setData(data);
                } else {
                    mini.alert('税源管理员数据请求异常');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    //nsrsbh过滤判定
    nsrsbhValidate: function (e) {
        if (e.value == false) return;
        if (e.isValid) {
            if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
                e.errorText = "社会信用代码必须为15到20位的字母或数字！";
                e.isValid = false;
                return;
            }
        }
    },
    //监听分页前事件，阻止后自行设置当前数据和分页信息
    dataBeforeload: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex;
        var pageSize = e.data.pageSize;
        sbtcsjql.fillData(pageIndex, pageSize, sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        var rows = sbtcsjql.GridDatas.data.slice(pageIndex * pageSize, pageSize * (pageIndex + 1))
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                if (rows[i].selected == '1') {
                    sbtcsjql.sbtcsjqlGrid.setSelected(rows[i]);
                }
            }
        } else {
            // sbtcsjql.setChose();
        }
    },
    //分页处理
    fillData: function (pageIndex, pageSize, dataResult, grid) {
        var data = dataResult.data;
        var totalCount = dataResult.data.length;
        var arr = [];
        var start = pageIndex * pageSize,
            end = start + pageSize;
        for (var i = start, l = end; i < l; i++) {
            var record = data[i];
            if (!record) continue;
            arr.push(record);
        }
        grid.setTotalCount(totalCount);
        grid.setPageIndex(pageIndex);
        grid.setPageSize(pageSize);
        $.each(arr, function (i, v) {
            if (v.bdjg == 'Y') {
                v.bdjgText = '比对一致'
            } else if (v.bdjg == 'N') {
                v.bdjgText = '比对不一致'
            } else {
                v.bdjgText = ''
            }
        })
        grid.setData(arr);
        $.each(arr, function (i, v) {
            if (v.bdjg == 'N') {
                grid.addRowCls(grid.getRow(i), 'yellowBg');
            }
        })
    },
    //分页表单条目选中状态处理
    onSelectoinChanged: function (e) {
        if (e.selected == null && e.selecteds.length === 0) {
            sbtcsjql.selectMaps[sbtcsjql.sbtcsjqlGrid.getPageIndex()] = [];
        }

        var rows = sbtcsjql.sbtcsjqlGrid.getSelecteds();
        for (var t = 0; t < rows.length; t++) {
            rows[t].selected = 1;
        }
        sbtcsjql.selectMaps[sbtcsjql.sbtcsjqlGrid.getPageIndex()] = rows;
    },
    //批量分配
    plfp: function () {
        var rows = sbtcsjql.GridDatas.data;
        var selectrows = 0;
        for (var d = 0; d < rows.length; d++) {
            if (rows[d].selected) {
                selectrows++;
            }
        }
        if (selectrows < 2) {
            mini.alert("选择的纳税人信息必须大于等于2条！");
            return;
        }
        //批量判断是否有选中条目初审过
        var lcslidArrs = [];
        for (var i = 0; i < rows.length; i++) {
            if (rows[i].selected) {
                lcslidArrs.push(rows[i].lcslid);
            }
        }
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySlswry',
            type: 'POST',
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(lcslidArrs),
            success: function (data) {
                var result = mini.decode(data);
                if (result[0] && result[0].isExists == "Y") {
                    mini.alert(result.message || '存在纳税人已经进行初审，不再支持分配。');
                } else {
                    sbtcsjql.plfp = true;
                    sbtcsjql.checkSwryWin.show();
                    mini.get("slswry").setData(result);
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    //  分配方式选择取消
    checkFpfsCancel: function () {
        mini.alert("请选择分配方式")
    },
    checkFpfsOk: function () {
        var fpfsData = mini.get("fpfsRadio").getValue()
        if (!fpfsData) {
            mini.alert("请选择分配方式")
            return
        }
        sbtcsjql.queryGrid()
    },
    //分配税务人员取消
    checkSwryCancel: function () {
        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.checkSwryWin.hide();
    },
    // 详情弹框关闭
    detailWinCancel: function () {
        sbtcsjql.detailWin.hide()
    },
    //分配税务人员确定
    checkSwryOk: function () {
        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.validate();
        if (sbtcsjql.checkSwryForm.isValid() === false) return false;
        var formdata = sbtcsjql.checkSwryForm.getDataAndText(true);
        var sbtcsjqlGridData = sbtcsjql.sbtcsjqlGrid.getData();
        var pageIndex = sbtcsjql.sbtcsjqlGrid.getPageIndex();
        var pageSize = sbtcsjql.sbtcsjqlGrid.getPageSize();

        if (!sbtcsjql.plfp) {
            var rowIndex = sbtcsjql.rowIndex;
            sbtcsjqlGridData[rowIndex].slswryDm = formdata.slswry;
            sbtcsjqlGridData[rowIndex].slswrymc = formdata.slswryText;
            sbtcsjql.GridDatas.data[rowIndex + pageIndex * pageSize] = sbtcsjqlGridData[rowIndex];
        } else {
            for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                if (sbtcsjql.GridDatas.data[j].selected) {
                    sbtcsjql.GridDatas.data[j].slswryDm = formdata.slswry;
                    sbtcsjql.GridDatas.data[j].slswrymc = formdata.slswryText;
                    sbtcsjql.GridDatas.data[j].selected = 0;
                }
            }
        }
        sbtcsjql.fillData(sbtcsjql.sbtcsjqlGrid.getPageIndex(), sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        sbtcsjql.checkSwryWin.hide();
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.sbtcsjqlGrid.deselectAll()
    },
    //djrq监听
    djrqChanged: function () {
        var rqq = sbtcsjql.djrqDom.getText();
    },
    //违法手段弹框
    openWfssShow: function (rowIndex) {
        var sbtcsjqlGridData = sbtcsjql.sbtcsjqlGrid.getData();
        if (sbtcsjqlGridData[rowIndex].wfss) {
            var wfssStr = sbtcsjqlGridData[rowIndex].wfss;
            wfssStr = wfssStr.replace(/(\r\n)|(\n)/g, '；</br>');
            mini.alert(wfssStr);
        }
    },
    //分配税务人员弹框
    openSwryCheck: function (record) {
        var rowIndex = record.rowIndexC;
        //判断是否初审过，若已初审过，aleart:该纳税人已经进行初审，不再支持分配。
        var lcslidArr = [];
        lcslidArr.push(record.lcslid);
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySlswry',
            type: 'POST',
            async: false,
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(lcslidArr),
            success: function (data) {
                var result = mini.decode(data);
                if (result.isExists) {
                    mini.alert(result.message || '该纳税人已经进行初审，不再支持分配。');
                } else {
                    sbtcsjql.checkSwryWin.show();
                    mini.get("slswry").setData(result);
                    sbtcsjql.rowIndex = rowIndex;
                    sbtcsjql.plfp = false;
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });

    },
    //查询表单
    queryGrid: function () {
        sbtcsjql.srarchGlyRowForm.validate();
        if (!sbtcsjql.srarchGlyRowForm.isValid()) {
            return false;
        }

        var formData = sbtcsjql.srarchGlyRowForm.getData(true);
        var param = mini.decode(formData);
        var searchData = {
            // "sswfsxDm": param.sswfsdDm ? param.sswfsdDm : "",
            "ssglyDm": param.ssglyDm === '99' ? '' : param.ssglyDm,
            "nsrsbh": param.nsrsbh ? param.nsrsbh : "",
            // "djrq": param.djrq ? param.djrq : "",
            "processInstanceId": getQueryString("processInstanceId"),
            "taskId": getQueryString("taskId"),
            "fp": mini.get("fpfsRadio").getValue(),
            "bdjg": mini.get("bdjg").getValue()
        };
        //选择其他时，添加参数。
        if (param.ssglyDm === '99') {
            searchData.qt_ssglyDm = "null";
        }

        // 查询
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySjqlDfp',
            type: 'POST',
            data: JSON.stringify(searchData),
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            async: false,
            success: function (data) {
                var data = mini.decode(data);
                if (data && data.data && data.data.length >= 0) {
                    sbtcsjql.fpfsWin.hide()
                    //保存列表数据
                    sbtcsjql.GridDatas = data;

                    //分配代码判定
                    for (var i = 0; i < sbtcsjql.GridDatas.data.length; i++) {
                        if (!sbtcsjql.GridDatas.data[i].spztDm) {
                            sbtcsjql.GridDatas.data[i].spztDm = "00";
                        }
                    }
                    //添加编号
                    for (var i = 0; i < sbtcsjql.GridDatas.data.length; i++) {
                        sbtcsjql.GridDatas.data[i]["_number"] = i;
                        sbtcsjql.GridDatas.data[i].selected = 0;
                    }
                    sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);

                } else {
                    mini.alert(data.message || '接口异常，请稍后重试');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
                sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
            }
        });
    },
    //重置
    doReset: function () {
        sbtcsjql.srarchGlyRowForm.reset();
        sbtcsjql.sbtcsjqlGrid.setData("");
        // sbtcsjql.djrqChange();
        sbtcsjql.ssglyChange();
    },
    // 导出
    doExport: function () {
        if (!sbtcsjql.sbtcsjqlGrid.getData() || (sbtcsjql.sbtcsjqlGrid.getData() && sbtcsjql.sbtcsjqlGrid.getData().length < 1)) {
            mini.alert("暂无数据，无需导出！")
            return
        }
        var formData = sbtcsjql.srarchGlyRowForm.getData(true);
        var param = mini.decode(formData);
        var searchData = {
            "ssglyDm": param.ssglyDm === '99' ? '' : param.ssglyDm,
            "nsrsbh": param.nsrsbh ? param.nsrsbh : "",
            "processInstanceId": getQueryString("processInstanceId"),
            "taskId": getQueryString("taskId"),
            "fp": mini.get("fpfsRadio").getValue()
        };
        var exportUrl = '/dzgzpt-wsys/api/sh/sbtc/export/sjqldfp?ssglyDm=' + searchData.ssglyDm + '&nsrsbh=' + searchData.nsrsbh + '&processInstanceId=' + searchData.processInstanceId + '&taskId=' + searchData.taskId + '&fp=' + searchData.fp
        //选择其他时，添加参数。
        if (param.ssglyDm === '99') {
            exportUrl += '&qt_ssglyDm=null'
        }
        window.open(exportUrl);
    },
    //暂存
    doSave: function () {
        if (!sbtcsjql.GridDatas) return;
        saveData();
    },
    doPush: function () {
        if (!sbtcsjql.GridDatas) return;
        getSplitByForm();
    },
    checkClock: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/isKqFp',
            type: 'GET',
            async: false,
            success: function (data) {
                if (data.success) {
                    if (data.value == "N") {
                        sbtcsjql.clock = true;
                        if (sbtcsjql.clock) {
                            mini.mask({ "message": "您所在的税务机关尚未开启批量分配纳税人功能，本功能暂无法使用。" });
                        }
                    }
                } else {
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    //查看详情
    xqShow: function (record) {
        mini.get("detail_grid").setData(record.szxx || [])
        sbtcsjql.detailWin.show()
    },
    checkAll: function () {
        // 实现全选所有页面数据
        var checkedDataLength = 0
        var alldata = sbtcsjql.GridDatas.data;
        for (var i = 0; i < alldata.length; i++) {
            if (alldata[i].selected == 1) {
                checkedDataLength += 1
            }
        }
        if (checkedDataLength == alldata.length) {
            for (var v = 0; v < alldata.length; v++) {
                alldata[v].selected = 0;
            }
            sbtcsjql.sbtcsjqlGrid.deselectAll()
        } else {
            for (var v = 0; v < alldata.length; v++) {
                alldata[v].selected = 1;
            }
            sbtcsjql.sbtcsjqlGrid.selectAll()
        }
    }
};
function shxydmRenderer(e) {
    var record = e.record
    return record.shxydm ? record.shxydm : record.nsrsbh
}
function xqRenderer(e) {
    var record = e.record
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.xqShow(record)"' + '>查看</a>'
}
function ssglyRenderer(e) {
    var record = e.record;
    slswryText = record.ssglyDm ? record.ssglymc + "(" + record.ssglyDm + ")" : '';
    return '<span class=" wh100 inlineblock lineH36">' + slswryText + '</span>';
}

function slswryRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var other = sbtcsjql.ssglyDm.value;

    //已分配未初审
    if (other !== "99" && !record.ssglyDm && !record.slswryDm) {
        slswryText = "分配";
    } else {
        slswryText = record.slswryDm ? record.slswrymc + "(" + record.slswryDm + ")" : "分配";
        //税源管理员是其他时展示规则
        if (other === "99") {
            slswryText = record.slswryDm ? record.slswrymc + "(" + record.slswryDm + ")" : "分配";
        }
    }

    record.rowIndexC = e.rowIndex;
    if (record.fp == '1') {
        return slswryText;
    } else {
        return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.openSwryCheck(record)">' + slswryText + '</a>';
    }
}

function wfssRenderer(e) {
    var recordWfss = e.record;
    var wfss = recordWfss.wfss;
    var rowIndex = e.rowIndex;
    return wfss ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.openWfssShow(' + '\'' + rowIndex + '\'' + ')"' + '>详情</a>' : '';
}

//推送成功后执行清空查询数据操作
function sendResult() {
    // sbtcsjql.srarchGlyRowForm.reset();
    // sbtcsjql.djrqChange();
    // mini.get('sbtcsjql_grid').setData([]);
    // sbtcsjql.fillData(mini.get('sbtcsjql_grid').getPageIndex(), mini.get('sbtcsjql_grid').getPageSize(), {
    //     data: [],
    //     total: 0
    // }, sbtcsjql.sbtcsjqlGrid);
    sbtcsjql.doReset();
}

var message = new MyMessage.message({
    /*默认参数，下面为默认项*/
    iconFontSize: "20px", //图标大小,默认为20px
    messageFontSize: "12px", //信息字体大小,默认为12px
    showTime: 3000, //消失时间,默认为3000
    align: "center", //显示的位置类型center,right,left
    positions: { //放置信息距离周边的距离,默认为10px
        top: "10px",
        bottom: "10px",
        right: "10px",
        left: "10px"
    },
    message: "这是一条消息", //消息内容,默认为"这是一条消息"
    type: "normal", //消息的类型，还有success,error,warning等，默认为normal
});
//暂存
function saveData(isSend) {
    var saveData = sbtcsjql.GridDatas.data;
    if (!saveData) return;
    if (saveData.length == 0) {
        mini.alert('没有分配');
        return;
    }
    var saveSuccess = false;
    for (var t = 0; t < saveData.length; t++) {
        if (isSend && (!saveData[t].slswrymc && !saveData[t].slswryDm)) {
            mini.alert('存在未分配的数据，不能推送');
            return saveSuccess
        }
        saveData[t].sfzc = 'Y';
        saveData[t].sjSpztDm = "00";
        saveData[t].spztDm = "00";
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/saveZcfp',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        dataType: 'json',
        data: JSON.stringify(saveData),
        success: function (data, textStatus) {
            if (data.success) {
                !isSend && message.add("保存成功，请记得及时推送。", "success");
                saveSuccess = true;
            } else {
                message.add(data.message || '保存失败，请稍后重试', "warning");
            }
        },
        error: function (error) {
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
    return saveSuccess;
}

//推送
function getSplitByForm() {
    //判断是否所有数据都已经初审
    var saveData = sbtcsjql.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};
    for (var t = 0; t < saveData.length; t++) {
        // if (!saveData[t].slswrymc) {
        //     mini.alert('存在未分配的数据，不能推送');
        //     allSh = false;
        //     break;
        // }
        saveData[t].sfzc = 'N';
        saveData[t].sjSpztDm = "00";
        saveData[t].spztDm = "10";
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    //判断是否可以推送，待解决问题：记录并维持选择不同税务人查询后并分配后的数据，最后推送该数据。 初审也许要这样修改。
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/sfTs',
        type: 'POST',
        async: false,
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: {
            sjSpztDm: '00',
            processInstanceId: getQueryString("processInstanceId")
        },
        success: function (data) {
            if (data.value !== "Y") {
                mini.alert('存在未分配的数据，不能推送');
                allSh = false;
                return false;
            }
        },
        error: function (error) {
            mini.alert(error.message || '接口异常，请稍后重试');
            return false;
        }
    });

    if (allSh) {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
            type: 'POST',
            async: false,
            contentType: 'application/json; charset=UTF-8',
            dataType: 'json',
            data: JSON.stringify(saveData),
            success: function (data, textStatus) {
                if (data.success) {
                    saveSuccess = data.value;
                    sendResult();
                    $("#messageText").text("受理通过，相关数据将推送至您选择的受理税务人员名下。");
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    } else {
        return false;
    }
    return saveSuccess;
}

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function getPreMonth(date) {
    var arr = date.split('-');
    var year = arr[0]; //获取当前日期的年份
    var month = arr[1]; //获取当前日期的月份

    var year2 = year;
    var month2 = parseInt(month) - 1;
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '年' + month2 + '月';
    return t2;
}
$(function () {
    sbtcsjql.initPage();
});

function beforeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 1
}
function beforedeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 0
}