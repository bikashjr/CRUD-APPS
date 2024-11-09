const multer = require('multer');
const router = require('express').Router();
const User = require('../models/users');

// image upload 
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname)
    },
})

// middleware for upload image 
let upload = multer({
    storage: storage
}).single('image')

// to add a user in db 
router.post('/add', upload, async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            image: req.file.filename
        });
        const savedUser = await user.save();
        console.log(savedUser);

        if (savedUser) {
            req.session.message = {
                message: 'User Added Successfully',
                type: 'success'
            };
            res.redirect('/');
        }
    } catch (error) {
        req.session.message = {
            message: 'User not added. ' + error.message,
            type: 'danger'
        };
        res.redirect('/add');
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.render('index', { title: 'Home Page', users });
    } catch (err) {
        res.json({ message: err.message });
    }
});


router.get('/add', (req, res) => {
    res.render('add_users', { title: 'Add Users' })
})

module.exports = router;