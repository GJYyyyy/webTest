var wssq = {};
wssq.loadTemplate = function (url, Data) {
    var html = '';
    $.ajax({
        url: url,
        type: 'GET',
        async: false,
        dataType: 'html',
        success: function (data, textStatus) {
            if (!!Data) {
                try {
                    var reg = /(?:\{\{)(\w[\.\w]*)(?:\}\})/g; // 匹配 {{ data.param }}
                    data = data.replace(reg, function (_, item) {
                        return eval("Data." + item);
                    });
                } catch (e) {
                    // TODO
                }
            }
            html = data;
            //wssq.loadScript(url);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {

        }
    });
    return html;
};



var sbtcsjql = {
    GridDatas: {
        data: [],
        total: 0
    },
    selectMaps: [],
    initPage: function () {
        sbtcsjql.sbtcsjqlGrid = mini.get('sbtcsjql_grid');
        sbtcsjql.detailWin = mini.get("detail-win");

        sbtcsjql.checkSwryWin = mini.get("sbtcsjqlChangeGly-win");
        var csjgData = [
            {
                ID: '01',
                MC: '(01)未申报'
            },
            {
                ID: '02',
                MC: '(02)逾期申报'
            },
            {
                ID: '03',
                MC: '(03)数据错误'
            },
            {
                ID: '04',
                MC: '(04)其他'
            },
        ];
        mini.get('esjg').setData(csjgData);
        $("#hssj").html(new Date().format('yyyy年MM月'))
        sbtcsjql.searchData();
        // sbtcsjql.getSbyqts();
        // 选中元素
        this.elementSelect();
        // 绑定事件
        this.bindEvent();
    },
    // 监听分页前事件，阻止后自行设置当前数据和分页信息
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
    elementSelect: function () {
        this.$zc = $('#zcBtn');
        this.$ts = $('#tsBtn');
        this.$export = $('#export');
        this.$search = $('#search');
    },
    bindEvent: function () {
        this.$zc.on('click', function () {
            saveData();
        });
        //推送按钮点击
        this.$ts.on('click', function () {
            getSplitByForm();
        });
        //导出
        this.$export.on('click', function () {
            sbtcsjql.doExport();
        });
        //查询
        this.$search.on('click', function () {
            sbtcsjql.searchData();
        });
    },
    openSwryCheck: function (record) {
        var rowIndex = record["_number"] % sbtcsjql.sbtcsjqlGrid.getPageSize();
        sbtcsjql.checkSwryWin.show();
        sbtcsjql.rowIndex = rowIndex;
        mini.get("esjg").select(Number(record.esjgDm) - 1);
        record.esly && mini.get("shly").setValue(record.esly);
        sbtcsjql.plfp = false;
    },
    checkSwryCancel: function () {
        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.checkSwryWin.hide();
    },
    // 详情弹框关闭
    detailWinCancel: function () {
        sbtcsjql.detailWin.hide()
    },
    checkSwryOk: function () {
        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.validate();
        if (sbtcsjql.checkSwryForm.isValid() == false) return false;
        var formdata = sbtcsjql.checkSwryForm.getDataAndText(true);
        var esjg = mini.get('esjg').getValue();
        var esjgText = mini.get('esjg').getTextField();
        var shly = mini.get('shly').getValue();
        var sbtcsjqlGridData = sbtcsjql.sbtcsjqlGrid.getData();
        var pageIndex = sbtcsjql.sbtcsjqlGrid.getPageIndex();
        var pageSize = sbtcsjql.sbtcsjqlGrid.getPageSize();
        if (shly && shly.length > 500) {
            mini.alert('审核理由最多可以输入500个字');
            return;
        }
        if (!sbtcsjql.plfp) {
            var rowIndex = sbtcsjql.rowIndex;
            if (formdata.esjg !== sbtcsjqlGridData[rowIndex].csjgDm && !shly) {
                mini.alert('选择的“审核结果”和前一审核流程“审核结果”不同时，审核理由为必录！', '提示');
                return;
            } else {
                sbtcsjqlGridData[rowIndex].spjgDm = formdata.esjg;
                sbtcsjqlGridData[rowIndex].esjgDm = formdata.esjg;
                sbtcsjqlGridData[rowIndex].esjg = formdata.esjgText;
                sbtcsjqlGridData[rowIndex].esjgText = formdata.esjgText;
                sbtcsjqlGridData[rowIndex].sply = formdata.shly;
                sbtcsjqlGridData[rowIndex].esly = formdata.shly;
                sbtcsjql.GridDatas.data[rowIndex + pageIndex * pageSize] = sbtcsjqlGridData[rowIndex];
            }
        } else {
            var diffShjg = false;
            for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                if (sbtcsjql.GridDatas.data[j].selected) {
                    if (sbtcsjql.GridDatas.data[j].csjgDm !== formdata.esjg) {
                        diffShjg = true;
                    }
                }
            }
            if (diffShjg) {
                if (!shly) {
                    mini.alert('批量审核时，若选择的“审核结果”和前一审核流程“审核结果”不同，审核理由为必录！', '提示');
                    return false;
                } else {
                    for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                        if (sbtcsjql.GridDatas.data[j].selected) {
                            sbtcsjql.GridDatas.data[j].sply = formdata.shly;
                            sbtcsjql.GridDatas.data[j].esly = formdata.shly;
                            sbtcsjql.GridDatas.data[j].spjgDm = formdata.esjg;
                            sbtcsjql.GridDatas.data[j].esjgDm = formdata.esjg;
                            sbtcsjql.GridDatas.data[j].esjg = formdata.esjgText;
                            sbtcsjql.GridDatas.data[j].esjgText = formdata.esjgText;
                            sbtcsjql.GridDatas.data[j].selected = 0;
                        }
                    }
                }
            } else {
                for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                    if (sbtcsjql.GridDatas.data[j].selected) {
                        sbtcsjql.GridDatas.data[j].sply = formdata.shly;
                        sbtcsjql.GridDatas.data[j].esly = formdata.shly;
                        sbtcsjql.GridDatas.data[j].spjgDm = formdata.esjg;
                        sbtcsjql.GridDatas.data[j].esjgDm = formdata.esjg;
                        sbtcsjql.GridDatas.data[j].esjg = formdata.esjgText;
                        sbtcsjql.GridDatas.data[j].esjgText = formdata.esjgText;
                        sbtcsjql.GridDatas.data[j].selected = 0;
                    }
                }
            }
        }
        sbtcsjql.fillData(sbtcsjql.sbtcsjqlGrid.getPageIndex(), sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        sbtcsjql.checkSwryWin.hide();
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.sbtcsjqlGrid.deselectAll()
    },
    plsh: function () {
        var rows = sbtcsjql.GridDatas.data;
        var selectedRowLength = 0;
        for (var d = 0; d < rows.length; d++) {
            if (rows[d].selected) {
                selectedRowLength += 1;
            }
        }
        if (selectedRowLength < 2) {
            mini.alert("选择的纳税人信息必须大于等于两条。");
        } else {
            sbtcsjql.plfp = true;
            sbtcsjql.checkSwryWin.show();
        }
    },
    eslyShow: function (record) {
        var esly = record.esly
        esly && mini.alert(esly);
    },
    fillData: function (pageIndex, pageSize, dataResult, grid) {
        var data = dataResult.data;
        var totalCount = dataResult.total;
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
    onGridLoad: function (e) {

    },
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
    setChose: function () {
        //根据条件获取行数组（selected）
        var rows = sbtcsjql.sbtcsjqlGrid.findRows(function (row) {
            if (row.selected == 1) return true;
            else return false;
        });
        sbtcsjql.sbtcsjqlGrid.selects(rows);
    },
    searchData: function () {
        /*
        * 初始化查询出数据，做成假分页
        */
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySjqlDesZs',
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: mini.encode({
                spztDm: '21',
                processInstanceId: getQueryString("processInstanceId"),
                taskId: getQueryString("taskId"),
                bdjg: mini.get('bdjg').getValue()
            }),
            success: function (data) {
                if (data.data && data.data.length > 0) {
                    sbtcsjql.GridDatas = data;
                } else {
                    mini.alert('未查询到数据');
                    sbtcsjql.GridDatas = {
                        data: [],
                        total: 0
                    };
                }

                //添加编号
                for (var i = 0; i < sbtcsjql.GridDatas.data.length; i++) {
                    sbtcsjql.GridDatas.data[i]["_number"] = i;
                    sbtcsjql.GridDatas.data[i].selected = 0;
                }

                sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
                sbtcsjql.GridDatas = {
                    data: [],
                    total: 0
                };
                sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
            }
        });
    },
    doExport: function () {
        if (!sbtcsjql.sbtcsjqlGrid.getData() || (sbtcsjql.sbtcsjqlGrid.getData() && sbtcsjql.sbtcsjqlGrid.getData().length < 1)) {
            mini.alert("暂无数据，无需导出！")
            return
        }
        var searchData = {
            processInstanceId: getQueryString("processInstanceId"),
            taskId: getQueryString("taskId"),
            bdjg: mini.get('bdjg').getValue()
        };
        var exportUrl = '/dzgzpt-wsys/api/sh/sbtc/export/sjqldes?spztDm=21&processInstanceId=' + searchData.processInstanceId + '&taskId=' + searchData.taskId + '&bdjg=' + searchData.bdjg
        window.open(exportUrl);
    },
    getSbyqts: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/getSbqxYqr',
            type: 'GET',
            success: function (data) {
                if (data.success && data.value) {
                    $('#sbyqts').html(data.value);
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
function esjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esjgDm = record.esjgDm;
    var esjg = record.esjg;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.openSwryCheck(record)">' + (esjgDm ? (esjg) : '未审批') + '</a>';
}
function eslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esly = record.esly;
    return esly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(record)"' + '>查看</a>' : '';
}
function cslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csly = record.csly;
    return csly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(record)"' + '>查看</a>' : '';
}
function csjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csjg = record.csjg;
    var csjgDm = record.csjgDm;
    return csjgDm ? csjg : "";
}

