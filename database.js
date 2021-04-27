const admin = require("firebase-admin");

let serviceAccount;
if (process.env.PRIVATE_KEY) {
  //in heroku
  serviceAccount = JSON.parse(process.env.PRIVATE_KEY)
} else {
  //local in my computer
  serviceAccount = require("./firebase-private-key.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

function getDatabase() {
  return admin.firestore()
}

module.exports = getDatabase
