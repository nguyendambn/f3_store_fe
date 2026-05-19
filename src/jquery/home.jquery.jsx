// import WOW from 'wowjs';
// import * as WOW from 'wowjs';
// const wow = new WOW.WOW();
// wow.init();
// import $ from 'jquery';
// import 'animate.css';

// window.$ = $;
// window.jQuery = $;

// export const homeJquery = () => {

//     $('.show-sub-category').on("click", function () {
    
//         const currentSlide = $(this).closest('li').find('.content-slide');
//         $('.content-slide').not(currentSlide).slideUp().attr('show', 'true');
//         $('.show-sub-category').not(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>');
//         if (currentSlide.attr('show') === 'true') {
//             $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus"><path d="M5 12h14"/></svg>');
//             currentSlide.slideDown();
//             currentSlide.attr('show', 'false');
//         } else {
//             currentSlide.slideUp();
//             currentSlide.attr('show', 'true');
//             $(this).html('<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg>');
//         }
//     })
//     new WOW.WOW().init();
// }