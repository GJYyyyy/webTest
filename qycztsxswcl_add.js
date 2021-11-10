var qycztsxswcl_add = {
    /* constant */
    addtion_form: null,


    /* life cycle methods */
    init: function() {
        
        mini.parse();
        this.addtion_form = new mini.Form('#addtion_form');
    },


    /* handler methods */
    submitForm: function() {
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