/*
 * @Author: zhaojn
 * @Date: 2019-08-28 19:48:34
 * @LastEditTime: 2019-09-06 13:59:35
 */
var formSffxqy = {};
$(function () {
    mini.parse();
    slbl.init();
});


// 数组去重
function uniq(array) {
    var temp = []; //一个新的临时数组
    var tempid = [];
    for (var i = 0; i < array.length; i++) {
        if (temp.indexOf(array[i]) == -1 && tempid.indexOf(array[i]['ID']) == -1) {
            tempid.push(array[i]['ID']);
            temp.push(array[i]);
        }
    }
    return temp;
}
var slbl = {
    blxxForm: null,
    lcslId: null,
    parentlcslid: null,
    blztDm: null,
    rwztDm: null,
    zgswjDm: null,
    zgswskfjDm: null,
    // djzclxDm: '',
    isYct: null,
    selectDjxh: '',
    sydt_isShow: false,
    sydt_url: '',
    formData: {},
    viewData: {},
    openTips: function () {
        mini.alert('目前选择的附属行业与系统推荐的附属行业不一致，请关注！！');
    },
    init: function () {
        this.blxxForm = new mini.Form("#blxxForm");
        this.lcslId = mini.get('lcslId');
        this.parentlcslid = mini.get('parentlcslid');
        this.blztDm = mini.get('blztDm');
        this.rwztDm = mini.get('rwztDm');
        this.swsxDm = mini.get('swsxDm');
        this.isYct = mini.get('isYct');
        this.zgswjDm = mini.get("zgswjDm");
        this.zgswskfjDm = mini.get("zgswskfjDm");

        store.setSession('hasShowTips', '');
        $('#sydt').hide();
        $('.sydt_isShow').hide();
    },
    setData: function (lcslId, blztDm, rwztDm, isYct, viewData, childLcslid, djxh) {
        // 保存外部传入的djxh
        slbl.selectDjxh = djxh
        slbl.sqxh = lcslId
        this.lcslId.setValue(childLcslid);
        this.blztDm.setValue(blztDm);
        this.rwztDm.setValue(rwztDm);
        this.swsxDm.setValue('110101');
        mini.get('zzjglxDm').setValue('1');
        this.getSwjg();
        var formDataTemp = mini.decode(viewData);
        this.viewData = formDataTemp;
        var tzfxx = formDataTemp['110101']['yltzfxxGrid'] || [];//投资方信息
        mini.get("tzf_grid").setData(tzfxx);

        var formData = formSffxqy = formDataTemp['110101']['djxxbl-yl'];
        formData.djzclxDm = formData.djzclxdm;
        // this.djzclxDm = formData.djzclxdm
        var fshyList = formData.fshyDm1 ? formData.fshyDm1.split(",") : [];
        formData.fshyDm1 = fshyList[0];
        formData.fshyDm2 = fshyList[1];
        formData.fshyDm3 = fshyList[2];
        this.formData = formData;
        // formData.fshyDm1 = formData.hsfsDm
        // mini.get('djzclxDm').setValue(formData.djzclxdm);
        // console.log(tzfxx)
        $(".tzf_btn").click(function () {
            mini.get("tzf-win").show();
        });
        $.ajax({ //* 设置basecode相关数据
            type: 'GET',
            url: "/dzgzpt-wsys/api/baseCode/get/baseCodeTree/DM_GY_HY_GT3",
            async: false,
            success: function (dataList) {
                if (dataList && dataList.length) {
                    $.ajax({
                        contentType: 'application/json',
                        type: "POST",
                        url: "/dzgzpt-wsys/api/sh/zhh/dj/getFhyDmList",
                        async: false,
                        data: JSON.stringify({
                            "jyfw": formData["jyfw"],
                            "nsrmc": formData["nsrmc"],
                            "hyDm": formData["hyDm"],
                            "swjgCode": mini.get('zgswjDm').getValue()
                        }),
                        success: function (data) {
                            if (data.success) {
                                var values = [{
                                    "ID": "xttj",
                                    "MC": "系统推荐",
                                    "expanded": true
                                }];
                                for (var i = 0; i < data.value.length; i++) {
                                    values.push({
                                        "ID": data.value[i].id, "MC": data.value[i].mc, PID: "xttj", 'zhdn': true
                                    })
                                }
                                var loadListArr = uniq(values.concat(dataList));
                                mini.get('fshyDm3').loadList(loadListArr, 'ID', 'PID');
                                mini.get('fshyDm1').loadList(loadListArr, 'ID', 'PID');
                                mini.get('fshyDm2').loadList(loadListArr, 'ID', 'PID');
                            }
                        }
                    });
                }
            }
        });
        for (var e in formData) { //* 修改了所有字段的取值，取之viewData
            if (!!$("#" + e)) {
                if (!!formData[e] && mini.get(e) && e !== 'zgswskfjDm') {
                    mini.get(e).setValue(formData[e]);
                }
            }
        }
        $(".zcdzxzqhdmText").text(formData.zcdzxzqhdmText);
        $(".scjydzxzqhszDmText").text(formData.scjydzxzqhszDmText);
        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/baseCode/get/jdxzByXzqhszdm/" + formData.zcdzxzqhdm,
            success: function (data) {
                var result = [];
                if (data) {
                    var d = data[0].children;
                    if (data[0].ID === '310117000') {
                        d.unshift({ PID: '310117', ID: '310117000', MC: '松江区' });
                    }
                    mini.get("jdxz1").setData(d);
                    mini.get("jdxz1").setValue(formData.zcdzjdxzDm);

                    //纳税人所处街乡
                    mini.get("jdxzDm").setData(d);
                    mini.get("jdxzDm").setValue(formData.zcdzjdxzDm);
                }
            }
        });
        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/baseCode/get/jdxzByXzqhszdm/" + formData.scjydzxzqhszDm,
            success: function (data) {
                var result = [];
                if (data) {
                    var d = data[0].children;
                    if (data[0].ID === '310117000') {
                        d.unshift({ PID: '310117', ID: '310117000', MC: '松江区' });
                    }
                    mini.get("jdxz2").setData(d);
                    mini.get("jdxz2").setValue(formData.scjydzjdxzDm);
                }
            }
        });
        $.ajax({
            type: "post",
            async: false,
            url: "/dzgzpt-wsys/api/sh/zhh/dj/getZgswskfj",
            data: {
                'viewData': viewData
            },
            success: function (res) {
                if (res.success) {
                    if (!$.isEmptyObject(res.value)) {
                        for (var key in res.value) {
                            slbl.ownKey = key;
                            mini.get('zgswskfjDm').setValue(key);
                        }
                    }
                    // formData.zgswskfjDm = res.value && res.value.zgswskfjDm;
                }
            }
        });
        // if(formData.zgswskfjDm || slbl.ownKey){
        //     var jdxzDm = mini.get("jdxzDm");
        //     jdxzDm.setValue("");
        //     jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + formData.zgswskfjDm || slbl.ownKey);
        // }

        mini.mask('加载中...');
        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/baseCode/get/SwjgQx",
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                mini.unmask();
                if (data) {
                    mini.get('zgswjDmText').setValue(data.SWJGJC || data.MC);
                    mini.get('zgswjDm').setValue(data.ID);
                    if (data.ID && '13101150000,13101060000,13101140000,13102270000'.indexOf(data.ID) > -1) { //* zhy 当主管税务机关为“浦东新区税务局”、“嘉定区税务局”、“松江区税务局”、“静安区税务局”时，注册地地址后方增加地图图标及税源地图管户分配推荐按钮
                        //? 国家税务总局上海市浦东新区税务局（13101150000）、国家税务总局上海市静安区税务局（13101060000）、国家税务总局上海市嘉定区税务局（13101140000）、国家税务总局上海市松江区税务局（13102270000）
                        //* zhy 地图图标及税源地图管户分配推荐按钮 的展示由后端控制
                        $.ajax({
                            type: "GET",
                            async: false,
                            url: "/dzgzpt-wsys/api/sfzrd/getSystemParam/showSydt",
                            success: function (res) {
                                if (res.success && res.value) { //* 请求成功，并且value有值时， 展示图标
                                    slbl.sydt_url = res.value;
                                    $('#sydt').show();
                                }
                            }
                        });
                    }
                    slbl.doZgswjSelected();
                    var hydmNode = mini.get('hyDm').getSelectedNode()
                    if (hydmNode && hydmNode.children && hydmNode.children.length > 0) {
                        mini.get('hyDm').setValue('')
                    }
                    // var fshyDm1 = mini.get('fshyDm1').getSelectedNode()
                    // if (fshyDm1 && fshyDm1.children && fshyDm1.children.length > 0) {
                    //     mini.get('fshyDm1').setValue('')
                    // }
                }
            }
        });

        var pzslList = [];
        $.get("/dzgzpt-wsys/api/baseCode/get/baseCodeTree/DM_GY_GSXZGLJG_GT3", "", function (res) {
            pzslList = res || [];
            pzslList.push({ ID: '0000', MC: '民政部门', PID: '' });
            mini.get('pzsljgdm').loadList(pzslList);
            if (formData.pzsljgdmName === '民政部门') {
                mini.get('pzsljgdm').setValue('0000');
            } else {
                $.each(pzslList, function (i, v) {
                    if (v.MC === formData.pzsljgdmName) {
                        mini.get('pzsljgdm').setValue(v.ID);
                        return false;
                    }
                })
            }
        });

    },
    // 纳税人所处街乡
    cxCjsslZgjg: function () {
        var count = 0;
        var blxxData = this.blxxForm.getData(true);
        var me = this;
        $.ajax({
            url: "/dzgzpt-wsys/api/sh/zhh/dj/queryCjsslZgjg?jdxzDm=" + blxxData.jdxzDm,
            type: "GET",
            async: false, // 改成同步
            success: function (data) {
                if (data.success) {
                    var resValue = data.value || [];
                    count = resValue.length;
                    if (count === 1) {
                        blxxData['cjssl'] = resValue[0].cjssl;
                        me.realShowSwsxtzs(blxxData);
                    } else if (count > 1) {
                        var dataSet = [];
                        for (var i = 0; i < resValue.length; i++) {
                            dataSet.push({ "id": resValue[i].cjssl, "text": resValue[i].cjssl });
                        }
                        mini.get('cjssl').setData(dataSet);
                        mini.get('cjssl').setValue('');
                        mini.get('cjsslWin').show();
                    } else {
                        blxxData['cjssl'] = '';
                        me.realShowSwsxtzs(blxxData);
                    }
                }
            }
        })

        return count;
    },
    closeCjsslWin: function () {
        if (mini.get('cjssl').validate()) {
            var blxxData = this.blxxForm.getData(true);
            blxxData['cjssl'] = mini.get('cjssl').getValue();
            mini.get('cjsslWin').hide();
            this.realShowSwsxtzs(blxxData);
        }
    },
    nextShowSwsxtzs: function () {
        var dataStr = '';
        //1.取补录信息数据
        this.blxxForm.validate();
        if (!this.blxxForm.isValid()) {
            return;
        }
        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/sh/zjypt/querySffxqy?sfzjhm=" + formSffxqy.fddbrsfzjhm + '&sfzjlx=' + formSffxqy.fddbrsfzjzl,
            success: function (res) {
                if (res.success) {
                    dataStr = res.value || ''
                }
            }
        });
        // 纳税人所处乡镇街道对应一个城建税税率,直接受理
        $.ajax({
            type: "GET",
            url: "/sxsq-wsys/api/wtgl/xbnsrzhtcsq/checkFxxx?sqxh=" + slbl.sqxh + '&zzlxdm=' + mini.get('zzmc').getValue(),
            success: function (res) {
                if (!res.success) {
                    slbl.cxCjsslZgjg();
                } else {
                    mini.confirm(res.value + '。请及时进行风险核查，点击确定继续受理，取消返回核查。' + dataStr, "提示", function (action) {
                        if (action == "ok") {
                            slbl.cxCjsslZgjg();
                        } else {
                            return;
                        }
                    })
                }
            },
            error: function () {
                slbl.cxCjsslZgjg();
            }
        });

    },
    hideSydt: function () { //* zhy 隐藏税源地图
        $('.sydt_isShow').hide();
        this.sydt_isShow = false;
    },
    sydt: function () { //* zhy
        //* 点击图标或文字后，弹出提示：“请确认登记注册类型是否正确，该字段可能影响推荐结果。”下设按钮【确定】【取消】，点击确定后，在下方展示推荐结果及地图信息。----------注意此提示只展示一次。
        var _this = this;
        var hasShowTips = store.getSession('hasShowTips');
        if (!hasShowTips) {
            mini.showMessageBox({
                width: 250,
                title: "提示",
                buttons: ["确认", "取消"],
                message: '请确认登记注册类型是否正确，该字段可能影响推荐结果。',
                callback: function (action) {
                    store.setSession('hasShowTips', 'Y');
                    if (action === '确认') {
                        _this.queryGhxx();
                    }
                }
            });
            return;
        }
        if (!this.sydt_isShow) {
            _this.queryGhxx();
        } else {
            _this.hideSydt();
        }
    },
    queryGhxx: function () { //* zhy 查看 建议分配管理所 的数据
        var iframe = $('#sydt_iframe');
        var map = '上海市' + mini.get("jdxz1").getText() + mini.get("zcdz").getValue()
        var ip = 'http://78.12.181.81:9107'
        if (store.getSession('test_hg') || location.host === '10.199.140.70:8080') {
            ip = 'http://10.199.140.171:8094';
        }
        iframe.attr({ src: ip + this.sydt_url + '?initValue=' + map })
        $('.sydt_isShow').show();
        this.sydt_isShow = true;
        var fzjgsl = Array.isArray(this.viewData[110101].ylfzjgxxGrid) ? this.viewData[110101].ylfzjgxxGrid.length : 0
        //* 建议分配管理所为智慧大脑返回的数据（调大脑接口，传入【注册地详细地址】【纳税人名称】【经营范围】【主营行业代码】【分支机构数量】【登记注册类型】【注册资本】）
        var json = {
            djxh: this.selectDjxh,
            djzclxdm: mini.get('djzclxDm').getValue(),
            fzjgsl: fzjgsl,
            jyfw: mini.get('jyfw').getValue(),
            nsrmc: this.formData.nsrmc,
            swjgCode: mini.get('zgswjDm').getValue(),
            zcdz: mini.get('zcdz').getValue(),
            zczb: this.formData.zczb,
            zhy_dm: mini.get('hyDm').getValue(),
        };
        $.ajax({
            type: "POST",
            url: "/dzgzpt-wsys/api/sfzrd/queryGhxx",
            data: mini.encode(json),
            contentType: "application/json; charset=UTF-8",
            async: false,
            success: function (res) {
                if (res.success && res.value) {
                    $('#jyfpgls').text(res.value.swjgmc || '暂无数据')
                    mini.get('zgswskfjDm').setValue(res.value.swjgdm); //* zhy 167561 调用智慧大脑接口，获取建议分配管理所后，自动预填【主管税务所（科）】字段，可修改
                } else {
                    mini.alert("查询当前税务人员主管税务局失败!!!");
                }
            }
        });
    },
    realShowSwsxtzs: function (blxxData) {
        var me = this;
        blxxData.bzfsDm = '3';
        // blxxData.djzclxDm = this.djzclxDm
        blxxData.gdghlxDm = '1';
        blxxData.nsrztDm = '03';
        if (slbl.selectDjxh) {
            blxxData.djxh = slbl.selectDjxh
        }
        // lcslid： 子事项流程实例id
        var data = {
            lcslid: this.lcslId.getValue(),
            blztDm: '01',
            rwztDm: '01',
            swsxDm: this.swsxDm.getValue(),
            blxxData: mini.encode(blxxData)
        }
        mini.mask('受理中...');
        $.ajax({
            type: "POST",
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/sxsl/xbnsrtc",
            contentType: 'application/json',
            dataType: 'json',
            data: JSON.stringify(data),
            success: function (data) {
                mini.unmask();
                var returnData = mini.decode(data);
                if (returnData.success) {
                    Owner.swdjjg = true;
                    mini.alert('受理成功', '提示', function (res) {
                        me.djxh = returnData.resultMap.djxh;
                        me.CloseWindow('ok');
                    });
                } else {
                    Owner.swdjjg = false;
                    mini.alert(returnData.message || '受理失败', '提示', function (res) {
                        me.CloseWindow('ok');
                    });
                    // mini.alert(returnData.message);
                }
            }
        });
    },
    beforeGbyhSelect: function (e) {
        if (e.isLeaf == false) {
            e.cancel = true;
        }
    },

    beforeGbyhSelect1: function (e) {
        if (!e.value) {
            $("#notice1").hide();
            return;
        }

        if (e.value === mini.get("fshyDm2").getValue() || e.value === mini.get("fshyDm3").getValue()) {
            mini.alert('附属行业【' + e.sender.getSelectedNode().MC + "】已经存在，请勿重复选择！", "", function () {
                mini.get("fshyDm1").setValue("");
            });
            return;
        }

        if (!e.sender.getSelectedNode().zhdn) {
            $("#notice1").show();
        } else {
            $("#notice1").hide()
        }

    },
    beforeGbyhSelect2: function (e) {
        if (!e.value) {
            $("#notice2").hide();
            return;
        }

        if (e.value === mini.get("fshyDm1").getValue() || e.value === mini.get("fshyDm3").getValue()) {
            mini.alert('附行业【' + e.sender.getSelectedNode().MC + "】已经存在，请勿重复选择！", "", function () {
                mini.get("fshyDm2").setValue("");
            });
            return;
        }

        if (!e.sender.getSelectedNode().zhdn) {
            $("#notice2").show();
        } else {
            $("#notice2").hide()
        }

    },
    beforeGbyhSelect3: function (e) {
        if (!e.value) {
            $("#notice3").hide();
            return;
        }

        if (e.value === mini.get("fshyDm1").getValue() || e.value === mini.get("fshyDm2").getValue()) {
            mini.alert('附行业【' + e.sender.getSelectedNode().MC + "】已经存在，请勿重复选择！", "", function () {
                mini.get("fshyDm3").setValue("");
            });
            return;
        }


        if (!e.sender.getSelectedNode().zhdn) {
            $("#notice3").show();
        } else {
            $("#notice3").hide()
        }

    },
    beforenodeselect: function (e) {
        //禁止选中父节点
        // if (e.isLeaf == false) e.cancel = true;
    },
    getSwjg: function () {
        $.ajax({
            type: "POST",
            url: "/dzgzpt-wsys/api/wtgl/public/login/session",
            data: {},
            async: false,
            success: function (data) {
                var returnData = mini.decode(data);
                if (returnData.success) {
                    var rtnData = mini.decode(returnData.value);
                    slbl.zgswjDm.setValue(rtnData.swjgDm);//当前税务人员主管税务局

                } else {
                    mini.alert("查询当前税务人员主管税务局失败!!!");
                }
            }
        });
    },
    CloseWindow: function (action) {
        if (window.CloseOwnerWindow)
            return window.CloseOwnerWindow(action);
        else
            window.close();
    },
    onCancel: function (e) {
        mini.Cookie.set("isSm", "shi");
        slbl.CloseWindow("cancel");
    },
    doZgswjSelected: function (e) {
        var gszgswjgJDm = slbl.zgswjDm.getValue();
        if (!gszgswjgJDm) {
            return;
        }
        // slbl.zgswskfjDm.setValue("");
        slbl.zgswskfjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/HbSwjgKs/" + gszgswjgJDm);
        if (slbl.ownKey) {
            slbl.zgswskfjDm.setValue(slbl.ownKey);
        }
    },
    doZgswjkfjSelected: function (e) {
        var gszgswjgJDm = slbl.zgswskfjDm.getValue();
        if (!gszgswjgJDm) {
            return;
        }
        // var jdxzDm = mini.get("jdxzDm");
        // jdxzDm.setValue("");
        // $.ajax({
        //     type: "GET",
        //     url: "/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + gszgswjgJDm,
        //     success: function (data) {
        //         mini.unmask();
        //         var result = [];
        //         if(data) {
        //             for (var i = 0; i < data.length; i++) {
        //                 if(data[i]['ID'].substring(data[i]['ID'].length-3) !== '000'){
        //                     result.push(data[i]);
        //                 }
        //             }
        //             jdxzDm.setData(result);
        //         }
        //     }
        // });
        // jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + gszgswjgJDm);
        /** 
         * 查询拟分配的管理所是否有户籍管理岗岗位的人员
         * 如果有户籍管理岗人员则不弹出提示信息
         * 没有户籍管理岗人员的，需要弹出提示信息：“您选择的主管税务所（科、分局）下没有户籍管理岗岗位人员，
         * 将不会发起管户分配流程。”点击弹出框中的确认按钮关闭弹出框可继续进行办理
         * */
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/list/assigngw/" + gszgswjgJDm,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: {},
            type: 'GET',
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    if (res.value && res.value.length === 0) {
                        mini.alert('您选择的主管税务所（科、分局）下没有户籍管理岗岗位人员，将不会发起管户分配流程。')
                    }
                } else {
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    }

}

