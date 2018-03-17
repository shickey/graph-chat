import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as d3 from 'd3'
import { withFirebase } from 'react-redux-firebase'
import { selectNode } from './actions'

// Test Data
import { nodes, links } from './Data'

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

// var selectedNode = null;

var container = null;
var canvas = null;

var nodesContainer = null;
var svg = null;

var drawnNodes = null;
var linksSvg = null;

// var zoom = null;

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.nodeClicked = this.nodeClicked.bind(this);
  }

  componentDidMount() {
    
    // db = this.props.firebase.database();
    
    nodesContainer = d3.select('.nodes-container');

    drawnNodes = nodesContainer.selectAll('.node')
      .data(nodes)
      .enter()
        .append('div')
        .classed('node', true)
        .each( (n, idx, nodes) => {
          var self = d3.select(nodes[idx]) // React messes with `this`, so we get the DOM element directly
          if (n.distance == 0) {
            // Draw the root
            self.classed('root-node', true);
            n.fx = 400;
            n.fy = 400;

            self.append('div')
              .classed('node-title', true)
              .text(n.title)

            self.append('hr')

            self.append('div')
              .classed('node-content', true)
              .text(n.content)

            var footer = self.append('div')
              .classed('node-footer', true)
            
            footer.append('img')
              .classed('node-avatar', true)
              .attr('src', 'img/pizza_square.jpg')

            footer.append('span')
              .text('posted by ' + n.author)

          }
          else if (n.distance == 1) {
            self.style('background-color', '#aaa');
          }
          else {
            self.style('background-color', '#444');
          }
        })
        .on('click', this.nodeClicked);

    svg = d3.select('svg');

    linksSvg = svg.append('g')
        .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line');
    

    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id( d => d.id ))
      .force('charge', d3.forceManyBody(30))
      .force('center', d3.forceCenter(400, 400))
      .force('collide', d3.forceCollide( (n, idx) => {
        if (n.distance == 0) {
            return 180;
        }
        return 80;
      }))
      .nodes(nodes)
      .on('tick', ticked);

    simulation.force('link').links(links);

    function ticked() {
      linksSvg
        .attr('x1', d => d.source.x )
        .attr('y1', d => d.source.y )
        .attr('x2', d => d.target.x )
        .attr('y2', d => d.target.y )

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

  }

  render() {
    return (
      <div className="graph-container">
        <svg className="links-container" width="100%" height="100vh"></svg>
        <div className="nodes-container"></div>
      </div>
    );
  }

  nodeClicked(d, i) {
    this.props.onSelectNode(d.id)
  }
  
}

const mapStateToProps = state => { return {} }

const mapDispatchToProps = dispatch => {
  return {
    onSelectNode: (id) => {
      dispatch(selectNode(id));
    }
  }
}

export default compose(
  withFirebase,
  connect(mapStateToProps, mapDispatchToProps)
)(Graph)
