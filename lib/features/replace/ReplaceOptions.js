export var START_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'apmn:StartEvent'
    }
  },
  {
    label: 'Intermediate Throw Event',
    actionName: 'replace-with-none-intermediate-throwing',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'apmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'apmn:EndEvent'
    }
  },
  {
    label: 'Message Start Event',
    actionName: 'replace-with-message-start',
    className: 'bpmn-icon-start-event-message',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer Start Event',
    actionName: 'replace-with-timer-start',
    className: 'bpmn-icon-start-event-timer',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition'
    }
  },
  {
    label: 'Conditional Start Event',
    actionName: 'replace-with-conditional-start',
    className: 'bpmn-icon-start-event-condition',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Signal Start Event',
    actionName: 'replace-with-signal-start',
    className: 'bpmn-icon-start-event-signal',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  }
];

export var INTERMEDIATE_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'apmn:StartEvent'
    }
  },
  {
    label: 'Intermediate Throw Event',
    actionName: 'replace-with-none-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'apmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'apmn:EndEvent'
    }
  },
  {
    label: 'Message Intermediate Catch Event',
    actionName: 'replace-with-message-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'apmn:IntermediateCatchEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Message Intermediate Throw Event',
    actionName: 'replace-with-message-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-message',
    target: {
      type: 'apmn:IntermediateThrowEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer Intermediate Catch Event',
    actionName: 'replace-with-timer-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'apmn:IntermediateCatchEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition'
    }
  },
  {
    label: 'Escalation Intermediate Throw Event',
    actionName: 'replace-with-escalation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-escalation',
    target: {
      type: 'apmn:IntermediateThrowEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Conditional Intermediate Catch Event',
    actionName: 'replace-with-conditional-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'apmn:IntermediateCatchEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Link Intermediate Catch Event',
    actionName: 'replace-with-link-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-link',
    target: {
      type: 'apmn:IntermediateCatchEvent',
      eventDefinitionType: 'apmn:LinkEventDefinition'
    }
  },
  {
    label: 'Link Intermediate Throw Event',
    actionName: 'replace-with-link-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-link',
    target: {
      type: 'apmn:IntermediateThrowEvent',
      eventDefinitionType: 'apmn:LinkEventDefinition'
    }
  },
  {
    label: 'Compensation Intermediate Throw Event',
    actionName: 'replace-with-compensation-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-compensation',
    target: {
      type: 'apmn:IntermediateThrowEvent',
      eventDefinitionType: 'apmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal Intermediate Catch Event',
    actionName: 'replace-with-signal-intermediate-catch',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'apmn:IntermediateCatchEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  },
  {
    label: 'Signal Intermediate Throw Event',
    actionName: 'replace-with-signal-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-throw-signal',
    target: {
      type: 'apmn:IntermediateThrowEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  }
];

export var END_EVENT = [
  {
    label: 'Start Event',
    actionName: 'replace-with-none-start',
    className: 'bpmn-icon-start-event-none',
    target: {
      type: 'apmn:StartEvent'
    }
  },
  {
    label: 'Intermediate Throw Event',
    actionName: 'replace-with-none-intermediate-throw',
    className: 'bpmn-icon-intermediate-event-none',
    target: {
      type: 'apmn:IntermediateThrowEvent'
    }
  },
  {
    label: 'End Event',
    actionName: 'replace-with-none-end',
    className: 'bpmn-icon-end-event-none',
    target: {
      type: 'apmn:EndEvent'
    }
  },
  {
    label: 'Message End Event',
    actionName: 'replace-with-message-end',
    className: 'bpmn-icon-end-event-message',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Escalation End Event',
    actionName: 'replace-with-escalation-end',
    className: 'bpmn-icon-end-event-escalation',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Error End Event',
    actionName: 'replace-with-error-end',
    className: 'bpmn-icon-end-event-error',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Cancel End Event',
    actionName: 'replace-with-cancel-end',
    className: 'bpmn-icon-end-event-cancel',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:CancelEventDefinition'
    }
  },
  {
    label: 'Compensation End Event',
    actionName: 'replace-with-compensation-end',
    className: 'bpmn-icon-end-event-compensation',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Signal End Event',
    actionName: 'replace-with-signal-end',
    className: 'bpmn-icon-end-event-signal',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  },
  {
    label: 'Terminate End Event',
    actionName: 'replace-with-terminate-end',
    className: 'bpmn-icon-end-event-terminate',
    target: {
      type: 'apmn:EndEvent',
      eventDefinitionType: 'apmn:TerminateEventDefinition'
    }
  }
];

export var GATEWAY = [
  {
    label: 'Exclusive Gateway',
    actionName: 'replace-with-exclusive-gateway',
    className: 'bpmn-icon-gateway-xor',
    target: {
      type: 'apmn:ExclusiveGateway'
    }
  },
  {
    label: 'Parallel Gateway',
    actionName: 'replace-with-parallel-gateway',
    className: 'bpmn-icon-gateway-parallel',
    target: {
      type: 'apmn:ParallelGateway'
    }
  },
  {
    label: 'Inclusive Gateway',
    actionName: 'replace-with-inclusive-gateway',
    className: 'bpmn-icon-gateway-or',
    target: {
      type: 'apmn:InclusiveGateway'
    }
  },
  {
    label: 'Complex Gateway',
    actionName: 'replace-with-complex-gateway',
    className: 'bpmn-icon-gateway-complex',
    target: {
      type: 'apmn:ComplexGateway'
    }
  },
  {
    label: 'Event based Gateway',
    actionName: 'replace-with-event-based-gateway',
    className: 'bpmn-icon-gateway-eventbased',
    target: {
      type: 'apmn:EventBasedGateway',
      instantiate: false,
      eventGatewayType: 'Exclusive'
    }
  }
  // Gateways deactivated until https://github.com/apmn-io/apmn-js/issues/194
  // {
  //   label: 'Event based instantiating Gateway',
  //   actionName: 'replace-with-exclusive-event-based-gateway',
  //   className: 'bpmn-icon-exclusive-event-based',
  //   target: {
  //     type: 'apmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Exclusive' }
  //   }
  // },
  // {
  //   label: 'Parallel Event based instantiating Gateway',
  //   actionName: 'replace-with-parallel-event-based-instantiate-gateway',
  //   className: 'bpmn-icon-parallel-event-based-instantiate-gateway',
  //   target: {
  //     type: 'apmn:EventBasedGateway'
  //   },
  //   options: {
  //     businessObject: { instantiate: true, eventGatewayType: 'Parallel' }
  //   }
  // }
];

export var SUBPROCESS_EXPANDED = [
  {
    label: 'Transaction',
    actionName: 'replace-with-transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'apmn:Transaction',
      isExpanded: true
    }
  },
  {
    label: 'Event Sub Process',
    actionName: 'replace-with-event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'apmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  },
  {
    label: 'Sub Process (collapsed)',
    actionName: 'replace-with-collapsed-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'apmn:SubProcess',
      isExpanded: false
    }
  }
];

export var TRANSACTION = [
  {
    label: 'Sub Process',
    actionName: 'replace-with-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'apmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Event Sub Process',
    actionName: 'replace-with-event-subprocess',
    className: 'bpmn-icon-event-subprocess-expanded',
    target: {
      type: 'apmn:SubProcess',
      triggeredByEvent: true,
      isExpanded: true
    }
  }
];

export var EVENT_SUB_PROCESS = [
  {
    label: 'Sub Process',
    actionName: 'replace-with-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'apmn:SubProcess',
      isExpanded: true
    }
  },
  {
    label: 'Transaction',
    actionName: 'replace-with-transaction',
    className: 'bpmn-icon-transaction',
    target: {
      type: 'apmn:Transaction',
      isExpanded: true
    }
  }
];

