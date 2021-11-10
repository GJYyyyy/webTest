function HebcaClient()
{
    this.clientCtrl = null;
}

HebcaClient.prototype = {

		_GetClientCtrl: function() {
	        if (this.clientCtrl){
	            return this.clientCtrl;
	        }else {
	            var certMgrObj;
	            try {
	                // 创建客户端插件, 兼容IE/非IE
	                certMgrObj = new HebcaP11XObject("HebcaP11X.CertMgr");//CAControlProj.CAControl
	            }catch (e){
	               /* alert(e.message);*/
	            }
	            // 设置Licence
				certMgrObj.Licence = 'amViY55oZWKcZmhlnWxhaGViY2GXGmJjYWhlYnGH1QQ5GcNqnW6z3vohVnE+nTJr';
	            //amViY55oZWKcZmhlnXxhaGViY2GXGmNjYWhcYgsECgYDTykqNzEiIilJKiEyJVchIk0gACAGCDo2IyAgRC0HIQQBNi9RIilJKgYDCwQxFgMrJDAwIJUggOgu64BMSVYIW7qucuBpjkZu
	            this.clientCtrl = certMgrObj;
	            return this.clientCtrl;
	        }
	    },
	/*************** begin: npP11X增加 *************************
        由于非IE控件的异常只是个字符串, 因此需提供函数区分并转义
    ***********************************************************/
    LastError: function(err)
    {
        return HebcaP11XLastError(this._GetClientCtrl(), err);
    },
    /*************** end: npP11X修改 ********************/

    //2015-01-19 10:42 chenbw
    //调取key进行数字签名
	Sign: function(source) {
        var c = this._GetClientCtrl().SelectSignCert();
        return c.SignText(source, 1);
    },
	login:function(pwd){
		var c=this._GetClientCtrl().SelectSignCert();
		if (c.Logined)
		{
			c.Logout();
			c.Login(pwd);
		}else
		{
			c.Login(pwd);
		}
	},
    //调取key进行数字签名
    //Sign: function(source,signalg,signflag) {
	//	var c = this._GetClientCtrl().SelectSignCert();
    //    if(signflag == 1)   
    //       return c.SignText(source, signalg);
	//	else
    //       return c.SignFile(source, signalg);
    //},
	//验证数字签名
	VerifySign:function(source,signdata,signalg,signflag){
        var c = this._GetClientCtrl().SelectSignCert();
        if(signflag == 1)   
           c.VerifySignatureText(source,signdata,signalg);
		else
           c.VerifySignatureFile(source,signdata,signalg);
	},
    //得到签名证书内容B64格式
    GetSignCert: function() {
        return this._GetClientCtrl().SelectSignCert().GetCertB64();
    },
    //获取签名证书对象
    GetSignCertObj: function() {
    	return this._GetClientCtrl().SelectSignCert();
    },
    //得到加密证书内容B64格式
    GetCryptCert: function() {
        return this._GetClientCtrl().SelectEncryptCert().GetCertB64();
    },
   // 得到签名证书和加密证书的序列号
    GetSerialNumber: function(){
	   return ('签名证书序列号：' + this._GetClientCtrl().SelectSignCert().GetSerialNumber() + '\n' + 
		   '加密证书序列号：' + this._GetClientCtrl().SelectEncryptCert().GetSerialNumber());
	},
	//得到证书单位名称
	GetCN: function(){
	  return this._GetClientCtrl().SelectSignCert().GetSubjectItem('CN');
	},
    //得到证书G项,唯一标识
    GetG: function(){
	  return this._GetClientCtrl().SelectSignCert().GetSubjectItem('G');
	},
	//得到有效期
    GetValidTime: function(){
	   return ('有效期从：' + (new Date(this._GetClientCtrl().SelectSignCert().NotBefore).toLocaleString()) +'\n' +
		   '到:' + (new Date(this._GetClientCtrl().SelectSignCert().NotAfter)).toLocaleString());
	},
   //得到主题密钥标示符
    GetSubjectUniqueID: function(){
	  return ('签名证书：' + this._GetClientCtrl().SelectSignCert().Get_SubjectUniqueID()+'\n'
	     + '加密证书：' + this._GetClientCtrl().SelectEncryptCert().Get_SubjectUniqueID());
	},
	//得到设备SN
	GetDeviceSN:function(){
		return this._GetClientCtrl().SelectDevice().SN;
	},
	//得到介质中证书个数
	GetCertCount:function(){
	  return this._GetClientCtrl().SelectDevice().GetCertCount();
	},
	//加密字符串
    Encrypt :function(source){

      return this._GetClientCtrl().SelectEncryptCert().EncryptText(source);
	},
    //解密
    Decrypt :function(crypttext){

      return this._GetClientCtrl().SelectEncryptCert().DecryptText(crypttext);
	},
	//加密B64值
    EncryptB64 :function(source){

      return this._GetClientCtrl().SelectEncryptCert().EncryptB64(source);
	},
    //解密
    DecryptB64 :function(crypttext){

      return this._GetClientCtrl().SelectEncryptCert().DecryptB64(crypttext);
	},
	//登录设备
	Login:function(pwd){
	 
	  this._GetClientCtrl().SelectDevice().Login(pwd);
	},
	//注册证书
	AddToCertStore:function(){
	  this._GetClientCtrl().SelectEncryptCert().AddToCertStore();
      this._GetClientCtrl().SelectSignCert().AddToCertStore();
	},
	//清理证书
	DeleteFromCertStore:function(){
	  this._GetClientCtrl().SelectEncryptCert().DeleteFromCertStore();
      this._GetClientCtrl().SelectSignCert().DeleteFromCertStore();
	},
	//退出设备
	Logout:function(){
	   this._GetClientCtrl().SelectDevice().Logout();
	}
};

