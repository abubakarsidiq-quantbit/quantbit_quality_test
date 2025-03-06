// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("MTC Generation", {
        sales_order_sheet: function(frm) {
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
