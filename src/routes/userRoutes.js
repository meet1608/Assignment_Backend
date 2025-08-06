const express = require('express');
const router = express.Router();
const { getAllUsers ,getUserById,deleteUser,updateUser} = require('../controllers/usercontroller.js');
const {createUser,setPassword,loginUser,forgotPassword,resetpassword} = require('../controllers/authcontroller.js');
const validate = require('../middleware/validate.js');
const { createUserSchema, setPasswordSchema, loginSchema, forgotPasswordSchema, updateUserSchema,resetPasswordSchema } = require('../../validations/userValidation.js');
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


router.post('/create', upload.single('profileImage'),validate(createUserSchema), createUser);

router.post('/set-password/:token', validate(setPasswordSchema),setPassword);

router.get('/all',getAllUsers);

router.post('/login',validate(loginSchema),loginUser);

router.get('/get/:id',getUserById);

router.delete('/delete/:id',deleteUser);

router.put('/update/:id', upload.single('profileImage'),validate(updateUserSchema) ,updateUser);

router.post('/forgot-password',validate(forgotPasswordSchema) ,forgotPassword);

router.post('/reset-password/:token',validate(resetPasswordSchema) ,resetpassword);

module.exports = router;