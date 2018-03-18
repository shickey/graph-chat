import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'

// Test Data
// import { nodes, links } from './Data'
import { topics, threads } from './Data'

const Sidebar = ({selectedNode}) => {

  if (selectedNode.id === undefined) {
    return null;
  }

  // Construct the conversation nodes in order
  var posts = threads[1]; // @TODO: Index is topic id, should be updated eventually
  var currentPost = posts[selectedNode.id];

  var path = [{id: selectedNode.id, post: currentPost}];
  while (currentPost.parent !== null) {
    var parent = posts[currentPost.parent];
    path.unshift({id: currentPost.parent, post: parent});
    currentPost = parent;
  }

  var textBoxes = [];
  path.forEach( (n, idx) => {
    textBoxes.push(
      <div className="discuss-element" key={n.id}>
        <div className="discuss-element-header">
          <img src={"img/" + n.post.avatar} />
          <span>{n.post.author} replied:</span>
        </div>
        <div className="discuss-element-content">
          {n.post.content}
        </div>
      </div>
    )
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
