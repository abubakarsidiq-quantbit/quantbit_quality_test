# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class IGCTPracticeETestCertificate(Document):
#fetch the data in po_details according to sales order
	@frappe.whitelist()
	def fetch_po_details(self):
		if self.sales_order:
			po_details = frappe.get_all(
				"Sales Order",  
				filters={"name": self.sales_order},
				fields=["po_no", "po_date"]  
			)

			if po_details:
				self.append("po_details", {
					"po_no": po_details[0]["po_no"], 
					"po_date": po_details[0]["po_date"]
				})



#fetch the data in test_certification_details according to heat no
	@frappe.whitelist()
	def fetch_sales_orders_and_pouring_no(self):
		casting_details = frappe.get_all("Pouring Casting Details",filters={"heat_no":self.heat_number},fields=["parent","sales_order"])

		if not casting_details:
			frappe.throw(f"No records found for Heat No: {self.heat_number}")

		for row in casting_details:
			self.append("test_certification_details", {
				"sales_order": row.sales_order,
				"pouring_no": row.parent  
			})

#fetch department remark from sales order sheet
	@frappe.whitelist()
	def update_remark(self):
		if self.sales_order_sheet:
<<<<<<< HEAD:quantbit_quality_test/quantbit_quality_test/doctype/i_g_c_t_practice_e_test_certification/i_g_c_t_practice_e_test_certification.py
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""
=======
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

>>>>>>> 7cfdec3 (Update quantity Form):quantbit_quality_test/quantbit_quality_test/doctype/i_g_c_t_practice_e_test_certificate/i_g_c_t_practice_e_test_certificate.py
