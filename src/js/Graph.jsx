import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as d3 from 'd3'
import { withFirebase } from 'react-redux-firebase'
import { selectNode } from './actions'

/*
 * Graph Chat
 *
 * Nonlinear online discussions
 *
 * Sean Hickey
 * MIT Media Lab, Lifelong Kindergarten Group
 * 13 Mar 2018
 *
 */
 
var db = null;
var data = [];

var rootId = 3;

var nodes = [
  {
    id: 1,
    content: "Praesent ut rhoncus nibh. Vestibulum vitae consectetur diam. Morbi nec porttitor tellus"
  },
  {
    id: 2,
    content: "Aliquam tincidunt, metus sed semper accumsan, est dolor maximus dui, ut ullamcorper diam turpis et mi."
  },
  {
    id: 3,
    content: "Mauris fermentum feugiat sem, sit amet aliquam mi sagittis sed."
  },
  {
    id: 4,
    content: "Sed vitae auctor ligula, et laoreet nisi."
  },
  {
    id: 5,
    content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus massa metus, molestie eget porta eu, vehicula in libero."
  },
  {
    id: 6,
    content: "Vestibulum fermentum mattis erat. Sed at diam in ex cursus condimentum. Suspendisse potenti. Nullam fringilla lectus tempus libero posuere, quis semper orci semper."
  },
  {
    id: 7,
    content: "Nam bibendum sodales viverra."
  },
  {
    id: 8,
    content: "Nunc sapien ipsum, cursus sit amet cursus quis, auctor vitae erat. Vivamus fermentum ut lectus iaculis vehicula."
  },
  {
    id: 9,
    content: "Phasellus tellus augue, malesuada eu erat quis, iaculis interdum nibh. Curabitur eros nunc, rutrum quis dolor vel, sodales rhoncus magna."
  }
];

var links = [
  { source: 1, target: 3 },
  { source: 2, target: 3 },
  { source: 4, target: 3 },
  { source: 5, target: 1 },
  { source: 6, target: 1 },
  { source: 7, target: 3 },
  { source: 8, target: 4 },
  { source: 9, target: 3 }
];

// var selectedNode = null;
// var transformUpdateTimer = null;

// var currentTransform = null;
var container = null;
var canvas = null;

var nodesContainer = null;
var svg = null;

// var nodesSvg = null;
var drawnNodes = null;
var linksSvg = null;

// var zoom = null;

// const RESIZE_MARGIN = 4; // px in screen space
// const MIN_NODE_HEIGHT = 32; // px in local node coordinates
// const MIN_NODE_WIDTH  = 64; // px in local node coordinates

// var ResizeTypes = {
//       NONE:  1 << 0,
//       NORTH: 1 << 1,
//       EAST:  1 << 2,
//       SOUTH: 1 << 3,
//       WEST:  1 << 4
//     }
// var shouldResize = ResizeTypes.NONE;
// var resizing = false;
// var resizeOrigin = null;
// var nodeDrag = null;

// var self = null;

class Graph extends React.Component {

