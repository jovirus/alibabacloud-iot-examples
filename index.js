const iot = require('alibabacloud-iot-device-sdk');
const deviceConfig = require('./device_id_password.json');

// Initialize a device object
const device = iot.device({
  productKey: `${deviceConfig.productKey}`,
  deviceName: `${deviceConfig.deviceName}`,
  deviceSecret: `${deviceConfig.deviceSecret}`,
});

// Connect to IoT platform and report temperature
device.on('connect', () => {
  device.postProps({
    CurrentTemperature: 26.2
  }, (res) => {
    console.log(`response from server:`,res);
  })

  // Trigger a warning of water overflow
  device.postEvent('waterLeakEvent', {
    waterLevel: 3
  }, (res) => {
    console.log(`response from server:`, res)
  })

  // Listen service call for temperature control
device.onService('enviromentTemperatureControlService', function (res,reply) {
  var command = { 
    targetStatus: res.params.airConditionerSwitch
  }
  /*  
   * Code block here for doing any operation  
   */
  //Reply to server
  reply({
    code: 200,
    data: {
        isAirConditionerOn: command.targetStatus,
      }
    })
  })

  device.on('message', (res) => {
    console.log('msg from server:',res);
  })

  device.on('error', (err) => {
    console.log('error:',err);
  })

});
