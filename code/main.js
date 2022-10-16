import kaboom from "kaboom"

//initialize context
kaboom()
loadSprite("fence-top", "sprites/fence-top.png")
loadSprite("fence-bottom", "sprites/fence-bottom.png")
loadSprite("fence-left", "sprites/fence-left.png")
loadSprite("fence-right", "sprites/fence-right.png")
loadSprite("post-top-left", "sprites/post-top-left.png")
loadSprite("post-top-right", "sprites/post-top-right.png")
loadSprite("post-top-left", "sprites/post-top-left.png")
loadSprite("post-top-right", "sprites/post-top-right.png")
loadSprite("background", "sprites/background.png")


layers([
  "background",
  "game"
], "game");

add([
  sprite("background"),
  layer("background")
]);

const size = 20;

const map = addLevel([
  "1ttttttttttttt2",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "l             r",
  "3bbbbbbbbbbbbb4",
], {
  height: size,
  width: size,
  pos: vec2(0, 0),
  "t": () => [
    sprite("fence-top"),
    area(),
    "wall"
  ],
  "b": () => [
    sprite("fence-bottom"),
    area(),
    "wall"
  ],
  "l": () => [
    sprite("fence-left"),
    area(),
    "wall"
  ],
  "r": () => [
    sprite("fence-right"),
    area(),
    "wall"
  ],
  "1": () => [
    sprite("post-top-left"),
    area(),
    "wall"
  ],
  "2": () => [
    sprite("post-top-right"),
    area(),
    "wall"
  ],
  "3": () => [
    sprite("post-top-left"),
    area(),
    "wall"
  ],
  "4": () => [
    sprite("post-top-right"),
    area(),
    "wall"
  ]
});

const directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right"
}

let current_direction = directions
let run_action = false
let snake_lenght = 3
let snake_body = []

function respawn_snake() {
  destroyAll("snake")
  snake_body = []
  snake_lenght = 3

  for (let i = 1; i <= snake_lenght; i++) {
    let segment = add([
      rect(size, size),
      pos(size, size),
      color(0, 0, 255),
      area(),
      "snake"
    ])
    snake_body.push(segment)
  }
  current_direction = directions.RIGHT
}
function respawn_all() {
  run_action = false
  wait(0.5, function() {
    respawn_snake();
    respawn_food();
    run_action = true
  })
}

respawn_all()

onKeyPress("up", () => {
  if (current_direction != directions.DOWN) {
    current_direction = directions.UP;
  }
});

onKeyPress("down", () => {
  if (current_direction != directions.UP) {
    current_direction = directions.DOWN;
  }
});

onKeyPress("left", () => {
  if (current_direction != directions.RIGHT) {
    current_direction = directions.LEFT;
  }
});

onKeyPress("right", () => {
  if (current_direction != directions.LEFT) {
    current_direction = directions.RIGHT;
  }
});


let move_delay = 0.2;
let timer = 0;
onUpdate(() => {
  if (!run_action) return;
  timer += dt();
  if (timer < move_delay) return;
  timer = 0;

  let move_x = 0;
  let move_y = 0;

  switch (current_direction) {
    case directions.DOWN:
      move_x = 0;
      move_y = size;
      break;
    case directions.UP:
      move_x = 0;
      move_y = -1 * size;
      break;
    case directions.LEFT:
      move_x = -1 * size;
      move_y = 0;
      break;
    case directions.RIGHT:
      move_x = size;
      move_y = 0;
      break;
  }

  // Get the last element (the snake head)
  let snake_head = snake_body[snake_body.length - 1];

  snake_body.push(add([
    rect(size, size),
    pos(snake_head.pos.x + move_x, snake_head.pos.y + move_y),
    color(0, 0, 255),
    area(),
    "snake"
  ]));

  if (snake_body.length > snake_lenght) {
    let tail = snake_body.shift();
    destroy(tail);
  }

});
let food = null;

function respawn_food() {
  let new_pos = rand(vec2(1, 1), vec2(13, 13));
  new_pos.x = Math.floor(new_pos.x);
  new_pos.y = Math.floor(new_pos.y);
  new_pos = new_pos.scale(size);

  if (food) {
    destroy(food);
  }
  food = add([
    rect(size, size),
    color(0, 255, 0),
    pos(new_pos),
    area(),
    "food"
  ]);
}

onCollide("snake", "food", (s, f) => {
  snake_lenght++;
  respawn_food();
});
onCollide("snake","wall", (s,w) => {
  run_action = false;
  shake(12);
  respawn_all();
})

