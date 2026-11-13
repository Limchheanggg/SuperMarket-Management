SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer',
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Category` (
  `Category_ID` int NOT NULL AUTO_INCREMENT,
  `Category_Name` varchar(100) NOT NULL,
  PRIMARY KEY (`Category_ID`),
  CONSTRAINT `categoryNameCheck` CHECK ((char_length(`Category_Name`) >= 2))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Supplier` (
  `Supplier_ID` int NOT NULL AUTO_INCREMENT,
  `Company_Name` varchar(100) NOT NULL,
  `Contact_Person` varchar(100) DEFAULT NULL,
  `Phone` varchar(30) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT 'Cambodia',
  PRIMARY KEY (`Supplier_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Coupon` (
  `Coupon_ID` int NOT NULL AUTO_INCREMENT,
  `Code` varchar(20) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Discount_Type` enum('percentage','fixed') DEFAULT 'percentage',
  `Discount_Value` float NOT NULL,
  `Min_Purchase` float DEFAULT '0',
  `Tier_Required` enum('Bronze','Silver','Gold','Platinum') DEFAULT 'Bronze',
  `Uses_Limit` int DEFAULT '100',
  `Uses_Count` int DEFAULT '0',
  `Expiry_Date` date NOT NULL,
  `Is_Active` tinyint DEFAULT '1',
  `Created_At` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Coupon_ID`),
  UNIQUE KEY `Code` (`Code`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Product` (
  `Product_ID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  `Description` text,
  `Category_ID` int NOT NULL,
  `Brand` varchar(100) DEFAULT NULL,
  `Unit` varchar(20) NOT NULL,
  `Unit_Price` decimal(10,2) NOT NULL,
  `Unit_Mass_Kg` decimal(10,3) DEFAULT NULL,
  `Reorder_Level` int NOT NULL DEFAULT '10',
  `Is_Perishable` tinyint(1) NOT NULL DEFAULT '0',
  `Product_Image` longtext,
  `Supplier_ID` int DEFAULT NULL,
  `Is_Active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`Product_ID`),
  KEY `Category_ID` (`Category_ID`),
  KEY `fk_product_supplier` (`Supplier_ID`),
  CONSTRAINT `fk_product_supplier` FOREIGN KEY (`Supplier_ID`) REFERENCES `Supplier` (`Supplier_ID`) ON DELETE SET NULL,
  CONSTRAINT `Product_ibfk_1` FOREIGN KEY (`Category_ID`) REFERENCES `Category` (`Category_ID`),
  CONSTRAINT `productNameCheck` CHECK ((char_length(`Name`) >= 2)),
  CONSTRAINT `productPriceCheck` CHECK ((`Unit_Price` >= 0)),
  CONSTRAINT `reorderLevelCheck` CHECK ((`Reorder_Level` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Customer` (
  `Customer_ID` int NOT NULL AUTO_INCREMENT,
  `First_Name` varchar(50) NOT NULL,
  `Last_Name` varchar(50) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `Join_Day` tinyint NOT NULL,
  `Join_Month` tinyint NOT NULL,
  `Join_Year` year NOT NULL,
  `Loyalty_Points` int NOT NULL DEFAULT '0',
  `password` varchar(255) DEFAULT NULL,
  `User_ID` int DEFAULT NULL,
  PRIMARY KEY (`Customer_ID`),
  KEY `fk_customer_user` (`User_ID`),
  CONSTRAINT `fk_customer_user` FOREIGN KEY (`User_ID`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `joinDayCheck` CHECK ((`Join_Day` between 1 and 31)),
  CONSTRAINT `joinMonthCheck` CHECK ((`Join_Month` between 1 and 12)),
  CONSTRAINT `loyaltyPointsCheck` CHECK ((`Loyalty_Points` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Employee_Shift` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `shift_name` varchar(50) NOT NULL DEFAULT 'Morning',
  `shift_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'scheduled',
  `note` varchar(255) DEFAULT '',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `Employee_Shift_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Inventory` (
  `Inventory_ID` int NOT NULL AUTO_INCREMENT,
  `Product_ID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Last_Updated` datetime DEFAULT NULL,
  PRIMARY KEY (`Inventory_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `Inventory_ibfk_1` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Membership` (
  `Membership_ID` int NOT NULL AUTO_INCREMENT,
  `Customer_ID` int NOT NULL,
  `Tier` varchar(20) DEFAULT NULL,
  `Points` int DEFAULT NULL,
  `Total_Spent` float DEFAULT NULL,
  `Joined_At` datetime DEFAULT NULL,
  PRIMARY KEY (`Membership_ID`),
  KEY `Customer_ID` (`Customer_ID`),
  CONSTRAINT `Membership_ibfk_1` FOREIGN KEY (`Customer_ID`) REFERENCES `Customer` (`Customer_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Sale` (
  `Sale_ID` int NOT NULL AUTO_INCREMENT,
  `Sale_Day` tinyint NOT NULL,
  `Sale_Month` tinyint NOT NULL,
  `Sale_Year` year NOT NULL,
  `Sale_Time` time NOT NULL DEFAULT '00:00:00',
  `Employee_ID` int NOT NULL,
  `Customer_ID` int DEFAULT NULL,
  `Coupon_ID` int DEFAULT NULL,
  `Payment_Method` enum('Cash','ABA','Acleda') NOT NULL DEFAULT 'Cash',
  `Discount` decimal(5,2) NOT NULL DEFAULT '0.00',
  `Tax` decimal(5,2) NOT NULL DEFAULT '0.00',
  `Total_Amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `Customer_Note` text,
  PRIMARY KEY (`Sale_ID`),
  KEY `Employee_ID` (`Employee_ID`),
  KEY `Customer_ID` (`Customer_ID`),
  KEY `Coupon_ID` (`Coupon_ID`),
  CONSTRAINT `Sale_ibfk_1` FOREIGN KEY (`Coupon_ID`) REFERENCES `Coupon` (`Coupon_ID`),
  CONSTRAINT `discountCheck` CHECK ((`Discount` between 0 and 100)),
  CONSTRAINT `saleDayCheck` CHECK ((`Sale_Day` between 1 and 31)),
  CONSTRAINT `saleMonthCheck` CHECK ((`Sale_Month` between 1 and 12)),
  CONSTRAINT `taxCheck` CHECK ((`Tax` >= 0)),
  CONSTRAINT `totalAmountCheck` CHECK ((`Total_Amount` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `SaleItem` (
  `Item_ID` int NOT NULL AUTO_INCREMENT,
  `Sale_ID` int NOT NULL,
  `Product_ID` int NOT NULL,
  `Quantity` int NOT NULL,
  `Unit_Price` float NOT NULL,
  `Subtotal` float NOT NULL,
  PRIMARY KEY (`Item_ID`),
  KEY `Sale_ID` (`Sale_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `SaleItem_ibfk_1` FOREIGN KEY (`Sale_ID`) REFERENCES `Sale` (`Sale_ID`),
  CONSTRAINT `SaleItem_ibfk_2` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `StockMovement` (
  `Movement_ID` int NOT NULL AUTO_INCREMENT,
  `Product_ID` int NOT NULL,
  `Movement_Type` varchar(20) DEFAULT NULL,
  `Quantity` int NOT NULL,
  `Note` varchar(255) DEFAULT NULL,
  `Created_At` datetime DEFAULT NULL,
  PRIMARY KEY (`Movement_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `StockMovement_ibfk_1` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
