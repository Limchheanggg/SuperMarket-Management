
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
DROP TABLE IF EXISTS `Category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Category` (
  `Category_ID` int NOT NULL AUTO_INCREMENT,
  `Category_Name` varchar(100) NOT NULL,
  PRIMARY KEY (`Category_ID`),
  CONSTRAINT `categoryNameCheck` CHECK ((char_length(`Category_Name`) >= 2))
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=1616 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Employee_Shift`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=1485 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Inventory` (
  `Inventory_ID` int NOT NULL AUTO_INCREMENT,
  `Product_ID` int NOT NULL,
  `Quantity` int DEFAULT NULL,
  `Last_Updated` datetime DEFAULT NULL,
  PRIMARY KEY (`Inventory_ID`),
  KEY `Product_ID` (`Product_ID`),
  CONSTRAINT `Inventory_ibfk_1` FOREIGN KEY (`Product_ID`) REFERENCES `Product` (`Product_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=759 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Membership`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3672 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=4098 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=38267 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `SaleItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=131975 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `StockMovement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `Supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Supplier` (
  `Supplier_ID` int NOT NULL AUTO_INCREMENT,
  `Company_Name` varchar(100) NOT NULL,
  `Contact_Person` varchar(100) DEFAULT NULL,
  `Phone` varchar(30) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `City` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT 'Cambodia',
  PRIMARY KEY (`Supplier_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'customer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `ix_users_email` (`email`),
  KEY `ix_users_id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1077 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

