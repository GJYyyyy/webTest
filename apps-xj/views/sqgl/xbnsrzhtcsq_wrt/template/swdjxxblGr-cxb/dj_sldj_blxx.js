$(function () {
    mini.parse();
    slbl.init();
});
var formSffxqy = {};
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
    isYct: null,
    // djzclxDm: '',
    openTips: function () {
        mini.alert('目前选择的附属行业与系统推荐的附属行业不一致，请关注！');
    },
    init: function () {
        this.blxxForm = new mini.Form("#blxxForm");
        this.lcslId = mini.get('lcslId');
        this.parentlcslid = mini.get('parentlcslid');
        this.blztDm = mini.get('blztDm');
        this.rwztDm = mini.get('rwztDm');
        this.swsxDm = mini.get('swsxDm');
        this.zgswjDm = mini.get("zgswjDm");
        this.zgswskfjDm = mini.get("zgswskfjDm");

    },
    setData: function (lcslId, blztDm, rwztDm, isYct, viewData, childLcslId) {
        slbl.sqxh = lcslId;
        this.lcslId.setValue(childLcslId);
        this.blztDm.setValue(blztDm);
        this.rwztDm.setValue(rwztDm);
        this.swsxDm.setValue('110121');
        mini.get("kzztdjlxdm").setValue('1120');
        this.getSwjg();
        var formDataTemp = mini.decode(viewData);
        var formData = formSffxqy = (formDataTemp['110121'] || formDataTemp['110101'])['djxxbl-yl'];
        slbl.zzmc = formData.zzmc;
        //console.log(viewData)
        //mini.get('djzclxDm').setValue(formData.djzclxdm);
        formData.djzclxDm = formData.djzclxdm;
        // this.djzclxDm = formData.djzclxdm
        var fshyList = formData.fshyDm1.split(",");
        formData.fshyDm1 = fshyList[0];
        formData.fshyDm2 = fshyList[1];
        formData.fshyDm3 = fshyList[2];
        // formData.fshyDm1 = formData.hsfsDm

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
        if (formData.zgswskfjDm || slbl.ownKey) {
            var jdxzDm = mini.get("jdxzDm");
            jdxzDm.setValue("");
            jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + formData.zgswskfjDm || slbl.ownKey);
        }
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
                    slbl.doZgswjSelected();
                }
                var hydmNode = mini.get('hyDm').getSelectedNode()
                if (hydmNode && hydmNode.children && hydmNode.children.length > 0) {
                    mini.get('hyDm').setValue('');
                }
                // var fshyDm1 = mini.get('fshyDm1').getSelectedNode()
                // if (fshyDm1 && fshyDm1.children && fshyDm1.children.length > 0) {
                //     mini.get('fshyDm1').setValue('')
                // }
            }
        });


        $.ajax({
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
                                        "ID": data.value[i].id, "MC": data.value[i].mc, PID: "xttj", "zhdn": true
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


        $(".scjydzxzqhszDmText").text(formData.scjydzxzqhszDmText);

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

                    //纳税人所处街乡
                    mini.get("jdxzDm").setData(d);
                    mini.get("jdxzDm").setValue(formData.scjydzjdxzDm);
                }
            }
        });



        for (var e in formData) {
            if (!!$("#" + e)) {
                if (!!formData[e] && mini.get(e) && e !== 'zgswskfjDm') {
                    mini.get(e).setValue(formData[e]);
                }
            }
        }

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
    nextShowSwsxtzs: function () {
        //1.取补录信息数据
        var me = this, dataStr = '';
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
        $.ajax({
            type: "GET",
            url: "/sxsq-wsys/api/wtgl/xbnsrzhtcsq/checkFxxx?sqxh=" + slbl.sqxh + '&zzlxdm=' + slbl.zzmc,
            success: function (res) {
                if (!res.success) {
                    nextFlow();
                } else {
                    mini.confirm(res.value + '。请及时进行风险核查，点击确定继续受理，取消返回核查。', "提示", function (action) {
                        if (action == "ok") {
                            nextFlow();
                        } else {
                            return;
                        }
                    })
                }
            },
            error: function () {
                nextFlow();
            }
        });
        function nextFlow() {
            var blxxData = slbl.blxxForm.getData(true);
            // lcslid： 子事项流程实例id
            /**
             * ie8下重新赋值
             */
            blxxData.bzfsDm = '3'
            blxxData.gdghlxDm = '1'
            blxxData.nsrztDm = '03'
            // blxxData.djzclxDm = this.djzclxDm
            var data = {
                lcslid: slbl.lcslId.getValue(),
                blztDm: '01',
                rwztDm: '01',
                swsxDm: slbl.swsxDm.getValue(),
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
                            me.CloseWindow('ok')
                        })
                    } else {
                        Owner.swdjjg = false;
                        mini.alert(returnData.message);
                    }
                }
            });
        }
    },
    beforeGbyhSelect: function (e) {
        if (e.isLeaf == false) e.cancel = true;
    },
    beforenodeselect: function (e) {
        //禁止选中父节点
        // if (e.isLeaf == false) e.cancel = true;
    },
    beforeGbyhSelect1: function (e) {
        console.log(1);
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
        //                 if(data[i]['ID'].substring(data[i]['ID'].length-3) !== '004'){
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