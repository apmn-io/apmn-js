import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';

import { isAny } from '../util/ModelingUtil';

import UpdateSemanticParentHandler from '../cmd/UpdateSemanticParentHandler';


/**
 * APMN specific data store behavior
 */
export default function DataStoreBehavior(
    canvas, commandStack, elementRegistry,
    eventBus) {

  CommandInterceptor.call(this, eventBus);

  commandStack.registerHandler('dataStore.updateContainment', UpdateSemanticParentHandler);

  function getFirstParticipant() {
    return elementRegistry.filter(function(element) {
      return is(element, 'apmn:Participant');
    })[0];
  }

  function getDataStores(element) {
    return element.children.filter(function(child) {
      return is(child, 'apmn:DataStoreReference') && !child.labelTarget;
    });
  }

  function updateDataStoreParent(dataStore, newDataStoreParent) {
    var dataStoreBo = dataStore.businessObject || dataStore;

    newDataStoreParent = newDataStoreParent || getFirstParticipant();

    if (newDataStoreParent) {
      var newDataStoreParentBo = newDataStoreParent.businessObject || newDataStoreParent;

      commandStack.execute('dataStore.updateContainment', {
        dataStoreBo: dataStoreBo,
        newSemanticParent: newDataStoreParentBo.processRef || newDataStoreParentBo,
        newDiParent: newDataStoreParentBo.di
      });
    }
  }


  // disable auto-resize for data stores
  this.preExecute('shape.create', function(event) {

    var context = event.context,
        shape = context.shape;

    if (is(shape, 'apmn:DataStoreReference') &&
        shape.type !== 'label') {

      if (!context.hints) {
        context.hints = {};
      }

      // prevent auto resizing
      context.hints.autoResize = false;
    }
  });


  // disable auto-resize for data stores
  this.preExecute('elements.move', function(event) {
    var context = event.context,
        shapes = context.shapes;

    var dataStoreReferences = shapes.filter(function(shape) {
      return is(shape, 'apmn:DataStoreReference');
    });

    if (dataStoreReferences.length) {
      if (!context.hints) {
        context.hints = {};
      }

      // prevent auto resizing for data store references
      context.hints.autoResize = shapes.filter(function(shape) {
        return !is(shape, 'apmn:DataStoreReference');
      });
    }
  });


  // update parent on data store created
  this.postExecute('shape.create', function(event) {
    var context = event.context,
        shape = context.shape,
        parent = shape.parent;


    if (is(shape, 'apmn:DataStoreReference') &&
        shape.type !== 'label' &&
        is(parent, 'apmn:Collaboration')) {

      updateDataStoreParent(shape);
    }
  });


  // update parent on data store moved
  this.postExecute('shape.move', function(event) {
    var context = event.context,
        shape = context.shape,
        oldParent = context.oldParent,
        parent = shape.parent;

    if (is(oldParent, 'apmn:Collaboration')) {

      // do nothing if not necessary
      return;
    }

    if (is(shape, 'apmn:DataStoreReference') &&
        shape.type !== 'label' &&
        is(parent, 'apmn:Collaboration')) {

      var participant = is(oldParent, 'apmn:Participant') ?
        oldParent :
        getAncestor(oldParent, 'apmn:Participant');

      updateDataStoreParent(shape, participant);
    }
  });


  // update data store parents on participant or subprocess deleted
  this.postExecute('shape.delete', function(event) {
    var context = event.context,
        shape = context.shape,
        rootElement = canvas.getRootElement();

    if (isAny(shape, [ 'apmn:Participant', 'apmn:SubProcess' ])
        && is(rootElement, 'apmn:Collaboration')) {
      getDataStores(rootElement)
        .filter(function(dataStore) {
          return isDescendant(dataStore, shape);
        })
        .forEach(function(dataStore) {
          updateDataStoreParent(dataStore);
        });
    }
  });

  // update data store parents on collaboration -> process
  this.postExecute('canvas.updateRoot', function(event) {
    var context = event.context,
        oldRoot = context.oldRoot,
        newRoot = context.newRoot;

    var dataStores = getDataStores(oldRoot);

    dataStores.forEach(function(dataStore) {

      if (is(newRoot, 'apmn:Process')) {
        updateDataStoreParent(dataStore, newRoot);
      }

    });
  });
}

DataStoreBehavior.$inject = [
  'canvas',
  'commandStack',
  'elementRegistry',
  'eventBus',
];

inherits(DataStoreBehavior, CommandInterceptor);


// helpers //////////

function isDescendant(descendant, ancestor) {
  var descendantBo = descendant.businessObject || descendant,
      ancestorBo = ancestor.businessObject || ancestor;

  while (descendantBo.$parent) {
    if (descendantBo.$parent === ancestorBo.processRef || ancestorBo) {
      return true;
    }

    descendantBo = descendantBo.$parent;
  }

  return false;
}

function getAncestor(element, type) {

  while (element.parent) {
    if (is(element.parent, type)) {
      return element.parent;
    }

    element = element.parent;
  }
}