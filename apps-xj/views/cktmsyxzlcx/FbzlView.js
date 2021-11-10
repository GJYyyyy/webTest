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

var fbzldata,requestData,record;
var fbzlGrid = mini.get("fbzl-grid");
function fbzlAjax(sqxh,nsrsbh,swsxmc,lrrq){
    record={sqxh:sqxh,nsrsbh:nsrsbh,swsxmc:swsxmc,lrrq:lrrq};
    $('#nsrsbh').text(nsrsbh);
    $('#sxmc').text(swsxmc);
    //查询已上传的影像资料oldFbzllist
    var url = '/dzgzpt-wsys/api/sh/ywtb/ext/qyery/yxzllb?sqxh='+sqxh;
    $.ajax({
        url: url,
        type: 'get',
        async: false,
        data: '',
        success: function(res){
            if(res.success){
                //初始化上传数量为0
                fbzldata = res.value;
                mini.get("fbzl-grid").setData(fbzldata);
            }else{
                mini.alert(res.message);
            }
        },
        error: function(error) {

        }
    })
}

/*预览提交页面渲染操作*/
function ylonRenderOpearte(e){
    var html;
    var record = e.record;
    var index = record._index;
    var re = /\.jpg$|\.jpeg$|\.png$|\.gif$/i;
    //匹配是不是图片，非图片点击下载，图片点击预览
    var fileType = re.test(record.fileName);
    if(!fileType){
        html =
            '<a href="javascript:downloadPdf(\'' + record.xh +'\');"  class="check-info">下载</a>';
    }else{
        html =
            '<a href="javascript:previewFbzl(\'' + index +
            '\');"  class="check-info">预览</a>';
    }
    return html;
}
function downloadPdf(xh){
	window.open('/dzgzpt-wsys/api/sh/ywtb/ext/download/yxzl?xh='+xh);
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
            var data = {action:fbzldata[id]};
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