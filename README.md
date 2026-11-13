
<div align="center">

  <h1>AMS Mart - Supermarket Management System</h1>

  <p>
    A supermarket management web application developed as part
    of my studies at the Institute of Technology of Cambodia (ITC).
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React">
    <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi" alt="FastAPI">
    <img src="https://img.shields.io/badge/MariaDB-Database-003545?logo=mariadb" alt="MariaDB">
  </p>

  <p>
    <a href="https://super-market-management-six.vercel.app">Live Website</a>
    |
    <a href="https://supermarket-management-production-d071.up.railway.app/docs">API Documentation</a>
  </p>

</div>

<hr>

<h2>1. Introduction</h2>

<p>
  AMS Mart is a web-based supermarket management system that I developed
  to practice full-stack web development, database management, and
  application development.
</p>

<p>
  The system provides a customer website for browsing and purchasing
  products, together with an admin dashboard for managing products,
  inventory, sales, customers, suppliers, and memberships.
</p>

<p>
  I started this project to understand how a supermarket management
  system works in practice. While developing it, I also became interested
  in how data science and machine learning could be used to improve
  inventory management and support better business decisions.
</p>

<p>
  This interest has become the direction of my Research Methodology
  project, which focuses on integrating computer vision and demand
  forecasting for supermarket inventory replenishment.
</p>

<h2>2. Project Objectives</h2>

<h3>2.1 General Objective</h3>

<p>
  To develop a web-based supermarket management system that helps
  organize supermarket operations, including product management,
  inventory tracking, sales transactions, and customer information.
</p>

<h3>2.2 Specific Objectives</h3>

<ol>
  <li>
    Develop a customer website that allows users to browse products,
    search for items, manage shopping carts, and complete purchases.
  </li>
  <li>
    Design and implement a relational database to store supermarket
    information, including products, customers, suppliers, inventory,
    memberships, and sales records.
  </li>
  <li>
    Develop an admin dashboard for managing supermarket operations
    and viewing business information.
  </li>
  <li>
    Implement user authentication and role-based access to separate
    customer and administrative functions.
  </li>
  <li>
    Implement inventory tracking and automatic stock updates
    when sales are completed.
  </li>
  <li>
    Provide sales reports and visualizations to help understand
    product performance and business activity.
  </li>
</ol>

<h2>3. Research Methodology</h2>

<p>
  Apart from developing the management system, I am also exploring
  how computer vision and demand forecasting can support supermarket
  inventory management.
</p>

<p>
  Traditional inventory management depends on accurate stock information
  and a good understanding of customer demand. However, manually checking
  products on shelves and relying only on historical records may not
  provide enough information for effective replenishment decisions.
</p>

<h3>3.1 Research Topic</h3>

<p>
  <strong>
    Integrated Computer Vision and Demand Forecasting for
    Supermarket Inventory Replenishment
  </strong>
</p>

<h3>3.2 Research Problem</h3>

<p>
  Inventory management is important in supermarkets because businesses
  must monitor product quantities and customer demand. Employees need
  accurate inventory information to identify products requiring
  replenishment and decide when to reorder. However, manual observations
  and existing records may not always reflect actual product availability
  or future demand. Computer vision and demand forecasting offer
  potential ways to support these activities.
</p>

<p>
  Computer vision and demand forecasting have been studied in retail,
  but they serve different purposes in inventory management. Computer
  vision provides information about visible shelf products, while
  demand forecasting estimates future requirements using historical
  sales. Previous research has examined grocery product recognition
  (Melek et al., 2024), retail forecasting (Fildes et al., 2022),
  and machine-learning approaches to inventory optimization
  (Bergsma et al., 2025). Further investigation is needed into how
  visual product counts, human verification, and demand forecasts
  can be evaluated together in a supermarket replenishment workflow.
</p>

