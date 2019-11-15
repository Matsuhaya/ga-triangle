import Triangle from './Triangle.js';

export default class Population {
  /**
   * @param size 何世代か
   * @param population １世代あたりの個体数
   **/
  constructor(size) {
    this.size = size;
    this.triangles = [];
    this.best;
  }

  generatePopulation() {
    for (let i = 0; i < this.size; i++) {
      this.generateTriangle();
    }
  }

  generateTriangle = () => {
    let vertexes = Triangle.makeAllVertexes();
    console.log('vertexes:', vertexes);
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    this.triangles.push(triangle);
  }
}