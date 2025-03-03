import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';


/**
 * APMN specific create boundary event behavior
 */
export default function CreateBoundaryEventBehavior(
    eventBus, modeling, elementFactory,
    bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  /**
   * replace intermediate event with boundary event when
   * attaching it to a shape
   */

  this.preExecute('shape.create', function(context) {
    var shape = context.shape,
        host = context.host,
        businessObject,
        boundaryEvent;

    var attrs = {
      cancelActivity: true
    };

    if (host && is(shape, 'apmn:IntermediateThrowEvent')) {
      attrs.attachedToRef = host.businessObject;

      businessObject = bpmnFactory.create('apmn:BoundaryEvent', attrs);

      boundaryEvent = {
        type: 'apmn:BoundaryEvent',
        businessObject: businessObject
      };

      context.shape = elementFactory.createShape(boundaryEvent);
    }
  }, true);
}

CreateBoundaryEventBehavior.$inject = [
  'eventBus',
  'modeling',
  'elementFactory',
  'bpmnFactory'
];

inherits(CreateBoundaryEventBehavior, CommandInterceptor);
