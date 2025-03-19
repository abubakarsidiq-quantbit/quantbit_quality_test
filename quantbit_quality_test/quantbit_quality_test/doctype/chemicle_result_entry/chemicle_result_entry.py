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

<<<<<<< HEAD
	@frappe.whitelist()
	def update_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""


=======
#filter applied to sales order according to heat no
>>>>>>> 1e876a7ddcf5d7f0bd3356265be634c5c2e7edce
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

<<<<<<< HEAD
=======
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
>>>>>>> 1e876a7ddcf5d7f0bd3356265be634c5c2e7edce
