import {
  assign
} from 'min-dash';

import {
  getLabel
} from './LabelUtil';

import { is } from '../../util/ModelUtil';
import { isAny } from '../modeling/util/ModelingUtil';
import { isExpanded } from '../../util/DiUtil';

import {
  getExternalLabelMid,
  isLabelExternal,
  hasExternalLabel,
  isLabel
} from '../../util/LabelUtil';


export default function LabelEditingProvider(
    eventBus, canvas, directEditing,
    modeling, resizeHandles, textRenderer) {

  this._canvas = canvas;
  this._modeling = modeling;
  this._textRenderer = textRenderer;

  directEditing.registerProvider(this);

  // listen to dblclick on non-root elements
  eventBus.on('element.dblclick', function(event) {
    activateDirectEdit(event.element, true);
  });

  // complete on followup canvas operation
  eventBus.on([
    'element.mousedown',
    'drag.init',
    'canvas.viewbox.changing',
    'autoPlace',
    'popupMenu.open'
  ], function(event) {

    if (directEditing.isActive()) {
      directEditing.complete();
    }
  });

  // cancel on command stack changes
  eventBus.on([ 'commandStack.changed' ], function(e) {
    if (directEditing.isActive()) {
      directEditing.cancel();
    }
  });


  eventBus.on('directEditing.activate', function(event) {
    resizeHandles.removeResizers();
  });

  eventBus.on('create.end', 500, function(event) {

    var element = event.shape,
        canExecute = event.context.canExecute,
        isTouch = event.isTouch;

    // TODO(nikku): we need to find a way to support the
    // direct editing on mobile devices; right now this will
    // break for desworkflowediting on mobile devices
    // as it breaks the user interaction workflow

    // TODO(nre): we should temporarily focus the edited element
    // here and release the focused viewport after the direct edit
    // operation is finished
    if (isTouch) {
      return;
    }

    if (!canExecute) {
      return;
    }

    activateDirectEdit(element);
  });

  eventBus.on('autoPlace.end', 500, function(event) {
    activateDirectEdit(event.shape);
  });


  function activateDirectEdit(element, force) {
    if (force ||
        isAny(element, [ 'apmn:Task', 'apmn:TextAnnotation' ]) ||
        isCollapsedSubProcess(element)) {

      directEditing.activate(element);
    }
  }

}

LabelEditingProvider.$inject = [
  'eventBus',
  'canvas',
  'directEditing',
  'modeling',
  'resizeHandles',
  'textRenderer'
];


/**
 * Activate direct editing for activities and text annotations.
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} an object with properties bounds (position and size), text and options
 */
LabelEditingProvider.prototype.activate = function(element) {

  // text
  var text = getLabel(element);

  if (text === undefined) {
    return;
  }

  var context = {
    text: text
  };

  // bounds
  var bounds = this.getEditingBBox(element);

  assign(context, bounds);

  var options = {};

  // tasks
  if (
    isAny(element, [
      'apmn:Task',
      'apmn:Participant',
      'apmn:Lane',
      'apmn:CallActivity'
    ]) ||
    isCollapsedSubProcess(element)
  ) {
    assign(options, {
      centerVertically: true
    });
  }

  // external labels
  if (isLabelExternal(element)) {
    assign(options, {
      autoResize: true
    });
  }

  // text annotations
  if (is(element, 'apmn:TextAnnotation')) {
    assign(options, {
      resizable: true,
      autoResize: true
    });
  }

  assign(context, {
    options: options
  });

  return context;
};


/**
 * Get the editing bounding box based on the element's size and position
 *
 * @param  {djs.model.Base} element
 *
 * @return {Object} an object containing information about position
 *                  and size (fixed or minimum and/or maximum)
 */
