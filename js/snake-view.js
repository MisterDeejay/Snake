(function() {
  if(typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  };

  var View = SnakeGame.View = function($gameEl) {
    this.$gameEl = $gameEl;
    this.board = new SnakeGame.Board([20, 20]);
    this.snake = this.board.snake;
    this.setupBoard();

    var that = this;
    this.intervalId = window.setInterval(function() { that.step() }, 100);

    $(window).on('keydown', function(event) {
      event.preventDefault();
      that.handleKeyEvent(event);
    });
  };

  View.KEYS = {
    38: "N",
    87: "N",
    37: "W",
    65: "W",
    39: "E",
    68: "E",
    40: "S",
    83: "S",
  };

  View.prototype.setupBoard = function() {
    var boardHtml = "";
    for(var i = 0; i < this.board.height; i++) {
      boardHtml += "<ul>";
      for(var j = 0; j < this.board.width; j++) {
        boardHtml += "<li></li>";
      }
      boardHtml += "</ul>";
    }

    this.$gameEl.html(boardHtml);
    this.$li = this.$gameEl.find("li");
  }

  View.prototype.handleKeyEvent = function(event) {
    // up-arrow=38, left-arrow=37, right-arrow=39, down-arrow=40
    // a=65, w=87, s=83, d=68
    console.log(event.keyCode);
    if(View.KEYS[event.keyCode]) {
      this.snake.turn(View.KEYS[event.keyCode]);
    }
  };

  View.prototype.step = function() {
    if (this.snake.segments.length > 0) {
      this.intervalId;
      this.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.intervalId);
    }
  };

  View.prototype.render = function() {
    this.updateClasses(this.board.snake.segments, "snake");
    this.updateClasses([this.board.apple.position], "apple");
  };

  View.prototype.updateClasses = function(coords, className) {
    this.$li.filter("." + className).removeClass();

    coords.forEach(function(coord) {
      var flatCoord = (coord.x * this.board.height) + coord.y;
      this.$li.eq(flatCoord).addClass(className);
    }.bind(this));
  };
})();
