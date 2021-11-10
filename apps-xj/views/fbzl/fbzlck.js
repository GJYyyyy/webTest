/**
 * Created by ywy on 2017/12/26.
 */
var imagePreviewObj = {
	imageSource: null,
	$images: null, //缓存图片对象
	//imagesSource: imagedata,
	createImagesPreview: function(url, callback) {
		var strEl='';
		var re = /\.jpg$|\.jpeg$|\.png$|\.gif$/i;
		$.each(url, function(i, v) {
			//匹配是不是图片，非图片点击下载，图片点击预览
			var fileType = re.test(v.fileName);
			//steps存在，去掉<i class="close"></i>
			if(steps){
				if(!fileType){
                    var fileName = encodeURIComponent(encodeURIComponent(v.fileName));
                    if(v.fileName.indexOf('.doc')>=0||v.fileName.indexOf('.docx')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/word.png"></a><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
					}
                    if(v.fileName.indexOf('.pdf')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/pdf.png"></a><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
                    }
                    if(v.fileName.indexOf('.xls')>=0||v.fileName.indexOf('.xlsx')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/excel.png"></a><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
                    }

				}else{
					strEl += '<div class="image-box image"><img src="/dzgzpt-wsys/api/dzzl/intranet?fileKey=' + v.fileKey + '"/><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
				}
			}else{
				if(!fileType){
					var fileName = encodeURIComponent(encodeURIComponent(v.fileName));
                    if(v.fileName.indexOf('.doc')>=0||v.fileName.indexOf('.docx')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/word.png"></a><i class="close"></i><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
                    }
                    if(v.fileName.indexOf('.pdf')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/pdf.png"></a><i class="close"></i><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
                    }
                    if(v.fileName.indexOf('.xls')>=0||v.fileName.indexOf('.xlsx')>=0){
                        strEl += '<div class="image-box"><a href="/dzgzpt-wsys/api/dzzl/intranet?fileKey='+ v.fileKey +'&fileName='+fileName+'"><img src="/dzgzpt-wsys/dzgzpt-wsys/apps/images/excel.png"></a><i class="close"></i><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
                    }

				}else{
					strEl += '<div class="image-box image"><img src="/dzgzpt-wsys/api/dzzl/intranet?fileKey=' + v.fileKey + '"/><i class="close"></i><span title="'+v.fileName+'" class="file-name">'+v.fileName+'</span></div>';
				}
			}

		});

		$("#fbzlyl-grid").empty().append(strEl);

		return callback();
	}
}