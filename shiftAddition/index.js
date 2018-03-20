module.exports = (data, shift, startingPhase = 0) => {
  const cosDelta = Math.cos(shift * Math.PI);
  const sinDelta = Math.sin(shift * Math.PI);
  let cosPhi = Math.cos(startingPhase);
  let sinPhi = Math.sin(startingPhase);

  const output = new Uint8Array(data.length);

  for (let j = 0; j < data.length; j += 2) {
    let i = data.readInt8(j);
    let q = data.readInt8(j + 1);

    i = cosPhi * i - sinPhi * q;
    q = sinPhi * i + cosPhi * q;

    const cosPhiLast = cosPhi;
    const sinPhiLast = sinPhi;

    cosPhi = cosPhiLast * cosDelta - sinPhiLast * sinDelta;
    sinPhi = sinPhiLast * cosDelta + cosPhiLast * sinDelta;

    output[j] = i;
    output[j + 1] = q;
  }

  let newStartingPhase = startingPhase + shift * Math.PI * data.length;
  while (newStartingPhase > Math.PI) {
    newStartingPhase -= 2 * Math.PI;
  }

  while (newStartingPhase < -Math.PI) {
    newStartingPhase += 2 * Math.PI;
  }

  return { output, newStartingPhase };
};
