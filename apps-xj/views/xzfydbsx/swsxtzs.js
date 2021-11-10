function querySwsxtzsxx(lcslId, rwbh,blztDm,swsxDm,blxxData,otherData,rwztDm,djxh,sxslStoreObj) {
	var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
    SWSX_STORE.blxxData = blxxData;
    if(swsxDm == '110809'){
        SWSX_STORE.blxxData = JSON.stringify(sxslStoreObj.kqqyBlxxData)
    }
	SWSX_STORE.rwbh = rwbh;
	SWSX_STORE.swsxdm = swsxDm;
	SWSX_STORE.rwztdm = rwztDm;
	SWSX_STORE.djxh=djxh;
    SWSX_STORE.sxslStoreObj=sxslStoreObj;
	//受理通过企业优惠的留存备查清单
	var lcbczlqd="";
	if(WSYS_BLZT_DM.BLZT_SLTG == blztDm && SWSX_STORE.swsxdm=='110409'){
			var sqxxData=mini.decode(sxslStoreObj.sqsxData.data);
			var ssyhsxDm=sqxxData.qysdsjmbaVO.YHJmsspjgGrid.YHJmsspjgGridlb[0].jmsspsxDm;
			$.ajax({
				url : "../../../../api/xj/yh/qysdsyhsx/getQyLcbzZl/"+ssyhsxDm,
				async:false,
				success:function(data){
				   var json = mini.decode(data);
				   if(!json.success){
					   mini.alert(json.message,"提示",function(){
						   onCancel('ok');
					   });
				   }else{
					   if(!!json.value && json.value.length>0){
						   lcbczlqd="根据《企业所得税优惠政策事项办理办法》（国家税务总局公告2015年第76号），下列资料为主要留存备查资料，请妥善保存：\r\n";
					   }
					   for(var i=0;i<json.value.length;i++){
						   lcbczlqd +=json.value[i].lcbczlmc+"\r\n";
					   }
				   }
				}
			});
	}
	$.ajax({
		url : "../../../../api/wtgl/dbsx/querySwsxtzsxx.do",
		data : {
			lcslId : lcslId,
			blztDm : blztDm
		},
		success : function(data) {
			var resultData = mini.decode(data);
			var result = mini.decode(resultData);
			if (!result.success) {
				mini.alert(result.message, '提示信息');
				return;
			}
            SWSX_STORE.swsxtzsData = result.value;
			$("#title_swjgMc").text(result.value.swjgmc);
			$("#foot_swjgMc").text(result.value.swjgmc);
			$("#content_jg").text(result.value.jg);
			$("#content_zg").text(result.value.zg);
			$("#content_nsrmc").text(result.value.nsrmc);
			$("#content_nsrsbh").text(result.value.nsrsbh);
			$("#content_swsxMc").text(result.value.swsxmc);
			$("#content_swsxMc2").text(result.value.swsxmc);
			$("#content_sqrq").text(mini.formatDate(mini.parseDate(result.value.sqrq),"yyyy年MM月dd日"));
			$("#content_bjrq").text(mini.formatDate(mini.parseDate(result.value.bjrq),"yyyy年MM月dd日"));
			$("#content_flyj").html(result.value.flyj);

			mini.get("flyj").setValue(result.value.flyj);
			mini.get("sqxh").setValue(result.value.sqxh);
			mini.get("swjgDm").setValue(result.value.swjgdm);
			mini.get("jg").setValue(result.value.jg);
			mini.get("zg").setValue(result.value.zg);
			mini.get("lcslId").setValue(lcslId);
			//通用需求展示文书号，不再展示字轨局轨
            $('#swsxTzsDiv').show();
            $('#oldWsh').hide();
            $('#kqqyWsh').show();
            $('#kqqyWsh').html("文书号：" + sxslStoreObj.sqsxData.wsh);
            if("110809" == swsxDm){
                //上海跨区迁移业务税务事项报告 税务事项通知书差异化
                //$('#oldWsh').remove();
                $('#title_swjgMc').remove();
                $('#swsxTzsDiv').show();
                //$('#kqqyWsh').show();
                //$('#kqqyWsh').html("文书号：" + sxslStoreObj.sqsxData.wsh);
                $('#content_swsxMc2').text('跨区迁移企业税务事项报告事项');
                $.ajax({
                    url: "/dzgzpt-wsys/api/sh/wtgl/dbsx/workflow/step?rwbh="+SWSX_STORE.rwbh,
                    type: 'GET',
                    success: function (data, textStatus, request) {
                        if (!!data.success && data.value) {
                            var getSession = data.value;
                            if(getSession != 3){
                                $('#swsxtzsTy').remove();
                                $('#kqqyTznr').show();
                            }
                            if(getSession == 1){
                                $('#content_swsxMc').html('跨区迁移企业税务事项报告受理通知书');
                                $('#kqqySljg').html(WSYS_BLZT_DM.BLZT_SLTG==blztDm?'，符合受理条件，予以受理，特此通知。':(WSYS_BLZT_DM.BLZT_SLBTG == blztDm?'，不符合受理条件，不予受理，特此通知。':''));
                                $('#shKqqyts').show();
                                $('#shKqqyts').html('请于1个工作日后，根据手机短信获取办理结果');
                            } else if(getSession == 2){
                                $('#content_swsxMc').html('跨区迁移企业税务事项报告审核结果通知书');
                                $('#kqqySljg').html(WSYS_BLZT_DM.BLZT_SLTG==blztDm?'，经审核，符合迁移条件。':(WSYS_BLZT_DM.BLZT_SLBTG == blztDm?'，经审核，不符合迁移条件。':''));
                                $('#shKqqyts').show();
                                $('#shKqqyts').text('请于5个工作日后，登录网站查询《税务事项通知书》(户管注册通知)，从即日起至迁移手续办结前，请勿发起依申请涉税事项办理');
                            } else{
                                $('#content_swsxMc').html('跨区迁移企业税务事项报告通知书');
                                $('#shKqqyts').remove();
                            }
                            mini.hideMessageBox(messageid);
                        } else{
                            mini.alert('接口异常，请稍后重试');
                            mini.hideMessageBox(messageid);
                        }
                    },
                    error:function(error){
                        mini.alert(error.message || '接口异常，请稍后重试');
                    }
                });
            }



			//备注栏预先填写
			var tzsnr = "";
			//外出经营证明开具
			if("110801" == swsxDm && WSYS_BLZT_DM.BLZT_SLTG == blztDm){
                if (!!mini.decode(blxxData).zgswjDm){
					tzsnr = "您的外出经营证明开具事项已审核办结，请查看已办事项，若未生成报验登记已办事项，请前往外出地大厅继续办理报验登记。";
                }else{
					tzsnr = "您的外出经营证明开具事项已审核办结！";
                }
			}
			//票种核定
			if(("110207" === swsxDm || "110208" === swsxDm) && WSYS_BLZT_DM.BLZT_DSP == blztDm){
                    //校验票面金额是否超过十万
                    $.ajax({
                        url: "../../../../api/xj/pzhd/checkZpSfts/" + mini.get("sqxh").getValue(),
                        async: false,
                        contentType:"application/json",
                        type:"POST",
                        success: function (data) {
                            if(data.success ){
                                if(data.value=='Y'){//超过十万
                                    tzsnr="您的票种核定申请已受理，请保持手机通畅，主管税务机关将会联系您进行情况核查，请耐心等待。";
                                }else{
                                    tzsnr="您的票种核定申请已受理，请携带税控设备前往主管税务机关办理发行业务。";
                                }

                            }
                        },
                        error: function (e) {
                        }
                    });

			}
            //==========新票种核定新接口======
            if(("200006" === swsxDm || "200007" === swsxDm) && WSYS_BLZT_DM.BLZT_DSP == blztDm){
                //校验票面金额是否超过十万
                $.ajax({
                    url: "../../../../api/pzhd/checkZpSftsJy/" + mini.get("sqxh").getValue(),
                    async: false,
                    contentType:"application/json",
                    type:"POST",
                    success: function (data) {
                        if(data.success ){
                            if(data.value=='Y'){//超过十万
                                tzsnr="您的票种核定申请已受理，请保持手机通畅，主管税务机关将会联系您进行情况核查，请耐心等待。";
                            }else{
                                tzsnr="您的票种核定申请已受理，请携带税控设备前往主管税务机关办理发行业务。";
                            }

                        }
                    },
                    error: function (e) {
                    }
                });

            }


            //======================================
			var form = new mini.Form("#swsxtzsForm");
			form.setData(mini.decode(result.value));
			mini.get("swsxtzsNr").setValue(tzsnr);
			mini.get("blztDm").setValue(blztDm);

			// 不予受理
			if (WSYS_BLZT_DM.BLZT_SLBTG == blztDm) {
				mini.get("swsxtzsNr").setRequired(true) ;
				$("#content_blzt").text("不予受理");
				$("#content_blzt_sm").text("不予受理原因：");
			}

			//补正资料
			if(WSYS_BLZT_DM.BLZT_BZZL==blztDm){
				mini.get("swsxtzsNr").setRequired(true) ;
				$("#content_blzt").text("补正资料");
				$("#content_blzt_sm").text("需要重新上传的资料列表如下：");
			}

			//受理审核办结
			if(WSYS_BLZT_DM.BLZT_SLTG==blztDm){
                mini.get("swsxtzsNr").setRequired(false);
				$("#content_blzt").text("审核通过");
				$("#content_blzt_sm").text("相关说明如下：");
				if(SWSX_STORE.swsxdm=='110409'){
					mini.get("swsxtzsNr").setValue(lcbczlqd);
				}
			}

			// 待审批
			if (WSYS_BLZT_DM.BLZT_DSP == blztDm) {
				$("#content_blzt").text("受理通过，待审批");
				$("#content_blzt_sm").text("相关说明如下：");
			}
			mini.hideMessageBox(messageid);
		},
		error : function() {
			mini.hideMessageBox(messageid);
			mini.alert("查询税务事项通知书信息失败。", '提示信息');
		}
	});
}