<p>
  Without proper verification, computer-vision errors may affect
  inventory information and subsequent replenishment decisions.
  Inaccurate demand forecasts may also lead to unsuitable order
  quantities, contributing to stock shortages or excess inventory.
  These problems can reduce inventory-management reliability and
  increase operational difficulties.
</p>

<p>
  This study aims to investigate how computer vision and demand
  forecasting can support supermarket inventory replenishment.
  It will evaluate product-counting performance, compare forecasting
  methods using public retail sales data, and examine through simulation
  whether combining verified visual counts with demand forecasts
  improves replenishment outcomes across different product categories.
</p>

<h3>3.3 General Research Objective</h3>

<p>
  To investigate how computer vision and demand forecasting can be
  combined to improve inventory monitoring and replenishment decisions
  in supermarket environments.
</p>

<h3>3.4 Specific Research Objectives</h3>

<ol>
  <li>
    To evaluate the performance of a computer-vision model in detecting
    and counting products in supermarket shelf images using a publicly
    available dataset.
  </li>
  <li>
    To investigate how different forecasting techniques perform across
    selected product categories using historical sales patterns and
    appropriate evaluation metrics.
  </li>
  <li>
    To evaluate the effectiveness of integrating verified
    computer-vision-based shelf product counts and forecasted demand
    in simulated supermarket replenishment decisions.
  </li>
</ol>

<h3>3.5 Research Questions</h3>

<ol>
  <li>
    How accurately can a computer-vision model detect and count
    products in supermarket shelf images using a publicly available
    dataset?
  </li>
  <li>
    How do different demand-forecasting techniques perform across
    selected supermarket product categories using historical sales data?
  </li>
  <li>
    To what extent does integrating verified computer-vision-based
    shelf product counts and forecasted demand improve simulated
    supermarket replenishment outcomes compared with a baseline approach?
  </li>
</ol>

<h3>3.6 Research Approach</h3>

<p>
  The research will use publicly available datasets and a
  simulation-based evaluation. It has three main parts:
</p>

<h4>Part 1: Computer Vision for Shelf Product Detection</h4>

<p>
  The first part focuses on detecting and counting visible products
  in supermarket shelf images. I plan to use the SKU-110K dataset,
  which contains annotated images of densely packed retail shelves.
</p>

<p>
  The planned approach is to use an Ultralytics YOLO model to detect
  products and generate bounding boxes. The number of detected
  products can then be compared with the dataset's annotations.
</p>

<p>
  The evaluation will consider detection precision, recall, and
  counting error. Since shelf images only show visible products,
  the detected count will not automatically represent the total
  inventory available in a supermarket.
</p>

<h4>Part 2: Demand Forecasting</h4>

<p>
  The second part focuses on estimating future product demand using
  historical retail sales data.
</p>

<p>
  I plan to use the Corporación Favorita Grocery Sales Forecasting
  dataset for this part. Different forecasting techniques will be
  investigated and compared across selected product categories.
</p>

<p>
  Appropriate forecasting evaluation metrics will be used to compare
  the performance of the selected techniques.
</p>

<h4>Part 3: Integrated Inventory Replenishment Simulation</h4>

<p>
  The final part combines the information from computer vision and
  demand forecasting to investigate how they can support inventory
  replenishment decisions.
</p>

<p>
  Two approaches will be compared:
</p>

<ul>
  <li>
    <strong>Baseline approach:</strong> Uses existing inventory
    records and demand forecasts without computer-vision shelf counts.
  </li>
  <li>
    <strong>Integrated approach:</strong> Uses verified computer-vision
    shelf counts, other inventory information, and the same demand
    forecasts.
  </li>
</ul>

<p>
  The comparison will be conducted through simulation. Possible
  evaluation measures include stockout rate, excess inventory,
  and simulated inventory cost.
</p>

<p>
  Human verification will be included before computer-vision counts
  are used in replenishment decisions.
</p>

<h3>3.7 Datasets</h3>

