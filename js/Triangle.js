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
    this.chromosome;
    this.fitness;
  }

  // ３辺の長さを計算してプロパティに定義する
  setLength() {
    this.sides.a = Math.sqrt(
      Math.pow(this.vertexes.B.x2 - this.vertexes.C.x3, 2) +
        Math.pow(this.vertexes.B.y2 - this.vertexes.C.y3, 2)
    );
    this.sides.b = Math.sqrt(
      Math.pow(this.vertexes.C.x3 - this.vertexes.A.x1, 2) +
        Math.pow(this.vertexes.C.y3 - this.vertexes.A.y1, 2)
    );
    this.sides.c = Math.sqrt(
      Math.pow(this.vertexes.A.x1 - this.vertexes.B.x2, 2) +
        Math.pow(this.vertexes.A.y1 - this.vertexes.B.y2, 2)
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

  generateChromosome() {
    this.chromosome =
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.A.x1)
        )
      ) +
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.A.y1)
        )
      ) +
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.B.x2)
        )
      ) +
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.B.y2)
        )
      ) +
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.C.x3)
        )
      ) +
      this.constructor.paddingZero(
        this.constructor.convertBinary(
          this.constructor.convertChromosome(this.vertexes.C.y3)
        )
      );
  }

  calcFitness() {
    this.fitness = this.area;
  }

  // 三角形の頂点の位置を決める
  static makeAllVertexes() {
    let vertexes = [];
    // 3つの頂点をランダムに生成
    for (let i = 0; i < 3; i++) {
      vertexes.push(this.makeRandVertex());
    }
    return vertexes;
  }

  /**
   * キャンバス範囲内のx,y座標を返す静的メソッド
   * @return {array} vertex [x,y]
   **/
  static makeRandVertex() {
    let x = Math.floor(Math.random() * WIDTH);
    let y = Math.floor(Math.random() * HEIGHT);
    return [x, y];
  }

  static convertBinary(num) {
    return num.toString(2);
  }

  static convert10digit(str) {
    return parseInt(str, 2);
  }

  // 10進数→2進数の変換で、Canvasサイズに合わせた座標変換
  static convertChromosome(position) {
    return Math.ceil((position / WIDTH) * 1023);
  }

  // 2進数→10進数の変換で、Canvasサイズに合わせた座標変換
  static convertVertexe(chromosome) {
    return Math.floor((chromosome / 1023) * WIDTH);
  }

  // ゼロ埋めで10桁にする
  static paddingZero = num => {
    return ('0000000000' + num).slice(-10);
  };

  // chromosomeをvertexesに変換して返す
  static convertAllVertexes(chromosome) {
    let vertexes = [];
    for (let i = 0; i < 3; i++) {
      let a = 20 * i;
      let b = a + 10;
      let c = b + 10;

      let x = this.convertVertexe(this.convert10digit(chromosome.slice(a, b)));
      let y = this.convertVertexe(this.convert10digit(chromosome.slice(b, c)));
      vertexes.push([x, y]);
    }
    return vertexes;
  }
}
