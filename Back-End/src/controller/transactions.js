const Joi = require("joi");

const { User, Product, Transaction, Order } = require("../../models");

const errorResponse = {
    status: "Error",
    message: "Server Error"
};

exports.addTransaction = async (req, res) => {
    try {
        const { body } = req;

        //check if user order from the same partner
        let _products = [];
        
        for (let i = 0; i < body.orders.length; i++) {
            const orderedProducts = await Product.findOne({
                where: {
                    id: body.orders[i].id,
                }
            });
            console.log(orderedProducts);
            if (!orderedProducts) {
                res.status(404).send({
                    status: "Error",
                    message: `Product with id : ${body.orders[i].id} doesn't exist`
                })
            }

            _products.push(orderedProducts);
        }


        const partner = _products[0].UserId

        const checkPartner = _products.every(product => product.userId == partner);

        if (!checkPartner)
            return res.status(400).send({
                status: "failed add data",
                message: "The ordered products must from the same partner"
            });

    
        //create transaction
        const transaction = await Transaction.create({
            userId: req.userId.id,
            partnerId: _products[0].UserId,
            status: "waiting Approval",
            customerLoc: body.customerLoc,
            restaurantLoc: body.restaurantLoc,
            total: body.total,
            currentDate: body.currentDate
        });
    
        //find user order
        const userOrder = await User.findOne({
            where: {
                id: req.userId.id
            },
            attributes: {
                exclude: ["password", "image", "role", "createdAt", "updatedAt"]
            }
        });
        
        //automatically add userId and transaction id to order table
        const newInput = body.orders.map(product => {
            return {
                transactionId: transaction.id,
                userId: req.userId.id,
                productId: product.id,
                qty: product.qty
            }
        });
    
        //create all orders
        await Order.bulkCreate(newInput);
    
        // get ordered products
        const orders = [];
    
        for (let i = 0; i < body.orders.length; i++) {
            const getProduct = await Product.findOne({
                where: {
                    id: body.orders[i].id
                },
                attributes: {
                    exclude: ["userId", "UserId", "image", "createdAt", "updatedAt"],
                }
            });
    
            const productWithQty = {
                ...getProduct.dataValues,
                qty: body.orders[i].qty
            }
    
            orders.push(productWithQty);
        }
    
        res.send({
            status: "success",
            message: "Success Add New Transaction",
            data: {
                transaction: {
                    id: transaction.id,
                    userOrder,
                    status: transaction.status,
                    orders,
                }
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: "Server Error"
        });
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findOne({
            where: {
                id,
            }
        });

        //check who will delete the transaction
        if (transaction && transaction.userId !== req.userId.id)
            return res.status(401).send({
                status: "Error",
                message: "You haven't authorization to delete this transaction",
            });
        
        //delete transaction
        await Transaction.destroy({
            where: {
                id,
            }
        });

        res.send({
            status: "success",
            message: "Delete Successfully",
            data: {
                id
            }
        })

    } catch (error) {
        console.log(error);
        res.status(500).send(...errorResponse);
    }
}

exports.getTransactionsByPartnerId = async (req, res) => {
    try {
        const { partnerId } = req.params;
    
        //search transactions
        const getTransactions = await Transaction.findAll({
            where: {
                partnerId,
            },
            attributes: {
                exclude: ["UserId", "createdAt", "updatedAt"]
            }
        });

        if (!getTransactions[0])
            return res.status(404).send({
                status: "Error",
                message: "Transactions not found"
            });
        
        //check who will access the transaction
        if (getTransactions && getTransactions[0].partnerId != req.userId.id)
            return res.status(401).send({
                status: "Error",
                message: "You haven't authorization to access this transaction",
            });
    
        //get orders by partner
        const usersOrder = [];
        
            for (let a = 0; a < getTransactions.length; a++) {
                const getUsers = await User.findOne({
                    where: {
                        id: getTransactions[a].userId
                    },
                    attributes: {
                        exclude: ["image", "location","password", "email", "phone", "role", "createdAt", "updatedAt"],
                    },
                });
        
                usersOrder.push(getUsers);
        }
        
        //get orders by partner
        const ordersByPartner = [];
        
            for (let i = 0; i < getTransactions.length; i++) {
                const getOrders = await Order.findAll({
                    where: {
                        transactionId: getTransactions[i].id
                    }
                });
        
                ordersByPartner.push(getOrders);
            }
        
        // get all ordered product
        const allProduct = [];
    
        for (let i = 0; i < ordersByPartner.length; i++) {
            allProduct[i] = []
            for (let x = 0; x < ordersByPartner[i].length; x++) {
                const getProducts = await Product.findOne({
                    where: {
                        id: ordersByPartner[i][x].productId
                    },
                    attributes: {
                        exclude: ["userId", "UserId", "image", "createdAt", "updatedAt"],
                    }
                });
                const productWithQty = {
                    ...getProducts.dataValues,
                    qty: ordersByPartner[i][x].qty
                }
        
                allProduct[i].push(productWithQty);
            }
        }
    
        // response
        let transactions = [];
    
        for (let i = 0; i < getTransactions.length; i++) {
            const newTransaction = {
                ...getTransactions[i].dataValues,
                customer: usersOrder[i],
                orders: allProduct[i]
            }
            
            transactions.push(newTransaction);
        }
    
        res.send({
            status: "success",
            data: {
                transactions
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(...errorResponse);
    }
}

exports.getDetailTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        //search transaction 
        const transactionSelected = await Transaction.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["UserId", "createdAt", "updatedAt"]
            }
        });

        if (!transactionSelected)
            return res.status(404).send({
                status: "Error",
                message: "Transactions not found"
            });

        //check user who edited has authorization
        if (transactionSelected.userId !== req.userId.id && transactionSelected.partnerId !== req.userId.id)
            return res.send({
                status: "Error",
                message: "You haven't authorization to access this."
            });
        
        //get userOrder
        const userOrder = await User.findOne({
            where: {
                id: transactionSelected.userId,
            },
            attributes: {
                exclude: ["password", "image", "role", "createdAt", "updatedAt"]
            }
        })
        
        //get the orders
        const getOrders = await Order.findAll({
            where: {
                transactionId: transactionSelected.id
            }
        });

        //get ordered product
        let products = [];
        for (let i = 0; i < getOrders.length; i++) {
            const getProduct = await Product.findOne({
                where: {
                    id: getOrders[i].productId,
                },
                attributes: {
                    exclude: ["userId", "UserId", "image", "createdAt", "updatedAt"],
                }
            });

            const modifiedProduct = {
                ...getProduct.dataValues,
                qty: getOrders[i].qty
            }

            products.push(modifiedProduct)
        }

        //respose output
        const transaction = {
            id: transactionSelected.id,
            userOrder,
            status: transactionSelected.status,
            order: products,
        }
        res.send({
            status: "success",
            data: {
                transaction
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(...errorResponse);
    }
}

exports.editTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { body } = req;

        //search transaction 
        const transactionSelected = await Transaction.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["UserId", "createdAt", "updatedAt"]
            }
        });
        
        if (!transactionSelected)
            return res.status(404).send({
                status: "Error",
                message: "Transactions not found"
            });

        const changeStatus = {
            status: body.status
        };

        //update 
        await Transaction.update(changeStatus, {
            where: {
                id,
            },
        })
            
        //get userOrder
        const userOrder = await User.findOne({
            where: {
                id: transactionSelected.userId,
            },
            attributes: {
                exclude: ["password", "image", "role", "createdAt", "updatedAt"]
            }
        })
        
        //get the orders
        const getOrders = await Order.findAll({
            where: {
                transactionId: transactionSelected.id
            }
        });

        //get ordered product
        let products = [];
        for (let i = 0; i < getOrders.length; i++) {
            const getProduct = await Product.findOne({
                where: {
                    id: getOrders[i].productId,
                },
                attributes: {
                    exclude: ["userId", "UserId", "image", "createdAt", "updatedAt"],
                }
            });

            const modifiedProduct = {
                ...getProduct.dataValues,
                qty: getOrders[i].qty
            }

            products.push(modifiedProduct)
        }

        //respose output
        const transaction = {
            id: transactionSelected.id,
            userOrder,
            status: body.status,
            order: products,
        }

        res.send({
            status: "success",
            data: {
                transaction
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send(...errorResponse);
    }
}

exports.getMyTransactions = async (req, res) => {
    try {
        const userId = req.userId.id;
    
        //search transactions
        const getTransactions = await Transaction.findAll({
            where: {
                userId,
            },
            attributes: {
                exclude: ["userId", "UserId", "createdAt", "updatedAt"]
            },
            order: [
                ['updatedAt', 'DESC']
            ]
        });

        //find partner 
        let restaurants = [];
        for (let a = 0; a < getTransactions.length; a++) {
            const restaurant = await User.findOne({
                where: {
                    id: getTransactions[a].partnerId
                },
                attributes: {
                    exclude: ["id", "role", "phone", "email", "password", "createdAt", "updatedAt"]
                }
            });
            const restaurantImg = {
                ...restaurant.dataValues,
                image: process.env.IMG_URL + restaurant.image
            }
            restaurants.push(restaurantImg);
        }

        if (!getTransactions)
            return res.status(404).send({
                status: "Error",
                message: "Transactions not found"
            });
    
        //get orders by user
        const ordersByUser = [];
        
            for (let i = 0; i < getTransactions.length; i++) {
                const getOrders = await Order.findAll({
                    where: {
                        transactionId: getTransactions[i].id
                    }
                });
        
                ordersByUser.push(getOrders);
            }
        
        // get all ordered product
        let allProduct = [];
    
        for (let i = 0; i < ordersByUser.length; i++) {
            allProduct[i] = []
            for (let x = 0; x < ordersByUser[i].length; x++) {
                const getProducts = await Product.findOne({
                    where: {
                        id: ordersByUser[i][x].productId
                    },
                    attributes: {
                        exclude: ["userId", "UserId", "image", "createdAt", "updatedAt"],
                    }
                });
                const productWithQty = {
                    ...getProducts.dataValues,
                    qty: ordersByUser[i][x].qty
                }
        
                allProduct[i].push(productWithQty);
            }
        }
    
        // response
        let transactions = [];
    
        for (let i = 0; i < getTransactions.length; i++) {
            const newTransaction = {
                    ...getTransactions[i].dataValues,
                    restaurant: restaurants[i],
                    order: allProduct[i]
            }
            
            transactions.push(newTransaction);
        }
    
        res.send({
            status: "success",
            data: {
                transactions
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send(...errorResponse);
    }
}