function dealTsgwAfter(tsjgblxx,messageid) {
    // var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
    var submitData=new mini.Form("#swsxtzsForm").getData(true);
    var form = new mini.Form('#swsxtzsForm');
    var formDate = form.getDataAndText(true);
    if(SWSX_STORE.swsxdm=='110409' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
        submitData.swsxtzsNr=submitData.swsxtzsNr.replace(/\r\n/g,"</br>");
    }
    var url;
    if(SWSX_STORE.swsxdm === '200005' || SWSX_STORE.swsxdm === '200006' || SWSX_STORE.swsxdm === '200007' || SWSX_STORE.swsxdm === '200001'){
        url = '../../../../api/wtgl/sssq/sxbl/submit';
    } else if(SWSX_STORE.swsxdm === '110809'){
        url = "../../../../api/sh/wtgl/dbsx/workflow";
    } else if(SWSX_STORE.swsxdm === '30010415') {
        /**
         * 反馈的提交到户管接口
         */
        url = '/hgzx-gld/api/hgzx/dbsx/saveSwsxBl'
    } else{
        url = "../../../../api/wtgl/dbsx/saveSwsxBl";
    }
    submitData = mini.encode(submitData);
    var xzspSwsxdm = ['60090102','30090101','30090102','30090103','30090104','30090105','30090106','30090107','30010415','60090105'];
    var contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
    var saveSwsxBlPatam = {
        data : submitData,
        lcslId : mini.get("lcslId").getValue(),
        blztDm : mini.get("blztDm").getValue(),
        rwztDm : "01",
        sqxh : mini.get("sqxh").getValue(),
        blxxData:!!SWSX_STORE.blxxData?SWSX_STORE.blxxData:tsjgblxx,
        rwbh:SWSX_STORE.rwbh
    };
    if(xzspSwsxdm.indexOf(SWSX_STORE.swsxdm)>=0){
        url = '/hgzx-gld/api/hgzx/dbsx/saveSwsxBl';
        contentType = 'application/json;charset=UTF-8';
        saveSwsxBlPatam.swsxtzsDto = {
            sqsxData:SWSX_STORE.sxslStoreObj.sqsxData,
            swsxtzsData:SWSX_STORE.swsxtzsData,
            swsxtzsnr: formDate.swsxtzsNr
        };
        saveSwsxBlPatam = JSON.stringify(saveSwsxBlPatam);
    }

    setTimeout(function () {
        $.ajax({
            url : url,
            type : "post",
            data :saveSwsxBlPatam,
            contentType:contentType,
            async:false,
            success : function(data) {
                mini.hideMessageBox(messageid);
                var resultData = mini.decode(data);
                if(resultData.success){
                    if(WSYS_BLZT_DM.BLZT_DSP==mini.get("blztDm").getValue()){
                        var gwMc = resultData.resultMap.gwMc;
                        var jgMc = resultData.resultMap.jgMc;
                        mini.alert("受理成功！<br>下一环节的办理信息：<br>办理机关：【"+jgMc+"】<br>办理岗位：【"+gwMc+"】", '提示信息', function() {
                            onCancel('ok');
                        });
                    }else{
                        if(SWSX_STORE.swsxdm=='110212' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
                            var sjhm="";
                            var dxmb="";
                            var params="";
                            var dxcs="";
                            var resultValue=resultData.value;
                            if(!!resultValue){
                                dxmb=resultValue.tempalteContent;
                                sjhm=resultValue.phoneNumber;
                                params=resultValue.contentParams;
                            }
                            var htmlContent = document.getElementById("htmlContent");
                            $("#htmlContent").show();
                            dealDxmb(dxmb,htmlContent,params);
                            mini.showMessageBox({
                                width: 350,
                                height:300,
                                title: '<span style="font-size: 16px;font-weight: bold;">短信内容</span>',
                                buttons: ["发送", "不发送"],
                                html: htmlContent,
                                showModal: false,
                                callback: function (action) {
                                    if(action == "发送"){
                                        dxcs=getAllDxcs();
                                        $.ajax({
                                            url : "../../../../api/xj/wtgl/fsdx/sendSjdx",
                                            type : "post",
                                            contentType: 'application/json;charset=utf-8',
                                            data : mini.encode({
                                                dxcs : mini.encode(dxcs),
                                                sjhm : sjhm,
                                                swsxdm : SWSX_STORE.swsxdm,
                                                dxmbId : "ZZSZYFPDK_SLTG_SWJG"
                                            }),
                                            success : function(json) {
                                                var data = mini.decode(json);
                                                $('#sxBjBtn').attr("disabled",false);
                                                if(data.success){
                                                    mini.alert("受理成功！短信发送成功", '提示信息', function(){
                                                        onCancel('ok');
                                                    });
                                                }else{
                                                    mini.alert("受理成功！短信发送失败!失败原因:"+data.message, '提示信息', function(){
                                                        onCancel('ok');
                                                    });
                                                }
                                            }
                                        });
                                    }else{
                                        mini.alert("受理成功！未发送短信!", '提示信息', function() {
                                            onCancel('ok');
                                        });
                                    }
                                }
                            });
                        }else if(SWSX_STORE.swsxdm=='110113' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
                            $.ajax({
                                url : "../../../../api/wtgl/xj/zzsybnsrdj/checkNsdexxByDjxh?djxh="+SWSX_STORE.djxh,
                                type : "post",
                                success : function(data) {
                                    var result = mini.decode(data);
                                    if(!result.success){
                                        mini.alert(result.message+" 不影响受理结果!", '提示信息', function() {
                                            onCancel('ok');
                                        });
                                    }else{
                                        var alertMessge="";
                                        if(result.value){
                                            alertMessage = "增值税一般纳税人登记审核通过。该纳税人为定期定额户，应进行定期定额分月汇总申报，依职权终止其定期定额核定以及变更纳税人的税费（种）认定信息。";
                                        }else{
                                            alertMessage = "增值税一般纳税人登记审核通过，请变更纳税人税费（种）认定。"
                                        }
                                        $('#sxBjBtn').attr("disabled",false);
                                        mini.alert(alertMessage, '提示信息', function() {
                                            onCancel('ok');
                                        });
                                    }
                                }
                            });
                        }else{
                            mini.alert("受理成功！", '提示信息', function() {
                                onCancel('ok');
                            });
                        }
                    }
                }else{
                    mini.hideMessageBox(messageid);
                    var mes = resultData.message || "系统处理异常";
                    parent.mini.alert(mes, '提示信息', function() {});
                }
            }
        });
    },500);
}
function saveSwsxBj() {
    // mini.get("swsxtzsNr").setRequired(true);
    var form = new mini.Form("#swsxtzsForm");
    form.validate();
    var isValid = form.isValid();
    if(!isValid){
        return;
    }
    var messageid = mini.loading("提交中, 请稍等 ...", "提交中");

    if(SWSX_STORE.swsxdm == '110207' || SWSX_STORE.swsxdm == '110208' || SWSX_STORE.swsxdm == '200006'){
        SWSX_STORE.blxxData = mini.encode(store.getSession('pzhdBlxxData'));
    }
    var smrzflag= true;//票种核定首次校验实名认证信息
    if(SWSX_STORE.swsxdm == '110207' && (mini.get("blztDm").getValue()=="03")){
        //校验实名认证信息认证不通过的不让事项办结
        $.ajax({
            url: "../../../../api/xj/pzhd/checkGprSmxx/" + mini.get("sqxh").getValue(),
            async: false,
            contentType:"application/json",
            type:"POST",
            success: function (data) {
                if(data.success ){
                    if(data.value=="N"){
                        mini.alert(data.message);
                        smrzflag=false;
                    }else{
                        smrzflag=true;
                    }
                }else{
                    mini.alert(data.message);
                    smrzflag=false;
                }
            },
            error: function (e) {
            }
        });
	}
    //=========新票种核定接口====================
    var viewData=mini.decode(SWSX_STORE.sxslStoreObj.sqsxData.viewData);
    if(SWSX_STORE.swsxdm === '200006' && !viewData["smrzxx-form"].smrzflag && (mini.get("blztDm").getValue()==="03")){
        //校验实名认证信息认证不通过的不让事项办结
        $.ajax({
            url: "../../../../api/pzhd/checkGprSmxxJy/" + mini.get("sqxh").getValue(),
            async: false,
            contentType:"application/json",
            type:"POST",
            success: function (data) {
                if(data.success ){
                    if(data.value=="N"){
                        mini.alert(data.message);
                        smrzflag=false;
                    }else{
                        smrzflag=true;
                    }
                }else{
                    mini.alert(data.message);
                    smrzflag=false;
                }
            },
            error: function (e) {
            }
        });
    }

    var tsjgblxx = "";
    if(('30090105'== SWSX_STORE.swsxdm ||'60090105'== SWSX_STORE.swsxdm || '60090102' == SWSX_STORE.swsxdm||SWSX_STORE.swsxdm=='30090106')&&WSYS_BLZT_DM.BLZT_DSP == mini.get("blztDm").getValue()){
        mini.hideMessageBox(messageid);
        tsjgblxx = selectTsSwjg(mini.get("sqxh").getValue(), SWSX_STORE.swsxdm,smrzflag,messageid);
    }else {
        //=========================================
        if(smrzflag){
            // var messageid = mini.loading("提交中, 请稍等 ...", "提交中");
            var submitData=form.getData(true);
            var form = new mini.Form('#swsxtzsForm');
            var formDate = form.getDataAndText(true);
            if(SWSX_STORE.swsxdm=='110409' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
                submitData.swsxtzsNr=submitData.swsxtzsNr.replace(/\r\n/g,"</br>");
            }
            var url;
            if(SWSX_STORE.swsxdm === '200005' || SWSX_STORE.swsxdm === '200006' || SWSX_STORE.swsxdm === '200007' || SWSX_STORE.swsxdm === '200001'){
                url = '../../../../api/wtgl/sssq/sxbl/submit';
            } else if(SWSX_STORE.swsxdm === '110809'){
                url = "../../../../api/sh/wtgl/dbsx/workflow";
            } else if(SWSX_STORE.swsxdm === '30010415') {
                /**
                 * 反馈的提交到户管接口
                 */
                url = '/hgzx-gld/api/hgzx/dbsx/saveSwsxBl'
            } else{
                url = "../../../../api/wtgl/dbsx/saveSwsxBl";
            }
            submitData = mini.encode(submitData);
            var xzspSwsxdm = ['60090102','30090101','30090102','30090103','30090104','30090105','30090106','30090107','30010415','60090105'];
            var contentType = 'application/x-www-form-urlencoded;charset=UTF-8';
            var saveSwsxBlPatam = {
                data : submitData,
                lcslId : mini.get("lcslId").getValue(),
                blztDm : mini.get("blztDm").getValue(),
                rwztDm : "01",
                sqxh : mini.get("sqxh").getValue(),
                blxxData:!!SWSX_STORE.blxxData?SWSX_STORE.blxxData:tsjgblxx,
                rwbh:SWSX_STORE.rwbh
            };
            if(xzspSwsxdm.indexOf(SWSX_STORE.swsxdm)>=0){
                url = '/hgzx-gld/api/hgzx/dbsx/saveSwsxBl';
                contentType = 'application/json;charset=UTF-8';
                saveSwsxBlPatam.swsxtzsDto = {
                    sqsxData:SWSX_STORE.sxslStoreObj.sqsxData,
                    swsxtzsData:SWSX_STORE.swsxtzsData,
                    swsxtzsnr: formDate.swsxtzsNr
                };
                saveSwsxBlPatam = JSON.stringify(saveSwsxBlPatam);
            }

            setTimeout(function () {
                $.ajax({
                    url : url,
                    type : "post",
                    data :saveSwsxBlPatam,
                    contentType:contentType,
                    async:false,
                    success : function(data) {
                        mini.hideMessageBox(messageid);
                        var resultData = mini.decode(data);
                        if(resultData.success){
                            if(WSYS_BLZT_DM.BLZT_DSP==mini.get("blztDm").getValue()){
                                var gwMc = resultData.resultMap.gwMc;
                                var jgMc = resultData.resultMap.jgMc;
                                mini.alert("受理成功！<br>下一环节的办理信息：<br>办理机关：【"+jgMc+"】<br>办理岗位：【"+gwMc+"】", '提示信息', function() {
                                    onCancel('ok');
                                });
                            }else{
                                if(SWSX_STORE.swsxdm=='110212' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
                                    var sjhm="";
                                    var dxmb="";
                                    var params="";
                                    var dxcs="";
                                    var resultValue=resultData.value;
                                    if(!!resultValue){
                                        dxmb=resultValue.tempalteContent;
                                        sjhm=resultValue.phoneNumber;
                                        params=resultValue.contentParams;
                                    }
                                    var htmlContent = document.getElementById("htmlContent");
                                    $("#htmlContent").show();
                                    dealDxmb(dxmb,htmlContent,params);
                                    mini.showMessageBox({
                                        width: 350,
                                        height:300,
                                        title: '<span style="font-size: 16px;font-weight: bold;">短信内容</span>',
                                        buttons: ["发送", "不发送"],
                                        html: htmlContent,
                                        showModal: false,
                                        callback: function (action) {
                                            if(action == "发送"){
                                                dxcs=getAllDxcs();
                                                $.ajax({
                                                    url : "../../../../api/xj/wtgl/fsdx/sendSjdx",
                                                    type : "post",
                                                    contentType: 'application/json;charset=utf-8',
                                                    data : mini.encode({
                                                        dxcs : mini.encode(dxcs),
                                                        sjhm : sjhm,
                                                        swsxdm : SWSX_STORE.swsxdm,
                                                        dxmbId : "ZZSZYFPDK_SLTG_SWJG"
                                                    }),
                                                    success : function(json) {
                                                        var data = mini.decode(json);
                                                        $('#sxBjBtn').attr("disabled",false);
                                                        if(data.success){
                                                            mini.alert("受理成功！短信发送成功", '提示信息', function(){
                                                                onCancel('ok');
                                                            });
                                                        }else{
                                                            mini.alert("受理成功！短信发送失败!失败原因:"+data.message, '提示信息', function(){
                                                                onCancel('ok');
                                                            });
                                                        }
                                                    }
                                                });
                                            }else{
                                                mini.alert("受理成功！未发送短信!", '提示信息', function() {
                                                    onCancel('ok');
                                                });
                                            }
                                        }
                                    });
                                }else if(SWSX_STORE.swsxdm=='110113' && WSYS_BLZT_DM.BLZT_SLTG==mini.get("blztDm").getValue()){
                                    $.ajax({
                                        url : "../../../../api/wtgl/xj/zzsybnsrdj/checkNsdexxByDjxh?djxh="+SWSX_STORE.djxh,
                                        type : "post",
                                        success : function(data) {
                                            var result = mini.decode(data);
                                            if(!result.success){
                                                mini.alert(result.message+" 不影响受理结果!", '提示信息', function() {
                                                    onCancel('ok');
                                                });
                                            }else{
                                                var alertMessge="";
                                                if(result.value){
                                                    alertMessage = "增值税一般纳税人登记审核通过。该纳税人为定期定额户，应进行定期定额分月汇总申报，依职权终止其定期定额核定以及变更纳税人的税费（种）认定信息。";
                                                }else{
                                                    alertMessage = "增值税一般纳税人登记审核通过，请变更纳税人税费（种）认定。"
                                                }
                                                $('#sxBjBtn').attr("disabled",false);
                                                mini.alert(alertMessage, '提示信息', function() {
                                                    onCancel('ok');
                                                });
                                            }
                                        }
                                    });
                                }else{
                                    mini.alert("受理成功！", '提示信息', function() {
                                        onCancel('ok');
                                    });
                                }
                            }
                        }else{
                            mini.hideMessageBox(messageid);
                            var mes = resultData.message || "系统处理异常";
                            parent.mini.alert(mes, '提示信息', function() {});
                        }
                    }
                });
            },500);
        } else{
            mini.hideMessageBox(messageid);
        }
    }

}
function onCancel(action) {
	if (window.CloseOwnerWindow)
		return window.CloseOwnerWindow(action);
	else
		window.close();
}
//处理短信模板
function dealDxmb(tempDxmb,tempHtmlContent,params){
	var tempDxmb= tempDxmb.replace(/%s/g,'<input type="text" class="dxcs" style="width: 205px;"/></input>');
	tempHtmlContent.innerHTML=tempDxmb;
	$(".dxcs").each(function(index,item){
		if(params[index].length > 15){
			mini.alert("输入框长度不能超过15个汉字！");
			return;
		}
		item.value=params[index];
	});
	$(document).on('change','.dxcs',function(e){
		if(e.currentTarget.value.length > 15){
			mini.alert("输入框长度不能超过15个汉字！");
			$(this).val("").attr("value","");
		}
	})
}
//获取用户输入的参数
function getAllDxcs(){
	var dxcs=new Array();
	$(".dxcs").each(function(index,item){
		dxcs.push(item.value);
	});
	return dxcs;
}

