export const cart = (state = JSON.parse(localStorage.getItem("cart")) || [], action) => {
    switch (action.type) {

        case "createCart": { 
            return action.cartItem;
        }

        case "addCart": {

            const newItem = action.cartItem;

            const existingItemIndex = state.findIndex(item =>
                item.id === newItem.id &&
                item.color.id === newItem.color.id &&
                item.size.id === newItem.size.id
            );

            let updatedCart;

            if (existingItemIndex !== -1) {

                updatedCart = [...state];
                updatedCart[existingItemIndex] = {
                    ...updatedCart[existingItemIndex],
                    quantity: newItem.quantity
                };
            } else {
                updatedCart = [...state, newItem];
            }
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            return updatedCart;
        }
        case "removeItem": {
            const removeItem = action.cartItem;
            const newCart = state.filter(item => !(item.id === removeItem.id &&
                item.color.id === removeItem.color.id &&
                item.size.id === removeItem.size.id
            ));
            localStorage.setItem('cart', JSON.stringify(newCart));
            return newCart;
        }

        default:
            return state;
    }
};
