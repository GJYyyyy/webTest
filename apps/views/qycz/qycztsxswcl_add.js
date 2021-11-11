var qycztsxswcl_add = {
    /* constant */
    addtion_form: null,
    other_validation_rule_list: {
        project_name: {
            regular: /^[0-9a-zA-Z\,\.\<\>\?\/\!\:\;\'\"\(\)\[\]\{\}，。《》？、！：；‘“（）【】\u4e00-\u9fa5]*$/,
            regular_error_text: '项目名称仅支持输入汉字、数字、英文与标点符号'
        },
        contact_person: {
            regular: /^[0-9\u4e00-\u9fa5]*$/,
            regular_error_text: '联系人仅支持输入汉字与数字'
        },
        contact_method: {
            regular: /^[0-9]*$/,
            regular_error_text: '联系方式仅支持输入数字'
        },
    },
    qyczlx_list: (function() {
        var arr = [];
        var i = 0;
        for( ; i < 10 ; i++ ) {
            arr.push({
                id: i + 1,
                text: '类型' + (i + 1),
            });
        }
        return arr;
    })(),


    /* life cycle methods */
    init: function() {
        
        mini.parse();
        this.addtion_form = new mini.Form('#addtion_form');
    },


    /* handler methods */
    submitForm: function() {
        if(!qycztsxswcl_add.validateForm()) return;
        if(window.CloseOwnerWindow){
            return window.CloseOwnerWindow('ok');
        } else {
            window.close();
        }
    },

    getData: function() {
        return this.addtion_form.getData();
    },



    /* common methods */
    validateForm: function() {
        var addtion_form = this.addtion_form;
        if(!addtion_form.validate()) return false;
        // 验证额外规则
        var form_data_list = this.addtion_form.getData();
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
    qycztsxswcl_add.init();
})