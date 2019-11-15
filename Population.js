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
      console.log('triangle:', triangle);
      if (i === 0) {
        this.updateBestTriangle(triangle);
      } else {
        this.compareArea(triangle);
      }
      this.triangles.push(triangle);
    }
  }

  generateTriangle = () => {
    let vertexes = Triangle.makeAllVertexes();
    let triangle = new Triangle(vertexes);
    triangle.setLength();
    triangle.calcSumSides();
    triangle.calcArea();
    return triangle;
  }

  compareArea = (triangle) => {
    if (triangle.area > this.best_triangle.area) {
      this.updateBestTriangle(triangle)
    }
  }

  updateBestTriangle = (triangle) => {
    this.best_triangle = triangle;
  }
}