import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAKwmJQYxHWXzjj_zScd-nKF4jsrBlIREo",
    authDomain: "firevuechat-a86b7.firebaseapp.com",
    databaseURL: "https://firevuechat-a86b7-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "firevuechat-a86b7",
    storageBucket: "firevuechat-a86b7.appspot.com",
    messagingSenderId: "376942569666",
    appId: "1:376942569666:web:3b708bc53e0789beb3335b"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
export default db;
