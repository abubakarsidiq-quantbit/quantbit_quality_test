# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html

class PittingCorrosionTest(Document):
	@frappe.whitelist()
	def fetch_and_append_sales_orders(self):
		casting_details = frappe.get_all("Pouring Casting Details",filters={"heat_no":self.heat_no},fields=["parent","sales_order"])
		# frappe.throw(str(casting_details))
		if not casting_details:
			frappe.throw(f"No Sales Order found for Heat No: {self.heat_no}")

		for entry in casting_details:
			po_no = frappe.db.get_value("Sales Order", entry.sales_order, "po_no")

			self.append("pitting_corrosion_details", {
				"oa_no": entry.sales_order,
				"po_no": po_no
			})


	@frappe.whitelist()
	def update_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""