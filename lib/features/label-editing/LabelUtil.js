import { is } from '../../util/ModelUtil';

function getLabelAttr(semantic) {
  if (
    is(semantic, 'apmn:FlowElement') ||
    is(semantic, 'apmn:Participant') ||
    is(semantic, 'apmn:Lane') ||
    is(semantic, 'apmn:SequenceFlow') ||
    is(semantic, 'apmn:MessageFlow') ||
    is(semantic, 'apmn:DataInput') ||
    is(semantic, 'apmn:DataOutput')
  ) {
    return 'name';
  }

  if (is(semantic, 'apmn:TextAnnotation')) {
    return 'text';
  }
}

export function getLabel(element) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    return semantic[attr] || '';
  }
}


export function setLabel(element, text, isExternal) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {
    semantic[attr] = text;
  }

  return element;
}