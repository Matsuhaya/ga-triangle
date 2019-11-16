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
    this.second_triangle;
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
    triangle.generateChromosome();
    return triangle;
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

    console.log('targets:', targets);
  }

  runCrossover() {
    let cross_point = Math.floor(Math.random() * this.best_triangle.chromosome.length);
    let child1_chromosome =
      this.best_triangle.chromosome.substring(0, cross_point) +
      this.second_triangle.chromosome.substring(cross_point);
    let child2_chromosome =
      this.second_triangle.chromosome.substring(0, cross_point) +
      this.best_triangle.chromosome.substring(cross_point);
    console.log('cross_point:', cross_point);
    console.log('this.best_triangle.chromosome:', this.best_triangle.chromosome);
    console.log('this.second_triangle.chromosome:', this.second_triangle.chromosome);
    console.log('child1_chromosome:', child1_chromosome);
    console.log('child2_chromosome:', child2_chromosome);
  }

}