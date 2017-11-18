$(function() {
    var timer = false;
    $('#a_link').on('click', function() {
      if (timer) { return false; }
      timer = true;
      setTimeout(function() { timer = false }, 500);
   });
});
