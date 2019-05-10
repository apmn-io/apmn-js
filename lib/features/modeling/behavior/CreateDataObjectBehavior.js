import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';


/**
 * APMN specific create data object behavior
 */
export default function CreateDataObjectBehavior(eventBus, bpmnFactory, moddle) {

  CommandInterceptor.call(this, eventBus);

  this.preExecute('shape.create', function(event) {

    var context = event.context,
        shape = context.shape;

    if (is(shape, 'apmn:DataObjectReference') && shape.type !== 'label') {

      // create a DataObject every time a DataObjectReference is created
      var dataObject = bpmnFactory.create('apmn:DataObject');

      // set the reference to the DataObject
      shape.businessObject.dataObjectRef = dataObject;
    }
  });

}

CreateDataObjectBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'moddle'
];

inherits(CreateDataObjectBehavior, CommandInterceptor);