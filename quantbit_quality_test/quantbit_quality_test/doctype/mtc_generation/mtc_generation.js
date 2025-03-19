// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("MTC Generation", {
<<<<<<< HEAD
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
=======
    sales_order_sheet: function(frm) {

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
