/*
 * Graph Chat
 * init-db.js
 *
 * Resets and populates the firebase data store for testing, etc.
 *
 * Sean Hickey
 * MIT Media Lab, Lifelong Kindergarten Group
 * 13 Mar 2018
 *
 */
 
 var firebase = require('firebase');
 
'use strict';

// Initialize Firebase
var firebaseConfig = {
  apiKey: "AIzaSyBe1g2Dpa96RvbMRuwLa-ciG57Jc6ET0G0",
  authDomain: "graph-chat-258eb.firebaseapp.com",
  databaseURL: "https://graph-chat-258eb.firebaseio.com",
  projectId: "graph-chat-258eb",
  storageBucket: "graph-chat-258eb.appspot.com",
  messagingSenderId: "749342404967"
};
firebase.initializeApp(firebaseConfig);

var topics = [
  {
    title: "hello world",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ante libero, bibendum quis fringilla in, volutpat eu sem. Nam eget ex quis diam lobortis volutpat. Quisque aliquet risus non enim vulputate, nec porttitor lorem pretium. Nulla rutrum metus sit amet interdum porttitor. Phasellus consequat metus ut nibh placerat, ut placerat quam sodales."
  },
  {
    title: "foo bar baz!",
    content: "Nullam erat lorem, ornare eget tincidunt in, blandit vitae ex. Praesent efficitur eget dui sit amet pretium. Curabitur suscipit ut dui ultrices convallis. Morbi eget pharetra nisl, nec consequat quam. Aliquam finibus mi arcu, et scelerisque enim malesuada vitae. Suspendisse sodales nibh sed augue sollicitudin, non faucibus magna auctor."
  },
  {
    title: "third!",
    content: "Integer efficitur cursus diam, et viverra orci aliquam eget. Integer in nibh vitae dui sodales pellentesque vitae quis orci. Vestibulum nec est ornare, congue quam id, finibus magna. Cras convallis mi et mi hendrerit, ut bibendum arcu gravida. Vivamus purus dolor, tempor non risus ac, dignissim pretium lacus. Vivamus et lacus orci."
  }
];

// Here, each array of replies corresponds to the respective topic in the array above
// but this gets flatten out when pushing to firebase
var replies = [
  [
    {
      content: "Praesent ut rhoncus nibh. Vestibulum vitae consectetur diam. Morbi nec porttitor tellus"
    },
    {
      content: "Aliquam tincidunt, metus sed semper accumsan, est dolor maximus dui, ut ullamcorper diam turpis et mi."
    },
    {
      content: "Mauris fermentum feugiat sem, sit amet aliquam mi sagittis sed."
    }
  ],
  [
    {
      content: "Sed vitae auctor ligula, et laoreet nisi."
    },
    {
      content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus massa metus, molestie eget porta eu, vehicula in libero."
    }
  ],
  [
    {
      content: "Vestibulum fermentum mattis erat. Sed at diam in ex cursus condimentum. Suspendisse potenti. Nullam fringilla lectus tempus libero posuere, quis semper orci semper."
    }
  ]
]

var db = firebase.database();

// Reset db
db.ref('/').set({
  topics: {},
  replies: {}
}).then(() => {

  // Reinitialize topics and replies
  var topicsRef = db.ref('topics');
  var repliesRef = db.ref('replies');

  var topicsUpdates = {};
  var repliesUpdates = {};

  topics.forEach((topic, idx) => {
    var topicKey = topicsRef.push().key;
    topicsUpdates[topicKey] = topic;

    var topicReplies = replies[idx];
    topicReplies.forEach((reply) => {
      var replyKey = repliesRef.push().key
      repliesUpdates[replyKey] = { topic: topicKey, parent: null, ...reply }
    });

  });

  topicsRef.update(topicsUpdates).then(() => {
    repliesRef.update(repliesUpdates).then(() => {
      process.exit();
    });
  });

});




 