import { Request, Response } from "express";
import DataSource from "../data-source";
import { Sale } from "../entity/Sale";
import { SaleItem } from "../entity/SaleItem";
import { VendorPoints } from "../entity/VendorPoint";
import { Product } from "../entity/Product";

const saleRepository = DataSource.getRepository(Sale);

export const createSale = async (req: Request, res: Response) => {
  console.log(req.body);
  const dataSource = DataSource;
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const saleRepository = queryRunner.manager.getRepository(Sale);
    const saleItemRepository = queryRunner.manager.getRepository(SaleItem);
    const productRepository = queryRunner.manager.getRepository(Product);

    // Fetching the VendorPoints entity
    const vendorPoint = await queryRunner.manager.findOne(VendorPoints, {
      where: { id: req.body.vendorPointId },
      relations: ["festival"],
    });
    if (!vendorPoint) {
      throw new Error("Vendor point not found");
    }

    // Check if the corresponding festival's save_sales is true
    if (!vendorPoint.festival.save_sales) {
      return res
        .status(403)
        .json({ message: "Sales creation is disabled for this festival" });
    }

    const saleData = {
      vendorPoint: vendorPoint,
      saleDate: req.body.saleDate,
    };
    const sale = saleRepository.create(saleData);
    const savedSale = await saleRepository.save(sale);

    if (req.body.saleItems && req.body.saleItems.length > 0) {
      for (const item of req.body.saleItems) {
        // Fetching the Product entity based on productId
        const product = await productRepository.findOne({
          where: { id: item.productId },
        });
        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        const saleItemData = {
          product: product,
          quantity: item.quantity,
          sellingPrice: item.sellingPrice,
          sale: savedSale,
        };
        const saleItem = saleItemRepository.create(saleItemData);
        await saleItemRepository.save(saleItem);
      }
    }

    await queryRunner.commitTransaction();
    res.status(201).json(savedSale);
  } catch (error) {
    console.error("Failed to create sale:", error);
    await queryRunner.rollbackTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    await queryRunner.release();
  }
};

export const getSaleById = async (req: Request, res: Response) => {
  try {
    const sale = await saleRepository.findOne({
      where: { id: req.params.id },
      relations: ["saleItems"],
    });
    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }
    res.json(sale);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  try {
    const sale = await saleRepository.findOne({
      where: { id: req.params.id },
      relations: ["saleItems"],
    });

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    await saleRepository.softRemove(sale);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
