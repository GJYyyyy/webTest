// isYct（1:电子税务局 2: 一窗通）
var actionMethods = {
    sxList: [],
    isBysl: false,
    isGt: false,
    isHasPzhd: false,
    currentNsrIsInJs: false,
    currentNsrIsInFzch: false,
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
        mini.mask('加载中...')
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
                        var isCurrentCity= isDw && (zfjglxDm === '3' || zfjglxDm === '2' || zfjglxDm === '1') ? actionMethods.isCurrentCity() : false;
                        for (var index = 0; index < arr.length; index++) {
                            // 单位 分机构/总分机构/总机构是当前城市,只受理纳税人资格认定选定为一般纳税人
                            /**
                             * [{"id":"1","text":"总机构"},
                             * {"id":"2","text":"分支机构"},
                             * {"id":"3","text":"分总机构"},
                             * {"id":"0","text":"非总分机构"}]
                             */
                            if(isCurrentCity) {
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
                                if(element.swsxDm === '200006'){
                                    qs += '<td>已提交</td></tr>';
                                        // '<a class="mini-button" style="background: #0994dc;line-height: 32px;float:right;margin-right: 5px" onclick="actionMethods.refrePzhdZt()">刷新</a></td></tr>';
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
                                if (isDw && (zfjglxDm === '3' || zfjglxDm === '2' || zfjglxDm === '3') && actionMethods.isCurrentCity()) {
                                    // 单位才会有此提示
                                    // 税务人端，个体工商户管理端一键保存中不出现税费种认定事项。
                                    qs += '<td width="50%">当前纳税人为分支机构/分总机构且总机构为本市的纳税人，无需进行税费种认定。</td></tr>'
                                } else if (isDw) {
                                    // 请在核心征管系统中进行税（费）种认定操作。
                                    // qs += '<td width="50%">请在核心征管系统中进行税（费）种认定操作。</td></tr>'
                                    qs += '<td><a id="sureBtn" class="mini-button" style="background: #0994dc;line-height: 32px;" onclick="actionMethods.zslMethods(\'' + index + '\')">受理</a></td></tr>'
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
                ajax.get('/hgzx-gld/api/hgzx/baseCode/get/getBaseCodeObjStr/DM_GY_SWJG_GT3/' + swjgDm, {}, function (res) {
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
        /**
         * 当法人名下存在非正常户时，
         * 可操作按钮：调拨、不予受理、申请表打印
         * 不可操作：受理、一键保存、办结、实名认证、发放
         */
        if (actionMethods.currentNsrIsInFzch) {
            $('#dbBtn,#slBtnGray,#byslBtn,#yjbcBtnGray,#bjBtnGray,#smrzBtnGray,#ffBtnGray,#sqbdyBtn').css('display', 'inline-block');
            $('#dbBtnGray,#slBtn,#byslBtnGray,#yjbcBtn,#bjBtn,#smrzBtn,#ffBtn,#sqbdyBtnGray').css('display', 'none');
            return
        }
        if (actionMethods.currentNsrIsInJs  && (blztDm === '00' || blztDm == '60')) {
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
             * http://192.168.2.82:8080/redmine/issues/450783
             * 如果是电子税务局申请，单位，没有票种核定，置灰，根据原来的业务逻辑，
             * 如果是一窗通申请，单位，没有票种核定或者有票种核定，都亮着，税务人员可以进行操作
             *
             * 老一窗通申请和老电子税务局申请，只支持大厅发放，当状态为已办结时， 可进行实名认证、发放和申请表打印操作。
             */
            if ($('#rwly').text() === '电子税务局（老网厅）' || $('#rwly').text() === '一窗通（老网厅）') {
                $('#ffBtn,#smrzBtn').css('display', 'inline-block')
                $('#ffBtnGray,#smrzBtnGray').css('display', 'none')
            } else if (actionMethods.isDw && !actionMethods.isHasPzhd && urlParams.urlParams.isYct == '1') {
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
     * 点击受理按钮
     */
    slMethods: function () {
        var isYct = urlParams.urlParams.isYct
        /**
         * 新办纳税人套餐一窗通申请数据，投资方信息存在缺失（整条数据缺失）或者 字段缺失
         *（投资方名称、证件种类、证件号码、投资方经济性质、投资比例、国籍，其中当国籍为中华人民共和国的，地址也为必录项 ，不可为空）的，
         * 点击“受理”时需要给出提示：“该纳税人缺少投资方信息，请在金三核心征管-工商登记信息查询确认 模块中进行办理操作。”
         * 关闭提示信息后，不再进行申请数据的处理。
         */
        if (isYct === '2') {
            var tzfxxGrid = JSON.parse(JSON.parse(sxsl_store.sqsxData.data)[0].data).tzfxxGrid
            var isPass = true
            if (!tzfxxGrid || tzfxxGrid.length === 0) {
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
                        if(data.ID==='13100000000'){
                            mini.alert('当前纳税人的主管税务机关在市局，请调拨到对应分局，由分局人员受理','提示信息')
                            return
                        }
                        actionMethods.slxbtc(sxsl_store.lcslId, isYct === '2' ? true : false)
                    }
                }
            });

        // }
    },
    isHdZzssfz: function (djxh) {
        var isHdZzssfzFlag = false;
        mini.mask('加载中...')
        ajax.get('/dzgzpt-wsys/api/pzhd/checkzzsSfzxx/' + djxh, {}, function (res) {
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
        ajax.get('/hgzx-gld/api/hgzx/dbsx/queryReceiveJgDmAndGwXhList/' + sxsl_store.sqxh + '/200006', {}, function (res) {
            if (res.success && res.value) {
                var data = typeof res.value === 'string' ? mini.decode(res.value) : res.value;
                if (data.length > 1) {
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
                            var lcslId = actionMethods.sxList[index].lcslId || actionMethods.sxList[index].sqxh
                            iframe.contentWindow.selectTsgw.setData(lcslId, sxsl_store.rwztDm, actionMethods.sxList[index].data, data)
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
                    actionMethods.sxslSubmit(index, obj, '200006')
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
    sfxyYzMethods:function(index){
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
    zslMethods: function (index) {
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
        if (actionMethods.sxList[index].swsxDm === '200006') {
            /**
             * 票种核定
             */
            /* 票种核定前 如果有登记一般纳税人 一般纳税人需要先受理完成 */
            if (actionMethods.beforeZpPzhd(index)) return;
            if (actionMethods.isHdZzssfz(actionMethods.sxList[index].djxh)) {
                actionMethods.queryShSpgw(index)
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
        mini.mask('加载中...');
        var submitUrl = '/dzgzpt-wsys/api/wtgl/dbsx/subTask/sxsl';
        var submitData = actionMethods.sxList[index].data;
        // 扣缴税款
        if (swsxDm === '30010108') {
            submitUrl = '/hgzx-gld/api/hgzx/dbsx/subTask/sxsl';
            submitData = '';
        }else if(swsxDm === '200006'){
            submitUrl = '/dzgzpt-wsys/api/wtgl/subTask/sxsl';
        }
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
                    mini.alert(res.message, '提示信息');
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
    /**
     * 受理
     */
    slxbtc: function (lcslId, isYct) {
        var viewData = sxsl_store.sqsxData.viewData
        var sxList = actionMethods.sxList
        var newArr = []
        var xzqhDm = ''
        var isDw = false
        var childlcslId = ''

        var viewDataJson = typeof viewData === 'string' ? JSON.parse(viewData) : viewData;
        var swdjxxbl = viewDataJson['110121'] || viewDataJson['110101'];
        if (swdjxxbl) {
            viewDataJson = typeof swdjxxbl === 'string' ? JSON.parse(swdjxxbl) : swdjxxbl;
            if (viewDataJson['djxxbl-yl']) {
                xzqhDm = viewDataJson['djxxbl-yl']['scjydzxzqhszDm']
            }
        }

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
            url = '../sqgl/xbnsrzhtcsq_wrt/template/swdjxxblGr/dj_sldj_blxx.html'
        } else {
            url = '../sqgl/xbnsrzhtcsq_wrt/template/swdjxxblDw/dj_sldj_blxx.html'
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
                iframe.contentWindow.slbl.setData(lcslId, sxsl_store.sqsxData.blztDm, sxsl_store.rwztDm, isYct, viewData, childlcslId, xzqhDm)
            },
            ondestroy: function (action) {
                /**
                 * 关闭补录信息的弹框
                 */
                if (action == "ok") {
                    actionMethods.renderBtn('60') // 重新渲染按钮
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
     * 不予受理
     */
    byslClick: function () {
        mini.get('byslWin').show()
    },
    bjClick: function(){
        actionMethods.isBysl = false
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
                    else if(subSwsxDm === '200006'){
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
                                printTag.find('#zp_' + fp.fpme).attr('checked', true);
                            } else if (fp.zppzDm === '3') {
                                printTag.find('#pp_' + fp.fpme).attr('checked', true);
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
     * 发送短信
     */
    fsdxMethods: function (type) {
        var dxnr = mini.get('dxnr').getValue()
        // var jbr = mini.get('jbr').getValue()
        // var phone = mini.get('sjhm').getValue()
        if (!mini.get('dxnr').validate()) {
            mini.alert('短信内容最多支持150个中文字符')
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
        ajax.post('/dzgzpt-wsys/api/wtgl/nsrxx/query/zczt/' + sxsl_store.lcslId + '/' + sxsl_store.nsrsbh, {}, function (res) {
            if (res.success && res.value) {
                actionMethods.currentNsrIsInJs = true
                $('#tishi').append('<p>当前纳税人已在金三核心征管中存在。</p>')
            }
            mini.unmask()
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
                        mini.alert('新办企业的法人在异地存在非正常户，不能进行新办套餐的受理操作，只能做临时税务登记。')
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
                            $('#tishi').append('<p>核心征管系统中已存在组织机构代码【' + zzjgdm + '】相同的企业【' + nsrmc + '】</p>')
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
$(function () {
    var result = sxslcommon.initSxslPage(sxslcommon.swsxsqJbxx)
    var sqlymc = urlParams.urlParams.sqlymc
    // isYct：2 一窗通
    $('#rwly').text(decodeURIComponent(sqlymc))
    if (!result) {
        mini.alert("初始化页面失败，申请信息为空！")
        return
    }
    if (urlParams.urlParams.from === 'search') {
        $('#closeSearchWin').css('display', 'inline-block')
        $('#closeSearchWin').siblings('a').remove()
        return
    }
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
    if (viewData['200006']) {
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
    actionMethods.renderBtn(sxsl_store.sqsxData.blztDm)
})

/**
 * 短信内容校验
 */
mini.VTypes["chineseErrorText"] = "请输入最大150个中文字符";
mini.VTypes["chinese"] = function(v) {
    var length = v.toString().replace(/[^\x00-\xff]/g, 'xxx').length
    if (!v || v === "")
        return true;
    if (!v || (length < 450))
        return true;
    return false
}