/*******************************************************************************
---------------------------------------------------------------------------------
         File name : HebcaP11X.js
       Description : 该文件为数字证书支持多浏览器库文件, 兼容IE及非IE内核的浏览器
           Version : 1.0.0.1
           History : 初始版本
---------------------------------------------------------------------------------
 
********************************************************************************/

var GlobalHebcaP11XObj = null;

/*******************************************************************************
     Function name : HebcaP11XObject
       Description : 创建HebcaP11X控件对象
             Input : strP11xName 证书管理对象名称, 目前固定为 "HebcaP11X.CertMgr"
            Return : 返回证书管理对象实例
           Caution : 调用接口注意事项
                     1. 该接口在一个页面内只允许调用一次
                     2. 页面内需要<body>标签
---------------------------------------------------------------------------------
 
********************************************************************************/
function HebcaP11XObject(strP11xName)
{
    var certMgr = null;
        
    if (window.ActiveXObject !== undefined)
    {
        // IE 浏览器创建插件
        try{
            certMgr = new ActiveXObject("HebcaP11X.CertMgr"); 
        }
        catch(e){
            throw Error("没有安装客户端软件或IE阻止其运行.");
        }
    }
    else // 非IE浏览器加载使用embed方式加载插件
    {
        var hebcaMimeType = "application/hebca-np11x-plugin";

        if (!(navigator.mimeTypes && navigator.mimeTypes[hebcaMimeType] && navigator.mimeTypes[hebcaMimeType].enabledPlugin))
        {
            throw Error("请检查是否安装河北CA数字证书多浏览器客户端或被浏览器禁用!\r\n安装或启用后重新打开浏览器再试！");
            return null;
        }
        
        if (null != GlobalHebcaP11XObj)
        {
            return GlobalHebcaP11XObj;
        }

        var plugin_embed = document.createElement("embed"); 
        plugin_embed.setAttribute("id", "npP11Xplugin");  
        plugin_embed.setAttribute("type", hebcaMimeType);  
        plugin_embed.setAttribute("width", 0);  
        plugin_embed.setAttribute("height", 0);  
        document.body.appendChild(plugin_embed); 

        certMgr = document.getElementById("npP11Xplugin");
        
        try{
            //检测是否安装成功, 若被浏览器阻止, 会抛出异常.
            certMgr.CheckBlockedByBrowser();
        }
        catch(e)
        {
            throw Error("插件未安装或被浏览器阻止.");
            return null;
        }
        
        // 检测数字证书助手是否安装
        var bIsP11 = certMgr.CheckP11XInstalled();
        if(false == bIsP11)
        {
            throw Error("数字证书助手未安装.");
            return null;
        }

    }
    
    GlobalHebcaP11XObj = certMgr;
    return certMgr;
}

/*******************************************************************************
     Function name : HebcaP11XLastError
       Description : 捕获P11X抛出的异常信息
             Input : err        异常信息对象
            Return : 无
           Caution : 请使用该接口转换异常信息, 只能输入一个参数, 参数为Error对象
---------------------------------------------------------------------------------
 
********************************************************************************/
function HebcaP11XLastError()
{
    var err;
    if (1 == arguments.length)
    {
        err = arguments[0];
    }
    else if(2 == arguments.length)
    {
        err = arguments[1];
    }
    else
    {
        return "HebcaP11XLastError参数不正确";
    }
    
    if (window.ActiveXObject !== undefined)
    {
        return err.message; // IE浏览器直接返回异常描述
    }
    else
    {
        if (("NP11X_EXCEPTION_MSG" == err.message) ||
            ("NP11X_EXCEPTION_MSG" == err))
        {
            /* 返回插件P11X的错误信息 */
            return GlobalHebcaP11XObj.GetLastErr();
        }
        else
        {
            /* 当发生类型异常时, 通常是由于调用了不支持的属性或者方法, 返回浏览器抛出的异常信息 */
            return err.message;
        }
    }
}


