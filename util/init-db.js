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


// Avatar images from roundicons

// @TODO: Move author info out of topics and posts?
//        Maybe make authors an object inside each topic/set of posts?

// @NOTE: The keys used in the topics and posts objects get
//        replaced by firebase keys when pushing to the DB.
//        But they're still useful in this context since they
//        allow us to define keyed relationships without knowing
//        the keys beforehand.
const topics = {
  1: {
    title: "Hello world!",
    root: 3,
    author: "Branda Rajesh",
    avatar: "user-18.png"
  }
}

const posts = {
  1: { // Topic ID
    1: { // Post IDs
      content: "Praesent ut rhoncus nibh. Vestibulum vitae consectetur diam. Morbi nec porttitor tellus",
      author: "Gustaaf Gunnhildr",
      avatar: "user-0.png",
      parent: 3,
      children: {
        5: true,
        6: true
      }
    },
    2: {
      content: "Aliquam tincidunt, metus sed semper accumsan, est dolor maximus dui, ut ullamcorper diam turpis et mi.",
      author: "Radha Manisha",
      avatar: "user-7.png",
      parent: 3,
      children: {}
    },
    3: {
      content: "Sed est urna, pretium ac semper quis, dictum elementum ipsum. Integer malesuada condimentum ex vehicula congue. Nunc laoreet tortor lectus, at convallis neque fermentum non. Proin fringilla congue felis, a pulvinar dui luctus ut. Nam sagittis tempus metus, id consectetur dui commodo in. Vestibulum sit amet tortor turpis. Donec lobortis condimentum elit, eu euismod ante. Mauris porttitor in massa at imperdiet. Nam pretium elementum tortor in sagittis.",
      author: "Branda Rajesh",
      avatar: "user-18.png",
      parent: null,
      children: {
        1 : true,
        2 : true,
        4 : true,
        7 : true,
        9 : true
      }
    },
    4: {
      content: "Sed vitae auctor ligula, et laoreet nisi.",
      author: "Vassiliki Aucaman",
      avatar: "user-1.png",
      parent: 3,
      children: {
        8: true
      }
    },
    5: {
      content: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus massa metus, molestie eget porta eu, vehicula in libero.",
      author: "Sikke Fflur",
      avatar: "user-22.png",
      parent: 1,
      children: {}
    },
    6: {
      content: "Vestibulum fermentum mattis erat. Sed at diam in ex cursus condimentum. Suspendisse potenti. Nullam fringilla lectus tempus libero posuere, quis semper orci semper.",
      author: "Deepti Jonas",
      avatar: "user-16.png",
      parent: 1,
      children: {}
    },
    7: {
      content: "Nam bibendum sodales viverra.",
      author: "Omolara Cecilia",
      avatar: "user-11.png",
      parent: 3,
      children: {}
    },
    8: {
      content: "Nunc sapien ipsum, cursus sit amet cursus quis, auctor vitae erat. Vivamus fermentum ut lectus iaculis vehicula.",
      author: "Valentine Eunike",
      avatar: "user-19.png",
      parent: 4,
      children: {}
    },
    9: {
      content: "Phasellus tellus augue, malesuada eu erat quis, iaculis interdum nibh. Curabitur eros nunc, rutrum quis dolor vel, sodales rhoncus magna."
      ,
      author: "Sigimund Urban",
      avatar: "user-2.png",
      parent: 3,
      children: {}
    }
  }
}


var db = firebase.database();

// Reset db
db.ref('/').set({
  topics: {},
  posts: {}
}).then(() => {

  // Reinitialize topics and replies
  var topicsRef = db.ref('topics');
  var postsRef = db.ref('posts');

  var topicsUpdates = {};
  var postsUpdates = {};

  Object.keys(topics).forEach( (topicId, idx) => {
    var topicKey = topicsRef.push().key;
    

    var topicPosts = posts[topicId];
    var idMapping = {}; // Key is the id for the post in the structure
                        // written at the top of this file, value is the
                        // firebase key it will live at when pushed
    Object.keys(topicPosts).forEach( (postId, idx) => {
      idMapping[postId] = postsRef.push().key;
    })

    Object.keys(topicPosts).forEach( (postId, idx) => {
      var post = Object.assign({}, topicPosts[postId]); // Create a copy, just for good measure
      if (post.parent) {
        post.parent = idMapping[post.parent]
      }
      if (post.children) {
        var newChildren = {};
        for (childId in post.children) {
          newChildren[idMapping[childId]] = true;
        }
        post.children = newChildren;
      }
      postsUpdates[topicKey + '/' + idMapping[postId]] = post;
    })

    var newTopic = Object.assign({}, topics[topicId]);
    newTopic.root = idMapping[newTopic.root];
    topicsUpdates[topicKey] = newTopic;

  })

  topicsRef.update(topicsUpdates).then(() => {
    postsRef.update(postsUpdates).then(() => {
      process.exit();
    });
  });

});




 