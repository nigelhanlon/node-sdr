#!/usr/bin/env node
const SDRInfo = require('./index');

const sdrConfig = SDRInfo();

const bufToStr = buf => buf.toString('utf8').replace(/\0/g, '');

console.log('Found %d SDR device(s)', sdrConfig.deviceCount);

sdrConfig.devices.forEach(dev => {
  console.log(`[ ID: ${dev.id}, ${bufToStr(dev.vendor)}, ${bufToStr(dev.product)}, S/N: ${bufToStr(dev.serial)}]`);
});