<table>
  <thead>
    <tr>
      <th>Dataset</th>
      <th>Research Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>SKU-110K</td>
      <td>
        Supermarket shelf-object detection and product counting.
      </td>
    </tr>
    <tr>
      <td>Corporación Favorita Grocery Sales Forecasting</td>
      <td>
        Historical retail sales analysis and demand forecasting.
      </td>
    </tr>
  </tbody>
</table>

<p>
  These datasets come from different sources and do not represent
  the same supermarket. Any connection between visual counts and
  sales information in the simulation will therefore require a
  documented synthetic product mapping and clearly stated assumptions.
</p>

<p>
  The research will focus on supermarket shelf images rather than
  arbitrary individual product photographs.
</p>

<h3>3.8 Research Technologies</h3>

<table>
  <thead>
    <tr>
      <th>Technology / Tool</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Python</td>
      <td>Research implementation and data processing.</td>
    </tr>
    <tr>
      <td>Ultralytics YOLO</td>
      <td>Planned model for shelf-product detection.</td>
    </tr>
    <tr>
      <td>SKU-110K</td>
      <td>Dataset for computer-vision experiments.</td>
    </tr>
    <tr>
      <td>Corporación Favorita Dataset</td>
      <td>Dataset for demand-forecasting experiments.</td>
    </tr>
    <tr>
      <td>Data Analysis and Visualization</td>
      <td>Exploring data and presenting experimental results.</td>
    </tr>
    <tr>
      <td>Simulation</td>
      <td>Comparing inventory replenishment approaches.</td>
    </tr>
  </tbody>
</table>

<h3>3.9 Research Limitations</h3>

<ul>
  <li>
    SKU-110K supports shelf-object detection and counting, not
    exact brand or SKU recognition.
  </li>
  <li>
    Shelf images only represent visible shelf stock and do not
    directly show products stored elsewhere.
  </li>
  <li>
    The image dataset and sales dataset come from different sources.
    They must not be treated as records from the same supermarket.
  </li>
  <li>
    A documented synthetic product mapping and simulation assumptions
    will be required to connect the two datasets.
  </li>
  <li>
    Human verification is needed before visual counts influence
    inventory decisions.
  </li>
  <li>
    The research will evaluate the workflow through public datasets
    and simulation rather than a real-world supermarket deployment.
  </li>
</ul>

<h2>4. Main Features</h2>

<h3>4.1 Customer Website</h3>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Home</td><td>Introduction, featured products, and popular items.</td></tr>
    <tr><td>Shop</td><td>Browse, search, filter, and sort products.</td></tr>
    <tr><td>Product Details</td><td>View product information and images.</td></tr>
    <tr><td>Shopping Cart</td><td>Add products and update quantities.</td></tr>
    <tr><td>Checkout</td><td>Complete purchases and view order summaries.</td></tr>
    <tr><td>Order History</td><td>View previous transactions.</td></tr>
    <tr><td>Customer Dashboard</td><td>View membership information and loyalty points.</td></tr>
    <tr><td>Wishlist</td><td>Save products for later.</td></tr>
    <tr><td>Account</td><td>Manage customer information.</td></tr>
    <tr><td>Authentication</td><td>Register and log in.</td></tr>
  </tbody>
</table>

<h3>4.2 Admin Dashboard</h3>

<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Dashboard</td><td>View sales summaries and business information.</td></tr>
    <tr><td>Inventory</td><td>Manage products and stock quantities.</td></tr>
    <tr><td>Users</td><td>Manage customers and employees.</td></tr>
    <tr><td>Sales</td><td>View sales transactions.</td></tr>
    <tr><td>Membership</td><td>Manage membership levels and loyalty points.</td></tr>
    <tr><td>Analytics</td><td>View revenue charts and product performance.</td></tr>
    <tr><td>Suppliers</td><td>Manage supplier information.</td></tr>
    <tr><td>Shifts</td><td>Manage employee schedules.</td></tr>
  </tbody>
</table>

<h2>5. Technologies Used in AMS Mart</h2>

