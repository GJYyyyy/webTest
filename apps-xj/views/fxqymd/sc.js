var uploader =null ;
var timer = 0;  //超时设置
var timerObj=null;
top.uploadSuccessData = null;
var uploadSuccessData = null;
$(function() {
	if (!WebUploader.Uploader.support('flash') && WebUploader.browser
		    .ie) {
		    parent.mini.confirm('系统未检测到您的flashplayer，为确保本地上传功能正常使用，请点击确定立即安装flashplayer？或点击取消使用其他方式上传。', '提示', function(action) {
		        if (action == "ok") {
		            CloseWindow("cancel");
		            parent.open("http://www.adobe.com/go/getflashplayer", "_blank");
		            
		        } else {
		            CloseWindow("cancel");
		        }
		    })
		    return false;
	}
	// 实例化uploader对象，配置参数
	uploader = WebUploader.create({
		pick : '#fileUpload',
		swf : '/wszx-web/lib/fex-webuploader/dist/Uploader.swf',
		server : '/dzgzpt-wsys/api/sh/fxqymd/import/jcmd',
		accept : {
			title : 'Xls',
			extensions : 'xls,xlsx'
		},
		// 禁掉全局的拖拽功能。这样不会出现图片拖进页面的时候，把图片打开。
		disableGlobalDnd : true,
		fileNumLimit : 1,
		fileSizeLimit : 10 * 1024 * 1024, // 10 M
		fileSingleSizeLimit : 10 * 1024 * 1024 // 60 M
	});
	
    uploader.on('uploadProgress', function(file, percentage){ //上传进度
		$('.progress').show();
		$('.progress-text').text( percentage * 100 + '%');
		$('.progress-color').css({
			width: percentage * 100 + '%'
		});
	}).on('startUpload', function (file) { //开始上传
		$('.loading').show();
		timerObj = setInterval(function(){
			timer++;
			if(timer > 60){
				$('.timer-out').show();
			}
		}, 1000);
	}).on('uploadComplete', function(file ){
		$('.timer-out').hide();
		timer = 0;
		timerObj ? clearInterval(timerObj) : '';
		
	}).on('error', function (error, code, file) { //上传错误
		var file = file || {};
		switch (error) {
			case 'F_DUPLICATE' :
				$alert( (code.name||'') + ' 文件已存在');
				break;
			case 'Q_TYPE_DENIED':
				$alert((file.name || '') + ' 文件类型不正确');
				break;
			case 'Q_EXCEED_NUM_LIMIT':
				$alert('单次最多上传1个文件');
				break;
			case 'F_EXCEED_SIZE':
				$alert( (file.name || '') + ' 文件太大，请压缩后上传');
				break;
			default:
				$alert( (file.name||'') + ' 文件错误');
				break;
		}
	}).on('uploadError', function(file){ //上传请求出错
		var name =  file ? file.name : '';
		$alert(name + ' 文件上传失败，请重新上传');
	}).on('uploadFinished', function (file, data) { //上传结束
		$('.loading').hide();
		$('.timer-out').hide();
		timer = 0;
		timerObj ? clearInterval(timerObj) : '';
		//处理数据
		top.uploadSuccessData = JSON.stringify(uploadSuccessData);
	}).on('uploadSuccess', function(file , data){ //上传成功
		var file = file || {};
		if (data.success) {
			uploader.removeFile(id); //删除上传队列文件
			$li.addClass('success'); //标注上传成功图片
			uploadSuccessData=data.value;
		} else {
			$("#error-tip").show();
			$("#error-tip").addClass("upload-error");
			$("#error-tip").innerHtml="上传失败!";
			$alert(data.message);
		}
	});
})

function  uploadZgmccj(){
	//uploader.upload();
    var inputFile = $("#file1 > input:file")[0];
    $.ajaxFileUpload({
        url: '/dzgzpt-wsys/api/sh/fxqymd/import/jcmd',                 //用于文件上传的服务器端请求地址
        fileElementId: inputFile,               //文件上传域的ID
        //data: { a: 1, b: true },            //附加的额外参数
        dataType: 'json',                   //返回值类型 一般设置为json
        success: function (data, status){    //服务器成功响应处理函数
            if(data.success){
                uploadSuccessData = data.value;
                //调用父页面方法
				Owner.upSuccess(uploadSuccessData);
            }else{
                Owner.upLoser(uploadSuccessData);
            }
        },
        error: function (data, status, e){   //服务器响应失败处理函数
            Owner.upLoser(data.value);
        },
        complete: function () {
            var jq = $("#file1 > input:file");
            jq.before(inputFile);
            jq.remove();
        }
    });
}


function $alert(msg, callback){
	if(top.mini && top.mini.alert){
		top.mini.alert(msg, null, callback)
	}else{
		alert(msg);
	}
}
function GetData(){
    return uploadSuccessData;
}
