const { data, error } =
await supabase.functions.invoke(
    "sg61-spin"
);

console.log(data);

// import { supabase } from "./supabase-config.js";
// import { spinWheel } from "./wheel.js";
// import { drawWheel, spinWheel } from "./wheel.js";

// document.addEventListener(
//   "DOMContentLoaded",
//   init
// );

// function init(){

//     loadPage();

//     bindEvents();

//     drawWheel(FREE_PRIZES);

// }

// function bindEvents(){

//     document
//         .getElementById(
//             "check-btn"
//         )
//         .addEventListener(
//             "click",
//             checkPhone
//         );

//     document
//         .getElementById(
//             "spin-btn"
//         )
//         .addEventListener(
//             "click",
//             startSpin
//         );

// }

// async function checkPhone(){

//     const phone =
//         getPhoneNumber();

//     if(
//         !validatePhone(phone)
//     ){

//         return;

//     }

//     const result =
//         await getSpinType(
//             phone
//         );

// }

// async function startSpin(){

//     disableSpinButton();

//     const prize =
//         await requestPrize();

//     await spinWheel(
//         prize
//     );

//     showPrizeModal(
//         prize
//     );

// }