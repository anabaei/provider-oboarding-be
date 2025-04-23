// routes/treatment.js
import express from 'express';
import Treatment from '../models/Treatment.js';  // Assuming Treatment model exists
import Clinic from '../models/Clinic.js';  // Assuming Clinic model exists

const router = express.Router();

// Create a new Treatment
router.post('/:clinic_id', async (req, res) => {
    const { clinic_id } = req.params;  // Clinic ID passed as part of the URL
    const { name, specialist_id, duration, price, service } = req.body;

    try {
        // Check if clinic exists
        const clinic = await Clinic.findByPk(clinic_id);
        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found' });
        }

        // Create new treatment
        const newTreatment = await Treatment.create({
            name,
            clinic_id,
            specialist_id,
            duration,
            price,
            service
        });

        res.status(201).json(newTreatment);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create treatment' });
    }
});

// Get all treatments for a specific clinic
router.get('/:clinic_id', async (req, res) => {
    const { clinic_id } = req.params;

    try {
        const treatments = await Treatment.findAll({
            where: { clinic_id },
        });

        if (!treatments.length) {
            console.log('No treatments found for this clinic');
         //   return res.status(404).json({ message: 'No treatments found for this clinic' });
        }

        res.status(200).json(treatments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch treatments' });
    }
});

// Get treatments by a specific specialist
router.get('/specialist/:specialist_id', async (req, res) => {
    const { specialist_id } = req.params;

    try {
        const treatments = await Treatment.findAll({
            where: { specialist_id },
        });

        if (!treatments.length) {
            return res.status(404).json({ message: 'No treatments found for this specialist' });
        }

        res.status(200).json(treatments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch treatments by specialist' });
    }
});

export default router;
