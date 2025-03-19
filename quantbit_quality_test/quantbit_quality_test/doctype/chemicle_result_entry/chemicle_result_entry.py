# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ChemicleResultEntry(Document):
#fetch the data in table chemical_result_entry_details from grade master
	@frappe.whitelist()
	def update_chemical_and_element_data(self):
		if self.grade:
			result = frappe.get_all(
				"Element Details", 
				filters={"parent": self.grade},
				fields=["element_symbol", "internal_minimum", "internal_maximum"] 
			)

			for row in result:
				self.append("chemical_result_entry_details", {
					"element_name": row.element_symbol,
					"minimum": row.internal_minimum,
					"maximum": row.internal_maximum
				})

#filter applied to sales order according to heat no
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