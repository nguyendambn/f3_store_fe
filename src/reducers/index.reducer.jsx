import { productForUser } from "./productForUser.reducer";
import { cart } from "./addCart.reducer";
import { infor } from "./infor.reducer";
import {combineReducers} from "redux";
import { favorite } from "./addFavorite.reducer";
const allReducer = combineReducers({
    infor,
    cart,
    productForUser,
    favorite
});

export default allReducer;