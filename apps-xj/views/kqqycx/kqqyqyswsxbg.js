var submitDjxh = {};
var sqjksftg = '';
var messageBox; // 迁移次数监控 提示弹窗
var qyType = 'N';
var kqqyqyswsxbg = {
    xzqhList: [],
    apiService: {
        cxApi: '/dzgzpt-wsys/api/wtgl/skpgm/query/skpgmxx'
    },
    initPage: function () {
        //下载按钮不可点击
        mini.get('slBtn').setEnabled(false);
        mini.get('dysltzsBtn').setEnabled(false);
        mini.get('dysxbgdBtn').setEnabled(false);
        // 选中元素
        this.elementSelect();
        // 绑定事件
        this.bindEvent();
        var that = this;
        ajax.get('/hgzx-gld/api/hgzx/kqqyqy/query/shXzqhSwjg', {}, function (res) {
            if (res.success && res.value.length > 0) {
                mini.get('bghXzqh').setData(res.value);
                mini.get("zgswjgDm").setData(res.value);
                kqqyqyswsxbg.xzqhList = res.value || [];
            }
        });
    },
    // 显示 纳税人迁移记录
    showGrid: function (record) {
        var that = this;
        mini.hideMessageBox(messageBox);
        mini.open({
            url: './nsrqyjl.html',
            title: '纳税人迁移记录',      //标题
            iconCls: '',    //标题图标
            width: 1000,      //宽度
            // height: 500,     //高度
            allowResize: false,       //允许尺寸调节
            allowDrag: false,         //允许拖拽位置
            showCloseButton: true,   //显示关闭按钮
            showMaxButton: true,     //显示最大化按钮
            showModal: true,         //显示遮罩
            currentWindow: false,      //是否在本地弹出页面,默认false
            effect: 'slow',              //打开和关闭时的特果:'none','slow','fast',默认'none'
            onload: function () {       //弹出页面加载完成
                var iframe = this.getIFrameEl();
                iframe.contentWindow.SetData(record);
            },
            ondestroy: function (action) {  //弹出页面关闭前
                if (action == 'ok') { // 确定
                    qyType = 'Y';
                    that.queryGrid(); // 查询信息接口方法
                } else { // 取消
                    kqqyqyswsxbg.resetData(); // 重置
                }
            }
        });
    },
    // 当sqxh 有值时。需要调 后端记录日志的接口
    acceptancelogRz: function () {
        var paramsRz = $.extend({}, {
            nsrsbh: submitDjxh.nsrxx.nsrsbh,
            sqxh: submitDjxh.sqxh,
            sfjk: qyType,
        });
        $.ajax({
            url: '/dzgzpt-wsys/api/kqqy/takenotes/acceptancelog',
            type: "post",
            data: mini.encode(paramsRz),
            contentType: 'application/json;charset=UTF-8',
            success: function (res) {
            }
        })
    },
    bindEvent: function () {
        var that = this;
        // 点击 查询
        this.$search_ele.on('click', function () {
            if (that.validataForm()) {
                var params = $.extend({}, {
                    nsrsbh: mini.get('nsrsbh-search').getValue()
                });
                $.ajax({
                    url: "/dzgzpt-wsys/api/kqqy/alidate/beforehand",
                    type: "post",
                    data: mini.encode(params),
                    contentType: 'application/json;charset=UTF-8',
                    async: false,
                    success: function (data) {
                        if (data.success && data.value.whether) {
                            messageBox = mini.showMessageBox({
                                width: 448,
                                title: "提示",
                                buttons: [],
                                html: "<div style='font-size: 15px;line-height: 28px;'> 请注意：该纳税人30天内已有" + data.value.total + "次迁移记录！企业可能通过快速迁移、快速注销逃避税收管理，请关注受理风险！点击 " +
                                    "<a class='Delete_Button' onclick='kqqyqyswsxbg.showGrid(" + JSON.stringify(data.value.data) + ")' href='#'>查看详情</a> 确定继续受理，取消返回核查。</div>",
                                callback: function (action) {
                                    that.queryGrid()
                                }
                            });
                        } else {
                            that.queryGrid()
                        }
                    },
                    err: function () {

                    }
                });
            }
        });
        this.$reset.on('click', function () {
            kqqyqyswsxbg.resetData();
        });
        this.nsrsbh_ele.on('input', function (value) {
            if (value.length > 20) {
                return false
            }
        });
        this.$slBtn.on('click', function () {
            if (mini.get('bsry').getValue() == '') {
                mini.alert('请选择办税人员！');
            } else if (mini.get('bghXzqh').getValue() == '') {
                mini.alert('请选择迁入地行政区划！');
            } else if (mini.get('qrddz').getValue() == '') {
                mini.alert('请输入迁入地地址！');
            } else if (kqqyqyswsxbg.zgswjDm === mini.get("zgswjgDm").getValue() || (['13101410000', '13101152100'].indexOf(kqqyqyswsxbg.zgswjDm) > -1 && mini.get("zgswjgDm").getValue() === '13101150000') || (['13101410000', '13101152100'].indexOf(mini.get("zgswjgDm").getValue()) > -1 && kqqyqyswsxbg.zgswjDm === '13101150000')) {
                mini.alert('系统检测到您的迁入地主管税务机关与您当前的主管税务机关一致，未发生变更，无法受理！');
            } else {
                if (kqqyqyswsxbg.xzqh !== mini.get("bghXzqh").getValue() || kqqyqyswsxbg.zcdz !== mini.get("qrddz").getValue()) {
                    mini.confirm('系统查询到当前企业的工商登记注册地址和您申请的迁入地信息不一致，请确认是否提交！', '提示', function (res) {
                        if (res === 'ok') {
                            $.ajax({
                                url: "/dzgzpt-wsys/api/sh/zhxxbg/get/blcs/" + kqqyqyswsxbg.nsrsbh_ele.getValue(),
                                type: 'GET',
                                success: function (data, textStatus, request) {
                                    if (data.success) {
                                        if (data.value) {
                                            that.prepareValidate();
                                        } else {
                                            mini.alert('您当天申请已达最高次数3次，请隔天再次操作', '提示');
                                        }
                                    } else {
                                        mini.alert('接口异常，请稍后重试', '提示');
                                    }
                                },
                                error: function (error) {
                                    mini.alert(error.message || '接口异常，请稍后重试');
                                }
                            });

                        }
                    });
                } else {
                    $.ajax({
                        url: "/dzgzpt-wsys/api/sh/zhxxbg/get/blcs/" + kqqyqyswsxbg.nsrsbh_ele.getValue(),
                        type: 'GET',
                        success: function (data, textStatus, request) {
                            if (data.success) {
                                if (data.value) {
                                    that.prepareValidate();
                                } else {
                                    mini.alert('您当天申请已达最高次数3次，请隔天再次操作', '提示');
                                }
                            } else {
                                mini.alert('接口异常，请稍后重试', '提示');
                            }
                        },
                        error: function (error) {
                            mini.alert(error.message || '接口异常，请稍后重试');
                        }
                    });
                }
            }
        });
        this.$dysltzsBtn.on('click', function () {
            window.open('/dzgzpt-wsys/api/sh/zhxxbg/downloadSxslTzs?sqxh=' + submitDjxh.sqxh);
        });
        this.$dysxbgdBtn.on('click', function () {
            window.open('/dzgzpt-wsys/api/sh/zhxxbg/downloadSxbgd?sqxh=' + submitDjxh.sqxh);
        });
        this.$dybysltzsBtn.on('click', function () {
            window.open('/dzgzpt-wsys/api/sh/zhxxbg/downloadSxslTzs?sqxh=' + submitDjxh.sqxh);
        });
    },
    validataForm: function () {
        var nsrsbhValue = this.nsrsbh_ele.getValue() + ''
        if (nsrsbhValue.length < 15 || nsrsbhValue.length > 20) {
            mini.alert('纳税人识别号不正确，请重新输入！');
            return false
        }
        return true;
    },
    elementSelect: function () {
        this.$search_ele = mini.get('search');
        this.$reset = $('#reset');
        this.$slBtn = mini.get('slBtn');
        this.$dysltzsBtn = mini.get('dysltzsBtn');
        this.$dysxbgdBtn = mini.get('dysxbgdBtn');
        this.$dybysltzsBtn = mini.get('dybysltzsBtn');
        this.nsrsbh_ele = mini.get('#nsrsbh-search');
        $('#dybysltzsBtn').hide();
    },
    queryGrid: function () {
        var newThis = this;
        $.ajax({
            url: "/dzgzpt-wsys/api/sh/zhxxbg/datb/init?nsrsbh=" + this.nsrsbh_ele.getValue(),
            type: 'GET',
            success: function (data, textStatus, request) {
                if (!!data.success && data.value) {
                    //按钮可点击
                    mini.get('slBtn').setEnabled(true);
                    mini.get('dysltzsBtn').setEnabled(false);
                    mini.get('dysxbgdBtn').setEnabled(false);
                    submitDjxh = data.value;
                    //表格赋值
                    $('#nsrsbh').html(data.value.nsrxx.nsrsbh);
                    $('#nsrmc').html(data.value.nsrxx.nsrmc);
                    $('#cktslx').html(data.value.cktslx == 'N' ? '否' : '是');
                    mini.get('bsry').setData(data.value.bsryxx);
                    $('#qcddz').html(data.value.nsrxx.zcdz);
                    kqqyqyswsxbg.zgswjDm = data.value.nsrxx.zgswjDm;
                    kqqyqyswsxbg.zcdz = data.value.gsxx.zcdz;
                    kqqyqyswsxbg.xzqh = data.value.gsxx.zcdzxzqhdm;
                    ajax.get('/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_GY_XZQH_GT3', {}, function (dataXzqh) {
                        submitDjxh.xzqhData = dataXzqh;
                        $('#bgqXzqh').html(newThis.getMcById(dataXzqh, data.value.nsrxx.zcdzxzqhszDm));
                    });
                    mini.get('bghXzqh').setValue(data.value.gsxx.zcdzxzqhdm);
                    mini.get('qrddz').setValue(data.value.gsxx.zcdz);
                    for (var f = 0; f < kqqyqyswsxbg.xzqhList.length; f++) {
                        if (kqqyqyswsxbg.xzqhList[f].xzqhDm === data.value.gsxx.zcdzxzqhdm) {
                            mini.get("zgswjgDm").setValue(kqqyqyswsxbg.xzqhList[f].swjgDm);
                            break;
                        }
                    }
                    /*$.ajax({
                        url: "/dzgzpt-wsys/api/sh/zhxxbg/get/baseCode/swjgByXzqh/" + data.value.gsxx.zcdzxzqhdm,
                        type: 'GET',
                        success: function (data, textStatus, request) {
                            if (data) {
                                mini.get("zgswjgDm").setData(data);
                                mini.get("zgswjgDm").setValue(data[0].ID);
                            }
                        },
                        error:function(error){
                            mini.alert(error.message || '接口异常，请稍后重试');
                        }
                    });*/
                } else {
                    mini.alert(data.message || '接口异常，请稍后重试');
                }
            },
            error: function (error) {
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    prepareValidateApi: '/dzgzpt-wsys/api/sh/zhxxbg/beforehand?nsrsbh=',
    prepareValidate: function () {
        var resultData = {};
        var that = this;
        var url = this.prepareValidateApi + this.nsrsbh_ele.getValue() + '&qrZgswjgdm=' + mini.get("zgswjgDm").getValue();
        mini.mask('系统正在进行事前监控校验，请稍候...');
        this.asyncGet(url, {}, function (result) {
            mini.unmask();
            if (!result.success) {
                mini.alert(result.message, '提示', function () {
                    // wssq.closeWin();
                });
                return;
            }
            if (!result.value || result.value.ruleResults.length === 0) {
                that.queryGrid();
                return;
            }
            //由于智数中心返回errorcount不正确，暂时自己计算 begin
            var errorCount = 0;
            var resultCount = 0;
            var cfjkbtg = 0;
            var errorResult = [];
            var isNull = true; //是否都为空标识
            var needCloseWin = false; // 是否需要关闭整个功能页面
            var data = result.value.ruleResults;
            var sqjkDjxh = result.value.djxh;
            for (var i = 0; i < data.length; i++) {
                if (!data[i].resultValue && data[i].ruleDegree == '01') {
                    errorResult[resultCount] = data[i];
                    resultCount++;
                    errorCount++;
                    needCloseWin = true;
                    if (data[i].ruleId == '3013010321') {
                        cfjkbtg++;
                    }
                }
                if (!data[i].resultValue && data[i].ruleDegree == '02') {
                    errorResult[resultCount] = data[i];
                    resultCount++;
                    errorCount++;
                }
            }
            for (var j = 0; j < errorResult.length; j++) {
                if (!!errorResult[j].resultUrl) {
                    isNull = false;
                }
            }
            result.value.ruleErrorCount = errorCount;   //由于智数中心返回errorcount不正确，暂时自己计算
            result.value.ruleResults = errorResult; // 只保留校验不通过的数据
            resultData = result.value;
            // 校验不通过的项目大于0条就弹窗提示
            if (errorCount > 0) {
                $('#dybysltzsBtn').show();
                submitDjxh.sqxh = result.resultMap.sqxh;
                sqjksftg = 'N';
                mini.get('bsry').setReadOnly(true);
                mini.get('bghXzqh').setReadOnly(true);
                mini.get('qrddz').setReadOnly(true);
                mini.get('nsrsbh-search').setReadOnly(true);
                mini.get('search').setEnabled(false);
                that.$dybysltzsBtn = mini.get('dybysltzsBtn');
                mini.open({
                    url: './validationWin.html',        //页面地址
                    title: '事项监控',      //标题
                    width: 1000,      //宽度
                    height: 600,     //高度
                    allowResize: false,       //允许尺寸调节
                    allowDrag: true,         //允许拖拽位置
                    showCloseButton: false,   //显示关闭按钮
                    showMaxButton: false,     //显示最大化按钮
                    showModal: true,         //显示遮罩
                    currentWindow: false,      //是否在本地弹出页面,默认false
                    onload: function () {       //弹出页面加载完成
                        var iframe = this.getIFrameEl();
                        //调用弹出页面方法进行初始化
                        var data = mini.clone(resultData);
                        iframe.contentWindow.initValidateGrid(data, isNull, needCloseWin, sqjkDjxh);
                        if (errorCount == 1 && cfjkbtg == 1) {
                            kqqyqyswsxbg.resetData();
                        } else {
                            that.prepareValidatePass('N');
                        }
                    },
                    ondestroy: function (e) {

                        if (needCloseWin) {
                            // that.prepareValidatePass();
                            /*mini.get('nsrsbh-search').setValue('');
                            mini.get('bsry').setValue('');
                            mini.get('bghXzqh').setValue('');
                            mini.get('qrddz').setValue('');
                            $('#zjhm').html('');
                            $('#lxrdh').html('');
                            $('#nsrsbh').html('');
                            $('#nsrmc').html('');
                            $('#cktslx').html('');
                            $('#bgqXzqh').html('');
                            $('#qcddz').html('');
                            mini.get('slBtn').setEnabled(false);
                            mini.get('dysltzsBtn').setEnabled(false);
                            mini.get('dysxbgdBtn').setEnabled(false);*/
                        } else {
                            // that.queryGrid();
                        }
                    }
                });
                
            } else {
                sqjksftg = 'Y';
                $('#dybysltzsBtn').hide();
                that.prepareValidatePass('Y');
            }
        }, function (err) {
            mini.unmask();
            mini.alert('事前监控服务调用发生异常，请您稍后重试！', '提示', function () {
                // wssq.closeWin();
            });
        });

    },
    prepareValidatePass: function (type) {
        var that = this;
        mini.mask('正在提交，请稍候...');
        var qcdSwjgMc = '';
        for (var f = 0; f < kqqyqyswsxbg.xzqhList.length; f++) {
            if (kqqyqyswsxbg.xzqhList[f].swjgDm === submitDjxh.nsrxx.zgswjDm) {
                qcdSwjgMc = kqqyqyswsxbg.xzqhList[f].swjgMc;
                break;
            }
        }
        $.ajax({
            url: '/dzgzpt-wsys/api/sh/zhxxbg/submit?nsrsbh=' + $('#nsrsbh').html(),
            type: 'POST',
            contentType: 'application/json; charset=UTF-8',
            async: true,
            data:
                mini.encode({
                    data: JSON.stringify({
                        sqjksftg: sqjksftg,
                        qdlx: 'gld',
                        nsrsbh: submitDjxh.nsrxx.nsrsbh,
                        nsrmc: submitDjxh.nsrxx.nsrmc,
                        qcdzcdzxzqhszDm: submitDjxh.nsrxx.zcdzxzqhszDm,
                        qcdzcdzxzqhszmc: $('#bgqXzqh').html(),
                        qrdzcdzxzqhszDm: mini.get('bghXzqh').getValue(),
                        qrdzcdzxzqhszmc: mini.get('bghXzqh').getText(),
                        qcdzcdz: submitDjxh.nsrxx.scjydz,
                        qrdzcdz: mini.get('qrddz').getValue(),
                        sqrq: that.newDateParse(),
                        zjhm: kqqyqyswsxbg.zjhm,
                        sjhm: kqqyqyswsxbg.lxrdh,
                        jbrmc: mini.get('bsry').getText(),
                        swjgDm: mini.get("zgswjgDm").getValue(),
                        swjgMc: mini.get("zgswjgDm").getText(),
                        qcdswjgDm: submitDjxh.nsrxx.zgswjDm,
                        qcdSwjgMc: qcdSwjgMc,
                        dataSource: [
                            {
                                zjhm: $('#zjhm').html(),
                                sjhm: $('#lxrdh').html(),
                                jbrmc: mini.get('bsry').getText(),
                                zjhmText: $('#zjhm').html(),
                                sjhmText: $('#lxrdh').html()
                            }
                        ]
                    }),
                    djxh: submitDjxh.djxh,
                    fbzlList: "[]",
                    lqfsDm: "",
                    sqxh: submitDjxh.sqxh,
                    stepConfig: '[{"id":0,"title":"填写申请表"},{"id":1,"title":"上传附报资料"},{"id":2,"title":"预览提交","yltj":true},{"id":3,"title":"审核中"},{"id":4,"title":"完成"}]',
                    yjDdxxDto: ""
                })
            ,
            success: function (res, textStatus, request) {
                mini.unmask();
                if (res.success && res.value) {
                    if (type === 'Y') {
                        mini.alert('受理成功！', '提示', function () {
                            mini.get('bsry').setReadOnly(true);
                            mini.get('bghXzqh').setReadOnly(true);
                            mini.get('qrddz').setReadOnly(true);
                            mini.get('nsrsbh-search').setReadOnly(true);
                            mini.get('search').setEnabled(false);
                            /*$('#zjhm').html('');
                            $('#nsrsbh').html('');
                            $('#nsrmc').html('');
                            $('#cktslx').html('');
                            $('#bgqXzqh').html('');
                            $('#qcddz').html('');
                            $('#lxrdh').html('');*/
                        });
                    } else {
                        mini.get('bsry').setReadOnly(true);
                        mini.get('bghXzqh').setReadOnly(true);
                        mini.get('qrddz').setReadOnly(true);
                        mini.get('nsrsbh-search').setReadOnly(true);
                        mini.get('search').setEnabled(false);
                    }
                    submitDjxh.sqxh = res.value;
                    if (sqjksftg === 'Y') {
                        mini.get('dysltzsBtn').setEnabled(true);
                        mini.get('dysxbgdBtn').setEnabled(true);
                    } else {

                    }
                    mini.get('slBtn').setEnabled(false);
                    that.acceptancelogRz() // 有sqxh时
                } else {
                    mini.alert(res.message ? ('受理失败' + res.message) : '受理失败，请稍后尝试');
                }
            },
            error: function (error) {
                mini.unmask();
                mini.alert(error.message || '接口异常，请稍后重试');
            }
        });
    },
    asyncGet: function (url, params, successCallback, errCallback) {
        this.executeAjax(true, 'get', url, params, successCallback, errCallback);
    },
    executeAjax: function (async, method, url, params, successCallback, errCallback) {
        if (!errCallback) {
            // 默认的ajax error 回调函数
            errCallback = function (req, st) {
                var msg = getLocalMessage(req, st);
                mini.alert(msg);
                return false;
            }
        }
        $.ajax({
            type: method,
            url: url,
            data: params,
            async: async,
            success: function (res) {
                if (res.message === 'ajaxSessionTimeOut') {
                    mini.alert('由于您长时间未操作，登录信息已失效，请重新登录！');
                    window.console && console.log(this.url + '接口超时');
                    return;
                }
                ajax.response = res;
                successCallback(res);
            },
            error: function (req, st) {
                if (!req.message) {
                    req.message = getLocalMessage(req, st) || '系统出现异常，请联系运维人员或稍后重试！';
                }
                errCallback(req, st);
            }
        });
    },
    jbrChanged: function (e) {
        var _this = this;
        if (!e.value) {
            mini.get('bsry').setValue('');
        }
        for (var jbrnum = 0; jbrnum < _this.data.length; jbrnum++) {
            if (_this.data[jbrnum].jbrmc == e.value) {
                kqqyqyswsxbg.zjhm = _this.data[jbrnum].zjhm;
                kqqyqyswsxbg.lxrdh = _this.data[jbrnum].sjhm;
                $('#zjhm').html(_this.data[jbrnum].zjhm);
                $('#lxrdh').html(_this.data[jbrnum].sjhm);
                break;
            }
        }
    },
    zgswjgDmChanged: function (e) {
        var value = e.value;
        if (!value) {
            mini.get("bghXzqh").setValue('');
            mini.get("zgswjgDm").setValue('');
        } else {
            mini.get("bghXzqh").setValue(value);
            for (var f = 0; f < kqqyqyswsxbg.xzqhList.length; f++) {
                if (kqqyqyswsxbg.xzqhList[f].xzqhDm === value) {
                    mini.get("zgswjgDm").setValue(kqqyqyswsxbg.xzqhList[f].swjgDm);
                    break;
                }
            }
            // mini.get("zgswjgDm").setValue('');
            /*$.ajax({
                url: "/dzgzpt-wsys/api/sh/zhxxbg/get/baseCode/swjgByXzqh/" + value,
                type: 'GET',
                success: function (data, textStatus, request) {
                    if (data) {
                        mini.get("zgswjgDm").setData(data);
                        mini.get("zgswjgDm").setValue(data[0].ID);
                    }
                },
                error:function(error){
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });*/
        }
    },
    beforeNodeSelect: function (e) {
        /* e.tree.expandOnNodeClick = true;
         //禁止选中父节点
         if (e.isLeaf == false) {
             e.cancel = true;
         }*/
    },
    newDateParse: function () {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }
        return year + "年" + month + "月" + day + '日';
    },
    getMcById: function (data, Id) {
        var MC = '';
        if (!!data) {
            for (var i = 0; i < data.length; i++) {
                var obj = data[i];
                if (obj.ID == Id) {
                    MC = obj.MC;
                    return MC;
                    break;
                }
            }
        }
    },
    resetData: function () {
        mini.get('nsrsbh-search').setValue('');
        mini.get('bsry').setValue('');
        mini.get('bghXzqh').setValue('');
        mini.get('qrddz').setValue('');
        $('#zjhm').html('');
        $('#zjhm').html('');
        $('#nsrsbh').html('');
        $('#nsrmc').html('');
        $('#cktslx').html('');
        $('#bgqXzqh').html('');
        $('#qcddz').html('');
        $('#lxrdh').html('');
        $('#dybysltzsBtn').hide();
        mini.get('slBtn').setEnabled(false);
        mini.get('dysltzsBtn').setEnabled(false);
        mini.get('dysxbgdBtn').setEnabled(false);
        mini.get('nsrsbh-search').setReadOnly(false);
        mini.get('bsry').setReadOnly(false);
        mini.get('bghXzqh').setReadOnly(false);
        mini.get('qrddz').setReadOnly(false);
        mini.get('search').setEnabled(true);
    }
};





$(function () {
    gldUtil.addWaterInPages();
    kqqyqyswsxbg.initPage()
});