LabelEditingProvider.prototype.getEditingBBox = function(element) {
  var canvas = this._canvas;

  var target = element.label || element;

  var bbox = canvas.getAbsoluteBBox(target);

  var mid = {
    x: bbox.x + bbox.width / 2,
    y: bbox.y + bbox.height / 2
  };

  // default position
  var bounds = { x: bbox.x, y: bbox.y };

  var zoom = canvas.zoom();

  var defaultStyle = this._textRenderer.getDefaultStyle(),
      externalStyle = this._textRenderer.getExternalStyle();

  // take zoom into account
  var externalFontSize = externalStyle.fontSize * zoom,
      externalLineHeight = externalStyle.lineHeight,
      defaultFontSize = defaultStyle.fontSize * zoom,
      defaultLineHeight = defaultStyle.lineHeight;

  var style = {
    fontFamily: this._textRenderer.getDefaultStyle().fontFamily,
    fontWeight: this._textRenderer.getDefaultStyle().fontWeight
  };

  // adjust for expanded pools AND lanes
  if (is(element, 'apmn:Lane') || isExpandedPool(element)) {

    assign(bounds, {
      width: bbox.height,
      height: 30 * zoom,
      x: bbox.x - bbox.height / 2 + (15 * zoom),
      y: mid.y - (30 * zoom) / 2
    });

    assign(style, {
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight,
      paddingTop: (7 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (5 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px',
      transform: 'rotate(-90deg)'
    });
  }


  // internal labels for tasks and collapsed call activities,
  // sub processes and participants
  if (isAny(element, [ 'apmn:Task', 'apmn:CallActivity']) ||
      isCollapsedPool(element) ||
      isCollapsedSubProcess(element)) {

    assign(bounds, {
      width: bbox.width,
      height: bbox.height
    });

    assign(style, {
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight,
      paddingTop: (7 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (5 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px'
    });
  }


  // internal labels for expanded sub processes
  if (isExpandedSubProcess(element)) {
    assign(bounds, {
      width: bbox.width,
      x: bbox.x
    });

    assign(style, {
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight,
      paddingTop: (7 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (5 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px'
    });
  }

  var width = 90 * zoom,
      paddingTop = 7 * zoom,
      paddingBottom = 4 * zoom;

  // external labels for events, data elements, gateways and connections
  if (target.labelTarget) {
    assign(bounds, {
      width: width,
      height: bbox.height + paddingTop + paddingBottom,
      x: mid.x - width / 2,
      y: bbox.y - paddingTop
    });

    assign(style, {
      fontSize: externalFontSize + 'px',
      lineHeight: externalLineHeight,
      paddingTop: paddingTop + 'px',
      paddingBottom: paddingBottom + 'px'
    });
  }

  // external label not yet created
  if (isLabelExternal(target)
      && !hasExternalLabel(target)
      && !isLabel(target)) {

    var externalLabelMid = getExternalLabelMid(element);

    var absoluteBBox = canvas.getAbsoluteBBox({
      x: externalLabelMid.x,
      y: externalLabelMid.y,
      width: 0,
      height: 0
    });

    var height = externalFontSize + paddingTop + paddingBottom;

    assign(bounds, {
      width: width,
      height: height,
      x: absoluteBBox.x - width / 2,
      y: absoluteBBox.y - height / 2
    });

    assign(style, {
      fontSize: externalFontSize + 'px',
      lineHeight: externalLineHeight,
      paddingTop: paddingTop + 'px',
      paddingBottom: paddingBottom + 'px'
    });
  }

  // text annotations
  if (is(element, 'apmn:TextAnnotation')) {
    assign(bounds, {
      width: bbox.width,
      height: bbox.height,
      minWidth: 30 * zoom,
      minHeight: 10 * zoom
    });

    assign(style, {
      textAlign: 'left',
      paddingTop: (5 * zoom) + 'px',
      paddingBottom: (7 * zoom) + 'px',
      paddingLeft: (7 * zoom) + 'px',
      paddingRight: (5 * zoom) + 'px',
      fontSize: defaultFontSize + 'px',
      lineHeight: defaultLineHeight
    });
  }

  return { bounds: bounds, style: style };
};


LabelEditingProvider.prototype.update = function(
    element, newLabel,
    activeContextText, bounds) {

  var newBounds,
      bbox;

  if (is(element, 'apmn:TextAnnotation')) {

    bbox = this._canvas.getAbsoluteBBox(element);

    newBounds = {
      x: element.x,
      y: element.y,
      width: element.width / bbox.width * bounds.width,
      height: element.height / bbox.height * bounds.height
    };
  }

  if (isEmptyText(newLabel)) {
    newLabel = null;
  }

  this._modeling.updateLabel(element, newLabel, newBounds);
};



// helpers //////////////////////

function isCollapsedSubProcess(element) {
  return is(element, 'apmn:SubProcess') && !isExpanded(element);
}

function isExpandedSubProcess(element) {
  return is(element, 'apmn:SubProcess') && isExpanded(element);
}

function isCollapsedPool(element) {
  return is(element, 'apmn:Participant') && !isExpanded(element);
}

function isExpandedPool(element) {
  return is(element, 'apmn:Participant') && isExpanded(element);
}

function isEmptyText(label) {
  return !label || !label.trim();
}