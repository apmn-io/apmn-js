import {
  find,
  some,
  every,
  forEach
} from 'min-dash';

import inherits from 'inherits';

import {
  is,
  getBusinessObject
} from '../../util/ModelUtil';

import {
  isAny
} from '../modeling/util/ModelingUtil';

import {
  isLabel
} from '../../util/LabelUtil';

import {
  isExpanded,
  isEventSubProcess,
  isInterrupting,
  hasErrorEventDefinition,
  hasEscalationEventDefinition,
  hasCompensateEventDefinition
} from '../../util/DiUtil';

import RuleProvider from 'diagram-js/lib/features/rules/RuleProvider';

import {
  getBoundaryAttachment as isBoundaryAttachment
} from '../snapping/BpmnSnappingUtil';


/**
 * APMN specific modeling rule
 */
export default function BpmnRules(eventBus) {
  RuleProvider.call(this, eventBus);
}

inherits(BpmnRules, RuleProvider);

BpmnRules.$inject = [ 'eventBus' ];

BpmnRules.prototype.init = function() {

  this.addRule('connection.start', function(context) {
    var source = context.source;

    return canStartConnection(source);
  });

  this.addRule('connection.create', function(context) {
    var source = context.source,
        target = context.target,
        hints = context.hints || {},
        targetParent = hints.targetParent,
        targetAttach = hints.targetAttach;

    // don't allow incoming connections on
    // newly created boundary events
    // to boundary events
    if (targetAttach) {
      return false;
    }

    // temporarily set target parent for scoping
    // checks to work
    if (targetParent) {
      target.parent = targetParent;
    }

    try {
      return canConnect(source, target);
    } finally {
      // unset temporary target parent
      if (targetParent) {
        target.parent = null;
      }
    }
  });

  this.addRule('connection.reconnectStart', function(context) {

    var connection = context.connection,
        source = context.hover || context.source,
        target = connection.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.reconnectEnd', function(context) {

    var connection = context.connection,
        source = connection.source,
        target = context.hover || context.target;

    return canConnect(source, target, connection);
  });

  this.addRule('connection.updateWaypoints', function(context) {
    // OK! but visually ignore
    return null;
  });

  this.addRule('shape.resize', function(context) {

    var shape = context.shape,
        newBounds = context.newBounds;

    return canResize(shape, newBounds);
  });

  this.addRule('elements.move', function(context) {

    var target = context.target,
        shapes = context.shapes,
        position = context.position;

    return canAttach(shapes, target, null, position) ||
           canReplace(shapes, target, position) ||
           canMove(shapes, target, position) ||
           canInsert(shapes, target, position);
  });

  this.addRule('shape.create', function(context) {
    return canCreate(
      context.shape,
      context.target,
      context.source,
      context.position
    );
  });

  this.addRule('shape.attach', function(context) {

    return canAttach(
      context.shape,
      context.target,
      null,
      context.position
    );
  });

  this.addRule('element.copy', function(context) {
    var collection = context.collection,
        element = context.element;

    return canCopy(collection, element);
  });

  this.addRule('element.paste', function(context) {
    var parent = context.parent,
        element = context.element,
        position = context.position,
        source = context.source,
        target = context.target;

    if (source || target) {
      return canConnect(source, target);
    }

    return canAttach([ element ], parent, null, position) || canCreate(element, parent, null, position);
  });

  this.addRule('elements.paste', function(context) {
    var tree = context.tree,
        target = context.target;

    return canPaste(tree, target);
  });
};

BpmnRules.prototype.canConnectMessageFlow = canConnectMessageFlow;

BpmnRules.prototype.canConnectSequenceFlow = canConnectSequenceFlow;

BpmnRules.prototype.canConnectDataAssociation = canConnectDataAssociation;

BpmnRules.prototype.canConnectAssociation = canConnectAssociation;

BpmnRules.prototype.canMove = canMove;

BpmnRules.prototype.canAttach = canAttach;

BpmnRules.prototype.canReplace = canReplace;

BpmnRules.prototype.canDrop = canDrop;

BpmnRules.prototype.canInsert = canInsert;

BpmnRules.prototype.canCreate = canCreate;

BpmnRules.prototype.canConnect = canConnect;

