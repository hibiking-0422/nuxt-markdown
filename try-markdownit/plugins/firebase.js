import firebase from "firebase"
 
if (!firebase.apps.length) {
 firebase.initializeApp({
    apiKey: "AIzaSyCYe7999sDPvpk8UjHYYmYi93rBd4U6mgQ",
    authDomain: "test-app01-8eafc.firebaseapp.com",
    databaseURL: "https://test-app01-8eafc.firebaseio.com",
    projectId: "test-app01-8eafc",
    storageBucket: "test-app01-8eafc.appspot.com",
    messagingSenderId: "614880607700",
    appId: "1:614880607700:web:3941387960d3f95d64ea41",
    measurementId: "G-34TMS09CLY"
 })
}
 
export default firebase