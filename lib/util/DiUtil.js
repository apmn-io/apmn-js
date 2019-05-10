import {
  is,
  getBusinessObject
} from './ModelUtil';

import {
  forEach
} from 'min-dash';


export function isExpanded(element) {

  if (is(element, 'apmn:CallActivity')) {
    return false;
  }

  if (is(element, 'apmn:SubProcess')) {
    return !!getBusinessObject(element).di.isExpanded;
  }

  if (is(element, 'apmn:Participant')) {
    return !!getBusinessObject(element).processRef;
  }

  return true;
}

export function isInterrupting(element) {
  return element && getBusinessObject(element).isInterrupting !== false;
}

export function isEventSubProcess(element) {
  return element && !!getBusinessObject(element).triggeredByEvent;
}

export function hasEventDefinition(element, eventType) {
  var bo = getBusinessObject(element),
      hasEventDefinition = false;

  if (bo.eventDefinitions) {
    forEach(bo.eventDefinitions, function(event) {
      if (is(event, eventType)) {
        hasEventDefinition = true;
      }
    });
  }

  return hasEventDefinition;
}

export function hasErrorEventDefinition(element) {
  return hasEventDefinition(element, 'apmn:ErrorEventDefinition');
}

export function hasEscalationEventDefinition(element) {
  return hasEventDefinition(element, 'apmn:EscalationEventDefinition');
}

export function hasCompensateEventDefinition(element) {
  return hasEventDefinition(element, 'apmn:CompensateEventDefinition');
}
