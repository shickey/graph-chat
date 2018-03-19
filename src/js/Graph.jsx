import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import * as d3 from 'd3'
import { firebaseConnect, isLoaded } from 'react-redux-firebase'
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
 
var container = null;
var canvas = null;

var nodesContainer = null;
var svg = null;

var topic = null;
var posts = null;
var links = null;

var drawnNodes = null;
var linksSvg = null;

// var zoom = null;

var initialized = false;

class Graph extends React.Component {

  constructor(props) {
    super(props);
    this.nodeClicked = this.nodeClicked.bind(this);
  }

  shouldComponentUpdate() {
    return !initialized;
  }

  componentDidUpdate() {
    console.log("did update");
    if (isLoaded(this.props.topics)) {
      console.log("topics loaded")
    }
    if (isLoaded(this.props.posts)) {
      console.log("posts loaded")
    }
    if (isLoaded(this.props.topics) && isLoaded(this.props.posts)) {
      console.log("updating");

      var topicId = Object.keys(this.props.topics)[0];
      topic = this.props.topics[topicId];

      posts = d3.entries(this.props.posts[topicId]);

      this.updateNodes()

      initialized = true;
    }
  }

  updateNodes() {

    // Construct links
    links = posts.filter(p => (p.value.parent != null)) // Ignore the root node
      .map( (p, idx) => {
        return { id: idx, source: p.key, target: p.value.parent }; // @TODO: Find a better id mechanism here
      })

    nodesContainer = d3.select('.nodes-container');

    drawnNodes = nodesContainer.selectAll('.node')
      .data(posts)
      .enter()
        .append('div')
        .classed('node', true)
        .each( (n, idx, nodes) => {
          var self = d3.select(nodes[idx]) // React messes with `this`, so we get the DOM element directly
          if (n.value.parent == null) {
            // Draw the root
            self.classed('root-node', true);
            n.fx = 400;
            n.fy = 400;

            self.append('div')
              .classed('node-title', true)
              .text(topic.title)

            self.append('hr')

            self.append('div')
              .classed('node-content', true)
              .text(n.value.content)

            var footer = self.append('div')
              .classed('node-footer', true)
            
            footer.append('img')
              .classed('node-avatar', true)
              .attr('src', 'img/' + n.value.avatar)

            footer.append('span')
              .text('posted by ' + n.value.author)

          }
          else {
            self.append('img')
              .classed('reply-avatar', true)
              .attr('src', 'img/' + n.value.avatar)
          }
        })
        .on('click', this.nodeClicked);

    svg = d3.select('svg');

    linksSvg = svg.append('g')
        .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
        .append('line')
        .classed('link', true)
    

    var simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id( d => d.key ))
      .force('charge', d3.forceManyBody(30))
      .force('center', d3.forceCenter(400, 400))
      .force('collide', d3.forceCollide( (n, idx) => {
        if (n.value.parent == null) {
            return 180;
        }
        return 80;
      }))
      .nodes(posts)
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

  pathForNodeDatum(d) {
    var pathNodeIds = {}; // Simple object structure to simplify lookup later
    var pathLinkIds = {};

    pathNodeIds[d.key] = true;

    var currentNode = d;

    while (currentNode.value.parent != null) {
      var link = links.find( l => l.source.key == currentNode.key );
      pathLinkIds[link.id] = true;
      var parent = posts.find( p => p.key == link.target.key );
      pathNodeIds[parent.key] = true;
      currentNode = parent;
    }

    return {
      nodeIds: pathNodeIds,
      linkIds: pathLinkIds
    }
  }

  nodeClicked(d, i) {

    var path = this.pathForNodeDatum(d);

    if (d.value.parent == null) {
      d3.selectAll('.node')
        .classed('node-selected', false)
        .classed('node-unselected', false);
      d3.selectAll('.link')
        .classed('link-selected', false)
        .classed('link-unselected', false);
      this.props.onSelectNode(undefined);
    }
    else {
      d3.selectAll('.node')
        .classed('node-selected', datum => datum.key in path.nodeIds)
        .classed('node-unselected', datum => !(datum.key in path.nodeIds))
      d3.selectAll('.link')
        .classed('link-selected', datum => datum.id in path.linkIds)
        .classed('link-unselected', datum => !(datum.id in path.linkIds))
      this.props.onSelectNode(d.key);
    }
  }
  
}

const mapStateToProps = state => {
  return {
    topics: state.firebase.data.topics,
    posts: state.firebase.data.posts
  } 
}

const mapDispatchToProps = dispatch => {
  return {
    onSelectNode: (id) => {
      dispatch(selectNode(id));
    }
  }
}

export default compose(
  firebaseConnect([
    'topics',
    'posts'
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(Graph)