var markCertObj={
		pluginId:"",	     
	    TaxID:"",    
	    pluginStatus:false,
		AlgID:1,		
		//证书信息相关
		certSN:'',
		certStartDate:'',
		certEndDate:'',
		companyName:'',
		certTor:'',
		usbKeyStatus: 1,//1代表不可用 0 代表可用
		isIE:false,
	    init:function(){	
	       this.getLoadObject();
		   
		   if(this.isIE){
			     this.pluginId=document.getElementById("ccitpluginIE");
		   }else{
			    this.pluginId=document.getElementById("ccitplugin"); 
		   }
	     
	       
	       //if( this.pluginId==undefined ||this.pluginId==null|| this.pluginId==""){
	    	//   alert("USB KEY 控件加载失败！对象为找到");
	    	//   this.pluginStatus=false;
	    	//   return;
	       //}
	       
	       //if( this.pluginId.readyState==4){ 
	    	//   this.pluginStatus=true;
	    	//   }else{
	    	//	   alert("USB KEY 控件加载失败！");
	    	//	   this.pluginStatus=false;
	    	//	   return "";
	    	//}

    //alert("this.pluginId="+this.pluginId);			
			this.pluginStatus=true;
	       
	    },
		
		getLoadObject:function(){
			
			var selfs=this;
		
			var Sys={}; 
			var ua=navigator.userAgent.toLowerCase(); 
			 
			var s;   
			(s=ua.match(/msie ([\d.]+)/))?Sys.ie=s[1]:  
			(s=ua.match(/firefox\/([\d.]+)/))?Sys.firefox=s[1]:  
			(s=ua.match(/chrome\/([\d.]+)/))?Sys.chrome=s[1]:  
			(s=ua.match(/opera.([\d.]+)/))?Sys.opera=s[1]:  
			(s=ua.match(/version\/([\d.]+).*safari/))?Sys.safari=s[1]:0;  
			
			if(Sys.ie){//Js判断为IE浏览器  			 
			   document.write('<object classid="CLSID:B123AD3E-B239-3D19-DD66-0598121ACBDE" id="ccitpluginIE"  width="0" height="0">');
			   document.write('</object>'); 
               selfs.isIE=true;			   
		      return;
			}    
			if(Sys.firefox){//Js判断为火狐(firefox)浏览器  
			 
            alert("不支持火狐浏览器");			 
		     
			return;
			}  
			if(Sys.chrome){//Js判断为谷歌chrome浏览器   
              //控件已在页面加载上
			  selfs.isIE=false;	
			 return;
			}  
			if(Sys.opera){//Js判断为opera浏览器    
		      alert("不支持opera浏览器");
               return;			
			}    
			if(Sys.safari){//Js判断为苹果safari浏览器  
			  alert("不支持苹果safari浏览器");
			 return;
			}  
			 
		},
		
	 
		
		 //得到证书信息
    GetCertInfoEX: function(){
		var selfs=this;
		var certInfo=selfs.pluginId.GetCertInfoEX(selfs.TaxID);
		
		if(certInfo.indexOf("#")==0){
			alert("得到证书信息失败");
		}else{
			var arr=certInfo.split("&&");
			if(arr.length==6){

			selfs.certSN=arr[0];
		    selfs.certStartDate=arr[1];
		    selfs.certEndDate=arr[2];
		    selfs.TaxID=arr[3];
		    selfs.companyName=arr[4];
		    selfs.certTor=arr[5];	

      //    alert("certSN:"+selfs.certSN);	
       //   alert("certStartDate:"+selfs.certStartDate);	
		//  alert("certEndDate:"+selfs.certEndDate);
       //   alert("TaxID:"+selfs.TaxID);
       //   alert("companyName:"+selfs.companyName);
        //  alert("certTor:"+selfs.certTor);		  
        		  
			}else{
				alert("获取证书信息不全");				
			}

		}		
	},
	//加密字符串
	 EncryptData:function(inData,passwd){
		 var selfs=this;		 
		 // alert(inData);
		 //alert(selfs.TaxID);
		 // alert(passwd);
		 var ret=selfs.pluginId.EncryptData(inData,"","",selfs.TaxID,passwd);
		// alert("得到加密字符串信息："+ret);
		 
		 return ret;
		 
	 },
	 //加密字符串 含有社会信用代码
	  EncryptData2:function(inData,credCode,passwd){
		 var selfs=this;		 
		
		 var ret=selfs.pluginId.EncryptData2(inData,"","",selfs.TaxID,credCode,passwd);
		 
	//	 alert("得到加密字符串信息："+ret);
		  return ret;
		 
	 },
	 //检测版本
	 GetVersion:function(){
		  var selfs=this;
		  var ret=selfs.pluginId.GetVersion(); 
		  
		  alert("得到版本检测结果："+ret);
		   return ret;
		 
	 },
	 SetPeerCert:function(encData,signData){
		 var selfs=this;  
         var ret=selfs.pluginId.SetPeerCert(encData,signData);
		 alert("设置加密证书 和 签名证书结果"+ret);  
         if(ret.indexOf("#")==0){
		     return false;
	     }else{
		     return  true;
	     }
	 },
	//检测USBKEY
	CheckUsbKey:function(){
		var selfs=this;
		var ret=selfs.pluginId.CheckUsbKey("");
		selfs.usbKeyStatus=ret;
		return ret;
	},
	//检测密码
	UsbKeyLogin:function(passwd111){
		var selfs=this;

		var ret=selfs.pluginId.UsbKeyLogin(selfs.TaxID,passwd111);

		if(ret=="OK"){
			return true;
		}else{
			return false;
		}


	},
	GetCertSubject:function(){
		var selfs=this;
		var ret=selfs.pluginId.GetCertSubject();

		return ret;
	}
};

//初始化信息
markCertObj.init();

function getCertInfo(){
	var taxId=document.getElementById("taxId").value;
	markCertObj.TaxID=taxId;
	
	if(markCertObj.pluginStatus){
		markCertObj.GetCertInfoEX();
		
	}
	
	
}

//加密字符串
function testEncryptData(){
	 
		var taxId=document.getElementById("taxId").value;	
		var passwd=document.getElementById("passwd").value;
		var stringstring=document.getElementById("stringstring").value;
		markCertObj.TaxID=taxId;
		
		var encData=document.getElementById("encData").value;	
		var signData=document.getElementById("signData").value;	
		
		if(markCertObj.pluginStatus){
			 
		//markCertObj.SetPeerCert(encData,signData);
			 
		markCertObj.EncryptData(stringstring,passwd);
	} 
}
//检测 版本
function  testGetVersion(){
	if(markCertObj.pluginStatus){
	     markCertObj.GetVersion(); 
	}
}

