/**
 * Created by Administrator on 2017-02-17.
 */
var sxxlApi={
    queryWssqJbxx:"../../../../api/wtgl/dbsx/queryWssqJbxx", //获取凭证基本信息
    queryWssqViewData:"../../../../api/wtgl/dbsx/queryWssqViewData",//申请表数据获取
    //===swsx.js中有用到
    saveSwsxBl:"../../../../api/wtgl/dbsx/saveSwsxBl",//税务事项办理保存
    querySwsxtzsxx:"../../../../api/wtgl/dbsx/querySwsxtzsxx"//查询税务事项通知书信息
};

var sxslService={
    queryWssqJbxx:function(lcslId){
        var params = {
            rwlxDm: '01',
            lcslId: lcslId
        };
        var data = null;
        ajax.post(sxxlApi.queryWssqJbxx,params, function (result) {
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
                mini.alert(result.message);
                return false;
            }
        });
        return data;
    },
};


