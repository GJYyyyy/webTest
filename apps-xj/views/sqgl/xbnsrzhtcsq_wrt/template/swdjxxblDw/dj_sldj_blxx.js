$(function () {
    mini.parse();
    slbl.init();
});
var slbl = {
    blxxForm: null,
    lcslId: null,
    parentlcslid: null,
    blztDm: null,
    rwztDm: null,
    zgswjDm: null,
    zgswskfjDm: null,
    xzqhDm: '',
    isYct: null,
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
    },
    setData: function (lcslId, blztDm, rwztDm, isYct,viewData,childLcslid,xzqhDm) {
        this.xzqhDm = xzqhDm
        this.lcslId.setValue(childLcslid);
        this.blztDm.setValue(blztDm);
        this.rwztDm.setValue(rwztDm);
        this.swsxDm.setValue('110101');
        mini.get('zzjglxDm').setValue('1');
        this.getSwjg();
        var formDataTemp = mini.decode(viewData);
        var tzfxx = formDataTemp['110101']['yltzfxxGrid'];
        var formData= formDataTemp['110101']['djxxbl-yl'];
        formData.djzclxDm=formData.djzclxdm;
        formData.fshyDm1 = formData.fshyDm1
       // mini.get('djzclxDm').setValue(formData.djzclxdm);
        // console.log(tzfxx)
        for (var e in formData) {
            if (!!$("#" + e)) {
                if(!!formData[e] && mini.get(e)){
                    mini.get(e).setValue(formData[e]);
                }                       
            }
        }
        mini.mask('加载中...');
        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/baseCode/get/SwjgQx",
            contentType: 'application/json', 
            dataType: 'json', 
            success: function (data) {
                mini.unmask();
                if(data) {
                    mini.get('zgswjDmText').setValue(data.MC);
                    mini.get('zgswjDm').setValue(data.ID);
                    slbl.doZgswjSelected();
                    var hydmNode = mini.get('hyDm').getSelectedNode()
                    if (hydmNode && hydmNode.children && hydmNode.children.length > 0) {
                        mini.get('hyDm').setValue('')
                    }
                    var fshyDm1 = mini.get('fshyDm1').getSelectedNode()
                    if (fshyDm1 && fshyDm1.children && fshyDm1.children.length > 0) {
                        mini.get('fshyDm1').setValue('')
                    }
                }
            }
        });
        var data = mini.get('pzsljgdm').tree.data
        data.push({ID:'0000',MC:'民政部门',PID:''});
        mini.get('pzsljgdm').setData(data)
        if (formData.pzsljgdmName === '民政部门') {
            mini.get('pzsljgdm').setValue('0000')
        }
    },
    nextShowSwsxtzs: function (){
        //1.取补录信息数据
        var me = this;
        this.blxxForm.validate();
        if (!this.blxxForm.isValid()) {
            return;
        }
        var blxxData = this.blxxForm.getData(true);
        blxxData.bzfsDm = '3'
        blxxData.gdghlxDm = '1'
        blxxData.nsrztDm = '03'
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
                    mini.alert('受理成功', '提示', function(res){
                        me.CloseWindow('ok')
                    });
                } else {
                    mini.alert(returnData.message);
                }
            }
        });
    },
    beforeGbyhSelect: function (e) {
        if (e.isLeaf == false) e.cancel = true;
    },
    beforenodeselect:function(e) {
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
                    var rtnData= mini.decode(returnData.value);
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
        slbl.zgswskfjDm.setValue("");
        slbl.zgswskfjDm.setUrl("/dzgzpt-wsys/api/baseCode/get/HbSwjgKs/" + gszgswjgJDm);
    },
    doZgswjkfjSelected: function (e) {
        var gszgswjgJDm = slbl.zgswskfjDm.getValue();
        if (!gszgswjgJDm) {
            return;
        }
        var jdxzDm = mini.get("jdxzDm");
        jdxzDm.setValue("");
        /**
         * /dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect3?codename=DM_GY_JDXZ&dlName=XZQHSZ_DM&dlValue={xzqhDm}
         */
        jdxzDm.setUrl("/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect3?codename=DM_GY_JDXZ&dlName=XZQHSZ_DM&dlValue=" + slbl.xzqhDm);
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