import { Construct } from '@aws-cdk/core';
import { Rule, Schedule} from '@aws-cdk/aws-events';
import {EC2Stop} from './ec2-target'
import {Instance, InstanceProps} from '@aws-cdk/aws-ec2'

export interface InstanceStopRuleProps extends InstanceProps {
  readonly stopHour: number,
}
  

export class InstanceStopRule  extends Instance {
    constructor(scope: Construct, id: string, localProps: InstanceStopRuleProps) {
        super(scope, id+"Instance", localProps);
        
        const target = new EC2Stop(this,"StopTarget", this);
        new Rule(this, 'instanceStopRule', {
            // todo name dynamic
            ruleName: 'CostStopInstance'+this.instanceId,
            description: "Automated Stop rule for an instance",
            schedule: Schedule.cron({
                minute: '05',
                hour: '17',
                month: '*',
                weekDay: '*',
                year: '*',
            }),
            enabled: true,
            targets: [target]
        });

    }
}