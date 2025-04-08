# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
import re
from frappe.model.document import Document


class Element(Document):
    def before_save(self):
        if self.special_element and self.formula:  
            self.validate_formula()

    def validate_formula(self):
        formula = self.formula

        element_symbols = {
            row.element_symbol for row in frappe.get_all(
                "Element", 
                filters={"special_element": 0},  
                fields=["element_symbol"]
            )
        }

        formula_elements = set(re.findall(r"[a-zA-Z_][a-zA-Z0-9_]*", formula))

        missing_elements = formula_elements - element_symbols
        if missing_elements:
            frappe.throw(f"Missing elements in Element Master: {', '.join(missing_elements)}")

        try:
            eval(formula, {"__builtins__": None}, {elem: 1 for elem in formula_elements})
        except:
            frappe.throw("Invalid formula syntax!")