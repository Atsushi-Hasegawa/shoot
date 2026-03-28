$(function() {
  var assets = {
    'image': '/assets/alice.png', // Placeholder since background is missing
    'player': {
      'name': 'alice',
      'json': '/assets/test_for_spine.json'
    },
    'enemy': {
      'name': 'enemy',
      'json': '/assets/test_for_spin.json'
    }
  };

  var game = new Game(assets);
  game.init(function() {
    game.start();

    // Hide loader
    $("#loader").hide();
    $("#content").show();
  });
});