// function nextShowSwsxtzs() {
//     //1.取补录信息数据
//     var blxxForm = new mini.Form("#blxxForm");
//     blxxForm.validate();
//     if (!blxxForm.isValid()) {
//         return;
//     }
//     var blxxData = blxxForm.getData(true);
//     delete blxxData.jyfw;
//     blxxData.zgswjDm = mini.get("zgswskfjDm").getValue().substr(0,7)+'0000';
//     blxxData.gdghlxDm = '1';
//     blxxData.bzfsDm = '3';
//     CloseWindow(blxxData);
// }

// function setData(rwbh) {
//     var sqxh = rwbh.sqxh;
//     var lcslId = rwbh.lcslId;
//     var swsxDm = rwbh.swsxDm;
//     var rwztDm = rwbh.rwztDm;
//     mini.get("sqxh").setValue(sqxh);
//     mini.get("lcslId").setValue(lcslId);
//     mini.get("rwbh").setValue(rwbh1);
//     mini.get("swsxDm").setValue(swsxDm);
//     mini.get("kzztdjlxdm").setValue('1120');

//     var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
//     var wssqData = querySubWssqViewData(sqxh);
//     var formData = mini.decode(wssqData);

//     for (var e in formData) {
//         if (!!$("#" + e)) {
// 			if(!!formData[e]){
// 				$("#" + e).text(formData[e]);
// 			}                       
//         }
//     }
//     getSwjg();
//     doZgswjSelected();

// }

// function doZgswjSelected(e) {
//     var gszgswjgJDm = mini.get("zgswjDm").getValue();
//     if (!gszgswjgJDm) {
//         return;
//     }

//     var nsrSwjgDm = mini.get("zgswskfjDm");
//     nsrSwjgDm.setValue("");
//     //nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/SwjgKs/" + gszgswjgJDm);
//     nsrSwjgDm.setUrl("/dzgzpt-wsys/api/baseCode/get/HbSwjgKs/" + gszgswjgJDm);
// }
// function doZgswjkfjSelected(e) {
//     var gszgswjgJDm = mini.get("zgswskfjDm").getValue();
//     if (!gszgswjgJDm) {
//         return;
//     }

//     var jdxzDm = mini.get("jdxzDm");
//     jdxzDm.setValue("");
//     jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + gszgswjgJDm);
// }