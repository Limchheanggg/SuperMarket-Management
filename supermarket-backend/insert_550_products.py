"""
FreshMart — 550 Products based on Lucky Supermarket Cambodia
"""
import sys
sys.path.insert(0, '.')
from app.core.database import SessionLocal
from sqlalchemy import text

db = SessionLocal()

print("=" * 60)
print("  FreshMart — 550 Product Insert")
print("=" * 60)

print("\n🔄 Clearing old data...")
db.execute(text("SET FOREIGN_KEY_CHECKS = 0"))
for tbl in ["SaleItem","Sale","Inventory","Product","Category"]:
    try:
        db.execute(text(f"DELETE FROM {tbl}"))
    except: pass
db.execute(text("SET FOREIGN_KEY_CHECKS = 1"))
db.commit()

print("📂 Creating 10 categories...")
categories = [
    (1,"Fresh Fruits"),(2,"Fresh Vegetables"),(3,"Meat & Seafood"),
    (4,"Dairy, Chilled & Eggs"),(5,"Rice & Grains"),(6,"Cooking Essentials"),
    (7,"Noodles & Instant Food"),(8,"Snacks & Beverages"),
    (9,"Frozen Foods"),(10,"Household & Personal Care"),
]
for cid, cname in categories:
    db.execute(text("INSERT INTO Category (Category_ID, Category_Name) VALUES (:id,:name)"),{"id":cid,"name":cname})
db.commit()

count = 0
def add(barcode,name,cat_id,brand,unit,price,weight=None,reorder=15,perishable=0,desc=""):
    global count
    try:
        db.execute(text("""
            INSERT INTO Product (Barcode,Name,Description,Category_ID,Brand,Unit,Unit_Price,Unit_Mass_Kg,Reorder_Level,Is_Perishable)
            VALUES (:bc,:n,:d,:c,:b,:u,:p,:w,:r,:pe)
        """),{"bc":barcode,"n":name,"d":desc,"c":cat_id,"b":brand,"u":unit,"p":price,"w":weight,"r":reorder,"pe":perishable})
        count += 1
    except: pass

# CAT 1 — FRESH FRUITS
print("\n🍎 Cat 1: Fresh Fruits...")
fruits_data = [
    ("FR001","Joan Banana Cavendish","Piseth","1kg",1.39,1.0,120),("FR002","Piseth Banana","Piseth","1kg",1.35,1.0,130),
    ("FR003","Purple Dragon Fruit","Lucky","1kg",2.49,1.0,70),("FR004","Mango Keo Romeat","Lucky","1kg",2.29,1.0,80),
    ("FR005","Pineapple","Lucky","1pc",1.15,1.2,90),("FR006","Watermelon Red","Lucky","1pc",2.99,3.0,60),
    ("FR007","Papaya Ripe","Lucky","1pc",1.45,1.5,75),("FR008","Orange China","Lucky","1kg",2.15,1.0,65),
    ("FR009","Apple Fuji","Lucky","1kg",3.49,1.0,50),("FR010","Guava White","Lucky","1kg",1.85,1.0,70),
    ("FR011","Lychee","Lucky","0.5kg",2.80,0.5,55),("FR012","Rambutan","Lucky","0.5kg",1.95,0.5,65),
    ("FR013","Mangosteen","Lucky","0.5kg",2.45,0.5,50),("FR014","Jackfruit","Lucky","1pc",3.50,4.0,40),
    ("FR015","Coconut Young","Lucky","1pc",1.25,1.2,85),("FR016","Banana Pisang","Piseth","1kg",1.45,1.0,110),
    ("FR017","Grapes Red","Lucky","0.5kg",3.25,0.5,45),("FR018","Strawberry","Lucky","0.25kg",2.90,0.25,40),
    ("FR019","Kiwi","Lucky","0.5kg",2.75,0.5,35),("FR020","Pear","Lucky","1kg",2.85,1.0,50),
    ("FR021","Lemon","Lucky","0.5kg",1.35,0.5,70),("FR022","Lime Local","Lucky","0.3kg",0.85,0.3,90),
    ("FR023","Avocado","Lucky","1pc",1.10,0.3,60),("FR024","Passion Fruit","Lucky","0.5kg",2.20,0.5,55),
    ("FR025","Star Fruit","Lucky","1kg",1.75,1.0,65),("FR026","Sapodilla","Lucky","1kg",1.95,1.0,50),
    ("FR027","Durian Monthong","Lucky","1kg",5.99,1.0,30),("FR028","Longan","Lucky","0.5kg",2.10,0.5,60),
    ("FR029","Pomelo","Lucky","1pc",2.45,1.5,45),("FR030","Soursop","Lucky","1pc",2.80,2.0,35),
    ("FR031","Banana Lady Finger","Piseth","1kg",1.55,1.0,95),("FR032","Apple Green","Lucky","1kg",3.29,1.0,40),
    ("FR033","Blueberry","Lucky","0.15kg",3.50,0.15,30),("FR034","Cherry","Lucky","0.25kg",4.20,0.25,25),
    ("FR035","Cantaloupe","Lucky","1pc",2.35,1.8,50),("FR036","Honeydew Melon","Lucky","1pc",2.65,2.0,45),
    ("FR037","Dragon Fruit White","Lucky","1kg",2.15,1.0,65),("FR038","Mango Local","Lucky","1kg",2.45,1.0,55),
    ("FR039","Tamarind","Lucky","0.5kg",1.65,0.5,70),("FR040","Custard Apple","Lucky","1pc",1.85,0.8,50),
    ("FR041","Banana Bunch Small","Piseth","1kg",1.25,1.0,100),("FR042","Grapes Green","Lucky","0.5kg",3.15,0.5,40),
    ("FR043","Orange Navel","Lucky","1kg",2.35,1.0,60),("FR044","Plum","Lucky","0.5kg",2.80,0.5,35),
    ("FR045","Peach","Lucky","0.5kg",2.95,0.5,30),
]
for d in fruits_data:
    add(d[0],d[1],1,d[2],d[3],d[4],d[5],d[6],1)
db.commit()
print(f"  ✅ {count} total")

