// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("MTC Generation", {
//     sales_order(frm){
//         frm.call({
//             method: "get_sales_order_sheet", 
//             doc: frm.doc,
//             callback: function(resp){
//                 frm.refresh_fields()
//             }
//         })
//     },
    // grade(frm){
    //     frm.call({
    //         method: "get_grade_details", 
    //         doc: frm.doc,
    //         callback: function(resp){
    //             frm.refresh_fields()
    //         } 
    //     })
    // },


    // mtc_generation: function(frm) {
    //     frm.set_df_property('heat_no', 'read_only', frm.doc.mtc_generation !== 'Heat Wise');
    //     if (frm.doc.mtc_generation !== 'Heat Wise') {
    //         frm.set_value('heat_no', '');
    //     }
    // }
// });



// frappe.ui.form.on("MTC Generation", {
// 	grade: function(frm) {

//         frm.clear_table("mechanical_properties_details");
// 		frm.refresh_field("mechanical_properties_details");

//         frm.clear_table("chemical_composition_details");
// 		frm.refresh_field("chemical_composition_details");
       
//                 frm.call({
//                 method: "get_grade_details",  
//                 doc: frm.doc  
//             });
        
//             frm.refresh_field("mechanical_properties_details");
//             frm.refresh_field("chemical_composition_details");
//     },
// });



frappe.ui.form.on("MTC Generation", {
    heat_number: function(frm) { 
            frappe.call({
                method: 'get_sales_orders',  
                doc: frm.doc,
                // args: {
                //     heat_no: frm.doc.heat_no
                // },
                callback: function(r) {
                    if (r.message) {
                        var sales_orders = r.message;
                        frm.set_query("sales_order", function() {
                            return {
                                filters: [
                                    ['Sales Order', 'name', 'in', sales_orders]
                                ]
                            };
                        });
                    }
                }
            });
        
    }
});


frappe.ui.form.on("MTC Generation", {
	sales_order_sheet: function(frm) {
        frm.clear_table("sheet_department_remark");
		frm.refresh_field("sheet_department_remark");
        frm.clear_table("mtc_product_details_part_a");
		frm.refresh_field("mtc_product_details_part_a");
        frm.clear_table("heat_treatment_details");
        frm.refresh_field("heat_treatment_details");
       
        frm.call({
            method: "update_dept_remark",  
            doc: frm.doc  
        });
        
    },

    before_submit: function(frm) {
                frm.set_value("sheet_department_remark", ""); 
            }
});


frappe.ui.form.on("MTC Generation", {
	heat_no: function(frm) {
                frm.call({
                method: "fetch_heat_treatment_details",  
                doc: frm.doc  
            });
        }
});


frappe.ui.form.on("MTC Generation", {
	sales_order: function(frm) {
        frm.clear_table("mtc_product_details_part_a");
        frm.refresh_field("mtc_product_details_part_a");
        frm.clear_table("heat_treatment_details");
        frm.refresh_field("heat_treatment_details");
        
        frm.call({
            method: "fetch_all_properties_from_invoice",  
            doc: frm.doc  
        });

            //     frm.call({
            //     method: "update_product_details_from_heat",  
            //     doc: frm.doc  
            // });
                        
        
    },
});






frappe.ui.form.on("MTC Generation", {
    dc_no: function(frm) { 
            frappe.call({
                method: 'get_sales_orders_from_invoice',  
                doc: frm.doc,
                // args: {
                //     heat_no: frm.doc.heat_no
                // },
                callback: function(r) {
                    if (r.message) {
                        var sales_orders = r.message;
                        frm.set_query("sales_order", function() {
                            return {
                                filters: [
                                    ['Sales Order', 'name', 'in', sales_orders]
                                ]
                            };
                        });
                    }
                }
            });
        
    }
});


frappe.ui.form.on("MTC Generation", {
    sales_order: function(frm) { 
            frappe.call({
                method: 'get_sales_sheet',  
                doc: frm.doc,
                callback: function(r) {
                    if (r.message) {
                        var result = r.message;
                        frm.set_query("sales_order_sheet", function() {
                            return {
                                filters: [
                                    ['Sales Order Sheet', 'name', 'in', result]
                                ]
                            };
                        });
                    }
                }
            });
        
    }
});


frappe.ui.form.on("MTC Generation", { 
    heat_number: function(frm) {
        if (frm.doc.heat_number) {
            frappe.call({
                method: 'frappe.client.get_value',
                args: {
                    doctype: 'Daily Heat Planning',
                    filters: { name: frm.doc.heat_number },
                    fieldname: 'heat_no'
                },
                callback: function(r) {
                    if (r.message) {
                        frm.set_value('heat_no', r.message.heat_no);
                    }
                }
            });
        }
    }
});
        