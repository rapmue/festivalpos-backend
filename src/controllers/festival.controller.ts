import { Request, Response } from "express";
import DataSource from "../data-source";
import { Festival } from "../entity/Festival";

const festivalRepository = DataSource.getRepository(Festival);

export const getFestivals = async (req: Request, res: Response) => {
  try {
    const festivals = await festivalRepository.find();
    res.json(festivals);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getFestivalById = async (req: Request, res: Response) => {
  try {
    const festival = await festivalRepository.findOne({
      where: { id: req.params.id },
      relations: ["products", "vendorPoints", "sales"],
    });
    if (!festival) {
      return res.status(404).json({ message: "Festival not found" });
    }
    res.json(festival);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createFestival = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const festival = festivalRepository.create({ name });
    await festivalRepository.save(festival);
    res.status(201).json(festival);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateFestival = async (req: Request, res: Response) => {
  try {
    const { name, save_sales } = req.body;
    const festival = await festivalRepository.findOneBy({ id: req.params.id });
    if (!festival) {
      return res.status(404).json({ message: "Festival not found" });
    }
    festival.name = name;
    festival.save_sales = save_sales;
    await festivalRepository.save(festival);
    res.json(festival);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteFestival = async (req: Request, res: Response) => {
  try {
    const result = await festivalRepository.delete(req.params.id);
    if (result.affected === 0) {
      return res.status(404).json({ message: "Festival not found" });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