BpmnRules.prototype.canResize = canResize;

BpmnRules.prototype.canCopy = canCopy;

/**
 * Utility functions for rule checking
 */

/**
 * Checks if given element can be used for starting connection.
 *
 * @param  {Element} source
 * @return {Boolean}
 */
function canStartConnection(element) {
  if (nonExistingOrLabel(element)) {
    return null;
  }

  return isAny(element, [
    'apmn:FlowNode',
    'apmn:InteractionNode',
    'apmn:DataObjectReference',
    'apmn:DataStoreReference'
  ]);
}

function nonExistingOrLabel(element) {
  return !element || isLabel(element);
}

function isSame(a, b) {
  return a === b;
}

function getOrganizationalParent(element) {

  do {
    if (is(element, 'apmn:Process')) {
      return getBusinessObject(element);
    }

    if (is(element, 'apmn:Participant')) {
      return (
        getBusinessObject(element).processRef ||
        getBusinessObject(element)
      );
    }
  } while ((element = element.parent));

}

function isTextAnnotation(element) {
  return is(element, 'apmn:TextAnnotation');
}

function isCompensationBoundary(element) {
  return is(element, 'apmn:BoundaryEvent') &&
         hasEventDefinition(element, 'apmn:CompensateEventDefinition');
}

function isForCompensation(e) {
  return getBusinessObject(e).isForCompensation;
}

function isSameOrganization(a, b) {
  var parentA = getOrganizationalParent(a),
      parentB = getOrganizationalParent(b);

  return parentA === parentB;
}

function isMessageFlowSource(element) {
  return (
    is(element, 'apmn:InteractionNode') && (
      !is(element, 'apmn:Event') || (
        is(element, 'apmn:ThrowEvent') &&
        hasEventDefinitionOrNone(element, 'apmn:MessageEventDefinition')
      )
    )
  );
}

function isMessageFlowTarget(element) {
  return (
    is(element, 'apmn:InteractionNode') &&
    !isForCompensation(element) && (
      !is(element, 'apmn:Event') || (
        is(element, 'apmn:CatchEvent') &&
        hasEventDefinitionOrNone(element, 'apmn:MessageEventDefinition')
      )
    )
  );
}

function getScopeParent(element) {

  var parent = element;

  while ((parent = parent.parent)) {

    if (is(parent, 'apmn:FlowElementsContainer')) {
      return getBusinessObject(parent);
    }

    if (is(parent, 'apmn:Participant')) {
      return getBusinessObject(parent).processRef;
    }
  }

  return null;
}

function isSameScope(a, b) {
  var scopeParentA = getScopeParent(a),
      scopeParentB = getScopeParent(b);

  return scopeParentA && (scopeParentA === scopeParentB);
}

function hasEventDefinition(element, eventDefinition) {
  var bo = getBusinessObject(element);

  return !!find(bo.eventDefinitions || [], function(definition) {
    return is(definition, eventDefinition);
  });
}

function hasEventDefinitionOrNone(element, eventDefinition) {
  var bo = getBusinessObject(element);

  return (bo.eventDefinitions || []).every(function(definition) {
    return is(definition, eventDefinition);
  });
}

function isSequenceFlowSource(element) {
  return (
    is(element, 'apmn:FlowNode') &&
    !is(element, 'apmn:EndEvent') &&
    !isEventSubProcess(element) &&
    !(is(element, 'apmn:IntermediateThrowEvent') &&
      hasEventDefinition(element, 'apmn:LinkEventDefinition')
    ) &&
    !isCompensationBoundary(element) &&
    !isForCompensation(element)
  );
}

function isSequenceFlowTarget(element) {
  return (
    is(element, 'apmn:FlowNode') &&
    !is(element, 'apmn:StartEvent') &&
    !is(element, 'apmn:BoundaryEvent') &&
    !isEventSubProcess(element) &&
    !(is(element, 'apmn:IntermediateCatchEvent') &&
      hasEventDefinition(element, 'apmn:LinkEventDefinition')
    ) &&
    !isForCompensation(element)
  );
}

