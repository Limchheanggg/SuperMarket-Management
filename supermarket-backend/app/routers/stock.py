# Shared in-memory stock store — imported by both inventory.py and products.py
stock_store = {}

def get_stock(product_id: int) -> int:
    return stock_store.get(product_id, 99)
