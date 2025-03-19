// Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("Foundry Treatment Microstructure Test", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on('Foundry Treatment Microstructure Test', {
    pouring_id: function(frm) {
            frappe.call({
                method: 'set_filters_for_items',
                doc: frm.doc,
                callback: function(r) {
                    if (r.message) {
                        var k = r.message;
                        frm.set_query("item_code", "treatment_details", function(doc, cdt, cdn) {
                            let d = locals[cdt][cdn];
                            return {
                                filters: [
                                    ['Item', 'name', 'in', k],
									['Item', 'company', '=', doc.company]
                                ]
                            };
                        });
                    }
                }
			});
     },
     setup: function (frm) {
        frm.set_query("pouring_id", function() {
            return {
                filters: [
                    ['Pouring', 'company', '=', frm.doc.company]
                ]
            };
        });
    }
});  

frappe.ui.form.on('Foundry Treatment Microstructure Test Details', {
    item_code: function(frm) {
        frm.call({
            method: 'cavity_standard',
            doc: frm.doc
        });
    }
});

frappe.ui.form.on("Foundry Treatment Microstructure Test", {
    sales_order_sheet: function(frm) {
<<<<<<< HEAD
        frm.call({
            method: "update_remark",
            doc: frm.doc,
            callback: function(r) {
                if (r.message) {
                    frm.set_df_property("department_remark", "value", r.message); // Set remarks dynamically
                }
            }
        });
    },
    
    before_save: function(frm) {
        frm.set_value("department_remark", ""); // Clear remarks before saving
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
