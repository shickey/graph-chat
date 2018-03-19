import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Link } from 'react-router-dom'
import { firebaseConnect, isLoaded } from 'react-redux-firebase'

const Dashboard = ({match, topics}) => {

  if (!topics) { return null; }

  var topicCells = [];
  for (var topicId in topics) {
    var topic = topics[topicId];
    topicCells.push(
      <div className="topic-cell" key={topicId}>
        <div className="topic-cell-inner">
          <div className="topic-cell-title">
            <Link to={`/topic/${topicId}`}>
              <h3>{topic.title}</h3>
            </Link>
            <hr />
          </div>
          <div className="topic-cell-content">
            {topic.content}
          </div>
          <div className="topic-cell-footer">
            <img src={`img/${topic.avatar}`} />
            <span>posted by {topic.author}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="topics-list">
        <h2>Topics</h2>
        {topicCells}
      </div>
    </div>
  )

}


const mapStateToProps = state => {
  return {
    topics: state.firebase.data.topics
  }
}

export default compose(
  firebaseConnect([
    'topics'
  ]),
  connect(mapStateToProps)
)(Dashboard);
