export default class Triangle {
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
    this.sum_sides;
    this.area;
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

  // ３辺の和を返す
  // 下記URLの図を参照
  // https://math-jp.net/2018/08/26/yogenteiri-kakudo/
  calcSumSides() {
    this.sum_sides = this.sides.a + this.sides.b + this.sides.c;
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

    this.area = Math.abs((x1 - x3) * (y2 - y3) - (x2 - x3) * (y1 - y3)) / 2;
  }

  // 三角形の頂点の位置を決める
  static makeAllVertexes = () => {
    let vertexes = [];
    let sum_sides = $('#input_sum_sides').val();

    if (!sum_sides) {
      // 3つの頂点をランダムに生成
      for (let i = 0; i < 3; i++) {
        vertexes.push(this.makeRandVertex());
      }
    } else {
      // 頂点A(x1,x2)：点Aをランダム生成
      let A = this.makeRandVertex();
      let [B, C] = this.makeTwoVertexes(A, sum_sides);

      vertexes.push(A);
      vertexes.push(B);
      vertexes.push(C);
    }
    return vertexes;
  }

  /**
   * キャンバス範囲内のx,y座標を返す静的メソッド
   * @return {array} vertex [x,y]
   **/
  static makeRandVertex() {
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
   * 円と円の交点を求める
   * https://shogo82148.github.io/homepage/memo/geometry/circle-cross.html
   * @param {Number} sum_sides
   * @return {Number} side
   **/
  static makeTwoVertexes(A, sum_sides) {
    let limit_side = sum_sides / 2;
    let init = true;

    // 2つの円が2点で交わるようなr1,r2の生成
    let r1, r2, B, C;
    const makeTwoCircle = () => {

      // x2とy2は点Aからの相対座標
      let d = Math.random() * limit_side;
      let _θ = Math.random() * 2 * Math.PI;
      let x1 = d * Math.cos(_θ);
      let y1 = d * Math.sin(_θ);

      do {
        // 点Aを中心とするr1を決定
        r1 = Math.random() * limit_side;
        // 点Bを中心とするr2を決定
        r2 = sum_sides - d - r1;
      }
      while (d < Math.abs(r1 - r2) || d > Math.abs(r1 + r2));

      // 点Bの座標
      // B = [x1, y1]
      B = [x1 + A[0], y1 + A[1]];
      // 点Bがキャンバス内に存在しない場合に実行する再帰関数
      if (B[0] < 0 || B[0] > WIDTH || B[1] < 0 || B[1] > HEIGHT) {
        return makeTwoCircle();
      }


      let a = (x1 ** 2 + y1 ** 2 + r1 ** 2 - r2 ** 2) / 2
      let x = (a * x1 + y1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);
      let y = (a * y1 - x1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);
      // 点Cの座標
      C = [x + A[0], y + A[1]];

      console.log(`x+A[0]:${x + A[0]}`, `y + A[1]:${y + A[1]}`);
      // x,yの交点の内１つ目がキャンバス内に存在しない場合に実行する
      if (C[0] < 0 || C[0] > WIDTH || C[1] < 0 || C[1] > HEIGHT) {
        console.log("x,y are out(1)");
        console.log({ A }, { B }, { C });
        x = (a * x1 - y1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);
        y = (a * y1 + x1 * Math.sqrt((x1 ** 2 + y1 ** 2) * r1 ** 2 - a ** 2)) / (x1 ** 2 + y1 ** 2);
        C = [x + A[0], y + A[1]];
      }

      console.log(`x+A[0]:${x + A[0]}`, `y + A[1]:${y + A[1]}`);
      // x,yの交点の内2つ目がキャンバス内に存在しない場合に実行する再帰関数
      if (C[0] < 0 || C[0] > WIDTH || C[1] < 0 || C[1] > HEIGHT) {
        console.log("x,y are out(2)");
        console.log({ A }, { B }, { C });
        return makeTwoCircle();
      }
      console.log({ C })
    }

    if (init) {
      init = false;
      makeTwoCircle();
    }

    // 2つの円をキャンバス描画
    // if (canvas.getContext) {
    //   var ctx = canvas.getContext("2d");
    //   ctx.beginPath();
    //   ctx.arc(A[0], HEIGHT - A[1], r1, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    //   ctx.strokeStyle = "purple";
    //   ctx.lineWidth = 2;
    //   ctx.stroke();

    //   ctx.beginPath();
    //   ctx.arc(B[0], HEIGHT - B[1], r2, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    //   ctx.strokeStyle = "purple";
    //   ctx.lineWidth = 2;
    //   ctx.stroke();
    // }
    console.log("Let's drowing")
    console.log({ A }, { B }, { C });

    return [B, C];
  }
}
