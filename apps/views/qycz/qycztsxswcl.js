var qycztsxswcl = {
    /* constant */
    api_host: 'http://10.199.137.214:8910/',
    // api_host: '/',
    api: {
        query: 'dzgzpt-wsys/api/qycz/queryQyczInfo',
    },
    enterprise_info_form: null,
    addtion_window: null,
    other_validation_rule_list: {
        enterprise_code: {
            regular: /^[0-9a-zA-Z]*$/,
            regular_error_text: '统一社会信用代码仅支持输入数字与英文'
        }
    },


    /* life cycle methods */
    init: function() {
        this.enterprise_info_form = new mini.Form('#enterprise_info_form');
    },


    /* handler methods */
    queryEnterprise: function(e) {
        if(!qycztsxswcl.validateForm()) return;
        var data = qycztsxswcl.enterprise_info_form.getData();
        $.ajax({
            type: 'POST',
            url: qycztsxswcl.api_host + qycztsxswcl.api.query,
            data: { tyshxydm: data.enterprise_name },
            success: function(res) {
                console.log(res);
            }
        })
    },

    openAddtionWindow: function(e) {
        qycztsxswcl.addtion_window = mini.open({
            url: './qycztsxswcl_add.html',
            title: '新增',
            width: 400,
            height: 300,
            allowDrag: true,
            showCloseButton: true,
            showModal: true,
            ondestroy: function(action) {
                if('ok' === action) {
                    var data = this.getIFrameEl().contentWindow.qycztsxswcl_add.getData();
                    console.log(data);
                }
            }
        })
    },


    /* common methods */
    validateForm: function() {
        var enterprise_info_form = this.enterprise_info_form;
        if(!enterprise_info_form.validate()) return false;
        // 验证额外规则
        var form_data_list = this.enterprise_info_form.getData();
        var other_validation_rule_list = this.other_validation_rule_list;
        for(var field_name in form_data_list) {
            var fieldValue = form_data_list[field_name];
            for(var field_name_2 in other_validation_rule_list) {
                var rule = other_validation_rule_list[field_name_2];
                if(field_name === field_name_2) {
                    if(!rule.regular.test(fieldValue)) {
                        mini.alert(rule.regular_error_text);
                        return false;
                    }
                    break;
                }
            }
        }
        return true;
    }
}

$(function() {
    qycztsxswcl.init();
})