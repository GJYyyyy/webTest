mini.parse();
var grid = mini.get("validate-info");
var errorCount=0;
var rightUrl = '';
function initValidateGrid(data,isNull,needCloseWin,djxh){
    /*我知道*/
    $("#actions").on('click','#iknowBtn',function(){
        if(errorCount>0){
            if(needCloseWin){
                if (window.CloseOwnerWindow) {
                    return window.CloseOwnerWindow('close');
                }
                else {
                    closeWin('close');
                }
            }else{
                if (window.CloseOwnerWindow) {
                    return window.CloseOwnerWindow();
                }
                else {
                    closeWin();
                }
            }
        }else{
            closeWin();
        }
    });

    var ruleResults = data.ruleResults;
    grid.on("drawcell", function (e) {
        var field = e.field,
            index = e.rowIndex;
        if (field === "ruleUrl") {
            if(!ruleResults[index].resultUrl){
                e.cellHtml = '&nbsp; <span>--</span>&nbsp; ';
            }else{
                var resultUrl = ruleResults[index].resultUrl;
                var ruleId = ruleResults[index].ruleId;
                var wsbxqUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/wsbxq/wsbxq.html?djxh=' + djxh;
                var qsxqUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/qsxq/qsxq.html?djxh=' + djxh;
                var djxqUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/djxq/djxq.html?djxh=' + djxh + '&ruleId=' + ruleId;
                var czwbjsxxqUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/czwbjsxxq/czwbjsxxq.html?djxh=' + djxh + '&ruleId=' + ruleId;
                var rkrqwkUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/rkrqwk/rkrqwk.html?djxh=' + djxh + '&ruleId=' + ruleId;;
                var ycspbbdycUrl = '/dzgzpt-wsys/dzgzpt-wsys/apps/views/kqqycx/ycspbbdyc/ycspbbdyc.html?djxh=' + djxh + '&ruleId=' + ruleId;
                if(resultUrl.indexOf('wsbxq')>0){
                    rightUrl = wsbxqUrl;
                } else if(resultUrl && resultUrl.indexOf('qsxq')>0){
                    rightUrl = qsxqUrl;
                } else if(resultUrl && resultUrl.indexOf('djxq')>0){
                    rightUrl = djxqUrl;
                } else if(resultUrl && resultUrl.indexOf('czwbjsxxq')>0){
                    rightUrl = czwbjsxxqUrl;
                } else if(resultUrl && resultUrl.indexOf('rkrqwk')>0){
                    rightUrl = rkrqwkUrl;
                } else if(resultUrl && resultUrl.indexOf('ycspbbdyc')>0){
                    rightUrl = ycspbbdycUrl;
                }
                e.cellHtml = '<span class="color-blue" onclick=openHtml("' + rightUrl + '")>' + ruleResults[index].urlTip +"</span>"
                // e.cellHtml = '<a href=javascript:top.open("' + rightUrl + '")>' + ruleResults[index].urlTip + '</a>';
            }
        }
    });
    grid.setData(ruleResults);
    if(isNull){
        var column = grid.getColumn(5);
        grid.hideColumn(column);
    }

    if(data.ruleErrorCount>0){
        errorCount = data.ruleErrorCount;
        $(".title").show();
    }
}

function closeWin(){
    var userAgent = navigator.userAgent;
    if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") != -1 || isIE11 || isIE10 ||isIE9 ||isIE8 ) {
        top.close();//直接调用JQUERY close方法关闭
    } else {
        window.opener = null;
        window.open("", "_self");
        window.close();
    }
}

function onRenderDegree(e){
    var record = e.record;
    //01错误，02提醒
    if(record.ruleDegree=="01"){
        return "强制监控";
    }else{
        return "提示信息";
    }
}

function onRenderResult(e){
    var record = e.record;
    //01错误，02提醒
    if(!record.resultValue && record.ruleDegree=="01"){
        return "<span class='word-red'>不通过</span>";
    }else if(!record.resultValue && record.ruleDegree=="02"){
        return "——";
    }else if(record.resultValue){
        return "<span class='word-green'>通&nbsp;&nbsp;&nbsp;&nbsp;过</span>";
    }
}

function openHtml(rightUrls){
    mini.open({
        url: rightUrls,        //页面地址
        title: '不通过详情',      //标题
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
        },
        ondestroy:function (e) {

        }
    });
}