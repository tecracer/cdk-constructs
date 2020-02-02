import { Arn, Construct, Stack,} from '@aws-cdk/core';
import events = require('@aws-cdk/aws-events');
import iam = require('@aws-cdk/aws-iam');
import { Role, PolicyDocument } from '@aws-cdk/aws-iam';
import { Instance } from '@aws-cdk/aws-ec2';

/**
 * Customize the EC2 Topic Event Target
 */
export interface EC2StopFunctionProps {
    /**
     * The event to send to the EC2
     *
     * @default the entire CloudWatch event
     */
    readonly event?: events.RuleTargetInput;
}

/**
 * Use an AWS EC2 stop as an event rule target.
 */
export class EC2Stop implements events.IRuleTarget {
    role: Role;
    instance: Instance;
    scope: Construct;
    // Input is InstanceId
    constructor(scope: Construct, _id: string, instance: Instance) {
        this.instance = instance;
        this.scope = scope;
        const policyDoc = new PolicyDocument();
        const statement = new iam.PolicyStatement();
        statement.addActions("ec2:RebootInstances",
            "ec2:StopInstances");
        const arn = Arn.format(
            {
                resource: "instance",
                service: "ec2",
                resourceName: this.instance.instanceId,
            },
            Stack.of(scope)
            );
        statement.addResources(arn);
        policyDoc.addStatements( statement);
        this.role = new Role(scope, 'stopEventRole',
        {
            assumedBy: new iam.ServicePrincipal('events.amazonaws.com'),
            inlinePolicies: {
                 canStopThis: policyDoc,
            }
        })
    }

    /**
     * Returns a RuleTarget that can be used to trigger ec2 Stop
     * result from a CloudWatch event.
     */
    // Todo: Eval Account Role
    public bind(_rule: events.IRule, _id?: string): events.RuleTargetConfig {
        return {
            id: this.instance.instanceId,
            arn: "arn:aws:events:"+Stack.of(this.scope).region+":"+Stack.of(this.scope).account+":target/stop-instance",
            targetResource: this.instance,
            input:  events.RuleTargetInput.fromText(this.instance.instanceId),
            role: this.role,
        };
    }
}
