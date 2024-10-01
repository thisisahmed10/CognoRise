var DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#798625', '#258667', '#6e2586', '#862542', '#253286', '#865f25', '#5f8625', '#258676', '#862525', '#3f8625'];
var CTRLcolors = ['#292d10', '#102b22', '#27112f', '#250d14', '#0b0e1e', '#eab05e', '#aee754', '#5ff0d8', '#ec5959', '#8ae668'];
var CTRL = CTRLcolors[Math.floor(Math.random() * CTRLcolors.length)];
var Ball = {
  /**
   * Creates a new object with specified properties.
   * 
   * param {number} incrementedSpeed - The speed to be assigned to the object. Defaults to 7 if not provided.
   * returns {Object} The newly created object with specified width, height, position, movement direction, and speed.
   */
  new: function (incrementedSpeed) {
      return {
          width: 18,
          height: 18,
          x: (this.canvas.width / 2) - 9,
          y: (this.canvas.height / 2) - 9,
          moveX: DIRECTION.IDLE,
          moveY: DIRECTION.IDLE,
          speed: incrementedSpeed || 7 
      };
  }
};

var Ai = {
  new: function (side) {
      return {
          width: 18,
          height: 180,
          x: side === 'left' ? 150 : this.canvas.width - 150,
          y: (this.canvas.height / 2) - 35,
          score: 0,
          move: DIRECTION.IDLE,
          speed: 8
      };
  }
};

var Game = {
  initialize: function () {
      this.canvas = document.querySelector('canvas');
      this.context = this.canvas.getContext('2d');

      this.canvas.width = 1500;
      this.canvas.height = 1000;

      this.canvas.style.width = (this.canvas.width / 2) + 'px';
      this.canvas.style.height = (this.canvas.height / 2) + 'px';

      this.player = Ai.new.call(this, 'left');
      this.ai = Ai.new.call(this, 'right');
      this.ball = Ball.new.call(this);

      this.ai.speed = 5;
      this.running = this.over = false;
      this.turn = this.ai;
      this.timer = this.round = 0;
      this.color = colors[Math.floor(Math.random() * colors.length)];

      Pong.menu();
      Pong.listen();
  },

  endGameMenu: function (text) {
      Pong.context.font = '45px Courier New';
      Pong.context.fillStyle = this.color;

      Pong.context.fillRect(
          Pong.canvas.width / 2 - 350,
          Pong.canvas.height / 2 - 48,
          700,
          100
      );

      Pong.context.fillStyle = '#eee';

      Pong.context.fillText(text,
          Pong.canvas.width / 2,
          Pong.canvas.height / 2 + 15
      );

      setTimeout(function () {
          Pong = Object.assign({}, Game);
          Pong.initialize();
      }, 3000);
  },

  menu: function () {
      Pong.draw();
      
      this.context.font = '50px Courier New';
      this.context.fillStyle = this.color;

      this.context.fillRect(
          this.canvas.width / 2 - 350,
          this.canvas.height / 2 - 48,
          700,
          100
      );

      this.context.fillStyle = '#ffffff';

      this.context.fillText('Press any key to begin',
          this.canvas.width / 2,
          this.canvas.height / 2 + 15
      );
  },

  update: function () {
    if (!this.over) {
        if (this.ball.x <= 0) Pong._resetTurn.call(this, this.ai, this.player);
        if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.ai);
        if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
        if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

        if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
        else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

        if (Pong._turnDelayIsOver.call(this) && this.turn) {
            this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
            this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
            this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
            this.turn = null;
        }

        if (this.player.y <= 0) this.player.y = 0;
        else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

        if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
        else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
        if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
        else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

        if (this.ai.y > this.ball.y - (this.ai.height / 2)) {
            if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y -= this.ai.speed / 1.5;
            else this.ai.y -= this.ai.speed / 4;
        }
        if (this.ai.y < this.ball.y - (this.ai.height / 2)) {
            if (this.ball.moveX === DIRECTION.RIGHT) this.ai.y += this.ai.speed / 1.5;
            else this.ai.y += this.ai.speed / 4;
        }

        if (this.ai.y >= this.canvas.height - this.ai.height) this.ai.y = this.canvas.height - this.ai.height;
        else if (this.ai.y <= 0) this.ai.y = 0;

        if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
            if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
                this.ball.x = (this.player.x + this.ball.width);
                this.ball.moveX = DIRECTION.RIGHT;
            }
        }

        if (this.ball.x - this.ball.width <= this.ai.x && this.ball.x >= this.ai.x - this.ai.width) {
            if (this.ball.y <= this.ai.y + this.ai.height && this.ball.y + this.ball.height >= this.ai.y) {
                this.ball.x = (this.ai.x - this.ball.width);
                this.ball.moveX = DIRECTION.LEFT;
            }
        }
    }

    if (this.player.score === rounds[this.round]) {
        if (!rounds[this.round + 1]) {
            this.over = true;
            setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
        } else {
            this.color = this._generateRoundColor();
            this.player.score = this.ai.score = 0;
            this.player.speed += 0.5;
            this.ai.speed += 1;
            this.ball.speed += 1;
            this.round += 1;

        }
    }
    else if (this.ai.score === rounds[this.round]) {
        this.over = true;
        setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
    }
},

