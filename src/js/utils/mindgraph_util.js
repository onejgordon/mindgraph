import {get} from 'lodash'

const LABEL_PROPS = ['name', 'label', 'title']

var mindgraph_util = {

	_get_label_prop(graph_json) {

    let nodes = get(graph_json, 'elements.nodes')
    let label_prop = 'name'
    if (nodes && nodes.length > 0) {
      let sample_node = nodes[0]
      LABEL_PROPS.forEach((lbl) => {
        if (sample_node[lbl]) label_prop = lbl
      })
    }
    return label_prop
  },

  print_node_name(n) {
    for (let i = 0; i < LABEL_PROPS.length; i++) {
      let prop = LABEL_PROPS[i]
      if (n[prop]) return n[prop]
    }
  }

}

module.exports = mindgraph_util;