var mdcx = {};
var mdcxApiHead = '/dzgzpt-wsys/';
var mdcxApi = {
    handleSearch: mdcxApiHead + 'api/fpzyps/mdcx/query',
    /* 查询 */
    getZgswjg: mdcxApiHead + 'api/fpzyps/mdcx/getZgswjgDm',
    /* 获取主管税务机关 */
    getZgswskfj: mdcxApiHead + 'api/fpzyps/mdcx/getZgswskfjDm',
    /* 获取主管税务所科分局 */
    getExcel: mdcxApiHead + 'api/fpzyps/mdcx/exportExcel',

    getXq: mdcxApiHead + 'api//fpzyps/mdcx/queryFpDetails',
};

mdcx.pageIndex = 0;
mdcx.pageSize = 0; // 初始化为0
mdcx.key = true; // 防止多次点击
mdcx.total=0;
mdcx.setTimeout = ''; // 延迟触发
mdcx.cxmxGridData = [];
mdcx.swryxx = {};
mdcx.zgswjgJc = '';

$(function () {
    mini.parse();

    mdcx.cxmxGrid = mini.get('mdcx-grid');
    mdcx.searchForm = new mini.Form('#mdcx-form');

    mdcx.init();
});

/* 初始化 */
mdcx.init = function () {
    mdcx.initSwjg();
};

/* 区局税务人员展示其从属的税务机关，超管展示所有税务机关 */
mdcx.initSwjg = function () {
    ajax.get(mdcxApi.getZgswjg, '', function (data) {
        if (data) {
            mdcx.zgswjgData = data;
            mini.get('zgswjgDm').loadList(data);
        } else {
            mini.alert('系统异常，请稍后再试~', '提示');
        }
    });

};

/* 主管税务机关valuechanged-展示主管税务机关下所有的所科分局信息 */
mdcx.handleOnvaluechanged = function (e) {
    mini.get('zgswskfjDm').setValue('');
    if (!e.value) return;
    var params = {
        zgswjgDm: e.value
    };
    ajax.post(mdcxApi.getZgswskfj, mini.encode(params), function (data) {
        if (data) {
            mdcx.zgswjgskfjData = data;
            mini.get('zgswskfjDm').loadList(data);
        } else {
            mini.alert('系统异常，请稍后再试~', '提示');
        }
    });
};

/* 查询 */
mdcx.handleSearch = function () {
    if (!mdcx.key) return;
    mdcx.hasKey();
    var form = mdcx.searchForm,
        grid = mdcx.cxmxGrid;
    if (!form.validate()) return;
    var formData = form.getDataAndText(),
        params = $.extend({}, {
            pageIndex: mdcx.pageIndex,
            pageSize: mdcx.pageSize || grid.getPageSize()
        }, formData);
    mdcx.zgswjgJc = formData.zgswjgDmText;
    grid.emptyText = "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
    ajax.post(mdcxApi.handleSearch, mini.encode(params), function (res) {
        if (res && res.success && res.value && res.resultMap) {
            mdcx.cxmxGridData = mdcx.formatDate(res.value);
            grid.setData(mdcx.cxmxGridData);
            mdcx.total = res.resultMap.totalNum;
            grid.setTotalCount(res.resultMap.totalNum);
        } else {
            mini.alert(res.message || '系统异常，请稍后再试~', '提示');
        }
    });
};


/* 导出 */
mdcx.handleDownload = function () {
    var form = mdcx.searchForm,
        grid = mdcx.cxmxGrid;
    if (!form.validate()) return;
    if(!mdcx.cxmxGridData.length){
        mini.alert("未获取到可导出的数据，请确认后重新操作！","提示");
        return
    }
    var params = $.extend({}, {
        pageIndex: mdcx.pageIndex,
        pageSize: mdcx.pageSize || grid.getPageSize()
    }, form.getData());
    location.href = mdcxApi.getExcel + '?pageIndex=' + params.pageIndex + '&pageSize=' + params.pageSize + '&nsrmc=' + params.nsrmc + '&nsrsbh=' + params.nsrsbh + '&zgswjgDm=' + params.zgswjgDm + '&zgswskfjDm=' + params.zgswskfjDm +'&total='+parseInt(mdcx.total);
};

/* 取消 */
mdcx.handleCancel = function () {
    mdcx.winIsShow(false);
};

