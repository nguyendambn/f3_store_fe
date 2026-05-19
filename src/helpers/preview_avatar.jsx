export const preview = (e) => {
    const [file] = e.target.files;
    const preview_text = document.querySelector("#preview_text");
    const preview_img = document.querySelector("#preview_avatar");
    if(preview_text && preview_img){
        const input = preview_img.querySelector("img"); 
        preview_text.classList.add("hidden");
        preview_img.classList.remove("hidden");
        input.src = URL.createObjectURL(file)
    }
}

export const delete_preview = () => {
    const preview_text = document.querySelector("#preview_text");
    const preview_img = document.querySelector("#preview_avatar");
    if(preview_text && preview_img){
        preview_img.classList.add("hidden");
        preview_text.classList.remove("hidden");
        preview_text.querySelector("input[name='avatar']").value = null;
    }
}