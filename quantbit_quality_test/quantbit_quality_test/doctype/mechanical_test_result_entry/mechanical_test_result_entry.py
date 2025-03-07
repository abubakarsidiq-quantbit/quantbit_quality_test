# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
from frappe.utils import strip_html


class MechanicalTestResultEntry(Document):
	@frappe.whitelist()
	def update_mechanical_properties(self):
		if self.grade:
			grade_master = frappe.get_doc("Grade Master", self.grade)
			self.grade_mechanical_properties = []
			for row in grade_master.mech_details:
				self.append("grade_mechanical_properties", {
					"mechanical_property_name": row.mechanical_property_name,
					"maximum": row.maximum,
					"minimun": row.minimun
				})

	@frappe.whitelist()
	def test_temperature_update(self):
		if self.grade:
			grade_master = frappe.get_doc("Grade Master", self.grade)
			self.temperature_details = []
			for row in grade_master.test_temperature_detial:
				self.append("temperature_details", {
					"test_temperature": row.test_temperature,
					"minimum": row.minimum
				})


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
	
	
	# 	if heat_no:
	# 		sales_orders = frappe.get_all(
	# 			"Pouring Casting Details", 
	# 			filters={"heat_no": heat_no},
	# 			fields=["sales_order"]
	# 		) 

	# 		return [so["sales_order"] for so in sales_orders] if sales_orders else []
		

	# @frappe.whitelist()
	# def set_filters_for_items(self):
	# 	query = """
	# 		SELECT DISTINCT casting_item_code
	# 		FROM `tabPouring Casting Details`
	# 		WHERE parent = %s
	# 		AND `check` = 1
	# 	"""
	# 	result = frappe.db.sql(query, (self.pouring_id,), as_list=True)
	# 	final_listed = [r[0] for r in result]
	# 	return final_listed


	@frappe.whitelist()
	def before_insert(self):
		last_entry = frappe.db.get_value("Mechanical Test Result Entry", {"heat_no": self.heat_no}, "no_of_tests", order_by="no_of_tests DESC")

		self.no_of_tests = (last_entry or 0) + 1

	# @frappe.whitelist()
	# def update_remark(self):
	# 	if self.sales_order_sheet:
	# 		sales_order_sheet = frappe.get_doc("Sales Order Sheet", self.sales_order_sheet)

	# 		remarks_list = [strip_html(row.remark) for row in sales_order_sheet.department_remark]

	# 		self.department_remark = "\n".join(remarks_list) if remarks_list else ""

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
		
 
	# def get_sales_orders(self)
	# 	if(self.heat_no):
	# 		frappe.get_all("Daily Heat Planning Product Details",{"parent":self.heat_no},"sales_order_no",as_list)


	# @frappe.whitelist()
	# def get_sales_orders_by_heat_no(heat_no):
	# 	sales_orders = frappe.get_all("Heat No Child Table", 
	# 								filters={"parent": heat_no}, 
	# 								fields=["sales_order"])

	# 	return [so["sales_order"] for so in sales_orders]

	# @frappe.whitelist()
	# def get_sales_orders(heat_no):
	# 	if not heat_no:
	# 		return []
	# 	sales_orders = frappe.get_all(
	# 		"Pouring Casting Details", 
	# 		filters={"heat_no": heat_no},
	# 		pluck="sales_order"
	# 	)

	# frappe.msgprint(str(get_sales_orders("A020")))