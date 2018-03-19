import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect, isLoaded, getVal } from 'react-redux-firebase'

const Sidebar = ({topic, posts, selectedNode}) => {

  if (selectedNode.id === undefined || !topic || !posts) {
    return null;
  }

  // Construct the conversation nodes in order
  var currentPost = posts[selectedNode.id];

  var path = [{id: selectedNode.id, post: currentPost}];
  while (currentPost.parent != null) {
    var parent = posts[currentPost.parent];
    if (parent.parent == null) {
      break; // Don't include the root node
    }
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

const mapStateToProps = (state, props) => {
  return {
    selectedNode: state.selectedNode,
    topic: getVal(state.firebase, `data/topics/${props.topicId}`),
    posts: getVal(state.firebase, `data/posts/${props.topicId}`)
  } 
}

export default compose(
  firebaseConnect((props) => {
    return [
    `topics/${props.topicId}`,
    `posts/${props.topicId}`,
    ]
  }),
  connect(mapStateToProps)
)(Sidebar)
