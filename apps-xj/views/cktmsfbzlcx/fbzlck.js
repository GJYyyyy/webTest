//接收父页面数据
var imagedata;
function SetData(data){
    if(data.action){
        imagedata = data.action;
        imagePreviewObj.createImagesPreview(imagedata,
            function() {
                $('#fbzlyl-grid').viewer();
            });
    }
}
/**
 * Created by ywy on 2017/12/26.
 */
var imagePreviewObj = {
	imageSource: null,
	$images: null, //缓存图片对象
	//imagesSource: imagedata,
	createImagesPreview: function(obj, callback) {
		var strEl='';
		var re = /\.jpg$|\.jpeg$|\.png$|\.gif$/i;
		//匹配是不是图片，非图片点击下载，图片点击预览
		var fileType = re.test(obj.fileName);
		if(!fileType){
			var fileName = encodeURIComponent(encodeURIComponent(obj.fileName));
			if(obj.fileName.indexOf('.doc')>=0||obj.fileName.indexOf('.docx')>=0){
				strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/sh/ywtb/ext/download/yxzl?xh='+ obj.xh +'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/word.png"></a><span title="'+obj.fileName+'" class="file-name">'+obj.fileName+'</span></div>';
			}
			if(obj.fileName.indexOf('.pdf')>=0){
				strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/sh/ywtb/ext/download/yxzl?xh='+ obj.xh +'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/pdf.png"></a><span title="'+obj.fileName+'" class="file-name">'+obj.fileName+'</span></div>';
			}
			if(obj.fileName.indexOf('.xls')>=0||obj.fileName.indexOf('.xlsx')>=0){
				strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/sh/ywtb/ext/download/yxzl?xh='+ obj.xh +'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/excel.png"></a><span title="'+obj.fileName+'" class="file-name">'+obj.fileName+'</span></div>';
			}

		}else{
			strEl += '<div class="image-box image"><img src="/dzgzpt-wsys/api/sh/ywtb/ext/view/yxzl?xh=' + v.xh + '"/><span title="'+obj.fileName+'" class="file-name">'+obj.fileName+'</span></div>';
		}


		$("#fbzlyl-grid").empty().append(strEl);

		return callback();
	}
}
//删除附报资料
$('#fbzlyl-grid').delegate('.close','click',function(e){
    e.preventDefault();
    e.stopPropagation();

    var currentIndex = $(this).parent().index(),
        newImagesSource = [],
        deleteTarget = imagedata.splice(currentIndex, 1);
    $.each(imagedata, function(index,item) {
        if(item !== deleteTarget)
        {
            newImagesSource.push(item);
        }
    })
    imagePreviewObj.imageSource = newImagesSource;
    imagePreviewObj.createImagesPreview(newImagesSource,function(){
        $('.image').viewer();
    });
})

function GetData(){
    return imagePreviewObj.imageSource;
}
