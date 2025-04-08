# Copyright (c) 2025, Quantbit Technologies Pvt. Ltd. and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class MTCGeneration(Document):
	# @frappe.whitelist()
	# def get_sales_order_sheet(self):
	# 	sales_order_sheet = frappe.get_value("Sales Order Sheet", {'sales_order_ref': self.sales_order}, 'name')
		
	# 	if sales_order_sheet:
	# 		self.sales_order_sheet = sales_order_sheet
	# 		self.get_dep_table()



	# @frappe.whitelist()
	# def get_dep_table(self):		
	# 	department_remarks = frappe.get_all(
	# 		"Sales Order Department Remark", 
	# 		filters={'parent': self.sales_order_sheet},
	# 		fields=['po_serial_number', 'department', 'remark']
	# 	)

	# 	for remark in department_remarks:
	# 		self.append("department_remark", {
	# 			"po_serial_number": remark.po_serial_number,
	# 			"department": remark.department,
	# 			"remark": remark.remark
	# 		})

	# @frappe.whitelist()
	# def get_grade_details(self):
		
	# 	result1 = frappe.get_all(
	# 			"Grade Chemical Composition Details", 
	# 			filters={"parent": self.grade},
	# 			fields=["element_symbol", "internal_minimum", "internal_maximum", "standard_minimum", "internal_maximum"] ,
	# 			order_by="idx ASC"
	# 		)
		
	# 	for i in result1:
	# 		self.append("chemical_composition_details",{
	# 			"element_name": i.element_name,
	# 			"element_symbol": i.element_symbol,
	# 			"standard_minimum": i.standard_minimum,
	# 			"internal_minimum": i.internal_minimum,
	# 			"standard_maximum": i.standard_maximum,
	# 			"internal_maximum": i.internal_maximum,
	# 			"remarks": i.remarks
	# 		})

	# 	result = frappe.get_all(
	# 		'Grade Mechanical Properties Details',  
	# 		filters={"parent": self.grade},  
	# 		fields=['minimun', 'maximum', 'mechanical_property_name']  )


	# 	for row in result:
	# 		self.append("mechanical_properties_details", {
	# 			"mechanical_property_name": row.mechanical_property_name,
	# 			"minimun": row.minimun,
	# 			"maximum": row.maximum
	# 		})



#fetch department remark from sales order sheet
	@frappe.whitelist()
	def update_dept_remark(self):
		if not self.sales_order_sheet:
			return  

		sales_order_sheets = [row.sales_order_sheet for row in self.sales_order_sheet if row.sales_order_sheet]

		if not sales_order_sheets:
			return

		department_remarks = frappe.get_all('Sales Order Department Remark',filters={'parent': ['in', sales_order_sheets]},fields=['parent','po_serial_number', 'department', 'remark'])
		
		# frappe.msgprint(str(department_remarks))
		for row in department_remarks:
			self.append("sheet_department_remark", {
				"sales_order_sheet": row.parent,  
				"po_serial_number": row.po_serial_number,
				"department": row.department,
				"remark": row.remark
			})
		self.fetch_all_properties_from_invoice()

 #filter applied to sales order according to heat no
	@frappe.whitelist()
	def get_sales_orders(self):
		sales_orders = frappe.get_all("Pouring Casting Details", filters={"heat_no": self.heat_no},fields=["sales_order"] )

		final_listed = [r["sales_order"] for r in sales_orders]
		return final_listed




 # fetch value from heat treatment deatils
	@frappe.whitelist()
	def fetch_heat_treatment_details(self):
		if self.heat_no:
			heat_treatment = frappe.get_value("Heat Treatment Details Entry", {"heat_no": self.heat_no}, "name")
		
		if heat_treatment:
			ht_doc = frappe.get_doc("Heat Treatment Details Entry", heat_treatment)
			
			self.std = ht_doc.std
			self.batch_no = ht_doc.batch_no
			self.cycle = ht_doc.cycle

		self.fetch_mechanical_properties()
		self.fetch_chemical_properties()