# CAT 2 — FRESH VEGETABLES
prev=count
print("\n🥬 Cat 2: Fresh Vegetables...")
vegs=[
    ("VG001","Morning Glory Bunch","Local","bunch",0.45,0.25,80),("VG002","Water Spinach 250g","Local","pack",0.50,0.25,80),
    ("VG003","Chinese Broccoli","Local","bunch",0.75,0.30,70),("VG004","Bok Choy Baby 300g","Local","pack",0.90,0.30,65),
    ("VG005","White Cabbage 1kg","Local","piece",0.80,1.00,60),("VG006","Chinese Cabbage","Local","piece",0.85,0.80,55),
    ("VG007","Broccoli Head","Local","piece",1.45,0.40,50),("VG008","Cauliflower","Local","piece",1.50,0.50,45),
    ("VG009","Spinach 200g","Local","pack",0.75,0.20,70),("VG010","Iceberg Lettuce","Local","piece",0.95,0.30,55),
    ("VG011","Bean Sprouts 300g","Local","pack",0.45,0.30,80),("VG012","Long Beans 300g","Local","pack",0.55,0.30,70),
    ("VG013","French Beans 250g","Local","pack",1.15,0.25,55),("VG014","Eggplant Purple 500g","Local","pack",0.75,0.50,65),
    ("VG015","Cucumber 500g","Local","pack",0.65,0.50,75),("VG016","Bitter Melon 500g","Local","pack",0.75,0.50,60),
    ("VG017","Winter Melon 1pc","Local","piece",1.45,2.00,35),("VG018","Pumpkin 1pc","Local","piece",1.15,1.00,45),
    ("VG019","Tomato Red 500g","Local","pack",0.95,0.50,70),("VG020","Cherry Tomato 250g","Local","pack",1.45,0.25,55),
    ("VG021","Bell Pepper Red 2pcs","Local","pack",1.45,0.30,50),("VG022","Bell Pepper Yellow 2pcs","Local","pack",1.45,0.30,45),
    ("VG023","Bell Pepper Green 2pcs","Local","pack",0.95,0.30,50),("VG024","Chili Red 100g","Local","pack",0.45,0.10,80),
    ("VG025","Chili Bird Eye 50g","Local","pack",0.35,0.05,85),("VG026","Garlic 200g","Local","pack",0.75,0.20,75),
    ("VG027","Red Onion 500g","Local","pack",0.85,0.50,70),("VG028","White Onion 500g","Local","pack",0.95,0.50,65),
    ("VG029","Spring Onion 100g","Local","bunch",0.35,0.10,90),("VG030","Shallot 200g","Local","pack",0.65,0.20,75),
    ("VG031","Ginger 200g","Local","pack",0.65,0.20,70),("VG032","Galangal 200g","Local","pack",0.75,0.20,60),
    ("VG033","Lemongrass 3 stalks","Local","bunch",0.45,0.15,80),("VG034","Kaffir Lime Leaves 20g","Local","pack",0.35,0.02,85),
    ("VG035","Turmeric Fresh 100g","Local","pack",0.55,0.10,65),("VG036","Coriander 50g","Local","bunch",0.35,0.05,90),
    ("VG037","Mint Leaves 50g","Local","bunch",0.35,0.05,85),("VG038","Basil Thai 50g","Local","bunch",0.35,0.05,85),
    ("VG039","Celery 200g","Local","bunch",0.55,0.20,65),("VG040","Carrot 500g","Local","pack",0.75,0.50,70),
    ("VG041","White Radish 500g","Local","pack",0.65,0.50,65),("VG042","Sweet Potato Orange 500g","Local","pack",0.75,0.50,60),
    ("VG043","Sweet Potato Purple 500g","Local","pack",0.85,0.50,55),("VG044","Cassava 500g","Local","pack",0.55,0.50,55),
    ("VG045","Corn Sweet 2pcs","Local","pack",0.85,0.40,60),("VG046","Baby Corn 200g","Local","pack",1.15,0.20,50),
    ("VG047","Mushroom Oyster 200g","Local","pack",1.45,0.20,50),("VG048","Mushroom Shiitake 150g","Local","pack",2.25,0.15,40),
    ("VG049","Mushroom King Oyster 200g","Local","pack",1.95,0.20,40),("VG050","Mushroom Button 200g","Local","pack",1.85,0.20,45),
    ("VG051","Asparagus 250g","Local","pack",2.45,0.25,35),("VG052","Snow Peas 200g","Local","pack",1.25,0.20,45),
    ("VG053","Green Peas 200g","Local","pack",0.95,0.20,50),("VG054","Lotus Root 500g","Local","pack",1.15,0.50,45),
    ("VG055","Banana Blossom 1pc","Local","piece",0.85,0.50,50),("VG056","Green Jackfruit 500g","Local","pack",1.15,0.50,40),
    ("VG057","Bamboo Shoot 300g","Local","pack",0.95,0.30,45),("VG058","Water Chestnut 300g","Local","pack",1.15,0.30,40),
    ("VG059","Taro 500g","Local","pack",0.85,0.50,50),("VG060","Yam 500g","Local","pack",0.95,0.50,45),
    ("VG061","Potato 1kg","Local","pack",1.15,1.00,55),("VG062","Red Cabbage 1pc","Local","piece",1.15,0.80,40),
    ("VG063","Zucchini 500g","Local","pack",1.45,0.50,35),("VG064","Beetroot 500g","Local","pack",1.25,0.50,35),
    ("VG065","Bok Choy Large 400g","Local","bunch",0.85,0.40,60),
]
for d in vegs:
    add(d[0],d[1],2,d[2],d[3],d[4],d[5],d[6],1)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 3 — MEAT & SEAFOOD
prev=count
print("\n🥩 Cat 3: Meat & Seafood...")
meat=[
    ("MS001","Pork Belly Slice 500g","Lucky Fresh","pack",4.25,0.5,10),("MS002","Pork Shoulder 500g","Lucky Fresh","pack",3.75,0.5,10),
    ("MS003","Pork Minced 500g","Lucky Fresh","pack",3.50,0.5,12),("MS004","Pork Ribs 500g","Lucky Fresh","pack",4.75,0.5,8),
    ("MS005","Pork Leg Bone-in 500g","Lucky Fresh","pack",3.25,0.5,10),("MS006","Pork Liver 300g","Lucky Fresh","pack",2.50,0.3,10),
    ("MS007","Pork Intestine 300g","Lucky Fresh","pack",2.25,0.3,8),("MS008","Pork Skin 300g","Lucky Fresh","pack",1.95,0.3,8),
    ("MS009","Pork Sausage CP 500g","CP Foods","pack",3.95,0.5,12),("MS010","Pork Ham Slice 200g","CP Foods","pack",2.75,0.2,10),
    ("MS011","Chicken Whole 1.2kg","CP Foods","piece",4.50,1.2,10),("MS012","Chicken Breast Fillet 500g","CP Foods","pack",3.75,0.5,12),
    ("MS013","Chicken Thigh Bone-in 500g","CP Foods","pack",2.95,0.5,12),("MS014","Chicken Drumstick 500g","CP Foods","pack",2.75,0.5,12),
    ("MS015","Chicken Wing 500g","CP Foods","pack",2.95,0.5,12),("MS016","Chicken Minced 500g","CP Foods","pack",3.25,0.5,10),
    ("MS017","Chicken Liver 300g","CP Foods","pack",1.75,0.3,10),("MS018","Duck Whole 1.5kg","Lucky Fresh","piece",6.50,1.5,6),
    ("MS019","Duck Breast 400g","Lucky Fresh","pack",5.25,0.4,8),("MS020","Beef Slice 300g","Lucky Fresh","pack",5.50,0.3,8),
    ("MS021","Beef Minced 300g","Lucky Fresh","pack",4.95,0.3,8),("MS022","Beef Brisket 300g","Lucky Fresh","pack",5.75,0.3,6),
    ("MS023","Beef Striploin 300g","Lucky Fresh","pack",7.50,0.3,5),("MS024","Beef Rib 300g","Lucky Fresh","pack",6.50,0.3,6),
    ("MS025","Beef Tendon 300g","Lucky Fresh","pack",4.25,0.3,8),("MS026","Tilapia Fish 500g","Local","pack",2.15,0.5,10),
    ("MS027","Catfish 500g","Local","pack",2.45,0.5,10),("MS028","Snakehead Fish 500g","Local","pack",3.25,0.5,8),
    ("MS029","Sea Bass 500g","Local","pack",4.95,0.5,6),("MS030","Red Snapper 500g","Local","pack",4.50,0.5,6),
    ("MS031","Mackerel 500g","Local","pack",3.75,0.5,8),("MS032","Pomfret 500g","Local","pack",5.50,0.5,5),
    ("MS033","Squid 500g","Local","pack",4.25,0.5,8),("MS034","Octopus 500g","Local","pack",5.75,0.5,5),
    ("MS035","Cuttlefish 500g","Local","pack",4.50,0.5,6),("MS036","Tiger Shrimp 500g","Local","pack",7.50,0.5,5),
    ("MS037","White Shrimp 500g","Local","pack",5.75,0.5,6),("MS038","Crab Mud 500g","Local","pack",6.50,0.5,5),
    ("MS039","Crab Blue 500g","Local","pack",5.25,0.5,6),("MS040","Clam 500g","Local","pack",3.25,0.5,8),
    ("MS041","Mussel 500g","Local","pack",2.95,0.5,8),("MS042","Oyster 300g","Local","pack",4.75,0.3,6),
    ("MS043","Scallop 300g","Local","pack",6.75,0.3,5),("MS044","Lobster 500g","Local","pack",12.50,0.5,3),
    ("MS045","Salmon Fillet 200g","Norway","pack",6.50,0.2,6),("MS046","Tuna Steak 200g","Local","pack",4.75,0.2,6),
    ("MS047","Vienna Sausage CP 500g","CP Foods","pack",3.50,0.5,12),("MS048","Chicken Nuggets CP 500g","CP Foods","pack",3.95,0.5,12),
    ("MS049","Fish Ball 300g","Local","pack",1.95,0.3,12),("MS050","Beef Ball 300g","Local","pack",2.25,0.3,10),
    ("MS051","Shrimp Ball 300g","Local","pack",2.50,0.3,10),("MS052","Luncheon Meat Maling 397g","Maling","can",2.75,0.4,12),
    ("MS053","Corned Beef Ox 340g","Ox Brand","can",2.50,0.34,10),("MS054","Canned Sardine 155g","Lucky Star","can",0.85,0.155,15),
    ("MS055","Canned Tuna Ayam 185g","Ayam Brand","can",1.50,0.185,15),
]
for d in meat:
    add(d[0],d[1],3,d[2],d[3],d[4],d[5],d[6],1)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 4 — DAIRY, CHILLED & EGGS
