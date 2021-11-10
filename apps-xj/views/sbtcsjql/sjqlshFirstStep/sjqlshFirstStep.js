


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
    slswryList: [],
    initPage: function () {
        sbtcsjql.sbtcsjqlGrid = mini.get('sbtcsjql_grid');
        sbtcsjql.checkSwryWin = mini.get("sbtcsjqlChangeGly-win");
        sbtcsjql.detailWin = mini.get("detail-win");
        sbtcsjql.srarchGlyRowForm = new mini.Form("srarchGlyRow-form");
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
        $("#hssj").html(new Date().format('yyyy年MM月'))
        mini.get('csjg').setData(csjgData);
        sbtcsjql.querySygly();
        sbtcsjql.queryGrid();
        // 选中元素
        this.elementSelect();
        // 绑定事件
        this.bindEvent();
        sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
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
        this.$search_ele = $('#search');
        this.$reset = $('#reset');
        this.$export = $('#export');
        this.$zc = $('#zcBtn');
        this.$ts = $('#tsBtn');
    },
    bindEvent: function () {
        //查询按钮点击
        this.$search_ele.on('click', function () {
            sbtcsjql.srarchGlyRowForm.validate();
            if (sbtcsjql.srarchGlyRowForm.isValid() == false) return false;
            //验证通过请求数据
            sbtcsjql.queryGrid();
        });
        //重置按钮点击
        this.$reset.on('click', function () {
            mini.get('sygly').setValue('');
            mini.get('nsrsbh').setValue('');
            sbtcsjql.GridDatas = {
                data: [],
                total: 0
            };
            sbtcsjql.fillData(0, sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        });
        //导出按钮点击
        this.$export.on('click', function () {
            if (!sbtcsjql.sbtcsjqlGrid.getData() || (sbtcsjql.sbtcsjqlGrid.getData() && sbtcsjql.sbtcsjqlGrid.getData().length < 1)) {
                mini.alert("暂无数据，无需导出！")
                return
            }
            var searchData = {
                spztDm: '10',
                ssglyDm: mini.get('sygly').getValue() === '99' ? '' : mini.get('sygly').getValue(),
                nsrsbh: mini.get('nsrsbh').getValue(),
                processInstanceId: getQueryString("processInstanceId"),
                taskId: getQueryString("taskId"),
                bdjg: mini.get('bdjg').getValue()
            };
            var exportUrl = '/dzgzpt-wsys/api/sh/sbtc/export/sjqldcs?spztDm=10&ssglyDm=' + searchData.ssglyDm + '&nsrsbh=' + searchData.nsrsbh + '&processInstanceId=' + searchData.processInstanceId + '&taskId=' + searchData.taskId + '&bdjg=' + searchData.bdjg
            if (mini.get('sygly').getValue() === '99') {
                exportUrl += '&qt_ssglyDm=null'
            }
            window.open(exportUrl);
        });
        //暂存按钮点击
        this.$zc.on('click', function () {
            saveData();
        });
        //推送按钮点击
        this.$ts.on('click', function () {
            getSplitByForm();
        });
    },
    //审核结果选择弹框打开
    openSwryCheck: function (record) {
        var rowIndex = record["_number"] % sbtcsjql.sbtcsjqlGrid.getPageSize();
        sbtcsjql.checkSwryWin.show();
        mini.get("csjg").select(Number(record.spjgDm) - 1);
        record.sply && mini.get("shly").setValue(record.sply);
        sbtcsjql.rowIndex = rowIndex;
        sbtcsjql.plfp = false;
    },
    //审核结果选择弹框关闭
    checkSwryCancel: function (e) {

        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.checkSwryWin.hide();
    },
    // 详情弹框关闭
    detailWinCancel: function () {
        sbtcsjql.detailWin.hide()
    },
    //审核结果选择--点击确定
    checkSwryOk: function () {
        sbtcsjql.checkSwryForm = new mini.Form("#checkGlyRow-form");
        sbtcsjql.checkSwryForm.validate();
        if (sbtcsjql.checkSwryForm.isValid() == false) return false;
        var formdata = sbtcsjql.checkSwryForm.getDataAndText(true);
        var csjg = mini.get('csjg').getValue();
        var shly = mini.get('shly').getValue();
        if ((csjg == '03' || csjg == '04') && !shly) {
            mini.alert('审核结果为“数据错误”或“其他”时，审核理由必录');
            return;
        } else if (shly && shly.length > 500) {
            mini.alert('审核理由最多可以输入500个字');
            return;
        }
        var sbtcsjqlGridData = sbtcsjql.sbtcsjqlGrid.getData();
        var pageIndex = sbtcsjql.sbtcsjqlGrid.getPageIndex();
        var pageSize = sbtcsjql.sbtcsjqlGrid.getPageSize();
        if (!sbtcsjql.plfp) {
            var rowIndex = sbtcsjql.rowIndex;
            sbtcsjqlGridData[rowIndex].spjgDm = formdata.csjg;
            sbtcsjqlGridData[rowIndex].spjgmc = formdata.csjgText;
            sbtcsjqlGridData[rowIndex].sply = formdata.shly;
            sbtcsjql.GridDatas.data[rowIndex + pageIndex * pageSize] = sbtcsjqlGridData[rowIndex];
        } else {
            for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                if (sbtcsjql.GridDatas.data[j].selected) {
                    sbtcsjql.GridDatas.data[j].spjgDm = formdata.csjg;
                    sbtcsjql.GridDatas.data[j].spjgmc = formdata.csjgText;
                    sbtcsjql.GridDatas.data[j].sply = formdata.shly;
                    sbtcsjql.GridDatas.data[j].selected = 0
                }
            }
        }
        sbtcsjql.fillData(sbtcsjql.sbtcsjqlGrid.getPageIndex(), sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        sbtcsjql.checkSwryWin.hide();
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.sbtcsjqlGrid.deselectAll()
    },
    //点击批量审核
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
    //初审理由弹出
    cslyShow: function (record) {
        var csly = record.sply;
        csly && mini.alert(csly);
    },
    djrqChanged: function () {

    },
    slglyChange: function () {

    },
    //校验纳税人识别号格式
    nsrsbhValidate: function (e) {
        if (e.isValid && e.value) {
            if (!/^[a-zA-Z0-9\-]{15,20}$/.test(e.value)) {
                e.errorText = "社会信用代码必须为15到20位的字母或数字！";
                e.isValid = false;
                return;
            }
        }
    },
    //假分页显示当前页数据
    fillData: function (pageIndex, pageSize, dataResult, grid) {
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
    //复选框选中时记录所选数据
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
    querySygly: function () {
        /*
        * 初始化查询税源管理员下拉数据
        */
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySyglyBySwjgDm',
            type: 'GET',
            success: function (data, textStatus) {
                if (!!data) {
                    for (var f = 0; f < data.length; f++) {
                        data[f].swryxm = data[f].swryxm + '(' + data[f].swryDm + ')';
                    }
                    data.push({
                        swryDm: '99',
                        swryxm: '其他'
                    });
                    sbtcsjql.slswryList = data;
                    mini.get('sygly').setData(data);
                    sbtcsjql.loginUser();
                } else {
                    mini.alert('受理税务人员数据请求异常');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    //当前登录的税务人员
    loginUser: function () {
        $.ajax({
            type: "POST",
            url: "/dzgzpt-wsys/api/wtgl/public/login/session",
            data: {},
            async: false,
            success: function (data) {
                var returnData = mini.decode(data);
                if (returnData.success) {
                    var rtnData = mini.decode(returnData.value);
                    for (var g = 0; g < sbtcsjql.slswryList.length; g++) {
                        if (sbtcsjql.slswryList[g].swryDm == rtnData.userId) {
                            mini.get('sygly').setValue(rtnData.userId);
                            break;
                        }
                    }
                } else {
                    mini.alert("查询当前税务人员信息失败");
                }
            }
        });
    },
    //查询数据
    queryGrid: function () {
        var searchData = {
            spztDm: '10',
            ssglyDm: mini.get('sygly').getValue() === '99' ? '' : mini.get('sygly').getValue(),
            nsrsbh: mini.get('nsrsbh').getValue(),
            processInstanceId: getQueryString("processInstanceId"),
            taskId: getQueryString("taskId"),
            bdjg: mini.get('bdjg').getValue()
        };
        if (mini.get('sygly').getValue() === '99') {
            searchData.qt_ssglyDm = 'null';
        }
        //初审查询
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/sbtc/querySjqlDcs',
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: mini.encode(searchData),
            success: function (data, textStatus) {
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
function csjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csjg = record.spjgDm;
    var csjgText = record.spjgmc;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.openSwryCheck(record)">' + (csjgText ? (csjgText) : '未审批') + '</a>';
}
function cslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csly = record.sply;
    return csly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.cslyShow(record)"' + '>查看</a>' : '';
}
//推送成功后执行清空查询数据操作
function sendResult() {
    sbtcsjql.loginUser();
    mini.get('nsrsbh').setValue('');
    sbtcsjql.fillData(mini.get('sbtcsjql_grid').getPageIndex(), mini.get('sbtcsjql_grid').getPageSize(), { data: [], total: 0 }, sbtcsjql.sbtcsjqlGrid);
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
    var saveSuccess = false;

    var saveData = sbtcsjql.GridDatas.data;
    if (saveData.length == 0) {
        mini.alert('请完成数据查询');
        return;
    }
    for (var t = 0; t < saveData.length; t++) {
        if (isSend && !saveData[t].spjgDm) {
            mini.alert('存在未审核的数据，不能推送');
            return saveSuccess
        }
        saveData[t].sfzc = 'Y';
        saveData[t].sjSpztDm = '10';
        saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '21' : '22';
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
            // if (!saveData[t].spjgDm) {
            //     mini.alert('存在未审核的数据，不能推送');
            //     allSh = false;
            //     break;
            // }
            saveData[t].sfzc = 'N';
            saveData[t].sjSpztDm = '10';
            saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '21' : '22';
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
                    if (data.success) {
                        saveSuccess = data.value;
                        $("#messageText").text("初审结果为01、02的信息将推送到税源管理部门领导岗进行二审；初审结果为03、04的信息将推送到申报征收监控岗进行终审。");
                        sendResult();
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
function getFormParams() {
    var saveData = sbtcsjql.GridDatas.data;
    var saveSuccess = {};
    var allSh = true;
    for (var t = 0; t < saveData.length; t++) {
        // if (!saveData[t].spjgDm) {
        //     mini.alert('存在未审核的数据，不能推送');
        //     allSh = false;
        //     break;
        // }
        saveData[t].sfzc = 'N';
        saveData[t].sjSpztDm = '10';
        saveData[t].spztDm = (saveData[t].spjgDm === '01' || saveData[t].spjgDm === '02') ? '21' : '22';
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