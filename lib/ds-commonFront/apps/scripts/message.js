/**
 * 前台页面提示信息工具类
 *
 * @author zhaomd
 */
var MessageUtil = {};

/**
 * 前台页面提示信息 注：各功能模块请各自添加，规则："模块名称.提示信息场景":"提示信息"
 * "提示信息"内容如果需要参数，使用{index}来表示，如"{0}唯一"
 * 提示信息场景规则：以_CONFIRM结束表示确认信息，以_WARNING结束表示警告信息，以_ERROR结束表示错误信息，其他为提示信息
 *
 * @author zhaomd
 */
MessageUtil.MESSAGE = {
	/** -----------------公共提示----------------------- */
	"80483901":"请选中一条记录"	,
	"80483902":"必须选择一个缴税账号！"	,
	"80483903":"信息未作修改，不能点击下一步"	,
	"80483904":"输入数据不完整，{0}",
	"80483905":"数据格式输入不正确，请检查数据，重新填写。"	,
	"80483906":"请求提交失败，请稍后再试。"	,
	"80483907":"您未更新上传过附报资料，不能予以提交！"	,
	"80483908":"您的申请信息提交失败，请稍后提交"	,
	"80483909":"请求提交失败，错误原因：{0}"	,
	"80483910":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。"	,
	"80483911":"备案已过期，请重新备案"	,
	"80483912":"已经备案，不能重复备案"	,
	"80483913":"请输入不小于本月的日期！"	,
	"80483914":"请输入正确四位数年度！"	,
	"80483915":"您还有必填项未填，不能进入下一步！"	,
	"80483916":"数据不正确，请重新输入。"	,
	"80483917":"有效期起不能大于等于有效期止！请重新修改有效期起止。"	,
	"80483918":"有效期起不能大于等于有效期止！请重新修改有效期起止。"	,
	"80483919":"请先填写有效期起！"	,
	"80483920":"请至少录入一条数据！"	,

	/** -----------------文书提示----------------------- */
	"80483921":"账户性质为\"基本存款账户\",\"预算单位专用存款账户\",\"QFII专用存款账户\"或\"临时存款账户\"时\t银行开户登记证号和发证日期不能为空！"	,
	"80483922":"查询存款账户账号信息失败，请核实是否存在存款账户账号信息。",
	"80483923":"查询停业信息失败，请确认是否存在停业登记信息，是否已自动复业。",
	"80483924":"复业日期有误，请重新审核并输入",
	"80483925":"查询非正常户信息失败",
	"80483926":"获取税收减免性质信息失败！",
	"80483927":"查询税费种认定信息失败，请稍后再试！",
	"80483928":"获取税收优惠事项失败！",
	"80483929":"请填写减征额度！",
	"80483930":"请填写减征幅度！",
	"80483931":"请填写减征税率！",
	"80483932":"有效期起必须大于2015-07-01日",
	"80483933":"获取扣缴登记信息失败！",
	"80483934":"此纳税人存在扣缴税款资格，不予受理！",
	"80483935":"您有正在办理的任务，请等待工作人员处理完后再操作",
	"80483936":"请填写扣缴税款登记_代扣代缴、代收代缴税款信息。",
	"80483937":"请选择扣缴义务人发生日期",
	"80483938":"输入数据不完整，请输入申请重新发放的的详细信息。",
	"80483939":"遗失，损毁税务证件表输入不正确，请检查！",
	"80483940":"申请重新发放表输入不正确，请检查！",
	"80483941":"查询  税务证件遗失补办 失败",
	"80483942":"停业月份止必须大于等于停业月份起，请重新选择停业月份止。",
	"80483943":"停业期限起需大于当前月",
	"80483944":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。",
	"80483945":"确定删除选中记录？",
	"80483946":"查询跨区域涉税事项报告信息失败！",
	"80483947":"查询跨区域涉税事项报告申报失败，请稍后再试。",
	"80483948":"金额仅支持数字格式并保留两位小数",
	"80483949":"发生异常信息：{0}",
	"80483950":"该《跨区域涉税事项报告》逾期核销，请到税务机关接受处罚",
	"80483951":"跨区域涉税事项报验登记缴销数据或格式输入不正确，请检查！",
	"80483952":"货物信息发票起始号码不得大于货物信息发票终止号码！",
	"80483953":"劳务信息发票起始号码不得大于劳务信息发票终止号码！",
	"80483954":"货物信息发票终止号码与货物信息发票起始号码之差不等于发票份数，请检查重新填写。",
	"80483955":"货物信息发票终止号码与货物信息发票起始号码之差不等于发票份数，请检查重新填写。",
	"80483956":"当前用户税纳税人状态异常，请联系主管税务机关核实原因。",
	"80483957":"跨区域涉税事项报告数据或格式输入不正确，请检查！",
	"80483958":"数据未填写完整，请检查填写的数据是否有遗漏，补充填写必录项。",
	"80483959":"跨区域涉税事项报告的货物（劳务）信息输入不正确！",
	"80483960":"证明有效期止不得超过证明有效期起180日。请重新选择证明有效期起止时间。",
	"80483961":"货物信息有效期起不得大于货物有效期止！",
	"80483962":"劳务信息有效期起不得大于货物有效期止！",
	"80483963":"货物劳务累计销售额查询失败，请稍后再试。",
	"80483964":"查询应税服务累计销售额失败",
	"80483965":"货物劳务累计销售额的计算时间不得超过12个月，请修改货物劳务累计销售额的计算时间。",
	"80483966":"应税服务累计销售额的计算时间不得超过12个月，请修改应税服务累计销售额的计算时间。",
	"80483967":"选择“C.动漫企业为开发动漫产品提供的应税服务”的有效期止不得晚于2017年12月，请修改有效期止!",
	"80483968":"选择“J.通过卫星提供的语音通话服务、电子数据和信息的传输服务” 的有效期止不得晚于2015年12月,请修改有效期止!",
	"80483969":"有效期止不能小于有效期起！",
	"80483970":"有效期止必须大于等于有效期起+35个月！请修改有效期起止时间。",
	"80483971":"选择的简易征收方式，在页面上已存在，请重新录入！",
	"80483972":"手机验证码错误",
	"80483973":"未选择纳税人类别",
	"80483974":"未选择主营业务类别！",
	"80483975":"未选择一般纳税人资格生效之日",
	"80483976":"纳税人类别未选择！",
	"80483977":"该纳税人税务登记类型不是单位纳税人登记或临时税务登记，不能作为总机构或分支机构，请重新输入！",
	"80483978":"查询总机构纳税人是否为单位或临时纳税人失败或不存在此纳税人！",
	"80483979":"根据《增值税一般纳税人资格认定管理办法》第十二条规定，纳税人一经认定为一般纳税人后，不得转为小规模纳税人。请慎重操作！",
	"80483980":"您已登记为增值税一般纳税人，可按照要求在【发票领用】页面申请办理增值税专用发票手续",
	"80483981":"选择增值税普通发票、机动车销售统一发票、二手车销售统一发票时【单张发票最高开票限额】不能为空",

	/** -----------------公共错误提示----------------------- */





	"MSG.NOT_FIND" : "【配置错误】：消息代码[{0}]不存在。",

	/** -----------------公共----------------------- */
	"COMMON.404_ERROR" : "错误 404 - 文件或目录未找到。",
	"COMMON.TIMEOUT_FAILED" : "连接超时，请刷新后重试。",
	"COMMON.CONNECT_ERROR" : "连接失败，请检查网络后重试。",
	"COMMON.500_ERROR" : "服务出错，请联系管理员。",

	// 保存
	"COMMON.SAVE_SUCCESS" : "保存成功。",
	"COMMON.SAVE_FAILED" : "保存失败。原因可能是：{0}。",

	// 新增
	"COMMON.ADD_SUCCESS" : "新增成功。",
	"COMMON.ADD_FAILED" : "新增失败。原因可能是：{0}。",

	// 删除
	"COMMON.DEL_SUCCESS" : "删除成功。",
	"COMMON.DEL_CONFIRM" : "是否确定删除选中记录？",

	// 导出
	"COMMON.NODATA_IMPORT" : "没有要导出的数据。",
	// 导入
	"COMMON.IMPORT_NOFILE" : "请选择导入文件。",

	// 其他操作
	"COMMON.OPT_SUCCESS" : "{0}成功。",
	"COMMON.OPT_FAILED" : "{0}条记录操作成功。其中{1}条记录操作失败。<a href='javascript:MessageUtil.toggleDetail()'>点击展开不成功的对象</a><div id='messageDetail' style='display:none;'>{2}</div>",
	"COMMON.OPT_CONFIRM" : "是否确定{0}选中记录？",
	"COMMON.OPT_ADD_CONFIRM" : "记录新增成功,是否要继续新建？",

	// 选择操作
	"COMMON.SELECT_OP_ROW" : "请选择要{0}的数据。",
	"COMMON.SELECT_1" : "请选择一条记录。",
	"COMMON.SELECT_N" : "请至少选择1条记录。",

	// 校验
	"COMMON.UNIQUE_FAIL" : "{0}不能重复。",
	"COMMON.UNIQUE_CHECK_EXIST" : "{0}已经存在。",
	"COMMON.VALIDATE_FAILED" : "输入数据有误。",

	"COMMON.DB_CONNECT_ERROR" : "数据库连接异常，请联系管理员。",
	"COMMON.DB_ERROR"         : "数据库异常，请联系管理员。",
	"COMMON.CLASS_NEWINSTANCE_ERROR" : "类[{0}]创建错误。",
	"COMMON.CLASS_COVERT_ERROR" : "类{0}转换错误，可能是抽象类、数组、基本类型或void。",
	"MODEL.LINE_CHECK_EXISTS" : "节点间已经存在连接线。",
	"MODEL.LINE_CHECK_CIRCLE" : "连接后将会形成回路。",
	"MODEL.NODE_TO_ITSELF_VAIL"   : "节点不能指向自己。",
	"COMMON.GET_ENTRY_FAIL" : "获取JSON实体出错了。",
	"COMMON.FORMULA_VALID_FAIL" : "公式返回的结果值类型可能不符合预期，是否继续？",
	"COMMON.FORMULA_REQ_VALID_FAIL" : "公式不能为空。",
	"COMMON.FORMULA_INPUT_FAIL" : "公式格式输入错误:{0}",
	"COMMON.FILE_UPLOAD_FAIL"   : "文件上传出错。",
	"COMMON.477_ERROR":"账号信息不一致，请重新打开。",

	/**----------------------数据权限------------------------**/
	"SJQX.UPDATE_SUCC" : "数据权限修改成功。"

};

