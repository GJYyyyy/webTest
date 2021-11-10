/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Last modified by:sunml
 * Date：2017/2/05
 * Time：17:30
 *
 */

function skipFbzl() {

}

var fbzldata,requestData;
function fbzlAjax(data,whichstep){

    if(whichstep == 'requestFbzllist'){
        //获取附报资料列表http://10.200.100.75:8080
        var url = '/wszx-web/api/get/multifbzllist';
       //var url = '/apps/data/fbzl.json';
        requestData = data;
        if(requestData){
            var oldswsxMxDmList = requestData.swsxMxDmList.sort().toString();
            var newswsxMxDmList = data.swsxMxDmList.sort().toString();
            if(requestData.swsxMxDmList.length==0 && data.swsxDm == requestData.swsxDm) {
                return;
            }
            if(data.swsxDm == requestData.swsxDm &&  oldswsxMxDmList == newswsxMxDmList){
                return;
            }
        }
    }else{
        var sqxh = data.sqxh;
        //查询已上传的附报资料oldFbzllist
        var url = '/dzgzpt-wsys/api/wtgl/dbsx/fbzllist/'+sqxh;
    }

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
/*渲染状态 状态为图标*/
// function onRenderStatus(e) {
//   var html;
//   if (e.record.status == "1") {
//     html = '<div class="ico-passed"></div>'
//   } else if (e.record.status == "2") {
//     html = '<div class="ico-no-passed"></div>'
//   } else {
//     html = '<div class="ico-delete"></div>'
//   }
//   return html;
// }

/*渲染状态 状态为文字*/
// function onRenderStatusText(e) {
//   var html;
//   if (e.record.status == "1") {
//     html = '<span>已上传</span>';
//   } else {
//     html = '<span class="status-red">未上传</span>';
//   }
//   return html;
// }

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
// function onActionRenderer(e) {
//     var grid = e.sender;
//     var record = e.record;
//     var uid = record._uid;
//     var rowIndex = e.rowIndex;
//
//     var s = '<a class="fbzl-preview" href="javascript:previewFbzl(\'' + uid + '\')">查看</a>'
//         + ' <a class="fbzl-edit" href="javascript:editFbzl(\'' + uid + '\')">编辑</a>'
//         + ' <a class="fbzl-upload" href="javascript:uploadFbzl(\'' + uid + '\')">上传</a>';
//     return s;
// }

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

function editFbzl(id) {

}

function uploadFbzl(id) {
      mini.open({
        url: '/dzzlk/DzzlkWeb/apps/views/dzzlsc.html',//页面地址
        title: '附报资料上传',      //标题
        iconCls: '',    //标题图标
        width: 900,      //宽度
        height: 650,     //高度
        allowResize: true,       //允许尺寸调节
        allowDrag: true,         //允许拖拽位置
        showCloseButton: true,   //显示关闭按钮
        showMaxButton: false,     //显示最大化按钮
        showModal: true,         //显示遮罩
        currentWindow:false,      //是否在本地弹出页面,默认false
        effect:'none',              //打开和关闭时的特果:'none','slow','fast',默认'none'
        onload: function () {       //弹出页面加载完成
            var iframe = this.getIFrameEl();
            var data = {};
            //调用弹出页面方法进行初始化
            //iframe.contentWindow.SetData(data);

        },
        ondestroy: function (action) {  //弹出页面关闭前
            if (action != "close") {       //如果点击“确定”
                var data = mini.decode(action);
                data = mini.clone(data);
                if(fbzldata[id].bsmxlist){
                    //连接每次选中的图片的数组
                    fbzldata[id].bsmxlist = fbzldata[id].bsmxlist.concat(data);
                    //根据fileKey去掉重复的数据
                    data = unique.uniquebykeys(fbzldata[id].bsmxlist,['fileKey']);
                }
                //增加filetype,fbzlmxxh字段，为提交做准备
                data.map(function(item,index){
                    if(!data[index].filetype){
                        data[index].filetype = item.fileName.split('.')[1];
                    }
                    data[index].fbzlmxxh = index+1;
                })
                fbzldata[id].bsmxlist = data;
                fbzldata[id].scCount = data.length.toString();
                mini.get('fbzl-grid').setData(fbzldata);
            }
        }

    });
}
//判断是否上传附报资料
function isCondition(){
    var flag = true;
    $.map(fbzldata,function(item,index){
        if(flag){
            if((item.bslxDm=='1' && item.bsmxlist==undefined) || (item.bslxDm=='1' && item.bsmxlist.length==0)){
                mini.alert('请上传附报资料');
                flag = false;
            }
        }

    })
    return flag;
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