import * as express from "express";
import { addVendorPointProduct, createVendorPoint, deleteVendorPoint, getVendorPointById, getVendorPointProducts, getVendorPoints, removeVendorPointProduct, updateVendorPoint, updateVendorPointProductOrder } from "../controllers/vendorPoint.controller";
import { wellcome } from "../controllers/index.controller";
import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from "../controllers/product.controller";
import { authentification } from "../middleware/auth.middleware";

const router = express.Router();
router.get('/', wellcome);
router.get('/pos/vendor-point/:id', getVendorPointProducts);

export { router as publicApiRouter };