//检测 版本 每一秒 检测一次
function testCheckUsbKey(){
   if(markCertObj.pluginStatus){
	   
    self.setInterval("markCertObj.CheckUsbKey();",2000);
   }
	 
}

 function getOSAndBrowser(){
		var os = navigator.platform;
		var userAgent = navigator.userAgent;
		var info  = "";
		var tempArray  = "";
		var OSFlag = false;
		var BroFlag = false;
		if(os.indexOf("Win") > -1){
			if(userAgent.indexOf("Windows NT 5.0") > -1){
				OSFlag = true;
			}else if(userAgent.indexOf("Windows NT 5.1") > -1){
				OSFlag = true;
			}else if(userAgent.indexOf("Windows NT 5.2") > -1){	
				OSFlag = true;
			}else if(userAgent.indexOf("Windows NT 6.0") > -1){	
				OSFlag = true;
			}else if(userAgent.indexOf("Windows NT 6.1") > -1 || userAgent.indexOf("Windows 7") > -1){	
				OSFlag = true;
			}else if(userAgent.indexOf("Windows 8") > -1 || userAgent.indexOf("Windows NT 6.2") > -1 || userAgent.indexOf("Windows NT 6.3") > -1){	
				OSFlag = true;
			}else if(userAgent.indexOf("Windows NT 10.0") > -1){
				OSFlag = true;
			}
		}
		info += "/";
		if(/[Ff]irefox(\/\d+\.\d+)/.test(userAgent)){
			BroFlag = true;
		}else if(/MSIE \d+\.\d+/.test(userAgent)){
			tempArray = /MS(IE) (\d+\.\d+)/.exec(userAgent);
			BroFlag = true;
		}else if(/[Cc]hrome\/\d+/.test(userAgent)){
			BroFlag = true;
		}else if(!!window.ActiveXObject || "ActiveXObject" in window){
			BroFlag = true;
		}
		if(!OSFlag || !BroFlag)
		{
			return "当前配置可能会影响空间使用，推荐使用XP/WIN7/WIN8 + IE/Chrome";
		}else{
			return  true;
		}
	}



/////const //////////////////////////
//分组加密算法标识
var SGD_SM1_ECB   = 0x00000101;  // SM1算法ECB加密模式
var SGD_SM1_CBC   = 0x00000102;  // SM1算法CBC加密模式
var SGD_SSF33_ECB = 0x00000201;  // SSF33算法ECB加密模式
var SGD_SSF33_CBC = 0x00000202;  // SSF33算法CBC加密模式
var SGD_SMS4_ECB  = 0x00000401;  // SMS4算法ECB加密模式
var SGD_SMS4_CBC  = 0x00000402;  // SMS4算法CBC加密模式
var SGD_3DES_ECB  = 0x00002001;  // 3DES算法ECB加密模式
var SGD_3DES_CBC  = 0x00002002;  // 3DES算法CBC加密模式

//签名算法标识
var SGD_SM3_RSA    = 0x00010001;  // 基于SM3算法和RSA算法的签名
var SGD_SHA1_RSA   = 0x00010002;  // 基于SHA_1算法和RSA算法的签名
var SGD_SHA256_RSA = 0x00010004;  // 基于SHA_256算法和RSA算法的签名
var SGD_SM3_SM2    = 0x00020101;  // 基于SM2算法和SM3算法的签名

//密码杂凑算法标识
var SGD_SM3	   = 0x00000001;  // SM3杂凑算法
var SGD_SHA1   = 0x00000002;  // SHA_1杂凑算法
var SGD_SHA256 = 0x00000004;  // SHA_256杂凑算法

//产生密钥对时的密钥标识
var KEY_TYPE_RSA1024 = 1;  // RSA1024位
var KEY_TYPE_RSA2048 = 2;  // RSA2048位
var KEY_TYPE_SM2_256 = 3;  // SM2 256位

//获取设备信息
var DEVICE_TYPE_LABEL     = 1;    // 设备标签
var DEVICE_TYPE_FREESPACE = 2;    // 剩余空间
var DEVICE_TYPE_SERIALNUM = 3;    // 硬件设备序列号
var DEVICE_TYPE_TYPE      = 4;    //硬件类型 返回 RSA 或 SM2
var DEVICE_TYPE_KEY_TYPE  = 115;  //SM2设备返回20 RSA设备返回10
var DEVICE_TYPE_VID_PID   = 116;  //设备的VID PID

//获取的证书信息类型
var CERT_VERSION     = 1;  // 证书版本 返回V1 V2 V3
var CERT_SERIAL      = 2;  // 证书序列号
var CERT_SIGN_METHOD = 3;  // 获取证书类型 返回 rsa或sm2
var CERT_ISSUER_C    = 4;  // 证书发放者国家名 多个之间用&&&隔开
var CERT_ISSUER_O    = 5;  // 证书发放者组织名
var CERT_ISSUER_OU   = 6;  // 证书发放者部门名
var CERT_ISSUER_ST   = 7;  // 证书发放者省州名
var CERT_ISSUER_CN   = 8;  // 证书发放者通用名
var CERT_ISSUER_L    = 9;  // 证书发放者城市名
var CERT_ISSUER_E    = 10; // 证书发放者EMAIL地址
var CERT_NOT_BEFORE  = 11; // 证书有效期起始 格式YYYYMMDDHHMMSS
var CERT_NOT_AFTER   = 12; // 证书有效期截止 格式YYYYMMDDHHMMSS
var CERT_SUBJECT_C   = 13; // 用户国家名
var CERT_SUBJECT_O   = 14; // 用户组织名
var CERT_SUBJECT_OU  = 15; // 用户部门名
var CERT_SUBJECT_ST  = 16; // 用户省州名
var CERT_SUBJECT_CN  = 17; // 用户通用名
var CERT_SUBJECT_L   = 18; // 用户城市名
var CERT_SUBJECT_E   = 19; // 用户EMAIL地址
var CERT_PUBKEY      = 20; // 证书公钥
var CERT_SUBJECT_DN  = 33; // 用户DN
var CERT_ISSUER_DN   = 34; // 颁发者DN
var CERT_UNIQUEID    = 35; // 唯一实体ID
/////define object  /////////////////////////////////

