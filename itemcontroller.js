const Item = require('../models/Item');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).array('itemImages', 10);

exports.createItem = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        const newItem = new Item({
            name: req.body.name,
            description: req.body.description,
            images: req.files.map(file => file.path),
            category: req.body.category,
            price: req.body.price,
            seller: req.body.seller
        });

        newItem.save()
            .then(item => res.status(201).json(item))
            .catch(error => res.status(500).json({ error: error.message }));
    });
};
