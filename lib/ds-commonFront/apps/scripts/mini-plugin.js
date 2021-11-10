/**
 * Created by chenjunj on 2016/11/16.
 * Last modefied by:zhouqy
 */
/**
 * dataGrid校验
 * @param grid grid对象
 * @returns {Boolean}校验结果
 */
function validateGrid(grid) {
	grid.validate();
	if (grid.isValid() == false) {
		var error = grid.getCellErrors()[0];
		mini.alert(error.errorText, "提示信息", function() {
			grid.beginEditCell(error.record, error.column);
		});
		return false;
	}
	return true;
}
var validator = new Validator();
/*------------------------------------------------自定义vtype----begin-----------------------------------*/
/*自定义vtype:固定电话*/
mini.VTypes["telephoneErrorText"] = "3/4位区号-7/8位电话号码，如0123-12345678";
mini.VTypes["telephone"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isTelNum(v);
};

/*自定义vtype:14位整数，两位小数金额*/
mini.VTypes["int_14_digit_2ErrorText"] = "请输入最大14位整数2位小数";
mini.VTypes["int_14_digit_2"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isMoney(v);
};

/*自定义vtype:10位整数*/
mini.VTypes["int_10ErrorText"] = "请输入不大于9,999,999,999的数！";
mini.VTypes["int_10"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	if (parseFloat(v) <= 0) {
		return false;
	}
	var re = new RegExp("^([0-9]{1,10}$)");
	if (re.test(v)) return true;
	return false;
};

/*自定义vtype:非特殊字符,如果为null 不再校验，如果想检验不能为空，请加上 required="true" */
mini.VTypes["specialCharErrorText"] = "不能输入特殊字符";
mini.VTypes["specialChar"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNoSpecialChar(v);
};

/*自定义vtype:如果不为空再开始校验是否为float*/
mini.VTypes["numericErrorText"] = "请输入数字";
mini.VTypes["numeric"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNumeric(v);
};

/*自定义vtype:16位整数，两位小数金额*/
// mini.VTypes["double16ErrorText"] = "请输入最大16位整数2位小数";
// mini.VTypes["double16"] = function(v) {
// 	return validator.isNumeric(v);
// };

/*自定义vtype:12位整数，4位小数金额*/
mini.VTypes["double12ErrorText"] = "请输入最大12位整数4位小数";
mini.VTypes["double12"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = new RegExp(
		"^(([-]?[0-9]{1,12}[.]{1}[0-9]{1,4})$|([-]?[0-9]{1,12})$)");
	if (!v || re.test(v)) return true;
	return false;
};

/*自定义vtype:邮政编码*/
mini.VTypes["yzbmErrorText"] = "请输入0～9数字，长度为6位";
mini.VTypes["yzbm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isYzbm(v);
};

/*自定义vtype:证件号码(证件号码不同于身份证号码)*/
mini.VTypes["zjhmErrorText"] = "请输入数字、字母或-，长度不超过20位";
mini.VTypes["zjhm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isZjhm(v);
};

/*自定义vtype:身份证件号码*/
mini.VTypes["sfzjhmErrorText"] = "请输入正确的身份证号码。";
mini.VTypes["sfzjhm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isSfzhm(v);
};

/*自定义vtype:组织机构代码*/
mini.VTypes["zzjgdmErrorText"] = "组织机构代码必须为9位数字字母，字母为半角大写。";
mini.VTypes["zzjgdm"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isOrganizationCode(v);
};

/*自定义vtype: 用户名*/
mini.VTypes["usernameErrorText"] = "请输入8-16位字符(字母、数字组合)";
mini.VTypes["username"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isUserName(v);
};

/*自定义vtype: 8-32位英文和数字*/
mini.VTypes["englishAndNum32ErrorText"] = "请输入8-32位字符(字母、数字组合)区分大小写";
mini.VTypes["englishAndNum32"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = /^(?=.*?[a-zA-Z])(?=.*?[0-9])[a-zA-Z0-9]{8,32}$/;
	if (!v || re.test(v)) return true;
	return false;
};

/*自定义vtype:密码格式*/
// 密码需要8位以上，数字和英文组合，可以含有下划线
mini.VTypes["passwordErrorText"] = "密码格式不正确";
mini.VTypes["password"] = function(v) {
    return validator.isPwd(v);
};

