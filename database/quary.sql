-- ============================================
-- quary.sql — Test queries, reports, and validation
-- ============================================

-- 1. Top 10 best-selling products by units sold
SELECT p.Name, SUM(si.Quantity) AS units_sold, SUM(si.Subtotal) AS revenue
FROM SaleItem si
JOIN Product p ON p.Product_ID = si.Product_ID
GROUP BY p.Product_ID, p.Name
ORDER BY units_sold DESC
LIMIT 10;

-- 2. Revenue breakdown by payment method
SELECT Payment_Method, COUNT(*) AS transactions, SUM(Total_Amount) AS revenue
FROM Sale
GROUP BY Payment_Method
ORDER BY revenue DESC;

-- 3. Monthly revenue trend (current year)
SELECT Sale_Month, SUM(Total_Amount) AS revenue, COUNT(*) AS transactions
FROM Sale
WHERE Sale_Year = YEAR(CURDATE())
GROUP BY Sale_Month
ORDER BY Sale_Month;

-- 4. Membership tier distribution
SELECT Tier, COUNT(*) AS members, AVG(Total_Spent) AS avg_spent
FROM Membership
GROUP BY Tier
ORDER BY avg_spent DESC;

-- 5. Coupon usage report
SELECT Code, Discount_Type, Discount_Value, Uses_Count, Uses_Limit,
       ROUND(Uses_Count / Uses_Limit * 100, 1) AS pct_used
FROM Coupon
ORDER BY Uses_Count DESC;

-- 6. Low stock products (below reorder level)
SELECT p.Name, i.Quantity, p.Reorder_Level, s.Company_Name AS supplier
FROM Inventory i
JOIN Product p ON p.Product_ID = i.Product_ID
LEFT JOIN Supplier s ON s.Supplier_ID = p.Supplier_ID
WHERE i.Quantity <= p.Reorder_Level AND p.Is_Active = 1
ORDER BY i.Quantity ASC;

-- 7. Sales performance by cashier
SELECT u.full_name AS cashier, COUNT(*) AS sales_count, SUM(s.Total_Amount) AS total_revenue
FROM Sale s
JOIN users u ON u.id = s.Employee_ID
GROUP BY u.id, u.full_name
ORDER BY total_revenue DESC;

-- 8. Customers who used a coupon, with the coupon code and discount amount
SELECT c.First_Name, c.Last_Name, s.Sale_ID, cp.Code, s.Discount, s.Total_Amount
FROM Sale s
JOIN Coupon cp ON cp.Coupon_ID = s.Coupon_ID
JOIN Customer c ON c.Customer_ID = s.Customer_ID
ORDER BY s.Sale_ID DESC
LIMIT 20;

-- 9. Average transaction value and total sales count (all-time)
SELECT COUNT(*) AS total_transactions,
       SUM(Total_Amount) AS total_revenue,
       ROUND(AVG(Total_Amount), 2) AS avg_transaction
FROM Sale;

-- 10. Orphaned customers (no linked user account, used for diagnosing data integrity)
SELECT Customer_ID, First_Name, Last_Name, email
FROM Customer
WHERE User_ID IS NULL;