# accroding heat no in childtable values are fetched
	@frappe.whitelist()
	def fetch_mechanical_properties(self):
		if self.heat_no:
			parent_docs = frappe.get_all("Mechanical Test Result Entry", filters={"heat_no": self.heat_no}, fields=["name", "daily_heat_planning"])

			for mech in parent_docs:
				if parent_docs:
					child_rows = frappe.get_all("Grade Mechanical Properties",filters={"parent": ["in", mech.name]},fields=["mechanical_property_name", "minimun", "maximum", "actual_value"])

					for row in child_rows:
						self.append("details_of_mechanical_property", {
							"mechanical_property_name": row.mechanical_property_name,
							"minimun": row.minimun,
							"maximum": row.maximum,
							"actual_value": row.actual_value,
							"heat_no": self.heat_no,
							"heat_number": mech.daily_heat_planning
						})
   

	@frappe.whitelist()
	def fetch_chemical_properties(self):
		if self.heat_no:
			parent_docs = frappe.get_all("Chemicle Result Entry",filters={"heat_no": self.heat_no},fields=["name", "daily_heat_planning"])

			for chem in parent_docs:
				if parent_docs:
					child_rows = frappe.get_all("Chemical Result Entry Details",filters={"parent": ["in", chem.name]},fields=["element_name", "minimum", "maximum"])

					for row in child_rows:
						self.append("details_of_chemical_properties", {
							"element_name": row.element_name,
							"internal_minimum": row.minimum,
							"internal_maximum": row.maximum,
							"heat_no": self.heat_no,
							"heat_number": chem.daily_heat_planning
						})


	#fetch the data from dc no
	@frappe.whitelist()
	def fetch_all_properties_from_invoice(self):
		if self.mtc_generation =="DC Wise" and self.dc_no:
			sales_invoice_items = frappe.get_all("Sales Invoice Item",filters={"parent": self.dc_no},fields=["sales_order"])

			all_sales_orders = [item.sales_order for item in sales_invoice_items if item.sales_order]

			selected_sales_orders = [row.sales_order for row in self.sales_order if row.sales_order]

			valid_sales_orders = list(set(all_sales_orders).intersection(set(selected_sales_orders)))

			# if not valid_sales_orders:
			# 	frappe.throw("Please select valid Sales Orders from the selected Sales Invoice.")

			heat_nos = []
			for so in valid_sales_orders:
				pouring_details = frappe.get_all("Pouring Casting Details",filters={"sales_order": so},fields=["heat_no"])
				heat_nos.extend([pd.heat_no for pd in pouring_details if pd.heat_no])

			if heat_nos:
				unique_heat_nos = list(set(heat_nos))
				self.heat_no = ", ".join(unique_heat_nos)

				self.details_of_mechanical_property = []
				self.details_of_chemical_properties = []

				for heat in unique_heat_nos:
					# MECHANICAL
					mech_parents = frappe.get_all("Mechanical Test Result Entry",filters={"heat_no": heat},fields=["name", "daily_heat_planning"])
				
					for mech in mech_parents:
						mech_props = frappe.get_all("Grade Mechanical Properties",filters={"parent": mech.name},fields=["mechanical_property_name", "minimun", "maximum", "actual_value"])

						for prop in mech_props:
							self.append("details_of_mechanical_property", {
								"mechanical_property_name": prop.mechanical_property_name,
								"minimun": prop.minimun,
								"maximum": prop.maximum,
								"actual_value": prop.actual_value,
								"heat_no": heat,
								"heat_number": mech.daily_heat_planning 
							})

					# CHEMICAL
					chem_parents = frappe.get_all("Chemicle Result Entry",filters={"heat_no": heat},fields=["name", "daily_heat_planning"],)
					
					for chem in chem_parents:
						if chem_parents:
							chem_props = frappe.get_all("Chemical Result Entry Details",filters={"parent": ["in", chem.name]},fields=["element_name", "minimum", "maximum"])
	
							for row in chem_props:
								self.append("details_of_chemical_properties", {
									"element_name": row.element_name,
									"internal_minimum": row.minimum,
									"internal_maximum": row.maximum,
									"heat_no": heat,
									"heat_number": chem.daily_heat_planning
								})

					# MTC PRODUCT DETAILS
					parent_names = frappe.get_all("Daily Heat Planning",filters={"heat_no": heat},fields = ["name", "parent_grade","date"])
					
					for i in parent_names:
						if parent_names:
							product_rows = frappe.get_all("Daily Heat Planning Product Details",filters={"parent": ["in", i.name],"sales_order_no": ["in", valid_sales_orders]},
								fields=["parent","heat_no","sr_no", "po_sr_no","finished_item_code","poured_quantity","sales_order_no","finished_item_name","grade"])
							
						for row in product_rows:

							remarks = frappe.get_value("Sales Order", row.sales_order_no, "custom_order_acceptance_remark") or ""

							self.append("mtc_product_details_part_a", {
								"heat_no": heat,
								"heat_number": row.parent,
								"srl": row.sr_no,
								"cast_srl": row.po_sr_no,
								"finished_item_code": row.finished_item_code,
								"finished_item_name": row.finished_item_name,
								"qty": row.poured_quantity,
								"sales_order":row.sales_order_no,
								"custom_order_acceptance_remarks": remarks
							})

						for row in product_rows:
							self.append("heat_treatment_details", {
								"heat_no": heat,
								"heat_number": row.parent,
								"oa_grade": row.grade,
								"date": i.date,
								"tc_grade": i.parent_grade
							})


		if self.mtc_generation =="Heat Wise" and self.heat_no:
			self.update_product_details_from_heat()


