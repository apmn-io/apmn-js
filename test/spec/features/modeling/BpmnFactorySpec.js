import {
  bootstrapModeler,
  inject
} from 'test/TestHelper';

import modelingModule from 'lib/features/modeling';
import coreModule from 'lib/core';


describe('features - apmn-factory', function() {

  var diagramXML = require('../../../fixtures/bpmn/simple.bpmn');

  var testModules = [ modelingModule, coreModule ];

  beforeEach(bootstrapModeler(diagramXML, { modules: testModules }));


  describe('create element', function() {

    it('should return instance', inject(function(bpmnFactory) {

      var task = bpmnFactory.create('apmn:Task');
      expect(task).to.exist;
      expect(task.$type).to.equal('apmn:Task');
    }));


    it('should assign id (with semantic prefix)', inject(function(bpmnFactory) {
      var task = bpmnFactory.create('apmn:ServiceTask');

      expect(task.$type).to.equal('apmn:ServiceTask');
      expect(task.id).to.match(/^ServiceTask_/g);
    }));


    it('should assign id (with semantic prefix)', inject(function(bpmnFactory) {
      var plane = bpmnFactory.create('apmndi:APMNPlane');

      expect(plane.$type).to.equal('apmndi:APMNPlane');
      expect(plane.id).to.match(/^APMNPlane_/g);
    }));


    it('should assign apmn:LaneSet id', inject(function(bpmnFactory) {
      var set = bpmnFactory.create('apmn:LaneSet');

      expect(set.id).to.exist;
    }));

  });


  describe('create di', function() {

    it('should create waypoints', inject(function(bpmnFactory) {

      // given
      var waypoints = [
        { original: { x: 0, y: 0 }, x: 0, y: 0 },
        { original: { x: 0, y: 0 }, x: 0, y: 0 }
      ];

      // when
      var result = bpmnFactory.createDiWaypoints(waypoints);

      // then
      expect(result).eql([
        bpmnFactory.create('dc:Point', { x: 0, y: 0 }),
        bpmnFactory.create('dc:Point', { x: 0, y: 0 })
      ]);

      // expect original not to have been accidently serialized
      expect(result[0].$attrs).to.eql({});
    }));
  });

});
