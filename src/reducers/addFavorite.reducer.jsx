export const favorite = (state = JSON.parse(localStorage.getItem("favorite")) || [], action) => {
    switch (action.type) {
         case "createFavorite": {
            return action.favoriteItem;

        }
         case "SET_FAVORITE":{
             localStorage.setItem('favorite', JSON.stringify(action.payload));
             return action.payload;
         }
            
        case"addFavorite": {
            const newItem = action.favoriteItem;

            const existingItemIndex = state.findIndex(item =>
                item.id === newItem.id &&
                item.color.id === newItem.color.id &&
                item.size.id === newItem.size.id
            );

            let updatedFavorite;

            if (existingItemIndex !== -1) {

                updatedFavorite = [...state];
                updatedFavorite[existingItemIndex] = {
                    ...updatedFavorite[existingItemIndex],
                    quantity: newItem.quantity
                };
            } else {
                updatedFavorite = [...state, newItem];
            }
            localStorage.setItem('favorite', JSON.stringify(updatedFavorite));
            return updatedFavorite;
        }
        case "removeFavoriteItem": {
            const removeItem = action.favoriteItem;
            const newCart = state.filter(item => !(item.id === removeItem.id &&
                item.color.id === removeItem.color.id &&
                item.size.id === removeItem.size.id
            ));
            localStorage.setItem('favorite', JSON.stringify(newCart));
            return newCart;
        }
        default:
            return state;
       
}       
            
}