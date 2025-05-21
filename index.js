// index.js (Backend principal con Express)
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;  // Usa el puerto de Render si está, si no 3000 para local

app.use(express.static('public'));
app.use(express.json());

const dataFile = path.join(__dirname, 'data.json');

app.post('/save', (req, res) => {
    const newData = req.body;
    // Normalizamos la placa quitando espacios y pasando a mayúsculas
    if (newData.placa) {
        newData.placa = newData.placa.replace(/\s+/g, '').toUpperCase();
    }
    fs.readFile(dataFile, 'utf8', (err, fileData) => {
        let data = [];
        if (!err && fileData) {
            data = JSON.parse(fileData);
        }
        data.push(newData);
        fs.writeFile(dataFile, JSON.stringify(data, null, 2), err => {
            if (err) return res.status(500).json({ message: 'Error guardando los datos' });
            res.json({ message: 'Guardado exitosamente' });
        });
    });
});

app.get('/buscar/:placa', (req, res) => {
    let placa = req.params.placa;
    placa = placa.replace(/\s+/g, '').toUpperCase();
    fs.readFile(dataFile, 'utf8', (err, fileData) => {
        if (err) return res.status(500).json({ message: 'Error leyendo los datos' });
        const data = JSON.parse(fileData);
        const result = data.find(item => item.placa === placa);
        if (result) return res.json({ status: 'verificado', data: result });
        return res.json({ status: 'no_registrado' });
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