  componentDidMount() {
    // self = this;
    
    // db = this.props.firebase.database();
    
    // currentTransform = d3.zoomIdentity;
    
    // container = d3.select('.graph-container');
    // canvas = container.append('div')
    //   .attr('id', 'canvas')
    //   .style('width', '100%')
    //   .style('height', '100vh')
    //   .style('min-height', '100vh');

    nodesContainer = d3.select('.nodes-container');

    drawnNodes = nodesContainer.selectAll('.node')
      .data(nodes)
      .enter()
        .append('div')
        .classed('node', true)
        .each( (n, idx, nodes) => {
          if (n.id == rootId) {
            // Draw the root
            var self = d3.select(nodes[idx]) // React messes with `this`, so we get the DOM element directly
            self.classed('root-node', true);
            n.fx = 400;
            n.fy = 400;
          }
        })

    // nodesSvg = svg.append('g')
    //     .attr('class', 'nodes')
    //   .selectAll('circle')
    //   .data(nodes)
    //   .enter()
    //     .append('circle')
    //     .attr('r', 20)
    //     .each( (n, idx, nodes) => {
    //       if (n.id == rootId) {
    //         // Draw the root
    //         var self = d3.select(nodes[idx]) // React messes with `this`, so we get the DOM element directly
    //         self.attr('class', 'root-node');
    //         n.fx = 400;
    //         n.fy = 400;
    //       }
    //     })

    svg = d3.select('svg');

    linksSvg = svg.append('g')
        .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line');
    

    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id( d => d.id ))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(400, 400))
      .force('collide', d3.forceCollide(40))
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force('link').links(links);

    function ticked() {
      linksSvg
        .attr('x1', d => d.source.x )
        .attr('y1', d => d.source.y )
        .attr('x2', d => d.target.x )
        .attr('y2', d => d.target.y )

      // nodesSvg
      //   .attr('cx', d => d.x )
      //   .attr('cy', d => d.y )

      drawnNodes
        .style('left', (d, idx, nodes) => {
          var self = d3.select(nodes[idx]);
          var rect = self.node().getBoundingClientRect();
          return (d.x - (rect.width / 2.0)) + 'px';
        })
        .style('top', (d, idx, nodes) => {
          var self = d3.select(nodes[idx]);
          var rect = self.node().getBoundingClientRect();
          return (d.y - (rect.height / 2.0)) + 'px';
        })
    }



    // zoom = d3.zoom()
    //   .scaleExtent([0.6, 3])
    //   .on('zoom', function() {
    //     currentTransform = d3.event.transform;
    //     var transformString = 'matrix(' + currentTransform.k + ',0,0,' + currentTransform.k + ',' + currentTransform.x + ',' + currentTransform.y + ')';
    //     canvas.style('transform', transformString);
        
    //     // Only update the transform in firebase after the transform hasn't changed for a full second
    //     if (transformUpdateTimer) {
    //       window.clearTimeout(transformUpdateTimer);
    //       transformUpdateTimer = null;
    //     }
    //     transformUpdateTimer = window.setTimeout(function() {
    //       db.ref('transform').set(currentTransform);
    //       transformUpdateTimer = null;
    //     }, 1000);
        
    //   });
    // container.call(zoom);

    // nodeDrag = d3.drag()
    //   .on('start', this.nodeDragStart)
    //   .on('drag', this.nodeDragDragging)
    //   .on('end', this.nodeDragEnd);
    
    // db.ref('nodes').on('value', function(snapshot) {
    //   data = d3.entries(snapshot.val());
    //   self.updateNodes();
    // });
    
    // db.ref('transform').on('value', function(snapshot) {
    //   var t = snapshot.val();
    //   var newTransform = d3.zoomIdentity.translate(t.x, t.y).scale(t.k);
    //   container.call(zoom.transform, newTransform);
    // });

    // this.updateNodes();
  }

  render() {
    return (
      <div className="graph-container">
        <svg className="links-container" width="100%" height="100vh"></svg>
        <div className="nodes-container"></div>
      </div>
    );
  }


  // /* Local functions */
  // nodeMouseEnter(d) {
  //   if (resizing) { return; }
  //   self.updateResizeCursor(this, d);
  // }
  
  // nodeMouseMove(d) {
  //   if (resizing) { return; }
  //   self.updateResizeCursor(this, d);
  // }
  
  // nodeMouseLeave() {
  //   var body = d3.select("body");
  //   if (!resizing) {
  //     body.style('cursor', null);
  //     shouldResize = ResizeTypes.NONE;
  //   }
  // }
  
  // updateResizeCursor(node, d) {
  //   var body = d3.select("body");
  //   var locationInNode = d3.mouse(node);
  //   var x = locationInNode[0] / currentTransform.k;
  //   var y = locationInNode[1] / currentTransform.k;
  //   var projectedMargin = RESIZE_MARGIN / currentTransform.k;
    
  //   if (x < projectedMargin) {
  //     if (y < projectedMargin) {
  //       body.style('cursor', 'nw-resize');
  //       shouldResize = ResizeTypes.NORTH | ResizeTypes.WEST;
  //     }
  //     else if (y > d.value.h - projectedMargin) {
  //       body.style('cursor', 'sw-resize');
  //       shouldResize = ResizeTypes.SOUTH | ResizeTypes.WEST;
  //     }
  //     else {
  //       body.style('cursor', 'w-resize');
  //       shouldResize = ResizeTypes.WEST;
  //     }
  //   }
  //   else if (x > d.value.w - projectedMargin) {
  //     if (y < projectedMargin) {
  //       body.style('cursor', 'ne-resize');
  //       shouldResize = ResizeTypes.NORTH | ResizeTypes.EAST;
  //     }
  //     else if (y > d.value.h - projectedMargin) {
  //       body.style('cursor', 'se-resize');
  //       shouldResize = ResizeTypes.SOUTH | ResizeTypes.EAST;
  //     }
  //     else {
  //       body.style('cursor', 'e-resize');
  //       shouldResize = ResizeTypes.EAST;
  //     }
  //   }
  //   else if (y < projectedMargin) {
  //     body.style('cursor', 'n-resize');
  //     shouldResize = ResizeTypes.NORTH;
  //   }
  //   else if (y > d.value.h - projectedMargin) {
  //     body.style('cursor', 's-resize');
  //     shouldResize = ResizeTypes.SOUTH;
  //   }
  //   else {
  //     body.style('cursor', null);
  //     shouldResize = ResizeTypes.NONE;
  //   }
  // }
  
  // nodeDragStart(d) {
  //   var node = d3.select(this);
  //   node.raise();
  //   if (shouldResize !== ResizeTypes.NONE) {
  //     resizing = true;
  //     resizeOrigin = {
  //       x: d.value.x,
  //       y: d.value.y,
  //       w: d.value.w,
  //       h: d.value.h
  //     }
  //   }
  //   self.selectNode(node);
  // }
  
  // nodeDragDragging(d) {
  //   var node = d3.select(this);
  //   if (resizing) {
      
  //     var mouseX = d3.event.x / currentTransform.k;
  //     var mouseY = d3.event.y / currentTransform.k;
      
  //     if (shouldResize & ResizeTypes.SOUTH) {
  //       d.value.h = Math.max(mouseY - resizeOrigin.y, MIN_NODE_HEIGHT);
  //       node.style('height', d.value.h + 'px');
  //     }
  //     if (shouldResize & ResizeTypes.NORTH) {
  //       d.value.h = Math.max(resizeOrigin.h - (mouseY - resizeOrigin.y), MIN_NODE_HEIGHT);
  //       if (d.value.h === MIN_NODE_HEIGHT) {
  //         d.value.y = resizeOrigin.y + resizeOrigin.h - MIN_NODE_HEIGHT;
  //       }
  //       else {
  //         d.value.y = mouseY;
  //       }
  //       node.style('height', d.value.h + 'px');
  //       node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
  //     }
  //     if (shouldResize & ResizeTypes.EAST) {
  //       d.value.w = Math.max(mouseX - resizeOrigin.x, MIN_NODE_WIDTH);;
  //       node.style('width', d.value.w + 'px');
  //     }
  //     if (shouldResize & ResizeTypes.WEST) {
  //       d.value.w = Math.max(resizeOrigin.w - (mouseX - resizeOrigin.x), MIN_NODE_WIDTH);
  //       if (d.value.w === MIN_NODE_WIDTH) {
  //         d.value.x = resizeOrigin.x + resizeOrigin.w - MIN_NODE_WIDTH;
  //       }
  //       else {
  //         d.value.x = mouseX;
  //       }
  //       node.style('width', d.value.w + 'px');
  //       node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
  //     }
  //   }
  //   else {
  //     d.value.x += d3.event.dx / currentTransform.k;
  //     d.value.y += d3.event.dy / currentTransform.k;
  //     node.style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'});
  //   }
    
  // }
  
  // nodeDragEnd(d) {
  //   if (resizing) {
  //     resizing = false;
  //     resizeOrigin = null;
  //     self.updateResizeCursor(this, d);
  //   }
  //   db.ref('nodes/' + d.key).set(d.value);
  // }
  
  
    
  // selectNode(node) {
  //   if (!node) return;
  //   this.props.onSelectNode(node.datum().key);

  //   // if (selectedNode) {
  //   //   selectedNode.classed('selected', false);
  //   //   document.getElementById('node-edit-title').value = "";
  //   //   document.getElementById('node-edit-content').value = "";
  //   //   d3.select('.node-editor').classed('hidden', true);
  //   // }
  //   // if (node) {
  //   //   node.classed('selected', true);
  //   //   selectedNode = node;
  //   //   var d = node.datum();
  //   //   document.getElementById('node-edit-title').value = d.value.title;
  //   //   document.getElementById('node-edit-content').value = d.value.content;
  //   //   d3.select('.node-editor').classed('hidden', false);
  //   // }
  // }
  
  updateNodes() {
    var nodes = canvas.selectAll('div.node')
      .data(data, function(d) { return d.key; });

    nodes.exit().remove();

    var entering = nodes.enter().append('div')
        .attr('class', 'node');

    entering.append('div')
        .attr('class', 'node-title')
      .append('h3')
        .text(function(d) { return d.value.title; });
    
    entering.append('div')
        .attr('class', 'node-content')
        .text(function(d) { return d.value.content; });    

    entering.merge(nodes)
        // .style('width', function(d) { return d.value.w + 'px'; })
        // .style('height', function(d) { return d.value.h + 'px'; })
        // .style('transform', function(d) { return 'translate(' + d.value.x + 'px,' + d.value.y + 'px)'})
        // .call(nodeDrag)
        // .on('mouseenter', this.nodeMouseEnter)
        // .on('mousemove',  this.nodeMouseMove)
        // .on('mouseleave', this.nodeMouseLeave);
  }


}

const mapStateToProps = state => { return {} }

const mapDispatchToProps = dispatch => {
  return {
    // onSelectNode: (id) => {
    //   dispatch(selectNode(id));
    // }
  }
}

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Graph)
