# Alibaba Cloud IoT Platform Practice Using Node.js - PART ONE

Today we are going to look at an example of using Alibaba cloud IoT platform. It's a powerful platform works with various clients, that has build-in TSL(Thing Specific Language) models such as 'property', 'event', 'service', using MQTT for subscribe and publish data. In advanced features, it supports 'device shadow', 'rule engine', data forwarding to visualization tools as well as other cloud services. [Read More](https://www.alibabacloud.com/solutions/IoT)<br/>

## Before Start
- First, you need to create an alibaba cloud account. [visit here](alibabacloud.com)
- Install Node.js on your local machine. [see guideline](https://nodejs.org/en/download/)
- Install Alibaba SDK using npm
```bash
npm install alibabacloud-iot-device-sdk --save
```

## Register A 'Thing'
- Select and active IoT platform in your account<br/>
   ![Select and active IoT platform in your account](https://drive.google.com/uc?export=view&id=1pAMR_sK-iCd-p1bgi9FZXoP_Q19PflUr)
- Click on the wizard to quickly start<br/>
   ![Click on the wizard to quickly start](https://drive.google.com/uc?export=view&id=1Fxo0LGBMAAbY3tQTfdHaIFTDaUj-tzfP)
- Name your product and specify a device under this category<br/>
   ![Name your product and specify a device under this category](https://drive.google.com/uc?export=view&id=1_2uRY-dZkis45Bg_QUFFx8ExdBuoVUsn)
- Choose your development platform<br/>
   ![Choose your development platform](https://drive.google.com/uc?export=view&id=1Ki_UD7WY9ZvXvimeX18qZzSzgosbjymf)
- IoT platform will automatically generates credentials and default properties<br/>
   ![IoT platform will automatically generates credentials and default properties](https://drive.google.com/uc?export=view&id=1uwN71AbmgH_b4WANAbSgoQXZNCqYnGpo)
- If you downloaded their demo, you can start to run<br/>
   ![If you downloaded their demo, then you can start to run](https://drive.google.com/uc?export=view&id=1H5BWl1kR4waUEPYdIdgDEBdM-_-Ziykl)

## Configure A Device
This is an example property, event and service, the TSL schema is presented as follow
```javascript
{
  "properties": [
    {
      "identifier": "CurrentTemperature",
      "dataType": {
        "type": "double"
      }
    }
  ],
  "events": [
    {
      "outputData": [
        {
          "identifier": "waterLevel",
          "dataType": {
            "type": "enum"
          }
        }
      ],
      "identifier": "waterLeakEvent",
      "type": "alert"
    }
  ],
  "services": [
    {
      "outputData": [
        {
          "identifier": "isAirConditionerOn",
          "dataType": {
            "type": "bool"
          }
        }
      ],
      "identifier": "enviromentTemperatureControlService",
      "inputData": [
        {
          "identifier": "airConditionerSwitch",
          "dataType": {
            "type": "bool"
          }
        }
      ]
    }
  ]
}
```
- Property setting on platform<br/>
  ![Property setting on platform](https://drive.google.com/uc?export=view&id=1h6F0Qd_HrXBt8q8OkyB7h2gB-ZoEIK7M)
- Event setting on platform<br/>
  ![Event setting on platform](https://drive.google.com/uc?export=view&id=1GJkYuCwtev2USwO_ffYtlbHQlgNB9ore)
- Service setting on platform<br/>
  ![Service setting on platform](https://drive.google.com/uc?export=view&id=1AYwgJIKDzuriGKL0L5yz-kkrBeZvKFcX)
- Service parameter setting on platform<br/>
  ![Service parameter setting on platform](https://drive.google.com/uc?export=view&id=12evtj95ur0cskLP9gl4jJxhXI0VCn6If)

## Connect To IoT Platform
*Import Alibaba SDK for node.js*
```javascript
const iot = require('alibabacloud-iot-device-sdk');
const deviceConfig = require('./device_id_password.json');
```
*Find connection credentials at product page*
```javascript
  {
    productKey: "xxxxxxx",
    deviceName: "JThermometer_001",
    deviceSecret: "xxxxxxxxx",
    region: "cn-xxxxx"
  }
```
*Initialize a device object*
```javascript
const device = iot.device({
  productKey: `${deviceConfig.productKey}`,
  deviceName: `${deviceConfig.deviceName}`,
  deviceSecret: `${deviceConfig.deviceSecret}`,
});
```
*Connect to IoT platform and report temperature*
```javascript
device.on('connect', () => {
  device.postProps({
    CurrentTemperature: 26.2
  }, (res) => {
    console.log(`response from server:`,res);
  })
})
```
*Trigger a warning of water overflow*
```javascript
  device.postEvent('waterLeakEvent', {
    waterLevel: 3
  }, (res) => {
    console.log(`response from server:`, res)
  })
```
*Listen serivce call for temperature control*
```javascript
device.onService('enviromentTemperatureControlService', function (res,reply) {
  var command = { 
    targetStatus: res.params.airConditionerSwitch
  }
  /*  
   * Code block here for any operation
   */
  //Reply to server
  reply({
    code: 200,
    data: {
        isAirConditionerOn: command.targetStatus,
      }
    })
  })
```
*Response from server*
```javascript
    { 
        code: 200,
        data: {},
        id: '1|exp-topic|/sys/[productKey]/JThermometer_001/thing/event/property/post_reply',
        message: 'success',
        method: 'thing.event.property.post',
        version: '1.0' 
    }
```

## Verify Data
- Alibaba IoT provides debug tools<br/>
  ![Debuging](https://drive.google.com/uc?export=view&id=1Z5icT5fROlz2zsVkuxzvclQ0dlWmvgEh)
- Using debug tool to call for a service<br/>
  ![Call for a service](https://drive.google.com/uc?export=view&id=17AkOU_bXPZOVQ8fgD2G6fcZNFud145Fa)


***Read and follow my blog on Nybrotech.com/blog***