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

  // 第一世代生成のために実行
  unionTriangles() {
    for (let i = 0; i < this.size; i++) {
      let vertexes = this.constructor.getAllVertexes();
      let triangle = this.constructor.generateTriangle(vertexes);
      this.triangles.push(triangle);
    }
  }

  compareFitness(triangle) {
    if (triangle.fitness > this.best_triangle.fitness) {
      this.updateSecondTriangle(this.best_triangle);
      this.updateBestTriangle(triangle)
    }
  }

  updateBestTriangle(triangle) {
    this.best_triangle = triangle;
  }

  updateSecondTriangle(triangle) {
    this.second_triangle = triangle;
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
        if (targets[i].fitness > this.best_triangle.fitness) {
          this.compareFitness(targets[i]);
        } else {
          this.updateSecondTriangle(targets[i]);
        }
      } else {
        this.compareFitness(targets[i]);
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

  // 第二世代以降生成のために実行
  reunionTriangles(children) {
    for (let i = 0; i < this.size; i++) {
      let vertexes = this.constructor.getConvertedAllVertexes(children[i]);
      let triangle = this.constructor.generateTriangle(vertexes);
      this.triangles.push(triangle);
    }
  }

  static getAllVertexes() {
    return Triangle.makeAllVertexes();
  }

  static getConvertedAllVertexes(chromosome) {
    return Triangle.convertAllVertexes(chromosome);
  }

  static generateTriangle(vertexes) {
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    triangle.generateChromosome();
    triangle.calcFitness();
    return triangle;
  }

}