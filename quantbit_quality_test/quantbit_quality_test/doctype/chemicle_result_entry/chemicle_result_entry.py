# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import re
import math

class ChemicleResultEntry(Document):
#fetch the data in table chemical_result_entry_details from grade master
	@frappe.whitelist()
	def update_chemical_and_element_data(self):
		if self.grade:
			result = frappe.get_all(
				"Grade Chemical Composition Details", 
				filters={"parent": self.grade},
				fields=["element_name","element_symbol", "internal_minimum", "internal_maximum"] ,
				order_by="idx ASC"
			)

			for row in result:
				self.append("chemical_result_entry_details", {
					"element_name": row.element_name,
					"element_symbol":row.element_symbol,
					"minimum": row.internal_minimum,
					"maximum": row.internal_maximum,
					"test_formula":frappe.get_value("Element",{"name":row.element_name,"special_element":1},"formula") or None
				})


		

	# @frappe.whitelist()
	# def update_remark(self):
	# 	if self.sales_order_sheet:
	# 		sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

	# 		remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

	# 		self.department_remark = "\n".join(remarks_list) if remarks_list else ""


	@frappe.whitelist()
	def get_sales_orders(self):
		sales_orders = frappe.get_all(
			"Pouring Casting Details",   
			filters={"heat_no": self.heat_no},  
			fields=["sales_order"] 
		)

		final_listed = [r["sales_order"] for r in sales_orders]
		return final_listed
	

#fetch department remark from sales order sheet

	@frappe.whitelist()
	def update_dept_remark(self):
		if self.sales_order_sheet:
			department_remarks = frappe.get_all(
				'Sales Order Department Remark', 
				filters={'parent': self.sales_order_sheet}, 
				fields=['po_serial_number', 'department', 'remark']  
			)
			for row in department_remarks:
				self.append("department_remark", {
					"po_serial_number": row.po_serial_number,
					"department": row.department,
					"remark": row.remark
				})

	@frappe.whitelist()
	def calculate_special_elements(self):
		variables = { d.element_symbol : d.act_value for d in self.get('chemical_result_entry_details' , filters = {'test_formula':['in',[None , '']]}) }
		
		for d in self.get('chemical_result_entry_details' , filters = {'test_formula':['not in',[None , '']]}):
			if d.test_formula:
				formula = d.test_formula
				# frappe.throw(str(formula))
				formula_variables = set(re.findall(r'\b[a-zA-Z]\b', formula))
				missing_vars = formula_variables - variables.keys()
				if missing_vars:
					frappe.throw(f"Missing variables in dictionary: {missing_vars}")
				result = eval(formula, {}, variables)
				d.act_value = result

	# @frappe.whitelist()
	# def calculate_special_elements(self):
	# 	"""Calculate actual values for special elements using their formulas"""

	# 	# Store actual values of elements in a dictionary
	# 	element_values = {
	# 		row.element_name.strip().lower(): row.act_value
	# 		for row in self.chemical_result_entry_details
	# 		if row.act_value is not None  # Ensure valid values
	# 	}

	# 	for row in self.chemical_result_entry_details:
	# 		# Only process if it's a special element with a valid formula
	# 		if "+" in row.element_name and row.test_formula and row.act_value is None:
	# 			try:
	# 				formula = row.test_formula.strip()  # Get formula text and remove spaces

	# 				# Replace element names with their actual values
	# 				for elem, value in element_values.items():
	# 					formula = re.sub(r'\b' + re.escape(elem) + r'\b', str(value), formula, flags=re.IGNORECASE)

	# 				# Safe evaluation environment
	# 				safe_dict = {
	# 					"math": math,  # Allow safe math functions
	# 				}

	# 				# Evaluate formula safely
	# 				row.act_value = eval(formula, {"__builtins__": {}}, safe_dict)

	# 				# Display calculated value using msgprint
	# 				frappe.msgprint(f"Calculated value for {row.element_name}: {row.act_value}")

	# 			except Exception as e:
	# 				frappe.throw(f"Error in formula calculation for {row.element_name}: {str(e)}")

	# def validate(self):
	# 	"""Hook function to validate event"""
	# 	self.calculate_special_elements()