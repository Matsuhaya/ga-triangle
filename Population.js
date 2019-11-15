import Triangle from './Triangle.js';

export default class Population {
  /**
   * @param size 何世代か
   * @param population １世代あたりの個体数
   **/
  constructor(size) {
    this.size = size;
    this.triangles = [];
    this.best_triangle;
  }

  generatePopulation() {
    for (let i = 0; i < this.size; i++) {
      let triangle = this.generateTriangle();
      this.triangles.push(triangle);
    }
  }

  generateTriangle() {
    let vertexes = Triangle.makeAllVertexes();
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    return triangle;
  }

  compareArea(triangle) {
    if (triangle.area > this.best_triangle.area) {
      this.updateBestTriangle(triangle)
    }
  }

  updateBestTriangle(triangle) {
    this.best_triangle = triangle;
  }

  doTournament(size) {
    let tournament_triangles = Array.from(this.triangles);
    let targets = [] //コンソールでのトーナメント対象確認用

    for (let i = 0; i < size; i++) {
      let rand_indent = Math.floor(Math.random() * tournament_triangles.length);
      targets.push(tournament_triangles[rand_indent]);
      tournament_triangles.splice(rand_indent, 1);

      if (i === 0) {
        this.updateBestTriangle(targets[0]);
      } else {
        this.compareArea(targets[i]);
      }
    }

    console.log('targets:', targets);
  }
}