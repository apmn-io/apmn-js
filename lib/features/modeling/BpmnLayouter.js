import inherits from 'inherits';

import {
  assign
} from 'min-dash';

import BaseLayouter from 'diagram-js/lib/layout/BaseLayouter';

import {
  repairConnection,
  withoutRedundantPoints
} from 'diagram-js/lib/layout/ManhattanLayout';

import {
  getMid,
  getOrientation
} from 'diagram-js/lib/layout/LayoutUtil';

import {
  isExpanded
} from '../../util/DiUtil';

import { is } from '../../util/ModelUtil';


export default function BpmnLayouter() {}

inherits(BpmnLayouter, BaseLayouter);


BpmnLayouter.prototype.layoutConnection = function(connection, hints) {
  hints = hints || {};

  var source = connection.source,
      target = connection.target,
      waypoints = connection.waypoints,
      start = hints.connectionStart,
      end = hints.connectionEnd;

  var manhattanOptions,
      updatedWaypoints;

  if (!start) {
    start = getConnectionDocking(waypoints && waypoints[0], source);
  }

  if (!end) {
    end = getConnectionDocking(waypoints && waypoints[waypoints.length - 1], target);
  }

  // TODO(nikku): support vertical modeling
  // and invert preferredLayouts accordingly

  if (is(connection, 'apmn:Association') ||
      is(connection, 'apmn:DataAssociation')) {

    if (waypoints && !isCompensationAssociation(connection)) {
      return [].concat([ start ], waypoints.slice(1, -1), [ end ]);
    }
  }

  // manhattan layout sequence / message flows
  if (is(connection, 'apmn:MessageFlow')) {
    manhattanOptions = getMessageFlowManhattanOptions(source, target);

  } else


  // layout all connection between flow elements h:h,
  //
  // except for
  //
  // (1) outgoing of BoundaryEvents -> layout based on attach orientation and target orientation
  // (2) incoming / outgoing of Gateway -> v:h (outgoing), h:v (incoming)
  // (3) loops from / to the same element
  //
  if (is(connection, 'apmn:SequenceFlow') ||
      isCompensationAssociation(connection)) {

    if (source === target) {
      manhattanOptions = {
        preferredLayouts: [ 'b:l' ]
      };
    } else

    if (is(source, 'apmn:BoundaryEvent')) {

      manhattanOptions = {
        preferredLayouts: getBoundaryEventPreferredLayouts(source, target)
      };

    } else

    if (is(source, 'apmn:Gateway')) {

      manhattanOptions = {
        preferredLayouts: [ 'v:h' ]
      };
    } else

    if (is(target, 'apmn:Gateway')) {

      manhattanOptions = {
        preferredLayouts: [ 'h:v' ]
      };
    }

    else {
      manhattanOptions = {
        preferredLayouts: [ 'h:h' ]
      };
    }

  }

  if (manhattanOptions) {

    manhattanOptions = assign(manhattanOptions, hints);

    updatedWaypoints =
      withoutRedundantPoints(
        repairConnection(
          source, target,
          start, end,
          waypoints,
          manhattanOptions
        )
      );
  }

  return updatedWaypoints || [ start, end ];
};


function getAttachOrientation(attachedElement) {

  var hostElement = attachedElement.host,
      padding = -10;

  return getOrientation(getMid(attachedElement), hostElement, padding);
}


function getMessageFlowManhattanOptions(source, target) {
  return {
    preferredLayouts: [ 'straight', 'v:v' ],
    preserveDocking: getMessageFlowPreserveDocking(source, target)
  };
}


function getMessageFlowPreserveDocking(source, target) {

  // (1) docking element connected to participant has precedence

  if (is(target, 'apmn:Participant')) {
    return 'source';
  }

  if (is(source, 'apmn:Participant')) {
    return 'target';
  }

  // (2) docking element connected to expanded sub-process has precedence

  if (isExpandedSubProcess(target)) {
    return 'source';
  }

  if (isExpandedSubProcess(source)) {
    return 'target';
  }

  // (3) docking event has precedence

  if (is(target, 'apmn:Event')) {
    return 'target';
  }

  if (is(source, 'apmn:Event')) {
    return 'source';
  }

  return null;
}


function getConnectionDocking(point, shape) {
  return point ? (point.original || point) : getMid(shape);
}

function isCompensationAssociation(connection) {

  var source = connection.source,
      target = connection.target;

  return is(target, 'apmn:Activity') &&
         is(source, 'apmn:BoundaryEvent') &&
         target.businessObject.isForCompensation;
}


function isExpandedSubProcess(element) {
  return is(element, 'apmn:SubProcess') && isExpanded(element);
}

function isSame(a, b) {
  return a === b;
}

