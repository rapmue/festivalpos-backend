import * as express from "express";
import { addVendorPointProduct, createVendorPoint, deleteVendorPoint, getVendorPointById, getVendorPoints, removeVendorPointProduct, updateVendorPoint, updateVendorPointProductOrder } from "../controllers/vendorPoint.controller";
import { wellcome } from "../controllers/index.controller";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";

const router = express.Router();

router.get('/', wellcome)

router.post('/vendor-point/:id/product', addVendorPointProduct);
router.delete('/vendor-point/:id/product/:pid', removeVendorPointProduct);
router.put('/vendor-point/:id/product/order', updateVendorPointProductOrder);
router.get('/vendor-points', getVendorPoints);
router.get('/vendor-point/:id', getVendorPointById);
router.post('/vendor-point', createVendorPoint);
router.put('/vendor-point/:id', updateVendorPoint);
router.delete('/vendor-point/:id', deleteVendorPoint);

router.get('/products', getProducts);
router.get('/product/:id', getProductById);
router.post('/product', createProduct);
router.put('/product/:id', updateProduct);
router.delete('/product/:id', deleteProduct)

export { router as apiRouter };