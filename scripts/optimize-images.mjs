import sharp from 'sharp';

// Keep the original photos as high-density fallbacks and regenerate smaller
// candidates after replacing a source image. Do not upscale these variants.
for (const [name, widths] of [
  ['ethan-care', [480, 720]],
  ['services/recovery-care', [480, 720]],
  ['services/performance-training', [480, 720]],
  ['excel-logo', [300]],
]) {
  for (const width of widths) {
    await sharp(`public/images/${name}.webp`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(`public/images/${name}-${width}.webp`);
  }
}