function isAnyOrientation(orientation, orientations) {
  return orientations.indexOf(orientation) !== -1;
}

var oppositeOrientationMapping = {
  'top': 'bottom',
  'top-right': 'bottom-left',
  'top-left': 'bottom-right',
  'right': 'left',
  'bottom': 'top',
  'bottom-right': 'top-left',
  'bottom-left': 'top-right',
  'left': 'right'
};

var orientationDirectionMapping = {
  top: 't',
  right: 'r',
  bottom: 'b',
  left: 'l'
};

function getHorizontalOrientation(orientation) {
  var matches = /right|left/.exec(orientation);

  return matches && matches[0];
}

function getVerticalOrientation(orientation) {
  var matches = /top|bottom/.exec(orientation);

  return matches && matches[0];
}

function isOppositeOrientation(a, b) {
  return oppositeOrientationMapping[a] === b;
}

function isOppositeHorizontalOrientation(a, b) {
  var horizontalOrientation = getHorizontalOrientation(a);

  var oppositeHorizontalOrientation = oppositeOrientationMapping[horizontalOrientation];

  return b.indexOf(oppositeHorizontalOrientation) !== -1;
}

function isOppositeVerticalOrientation(a, b) {
  var verticalOrientation = getVerticalOrientation(a);

  var oppositeVerticalOrientation = oppositeOrientationMapping[verticalOrientation];

  return b.indexOf(oppositeVerticalOrientation) !== -1;
}

function isHorizontalOrientation(orientation) {
  return orientation === 'right' || orientation === 'left';
}

function getBoundaryEventPreferredLayouts(source, target) {
  var sourceMid = getMid(source),
      targetMid = getMid(target),
      attachOrientation = getAttachOrientation(source),
      sourceLayout,
      targetLayout;

  var isLoop = isSame(source.host, target);

  var attachedToSide = isAnyOrientation(attachOrientation, [ 'top', 'right', 'bottom', 'left' ]);

  var targetOrientation = getOrientation(targetMid, sourceMid, {
    x: source.width / 2 + target.width / 2,
    y: source.height / 2 + target.height / 2
  });

  // source layout
  sourceLayout = getBoundaryEventSourceLayout(attachOrientation, targetOrientation, attachedToSide, isLoop);

  // target layout
  targetLayout = getBoundaryEventTargetLayout(attachOrientation, targetOrientation, attachedToSide, isLoop);

  return [ sourceLayout + ':' + targetLayout ];
}

function getBoundaryEventSourceLayout(attachOrientation, targetOrientation, attachedToSide, isLoop) {

  // attached to either top, right, bottom or left side
  if (attachedToSide) {
    return orientationDirectionMapping[attachOrientation];
  }

  // attached to either top-right, top-left, bottom-right or bottom-left corner

  // loop, same vertical or opposite horizontal orientation
  if (isLoop ||
    isSame(
      getVerticalOrientation(attachOrientation), getVerticalOrientation(targetOrientation)
    ) ||
    isOppositeOrientation(
      getHorizontalOrientation(attachOrientation), getHorizontalOrientation(targetOrientation)
    )) {
    return orientationDirectionMapping[getVerticalOrientation(attachOrientation)];
  }

  // fallback
  return orientationDirectionMapping[getHorizontalOrientation(attachOrientation)];
}

function getBoundaryEventTargetLayout(attachOrientation, targetOrientation, attachedToSide, isLoop) {

  // attached to either top, right, bottom or left side
  if (attachedToSide) {
    if (isHorizontalOrientation(attachOrientation)) {
      // orientation is 'right' or 'left'

      // loop or opposite horizontal orientation or same orientation
      if (
        isLoop ||
        isOppositeHorizontalOrientation(attachOrientation, targetOrientation) ||
        isSame(attachOrientation, targetOrientation)
      ) {
        return 'h';
      }

      // fallback
      return 'v';
    } else {
      // orientation is 'top' or 'bottom'

      // loop or opposite vertical orientation or same orientation
      if (
        isLoop ||
        isOppositeVerticalOrientation(attachOrientation, targetOrientation) ||
        isSame(attachOrientation, targetOrientation)
      ) {
        return 'v';
      }

      // fallback
      return 'h';
    }
  }
  // attached to either top-right, top-left, bottom-right or bottom-left corner

  // orientation is 'right', 'left'
  // or same vertical orientation but also 'right' or 'left'
  if (isHorizontalOrientation(targetOrientation) ||
    (isSame(getVerticalOrientation(attachOrientation), getVerticalOrientation(targetOrientation)) &&
      getHorizontalOrientation(targetOrientation))) {
    return 'h';
  } else {
    return 'v';
  }
}
