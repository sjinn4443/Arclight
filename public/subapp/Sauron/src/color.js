export function parseRGB(rgbStr) {
  const result = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/.exec(rgbStr);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: parseInt(result[1], 10),
    g: parseInt(result[2], 10),
    b: parseInt(result[3], 10),
  };
}

export function brightenColor(color, factor) {
  return {
    r: Math.min(Math.round(color.r * factor), 255),
    g: Math.min(Math.round(color.g * factor), 255),
    b: Math.min(Math.round(color.b * factor), 255),
  };
}

export function getReflexColor(value) {
  const colorStops = [
    {
      value: 0,
      color: {
        r: Math.round(173 * 0.7),
        g: Math.round(216 * 0.7),
        b: Math.round(230 * 0.7),
      },
    },
    {
      value: 33,
      color: {
        r: Math.round(255 * 0.7),
        g: Math.round(220 * 0.7),
        b: Math.round(0 * 0.7),
      },
    },
    {
      value: 66,
      color: {
        r: Math.round(218 * 0.7),
        g: Math.round(58 * 0.7),
        b: Math.round(0 * 0.7),
      },
    },
    {
      value: 100,
      color: {
        r: Math.round(255 * 0.7),
        g: Math.round(0 * 0.7),
        b: Math.round(0 * 0.7),
      },
    },
  ];

  let lowerStop;
  let upperStop;
  for (let i = 0; i < colorStops.length - 1; i += 1) {
    if (value >= colorStops[i].value && value <= colorStops[i + 1].value) {
      lowerStop = colorStops[i];
      upperStop = colorStops[i + 1];
      break;
    }
  }

  if (!lowerStop || !upperStop) {
    return "rgb(255, 0, 0)";
  }

  const factor =
    (value - lowerStop.value) / (upperStop.value - lowerStop.value);
  const r = Math.round(
    lowerStop.color.r + (upperStop.color.r - lowerStop.color.r) * factor,
  );
  const g = Math.round(
    lowerStop.color.g + (upperStop.color.g - lowerStop.color.g) * factor,
  );
  const b = Math.round(
    lowerStop.color.b + (upperStop.color.b - lowerStop.color.b) * factor,
  );
  return `rgb(${r}, ${g}, ${b})`;
}
