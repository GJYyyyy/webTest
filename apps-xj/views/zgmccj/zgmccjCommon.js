  //是否类型
	var sfData = [{ id:"Y",text:"是"},
		          { id:"N",text:"否"}];
	
    //获取数据集的text
	function getObjectText(obj,id){
		for(var i=0;i<=obj.length-1;i++){
			if(id == obj[i]["id"]){
				return obj[i]["id"]+"|"+obj[i]["text"];
			}
		}
		return id;
	}