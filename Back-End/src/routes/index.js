const express = require("express");

const router = express.Router();

//Auth middleware
const { authentication } = require("../middleware/Auth");
const { partnerAuth, userAuth } = require("../middleware/roleAuth");
const { uploadImageFile } = require("../middleware/uploadImage");

//auth route
const { userRegister, userLogin, checkAuth } = require("../controller/auth");
router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/is-auth", authentication, checkAuth);


//users
const {
    getAllUsers,
    getUserById,
    getAllUsersPartner,
    deleteUser,
    editUser
    } = require('../controller/users');

    router.get("/users", getAllUsers);
    router.get("/partners", getAllUsersPartner);
    router.get("/user", authentication, getUserById);
    router.delete("/user/:id", authentication, deleteUser);
    router.patch("/user/:id", authentication, uploadImageFile("image"), editUser);

//products
const {
    getAllProducts,
    getAllProductsByPartnerId,
    getDetailProduct,
    addNewProduct,
    editProduct,
    deleteProduct,
        } = require('../controller/products');

router.get("/products", getAllProducts);
router.get("/products/:userId", authentication, getAllProductsByPartnerId);
router.get("/product/:id", getDetailProduct);
router.post("/product", authentication, partnerAuth, uploadImageFile("image", false), addNewProduct);
router.patch("/product/:productId", authentication, partnerAuth, uploadImageFile("image", true), editProduct);
router.delete("/product/:productId", authentication, partnerAuth, deleteProduct);

//transactions
const { addTransaction,
        deleteTransaction,
        getTransactionsByPartnerId,
        getDetailTransaction,
        editTransaction,
        getMyTransactions,
            } = require("../controller/transactions");

router.post("/transaction", authentication, userAuth, addTransaction);
router.delete("/transaction/:id", authentication, deleteTransaction);
router.get("/transactions/:partnerId", authentication, partnerAuth, getTransactionsByPartnerId);
router.get("/transaction/:id", authentication, getDetailTransaction);
router.patch("/transaction/:id", authentication, editTransaction);
router.get("/my-transactions", authentication, userAuth, getMyTransactions);

module.exports = router;