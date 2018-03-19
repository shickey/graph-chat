import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { firebaseConnect } from 'react-redux-firebase'


const Sidebar = ({topics, posts, selectedNode}) => {

  if (selectedNode.id === undefined || !topics || !posts) {
    return null;
  }

  var topicId = Object.keys(topics)[0];
  var topicPosts = posts[topicId]; // @TODO: Index is topic id, should be updated eventually

  // Construct the conversation nodes in order
  var currentPost = topicPosts[selectedNode.id];

  var path = [{id: selectedNode.id, post: currentPost}];
  while (currentPost.parent != null) {
    var parent = topicPosts[currentPost.parent];
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

const mapStateToProps = state => {
  return {
    selectedNode: state.selectedNode,
    topics: state.firebase.data.topics,
    posts: state.firebase.data.posts
  }
}

export default compose(
  firebaseConnect([
    'topics',
    'posts'
  ]),
  connect(mapStateToProps)
)(Sidebar);
