import Triangle from './Triangle.js';

let generateTriangle = () => {
  let vertexes = [];
  let sum_sides = $('#input_sum_sides').val();

  if (!sum_sides) {
    // 3つの頂点をランダムに生成
    for (let i = 0; i < 3; i++) {
      vertexes.push(Triangle.generateVertex());
    }
  } else {
    // 頂点A(x1,x2)：点Aをランダム生成
    let A = Triangle.generateVertex();
    let [B, C] = Triangle.generateTwoVertexes(A, sum_sides);

    vertexes.push(A);
    vertexes.push(B);
    vertexes.push(C);
  }
  return new Triangle(vertexes);
}

// キャンバスを白に塗りつぶす
let resetCanvas = () => {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
  }
}

// グリッド線を引く
// 三つの頂点を直線で繋いだ三角形をcanvasに描画する
let drawGrid = () => {
  if (canvas.getContext) {
    var ctx = canvas.getContext("2d");
    ctx.beginPath();
    const STEP = 100;
    for (let w = 0; w < WIDTH + 1; w += STEP) {
      ctx.moveTo(w, 0);
      ctx.lineTo(w, HEIGHT);
    }
    for (let h = 0; h < HEIGHT + 1; h += STEP) {
      ctx.moveTo(0, h);
      ctx.lineTo(WIDTH, h);
    }
    ctx.closePath();

    ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
    ctx.stroke();

    ctx.fillStyle = "rgba(0,0,255,0.1)";//塗りつぶしの色
    ctx.fill();
  }
}

let start = () => {
  // 三角形のインスタンスを生成する
  let triangle = generateTriangle();
  triangle.setLength();
  triangle.calcSumSides();
  triangle.calcArea();

  // canvasに三角形を描画する
  triangle.drawTriangle();

  //ゼロ埋めで10桁にする
  const paddingZero = (num) => {
    return ("000" + num).slice(-3);
  }

  // 計算結果を出力する
  $('#vertex_A').text(
    `x1: ${paddingZero(Math.floor(triangle.vertexes.A.x1))},
     y1: ${paddingZero(Math.floor(triangle.vertexes.A.y1))}`
  );
  $('#vertex_B').text(
    `x2: ${paddingZero(Math.floor(triangle.vertexes.B.x2))},
     y2: ${paddingZero(Math.floor(triangle.vertexes.B.y2))}`
  );
  $('#vertex_C').text(
    `x3: ${paddingZero(Math.floor(triangle.vertexes.C.x3))},
     y3: ${paddingZero(Math.floor(triangle.vertexes.C.y3))}`
  );
  $('#side_a').text(Math.floor(triangle.sides.a));
  $('#side_b').text(Math.floor(triangle.sides.b));
  $('#side_c').text(Math.floor(triangle.sides.c));
  $('#sum_sides').text(
    (triangle.sum_sides < $('#input_sum_sides').val()) ?
      Math.ceil(triangle.sum_sides) :
      Math.floor(triangle.sum_sides)
  );
  $('#area').text(Math.floor(triangle.area));
}

$('#generate').click(() => {
  resetCanvas();
  drawGrid();
  start();
}
);

const init = () => {
  window.onload = () => {
    drawGrid();
  }
}

init();