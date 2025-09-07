import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 4000;

const prisma = new PrismaClient();

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hola mundo desde el backend' });
});

// Products API
app.get('/products', async (_req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

app.post('/products', async (req, res) => {
  try {
    const { name, description, price } = req.body as {
      name?: string; description?: string; price?: number | string;
    };
    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const trimmedDescription = typeof description === 'string' ? description.trim() : '';
    if (!trimmedName || !trimmedDescription || price === undefined || price === null) {
      return res.status(400).json({ error: 'name, description y price son requeridos' });
    }
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({ error: 'price debe ser numérico' });
    }
    if (numericPrice <= 0) {
      return res.status(400).json({ error: 'price debe ser mayor que 0' });
    }
    if (trimmedName.length > 255) {
      return res.status(400).json({ error: 'name no puede exceder 255 caracteres' });
    }
    const created = await prisma.product.create({
      data: { name: trimmedName, description: trimmedDescription, price: numericPrice }
    });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: 'id inválido' });
    }
    await prisma.product.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    return res.status(404).json({ error: 'Producto no encontrado' });
  }
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend escuchando en puerto ${port}`);
});


