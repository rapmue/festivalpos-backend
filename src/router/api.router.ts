import * as express from "express";
import { addVendorPointProduct, createVendorPoint, deleteVendorPoint, getVendorPointById, getVendorPointProducts, getVendorPoints, removeVendorPointProduct, updateVendorPoint, updateVendorPointProductOrder } from "../controllers/vendorPoint.controller";
import { wellcome } from "../controllers/index.controller";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";
import { authentification } from "../middleware/auth.middleware";

const router = express.Router();

// Routes with authentication and cors
router.post('/vendor-point/:id/product', authentification, addVendorPointProduct);
router.delete('/vendor-point/:id/product/:pid', authentification, removeVendorPointProduct);
router.put('/vendor-point/:id/product/order', authentification, updateVendorPointProductOrder);
router.get('/vendor-points', authentification, getVendorPoints);
router.get('/vendor-point/:id', authentification, getVendorPointById);
router.post('/vendor-point', authentification, createVendorPoint);
router.put('/vendor-point/:id', authentification, updateVendorPoint);
router.delete('/vendor-point/:id', authentification, deleteVendorPoint);

router.get('/products', authentification, getProducts);
router.get('/product/:id', authentification, getProductById);
router.post('/product', authentification, createProduct);
router.put('/product/:id', authentification, updateProduct);
router.delete('/product/:id', authentification, deleteProduct)

export { router as apiRouter };