prev=count
print("\n🥛 Cat 4: Dairy, Chilled & Eggs...")
dairy=[
    ("DC001","Fresh Whole Milk Anchor 1L","Anchor","bottle",2.25,1.0,15,1),
    ("DC002","UHT Full Cream Dutch Lady 1L","Dutch Lady","pack",1.45,1.0,20,0),
    ("DC003","UHT Dutch Lady 200ml","Dutch Lady","pack",0.39,0.2,30,0),
    ("DC004","UHT Meiji Full Cream 1L","Meiji","pack",1.65,1.0,18,0),
    ("DC005","UHT Meiji Low Fat 1L","Meiji","pack",1.75,1.0,15,0),
    ("DC006","UHT Dutch Lady Chocolate 200ml","Dutch Lady","pack",0.45,0.2,25,0),
    ("DC007","Soy Milk Vitasoy 1L","Vitasoy","pack",1.35,1.0,15,0),
    ("DC008","Oat Milk 1L","Oatly","pack",2.95,1.0,10,0),
    ("DC009","Almond Milk 1L","Blue Diamond","pack",3.25,1.0,8,0),
    ("DC010","Condensed Milk Carnation 395g","Carnation","can",1.15,0.395,15,0),
    ("DC011","Evaporated Milk Carnation 370g","Carnation","can",0.95,0.37,15,0),
    ("DC012","Plain Yogurt Dutch Lady 500g","Dutch Lady","cup",1.95,0.5,12,1),
    ("DC013","Strawberry Yogurt Meiji 125g","Meiji","cup",0.75,0.125,15,1),
    ("DC014","Mango Yogurt Meiji 125g","Meiji","cup",0.75,0.125,15,1),
    ("DC015","Greek Yogurt 150g","Chobani","cup",1.95,0.15,10,1),
    ("DC016","Yakult Probiotic 5pcs","Yakult","pack",1.25,0.325,15,0),
    ("DC017","Cheddar Slices Emborg 200g","Emborg","pack",3.25,0.2,10,1),
    ("DC018","Mozzarella Block 250g","Elle & Vire","pack",4.75,0.25,8,1),
    ("DC019","Cream Cheese Philadelphia 180g","Philadelphia","pack",3.75,0.18,8,1),
    ("DC020","Parmesan Grated 60g","Kraft","pack",2.95,0.06,8,0),
    ("DC021","Processed Cheese Kraft 250g","Kraft","pack",2.50,0.25,10,1),
    ("DC022","Butter Unsalted Anchor 200g","Anchor","pack",2.75,0.2,10,1),
    ("DC023","Butter Salted Lurpak 200g","Lurpak","pack",3.25,0.2,8,1),
    ("DC024","Butter President 250g","President","pack",2.95,0.25,8,1),
    ("DC025","Margarine Blue Band 250g","Blue Band","pack",1.45,0.25,12,1),
    ("DC026","Whipping Cream Emborg 250ml","Emborg","pack",2.25,0.25,8,1),
    ("DC027","Cooking Cream Elle & Vire 200ml","Elle & Vire","pack",1.95,0.2,8,1),
    ("DC028","Fresh Eggs 10pcs","Lucky Farm","tray",1.75,0.6,20,1),
    ("DC029","Fresh Eggs 30pcs","Lucky Farm","tray",4.50,1.8,10,1),
    ("DC030","Omega-3 Eggs 10pcs","Lucky Farm","tray",2.25,0.6,12,1),
    ("DC031","Salted Egg 6pcs","Lucky Farm","pack",1.95,0.36,12,1),
    ("DC032","Century Egg 4pcs","Local","pack",1.25,0.2,15,0),
    ("DC033","Quail Egg 20pcs","Local","pack",1.15,0.3,15,1),
    ("DC034","Fresh Orange Juice 1L","Tropicana","bottle",2.75,1.0,10,1),
    ("DC035","Fresh Apple Juice 1L","Tropicana","bottle",2.75,1.0,10,1),
    ("DC036","Tofu Soft 300g","Local","pack",0.75,0.3,15,1),
    ("DC037","Tofu Firm 300g","Local","pack",0.85,0.3,15,1),
    ("DC038","Tofu Silken 300g","Local","pack",0.95,0.3,12,1),
    ("DC039","Tempeh 300g","Local","pack",0.95,0.3,12,1),
    ("DC040","Miso Paste 400g","Hikari","pack",2.95,0.4,10,0),
    ("DC041","Butter Almond 350g","Skippy","jar",4.50,0.35,8,0),
    ("DC042","Peanut Butter Skippy 340g","Skippy","jar",2.95,0.34,10,0),
    ("DC043","Chocolate Spread Nutella 350g","Nutella","jar",4.95,0.35,8,0),
    ("DC044","Jam Strawberry Smuckers 340g","Smuckers","jar",2.75,0.34,10,0),
    ("DC045","Jam Mixed Fruit 340g","Smuckers","jar",2.75,0.34,10,0),
    ("DC046","Ice Cream Vanilla 1L Walls","Wall's","tub",3.50,1.0,10,1),
    ("DC047","Ice Cream Chocolate 1L Walls","Wall's","tub",3.50,1.0,10,1),
    ("DC048","Paddle Pop 65ml","Wall's","piece",0.55,0.065,20,1),
    ("DC049","Cornetto Classic 110ml","Wall's","piece",1.15,0.11,15,1),
    ("DC050","Mochi Ice Cream 6pcs","Yukimi","pack",3.25,0.18,10,1),
]
for d in dairy:
    add(d[0],d[1],4,d[2],d[3],d[4],d[5],d[6],d[7])
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 5 — RICE & GRAINS
prev=count
print("\n🍚 Cat 5: Rice & Grains...")
rice=[
    ("RG001","Jasmine Rice 5kg Angkor Pearl","Angkor Pearl","pack",7.50,5.0,15),
    ("RG002","Jasmine Rice 10kg Angkor Pearl","Angkor Pearl","pack",14.50,10.0,8),
    ("RG003","Jasmine Rice 25kg Angkor Pearl","Angkor Pearl","pack",32.00,25.0,3),
    ("RG004","Fragrant White Rice 5kg Lucky","Lucky Brand","pack",6.80,5.0,12),
    ("RG005","Jasmine Rice 5kg Phka Malis","Phka Malis","pack",8.50,5.0,10),
    ("RG006","Jasmine Rice 5kg Rumduol","Rumduol","pack",7.95,5.0,10),
    ("RG007","Brown Rice 2kg","NatureFarm","pack",4.25,2.0,10),
    ("RG008","Brown Rice 5kg","NatureFarm","pack",9.50,5.0,6),
    ("RG009","Glutinous Rice 1kg","Lucky Brand","pack",2.15,1.0,12),
    ("RG010","Black Glutinous Rice 500g","Lucky Brand","pack",1.95,0.5,10),
    ("RG011","Porridge Rice 1kg","Local","pack",1.75,1.0,12),
    ("RG012","Thai Jasmine Rice 5kg","Royal Umbrella","pack",7.95,5.0,10),
    ("RG013","Basmati Rice 1kg","Tilda","pack",3.25,1.0,8),
    ("RG014","Red Rice 1kg","NatureFarm","pack",2.95,1.0,8),
    ("RG015","Parboiled Rice 5kg","Lucky Brand","pack",6.50,5.0,10),
    ("RG016","Rice Vermicelli 400g","Angkor","pack",1.15,0.4,15),
    ("RG017","Yellow Egg Noodle 400g","Angkor","pack",1.05,0.4,15),
    ("RG018","Glass Noodle Mung Bean 200g","Double Dragon","pack",0.90,0.2,15),
    ("RG019","Rice Stick Noodle 400g","Angkor","pack",1.05,0.4,15),
    ("RG020","Udon Noodle 200g","Myojo","pack",0.95,0.2,12),
    ("RG021","Soba Noodle 300g","Hakubaku","pack",2.25,0.3,10),
    ("RG022","All-Purpose Flour 1kg","Lucky Brand","pack",0.95,1.0,15),
    ("RG023","All-Purpose Flour 5kg","Lucky Brand","pack",4.25,5.0,8),
    ("RG024","Bread Flour 1kg","Lucky Brand","pack",1.25,1.0,12),
    ("RG025","Corn Flour 500g","Maizena","pack",1.15,0.5,12),
    ("RG026","Rice Flour 500g","Lucky Brand","pack",0.85,0.5,12),
    ("RG027","Tapioca Starch 500g","Lucky Brand","pack",0.95,0.5,12),
    ("RG028","Rolled Oats 500g Quaker","Quaker","pack",2.75,0.5,10),
    ("RG029","Oatmeal Instant 3-in-1 10pcs","Quaker","box",3.25,0.3,10),
    ("RG030","Wheat Bran 500g","Lucky Brand","pack",1.45,0.5,8),
    ("RG031","Breadcrumbs 200g","Lucky Brand","pack",0.95,0.2,10),
    ("RG032","Panko Breadcrumbs 200g","Kikkoman","pack",1.75,0.2,8),
    ("RG033","Semolina 500g","Lucky Brand","pack",1.25,0.5,8),
    ("RG034","Mixed Grain 500g","NatureFarm","pack",2.25,0.5,8),
    ("RG035","Quinoa 500g","NatureFarm","pack",4.95,0.5,6),
]
for d in rice:
    add(d[0],d[1],5,d[2],d[3],d[4],d[5],d[6],0)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 6 — COOKING ESSENTIALS