/* 修改行 */
mdcx.handleEditRow = function () {
    var grid = mdcx.cxmxGrid,
        rows = grid.getSelecteds();
    if (rows.length !== 1) {
        mini.alert('请选择一笔数据进行修改。');
        return;
    }
    mdcx.addRowWinForm.reset();
    mdcx.initLrxx();
    mdcx.winIsShow(true);
    mdcx.addRowWinForm.setData(rows[0]);
    mdcx.handleSave = function () {
        var grid = mdcx.cxmxGrid,
            gridData = mdcx.cxmxGridData,
            rows = grid.getSelecteds();
        form = mdcx.addRowWinForm;
        if (!form.validate() || !mdcx.validDate() || !mdcx.validMoney()) return;
        var formData = form.getData(true);
        ajax.post(mdcxApi.handleEditSave, mini.encode(formData), function (res) {
            if (res && res.success && res.value) {
                var index = rows[0]._index;
                gridData.splice(index, 1, formData);
                grid.setData(gridData);
                mdcx.winIsShow(false);
                mdcx.showTips('修改成功', '', 'success', 1000);
            } else {
                mini.alert(res.message || '系统异常，请稍后再试~', '提示');
            }
        });
    };
};

/* 删除行 */
mdcx.handleRemoveRow = function () {
    var grid = mdcx.cxmxGrid,
        rows = grid.getSelecteds();
    if (!rows.length) {
        mini.alert('请至少选择一条数据进行删除。');
        return;
    }
    var params = {
        mdcxId: []
    };
    mini.confirm('请确认是否删除？', '提示', function (action) {
        if (action === 'ok') {
            for (var i = 0, len = rows.length; i < len; i += 1) {
                params.mdcxId.push(rows[i].mdcxId);
            }
            ajax.post(mdcxApi.handleRemove, mini.encode(params), function (res) {
                if (res && res.success && res.value) {
                    var temp = [];
                    for (var j = 0, lenj = mdcx.cxmxGridData.length; j < lenj; j += 1) {
                        var item = mdcx.cxmxGridData[j];
                        if (params.mdcxId.indexOf(item.mdcxId) < 0) temp.push(item);
                    }
                    mdcx.cxmxGridData = temp;
                    grid.loadData(mdcx.cxmxGridData);
                    mdcx.showTips('删除成功', '', 'success', 1000);
                } else {
                    mini.alert(res.message || '删除异常，请稍后再试~');
                }
            });
        }
    });
};

/* window是否显示 */
mdcx.winIsShow = function (flag) {
    flag ? mdcx.addRowWin.show() : mdcx.addRowWin.hide();
};

/* 点击树节点 */
mdcx.beforenodeselect = function (e) {
    //禁止选中父节点 e.tree.getParentNode(e.node)
    if (e.isLeaf === false) {
        e.cancel = e.node.ID.substr(-6) === '000000';
    }
};

/* 日期校验 */
mdcx.validDate = function () {
    var tar1 = mini.get('ysrqq'),
        tar2 = mini.get('ysrqz'),
        rqq = tar1.getValue(),
        rqz = tar2.getValue();
    if (!rqq || !rqz) return false;
    if (rqq > rqz) {
        if (mdcx.key) {
            /* 处理多次提示的触发 */
            mini.alert('预算日期起应小于预算日期止~');
            mdcx.hasKey();
        }
        mdcx.setIsValid(false, [tar1, tar2]);
        return false;
    }
    mdcx.setIsValid(true, [tar1, tar2]);
    return true;
};

/* 计算剩余预算金额 */
mdcx.setSyysje = function () {
    var ysje = mini.get('ysje').getValue(),
        yzxysje = mini.get('yzxysje').getValue() || '';
    // mini.get('syysje').setValue(''); /* 没有已执行预算金额 暂置空 */
    if (ysje) mini.get('syysje').setValue((ysje - yzxysje).toFixed(2));
};

/* 金额校验 */
mdcx.validMoney = function (e) {
    if (e) {
        var source = e.source,
            value = (+source.getValue()).toFixed(2);
        target = mini.get(source.getId());
        value = value.indexOf('NaN') >= 0 ? '0.00' : value;
        target.setValue(value);
    }
    mdcx.setSyysje();
    var tar1 = mini.get('ysje'),
        tar2 = mini.get('yjje'),
        ysje = tar1.getValue(),
        yjje = tar2.getValue();
    if (!ysje || !yjje) return false;
    if (+yjje > +ysje) {
        if (mdcx.key) {
            /* 处理多次提示的触发 */
            mini.alert('预警金额不能大于预算金额~');
            mdcx.hasKey();
        }
        mdcx.setIsValid(false, [tar1, tar2]);
        return false;
    }
    mdcx.setIsValid(true, [tar1, tar2]);
    return true;
};

