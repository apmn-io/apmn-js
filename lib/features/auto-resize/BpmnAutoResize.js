import AutoResize from 'diagram-js/lib/features/auto-resize/AutoResize';

import inherits from 'inherits';

import { is } from '../../util/ModelUtil';


/**
 * Sub class of the AutoResize module which implements a APMN
 * specific resize function.
 */
export default function BpmnAutoResize(injector) {

  injector.invoke(AutoResize, this);
}

BpmnAutoResize.$inject = [
  'injector'
];

inherits(BpmnAutoResize, AutoResize);


/**
 * Resize shapes and lanes
 *
 * @param  {djs.model.Shape} target
 * @param  {Object} newBounds
 */
BpmnAutoResize.prototype.resize = function(target, newBounds) {

  if (is(target, 'apmn:Participant')) {
    this._modeling.resizeLane(target, newBounds);
  } else {
    this._modeling.resizeShape(target, newBounds);
  }
};