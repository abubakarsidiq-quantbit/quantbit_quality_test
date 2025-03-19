# Copyright (c) 2024, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class FoundryTreatmentMicrostructureTest(Document):
	
	@frappe.whitelist()
	def cavity_standard(self):
		if self.pouring_id:
			treatment_details = self.get("treatment_details")
			for row in treatment_details:
				quantity= frappe.get_value('Pouring Casting Details',{'parent':self.pouring_id,'casting_item_code':row.item_code}, "sum(quantity) as quantity")
				row.quantity = quantity
					
		else:
			frappe.throw("Please Select Pouring ID First")
     
	@frappe.whitelist()
	def set_filters_for_items(self):
		query = """
			SELECT DISTINCT casting_item_code
			FROM `tabPouring Casting Details`
			WHERE parent = %s
			AND `check` = 1
		"""
		result = frappe.db.sql(query, (self.pouring_id,), as_list=True)
		final_listed = [r[0] for r in result]
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
