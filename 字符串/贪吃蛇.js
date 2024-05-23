/**
 * https://blog.nowcoder.net/n/42420d1a2d324c32838f7f23e4da45f3
 * 输出贪吃蛇的长度
 */

const getStep = (snake, ox, oy, op, hdx, hdy, env, n, m) => {
  let stepX = hdx;
  let stepY = hdy;
  let x = ox;
  let y = oy;
  let isOver = false;
  while(op.length) {
    switch(op.shift()) {
      case 'U':
        stepY = stepY == 1 ? 0 : -1;
        break;
      case 'D':
        stepY = stepY == -1 ? 0 : 1;
        break;
      case 'L':
        stepX = stepX == 1 ? 0 : -1;
        break;
      case 'R':
        stepX = stepX == -1 ? 0 : 1;
        break;
      case 'G':
        x += stepX;
        y += stepY;
        if(env[x][y] == 'F') {
          snake.push({
            x: ox,
            y:oy
          })
        } else if(x > n || x < 0 || y < 0 || y > m || snake.some(s => s.x == x && s.y == y)) {
          isOver = true;
          break;
        }      
        break;
    }
  }

  return {
    isOver,
    snake,
    stepX,
    stepY,
    x,
    y
  }
}

const getSnakeLength = (operate, grids, env, n, m ) => {
  const startX = 0;
  const startY = 0;

  for(let i = 0; i < n; i++) {
    for(let j = 0; j < m; j++) {
      if(env[i][j] == 'H') {
        startX = i;
        startY = j;
        break;
      }
    }
  }

  let headDirectionX = 0;
  let headDirectionY = 0;
  const snake = [];
  snake.push({
    x: startX,
    y: startY,
  })
  const step = getStep(snake, startX, startY, operate, headDirectionX, headDirectionY, env, n, m);
  headDirectionX = step.stepX;
  headDirectionY = step.stepY;
  startX = step.x;
  startY = step.y;
  if(step.isOver) {
    console.log('游戏结束')
  }
  console.log(snake.length);
};
