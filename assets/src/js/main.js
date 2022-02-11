import "@node_modules/core-js/actual";
import "@node_modules/regenerator-runtime/runtime";
import * as $ from "@node_modules/jquery";
import "@node_modules/slick-carousel/slick/slick.min.js";

$(document).ready(function(){
  var sl = $('.slider');
  sl.slick({
    autoplay: true,
    arrows: true,
    speed: 5000,
    fade: true,
  });
});