/**
 * 获取提示信息
 *
 * @author zhaomd
 * @param keyCode
 *            提示信息代码
 * @param params
 *            提示信息的参数
 */
MessageUtil._getMessage = function(keyCode, params) {
	params = params || [];
	var message = MessageUtil.MESSAGE[keyCode];

	if (!message) {
		if(/^[A-Z._]+$/.test(keyCode)){
			message = MessageUtil.MESSAGE["MSG.NOT_FIND"];
			params = [keyCode];
		}else{
			message = keyCode+"";
			params = [];
		}
	}

	for (var i = 0; i < params.length; i++) {
		message = message.replace(["{", i, "}"].join(""), function() {
			return params[i];
		});
	}

	// 支持message中引用提示信息代码
	var msgs = message.split("{");
	if (msgs.length > 1) {
		for (var i = 1; i < msgs.length; i++) {
			var code = msgs[i].split("}");
			if (code.length > 1) {
				if (code[0].indexOf(":") > 0) {
					code[0] = "{" + code[0] + "}";
				}
				message = message.replace(["{", code[0], "}"].join(""),
						function() {
							return MessageUtil.getMessage(code[0]);
						});
			}
		}
	}
	return message;
};

MessageUtil.getMessage = function(msg) {
	var type = $.type(msg);
	var message = "";

	if (type == 'object') {
		for (var k in msg) {
			message += MessageUtil._getMessage(k, msg[k]) + "<br/>";
		}
		if (message.length > 0) {
			message = message.substring(0, message.length - 5);
		}
	} else if (type == 'array') {
		$.each($.makeArray(msg), function(index) {
			for (var k in this) {
				message += MessageUtil._getMessage(k, this[k])
						+ "<br/>";
			}
			if (index == msg.length - 1 && message.length > 0) {
				message = message.substring(0, message.length - 5);
			}
		});
	} else {
		try {
			var _msg = $.parseJSON(msg);
			if (!_msg || _msg == null) {
				message = MessageUtil._getMessage(msg);
			} else {
				message = MessageUtil.getMessage(_msg);
			}
		} catch (e) {
			message = MessageUtil._getMessage(msg);
		}
	}
	return message;
}

