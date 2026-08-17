const Item = require("../models/itemModel");

exports.createItem = async (req,res) =>{
    try{
        const{ sku, name, description, quantity, price } = req.body;
        
        const newItem = await Item.create({ sku, name, description, quantity, price });

        res.status(201).json({
            status : 'success',
            data : { item : newItem }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};

exports.getAllItems = async (req, res) => {
    try{
        const items = await Item.find({ isActive : true });

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