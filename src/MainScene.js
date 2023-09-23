import Phaser from "phaser";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super("main-scene");
    this.player;
    this.ai;
    this.ball;
    this.ballX = Math.random() < 0.5 ? 200 : -200;
    this.ballY =
      Math.random() < 0.5
        ? Phaser.Math.Between(200, 315)
        : Phaser.Math.Between(-295, -180);
    this.cursors;
    this.playerScore = 0;
    this.aiScore = 0;
    this.scoreTextPlayer;
    this.scoreTextAi;
    this.winningScore = 6;
    this.declareWinnerText;
    this.playerBounceSound;
    this.aiBounceSound;
  }

  preload() {
    this.load.audio("player-bounce", "/assets/player-bounce.wav");
    this.load.audio("ai-bounce", "/assets/ai-bounce.wav");
  }

  create() {
    this.physics.world.setBounds(0, 0, 900, 500, false, false);
    const fieldLine = this.add.line(0, 250, 450, 0, 450, 500, 0xffdd00);
    fieldLine.setLineWidth(2);
    const fieldCircle = this.add.circle(450, 250, 80);
    fieldCircle.setStrokeStyle(2, 0xffdd00);

    this.player = this.add.rectangle(35, 250, 15, 130, 0xffdd00);
    this.physics.add.existing(this.player);
    this.player.body.collideWorldBounds = true;
    this.player.body.immovable = true;
    this.playerBounceSound = this.sound.add("player-bounce", { loop: false });

    this.ai = this.add.rectangle(865, 250, 15, 130, 0xffdd00);
    this.physics.add.existing(this.ai);
    this.ai.body.collideWorldBounds = true;
    this.ai.body.immovable = true;
    this.aiBounceSound = this.sound.add("ai-bounce", { loop: false });

    this.ball = this.add.circle(450, 250, 13, 0xfe0000);
    this.physics.add.existing(this.ball);
    this.ball.body.setCircle(13, 0, 0);
    this.ball.body.collideWorldBounds = true;
    this.ball.body.bounce.x = 1;
    this.ball.body.bounce.y = 1.015;
    this.ball.body.velocity.x = this.ballX;
    this.ball.body.velocity.y = this.ballY;

    this.physics.add.collider(this.player, this.ball);
    this.physics.add.collider(this.ai, this.ball);

    this.scoreTextPlayer = this.add
      .text(380, 35, `${this.playerScore}`, {
        fontSize: "2.3rem",
        color: "yellow",
        fontFamily: "Handjet, cursive",
      })
      .setOrigin(0.5, 0.5);
    this.scoreTextAi = this.add
      .text(520, 35, `${this.aiScore}`, {
        fontSize: "2.3rem",
        color: "yellow",
        fontFamily: "Handjet, cursive",
      })
      .setOrigin(0.5, 0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update() {
    const { up, down } = this.cursors;
    this.player.body.velocity.y = 0;
    if (up.isDown) this.player.body.velocity.y = -240;
    if (down.isDown) this.player.body.velocity.y = 240;

    if (this.ai.body.center.y < this.ball.body.y) this.ai.body.velocity.y = 240;
    if (this.ai.body.center.y > this.ball.body.y)
      this.ai.body.velocity.y = -240;

    if (this.ball.body.touching.left) {
      this.playerBounceSound.play();
      if (this.ball.body.velocity.x < 1400) this.ball.body.velocity.x += 35;
    }
    if (this.ball.body.touching.right) {
      this.aiBounceSound.play();
      if (this.ball.body.velocity.x > -1400) this.ball.body.velocity.x -= 35;
    }

    if (this.ball.body.x < -20) {
      this.aiScore += 1;
      this.scoreTextAi.setText(this.aiScore);
      this.physics.pause();
      this.resetRound();
    }
    if (this.ball.body.x > 920) {
      this.playerScore += 1;
      this.scoreTextPlayer.setText(this.playerScore);
      this.physics.pause();
      this.resetRound();
    }
    console.log(this.ball.body.velocity.x);
  }

  resetRound() {
    this.player.body.reset(35, 250);
    this.ai.body.reset(865, 250);
    this.ball.body.reset(450, 250);

    if (this.playerScore === this.winningScore) {
      this.physics.pause();
      this.declareWinnerText = this.add
        .text(200, 250, "Player wins!", {
          fontSize: "2rem",
          color: "rgb(174, 180, 115)",
        })
        .setOrigin(0.5, 0.5);
      setTimeout(() => location.reload(), 3000);
    } else if (this.aiScore === this.winningScore) {
      this.physics.pause();
      this.declareWinnerText = this.add
        .text(700, 250, "AI wins!", {
          fontSize: "2rem",
          color: "rgb(174, 180, 115)",
        })
        .setOrigin(0.5, 0.5);
      setTimeout(() => location.reload(), 3000);
    } else {
      this.ball.body.velocity.x = Math.random() < 0.5 ? 200 : -200;
      this.ball.body.velocity.y =
        Math.random() < 0.5
          ? Phaser.Math.Between(200, 315)
          : Phaser.Math.Between(-295, -180);
      setTimeout(() => {
        this.physics.resume();
      }, 1000);
    }
  }
}

//      __________
//     /\   ____  \
//    /  \  \____  \
//   /    \   ___\  \
//  /      \_________\
//  \      /  __     /
//   \    /  /  \   /
//    \  /  /___/  /
//     \/_________/
