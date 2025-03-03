import inherits from 'inherits';

import OrderingProvider from 'diagram-js/lib/features/ordering/OrderingProvider';

import {
  isAny
} from '../modeling/util/ModelingUtil';

import {
  findIndex,
  find
} from 'min-dash';


/**
 * a simple ordering provider that makes sure:
 *
 * (0) labels are rendered always on top
 * (1) elements are ordered by a {level} property
 */
export default function BpmnOrderingProvider(eventBus, canvas, translate) {

  OrderingProvider.call(this, eventBus);

  var orders = [
    { type: 'apmn:SubProcess', order: { level: 6 } },
    {
      type: 'apmn:SequenceFlow',
      order: {
        level: 3,
        containers: [
          'apmn:Participant',
          'apmn:FlowElementsContainer'
        ]
      }
    },
    // handle DataAssociation(s) like message flows and render them always on top
    {
      type: 'apmn:DataAssociation',
      order: {
        level: 9,
        containers: [
          'apmn:Collaboration',
          'apmn:Process'
        ]
      }
    },
    {
      type: 'apmn:MessageFlow', order: {
        level: 9,
        containers: [ 'apmn:Collaboration' ]
      }
    },
    {
      type: 'apmn:Association',
      order: {
        level: 6,
        containers: [
          'apmn:Participant',
          'apmn:FlowElementsContainer',
          'apmn:Collaboration'
        ]
      }
    },
    { type: 'apmn:BoundaryEvent', order: { level: 8 } },
    { type: 'apmn:FlowElement', order: { level: 5 } },
    { type: 'apmn:Participant', order: { level: -2 } },
    { type: 'apmn:Lane', order: { level: -1 } }
  ];

  function computeOrder(element) {
    if (element.labelTarget) {
      return { level: 10 };
    }

    var entry = find(orders, function(o) {
      return isAny(element, [ o.type ]);
    });

    return entry && entry.order || { level: 1 };
  }

  function getOrder(element) {

    var order = element.order;

    if (!order) {
      element.order = order = computeOrder(element);
    }

    return order;
  }

  function findActualParent(element, newParent, containers) {

    var actualParent = newParent;

    while (actualParent) {

      if (isAny(actualParent, containers)) {
        break;
      }

      actualParent = actualParent.parent;
    }

    if (!actualParent) {
      throw new Error(translate('no parent for {element} in {parent}', {
        element: element.id,
        parent: newParent.id
      }));
    }

    return actualParent;
  }

  this.getOrdering = function(element, newParent) {

    // render labels always on top
    if (element.labelTarget) {
      return {
        parent: canvas.getRootElement(),
        index: -1
      };
    }

    var elementOrder = getOrder(element);


    if (elementOrder.containers) {
      newParent = findActualParent(element, newParent, elementOrder.containers);
    }


    var currentIndex = newParent.children.indexOf(element);

    var insertIndex = findIndex(newParent.children, function(child) {

      // do not compare with labels, they are created
      // in the wrong order (right after elements) during import and
      // mess up the positioning.
      if (!element.labelTarget && child.labelTarget) {
        return false;
      }

      return elementOrder.level < getOrder(child).level;
    });


    // if the element is already in the child list at
    // a smaller index, we need to adjust the inser index.
    // this takes into account that the element is being removed
    // before being re-inserted
    if (insertIndex !== -1) {
      if (currentIndex !== -1 && currentIndex < insertIndex) {
        insertIndex -= 1;
      }
    }

    return {
      index: insertIndex,
      parent: newParent
    };
  };
}

BpmnOrderingProvider.$inject = [ 'eventBus', 'canvas', 'translate' ];

inherits(BpmnOrderingProvider, OrderingProvider);