/*自定义vtype:两次密码输入*/
mini.VTypes["rePasswordErrorText"] = "两次密码输入不一致";
mini.VTypes["rePassword"] = function(v) {
	var pwd = mini.get("password");
	if (v === pwd.value) return true;
	return false;
};

/*自定义vtype:手机号码(1+[3-8]+任意9位数)*/
mini.VTypes["mobilePhoneErrorText"] = "请输入正确的手机号码";
mini.VTypes["mobilePhone"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isPhoneNum(v);
};

/*自定义vtype:纳税人识别号*/
mini.VTypes["nsrsbhErrorText"] = "请输入正确的纳税人识别号";
mini.VTypes["nsrsbh"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isNsrsbh(v);
};

/* 自定义vtype：42位以内的字符且必须都是汉字 */
mini.VTypes["isChinese42ErrorText"] = "请输入少于42个汉字";
mini.VTypes["isChinese42"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	var re = new RegExp("^[\u4e00-\u9fa5]+$");
	if (re.test(v)) {
		if (v.length > 42) {
			return false;
		}
	}
	return true;
};

/*自定义vtype: 字母、数字或者数字字母组合*/
mini.VTypes["alphaNumericErrorText"] = "字母、数字或者数字字母组合";
mini.VTypes["alphaNumeric"] = function(v) {
	//不对空值进行校验
	if (!v || v === "") return true;
	return validator.isAlphaNumeric(v);
};

/*------------------------------------------------自定义vtype----end-----------------------------------*/

/*-----------------------------------------mini组件定制化----start---------------------------*/
/*---------mini Form 增加getDataAndText方法---------------*/
mini.copyTo(mini.Form.prototype, {
	getDataAndText: function(formatted) {
		var formData = this.getData(formatted);
		var fields = this.getFields();
		for (var i = 0; i < fields.length; i++) {
			if (fields[i].type == "combobox" || fields[i].type == "treeselect") {
				formData[fields[i].getId() + "Text"] = fields[i].getText();
			}
		}
		return formData;
	}
});
/**
 * 重写alert的宽度和高度-----------------------------------暂时屏蔽
 * @param message
 * @param title
 * @param callback
 * @returns {*}
 */
/*mini.alert = function (message, title, callback) {
return mini.MessageBox.show({
maxWidth: 550,
minWidth: 430,
minHeight: 250,
title: title || mini.MessageBox.alertTitle,
buttons: ["ok"],
message: message,
iconCls: "mini-messagebox-warning",
callback: callback
});
};*/

