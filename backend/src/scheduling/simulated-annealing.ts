import logger from '../../utils/logger';

interface SAConfig {
  initialTemperature: number;
  coolingRate: number;
  iterations: number;
  minTemperature: number;
}

export class SimulatedAnnealing {
  private config: SAConfig;
  private bestSolution: string[] | null = null;
  private bestFitness: number = 0;

  constructor(config: Partial<SAConfig> = {}) {
    this.config = {
      initialTemperature: config.initialTemperature || 100,
      coolingRate: config.coolingRate || 0.99,
      iterations: config.iterations || 10000,
      minTemperature: config.minTemperature || 0.01,
    };
  }

  private getCurrentSolution(genes: string[]): string[] {
    return [...genes];
  }

  private getNeighbor(solution: string[]): string[] {
    const neighbor = [...solution];
    const i = Math.floor(Math.random() * neighbor.length);
    const j = Math.floor(Math.random() * neighbor.length);
    [neighbor[i], neighbor[j]] = [neighbor[j], neighbor[i]];
    return neighbor;
  }

  private acceptanceProbability(currentFitness: number, newFitness: number, temperature: number): number {
    if (newFitness > currentFitness) {
      return 1.0;
    }
    return Math.exp((newFitness - currentFitness) / temperature);
  }

  optimize(
    initialSolution: string[],
    fitnessFunction: (solution: string[]) => number,
  ): string[] {
    let currentSolution = this.getCurrentSolution(initialSolution);
    let currentFitness = fitnessFunction(currentSolution);

    this.bestSolution = currentSolution;
    this.bestFitness = currentFitness;

    let temperature = this.config.initialTemperature;
    let iteration = 0;

    while (temperature > this.config.minTemperature && iteration < this.config.iterations) {
      const neighbor = this.getNeighbor(currentSolution);
      const neighborFitness = fitnessFunction(neighbor);

      if (this.acceptanceProbability(currentFitness, neighborFitness, temperature) > Math.random()) {
        currentSolution = neighbor;
        currentFitness = neighborFitness;
      }

      if (neighborFitness > this.bestFitness) {
        this.bestSolution = neighbor;
        this.bestFitness = neighborFitness;
      }

      temperature *= this.config.coolingRate;
      iteration++;

      if (iteration % 1000 === 0) {
        logger.debug(`SA Iteration ${iteration}: Best fitness = ${this.bestFitness}`);
      }
    }

    logger.info(`SA completed after ${iteration} iterations with best fitness: ${this.bestFitness}`);
    return this.bestSolution || currentSolution;
  }
}

export const createSA = (config?: Partial<SAConfig>) => new SimulatedAnnealing(config);
