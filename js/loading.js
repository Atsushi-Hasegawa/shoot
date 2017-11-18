$(function() {
    Array.prototype.remove = function(element) {
    for (var i = 0; i < this.length; i++)
      if (this[i] == element) this.splice(i,1); 
    };

    function preload(images, progress) {
    var total = images.length;
    $(images).each(function(){
      var src = this;
      $('<img/>')
      .attr('src', src)
      .load(function() {
        images.remove(src);
        progress(total, total - images.length);
        });
      });
    }

    var current_percent = 0;
    var target_percent= 0;
    preload([
      '../img/DSC00018.JPG',
      '../img/DSC00001.JPG'
    ], function(total, loaded){
        current_percent = Math.ceil(100 * loaded / total);
    });

    var timer = window.setInterval(function() {
        if (target_percent >= 100) {
        window.clearInterval(timer);
        $('#loader').fadeOut('slow', function() {
          $('<img />')
          .attr('src', 'img/DSC00018.JPG')
          .appendTo('#content');
          $('#content').fadeIn('slow');

          });
        } else {
          if (target_percent < current_percent) {
            target_percent++;
            $('#load-text').html(target_percent + '%');
            $('#bar span').css('width', target_percent + '%');
          }
        }
        }, 20);
});

