// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt

frappe.ui.form.on("I G C T Practice E Test Certification", {
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

frappe.ui.form.on("I G C T Practice E Test Certification", {
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

frappe.ui.form.on("I G C T Practice E Test Certification", {
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