<h3>Frontend</h3>

<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>React 19</td><td>Building the user interface.</td></tr>
  <tr><td>Vite</td><td>Development server and build tool.</td></tr>
  <tr><td>React Router</td><td>Page navigation.</td></tr>
  <tr><td>Tailwind CSS</td><td>Styling.</td></tr>
  <tr><td>shadcn/ui and Radix UI</td><td>UI components.</td></tr>
  <tr><td>Axios</td><td>API communication.</td></tr>
  <tr><td>Lucide and Phosphor</td><td>Icons.</td></tr>
</table>

<h3>Backend</h3>

<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>Python</td><td>Main programming language.</td></tr>
  <tr><td>FastAPI</td><td>Backend API framework.</td></tr>
  <tr><td>SQLAlchemy</td><td>Database ORM.</td></tr>
  <tr><td>PyMySQL</td><td>MariaDB connection.</td></tr>
  <tr><td>Pydantic</td><td>Data validation and settings.</td></tr>
  <tr><td>JWT</td><td>User authentication.</td></tr>
  <tr><td>bcrypt</td><td>Password hashing.</td></tr>
  <tr><td>Cloudinary</td><td>Image storage support.</td></tr>
</table>

<h3>Database and Development</h3>

<table>
  <tr><th>Technology</th><th>Purpose</th></tr>
  <tr><td>MariaDB</td><td>Relational database.</td></tr>
  <tr><td>DBeaver</td><td>Database management and inspection.</td></tr>
  <tr><td>Git</td><td>Version control.</td></tr>
  <tr><td>GitHub</td><td>Source code hosting.</td></tr>
  <tr><td>VS Code</td><td>Development environment.</td></tr>
</table>

<h3>Hosting</h3>

<table>
  <tr><th>Platform</th><th>Purpose</th></tr>
  <tr><td>Vercel</td><td>Frontend hosting.</td></tr>
  <tr><td>Railway</td><td>Backend hosting.</td></tr>
</table>

<h2>6. System Architecture</h2>

<p>
  AMS Mart uses a frontend-backend-database architecture.
  The frontend communicates with the backend through REST API
  endpoints, while the backend handles application logic,
  authentication, validation, and database operations.
</p>

<pre>
Customer / Admin
       |
       v
React 19 + Vite Frontend
       |
       | HTTP / REST API
       v
FastAPI Backend
       |
       | SQLAlchemy ORM
       v
MariaDB Database
       |
       v
Products, Customers, Inventory and Sales
</pre>

<h3>Planned Research Integration</h3>

<p>
  The following workflow represents a future direction for connecting
  the research with AMS Mart. It is not yet an implemented feature.
</p>

<pre>
Supermarket Shelf Image
          |
          v
     YOLO Detection
          |
          v
  Product Bounding Boxes
          |
          v
   Product Count Results
          |
          v
    Human Verification
          |
          v
   Verified Shelf Counts
          |
          +-------------------+
          |                   |
          v                   v
  Inventory Information   Demand Forecasting
                              |
                              v
                       Forecasted Demand
                              |
                              v
                    Replenishment Simulation
                              |
                              v
                    Suggested Replenishment
</pre>

<h2>7. Database Design</h2>

<p>
  The local development database uses MariaDB. I created a fresh
  database setup instead of carrying over the old test records.
</p>

<table>
  <thead>
    <tr>
      <th>Table</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>users</td><td>User accounts and roles.</td></tr>
    <tr><td>Customer</td><td>Customer information.</td></tr>
    <tr><td>Membership</td><td>Membership levels and loyalty points.</td></tr>
    <tr><td>Product</td><td>Product details and prices.</td></tr>
    <tr><td>Category</td><td>Product categories.</td></tr>
    <tr><td>Supplier</td><td>Supplier information.</td></tr>
    <tr><td>Inventory</td><td>Product stock quantities.</td></tr>
    <tr><td>StockMovement</td><td>Inventory changes.</td></tr>
    <tr><td>Sale</td><td>Sales transactions.</td></tr>
    <tr><td>SaleItem</td><td>Products included in each sale.</td></tr>
    <tr><td>Coupon</td><td>Promotional coupons.</td></tr>
    <tr><td>Employee_Shift</td><td>Employee work schedules.</td></tr>
  </tbody>
