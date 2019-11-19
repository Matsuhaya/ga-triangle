import Population from './Population.js';

export default class Generation {
  /**
   * @param size 世代数
   **/
  constructor(size) {
    this.size = size;
    this.latest_population;
    this.children = []; //次世代population生成用のchromosome
    this.fitnessPoints = [{}]; // CanvasJSでx=0を空にするため、{}を定義しておく
  }

  updateGeneration() {
    for (let i = 0; i < this.size; i++) {
      if (i === 0) {
        this.generate1stPopulation();
      } else {
        this.regeneratePopulation();
        this.children = [];
      }
      console.count('updateGeneration');
      console.log('this.latest_population:', this.latest_population);
      this.addFitnessPoint();
    }
  }

  generate1stPopulation() {
    let population_size = $('#input_population_size').val();
    let population = new Population(population_size);
    population.unionTriangles();
    population.runTournament($('#input_tournament_size').val());
    this.latest_population = population;
  }

  regeneratePopulation() {
    this.children.push(...this.latest_population.selectElite());
    this.children.push(...this.latest_population.runCrossover());

    if ($("[name=mutation]").prop("checked")) {
      console.log('mutation ON')
      this.latest_population.runMutation(this.children);
    }

    let population_size = $('#input_population_size').val();
    let population = new Population(population_size);
    population.reunionTriangles(this.children);
    population.runTournament($('#input_tournament_size').val());
    this.latest_population = population;
  }

  addFitnessPoint() {
    this.fitnessPoints.push({ y: this.latest_population.best_triangle.fitness })
  }
}