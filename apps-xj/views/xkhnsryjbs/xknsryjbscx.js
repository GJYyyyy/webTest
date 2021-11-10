/**
 * Created by yanghui on 2017/9/4.
 */
var sxgzMark = false;
var yzymSqxh = ""

function initYjbs(id) {
    if(arguments[1]) sxgzMark = true; //此时为事项跟踪

    if(sxgzMark){
        $(".dbsx-actions").hide(); //事项办结按钮去掉
    }

    xkhYjNs.init(id);
}
var sqxh="";
var bjsqxh = "";
var sxbjFlag= false;//能否办结业务
var xkhYjNs = {
    allSlData: null,
    _self: function () {
        return this;
    },
    init: function (id) {
        this.lcslid = id;
        this.bindSpace();
        this.getAllData(id);
        this.organizeData();
        this.hasPzhd();
        this.setAllData();
    },
    bindSpace: function () {
        this.sqqkGrid = mini.get("#xkq-sqqk-grid");
    },
    setAllData: function () {
        this.sqqkGrid.setData(this.allSlData);
        var viewData = this.allSlData[0].viewData;
        viewData = mini.decode(viewData);
        if (viewData['yl-fzrxxForm']) {
            var fddbrxm = viewData['yl-fzrxxForm'].fddbrxm;
            var fddbryddh = viewData['yl-fzrxxForm'].fddbryddh;
            $('#step_tx_form').before('<h4 style="padding-left:20px">此申请的提交人为本企业的法人【'+fddbrxm+'】，联系电话【'+fddbryddh+'】。您可以拨打此电话主动联系其来办理此项业务。</h4>');
        } else {
            var fddbrxm = viewData['djxxbl-yl'].fddbrxm;
            var fddbryddh = viewData['djxxbl-yl'].fddbryddh;
            $('#step_tx_form').before('<h4 style="padding-left:20px">此申请的提交人为本企业的法人【'+fddbrxm+'】，联系电话【'+fddbryddh+'】。您可以拨打此电话主动联系其来办理此项业务。</h4>');
        }        
    },
    getAllData: function (id) {
        var requestData = {
            lcslid: id
        };
        yjbsService.getAllSljd(mini.encode(requestData), function (res) {
            if (res.success) {
                xkhYjNs.allSlData = mini.decode(res.value) || [];
                if(xkhYjNs.allSlData){
             	   sqxh= xkhYjNs.allSlData[0].sqxh;
             	   $.each(xkhYjNs.allSlData,function (i,v) {
                       if(v.swsxDm == '110101' || v.swsxDm == '110121'){
                           bjsqxh = v.sqxh;
                       }
                   })

                }
            } else {
                xkhYjNs.allSlData = [];
            }
        })
    },
    organizeData: function(){
        xkhYjNs.smrzData = [];
        xkhYjNs.smrzMsg = '';
        xkhYjNs.smrzMatchMsg = '';
        xkhYjNs.smrzReturn = false;
        $.each(xkhYjNs.allSlData,function(i,value){
            if(value.swsxDm === '110101'){
                var nsrxx = mini.decode(value.data)['nsrxx'];
                var fddbr = {
                    sfzjlx : nsrxx.fddbrsfzjlxDm,
                    sfzjhm : nsrxx.fddbrsfzjhm,
                    xm     : nsrxx.fddbrxm,
                    sjhm   : nsrxx.fddbryddh,
                    sf     : '法定代表人'
                },
                    cwfzr = {
                    sfzjlx : nsrxx.cwfzrsfzjzlDm,
                    sfzjhm : nsrxx.cwfzrsfzjhm,
                    xm     : nsrxx.cwfzrxm,
                    sjhm   : nsrxx.cwfzryddh,
                    sf     : '财务负责人'
                },
                    bsr   = {
                    sfzjlx : nsrxx.bsrsfzjzlDm,
                    sfzjhm : nsrxx.bsrsfzjhm,
                    xm     : nsrxx.bsrxm,
                    sjhm   : nsrxx.bsryddh,
                    sf     : '办税员'
                };
                xkhYjNs.smrzData.push(fddbr,cwfzr,bsr);
            }
            if(value.swsxDm === '110121'){
                var yzxx = mini.decode(value.data)['nsrxx'];
                var yz = {
                    sfzjlx : yzxx.fddbrsfzjlxDm,
                    sfzjhm : yzxx.fddbrsfzjhm,
                    xm     : yzxx.fddbrxm,
                    sjhm   : yzxx.fddbryddh,
                    sf     : '业主'
                };
                xkhYjNs.smrzData.push(yz);
            }
            if(value.swsxDm === '110207'){
                var lprxx = mini.decode(value.data)['pzhdsqspGprGrid']['pzhdsqspGprGridlb'];
                $.each(lprxx,function(i,value){
                    xkhYjNs.smrzData.push({
                        sfzjlx : value.sfzjzlDm,
                        sfzjhm : value.sfzjhm,
                        xm     : value.gprxm,
                        sjhm   : value.lxdh,
                        sf     : '购票人'
                    })
                })
            }
        });
        $.each(xkhYjNs.smrzData,function(i,value){
            //xkhYjNs.smrzAjax(value);
        });
        if(xkhYjNs.smrzReturn){
            $('#pzhdMsg').show().html('查询实名信息失败，请您稍后刷新本页面，重新受理本次申请。');
            return;
        }
        if(xkhYjNs.smrzMsg){
            $('#smrzMsg').show();
            $('#smrzMember').append(xkhYjNs.smrzMsg);
            return;
        }
        if(xkhYjNs.smrzMatchMsg){
            $('#smrzMatchMsg').show();
            $('#smrzMatchMember').append(xkhYjNs.smrzMatchMsg);
        }
    },
    smrzAjax: function(data){
        var url = '/dzgzpt-wsys/api/xjsmxx/checkSmxx',
            requestData = {
                sfzjlxdm : data.sfzjlx,
                sfzjhm   : data.sfzjhm,
                bsrxm    : encodeURIComponent(encodeURIComponent(data.xm)),
                sjhm     : data.sjhm,
                tsxxSf   : encodeURIComponent(encodeURIComponent(data.sf))
            };
        ajax.post(url,mini.encode(requestData),function(res){
            if(res.success){
                if(res.value === 'N'){
                    if( res.message.indexOf('未做实名信息采集') !== -1){
                        xkhYjNs.smrzMsg +=  xkhYjNs.smrzMsg ? '、【'+data.sf+'】'+data.xm : '【'+data.sf+'】'+data.xm;
                    }else{
                        xkhYjNs.smrzMatchMsg += xkhYjNs.smrzMatchMsg ? '<br>'+ res.message : res.message;
                    }
                }
            }else{
                xkhYjNs.smrzReturn = true;
            }
        },function(){
            xkhYjNs.smrzReturn = true;
        })
    },
    sxbj:function(){
     if(sxbjFlag){
    	 mini.alert("您存在待受理的申请，不能办结此任务。");
     }else{
    	 $.ajax({
             url: '/dzgzpt-wsys/api/xjYjbs/checkYjbsSlr',
             type: "POST",
             contentType: "application/json;charset=utf-8",
             data: mini.encode({sqxh:yzymSqxh}),
             success: function (res) {
                 if (res.success) {
                     $.ajax({
 	        url: "../../../../api/xjYjbs/updateSxzt",
 	        type: "post",
 	        data: mini.encode({
 	        	sqxh: bjsqxh
 	        }),
 	       contentType: "application/json; charset=UTF-8",
 	        success: function (data) {
 	            if (data.success) {
 	                mini.alert("予以受理成功！","提示信息",function(){
                                     mini.Cookie.set("reflash", "ok");
 	                	onCancel("ok");
 	                })
 	            } else {
 	                mini.alert("予以受理失败！","提示信息",function(){
 	                	onCancel("ok");
 	                })
                             }
                         }
                     });
                 } else {
                     mini.alert(res.message,"提示",function (e) {
                         if(e == 'ok'){
                             onCancel("ok");
                         }
                     });
 	            }
 	        }
 	    }); 
     }
   },
    isDw: function () {
        var flg = false;
        for (var x in this.allSlData) {
            if (this.allSlData[x].swsxDm === "110101") {
                flg = true;
                break;
            }
        }
        return flg;
    },
    hasPzhd:function () {
        var pzFlag = false;
        $.each(xkhYjNs.allSlData,function (index,item) {
            if(item.swsxDm == '110207'){
                pzFlag = true;
            }
        })
        if(pzFlag && !sxgzMark){
            $("#pzhdMsg").show();
        }
    },
    render1: function (e) {
        var data = xkhYjNs.sqqkGrid.getData();
        var record = e.record;
        var flg = xkhYjNs.isDw();

        //判断设立登记是否受理通过
        var hasCrossSLDJ = false;
        var hasCrossSLDJing = false;
        var hasCrossCKZH = false;

        if (sxgzMark) {
            if(record.swsxDm == '110101' || record.swsxDm == '110121'){
                return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' +
                    xkhYjNs.lcslid +
                    ',' + flg +
                    ',' + record.sqxh +
                    ',' + record.swsxDm +
                    ',' + record.blztDm +
                    '\')" href="#">查看详情</a>'
            }

            if(record.swsxDm == '110701' || record.swsxDm == '110112'){
                return "-"
            }
            if(record.blztDm == '00'){
                return "-"
            }else{
                return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' +
                    xkhYjNs.lcslid +
                    ',' + flg +
                    ',' + record.sqxh +
                    ',' + record.swsxDm +
                    ',' + record.blztDm +
                    '\')" href="#">查看详情</a>'
            }

        } else {
            if(record.swsxDm =="110101" || record.swsxDm =="110121"){
                yzymSqxh = record.sqxh
            }
            if (record.blztDm === "01" ||record.blztDm === "02" ||record.blztDm === "03" ||record.blztDm === "04"||record.blztDm === "05") {
                if (record.swsxDm != '110701' && record.swsxDm != '110112') {
                    return '<a class="Delete_Button" onclick="showSwsxSqxxckqx(\'' +
                        xkhYjNs.lcslid +
                        ',' + flg +
                        ',' + record.sqxh +
                        ',' + record.swsxDm +
                        ',' + record.blztDm +
                        '\')" href="#">查看详情</a>'
                }
            }

            $.each(data, function (index, item) {
                if (item.blztDm == "00" || item.blztDm == "06") {//存在受理中和补正资料的不让事项办结
                    sxbjFlag = true;
                }
                if (
                    (item.swsxDm === "110101" && item.blztDm === "01" ) ||
                    (item.swsxDm === "110121" && item.blztDm === "01")
                ) {
                    hasCrossSLDJ = true;
                }

                if ((item.swsxDm === "110101" && item.blztDm === "00" ) || (item.swsxDm === "110121" && item.blztDm === "00")) {
                    hasCrossSLDJing = true;
                }
            });
            $.each(data, function (index, item) {
                if (item.swsxDm === "110111" && item.blztDm === "01") {
                    hasCrossCKZH = true;
                }
            })

            if (hasCrossSLDJing) {
                if (record.swsxDm === "110101" || record.swsxDm === "110121") {
                    if(xkhYjNs.smrzReturn){
                        return '-';
                    }
                    if(!xkhYjNs.smrzMsg && !xkhYjNs.smrzMatchMsg){
                        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' +
                            xkhYjNs.lcslid +
                            ',' + flg +
                            ',' + record.sqxh +
                            ',' + record.swsxDm +
                            ',' + record.blztDm +
                            '\')" href="#">受理</a>'
                    }
                    if(!xkhYjNs.smrzMsg && xkhYjNs.smrzMatchMsg){
                        return '<a class="Delete_Button" onclick="showSwsxSqxx(\'' +
                            xkhYjNs.lcslid +
                            ',' + flg +
                            ',' + record.sqxh +
                            ',' + record.swsxDm +
                            ',' + record.blztDm +
                            ',' + 'bysl' +
                            '\')" href="#">受理</a>'
                    }
                }
                return '-';
            }

            if (!hasCrossSLDJ) {
                return '-';
            }

            var str = "";
            if (
                record.swsxDm === "110101" ||
                record.swsxDm === "110121" ||
                record.swsxDm === "110207" ||
                record.swsxDm === "110113"
            ) {
                // if (record.swsxDm === "110207" && (record.blztDm == "03" || record.blztDm == "04" || record.blztDm == "05")) {
                //     return '-';
                // }

                if (record.blztDm != '00') {
                    return '-'
                }

                str = '<a class="Delete_Button" onclick="showSwsxSqxx(\'' +
                    xkhYjNs.lcslid +
                    ',' + flg +
                    ',' + record.sqxh +
                    ',' + record.swsxDm +
                    ',' + record.blztDm +
                    '\')" href="#">受理</a>';
            } else {

                if (record.swsxDm === "110701" && !hasCrossCKZH) {
                    return '-';
                }

                if (record.blztDm != '00') {
                    return '-'
                }

                str = '<a class="Delete_Button" onclick="drHxzg(\'' +
                    record.sqxh +
                    '\',\''+record.swsxDm+'\')" href="#">导入核心征管</a>';
                str=str+"&nbsp;&nbsp;&nbsp;&nbsp;"+'<a class="Delete_Button" id=\''+record.swsxDm+'\' style="display:none;" onclick="drHxzgFail(\'' +record.sqxh +'\',\'97\')" href="#">异常数据处理</a>';
            }
            return str
        }
    }
}

