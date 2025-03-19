// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Ferrite Micro FE And Micro Test', {
    test_name: function(frm) {
        toggle_fields_based_on_test(frm);
    }
});

function toggle_fields_based_on_test(frm) {
    let selected_test = frm.doc.test_name;

    let ferrite_micro_fe_fields = [
        "company", "date_xlie","heat_no", "report_no", "test_equip", "sales_order", "customer",
        "end_cust", "grade", "sales_order_sheet", "customer_name", "remarks"
    ];
    
    let micro_test_fields = [
        "equip_srl", "calib_block", "minimum", "maximum", "test_method",
        "etchant", "supply_duration", "etching_condition", "memo_details"
    ];

    let all_fields = ferrite_micro_fe_fields.concat(micro_test_fields);
    all_fields.forEach(field => frm.toggle_display(field, false));

    if (selected_test === "Ferrite Micro FE") {
        ferrite_micro_fe_fields.forEach(field => frm.toggle_display(field, true));
    } else if (selected_test === "Micro Test") {
        micro_test_fields.forEach(field => frm.toggle_display(field, true));
    } else if (selected_test === "") {
        all_fields.forEach(field => frm.toggle_display(field, true));
    }
}


frappe.ui.form.on('Ferrite Micro FE And Micro Test', {
    sales_order_sheet: function(frm) {
<<<<<<< HEAD
        frm.call({
            method: "update_remark",
            doc: frm.doc,
            callback: function(r) {
                if (r.message) {
                    frm.set_df_property("department_remark", "value", r.message); 
                }
            }
        });
    },
    
    before_save: function(frm) {
        frm.set_value("department_remark", ""); 
    }
});
=======

        frm.clear_table("department_remark");
        frm.refresh_field("department_remark");
    
                frm.call({
                method: "update_dept_remark",  
                doc: frm.doc  
            });
        
            frm.refresh_field("department_remark");
       },

         before_submit: function(frm) {
                frm.set_value("department_remark", ""); 
            }
    });
>>>>>>> 1e876a7ddcf5d7f0bd3356265be634c5c2e7edce
