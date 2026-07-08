
import multer from "multer";
import path from "path";
const storage=multer.memoryStorage()
const uploader=multer({
    storage
})
export {uploader}




