# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html


class ChemicleResultEntry(Document):
	# @frappe.whitelist()
	# def update_chemical_and_element_data(self):
	# 	if self.grade:
	# 		grade_master = frappe.get_doc("Grade Master", self.grade)
			
	# 		self.chemical_result_entry_details = []

	# 		for i, (chem, elem) in enumerate(zip(grade_master.chemical_details, grade_master.element_details)):
	# 			self.append("chemical_result_entry_details", {
	# 				"minimum": chem.internal_minimum,
	# 				"maximum": chem.internal_maximum,
	# 				"element_name": elem.element_symbol if i < len(grade_master.element_details) else None
	# 			})


	@frappe.whitelist()
	def update_chemical_and_element_data(self):
		if self.grade:
			grade_master = frappe.get_doc("Grade Master", self.grade)
			self.chemical_result_entry_details = []

			for row in grade_master.element_details:
				self.append("chemical_result_entry_details", {
					"element_name": row.element_symbol,
					"minimum": row.internal_minimum,
					"maximum": row.internal_maximum
				})

	@frappe.whitelist()
	def update_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""


	@frappe.whitelist()
	def get_sales_orders(self):
		query = """
		SELECT sales_order
		FROM `tabPouring Casting Details`
		WHERE heat_no = %s
	"""
		
		result = frappe.db.sql(query, (self.heat_no,), as_list=True)
		final_listed = [r[0] for r in result]
		return final_listed

