class InventoryService{
    static async getInventory(ProductId){
        return Inventory      .getInventory
    } 
    static async updateInventory(ProductId, inven_quantity){
        return Inventory .updateInventory(ProductId, inven_quantity)
    }
    
}