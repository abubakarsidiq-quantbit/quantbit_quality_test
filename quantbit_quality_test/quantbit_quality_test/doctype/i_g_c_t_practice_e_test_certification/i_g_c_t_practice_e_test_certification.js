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