prev=count
print("\n🧄 Cat 6: Cooking Essentials...")
cooking=[
    ("CE001","Vegetable Oil Meizan 1L","Meizan","bottle",1.75,1.0,15),("CE002","Vegetable Oil Meizan 2L","Meizan","bottle",3.15,2.0,10),
    ("CE003","Vegetable Oil Meizan 5L","Meizan","bottle",7.25,5.0,6),("CE004","Palm Oil Lucky Brand 1L","Lucky","bottle",1.55,1.0,12),
    ("CE005","Sunflower Oil 1L","Suraj","bottle",2.45,1.0,10),("CE006","Sesame Oil Kadoya 150ml","Kadoya","bottle",2.15,0.15,12),
    ("CE007","Sesame Oil Kadoya 330ml","Kadoya","bottle",3.95,0.33,8),("CE008","Olive Oil Borges 250ml","Borges","bottle",5.25,0.25,8),
    ("CE009","Coconut Oil 500ml","Nature's Way","bottle",3.75,0.5,8),("CE010","Peanut Oil 1L","Lucky","bottle",2.95,1.0,8),
    ("CE011","Oyster Sauce Maekrua 300ml","Maekrua","bottle",1.45,0.3,15),("CE012","Oyster Sauce Maekrua 700ml","Maekrua","bottle",2.75,0.7,12),
    ("CE013","Oyster Sauce Lee Kum Kee 510g","Lee Kum Kee","bottle",3.25,0.51,10),("CE014","Soy Sauce Healthy Boy 700ml","Healthy Boy","bottle",1.15,0.7,15),
    ("CE015","Dark Soy Sauce Pearl River 500ml","Pearl River","bottle",1.35,0.5,12),("CE016","Light Soy Sauce Kikkoman 150ml","Kikkoman","bottle",1.95,0.15,12),
    ("CE017","Fish Sauce Tiparos 700ml","Tiparos","bottle",1.75,0.7,15),("CE018","Fish Sauce Megachef 300ml","Megachef","bottle",2.25,0.3,10),
    ("CE019","Ketchup Heinz 340g","Heinz","bottle",1.15,0.34,15),("CE020","Chili Sauce Maggi 340g","Maggi","bottle",1.05,0.34,15),
    ("CE021","Sriracha Huy Fong 455g","Huy Fong","bottle",2.45,0.455,10),("CE022","Sweet Chili Sauce Maepranom 250ml","Maepranom","bottle",1.25,0.25,12),
    ("CE023","Hoisin Sauce Lee Kum Kee 240ml","Lee Kum Kee","bottle",1.75,0.24,10),("CE024","Mayonnaise Best Foods 200ml","Best Foods","jar",1.45,0.2,12),
    ("CE025","Mayonnaise Kewpie 200ml","Kewpie","bottle",2.25,0.2,10),("CE026","Worcestershire Sauce 290ml","Lea Perrins","bottle",2.95,0.29,8),
    ("CE027","Vinegar White 750ml","Lucky","bottle",0.85,0.75,10),("CE028","Coconut Milk Chaokoh 400ml","Chaokoh","can",1.15,0.4,15),
    ("CE029","Coconut Cream Aroy-D 400ml","Aroy-D","can",1.25,0.4,12),("CE030","White Sugar 1kg","Lucky","pack",0.85,1.0,20),
    ("CE031","White Sugar 5kg","Lucky","pack",3.95,5.0,10),("CE032","Brown Sugar 500g","Lucky","pack",0.95,0.5,12),
    ("CE033","Palm Sugar 500g","Local","pack",1.15,0.5,10),("CE034","Salt Iodized 1kg","Windsor","pack",0.45,1.0,20),
    ("CE035","Sea Salt 500g","Lucky","pack",0.65,0.5,12),("CE036","MSG Ajinomoto 400g","Ajinomoto","pack",0.75,0.4,18),
    ("CE037","Chicken Stock Knorr 200g","Knorr","pack",1.15,0.2,15),("CE038","Pork Stock Knorr 200g","Knorr","pack",1.15,0.2,15),
    ("CE039","Beef Stock Knorr 200g","Knorr","pack",1.15,0.2,12),("CE040","Black Pepper Powder 50g","Lucky","pack",0.85,0.05,15),
    ("CE041","White Pepper Powder 50g","Lucky","pack",0.85,0.05,15),("CE042","Curry Powder 100g","Shan","pack",0.95,0.1,12),
    ("CE043","Turmeric Powder 50g","Lucky","pack",0.65,0.05,12),("CE044","Paprika Powder 50g","Lucky","pack",0.85,0.05,10),
    ("CE045","Cinnamon Powder 50g","Lucky","pack",0.75,0.05,10),("CE046","Five Spice Powder 50g","Lucky","pack",0.85,0.05,10),
    ("CE047","Chili Flakes 50g","Lucky","pack",0.75,0.05,12),("CE048","Garlic Powder 50g","Lucky","pack",0.85,0.05,12),
    ("CE049","Dried Basil 20g","Lucky","pack",0.65,0.02,10),("CE050","Bay Leaves 10g","Lucky","pack",0.45,0.01,10),
    ("CE051","Baking Powder 100g","Lucky","pack",0.75,0.1,10),("CE052","Baking Soda 200g","Arm & Hammer","pack",0.65,0.2,10),
    ("CE053","Yeast Dry 100g","Bruggeman","pack",0.95,0.1,10),("CE054","Vanilla Extract 60ml","Lucky","bottle",0.95,0.06,10),
    ("CE055","Cocoa Powder 200g","Lucky","pack",1.75,0.2,10),("CE056","Desiccated Coconut 200g","Lucky","pack",0.95,0.2,10),
    ("CE057","Rice Wine Vinegar 500ml","Koon Chun","bottle",1.15,0.5,10),("CE058","Apple Cider Vinegar 500ml","Bragg","bottle",3.25,0.5,8),
    ("CE059","Mirin 300ml","Kikkoman","bottle",1.75,0.3,10),("CE060","Sake Cooking 300ml","Kikkoman","bottle",2.25,0.3,8),
    ("CE061","Tamarind Paste 400g","Local","jar",1.25,0.4,10),("CE062","Shrimp Paste 200g","Pantainorasingh","jar",1.15,0.2,12),
    ("CE063","Fermented Black Bean 200g","Lee Kum Kee","jar",1.45,0.2,8),("CE064","Dried Shrimp 100g","Local","pack",1.95,0.1,10),
    ("CE065","Dried Mushroom 50g","Local","pack",1.75,0.05,10),("CE066","Tomato Paste Hunts 400g","Hunt's","can",1.05,0.4,12),
    ("CE067","Canned Tomato 400g","Mutti","can",0.95,0.4,12),("CE068","Pandan Extract 60ml","Koepoe","bottle",0.85,0.06,12),
    ("CE069","Red Food Coloring 25ml","Lucky","bottle",0.45,0.025,10),("CE070","Gelatin 10g x5","Lucky","pack",0.75,0.05,10),
]
for d in cooking:
    add(d[0],d[1],6,d[2],d[3],d[4],d[5],d[6],0)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 7 — NOODLES & INSTANT FOOD
