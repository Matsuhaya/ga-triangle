import Triangle from './Triangle.js';

export default class Population {
  /**
   * @param size １世代あたりの個体数
   **/
  constructor(size) {
    this.size = size;
    this.triangles = [];
    this.best_triangle;
    this.second_triangle;
    this.elite_size = 2; // 適合度が高い親の2個を次世代に残す
  }

  unionTriangles() {
    for (let i = 0; i < this.size; i++) {
      let triangle = this.constructor.generateTriangle();
      this.triangles.push(triangle);
    }
  }

  compareArea(triangle) {
    if (triangle.area > this.best_triangle.area) {
      this.updateSecondTriangle();
      this.updateBestTriangle(triangle)
    }
  }

  updateBestTriangle(triangle) {
    this.best_triangle = triangle;
  }

  updateSecondTriangle() {
    this.second_triangle = this.best_triangle;
  }

  runTournament(size) {
    let tournament_triangles = Array.from(this.triangles);
    let targets = [] //コンソールでのトーナメント対象確認用

    for (let i = 0; i < size; i++) {
      let rand_indent = Math.floor(Math.random() * tournament_triangles.length);
      targets.push(tournament_triangles[rand_indent]);
      tournament_triangles.splice(rand_indent, 1);

      if (i === 0) {
        this.updateBestTriangle(targets[0]);
      } else if (i === 1) {
        if (targets[i].area > this.best_triangle.area) {
          this.compareArea(targets[i]);
        } else {
          this.updateSecondTriangle();
        }
      } else {
        this.compareArea(targets[i]);
      }
    }
    // console.log('targets:', targets);
  }

  // 適合度が高い親の2個を次世代に残す
  selectElite() {
    return [this.best_triangle.chromosome, this.second_triangle.chromosome];
  }

  runCrossover() {
    let children = [];
    let chromosome_size = Math.ceil((this.size - this.elite_size) / 2);
    for (let i = 0; i < chromosome_size; i++) {
      let cross_point = Math.floor(Math.random() * this.best_triangle.chromosome.length);
      let child1_chromosome =
        this.best_triangle.chromosome.substring(0, cross_point) +
        this.second_triangle.chromosome.substring(cross_point);
      let child2_chromosome =
        this.second_triangle.chromosome.substring(0, cross_point) +
        this.best_triangle.chromosome.substring(cross_point);
      children.push(child1_chromosome, child2_chromosome);
    }
    if (this.size % 2 != 0) {
      children.pop();
    }
    return children;
  }

  reunionTriangles(children) {
    for (let i = 0; i < this.size; i++) {
      let triangle = this.constructor.regenerateTriangle(children[i]);
      this.triangles.push(triangle);
    }
  }

  static generateTriangle() {
    let vertexes = Triangle.makeAllVertexes();
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    triangle.generateChromosome();
    return triangle;
  }

  static regenerateTriangle(chromosome) {
    let vertexes = Triangle.convertAllVertexes(chromosome);
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    triangle.generateChromosome();
    return triangle;
  }
}