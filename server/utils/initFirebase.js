import {initializeApp} from "firebase/app"
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import fs from "fs"
import { config } from "dotenv";

config()

export const app = initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
})

export const uploadImage = async(filePath,fileName,type) => {
  try{

    if(!fs.existsSync(filePath)) return;
    const storage = getStorage(app);

    const imageRef = ref(storage,`${Date.now()}-${fileName}`)

    const file = fs.readFileSync(filePath)

   
    const uploadTask = uploadBytesResumable(imageRef,file , {
      contentType:type
    })
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(fileUrl);
          } catch (error) {
            reject(error);
          }
        }
      );
    });

  }catch(err){
    throw (err)
  }
 
    

}