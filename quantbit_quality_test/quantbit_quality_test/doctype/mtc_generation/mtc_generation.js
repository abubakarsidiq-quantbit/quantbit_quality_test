// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("MTC Generation", {
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
                frm.set_value("department_remark", ""); // Clear remarks before saving
            }
    });


    // frappe.ui.form.on("MTC Generation", {
    //     sales_order: function(frm) { 
    //         frappe.call({
    //             method: 'get_sales_order_sheet',
    //             doc: frm.doc, 
    //             callback: function(r) {
    //                 if (r.message) {
    //                     var sales_order_sheet = r.message;
    //                     frm.set_query("sales_order_ref", function() {
    //                         return {
    //                             filters: [
    //                                 ['Sales Order Sheet', 'name', 'in', sales_order_sheet]  
    //                             ]
    //                         };
    //                     });
    //                 }
    //             }
    //         });
    //     }
    // });
    