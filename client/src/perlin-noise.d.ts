// https://www.npmjs.com/package/perlin-noise
declare module 'perlin-noise' {
  const value: {
    generatePerlinNoise(width: number, height: number, options?: {
      amplitude?: number,
      octaveCount?: number,
      persistence?: number,
    }): number[]
  };
  export = value;
}