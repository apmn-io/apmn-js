import {
  forEach,
  find,
  matchPattern
} from 'min-dash';

import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';


export default function ReplaceConnectionBehavior(eventBus, modeling, bpmnRules) {

  CommandInterceptor.call(this, eventBus);

  function fixConnection(connection) {

    var source = connection.source,
        target = connection.target,
        parent = connection.parent;

    // do not do anything if connection
    // is already deleted (may happen due to other
    // behaviors plugged-in before)
    if (!parent) {
      return;
    }

    var replacementType,
        remove;

    /**
     * Check if incoming or outgoing connections
     * can stay or could be substituted with an
     * appropriate replacement.
     *
     * This holds true for SequenceFlow <> MessageFlow.
     */

    if (is(connection, 'apmn:SequenceFlow')) {
      if (!bpmnRules.canConnectSequenceFlow(source, target)) {
        remove = true;
      }

      if (bpmnRules.canConnectMessageFlow(source, target)) {
        replacementType = 'apmn:MessageFlow';
      }
    }

    // transform message flows into sequence flows, if possible

    if (is(connection, 'apmn:MessageFlow')) {

      if (!bpmnRules.canConnectMessageFlow(source, target)) {
        remove = true;
      }

      if (bpmnRules.canConnectSequenceFlow(source, target)) {
        replacementType = 'apmn:SequenceFlow';
      }
    }

    if (is(connection, 'apmn:Association') && !bpmnRules.canConnectAssociation(source, target)) {
      remove = true;
    }


    // remove invalid connection,
    // unless it has been removed already
    if (remove) {
      modeling.removeConnection(connection);
    }

    // replace SequenceFlow <> MessageFlow

    if (replacementType) {
      modeling.connect(source, target, {
        type: replacementType,
        waypoints: connection.waypoints.slice()
      });
    }
  }

  this.postExecuted('elements.move', function(context) {

    var closure = context.closure,
        allConnections = closure.allConnections;

    forEach(allConnections, fixConnection);
  }, true);

  this.postExecuted([
    'connection.reconnectStart',
    'connection.reconnectEnd'
  ], function(event) {

    var connection = event.context.connection;

    fixConnection(connection);
  });

  this.postExecuted('element.updateProperties', function(event) {
    var context = event.context,
        properties = context.properties,
        element = context.element,
        businessObject = element.businessObject,
        connection;

    // remove condition expression when morphing to default flow
    if (properties.default) {
      connection = find(
        element.outgoing,
        matchPattern({ id: element.businessObject.default.id })
      );

      if (connection) {
        modeling.updateProperties(connection, { conditionExpression: undefined });
      }
    }

    // remove default property from source when morphing to conditional flow
    if (properties.conditionExpression && businessObject.sourceRef.default === businessObject) {
      modeling.updateProperties(element.source, { default: undefined });
    }
  });
}

inherits(ReplaceConnectionBehavior, CommandInterceptor);

ReplaceConnectionBehavior.$inject = [
  'eventBus',
  'modeling',
  'bpmnRules'
];
