import { expect as expectCDK, haveResource, SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import InstanceStopRule = require('../lib/index');
import { Vpc, AmazonLinuxImage, AmazonLinuxGeneration, AmazonLinuxEdition, AmazonLinuxVirt, AmazonLinuxStorage, InstanceType, InstanceClass, InstanceSize } from '@aws-cdk/aws-ec2';

test('Cloudwatch Rule created', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");
    // WHEN
 
    const testVPC = new Vpc(stack, 'TestVpc',{
        maxAzs: 2,
      }); 
      const linuxImage = new AmazonLinuxImage({
          generation: AmazonLinuxGeneration.AMAZON_LINUX_2,
          edition: AmazonLinuxEdition.STANDARD,
          virtualization: AmazonLinuxVirt.HVM,
          storage: AmazonLinuxStorage.GENERAL_PURPOSE,
        });
    
        const instanceType = InstanceType.of(InstanceClass.COMPUTE5, InstanceSize.LARGE);
    
       
        new InstanceStopRule.InstanceStopRule(stack,"StopRule",
        {
          machineImage: linuxImage,
          instanceType: instanceType,
          instanceName: "testServer",
          vpc: testVPC,
          stopHour: 17,
    
        });

    // // THEN
    expectCDK(stack).to(haveResource("AWS::EC2::Instance"));

    expectCDK(stack).toMatch({
        
        "StopRuleInstanceinstanceStopRule0091C4EA": {
            "Type": "AWS::Events::Rule",
            "Properties": {
              "Description": "Automated Stop rule for an instance",
              "Name": {
                "Fn::Join": [
                  "",
                  [
                    "CostStopInstance",
                    {
                      "Ref": "StopRuleInstance31E1A33B"
                    }
                  ]
                ]
              },
              "ScheduleExpression": "cron(05 17 ? * * *)",
              "State": "ENABLED",
              "Targets": [
                {
                  "Arn": "arn:aws:events:eu-central-1:12345678912:target/stop-instance",
                  "Id": "Target0",
                  "Input": {
                    "Fn::Join": [
                      "",
                      [
                        "\"",
                        {
                          "Ref": "StopRuleInstance31E1A33B"
                        },
                        "\""
                      ]
                    ]
                  },
                  "RoleArn": {
                    "Fn::GetAtt": [
                      "StopRuleInstancestopEventRoleA0053514",
                      "Arn"
                    ]
                  }
                }
              ]
            }
          }

    }
    );

    
});

