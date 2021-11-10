var qrjgdb = {
    initPage: function (record) {
        qrjgdb.queryGrid(record);
        qrjgdb.nowData = record
    },
    queryGrid: function (record) {
        $("#sqr").text(record.nsrsbh);
        $("#nsrmc").text(record.nsrmc);
        $("#cjsj").text(record.sqrq);
        $("#blqx").text(record.blqx);
        $("#wsh").text(record.wsh);

        $.ajax({
            url: '/dzgzpt-wsys/api/sh/fzjgdlns/query/dbxx',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: mini.encode({ sqxh: record.sqxh || '' }),
            success: function (data, textStatus, request) {
                if (!!data.success && data.value) {
                    $('#nsrsbh').html(data.value.nsrsbh);
                    $('#sqnsrmc').html(data.value.nsrmc);
                    $('#qcdzcdzxzqhszDm').html(data.value.qcswjgmc);
                    $('#qrdzcdzxzqhszDm').html(data.value.qrswjgmc);
                    $('#qcdzcdz').html(data.value.zcdz);
                    $('#qrdzcdz').html(data.value.zcdz);
                    $('#jbrmc').html(data.value.jbrmc);
                    $('#sjhm').html(data.value.jbrsjhm);
                    $('#zjhm').html(data.value.jbrzjhm);
                    $('#cktslx').html(data.value.cktslx == 'N' ? '否' : '是');
                } else {
                    mini.alert(data.message || '接口异常，请稍后重试');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    sxbj: function () {
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/fzjgdlns/sxbj',
            contentType: "application/json; charset=utf-8",
            type: 'POST',
            data: mini.encode({ sqxh: qrjgdb.nowData.sqxh, }),
            success: function (data, textStatus, request) {
                if (data.success) {
                    mini.alert("办结成功！", '提示信息', function () {
                        window.CloseOwnerWindow && window.CloseOwnerWindow('ok');
                    });
                } else {
                    mini.alert(data.message || '接口异常，请稍后重试');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    }
};

function setData(record) {
    qrjgdb.initPage(record)
}
