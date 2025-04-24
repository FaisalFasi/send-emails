import { Firestore, getFirestore } from "firebase-admin/firestore";
import { getApps } from "firebase-admin/app";
import admin, { initializeApp } from "firebase-admin";

const serviceAccount = {
  type: "service_account",
  project_id: process.env.NEXT_FIREBASE_PROJECT_ID,
  private_key_id: process.env.NEXT_FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.NEXT_FIREBASE_PRIVATE_KEY,
  client_email: process.env.NEXT_FIREBASE_CLIENT_EMAIL,
  client_id: process.env.NEXT_FIREBASE_CLIENT_ID,
  auth_uri: process.env.NEXT_FIREBASE_AUTH_URI,
  token_uri: process.env.NEXT_FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.NEXT_FIREBASE_CLIENT_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.NEXT_FIREBASE_UNIVERSE_DOMAIN,
};
console.log("Service account", serviceAccount);
let firestore: Firestore;
const currentApps = getApps();

if (!currentApps.length) {
  const app = initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });

  firestore = getFirestore(app);
} else {
  const app = currentApps[0];
  firestore = getFirestore(app);
}
export { firestore };
