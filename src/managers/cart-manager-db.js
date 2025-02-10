import CartModel from "../models/cart-model.js";


class CartManager {
    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;
        } catch (error) {
            console.log("Error al crear el nuevo carrinho de compriñas");
        }
    }

    async getCartById(cartId) {
        try {
            const carrito = await CartModel.findById(cartId).populate("products.product");
            if (!carrito) {
                console.log("No existe ese carrito con el id");
                return null;
            }
            return carrito;
        } catch (error) {
            console.log("Error al traer el carrito, fijate bien lo que haces", error);
        }
    }    


    async addProductCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existProduct = cart.products.find(item => item.product.toString() === productId);

            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.log("Error al agregar un producto", error);
        }
    }

    async deleteProductCart(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('No se encontro el carrito');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();
            return cart;
        } catch (error) {
            console.error('Error al eliminar el producto del carrito en el gestor', error);
            throw error;
        }
    }


    async updateCart(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('No se encontro el carrito');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error al actualizar el carrito en el gestor', error);
            throw error;
        }
    }

    async updateProductCant (cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('No se encontro el carrito');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;


                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('El producto no se encuentra en el carrito');
            }
        } catch (error) {
            console.error('Error al actualizar la cantidad del producto', error);
            throw error;
        }
    }

    async emptyCart (cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('No se encontro el carrito');
            }

            return cart;
        } catch (error) {
            console.error('Error al vaciar el carrito en el gestor', error);
            throw error;
        }
    }
}

export default CartManager;