mdcx.moneyOnfocus = function (e) {
    e && mini.get(e.source.getId()).setValue(e.source.getValue().replace('.00', ''));
};

/* 设置是否valid */
mdcx.setIsValid = function (flag, arr) {
    setTimeout(function () {
        for (var i = 0, len = arr.length; i < len; i += 1) {
            arr[i] && arr[i].setIsValid && arr[i].setIsValid(flag);
        }
    }, 50);
};

/* 分页设置 分页改变触发 */
mdcx.onpagechanged = function (e) {
    mdcx.pageIndex = e.pageIndex;
    mdcx.pageSize = e.pageSize;
    mdcx.handleSearch();
};
mdcx.onbeforeload = function (e) {
    e.cancel = true;
};

/* 防止多次点击 */
mdcx.hasKey = function () {
    mdcx.key = false;
    setTimeout(function () {
        mdcx.key = true;
    }, 1000);
};

/* 税务机关onchange触发 */
mdcx.zgswjgValueChanged = function (e) {
    mini.get('ysssswjgJc').setValue(e.source.getText());
};

/* 微提示 */
mdcx.showTips = function (title, content, type, time) {
    var _time = 3000;
    if (!!time) {
        _time = time;
    }
    mini.showTips({
        content: '<b>' + title + '</b><br/>' + content,
        state: type,
        x: 'center',
        y: 'top',
        offset: [0, 58],
        timeout: _time
    });
};

/*简称*/
mdcx.getSwjgJC = function (id, target) {
    var msg;
    for (var i = 0, len = target.length; i < len; i += 1) {
        var item = target[i];
        if (item.ID === id) {
            msg = item.MC;
            break;
        }
    }
    return msg;
};

/* 将对象里的日期对象进行格式化 */
mdcx.formatDate = function (arr, keys) {
    keys = keys || ['dateCreated'];
    arr = arr instanceof Array ? arr : [arr];
    if (!arr.length) return arr;
    for (var i = 0, len = arr.length; i < len; i += 1) {
        var obj = arr[i];
        obj.fjfl = '';
        if (obj.fl) obj.fjfl += mdcx.changeN(obj.fl) + '类';
        if (obj.fj) obj.fjfl += mdcx.changeN(obj.fj) + '级';
        obj.zgswjgMc = mdcx.zgswjgJc;
        obj.zgswskfjMc = mdcx.getSwjgJC(obj.zgswskfjDm, mdcx.zgswjgskfjData);
        for (var key in obj) {
            if (obj.hasOwnProperty(key) && keys.indexOf(key) >= 0) {
                if (typeof obj[key] === 'string') {
                    obj[key] = obj[key].replace(/-/g, '/');
                }
                obj[key] = new Date(obj[key]).format('yyyy-MM-dd hh:mm:ss');
            }
        }
    }
    return arr;
};

mdcx.changeN = function (num) {
    return num;
    // var arr1 = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    // var arr2 = ['', '十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千','万', '十', '百', '千','亿'];//可继续追加更高位转换值
    // if(!num || isNaN(num)){
    //     return "零";
    // }
    // var english = num.toString().split("");
    // var result = "";
    // for (var i = 0; i < english.length; i++) {
    //     var des_i = english.length - 1 - i;//倒序排列设值
    //     result = arr2[i] + result;
    //     var arr1_index = english[des_i];
    //     result = arr1[arr1_index] + result;
    // }
    // result = result.replace(/零(千|百|十)/g, '零').replace(/十零/g, '十');
    // result = result.replace(/零+/g, '零');
    // result = result.replace(/零亿/g, '亿').replace(/零万/g, '万');
    // result = result.replace(/亿万/g, '亿');
    // result = result.replace(/零+$/, '')
    // result = result.replace(/^一十/g, '十');
    // return result;
};

mdcx.renderAction = function (e) {
    var djxh = e.record.djxh;
    return '<span class="link" onclick="mdcx.showActionModal(\'' + djxh + '\')">详情</span>'
}
mdcx.showActionModal = function (djxh) {
    mini.get("xq_win").show();
    var grid = mini.get("xq-grid");
    var params = {
        djxh: djxh
    }
    grid.emptyText = "<span style='float: left;padding-right: 2%;color: #f00'>无记录</span>";
    ajax.post(mdcxApi.getXq, mini.encode(params), function (res) {
        if (res.success && res.value) {
            grid.setData(res.value);
            return
        }
        mini.alert(res.message || "暂无数据", "提示")
    })

}

/**
 * @method handleCancel 单击返回关闭详情弹出框
 */
function handleCancel() {
    mini.get("xq_win").hide();
}
