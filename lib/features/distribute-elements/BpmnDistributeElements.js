import {
  filter
} from 'min-dash';

import {
  isAny
} from '../modeling/util/ModelingUtil';


/**
 * Registers element exclude filters for elements that
 * currently do not support distribution.
 */
export default function BpmnDistributeElements(distributeElements) {

  distributeElements.registerFilter(function(elements) {
    return filter(elements, function(element) {
      var cannotDistribute = isAny(element, [
        'apmn:Association',
        'apmn:BoundaryEvent',
        'apmn:DataInputAssociation',
        'apmn:DataOutputAssociation',
        'apmn:Lane',
        'apmn:MessageFlow',
        'apmn:Participant',
        'apmn:SequenceFlow',
        'apmn:TextAnnotation'
      ]);

      return !(element.labelTarget || cannotDistribute);
    });
  });
}

BpmnDistributeElements.$inject = [ 'distributeElements' ];