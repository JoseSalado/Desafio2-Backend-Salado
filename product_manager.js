const fs = require("fs")

class ProductManager {
    constructor(path){
        this.path = path
    }

    addProduct = async (object) => {
        const { title, description, price, thumbnail, code, stock } = object
        const hasUndefinedKeys = [title, description, price, thumbnail, code, stock].some(key => key == null || key == undefined)
        
        if(hasUndefinedKeys){
            console.error("Debes competar todos los campos.")
            return
        }

        const products = await this.getProducts()
        const isCodeRepeated = products.find(product => product.code == object.code)

        if(isCodeRepeated){
            console.error("Este codigo ya se uso.")
        }else{
            products.push({...object, id: products.length})

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"))
        }
    }

    getProducts = async () => {
        if(fs.existsSync(this.path)){
            const response = await fs.promises.readFile(this.path, "utf8")
            const data = JSON.parse(response)

            return data
        }else{
            return []
        }
    }

    getProductById = async (id) => {
        const products = await this.getProducts()
        const foundProduct = products.find(product => product.id === id)

        if(foundProduct){
            return foundProduct
        }else{
            return console.error("Producto no encontrado.")
        }
    }

    updateProduct = async (id, object) => {
        const products = await this.getProducts()
        const product = products.find(product => product.id === id)

        if(!product){
            console.error("Producto no encontrado.")
            return
        }

        if(object.id){
            console.error("No se puede actualizar el ID.")
            return
        }

        const updatedProduct = {
            ...product,
            ...object
        }

        const updatedProducts = products.map(product => product.id === updatedProduct.id ? updatedProduct :  product)

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null , "\t"))
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const updatedProducts = products.filter(x => x.id !== id && x)

        await fs.promises.writeFile(this.path, JSON.stringify(updatedProducts, null, "\t"))
    }
}

const manager = new ProductManager("./products.json")