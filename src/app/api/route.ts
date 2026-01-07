function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createRadialGradient(id: number, color: string) {
  const fx = random(0, 0.5).toFixed(18);
  const fy = 0.5;
  return `
    <radialGradient id="rg${id}" fx="${fx}" fy="${fy}">
      <stop offset="0%" stop-color="${color}" />
      <stop offset="100%" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>
  `;
}

function createRect(gradientId: number) {
  const scaleX = random(0.7, 1.5).toFixed(3);
  const scaleY = random(0.7, 1.5).toFixed(3);
  const skewX = random(-10, 10).toFixed(2);
  const rotate = random(0, 360).toFixed(2);
  const tx = random(-200, 200).toFixed(2);
  const ty = random(-200, 200).toFixed(2);
  return `
    <rect x="0" y="0" width="100%" height="100%" class="rect rect${gradientId}"
      transform="translate(300 300) scale(${scaleX} ${scaleY}) skewX(${skewX}) rotate(${rotate}) translate(${tx} ${ty}) translate(-300 -300)"/>
  `;
}

function generateRandomSVG(): string {
  const colors = ["#5135FF", "#FF5828", "#F69CFF", "#FFA50F"];
  const gradients: string[] = [];
  const rects: string[] = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 4; j++) {
        const color = colors[j];
      gradients.push(createRadialGradient(j, color));
      rects.push(createRect(j));
    }
  }
  return `
  <svg width="600" height="400" viewBox="0 0 600 600" style="width:100%;max-width:600px;height:auto;filter:saturate(125%);-webkit-filter:saturate(125%)" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid slice">
    <defs>
      <style>
        #bg {fill:#5135FF}
        .rect0 {fill:url(#rg0)}.rect1 {fill:url(#rg1)}.rect2 {fill:url(#rg2)}.rect3 {fill:url(#rg3)}
      </style>
      ${gradients.join("\n")}
    </defs>
    <rect id="bg" x="0" y="0" width="100%" height="100%"/>
    ${rects.join("\n")}
  </svg>
  `;
}

export async function GET() {
  const svgString = generateRandomSVG();
  return new Response(svgString, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
    },
  });
}