</table>

<h3>Database Setup Files</h3>

<ul>
  <li>
    <code>database/schema_mariadb.sql</code> creates the database tables.
  </li>
  <li>
    <code>database/catalogue_seed.sql</code> imports the initial
    product catalogue, categories, suppliers, and inventory records.
  </li>
</ul>

<h2>8. Project Structure</h2>

<pre>
SuperMarket-Management/
|
|-- database/
|   |-- schema_mariadb.sql
|   |-- catalogue_seed.sql
|
|-- supermarket-frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |   |-- admin/
|   |   |-- services/
|   |   |-- utils/
|   |-- package.json
|   |-- vercel.json
|
|-- supermarket-backend/
|   |-- app/
|   |   |-- core/
|   |   |-- models/
|   |   |-- routers/
|   |   |-- main.py
|   |-- static/
|   |   |-- images/
|   |-- requirements.txt
|   |-- Procfile
|
|-- README.md
</pre>

<h2>9. Local Installation and Setup</h2>

<h3>Requirements</h3>

<ul>
  <li>Python 3.11 or newer</li>
  <li>Node.js 18 or newer</li>
  <li>MariaDB</li>
  <li>Git</li>
</ul>

<h3>Step 1: Clone the Repository</h3>

<pre><code>git clone https://github.com/Limchheanggg/SuperMarket-Management.git

cd SuperMarket-Management</code></pre>

<h3>Step 2: Create the Database</h3>

<p>
  Create a database named <code>SupermarketDB</code> in MariaDB.
  Import the schema and initial product catalogue:
</p>

<pre><code>mysql -u root -p SupermarketDB &lt; database/schema_mariadb.sql

mysql -u root -p SupermarketDB &lt; database/catalogue_seed.sql</code></pre>

<h3>Step 3: Set Up the Backend</h3>

<pre><code>cd supermarket-backend

python -m venv .venv

source .venv/bin/activate

pip install -r requirements.txt</code></pre>

<p>
  Create a <code>.env</code> file inside
  <code>supermarket-backend</code>:
</p>

<pre><code>DATABASE_URL=mysql+pymysql://username:password@localhost:3306/SupermarketDB

SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

ALLOWED_ORIGINS=http://localhost:5173</code></pre>

<p>Start the backend:</p>

<pre><code>uvicorn app.main:app --reload</code></pre>

<p>
  Backend:
  <a href="http://127.0.0.1:8000">http://127.0.0.1:8000</a>
  <br>
  API Documentation:
  <a href="http://127.0.0.1:8000/docs">http://127.0.0.1:8000/docs</a>
</p>

<h3>Step 4: Set Up the Frontend</h3>

<pre><code>cd supermarket-frontend

npm install</code></pre>

<p>
  Create a <code>.env.local</code> file:
</p>

<pre><code>VITE_API_URL=http://127.0.0.1:8000</code></pre>

<p>Start the frontend:</p>

<pre><code>npm run dev</code></pre>

<p>
  Frontend:
  <a href="http://localhost:5173">http://localhost:5173</a>
</p>

<h2>10. API Overview</h2>