function showSwsxSqxx(str) {
    var st = str.split(",");
    var loadingId = mini.loading("处理中", "提示");
    var sx = !!sxgzMark ? 'Y' :'N';
    var url = "dbsx_sxsl_yjbs.html?lcslId=" + st[0]
        + "&isDw=" + st[1]
        + "&sqxh=" + st[2]
        + "&swsxDm=" + st[3]
        + "&blztDm=" + st[4]
        + "&sxgzMark=" + sx;
    if(st.length > 5){
        url += "&bysl=" + st[5];
    }
    if(st[3] === '110207'){
        var data = mini.get('xkq-sqqk-grid').getData(),
            ybnsrAccept = true;
        $.each(data,function(i,value){
            if(value.swsxDm === '110113' && value.blztDm === '00'){
                ybnsrAccept = false;
            }
        });
        if(!ybnsrAccept){
            mini.hideMessageBox(loadingId);
            mini.alert('受理票种核定时，请先受理一般纳税人认定');
            return;
        }
    }
    if(sx == "Y"){
        openDbsxsl(url);
    }else{
        $.ajax({
            url: '/dzgzpt-wsys/api/xjYjbs/checkYjbsSlr',
            type: "POST",
            contentType: "application/json;charset=utf-8",
            data: mini.encode({sqxh:st[2]}),
            success: function (res) {
                if (res.success) {
                    checkDbsxslzt(st[0], function () {
                        openDbsxsl(url);
                    });
                    mini.hideMessageBox(loadingId);
                } else {
                    mini.hideMessageBox(loadingId);
                    mini.alert(res.message,"提示",function (e) {
                        if(e == 'ok'){
                            onCancel("ok");
                        }
                    });
                }
            },
            error:function (res) {
                mini.hideMessageBox(loadingId);
                mini.alert(res.message,"提示",function (e) {
                    if(e == 'ok'){
                        onCancel("ok");
                    }
                });
            }
        });
    }
}

