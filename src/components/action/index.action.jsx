export const infor = (state) => {
    return {
        type: "getInfor",
        infor: state
    };
}

export const productForUser = (state) => {
    return {
        type: "listProductForUser",
        listProduct: state
    }
}

export const addCart = (state) => {
    return {
        type: "addCart",
        cartItem: state
    }
}
export const addFavorite = (state) => {
    return {
        type: "addFavorite",
        favoriteItem: state
    }
}
export const removeFavorite = (state) => {
    return {
        type: "removeFavoriteItem",
        favoriteItem: state
    }

}
export const setFavorite = (data) => ({
    type: "SET_FAVORITE",
    payload: data,
});
export const creatFavorite = (state) => {
    return {
        type: "createFavorite",
        favoriteItem: state
}
}

export const removeItem = (state) => {
    return {
        type: "removeItem",
        cartItem: state
    }
}

export const createCart = (state) => {
    return {
        type: "createCart",
        cartItem: state
    }
}