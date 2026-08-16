const Order = require("../models/orderModel");
const OrderItem = require("../models/orderItemModel");
const Item = require("../models/itemModel");
const Transaction = require('../models/transactionModel');

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

exports.approveOrder = async (req,res) => {
    try{
        const order = await Order.findById(req.params.id);
      
        if(!order){
            return res.status(404).json({
                status : 'fail',
                message : "No order found with that ID."
            });
        }

        if(order.status !== 'pending_approval'){
            return res.status(400).json({
                status : 'fail',
                message : `This order has already been ${order.status}`
            });
        }

        const orderItems = await OrderItem.find({ orderId : order._id });

        for(const line of orderItems){
            const item = await Item.findById(line.itemId);

            if(!item || item.quantity < line.quantity ){
                return res.status(400).json({
                    status : 'fail',
                    message : `Insuffiecient stock for item ${ line.itemId }`
                });
            }
        }

        for( const line of orderItems ){
            await Item.findByIdAndUpdate(line.itemId, { $inc: { quantity : -line.quantity } });
        }

        await Transaction.create({
            customerId : order.customerId,
            orderId : order._id,
            type : 'debit',
            amount : order.totalAmount,
            recordedBy : req.user._id
        });

        order.status = 'approved';
        await order.save();

        res.status(200).json({
            status : 'success',
            data : { order }
        });

    }catch(err){
        res.status(400).json({
            status : 'fail',
            message : err.message
        });
    }
};