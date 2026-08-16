const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Item = require("../models/itemModel");

exports.submitOrder = async (req,res) => {
    try{
        const { customerId , items } = req.body;

        let totalAmount = 0 ;
        const orderItemsData = [];

        for(const line of items){
            const item = await Item.findById(line.itemId);

            if(!item){
                return res.status(404).json({
                    status : 'fail',
                    message : `No item found with ID ${line.itemId}`
                });
            }

            totalAmount += item.price * line.quantity;

            orderItemsData.push({
                itemId : item._id,
                quantity : line.quantity,
                priceAtOrder : item.price
            });
        }

        const newOrder = await Order.create({
            customerId,
            salesmanId : req.user.role === 'salesman' ? req.user._id : undefined,
            submittedBy : req.user._id,
            submittedByModel : 'User',
            totalAmount
        });

        const orderItems = await Promise.all(
            orderItemsData.map(data =>
                OrderItem.create({...data, orderId : newOrder._id })
            )
        );

        res.status(201).json({
            status : 'success',
            data : {
                order : newOrder,
                items : orderItems
            }
        });
    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};