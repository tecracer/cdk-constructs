# tecRacer CDK Packages

This package creates an EC2 instance with an Cloudwatch Stop rule included.

## Installation

node

```bash
npm i cdk-instance-stop-rule
```



## Example usage ts

```js

    // The code that defines your stack goes here
    const testVPC = new Vpc(this, 'TestVpc', {
      maxAzs: 2,
  });
  const linuxImage = new AmazonLinuxImage({
      generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
      edition: AmazonLinuxEdition.STANDARD,
      virtualization: AmazonLinuxVirt.HVM,
      storage: AmazonLinuxStorage.GENERAL_PURPOSE,
  });
  const instanceType = InstanceType.of(InstanceClass.T3A, InstanceSize.MICRO);
  new InstanceStopRule(this, "myTest Instance",{
      machineImage: linuxImage,
      instanceType: instanceType,
      instanceName: "testServer",
      vpc: testVPC,
      stopHour: 17,
  });
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests