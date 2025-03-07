# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html


class MTCGeneration(Document):
	@frappe.whitelist()
	def update_dept_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)
			for row in sales_order_sheet.department_remark:
				self.append("department_remark", {
					"po_serial_number": row.po_serial_number,
					"department": row.department,
					"remark": row.remark
				})

	# @frappe.whitelist()
	# def get_sales_order_sheet(self):
	# 	sales_order_sheets = frappe.get_all("Sales Order Sheet", filters={"sales_order_ref": self.sales_order}, fields=["name"])
        
	# 	# frappe.throw(str(sales_order_sheets))
	# 	return sales_order_sheets