prev=count
print("\n🍜 Cat 7: Noodles & Instant Food...")
noodles=[
    ("NI001","Mama Tom Yum Noodle 90g","Mama","pack",0.45,0.09,30),("NI002","Mama Shrimp Creamy 90g","Mama","pack",0.45,0.09,30),
    ("NI003","Mama Pork 90g","Mama","pack",0.45,0.09,30),("NI004","Mama Chicken 90g","Mama","pack",0.45,0.09,30),
    ("NI005","Mama Box Tom Yum 55g","Mama","pack",0.49,0.055,25),("NI006","Yum Yum Chicken Noodle 60g","Yum Yum","pack",0.39,0.06,30),
    ("NI007","Yum Yum Tom Yum 60g","Yum Yum","pack",0.39,0.06,30),("NI008","Wai Wai Chicken 75g","Wai Wai","pack",0.38,0.075,30),
    ("NI009","Indomie Mi Goreng 85g","Indomie","pack",0.55,0.085,25),("NI010","Indomie Chicken 70g","Indomie","pack",0.50,0.07,25),
    ("NI011","Indomie Rendang 80g","Indomie","pack",0.55,0.08,22),("NI012","Nissin Cup Seafood 75g","Nissin","pack",0.85,0.075,20),
    ("NI013","Nissin Cup Chicken 75g","Nissin","pack",0.85,0.075,20),("NI014","Nissin Cup Tom Yum 75g","Nissin","pack",0.85,0.075,20),
    ("NI015","Shin Ramyun Nongshim 120g","Nongshim","pack",1.15,0.12,18),("NI016","Jin Ramen Spicy Ottogi 120g","Ottogi","pack",1.05,0.12,18),
    ("NI017","Chapagetti Nongshim 140g","Nongshim","pack",1.25,0.14,15),("NI018","Buldak Fire Noodle 140g","Samyang","pack",1.35,0.14,15),
    ("NI019","Buldak Carbonara 130g","Samyang","pack",1.45,0.13,12),("NI020","Maggi Chicken Noodle 79g","Maggi","pack",0.49,0.079,25),
    ("NI021","Maggi Kari Noodle 79g","Maggi","pack",0.49,0.079,25),("NI022","Spaghetti Barilla 500g","Barilla","pack",1.95,0.5,12),
    ("NI023","Penne Barilla 500g","Barilla","pack",1.95,0.5,12),("NI024","Fettuccine 500g","Barilla","pack",2.15,0.5,10),
    ("NI025","Macaroni 500g","Lucky","pack",1.25,0.5,12),("NI026","Pasta Sauce Tomato Prego 680g","Prego","bottle",2.75,0.68,10),
    ("NI027","Pasta Sauce Bolognese Prego 680g","Prego","bottle",2.95,0.68,10),("NI028","Instant Congee Rice Pork 50g","Khao Tom","pack",0.55,0.05,20),
    ("NI029","Instant Congee Chicken 50g","Khao Tom","pack",0.55,0.05,20),("NI030","Canned Baked Beans Heinz 415g","Heinz","can",1.55,0.415,12),
    ("NI031","Canned Chicken Ayam Brand 160g","Ayam","can",2.15,0.16,10),("NI032","Canned Corn Green Giant 400g","Green Giant","can",1.05,0.4,12),
    ("NI033","Canned Peas Green Giant 400g","Green Giant","can",1.05,0.4,12),("NI034","Canned Mushroom 400g","Lucky","can",0.95,0.4,12),
    ("NI035","Canned Luncheon Pork 340g","Lucky Star","can",1.85,0.34,12),("NI036","Canned Mackerel Tomato 425g","Ayam Brand","can",1.75,0.425,12),
    ("NI037","Instant Tom Yum Paste 50g","Maepranom","pack",0.85,0.05,15),("NI038","Instant Chicken Soup Mix 40g","Knorr","pack",0.75,0.04,15),
    ("NI039","Instant Miso Soup 10pcs","Marukome","box",2.25,0.15,10),("NI040","Rice Vermicelli Angkor 400g","Angkor","pack",1.05,0.4,15),
    ("NI041","Glass Noodle 200g","Lucky","pack",0.85,0.2,15),("NI042","Cellophane Noodle 100g","Lucky","pack",0.65,0.1,15),
    ("NI043","Coconut Juice Foco 520ml","Foco","can",1.25,0.52,15),("NI044","Coconut Milk UHT Kara 200ml","Kara","pack",0.75,0.2,15),
    ("NI045","Oatmeal Quaker Instant 35g x5","Quaker","box",2.25,0.175,10),("NI046","Cream of Wheat 500g","Lucky","pack",1.45,0.5,10),
    ("NI047","Pad Thai Sauce Kit 120g","Maepranom","pack",1.35,0.12,10),("NI048","Green Curry Paste 50g","Maeploy","pack",0.75,0.05,12),
    ("NI049","Red Curry Paste 50g","Maeploy","pack",0.75,0.05,12),("NI050","Massaman Curry Paste 50g","Maeploy","pack",0.75,0.05,12),
    ("NI051","Pho Soup Base 75g","Lucky","pack",0.95,0.075,10),("NI052","Laksa Paste 185g","A1","pack",1.95,0.185,10),
    ("NI053","Rendang Paste 180g","A1","pack",1.95,0.18,10),("NI054","Lucky Me Pancit Canton 80g","Lucky Me","pack",0.55,0.08,20),
    ("NI055","Ibumie Penang Prawn 80g","Ibumie","pack",0.65,0.08,18),
]
for d in noodles:
    add(d[0],d[1],7,d[2],d[3],d[4],d[5],d[6],0)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 8 — SNACKS & BEVERAGES
