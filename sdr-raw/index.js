const rtlsdr = require('rtl-sdr');

module.exports = (index, userConfig) => {
  if (isNaN(index)) throw new Error('Device index must be a number');
  const config = {
    autoGain: false,
    maxGain: true,
    gain: 0,
    ppmCorrection: 0,
    agcMode: true,
    frequency: 1090e6,
    sampleRate: 2e6
  };
  Object.assign(config, userConfig);

  const dev = rtlsdr.open(index);
  if (typeof dev === 'number') {
    throw new Error('Error opening the RTLSDR device: %s', dev);
  }

  // Set gain mode to max
  rtlsdr.set_tuner_gain_mode(dev, 1);

  if (!config.autoGain) {
    if (config.maxGain) {
      // Find the maximum gain available

      // Prepare output array for rtl-sdr to write out possible gain
      // values for the device. We set it a large size so it should be
      // possible to accomondate all types of devices:
      const gains = new Int32Array(100);

      // Populate the gains array and get the actual number of different
      // gains available. This number will be less than the actual size of
      // the array:
      const numgains = rtlsdr.get_tuner_gains(dev, gains);

      // Get the highest gain possible
      config.gain = gains[numgains - 1];

      console.log('Max available gain is: %d', config.gain / 10);
    }

    // Set the tuner to the selected gain
    console.log('Setting gain to: %d', config.gain / 10);
    rtlsdr.set_tuner_gain(dev, config.gain);
  } else {
    console.log('Using automatic gain control');
  }

  // Set the frequency correction value for the device
  rtlsdr.set_freq_correction(dev, config.ppmCorrection);

  // Enable or disable the internal digital AGC of the RTL2822
  rtlsdr.set_agc_mode(dev, config.agcMode ? 1 : 0);

  // Tune center frequency
  rtlsdr.set_center_freq(dev, config.frequency);

  // Select sample rate
  rtlsdr.set_sample_rate(dev, config.sampleRate);

  // Reset the internal buffer
  rtlsdr.reset_buffer(dev);

  console.log('Gain reported by device: %d', rtlsdr.get_tuner_gain(dev) / 10);

  return {
    setFrequency: (freq) => rtlsdr.set_center_freq(dev, freq),
    getFrequency: () => rtlsdr.get_center_freq(dev),

    setSampleRate: (rate) => rtlsdr.set_sample_rate(dev, rate),
    getSampleRate: () => rtlsdr.get_sample_rate(dev),

    setAGCMode: (mode) => rtlsdr.set_agc_mode(dev, mode),

    setFreqCorrection: (ppm) => rtlsdr.set_freq_correction(dev, ppm),
    getFreqCorrection: () => rtlsdr.get_freq_correction(dev),

    resetDev: () => rtlsdr.reset_buffer(dev),
    getDevice: () => dev,

    readAsync: (onData, onEnd) => {
      const bufNum = 12; // length (2^18)
      const bufLen = 2 ** 18; // 2^18 == 256k
      return rtlsdr.read_async(dev, onData, onEnd, bufNum, bufLen);
    },
    cancelAsync: () => rtlsdr.cancel_async(dev)

  };
};
