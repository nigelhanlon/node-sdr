const mockRTLSDR = {
  get_device_usb_strings: jest.fn((id, vendor, product, serial) => {
    vendor.fill('b');
    product.fill('o');
    serial.fill('b');
  }),
  get_device_count: jest.fn(() => 1)
};

jest.mock('rtl-sdr', () => mockRTLSDR);

const SDRInfo = require('../index');

describe('SDR Info Module', () => {
  it('should return device information correctly', () => {
    const info = SDRInfo();
    expect(info).toHaveProperty('deviceCount');
    expect(info.deviceCount).toBe(1);
    expect(info).toHaveProperty('devices');
    const firstDevice = info.devices[0];
    expect(firstDevice.id).toBe(0);
  });
});
