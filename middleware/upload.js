const multer = require('multer');
const path = require('path');

// Multer configuration to handle file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination where uploaded files will be stored
        cb(null, 'uploads/'); // The 'uploads/' directory must exist
    },
    filename: function (req, file, cb) {
        // Set the filename of the uploaded file
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
