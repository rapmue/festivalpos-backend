import { Request, Response } from "express";
import DataSource from "../data-source";
import { VendorPoints } from "../entity/VendorPoint";
import { Product } from "../entity/Product";
import { In } from "typeorm";
import VendorPointProductService from "../services/VendorPointProduct.service";
import { VendorPointProduct } from "../entity/VendorPointProducts";
import { Festival } from "../entity/Festival";

const vendorPointRepository = DataSource.getRepository(VendorPoints);
const productRepository = DataSource.getRepository(Product);
const vendorPointProductRepository =
  DataSource.getRepository(VendorPointProduct);

export const getVendorPoints = async (req: Request, res: Response) => {
  try {
    const stands = await vendorPointRepository.find({
      relations: ["vendorPointProducts", "vendorPointProducts.product"],
      where: { festival: { id: req.params.fid } },
    });
    res.json(stands);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getVendorPointByIdforFestivalPOSRN = async (
  req: Request,
  res: Response,
) => {
  try {
    const stand = await vendorPointRepository.findOne({
      where: { id: req.params.id },
      relations: [
        "vendorPointProducts",
        "vendorPointProducts.product",
        "festival",
      ],
    });
    if (!stand) {
      return res.status(404).json({ message: "POS not found" });
    }

    // Map through the vendorPointProducts array and modify product object to include order
    const productsWithOrder = stand.vendorPointProducts.map((item) => {
      // Ensure the price is converted to a number
      const productWithOrder = {
        ...item.product,
        price: Number(item.product.price),
        order: item.order,
      };

      return productWithOrder;
    });

    // Respond with the name of the stand and the list of products
    return res.json({
      id: stand.id,
      name: stand.name,
      festival: stand.festival.name,
      save_sales: stand.festival.save_sales,
      products: productsWithOrder,
    });
  } catch (error) {
    console.error("Failed to fetch vendor point products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVendorPointById = async (req: Request, res: Response) => {
  try {
    const stand = await vendorPointRepository.findOne({
      where: { id: req.params.id },
      relations: ["vendorPointProducts", "vendorPointProducts.product"],
    });
    if (!stand) {
      return res.status(404).json({ message: "POS not found" });
    }

    // Respond with the name of the stand and the list of products
    return res.json(stand);
  } catch (error) {
    console.error("Failed to fetch vendor point products:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getVendorPointProducts = async (req: Request, res: Response) => {
  try {
    const stand = await vendorPointRepository.findOne({
      where: { id: req.params.id },
      relations: ["vendorPointProducts", "vendorPointProducts.product"],
    });
    if (!stand) {
      return res.status(404).json({ message: "POS not found" });
    }

    // Map through the vendorPointProducts array and modify product object to include order
    const productsWithOrder = stand.vendorPointProducts.map((item) => {
      // Ensure the price is converted to a number
      const productWithOrder = {
        ...item.product,
        price: Number(item.product.price),
        order: item.order,
      };

      return productWithOrder;
    });

    res.json(productsWithOrder);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createVendorPoint = async (req: Request, res: Response) => {
  try {
    const { name, festival_id } = req.body;
    const vendorPoint = vendorPointRepository.create({
      name: name,
      festival: { id: festival_id },
    });
    await vendorPointRepository.save(vendorPoint);
    res.status(201).json(vendorPoint);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const removeVendorPointProduct = async (req: Request, res: Response) => {
  try {
    const productId = req.params.pid;
    const vendorPointProduct = await vendorPointProductRepository.findOne({
      where: { vendorPoint: { id: req.params.id }, product: { id: productId } },
    });

    if (!vendorPointProduct) {
      return res
        .status(404)
        .json({ message: "Product does not exist at that vending point" });
    }

    const orderToRemove = vendorPointProduct.order;

    await vendorPointProductRepository.softRemove(vendorPointProduct);

    // Update the order of all subsequent vendorPointProducts
    await vendorPointProductRepository
      .createQueryBuilder()
      .update(VendorPointProduct)
      .set({ order: () => `"order" - 1` })
      .where('vendorPointId = :vendorPointId AND "order" > :order', {
        vendorPointId: req.params.id,
        order: orderToRemove,
      })
      .execute();

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const addVendorPointProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const product = await productRepository.findOne({
      where: { id: productId },
    });
    const vendorPoint = await vendorPointRepository.findOne({
      where: { id: req.params.id },
    });

    if (!vendorPoint) {
      return res.status(404).json({ message: "Vending point not found" });
    }
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check for existing relation including soft-deleted ones
    const existingRelation = await vendorPointProductRepository.findOne({
      where: {
        vendorPoint: { id: vendorPoint.id },
        product: { id: product.id },
      },
      withDeleted: true, // Include soft-deleted entries in the query
    });

    if (existingRelation) {
      if (existingRelation.deletedAt) {
        // Restore soft-deleted record
        existingRelation.deletedAt = null;
        // Find the highest order value for the given vendor point
        const highestOrder = await vendorPointProductRepository
          .createQueryBuilder("vendorPointProduct")
          .where("vendorPointProduct.vendorPointId = :vendorPointId", {
            vendorPointId: vendorPoint.id,
          })
          .select("MAX(vendorPointProduct.order)", "maxOrder")
          .getRawOne();

        existingRelation.order = (highestOrder.maxOrder || 0) + 1;
        await vendorPointProductRepository.save(existingRelation);
        return res.json(existingRelation);
      } else {
        return res
          .status(400)
          .json({ message: "Product already exists at that vending point" });
      }
    }

    // Find the highest order value for the given vendor point
    const highestOrder = await vendorPointProductRepository
      .createQueryBuilder("vendorPointProduct")
      .where("vendorPointProduct.vendorPointId = :vendorPointId", {
        vendorPointId: vendorPoint.id,
      })
      .select("MAX(vendorPointProduct.order)", "maxOrder")
      .getRawOne();

    const newOrder = (highestOrder.maxOrder || 0) + 1;

    const vendorPointProduct = vendorPointProductRepository.create({
      vendorPoint,
      product,
      order: newOrder,
    });

    await vendorPointProductRepository.save(vendorPointProduct);
    res.json(vendorPointProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateVendorPoint = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const vendorPoint = await vendorPointRepository.findOneBy({
      id: req.params.id,
    });
    if (!vendorPoint) {
      return res.status(404).json({ message: "Sales stand not found" });
    }
    vendorPoint.name = name;
    await vendorPointRepository.save(vendorPoint);
    res.json(vendorPoint);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteVendorPoint = async (req: Request, res: Response) => {
  try {
    const vendorPoint = await vendorPointRepository.findOne({
      where: { id: req.params.id },
      relations: ["sales", "sales.saleItems", "vendorPointProducts"],
    });

    if (!vendorPoint) {
      return res.status(404).json({ message: "Sales stand not found" });
    }

    await vendorPointRepository.softRemove(vendorPoint);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const moveProductUp = async (req: Request, res: Response) => {
  const vendorPointId = req.params.vid;
  const productId = req.params.pid;

  console.log("Move up");

  try {
    const vendorPointProduct = await vendorPointProductRepository.findOne({
      where: { vendorPoint: { id: vendorPointId }, product: { id: productId } },
    });

    if (!vendorPointProduct) {
      return res
        .status(404)
        .json({ message: "Product not found at the vending point" });
    }

    const previousProduct = await vendorPointProductRepository.findOne({
      where: {
        vendorPoint: { id: vendorPointId },
        order: vendorPointProduct.order - 1,
      },
    });

    if (!previousProduct) {
      console.log("Product already at the top");
      return res.status(400).json({ message: "Product is already at the top" });
    }

    // Swap orders
    [vendorPointProduct.order, previousProduct.order] = [
      previousProduct.order,
      vendorPointProduct.order,
    ];

    await vendorPointProductRepository.save([
      vendorPointProduct,
      previousProduct,
    ]);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const moveProductDown = async (req: Request, res: Response) => {
  const vendorPointId = req.params.vid;
  const productId = req.params.pid;

  console.log("Move down");
  try {
    const vendorPointProduct = await vendorPointProductRepository.findOne({
      where: { vendorPoint: { id: vendorPointId }, product: { id: productId } },
    });

    if (!vendorPointProduct) {
      return res
        .status(404)
        .json({ message: "Product not found at the vending point" });
    }

    const nextProduct = await vendorPointProductRepository.findOne({
      where: {
        vendorPoint: { id: vendorPointId },
        order: vendorPointProduct.order + 1,
      },
    });

    if (!nextProduct) {
      console.log("Product already at the bottom");
      return res
        .status(400)
        .json({ message: "Product is already at the bottom" });
    }

    // Swap orders
    [vendorPointProduct.order, nextProduct.order] = [
      nextProduct.order,
      vendorPointProduct.order,
    ];

    await vendorPointProductRepository.save([vendorPointProduct, nextProduct]);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};