function showSwsxSqxxckqx(str) {
    var st = str.split(",");
    var xq = 'Y';
    var loadingId = mini.loading("处理中", "提示");
        var url = "dbsx_sxsl_yjbs.html?lcslId=" + st[0]
            + "&isDw=" + st[1]
            + "&sqxh=" + st[2]
            + "&swsxDm=" + st[3]
            + "&blztDm=" + st[4]
            + "&sxgzMark=" + xq;
        openDbsxsl(url);
    mini.hideMessageBox(loadingId);
}

//弹出待办事项受理页面
function openDbsxsl(url) {
    var win = mini.open({
        showMaxButton: true,
        title: "待办事项受理",
        url: url,
        showModal: true,
        width: "100%",
        height: "100%",
        onload: function () {
        },
        ondestroy: function (action) {
            location.reload();
        }
    });
}
function onCancel(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}
/**
 * 任务状态渲染
 * @param e
 * @returns {String}
 */
function rwztRenderer(e) {
    var record = e.record;
    var rwztDm = record.rwztDm;
    if ("00" == rwztDm) {
        return "未受理";
    }
    if ("01" == rwztDm) {
        return "已受理";
    }
    if ("02" == rwztDm) {
        return "待税种认定";
    }
    return "";
}

/**
 * 重置查询条件
 */