try {
	if (window.ActiveXObject) {
		document.writeln("<OBJECT classid=\"CLSID:3F367B74-92D9-4C5E-AB93-234F8A91D5E6\" height=1 id=XTXAPP  style=\"HEIGHT: 1px; LEFT: 10px; TOP: 28px; WIDTH: 1px\" width=1 VIEWASTEXT>");
		document.writeln("</OBJECT>");

	} else {
		document.writeln("<embed id=XTXAPP0 type=application/x-xtx-axhost clsid={3F367B74-92D9-4C5E-AB93-234F8A91D5E6} event_OnUsbkeyChange=OnUsbKeyChange width=1 height=1 />");
		XTXAPP = document.getElementById("XTXAPP0");
	}
}
catch(e) {
	alert("ActiveXObject XTXAppCOM.dll可能没有注册成功！"+e.message);
}




/////组件接口转换为脚本接口////////////////////////

//获取用户列表 并填充到证书列表

function GetList(strListID)
{
	var objListID = eval(strListID);
	var strUserList = XTXAPP.SOF_GetUserList();

	while (1) {
		var i = strUserList.indexOf("&&&");
		if (i <= 0 ) {
			break;
		}
		var strOneUser = strUserList.substring(0, i);
		var strName = strOneUser.substring(0, strOneUser.indexOf("||"));
		var strUniqueID = strOneUser.substring(strOneUser.indexOf("||") + 2, strOneUser.length);
		var objItem = new Option(strName, strUniqueID);
		objListID.options.add(objItem);
		var len = strUserList.length;
		strUserList = strUserList.substring(i + 3,len);
	}
	var objListID = null;
	return;
}
//清空证书列表
function RemoveUserList(strListID)
{
	var objListID = eval(strListID);
	var i;
	var n = objListID.length;
	for(i = 0; i < n; i++) {
		objListID.remove(0);
	}
}
//重新填充用户列表
function ChangeUserList(strListID)
{
	RemoveUserList(strListID);
	GetList(strListID);
}


function GetUserList()
{
	return XTXAPP.SOF_GetUserList();
}


//设置加密算法
function SetEncryptMethod(encMethod)
{
	return XTXAPP.SOF_SetEncryptMethod(encMethod);
}

//设置签名算法
function SetSignMethod(signMethod)
{
	return XTXAPP.SOF_SetSignMethod(signMethod);
}



//得到用户信息
function GetCertBasicinfo(Cert, Type)
{

	return XTXAPP.SOF_GetCertInfo(Cert,Type);

}
function GetExtCertInfoByOID(Cert, oid)
{

	return XTXAPP.SOF_GetCertInfoByOid(Cert,oid);
}


//根据证书惟一标识，获取Base64编码的证书字符串。指定获取加密（交换）证书。
function GetExchCert(strContainerName)
{
	var UserCert = XTXAPP.SOF_ExportExChangeUserCert(strContainerName);

	return UserCert;
}

//签名证书
function GetSignCert(strContainerName)
{
	var UserCert = XTXAPP.SOF_ExportUserCert(strContainerName);

	return UserCert;
}


//xml签名
function SignedDataXML(signdata,ContainerName)
{
	return XTXAPP.SOF_SignDataXML(ContainerName,signdata);
}

function SignedData(sContainerName,sInData)
{
	if (sContainerName != null)
		return XTXAPP.SOF_SignData(sContainerName,sInData);
	else
		return "";
}


function VerifySignedData(cert,indata,signvalue)
{
	return XTXAPP.SOF_VerifySignedData(cert,indata,signvalue);

}


function EncryptData(sKey,inData)
{

	var ret = XTXAPP.SOF_SymEncryptData(sKey,inData);
	return ret;

}


function DecryptData(sKey,inData)
{

	var ret = XTXAPP.SOF_SymDecryptData(sKey,inData);
	return ret;

}

function GenerateRandom(RandomLen)
{

	return XTXAPP.SOF_GenRandom(RandomLen);
}


//文件签名 返回签名数据
function SignFile(sFileName,sContainerName)
{
	return XTXAPP.SOF_SignFile(sContainerName,sFileName)
}

function VerifySignFile(sFileName,sCert,SignData)
{
	return XTXAPP.SOF_VerifySignedFile(sCert,sFileName,SignData);
}

//修改密码
function ChangeUserPassword(strContainerName,oldPwd,newPwd)
{
	return XTXAPP.SOF_ChangePassWd(strContainerName,oldPwd,newPwd);
}

//xml签名
function SignedDataXML(signdata,ContainerName)
{
	return XTXAPP.SOF_SignDataXML(ContainerName,signdata);
}

//xml验证签名
function VerifySignXML(signxml)
{
	return XTXAPP.SOF_VerifySignedDataXML(signxml);
}

//p7签名
function SignByP7(CertID,InData)
{
	return XTXAPP.SOF_SignMessage(0,CertID,InData)
}

//验证p7签名
function VerifyDatabyP7(P7Data)
{
	return XTXAPP.SOF_VerifySignedMessage(P7Data,"");
}

//p7数字信封加密
function EncodeP7Enveloped(Cert,InData)
{

	return XTXAPP.SOF_EncryptDataEx(Cert,InData);  //P7数字信封加密 和SVS BCA_ALL互通
}

//p7数字信封解密
function DecodeP7Enveloped(CertID,InData)
{
	return XTXAPP.SOF_DecryptData(CertID,InData);
}

//base64编码
function Base64Encode(InData)
{
	return XTXAPP.SOF_Base64Encode(InData);
}

//base64解码
function Base64Decode(InData)
{
	return XTXAPP.SOF_Base64Decode(InData);
}

//文件对称加密
function SymEncryptFile(sKey, InFile, OutFile)
{
	return XTXAPP.SOF_SymEncryptFile(sKey, InFile, OutFile);

}

//文件对称解密
function SymDecryptFile(sKey, InFile, OutFile)
{
	return XTXAPP.SOF_SymDecryptFile(sKey, InFile, OutFile);

}

