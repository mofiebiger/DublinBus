// import $ from 'jquery';
// import 'what-input';

$(document).foundation();
console.log("..........")
// $(document).on('open.fndtn.offcanvas', '[data-offcanvas]', function() {
//   $('html').css('overflow', 'hidden');
// })
// $(document).foundation('offcanvas', 'reflow');
$('#testbtn').click(function(){
           console.log("on click");
           $('.off-canvas').foundation('close');
});
// $(document).foundation('reflow');
