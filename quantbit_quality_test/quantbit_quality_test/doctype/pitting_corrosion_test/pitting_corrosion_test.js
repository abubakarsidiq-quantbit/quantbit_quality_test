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


frappe.ui.form.on("Pitting Corrosion Test", {
        final_weight: function(frm) {
            calculate_loss(frm);
        },
        initial_weight: function(frm) {
            calculate_loss(frm);
        }
    });
    
    function calculate_loss(frm) {
        const final_weight = frm.doc.final_weight;
        const initial_weight = frm.doc.initial_weight;
    
        if (final_weight && initial_weight) {
            let loss_value = final_weight - initial_weight;
            frm.set_value('weight_loss', loss_value);
        }
    }
    


frappe.ui.form.on("Pitting Corrosion Test", {
    length: function(frm) {
            calculate_surface_area(frm);
        },
        width: function(frm) {
            calculate_surface_area(frm);
        },
        height: function(frm) {
            calculate_surface_area(frm);
        }
    });
    
    function calculate_surface_area(frm) {
        let length = frm.doc.length;
        let width = frm.doc.width;
        let height = frm.doc.height;
    
        if (length && width && height) {
            let area = 2 * (length * width + width * height + height * length);
            frm.set_value('area', area);
        }
    }
    

// frappe.ui.form.on("Pitting Corrosion Test", {
//     weight_loss: function(frm) {
//             calculate_corrosion_rate(frm);
//         },
//         area: function(frm) {
//             calculate_corrosion_rate(frm);
//         }
//     });
    
//     function calculate_corrosion_rate(frm) {
//         let weight_loss = frm.doc.weight_loss;
//         let area = frm.doc.area;
    
//         if (weight_loss && area && area !== 0) {
//             let corrosion_rate = weight_loss / area;
//             frm.set_value('corrosion_rate', corrosion_rate);
//         } else {
//             frm.set_value('corrosion_rate', " ");
//         }
//     }
    

// frappe.ui.form.on("Pitting Corrosion Test", {
//         weight_loss: function(frm) {
//             calculate_corrosion_rate_mdd(frm);
//         },
//         area: function(frm) {
//             calculate_corrosion_rate_mdd(frm);
//         },
//         duration: function(frm) {
//             calculate_corrosion_rate_mdd(frm);
//         }
//     });
    
//     function calculate_corrosion_rate_mdd(frm) {
//         let weight_loss = frm.doc.weight_loss;
//         let area = frm.doc.area;
//         let duration = frm.doc.duration; 
    
//         if (weight_loss && area && duration && area !== 0 && duration !== 0) {
//             let duration_days = duration / 24;
//             let corrossion_rate_mdd = (weight_loss / area) * duration_days;
    
//             frm.set_value('corrossion_rate_mdd', corrossion_rate_mdd);
//         } else {
//             frm.set_value('corrossion_rate_mdd', "");
//         }
//     }

    
frappe.ui.form.on("Pitting Corrosion Test", {
        weight_loss: function(frm) {
            handle_corrosion_rate_calculation(frm);
        },
        area: function(frm) {
            handle_corrosion_rate_calculation(frm);
        },
        duration: function(frm) {
            handle_corrosion_rate_calculation(frm);
        },
        corrosion_rate_unit: function(frm) {
            handle_corrosion_rate_calculation(frm);
        }
    });
    
    function handle_corrosion_rate_calculation(frm) {
        let weight_loss = frm.doc.weight_loss;
        let area = frm.doc.area;
        let duration = frm.doc.duration;
        let unit = frm.doc.corrosion_rate_unit;
    
        if (unit === "MDD") {
            if (weight_loss && area && duration && area !== 0 && duration !== 0) {
                let duration_days = duration / 24;
                let corrosion_rate_mdd = (weight_loss / area) * duration_days;
                frm.set_value('corrossion_rate_mdd', corrosion_rate_mdd);
                frm.set_value('corrosion_rate', "");
            } else {
                frm.set_value('corrossion_rate_mdd', "");
                frm.set_value('corrosion_rate', "");
            }
        }
         
        else if (unit === "") {
            frm.set_value('corrossion_rate_mdd', "");
            frm.set_value('corrosion_rate', "");
        }
        
        else {
            if (weight_loss && area && area !== 0) {
                let corrosion_rate = weight_loss / area;
                frm.set_value('corrosion_rate', corrosion_rate);
                frm.set_value('corrossion_rate_mdd', ""); 
            } else {
                frm.set_value('corrosion_rate', "");
                frm.set_value('corrossion_rate_mdd', "");
            }
        }
    }
    
    