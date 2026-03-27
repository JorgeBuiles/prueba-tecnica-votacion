const express = require('express');
const mongoose = require('mongoose');

console.log("ARCHIVO CORRECTO EJECUTADO");

const Voter = require('./models/Voter');
const Candidate = require('./models/Candidate');
const Vote = require('./models/Vote');

const app = express();

app.use(express.json());

// 🔌 Conexión a MongoDB
mongoose.connect('mongodb://admin:Admin123@ac-a3tms5h-shard-00-00.uo7n8xl.mongodb.net:27017,ac-a3tms5h-shard-00-01.uo7n8xl.mongodb.net:27017,ac-a3tms5h-shard-00-02.uo7n8xl.mongodb.net:27017/?ssl=true&replicaSet=atlas-7u5n0t-shard-0&authSource=admin&appName=Cluster0')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.log(err));

// 🔹 Ruta base
app.get('/', (req, res) => {
    res.send('API funcionando');
});

// 🔹 Crear votante
app.post('/voters', async (req, res) => {
    try {
        const { name, email } = req.body;

        // Validar campos vacíos
        if (!name || !email) {
            return res.status(400).json({ message: 'Nombre y email son obligatorios' });
        }

        // Validar email duplicado en votantes
        const existing = await Voter.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'El email ya está registrado' });
        }

        // 🔥 Validar que no sea candidato
        const candidateExists = await Candidate.findOne({ email });
        if (candidateExists) {
            return res.status(400).json({ message: 'No puede registrarse como votante porque ya es candidato' });
        }

        const newVoter = new Voter({
            name,
            email
        });

        




        await newVoter.save();

        res.status(201).json(newVoter);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Crear candidato
app.post('/candidates', async (req, res) => {
    try {
        const { name, email, party } = req.body;

        // Validar campos obligatorios
        if (!name || !email) {
            return res.status(400).json({ message: 'Nombre y email son obligatorios' });
        }

        // Validar duplicado en candidatos
        const existing = await Candidate.findOne({ email });
        if (existing) {
            return res.status(400).json({ message: 'El candidato ya está registrado' });
        }

        // 🔥 Validar que no sea votante
        const voterExists = await Voter.findOne({ email });
        if (voterExists) {
            return res.status(400).json({ message: 'No puede registrarse como candidato porque ya es votante' });
        }

        const newCandidate = new Candidate({
            name,
            email,
            party
        });

        await newCandidate.save();

        res.status(201).json(newCandidate);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Registrar voto
app.post('/votes', async (req, res) => {
    try {
        const { voter_id, candidate_id } = req.body;

        // Validar campos vacíos
        if (!voter_id || !candidate_id) {
            return res.status(400).json({ message: 'voter_id y candidate_id son obligatorios' });
        }

        // Buscar votante
        const voter = await Voter.findById(voter_id);
        if (!voter) {
            return res.status(404).json({ message: 'Votante no encontrado' });
        }

        // Validar si ya votó
        if (voter.has_voted) {
            return res.status(400).json({ message: 'El votante ya ha votado' });
        }

        // Buscar candidato
        const candidate = await Candidate.findById(candidate_id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        // Validar campos vacíos
        if (!voter_id || !candidate_id) {
            return res.status(400).json({ message: 'voter_id y candidate_id son obligatorios' });
        }
        
        // 🔥 VALIDAR FORMATO DEL ID
        if (!mongoose.Types.ObjectId.isValid(candidate_id)) {
            return res.status(400).json({ message: 'candidate_id no es válido' });
        }



        // Crear voto
        const vote = new Vote({
            voter_id,
            candidate_id
        });

        await vote.save();

        // Marcar votante como que ya votó
        voter.has_voted = true;
        await voter.save();

        // Sumar voto al candidato
        candidate.votes += 1;
        await candidate.save();

        res.status(201).json({ message: 'Voto registrado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Ver candidatos
app.get('/candidates', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        res.json(candidates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener candidato por ID
app.get('/candidates/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        res.json(candidate);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar candidato
app.delete('/candidates/:id', async (req, res) => {
    try {
        const candidate = await Candidate.findByIdAndDelete(req.params.id);

        if (!candidate) {
            return res.status(404).json({ message: 'Candidato no encontrado' });
        }

        res.json({ message: 'Candidato eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔹 Ver votos
app.get('/votes', async (req, res) => {
    try {
        const votes = await Vote.find()
            .populate('voter_id')
            .populate('candidate_id');

        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Estadisticas de votacion
// 🔹 Ver votos
app.get('/votes', async (req, res) => {
    try {
        const votes = await Vote.find()
            .populate('voter_id')
            .populate('candidate_id');

        res.json(votes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🔥 ESTO VA AQUÍ 👇 (DEBAJO DE /votes)

app.get('/votes/statistics', async (req, res) => {
    try {
        // Total de votos
        const totalVotes = await Vote.countDocuments();

        // Total de votantes que han votado
        const totalVotersVoted = await Voter.countDocuments({ has_voted: true });

        // Votos por candidato
        const candidates = await Candidate.find();

        const stats = candidates.map(candidate => {
            const percentage = totalVotes === 0 
                ? 0 
                : ((candidate.votes / totalVotes) * 100).toFixed(2);

            return {
                candidate: candidate.name,
                votes: candidate.votes,
                percentage: percentage + '%'
            };
        });

        res.json({
            total_votes: totalVotes,
            total_voters_voted: totalVotersVoted,
            results: stats
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Obtener todos los votantes
app.get('/voters', async (req, res) => {
    try {
        const voters = await Voter.find();
        res.json(voters);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener votante por ID
app.get('/voters/:id', async (req, res) => {
    try {
        const voter = await Voter.findById(req.params.id);

        if (!voter) {
            return res.status(404).json({ message: 'Votante no encontrado' });
        }

        res.json(voter);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar votante
app.delete('/voters/:id', async (req, res) => {
    try {
        const voter = await Voter.findByIdAndDelete(req.params.id);

        if (!voter) {
            return res.status(404).json({ message: 'Votante no encontrado' });
        }

        res.json({ message: 'Votante eliminado correctamente' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// 🚀 Servidor
app.listen(3000, () => {
    console.log('Servidor corriendo en puerto 3000');
});