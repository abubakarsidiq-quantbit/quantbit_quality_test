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

frappe.ui.form.on('Chemicle Result Entry', {
    sales_order_sheet: function(frm) {
        frm.call({
            method: "update_dept_remark",
            doc: frm.doc,
            callback: function(r) {
                if (r.message) {
                    frm.set_df_property("department_remark", "value", r.message); // Set remarks dynamically
                }
            }
        });
    },
    
    // before_save: function(frm) {
    //     frm.set_value("department_remark", ""); // Clear remarks before saving
    // }
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


// frappe.ui.form.on("Chemical Result Entry Details", {
//     act_value: function(frm, cdt, cdn) {
//         let row = locals[cdt][cdn];

//         // Check if element contains operators
//         if (/[\+\-\*\/]/.test(row.element_name)) {
//             let expression = row.element_name;

//             // Replace element names with their actual values
//             frm.doc.chemical_result_entry_details.forEach(child => {
//                 expression = expression.replaceAll(child.element_name, child.act_value || 0);
//             });

//             try {
//                 let result = eval(expression); // Calculate expression
//                 frappe.model.set_value(cdt, cdn, "act_value", result);
//             } catch (e) {
//                 frappe.msgprint("Invalid formula: " + row.element_name);
//             }
//         }
//     }
// });


frappe.ui.form.on("Chemical Result Entry Details", {
    // element_name: function(frm, cdt, cdn) {
    //     calculate_actual_value(frm, cdt, cdn);
    // },
    act_value: function(frm, cdt, cdn) {
        // console.log("hiii")
        calculate_actual_value(frm, cdt, cdn);
       
    }
});

function calculate_actual_value(frm, cdt, cdn) {
    let row = locals[cdt][cdn];
    
    if (row.test_formula){
        console.log(row.test_formula)
    }
    // if (/[\+\-\*\/]/.test(row.test_formula)) {
    //     let expression = row.test_formula;
       
    //     // Replace each element name in the formula with its actual value
    //     frm.doc.chemical_result_entry_details.forEach(child => {
    //         let regex = new RegExp("\\b" + child.element_symbol + "\\b", "g");
    //         expression = expression.replace(regex, child.act_value || 0);
    //     });

    //     try {
    //         let result = eval(expression);  // Evaluate the expression
    //         frappe.model.set_value(cdt, cdn, "act_value", result);
    //     } catch (e) {
    //         frappe.msgprint("Invalid formula: " + row.element_symbol);
    //     }
    // }

    // // **Now, update all rows where this element is used**
    // frm.doc.chemical_result_entry_details.forEach(child => {
    //     if (child.element_symbol.includes(row.element_symbol)) {  // Check dependency
    //         calculate_actual_value(frm, child.doctype, child.name);  // Recalculate
    //     }
    // });

    frm.refresh_field("chemical_result_entry_details");  // Refresh the table
}


frappe.ui.form.on('Chemical Result Entry Details',{
    act_value: function(frm) {

                frm.call({
                method: "calculate_special_elements",  
                doc: frm.doc  
            });
        
            frm.refresh_field("chemical_result_entry_details");
    },
});
