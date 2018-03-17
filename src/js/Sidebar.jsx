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
  path.forEach( n => {
    textBoxes.push(
      <div className="discuss-element">
        <p>{n.content}</p>
      </div>
    )
  })


  return (
    <div className="node-editor">
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
