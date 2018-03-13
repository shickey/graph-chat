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

var data = [
  {
    x: 100,
    y: 100,
    w: 200,
    h: 100,
    title: "hello world!",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ante libero, bibendum quis fringilla in, volutpat eu sem. Nam eget ex quis diam lobortis volutpat. Quisque aliquet risus non enim vulputate, nec porttitor lorem pretium. Nulla rutrum metus sit amet interdum porttitor. Phasellus consequat metus ut nibh placerat, ut placerat quam sodales. Aliquam nec hendrerit tellus. Duis ut justo nibh. Cras porta justo quis turpis auctor, ac tincidunt eros imperdiet. Maecenas eu nisi felis. Sed nisl ex, porttitor eu elit eu, vehicula interdum nunc. Donec mi enim, cursus quis dignissim eu, vestibulum eget libero."
  },
  {
    x: 300,
    y: 250,
    w: 100,
    h: 50,
    title: "foo bar baz!",
    content: "Nullam erat lorem, ornare eget tincidunt in, blandit vitae ex. Praesent efficitur eget dui sit amet pretium. Curabitur suscipit ut dui ultrices convallis. Morbi eget pharetra nisl, nec consequat quam. Aliquam finibus mi arcu, et scelerisque enim malesuada vitae. Suspendisse sodales nibh sed augue sollicitudin, non faucibus magna auctor. Aenean augue ipsum, facilisis vel ligula quis, dapibus rutrum risus. Curabitur a malesuada justo. Praesent nisl ex, volutpat et elit eu, porttitor cursus velit. Morbi aliquam, turpis id interdum sollicitudin, diam arcu consequat purus, posuere elementum odio augue sed urna. Integer posuere dapibus tristique. Curabitur aliquet sed nisi ut blandit. Pellentesque ac sollicitudin nulla, ut commodo orci. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
  },
  {
    x: 450,
    y: 0,
    w: 100,
    h: 75,
    title: "third!",
    content: "Integer efficitur cursus diam, et viverra orci aliquam eget. Integer in nibh vitae dui sodales pellentesque vitae quis orci. Vestibulum nec est ornare, congue quam id, finibus magna. Cras convallis mi et mi hendrerit, ut bibendum arcu gravida. Vivamus purus dolor, tempor non risus ac, dignissim pretium lacus. Vivamus et lacus orci. Suspendisse pulvinar lacus libero, ut varius diam sodales sit amet. Aenean in rhoncus purus. Quisque ut mauris quis massa ullamcorper maximus."
  }
];

var db = firebase.database();
var nodesRef = db.ref('nodes');

nodesRef.set({})
  .then(function() {
    var updates = {};
    data.forEach(function(d) {
      updates[nodesRef.push().key] = d;
    })
    nodesRef.update(updates).then(function() {
      db.ref('transform').set({
        k: 1,
        x: 0,
        y: 0
      }).then(function() {
        process.exit();
      });
    });
  });
 