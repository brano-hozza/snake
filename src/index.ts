class SnakeNode {
  private _next: SnakeNode;
  public prev_x: number;
  public prev_y: number;

  constructor(
    public x: number,
    public y: number,
    private isHead: boolean = false
  ) {
    this.prev_x = x;
    this.prev_y = y;
  }
  move(dx: number, dy: number) {
    this.prev_x = this.x;
    this.prev_y = this.y;
    this.x += dx;
    this.y += dy;
    this._next?.replace(this);
  }
  replace(node: SnakeNode) {
    this.prev_x = this.x;
    this.prev_y = this.y;
    this.x = node.prev_x;
    this.y = node.prev_y;
    this._next?.replace(this);
  }
  append() {
    if (this._next) return this._next.append();
    this._next = new SnakeNode(this.prev_x, this.prev_y);
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isHead ? "#ff0000" : "#000000";
    ctx.fillRect(this.x * 10, this.y * 10, 10, 10);
    this._next?.draw(ctx);
  }
}

class Apple {
  public x: number;
  public y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#00ff00";
    ctx.fillRect(this.x * 10, this.y * 10, 10, 10);
  }
}
const randomInt: (min: number, max: number) => number = (
  min: number,
  max: number
) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

class Snake {
  private head: SnakeNode;
  private gameLoop: number;
  private score: number = 0;
  private apples: Apple[] = [];
  private rotation: number = 0;
  constructor(
    public x: number,
    public y: number,
    private ctx: CanvasRenderingContext2D,
    private gameSpeed: number
  ) {
    this.head = new SnakeNode(x, y, true);
    for (let i = 0; i < 3; i++) {
      this.head.append();
    }
    this.apples.push(new Apple(randomInt(0, 39), randomInt(0, 39)));

    this.gameLoop = setInterval(() => {
      this.move();
      this.collision();
      this.render();
    }, gameSpeed);
  }
  left() {
    this.rotation = this.rotation > 0 ? this.rotation - 1 : 3;
  }
  right() {
    this.rotation = this.rotation < 3 ? this.rotation + 1 : 0;
  }
  move() {
    switch (this.rotation) {
      case 0:
        this.head.move(0, -1);
        break;
      case 1:
        this.head.move(1, 0);
        break;
      case 2:
        this.head.move(0, 1);
        break;
      case 3:
        this.head.move(-1, 0);
        break;
    }
    console.log(this.head.x, this.head.y, this.rotation);
  }
  render() {
    ctx.clearRect(0, 0, 500, 500);
    ctx.fillStyle = "#000";
    this.ctx.fillText(`Score: ${this.score}`, 10, 10);
    this.head.draw(ctx);
    this.apples.forEach((apple: Apple) => apple.draw(ctx));
  }
  eat() {
    this.score++;
    this.head.append();
  }
  collision() {
    if (
      this.head.x < 0 ||
      this.head.x > 39 ||
      this.head.y < 0 ||
      this.head.y > 39
    ) {
      this.gameOver();
    }
    this.apples.forEach((apple: Apple) => {
      if (this.head.x == apple.x && this.head.y == apple.y) {
        this.eat();
        this.apples.splice(this.apples.indexOf(apple), 1);
        if (this.apples.length == 0) {
          this.apples.push(new Apple(randomInt(0, 39), randomInt(0, 39)));
        }
      }
    });
  }
  gameOver() {
    clearInterval(this.gameLoop);
    alert("Game Over");
  }
}

const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");

const snakeGame = new Snake(10, 10, ctx, 200);

document.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowLeft":
      snakeGame.left();
      break;
    case "ArrowRight":
      snakeGame.right();
      break;
  }
});