export var TASK = [
  {
    label: 'Task',
    actionName: 'replace-with-task',
    className: 'bpmn-icon-task',
    target: {
      type: 'apmn:Task'
    }
  },
  {
    label: 'Send Task',
    actionName: 'replace-with-send-task',
    className: 'bpmn-icon-send',
    target: {
      type: 'apmn:SendTask'
    }
  },
  {
    label: 'Receive Task',
    actionName: 'replace-with-receive-task',
    className: 'bpmn-icon-receive',
    target: {
      type: 'apmn:ReceiveTask'
    }
  },
  {
    label: 'User Task',
    actionName: 'replace-with-user-task',
    className: 'bpmn-icon-user',
    target: {
      type: 'apmn:UserTask'
    }
  },
  {
    label: 'Manual Task',
    actionName: 'replace-with-manual-task',
    className: 'bpmn-icon-manual',
    target: {
      type: 'apmn:ManualTask'
    }
  },
  {
    label: 'Business Rule Task',
    actionName: 'replace-with-rule-task',
    className: 'bpmn-icon-business-rule',
    target: {
      type: 'apmn:BusinessRuleTask'
    }
  },
  {
    label: 'Service Task',
    actionName: 'replace-with-service-task',
    className: 'bpmn-icon-service',
    target: {
      type: 'apmn:ServiceTask'
    }
  },
  {
    label: 'Script Task',
    actionName: 'replace-with-script-task',
    className: 'bpmn-icon-script',
    target: {
      type: 'apmn:ScriptTask'
    }
  },
  {
    label: 'Call Activity',
    actionName: 'replace-with-call-activity',
    className: 'bpmn-icon-call-activity',
    target: {
      type: 'apmn:CallActivity'
    }
  },
  {
    label: 'Sub Process (collapsed)',
    actionName: 'replace-with-collapsed-subprocess',
    className: 'bpmn-icon-subprocess-collapsed',
    target: {
      type: 'apmn:SubProcess',
      isExpanded: false
    }
  },
  {
    label: 'Sub Process (expanded)',
    actionName: 'replace-with-expanded-subprocess',
    className: 'bpmn-icon-subprocess-expanded',
    target: {
      type: 'apmn:SubProcess',
      isExpanded: true
    }
  }
];