function isEventBasedTarget(element) {
  return (
    is(element, 'apmn:ReceiveTask') || (
      is(element, 'apmn:IntermediateCatchEvent') && (
        hasEventDefinition(element, 'apmn:MessageEventDefinition') ||
        hasEventDefinition(element, 'apmn:TimerEventDefinition') ||
        hasEventDefinition(element, 'apmn:ConditionalEventDefinition') ||
        hasEventDefinition(element, 'apmn:SignalEventDefinition')
      )
    )
  );
}

function isConnection(element) {
  return element.waypoints;
}

function getParents(element) {

  var parents = [];

  while (element) {
    element = element.parent;

    if (element) {
      parents.push(element);
    }
  }

  return parents;
}

function isParent(possibleParent, element) {
  var allParents = getParents(element);
  return allParents.indexOf(possibleParent) !== -1;
}

function canConnect(source, target, connection) {

  if (nonExistingOrLabel(source) || nonExistingOrLabel(target)) {
    return null;
  }

  if (!is(connection, 'apmn:DataAssociation')) {

    if (canConnectMessageFlow(source, target)) {
      return { type: 'apmn:MessageFlow' };
    }

    if (canConnectSequenceFlow(source, target)) {
      return { type: 'apmn:SequenceFlow' };
    }
  }

  var connectDataAssociation = canConnectDataAssociation(source, target);

  if (connectDataAssociation) {
    return connectDataAssociation;
  }

  if (isCompensationBoundary(source) && isForCompensation(target)) {
    return {
      type: 'apmn:Association',
      associationDirection: 'One'
    };
  }

  if (canConnectAssociation(source, target)) {

    return {
      type: 'apmn:Association'
    };
  }

  return false;
}

/**
 * Can an element be dropped into the target element
 *
 * @return {Boolean}
 */
function canDrop(element, target, position) {

  // can move labels everywhere
  if (isLabel(element)) {
    return true;
  }

  // disallow to create elements on collapsed pools
  if (is(target, 'apmn:Participant') && !isExpanded(target)) {
    return false;
  }

  // allow to create new participants on
  // on existing collaboration and process diagrams
  if (is(element, 'apmn:Participant')) {
    return is(target, 'apmn:Process') || is(target, 'apmn:Collaboration');
  }

  // allow moving DataInput / DataOutput within its original container only
  if (isAny(element, [ 'apmn:DataInput', 'apmn:DataOutput' ])) {

    if (element.parent) {
      return target === element.parent;
    }
  }

  // allow creating lanes on participants and other lanes only
  if (is(element, 'apmn:Lane')) {
    return is(target, 'apmn:Participant') || is(target, 'apmn:Lane');
  }

  if (is(element, 'apmn:BoundaryEvent')) {
    return false;
  }

  // drop flow elements onto flow element containers
  // and participants
  if (is(element, 'apmn:FlowElement') && !is(element, 'apmn:DataStoreReference')) {
    if (is(target, 'apmn:FlowElementsContainer')) {
      return isExpanded(target);
    }

    return isAny(target, [ 'apmn:Participant', 'apmn:Lane' ]);
  }

  // account for the fact that data associations are always
  // rendered and moved to top (Process or Collaboration level)
  //
  // artifacts may be placed wherever, too
  if (isAny(element, [ 'apmn:Artifact', 'apmn:DataAssociation', 'apmn:DataStoreReference' ])) {
    return isAny(target, [
      'apmn:Collaboration',
      'apmn:Lane',
      'apmn:Participant',
      'apmn:Process',
      'apmn:SubProcess' ]);
  }

  if (is(element, 'apmn:MessageFlow')) {
    return is(target, 'apmn:Collaboration')
      || element.source.parent == target
      || element.target.parent == target;
  }

  return false;
}

function canPaste(tree, target) {
  var topLevel = tree[0],
      participants;

  if (is(target, 'apmn:Collaboration')) {
    return every(topLevel, function(e) {
      return e.type === 'apmn:Participant';
    });
  }

  if (is(target, 'apmn:Process')) {
    participants = some(topLevel, function(e) {
      return e.type === 'apmn:Participant';
    });

    return !(participants && target.children.length > 0);
  }

  // disallow to create elements on collapsed pools
  if (is(target, 'apmn:Participant') && !isExpanded(target)) {
    return false;
  }

  if (is(target, 'apmn:FlowElementsContainer')) {
    return isExpanded(target);
  }

  return isAny(target, [
    'apmn:Collaboration',
    'apmn:Lane',
    'apmn:Participant',
    'apmn:Process',
    'apmn:SubProcess' ]);
}

