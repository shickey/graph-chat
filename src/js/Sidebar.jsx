import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

// Test Data
import { nodes, links } from './Data'

const Sidebar = ({selectedNode}) => {

  if (selectedNode.id === undefined) {
    return null;
  }

  // Construct the conversation nodes in order

  var currentNode = nodes.find( n => n.id == selectedNode.id )
  var path = [currentNode];
  while (currentNode.distance !== 0) {
    var link = links.find( l => l.source.id == currentNode.id )
    var parent = nodes.find( n => n.id == link.target.id )
    path.unshift(parent)
    currentNode = parent
  }

  var textBoxes = [];
  path.forEach( (n, idx) => {
    if (idx == 0) {
      textBoxes.push(
        <div className="discuss-element">
          <div className="discuss-element-header">
            <img src="img/pizza_square.jpg" />
            <span>{n.author} posted: </span>
          </div>
          <div className="discuss-element-content">
            {n.content}
          </div>
        </div>
      )
    }
    else {
      textBoxes.push(
        <div className="discuss-element">
          <div className="discuss-element-header">
            <img src="img/pizza_square.jpg" />
            <span>{n.author} replied:</span>
          </div>
          <div className="discuss-element-content">
            {n.content}
          </div>
        </div>
      )
    }
  })


  return (
    <div className="sidebar">
      <h2>Thread</h2>
      <hr />
      {textBoxes}
    </div>
  )
}

const mapStateToProps = state => {
  return {
    selectedNode: state.selectedNode,
    nodes: state.firebase.data.nodes
  }
}

export default compose(
  firebaseConnect([
    'nodes'
  ]),
  connect(mapStateToProps)
)(Sidebar);
