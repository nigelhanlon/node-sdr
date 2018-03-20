const rtlsdr = require('rtl-sdr');

const getDevice = id => {
  const vendor = Buffer.alloc(256);
  const product = Buffer.alloc(256);
  const serial = Buffer.alloc(256);
  rtlsdr.get_device_usb_strings(id, vendor, product, serial);
  return { id, vendor, product, serial };
};

module.exports = () => {
  const deviceCount = rtlsdr.get_device_count() || 0;

  return {
    deviceCount,
    devices: [...Array(deviceCount)].map((_, i) => getDevice(i))
  };
};
