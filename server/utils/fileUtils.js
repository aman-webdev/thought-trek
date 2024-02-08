import fs from "fs"

export const checkIfFolderExists = (folderPath) =>{
    return fs.existsSync(folderPath)
}

export const createFolder = (folderPath) => {
    fs.mkdirSync(folderPath,{recursive:true})
}