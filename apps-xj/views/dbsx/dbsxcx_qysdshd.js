function doSearch(th) {
    var tabid = th.id;
    if (tabid != 'search') {
        $(".tab-bar .active").removeClass("active");
        //防止cookie被修改
        if (document.getElementById(tabid)) {
            document.getElementById(tabid).className = 'active';
        } else {
            document.getElementById('sydb').className = 'active';
        }
    }
    var tabid = $(".tab-bar .active")[0].id;//获取当选选中的tabs
    mini.Cookie.set("ctableid", tabid);//存入缓存中
    //中软待办显示中软待办的查询条件
    if (tabid === 'zrdb') {
        $("#zrdbcxTable").show();
        $("#qtcxTable").hide();


        $("#dblbzr").show();
        $("#dblb").hide();
        $("#dblbkq").hide();
        $("#dblbfpsl").hide();
    } else if (tabid === 'kqydb') {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();


        $("#dblbkq").show();
        $("#dblbfpsl").hide();
        $("#dblb").hide();
        $("#dblbzr").hide();
    } else if (tabid === 'fply') {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();


        $("#dblbzr").hide();
        $("#dblbfpsl").show();
        $("#dblbkq").hide();
        $("#dblb").hide();
    } else {
        $("#qtcxTable").show();
        $("#zrdbcxTable").hide();


        $("#dblbzr").hide();
        $("#dblbkq").hide();
        $("#dblbfpsl").hide();
        $("#dblb").show();
    }
    ;
    var swsx = '';
    var lqfsDm = '';
    if (tabid == 'wcjyzmkj') {
        swsx = '跨区域经营证明开具';
    }
    if (tabid == 'swdjxxbldb') {
        swsx = '税务登记信息补录';
    }
    if (tabid == 'fplyldb') {
        swsx = '领用';
    }
    if (tabid == 'zzszpdkldb') {
        swsx = '增值税专用发票代开';
    }
    if (tabid == 'swxzxk') {
        swsx = '税务行政许可';
    }
    if (tabid == 'gtgshdehd') {
        swsx = '个体工商户定额核定';
    }
    if (tabid == 'zzsyhjmba') {
        swsx = '增值税税收减免备案申请';
    }
    if (tabid == 'zzsjzjtba') {
        swsx = '增值税即征即退备案';
    }
    if (tabid == 'xfsssjmba') {
        swsx = '消费税税收减免备案';
    }
    if (tabid == 'bgswdj') {
        swsx = '变更税务登记';
    }
    if (tabid == "swdjxxbl") {
        swsx = "税务登记信息补录";
    }
    if (tabid == "fply") {
        swsx = "发票领用";
        if (tabid == "fply") {
            lqfsDm = '03'
        }
    }


    var form = new mini.Form("#cxtjForm");
    var formData = form.getData(true);
    var loginuserid = getSession().userId;
    mini.Cookie.set(loginuserid+"searchCondition",mini.encode(formData));
    // var param = mini.encode(formData);
    // console.log(param);


    if (tabid !== 'zrdb') {
        if (tabid !== 'kqydb') {
            if (tabid == 'fply') {
                var data = {
                    nsrsbh: formData.nsrsbh,
                    wsh: formData.wsh,
                    sdrqQ: formData.sdrqQ,
                    sdrqZ: formData.sdrqZ,
                    swsxDm: formData.swsxdm,
                    zgswskfjDm: formData.swjgdm,
                    blqxQ: formData.blqxQ,
                    blqxZ: formData.blqxZ
                }
                gridzr = mini.get("dbsxGridfpsldb");
                gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryZzfplyDbsx");
                gridzr.load({
                    rwlxDm: '01',
                    data: mini.encode(data),
                }, function () {
                    $(".searchdiv").slideUp();
                }, function (data) {
                    var obj = JSON.parse(data.errorMsg);
                    mini.alert(obj.message || "系统异常,请稍后再试。")
                });
                $('#dblbfpsl').height($('#dblb').height());//设置待办表格高度,因初始化没有值表格不会被撑开
            } else {
                var data = {
                    nsrsbh: formData.nsrsbh,
                    wsh: formData.wsh,
                    sdrqQ: formData.sdrqQ,
                    sdrqZ: formData.sdrqZ,
                    swsxDm: '30090110',
                    qysdshd: true, /* 是否是 单独的企业所得税核定 事项 */
                    zgswskfjDm: formData.swjgdm,
                    blqxQ: formData.blqxQ,
                    blqxZ: formData.blqxZ
                }
                grid.load({
                    rwlxDm: '01',
                    data: mini.encode(data),
                    swsxmc: swsx,
                    lqfsDm: lqfsDm
                }, function () {
                    $(".searchdiv").slideUp();
                }, function (data) {
                    var obj = JSON.parse(data.errorMsg);
                    mini.alert(obj.message || "系统异常,请稍后再试。")
                });
            }
        } else {
            var data = {
                nsrsbh: formData.nsrsbh,
                wsh: formData.wsh,
                sdrqQ: formData.sdrqQ,
                sdrqZ: formData.sdrqZ,
                swsxDm: formData.swsxdm,
                zgswskfjDm: formData.swjgdm,
                blqxQ: formData.blqxQ,
                blqxZ: formData.blqxZ
            }
            gridzr = mini.get("dbsxGridkqdb");
            gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryKqyDbsx");
            gridzr.load({
                rwlxDm: '01',
                data: mini.encode(data),
            }, function () {
                $(".searchdiv").slideUp();
            }, function (data) {
                var obj = JSON.parse(data.errorMsg);
                mini.alert(obj.message || "系统异常,请稍后再试。")
            });
            $('#dblbkq').height($('#dblb').height());//设置待办表格高度,因初始化没有值表格不会被撑开

        }
        ;
    } else {
        if (mini.get('sqrqq').getFormValue() == "") {
            mini.get('sqrqq').setValue(getFirstDayOfMonth());
            mini.get('sqrqz').setValue(getNowFormatDate());
        }
        ;
        var sqq = mini.get('sqrqq').getValue().getTime();
        var sqz = mini.get('sqrqz').getValue().getTime();
        var rs = (sqz - sqq) / (1000 * 60 * 60 * 24);
        if (rs > 30) {
            mini.alert("申请时间间隔不可超过30天，请重新选择！");
            return false;
        }
        formData = form.getData(true);
        var data = {
            nsrsbh: formData.nsrsbm,
            sxdl: formData.xmdl,
            sxzl: formData.xmzl,
            sxxl: formData.xmxl,
            sssxxm: formData.sssxxm,
            wsh: formData.wshm,
            sqsjQ: formData.sqrqq,
            sqsjZ: formData.sqrqz,
        };

        gridzr = mini.get("dbsxGridzrdb");
        gridzr.setUrl("../../../../api/xj/wtgl/dbsx/queryWtDbsx");
        gridzr.load({
            rwlxDm: '01',
            data: mini.encode(data),
        }, function () {
            $(".searchdiv").slideUp();
        }, function (data) {
            var obj = JSON.parse(data.errorMsg);
            mini.alert(obj.message || "系统异常,请稍后再试。")
        });
        $('#dblbzr').height($('#dblb').height());//设置中软待办表格高度,因初始化没有值表格不会被撑开

    }
}
