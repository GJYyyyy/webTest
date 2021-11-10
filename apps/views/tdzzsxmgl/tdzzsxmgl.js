/**
 * Created by liun on 2019/7/17.
 */
var tdzzs = {
    pageSize: 10,
    xmztList: [],
    nsrxxUrl: '/dzgzpt-wsys/api/wtgl/fcyth/queryNsrxx',
    searchUrl: '/dzgzpt-wsys/api/wtgl/fcyth/queryTdzzs',
    saveUrl: '/dzgzpt-wsys/api/wtgl/fcyth/saveTdzzs',
    data: [],
    nsrxx: null,
    init: function () {
        this.initSelect();
    },
    initSelect: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/fcyth/queryTdxmztDm',
            type: 'POST',
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                if (res.success !== undefined && !res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    if (res){
                        tdzzs.xmztList = res;
                    }
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
        mini.get('tdxmztDm').setData(tdzzs.xmztList);
    },
    getNsrxx: function (e) {
        if (e.value){
            var req = {
                nsrsbh: e.value
            };
            $.ajax({
                url: tdzzs.nsrxxUrl,
                type: "POST",
                data: mini.encode(req),
                contentType: 'application/json;charset=UTF-8',
                async: false,
                success: function (res) {
                    mini.unmask();
                    if(res.message==='ajaxSessionTimeOut'){
                        top.location.reload(true);
                        tdzzs.nsrxx = null;
                        return;
                    }
                    if (!res.success){
                        mini.alert(res.message || '系统出现故障，请稍后重试');
                        tdzzs.nsrxx = null;
                    } else {
                        tdzzs.nsrxx = res.value;
                    }
                },
                error: function (res) {
                    tdzzs.nsrxx = null;
                    mini.unmask();
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                }
            });
        } else {
            tdzzs.nsrxx = null;
        }
        tdzzs.queryAjax(true);
    },
    queryAjax: function (flag) {
        //先将查询结果和项目编号下拉列表置空
        tdzzs.data = [];
        if (flag){
            mini.get('xmbh').setValue('');
            mini.get('xmbh').setData([]);
        }
        //未填纳税人识别号则直接退出不调接口
        if (!(tdzzs.nsrxx && tdzzs.nsrxx.djxh)){
            mini.get('nsrmc').setValue('');
            return false;
        }
        //带出纳税人名称
        mini.get('nsrmc').setValue(tdzzs.nsrxx.nsrmc);
        var req = {
            djxh: tdzzs.nsrxx.djxh,
            tdxmztDm: mini.get('tdxmztDm').getValue() || ''
        };
        $.ajax({
            url: tdzzs.searchUrl,
            type: "POST",
            data: mini.encode(req),
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                if (!res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    if (res.value){
                        $.each(res.value,function () {
                            this.defaultZtDm = this.tdxmztDm;
                        })
                    }
                    tdzzs.data = res.value || [];
                    mini.get('xmbh').setValue('');
                    mini.get('xmbh').setData(tdzzs.data);
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    },
    search: function (pageIndex, pageSize) {
        var searchForm = new mini.Form('search-box');
        searchForm.validate();
        if (!searchForm.isValid()){
            return false;
        }
        var filterData = [];
        var xmzt = mini.get('tdxmztDm').getValue();
        var xmbh = mini.get('xmbh').getValue();
        $.each(tdzzs.data,function () {
            if ((!xmzt || (!!xmzt && this.tdxmztDm === xmzt)) && (!xmbh || (!!xmbh && this.tdzzsxmbh === xmbh))){
                filterData.push(this);
            }
        });
        var searchData = filterData.slice(pageSize*pageIndex, pageSize*(pageIndex+1));
        var grid = mini.get('xmxx_grid');
        grid.setTotalCount(tdzzs.data.length);
        grid.setPageSize(pageSize);
        grid.setPageIndex(pageIndex);
        grid.setData(searchData);
    },
    beforeLoad: function (e) {
        e.cancel = true;
        var pageIndex = e.data.pageIndex, pageSize = e.data.pageSize;
        tdzzs.pageSize = pageSize;
        tdzzs.search(pageIndex, pageSize);
    },
    cellBeginedit: function (e) {
        if (e.record.defaultZtDm === '04'){
            e.cancel = true;
        }
    },
    drawCell: function (e) {
        if (e.record.defaultZtDm !== '04'){
            if (e.field === 'tdxmztDm' || e.field === 'yzl'){
                e.cellCls = 'enable';
            }
        }
    },
    czRender: function (e) {
        var record = e.record;
        if (e.record.defaultZtDm === '04'){
            return '';
        }
        return '<a class="txt-blue" onclick="tdzzs.save(\''+record._uid+'\')">保存</a>'
    },
    save: function (uid) {
        var record = mini.get('xmxx_grid').getRowByUID(uid);
        if (!record.tdxmztDm){
            mini.alert('项目状态不能为空，请检查！');
            return false;
        }
        if (!record.yzl){
            mini.alert('预征率不能为空，请检查！');
            return false;
        }
        if (record.tdxmztDm === '04'){
            var message = '状态改为已注销后，将不可更改请确认是否保存';
        } else {
            var message = '是否保存';
        }
        mini.confirm(message, '提示', function (action) {
            if (action === 'ok'){
                tdzzs.doSave(record);
            }
        })
    },
    doSave: function (data) {
        var req = {
            djxh: data.djxh,
            tdzzsxmbh: data.tdzzsxmbh,
            tdxmztDm: data.tdxmztDm,
            yzl: data.yzl
        };
        $.ajax({
            url: tdzzs.saveUrl,
            type: "POST",
            data: mini.encode(req),
            contentType: 'application/json;charset=UTF-8',
            async: false,
            success: function (res) {
                mini.unmask();
                if(res.message==='ajaxSessionTimeOut'){
                    top.location.reload(true);
                    return;
                }
                if (!res.success){
                    mini.alert(res.message || '系统出现故障，请稍后重试');
                } else {
                    mini.alert('保存成功','提示',function () {
                        tdzzs.queryAjax();
                        tdzzs.search(0, tdzzs.pageSize);
                    });
                }
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统出现故障，请稍后重试');
            }
        });
    }
};
$(function () {
    tdzzs.init();
});
mini.VTypes["nsrsbhErrorText"] = "请输入正确的纳税人识别号";