prev=count
print("\n🧃 Cat 8: Snacks & Beverages...")
snacks=[
    ("SB001","Lays Classic 60g","Lay's","pack",0.79,0.06,20),("SB002","Lays Spicy BBQ 60g","Lay's","pack",0.79,0.06,20),
    ("SB003","Lays Sour Cream 60g","Lay's","pack",0.79,0.06,20),("SB004","Pringles Original 110g","Pringles","pack",2.15,0.11,15),
    ("SB005","Pringles Sour Cream 110g","Pringles","pack",2.15,0.11,15),("SB006","Pringles BBQ 110g","Pringles","pack",2.15,0.11,12),
    ("SB007","Oishi Prawn Cracker 60g","Oishi","pack",0.69,0.06,20),("SB008","Jack N Jill Prawn 60g","Jack n Jill","pack",0.65,0.06,20),
    ("SB009","Cheetos 60g","Frito-Lay","pack",0.89,0.06,15),("SB010","Doritos Nacho 65g","Frito-Lay","pack",0.95,0.065,15),
    ("SB011","Oreo Original 137g","Nabisco","pack",1.15,0.137,18),("SB012","Oreo Double Stuff 157g","Nabisco","pack",1.35,0.157,15),
    ("SB013","Ritz Crackers 200g","Nabisco","pack",1.45,0.2,15),("SB014","Khong Guan Assorted 700g","Khong Guan","pack",3.35,0.7,10),
    ("SB015","Julie's Peanut Butter 190g","Julie's","pack",1.15,0.19,15),("SB016","Marie Biscuits 200g","Garden","pack",0.85,0.2,18),
    ("SB017","Mcvitie's Digestive 250g","Mcvitie's","pack",1.95,0.25,12),("SB018","Jacob's Cream Crackers 200g","Jacob's","pack",1.25,0.2,15),
    ("SB019","Tiger Biscuit 180g","Tiger","pack",0.85,0.18,18),("SB020","Chipsmore Chocolate Chip 163g","Chipsmore","pack",1.45,0.163,15),
    ("SB021","Pocky Chocolate 47g","Glico","pack",0.89,0.047,18),("SB022","Pocky Strawberry 47g","Glico","pack",0.89,0.047,18),
    ("SB023","Pepero Chocolate 50g","Lotte","pack",0.89,0.05,15),("SB024","Pejoy Choco 54g","Glico","pack",1.15,0.054,15),
    ("SB025","Loacker Vanilla Wafer 45g","Loacker","pack",0.75,0.045,15),("SB026","Kit Kat 2F 45g","Nestle","pack",0.95,0.045,18),
    ("SB027","Snickers 52g","Mars","pack",0.95,0.052,18),("SB028","Twix 58g","Mars","pack",0.95,0.058,18),
    ("SB029","M&M Peanut 45g","Mars","pack",1.05,0.045,15),("SB030","Ferrero Rocher 3pcs","Ferrero","pack",1.95,0.0375,12),
    ("SB031","Mentos Fruit 38g","Mentos","pack",0.49,0.038,20),("SB032","Tic Tac Orange 18g","Ferrero","pack",0.55,0.018,20),
    ("SB033","Halls Menthol 9pcs","Halls","pack",0.45,0.032,20),("SB034","Roasted Cashew 200g","Tong Garden","pack",3.45,0.2,10),
    ("SB035","Roasted Peanut 200g","Lucky","pack",0.95,0.2,15),("SB036","Roasted Sunflower Seeds 200g","Tong Garden","pack",1.15,0.2,12),
    ("SB037","Roasted Pistachio 100g","Lucky","pack",3.25,0.1,8),("SB038","Mixed Nuts 150g","Lucky","pack",2.75,0.15,8),
    ("SB039","Dried Mango 100g","Lucky","pack",1.95,0.1,10),("SB040","Dried Cranberry 100g","Lucky","pack",2.25,0.1,10),
    ("SB041","Angkor Beer 330ml Can","Angkor","can",0.89,0.33,20),("SB042","Angkor Beer 640ml Bottle","Angkor","bottle",1.45,0.64,15),
    ("SB043","Cambodia Beer 330ml Can","Cambodia Beer","can",0.85,0.33,20),("SB044","Tiger Beer 330ml Can","Tiger","can",1.05,0.33,18),
    ("SB045","Heineken 330ml Can","Heineken","can",1.45,0.33,15),("SB046","San Miguel 330ml Can","San Miguel","can",0.95,0.33,15),
    ("SB047","Anchor Beer 330ml Can","Anchor","can",0.85,0.33,18),("SB048","Coca-Cola 330ml Can","Coca-Cola","can",0.65,0.33,25),
    ("SB049","Pepsi Cola 330ml Can","Pepsi","can",0.65,0.33,25),("SB050","Sprite 330ml Can","Coca-Cola","can",0.65,0.33,22),
    ("SB051","7-Up 330ml Can","PepsiCo","can",0.65,0.33,22),("SB052","Fanta Orange 330ml Can","Coca-Cola","can",0.65,0.33,20),
    ("SB053","Coca-Cola 1.5L","Coca-Cola","bottle",1.25,1.5,15),("SB054","Pepsi 1.5L","Pepsi","bottle",1.15,1.5,15),
    ("SB055","Est Cola 1.5L","Est","bottle",1.10,1.5,15),("SB056","Red Bull 250ml Can","Red Bull","can",1.15,0.25,18),
    ("SB057","M-150 Energy 150ml","Osotspa","bottle",0.65,0.15,20),("SB058","100 Plus Isotonic 325ml","100 Plus","can",0.75,0.325,15),
    ("SB059","Gatorade Blue Bolt 500ml","Gatorade","bottle",1.25,0.5,12),("SB060","Kulen Water 1.5L","Kulen","bottle",0.49,1.5,25),
    ("SB061","Dasani Water 600ml","Dasani","bottle",0.55,0.6,22),("SB062","Evian Mineral 500ml","Evian","bottle",0.89,0.5,15),
    ("SB063","Perrier Sparkling 330ml","Perrier","bottle",1.45,0.33,10),("SB064","Lipton Iced Tea Lemon 500ml","Lipton","bottle",0.95,0.5,15),
    ("SB065","Pokka Green Tea 350ml","Pokka","bottle",0.89,0.35,15),("SB066","C2 Green Tea Apple 355ml","C2","bottle",0.65,0.355,18),
    ("SB067","Birdy Coffee 180ml Can","Birdy","can",0.75,0.18,18),("SB068","Nescafe Classic 200g","Nestle","jar",5.25,0.2,12),
    ("SB069","3-in-1 Nescafe 20pcs","Nestle","box",3.35,0.28,12),("SB070","Milo 400g","Nestle","pack",4.35,0.4,12),
    ("SB071","Milo UHT 180ml","Nestle","pack",0.49,0.18,20),("SB072","Ovaltine 400g","Ovaltine","pack",3.95,0.4,10),
    ("SB073","Horlicks 500g","Horlicks","pack",5.50,0.5,8),("SB074","Marigold Orange Juice 1L","Marigold","pack",2.15,1.0,10),
    ("SB075","Tropicana Orange 300ml","Tropicana","bottle",0.85,0.3,12),("SB076","Minute Maid Orange 300ml","Coca-Cola","bottle",0.79,0.3,15),
    ("SB077","ABC Coconut Juice 330ml Can","ABC","can",0.69,0.33,18),("SB078","Pokka Lemon Tea 500ml","Pokka","bottle",0.89,0.5,15),
    ("SB079","Ribena Blackcurrant 288ml","Ribena","bottle",0.89,0.288,12),("SB080","Vitagen Cultured Milk 5pcs","Vitagen","pack",1.15,0.375,15),
    ("SB081","Tang Orange Powder 250g","Tang","pack",1.25,0.25,12),("SB082","Nestea Iced Tea Powder 250g","Nestle","pack",1.45,0.25,10),
    ("SB083","Roasted Seaweed 10g x5","Tao Kae Noi","pack",1.95,0.05,15),("SB084","Popcorn Caramel 80g","Lucky","pack",0.95,0.08,15),
    ("SB085","Popcorn Cheese 80g","Lucky","pack",0.95,0.08,15),("SB086","Cream Crackers 200g Khong Guan","Khong Guan","pack",1.15,0.2,15),
    ("SB087","Soda Water Schweppes 325ml","Schweppes","can",0.65,0.325,15),("SB088","Tonic Water Schweppes 325ml","Schweppes","can",0.65,0.325,12),
    ("SB089","Rice Cracker 100g","Lucky","pack",0.75,0.1,15),("SB090","Sapporo Ichiban Noodle 100g","Sapporo","pack",1.15,0.1,15),
]
for d in snacks:
    add(d[0],d[1],8,d[2],d[3],d[4],d[5],d[6],0)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 9 — FROZEN FOODS
