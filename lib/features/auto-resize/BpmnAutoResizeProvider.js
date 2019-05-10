import { is } from '../../util/ModelUtil';

import inherits from 'inherits';

import { forEach } from 'min-dash';

import AutoResizeProvider from 'diagram-js/lib/features/auto-resize/AutoResizeProvider';


/**
 * This module is a provider for automatically resizing parent APMN elements
 */
export default function BpmnAutoResizeProvider(eventBus, modeling) {
  AutoResizeProvider.call(this, eventBus);

  this._modeling = modeling;
}

inherits(BpmnAutoResizeProvider, AutoResizeProvider);

BpmnAutoResizeProvider.$inject = [
  'eventBus',
  'modeling'
];


/**
 * Check if the given target can be expanded
 *
 * @param  {djs.model.Shape} target
 *
 * @return {boolean}
 */
BpmnAutoResizeProvider.prototype.canResize = function(elements, target) {

  if (!is(target, 'apmn:Participant') && !is(target, 'apmn:Lane') && !(is(target, 'apmn:SubProcess'))) {
    return false;
  }

  var canResize = true;

  forEach(elements, function(element) {

    if (is(element, 'apmn:Lane') || element.labelTarget) {
      canResize = false;
      return;
    }
  });

  return canResize;
};
