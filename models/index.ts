import { sequelize } from "../electron/db";
import { Customer} from "./customers";
import { Contact } from "./contacts";
import { Product } from "./products";
import { Order } from "./orders";
import { ProductProperty } from "./product_properties";
import { ProductPropertyValue } from "./product_property_values";
import "./relationships"; 

export {sequelize, Customer, Contact, Product, Order, ProductProperty, ProductPropertyValue}