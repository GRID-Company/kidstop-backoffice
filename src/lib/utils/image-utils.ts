interface ImageResolution {
  resolution: string;
  imageUrl: string;
}

export const getHighestQualityImage = (
  images: ImageResolution[] | null | undefined
): ImageResolution | null => {
  if (!images || images.length === 0) return null;
  
  return images.reduce((prev, current) => {
    const prevRes = parseInt(prev.resolution.split('x')[0]);
    const currentRes = parseInt(current.resolution.split('x')[0]);
    return currentRes > prevRes ? current : prev;
  });
};

export const filterImagesByMinResolution = (
  images: ImageResolution[],
  minResolution: number
): ImageResolution[] => {
  return images
    .filter((img) => {
      const resolution = parseInt(img.resolution.split('x')[0]);
      return resolution >= minResolution;
    })
    .sort((a, b) => {
      const resA = parseInt(a.resolution.split('x')[0]);
      const resB = parseInt(b.resolution.split('x')[0]);
      return resA - resB;
    });
};
