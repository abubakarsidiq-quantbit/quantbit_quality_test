# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MTCGeneration(Document):
	
#fetch department remark from sales order sheet

	@frappe.whitelist()
<<<<<<< HEAD
	def update_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""
=======
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
