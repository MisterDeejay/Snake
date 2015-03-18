(function() {
  if(typeof SnakeGame === "undefined") {
    window.SnakeGame = {};
  };

  var Board = SnakeGame.Board = function(dimens) {
    this.width = dimens[0];
    this.height = dimens[1];
    this.snake = new Snake(this);
    this.apple = new Apple(this);

    this.grid = Board.blankGrid(this.width, this.height);
  };

  Board.BLANK_SYMBOL = ".";

  Board.blankGrid = function(width, height) {
    var width = width, height = height;
    var grid = [];
    for (var i = 0; i < height; i++) {
      // Create row
      grid.push([]);
      for(var j = 0; j < width; j++) {
        // Add placeholder for a blank space to every square on grid
        grid[i].push(Board.BLANK_SYMBOL);
      };
    };

    return grid;
  };

  Board.prototype.render = function() {
    var that = this;
    this.snake.segments.forEach(function(coord) {
      console.log(coord);
      that.grid[coord.y][coord.x] = Snake.SYMBOL;
    });

    console.log(this.grid.map(function(row) {
      return row.join('');
    }).join('\n'));
  };

  Board.prototype.validPosition = function(coord) {
    console.log(coord);
    if (coord.x >= this.width || coord.x < 0) {
      coord.x = coord.x % this.width;
      if (coord.x < 0) {
        coord.x += this.width;
      }
    }

    if (coord.y >= this.height || coord.y < 0) {
      coord.y = coord.y % this.height;
      if (coord.y < 0) {
        coord.y += this.height;
      }
    }

    return (coord.x >= 0) && (coord.x < this.width) &&
      (coord.y >= 0) && (coord.y < this.height)
  }

  var Coordinate = SnakeGame.Coordinate = function(x, y) {
    this.x = x;
    this.y = y;
  };

  Coordinate.prototype.plus = function(coord) {
    return new Coordinate((coord.x + this.x), (coord.y + this.y));
  };

  Coordinate.prototype.equals = function(coord) {
    return ((coord.x == this.x) && (coord.y == this.y));
  };

  Coordinate.prototype.isOpposite = function(coord) {
    return ((this.x == (-1 * coord.x)) && (this.y == (-1 * coord.y)));
  };

  var Apple = SnakeGame.Apple = function(board) {
    this.board = board;
    this.replace();
  };

  Apple.prototype.replace = function() {
    var x = Math.floor(Math.random() * this.board.width);
    var y = Math.floor(Math.random() * this.board.height);

    while(this.board.snake.isOccupying(x, y)) {
      x = Math.floor(Math.random() * this.board.width);
      y = Math.floor(Math.random() * this.board.height);
    }

    this.position = new Coordinate(x, y);
  };

  var Snake = SnakeGame.Snake = function(board) {
    this.board = board;
    this.turning = false;
    this.dir = "N";

    var center = new Coordinate(Math.floor(board.width / 2),
      Math.floor(board.height / 2));
    this.segments = [center];
    this.growTurns = 0;
  };

  Snake.SYMBOL = "S";
  Snake.GROW = 3;
  Snake.DIFFS = {
    "N": new Coordinate(0, -1),
    "E": new Coordinate(1, 0),
    "S": new Coordinate(0, 1),
    "W": new Coordinate(-1, 0)
  };

  Snake.prototype.isOccupying = function(x, y) {
    coord = new Coordinate(x, y);
    var result = false;

    this.segments.forEach(function(snakeCoord) {
      if(snakeCoord.equals(coord)) {
        result = true;
        return result;
      }
    });

    return result;
  }

  Snake.prototype.turn = function(newDir) {
    // Don't allow turning back on oneself
    if(Snake.DIFFS[this.dir].isOpposite(Snake.DIFFS[newDir]) || this.turning) {
      return;
    } else {
      this.turning = true;
      this.dir = newDir;
    }
  };

  Snake.prototype.head = function() {
    return this.segments[this.segments.length - 1];
  };

  Snake.prototype.isValid = function() {
    // Not valid if head runs off grid
    if (!this.board.validPosition(this.head())) {
      return false;
    }

    // Not valid if head runs into a body segment
    for (var i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(this.head())) {
        return false;
      }
    }
    return true;
  };

  Snake.prototype.move = function() {
    // Move snake forward
    this.segments.push(this.head().plus(Snake.DIFFS[this.dir]));

    // Allow turning again
    this.turning = false;

    // Maybe eat an apple
    if(this.eatApple()) {
      this.board.apple.replace();
    }

    // If snake isn't growing remove tail segment
    if(this.growTurns > 0) {
      this.growTurns -= 1;
    } else {
      this.segments.shift();
    }

    // Destroy snake if it runs off grid or eats itself
    if (!this.isValid()) {
      this.segments = [];
    }
  };

  Snake.prototype.eatApple = function() {
    if(this.head().equals(this.board.apple.position)) {
      this.growTurns = Snake.GROW;
      return true;
    } else {
      return false;
    }
  };
})();
