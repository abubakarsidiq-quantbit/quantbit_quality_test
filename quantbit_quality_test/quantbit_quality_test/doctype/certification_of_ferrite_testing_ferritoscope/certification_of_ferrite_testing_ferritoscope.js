// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt



frappe.ui.form.on("Certification Of Ferrite Testing Ferritoscope", {
    setup: function(frm) {
        frm.set_query("heat_number", "ferritoscope_location_details", function(doc, cdt, cdn) {
            
            let child_row = locals[cdt][cdn];
            let ferritoscope_product_details = doc.ferritoscope_product_details || [];
            let heat_number = ferritoscope_product_details.map(item => item.heat_number).filter(Boolean);
            return {
                filters: {
                    name: ['in', heat_number]
                }
            };
            
        },);

    },
   
});

 


