const Joi = require("joi");
const { User, Product } = require("../../models");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            }
        });

        const usersString = JSON.stringify(users);
        const usersObj = JSON.parse(usersString);

        const usersModified = usersObj.map(user => {
            return {
                ...user,
                image: process.env.IMG_URL + user.image
            }
        })

        res.send({
            status: "success",
            message: "Success to Get All Users",
            data: {
                users: usersModified
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: "Server Error",
        })
    }
}

exports.getUserById = async (req, res) => {
    try {
        const { id } = req.userId
        
        const user = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            }
        });

        const userModified = {
            ...user.dataValues,
            image: process.env.IMG_URL + user.image
        }

        res.send({
            status: "success",
            message: "Success to Get All Users",
            data: {
                user: userModified
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: "Server Error",
        })
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const userSelected = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["role", "password", "createdAt", "updatedAt"]
            }
        });

        //check if user exist
        if (!userSelected) 
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
            
        //check user
        if (userSelected && userSelected.id !== req.userId.id)
            return res.status(403).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });
    
        await User.destroy({
            where: {
                id,
            },
        });
    
        res.send({
            status: "success",
            data: {
                id,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.editUser = async (req, res) => {
    try {
        const { id } = req.params;

        //search user
        const userSelected = await User.findOne({
            where: {
                id,
            },
            attributes: {
                exclude: ["role", "password", "createdAt", "updatedAt"]
            }
        });

        //check if user exist
        if (!userSelected) 
            return res.status(404).send({
                status: "Error",
                message: "User doesn't exist",
            });
            
        //check user
        if (userSelected && userSelected.id !== req.userId.id)
            return res.status(402).send({
                status: "Error",
                message: "You haven't authorization for edit this user"
            });

        let newImage;

        if (req.files.image === undefined) {
            newImage = userSelected.image;
        } else {
            newImage = req.files.image[0].filename;
        }

        const userUpdated = {
            ...req.body,
            image: newImage
        }

        await User.update(userUpdated, {
            where: {
                id
            }
        });

        res.send({
            status: "success",
            message: "Update Success",
            data: {
                dataUpdated : userUpdated
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "error",
            message: "Server Error",
        });
    }
}

exports.getAllUsersPartner = async (req, res) => {
    try {
        let partners = []
        const users = await User.findAll({
            where: {
                role: "partner"
            },
            attributes: {
                exclude: ["password", "createdAt", "updatedAt"],
            }
        });

        for (let i = 0; i < users.length; i++) {
            const getProducts = await Product.findAll({
                where: {
                    userId: users[i].id
                },
                attributes: {
                    exclude: ["UserId", "created_at", "updated_at", "createdAt", "updatedAt"]
                }
            });

            if (getProducts[0]) {
                const modified = {
                    ...users[i].dataValues,
                    image: process.env.IMG_URL + users[i].image, 
                    products: {
                        ...getProducts[0].dataValues,
                        image: process.env.IMG_URL + getProducts[0].image
                    }
                }
                partners.push(modified);
            } else {
                const modified = {
                    ...users[i].dataValues,
                    image: process.env.IMG_URL + users[i].image, 
                    products: null
                }
                partners.push(modified);
            }

        }

        res.send({
            status: "success",
            message: "Success to Get All Users Partner",
            data: {
                users: partners
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            status: "Error",
            message: "Server Error",
        })
    }
}