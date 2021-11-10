/**
 * Created with JetBrains WebStorm
 * FileName: xbnsrtcsqSlView.js
 * Author: lizm
 * Date: 2019/4/21
 * Time: 17:48
 * Description:
 **/
 var xbtcsq = {
    selectSfxy: 'N',
    yhxxTab: false,
    allData:null,
    init: function () {
        var me = this;
        this.xbtcylTabs = mini.get('xbtc-yl-tabs');
        var data = sqzl.getPackViewData(sxsl_store.sqxh);
        this.allData = mini.clone(data);
        var subSwsxList = this.getSubSwsxList();
        this.viewDataObj = {};
        this.dataObj = {};
        var index = 0;
        $.each(data, function (i, v) {
            // 三方协议（110701）tab不展示 但在存款账户账号报告中的签订三方协议选中是
            if(v.swsxDm === '110701') {
                me.selectSfxy = 'Y';
                return;
            }
            // 判断是否有存款账户账号报告（110111）tab页
            if(v.swsxDm === '110111') {
                me.yhxxTab = true;
            }
            // 税（费）种认定不显示
            if(v.swsxDm === '11010201') {
                return;
            }
            var swsxCfg = subSwsxList[v.swsxDm];
            var ylView = swsxCfg ? swsxCfg['ylView'] : '';
            me.xbtcylTabs.addTab({
                title: swsxCfg.name,
                name: 'tab_' + v.swsxDm,
                body: !!ylView ? gldUtil.loadTemplate(ylView).replace(/url/g, 'data-url'):'未配置预览页面'
            }, i);
            me.viewDataObj[v.swsxDm] = mini.decode(v.viewData);
            me.dataObj[v.swsxDm] = mini.decode(v.data);
            if((v.swsxDm === '200006'||v.swsxDm === '700006') && me.viewDataObj[v.swsxDm].isOnlyDzfp) {
                $('.is-dzptfp').hide(); // 电子票隐藏税控商
            }
            index = i + 1;
        });
        me.xbtcylTabs.addTab({
            title: '实名发放信息',
            name: 'tab_' + 'smrz',
            body: gldUtil.loadTemplate('../../views/sqgl/xbnsrzhtcsq_wrt/template/xbtcSmrz.html').replace(/url/g, 'data-url')
        }, index);
        mini.parse('xbtc-yl-tabs');
        this.setSubSwsxViewData(me.viewDataObj, me.dataObj);
        // 单位纳税人，设置总分机构信息的显示
        var swdjxxblSqData = this.getSqDataBySwsxDm('110101');
        swdjxxblSqData && this.showZfjgxx(swdjxxblSqData.zfjglxDm);
        actionMethods.smtgRender()
        // if (urlParams.urlParams.isYct === '2') {
        //     $('#allTzbl-form').hide()
        // }
    },
    getSubSwsxList: function () {
        var subSwsxList;
        ajax.get('../../data/swsxDm.json', {},
            function (res) {
                subSwsxList = res[sxsl_store.swsxDm]['subSwsxList'];
            }
        );
        return subSwsxList;
    },
    /**
     * 根据税务事项代码获取申请数据
     * @param swsxDm
     * @returns {*}
     */
    getSqDataBySwsxDm:function(swsxDm){
        var data;
        $.each(this.allData,function (i,v) {
            if(swsxDm === v.swsxDm){
                data = JSON.parse(v.data);
                return;
            }
        });
        return data;
    },
    setSubSwsxViewData: function (viewDataObj, dataObj) {
        var subViewData, subData;
        for (var swsx in viewDataObj) {
            subViewData = viewDataObj[swsx];
            subData = dataObj[swsx];
            subViewData = typeof subViewData === 'string' ? JSON.parse(subViewData) : subViewData;
            subData = typeof subData === 'string' ? JSON.parse(subData) : subData;

            // dataObj

            if (viewDataObj.hasOwnProperty(swsx) && !$.isEmptyObject(subViewData)) {
                // 一般纳税人
                if(swsx === '110113'){
                    subViewData = {zzsybnsrdjDiv:subViewData};
                    var nsrlxDm = subViewData.zzsybnsrdjDiv.nsrlxDm;
                    if (subViewData.zzsybnsrdjDiv.nsrzyYwms) {
                        gldUtil.setMiniToolTip('nsrzyYwms',subViewData.zzsybnsrdjDiv.nsrzyYwms);
                    }
                    if(nsrlxDm === '04'){
                        $('.only-ybnsr').hide();
                    }
                    else if(nsrlxDm === '05'){
                        $('.only-ybnsr').show();
                    }
                }
                // 票种核定
                if (swsx === '200006'||swsx === '700006') {
                    try {

                        /* 管理端永远显示data中的发票数量 */
                        var gridData=mini.clone(subData.pzhdsqMxList);
                        // $.each(gridData,function(i,v){
                        //     v.myzggpsl=subData.pzhdsqMxList[i].myzggpsl;
                        //     v.mczggpsl=subData.pzhdsqMxList[i].mczggpsl;
                        //     v.cpzgsl=subData.pzhdsqMxList[i].cpzgsl;
                        // });
                        // mini.get('gzpz_grid_yl').setData(subData.ztbz ? subData.pzhdsqMxList : subViewData.pzhdsqMxList);
                        mini.get('gzpz_grid_yl').setData(gridData);
                        actionMethods.oldGzpzData=mini.clone(gridData);

                        mini.get('lpryl_grid').setData(subViewData.pzhdGprxxList);
                        console.log(subData)
                        mini.get('defpljgpje_yl').setValue(subData.defpljgpje);
                        mini.get('sqfwskkpsb_yl').setValue(subViewData.sqfwskkpsb);
                        // [一窗通数据]税控设备类型/服务商等于航天信息、百旺金赋、百望财税
                        if (subViewData.skfws === 'htxx' || subViewData.skfws === 'bwjf' || subViewData.skfws === 'bwcs') {
                            $(".is-dzptfp").show()
                            mini.get('skfws_yl').setValue(subViewData.skfws);
                        } else {
                            $(".is-dzptfp").hide()
                        }

                        // [一窗通数据]税控设备类型/服务商等于税务UKEY（免费）
                        if (subViewData.skfws === 'sw') {
                            $('#ukey_box_yl').show();
                            $('#zyps-info-yl').hide();
                            // 领取方式默认为上门领取
                            mini.get('lqfs_yl').setValue('smlq');
                        } else if (subViewData.ukLqfs) {
                            // ukey领取方式
                            var ukLqfs = subViewData.ukLqfs;
                            $('#ukey_box_yl').show();
                            mini.get('lqfs_yl').setValue(ukLqfs);
                            // 领取方式为专业配送
                            if (ukLqfs === 'zyps') {
                                var yjxx = subViewData.yjxx || {};
                                mini.get('receiverName_yl').setValue(yjxx.receiverName);
                                mini.get('receiverZjhm_yl').setValue(yjxx.zjhm);
                                mini.get('receiverLxdh_yl').setValue(yjxx.lxdh);
                                mini.get('postcode_yl').setValue(yjxx.postcode);
                                mini.get('city_yl').setValue(yjxx.citydm);
                                mini.get('county_yl').setValue(yjxx.county);
                                mini.get('address_yl').setValue(yjxx.address);
                                $('#zyps-info-yl').show();
                            } else {
                                $('#zyps-info-yl').hide();
                            }
                        } else {
                            $('#ukey_box_yl').hide();
                        }

                        $('#gzpz_gridYl2').find('.mini-grid-header').height(2);//隐藏最后一个表格表头
                    } catch (e) {
                        console.log(e)
                    }
                } else{
                    this.setViewData(subViewData, this.xbtcylTabs.getTabBodyEl('tab_' + swsx));
                }
                if(swsx === '110101' || swsx ==='110121') {
                    // 经营范围悬浮显示
                    gldUtil.setMiniToolTip('jyfw',mini.get('jyfw').getValue());
                    // 地址
                    gldUtil.setMiniToolTip('zcdz',mini.get('zcdz').getValue());
                    gldUtil.setMiniToolTip('scjydz',mini.get('scjydz').getValue());
                }
                if(swsx === '110111') {
                    // 开户银行悬浮显示
                    gldUtil.setMiniToolTip('ckzhzhbg-yhyywdDmText',mini.get('ckzhzhbg-yhyywdDmText').getValue());
                }
                if(swsx === '30010108') {
                    mini.get('kjsqdj-grid-yl').setData(subViewData['kjsqdj-grid-yl']);
                }
            }
        }
        mini.get('xbtc-yl-tabs').activeTab(0);
        // 三方协议信息写入存款账户账号报告
        if(this.yhxxTab) {
            mini.get('sfqdsfxy').setValue(this.selectSfxy)
        }
        if (this.selectSfxy === 'Y') {
            $('#sfxyxxViewDataYl').removeClass('hide-sfxyxx')
        }
    },
    setViewData: function (viewData, tabDom) {

        if (!viewData || $.isEmptyObject(viewData)) {
            mini.alert('未获取到申请资料数据', '提示');
            return false;
        } else {
            sqzl.content.show();
        }

        var elements = tabDom.querySelectorAll('[data-view-type]'),
            targetId = null,
            targetType = null,
            data = {};
        for (var i = 0, len = elements.length; i < len; i++) {
            targetId = elements[i].getAttribute('id');
            targetType = elements[i].getAttribute('data-view-type');
            if (!!targetType) {
                targetType = targetType.toLowerCase();
                if (targetType === 'form') {
                    var form = new mini.Form('#' + targetId);
                    data[targetId] = form.setData(viewData[targetId] || {});

                } else if (targetType === 'datagrid') {
                    targetId = elements[i].children[0].getAttribute('id') || $(elements[i]).children(0)._id();
                    if (!targetId) {
                        sqzl.throwError('data-view-type=datagrid 第一个子节点的id未获取到，请检查第一个子节点！');
                        return false;
                    }
                    var grid = mini.get(targetId);
                    if (!grid) {
                        sqzl.throwError('获取' + targetId + 'grid 失败，检查预览页面上是否有这个grid');
                    }
                    data[targetId] = grid.setData(viewData[targetId] || []);
                }
            }
        }
    },
    /**
     * 税务登记信息补录显示总分机构
     * @param lxdm
     */
    showZfjgxx:function (lxdm) {
        var $fzjg = $('#ylfzjgxx');
        var $zjg = $('#ylzjgxxForm');
        /*[{"id":"1","text":"总机构"},{"id":"2","text":"分支机构"},
        {"id":"3","text":"分总机构"},{"id":"0","text":"非总分机构"}]*/
        switch (lxdm) {
            case '1': // 总机构，显示分支机构
                $fzjg.show();
                $zjg.hide();
                break;
            case '2': // 分支机构，显示总机构
                $fzjg.hide();
                $zjg.show();
                break;
            case '3': // 分总机构，两个都显示
                $fzjg.show();
                $zjg.show();
                break;
            case '0': // 非总分机构，两个都不显示
                $fzjg.hide();
                $zjg.hide();
                break;
            default:
                $fzjg.hide();
                $zjg.hide();
                break;
        }
    }
};
$(function () {
    xbtcsq.init();
    actionMethods.initHdXX instanceof Function&&actionMethods.initHdXX();
});
