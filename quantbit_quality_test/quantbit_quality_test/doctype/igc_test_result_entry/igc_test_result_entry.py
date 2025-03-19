# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class IGCTestResultEntry(Document):

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


#fetch the data in IGC Test Entry Details from test standard
	@frappe.whitelist()
	def get_test_standard(self):
		if self.test_standard:
			result = frappe.get_doc("IGC Practice Test Details", self.test_standard)

			self.append("table_swwu", {
				"test_standard": result.test_standard,
				"test_temp": result.test_temp,
				"length": result.length,
				"width":result.width,
				"area":result.area,
				"height":result.height
			})