/**
 * 提示信息
 *
 * @param String/Object/Array
 *            msg
 * @param Function
 *            callback 参数为按钮类型（ok、cancel）
 * @param String
 *            title 提示信息弹出窗口标题
 */
MessageUtil._msg = function(msg, callback, msgType, title) {
	var message = MessageUtil.getMessage(msg);

	if (msgType == "confirm") {// 确认信息（按钮：确定，取消）
		mini.MessageBox.show({
			minWidth : 250,
			maxWidth : 550,
			title : title || "确认",
			buttons : ["ok", "cancel"],
			message : message,
			iconCls : "mini-messagebox-question",
			callback : callback
		});
	} else if (msgType == "confirmCancel") {// 确认信息(按钮：是，否，取消)
		mini.MessageBox.show({
			minWidth : 250,
			maxWidth : 550,
			title : title || "确认",
			buttons : ["yes", "no", "cancel"],
			message : message,
			iconCls : "mini-messagebox-question",
			callback : callback
		});
	} else if (msgType == "warn") {// 警告信息
		mini.alert(message, title || "警告", callback);
	} else if (msgType == "error") {// 错误信息
		mini.showMessageBox({
			minWidth : 250,
			maxWidth : 550,
			title : title || "错误",
			buttons : ["ok"],
			message : message,
			iconCls : "mini-messagebox-error",
			callback : callback
		});
	} else {// 提示信息
		mini.showMessageBox({
			minWidth : 250,
			maxWidth : 550,
			title : title || "提示",
			buttons : ["ok"],
			message : message,
			iconCls : "mini-messagebox-info",
			callback : callback
		});
	}
}
MessageUtil.toggleDetail = function() {
	$("#messageDetail").toggle();
}

