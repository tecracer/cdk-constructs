import { App, Stack, StackProps } from '../node_modules/@aws-cdk/core/lib';
import {AmazonLinuxGeneration, AmazonLinuxImage, AmazonLinuxEdition, AmazonLinuxStorage, InstanceType, InstanceClass, InstanceSize, AmazonLinuxVirt, Vpc} from '../node_modules/@aws-cdk/aws-ec2/lib';

import {InstanceStopRule} from '../lib/InstanceStopRule';


class InstanceStopRuleInteg extends Stack {
    constructor(scope: App, id: string, props?: StackProps) {
        super(scope, id, props);
        
        const testVPC = new Vpc(this, 'TestVpc',{
          maxAzs: 2,
        }); 
        const linuxImage = new AmazonLinuxImage({
            generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
            edition: AmazonLinuxEdition.STANDARD,
            virtualization: AmazonLinuxVirt.HVM,
            storage: AmazonLinuxStorage.GENERAL_PURPOSE,
          });
      
          const instanceType = InstanceType.of(InstanceClass.T3A, InstanceSize.MICRO);
      
         
          new InstanceStopRule(this,"StopRule",
          {
            machineImage: linuxImage,
            instanceType: instanceType,
            instanceName: "testServer",
            vpc: testVPC,
            stopHour: 17,
      
          });

    }
}

const app = new App();

new InstanceStopRuleInteg(app, 'InstanceStopRuleInteg');

app.synth();