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
        sbtcsjql.checkSwryWin = mini.get("sbtcsjqlChangeGly-win");
        sbtcsjql.tzjstkWin = mini.get("tzjstk-win");
        sbtcsjql.detailWin = mini.get("detail-win");
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
        mini.get('zsjg').setData(csjgData);
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
        mini.get("zsjg").select(Number(record.zsjgDm) - 1);
        record.sply && mini.get("shly").setValue(record.sply);
        sbtcsjql.rowIndex = rowIndex;
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
        var zsjg = mini.get('zsjg').getValue();
        var zsjgText = mini.get('zsjg').getTextField();
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
            var checkMustInput = sbtcsjqlGridData[rowIndex].esjg ? sbtcsjqlGridData[rowIndex].esjg : sbtcsjqlGridData[rowIndex].csjg;

            if (formdata.zsjgText !== checkMustInput && !shly) {
                mini.alert('选择的“审核结果”和前两个审核流程“审核结果”不同时，审核理由为必录！', '提示');
                return;
            } else {
                sbtcsjqlGridData[rowIndex].spjgDm = formdata.zsjg;
                sbtcsjqlGridData[rowIndex].zsjgDm = formdata.zsjg;
                sbtcsjqlGridData[rowIndex].zsjg = formdata.zsjgText;
                sbtcsjqlGridData[rowIndex].zsjgText = formdata.zsjgText;
                sbtcsjqlGridData[rowIndex].zsly = formdata.shly;
                sbtcsjqlGridData[rowIndex].sply = formdata.shly;
                sbtcsjql.GridDatas.data[rowIndex + pageIndex * pageSize] = sbtcsjqlGridData[rowIndex];
            }
        } else {
            var diffShjg = false;
            for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                if (sbtcsjql.GridDatas.data[j].selected) {
                    if (sbtcsjql.GridDatas.data[j].csjgDm !== formdata.zsjg && sbtcsjql.GridDatas.data[j].esjgDm !== formdata.zsjg) {
                        diffShjg = true;
                    }
                }
            }
            if (diffShjg) {
                if (!shly) {
                    mini.alert('批量审核时，若选择的“审核结果”和前两个审核流程“审核结果”不同，审核理由为必录！', '提示');
                    return false;
                } else {
                    for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                        if (sbtcsjql.GridDatas.data[j].selected) {
                            sbtcsjql.GridDatas.data[j].zsly = formdata.shly;
                            sbtcsjql.GridDatas.data[j].sply = formdata.shly;
                            sbtcsjql.GridDatas.data[j].spjgDm = formdata.zsjg;
                            sbtcsjql.GridDatas.data[j].zsjgDm = formdata.zsjg;
                            sbtcsjql.GridDatas.data[j].zsjg = formdata.zsjgText;
                            sbtcsjql.GridDatas.data[j].zsjgText = formdata.zsjgText;
                            sbtcsjql.GridDatas.data[j].selected = 0;
                        }
                    }
                }
            } else {
                for (var j = 0; j < sbtcsjql.GridDatas.data.length; j++) {
                    if (sbtcsjql.GridDatas.data[j].selected) {
                        sbtcsjql.GridDatas.data[j].spjgDm = formdata.zsjg;
                        sbtcsjql.GridDatas.data[j].zsjgDm = formdata.zsjg;
                        sbtcsjql.GridDatas.data[j].zsjg = formdata.zsjgText;
                        sbtcsjql.GridDatas.data[j].zsjgText = formdata.zsjgText;
                        sbtcsjql.GridDatas.data[j].zsly = formdata.shly;
                        sbtcsjql.GridDatas.data[j].sply = formdata.shly;
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
    cslyShow: function (record) {
        var csly = record.csly
        csly && mini.alert(csly);
    },
    eslyShow: function (record) {
        var esly = record.esly
        esly && mini.alert(esly);
    },
    zslyShow: function (record) {
        var zsly = record.zsly
        zsly && mini.alert(zsly);
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
                spztDm: '22',
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
    //微端和ie可以直接跳转金三
    tzjstkOk: function () {
        $.ajax({
            url: "/dzgzpt-wsys/api/sh/sbtc/getVdParams",
            type: "get",
            async: false,
            success: function (data) {
                var title = data.title;
                var homePage = data.homePage;
                var url = data.url;
                var gwssswjg = data.gwssswjg;
                var gnssgwxh = data.gnssgwxh;
                var nodeid = Base64.encode('if(!top.wdinit){setTimeout(function (){var aa = document.createElement("div");  aa.innerHTML=\'<div class="tree-node" id="tree#84886_1-4" leaftype="1" title="' + title + '" ischecked="false" caption="' + title + '" depth="1" gwssswjg="' + gwssswjg + '" showmenutype="seachResult" pathcuyy="0" gnssgwxh="' + gnssgwxh + '" zndm="01" mblx="1" code="A0000001A1300048" type="tree" gt3ywfldm="A13" gndm="A0000001A1300048" path="' + url + '" gt3zyydm="A0000001" cdlx="1" _id="tree#84886_1-4"> <span class="tree-node-wrapper" type="wrapperSpan"><span class="tree-gadjet tree-gadjet-none" type="gadGetSpan">&#8203;</span><span class="tree-icon tree-close-icon" type="iconSpan">&#8203;</span><span class="tree-name tree-highlighter " type="displaySpan">' + title + '</span></span> </div>\'; var bb = aa.childNodes[0]; try{bb.get = function(n){if(n==\'path\'){ return "' + url + '"; } return this.getAttribute(n)}; openTreeNode(bb);top.wdinit=true;}catch(e){top.wdinit=fals;alert(e)};},5000);}');

                $.ajax({
                    url: "/api/gt3session/get",
                    type: "get",
                    async: false,
                    success: function (data) {
                        var id = data && data.success ? data.value.id : '';
                        var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/xinmh/middlePage.html?id=' + id;
                        try {
                            Form.Show(url + '&jsUrl=' + encodeURIComponent(homePage),
                                true, 1000, 700, 'script=' + nodeid + ';HideHeadBar=0;Fixed=1;HideActionButton=0;TaskBarIco=2');
                        } catch (e) {
                            window.open(url, '', 'width=' + (window.screen.availWidth) + ',height=' + (window.screen.availHeight - 55) + ',top=0, left=0');
                        }
                    },
                    err: function () { }
                });
            },
            err: function () {

            }
        });
    },
    tzjstkNo: function () {
        sbtcsjql.tzjstkWin.hide();
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
function cslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csly = record.csly;
    return csly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.cslyShow(record)"' + '>查看</a>' : '';
}
function eslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esly = record.esly;
    return esly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(record)">查看</a>' : '';
}
function zslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var zsly = record.zsly;
    return zsly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.zslyShow(record)"' + '>查看</a>' : '';
}
function zsjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var zsjg = record.zsjg;
    var zsjgText = record.zsjgText;
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.openSwryCheck(record)">' + (zsjg ? (zsjg) : '未审批') + '</a>';
}
function csjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csjg = record.csjg;
    var csjgDm = record.csjgDm;
    return csjg;
}
function esjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esjg = record.esjg;
    var esjgDm = record.esjgDm;
    return esjg;
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
        sbtcsjql.GridDatas.data[i].sply = sbtcsjql.GridDatas.data[i].zsly;
    }
    var saveData = sbtcsjql.GridDatas.data;
    if (saveData.length == 0) {
        mini.alert('请完成数据查询');
        return;
    }
    var saveSuccess = false;
    for (var t = 0; t < saveData.length; t++) {
        if (isSend && !saveData[t].zsjg) {
            mini.alert('请审批完成所有数据');
            return saveSuccess;
        }
        saveData[t].sfzc = 'Y';
        saveData[t].sjSpztDm = '22';
        saveData[t].spztDm = '23';
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

function sendResult(flag) {
    var a = false;

    while (a) {
        mini.alert("ce", "c", function (e) {
            if (e === "ok") {
                a = true;
            }
        });
    }
    if (flag) {
        //判断是否所有数据都已经初审
        var saveData = sbtcsjql.GridDatas.data;
        var allSh = true;
        var saveSuccess = {};


        if (saveData.length == 0) {
            mini.alert('无可推送的数据');
        } else {
            for (var t = 0; t < saveData.length; t++) {
                // if(!saveData[t].zsjg){
                //     mini.alert('请审批完成所有数据');
                //     allSh = false;
                //     break;
                // }
                saveData[t].sfzc = 'N';
                saveData[t].sjSpztDm = '22';
                saveData[t].spztDm = '23';
                saveData[t].processInstanceId = getQueryString("processInstanceId");
                saveData[t].taskId = getQueryString("taskId");
                saveData[t].formId = getQueryString("formId");
            }
            if (allSh) {
                //暂时注释
                // mini.alert("请确认已经将所有出错的数据在核心征管中处理完毕", "提示", function (e) {
                //if (e === "ok") {
                $.ajax({
                    url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
                    type: 'POST',
                    async: false,
                    contentType: 'application/json; charset=UTF-8',
                    data: mini.encode(saveData),
                    success: function (data, textStatus) {
                        if (data.success) {
                            // sbtcsjql.tzjstkWin.show();

                            //发起管理端推送提醒
                            $.ajax({
                                url: '/dzgzpt-wsys/api/sh/sbtc/sendTstx',
                                type: 'POST',
                                async: false,
                                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                                data: {
                                    taskId: getQueryString("taskId"),
                                    processInstanceId: getQueryString("processInstanceId")
                                },
                                success: function (data) {

                                },
                                error: function (error) {

                                }
                            });

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

                            window.open('/dzgzpt-wsys/dzgzpt-wsys/apps/views/sbtcsjql/sjqlshThirdStep/tip.html');

                            saveSuccess = data.value;
                            sendResult2();
                        }
                    },
                    error: function (error) {
                        mini.alert(error.message || '接口异常，请稍后重试');
                    }
                });
                //}
                // });
            }
            return saveSuccess;
        }
    }
}

/*
function getSplitByForm(){
    //判断是否所有数据都已经初审
    var saveData = sbtcsjql.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};

    if(saveData.length == 0){
        mini.alert('无可推送的数据');
    } else{
        for(var t=0;t<saveData.length;t++){
            if(!saveData[t].zsjg){
                mini.alert('请审批完成所有数据');
                allSh = false;
                break;
            }
            saveData[t].sfzc = 'N';
            saveData[t].sjSpztDm = '22';
            saveData[t].spztDm = '23';
            saveData[t].processInstanceId = getQueryString("processInstanceId");
            saveData[t].taskId = getQueryString("taskId");
            saveData[t].formId = getQueryString("formId");
        }
        if(allSh) {
            //暂时注释
            // mini.alert("请确认已经将所有出错的数据在核心征管中处理完毕", "提示", function (e) {
            //if (e === "ok") {
            $.ajax({
                url: '/dzgzpt-wsys/api/sh/sbtc/saveTsfp',
                type: 'POST',
                async: false,
                contentType: 'application/json; charset=UTF-8',
                data: mini.encode(saveData),
                success: function (data, textStatus) {
                    if (data.success) {
                        // mini.alert('推送成功');
                        $("#messageText").text("推送成功");

                        sbtcsjql.tzjstkWin.show();

                        saveSuccess = data.value;
                        sendResult();
                    }
                },
                error: function (error) {
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });
            //}
            // });
        }
        return saveSuccess;
    }
}
*/

function getFormParams() {
    var saveData = sbtcsjql.GridDatas.data;
    var allSh = true;
    var saveSuccess = {};
    for (var t = 0; t < saveData.length; t++) {
        // if (!saveData[t].zsjg) {
        //     mini.alert('请审批完成所有数据');
        //     allSh = false;
        //     break;
        // }
        saveData[t].sfzc = 'N';
        saveData[t].sjSpztDm = '22';
        saveData[t].spztDm = '23';
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
    sbtcsjql.initPage();
});

function beforeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 1
}
function beforedeselect(e) {
    sbtcsjql.GridDatas.data[e.record._number].selected = 0
}