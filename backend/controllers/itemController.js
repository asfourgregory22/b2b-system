const Item = require("../models/itemModel");

exports.createItem = async (req,res) =>{
    try{
        const { sku, name, description, quantity, price } = req.body;
        

        if (!sku || !name || quantity === undefined || price === undefined) {
            return res.status(400).json({
                status: 'fail',
                message: 'Missing required fields: sku, name, quantity, and price are required'
            });
        }

        if (typeof quantity !== 'number' || quantity < 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Quantity must be a positive number'
            });
        }

        if (typeof price !== 'number' || price < 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Price must be a positive number'
            });
        }
        
        const existingItem = await Item.findOne({ sku });
        if (existingItem) {
            return res.status(400).json({
                status: 'fail',
                message: `Item with SKU "${sku}" already exists`
            });
        }
        
        const newItem = await Item.create({ sku, name, description, quantity, price });

        res.status(201).json({
            status : 'success',
            data : { item : newItem }
        });

    }catch(err){
        if (err.code === 11000) 
            return res.status(400).json({
                status: 'fail',
                message: 'Duplicate SKU value. Please use a unique SKU.'
            });
        }
        
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }


exports.getAllItems = async (req, res) => {
    try{
        const items = await Item.find({ isActive : true });

        if (items.length === 0){
            res.status(404).json({
                status : 'fail',
                message : 'No active items found'
            })
        }

        res.status(200).json({
            status : 'success',
            results : items.length,
            data : { items }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.getItem = async (req, res) => {
    try{
        const item = await Item.findById(req.params.id);

        if(!item){
            return res.status(404).json({
                status : 'fail',
                message : "No item found with that ID."
            });
        }

        res.status(200).json({
            status : 'success',
            data : { item }
        });
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.updateItem = async (req, res) => {
    try{
        const { name, description, quantity, price } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {name, description, quantity, price},
            { new : true,
              runValidators : true
            }
        );

        if(!updatedItem){
            return res.status(404).json({
                status : 'fail',
                message : "No item found with that ID."
            });
        }

        res.status(200).json({
            status : 'success',
            data : { item : updatedItem }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.deactivateItem = async (req, res) => {
    try{
        const deactivatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { isActive : false },
            { new : true }
        );

        if(!deactivatedItem){
            return res.status(404).json({
                status : 'fail',
                message : "No item found with that ID"
            });
        }

        res.status(200).json({
            status : 'success',
            data : { item : deactivatedItem }
        });


    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.activateItem = async (req, res) => {
    try{
        const activatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            { isActive: true },
            { new: true }
        );
        
        if(!deactivatedItem){
            return res.status(404).json({
                status : 'fail',
                message : "No item found with that ID"
            });
        }

        res.status(200).json({
            status : 'success',
            data : { item : activateItem }
        });        
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });         
    }
};