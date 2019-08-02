const firebase = require('firebase/app');
require('firebase/firestore');
var firebaseConfig = {
  apiKey: "AIzaSyDcrN8ppfk7RpEuvcivuY2pGILek3quNAg",
  authDomain: "recipes-d7c43.firebaseapp.com",
  databaseURL: "https://recipes-d7c43.firebaseio.com",
  projectId: "recipes-d7c43",
  storageBucket: "recipes-d7c43.appspot.com",
  messagingSenderId: "825576771664",
  appId: "1:825576771664:web:abfadf20af1a2d18"
};
// Initialize Firebase
const firebaseapp = firebase.initializeApp(firebaseConfig);

export default firebaseapp.firestore()