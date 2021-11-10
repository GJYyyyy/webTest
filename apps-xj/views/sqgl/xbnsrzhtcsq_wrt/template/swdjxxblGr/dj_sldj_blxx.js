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
    isYct: null,
    xzqhDm: '',
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
    setData: function (lcslId, blztDm, rwztDm, isYct,viewData,childLcslId, xzqhDm) {
        this.xzqhDm = xzqhDm
        this.lcslId.setValue(childLcslId);
        this.blztDm.setValue(blztDm);
        this.rwztDm.setValue(rwztDm);
        this.swsxDm.setValue('110121');
        mini.get("kzztdjlxdm").setValue('1120');
        this.getSwjg();
        var formDataTemp = mini.decode(viewData);
        var formData= formDataTemp['110121']['djxxbl-yl'];
        //console.log(viewData)
        //mini.get('djzclxDm').setValue(formData.djzclxdm);
        formData.djzclxDm=formData.djzclxdm;
        formData.fshyDm1 = formData.fshyDm1
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
                }
                var hydmNode = mini.get('hyDm').getSelectedNode()
                if (hydmNode && hydmNode.children && hydmNode.children.length > 0) {
                    mini.get('hyDm').setValue('')
                }
                var fshyDm1 = mini.get('fshyDm1').getSelectedNode()
                if (fshyDm1 && fshyDm1.children && fshyDm1.children.length > 0) {
                    mini.get('fshyDm1').setValue('')
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
        // lcslid： 子事项流程实例id
        /**
         * ie8下重新赋值
         */
        blxxData.bzfsDm = '3'
        blxxData.gdghlxDm = '1'
        blxxData.nsrztDm = '03'
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
                    })
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