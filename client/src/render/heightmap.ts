import tasmania from "./heightmaps/tasmania.png";
import blue from "./heightmaps/blue.png";
import tree from "./../images/trees/tree_01.png";

export const getHeightMap = (
  width: number,
  height: number
): number[][] => {
  const one = document.getElementById("testing-canvas") as HTMLCanvasElement;
  one.width = width;
  one.height = height;
  // const image = new Image();
  // image.src = tasmania;

  const image = document.getElementById('heightmap')! as HTMLImageElement;

  const ctx = one.getContext("2d")!;
  ctx.drawImage(image, 0, 0, width, height);
  ctx.getImageData;
  let minOriginal = Number.MAX_VALUE;
  let maxOriginal = Number.MIN_VALUE;
  const max = 3573;
  const min = -4698;
  const depth = (-1 * min) * (255 / (max - min));
  // const depth = (0 - min) / 256;
  const h = Array.from(Array(height), (_, row) => {
    return Array.from(Array(width), (_, col) => {
      const pixel = ctx.getImageData(col, row, 1, 1).data;
      const avg = (pixel[0] + pixel[1] + pixel[2]) / 3;
      const shade = ((avg - depth) / 256) * 100;
      minOriginal = Math.min(minOriginal, avg);
      maxOriginal = Math.max(maxOriginal, avg);
      return shade;
    });
  });
  // const min = h.flat().reduce((min, curr) => min = Math.min(min, curr), Number.MAX_VALUE);
  console.log(`minOriginal: ${minOriginal}`);
  console.log(`maxOriginal: ${maxOriginal}`);
  console.log(`min: ${min}`);
  return h;
  return new Promise((resolve) => {
    image.addEventListener(
      "load",
      async () => {
        // const ctx = one.getContext("2d")!;
        // ctx.drawImage(image, 0, 0, width, height);
        // ctx.getImageData;
        // const h = Array.from(Array(height), (_, row) => {
        //   return Array.from(Array(width), (_, col) => {
        //     const pixel = ctx.getImageData(col, row, 1, 1).data;
        //     const avg = (pixel[0] + pixel[1] + pixel[3]) / 3;
        //     return avg;
        //   });
        // });
        console.log(h);
        resolve(h);
      },
      false
    );
  });
};
