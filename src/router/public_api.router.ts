import * as express from "express";
import { wellcome } from "../controllers/index.controller";
import {  getVendorPointByIdforFestivalPOSRN } from "../controllers/vendorPoint.controller";
import { createSale } from "../controllers/sale.controller";

const router = express.Router();
router.get('/', wellcome);
router.get('/pos/vendor-point/:id', getVendorPointByIdforFestivalPOSRN);
router.post('/pos/sale', createSale);

export { router as publicApiRouter };