function isBoundaryEvent(element) {
  return !isLabel(element) && is(element, 'apmn:BoundaryEvent');
}

function isLane(element) {
  return is(element, 'apmn:Lane');
}

/**
 * We treat IntermediateThrowEvents as boundary events during create,
 * this must be reflected in the rules.
 */
function isBoundaryCandidate(element) {
  return isBoundaryEvent(element) ||
        (is(element, 'apmn:IntermediateThrowEvent') && !element.parent);
}

function isReceiveTaskAfterEventBasedGateway(element) {
  return (
    is(element, 'apmn:ReceiveTask') &&
    find(element.incoming, function(incoming) {
      return is(incoming.source, 'apmn:EventBasedGateway');
    })
  );
}


function canAttach(elements, target, source, position) {

  if (!Array.isArray(elements)) {
    elements = [ elements ];
  }

  // disallow appending as boundary event
  if (source) {
    return false;
  }

  // only (re-)attach one element at a time
  if (elements.length !== 1) {
    return false;
  }

  var element = elements[0];

  // do not attach labels
  if (isLabel(element)) {
    return false;
  }

  // only handle boundary events
  if (!isBoundaryCandidate(element)) {
    return false;
  }

  // allow default move operation
  if (!target) {
    return true;
  }

  // disallow drop on event sub processes
  if (isEventSubProcess(target)) {
    return false;
  }

  // only allow drop on non compensation activities
  if (!is(target, 'apmn:Activity') || isForCompensation(target)) {
    return false;
  }

  // only attach to subprocess border
  if (position && !isBoundaryAttachment(position, target)) {
    return false;
  }

  // do not attach on receive tasks after event based gateways
  if (isReceiveTaskAfterEventBasedGateway(target)) {
    return false;
  }

  return 'attach';
}


/**
 * Defines how to replace elements for a given target.
 *
 * Returns an array containing all elements which will be replaced.
 *
 * @example
 *
 *  [{ id: 'IntermediateEvent_2',
 *     type: 'apmn:StartEvent'
 *   },
 *   { id: 'IntermediateEvent_5',
 *     type: 'apmn:EndEvent'
 *   }]
 *
 * @param  {Array} elements
 * @param  {Object} target
 *
 * @return {Object} an object containing all elements which have to be replaced
 */
function canReplace(elements, target, position) {

  if (!target) {
    return false;
  }

  var canExecute = {
    replacements: []
  };

  forEach(elements, function(element) {

    if (!isEventSubProcess(target)) {

      if (is(element, 'apmn:StartEvent') &&
          element.type !== 'label' &&
          canDrop(element, target)) {

        // replace a non-interrupting start event by a blank interrupting start event
        // when the target is not an event sub process
        if (!isInterrupting(element)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'apmn:StartEvent'
          });
        }

        // replace an error/escalation/compansate start event by a blank interrupting start event
        // when the target is not an event sub process
        if (hasErrorEventDefinition(element) ||
            hasEscalationEventDefinition(element) ||
            hasCompensateEventDefinition(element)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'apmn:StartEvent'
          });
        }
      }
    }

    if (!is(target, 'apmn:Transaction')) {
      if (hasEventDefinition(element, 'apmn:CancelEventDefinition') &&
          element.type !== 'label') {

        if (is(element, 'apmn:EndEvent') && canDrop(element, target)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'apmn:EndEvent'
          });
        }

        if (is(element, 'apmn:BoundaryEvent') && canAttach(element, target, null, position)) {
          canExecute.replacements.push({
            oldElementId: element.id,
            newElementType: 'apmn:BoundaryEvent'
          });
        }
      }
    }
  });

  return canExecute.replacements.length ? canExecute : false;
}

function canMove(elements, target) {

  // do not move selection containing boundary events
  if (some(elements, isBoundaryEvent)) {
    return false;
  }

  // do not move selection containing lanes
  if (some(elements, isLane)) {
    return false;
  }

  // allow default move check to start move operation
  if (!target) {
    return true;
  }

  return elements.every(function(element) {
    return canDrop(element, target);
  });
}