/**
 * Draws the game elements on the canvas.
 * Clears the canvas and redraws the background, players, ball, and UI elements.
 */
  draw: function () {
    this.context.clearRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );

    this.context.fillStyle = this.color;

    this.context.fillRect(
        0,
        0,
        this.canvas.width,
        this.canvas.height
    );

    this.context.fillStyle = CTRL;

    this.context.fillRect(
        this.player.x,
        this.player.y,
        this.player.width,
        this.player.height
    );

    this.context.fillRect(
        this.ai.x,
        this.ai.y,
        this.ai.width,
        this.ai.height 
    );

    if (Pong._turnDelayIsOver.call(this)) {
        this.context.fillRect(
            this.ball.x,
            this.ball.y,
            this.ball.width,
            this.ball.height
        );
    }

      this.context.beginPath();
      this.context.setLineDash([7, 15]);
      this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
      this.context.lineTo((this.canvas.width / 2), 140);
      this.context.lineWidth = 10;
      this.context.strokeStyle = '#ffffff';
      this.context.stroke();

      this.context.font = '100px Courier New';
      this.context.textAlign = 'center';

      this.context.fillText(
          this.player.score.toString(),
          (this.canvas.width / 2) - 300,
          200
      );

      this.context.fillText(
          this.ai.score.toString(),
          (this.canvas.width / 2) + 300,
          200
      );

      this.context.font = '30px Courier New';

      this.context.fillText(
          'Round ' + (Pong.round + 1),
          (this.canvas.width / 2),
          35
      );

      this.context.font = '40px Courier';

      this.context.fillText(
          rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
          (this.canvas.width / 2),
          100
      );
  },

  loop: function () {
      Pong.update();
      Pong.draw();

      if (!Pong.over) requestAnimationFrame(Pong.loop);
  },

  listen: function () {
      document.addEventListener('keydown', function (key) {
          if (Pong.running === false) {
              Pong.running = true;
              window.requestAnimationFrame(Pong.loop);
          }
          if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;
          if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
      });

      document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
  },

  _resetTurn: function(victor, loser) {
      this.ball = Ball.new.call(this, this.ball.speed);
      this.turn = loser;
      this.timer = (new Date()).getTime();

      victor.score++;
  },

  _turnDelayIsOver: function() {
      return ((new Date()).getTime() - this.timer >= 1000);
  },

/**
 * Generates a new random color for the round.
 * Ensures the new color is different from the current color.
 *
 * returns {string} A new color different from the current one.
 */
  _generateRoundColor: function () {
      var newColor = colors[Math.floor(Math.random() * colors.length)];
      if (newColor === this.color) return Pong._generateRoundColor();
      return newColor;
  }
};

var Pong = Object.assign({}, Game);
Pong.initialize();