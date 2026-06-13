-- ============================================
-- alter.sql — Schema changes made after initial creation
-- Run AFTER schema.sql + seed.sql
-- ============================================

-- Fix ACLEDA bank payment method spelling (was 'Aceleda')
-- Widen enum, migrate existing rows, then narrow enum back
ALTER TABLE Sale MODIFY Payment_Method ENUM('Cash','ABA','Aceleda','Acleda') NOT NULL DEFAULT 'Cash';
UPDATE Sale SET Payment_Method='Acleda' WHERE Payment_Method='Aceleda';
ALTER TABLE Sale MODIFY Payment_Method ENUM('Cash','ABA','Acleda') NOT NULL DEFAULT 'Cash';

-- TODO: add any earlier schema changes here, e.g.:
--   ALTER TABLE Sale ADD COLUMN Coupon_ID INT NULL,
--     ADD CONSTRAINT fk_sale_coupon FOREIGN KEY (Coupon_ID) REFERENCES Coupon(Coupon_ID);
--   ALTER TABLE Customer ADD COLUMN User_ID INT NULL,
--     ADD CONSTRAINT fk_customer_user FOREIGN KEY (User_ID) REFERENCES users(id) ON DELETE SET NULL;
--   ALTER TABLE Product ADD COLUMN Supplier_ID INT NULL,
--     ADD CONSTRAINT fk_product_supplier FOREIGN KEY (Supplier_ID) REFERENCES Supplier(Supplier_ID) ON DELETE SET NULL;
