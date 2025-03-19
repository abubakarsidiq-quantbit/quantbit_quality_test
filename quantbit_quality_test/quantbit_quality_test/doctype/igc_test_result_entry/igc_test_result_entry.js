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

         before_submit: function(frm) {
                frm.set_value("department_remark", "");
            }
    });

    frappe.ui.form.on('IGC Test Entry Details', {
        loss: function(frm, cdt, cdn) {
            calculate_millimetre_per_month(frm, cdt, cdn);
        },
        area: function(frm, cdt, cdn) {
            calculate_millimetre_per_month(frm, cdt, cdn);
        },
        expose_time_hrs: function(frm, cdt, cdn) {
            calculate_millimetre_per_month(frm, cdt, cdn);
        },
        gravity_gmccdensity: function(frm, cdt, cdn) {
            calculate_millimetre_per_month(frm, cdt, cdn);
        }
    });
    
    function calculate_millimetre_per_month(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
    
        if (row.loss && row.area && row.expose_time_hrs && row.gravity_gmccdensity) {
            let result = (7305 * row.loss) / (row.area * row.expose_time_hrs * row.gravity_gmccdensity);
    
            frappe.model.set_value(cdt, cdn, 'millimetre_per_month', result);
        }
    }
    

    frappe.ui.form.on('IGC Test Entry Details', {
        conversion_factor: function(frm, cdt, cdn) {
            update_rate_of_corrosion(frm, cdt, cdn);
        },
        millimetre_per_month: function(frm, cdt, cdn) {
            update_rate_of_corrosion(frm, cdt, cdn);
        },
        gravity_gmccdensity: function(frm, cdt, cdn) {
            update_rate_of_corrosion(frm, cdt, cdn);
        }
    });
    
    function update_rate_of_corrosion(frm, cdt, cdn) {
        let row = locals[cdt][cdn];

        if (row.millimetre_per_month && row.conversion_factor) {
            let millimetre_per_month = row.millimetre_per_month;
            let conversion_factor = row.conversion_factor;
            let gravity_gmccdensity = row.gravity_gmccdensity;  
    
            let rate_of_corrosion = 0;
    
            switch (conversion_factor) {
                case 'inches per month':
                    rate_of_corrosion = millimetre_per_month * 0.04;
                    break;
                case 'inches per year':
                    rate_of_corrosion = millimetre_per_month * 0.47;
                    break;
                case 'millimetres per year':
                    rate_of_corrosion = millimetre_per_month * 12;
                    break;
                case 'mils per year':
                    rate_of_corrosion = millimetre_per_month * 472;
                    break;
                case 'milligrams per square decimetre per day':
                    rate_of_corrosion = millimetre_per_month * 1000 * gravity_gmccdensity / 3;
                    break;
                case 'grams per square metre per hour':
                    rate_of_corrosion = millimetre_per_month * 1.39 * gravity_gmccdensity;
                    break;
                case '':
                    rate_of_corrosion = 0;
                    break;
                default:
                    rate_of_corrosion = 0;  
                    break;
            }
    
            frappe.model.set_value(cdt, cdn, 'rate_of_corrosion__unit', rate_of_corrosion.toFixed(3));
        } else {
            frappe.model.set_value(cdt, cdn, 'rate_of_corrosion__unit', 0);
        }
    }
    

     frappe.ui.form.on('IGC Test Result Entry', {
        test_standard: function(frm) {
    
            frm.clear_table("table_swwu");
            frm.refresh_field("table_swwu");
           
                    frm.call({
                    method: "get_test_standard",  
                    doc: frm.doc  
                });
            
                frm.refresh_field("table_swwu");
        },
    });