prev=count
print("\n🧊 Cat 9: Frozen Foods...")
frozen=[
    ("FZ001","Frozen Chicken Wings CP 1kg","CP Foods","pack",4.35,1.0,10),("FZ002","Frozen Chicken Breast CP 500g","CP Foods","pack",3.65,0.5,12),
    ("FZ003","Frozen Whole Chicken 1.2kg","CP Foods","piece",5.25,1.2,8),("FZ004","Frozen Chicken Nuggets CP 500g","CP Foods","pack",3.85,0.5,12),
    ("FZ005","Frozen Chicken Schnitzel 500g","CP Foods","pack",4.25,0.5,10),("FZ006","Frozen Pork Mince 500g","Lucky Fresh","pack",3.65,0.5,10),
    ("FZ007","Frozen Pork Belly 500g","Lucky Fresh","pack",4.15,0.5,8),("FZ008","Frozen Shrimp Peeled 500g","Sea King","pack",6.25,0.5,8),
    ("FZ009","Frozen Whole Shrimp 500g","Sea King","pack",5.50,0.5,8),("FZ010","Frozen Squid Ring 500g","Sea King","pack",4.75,0.5,8),
    ("FZ011","Frozen Fish Fillet 500g","Sea King","pack",4.25,0.5,10),("FZ012","Frozen Salmon 200g","Fjord","pack",6.25,0.2,6),
    ("FZ013","Frozen Crab Stick 200g","Lucky","pack",1.95,0.2,12),("FZ014","Frozen Sausage CP 500g","CP Foods","pack",3.35,0.5,12),
    ("FZ015","Frozen Cocktail Sausage 500g","CP Foods","pack",3.35,0.5,12),("FZ016","Frozen Fish Cake 200g","Lucky","pack",1.85,0.2,12),
    ("FZ017","Frozen Dim Sum Pork 300g","Lucky","pack",2.95,0.3,10),("FZ018","Frozen Har Gow Shrimp 300g","Lucky","pack",3.50,0.3,10),
    ("FZ019","Frozen Siu Mai 300g","Lucky","pack",3.25,0.3,10),("FZ020","Frozen Wonton Pork 300g","Lucky","pack",2.95,0.3,10),
    ("FZ021","Frozen Spring Roll 300g","Lucky","pack",2.25,0.3,12),("FZ022","Frozen Samosa 6pcs","Lucky","pack",2.25,0.15,10),
    ("FZ023","Frozen Edamame 400g","FarmFresh","pack",2.45,0.4,12),("FZ024","Frozen Mixed Vegetable 500g","Bird's Eye","pack",2.15,0.5,12),
    ("FZ025","Frozen Corn Kernel 500g","Bird's Eye","pack",1.95,0.5,12),("FZ026","Frozen Broccoli 400g","Bird's Eye","pack",2.25,0.4,10),
    ("FZ027","Frozen Spinach 400g","Bird's Eye","pack",1.95,0.4,10),("FZ028","Frozen Peas 500g","Bird's Eye","pack",1.75,0.5,12),
    ("FZ029","Frozen French Fries 1kg McCain","McCain","pack",2.95,1.0,10),("FZ030","Frozen Waffle Fries 500g","McCain","pack",2.45,0.5,10),
    ("FZ031","Frozen Hash Brown 6pcs","McCain","pack",2.25,0.3,10),("FZ032","Frozen Pizza Margherita 300g","Mama Rosa","pack",4.25,0.3,6),
    ("FZ033","Frozen Fried Rice 400g","Lucky","pack",2.95,0.4,8),("FZ034","Frozen Pad Thai 400g","Lucky","pack",3.25,0.4,8),
    ("FZ035","Frozen Pork Bun 6pcs","Lucky","pack",2.75,0.3,8),("FZ036","Ice Cream Vanilla 1L Swensens","Swensen's","tub",3.35,1.0,10),
    ("FZ037","Ice Cream Chocolate 1L Swensens","Swensen's","tub",3.35,1.0,10),("FZ038","Ice Cream Strawberry 1L","Swensen's","tub",3.35,1.0,10),
    ("FZ039","Paddle Pop Chocolate 65ml","Wall's","piece",0.55,0.065,20),("FZ040","Cornetto Classic 120ml","Wall's","piece",1.15,0.12,15),
    ("FZ041","Magnum Almond 100ml","Wall's","piece",1.75,0.1,12),("FZ042","Frozen Durian Flesh 300g","Lucky","pack",3.95,0.3,8),
    ("FZ043","Frozen Mango Slice 400g","Lucky","pack",2.75,0.4,10),("FZ044","Frozen Longan 400g","Lucky","pack",2.25,0.4,10),
    ("FZ045","Frozen Roti Canai 5pcs","Kawan","pack",2.25,0.3,10),
]
for d in frozen:
    add(d[0],d[1],9,d[2],d[3],d[4],d[5],d[6],1)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# CAT 10 — HOUSEHOLD & PERSONAL CARE
