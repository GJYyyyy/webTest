var smrzList = {
    sqxh: '',
    nsrmc: '',
    nsrsbh: '',
    selectItem: '',
    getQyryxxGrid: function () {
        var qyryxxGrid = mini.get('qyryxxGrid')
        mini.mask('加载中...');
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/list/bindryxx/" + smrzList.sqxh,
            data: '',
            type: 'get',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    var newArr = []
                    for (var i = 0; i < res.value.length; i++) {
                        var e = res.value[i];
                        newArr.push({
                            roleName: e.roleName,
                            nsrmc: e.nsrmc,
                            nsrsbh: e.nsrsbh,
                            sfzjhm: e.bsryInfo.sfzjhm,
                            sfzjlxmc: e.sfzjlxmc,
                            sfzjlxDm: e.bsryInfo.sfzjlxDm,
                            xm: e.bsryInfo.xm,
                            isCheckPass: e.isCheckPass ? '是' : '否'
                        })
                    }
                    qyryxxGrid.setData(newArr);
                } else {
                    mini.alert(res.message, '提示信息');
                }
                mini.unmask();
            },
            error: function (res) {
                mini.unmask();
                mini.alert(res.message || '系统异常请稍后再试', '提示信息');
            }
        });
    },
    setData: function (sqxh, nsrmc, nsrsbh, djxh) {
        smrzList.nsrmc = nsrmc;
        smrzList.nsrsbh = nsrsbh;
        smrzList.sqxh = sqxh;
        smrzList.djxh = djxh;
        smrzList.init();
    },
    rlbd: function (sfzjlxDm, sfzjhm, xm ) {
        var data = {
            zfzjlx: sfzjlxDm,
            sfzjhm: sfzjhm,
            bsyxm: xm,
            qymc: smrzList.nsrmc,
            shxydm: smrzList.nsrsbh,
            djxh: smrzList.djxh
        };
        store.setSession('xbtcSmrzData', data);
        mini.open({
            showMaxButton: true,
            title: "实名认证",
            url: '/yhzx-gld/yhgl.html#/xbqySmrz',
            showModal: true,
            width: "90%",
            height: "90%",
            onload: function () {
                // var iframe = this.getIFrameEl();
            },
            ondestroy: function (res) {
                /**
                 * 关闭人脸比对的弹框
                 */
                store.removeSession('xbtcSmrzData');
                var action = res.action
                var smrzxxId = res.smrzxxId
                if (action == "ok") {
                    // var smrzxxId = mini.Cookie.get("smrzxxId");
                    mini.mask('加载中...')
                    $.ajax({
                        url: "/dzgzpt-wsys/api/wtgl/smrz/save",
                        data: {
                            lcslId: smrzList.sqxh,
                            smrzId: smrzxxId
                        },
                        type: 'post',
                        success: function (res) {
                            res = mini.decode(res);
                            mini.unmask()
                            if (!res.success) {
                                mini.alert(res.message, '提示信息')
                            }
                        },
                        error: function (res) {
                            mini.unmask()
                            mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                        }
                    })
                }
            }
        })
    },
    onActionRenderer: function (e) {
        var record = e.record;
        var sfzjlxDm = record.sfzjlxDm
        var sfzjhm = record.sfzjhm
        var xm = record.xm
        return '<a class="Delete_Button" onclick="smrzList.rlbd(\'' + sfzjlxDm
        + '\',\'' + sfzjhm + '\',\'' + xm + '\')" href="#">人脸对比</a>';
    },
    init: function (params) {
        $('#qyryxxNsrmc').text(smrzList.nsrmc);
        $('#qyryxxNsrsbh').text(smrzList.nsrsbh);
        smrzList.getQyryxxGrid();
    }
}