import { getRepository } from 'typeorm';
import { VendorPointProduct } from '../entity/VendorPointProducts';
import dataSource from '../data-source';

class ProductService {
  async updateProductOrder(vendorPointId: string, productOrders: { productId: string, order: number }[]) {
    const vendorPointProductRepository = dataSource.getRepository(VendorPointProduct);

    for (const productOrder of productOrders) {
      let vendorPointProduct = await vendorPointProductRepository.findOne({
        where: { vendorPoint: { id: vendorPointId }, product: { id: productOrder.productId } }
      });

      if (vendorPointProduct) {
        // Update the existing record
        vendorPointProduct.order = productOrder.order;
      } else {
        // Create a new record
        vendorPointProduct = vendorPointProductRepository.create({
          vendorPoint: { id: vendorPointId },
          product: { id: productOrder.productId },
          order: productOrder.order
        });
      }

      await vendorPointProductRepository.save(vendorPointProduct);
    }
  }
}

export default new ProductService();
