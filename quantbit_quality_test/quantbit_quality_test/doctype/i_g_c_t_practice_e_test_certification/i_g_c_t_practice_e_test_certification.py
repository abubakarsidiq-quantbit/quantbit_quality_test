# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html


class IGCTPracticeETestCertification(Document):
	@frappe.whitelist()
	def fetch_po_details(self):
		if self.sales_order:
			sales_order = frappe.get_doc("Sales Order", self.sales_order)
			self.po_details = []
				
			self.append("po_details", {
				"po_no": sales_order.po_no,
				"po_date": sales_order.po_date
			})

	@frappe.whitelist()
	def fetch_sales_orders_and_pouring_no(self):
		casting_details = frappe.get_all("Pouring Casting Details",filters={"heat_no":self.heat_number},fields=["parent","sales_order"])

		for row in casting_details:
			self.append("test_certification_details", {
				"sales_order": row.sales_order,
				"pouring_no": row.parent  
			})

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