function canCreate(shape, target, source, position) {

  if (!target) {
    return false;
  }

  if (isLabel(target)) {
    return null;
  }

  if (isSame(source, target)) {
    return false;
  }

  // ensure we do not drop the element
  // into source
  if (source && isParent(source, target)) {
    return false;
  }

  return canDrop(shape, target, position) || canInsert(shape, target, position);
}

function canResize(shape, newBounds) {
  if (is(shape, 'apmn:SubProcess')) {
    return (
      isExpanded(shape) && (
        !newBounds || (newBounds.width >= 100 && newBounds.height >= 80)
      )
    );
  }

  if (is(shape, 'apmn:Lane')) {
    return !newBounds || (newBounds.width >= 130 && newBounds.height >= 60);
  }

  if (is(shape, 'apmn:Participant')) {
    return !newBounds || (newBounds.width >= 250 && newBounds.height >= 50);
  }

  if (isTextAnnotation(shape)) {
    return true;
  }

  return false;
}

/**
 * Check, whether one side of the relationship
 * is a text annotation.
 */
function isOneTextAnnotation(source, target) {

  var sourceTextAnnotation = isTextAnnotation(source),
      targetTextAnnotation = isTextAnnotation(target);

  return (
    (sourceTextAnnotation || targetTextAnnotation) &&
    (sourceTextAnnotation !== targetTextAnnotation)
  );
}


function canConnectAssociation(source, target) {

  // do not connect connections
  if (isConnection(source) || isConnection(target)) {
    return false;
  }

  // compensation boundary events are exception
  if (isCompensationBoundary(source) && isForCompensation(target)) {
    return true;
  }

  // don't connect parent <-> child
  if (isParent(target, source) || isParent(source, target)) {
    return false;
  }

  // allow connection of associations between <!TextAnnotation> and <TextAnnotation>
  return isOneTextAnnotation(source, target);
}

function canConnectMessageFlow(source, target) {

  return isMessageFlowSource(source) &&
         isMessageFlowTarget(target) &&
        !isSameOrganization(source, target);
}

function canConnectSequenceFlow(source, target) {

  return isSequenceFlowSource(source) &&
         isSequenceFlowTarget(target) &&
         isSameScope(source, target) &&
         !(is(source, 'apmn:EventBasedGateway') && !isEventBasedTarget(target));
}


function canConnectDataAssociation(source, target) {

  if (isAny(source, [ 'apmn:DataObjectReference', 'apmn:DataStoreReference' ]) &&
      isAny(target, [ 'apmn:Activity', 'apmn:ThrowEvent' ])) {
    return { type: 'apmn:DataInputAssociation' };
  }

  if (isAny(target, [ 'apmn:DataObjectReference', 'apmn:DataStoreReference' ]) &&
      isAny(source, [ 'apmn:Activity', 'apmn:CatchEvent' ])) {
    return { type: 'apmn:DataOutputAssociation' };
  }

  return false;
}

function canInsert(shape, flow, position) {

  if (!flow) {
    return false;
  }

  if (Array.isArray(shape)) {
    if (shape.length !== 1) {
      return false;
    }

    shape = shape[0];
  }

  if (flow.source === shape ||
      flow.target === shape) {
    return false;
  }

  // return true if we can drop on the
  // underlying flow parent
  //
  // at this point we are not really able to talk
  // about connection rules (yet)

  return (
    isAny(flow, [ 'apmn:SequenceFlow', 'apmn:MessageFlow' ]) &&
    !isLabel(flow) &&
    is(shape, 'apmn:FlowNode') &&
    !is(shape, 'apmn:BoundaryEvent') &&
    canDrop(shape, flow.parent, position));
}

function contains(collection, element) {
  return (collection && element) && collection.indexOf(element) !== -1;
}

function canCopy(collection, element) {
  if (is(element, 'apmn:Lane') && !contains(collection, element.parent)) {
    return false;
  }

  if (is(element, 'apmn:BoundaryEvent') && !contains(collection, element.host)) {
    return false;
  }

  return true;
}