prev=count
print("\n🏠 Cat 10: Household & Personal Care...")
household=[
    ("HP001","Ariel Detergent Powder 3kg","Ariel","pack",5.25,3.0,10),("HP002","Tide Detergent Powder 2.5kg","Tide","pack",4.75,2.5,10),
    ("HP003","Breeze Liquid Detergent 1L","Breeze","bottle",3.35,1.0,10),("HP004","Comfort Fabric Softener 1.5L","Comfort","bottle",2.95,1.5,10),
    ("HP005","Downy Fabric Softener 1.5L","Downy","bottle",3.25,1.5,10),("HP006","Sunlight Dishwash Liquid 800ml","Sunlight","bottle",2.15,0.8,12),
    ("HP007","Vim Dishwash Powder 1kg","Vim","pack",1.75,1.0,10),("HP008","Scotch Brite Sponge 2pcs","3M","pack",1.15,0.05,15),
    ("HP009","Dettol Multi-Surface Spray 500ml","Dettol","bottle",3.35,0.5,10),("HP010","Dettol Handwash 250ml","Dettol","bottle",1.95,0.25,12),
    ("HP011","Cif Bathroom Cleaner 500ml","Cif","bottle",2.95,0.5,8),("HP012","Toilet Duck 750ml","Duck","bottle",2.75,0.75,8),
    ("HP013","Floor Cleaner Mr Muscle 500ml","Mr Muscle","bottle",2.95,0.5,8),("HP014","Hand Sanitizer Dettol 500ml","Dettol","bottle",3.35,0.5,10),
    ("HP015","Garbage Bag 30pcs","Lucky","pack",1.75,0.15,12),("HP016","Garbage Bag Large 10pcs","Lucky","pack",1.45,0.15,12),
    ("HP017","Cling Wrap Glad 30m","Glad","roll",2.45,0.05,10),("HP018","Aluminum Foil 30m","Lucky","roll",2.75,0.10,8),
    ("HP019","Ziplock Bag 20pcs","Lucky","pack",1.45,0.05,12),("HP020","Mosquito Coil Shieldtox 10pcs","Shieldtox","pack",1.15,0.08,12),
    ("HP021","Raid Cockroach Spray 400ml","Raid","bottle",4.35,0.4,8),("HP022","Air Freshener Glade 300ml","Glade","bottle",3.35,0.3,8),
    ("HP023","Dove Shampoo 340ml","Dove","bottle",3.35,0.34,12),("HP024","Head & Shoulders 340ml","P&G","bottle",3.65,0.34,12),
    ("HP025","Pantene Shampoo 340ml","Pantene","bottle",3.35,0.34,12),("HP026","Dove Body Wash 250ml","Dove","bottle",2.95,0.25,12),
    ("HP027","Lux Body Wash 250ml","Lux","bottle",2.45,0.25,12),("HP028","Colgate Toothpaste 175g","Colgate","tube",1.95,0.175,15),
    ("HP029","Sensodyne Toothpaste 100g","Sensodyne","tube",3.75,0.1,10),("HP030","Colgate Toothbrush Medium","Colgate","piece",0.79,0.02,20),
    ("HP031","Oral-B Toothbrush","Oral-B","piece",1.45,0.02,15),("HP032","Nivea Body Lotion 200ml","Nivea","bottle",3.35,0.2,10),
    ("HP033","Vaseline Lotion 200ml","Vaseline","bottle",2.95,0.2,10),("HP034","Sunscreen SPF50 Banana Boat 50ml","Banana Boat","bottle",5.25,0.05,8),
    ("HP035","Facial Wash Garnier 100ml","Garnier","tube",2.95,0.1,10),("HP036","Cotton Pads 80pcs","Lucky","pack",1.45,0.06,12),
    ("HP037","Wet Wipes Kleenex 80pcs","Kleenex","pack",1.75,0.2,12),("HP038","Tissue Box Kleenex 200sheets","Kleenex","box",1.15,0.12,15),
    ("HP039","Sanitary Pad Sofy 16pcs","Sofy","pack",2.75,0.1,12),("HP040","Baby Diaper Huggies M 22pcs","Huggies","pack",9.25,0.8,8),
]
for d in household:
    add(d[0],d[1],10,d[2],d[3],d[4],d[5],d[6],0)
db.commit()
print(f"  ✅ {count-prev} added, {count} total")

# Summary
print("\n" + "="*60)
print("📊 FINAL SUMMARY")
print("="*60)
for cid, cname in categories:
    n = db.execute(text("SELECT COUNT(*) FROM Product WHERE Category_ID=:id"),{"id":cid}).scalar()
    print(f"  {cid:2}. {cname:<32} {n:3} products")
total_db = db.execute(text("SELECT COUNT(*) FROM Product")).scalar()
print(f"\n  ✅ TOTAL: {total_db} products in database!")
db.close()
