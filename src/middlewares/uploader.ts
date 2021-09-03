import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './client/public/uploads')
  },
  filename(req, file, cb) {
    cb(
      null,
      Math.random().toString(36).substr(2, 18) +
        '-' +
        Date.now() +
        path.extname(file.originalname),
    )
  },
})

const uploader = multer({ storage })

export default uploader
