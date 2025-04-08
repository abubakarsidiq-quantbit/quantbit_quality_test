// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

// frappe.ui.form.on("I G C T Practice E Test Certificate", {
// 	refresh(frm) {

// 	},
// });
frappe.ui.form.on("I G C T Practice E Test Certificate", {
	sales_order: function(frm) {

        frm.clear_table("po_details");
		frm.refresh_field("po_details");

        frm.call({
        method: "fetch_po_details",  
        doc: frm.doc  
    });

    frm.refresh_field("po_details");
}
});

frappe.ui.form.on("I G C T Practice E Test Certificate", {
	daily_heat_planning: function(frm) {

        frm.clear_table("test_certification_details");
		frm.refresh_field("test_certification_details");

        frm.call({
        method: "fetch_sales_orders_and_pouring_no",  
        doc: frm.doc  
    });

    frm.refresh_field("test_certification_details");
}
});

frappe.ui.form.on("I G C T Practice E Test Certificate", {
    sales_order_sheet: function(frm) {
        frm.call({
            method: "update_dept_remark",
            doc: frm.doc,
            callback: function(r) {
                if (r.message) {
                    frm.set_df_property("department_remark", "value", r.message);
                }
            }
        });
    },
    
    before_submit: function(frm) {
        frm.set_value("department_remark", ""); 
    }
});


frappe.ui.form.on("I G C T Practice E Test Certificate", {
    end_on: function(frm) {
        calculate_exposure_time(frm);
    },
    start_on: function(frm) {
        calculate_exposure_time(frm);
    }
});

function calculate_exposure_time(frm) {
    if (frm.doc.end_on && frm.doc.start_on) {
        let diffMinutes = (new Date(frm.doc.end_on) - new Date(frm.doc.start_on)) / 60000; 
        let diffHours = diffMinutes / 60; 

        frm.set_value("duration", diffHours > 0 ? diffHours.toFixed(3) : "0.000");
    }
}


frappe.ui.form.on("I G C T Practice E Test Certificate", {
    sensitizing_treatment_yesno: function(frm) {
        if (frm.doc.sensitizing_treatment_yesno === 'Yes') {
            frm.set_value('sensitising_information', 'Sensitised at 675°C for 1 hour');
        } else {
            frm.set_value('sensitising_information', '');
        }
    }
});