//公钥加密
function PubKeyEncrypt(Cert, InData)
{
	return XTXAPP.SOF_PubKeyEncrypt(Cert, InData);
}

//私钥解密
function PriKeyDecrypt(CertID, InData)
{
	return XTXAPP.SOF_PriKeyDecrypt(CertID, InData);
}

//文件摘要
function HashFile(hashAlg, InFile)
{
	return XTXAPP.SOF_HashFile(hashAlg, InFile);
}

function GetLastError()
{
	return XTXAPP.SOF_GetLastError();
}

function GetLastErrorMsg()
{
	var code = XTXAPP.SOF_GetLastError();
	var msg = XTXAPP.SOF_GetLastErrMsg();

	return "错误码[" + code + "] 错误描述[" + msg + "]";
}

//判断证书有效期天数
function CheckValid(userCert){
	var strNotBefore = XTXAPP.SOF_GetCertInfo(userCert,CERT_NOT_BEFORE);
	var notBeforeDate = strNotBefore.substring(0,4)+"/"+strNotBefore.substring(4,6)+"/"+strNotBefore.substring(6,8);
	var nowDate = new Date().Format("yyyy/MM/dd");
	var days = (Date.parse(notBeforeDate) - Date.parse(nowDate)) / (1000*60*60*24);
	if (days > 0) {
		alert("您的证书尚未生效!距离生效日期还剩" + days + "天!");
		return false;
	}
	var strNotAfter = XTXAPP.SOF_GetCertInfo(userCert, CERT_NOT_AFTER);
	var notAfterDate = strNotAfter.substring(0,4)+"/"+strNotAfter.substring(4,6)+"/"+strNotAfter.substring(6,8);
	var nowDate = new Date().Format("yyyy/MM/dd");
	days = (Date.parse(notAfterDate) - Date.parse(nowDate)) / (1000*60*60*24);

	if (days <= -45) {
		alert("您的证书已过期 "+ -days +" 天，超过了最后使用期限,请尽快更新!");
		return false;
	}

	if (days >= 0 && days <= 60) {
		alert("您的证书还有" + days + "天过期，请尽快更新!");
		return true;
	}

	if (days < 0) {
		alert("您的证书已过期 "+ -days +" 天，请尽快更新!");
	}

	return true;
}

function Login(strFormName,strContainerName,strPin) {
	var ret;
	var objForm = eval(strFormName);

	if (objForm == null) {
		alert("Form Error");
		return false;
	}
	if (strPin == null || strPin == "") {
		alert("请输入Key的保护口令");
		return false;
	}
	if (strPin.length < 6 || strPin.length > 16) {
		alert("密码长度应该在6-16位之间");
		return false;
	}

	//校验密码
	if(!XTXAPP.SOF_Login(strContainerName,strPin))
	{
		var retryCount = XTXAPP.SOF_GetPinRetryCount(strContainerName);
		if (retryCount > 0) {
			alert("校验证书密码失败!您还有" + retryCount + "次机会重试!");
			return false;
		} else if (retryCount == 0) {
			alert("您的证书密码已被锁死,请联系BJCA进行解锁!");
			return false;
		} else {
			alert("登录失败!");
			return false;
		}
	}
	//导出客户端证书
	var userCert = GetSignCert(strContainerName);
	if (userCert == null || userCert == "") {
		alert("导出用户证书失败!");
		return false;
	}

	//检查证书有效期
	if (!CheckValid(userCert)) {
		return false;
	}

	//验证服务端签名
	if(!VerifySignedData(strServerCert,strServerRan,strServerSignedData))
	{
		alert("验证服务器端信息失败!");
		return false;
	}

	//对随机数做签名
	var strClientSignedData = SignedData(strContainerName,strServerRan);
	if (strClientSignedData == null || strClientSignedData == "") {
		alert("客户端签名失败!");
		return false;
	}

	//Add a hidden item ...
	var strSignItem = "<input type=\"hidden\" name=\"UserSignedData\" value=\"\">";
	if (objForm.UserSignedData == null) {
		objForm.insertAdjacentHTML("BeforeEnd",strSignItem);
	}
	var strCertItem = "<input type=\"hidden\" name=\"UserCert\" value=\"\">";
	if (objForm.UserCert == null) {
		objForm.insertAdjacentHTML("BeforeEnd",strCertItem);
	}
	var strContainerItem = "<input type=\"hidden\" name=\"ContainerName\" value=\"\">";
	if (objForm.ContainerName == null) {
		objForm.insertAdjacentHTML("BeforeEnd",strContainerItem);
	}

	objForm.UserSignedData.value = strClientSignedData;
	objForm.UserCert.value =  userCert;
	objForm.ContainerName.value = strContainerName;

	return true;

}



/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/3/13
 * Time：20:09
 *
 */

