import {
  map,
  assign,
  pick
} from 'min-dash';

import {
  isAny
} from './util/ModelingUtil';


export default function BpmnFactory(moddle) {
  this._model = moddle;
}

BpmnFactory.$inject = [ 'moddle' ];


BpmnFactory.prototype._needsId = function(element) {
  return isAny(element, [
    'apmn:RootElement',
    'apmn:FlowElement',
    'apmn:MessageFlow',
    'apmn:DataAssociation',
    'apmn:Artifact',
    'apmn:Participant',
    'apmn:Lane',
    'apmn:LaneSet',
    'apmn:Process',
    'apmn:Collaboration',
    'apmndi:APMNShape',
    'apmndi:APMNEdge',
    'apmndi:APMNDiagram',
    'apmndi:APMNPlane',
    'apmn:Property'
  ]);
};

BpmnFactory.prototype._ensureId = function(element) {

  // generate semantic ids for elements
  // apmn:SequenceFlow -> SequenceFlow_ID
  var prefix = (element.$type || '').replace(/^[^:]*:/g, '') + '_';

  if (!element.id && this._needsId(element)) {
    element.id = this._model.ids.nextPrefixed(prefix, element);
  }
};


BpmnFactory.prototype.create = function(type, attrs) {
  var element = this._model.create(type, attrs || {});

  this._ensureId(element);

  return element;
};


BpmnFactory.prototype.createDiLabel = function() {
  return this.create('apmndi:APMNLabel', {
    bounds: this.createDiBounds()
  });
};


BpmnFactory.prototype.createDiShape = function(semantic, bounds, attrs) {

  return this.create('apmndi:APMNShape', assign({
    apmnElement: semantic,
    bounds: this.createDiBounds(bounds)
  }, attrs));
};


BpmnFactory.prototype.createDiBounds = function(bounds) {
  return this.create('dc:Bounds', bounds);
};


BpmnFactory.prototype.createDiWaypoints = function(waypoints) {
  var self = this;

  return map(waypoints, function(pos) {
    return self.createDiWaypoint(pos);
  });
};

BpmnFactory.prototype.createDiWaypoint = function(point) {
  return this.create('dc:Point', pick(point, [ 'x', 'y' ]));
};


BpmnFactory.prototype.createDiEdge = function(semantic, waypoints, attrs) {
  return this.create('apmndi:APMNEdge', assign({
    apmnElement: semantic
  }, attrs));
};

BpmnFactory.prototype.createDiPlane = function(semantic) {
  return this.create('apmndi:APMNPlane', {
    apmnElement: semantic
  });
};