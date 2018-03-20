module.exports = (data) => {
  const output = new Float32Array(data.length / 2);
  for (let j = 0; j < data.length; j += 2) {
    const i = data.readInt8(j);
    const q = data.readInt8(j + 1);
    output[j / 2] = Math.sqrt((i * i) + (q * q));
  }
  return output;
};
