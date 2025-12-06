import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

// The "default" app is automatically initialized by the native code
// (reading your google-services.json), but importing 'firebase'
// ensures the javascript layer knows about it.

const db = firestore();
const authInstance = auth();

export { authInstance as auth, db };