function doReset() {
    var form = new mini.Form("#cxtjForm");
    form.reset();
}

/**
 * 刷新待办任务状态
 */
function reflashDbrwzt() {
    var reflash = mini.Cookie.get("reflash");
    if ("ok" == reflash) {
        var dbsxGrid = mini.get("dbsxGrid");
        var index = Number(mini.Cookie.get("_index"));
        var row = dbsxGrid.getRow(index);
        dbsxGrid.updateRow(row._index, "rwztDm", "01");
    }
    mini.Cookie.set("reflash", "ng");
}
function drHxzgFail(sqxh,blztDm) {
    var messageid = mini.loading("正在处理导入核心征管失败数据, 请稍等 ...", "提交中");
    setTimeout(function () {//提交文书加遮罩
    	 $.ajax({
    	        url: "../../../../api/xjYjbs/wtgl/dbsx/saveSwsxBl",
    	        type: "post",
    	        data: {
    	            sqxh: sqxh,
    	            blztDm: blztDm
                },
    	        success: function (data) {
    	        	mini.hideMessageBox(messageid);
    	            if (data.success) {
    	                mini.alert("数据处理成功！","提示",function () {
                            location.reload();
                        })
        }else {
    	                mini.alert("数据处理失败！");
                        mini.hideMessageBox(messageid);
        }
    	        },
                error:function (res) {
                    mini.hideMessageBox(messageid);
                }
    	    });
    },500);

}
function drHxzg(sqxh,swsxDm) {
    var messageid = mini.loading("正在导入核心征管, 请稍等 ...", "提交中");
    $.ajax({
        url: '/dzgzpt-wsys/api/xjYjbs/checkYjbsSlr',
        type: "POST",
        contentType: "application/json;charset=utf-8",
        data: mini.encode({sqxh:sqxh}),
        success: function (res) {
            if (res.success) {
    setTimeout(function () {//提交文书加遮罩
    	 $.ajax({
    	        url: "../../../../api/xjYjbs/wtgl/dbsx/saveSwsxBl",
    	        type: "post",
    	        data: {
    	            sqxh: sqxh,
    	            blztDm: '01'
    	        },
    	        success: function (data) {
    	        	mini.hideMessageBox(messageid);
    	            if (data.success) {
    	                mini.alert("导入核心征管成功！","提示",function () {
                            location.reload();
                        })
    	            } else {
                                mini.alert(data.message);
                                $('#'+swsxDm).show();
                                mini.hideMessageBox(messageid);
    	            }
                        },
                        error:function (res) {
                            mini.hideMessageBox(messageid);
    	        }
    	    });
    },500);
            } else {
                mini.alert(res.message,"提示",function (e) {
                    if(e == 'ok'){
                        onCancel("ok");
                    }
                });
                mini.hideMessageBox(messageid);
            }
        },
        error:function (res) {
            mini.hideMessageBox(messageid);
            mini.alert(res.message);
        }
    });
}
function onCancel(action) {
    if (window.CloseOwnerWindow)
        return window.CloseOwnerWindow(action);
    else
        window.close();
}