var message = new MyMessage.message({
    /*默认参数，下面为默认项*/
    iconFontSize: "20px", //图标大小,默认为20px
    messageFontSize: "12px", //信息字体大小,默认为12px
    showTime: 3000, //消失时间,默认为3000
    align: "center", //显示的位置类型center,right,left
    positions: { //放置信息距离周边的距离,默认为10px
        top: "450px",
        bottom: "10px",
        right: "10px",
        left: "10px"
    },
    message: "这是一条消息", //消息内容,默认为"这是一条消息"
    type: "normal", //消息的类型，还有success,error,warning等，默认为normal
});
//点击暂存要调用的方法
function saveData(isSend) {
    for (var i = 0; i < sbtcsjql.GridDatas.data.length; i++) {
        sbtcsjql.GridDatas.data[i].sply = sbtcsjql.GridDatas.data[i].esly;
    }
    var saveData = sbtcsjql.GridDatas.data;
    if (saveData.length == 0) {
        mini.alert('请完成数据查询');
        return;
    }
    var saveSuccess = false;
    for (var t = 0; t < saveData.length; t++) {
        if (isSend && (!saveData[t].spjgDm || !saveData[t].esjgDm)) {
            mini.alert('存在未审核的数据，不能推送');
            return saveSuccess;
        }
        saveData[t].sfzc = 'Y';
        saveData[t].sjSpztDm = '21';
        saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '23' : '22';
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/saveZcfp',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        data: mini.encode(saveData),
        success: function (data, textStatus) {
            if (data.success) {
                message.add("保存成功，请记得及时推送。", "success");
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

function getSplitByForm() {
    //判断是否所有数据都已经初审
    var saveData = sbtcsjql.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};
    if (saveData.length == 0) {
        mini.alert('无可推送的数据');
    } else {
        for (var t = 0; t < saveData.length; t++) {
            // if (!saveData[t].spjgDm || !saveData[t].esjgDm) {
            //     mini.alert('存在未审核的数据，不能推送');
            //     allSh = false;
            //     break;
            // }
            saveData[t].sfzc = 'N';
            saveData[t].sjSpztDm = '21';
            saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '23' : '22';
            saveData[t].processInstanceId = getQueryString("processInstanceId");
            saveData[t].taskId = getQueryString("taskId");
            saveData[t].formId = getQueryString("formId");
        }
        if (allSh) {
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=UTF-8',
                data: mini.encode(saveData),
                success: function (data, textStatus) {
                    if (data.success && data.value !== null) {
                        $("#messageText").text("审批结果为01、02的信息审核结束；审批结果为03、04的信息将推送到申报征收监控岗。");

                        saveSuccess = data.value;
                        sendResult2();
                    }
                },
                error: function (error) {
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });
        }
        return saveSuccess;
    }
}

function sendResult(flag) {
    if (flag) {
        //判断是否所有数据都已经初审
        var saveData = sbtcsjql.GridDatas.data;
        var allSh = true;
        var saveSuccess = {};
        if (saveData.length == 0) {
            mini.alert('无可推送的数据');
        } else {
            for (var t = 0; t < saveData.length; t++) {
                // if(!saveData[t].spjgDm || !saveData[t].esjgDm){
                //     mini.alert('存在未审核的数据，不能推送');
                //     allSh = false;
                //     break;
                // }
                saveData[t].sfzc = 'N';
                saveData[t].sjSpztDm = '21';
                saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '23' : '22';
                saveData[t].processInstanceId = getQueryString("processInstanceId");
                saveData[t].taskId = getQueryString("taskId");
                saveData[t].formId = getQueryString("formId");
            }
            if (allSh) {
                $.ajax({
                    url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
                    type: 'POST',
                    async: false,
                    contentType: 'application/json; charset=UTF-8',
                    data: mini.encode(saveData),
                    success: function (data, textStatus) {
                        if (data.success && data.value !== null) {
                            //发起纳税人端推送提醒
                            $.ajax({
                                url: '/dzgzpt-wsys/api/sh/sbtc/sendTstxToNsr',
                                type: 'POST',
                                async: false,
                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                data: mini.encode(saveData),
                                success: function (data) {

                                },
                                error: function (error) {

                                }
                            });
                            saveSuccess = data.value;
                            sendResult2();

                        }
                    },
                    error: function (error) {
                        mini.alert(error.message || '接口异常，请稍后重试');
                    }
                });

            }
            return saveSuccess;
        }
    }
}

function getFormParams() {
    var saveData = sbtcsjql.GridDatas.data;
    var saveSuccess = {};
    var allSh = true;
    for (var t = 0; t < saveData.length; t++) {
        // if (!saveData[t].spjgDm || !saveData[t].esjgDm) {
        //     mini.alert('存在未审核的数据，不能推送');
        //     allSh = false;
        //     break;
        // }
        saveData[t].sfzc = 'N';
        saveData[t].sjSpztDm = '21';
        saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '23' : '22';
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
    }
    allSh && $.ajax({
        url: '/dzgzpt-wsys/api/sh/sbtc/getFormParams',
        type: 'POST',
        async: false,
        contentType: 'application/json; charset=UTF-8',
        data: mini.encode(saveData),
        success: function (data, textStatus) {
            if (data) {
                saveSuccess = data;
            }
        },
        error: function (error) {
            mini.alert(error.message || '接口异常，请稍后重试');
        }
    });
    return saveSuccess;
}

//推送成功后执行清空查询数据操作
function sendResult2() {
    sbtcsjql.fillData(mini.get('sbtcsjql_grid').getPageIndex(), mini.get('sbtcsjql_grid').getPageSize(), { data: [], total: 0 }, sbtcsjql.sbtcsjqlGrid);
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
    sbtcsjql.initPage()
});

function beforeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 1
}
function beforedeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 0
}