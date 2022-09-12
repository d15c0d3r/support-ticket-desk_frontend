import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwzL7HITDxOZxby4aQOB7g5MnT0LmHWdU",
  authDomain: "support-ticket-desk.firebaseapp.com",
  projectId: "support-ticket-desk",
  storageBucket: "support-ticket-desk.appspot.com",
  messagingSenderId: "182099896436",
  appId: "1:182099896436:web:8800bc1481d0fc54748921",
  // Text: "google-site-verification=rHq0RfcXZ4CKn1J25KQ4HOLkiUwrBmqnUXjHQU6yFkk",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
