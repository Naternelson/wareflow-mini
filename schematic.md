---

### Products

- `product_id` (Primary Key)
- `name`
- `description`
- `tags`
- `created_date`
- `updated_date`

---

### Product_Properties

-   `property_id` (Primary Key)
-   `product_id` (Foreign Key: `Products.product_id`)
-   `default_value`
-   `label`
-   `pattern`:
    -   `default_value`
    -   `max_length`
    -   `min_length`
    -   `exact_length`
    -   `only_numbers`
    -   `only_letters`
    -   `exclude_special_chars`
    -   `must_include_chars`
    -   `must_exclude_chars`
    -   `regex`
    -   `min_group_size`
    -   `max_group_size`
    -   `exact_group_size`

---

### Workflows

-   `workflow_id` (Primary Key)
-   `name`
-   `product_id` (Foreign Key: `Products.product_id`)
-   `description`
-   `tags`
-   `bin_id_type`: (custom_string | uuid)
<!-- Example `YYYYMMDD-###` -->
-   `min_bin_size`
-   `max_bin_size`
-   `exact_bin_size`

---

### Orders

-   `order_id` (Primary Key)
-   `ordered_on`
-   `status` (Enum: 'queued', 'in_progress', 'paused', 'completed_ready_to_ship', 'shipped', 'delivered', 'cancelled', 'finished')
-   `order_amount`:number
-   `order_completed`: number
-   `workflow_id` (Foreign Key: `Workflows.workflow_id`)
-   `customer`: string
-   `deliver_to_address_id` (Foreign Key to a new `Addresses` table)
-   `bill_to_address_id` (Foreign Key to a new `Addresses` table)

---

### Item

-   `item_id` (Primary Key)

-   `product_id` (Foreign Key: `Products.product_id`)
-   `workflow_id` (Foreign Key: `Workflows.workflow_id`)
-   `bin_id` (Foreign Key: `Bin.bin_id`)
-   `location`
-   `quantity`

---

### Item_Properties

-   `item_property_id` (Primary Key)
-   `product_property_id` (Foreign key `Properties.product_id`)
-   `item_id` (Foreign key Item.item_id)
-   `value`

### Bin

-   `bin_id` (Primary Key)
-   `count`
-   `shipping_id`: (Foreign Key: `Shipping.shipping_id`)
-   `workflow_id` (Foreign Key: `Workflows.workflow_id`)
-   `status` (Enum: 'empty', 'partial', 'full')

---

### Automations

-   `automation_id` (Primary Key)
-   `workflow_id` (Foreign Key: `Workflows.workflow_id`)
-   `status` (Enum: 'active', 'paused', 'deleted')
-   `type` (Enum: 'on_order_status', 'on_bin_status', 'on_product_item_property', 'on_user_request')
-   `match_value`?: regex
-   `request_permission`: boolean
-   `dependent_automation_id`: string[] (Foreign key: Autmation.automation_id, with additional backup ids if the automation in question is skipped. To indicate whether this automation should follow after previous automations are completed)

---

### Document Action

-   `document_action_id` (Primary Key)
-   `automation_id` (Foreign Key: `Automations.automation_id`)
-   `request_permission`:boolean
-   `document_template`: string

---

### Email Action

-   `email_action_id` (Primary Key)
-   `automation_id` (Foreign Key: `Automations.automation_id`)
-   `contact_id` // Assuming this refers to the `Contact` table, so this would be a Foreign Key.
-   `email_template`
-   `request_permission`

---

### Automation_Logs

-   `automation_log_id` (Primary Key)
-   `automation_id` (Foreign Key: `Automations.automation_id`)
-   `status` (Enum: 'queued', 'pending', 'skipped', 'error', 'complete')
-   `message`

---

### User

-   `user_id` (Primary Key)
-   `first_name`
-   `last_name`
-   `email`
-   `phone`
-   `title`
-   `department`
-   `organization_id` (Foreign Key: `Organization.organization_id`)

---

### Printer_Preferences

-   `preference_id` (Primary Key)
-   `machine_name`
-   `user_id` (Foreign Key: `User.user_id`)
-   `print_to`
-   `automation_request_id` (Foreign Key: `Automations.automation_id`)

---

### Organization

-   `organization_id` (Primary Key)
-   `name`
-   `email`
-   `phone`
-   `admin_id` (Foreign Key: `User.user_id`)
-   `address` (Foreign Key: `Address.address_id`)

---

### Contact

-   `contact_id` (Primary Key)
-   `first_name`
-   `last_name`
-   `organization`
-   `title`
-   `email`
-   `phone`

---

### Addresses

-   `address_id` (Primary Key)
-   `street_address`
-   `secondary_address`
-   `city`
-   `state`
-   `zip_code`
-   `country`

---

### Shipping

-   `shipping_id` (Primary Key)
-   `order_id` (Foreign key: `Order.order_id`)
-   `ship_to` (Foreign key: `Address.address_id`)
-   `pallet_count`: number
-   `bin_count`: number
-   `status`: (Enum: `building`, `awaiting-inspection`, `reprossesing`, `waiting-to-ship`, `shipped`, `delivered`)
-   `shipping_from`: (Foreign_key: `Address.address_id`)
-   `door`
<!-- The door the pallets are shipping from -->

-   `shipped_on_date`
-   `bill_of_lading`: string 