function selectTsSwjg(sqxh,swsxDm,flag,messageid){
    var messageid = mini.loading("查询中, 请稍等 ...", "查询中");
    $.ajax({
        url : '/hgzx-gld/api/hgzx/dbsx/queryReceiveJgDmAndGwXhList/'+sqxh+'/'+swsxDm,
        type : "post",
        data :"",
        contentType:'application/json;charset=UTF-8',
        async:false,
        success : function(data) {
            mini.hideMessageBox(messageid);
            var res = mini.decode(data);
            if (res.success && res.value) {
                var data = typeof res.value === 'string' ? mini.decode(res.value) : res.value;
                if (data.length > 1) {
                    mini.open({
                        showCloseButton: false,   //显示关闭按钮
                        showMaxButton: false,     //显示最大化按钮
                        title: "推送岗位列表",
                        url: './selectTsjggw.html',
                        showModal: true,
                        width: 900,
                        height: 600,
                        onload: function () {
                            var iframe = this.getIFrameEl()
                            iframe.contentWindow.selectTsgw.setData(data)
                        },
                        ondestroy: function (action) {
                            if (action == "ok") {
                                var iframe = this.getIFrameEl();
                                var selectData = iframe.contentWindow.selectTsgw.getData();
                                //=========================================
                                if(flag){
                                    mini.hideMessageBox(messageid);
                                    dealTsgwAfter(selectData,messageid);
                                } else{
                                    mini.hideMessageBox(messageid);
                                }
                            }else{
                                mini.hideMessageBox(messageid);
                            }
                        }
                    })
                } else if (data.length === 1) {
                    if(flag){
                        dealTsgwAfter(mini.encode(data[0]),messageid);
                    } else{
                        mini.hideMessageBox(messageid);
                    }
                }
            } else {
                mini.alert(res.message || '查询推送岗位列表失败');
            }
        }
    })
}
