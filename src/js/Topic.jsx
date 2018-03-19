import React from 'react'
import Graph from './Graph.jsx'
import Sidebar from './Sidebar.jsx'

const Topic = ({match, topicId}) => {

  return (
    <div>
      <div className="col-left">
        <Graph topicId={match.params.topicId} />
      </div>
      <div className="col-right info">
        <Sidebar />
      </div>
    </div>
  )

}

export default Topic;
