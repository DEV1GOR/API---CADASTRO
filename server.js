import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();
app.use(express.json());

// Rota para criar um usuário
app.post('/usuarios', async (req, res) => {
  const { name, email, age } = req.body;

  // Validação dos campos obrigatórios
  if (!name || !email || !age) {
    return res.status(400).json({ error: "Os campos 'name', 'email' e 'age' são obrigatórios." });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        age: String(age), 
      },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

// Rota para listar todos os usuários
app.get('/usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno do servidor." });
  }
});

app.put('/usuarios/:id', async (req, res) =>{
  await prisma.user.update({
    where:{
      id: req.params.id
    },
    data: {
      email: req.body.email,
      name: req.body.name,
      age: req.body.age
    }

  })
});

app.delete('usuarios/:id', async (req, res) => {
  await prisma.user.delete({
    where: {
      id: req.params.id
    }
  })

  req.status(200).json({message: ' Usuario deletado com Sucesso! '})
})

// Iniciar o servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});