// 原生alert、confirm
window._nativeAlert = window.alert;
window.nativeAlert = function(msg) {
	var message = MessageUtil.getMessage(msg);
	if (message == MessageUtil.MESSAGE["MSG.NOT_FIND"].replace("{0}", msg)) {
		message = msg;
	}
	window._nativeAlert(message);
}
window._nativeConfirm = window.confirm;
window.nativeConfirm = function(msg, callback) {
	var message = MessageUtil.getMessage(msg);
	if (window._nativeConfirm(message)) {
		callback('ok');
	} else {
		callback('cancel');
	}
}

/**
 * 重写window.alert
 *
 * @example
 * alert("COMMON.SAVE_SUCCESS");
 * @example
 * alert({"SAVE_FAILED":["数据库无法连接"]});
 * @example
 * alert({"SAVE_FAILED":["数据库无法连接"], "COMMON.ADD_FAILED":["名称不能重复"]});
 * @example
 * alert([{"SAVE_FAILED":["数据库无法连接"]},{"SAVE_FAILED":["数据库无法连接"]}]);
 * @example
 * 参数支持使用消息代码，使用方式：{消息代码}
 * alert([{"SAVE_FAILED":["数据库无法连接"]},{"SAVE_FAILED":["{COMMON.TIMEOUT_FAILED}"]}]);
 *
 * @param {String/Object/Array}
 *            msg
 * @param {Function}
 *            callback 回调函数
 * @param {String}
 *            title 标题
 */
window.alert = function(msg, callback, title) {
	//屏蔽掉代码形式的异常信息  2014-01-24 linchen
	if(msg&&msg.constructor==String){
		if(msg.indexOf("Exception") > 0 || msg === "null"){
			msg = "服务器暂时无法连接，请稍后再试！";
		}
	}
	MessageUtil._msg(msg, callback, 'alert', title);
}
$(function(){
	mini.alert = function(msg, title, callback){
		alert(msg, callback, title);
		// document.body.scrollTop = 0;
	}
})

window.warning = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'warn', title);
}
window.error = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'error', title);
}
window.confirm = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'confirm', title);
}
window.confirmCancel = function(msg, callback, title) {
	MessageUtil._msg(msg, callback, 'confirmCancel', title);
}
/*重写window.close()事件*/
win_close = window.close;
var window_close = function () {
    if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") !=-1) {
        window.location.href="about:blank";
        win_close();
    } else {
        window.opener = null;
        window.open("", "_self");
        win_close();
    }
};
window.close = function () {
    window_close();
};