#filter applied to sales order according to dc no
	@frappe.whitelist()
	def get_sales_orders_from_invoice(self):
		sales_orders = frappe.get_all("Sales Invoice Item",filters={"parent": self.dc_no},pluck="sales_order")

		final_listed = [r for r in sales_orders if r]
		return final_listed
		# frappe.throw(str(final_listed))


	@frappe.whitelist()
	def get_sales_sheet(self):
		sales_orders = [row.sales_order for row in self.sales_order if row.sales_order]

		if not sales_orders:
			return []

		result = frappe.get_all("Sales Order Sheet",filters={"sales_order_ref": ["in", sales_orders]},pluck="name")
		
		return result
						

	#according heat no values are fetched
	@frappe.whitelist()
	def update_product_details_from_heat(self):
		if self.heat_no:
			selected_sales_orders = [row.sales_order for row in self.sales_order if row.sales_order]

			# if not selected_sales_orders:
			# 	frappe.throw("Please select at least one Sales Order.")

			parent_docs = frappe.get_all("Daily Heat Planning",filters={"heat_no": self.heat_no},fields = ["name", "parent_grade","date"])
			
			for i in parent_docs:
				if parent_docs:
					product_rows = frappe.get_all("Daily Heat Planning Product Details",
						filters={
							"parent": ["in", i.name],
							"sales_order_no": ["in", selected_sales_orders]
						},
						fields=[
							"parent", "heat_no", "sr_no", "po_sr_no", "finished_item_code",
							"grade", "poured_quantity", "sales_order_no", "finished_item_name"
						]
					)

					# if not product_rows:
					# 	frappe.throw("No product details found for the selected Sales Orders and Heat Number.")

					self.mtc_product_details_part_a = []

					for row in product_rows:
						remarks = frappe.get_value("Sales Order", row.sales_order_no, "custom_order_acceptance_remark") or ""

						self.append("mtc_product_details_part_a", {
							"heat_no": row.heat_no,
							"srl": row.sr_no,
							"cast_srl": row.po_sr_no,
							"finished_item_code": row.finished_item_code,
							"finished_item_name": row.finished_item_name,
							"qty": row.poured_quantity,
							"sales_order": row.sales_order_no,
							"heat_number": row.parent,
							"order_acceptance_remarks": remarks
						})

					self.heat_treatment_details = []

					for row in product_rows:
						self.append("heat_treatment_details", {
							"heat_no": row.heat_no,
							"heat_number": row.parent,
							"oa_grade": row.grade,
							"date": i.date,
							"tc_grade": i.parent_grade
						})


