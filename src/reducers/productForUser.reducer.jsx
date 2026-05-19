export const productForUser = (state = [], action) => {
    switch(action.type){
        case "listProductForUser":
            return action.listProduct;
        default: 
            return state;
    }
}