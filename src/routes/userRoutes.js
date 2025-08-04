const express = require('express');
const router = express.Router();
const { createUser, setPassword,getAllUsers ,getUserById,loginUser,deleteUser} = require('../controllers/usercontroller.js');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });


router.post('/create', upload.single('profileImage'), createUser);

router.post('/set-password', setPassword);

router.get('/all',getAllUsers);

router.post('/login',loginUser);

router.get('/get/:id',getUserById);

router.delete('/delete/:id',deleteUser);


module.exports = router;