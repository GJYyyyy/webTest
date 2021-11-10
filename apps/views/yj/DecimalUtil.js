/**
*@author 杨文
**@time 2011-08-25
*版本3.0 更新如下
*更新了乘数为0的时候结果为NaN
*@time 2011-08-24
*版本2.0 更新如下
*1.round 方法增加了支持保留一位有效数字
*2.multiply 方法在对传进来的小数转化为整数的时候进行了优化不再为乘以10的几次幂而是变化为字符来处理，避免丢失精度
*/
 /*
 *四舍五入的方法
 *@param val  代表传进来要处理的数值
 *默认精确到2位小数
 *
 *@return 返回计算的数值
 **备注：此方法适合于进行加减但是不适合用于两个很小的数值进行相乘（比如：0.000001*0.00000001）
 *如果要计算2个数值相乘请使用multiply方法
 */
 function round2(val) {
 	return round(val,2);
 }

/*
*四舍五入的方法
*@param val  代表传进来要处理的数值
*@param weishu 要精确到的小数位数
*
*@return 返回计算的数值
**备注：此方法适合于进行加减但是不适合用于两个很小的数值进行相乘（比如：0.000001*0.00000001）
*如果要计算2个数值相乘请使用multiply方法
*/
function round(val,weishu) {
	var num,intPart,dotPart,dotPos,destNum;	
	var m=weishu;
	//处理传进来的是科学计数法的问题，只针对极小的数字
	if(Math.abs(val)<0.5*Math.pow(0.1,weishu)){
		return 0;
	}
	//小数点位置
	dotPos=String(val).indexOf(".");
	//整数，不处理
	if(dotPos==-1){
		destNum=val;
	//有小数
	}else{
		//整数部分(含小数点)
		intPart=Math.abs(String(val).substring(0,dotPos));
		//小数部分
		dotPart=String(val).substring(dotPos+1);		
		//小数位数小于m，不处理
		if(dotPart.length<=m){
			destNum=val;			
		//小数位数大于m
		}else {
			
			var tmp = new Array();
			for(var i=0;i<=m;i++) {
				//小数点后第i位数
				tmp[i] = String(dotPart).charAt(i);
			}
			//小数点后第m+1位数>5第m位数+1
			if(tmp[m]>=5){
				//小数点后第m位数加1
				if(tmp[m-1]<9){
					tmp[m-1]=Number(tmp[m-1]) + Number(1);
				}else{
					tmp[m-1]=0;
					for(var k=m-2;k>=0;k--){							
						if(tmp[k]==9){							
							tmp[k]=0;
							if(k==0){//小数位数的第一位
								//整数位数加1
								intPart=Number(intPart)+Number(1);
								break;
							}
					    }else{  //
							tmp[k]=Number(tmp[k])+Number(1);
							break;
						}
					}
					//如果是保留1位小数
					if(m==1){						
						intPart=Number(intPart)+Number(1);						
					}
				}
				//整数与小数合并
				dotPart = "";
				for(var i=0;i<m;i++) {
					dotPart = dotPart + String(tmp[i]);
				}
				destNum=intPart+"."+ dotPart;				
			}else{
				//整数与小数合并
				dotPart = "";
				for(var i=0;i<m;i++) {							
					dotPart = dotPart + String(tmp[i]);
				}
				destNum=intPart+"."+ dotPart;
			}
			if(val<0 && parseFloat(destNum)>0){
				destNum="-"+destNum;
			}
		}		
	}
	return parseFloat(destNum);
}


