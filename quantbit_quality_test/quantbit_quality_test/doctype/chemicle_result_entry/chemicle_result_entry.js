// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Chemical Result Entry Details', {
    act_value: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        let $field = $(`div[data-name="${cdn}"] [data-fieldname="act_value"]`);

        if (row.act_value < row.minimum || row.act_value > row.maximum) {
            $field.css("color", "red"); 
        } else {
            $field.css("color", "black"); 
        }
    }
});

frappe.ui.form.on('Chemicle Result Entry',{
    grade: function(frm) {

        frm.clear_table("chemical_result_entry_details");
		frm.refresh_field("chemical_result_entry_details");
       
                frm.call({
                method: "update_chemical_and_element_data",  
                doc: frm.doc  
            });
        
            frm.refresh_field("chemical_result_entry_details");
    },
});


frappe.ui.form.on('Chemicle Result Entry',{
    daily_heat_planning: function(frm) { 
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


frappe.ui.form.on('Chemicle Result Entry', {
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