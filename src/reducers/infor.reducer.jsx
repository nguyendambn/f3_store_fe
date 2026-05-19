export const infor = (state = JSON.parse(localStorage.getItem("profile")) ||{}, action) => {
    switch(action.type){
        case "getInfor":
            return action.infor;
        default: 
            return state;
    }
}