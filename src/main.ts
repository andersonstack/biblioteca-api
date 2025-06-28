import express from 'express';
import cors from 'cors';
import {createUserInBD} from './database/db';

const app = express();
app.use(cors());
app.use(express.json());

app.listen(3000, () => {
    console.log("[!] Back-end rodando!")
});

app.post('/usuario', async (req, res) => {
    const {user, nome, senha} = req.body;
    await createUserInBD(user, nome, senha);
    if (res.status(201)){
        console.log('Requisição concluída');
    } else {
        console.log('Falha na requisição');
    }
})
