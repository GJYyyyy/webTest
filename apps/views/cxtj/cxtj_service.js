/**
 * Created by Administrator on 2017-02-17.
 */

var cxtjApi={
    queryWssqJbxx:"../../../../api/wtgl/cxtj/sxgz/queryWssqJbxx", //获取凭证基本信息
    queryWssqViewData:"../../../../api/wtgl/dbsx/queryWssqViewData",//申请表数据获取
    //===swsx.js中有用到
    saveSwsxBl:"../../../../api/wtgl/dbsx/saveSwsxBl",//税务事项办理保存
    querySwsxtzsxx:"../../../../api/wtgl/dbsx/querySwsxtzsxx"//查询税务事项通知书信息
};

var cxtjService={
    queryWssqJbxx:function(lcslId){
        var params = {
            rwlxDm: '01',
            lcslId: lcslId
        };
        var data = null;
        ajax.get(cxtjApi.queryWssqJbxx,params, function (result) {
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
        ajax.post(cxtjApi.queryWssqViewData,params,function(result){
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


