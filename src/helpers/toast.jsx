export const notification = (toast, mess, type = "error") => {
    toast[type](mess, {
        theme: "colored"
    });
}