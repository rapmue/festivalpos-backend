import { Request, Response } from 'express';
import DataSource from '../data-source';
import { VendorPoints } from '../entity/VendorPoint';
import { Product } from '../entity/Product';
import { In } from 'typeorm';
import VendorPointProductService from '../services/VendorPointProduct.service';
import { VendorPointProduct } from '../entity/VendorPointProducts';


const vendorPointRepository = DataSource.getRepository(VendorPoints);
const productRepository = DataSource.getRepository(Product);
const vendorPointProductRepository = DataSource.getRepository(VendorPointProduct);


export const getVendorPoints = async (req: Request, res: Response) => {
    try {
      const stands = await vendorPointRepository.find({ relations: ['vendorPointProducts', 'vendorPointProducts.product'] });
      res.json(stands);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const getVendorPointById = async (req: Request, res: Response) => {
    try {
      const stand = await vendorPointRepository.findOne({
        where: { id: req.params.id },
        relations: ['vendorPointProducts', 'vendorPointProducts.product'],
      });
      if (!stand) {
        return res.status(404).json({ message: 'Sales stand not found' });
      }
      res.json(stand);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const createVendorPoint = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const vendorPoint = vendorPointRepository.create({ name });
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
        return res.status(404).json({ message: 'Product does not exist at that vending point' });
      }
  
      await vendorPointProductRepository.remove(vendorPointProduct);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };


  export const addVendorPointProduct = async (req: Request, res: Response) => {
    try {
      const { productId, order } = req.body;
      const product = await productRepository.findOneBy({ id: productId });
      const vendorPoint = await vendorPointRepository.findOneBy({ id: req.params.id });
  
      if (!vendorPoint) {
        return res.status(404).json({ message: 'Vending point not found' });
      }
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      const existingRelation = await vendorPointProductRepository.findOne({
        where: { vendorPoint: { id: vendorPoint.id }, product: { id: product.id } },
      });
  
      if (existingRelation) {
        return res.status(400).json({ message: 'Product already exists at that vending point' });
      }
  
      const vendorPointProduct = vendorPointProductRepository.create({
        vendorPoint,
        product,
        order,
      });
  
      await vendorPointProductRepository.save(vendorPointProduct);
      res.json(vendorPointProduct);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };
  

  export const updateVendorPoint = async (req: Request, res: Response) => {
    try {
      const { name } = req.body;
      const vendorPoint = await vendorPointRepository.findOneBy({ id: req.params.id });
      if (!vendorPoint) {
        return res.status(404).json({ message: 'Sales stand not found' });
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
      const result = await vendorPointRepository.delete(req.params.id);
      if (result.affected === 0) {
        return res.status(404).json({ message: 'Sales stand not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

  export const updateVendorPointProductOrder = async (req: Request, res: Response) => {
    const vendorPointId = req.params.id;
    const productOrders = req.body.productOrders;  // Expecting an array of { productId, order }
  
    try {
      await VendorPointProductService.updateProductOrder(vendorPointId, productOrders);
      res.status(200).json({ message: 'Product order updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'An error occurred', error: (error as Error).message });
    }
  };