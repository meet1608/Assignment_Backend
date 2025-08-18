const express = require('express');
const router = express.Router();
const path = require("path");

const { getAllUsers ,getUserById,deleteUser,updateUser,updateUserByAdmin} = require('../controllers/userController.js');
const {createUser,setPassword,loginUser,forgotPassword,resetpassword} = require('../controllers/authcontroller.js');
const validate = require('../middleware/validate.js');
const { createUserSchema, setPasswordSchema, loginSchema, forgotPasswordSchema, updateUserSchema,resetPasswordSchema,objectIdSchema  } = require('../validations/userValidation.js');
const multer = require('multer');
const authenticateToken = require("../middleware/authMiddleware.js");
const authorizeRole = require("../middleware/roleAuth.js");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });


router.post('/create', upload.single('profileImage'),validate(createUserSchema), createUser);

router.post('/set-password/:token', validate(setPasswordSchema),setPassword);

router.get('/all',authenticateToken,authorizeRole(["admin"]),getAllUsers);

router.post('/login',validate(loginSchema),loginUser);

router.get('/get/:id',authenticateToken,authorizeRole(["user", "admin"]),getUserById);

router.delete('/delete/:id',authenticateToken,authorizeRole(["user", "admin"]),deleteUser);

router.put('/update/:id',authenticateToken ,authorizeRole(["user", "admin"]),upload.single('profileImage'),validate(updateUserSchema) ,updateUser);

router.post('/forgot-password',validate(forgotPasswordSchema) ,forgotPassword);

router.post('/reset-password/:token',validate(resetPasswordSchema) ,resetpassword);

router.put('/update-by-admin/:id',upload.single('profileImage'),authenticateToken,authorizeRole(["admin"]) ,updateUserByAdmin);



module.exports = router;