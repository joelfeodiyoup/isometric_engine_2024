import perlin from 'perlin-noise';

export const generateGrid = (width: number, height: number) => {
  const options = {
    amplitude: .1,
    octaveCount: 3
  }
  const grid = perlin.generatePerlinNoise(width, height, options).map(n => {
    return Math.floor(n * 5);
  });
  return grid;
}