/** ------------------ Layout---------------------------- */
if (mini.Layout) {
	mini.Layout.prototype.mini_createRegion = mini.Layout.prototype._createRegion;
	mini.copyTo(mini.Layout.prototype, {
		_createRegion: function(options) {
			options = options || {};
			if (!options.showSplit) {
				options.showSplit = false;
			}
			if (!options.showHeader) {
				options.showHeader = false;
			}
			return this.mini_createRegion(options);
		}
	});
}
/** ------------------ DataGrid---------------------------- */
if (mini.DataGrid) {
	mini.DataGrid.prototype.mini_OnDrawCell = mini.DataGrid.prototype._OnDrawCell;
	mini.DataGrid.prototype.mini_OnCellCommitEdit = mini.DataGrid.prototype._OnCellCommitEdit;
	mini.DataGrid.prototype.mini_getData = mini.DataGrid.prototype.getData;
	mini.copyTo(mini.DataGrid.prototype, {
		width: "100%",
		height: "auto",
		showFooter: false,
		allowResize: false,
		showModified: false,
		allowUnselect: true,
		enableHotTrack: false,
		loadErrorAlert: false, //ajax请求异常时不提示url等信息
		beginEdit: function() {
			if (!this.allowCellEdit) { // 行编辑模式
				var scope = this;
				this._allowLayout = false;
				this.findRows(function(row) {
					scope.beginEditRow(row);
				});
				this._allowLayout = true;
				this.doLayout();
			}
		},
		getData: function() {
			var data = mini.DataGrid.prototype.mini_getData.apply(this, arguments);

			return mini.decode(mini.encode(data, 'yyyy-MM-dd'));
		},
		_tryFocus: function() {
			//解决点击单元格页面跳动问题
			return;
		},
		/**
		 * 扩展:单元格编辑时高亮显示可编辑单元格
		 */
		_OnDrawCell: function() {
			var e = this.mini_OnDrawCell.apply(this, arguments);
			//扩展单元格编辑时高亮显示可编辑单元格
			if (this.allowCellEdit && arguments[1].editor) {
				e.cellCls = e.cellCls + " mini-grid-editCell-hotTrack";
			}
			return e;
		},
		_OnCellCommitEdit: function(record, column, value, editor) {
			var e = this.mini_OnCellCommitEdit.apply(this, arguments);
			if (e.editor.textName) {
				mini._setMap(e.editor.textName, e.text, record);
			}
			return e;
		}
	});
}
/** ------------------ ComboBox---------------------------- */
if (mini.ComboBox) {
	mini.ComboBox.prototype.mini_set = mini.ComboBox.prototype.set;
	mini.ComboBox.prototype.mini__createPopup = mini.ComboBox.prototype._createPopup;
	mini.ComboBox.prototype.miniSetValue = mini.ComboBox.prototype.setValue;
	mini.ComboBox.prototype.mini_setEnabled = mini.ComboBox.prototype.setEnabled;
	mini.ComboBox.prototype.mini_setText = mini.ComboBox.prototype.setText;
	mini.ComboBox.prototype.mini__doEmpty = mini.ComboBox.prototype._doEmpty;
	mini.copyTo(mini.ComboBox.prototype, {
		width: "100%",
		height: 32,
		textField: "MC",
		valueField: "ID",
		showClose: true,
		allowInput: true,
		valueFromSelect: true,
		errorMode: "border",
		emptyText: "-请选择-",
		set: function(kv) {
			this._value = kv.value;
			if (!kv.textField) {
				kv.textField = "MC";
			}

			if (!kv.valueField) {
				kv.valueField = "ID";
			}

			if (!kv.nullItemText) {
				kv.nullItemText = "-请选择-";
			}

			var _enabled = kv.enabled;
			delete kv.enabled;

			this.mini_set(kv);

			//解决disable时不显示emptyText
			if (_enabled === false) {
				this.setEnabled(false);
			}

		},
		setText: function(text) {
			mini.ComboBox.prototype.mini_setText.apply(this, arguments);

			//解决disable时不显示emptyText
			if (mini.isEquals(this._emptyText, text)) {
				mini.ComboBox.superclass.setText.call(this, "");
			}
		},
		_doEmpty: function() {
			mini.ComboBox.prototype.mini__doEmpty.apply(this, arguments);

			//解决emptyText无法修改为空的问题
			if (this.emptyText == "") {
				mini._placeholder(this._textEl);
			}

		},
		setEnabled: function(value) {
			//disable时不显示emptyText
			if (!value) {
				if (typeof(this._emptyText) == "undefined") {
					this._emptyText = this.emptyText;
					this.setEmptyText("");
				}
			} else if (this._emptyText) {
				this.setEmptyText(this._emptyText);
				delete this._emptyText;
			}

			mini.ComboBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnItemLoad: function() {
			this.data = this._listbox.data;

			if (typeof this._value != "undefined") {
				this.setValue(this._value, this.defaultValueTriggerChange);
			} else {
				this.setValue(this.value);
			}
		},
		/**
		 * 修改为同步请求
		 */
		__OnItemBeforeLoad: function(e) {
			e.async = false;
		},
		_createPopup: function() {
			this.mini__createPopup();

			this._listbox.on("load", this.__OnItemLoad, this);
			this._listbox.on("beforeload", this.__OnItemBeforeLoad, this);
		},
		setValue: function(value, valid) {
			this._value = value;
			this.miniSetValue(value, valid);
		}
	});
}
if (mini.TreeSelect) {
	mini.TreeSelect.prototype.mini_setEnabled = mini.TreeSelect.prototype.setEnabled;
	mini.copyTo(mini.TreeSelect.prototype, {
		width: "100%",
		popupWidth: "100%",
		popupMinWidth: 250,
		popupMaxHeight: 300,
		height: 32,
		showClose: true,
		errorMode: "border",
		emptyText: "-请选择-",
		setEnabled: function(value) {
			mini.TreeSelect.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}
/** ------------------ mini-Password---------------------------- */
if (mini.Password) {
	mini.Password.prototype.mini_setEnabled = mini.Password.prototype.setEnabled;
	mini.Password.prototype.mini__OnBlur = mini.Password.prototype.__OnBlur;
	mini.copyTo(mini.Password.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border",
		setEnabled: function(value) {
			mini.Password.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnBlur: function(e) {
			if (this._textEl.value != this._valueEl.value) {
				this.setValue(this._textEl.value);
			}
			mini.Password.prototype.mini__OnBlur.apply(this, arguments);
		}
	});
}
/** ------------------ TextBox---------------------------- */
if (mini.TextBox) {
	mini.TextBox.prototype.mini_setEnabled = mini.TextBox.prototype.setEnabled;
	mini.TextBox.prototype.mini__OnBlur = mini.TextBox.prototype.__OnBlur;
	mini.copyTo(mini.TextBox.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border",
		setEnabled: function(value) {
			mini.TextBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		},
		__OnBlur: function(e) {
			if (this._textEl.value != this._valueEl.value) {
				this.setValue(this._textEl.value);
			}
			mini.TextBox.prototype.mini__OnBlur.apply(this, arguments);
		}
	});
}
/** ------------------ Splitter---------------------------- */
if (mini.Splitter) {
	mini.copyTo(mini.Splitter.prototype, {
		width: "100%",
		height: "100%"
	});
}
/** ------------------ PopupEdit---------------------------- */
if (mini.PopupEdit) {
	mini.copyTo(mini.PopupEdit.prototype, {
		width: "100%",
		height: 32,
		errorMode: "border"
	});
}
/** ------------------ DatePicker---------------------------- */
if (mini.DatePicker) {
	mini.DatePicker.prototype.mini_setEnabled = mini.DatePicker.prototype.setEnabled;
	mini.copyTo(mini.DatePicker.prototype, {
		width: "100%",
		height: 32,
		showClose: false,
		errorMode: "border",
		/*popupHeight: 206,
		popupMinHeight: 206,*/
		setEnabled: function(value) {
			mini.DatePicker.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}

/** ------------------ MoneyBox---------------------------- */
if (mini.MoneyBox) {
	mini.MoneyBox.prototype.mini_setEnabled = mini.MoneyBox.prototype.setEnabled;
	mini.copyTo(mini.MoneyBox.prototype, {
		width: "100%",
		height: 32,
		selectOnFocus: true,
		errorMode: "border",
		setEnabled: function(value) {
			mini.MoneyBox.prototype.mini_setEnabled.apply(this, arguments);
			if (value) {
				$(this.el).parent().addClass("enable").removeClass("disable");
			} else {
				$(this.el).parent().addClass("disable").removeClass("enable");
			}
		}
	});
}

/** ------------------ mask---------------------------- */
if (mini.mask) {
	mini__mask = mini.mask;
	mini.mask = function(options) {
		options = options || {};
		var el = mini.byId(options);
		if (mini.isElement(el)) options = {
			el: el
		};
		else if (typeof options == "string") options = {
			html: options
		};
		options.cls = "mini-mask-loading";
		mini__mask(options);
		$('.mini-mask-msg').show();//added by chenjunj, mini-mask遮罩实时显示，不再是所有代码执行完毕之后才显示
	}
}

/*重写mini.prompt*/
mini.prompt = function(message, title, callback, multi) {
	var id = "prompt$" + new Date().getTime();
	var s = message || mini.MessageBox.promptMessage;
	// 改为miniui的textbox,来保证页面风格的统一性 潘正锋 2014-06-16
	// 增加尺寸数据,解决ie6下面无法自适应的问题 pzf 2014-11
	var $html = jQuery('<div></div>');
	var obj;
	var height;

	if (multi) {
		obj = new mini.TextArea();
		obj.setWidth("230");
		obj.setHeight("70");
		height = "190";

	} else {
		obj = new mini.TextBox();
		obj.setWidth("230");
		height = "200";
		s = '<span style="line-height: 28px;">' + s + '：</span><br/>';

	}

	var uid = mini.MessageBox.show({
		title: title || mini.MessageBox.promptTitle,
		buttons: ["ok", "cancel"],
		width: 280,
		height: height,
		html: '<div id="pzf" style="overflow:auto;padding:5px;padding-left:10px;">' +
			s + '</div>',
		callback: function(action) {
			if (callback) callback(action, obj.getValue());
		}
	});
	obj.render(jQuery('#pzf')[0]);
	obj.focus();
	return uid;
};
/*-----------------------------------------mini组件定制化----end---------------------------*/

/**
 * Created with JetBrains WebStorm
 * Author：lizm
 * Date：2017/1/9
 * Time：19:31
 *
 */

// 重写miniVtype校验，校验通过的单元格添加背景色

mini_CellValidator_Prototype.setCellIsValid = function(row, column, isValid,
	errorText) {

	row = this.getNode ? this.getNode(row) : this._getRow(row);
	column = this.getColumn(column);
	if (!row || !column) return;
	var id = row[this._rowIdField] + "$" + column._id;
	var cellEl = this._getCellEl(row, column);
	var error = this._cellMapErrors[id];
	delete this._cellMapErrors[id];
	this._cellErrors.remove(error);

	if (isValid === true) {
		// lizm 2017-01-09 vtype校验通过时添加背景色
		if (!!column.editor && !mini.hasClass(cellEl, 'mini-grid-cell-validated')) {
			mini.addClass(cellEl, 'mini-grid-cell-validated');
		}
		if (!this.getAllowCellEdit()) {
			mini.removeClass(cellEl, 'mini-grid-cell-validated');
		}
		// end

		if (cellEl && error) {
			mini.removeClass(cellEl, 'mini-grid-cell-error');

		}
	} else {
		error = {
			record: row,
			column: column,
			isValid: isValid,
			errorText: errorText
		};
		this._cellMapErrors[id] = error;
		this._cellErrors.add(error);
		if (cellEl) {
			mini.addClass(cellEl, 'mini-grid-cell-error');
		}
	}
};
/**
 * 更新行
 * @param Object/Number row 行对象或行rowIndex
 * @param String/Object rowData 行对象，当rowData为String类型时表示更新列的field
 * @param String/Number/Boolean value 当rowData为String类型时，更新列对应的value
 */
mini_CellValidator_Prototype._updateRowEl = function(row) {
	var me = this;

	var s = jQuery(me._createRow(row));
	var rowEl = me._getRowEl(row);
	jQuery(rowEl).before(s);
	// lizm 2017-01-11 重新绘制表格时，同时复制样式
	jQuery(rowEl).find('td').each(function() {
		var classValue = jQuery(this).attr('class');
		var tdId = jQuery(this).index();
		jQuery(this).parent().prev().find('td').eq(tdId).attr('class', classValue);
	});
	// end
	rowEl.parentNode.removeChild(rowEl);

};
if (mini.DataGrid) {
	mini.copyTo(mini.DataGrid.prototype, mini_CellValidator_Prototype);
}
if (mini.showTips) {
	// 添加mini.showTips
	mini.copyTo(mini, {
		showAt: function(options) {
			var $ = jQuery;

			options = jQuery.extend({
				el: null,

				x: 'center',
				y: 'center',
				offset: [0, 0],
				fixed: false,
				zindex: mini.getMaxZIndex(),
				timeout: 0,
				timeoutHandler: null,
				animation: false
			}, options);
			var el = jQuery(options.el)[0],
				x = options.x,
				y = options.y,
				offsetx = options.offset[0],
				offsety = options.offset[1],
				zindex = options.zindex,
				fixed = options.fixed,
				animation = options.animation;
			if (!el) return;

			if (options.timeout) {
				setTimeout(function() {
					if (options.timeoutHandler) options.timeoutHandler();

				}, options.timeout);
			}



			var s =
				';position:absolute;display:block;left:auto;top:auto;right:auto;bottom:auto;margin:0;z-index:' +
				zindex + ';';
			mini.setStyle(el, s);
			var s = "";

			if (options && mini.isNumber(options.x) && mini.isNumber(options.y)) {
				if (options.fixed && !mini.isIE6) {
					s += ";position:fixed;";
				}
				mini.setStyle(el, s);
				mini.setXY(options.el, options.x, options.y);
				return;
			}



			if (x == 'left') {
				s += 'left:' + offsetx + 'px;';
			} else if (x == 'right') {
				s += 'right:' + offsetx + 'px;';
			} else {
				var size = mini.getSize(el);
				s += 'left:50%;margin-left:' + (-size.width * 0.5) + 'px;';
			}

			if (y == 'top') {
				s += 'top:' + offsety + 'px;';
			} else if (y == 'bottom') {
				s += 'bottom:' + offsety + 'px;';
			} else {
				var size = mini.getSize(el);
				s += 'top:50%;margin-top:' + (-size.height * 0.5) + 'px;';
			}

			if (fixed && !mini.isIE6) {
				s += 'position:fixed';
			}
			mini.setStyle(el, s);

		}
	});
}
/* 1. mini-datepicker 渲染时，为每一个日期数字添加样式 mini-calendar-item */
/* 2. 渲染时，不创建 mini-timespinner ，将display：inline-block 改成了display：none*/
if (mini.DatePicker) {
	mini.copyTo(mini.Calendar.prototype, {
        _create: function () {
            var s = '<tr style="width:100%;"><td style="width:100%;"></td></tr>';
            s += '<tr ><td><div class="mini-calendar-footer">'
                + '<span style="display:none;"><input name="time" class="mini-timespinner" style="width:80px" format="' + this.timeFormat + '"/>'
                + '<span class="mini-calendar-footerSpace"></span></span>'
                + '<span class="mini-calendar-tadayButton">' + this.todayText + '</span>'

                + '<span class="mini-calendar-footerSpace"></span>'
                + '<span class="mini-calendar-clearButton">' + this.clearText + '</span>'
                + '<span class="mini-calendar-okButton">' + this.okText + '</span>'
                + '<a href="#" class="mini-calendar-focus" style="position:absolute;left:-10px;top:-10px;width:0px;height:0px;outline:none" hideFocus></a>'
                + '</div></td></tr>';

            var html = '<table class="mini-calendar" cellpadding="0" cellspacing="0">' + s + '</table>';

            var d = document.createElement("div");
            d.innerHTML = html;
            this.el = d.firstChild;

            var trs = this.el.getElementsByTagName("tr");
            var tds = this.el.getElementsByTagName("td");

            this._innerEl = tds[0];
            this._footerEl = mini.byClass("mini-calendar-footer", this.el);

            this.timeWrapEl = this._footerEl.childNodes[0];
            this.todayButtonEl = this._footerEl.childNodes[1];
            this.footerSpaceEl = this._footerEl.childNodes[2];
            this.closeButtonEl = this._footerEl.childNodes[3];
            this.okButtonEl = this._footerEl.childNodes[4];

            this._focusEl = this._footerEl.lastChild;




            this.yesterdayButtonEl = mini.after(this.todayButtonEl, '<span class="mini-calendar-tadayButton yesterday">' + this.yesterdayText + '</span>');


            mini.parse(this._footerEl);
            this.timeSpinner = mini.getbyName('time', this.el);
            this.doUpdate();
        },
		_CreateView: function(viewDate, row, column) {
			var month = viewDate.getMonth();
			var date = this.getFirstDateOfMonth(viewDate);
			var firstDateOfWeek = new Date(date.getTime());
			var todayTime = mini.clearTime(new Date()).getTime();
			var selectedTime = this.value ? mini.clearTime(this.value).getTime() : -1;

			var multiView = this.rows > 1 || this.columns > 1;

			var s = '';
			s +=
				'<table class="mini-calendar-view" border="0" cellpadding="0" cellspacing="0">';

			if (this.showHeader) {
				s +=
					'<tr ><td colSpan="10" class="mini-calendar-header"><div class="mini-calendar-headerInner">';
				if (row == 0 && column == 0) {
					s += '<div class="mini-calendar-prev">';
					if (this.showYearButtons) s +=
						'<span class="mini-calendar-yearPrev"></span>';
					if (this.showMonthButtons) s +=
						'<span class="mini-calendar-monthPrev"></span>';
					s += '</div>';
				}
				if (row == 0 && column == this.columns - 1) {
					s += '<div class="mini-calendar-next">';
					if (this.showMonthButtons) s +=
						'<span class="mini-calendar-monthNext"></span>';
					if (this.showYearButtons) s +=
						'<span class="mini-calendar-yearNext"></span>';
					s += '</div>';
				}
				s += '<span class="mini-calendar-title">' + mini.formatDate(viewDate,
					this.format); + '</span>';
				s += '</div></td></tr>';
			}


			if (this.showDaysHeader) {
				s +=
					'<tr class="mini-calendar-daysheader"><td class="mini-calendar-space"></td>';
				if (this.showWeekNumber) {
					s += '<td sclass="mini-calendar-weeknumber"></td>';
				}

				for (var j = this.firstDayOfWeek, k = j + 7; j < k; j++) {
					var name = this.getShortWeek(j);
					s += '<td yAlign="middle">';
					s += name;
					s += '</td>';
					date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				}
				s += '<td class="mini-calendar-space"></td></tr>';
			}


			date = firstDateOfWeek;
			for (var i = 0; i <= 5; i++) {
				s +=
					'<tr class="mini-calendar-days"><td class="mini-calendar-space"></td>';
				if (this.showWeekNumber) {
					var num = mini.getWeek(date.getFullYear(), date.getMonth() + 1, date.getDate());
					if (String(num).length == 1) num = "0" + num;
					s += '<td class="mini-calendar-weeknumber" yAlign="middle">' + num +
						'</td>';
				}
				for (var j = this.firstDayOfWeek, k = j + 7; j < k; j++) {
					var weekend = this.isWeekend(date);
					var clearTime = mini.clearTime(date).getTime();
					var isToday = clearTime == todayTime;
					var isSelected = this.isSelectedDate(date);

					if (month != date.getMonth() && multiView) {
						clearTime = -1;
					}

					var e = this._OnDrawDate(date);

					s += '<td yAlign="middle" id="';
					s += this.uid + "$" + clearTime;
					s += '" class="mini-calendar-date ';
					if (weekend) {
						s += ' mini-calendar-weekend '
					}
					if (e.allowSelect == false) {
						s += ' mini-calendar-disabled '
					}

					if (month != date.getMonth() && multiView) {} else {
						if (isSelected) {
							s += ' ' + this._selectedDateCls + ' ';
						}
						if (isToday) {
							s += ' mini-calendar-today '
						}
					}
					if (month != date.getMonth()) {
						s += ' mini-calendar-othermonth ';
					}

					if (e.dateCls) s += ' ' + e.dateCls;

					s += '" style="';
					if (e.dateStyle) s += e.dateStyle;
					s += '"><span class="mini-calendar-item">';

					if (month != date.getMonth() && multiView) {} else {

						s += e.dateHtml;
					}
					s += '</span></td>';

					date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
				}
				s += '<td class="mini-calendar-space"></td></tr>';
			}
			s += '<tr class="mini-calendar-bottom" colSpan="10"><td ></td></tr>';

			s += '</table>';
			return s;
		}
	});
}

// mini-tab 切换时，调整steps插件内容显示区的高度
if (mini.Tabs) {
	mini.copyTo(mini.Tabs.prototype, {
		// 调整steps插件内容的高度 李志明 2017-02-09
		resetWizard: function() {
			var height = this.getTabBodyEl(this.activeIndex).clientHeight + 100;
			if (jQuery('#wizard').length == 1) {
				jQuery('#wizard').find('.content').height(height);
			}
		},
		// end
		activeTab: function(tab) {
			this.setActiveIndex(tab);
			this.resetWizard();
		}
	})
}
/*修改 miniForm 的validate 方法*/
if (mini.Form) {
	mini.Form.prototype.mini_validate = mini.Form.prototype.validate;
	mini.copyTo(mini.Form.prototype, {
		validate: function(all, hide) {
			var validResult = mini.Form.prototype.mini_validate.apply(this, arguments);
			if (!validResult) {
				var errorTexts = this.getErrorTexts();
				if (errorTexts.length > 0) {
					var text = '';
					for (var i = 0; i < errorTexts.length; i++) {
						text += errorTexts[i] + '<br/>';
					}
					mini.alert(text);
				}
				return false;
			} else {
				return validResult;
			}

		}


	})
}
/*mini vtype rangeChar 中的中文字符算 3 个长度*/
if (mini.VTypes) {
    mini.VTypes.rangeChar = function (v, args) {
        if (mini.isNull(v) || v === "") return true;

        var min = parseFloat(args[0]), max = parseFloat(args[1]);
        if (isNaN(min) || isNaN(max)) return true;

        //将中文标点符号也纳入到校验范围中 潘正锋 2013-10-12
        function isChinese(v) {
            var reg = /[^\x00-\xff]/ig;
            if (v.match(reg) != null) return true;
            return false;
        }

        var len = 0;
        var ss = String(v).split("");
        for (var i = 0, l = ss.length; i < l; i++) {
            if (isChinese(ss[i])) {
                len += 3; // 原来是2，改成3
            } else {
                len += 1;
            }
        }

        if (min <= len && len <= max) return true;
        return false;
    }
}
