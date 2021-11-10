// isYct（1:电子税务局 2: 一窗通）

var  getCanObj = {
    is: false,
    is2: false,
    is3: false,
    is4: false,
    is5: false,
    is156:false,
    set1: function(v) {
        this.is = v
    },
    set2: function(v) {
        this.is2 = v
    },
    set3: function(v) {
        this.is3 = v
    },
    set4: function(v) {
        this.is4 = v
    },
    set5: function(v) {
        this.is5 = v
    },
    get1: function(v) {
        return this.is;
    },
    get2: function(v) {
        return this.is2;
    },
    get3: function(v) {
        return this.is3;
    },
    get4: function(v) {
        return this.is4;
    },
    get5: function(v) {
        return this.is5;
    },
    reset: function() {
        this.is = false;
        this.is2 = false;
        this.is3 = false;
        this.is4 = false;
        this.is5 = false;
        this.is156 = false
    },
    next: function() {
        this.is = true;
        this.is2 = true;
        this.is3 = true;
        this.is4 = true;
        this.is5 = true;
        this.is156 = true
    }
};
var actionMethods = {
    sxList: [],
    blxx: {},
    isBysl: false,
    isGt: false,
    isHasPzhd: false,
    currentNsrIsInJs: false,
    currentNsrIsInJsValidate: false,
    currentNsrIsInFzch: false,
    isShowgfxts: true,
    showdbWin: function () {
        mini.get('dbWin').show()
    },
    // showslWin: function () {
    //     mini.get("slWin").show()
    // },
    isCurrentCity: function () {
        var isCurrentCity = false
        var viewData = JSON.parse(sxsl_store.sqsxData.viewData)
        var swdjxxbl = viewData['110101'] || viewData['110121'];
        viewData = typeof swdjxxbl === 'string' ? JSON.parse(swdjxxbl) : swdjxxbl;
        // console.log(viewData['djxxbl-yl'].zjgnsrsbh)
        mini.mask('加载中...')
        ajax.post('/dzgzpt-wsys/api/wtgl/nsrxx/query/isExist/' + viewData['djxxbl-yl'].zjgnsrsbh, {}, function (res) {
            if (res.success) {
                isCurrentCity = res.value
            } else {
                mini.alert(res.message || '系统异常请稍后再试')
            }
            mini.unmask()
        });
        return isCurrentCity
    },
    refrePzhdZt:function(){
        mini.mask('加载中...');
        setTimeout(function () {
            mini.unmask();
            //actionMethods.showyjbcWin();
        },1000);
    },
    /**
     * 显示一键保存的弹框
     */
    showyjbcWin: function (type) {
        var fpModified=false;
        var data=mini.get('gzpz_grid_yl')&&mini.get('gzpz_grid_yl').getData();
        var xgly=$("#xgly").val();
        $.each(actionMethods.oldGzpzData||[],function (i,v) {
            if(data[i].myzggpsl!=v.myzggpsl||data[i].mczggpsl!=v.mczggpsl||data[i].cpzgsl!=v.cpzgsl){
                fpModified=true;
                return false;
            }
        });

        var fpslPass=true;
        var msg="";
        $.each(data,function(i,v){
            if(Number(data[i].mczggpsl)>Number(data[i].cpzgsl)){
                fpslPass=false;
                msg="票种核定第"+(i+1)+"行【"+v.fpzlmc+"】中，“每次最高购票数量”不得大于“持票最高数量”,请检查。";
                return false;
            }

            if(Number(data[i].mczggpsl)>Number(data[i].myzggpsl)){
                fpslPass=false;
                msg="票种核定第"+(i+1)+"行【"+v.fpzlmc+"】中，“每次最高购票数量”不得大于“每月最高购票数量”,请检查。";
                return false;
            }
        });
        if(!fpslPass){
            mini.alert(msg);
            return;
        }

        // if(fpModified&&!xgly){
        //     mini.alert("由于您修改了“票种核定”中相关数量，请填写“修改推荐值理由”！");
        //     var tabs=mini.get("xbtc-yl-tabs").tabs;
        //     $.each(tabs,function(i,v){
        //         if(v.name==='tab_700006'){
        //             mini.get("xbtc-yl-tabs").setActiveIndex(i);
        //             return false;
        //         }
        //     })
        //     return;
        // }

        mini.mask('加载中...');
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/dbsx/subTasks/get",
            data: {
                parentSqxh: sxsl_store.sqxh
            },
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    var html = []
                    var arr = []
                    var isDw = false;
                    //总分机构类型代码
                    var zfjglxDm = '';
                    actionMethods.allSxList = res.value;
                    if (res.value && res.value.length > 0) {
                        /**
                         * 过滤掉110101、110121、ca
                         * 税（费）种认定操作列中，当【纳税人为分支机构/分总机构，且总机构为本市】的单位纳税人
                         * 操作列展示的信息为：“当前纳税人为分支机构/分总机构且总机构为本市，（个体不显示此提示）
                         * 无需进行税费种认定。”，否则操作列展示“请在核心征管系统中进行税（费）种认定操作。”。
                         *
                         * 一般纳税人资格认定，选择小规模不用受理，一般纳税人才要
                         *
                         * 当纳税人为分支机构/分总机构且总机构为本市的纳税人 其他事项都不受理，除了纳税人资格认定选定为一般纳税人
                         * 税务人端，个体工商户管理端一键保存中不出现税费种认定事项。
                         * 一窗通展示扣缴事项，在税费种认定事项上，增加扣缴税款登记的事项
                         */
                        for (var index = 0; index < res.value.length; index++) {
                            if (res.value[index].swsxDm !== '110101' && res.value[index].swsxDm !== '110121' && res.value[index].swsxDm !== '151000') {
                                // 一般纳税人资格认定 viewData里nsrlxDm位05的时候为一般纳税人
                                if (res.value[index].swsxDm === '110113') {
                                    var zgrdData = mini.decode(res.value[index].viewData);
                                    if (zgrdData.nsrlxDm === '05') {
                                        arr.push(res.value[index])
                                    }
                                } else if(res.value[index].swsxDm === '30010108' && urlParams.urlParams.isYct !== '2') {
                                    //
                                } else if(res.value[index].swsxDm === '30010108') {
                                    arr.unshift(res.value[index])
                                } else {
                                    arr.push(res.value[index])
                                }

                            }
                            // 判断是否是单位
                            if (res.value[index].swsxDm === '110101') {
                                var dwData = mini.decode(res.value[index].viewData)
                                zfjglxDm = dwData['djxxbl-yl']['zfjglxDm']
                                isDw = true;
                            }
                            if (res.value[index].swsxDm === '110121') {
                                actionMethods.isGt = true;
                            }
                        }
                        var isCurrentCity= isDw && (zfjglxDm === '3' || zfjglxDm === '2') ? actionMethods.isCurrentCity() : false;
                        for (var index = 0; index < arr.length; index++) {
                            // 单位 分机构/总分机构/总机构是当前城市,只受理纳税人资格认定选定为一般纳税人
                            if(isDw && (zfjglxDm === '3' || zfjglxDm === '2') && isCurrentCity) {
                                var element = arr[index];
                                if(element.swsxDm === '11010201') {
                                    html.push( '<tr><td swsxdm=11010201>' + element.swsxMc + '</td><td width="50%">当前纳税人为分支机构/分总机构且总机构为本市的纳税人，无需进行税费种认定。</td></tr>')
                                }
                                if(element.swsxDm === '110113') {
                                    var ybnsr = '<tr><td swsxdm=110113>' + element.swsxMc + '</td>'
                                    if(element.blztDm !== '00' && element.blztDm !== '99') {
                                        ybnsr += '<td>' + element.blztMc + '</td></tr>'
                                    } else {
                                        ybnsr += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.zslMethods(\'' + index + '\')">受理</a></td></tr>'
                                    }
                                    html.push(ybnsr);
                                }
                                continue;
                            }
                            var element = arr[index]
                            var qs = '<tr><td swsxdm='+ element.swsxDm +'>' + element.swsxMc + '</td>'
                            if (element.blztDm !== '00' && element.swsxDm !== '11010201' && element.blztDm !== '99') {
                                if(element.swsxDm === '700006'){

                                    qs += '<td>已提交</td></tr>';
                                    mini.get('gzpz_grid_yl')&&mini.get("gzpz_grid_yl").setAllowCellEdit(false);
                                    $("#xgly").attr("disabled","disabled");
                                    //todo
                                    // qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.zslMethods(\'' + index + '\')">受理</a></td></tr>'
                                    //todo
                                }else if(element.swsxDm === '110701'){//三方协议单独处理
                                    var viewdata = JSON.parse(sxsl_store.sqsxData.viewData)['110111']
                                    viewdata = typeof viewdata === 'string' ? JSON.parse(viewdata) : viewdata
                                    var IsHasCkzhbgxx = viewdata ? true : false; // 是否有存款帐户报告信息
                                    if (IsHasCkzhbgxx) {
                                        var zhmc = viewdata['ckzhzhbg-yltj-form'].zhmc
                                    }
                                    var nsrmc = sxsl_store.sqsxData.nsrmc
                                    if(!IsHasCkzhbgxx) {
                                        qs += '<td><a id="sureBtn" class="mini-gray-button" style="background: #0994dc;line-height: 32px;">受理</a></td></tr>'
                                    } else if((element.blztDm=='97'||element.blztDm=='98'||element.blztDm=='99')&&!element.blztMs){//保存失败继续显示受理
                                        qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.zslMethods(\'' + index + '\')">受理</a></td></tr>'
                                    }else if((element.blztDm=='97'||element.blztDm=='98'||element.blztDm=='99')&&element.blztMs && element.blztMs.indexOf('三方协议验证')>=0){//验证失败
                                        qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.sfxyYzMethods(\'' + index + '\')">验证</a></td></tr>'
                                    } else if(element.czztDm=='02'){//验证通过
                                        qs += '<td width="50%">验证通过</td></tr>'
                                    }else if(element.czztDm=='00' || zhmc != nsrmc){//纸签未验证
                                        qs += '<td width="50%">不支持网签三方协议，需要纳税人走纸质签订流程。</td></tr>'
                                    }else if(element.czztDm=='01' || element.czztDm == '03'){//网签未验证或者验证失败
                                        qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.sfxyYzMethods(\'' + index + '\')">验证</a></td></tr>'
                                    }
                                }else{
                                    qs += '<td>' + element.blztMc + '</td></tr>'
                                }

                            } else if (element.swsxDm === '11010201') {
                                if (isDw && (zfjglxDm === '3' || zfjglxDm === '2') && actionMethods.isCurrentCity()) {
                                    // 单位才会有此提示
                                    // 税务人端，个体工商户管理端一键保存中不出现税费种认定事项。
                                    qs += '<td width="50%">当前纳税人为分支机构/分总机构且总机构为本市的纳税人，无需进行税费种认定。</td></tr>'
                                } else if (isDw) {
                                    // 请在核心征管系统中进行税（费）种认定操作。
                                    // qs += '<td width="50%">请在核心征管系统中进行税（费）种认定操作。</td></tr>'
                                    if(element.blztDm === '00'){
                                        qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.sfzrdMethods(\'' + index + '\')">受理</a></td></tr>'
                                    }else if(element.blztDm === '01'){
                                        qs += '<td width="50%">受理通过</td></tr>'
                                    }else if(element.blztDm === '02'){
                                        qs += '<td width="50%">受理不通过</td></tr>'
                                    }
                                } else {
                                    qs += '<td width="50%"></td></tr>'
                                }
                            } else if (element.swsxDm === '110113' && JSON.parse(element.data).nsrlxDm === '04') {
                                /**
                                 * "nsrlxDm": "05"一般纳税人、"nsrlxDm": "04", 小规模
                                 */
                                qs += '<td></td></tr>'
                            } else {
                                if(element.blztDm=='99'&&element.swsxDm === '110701'&&element.blztMs && element.blztMs.indexOf('三方协议验证')>=0){
                                    qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.sfxyYzMethods(\'' + index + '\')">验证</a></td></tr>'
                                }else{
                                    qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.zslMethods(\'' + index + '\')">受理</a></td></tr>'
                                }
                            }
                            html.push(qs)
                        }
                        actionMethods.sxList = arr
                        // 一般纳税人放在第一行
                        html.sort(function (a,b) {
                            return b.indexOf('110113') - a.indexOf('110113');
                        })
                        // 插入表头
                        // ps:进行复杂字符串拼接时， 例如 多个 += 操作，可以考虑使用数组，数组的join效率会更高一些 --lizm
                        html.unshift('<tr><td>事项名称</td><td>操作</td></tr>')
                        $('#yjbcWin table').html(html.join(''))
                        if (type === 'open') {
                            mini.get('yjbcWin').show()
                        }
                    }
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    getSwjgdm: function (){
        var sqxh = ''
        var newArr = []
        newArr = sqzl.getPackViewData(sxsl_store.sqxh)
        for (var index = 0; index < newArr.length; index++) {
            var element = newArr[index]
            if (element.swsxDm === '110101' || element.swsxDm === '110121') {
                sqxh = element.sqxh
            }
        }
        var zgswskfjMc = ''
        mini.mask('加载中...')
        ajax.get('/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/getBlxxSwjgxx/' + sqxh, {}, function (res) {
            if (res.success) {
                zgswskfjMc = res.value.zgswskfjMc
            } else {
                mini.alert(res.message || '系统异常请稍后再试')
            }
            mini.unmask()
        });
        return zgswskfjMc
    },
    showfsdxWin: function () {
        mini.mask('加载中...')
        setTimeout(function() {
            ajax.post('/dzgzpt-wsys/api/wtgl/public/login/session', {}, function (res) {
                if (res.success) {
                    /**
                     * 个体工商户,税务人端办结时发送的短信内容更改为纳税人主管税务所
                     */
                    var swjgDm = res.value.swjgDm
                    ajax.get('/sxsq-wsys/api/hgzx/baseCode/get/getBaseCodeObjStr/HGZX_DM_GY_SWJG_GT3/' + swjgDm, {}, function (res) {
                        if (res.success === false) {
                            mini.alert(res.message || '系统异常请稍后再试')
                        } else {
                            /**
                             * 单位纳税人、新办申请未核定票种，更改如下内容：税务人端办结时发送的短信内容为：尊敬的纳税人，新办纳税人【企业名称】申请信息已办结，请尽快在电子税务局的【公众服务】-【公众查询】-【新办纳税人套餐-办税进度查询】中进行确认。
                             */
                            var sqsxData = sxsl_store.sqsxData
                            var message = ''
                            var lrsj = sqsxData.lrsj
                            if (typeof lrsj === 'string') {
                                lrsj = lrsj.substr(0,19)
                            } else {
                                lrsj = lrsj.format('yyyy-MM-dd hh:mm:ss')
                            }
                            var bczPzhdmMessage = '尊敬的纳税人，新办纳税人【' + sqsxData.nsrmc + "】申请信息已办结，请尽快在电子税务局的【公众服务】-【公众查询】-【新办纳税人套餐-办税进度查询】中进行确认。需要开通电子申报服务和网上办税应用的，可通过电子税务局-我的信息-账户管理-电子申报账户管理中自主开通。"
                            var byslMessage = sqsxData.nsrmc + "（" + sqsxData.nsrsbh + "）" + lrsj + "提交的新办企业涉税事项申请不予受理，您可前往（" + res.swjgmc + "）办税服务厅现场办理。"
                            var yctBczPzhdMeaasge = '尊敬的纳税人，新办纳税人【' + sqsxData.nsrmc + '】申请信息已办结，您可登录上海市电子税务局查看企业信息，请按期申报。需要开通电子申报服务和网上办税应用的，可通过电子税务局-我的信息-账户管理-电子申报账户管理中自主开通。'
                            /**
                             * 单位纳税人，针对一窗通的订单，若未申请“发票票种核定”，
                             */
                            var finalMessage = ''
                            var isYct = urlParams.urlParams.isYct

                            if (actionMethods.isBysl) {
                                finalMessage = byslMessage
                            } else if (actionMethods.isDw && !actionMethods.isHasPzhd && isYct != 2) {
                                finalMessage = bczPzhdmMessage
                            } else if (actionMethods.isDw && !actionMethods.isHasPzhd && isYct == 2) {
                                finalMessage = yctBczPzhdMeaasge
                            } else if (actionMethods.isDw && actionMethods.isHasPzhd) {
                                finalMessage = sqsxData.nsrmc + "（" + sqsxData.nsrsbh + "）" + lrsj + "提交的新办企业涉税事项申请办结成功，您可前往（" + res.swjgmc + "）办税服务厅现场办理。"
                            } else {
                                finalMessage = sqsxData.nsrmc + "（" + sqsxData.nsrsbh + "）" + lrsj+ "提交的新办企业涉税事项申请办结成功，您可前往（" + actionMethods.getSwjgdm() + "）办税服务厅现场办理。"
                            }


                            mini.get('dxnr').setValue(finalMessage)
                            // mini.get('jbr').setValue(sqsxData.jbrmc)
                            // mini.get('sjhm').setValue(sqsxData.sjhm)
                            mini.get('fsdxWin').show()
                        }
                        mini.unmask()
                    })
                } else {
                    mini.unmask()
                    mini.alert(res.message || '系统异常请稍后再试')
                }
            })
        }, 100);
    },
    closeWin: function () {
        mini.get("slWin").hide()
        mini.get('yjbcWin').hide()
        mini.get('dbWin').hide()
        mini.get('fsdxWin').hide()
        mini.get('byslWin').hide()
        mini.get('nsrztWin').hide()
        mini.get('pzhdWin').hide()
    },
    renderBtn: function (blztDm) {
        /**
         * {'ID': '00', 'MC': '待受理'},未受理	调拨、受理、不予受理
         * {'ID': '01', 'MC': '受理通过'},
         * {'ID': '02', 'MC': '不予受理'},不予受理	无可操作项
         * {'ID': '60', 'MC': '已受理'},一键保存、办结、实名认证
         * {'ID': '61', 'MC': '已办结'},已办结	发放
         * {'ID': '62', 'MC': '已发放'}],已发放	无可操作项
         */
        /**
         * 当金三中已经存在数据的：调拨、受理、不予受理按钮置灰，其他按钮可以进行操作，
         * 办结/发放后根据已办结/已发放状态展示对应的按钮
         * 当法定代表人存在其他非正常户企业的：按钮全亮，进行操作后展示对应的状态的按钮信息
         * （例如此时进行受理，受理完成后展示已受理后的按钮，直接做办结操作的，则展示状态为已办结的按钮）
         * 单位纳税人，税务人端办结后，实名认证、发放按钮置灰，不能点击。
         */
        var nsrjbxx = JSON.parse(JSON.parse(sxsl_store.sqsxData.data)[0].data);
        if (nsrjbxx.kzztdjlxdm === '1120') {
            if (!actionMethods.currentNsrIsInJs  && blztDm === '00') {
                $('#dbBtnGray,#slBtnGray,#byslBtn,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtn').css('display', 'inline-block');
                $('#dbBtn,#slBtn,#byslBtnGray,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtnGray').css('display', 'none');
                return
            }
        } else {
            if (!actionMethods.currentNsrIsInJs  && blztDm === '00') {
                $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtn').css('display', 'inline-block');
                $('#dbBtn,#slBtn,#byslBtn,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtnGray').css('display', 'none');
                return
            }
        }
        if (!actionMethods.currentNsrIsInJs && blztDm == '60') {
            $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtn').css('display', 'inline-block');
            $('#dbBtn,#slBtn,#byslBtn,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtnGray').css('display', 'none');
            return
        }
        if (actionMethods.currentNsrIsInFzch && blztDm === '00') {
            $('#dbBtn,#slBtn,#byslBtn,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtn').css('display', 'inline-block');
            $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtnGray').css('display', 'none');
            return
        }
        if (blztDm === '00') {
            $('#dbBtn,#slBtn,#byslBtn,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtn').css('display', 'inline-block')
            $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtnGray').css('display', 'none')
        } else if (blztDm === '60') {
            $('#yjbcBtn,#bjBtn,#smrzBtn,#dbBtnGray,#slBtnGray,#byslBtnGray,#ffBtnGray,#sqbdyBtn').css('display', 'inline-block')
            $('#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#dbBtn,#slBtn,#byslBtn,#ffBtn,#sqbdyBtnGray').css('display', 'none')
        } else if (blztDm === '61') {
            /**
             * 如果是单位且未核定票种，则发放和实名按钮置灰，否则按原来的显示，发放按钮可点击，实名按钮可点击。
             *
             * 老一窗通申请和老电子税务局申请，只支持大厅发放，当状态为已办结时， 可进行实名认证、发放和申请表打印操作。
             */
            if ($('#rwly').text() === '电子税务局（老网厅）' || $('#rwly').text() === '一窗通（老网厅）') {
                $('#ffBtn,#smrzBtn').css('display', 'inline-block')
                $('#ffBtnGray,#smrzBtnGray').css('display', 'none')
            } else if (actionMethods.isDw && !actionMethods.isHasPzhd) {
                $('#ffBtn,#smrzBtn').css('display', 'none')
                $('#ffBtnGray,#smrzBtnGray').css('display', 'inline-block')
            } else {
                $('#ffBtn,#smrzBtn').css('display', 'inline-block')
                $('#ffBtnGray,#smrzBtnGray').css('display', 'none')
            }
            $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtnGray,#bjBtnGray,#sqbdyBtn').css('display', 'inline-block')
            $('#dbBtn,#slBtn,#byslBtn,#yjbcBtn,#bjBtn,#sqbdyBtnGray').css('display', 'none')
        } else {
            $('#dbBtnGray,#slBtnGray,#byslBtnGray,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtn').css('display', 'inline-block')
            $('#dbBtn,#slBtn,#byslBtn,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtnGray').css('display', 'none')
        }
    },
    /**
     * 调拨下拉列表
     */
    getSwjgList: function () {
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/get/baseCodeShTbSwjglb/CS_XBTC_TB_SWJG",
            type: 'get',
            data: {
                lcslId: sxsl_store.sqxh
            },
            success: function (res) {
                res = mini.decode(res);
                if (res.success != false && res) {
                    mini.get('dbswjg').setData(res)
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /**
     * 调拨
     */
    dbMethods: function () {
        var dbswjg = mini.get('dbswjg').getValue()
        if (dbswjg === sxslcommon.swsxsqJbxx.swjgDm) {
            mini.alert('不能选择自己的税务机关，请重新选择。', '提示')
            return
        }
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/swjgtb",
            type: 'post',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                nsrsbh: sxsl_store.nsrsbh,
                dqswjgDm: sxslcommon.swsxsqJbxx.swjgDm, // 前税务机关代码
                mbswjgDm: dbswjg, // 调拨后的税务机关代码
                rwbh: sxsl_store.rwbh
            }),
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    mini.alert(res.message || '调拨成功!', '提示信息', function () {
                        actionMethods.closeWin()
                        actionMethods.renderBtn()
                    })
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /**
     * 校验投资方信息是否为空
     */
    checkTzfxxIsZero: function(tzfxxGrid) {
        var is = false;
        if (tzfxxGrid.length === 0) {
            is = true
        }
        return is
    },
    /*
    校验投资方信息中的国籍是否至少有一方的国籍为：中华人民共和国香港特别行政区，或中华人民共和国澳门特别行政区或台湾省。
    tzfgj
    */
    checkTzfxxIs1: function(tzfxxGrid) {
        var is = false;
        if(tzfxxGrid.length <= 0){
            return false
        }
        $.each(tzfxxGrid, function(index, item) {
            if (['344', '446', '158'].indexOf(item.tzfgj) > -1) {
                is = true
            }
        })
        return is;
    },
    /**判断是否全部为156**/
    check156:function(tzfxxGrid){
        if(tzfxxGrid.length <= 0){
            return false
        }
        var check = true;
        $.each(tzfxxGrid, function(index, item) {
            if (item.tzfgj !== '156') {
                check = false
            }
        });
        return check
    },
    /*
    校验投资方信息中的国籍，是否为156,334,446,158
    */
    checkTzfxxIs2: function(tzfxxGrid) {
        if(tzfxxGrid.length <= 0){
            return false
        }
        var arr = [],isChina = true;
        $.each(tzfxxGrid, function(index, item) {
            /*if (['156'].indexOf(item.tzfgj) > -1) {
              arr.push(true)
            }*/
            if(item.tzfgj !== '156' && item.tzfgj !== '344' && item.tzfgj !== '446' && item.tzfgj !== '158'){
                isChina = false
            }
        });
        return isChina
    },
    checkAllCn: function(djzclxdmText){
        return mini.showMessageBox({
            width: 250,
            title: "提示",
            buttons: ["否", "是"],
            message: '您单位的投资方所在地全部为“中华人民共和国”，但登记注册类型为'+djzclxdmText+'，是否继续保存？如果继续，将允许您保存，但税务机关将把您单位归类为“企业投资方注册在中华人民共和国境内(港、澳、台地区除外)的外商投资企业和港澳台商投资企业”，可能影响税务机关对您企业性质和类型的划定。您若确认无误，请点击“是”；若您投资方填写存在错误，请点击“否”',
            callback: function (action) {
                if (action === '否') {
                    return mini.showMessageBox({
                        width: 250,
                        title: "提示",
                        buttons: ["我再看看", "继续提交"],
                        message: '登记注册类型为' + djzclxdmText + '时，投资方所在地不可仅为“中国”',
                        callback: function (action) {
                            if (action === '我再看看') {
                                getCanObj.is156 = false;
                            }
                            if (action === '继续提交') {
                                getCanObj.is156 = true;
                                actionMethods.slBefor(actionMethods.slMethods)
                            }
                        }
                    });
                }
                if (action === '是') {
                    getCanObj.is156 = true;
                    actionMethods.slBefor(actionMethods.slMethods)
                }
            }
        })
    },
    slBefor: function (callBack) {
        /*【上海、宁波】【193补丁】【新办套餐】登记注册类型、投资方信息、外资比例增加监控 / 管理端相关修改*/
        var nsrjbxx = JSON.parse(JSON.parse(sxsl_store.sqsxData.data)[0].data) || {};
        var tzfxxGrid = nsrjbxx.tzfxxGrid || [];
        var djzclxdm = nsrjbxx.djzclxdm;
        var djzclxdmText = nsrjbxx.djzclxdmText;
        var isZfjg = nsrjbxx.zfjglxDm !== '2' && nsrjbxx.zfjglxDm !== '3';
        var reg = /^\d\.([1-9]{1,2}|[0-9][1-9])$|^[1-9]\d{0,1}(\.\d{1,2}){0,1}$|^100(\.0{1,2}){0,1}$|^0/;

        if (djzclxdm.charAt(0) === '2' && (!getCanObj.get1() || !getCanObj.get2() || !getCanObj.get3() || !getCanObj.is156)) {
            if (actionMethods.checkTzfxxIsZero(tzfxxGrid) && !getCanObj.get1() && isZfjg) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，投资方信息不可为空。',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.set1(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set1(true)
                            callBack()
                        }
                    }
                });
            }
            if(actionMethods.check156(tzfxxGrid) && !getCanObj.is156 && isZfjg){
                actionMethods.checkAllCn(djzclxdmText);
                return
            }
            if(!actionMethods.checkTzfxxIs1(tzfxxGrid)  && !getCanObj.get2() && !getCanObj.is156 && isZfjg) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，纳税人投资方信息中至少有一方的投资方所在地为：中华人民共和国香港特别行政区，或中华人民共和国澳门特别行政区或台湾省!',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.set2(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set2(true)
                            callBack()
                        }
                    }
                });
            }
            if (Number(nsrjbxx.wztzbl || 0) <= 0 && !getCanObj.get3()) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，外资投资比例必须大于0',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.get3(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set3(true)
                            callBack()
                        }
                    }
                });
            }

            getCanObj.next()
            callBack()

        } else if (djzclxdm.charAt(0) === '3' && (!getCanObj.get1() || !getCanObj.get2() || !getCanObj.get3() || !getCanObj.is156)){
            if (actionMethods.checkTzfxxIsZero(tzfxxGrid) && !getCanObj.get1() && isZfjg) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，投资方信息不可为空。',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.set1(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set1(true)
                            callBack()
                        }
                    }
                });
            }
            if(actionMethods.check156(tzfxxGrid) && !getCanObj.is156 && isZfjg){
                actionMethods.checkAllCn(djzclxdmText);
                return
            }
            if (actionMethods.checkTzfxxIs2(tzfxxGrid) && !getCanObj.get2() && !getCanObj.is156 && isZfjg) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，纳税人投资方信息中至少有一方的所在地不是“中华人民共和国”或“中华人民共和国香港特别行政区”或“中华人民共和国澳门特别行政区”或“台湾省”!',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.set2(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set2(true);
                            callBack()
                        }
                    }
                });
            }

            if (Number(nsrjbxx.wztzbl || 0) <= 0 && !getCanObj.get3()) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '登记注册类型为'+ djzclxdmText +'时，外资投资比例必须大于0',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.get3(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.set3(true)
                            callBack()
                        }
                    }
                });
            }

            getCanObj.next()
            callBack()
        } else {
            if (
                (!nsrjbxx.zrrtzbl || !nsrjbxx.wztzbl || !nsrjbxx.gytzbl
                    || !reg.test(nsrjbxx.zrrtzbl) || !reg.test(nsrjbxx.wztzbl) || !reg.test(nsrjbxx.gytzbl))
                && !getCanObj.get4()
            ) {
                var msg = [];
                if (!nsrjbxx.zrrtzbl) msg.push('自然人投资比例不可为空')
                if (!nsrjbxx.wztzbl) msg.push('外资投资比例不可为空')
                if (!nsrjbxx.gytzbl) msg.push('国有投资比例不可为空')
                if (nsrjbxx.zrrtzbl && !reg.test(nsrjbxx.zrrtzbl)) msg.push('自然人投资比例格式有误，请输入大于等于0且小于等于100的数字，最多支持2位小数')
                if (nsrjbxx.wztzbl && !reg.test(nsrjbxx.wztzbl)) msg.push('外资投资比例格式有误，请输入大于等于0且小于等于100的数字，最多支持2位小数')
                if (nsrjbxx.gytzbl  && !reg.test(nsrjbxx.gytzbl)) msg.push('国有投资比例格式有误，请输入大于等于0且小于等于100的数字，最多支持2位小数')

                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: msg.join(','),
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.get4(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.get4(true)
                            callBack()
                        }
                    }
                });
            }

            var total = Number(nsrjbxx.zrrtzbl) + Number(nsrjbxx.gytzbl)
            if ((total < 0 || total > 100) && !getCanObj.get5()) {
                return mini.showMessageBox({
                    width: 250,
                    title: "提示",
                    buttons: ["我再看看", "继续提交"],
                    message: '自然人投资比例（'+ nsrjbxx.zrrtzbl +'%）、国有投资比例（'+ nsrjbxx.gytzbl +'%）之和需大于等于0且小于等于100',
                    callback: function (action) {
                        if (action === '我再看看') {
                            getCanObj.get5(false)
                        }
                        if (action === '继续提交') {
                            getCanObj.get5(true)
                            callBack()
                        }
                    }
                });
            }

            getCanObj.next()
            callBack()

        }
    },
    /*
    * 点击受理按钮验证
    */
    slMethodsValidate :function() {
        if (!actionMethods.currentNsrIsInJsValidate) { // 不需要验证
            actionMethods.slMethods()
            return
        }
        mini.mask('加载中...')
        var data = sxsl_store.sqsxData.data
        var sqData = mini.decode(data)
        var jbData = null
        for(var i = 0; i < sqData.length; i++) {
            if (sqData[i].swsxDm === '110101') {
                jbData = sqData[i].data
                break;
            }
        }
        jbData = mini.decode(jbData)
        $.ajax({
            url: '/sxsq-wsys/api/xbnsrtc/jysfcfbz',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            data: mini.encode({
                scjydzxzqhszDm: jbData.scjydzxzqhszDm,
                fddbrsfzjlxDm: jbData.fddbrsfzjzl,
                fddbrsfzjhm: jbData.fddbrsfzjhm,
                shxydm: jbData.nsrsbh,
                zzjgDm: jbData.zzjgdm,
                nsrmc: sxsl_store.sqsxData.nsrmc
            }),
            success: function (res) {
                if (res.success) {
                    if (res.value) { // 有值需要选择
                        var nsrztWin = mini.get('nsrztWin');
                        mini.get('nsrztWindatagrid').setData(res.value || []);
                        nsrztWin.show();
                    } else { // 直接验证通过
                        actionMethods.slMethods()
                    }
                } else {
                    mini.alert(res.message || '系统异常,请稍后再试')
                }
                mini.unmask()
            }
        });
    },
    /**
     * 点击选择纳税人取消
     */
    slMethodsSelectCancel :function() {
        sxsl_store.saveDjxh = ''
        actionMethods.slMethods()
        actionMethods.closeWin()
    },
    /**
     * 点击选择纳税人后验证
     */
    slMethodsSelectConfirm :function() {
        console.log("object", mini.get('nsrztWindatagrid').getSelecteds())
        var selectData = mini.get('nsrztWindatagrid').getSelecteds()
        if (!selectData.length) {
            mini.alert('请先选择纳税主体')
            return
        } else {
            sxsl_store.saveDjxh = selectData[0].djxh
            actionMethods.slMethods()
            actionMethods.closeWin()
        }
    },
    /**
     * 点击受理按钮
     */
    slMethods: function () {
        var isYct = urlParams.urlParams.isYct
        var nsrjbxx = JSON.parse(JSON.parse(sxsl_store.sqsxData.data)[0].data);

        if (nsrjbxx.kzztdjlxdm !== '1120' && (!getCanObj.get1() || !getCanObj.get2() || !getCanObj.get3() || !getCanObj.get4() || !getCanObj.get5())) return actionMethods.slBefor(actionMethods.slMethods);

        /**
         * 新办纳税人套餐一窗通申请数据，投资方信息存在缺失（整条数据缺失）或者 字段缺失
         *（投资方名称、证件种类、证件号码、投资方经济性质、投资比例、国籍，其中当国籍为中华人民共和国的，地址也为必录项 ，不可为空）的，
         * 点击“受理”时需要给出提示：“该纳税人缺少投资方信息，请在金三核心征管-工商登记信息查询确认 模块中进行办理操作。”
         * 关闭提示信息后，不再进行申请数据的处理。
         */
        if (isYct === '2') {
            var tzfxxGrid = nsrjbxx.tzfxxGrid
            var zfjglxDm = nsrjbxx.zfjglxDm
            var isPass = true
            if ((!tzfxxGrid || tzfxxGrid.length === 0) && zfjglxDm !== '2') {
                mini.alert('该纳税人缺少投资方信息，请在金三核心征管-工商登记信息查询确认模块中进行办理操作。')
                return
            }
            for (var index = 0; index < tzfxxGrid.length; index++) {
                if (!tzfxxGrid[index].tzfmc || !tzfxxGrid[index].tzfhhhrzjzlDm || !tzfxxGrid[index].tzfzjhm || !tzfxxGrid[index].tzfjjxz || !tzfxxGrid[index].tzbl || !tzfxxGrid[index].tzfgj) {
                    isPass = false
                }
                if ( tzfxxGrid[index].tzfgj && tzfxxGrid[index].tzfgj === '156' && !tzfxxGrid[index].tzfdz) {
                    isPass = false
                }
            }
            if (!isPass) {
                mini.alert('该纳税人缺少投资方信息，请在金三核心征管-工商登记信息查询确认模块中进行办理操作。')
                return
            }
        }
        // if (isYct) {
        /**
         * 一窗通申请信息写入流程（受理前调用接口）
         */
        // $.ajax({
        //     url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/generate/yctrwxx",
        //     data: JSON.stringify({
        //         shxyDm: sxsl_store.shxyDm, // （社会信用代码）
        //         yctAppNo: yctAppNo, // （一窗通AppNo同Sqid）
        //         data: '01', // （详情信息接口中data字段）
        //         viewData: sxsl_store.rwztDm // （详情信息接口中viewdata字段）
        //     }),
        //     dataType: 'json',
        //     contentType: 'application/json;charset=utf-8',
        //     success: function (res) {
        //         res = mini.decode(res)
        //         if (res.success) {
        //             actionMethods.slxbtc(sxsl_store.lcslid, isYct)
        //         } else {
        //             mini.alert(res.message, '提示信息')
        //         }
        //     },
        //     error: function (res) {
        //         mini.alert(res.message || '系统异常请稍后再试', '提示信息')
        //     }
        // })
        // } else {
        //主管税务机关是市局时,增加阻断提示

        $.ajax({
            type: "GET",
            url: "/dzgzpt-wsys/api/baseCode/get/SwjgQx",
            contentType: 'application/json',
            dataType: 'json',
            success: function (data) {
                mini.unmask();
                if(data) {
                    if(data.ID ==='13100000000'){
                        mini.alert('当前纳税人的主管税务机关在市局，请调拨到对应分局，由分局人员受理','提示信息')
                        return
                    }
                    mini.mask('加载中...')
                    $.ajax({
                        type: "GET",
                        url: "/sxsq-wsys/api/xbnsrtc/sfKsqynsr",
                        data: {
                            nsrsbh: sxsl_store.sqsxData.nsrsbh
                        },
                        contentType: 'application/json',
                        dataType: 'json',
                        success: function (res) {
                            mini.unmask();
                            if(res.success) {
                                if (res.value) {
                                    mini.showMessageBox({
                                        minWidth : 250,
                                        maxWidth : 550,
                                        title : "提示",
                                        buttons : ["返回"],
                                        message : "该纳税人为长三角跨省（市）迁移迁入企业，请联系相关人员及时进入金三系统《跨省（市）迁移涉税事项信息确认》模块进行确认操作，若确认完毕，请点击返回并不予受理",
                                        iconCls : "mini-messagebox-info"
                                    });
                                    return
                                }
                                actionMethods.slxbtc(sxsl_store.lcslId, isYct === '2' ? true : false)
                            } else {
                                mini.alert(res.message || '是否跨省迁移纳税人查询失败！')
                            }
                        }
                    })
                }
            }
        });

        // }
    },
    isHdZzssfz: function (djxh) {
        var isHdZzssfzFlag = false;
        mini.mask('加载中...')
        ajax.get('/sxsq-wsys/api/pzhd/checkzzsSfzxx/' + djxh, {}, function (res) {
            if (res.success) {
                isHdZzssfzFlag = true;
            } else {
                isHdZzssfzFlag = false;
            }
            mini.unmask()
        });
        return isHdZzssfzFlag;
    },
    /**
     * 查岗位是否大于1
     */
    queryShSpgw: function (index) {
        mini.mask('加载中...')
        ajax.get('/sxsq-wsys/api/hgzx/dbsx/queryReceiveJgDmAndGwXhList/' + sxsl_store.sqxh + '/700006', {}, function (res) {
            if (res.success && res.value) {
                var data = typeof res.value === 'string' ? mini.decode(res.value) : res.value;
                if (data.length > 1) {
                    mini.open({
                        showMaxButton: true,
                        title: "受理",
                        url: '../sqgl/xbnsrzhtcsq_wrt/template/xbtcPzhd-cxb/selectTsgw.html',
                        showModal: true,
                        width: "50%",
                        height: "70%",
                        onload: function () {
                            var iframe = this.getIFrameEl()
                            /**
                             * 将数据传给打开的页面
                             */
                            var lcslId = actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh
                            iframe.contentWindow.selectTsgw.setData(lcslId, sxsl_store.rwztDm, actionMethods.sxList[index].data, data);
                        },
                        ondestroy: function (action) {
                            /**
                             * 关闭票种核定的弹框
                             */
                            if (action == "ok") {
                                /**
                                 * 重新获取按钮状态
                                 */
                                actionMethods.showyjbcWin()
                            }
                        }
                    })
                } else if (data.length === 1) {
                    var obj = {}
                    obj.jgDm = ''
                    obj.jgMc = ''
                    obj.gwMc = ''
                    obj.gwDm = ''
                    $.extend(obj,data[0])
                    actionMethods.sxslSubmit(index, obj, '700006')
                }
                mini.unmask()
            } else {
                mini.unmask()
                mini.alert(res.message || '查询岗位失败');
            }
        });
    },
    /**
     * 子项受理
     * 一键保存的子项受理
     * 20190520
     * 1.三方协议验证
     */
    sfxyYzMethods:function (index) {
        mini.mask("请求中，请稍候...");
        setTimeout(function () {
            actionMethods._sfxyYzMethods(index);
            mini.unmask();
        },2);
    },
    _sfxyYzMethods:function(index) {
        mini.mask('验证中...');
        var submitUrl = '/dzgzpt-wsys/api/tc/vlidateSfxy';
        var submitData = actionMethods.sxList[index].data;
        submitData = JSON.parse(submitData);
        submitData.djxh = actionMethods.sxList[index].djxh;
        submitData = JSON.stringify(submitData)
        $.ajax({
            url: submitUrl,
            type: 'post',
            contentType:"application/json",
            data: submitData,
            success: function (resu) {
                mini.unmask();
                var  res = mini.decode(resu);
                if (res.success) {
                    mini.alert('成功验证委托银行划缴税（费）款协议！', '提示', function () {
                        actionMethods.showyjbcWin();
                    })
                } else {
                    mini.alert(res.message, '提示信息');
                    actionMethods.showyjbcWin();
                }

            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        });
    },

    findWssqMxItem: function(swsxDm) {
        for(var i=0;i<subWssqMxList.length;i++) {
            if(subWssqMxList[i].swsxDm === swsxDm) {
                return {
                    data: JSON.parse(subWssqMxList[i].data),
                    sqxh: subWssqMxList[i].sqxh
                };
            }
        }
        return {
            data: {},
            sqxh: ''
        }
    },

    renderPzhd: function(djxh, changeTabFlag, blxxData, isblxx, isDw){
        var subViewData;
        var sqsxDataViewData = JSON.parse(sxsl_store.sqsxData.viewData);
        var sxData = actionMethods.findWssqMxItem("110101").data||actionMethods.findWssqMxItem("110121").data;
        var blxxFormData
        if(isblxx) {
            actionMethods.blxx = blxxFormData = blxxData.blxxForm.getData(true)
        } else {
            blxxFormData = sxData.blxx ? JSON.parse(sxData.blxx) : actionMethods.blxx;
        }
        // var blxxFormData = isblxx ? blxxData.blxxForm.getData(true) : JSON.parse(sxData.blxx);
        var data110101 = (sqsxDataViewData["110101"]||sqsxDataViewData["110121"])["djxxbl-yl"];
        var zcdzxzqhdm = isDw ? sxData.zcdzxzqhdm : sxData.scjydzjdxzDm;
        var swjgCode = blxxFormData.zgswskfjDm;
        var sqxh = actionMethods.findWssqMxItem("700006").sqxh;
        var nsrdjxx = {
            nsrmc: data110101.nsrmc,
            fddbrsfzjhm: data110101.fddbrsfzjhm,
            cwsfzjhm: data110101.cwfzrsfzjhm,
            bsysfzjhm: data110101.bsrsfzjhm,
            hyDm: data110101.hyDm,
            dwlsgxdm: blxxFormData.dwlsgxDm,
            zzlxdm: blxxFormData.zzjglxDm,
            djjgdm: blxxFormData.zgswskfjDm,
            zcdz: data110101.zcdz,
            kqccsztdjbz: "N",
            fjmqybz: "N",
            zcdzxzqhdm: zcdzxzqhdm || '',
            djzclxdm: sxData.djzclxdm || '',
            fddbrsfzjzl: sxData.fddbrsfzjzl || '',
            scjydzjdxzDm: sxData.scjydzjdxzDm || '',
            pzsljglxdm: sxData.pzsljglxdm || '',
            kjzdzzDm: sxData.kjzdzzDm || ''
        };

        isblxx && !isDw && delete nsrdjxx.dwlsgxdm;

        if (xbtcsq.viewDataObj.hasOwnProperty('700006') && !$.isEmptyObject(xbtcsq.viewDataObj['700006'])) {
            subViewData = $.extend(true, [], xbtcsq.viewDataObj['700006']);
            // 调用大脑初核信息接口
            var pzhdxxs = [];
            var blPzhdList = mini.get('gzpz_gridfde').getData() || [];
            for (var i = 0; i < blPzhdList.length; i++) {
                var tempArr = blPzhdList[i];
                var pzhdxxsCla = {};
                pzhdxxsCla = {
                    fpzlDm: tempArr.fpzlDm,
                    dffpzgkpxe: tempArr.fpme,
                    myzggpsl: tempArr.myzggpsl,
                    cpzgsl: tempArr.cpzgsl,
                    mczggpsl: tempArr.mczggpsl,
                }
                tempArr.defpbz === "N" && pzhdxxs.push(pzhdxxsCla);
            }
            $.ajax({
                url: '/sxsq-wsys/api/wtgl/zhdn/ccpzhdxx/recommend/get',
                type: 'post',
                data: {
                    djxh: djxh,
                    pzhdxxs: mini.encode(pzhdxxs),
                    nsrdjxx: mini.encode(nsrdjxx),
                    swjgCode: swjgCode || '',
                    sqxh: sqxh
                },
                success: function (res) {
                    if (res.success) {
                        var ztbz = res.value.ztbz;
                        actionMethods.ztbz=ztbz||false;
                        mini.get('gzpz_grid_yl')&&mini.get("gzpz_grid_yl").setAllowCellEdit(true);
                        // 高风险纳税人
                        if(ztbz){
                            $("#kpxe-tip").show();
                            var pzhdxxmx = res.value.pzhdxxmx;
                            // for (var i = 0; i < subViewData.pzhdsqMxList.length; i++) {
                            //   var tempArr = subViewData.pzhdsqMxList[i];
                            //   for (var j = 0; j < pzhdxxmx.length; j++) {
                            //     if(tempArr.fpzlDm === pzhdxxmx[j].fpzlDm){
                            //       tempArr.myzggpsl = pzhdxxmx[j].myzggpsl;
                            //       tempArr.mczggpsl = pzhdxxmx[j].mczggpsl;
                            //       tempArr.cpzgsl = pzhdxxmx[j].cpzgsl;
                            //       break;
                            //     }
                            //   }
                            // }
                            if(parseInt(subViewData.defpljgpje, 10) >= 500000){
                                subViewData.defpljgpje = 500000;
                            }

                            if($(".xgly").css("display")==='none'){
                                mini.get('gzpz_grid_yl').setData(blPzhdList);
                            }
                            actionMethods.oldGzpzData=mini.get('gzpz_grid_yl').getData();
                            mini.get('lpryl_grid').setData(subViewData.pzhdGprxxList);
                            mini.get('defpljgpje_yl').setValue(subViewData.defpljgpje);
                            // mini.get('sqfwskkpsb_yl').setValue(subViewData.sqfwskkpsb);

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
                            var tabs = mini.get('xbtc-yl-tabs').getTabs();
                            var ownTab;
                            for (var k = 0; k < tabs.length; k++) {
                                if(tabs[k].title === "票种核定"){
                                    ownTab = tabs[k];
                                    break;
                                }
                            }
                            changeTabFlag && mini.get('xbtc-yl-tabs').activeTab(ownTab);
                            $('.gfx-tips').show();
                            if(blxxData && !isblxx){
                                var pzhdsqMxList = blxxData.pzhdsqMxList;
                                for (var k = 0; k < blPzhdList.length; k++) {
                                    for (var m = 0; m < pzhdxxmx.length; m++) {
                                        if(blPzhdList[k].fpzlDm === pzhdxxmx[m].fpzlDm){
                                            blPzhdList[k].myzggpsl = pzhdxxmx[m].myzggpsl;
                                            blPzhdList[k].mczggpsl = pzhdxxmx[m].mczggpsl;
                                            blPzhdList[k].cpzgsl = pzhdxxmx[m].cpzgsl;
                                            blPzhdList[k].lxkpsx = pzhdxxmx[m].lxkpsx;
                                            // blPzhdList[k].lxkpxe = pzhdxxmx[m].lxkpxe;
                                            blPzhdList[k].lxkpljxe = pzhdxxmx[m].lxkpxe;
                                            break;
                                        }
                                    }
                                }
                                if(parseInt(blxxData.defpljgpje, 10) >= 500000){
                                    blxxData.defpljgpje = 500000;
                                }
                                actionMethods.ownBlxxData = blPzhdList;
                                blxxData.ztbz = true;
                            }
                            if($('#tishi').text().indexOf("该纳税人属于高风险纳税人")===-1){
                                $('#tishi').append('<p>该纳税人属于高风险纳税人，专用发票和普通发票核定不超过5份发票，最高开票限额不超过10万元</p>');
                            }
                            actionMethods.isShowgfxts = false;
                        }else{
                            actionMethods.ownBlxxData = blPzhdList;
                        }
                    } else {
                        if(res.message.indexOf("无法从数据库找到可用的模型")===-1){
                            mini.alert(res.message, '提示信息');
                        }
                    }

                },
                error: function (res) {
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
            });
        }
    },
    getParentParamFromUrl: function () {
        var hrefs = window.parent.location.href.split("?");
        if(hrefs.length<=1){
            return null;
        }
        var result = {};
        var params = hrefs[1].split("&");

        for(var i=0;i<params.length;i++){
            var param = params[i].split("=");
            if(param.length<=1){
                continue;
            }
            result[param[0].trim()] = param[1].trim();
        }
        return result;
    },
    addSfzrd: function(){
        // 根据课征主体代码判断是单位纳税人还是个体工商户
        // var kzztdjlxDm = actionMethods.getParentParamFromUrl().kzztdjlxDm;
        // var ownKey = kzztdjlxDm === "1110" ? '110101' : '110121';
        // 如果税费种票种大脑有推荐的 用推荐的 没有的话 取纳税人基础信息里的
        var viewData = mini.decode(sxsl_store.sqsxData.viewData);

        // 根据课征主体代码判断是单位纳税人还是个体工商户
        var isDw = viewData['110101'] ? true : false;
        var kzztdjlxDm = isDw ? '1110' : '1120';
        var ownKey = kzztdjlxDm === '1110' ? '110101' : '110121';

        var danaoHave = actionMethods.sfzrdList.length > 0;
        var hyDm = danaoHave ? actionMethods.sfzrdList[0].hyDm : viewData[ownKey]['djxxbl-yl'].hyDm;
        var hyMc = danaoHave ? actionMethods.sfzrdList[0].hyMc : viewData[ownKey]['djxxbl-yl'].hyDmText;
        var zgswskfjDm = danaoHave ? actionMethods.sfzrdList[0].zgswskfjDm : viewData[ownKey]['djxxbl-yl'].zgswjDm;
        var zgswskfjMc = danaoHave ? actionMethods.sfzrdList[0].zgswskfjMc : viewData[ownKey]['djxxbl-yl'].zgswjDmText;
        var newRow = { zsdlfsDm: '0', zsdlfsmc: '自行申报', rdyxqz: '9999-12-31',
            sbqxDm: '04', sbqxmc: '期满之日起15日内', jkqxDm: '04', jkqxmc: '期满之日起15日内',
            hyDm: hyDm, hyMc: hyMc, zgswskfjDm: zgswskfjDm,zgswskfjMc: zgswskfjMc};
        mini.get('sfzrdGrid').addRow(newRow, 0);
        mini.get('sfzrdGrid').beginEditCell(newRow, "zsxmDm");
    },
    removeRow: function(){
        var rows = mini.get('sfzrdGrid').getSelecteds();
        var allDatas = mini.get('sfzrdGrid').getData();
        rows.sort(function (a, b) {
            return a['_index'] - b['_index'];
        });
        var htmlStr = '';
        for (var i = 0; i < rows.length; i++) {
            var ownIndex = null;
            for (var j = 0; j < allDatas.length; j++) {
                if(rows[i]['_uid'] === allDatas[j]['_uid']){
                    ownIndex = j + 1;
                }
            }
            if(rows[i].zspmmc === undefined){
                rows[i].zspmmc = '';
            }
            rows[i].zsxmmc && (htmlStr += '<p>' + '第' + ownIndex + '条' + rows[i].zsxmmc + " " + rows[i].zspmmc + '</p>');
        }
        !htmlStr && (htmlStr = '是否确认删除');
        if(rows.length > 0){
            mini.confirm(htmlStr, "是否确认删除", function (action) {
                if(action == "ok"){
                    mini.get('sfzrdGrid').removeRows(rows, true);
                }else{
                    return;
                }
            })
        }else {
            mini.alert('请勾选要删除的项');
        }
    },
    /**
     * 税费种认定受理
     * 代码转中文
     * 20190705
     */
    baseCodeToCombSelect: function(){
        // 主附税标志
        actionMethods.zfsbzData = [{ID: '0', MC: '主税'},{ID: '1', MC: '附税'}];
        actionMethods.sfzyzsData = [{ID: 'Y', MC: '是'},{ID: 'N', MC: '否'}];
        var basecodeNameList = {
            zsxmData: 'DM_GY_ZSXM', // 征收项目
            zsdlfsData: 'DM_GY_ZSDLFS', // 征收代理方式
            // hyData: 'DM_GY_HY', // 行业
            // zgswskfjData: 'DM_GY_SWJG_GT3' // 税务机关
            nsqxData: 'DM_GY_NSQX', // 纳税期限
            sbqxData: 'DM_GY_SBQX', // 申报期限
            jkqxData: 'DM_GY_JKQX', // 缴款期限
            // zspmData: 'DM_GY_ZSPM', // 征收品目
            // zszmData: 'DM_GY_ZSZM', // 征收子目
            yskmData: 'DM_GY_YSKM', // 预算科目
            ysfpblData: 'DM_GY_YSFPBL', // 预算分配比例
            skgkData: 'CS_ZS_SWJGGKDZB' // 国库
        };
        for (var item in basecodeNameList) {
            $.ajax({
                url: '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect5/' + basecodeNameList[item],
                type: 'get',
                success: function (res) {
                    if(item === 'zsxmData'){
                        res.sort(function (a, b) {
                            return a.ID - b.ID;
                        });
                    }
                    actionMethods[item] = res;
                },
                error: function (res) {
                    mini.unmask()
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
            })
        }
    },
    /**
     * 税费种认定受理
     * 纳税人基础信息
     * 20190705
     */
    setBaseForm: function(){
        var dwlsgxDm, jdxzDm, zgswskfjDm;
        // 获取dwlsgxDm，jdxzDm
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/dbsx/querySubWssqViewData',
            type: 'post',
            data: {
                sqxh: actionMethods.findWssqMxItem("110101").sqxh
            },
            success: function (res) {
                window.blxx=mini.decode(mini.decode(mini.decode(res.value).data).blxx);
                dwlsgxDm = mini.decode(mini.decode(mini.decode(res.value).data).blxx).dwlsgxDm;
                jdxzDm = mini.decode(mini.decode(mini.decode(res.value).data).blxx).jdxzDm;
                zgswskfjDm = mini.decode(mini.decode(mini.decode(res.value).data).blxx).zgswskfjDm;
                $.ajax({
                    url: '/dzgzpt-wsys/api/baseCode/CombSelect/common/DM_GY_DWLSGX',
                    type: 'get',
                    success: function (res) {
                        for (var i = 0; i < res.length; i++) {
                            if(res[i].ID === dwlsgxDm){
                                actionMethods.dwlsgxDm = res[i].MC;
                                break;
                            }
                        }
                    },
                    error: function (res) {
                        mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                    }
                })
                $.ajax({
                    url: "/dzgzpt-wsys/api/baseCode/get/dmJdxz/" + zgswskfjDm,
                    type: 'get',
                    success: function (res) {
                        for (var i = 0; i < res.length; i++) {
                            if(res[i].ID === jdxzDm){
                                actionMethods.jdxzDm = res[i].MC;
                                break;
                            }
                        }
                    },
                    error: function (res) {
                        mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                    }
                })
            },
            error: function (res) {
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
        var sqsxData = sxsl_store.sqsxData;
        var viewData = mini.decode(sxsl_store.sqsxData.viewData);
        var sfzrdList = actionMethods.sfzrdList;
        var zzsjylbmc,zzsnsrlxmc,zzsqylxmc,ygznsrlxmc;
        for (var i = 0; i < sfzrdList.length; i++) {
            if(sfzrdList[i].zsxmDm === '10101'){
                zzsjylbmc = sfzrdList[i].zzsjylbmc;
                zzsnsrlxmc = sfzrdList[i].zzsnsrlxmc;
                zzsqylxmc = sfzrdList[i].zzsqylxmc;
                ygznsrlxmc = sfzrdList[i].ygznsrlxmc;
                break;
            }
        }
        // 根据课征主体代码判断是单位纳税人还是个体工商户
        var isDw = viewData['110101'] ? true : false;
        var kzztdjlxDm = isDw ? '1110' : '1120';
        var ownKey = kzztdjlxDm === '1110' ? '110101' : '110121';

        // var kzztdjlxDm = actionMethods.getParentParamFromUrl().kzztdjlxDm;
        // var ownKey = kzztdjlxDm === "1110" ? '110101' : '110121';
        var forms = {
            nsrsbh: sqsxData.nsrsbh,
            nsrmc: sqsxData.nsrmc,
            djzclxdmText: viewData[ownKey]['djxxbl-yl'].djzclxdmText,
            scjydz: viewData[ownKey]['djxxbl-yl'].scjydz,
            scjydzxzqhszDmText: viewData[ownKey]['djxxbl-yl'].scjydzxzqhszDmText,
            jyfw: viewData[ownKey]['djxxbl-yl'].jyfw,
            zzsjylbmc: zzsjylbmc,
            zzsnsrlxmc: zzsnsrlxmc,
            zzsqylxmc: zzsqylxmc,
            ygznsrlxmc: ygznsrlxmc,
            dwlsgxDm: actionMethods.dwlsgxDm,
            jdxzDm: actionMethods.jdxzDm
        };
        new mini.Form('#sfzrdForm').setData(forms);
    },
    /**
     * 税费种认定受理
     * 一键保存的子项受理
     * 20190705
     */
    sfzrdMethods:function (index) {
        mini.mask("请求中，请稍候...");
        setTimeout(function () {
            actionMethods._sfzrdMethods(index);
            mini.unmask();
        },2);
    },
    _sfzrdMethods: function(index){
        actionMethods.ownIndex = index;
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/dbsx/querySubWssqViewData',
            type: 'post',
            data: {
                sqxh: actionMethods.findWssqMxItem("110101").sqxh
            },
            success: function (res) {
                window.blxx=mini.decode(mini.decode(mini.decode(res.value).data).blxx);
                var zgswskfjDm = mini.decode(mini.decode(mini.decode(res.value).data).blxx).zgswskfjDm;
                var cjssl = mini.decode(mini.decode(mini.decode(res.value).data).blxx).cjssl;
                actionMethods.zgswskfjDm = zgswskfjDm;
                actionMethods.cjssl = cjssl;

            },
            error: function (res) {
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
        var viewData = mini.decode(sxsl_store.sqsxData.viewData);

        // 根据课征主体代码判断是单位纳税人还是个体工商户
        var isDw = viewData['110101'] ? true : false;
        var kzztdjlxDm = isDw ? '1110' : '1120';
        var ownKey = kzztdjlxDm === '1110' ? '110101' : '110121';
        var sfybnsr = false;
        var zzsNsqxDm = '08';
        if(kzztdjlxDm === '1110'){
            sfybnsr = viewData['110113'].nsrlxDm === '04' ? false : true;
            zzsNsqxDm = viewData['110113'].nsqxDm;
        }
        mini.mask('加载中...');
        $.ajax({
            url: '/dzgzpt-wsys/api/sfzrd/query/dntjlb',
            type: 'post',
            contentType: 'application/json',
            data: JSON.stringify({
                swjgDm: actionMethods.zgswskfjDm, // 税务机关代码
                cjssl: actionMethods.cjssl || parseFloat(viewData[ownKey]['djxxbl-yl'].cjssl), // 城建税税率
                sqxh: actionMethods.sxList[index].sqxh, //actionMethods.sxList[index].sqxh// 税费种认定事项申请序号
                sfybnsr: sfybnsr, // 是否一般纳税人true或false
                zzsNsqxDm: zzsNsqxDm,
                hyDm:blxx.hyDm||''
            }),
            success: function (res) {
                res = mini.decode(res)
                if (res.success) {
                    actionMethods.dntjResult = res.value;
                    actionMethods.sfzrdList = res.value.sfzrdList;
                    actionMethods.baseCodeToCombSelect();
                    actionMethods.setBaseForm();
                    mini.get('sfzrdGrid').setData(res.value.sfzrdList);
                    mini.get('sfzrdWin').show();
                } else {
                    mini.alert(res.message, '提示信息');
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    // 列编辑前
    OnCellBeginEdit: function(e){
        var grid = e.sender;
        var record = e.record;
        var field = e.field, value = e.value;
        var editor = e.editor;
        if(field === 'zspmDm'){
            $.ajax({
                url: '/dzgzpt-wsys/api/sfzrd/baseCode/getZspmXx',
                type: 'get',
                success: function (res) {
                    var result = [];
                    for (var i = 0; i < res.length; i++) {
                        if(record.zsxmDm === res[i].PID){
                            result.push(res[i]);
                        }
                    }
                    actionMethods.zspmDmList = result;
                    editor.setData(result);
                },
                error: function (res) {
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
            })
        }
        if(field === 'zszmDm') {
            $.ajax({
                url: '/dzgzpt-wsys/api/sfzrd/baseCode/XBTC_DM_GY_ZSZM',
                type: 'get',
                success: function (res) {
                    var result = [];
                    for (var i = 0; i < res.length; i++) {
                        if(record.zspmDm === res[i].PID){
                            result.push(res[i]);
                        }
                    }
                    editor.setData(result);
                },
                error: function (res) {
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
            })
        }
    },
    // 列编辑提交后
    OnCellCommitEdit: function(e){
        var grid = e.sender;
        var record = e.record;
        var field = e.field, value = e.value;
        if (field == "zsxmDm") {
            grid.updateRow(record, { zspmDm: "",zspmmc: '', zszmDm: "" ,zszmMc: "", slhdwse: "", zsl: ""});
            if(value === '10109' || value === '30216' || value === '30203'){
                record.zfsbz = '1';
            } else if(value === '10106'){
                record.jkqxDm = '06';
                record.jkqxmc = '月'
            } else if(value === '10104'){
                record.jkqxDm = '08';
                record.jkqxmc = '季'
            } else {
                record.zfsbz = '0';
            }
        }
        if(field == "zspmDm") {
            if(value){
                for (var i = 0; i < actionMethods.zspmDmList.length; i++) {
                    if(value === actionMethods.zspmDmList[i].ID){
                        grid.updateRow(record, { slhdwse: actionMethods.zspmDmList[i].SL,
                            zsl: actionMethods.zspmDmList[i].ZSL });
                        break;
                    }
                }
            }else {
                grid.updateRow(record, { slhdwse: "", zsl: "" });
            }
        }
    },
    isRepeat: function(arr, key){
        var tempArr = [];
        var hash = {};
        var flag = false;
        for (var i = 0; i < arr.length; i++) {
            tempArr.push(arr[i][key]);
        }
        for (var j = 0; j < tempArr.length; j++) {
            if(hash[tempArr[j]]) {
                flag = true;
                break;
            }
            hash[tempArr[j]] = true;
        }
        return flag;
    },
    sfzrdWinClose: function(){
        mini.get('sfzrdWin').hide();
    },
    sfzrdSave: function(){
        if(actionMethods.isRepeat(mini.get('sfzrdGrid').getData(), 'zspmDm')){
            alert("征收品目不能重复");
            return false;
        }
        mini.get('sfzrdGrid').validate();
        if (!mini.get('sfzrdGrid').isValid()) {
            // alert("请校验输入单元格内容");
            var error = mini.get('sfzrdGrid').getCellErrors()[0];
            mini.get('sfzrdGrid').beginEditCell(error.record, error.column);
            return;
        }
        mini.mask('金三交互中，请耐心等待片刻...');
        var blxxData = {
            sfzrdList: mini.get('sfzrdGrid').getData(),
            djxh: actionMethods.sxList[actionMethods.ownIndex].djxh,
            zgswjgDm: actionMethods.sxList[actionMethods.ownIndex].swjgDm,
        };


        setTimeout(function () {
            $.ajax({
                url: '/dzgzpt-wsys/api/wtgl/dbsx/subTask/sxsl',
                type: 'post',
                data: {
                    lcslId: actionMethods.sxList[actionMethods.ownIndex].lcslId || actionMethods.sxList[actionMethods.ownIndex].sqxh,
                    blztDm: '01',
                    rwztDm: sxsl_store.rwztDm,
                    data: '',
                    blxxData: mini.encode(blxxData),
                    cxfxData: mini.encode({dntjData: actionMethods.dntjResult, tjgt3Data: blxxData})
                },
                success: function (res) {
                    res = mini.decode(res)
                    if (res.success) {
                        actionMethods.sfzrdWinClose();
                        actionMethods.showyjbcWin();
                    } else {
                        var msg=res.message;
                        var index=msg.indexOf('失败原因：');
                        if(index>0){
                            index=index+5;
                            msg=msg.substr(index);
                        }
                        mini.alert(msg, '提示信息');
                    }
                    mini.unmask()
                },
                error: function (res) {
                    mini.unmask()
                    mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                }
            })
        },10);

    },
    /**
     * 子项受理
     * 一键保存的子项受理
     * 20190424
     * 1.受理税费种认定在其他事项之前，
     * 2.存款账户报告在三方协议前
     *
     * 20190426
     * 税费种认定无需显示受理
     */
    zslMethods:function (index) {
        mini.mask('请求中，请稍候...');
        setTimeout(function () {
            actionMethods._zslMethods(index);
            mini.unmask();
        },2);
    },
    // 票种核定弹窗部分数据渲染
    renderOtherPz: function(subViewData) {
        mini.get('lpryl_grid_bl').setData(subViewData.pzhdGprxxList);
        mini.get('defpljgpje_yl_bl').setValue(subViewData.defpljgpje || 0);
        // mini.get('sqfwskkpsb_yl').setValue(subViewData.sqfwskkpsb);

        // [一窗通数据]税控设备类型/服务商等于航天信息、百旺金赋、百望财税
        if (subViewData.skfws === 'htxx' || subViewData.skfws === 'bwjf' || subViewData.skfws === 'bwcs') {
            $(".is-dzptfp-bl").show()
            mini.get('skfws_yl_bl').setValue(subViewData.skfws);
        } else {
            $(".is-dzptfp-bl").hide()
        }

        // [一窗通数据]税控设备类型/服务商等于税务UKEY（免费）
        if (subViewData.skfws === 'sw') {
            $('#ukey_box_yl_bl').show();
            $('#zyps-info-yl_bl').hide();
            // 领取方式默认为上门领取
            mini.get('lqfs_yl_bl').setValue('smlq');
        } else if (subViewData.ukLqfs) {
            // ukey领取方式
            var ukLqfs = subViewData.ukLqfs;
            $('#ukey_box_yl_bl').show();
            mini.get('lqfs_yl_bl').setValue(ukLqfs);
            // 领取方式为专业配送
            if (ukLqfs === 'zyps') {
                var yjxx = subViewData.yjxx || {};
                mini.get('receiverName_yl_bl').setValue(yjxx.receiverName);
                mini.get('receiverZjhm_yl_bl').setValue(yjxx.zjhm);
                mini.get('receiverLxdh_yl_bl').setValue(yjxx.lxdh);
                mini.get('postcode_yl_bl').setValue(yjxx.postcode);
                mini.get('city_yl_bl').setValue(yjxx.citydm);
                mini.get('county_yl_bl').setValue(yjxx.county);
                mini.get('address_yl_bl').setValue(yjxx.address);
                $('#zyps-info-yl-bl').show();
            } else {
                $('#zyps-info-yl-bl').hide();
            }
        } else {
            $('#ukey_box_yl_bl').hide();
        }
    },

    //票种核定弹窗点击确定
    pzhdConfirm: function() {
        var gridData = mini.get('gzpz_gridfde').getData();
        var zzdpObj1130 = null;
        var zzdpObj1160 = null;
        var dzzpObj = null;
        var num = 0;
        if (gzpz.unitValidate()) {
            for (var i = 0; i < gridData.length; i++) {
                if (gridData[i].fpzlDm !== '1130' && gridData[i].fpzlDm !== '1160' && gridData[i].fpzlDm !== '13') {
                    num = num + Number(gridData[i].myzggpsl)
                }
                if (gridData[i].fpzlDm === '1130') {
                    zzdpObj1130 = gridData[i];
                }
                if (gridData[i].fpzlDm === '1160') {
                    zzdpObj1160 = gridData[i];
                }
                if (gridData[i].fpzlDm === '13') {
                    dzzpObj = gridData[i];
                }
            }
            if (num > 50) {
                mini.alert('增值税普通发票总数不得大于50份，请重新核定')
                return;
            }
            if ((zzdpObj1130 || zzdpObj1160) && dzzpObj) {
                if (zzdpObj1130) {
                    if ((dzzpObj.dffpzgkpxeDm !== zzdpObj1130.dffpzgkpxeDm) || (dzzpObj.dffpzgkpxeDm === '1' || dzzpObj.dffpzgkpxeDm === '2' || dzzpObj.dffpzgkpxeDm === '3') || (zzdpObj1130.dffpzgkpxeDm === '1' || zzdpObj1130.dffpzgkpxeDm === '2' || zzdpObj1130.dffpzgkpxeDm === '3')) {
                        mini.alert('您为新办纳税人，增值税专用发票（纸质、电子）的最高开票限额需保持一致，并且不可大于十万，请重新核定')
                        return;
                    }
                }
                if (zzdpObj1160) {
                    if ((dzzpObj.dffpzgkpxeDm !== zzdpObj1160.dffpzgkpxeDm) || (dzzpObj.dffpzgkpxeDm === '1' || dzzpObj.dffpzgkpxeDm === '2' || dzzpObj.dffpzgkpxeDm === '3') || (zzdpObj1160.dffpzgkpxeDm === '1' || zzdpObj1160.dffpzgkpxeDm === '2' || zzdpObj1160.dffpzgkpxeDm === '3')) {
                        mini.alert('您为新办纳税人，增值税专用发票（纸质、电子）的最高开票限额需保持一致，并且不可大于十万，请重新核定')
                        return;
                    }
                }
            } else {
                if (zzdpObj1130) {
                    if (zzdpObj1130.dffpzgkpxeDm === '1' || zzdpObj1130.dffpzgkpxeDm === '2' || zzdpObj1130.dffpzgkpxeDm === '3') {
                        mini.alert('您为新办纳税人，增值税专用发票（纸质、电子）的最高开票限额需保持一致，并且不可大于十万，请重新核定')
                        return;
                    }
                }
                if (zzdpObj1160) {
                    if (zzdpObj1160.dffpzgkpxeDm === '1' || zzdpObj1160.dffpzgkpxeDm === '2' || zzdpObj1160.dffpzgkpxeDm === '3') {
                        mini.alert('您为新办纳税人，增值税专用发票（纸质、电子）的最高开票限额需保持一致，并且不可大于十万，请重新核定')
                        return;
                    }
                }
            }
             // 是否需要电专票
             ajax.get('/sxsq-wsys/api/pzhd/dzzpXbtcPassed',{
                swjgDm: sxsl_store.sqsxData.swjgDm,
                kyslrq: $('#nsrjbxxForm').find('input[name="kyslrq"]').val(),
                shxydm: sxsl_store.nsrsbh
            }, function(res) {
                if (res.success) {
                    if (res.value && (zzdpObj1130 || zzdpObj1160) && !dzzpObj) {
                        mini.alert('请增加核定电子专票票种');
                    } else {
                        var obj = {}
                        obj.jgDm = ''
                        obj.jgMc = ''
                        obj.gwMc = ''
                        obj.gwDm = ''
                        obj.defpljgpje=mini.get('defpljgpje_yl').getValue()||"";
                        // actionMethods.sxslSubmit_own(index, obj, '700006')
                        actionMethods.queryShSpgw_cxb(actionMethods.index,obj);
                    }
                }
            })
        }
        
        
    },
    // 获取票种核定弹窗的下拉框
    initPzhdList: function () {
        var request = {
            ybnsrBz: gzpz.nsrlxDm === '04' ? 'N' : 'Y',
        };
        // /fpweb/api/pzhd/initpzhdxx/get
        // /wszx-web/api/wrt/xbnsrzhtcsq/initFphdxx
        //mini.encode(request)
        if (Tools.getUrlParamByName('kzztdjlxdm') === '1120') { // 个人不需要票种核定,直接返回
            return
        }
        mini.mask({
            html: '加载中'
        });
        setTimeout(function () {
            ajax.get( '/sxsq-wsys/api/pzhd/initpzhdxx/get', {
                djxh: actionMethods.sxList[actionMethods.index].djxh
            }, function (data) {
                if (data.success && data.value) {
                    gzpz.nsrRole = data.value.nsrRole;
                    gzpz.ynsjye = data.value.ynsjye || '0';
                    gzpz.dataSource = data.value.pzList;
                    var dataSourse = data.value.pzList;
                    var fpzlListde = [];
                    var fpzlListfde = [];
                    $.each(dataSourse, function (i, v) {
                        /**进行fpzlmc去版本号*/
                        v.fpzlmcTemp = v.fpzlmc; //用于提交数据半流最真实的fpzlmc
                        v.fpzlmc = v.fpzlDm + '|' + v.fpzlmc;
                        /**进行部分字段修正,购票方式代码；操作类型代码*/
                        v.fpgpfsDm = '1';
                        v.fppzhdczlxDm = '1';
                        /**初始化fpzlList*/
                        var obj = {};
                        obj.ID = v.fpzlDm;
                        obj.MC = v.fpzlmc;
                        v.defpbz === 'Y' ? fpzlListde.push(obj) : fpzlListfde.push(obj);
                    });
                    //可以选择的最高开票限额
                    $.each(dataSourse, function () {
                        if (this.defpbz === 'N') {
                            gzpz.dffpzgkpxeList = this.dffpzgkpxeList;
                            return false;
                        }
                    });
                    /**还原页面情况*/
                    // var grid = mini.get('gzpz_grid');
                    // grid.clearRows();
                    //可选择的发票种类
                    gzpz.fpzlListfde = fpzlListfde;
                    var fbzl_comboxfde = mini.get('fbzl_comboxfde');
                    fbzl_comboxfde && fbzl_comboxfde.setData(fpzlListfde);
                    mini.get('fbzl_combox_kpxe').setData(gzpz.dffpzgkpxeList)
                    // var defpljgpjeDom = mini.get('defpljgpje');
                    // defpljgpjeDom.setValue('');
                    // defpljgpjeDom.allowInput = false;

                } else {
                    mini.alert(data.message);
                }
                mini.unmask();
            }, function () {

            });
        }, 500);
    },
    _zslMethods: function (index) {
        actionMethods.index = index;
        // var sfzrdPass = true
        var ckzhbgPass = true;
        // 银行账户名称验证是否和纳税人名称一样
        var zhmcYz = true;
        for (var i = 0; i < actionMethods.sxList.length; i++) {
            var element = actionMethods.sxList[i]
            // if (element.swsxDm === '11010201' && element.blztDm === '00') {
            //     if (parseInt(index) !== i) {
            //         sfzrdPass = false
            //     }
            // }
            if (element.swsxDm === '110111' && element.blztDm === '00') {
                ckzhbgPass = false
            }
            // 验证账户名称是否和纳税人名称一样
            if (element.swsxDm === '110111') {
                var ckzhData = typeof (element.viewData) === 'string' ? mini.decode(element.viewData) : element.viewData;
                if (ckzhData['ckzhzhbg-yltj-form'] && ckzhData['ckzhzhbg-yltj-form']['zhmc'] !== sxsl_store.sqsxData.nsrmc) {
                    zhmcYz = false;
                }
            }
        }
        if (actionMethods.sxList[index].swsxDm === '110701') {
            if (!ckzhbgPass) {
                mini.alert('存款账户报告需要在三方协议前受理！')
                return
            }
            /*if (!zhmcYz && actionMethods.isGt) {
                actionMethods.ckzhBysl(index);
                return;
            }*/
        }
        // if (!sfzrdPass) {
        //     mini.alert('请先受理税费种认定！')
        //     return
        // }
        if (actionMethods.sxList[index].swsxDm === '700006') {
            /**
             * 票种核定
             */
            /* 票种核定前 如果有登记一般纳税人 一般纳税人需要先受理完成 */
            if (actionMethods.beforeZpPzhd(index)) return;
            if (actionMethods.isHdZzssfz(actionMethods.sxList[index].djxh)) {
                // actionMethods.queryShSpgw(index)
                var blData = JSON.parse(actionMethods.sxList[index].viewData);
                mini.get('gzpz_gridfde').setData(blData.pzhdsqMxList);
                actionMethods.renderOtherPz(blData);
                actionMethods.initPzhdList();
                mini.get('pzhdWin').show();
                
            } else {
                mini.alert('您未核定增值税税费种，无法进行票种核定操作!')
                return;
            }
        } else if (actionMethods.sxList[index].swsxDm === '110112') {
            if (actionMethods.isHdZzssfz(actionMethods.sxList[index].djxh)) {
                actionMethods.sxslSubmit(index, '')
            } else {
                mini.alert('未进行增值税税费种认定，请先进行增值税税费种认定操作!')
                return;
            }
        } else if (actionMethods.sxList[index].swsxDm === '30010108') {
            actionMethods.sxslSubmit(index, '', actionMethods.sxList[index].swsxDm)
        } else {
            actionMethods.sxslSubmit(index, '', actionMethods.sxList[index].swsxDm)
        }

    },

    queryShSpgw_cxb: function (index,obj) {
        mini.mask('加载中...')
        ajax.get('/sxsq-wsys/api/hgzx/dbsx/queryReceiveJgDmAndGwXhList/' + sxsl_store.sqxh + '/700006', {}, function (res) {
            if (res.success && res.value) {
                var data = typeof res.value === 'string' ? mini.decode(res.value) : res.value;
                // if (data.length > 1) {

                //todo
                // var _obj =mini.clone(obj);
                // $.extend(_obj,data[0])
                // actionMethods.sxslSubmit_own(index, _obj, '700006')
                // return ;
                //todo

                mini.open({
                    showMaxButton: true,
                    title: "受理",
                    url: '../sqgl/xbnsrzhtcsq_wrt/template/xbtcPzhd/selectTsgw.html',
                    showModal: true,
                    width: "50%",
                    height: "70%",
                    onload: function () {
                        var iframe = this.getIFrameEl()
                        /**
                         * 将数据传给打开的页面
                         */
                        var lcslId = actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh;

                        iframe.contentWindow.selectTsgw.setData(lcslId, sxsl_store.rwztDm, actionMethods.sxList[index].data, data);
                        iframe.contentWindow.selectTsgw.save = function(gwObj){
                            gwObj=$.extend({},obj,gwObj);
                            gwObj.sfzdsp = false;
                            var submitData = actionMethods.sxList[index].data;
                            var djxh;
                            if(actionMethods.ownDjxh){
                                djxh = actionMethods.ownDjxh;
                            }else {
                                djxh = sxsl_store.djxh;
                            }

                            actionMethods.renderPzhd(djxh, false, mini.decode(submitData), false);
                            gwObj.blxxData = actionMethods.ownBlxxData;

                            /* 取管理员修改后的发票数量  20190911*/
                            var fpData=mini.get('gzpz_gridfde')&&mini.get('gzpz_gridfde').getData();
                            $.each(gwObj.blxxData||[],function(i,v) {
                                v.myzggpsl=fpData[i].myzggpsl;
                                v.mczggpsl=fpData[i].mczggpsl;
                                v.cpzgsl=fpData[i].cpzgsl;
                            });
                            gwObj.xgly=$("#xgly").val();
                            /* 修改结束  */

                            // //test
                            // console.log(gwObj);
                            // return;

                            $.ajax({
                                // url: "/cxb-dzgzpt/api/wtgl/subTask/sxsl",
                                url: "/sxsq-wsys/api/wtgl/subTask/sxsl",
                                type: 'post',
                                data: {
                                    lcslId: iframe.contentWindow.selectTsgw.lcslId,
                                    blztDm: '03',
                                    rwztDm: iframe.contentWindow.selectTsgw.rwztDm,
                                    data: iframe.contentWindow.selectTsgw.data,
                                    blxxData: mini.encode(gwObj),
                                },
                                success: function (res) {
                                    res = mini.decode(res);
                                    if (res.success) {
                                        var gwMc = res.resultMap.gwMc;
                                        var jgMc = res.resultMap.jgMc;
                                        var msg = '受理成功！下一环节的办理信息：办理机关：【' +gwObj.jgMc + '】办理岗位：【' + gwObj.gwMc + '】';
                                        iframe.contentWindow.mini.alert(msg, '提示', function () {
                                            iframe.contentWindow.selectTsgw.onCancel('ok')
                                            actionMethods.closeWin();
                                        });
                                    } else {
                                        iframe.contentWindow.mini.alert(res.message, '提示信息')
                                    }
                                },
                                error: function (res) {
                                    iframe.contentWindow.mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                                }
                            })
                        };
                    },
                    ondestroy: function (action) {
                        /**
                         * 关闭票种核定的弹框
                         */
                        if (action == "ok") {
                            /**
                             * 重新获取按钮状态
                             */
                            actionMethods.showyjbcWin()
                        }
                    }
                })
                // } else if (data.length === 1) {
                //     var _obj =mini.clone(obj);
                //     $.extend(_obj,data[0])
                //     actionMethods.sxslSubmit_own(index, _obj, '700006')
                // }
                mini.unmask()
            } else {
                mini.unmask()
                mini.alert(res.message || '查询岗位失败');
            }
        });
    },

    sxslSubmit_own: function (index, blxxData, swsxDm) {
        blxxData.sfzdsp = false;
        mini.mask('加载中...');
        var submitUrl = '/dzgzpt-wsys/api/wtgl/dbsx/subTask/sxsl';
        var submitData = actionMethods.sxList[index].data;
        var djxh;
        if(actionMethods.ownDjxh){
            djxh = actionMethods.ownDjxh;
        }else {
            djxh = sxsl_store.djxh;
        }

        actionMethods.renderPzhd(djxh, false, mini.decode(submitData), false);
        blxxData.blxxData = actionMethods.ownBlxxData;
        // 扣缴税款
        if (swsxDm === '30010108') {
            submitUrl = '/hgzx-gld/api/hgzx/dbsx/subTask/sxsl'; // hgzx-gld
            submitData = '';
        }else if(swsxDm === '700006'){
            // submitUrl = '/cxb-dzgzpt/api/wtgl/subTask/sxsl';
            submitUrl = '/sxsq-wsys/api/wtgl/subTask/sxsl';
        }
        /* 取管理员修改后的发票数量  20190911*/
        var fpData=mini.get('gzpz_grid_yl')&&mini.get("gzpz_grid_yl").getData();
        $.each(blxxData.blxxData||[],function(i,v) {
            v.myzggpsl=fpData[i].myzggpsl;
            v.mczggpsl=fpData[i].mczggpsl;
            v.cpzgsl=fpData[i].cpzgsl;
        });
        blxxData.xgly=$("#xgly").val();
        /* 修改结束  */
        $.ajax({
            url: submitUrl,
            type: 'post',
            data: {
                lcslId: actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh,
                blztDm: blxxData ? '03' : '01',
                rwztDm: sxsl_store.rwztDm,
                data: submitData,
                blxxData: mini.encode(blxxData)
            },
            success: function (res) {
                res = mini.decode(res)
                if (res.success) {
                    var message = ''
                    if (blxxData) {
                        message = '受理成功，系统将自动在核心征管中完成票种核定操作！';
                    } else {
                        message = res.message
                    }
                    /**
                     * 现场ie8下会有问题，强制修改样式
                     */
                    $('.mini-button').css({'width': 'auto', 'padding': '0px 20px', 'height': '34px', 'line-height': '34px'})
                    $('.mini-button .mini-button-text').css({'line-height': '30px'})
                    mini.alert(message || '受理成功！', '提示', function () {
                        actionMethods.showyjbcWin();
                    })
                } else {
                    var msg=res.message;
                    var index=msg.indexOf('失败原因：');
                    if(index>0){
                        index=index+5;
                        msg=msg.substr(index);
                    }
                    mini.alert(msg, '提示信息');
                    actionMethods.showyjbcWin();
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    beforeZpPzhd: function(index) {
        /* 票种核定前 如果有登记一般纳税人 一般纳税人需要先受理完成 */
        var isYbnsrdjFail = false,
            sxList = actionMethods.sxList,
            sxListLen = sxList.length;
        for (var i = 0; i < sxListLen; i += 1) {
            if (sxList[i].swsxDm === '110113') {
                /* 是否有待核定专票 */
                var hasZp = false,
                    obj = mini.decode(sxList[index].data);
                for (var j = 0, lenj = obj.pzhdsqMxList.length; j < lenj; j += 1) {
                    /* 专票暂时写死这两个-未知构成规则 */
                    if (['1160', '1130'].indexOf(obj.pzhdsqMxList[j].fpzlDm) >= 0) {
                        hasZp = true;
                    }
                }
                /* 根据gldcommon.js 中文书预审办理状态代码常量 来判断 */
                if (hasZp && ['00', '03'].indexOf(sxList[i].blztDm) >= 0) {
                    mini.alert('您的增值税一般纳税人登记暂未受理，无法进行票种核定操作!');
                    isYbnsrdjFail = true;
                } else if (hasZp && ['01', '04'].indexOf(sxList[i].blztDm) < 0) {
                    mini.alert('您的增值税一般纳税人登记业务受理失败，不能核定增值税专用发票！');
                    isYbnsrdjFail = true;
                }
            }
        }
        return isYbnsrdjFail;
    },
    sxslSubmit: function (index, blxxData, swsxDm) {
        blxxData.sfzdsp = false;
        mini.mask('加载中...');
        var submitUrl = '/dzgzpt-wsys/api/wtgl/dbsx/subTask/sxsl';
        var submitData = actionMethods.sxList[index].data;
        var djxh = actionMethods.sxList[index].djxh
        // debugger
        // 扣缴税款
        if (swsxDm === '30010108') {
            submitUrl = '/hgzx-gld/api/hgzx/dbsx/subTask/sxsl'; // hgzx-gld
            submitData = '';
        }else if(swsxDm === '700006'){
            // submitUrl = '/cxb-dzgzpt/api/wtgl/subTask/sxsl';
            submitUrl = '/sxsq-wsys/api/wtgl/subTask/sxsl';
        }
        var submitDataFormart = mini.decode(submitData)
        $.ajax({
            url: submitUrl,
            type: 'post',
            data: {
                lcslId: actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh,
                blztDm: blxxData ? '03' : '01',
                rwztDm: sxsl_store.rwztDm,
                data: submitData,
                blxxData: mini.encode(blxxData)
            },
            success: function (res) {
                res = mini.decode(res)
                if (res.success) {
                    var message = ''
                    if (swsxDm === '110111' && submitDataFormart.nsrckzhzhbgb.insertCkzhzhxxGrid.insertCkzhzhxxGridlb[0].cktszhbz === 'Y') { // 存款账户账号报告 维护出口退税账户标识需求
                        actionMethods.slAfter(djxh)
                    }
                    if (blxxData) {
                        message = '受理成功！下一环节的办理信息：办理机关：【' + blxxData.jgMc + '】办理岗位：【' + blxxData.gwMc + '】'
                    } else {
                        message = res.message
                    }
                    /**
                     * 现场ie8下会有问题，强制修改样式
                     */
                    $('.mini-button').css({'width': 'auto', 'padding': '0px 20px', 'height': '34px', 'line-height': '34px'})
                    $('.mini-button .mini-button-text').css({'line-height': '30px'})
                    mini.alert(message || '受理成功！', '提示', function () {
                        actionMethods.showyjbcWin();
                    })
                } else {
                    var msg=res.message;
                    var index=msg.indexOf('失败原因：');
                    if(index>0){
                        index=index+5;
                        msg=msg.substr(index);
                    }
                    mini.alert(msg, '提示信息');
                    actionMethods.showyjbcWin();
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /*
      // 受理完成后的操作
    */
    slAfter: function(djxh) {
        $.ajax({
            url: '/sxsq-wsys/api/ckzhzhbg/tbcktsbz',
            type: 'get',
            data: { djxh: djxh }
        })
    },
    /**
     * 受理
     */
    slxbtc: function (lcslId, isYct) {
        var viewData = sxsl_store.sqsxData.viewData
        var sxList = actionMethods.sxList
        var newArr = []
        var isDw = false
        var childlcslId = ''
        if (sxList.length === 0) {
            newArr = sqzl.getPackViewData(sxsl_store.sqxh);
        } else {
            newArr = sxList
        }
        for (var index = 0; index < newArr.length; index++) {
            var element = newArr[index]
            if (element.swsxDm === '110101') {
                isDw = true
            }
            if (element.swsxDm === '110101' || element.swsxDm === '110121') {
                childlcslId = element.lcslId
            }
        }
        if (!isDw) {
            url = '../sqgl/xbnsrzhtcsq_wrt/template/swdjxxblGr-cxb/dj_sldj_blxx.html'
        } else {
            url = '../sqgl/xbnsrzhtcsq_wrt/template/swdjxxblDw-cxb/dj_sldj_blxx.html'
        }
        mini.open({
            showMaxButton: true,
            title: "受理",
            url: url,
            showModal: false,
            width: "70%",
            height: "90%",
            onload: function () {
                var iframe = this.getIFrameEl()
                /**
                 * 将数据传给打开的页面
                 */
                iframe.contentWindow.slbl.setData(lcslId, sxsl_store.sqsxData.blztDm, sxsl_store.rwztDm, isYct, viewData, childlcslId, sxsl_store.saveDjxh)
            },
            ondestroy: function (action) {
                /**
                 * 关闭补录信息的弹框
                 */
                if (action == "ok") {
                    var iframe = this.getIFrameEl()
                    actionMethods.renderBtn('60') // 重新渲染按钮
                    actionMethods.ownDjxh = iframe.contentWindow.slbl.djxh;
                    if(window.swdjjg){
                        actionMethods.renderPzhd(iframe.contentWindow.slbl.djxh, true, iframe.contentWindow.slbl, true, isDw);
                    }else{
                        actionMethods.renderBtn('00');
                    }
                    /**
                     * 发送短信
                     *
                     * 受理中不发送短信，所以注释掉
                     */
                    // actionMethods.isBysl = false
                    // actionMethods.showfsdxWin()
                }
            }
        })
    },
    ckzhBysl: function (index, blxxData) {
        // 三方协议由于银行信息中存款账户名称和纳税人名称不一样，所以不予受理
        mini.mask('加载中...');
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/dbsx/subTask/sxsl',
            type: 'post',
            data: {
                lcslId: actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh,
                blztDm: '02',
                rwztDm: sxsl_store.rwztDm,
                data: '',
                blxxData: blxxData
            },
            success: function (res) {
                res = mini.decode(res)
                if (res.success) {
                    mini.alert('缴款帐号名称和纳税人名称不一致，无法进行网签三方协议操作！', '提示', function () {
                        actionMethods.showyjbcWin()
                    })
                } else {
                    var msg=res.message;
                    var index=msg.indexOf('失败原因：');
                    if(index>0){
                        index=index+5;
                        msg=msg.substr(index);
                    }
                    mini.alert(msg, '提示信息');
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /**
     * 不予受理
     */
    byslClick: function () {
        mini.get('byslWin').show()
    },
    bjClick: function(){
        actionMethods.isBysl = false;
        ajax.get('/sxsq-wsys/api/hcp/updateXbtcPjjg?sqxh=' + sxsl_store.sqxh, {}, function() {})
        actionMethods.showfsdxWin() // 发送短信
    },
    byslWinClick: function () {
        var reason = mini.get('reason')
        if (reason.validate()) {
            mini.get('dbWin').hide()
            actionMethods.isBysl = true
            actionMethods.showfsdxWin()
        }
    },
    byslMethods: function () {
        var isYct = urlParams.urlParams.isYct
        var swsxDm = ''
        var data = sxsl_store.sqsxData.data
        data = JSON.parse(data)
        for (var index = 0; index < data.length; index++) {
            var element = data[index]
            if (element.swsxDm === '110101') {
                swsxDm === '110101'
            } else {
                swsxDm = '110121'
            }
        }
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/sxsl/xbnsrtc",
            data: JSON.stringify({
                parentlcslid: sxsl_store.lcslId, // 父流程实例ID
                lcslid: sxsl_store.lcslId, // 流程实例ID
                blztDm: '02', // 办理状态代码 （受理通过  受理不通过 02
                rwztDm: sxsl_store.rwztDm, // 任务状态代码
                blxxData: '', // 补录信息
                swsxDm: swsxDm,
                reason: mini.get('reason').getValue() || '',
                isYct: isYct === '2' ? true : false // 是否一窗通
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    mini.alert(res.message || '不予受理成功！', '提示信息', function () {
                        // actionMethods.isBysl = true
                        // actionMethods.showfsdxWin() // 发送短信
                        actionMethods.closeWin()
                        actionMethods.renderBtn('02') // 重新渲染按钮
                    })
                } else {
                    mini.alert(res.message, '提示信息');
                    actionMethods.renderBtn('00') // 重新渲染按钮
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /**
     * 点击一键保存
     */
    yjbcMethods: function () {
        //actionMethods.sxList
    },
    /**
     * 办结
     */
    bjMethods: function () {
        // mini.confirm("确认是否办结？","确定",
        // 	function(action) {
        //     if (action == "ok") {
        var isYct = urlParams.urlParams.isYct
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/bj/xbnsrtc",
            data: JSON.stringify({
                lcslid: sxsl_store.sqxh,
                isYct: isYct === '2' ? true : false
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    mini.alert(res.message || '办结成功！', '提示信息', function () {
                        actionMethods.renderBtn('61')
                        actionMethods.closeWin()
                        /**
                         * 点击办结时，发送短信给纳税人
                         */
                        // actionMethods.isBysl = false
                        // actionMethods.showfsdxWin() // 发送短信
                    })
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
        //     } else {
        //         return;
        //     }
        // });
    },
    /**
     * 实名认证
     */
    smrzMethods: function () {
        mini.open({
            showMaxButton: true,
            title: "实名认证",
            url: './smrz/smrzList.html',
            showModal: true,
            width: "90%",
            height: "90%",
            onload: function () {
                var iframe = this.getIFrameEl();
                iframe.contentWindow.smrzList.setData(sxsl_store.sqxh,sxsl_store.sqsxData.nsrmc,sxsl_store.sqsxData.nsrsbh,sxsl_store.sqsxData.djxh)
            },
            ondestroy: function (action) {
                actionMethods.smtgRender();
                /**
                 * 关闭实名认证的弹框
                 */
                // if (action == "ok") {
                //     var smrzxxId= mini.Cookie.get("smrzxxId");
                //     mini.mask('加载中...')
                //     $.ajax({
                //         url: "/dzgzpt-wsys/api/wtgl/smrz/save",
                //         data: {
                //             lcslId: sxsl_store.sqxh,
                //             smrzId: smrzxxId
                //         },
                //         type: 'post',
                //         success: function (res) {
                //             res = mini.decode(res);
                //             mini.unmask()
                //             if (res.success) {
                //                 actionMethods.smtgRender();
                //             } else {
                //                 mini.alert(res.message, '提示信息')
                //             }
                //         },
                //         error: function (res) {
                //             mini.unmask()
                //             mini.alert(res.message || '系统异常请稍后再试', '提示信息')
                //         }
                //     })
                // }
            }
        })
    },
    smtgRender: function () {
        var lcslid = sxsl_store.sqxh;
        ajax.get('/dzgzpt-wsys/api/wtgl/smrz/image/get/' + lcslid, {}, function (res) {
            if (res.success) {
                if (!res.value) {
                    return
                }
                //获取图片
                var jbrList = res.value;
                var html = '';
                $.each(jbrList, function (i, v) {
                    html += '<div style="font-size:18px;margin:20px;">'+v.name+'&nbsp;&nbsp;'+v.identityNo+'&nbsp;&nbsp;采集时间：'+v.time+'</div>';
                    html += '<div><img width="400px" src="data:image/png;base64,'+encodeURI(v.image)+'"/></div>'
                })
                $('#smrzYl').html(html)
            } else {
                // mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        });
    },
    /**
     * ca
     */
    cazskhMethods: function () {
    },
    /**
     * 点击“发放”按钮，申请状态更新为已发放。（税务人员在金三打印税务事项通知书等信息给纳税人）
     */
    ffMethods: function () {
        var isYct = urlParams.urlParams.isYct
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq//grant/xbnsrtc",
            data: JSON.stringify({
                lcslid: sxsl_store.sqxh,
                isYct: isYct === '2' ? true : false
            }),
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    mini.alert(res.message || '发放成功！', '提示信息', function () {
                        //62 已发放
                        actionMethods.renderBtn('62')
                    })
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    getSqData:function (swsxDm) {
        var data;
        $.each(JSON.parse(sxsl_store.sqsxData.viewData),function (i,v) {
            if(i === swsxDm){
                data = v
                return;
            }
        });
        return data;
    },
    cwkjzdCheckBoxs:function (codeName,name) {
        var list = baseCode.getDataByCodeName(codeName);
        var html = [];
        $.each(list, function (i, v) {
            name === v.MC ?
                html.push('<span><input type="checkbox" checked value="' + v.ID + '"/>' + v.MC + '</span>') :
                html.push('<span><input type="checkbox" value="' + v.ID + '"/>' + v.MC + '</span>');
        });
        return html.join('');
    },
    getZjffXl:function (dm,name) {
        var url = '/dzgzpt-wsys/api/baseCode/get/baseCode2CombSelect3?codename=DM_ZJFF&dlValue=' + dm + '&dlName=ZJFF_DL_DM';
        var html = [];
        ajax.get(url,'',function (list) {
            $.each(list, function (i, v) {
                name === v.MC ?
                    html.push('<span><input type="checkbox" checked value="' + v.ID + '"/>' + v.MC + '</span>') :
                    html.push('<span><input type="checkbox" value="' + v.ID + '"/>' + v.MC + '</span>');
            });
        });
        return html.join('');
    },
    /**
     * 申请表打印
     */
    sqbdyMethods: function () {
        var me = actionMethods;
        mini.mask('正在初始化打印数据，请稍候...');
        setTimeout(function () {
            var $div,item;
            var printTag = $('<div id="xbtcsqb-content"></div>');
            var printConfig = {importCSS: false};
            var html = wssqUtil.loadTemplate('./sqb.html');
            printTag.html(html);

            var viewData = JSON.parse(sxsl_store.sqsxData.viewData);
            if (typeof sxsl_store.sqsxData.lrsj === 'string') {
                sxsl_store.sqsxData.lrsj = sxsl_store.sqsxData.lrsj.substr(0,19)
                sxsl_store.sqsxData.lrsj = new Date(sxsl_store.sqsxData.lrsj)
                sxsl_store.sqsxData = mini.decode(sxsl_store.sqsxData)
            }
            var printData = {
                nsrmc: sxsl_store.sqsxData.nsrmc,
                nsrsbh: sxsl_store.sqsxData.nsrsbh,
                jbrmc: sxsl_store.sqsxData.jbrmc,
                lrsj_n: sxsl_store.sqsxData.lrsj.format('yyyy-MM-dd').substr(0,4),
                lrsj_y: sxsl_store.sqsxData.lrsj.format('yyyy-MM-dd').substr(5,2),
                lrsj_r: sxsl_store.sqsxData.lrsj.format('yyyy-MM-dd').substr(8,2)
            };
            for(var subSwsxDm in viewData){
                if(viewData.hasOwnProperty(subSwsxDm)){
                    var subViewData = viewData[subSwsxDm];
                    subViewData = typeof subViewData === 'string' ? JSON.parse(subViewData) : subViewData;
                    // 税务登记信息补录
                    if(subSwsxDm === '110101' || subSwsxDm === '110121'){
                        item = subViewData['djxxbl-yl'];
                        printData = $.extend({}, printData, {
                            fddbrxm: item.fddbrxm
                        });
                        var sqD = me.getSqData(subSwsxDm);
                        sqD = typeof sqD === 'string' ? JSON.parse(sqD) : sqD
                        // 核算方式 DM_GY_HSFS改为XBTC_DM_GY_HSFS
                        var mc = baseCode.getMcById('XBTC_DM_GY_HSFS',sqD['djxxbl-yl'].hsfsDm);
                        printTag.find('#hsfs-td').html(me.cwkjzdCheckBoxs('XBTC_DM_GY_HSFS',mc));
                        // 从业人数
                        !!item.cyrs && printTag.find('#cyrs').html(item.cyrs);
                        //个体默认为小规模，个体【一般纳税人资格认定】纳税人端没有勾选就没有传，所以写死
                        if (subSwsxDm === '110121') {
                            printTag.find('#zzsxgmnsr').attr('checked', true);
                            printTag.find('#zzsybnsr').removeAttr('checked');
                        }
                    }
                    // 存款账户账号报告
                    else if(subSwsxDm === '110111'){
                        item = subViewData['ckzhzhbg-yltj-form'];
                        printData = $.extend({}, printData, {
                            yhzhxzDmText: item['ckzhzhbg-yhzhxzDmText'],
                            yhkhdjzh: item.yhkhdjzh,
                            yhyywdDmText: item['ckzhzhbg-yhyywdDmText'],
                            yhzh: item.yhzh,
                            bzText: baseCode.getMcById('DM_GY_HB', item.hbszDm),
                            sxjszhbzText: item.sxjszhbz === 'Y' ? '<input type="checkbox" checked>' : '<input type="checkbox">',
                            khrq: item.khrq ? item.khrq.substr(0, 10) : ''
                        });
                    }
                    // 财务会计制度备案
                    else if (subSwsxDm === '110112'){
                        item = subViewData['yltj'];
                        var cwkjzdObj = {
                            /* DM_SYKJZD:'#kjzd-td',// 财务、会计制度名称*/
                            DM_DZYHPTXFF:'#txff-td',//低值易耗品摊销方法名称
                            DM_ZJFF_DL:'#zjdl-td',//折旧方法（大类）
                            DM_CBHSFF:'#hdff-td',//成本核算方法名称
                            DM_SJKMC:'#sjklx-td',//会计核算软件数据库类型
                        };
                        if(item.kjzdzzDmText === '企业会计准则'){
                            printTag.find('#qykjzz').attr('checked',true);
                        }else if(item.kjzdzzDmText === '小企业会计准则'){
                            printTag.find('#xqykjzz').attr('checked',true);
                        }
                        else{
                            printTag.find('#qtkjzz').attr('checked',true);
                            printTag.find('#qtkjzz-txt').text('').append(
                                '其他：<span style="text-decoration: underline">' + item.kjzdzzDmText + '</span>');
                        }

                        printTag.find('#txff-td').html(me.cwkjzdCheckBoxs('DM_DZYHPTXFF',item.dzyhptxffDmText));
                        printTag.find('#zjdl-td').html(me.cwkjzdCheckBoxs('DM_ZJFF_DL',item.zjfsdlDmText));
                        printTag.find('#hdff-td').html(me.cwkjzdCheckBoxs('DM_CBHSFF',item.cbhsffDmText));
                        printTag.find('#sjklx-td').html(me.cwkjzdCheckBoxs('DM_SJKMC',item.kjhsrjsjklxmcText));
                        // 折旧小类
                        var dlDm;
                        if( item.zjfsdlDmText==='直线折旧法'){
                            dlDm = '10';
                        }else if(item.zjfsdlDmText==='加速折旧法'){
                            dlDm = '20';
                        }
                        printTag.find('#zjxl-td').html(me.getZjffXl(dlDm,item.zjfsxlDmText));
                        //软件名称，版本号
                        printTag.find('#rjbbh-td').html(item.kjhsrjbbh);
                        printTag.find('#rjmc-td').html(item.kjhsrjmc);
                    }
                    // 增值税一般纳税人登记
                    else if(subSwsxDm === '110113'){
                        if (subViewData.nsrlxDm === '05') {
                            // 纳税人类型
                            printTag.find('#zzsybnsr').attr('checked', true);
                            printTag.find('#zzsxgmnsr').removeAttr('checked');
                            item = subViewData;
                            //var ybnsrViewData = me.getSqData(subSwsxDm);
                            //会计核算健全
                            var t = item.kjhsjqbz === 'Y' ? '是' : '否';
                            printTag.find('#kjhsjqbz').html('<span><input type="checkbox" checked>' + t + '</span>');
                            //一般纳税人资格生效日期
                            printTag.find('#ybnsr-sxrq-' + item.ybnsrzgsxrq).attr('checked', true);
                            //主营业务类别
                            printTag.find('#ybnsr-zyywlb-' + item.nsrzyDm).attr('checked', true);
                        } else if (subViewData.nsrlxDm === '04') {
                            printTag.find('#zzsxgmnsr').attr('checked', true);
                            printTag.find('#zzsybnsr').removeAttr('checked');
                        }

                    }
                    // 票种核定
                    else if(subSwsxDm === '700006'){
                        item = subViewData;
                        // 购票人
                        if (urlParams.urlParams.isYct === 2) {
                            var gprlx = ''
                            var gprlx = ''
                            if (item.jbrxx.bsylx == 1) {
                                gprlx = 'fddbr'
                            } else if (item.jbrxx.bsylx == 2) {
                                gprlx = 'cwfzr'
                            } else if (item.jbrxx.bsylx == 3){
                                gprlx = 'bsy'
                            } else {}
                            printTag.find('#gpr-' + gprlx).attr('checked',true);
                        }
                        $.each(item.pzhdGprxxList,function (i,v) {
                            if (v.gprlx) {
                                printTag.find('#gpr-' + v.gprlx).attr('checked',true);
                            }
                        });
                        // 发票
                        printTag.find('#fptr-empty').remove();
                        var depArr=[],zpAndppArr=[];
                        $.each(item.pzhdsqMxList, function (i, v) {
                            v.defpbz === 'Y' ? depArr.push(v) : zpAndppArr.push(v);
                        });
                        var trs='';
                        $.each(depArr, function (j, dep) {
                            if (j === 0) {
                                trs += '<tr align="center">' +
                                    '<td colspan="2" style="border-left:none;border-right-width:1px">' + (dep.fpzlmcTemp || dep.fpzlmc) + '</td>' +
                                    '<td colspan="2"></td>' +
                                    '<td colspan="2"></td>' +
                                    '<td colspan="2" rowspan="' + depArr.length + '" style="border-right:none">' + item.defpljgpje + '</td>' +
                                    '</tr>';
                            } else {
                                trs += '<tr align="center">' +
                                    '<td colspan="2" style="border-left:none;border-right-width:1px">' + (dep.fpzlmcTemp || dep.fpzlmc) + '</td>' +
                                    '<td colspan="2"></td>' +
                                    '<td colspan="2"></td>' +
                                    '</tr>';
                            }
                        });
                        $.each(zpAndppArr, function (i, fp) {
                            trs += '<tr align="center">' +
                                '<td colspan="2" style="border-left:none;border-right-width:1px">' + (fp.fpzlmcTemp || fp.fpzlmc) + '</td>' +
                                '<td colspan="2">' + fp.myzggpsl + '</td>' +
                                '<td colspan="2">' + fp.mczggpsl + '</td>' +
                                '<td colspan="2" style="border-right:none"></td>' +
                                '</tr>';
                            if (fp.zppzDm === '1') {
                                printTag.find('#zp_' + fp.dffpzgkpxeDm).attr('checked', true);
                            } else if (fp.zppzDm === '3') {
                                printTag.find('#pp_' + fp.dffpzgkpxeDm).attr('checked', true);
                            }

                        });
                        printTag.find('#fptr').after(trs);
                        !!item.skfws && printTag.find('#' + item.skfws).attr('checked',true);
                    }
                }
            }

            for (var prop in printData) {
                if (printData.hasOwnProperty(prop)) {
                    $div = printTag.find('#' + prop);
                    !!$div.length && $div.html(printData[prop]); // 循环赋值
                }
            }
            mini.unmask();
            if (navigator.userAgent.indexOf('Chrome') > -1) {
                printTag.printThis(printConfig);
            } else {
                mini.showMessageBox({
                    width: 1090,
                    height: 800,
                    maxWidth: 1090,
                    maxHeight: 700,
                    title: "申请表",
                    buttons: ["ok", "cancel"],
                    message: "申请表",
                    html: printTag.html(),
                    callback: function (action) {
                        if (action === 'ok') {
                            printTag.printThis(printConfig);
                        }
                    }
                });
            }
        }, 200);
    },
    /**
     * 编辑短信
     * **/
    textChange:function(e){
        var currentVal = e.value;
        var len = currentVal.toString().length;
        var showNumber = $('#showNumber');
        showNumber.html(len).css('color','#333');
        if(len > 60){
            showNumber.css('color','red');
            $('#tips').show();
        }else {
            $('#tips').hide();
        }
    },
    /**
     * 发送短信
     */
    fsdxMethods: function (type) {
        var dxnr = mini.get('dxnr').getValue()
        // var jbr = mini.get('jbr').getValue()
        // var phone = mini.get('sjhm').getValue()
        if (!mini.get('dxnr').validate()) {
            mini.alert('短信内容最多支持60个中文字符')
            return
        }
        if (!dxnr) {
            mini.alert('请输入短信内容')
            return
        }
        mini.mask('加载中...')
        $.ajax({
            url: "/dzgzpt-wsys/api/wtgl/sms/send",
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                // jbr: jbr,
                // phone: phone,
                blztDm: actionMethods.isBysl ? '02' : '61', // 02 ： 受理不通过时候   60： 已受理
                content: dxnr,
                parentsqxh: sxsl_store.sqsxData.sqxh
            }),
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {
                    mini.alert(res.message || '短信发送成功！','提示信息', function () {
                        if (actionMethods.isBysl) {
                            actionMethods.byslMethods()
                        } else {
                            actionMethods.bjMethods()
                        }
                    })
                } else {
                    mini.alert(res.message, '提示信息')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    /**
     * 申请中得纳税人已经再金三中存在
     * c、	申请中的纳税人已经在金三中存在的给出对应提示；
     */
    isInJs: function () {
        mini.mask('加载中...')
        var data = sxsl_store.sqsxData.data
        var sqData = mini.decode(sxsl_store.sqsxData.data)
        var jbData = null
        for(var i = 0; i < sqData.length; i++) {
            if (sqData[i].swsxDm === '110101' || sqData[i].swsxDm === '110121') {
                jbData = sqData[i].data
                break;
            }
        }
        jbData = mini.decode(jbData)
        $.ajax({
            url: '/sxsq-wsys/api/xbnsrtc/buttonCtr',
            dataType: 'json',
            type: 'post',
            contentType: 'application/json;charset=utf-8',
            data: mini.encode({
                shxydm: jbData.nsrsbh,
                zzjgDm: jbData.zzjgdm || '',
                zgswjDm: sxslcommon.swsxsqJbxx.swjgDm,
                kzztdjlxDm: jbData.kzztdjlxdm,
                lcslId: sxsl_store.lcslId
            }),
            success: function (res) {
                if (res.success && res.value) {
                    actionMethods.currentNsrIsInJs = res.value.zt
                    actionMethods.currentNsrIsInJsValidate = res.value.validate
                    if (res.value.tip) {
                        $('#tishi').append('<p>' + res.value.tip + '</p>')
                    }
                }
                mini.unmask()
            }
        });
    },
    /**
     * 法定代表人或者业务名下存在非正常户
     * b、	法定代表人或者业主，存在非正常户的给出对应提示。
     */
    isZch: function () {
        var viewData = JSON.parse(sxsl_store.sqsxData.viewData)
        var zjhm = ''
        var swdjxxbl = viewData['110101'] || viewData['110121'];
        viewData = typeof swdjxxbl === 'string' ? JSON.parse(swdjxxbl) : swdjxxbl;
        if (viewData) {
            zjhm = viewData['djxxbl-yl'].fddbrsfzjhm
        }
        if (zjhm) {
            mini.mask('加载中...')
            ajax.post('/dzgzpt-wsys/api/wtgl/nsrxx/check/sfczfzcqy/' + zjhm, {}, function (res) {
                if (res.success) {
                    if (res.value.fzchbz) {
                        actionMethods.currentNsrIsInFzch = true
                        $('#tishi').append('<p>' + viewData['djxxbl-yl'].fddbrxm + '同时为【' + res.value.fzchList[0].nsrmc + '】的法定代表人，【' + res.value.fzchList[0].nsrmc + '】为非正常户。</p>')
                    }
                } else {
                    mini.alert(res.message || '系统异常请稍后再试')
                }
                mini.unmask()
            });
        }
    },
    checkJssfcz: function(){
        ///dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/check/jssfcz
        /**
         * 个体工商户与单位纳税人在系统中是否存在 调用 :/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/check/jssfcz
         JSON格式参数:{"kzztdjlxDm":"","zzjgDm":"","zzhm":""}
         kzztdjlxDm区分个体工商户1120 单位纳税人1110 必传
         zzjgDm 单位/个体工商户组织机构代码
         zzhm 证照号码 单位不用传
         单位返回{"value":[{"nsrmc":"","zzjgdm":""},{"nsrmc":"","zzjgdm":""}]}
         个体工商户返回{"value":[{"nsrmc":""},{"nsrmc":""}]}
         */
        var viewData = sxsl_store.sqsxData.viewData
        viewData = JSON.parse(viewData)
        var isDw = viewData['110101'] ? true : false
        viewData = viewData['110101'] || viewData['110121']
        viewData = typeof viewData === 'string' ? JSON.parse(viewData) : viewData
        var kzztdjlxDm = '1120'
        if (isDw) {
            kzztdjlxDm = '1110'
        }
        if (isDw && !viewData['djxxbl-yl'].zzjgdm) {
            return
        }
        if (!isDw && !viewData['djxxbl-yl'].zzjgdm && !viewData['djxxbl-yl'].zzhm) {
            return
        }
        $.ajax({
            url: '/dzgzpt-wsys/api/wtgl/xbnsrzhtcsq/check/jssfcz',
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            data: JSON.stringify({
                kzztdjlxDm: kzztdjlxDm,
                zzjgDm: viewData['djxxbl-yl'].zzjgdm || '', // '197010085' ||
                zzhm: isDw ? null : viewData['djxxbl-yl'].zzhm || ''// '130426600076204' ||
            }),
            success: function (res) {
                if (res.success) {
                    if (res.value && res.value.length > 0) {
                        var zzjgdm = res.value[0].zzjgdm
                        var nsrmc = res.value[0].nsrmc
                        if (!isDw) {
                            //$('#tishi').append('<p>当前纳税人的组织机构代码或者证照号码已经存在其他纳税人【' + nsrmc + '】</p>')
                        } else {
                            // $('#tishi').append('<p>核心征管系统中已存在组织机构代码【' + zzjgdm + '】相同的企业【' + nsrmc + '】</p>')
                        }
                    }
                } else {
                    mini.alert(res.message || '系统异常请稍后再试')
                }
                mini.unmask()
            },
            error: function (res) {
                mini.unmask()
                mini.alert(res.message || '系统异常请稍后再试', '提示信息')
            }
        })
    },
    closeSearchWin: function(){
        if (window.CloseOwnerWindow)
            return window.CloseOwnerWindow('ok');
        else
            window.close();
    }
}

function checkDbsxslzt(lcslId, callback){
    mini.Cookie.set("lcslId", lcslId);
    $.ajax({
        url : "../../../../api/wtgl/dbsx/checkDbsxslzt",
        data : {
            lcslId : lcslId
        },
        success : function(data) {
            var resultData = mini.decode(data);
            if (resultData.success) {
                if ("true" != resultData.value.toString()) {
                    mini.alert(resultData.value + "正在审核此任务，无法继续操作。", "提示信息",callback());
                }
            } else {
                mini.alert(resultData.message, '提示信息', function() {});
            }
        },
        error : function() {
            mini.alert("判断是否存在并发受理失败。", '提示信息');
        }
    });
}

$(function () {
    var result = sxslcommon.initSxslPage(sxslcommon.swsxsqJbxx)
    var sqlymc = urlParams.urlParams.sqlymc
    // isYct：2 一窗通
    if (!result) {
        mini.alert("初始化页面失败，申请信息为空！")
        return
    }
    checkDbsxslzt(sxsl_store.sqxh,function(){
        doBack();
    });
    if (urlParams.urlParams.from === 'search') {
        $('#closeSearchWin').css('display', 'inline-block')
        $('#closeSearchWin').siblings('a').remove()
        return
    }
    var subWssqMxList = window.subWssqMxList = sqzl.getPackViewData(sxsl_store.sqxh);
    var rwly = '任务来源未知'
    if (subWssqMxList[0].qdid === "web") {
        rwly = '电子税务局'
    }
    if (subWssqMxList[0].qdid === "yct") {
        rwly = '一窗通'
    }
    $('#rwly').text(rwly);
    /**
     * a、	单位纳税人、个体工商户，当负责人信息实名认证不通过的，在弹出框下方展示
     * 对应认证不通过的信息提醒，由纳税人端传过来
     */
    var viewData = mini.decode(sxsl_store.sqsxData.viewData)
    viewData = typeof viewData === 'string' ? JSON.parse(viewData) : viewData;
    var swdjxxbl = viewData['110121'] || viewData['110101'];
    if (viewData['110101']) {
        actionMethods.isDw = true;
    }
    if (viewData['700006']) {
        actionMethods.isHasPzhd = true; // 有票种核定
    }
    if (swdjxxbl) {
        viewData = typeof swdjxxbl === 'string' ? JSON.parse(swdjxxbl) : swdjxxbl;
        if (viewData['djxxbl-yl'] && viewData['djxxbl-yl']['isSm']) {
            $('#tishi').append(viewData['djxxbl-yl']['isSm'])
        }
    }
    actionMethods.getSwjgList()
    actionMethods.isInJs()
    actionMethods.isZch()
    actionMethods.checkJssfcz()
    actionMethods.renderBtn(sxsl_store.sqsxData.blztDm);
    // actionMethods.initHdXX();
    //绑定事件
    $('#dxnr').bind('input propertychange', function() {
        var currentVal = $(this).find('textarea').val();
        var len = currentVal.toString().length;
        var showNumber = $('#showNumber');
        showNumber.html(len).css('color','#333');
        if(len > 60){
            showNumber.css('color','red');
            $('#tips').show();
        }else {
            $('#tips').hide();
        }
    });
})
/**
 * 短信内容校验
 */
mini.VTypes["chineseErrorText"] = "请输入最大60个中文字符";
mini.VTypes["chinese"] = function(v) {
    var length = v.toString().length
    if (!v || v === "")
        return true;
    if (!v || (length <= 60))
        return true;
    return false
}

window.blxx={};


actionMethods.initHdXX=function () {
    var subViewData;
    var isDw;
    var isblxx=false;
    var djxh=sxsl_store.djxh;
    if(!djxh){
        mini.get('gzpz_grid_yl')&&mini.get("gzpz_grid_yl").setAllowCellEdit(false);
        return;
    }

    var sqsxDataViewData = JSON.parse(sxsl_store.sqsxData.viewData);
    var sxData = actionMethods.findWssqMxItem("110101").data || actionMethods.findWssqMxItem("110121").data;
    var blxxFormData;
    if (isblxx) {
        actionMethods.blxx = blxxFormData = blxxData.blxxForm.getData(true)
    } else {
        blxxFormData = sxData.blxx ? JSON.parse(sxData.blxx) : actionMethods.blxx;
    }
    // var blxxFormData = isblxx ? blxxData.blxxForm.getData(true) : JSON.parse(sxData.blxx);
    var data110101 = (sqsxDataViewData["110101"] || sqsxDataViewData["110121"])["djxxbl-yl"];
    isDw = sqsxDataViewData['110101'] ? true : false;
    var zcdzxzqhdm = isDw ? sxData.zcdzxzqhdm : sxData.scjydzjdxzDm;
    var swjgCode = blxxFormData.zgswskfjDm;
    var sqxh = actionMethods.findWssqMxItem("700006").sqxh;
    var nsrdjxx = {
        nsrmc: data110101.nsrmc,
        fddbrsfzjhm: data110101.fddbrsfzjhm,
        cwsfzjhm: data110101.cwfzrsfzjhm,
        bsysfzjhm: data110101.bsrsfzjhm,
        hyDm: data110101.hyDm,
        dwlsgxdm: blxxFormData.dwlsgxDm,
        zzlxdm: blxxFormData.zzjglxDm,
        djjgdm: blxxFormData.zgswskfjDm,
        zcdz: data110101.zcdz,
        kqccsztdjbz: "N",
        fjmqybz: "N",
        zcdzxzqhdm: zcdzxzqhdm || '',
        djzclxdm: sxData.djzclxdm || '',
        fddbrsfzjzl: sxData.fddbrsfzjzl || '',
        scjydzjdxzDm: sxData.scjydzjdxzDm || '',
        pzsljglxdm: sxData.pzsljglxdm || '',
        kjzdzzDm: sxData.kjzdzzDm || ''
    };

    isblxx && !isDw && delete nsrdjxx.dwlsgxdm;

    if (xbtcsq.viewDataObj.hasOwnProperty('700006') && !$.isEmptyObject(xbtcsq.viewDataObj['700006'])) {
        subViewData = $.extend(true, [], xbtcsq.viewDataObj['700006']);
        // 调用大脑初核信息接口
        var pzhdxxs = [];
        for (var i = 0; i < subViewData.pzhdsqMxList.length; i++) {
            var tempArr = subViewData.pzhdsqMxList[i];
            var pzhdxxsCla = {};
            pzhdxxsCla = {
                fpzlDm: tempArr.fpzlDm,
                dffpzgkpxe: tempArr.fpme,
                myzggpsl: tempArr.myzggpsl,
                cpzgsl: tempArr.cpzgsl,
                mczggpsl: tempArr.mczggpsl,
            }
            tempArr.defpbz === "N" && pzhdxxs.push(pzhdxxsCla);
        }

        $.ajax({
            url: '/sxsq-wsys/api/wtgl/zhdn/ccpzhdxx/recommend/get',
            type: 'post',
            data: {
                djxh: djxh,
                pzhdxxs: mini.encode(pzhdxxs),
                nsrdjxx: mini.encode(nsrdjxx),
                swjgCode: swjgCode || data110101.zgswjDm,
                sqxh: sqxh
            },
            success: function (res) {
                res = mini.decode(res);
                if (res.success) {

                    actionMethods.ztbz=res.value.ztbz||false;
                    // 高风险纳税人
                    if(actionMethods.ztbz){
                        $("#kpxe-tip").show();
                        var pzhdxxmx = res.value.pzhdxxmx;
                        // for (var i = 0; i < subViewData.pzhdsqMxList.length; i++) {
                        //     var tempArr = subViewData.pzhdsqMxList[i];
                        //     for (var j = 0; j < pzhdxxmx.length; j++) {
                        //         if(tempArr.fpzlDm === pzhdxxmx[j].fpzlDm){
                        //             tempArr.myzggpsl = pzhdxxmx[j].myzggpsl;
                        //             tempArr.mczggpsl = pzhdxxmx[j].mczggpsl;
                        //             tempArr.cpzgsl = pzhdxxmx[j].cpzgsl;
                        //             break;
                        //         }
                        //     }
                        // }
                        if(parseInt(subViewData.defpljgpje, 10) >= 500000){
                            subViewData.defpljgpje = 500000;
                        }
                        mini.get('gzpz_grid_yl')&&mini.get('gzpz_grid_yl').setData(subViewData.pzhdsqMxList);
                        actionMethods.oldGzpzData=mini.get('gzpz_grid_yl')&&mini.get('gzpz_grid_yl').getData();
                        if($('#tishi').text().indexOf("该纳税人属于高风险纳税人")===-1){
                            $('#tishi').append('<p>该纳税人属于高风险纳税人，专用发票和普通发票核定不超过5份发票，最高开票限额不超过10万元</p>');
                        }
                    }
                } else {
                    if(res.message.indexOf("无法从数据库找到可用的模型")===-1&&res.message.indexOf("非试点税务机关")===-1){
                        mini.alert(res.message, '提示信息');
                    }
                }
                mini.unmask()
            }
        });
    }


    $.ajax({
        url: "/dzgzpt-wsys/api/wtgl/dbsx/subTasks/get",
        data: {
            parentSqxh: sxsl_store.sqxh
        },
        success: function (res) {
            res = mini.decode(res);
            $.each(res.value||[],function(i,v){
                if(v.swsxDm==='700006'&&v.blztDm !== '00'){
                    mini.get("gzpz_grid_yl").setAllowCellEdit(false);
                    // var data=mini.decode(mini.decode(sxsl_store.sqsxData.viewData)['700006'])
                    mini.get("gzpz_grid_yl").setData(mini.decode(v.data).pzhdsqMxList);
                    var xgly=mini.decode(mini.decode(v.data).blxx).xgly;
                    if(xgly){
                        $(".xgly").show();
                        $("#xgly").val(xgly).blur().attr("disabled","disabled");
                    }
                }
            })
        }
    })
}
actionMethods.fpslBeforeChanged=function(e){
    if(e.row.defpbz==='Y'){
        e.cancel=true;
    }
}
actionMethods.fpslChanged=function name(e) {

    var fpModified=false;
    var data=mini.get('gzpz_grid_yl').getData();
    var xgly=$("#xgly").val();
    $.each(actionMethods.oldGzpzData||[],function (i,v) {
        if(data[i].myzggpsl!=v.myzggpsl||data[i].mczggpsl!=v.mczggpsl||data[i].cpzgsl!=v.cpzgsl){
            fpModified=true;
            return false;
        }
    });

    // if(fpModified){
    //     $(".xgly").show();
    // }else{
    //     $(".xgly").hide();
    // }
}