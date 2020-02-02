import { Construct } from '@aws-cdk/core';
import { Rule, Schedule} from '@aws-cdk/aws-events';
import {EC2Stop} from './ec2-target'
import {Instance, InstanceProps} from '@aws-cdk/aws-ec2'

export interface InstanceStopRuleProps extends InstanceProps {
    /**
     * Hour to stop the instance
     */
  readonly stopHour: number,
}

/**
 * Instance with an Cloudwatch stop rule
 */
export class InstanceStopRule  extends Instance {
    constructor(scope: Construct, id: string, localProps: InstanceStopRuleProps) {
        super(scope, id+"Instance", localProps);
        let hour = '17';
        if( localProps.stopHour)
            hour = localProps.stopHour.toString();

        const target = new EC2Stop(scope,"StopTarget", this);
        new Rule(this, 'instanceStopRule', {
            ruleName: 'CostStopInstance'+this.instanceId,
            description: "Automated Stop rule for an instance",
            schedule: Schedule.cron({
                minute: '05',
                hour:  hour,
                month: '*',
                weekDay: '*',
                year: '*',
            }),
            enabled: true,
            targets: [target]
        });

    }
}