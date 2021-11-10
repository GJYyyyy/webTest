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
        $("#hssj").html(getPreMonth(new Date().format('yyyy-MM-dd')))
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
        var rows = sbtcsjql.selectMaps[sbtcsjql.sbtcsjqlGrid.getPageIndex()];
        if (rows) {
            for (var i = 0; i < rows.length; i++) {
                sbtcsjql.sbtcsjqlGrid.setSelected(rows[i]);
            }
        } else {
            // sbtcsjql.setChose();
        }
    },
    elementSelect: function () {
        this.$zc = $('#zcBtn');
        this.$ts = $('#tsBtn');
    },
    bindEvent: function () {
        this.$zc.on('click', function () {
            saveData();
        });
        //推送按钮点击
        this.$ts.on('click', function () {
            getSplitByForm();
        });
    },
    openSwryCheck: function (record) {
        var rowIndex = record["_number"] % sbtcsjql.sbtcsjqlGrid.getPageSize();
        sbtcsjql.checkSwryWin.show();
        mini.get("zsjg").select(Number(record.zsjg) - 1);
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
            var rows = sbtcsjql.selectMaps;
            for (var i = 0; i < rows.length; i++) {
                for (var j = 0; j < rows[i].length; j++) {
                    if (sbtcsjql.GridDatas.data[rows[i][j]['_number']].csjgDm !== formdata.zsjg && sbtcsjql.GridDatas.data[rows[i][j]['_number']].esjgDm !== formdata.zsjg) {
                        diffShjg = true;
                    }
                }
            }
            if (diffShjg) {
                if (!shly) {
                    mini.alert('批量审核时，若选择的“审核结果”和前两个审核流程“审核结果”不同，审核理由为必录！', '提示');
                    return false;
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        for (var j = 0; j < rows[i].length; j++) {
                            if (sbtcsjql.GridDatas.data[rows[i][j]['_number']].csjg !== formdata.zsjgText && sbtcsjql.GridDatas.data[rows[i][j]['_number']].esjg !== formdata.zsjgText) {
                                sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsly = formdata.shly;
                                sbtcsjql.GridDatas.data[rows[i][j]['_number']].sply = formdata.shly;
                            }
                            sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsjg = formdata.zsjg;
                            sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsjgText = formdata.zsjgText;
                        }
                    }
                }
            } else {
                for (var i = 0; i < rows.length; i++) {
                    for (var j = 0; j < rows[i].length; j++) {
                        sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsjg = formdata.zsjg;
                        sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsjgText = formdata.zsjgText;
                        sbtcsjql.GridDatas.data[rows[i][j]['_number']].zsly = formdata.shly;
                        sbtcsjql.GridDatas.data[rows[i][j]['_number']].sply = formdata.shly;
                    }
                }
            }
        }
        sbtcsjql.fillData(sbtcsjql.sbtcsjqlGrid.getPageIndex(), sbtcsjql.sbtcsjqlGrid.getPageSize(), sbtcsjql.GridDatas, sbtcsjql.sbtcsjqlGrid);
        sbtcsjql.checkSwryWin.hide();
        sbtcsjql.checkSwryForm.reset();
        sbtcsjql.sbtcsjqlGrid.deselectAll()
        // var nowPageRows = sbtcsjql.selectMaps[sbtcsjql.sbtcsjqlGrid.getPageIndex()];
        // if (nowPageRows) {
        //     for (var i = 0; i < nowPageRows.length; i++) {
        //         sbtcsjql.sbtcsjqlGrid.setSelected(nowPageRows[i]);
        //     }
        // }
    },
    plsh: function () {
        var rows = sbtcsjql.selectMaps;
        var selectedRowLength = 0;
        for (var d = 0; d < rows.length; d++) {
            if (rows[d].length > 0) {
                selectedRowLength += rows[d].length;
            }
        }
        if (selectedRowLength < 2) {
            mini.alert("选择的纳税人信息必须大于等于两条。");
        } else {
            sbtcsjql.plfp = true;
            sbtcsjql.checkSwryWin.show();
        }
    },
    eslyShow: function (esly) {
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
        grid.setData(arr);
    },
    onGridLoad: function (e) {

    },
    onSelectoinChanged: function (e) {
        // 实现全选所有页面数据
        // if (e.selected == null && e.selecteds.length === sbtcsjql.sbtcsjqlGrid.getData().length) {
        //     var alldata = sbtcsjql.GridDatas.data;
        //     for (var v = 0; v < alldata.length; v++) {
        //         alldata[v].selected = 1;
        //     }
        //     for (var j = 0; j < alldata.length / 30; j++) {
        //         sbtcsjql.selectMaps[j] = alldata.slice(j * 30, j * 30 + 30);
        //     }
        //     // sbtcsjql.selectMaps = alldata;
        // }
        if (e.selected == null && e.selecteds.length === 0) {
            sbtcsjql.selectMaps = [];
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
                spztDm: '23',
                processInstanceId: getQueryString("processInstanceId"),
                taskId: getQueryString("taskId")
            }),
            success: function (data) {
                if (data.data && data.data.length > 0) {
                    sbtcsjql.GridDatas = data;
                    for (var z = 0; z < data.data.length / sbtcsjql.sbtcsjqlGrid.getPageSize(); z++) {
                        sbtcsjql.selectMaps[z] = [];
                    }
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
                //格式暂时写死
                // title = "&#x5E94;&#x7533;&#x62A5;&#x7EDF;&#x8BA1;&#x7EF4;&#x62A4;&#xFF08;&#x8865;&#x507F;&#xFF09;[&#x65E7;&#x623F;&#x8F6C;&#x8BA9;&#x571F;&#x5730;&#x589E;&#x503C;&#x7A0E;&#x7BA1;&#x7406;&#x5C97;]";

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
    //ck详情
    xqShow: function (record) {
        mini.get("detail_grid").setData(record.szxx)
        sbtcsjql.detailWin.show()
    }
};
function shxydmRenderer(e) {
    var record = e.record
    return record.shxydm ? record.shxydm : record.nsrsbh
}
function xqRenderer(e) {
    return '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.xqShow(' + e + ')"' + '>查看</a>'
}
function cslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var csly = record.csly;
    return csly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(' + '\'' + csly + '\'' + ')"' + '>查看</a>' : '';
}
function eslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var esly = record.esly;
    return esly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(' + '\'' + esly + '\'' + ')">查看</a>' : '';
}
function zslyRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var zsly = record.zsly;
    return zsly ? '<a class="color-blue wh100 inlineblock lineH36" onclick="sbtcsjql.eslyShow(' + '\'' + zsly + '\'' + ')"' + '>查看</a>' : '';
}
function zsjgRenderer(e) {
    var record = e.record;
    var rowIndex = e.rowIndex;
    var zsjg = record.zsjg;
    var zsjgText = record.zsjgText;
    return '<a class="color-blue wh100 inlineblock lineH36">' + (zsjg ? (zsjg) : '未审批') + '</a>';
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
        saveData[t].sfzc = 'Y';
        saveData[t].sjSpztDm = '22';
        saveData[t].spztDm = '23';
        saveData[t].processInstanceId = getQueryString("processInstanceId");
        saveData[t].taskId = getQueryString("taskId");
        saveData[t].formId = getQueryString("formId");
        if (isSend && !saveData[t].zsjg) {
            mini.alert('请审批完成所有数据');
            return saveSuccess;
        }
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
    if (flag) {
        //判断是否所有数据都已经初审
        var saveData = sbtcsjql.GridDatas.data;
        var allSh = true;
        var saveSuccess = {};

        if (saveData.length == 0) {
            mini.alert('无可推送的数据');
        } else {
            for (var t = 0; t < saveData.length; t++) {
                saveData[t].sply = saveData[t].zsly;
                saveData[t].spjgDm = saveData[t].zsjgDm;
                saveData[t].spjg = saveData[t].zsjg;
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
                            // mini.alert('推送成功');
                            $("#messageText").text("推送成功");

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
                            sbtcsjql.tzjstkWin.show();

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

function getFormParams() {
    var saveData = sbtcsjql.GridDatas.data;

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
    $.ajax({
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