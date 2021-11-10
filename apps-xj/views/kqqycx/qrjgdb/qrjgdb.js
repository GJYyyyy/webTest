var qrjgdb = {
    initPage: function () {
        qrjgdb.queryGrid();
    },
    queryGrid: function () {
        var sqxh = getQueryString('sqxh');
        // var sqxh = '9b268ebb43214d1081b70b5681d83737'
        if(sqxh){
            $.ajax({
                url: '/hgzx-gld/api/hgzx/kqqyqy/sqxx/' + sqxh + '/get',
                type: 'GET',
                success: function (data, textStatus, request) {
                    if (!!data.success && data.value) {
                        data.value = JSON.parse(data.value.data);
                        $('#nsrsbh').html(data.value.nsrsbh);
                        $('#nsrmc').html(data.value.nsrmc);
                        $('#qcdzcdzxzqhszDm').html(data.value.qcdzcdzxzqhszmc);
                        $('#qrdzcdzxzqhszDm').html(data.value.qrdzcdzxzqhszmc);
                        $('#qcdzcdz').html(data.value.qcdzcdz);
                        $('#qrdzcdz').html(data.value.qrdzcdz);
                        $('#jbrmc').html(data.value.jbrmc);
                        $('#sjhm').html(data.value.sjhm);
                        $('#zjhm').html(data.value.zjhm);
                        $('#cktslx').html(data.value.cktslx == 'N'?'否':'是');
                    } else{
                        mini.alert(data.message || '接口异常，请稍后重试');
                    }
                },
                error:function(error){
                    mini.alert(error.message || '接口异常，请稍后重试');
                }
            });
            fbzlAjax({sqxh:sqxh});
        }
    }
};
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
var fbzldata,requestData;
function fbzlAjax(data){
    var sqxh = data.sqxh;
    var url = '/dzgzpt-wsys/api/wtgl/dbsx/fbzllist/'+sqxh;
    $.ajax({
        url: url,
        type: 'post',
        async: false,
        data: mini.encode(requestData),
        success: function(res){
            if(res.success){
                //初始化上传数量为0
                fbzldata = res.value;
                for(var i=0; i<fbzldata.length; i++){
                    fbzldata[i].scCount = fbzldata[i].bsmxlist.length;
                }
                var fbzlGrid = mini.get("fbzl-grid");
                fbzlGrid.setData(fbzldata);
            }else{
                mini.alert(res.message);
            }
        },
        error: function(error) {

        }
    })
}

//附报资料表格渲染
function onRenderApply(e) {
    var s;
    if (parseInt(e.record.bslxDm)==1) {
        s = '<span class="status-red">必报</span>';
    } else {
        s = '<span>非必报</span>';
        if (parseInt(e.record.bslxDm)==3) {
            s = '<span class="status-red">容缺报送</span>';
          }
    }
    return s;
}

/*上传附报资料渲染操作*/
function onRenderOpearte(e) {
    var html;
    var record = e.record;
    var index = record._index;
    if(record.scCount == '0'){
        html = '<a href="javascript:uploadFbzl(\'' + index + '\');" class="upload">选择</a>';
    }else{
        html =
            '<a href="javascript:previewFbzl(\'' + index +
            '\');"  class="check-info">预览</a>';
    }
    return html;
}
/*预览提交页面渲染操作*/
function ylonRenderOpearte(e){
    var html;
    var record = e.record;
    var index = record._index;
    if(record.bsmxlist.length != 0){
        html ='<a href="javascript:previewFbzl(\'' + index + '\', \'yltj\');"  class="check-info">预览</a>';
    }
    return html;
}

function previewFbzl(id,step) {
    mini.open({
        url: './Fbzlck.html',        //页面地址
        title: '预览附报资料',      //标题
        iconCls: '',    //标题图标
        width: 900,      //宽度
        height: 600,     //高度
        allowResize: true,       //允许尺寸调节
        allowDrag: true,         //允许拖拽位置
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: false,     //显示最大化按钮
        showModal: true,         //显示遮罩
        currentWindow:false,      //是否在本地弹出页面,默认false
        effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
        onload: function () {       //弹出页面加载完成
            var iframe = this.getIFrameEl();
            var data = {action:fbzldata[id].bsmxlist,steps:step};
            //调用弹出页面方法进行初始化
            iframe.contentWindow.SetData(data);

        },
        ondestroy: function (action) {  //弹出页面关闭前
            if (action == "close") {       //如果点击“确定”
                var iframe = this.getIFrameEl();
                //获取选中、编辑的结果
                var data = iframe.contentWindow.GetData();
                data = mini.clone(data);    //必须。克隆数据。
                if(data){
                    fbzldata[id].scCount = data.length.toString();
                    mini.get('fbzl-grid').setData(fbzldata);
                }

            }
        }

    });

}

//数组对象去重
var unique = {
    objkey: function(obj, keys){
        var n = keys.length,
            key = [];
        while(n--){
            key.push(obj[keys[n]]);
        }
        return key.join('|');
    },
    uniquebykeys: function(array,keys){
        var arr = [];
        var hash = {};
        for (var i = 0, j = array.length; i < j; i++) {
            var k = unique.objkey(array[i], keys);
            if (!(k in hash)) {
                hash[k] = true;
                arr .push(array[i]);
            }
        }
        return arr ;
    }
};
//过滤掉没有上传附报资料且非必报的数据
function filterExcessData(){
    var newfbzldata=[];
    if(typeof(fbzldata) == 'string'){
        fbzldata = mini.decode(fbzldata);
    }
    fbzldata.map(function(item,index){
        if(item.bsmxlist){
            newfbzldata.push(item);
            fbzldata = newfbzldata;
        }
    })
    return fbzldata;
}
$(function () {
    qrjgdb.initPage()
});
