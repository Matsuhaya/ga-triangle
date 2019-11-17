import Population from './Population.js';

export default class Generation {
  /**
   * @param size 世代数
   **/
  constructor(size) {
    this.size = size;
    this.latest_population;
    this.children = []; //次世代population生成用のchromosome
  }

  updateGeneration() {
    for (let i = 0; i < this.size; i++) {
      if (i === 0) {
        this.generate1stPopulation();
        // console.log('this.latest_population:', this.latest_population);
      } else {
        // console.log('this.latest_population:', this.latest_population);
        this.regeneratePopulation();
        this.children = [];
        console.log('this.latest_population.best_triangle:', this.latest_population.best_triangle);
      }
    }
  }

  generate1stPopulation() {
    let population_size = $('#input_population_size').val();
    let population = new Population(population_size);
    population.unionTriangles();
    population.runTournament($('#input_tournament_size').val());
    // console.log('population:', population);
    this.latest_population = population;
  }

  regeneratePopulation() {
    this.children.push(...this.latest_population.selectElite());
    this.children.push(...this.latest_population.runCrossover());

    let population_size = $('#input_population_size').val();
    let population = new Population(population_size);
    population.reunionTriangles(this.children);
    population.runTournament($('#input_tournament_size').val());
    // console.log('population:', population);
    this.latest_population = population;
  }
}