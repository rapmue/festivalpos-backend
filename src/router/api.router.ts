import * as express from "express";
import {
  addVendorPointProduct,
  createVendorPoint,
  deleteVendorPoint,
  getVendorPointById,
  getVendorPoints,
  moveProductDown,
  moveProductUp,
  removeVendorPointProduct,
  updateVendorPoint,
} from "../controllers/vendorPoint.controller";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authentification } from "../middleware/auth.middleware";
import {
  createFestival,
  deleteFestival,
  getFestivalById,
  getFestivals,
  updateFestival,
} from "../controllers/festival.controller";

const router = express.Router();

// Routes with authentication and cors
router.get("/festivals", authentification, getFestivals);
router.get("/festival/:id", authentification, getFestivalById);
router.post("/festival", authentification, createFestival);
router.put("/festival/:id", authentification, updateFestival);
router.delete("/festival/:id", authentification, deleteFestival);

router.post(
  "/vendor-point/:id/product",
  authentification,
  addVendorPointProduct,
);
router.delete(
  "/vendor-point/:id/product/:pid",
  authentification,
  removeVendorPointProduct,
);
router.put(
  "/vendor-point/:vid/product/:pid/move-up",
  authentification,
  moveProductUp,
);
router.put(
  "/vendor-point/:vid/product/:pid/move-down",
  authentification,
  moveProductDown,
);
router.get("/vendor-points/:fid", authentification, getVendorPoints);
router.get("/vendor-point/:id", authentification, getVendorPointById);
router.post("/vendor-point", authentification, createVendorPoint);
router.put("/vendor-point/:id", authentification, updateVendorPoint);
router.delete("/vendor-point/:id", authentification, deleteVendorPoint);

router.get("/products/:fid", authentification, getProducts);
router.get("/product/:id", authentification, getProductById);
router.post("/product", authentification, createProduct);
router.put("/product/:id", authentification, updateProduct);
router.delete("/product/:id", authentification, deleteProduct);

export { router as apiRouter };
