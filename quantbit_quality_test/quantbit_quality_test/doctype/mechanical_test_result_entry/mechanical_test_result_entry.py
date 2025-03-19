# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class MechanicalTestResultEntry(Document):

	#fetch the data in table grade_mechanical_properties from grade master
	@frappe.whitelist()
	def update_mechanical_properties(self):
		if self.grade:
			result = frappe.get_all(
			'Grade Mechanical Properties Details',  
			filters={"parent": self.grade},  
			fields=['minimun', 'maximum', 'mechanical_property_name']  )
			# frappe.throw(f"parent: {self.grade}")
			# frappe.throw(str(result))

			for row in result:
				self.append("grade_mechanical_properties", {
					"mechanical_property_name": row.mechanical_property_name,
					"maximum": row.maximum,
					"minimun": row.minimun
				})
 
 #fetch the data in table temperature_details from grade master

	@frappe.whitelist()
	def test_temperature_update(self):
		if self.grade:
			result2 = frappe.get_all(
			'Test Temperature Details',  
			filters={"parent": self.grade},  
			fields=['test_temperature', 'minimum']  )

			self.temperature_details = []
			for row in result2:
				self.append("temperature_details", {
					"test_temperature": row.test_temperature,
					"minimum": row.minimum
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



#no of test infcremented acording to heat no
	@frappe.whitelist()
	def before_insert(self):
		last_entry = frappe.db.get_value("Mechanical Test Result Entry", {"heat_no": self.heat_no}, "no_of_tests", order_by="no_of_tests DESC")

		self.no_of_tests = (last_entry or 0) + 1

<<<<<<< HEAD
	@frappe.whitelist()
	def update_remark(self):
		if self.sales_order_sheet:
			sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

			remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

			self.department_remark = "\n".join(remarks_list) if remarks_list else ""
		
=======

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

>>>>>>> 1e876a7ddcf5d7f0bd3356265be634c5c2e7edce
 