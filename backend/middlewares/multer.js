import multer from 'multer';
import path from 'path';

// Define disk storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads'); // make sure this folder exists!
  },
  filename: function (req, file, callback) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Get file extension
    callback(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

export default upload;