export var BOUNDARY_EVENT = [
  {
    label: 'Message Boundary Event',
    actionName: 'replace-with-message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-message',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer Boundary Event',
    actionName: 'replace-with-timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-timer',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition'
    }
  },
  {
    label: 'Escalation Boundary Event',
    actionName: 'replace-with-escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-escalation',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Conditional Boundary Event',
    actionName: 'replace-with-conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-condition',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Error Boundary Event',
    actionName: 'replace-with-error-boundary',
    className: 'bpmn-icon-intermediate-event-catch-error',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Cancel Boundary Event',
    actionName: 'replace-with-cancel-boundary',
    className: 'bpmn-icon-intermediate-event-catch-cancel',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:CancelEventDefinition'
    }
  },
  {
    label: 'Signal Boundary Event',
    actionName: 'replace-with-signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-signal',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  },
  {
    label: 'Compensation Boundary Event',
    actionName: 'replace-with-compensation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-compensation',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Message Boundary Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-message-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-message',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Timer Boundary Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-timer-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-timer',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Escalation Boundary Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-escalation-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-escalation',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Conditional Boundary Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-conditional-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-condition',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition',
      cancelActivity: false
    }
  },
  {
    label: 'Signal Boundary Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-signal-boundary',
    className: 'bpmn-icon-intermediate-event-catch-non-interrupting-signal',
    target: {
      type: 'apmn:BoundaryEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition',
      cancelActivity: false
    }
  }
];

export var EVENT_SUB_PROCESS_START_EVENT = [
  {
    label: 'Message Start Event',
    actionName: 'replace-with-message-start',
    className: 'bpmn-icon-start-event-message',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition'
    }
  },
  {
    label: 'Timer Start Event',
    actionName: 'replace-with-timer-start',
    className: 'bpmn-icon-start-event-timer',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition'
    }
  },
  {
    label: 'Conditional Start Event',
    actionName: 'replace-with-conditional-start',
    className: 'bpmn-icon-start-event-condition',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition'
    }
  },
  {
    label: 'Signal Start Event',
    actionName: 'replace-with-signal-start',
    className: 'bpmn-icon-start-event-signal',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition'
    }
  },
  {
    label: 'Error Start Event',
    actionName: 'replace-with-error-start',
    className: 'bpmn-icon-start-event-error',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:ErrorEventDefinition'
    }
  },
  {
    label: 'Escalation Start Event',
    actionName: 'replace-with-escalation-start',
    className: 'bpmn-icon-start-event-escalation',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition'
    }
  },
  {
    label: 'Compensation Start Event',
    actionName: 'replace-with-compensation-start',
    className: 'bpmn-icon-start-event-compensation',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:CompensateEventDefinition'
    }
  },
  {
    label: 'Message Start Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-message-start',
    className: 'bpmn-icon-start-event-non-interrupting-message',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:MessageEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Timer Start Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-timer-start',
    className: 'bpmn-icon-start-event-non-interrupting-timer',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:TimerEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Conditional Start Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-conditional-start',
    className: 'bpmn-icon-start-event-non-interrupting-condition',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:ConditionalEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Signal Start Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-signal-start',
    className: 'bpmn-icon-start-event-non-interrupting-signal',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:SignalEventDefinition',
      isInterrupting: false
    }
  },
  {
    label: 'Escalation Start Event (non-interrupting)',
    actionName: 'replace-with-non-interrupting-escalation-start',
    className: 'bpmn-icon-start-event-non-interrupting-escalation',
    target: {
      type: 'apmn:StartEvent',
      eventDefinitionType: 'apmn:EscalationEventDefinition',
      isInterrupting: false
    }
  }
];

export var SEQUENCE_FLOW = [
  {
    label: 'Sequence Flow',
    actionName: 'replace-with-sequence-flow',
    className: 'bpmn-icon-connection'
  },
  {
    label: 'Default Flow',
    actionName: 'replace-with-default-flow',
    className: 'bpmn-icon-default-flow'
  },
  {
    label: 'Conditional Flow',
    actionName: 'replace-with-conditional-flow',
    className: 'bpmn-icon-conditional-flow'
  }
];

export var PARTICIPANT = [
  {
    label: 'Expanded Pool',
    actionName: 'replace-with-expanded-pool',
    className: 'bpmn-icon-participant',
    target: {
      type: 'apmn:Participant',
      isExpanded: true
    }
  },
  {
    label: 'Collapsed Pool',
    actionName: 'replace-with-collapsed-pool',
    // TODO(@janstuemmel): maybe design new icon
    className: 'bpmn-icon-lane',
    target: {
      type: 'apmn:Participant',
      isExpanded: false
    }
  }
];
