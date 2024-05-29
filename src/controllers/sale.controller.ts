import { Request, Response } from 'express';
import DataSource from '../data-source';
import { Sale } from '../entity/Sale';
import { SaleItem } from '../entity/SaleItem';

const saleRepository = DataSource.getRepository(Sale);

export const createSale = async (req: Request, res: Response) => {
    const dataSource = DataSource;
    const queryRunner = dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        const saleRepository = queryRunner.manager.getRepository(Sale);
        const saleItemRepository = queryRunner.manager.getRepository(SaleItem);

        const sale = saleRepository.create(req.body.sale);
        const savedSale = await saleRepository.save(sale);

        if (req.body.saleItems && req.body.saleItems.length > 0) {
            for (const item of req.body.saleItems) {
                const saleItem = saleItemRepository.create({
                    ...item,
                    sale: savedSale
                });
                await saleItemRepository.save(saleItem);
            }
        }

        await queryRunner.commitTransaction();
        res.status(201).json(savedSale);
    } catch (error) {
        await queryRunner.rollbackTransaction();
        res.status(500).json({ message: (error as Error).message });
    } finally {
        await queryRunner.release();
    }
};

export const getSaleById = async (req: Request, res: Response) => {
    try {
        const sale = await saleRepository.findOne({
            where: { id: req.params.id },
            relations: ["saleItems"]
        });
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.json(sale);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

export const deleteSale = async (req: Request, res: Response) => {
    try {
        const result = await saleRepository.delete(req.params.id);
        if (result.affected === 0) {
            return res.status(404).json({ message: 'Sale not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};
