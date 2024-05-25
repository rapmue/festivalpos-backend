import { Request, Response } from 'express';
import DataSource from '../data-source';
import { Product } from '../entity/Product';
import { In } from 'typeorm';


const productRepository = DataSource.getRepository(Product);

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productRepository.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productRepository.findOne({
      where: { id: req.params.id }
    });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, tilecolor } = req.body;
    console.log(`New product: ${name}`)
    const product = productRepository.create({ name, price, tilecolor });
    await productRepository.save(product);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { name, price } = req.body;
    const product = await productRepository.findOneBy({ id: req.params.id });

    product.name = name;
    product.price = price;
    await productRepository.save(product);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await productRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
