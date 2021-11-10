/**
 * Created by Administrator on 2017-02-17.
 */

var sxxlApi={
    queryWssqJbxx:"../../../../api/wtgl/dbsx/queryWssqJbxx", //获取凭证基本信息
    queryWssqViewData:"../../../../api/wtgl/dbsx/queryWssqViewData",//申请表数据获取
    //===swsx.js中有用到
    saveSwsxBl:"../../../../api/wtgl/dbsx/saveSwsxBl",//税务事项办理保存
    querySwsxtzsxx:"../../../../api/wtgl/dbsx/querySwsxtzsxx",//查询税务事项通知书信息
    querysubWssqMxList:"../../../../api/wtgl/dbsx/subTasks/get",//获取子申请列表信息
    querySubWssqViewData:"/dzgzpt-wsys/api/wtgl/dbsx/querySubWssqViewData",//子申请数据获取
    saveMasterSwsxBl:"../../../../api/wtgl/dbsx/masterTask/sxsl",//主任务办理
    saveSubSwsxBl:"../../../../api/wtgl/dbsx/subTask/sxsl"//子任务办理(包括免受理和即办非即办)
};

var sxslService={
    queryWssqJbxx:function(lcslId){
        var params = {
            rwlxDm: '01',
            lcslId: lcslId
        };
        var data = null;
        ajax.get(sxxlApi.queryWssqJbxx,params, function (result) {
            if(result.success && result.value){
                data = result.value;
            }else{
                mini.alert(result.message);
                return false;
            }
        });
        return data;
    },
    queryWssqxxData:function(sqxh){
        var params={
            sqxh:sqxh
        };
        var data=null;
        ajax.post(sxxlApi.queryWssqViewData,params,function(result){
            if(result.success && result.value){
                data = mini.decode(result.value);
            }else{
                mini.alert(result.message, '提示信息', function(){
                    doBack();
                }) 
            }
        });
        return data;
    },
    querySubWssqViewData:function(sqxh){
        var params={
            sqxh:sqxh
        };
        var data=null;
        ajax.post(sxxlApi.querySubWssqViewData,params,function(result){
            if(result.success && result.value){
                data = mini.decode(result.value);
            }else{
                mini.alert(result.message);
                return false;
            }
        });
        return data;
    }
};


