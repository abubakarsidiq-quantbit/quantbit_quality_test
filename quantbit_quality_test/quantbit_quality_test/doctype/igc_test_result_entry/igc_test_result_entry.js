// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('IGC Test Entry Details', {
    final: function(frm, cdt, cdn) {
        calculate_loss(frm, cdt, cdn);
    },
    initial: function(frm, cdt, cdn) {
        calculate_loss(frm, cdt, cdn);
    }
});

function calculate_loss(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (row.final && row.initial) {
        let loss_value = row.final - row.initial;

        frappe.model.set_value(cdt, cdn, 'loss', loss_value);
    }
}

frappe.ui.form.on('IGC Test Entry Details', {
    end_on: function(frm, cdt, cdn) {
        calculate_exposure_time(frm, cdt, cdn);
    },
    start_on: function(frm, cdt, cdn) {
        calculate_exposure_time(frm, cdt, cdn);
    }
});

function calculate_exposure_time(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    if (row.end_on && row.start_on) {
        let diffMinutes = (new Date(row.end_on) - new Date(row.start_on)) / 60000; 
        let diffHours = diffMinutes / 60; 

        if (diffHours > 0) {
            frappe.model.set_value(cdt, cdn, 'expose_time_hrs', diffHours.toFixed(3)); 
        } else {
            frappe.model.set_value(cdt, cdn, 'expose_time_hrs', 0);
        }

        frm.refresh_field('test_entry_details');
    }
}


frappe.ui.form.on('IGC Test Result Entry', {
    daily_heat_planning: function(frm) { 
            frappe.call({
                method: 'get_sales_orders',  
                doc: frm.doc,
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

frappe.ui.form.on('IGC Test Result Entry', {
    sales_order_sheet: function(frm) {

        frm.clear_table("department_remark");
        frm.refresh_field("department_remark");
    
                frm.call({
                method: "update_dept_remark",  
                doc: frm.doc  
            });
        
            frm.refresh_field("department_remark");
       },

         before_save: function(frm) {
                frm.set_value("department_remark", ""); // Clear remarks before saving
            }
    });