;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.CAES = factory();  // CA Electronic Signature CA电子签章
    }
}(this, function () {
    // CA Electronic Signature 电子签章
    var CAES = {};

    CAES.flag = 0;

    // HBCA 是指联通CA
    CAES.signWithHBCA = function () {
        var os = getOSAndBrowser();
        if(!!os){ //浏览器 操作系统校验通过
            var nsrsbh = wssqUtil.nsrjbxx.nsrsbh;
            markCertObj.TaxID = nsrsbh;
            if (markCertObj.pluginStatus) {

                /*if(SpecialCaParame.caType != "" && SpecialCaParame.nsrsbh != ""){
                    var CheckDlmm = markCertObj.UsbKeyLogin( opts['dlmm']);
                    //decryptStr = markCertObj.UsbKeyLogin(opts['nsrsbh'], opts['dlmm']);
                    if(!CheckDlmm){
                        error.title = '提示信息';
                        error.content = "登录密码错误！";
                    }
                    else {
                        decryptStr = markCertObj.EncryptData(opts['nsrsbh'], opts['dlmm']);
                    }
                }
                else{
                    decryptStr = markCertObj.EncryptData(opts['nsrsbh'], '11111111');
                }*/

                var result = null;
                if(CAES.flag === 0){
                    result = false;
                    result = false;
                    mini.showMessageBox({
                        width: 350,
                        height: 185,
                        title: "联通CA密码",
                        buttons: ["ok", "cancel"],
                        html: '<input class="mini-password" id="ltca-pwd" width="100%"/>',
                        callback: function (action) {
                            if (action == "ok") {
                                var pwd = mini.get('ltca-pwd').getValue();
                                result = !!markCertObj.pluginId ? markCertObj.UsbKeyLogin(pwd):true; // 没有硬CA尝试使用软CA
                                // 签名成功
                                if(!!result){
                                    result =  !!markCertObj.pluginId ? markCertObj.EncryptData(nsrsbh,pwd):true; // 使用软CA
                                    if(!!result && result.length > 2 && "##" === result.substring(0,2)){
                                        CAES.flag = 0;
                                        stepNav.confirmSubmit = false;
                                        mini.alert(result.substring(2),'联通CA证书信息异常');
                                        result = false;
                                        return false;
                                    }else{
                                        CAES.flag = 1 ;
                                        result =  {caStr:result};
                                        stepNav.wizard.steps('next');
                                    }

                                }else{
                                    error.title = '提示';
                                    error.content = "密码错误";
                                }
                            }
                        }
                    });
                    mini.parse('#ltca-pwd');
                }
                return result;
            }
        }else{
            mini.alert(os,'联通CA证书信息异常');
            return false;
        }
    };

    // BJCA 是指北京CA
    CAES.signWithBJCA = function () {
        var usrlst = !!XTXAPP.SOF_GetUserList ? XTXAPP.SOF_GetUserList() : '';
        if (!!usrlst) {

            var result = null;
            if(CAES.flag === 0){
                result = false;
                mini.showMessageBox({
                    width: 350,
                    height: 185,
                    title: "北京CA密码",
                    buttons: ["ok", "cancel"],
                    html: '<input class="mini-password" id="bjca-pwd" width="100%"/>',
                    callback: function (action) {
                        if (action == "ok") {
                            var value = mini.get('bjca-pwd').getValue();
                            result = makeCert(value);
                            // 签名成功
                            if(!!result){
                                CAES.flag = 1 ;
                                stepNav.wizard.steps('next');
                            }
                        }
                    }
                });
                mini.parse('#bjca-pwd');
            }
            return result;

        }else{
            mini.alert("系统检测到您的计算机没有插入北京CA硬件，请插入北京CA后再点击提交");
            return false;
        }
        function makeCert(pwd) {
            //校验CA密码
            var certid = XTXAPP.SOF_GetUserList().split("&&&")[0].split("||")[1];
            var ret = XTXAPP.SOF_Login(certid, pwd);
            if (ret) {
                var certid = XTXAPP.SOF_GetUserList().split("&&&")[0].split("||")[1];
                //证书
                var cert = XTXAPP.SOF_ExportUserCert(certid);
                //1.2.156.112562.2.1.1.11代表税号
                //1.2.156.112562.2.1.1.17代表社会信用代码
                var oid = "1.2.156.112562.2.1.1.11";

                var plain = XTXAPP.SOF_GetCertInfoByOid(cert, oid);
                if (plain == "") {
                    mini.alert("未获取到北京CA证书信息");
                    return false;
                }
                //服务器证书
                var serviceCert = "MIIFUTCCBDmgAwIBAgIKG0AAAAAAAAGSKzANBgkqhkiG9w0BAQUFADBSMQswCQYDVQQGEwJDTjENMAsGA1UECgwEQkpDQTEYMBYGA1UECwwPUHVibGljIFRydXN0IENBMRowGAYDVQQDDBFQdWJsaWMgVHJ1c3QgQ0EtMjAeFw0xNjAyMTgxNjAwMDBaFw0yNjAyMTkxNTU5NTlaMGwxCzAJBgNVBAYTAkNOMSEwHwYDVQQKDBjmsrPljJfnnIHlm73lrrbnqI7liqHlsYAxFzAVBgNVBAsMDkRTMTIwRzIxNTEyNDEzMSEwHwYDVQQDDBjmsrPljJfnnIHlm73lrrbnqI7liqHlsYAwgZ8wDQYJKoZIhvcNAQEBBQADgY0AMIGJAoGBAKXYzLeQ5CBBp55zwkfIR/olf/zsTbAPEnku8H1VBSn1IqcWLH2ZB/z/cDIqbOGNpwh/mqeM2dJlZtghqZlOUYGDkk0hWWeTzeFV8HU56dVOBl9peCLCOIED+V8UBw3oafkLNyCwu7LXfOtO3K3mewVsoNK3BLaniiNMhXJ6q2tRAgMBAAGjggKRMIICjTAfBgNVHSMEGDAWgBT7t9RWF1iMI33V+EIB1O13m1fr6TCBrQYDVR0fBIGlMIGiMGygaqBopGYwZDELMAkGA1UEBhMCQ04xDTALBgNVBAoMBEJKQ0ExGDAWBgNVBAsMD1B1YmxpYyBUcnVzdCBDQTEaMBgGA1UEAwwRUHVibGljIFRydXN0IENBLTIxEDAOBgNVBAMTB2NhNGNybDEwMqAwoC6GLGh0dHA6Ly9sZGFwLmJqY2Eub3JnLmNuL2NybC9wdGNhL2NhNGNybDEuY3JsMAkGA1UdEwQCMAAwEQYJYIZIAYb4QgEBBAQDAgD/MBcGCGCGSAGG+EQCBAtKSjAwMDIxODA0MjAbBggqVoZIAYEwAQQPMTA0MDAwMDAwMDUzODA4MBQGBSpWCwcJBAtKSjAwMDIxODA0MjAYBgYqVgsHAQgEDjFDQEpKMDAwMjE4MDQyMCoGC2CGSAFlAwIBMAkKBBtodHRwOi8vYmpjYS5vcmcuY24vYmpjYS5jcnQwgecGA1UdIASB3zCB3DA1BgkqgRwBxTiBFQEwKDAmBggrBgEFBQcCARYaaHR0cDovL3d3dy5iamNhLm9yZy5jbi9jcHMwNQYJKoEcAcU4gRUCMCgwJgYIKwYBBQUHAgEWGmh0dHA6Ly93d3cuYmpjYS5vcmcuY24vY3BzMDUGCSqBHAHFOIEVAzAoMCYGCCsGAQUFBwIBFhpodHRwOi8vd3d3LmJqY2Eub3JnLmNuL2NwczA1BgkqgRwBxTiBFQQwKDAmBggrBgEFBQcCARYaaHR0cDovL3d3dy5iamNhLm9yZy5jbi9jcHMwCwYDVR0PBAQDAgP4MBMGCiqBHIbvMgIBAR4EBQwDNjU0MA0GCSqGSIb3DQEBBQUAA4IBAQAYO+2En3baDHmQ3L7gb01z0mKpAA7/Kt5kJ9I81ptc2/cKn0lA4pzNr+t4o9yiOSJoGAQlxutwaVXQZsE1iSufJhiP/5l2GQWnK/8W3MWPO68IvVrDlivrwq1juxtBeQ4y8x9G17nbrRWcvOCh+Lmktwgc1ODuWmM6hsoE/3Ihy0d13p1IdvMost9Xz0gQRewUdfn612tmhnwftP26bidZbkyIJsU4YXzlSZPQJ3/ILO6rdZQJS1N90kFgHIhWw8AG62DslpfjzETb7sKUsPVyfCu72NdF213HCOQ6AUEMEpkvOJ9IR73w1X414LIMrEpvARbNPQQlBZf3umMt5AkV";
                var ciphertext = XTXAPP.SOF_PubKeyEncrypt(serviceCert, plain);
                //alert("密文：" + ciphertext);
                return {
                    ciphertext:ciphertext,
                    caStr:cert
                }

            } else {
                mini.alert("密码错误") ;
                return false;
            }
        }

    };

    // HBDSCA 是指河北CA
    CAES.signWithHBDSCA = function () {
        var hbcaClient=null;
        if(!!checkHBDSCADrive()){
            var gsNumber = readGSNumber(wssqUtil.nsrjbxx.nsrsbh);
            if(!!gsNumber){
                /*if(SpecialCaParame.caType != "" && SpecialCaParame.nsrsbh != ""){
                    try{
                        this.hebca.login(opts['dlmm']);
                    }
                    catch(e){
                        mini.alert("密码错误，请重新输入！");
                        return false;
                    }
                }*/
                var certObj = signCert(gsNumber);
                if(!!certObj){
                    return certObj;
                }else {
                    return false;
                }
            }else{
                return false;
            }
        }else{
            return false;
        }

        /********************************
         * 检测是否安装河北CA证书驱动
         ********************************/
        function checkHBDSCADrive(){
            var error = {};
            try {
                hbcaClient = new HebcaClient();
                if (!!hbcaClient && !hbcaClient._GetClientCtrl()) {
                    // 判断是否安装数字证书助手
                    error.title = '河北CA数字证书信息异常';
                    error.content = '系统没有检测到河北CA数字证书助手，请检查是否已安装';
                }
            } catch (e) {
                error.title = '河北CA数字证书信息异常';
                error.content ="系统没有检测到河北CA数字证书助手，或当前浏览器阻止其运行";
            }
            if(!$.isEmptyObject(error)){
                mini.alert(error.content,error.title);
                return false;
            }else {
                return true;
            }
        }

        /************************
         * 获取国税税号
         ************************/
        function readGSNumber(nsrsbh){
            var ret = "";
            var error = {};
            try {
                var signCert = hbcaClient.GetSignCertObj();
                var device = signCert.Device;
                try {
                    ret = device.ReadDataText("hbgssh");
                } catch (e) {
                    ret = "";
                }
                if (ret == "") {
                    var subject = signCert.GetSubject();
                    var s = subject.split(",");
                    for (var i = 0; i < s.length; i++) {
                        if (s[i].replace(/\s/, "").match("^" + "OID.1.2.156.112586.1.6") != null) {
                            ret = s[i].substr(s[i].indexOf("=") + 1);
                            break;
                        }
                    }
                }
                if (ret == "") {// 未能获取到税号
                    error.title = '河北CA数字证书信息异常';
                    error.content = '获取国税税号失败';
                }else if(nsrsbh !== ret){
                    error.title = '河北CA数字证书信息异常';
                    error.content = '当前企业的纳税人识别号数字证书中的纳税人识别号不一致';
                }
            } catch (e) {
                error.title = '河北CA数字证书信息异常';
                error.content = '获取国税税号失败或税号不一致';
            }
            if(!$.isEmptyObject(error)){
                mini.alert(error.content,error.title);
                return false;
            }else {
                return ret;
            }
        }

        /************************
         * 对河北CA证书签名
         ************************/
        function signCert(gsNumber){
            try {
                return {
                    signature: hbcaClient.Sign(gsNumber),
                    cert : hbcaClient.GetSignCert()
                };
            } catch (e) {
                mini.alert('河北CA数字证书签名失败','河北CA数字证书信息异常');
                return false;
            }
        }
    };

    return CAES;

}));