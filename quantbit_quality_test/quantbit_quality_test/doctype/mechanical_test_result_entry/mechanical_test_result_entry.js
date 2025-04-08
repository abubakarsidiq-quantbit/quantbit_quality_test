// Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
// For license information, please see license.txt
// let sales_order = []
frappe.ui.form.on("Mechanical Test Result Entry", {
	grade: function(frm) {

        frm.clear_table("grade_mechanical_properties");
		frm.refresh_field("grade_mechanical_properties");
       
                frm.call({
                method: "update_mechanical_properties",  
                doc: frm.doc  
            });
        
            frm.refresh_field("grade_mechanical_properties");
    },
});

frappe.ui.form.on("Mechanical Test Result Entry", {
	grade: function(frm) {

        frm.clear_table("temperature_details");
		frm.refresh_field("temperature_details");
       
                frm.call({
                method: "test_temperature_update",  
                doc: frm.doc  
            });
        
            frm.refresh_field("temperature_details");
    },
});

frappe.ui.form.on("Grade Mechanical Properties", {
actual_value: function(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    let $field = $(`div[data-name="${cdn}"] [data-fieldname="actual_value"]`);

    if (row.actual_value < row.minimun || row.actual_value > row.maximum) {
        $field.css("color", "red"); 
    } else {
        $field.css("color", "black"); 
    }
}

});

frappe.ui.form.on("Mechanical Test Result Entry", {
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

frappe.ui.form.on("Mechanical Test Result Entry Temperature Details", {
    impact_1: calculate_average,
    impact_2: calculate_average,
    impact_3: calculate_average
});

function calculate_average(frm, cdt, cdn) {
    let row = locals[cdt][cdn]; 
    let sum = 0, count = 0;

    ["impact_1", "impact_2", "impact_3"].forEach(field => {
        let value = parseFloat(row[field]);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });

    row.average = count ? (sum / count) : 0;

    frm.refresh_field("temperature_details"); 
}

// frappe.ui.form.on("Mechanical Test Result Entry", {
//     sales_order_sheet: function(frm) {
//         frm.call({
//             method: "update_dept_remark",
//             doc: frm.doc,
//             callback: function(r) {
//                 if (r.message) {
//                     frm.set_df_property("department_remark", "value", r.message); // Set remarks dynamically
//                 }
//             }
//         });
//     },
    
//     before_save: function(frm) {
//         frm.set_value("department_remark", ""); // Clear remarks before saving
//     }
// });

frappe.ui.form.on("Mechanical Test Result Entry", {
    onload: function(frm) {
        let child_table = frm.fields_dict['grade_mechanical_properties'].grid;

        child_table.wrapper.find('.grid-add-row').hide();
        child_table.cannot_add_rows = true;

        child_table.wrapper.find('.grid-remove-rows').hide();

        $.each(frm.fields_dict["grade_mechanical_properties"].grid.grid_rows, function(_, row) {
            row.toggle_editable("fetched_field", false);
        });

        frm.refresh_field('grade_mechanical_properties');
    }
});

frappe.ui.form.on("Mechanical Test Result Entry", {
	grade: function(frm) {

        frm.clear_table("grade_mechanical_properties");
		frm.refresh_field("grade_mechanical_properties");
       
                frm.call({
                method: "update_mechanical_properties",  
                doc: frm.doc  
            });
        
            frm.refresh_field("grade_mechanical_properties");
    },
});

frappe.ui.form.on("Mechanical Test Result Entry", {
	grade: function(frm) {

        frm.clear_table("temperature_details");
		frm.refresh_field("temperature_details");
       
                frm.call({
                method: "test_temperature_update",  
                doc: frm.doc  
            });
        
            frm.refresh_field("temperature_details");
    },
});

frappe.ui.form.on("Grade Mechanical Properties", {
actual_value: function(frm, cdt, cdn) {
    let row = locals[cdt][cdn];

    let $field = $(`div[data-name="${cdn}"] [data-fieldname="actual_value"]`);

    if (row.actual_value < row.minimun || row.actual_value > row.maximum) {
        $field.css("color", "red"); 
    } else {
        $field.css("color", "black"); 
    }
}

});

frappe.ui.form.on("Mechanical Test Result Entry", {
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

frappe.ui.form.on("Mechanical Test Result Entry Temperature Details", {
    impact_1: calculate_average,
    impact_2: calculate_average,
    impact_3: calculate_average
});

function calculate_average(frm, cdt, cdn) {
    let row = locals[cdt][cdn]; 
    let sum = 0, count = 0;

    ["impact_1", "impact_2", "impact_3"].forEach(field => {
        let value = parseFloat(row[field]);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });

    row.average = count ? (sum / count) : 0;

    frm.refresh_field("temperature_details"); 
}


frappe.ui.form.on("Mechanical Test Result Entry Temperature Details", {
    lateral_expansion_1: calculate_average_lateral,
    lateral_expansion_2: calculate_average_lateral,
    lateral_expansion_3: calculate_average_lateral
});

function calculate_average_lateral(frm, cdt, cdn) {
    let row = locals[cdt][cdn]; 
    let sum = 0, count = 0;

    ["lateral_expansion_1", "lateral_expansion_2", "lateral_expansion_3"].forEach(field => {
        let value = parseFloat(row[field]);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });

    row.lateral_avg = count ? (sum / count) : 0;

    frm.refresh_field("temperature_details"); 
}


frappe.ui.form.on("Mechanical Test Result Entry Temperature Details", {
    shear_area_1: calculate_average_shear,
    shear_area_2: calculate_average_shear,
    shear_area_3: calculate_average_shear
});

function calculate_average_shear(frm, cdt, cdn) {
    let row = locals[cdt][cdn]; 
    let sum = 0, count = 0;

    ["shear_area_1", "shear_area_2", "shear_area_3"].forEach(field => {
        let value = parseFloat(row[field]);
        if (!isNaN(value)) {
            sum += value;
            count++;
        }
    });

    row.shear_avg = count ? (sum / count) : 0;

    frm.refresh_field("temperature_details"); 
}



frappe.ui.form.on("Mechanical Test Result Entry", {
    onload: function(frm) {
        let child_table = frm.fields_dict['grade_mechanical_properties'].grid;

        child_table.wrapper.find('.grid-add-row').hide();
        child_table.cannot_add_rows = true;

        child_table.wrapper.find('.grid-remove-rows').hide();

        $.each(frm.fields_dict["grade_mechanical_properties"].grid.grid_rows, function(_, row) {
            row.toggle_editable("fetched_field", false);
        });

        frm.refresh_field('grade_mechanical_properties');
    }
});


frappe.ui.form.on("Mechanical Test Result Entry", {
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



frappe.ui.form.on("Mechanical Test Result Entry", {
    before_save: function(frm) {
        calculate_average_hardness(frm);
    }
});

frappe.ui.form.on("Hardness Test Details", {
    hardness: function(frm, cdt, cdn) {
        calculate_average_hardness(frm);
    }
});

function calculate_average_hardness(frm) {
    let total = 0, count = 0;

    frm.doc.hardness_details.forEach(row => {
        if (!isNaN(parseFloat(row.hardness))) {
            total += parseFloat(row.hardness);
            count++;
        }
    });

    frm.set_value("hardness_average", count ? (total / count).toFixed(3) : "0.000");
}



