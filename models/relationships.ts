import { Contact } from "./contacts";
import { Customer } from "./customers";
import { Order } from "./orders";
import { ProductProperty } from "./product_properties";
import { ProductPropertyValue } from "./product_property_values";
import { Product } from "./products";

// Customer and Contact
Contact.belongsTo(Customer, { foreignKey: "customer_id" });
Customer.hasMany(Contact, { foreignKey: "customer_id" });

// Customer and Order
Order.belongsTo(Customer, { foreignKey: "customer_id" });
Customer.hasMany(Order, { foreignKey: "customer_id" });

// Product and Order
Order.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(Order, { foreignKey: "product_id" });

// Product and ProductPropertyValue
ProductPropertyValue.belongsTo(Product, { foreignKey: "product_id" });
Product.hasMany(ProductPropertyValue, { foreignKey: "product_id" });

// ProductProperty and ProductPropertyValue
ProductProperty.hasMany(ProductPropertyValue, { foreignKey: "product_property_id" });
ProductPropertyValue.belongsTo(ProductProperty, { foreignKey: "product_property_id" });
