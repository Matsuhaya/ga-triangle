const WIDTH = "500";
const HEIGHT = "500";
var canvas = document.getElementById("canvas1");
canvas.width = WIDTH;
canvas.height = HEIGHT;

class Triangle {
  /**
   * 頂点A,B,Cと辺a,b,cを定義した三角形
   * @param {object} vertexes
   **/
  constructor(vertexes) {
    this.vertexes = {
      A: {
        x1: vertexes[0][0],
        y1: vertexes[0][1]
      },
      B: {
        x2: vertexes[1][0],
        y2: vertexes[1][1]
      },
      C: {
        x3: vertexes[2][0],
        y3: vertexes[2][1]
      }
    };
    this.sides = {};
  }

  // ３辺の長さを計算してプロパティに定義する
  setLength() {
    this.sides.a = Math.sqrt(
      Math.pow((this.vertexes.B.x2 - this.vertexes.C.x3), 2) +
      Math.pow((this.vertexes.B.y2 - this.vertexes.C.y3), 2)
    );
    this.sides.b = Math.sqrt(
      Math.pow((this.vertexes.C.x3 - this.vertexes.A.x1), 2) +
      Math.pow((this.vertexes.C.y3 - this.vertexes.A.y1), 2)
    );
    this.sides.c = Math.sqrt(
      Math.pow((this.vertexes.A.x1 - this.vertexes.B.x2), 2) +
      Math.pow((this.vertexes.A.y1 - this.vertexes.B.y2), 2)
    );
  }

  // 三つの頂点を直線で繋いだ三角形をcanvasに描画する
  // y軸は反転させて表示させる（y = HEIGHT - y')
  drawTriangle() {
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");

      ctx.beginPath();
      ctx.moveTo(this.vertexes.A.x1, HEIGHT - this.vertexes.A.y1); //最初の点の場所
      ctx.lineTo(this.vertexes.B.x2, HEIGHT - this.vertexes.B.y2); //2番目の点の場所
      ctx.lineTo(this.vertexes.C.x3, HEIGHT - this.vertexes.C.y3); //3番目の点の場所
      ctx.closePath();	//三角形の最後の線 closeさせる

      ctx.strokeStyle = "rgb(0,0,0)"; //枠線の色
      ctx.stroke();

      ctx.fillStyle = "rgba(0,0,255,0.1)";//塗りつぶしの色
      ctx.fill();

      ctx.font = "48px serif";
      ctx.fillText("A", this.vertexes.A.x1 + 10, HEIGHT - this.vertexes.A.y1 + 10);
      ctx.fillText("B", this.vertexes.B.x2 + 10, HEIGHT - this.vertexes.B.y2 + 10);
      ctx.fillText("C", this.vertexes.C.x3 + 10, HEIGHT - this.vertexes.C.y3 + 10);
    }
  }

  // ３辺の和を返す
  // 下記URLの図を参照
  // https://math-jp.net/2018/08/26/yogenteiri-kakudo/
  calcSumSides() {
    return this.sides.a + this.sides.b + this.sides.c;
  }

  // 面積を返す
  // (x1,y1),(x2,y2),(x3,y3)の３つを頂点とする三角形の公式は下記の通り
  // https://mathwords.net/x1y2hikux2y1
  // |(x1 - x3)(y2 - y3) - (x2 - x3)(y1 - y3)|/2
  calcArea() {
    let x1 = this.vertexes.A.x1;
    let x2 = this.vertexes.B.x2;
    let x3 = this.vertexes.C.x3;
    let y1 = this.vertexes.A.y1;
    let y2 = this.vertexes.B.y2;
    let y3 = this.vertexes.C.y3;

    return Math.abs((x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)) / 2
  }

  /**
   * キャンバス範囲内のx,y座標を返す静的メソッド
   * @return {array} vertex [x,y]
   **/
  static generateVertex() {
    let x = Math.random() * WIDTH;
    let y = Math.random() * HEIGHT;
    return [x, y];
  }

  /**
   * 三角形の存在条件を満たすように、点B,Cを生成する
   * 2つの円の位置関係を決定する
   * https://mathtrain.jp/nien
   * 三角形の存在条件より a<b+c（b,cは共にaより小さい)
   * https://mathmatik.jp/2017/02/16/tri_exist_condition/
   * @param {Number} sum_sides
   * @return {Number} side
   **/
  static generateTwoVertexes(A, sum_sides) {
    let limit_side = sum_sides / 2;

    // x2とy2は点Aからの相対座標
    let d = Math.random() * limit_side;
    let _θ = Math.random() * 2 * Math.PI;
    let x1 = d * Math.cos(_θ);
    let y1 = d * Math.sin(_θ);

    // 2つの円が2点で交わるようなr1,r2の生成
    let r1, r2;
    do {
      // 点Aを中心とするr1を決定
      r1 = Math.random() * limit_side;
      // 点Bを中心とするr2を決定
      r2 = sum_sides - d - r1;
    }
    while (d < Math.abs(r1 - r2) || d > Math.abs(r1 + r2));

    console.log(d > Math.abs(r1 - r2));
    console.log(d < Math.abs(r1 + r2));

    // 点Bの座標
    let B = [A[0] + x1, A[1] + y1];


    let a = (x1 ** 2 + y1 ** 2 + r1 ** 2 - r2 ** 2) / 2
    console.log({ a });

    let x = (a * x1 + y1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);
    let y = (a * y1 - x1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);

    // 点Cの座標
    let C = [x + A[0], y + A[1]];

    // 以下キャンバス描画
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d");
      ctx.beginPath();
      ctx.arc(A[0], HEIGHT - A[1], r1, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(B[0], HEIGHT - B[1], r2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
      ctx.strokeStyle = "purple";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    console.log({ A }, { B }, { C });

    return [B, C];
  }
}

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

// let triangle2;
let start = () => {
  // 三角形のインスタンスを生成する
  let triangle = generateTriangle();
  triangle.setLength();
  // canvasに三角形を描画する
  triangle.drawTriangle();
  // 計算結果を出力する

  $('#vertex_A').text(`${triangle.vertexes.A.x1}, ${triangle.vertexes.A.y1}`);
  $('#vertex_B').text(`${triangle.vertexes.B.x2}, ${triangle.vertexes.B.y2}`);
  $('#vertex_C').text(`${triangle.vertexes.C.x3}, ${triangle.vertexes.C.y3}`);
  $('#side_a').text(triangle.sides.a);
  $('#side_b').text(triangle.sides.b);
  $('#side_c').text(triangle.sides.c);
  $('#sum_sides').text(triangle.calcSumSides());
  $('#area').text(triangle.calcArea());
}

$('#generate').click(() => {
  resetCanvas();
  drawGrid();
  start();
}
);

window.onload = () => {
  drawGrid();
}