<table>
  <thead>
    <tr>
      <th>Module</th>
      <th>Endpoint</th>
      <th>Purpose</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Authentication</td><td><code>/api/auth/login</code></td><td>User login.</td></tr>
    <tr><td>Authentication</td><td><code>/api/auth/register</code></td><td>User registration.</td></tr>
    <tr><td>Products</td><td><code>/api/products/</code></td><td>Retrieve products.</td></tr>
    <tr><td>Products</td><td><code>/api/products/categories</code></td><td>Retrieve categories.</td></tr>
    <tr><td>Inventory</td><td><code>/api/inventory/restock</code></td><td>Restock products.</td></tr>
    <tr><td>Sales</td><td><code>/api/sales/</code></td><td>Retrieve sales.</td></tr>
    <tr><td>Sales</td><td><code>/api/sales/reports/summary</code></td><td>Sales summary.</td></tr>
    <tr><td>Membership</td><td><code>/api/membership/</code></td><td>Membership management.</td></tr>
    <tr><td>Coupons</td><td><code>/api/coupons/validate</code></td><td>Validate coupons.</td></tr>
    <tr><td>Upload</td><td><code>/api/upload/</code></td><td>Upload product images.</td></tr>
  </tbody>
</table>

<p>
  For complete API documentation, visit <code>/docs</code>
  on the running backend.
</p>

<h2>11. Development Progress</h2>

<table>
  <thead>
    <tr>
      <th>Component</th>
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr><td>Customer website</td><td>Implemented and locally tested.</td></tr>
    <tr><td>Admin dashboard</td><td>Implemented and locally tested.</td></tr>
    <tr><td>Backend API</td><td>Running locally.</td></tr>
    <tr><td>MariaDB database</td><td>Fresh local database configured.</td></tr>
    <tr><td>Product catalogue</td><td>Imported and tested.</td></tr>
    <tr><td>Product images</td><td>Local image serving configured.</td></tr>
    <tr><td>User authentication</td><td>Tested locally.</td></tr>
    <tr><td>Inventory management</td><td>Tested locally.</td></tr>
    <tr><td>Sales and checkout</td><td>Tested locally.</td></tr>
    <tr><td>Membership system</td><td>Tested locally.</td></tr>
    <tr><td>Sales analytics</td><td>Implemented; further testing needed.</td></tr>
    <tr><td>Research datasets</td><td>Selected for planned experiments.</td></tr>
    <tr><td>YOLO integration</td><td>Planned.</td></tr>
    <tr><td>Demand forecasting</td><td>Planned.</td></tr>
    <tr><td>Replenishment simulation</td><td>Planned.</td></tr>
  </tbody>
</table>

<h2>12. Future Improvements</h2>

<p>
  There are still several things I would like to improve as I continue
  developing AMS Mart and working on the research.
</p>

<ul>
  <li>
    Integrate a YOLO model for detecting and counting products
    in supermarket shelf images.
  </li>
  <li>
    Add a human verification step to review and correct detected
    product counts.
  </li>
  <li>
    Explore demand forecasting using historical retail sales data.
  </li>
  <li>
    Develop an inventory replenishment module that uses verified
    stock information and forecasted demand.
  </li>
  <li>
    Evaluate different replenishment approaches through simulation.
  </li>
  <li>
    Improve sales analytics and inventory visualizations.
  </li>
  <li>
    Explore additional features that can make the system more useful
    for supermarket operations.
  </li>
</ul>

<h2>13. What I Have Learned</h2>

<p>
  Working on AMS Mart has helped me gain practical experience in
  several areas:
</p>

<ul>
  <li>Building a full-stack web application using React and FastAPI.</li>
  <li>Designing and managing relational databases.</li>
  <li>Developing REST APIs and connecting frontend applications.</li>
  <li>Implementing authentication and role-based access.</li>
  <li>Managing product information, inventory, and sales transactions.</li>
  <li>Using Git and GitHub to manage source code.</li>
  <li>Setting up a local development environment.</li>
  <li>Understanding how data science can be applied to business problems.</li>
</ul>

<p>
  More importantly, this project has given me a practical starting
  point for exploring computer vision, demand forecasting, and
  data-driven inventory management.
</p>

<hr>

<div align="center">

  <p>
    <a href="https://github.com/Limchheanggg/SuperMarket-Management">
      GitHub Repository
    </a>
  </p>

</div>
