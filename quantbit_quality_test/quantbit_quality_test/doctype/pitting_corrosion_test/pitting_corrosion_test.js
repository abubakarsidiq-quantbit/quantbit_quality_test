// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on('Pitting Corrosion Test', {
    end_time: function(frm) {
        calculate_exposure_time(frm);
    },
    start_time: function(frm) {
        calculate_exposure_time(frm);
    }
});

function calculate_exposure_time(frm) {
    if (frm.doc.end_time && frm.doc.start_time) {
        let diffMinutes = (new Date(frm.doc.end_time) - new Date(frm.doc.start_time)) / 60000; // Convert ms to minutes
        let diffHours = diffMinutes / 60; 

        if (diffHours > 0) {
            frm.set_value('duration', diffHours.toFixed(3));
        } else {
            frm.set_value('duration', 0);
        }

        frm.refresh_field('duration');
    }
}

frappe.ui.form.on("Pitting Corrosion Test", {
	daily_heat_planning: function(frm) {

        frm.clear_table("pitting_corrosion_details");
		frm.refresh_field("pitting_corrosion_details");

        frm.call({
        method: "fetch_and_append_sales_orders",  
        doc: frm.doc  
    });

    frm.refresh_field("pitting_corrosion_details");
}

});

frappe.ui.form.on("Pitting Corrosion Test", {
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
