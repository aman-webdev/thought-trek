import multer, {diskStorage} from "multer"
import path from "path"
import {checkIfFolderExists,createFolder} from "../utils/fileUtils.js"

const __dirname = path.resolve()
const tempPath = path.join(__dirname,'/tmp')

const doesTempExists = checkIfFolderExists(tempPath)
if(!doesTempExists) createFolder(tempPath)

const storage = diskStorage({
    destination:(req,file,cb)=>{
        cb(null,tempPath)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
      }
})

export default multer({storage})