/*
*计算2个精确小数的浮点数相乘，精确度保留为y位小数
*@
*@param a 数字1
*@param b 数字2
*@param y 要精确到的小数位数
*比如multiply(0.2,0.02,3) 表示计算0.2与0.02的乘积，结果保留3为小数
*@return 返回计算的数值
*@
*
*/
function multiply(a,b,y) {
	if(a==null||a=="")a=0;
	if(b==null||b=="")b=0;
	var stra=new String(a);
	var strb=new String(b);
	//计算出来a有几位小数
	var aLength=0;
	if(stra.indexOf(".")==0){
		stra="0"+stra;
	}
	if(strb.indexOf(".")==0){
		strb="0"+strb;
	}
	
	if(stra.indexOf(".")>0){
		aLength=(stra.substring((stra.indexOf(".")+1),stra.length)).length;
	}
	//计算出来b有几位小数
	var bLength=0;
	if(strb.indexOf(".")>0){
		bLength=(strb.substring((strb.indexOf(".")+1),strb.length)).length;
	}
	//把a扩大（10*小数位数倍）
	//var va = a*Math.pow(10,aLength);
	//var vb = b*Math.pow(10,bLength);  00003
	var va = stra.replace(".","");
	var vb = strb.replace(".","");
	var vaLength=va.length;//
	for(var i=0;i<vaLength-1 && vaLength>0;i++) {//去掉所有的小数点全部转化为整数进行处理
		if(va.charAt(0)==0){//如果左边的第一个数字为0
			va=va.substring(1,va.length);//就截掉左边的数字0
		}else{
			break;
		}
	}
	//app.alert("va="+va);
	var vbLength=vb.length;//
	for(var i=0;i<vbLength-1&& vbLength>0;i++) {//去掉所有的小数点全部转化为整数进行处理
		if(vb.charAt(0)==0){//如果左边的第一个数字为0
			vb=vb.substring(1,vb.length);//就截掉左边的数字0
		}else{
			break;
		}
	}	
	//计算va *vb 
	var c = parseInt(va)*parseInt(vb) ;	
	var flag="" ;
	if(c<0) {
		flag = "-" ;
		c = -c ;
	}	
	c = c+"" ;
	// 前缀0,保证至少有(aLength+bLength+1)位数字
	var sLength=c.length;
	var zero="";
	for(var i=0;i<((aLength+bLength+1)-sLength);i++){
		zero=zero+"0";
	}
	c=zero+""+c;
	var re = "/[+-]?([0-9]+)([0-9]{"+(aLength+bLength)+"})/";
	var vv = flag+c.replace(eval(re), "$1.$2") ;
	//app.alert(vv );
	return round(vv,y) ;
}
/**
 * 金额小写转化为大写
 * 
 * @param numberValue
 * @returns {string}
 */

function numberTransformUppercase(numberValue) {
	var numberValue = new String(Math.round(numberValue * 100)); // 数字金额
	var chineseValue = ""; // 转换后的汉字金额
	var String1 = "零壹贰叁肆伍陆柒捌玖"; // 汉字数字
	var String2 = "万仟佰拾亿仟佰拾万仟佰拾元角分"; // 对应单位
	var len = numberValue.length; // numberValue 的字符串长度
	var Ch1; // 数字的汉语读法
	var Ch2; // 数字位的汉字读法
	var nZero = 0; // 用来计算连续的零值的个数
	var String3; // 指定位置的数值
	if (len > 15) {
		alert("超出计算范围");
		return "";
	}
	if (numberValue == 0) {
		chineseValue = "零元整";
		return chineseValue;
	}
	String2 = String2.substr(String2.length - len, len); // 取出对应位数的STRING2的值
	for ( var i = 0; i < len; i++) {
		String3 = parseInt(numberValue.substr(i, 1), 10); // 取出需转换的某一位的值
		if (i != (len - 3) && i != (len - 7) && i != (len - 11)
				&& i != (len - 15)) {
			if (String3 == 0) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			}
		} else { // 该位是万亿，亿，万，元位等关键位
			if (String3 != 0 && nZero != 0) {
				Ch1 = "零" + String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 != 0 && nZero == 0) {
				Ch1 = String1.substr(String3, 1);
				Ch2 = String2.substr(i, 1);
				nZero = 0;
			} else if (String3 == 0 && nZero >= 3) {
				Ch1 = "";
				Ch2 = "";
				nZero = nZero + 1;
			} else {
				Ch1 = "";
				Ch2 = String2.substr(i, 1);
				nZero = nZero + 1;
			}
			if (i == (len - 11) || i == (len - 3)) { // 如果该位是亿位或元位，则必须写上
				Ch2 = String2.substr(i, 1);
			}
		}
		chineseValue = chineseValue + Ch1 + Ch2;
	}
	if (String3 == 0) { // 最后一位（分）为0时，加上“整”
		chineseValue = chineseValue + "整";
	}
	return chineseValue;
}