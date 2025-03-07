# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html


class IGCTestResultEntry(Document):
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
	# def update_remark(self):
	# 	if self.sales_order_sheet:
	# 		sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

	# 		remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

	# 		self.department_remark = "\n".join(remarks_list) if remarks_list else ""


    
