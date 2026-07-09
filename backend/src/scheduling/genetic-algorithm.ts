import logger from '../../utils/logger';

interface Individual {
  genes: string[];
  fitness: number;
}

interface GAConfig {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
}

export class GeneticAlgorithm {
  private population: Individual[] = [];
  private config: GAConfig;
  private bestSolution: Individual | null = null;

  constructor(config: Partial<GAConfig> = {}) {
    this.config = {
      populationSize: config.populationSize || 100,
      generations: config.generations || 1000,
      mutationRate: config.mutationRate || 0.1,
      crossoverRate: config.crossoverRate || 0.8,
      elitismRate: config.elitismRate || 0.1,
    };
  }

  private createIndividual(genes: string[]): Individual {
    return {
      genes: genes.sort(() => Math.random() - 0.5),
      fitness: 0,
    };
  }

  initializePopulation(genePool: string[]) {
    this.population = [];
    for (let i = 0; i < this.config.populationSize; i++) {
      const genes = [...genePool];
      this.population.push(this.createIndividual(genes));
    }
    logger.info(`GA population initialized with ${this.config.populationSize} individuals`);
  }

  evaluateFitness(fitnessFunction: (genes: string[]) => number) {
    for (const individual of this.population) {
      individual.fitness = fitnessFunction(individual.genes);
      if (!this.bestSolution || individual.fitness > this.bestSolution.fitness) {
        this.bestSolution = { ...individual };
      }
    }
  }

  selection(): Individual[] {
    // Tournament selection
    const selected: Individual[] = [];
    const tournamentSize = 5;

    for (let i = 0; i < this.population.length; i++) {
      let best = this.population[Math.floor(Math.random() * this.population.length)];
      for (let j = 0; j < tournamentSize; j++) {
        const candidate = this.population[Math.floor(Math.random() * this.population.length)];
        if (candidate.fitness > best.fitness) {
          best = candidate;
        }
      }
      selected.push(best);
    }

    return selected;
  }

  crossover(parent1: Individual, parent2: Individual): [Individual, Individual] {
    if (Math.random() > this.config.crossoverRate) {
      return [{ ...parent1 }, { ...parent2 }];
    }

    const crossoverPoint = Math.floor(Math.random() * parent1.genes.length);
    const child1Genes = [
      ...parent1.genes.slice(0, crossoverPoint),
      ...parent2.genes.slice(crossoverPoint),
    ];
    const child2Genes = [
      ...parent2.genes.slice(0, crossoverPoint),
      ...parent1.genes.slice(crossoverPoint),
    ];

    return [
      { genes: child1Genes, fitness: 0 },
      { genes: child2Genes, fitness: 0 },
    ];
  }

  mutate(individual: Individual) {
    if (Math.random() > this.config.mutationRate) return;

    // Swap mutation
    const index1 = Math.floor(Math.random() * individual.genes.length);
    const index2 = Math.floor(Math.random() * individual.genes.length);
    [individual.genes[index1], individual.genes[index2]] = [
      individual.genes[index2],
      individual.genes[index1],
    ];
  }

  evolve(fitnessFunction: (genes: string[]) => number) {
    for (let generation = 0; generation < this.config.generations; generation++) {
      this.evaluateFitness(fitnessFunction);

      // Elitism
      const eliteCount = Math.floor(this.config.populationSize * this.config.elitismRate);
      const sorted = [...this.population].sort((a, b) => b.fitness - a.fitness);
      const elite = sorted.slice(0, eliteCount);

      // Selection & Crossover
      const selected = this.selection();
      const newPopulation: Individual[] = [];

      for (let i = 0; i < this.config.populationSize - eliteCount; i += 2) {
        const parent1 = selected[Math.floor(Math.random() * selected.length)];
        const parent2 = selected[Math.floor(Math.random() * selected.length)];
        const [child1, child2] = this.crossover(parent1, parent2);

        this.mutate(child1);
        this.mutate(child2);

        newPopulation.push(child1, child2);
      }

      this.population = [...elite, ...newPopulation.slice(0, this.config.populationSize - eliteCount)];

      if ((generation + 1) % 100 === 0) {
        logger.debug(`GA Generation ${generation + 1}: Best fitness = ${this.bestSolution?.fitness}`);
      }
    }
  }

  getBestSolution(): Individual | null {
    return this.bestSolution;
  }
}

export const createGA = (config?: Partial<GAConfig>) => new GeneticAlgorithm(config);
