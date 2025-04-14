// routes/specialistAvailabilityRoutes.js
import express from 'express';
import SpecialistAvailability from '../models/SpecialistAvailability.js';

const router = express.Router();

// POST request to create a new specialist's availability
router.post('/update', async (req, res) => {

    // const { specialist_id } = req.body;
    const specialist_id = 1;
    let availabilities;
    for(let day in req?.body){
        const enabled = req.body[day].enabled;
        for(let range of req.body[day].ranges){
            try {              
                availabilities = await SpecialistAvailability.upsert({
                    specialist_id: 1,
                    day,
                    enabled,
                    start: range.start,
                    end: range.end,
                });
            
            } catch (error) {
                console.error(error);
               return res.status(500).json({ message: 'Error creating specialist availability' });
            }

             }
    
    }
    const results = await availabilities.toJSON();
    if (results.length > 0) {
        return res.status(201).json({results});
    }
});

// GET request to get all availabilities of a specific specialist
router.get('/:specialist_id', async (req, res) => {
    const { specialist_id } = req.params;

    try {
        const availabilities = await SpecialistAvailability.findAll({
            where: { specialist_id }
        });
        if (availabilities.length === 0) {
            return res.status(404).json({ message: 'No availability found for this specialist' });
        }
        res.json(availabilities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching specialist availability' });
    }
});

// PUT request to update a specialist's availability
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { days_of_week, start_time, end_time } = req.body;

    try {
        const availability = await SpecialistAvailability.update(
            { days_of_week, start_time, end_time },
            { where: { id } }
        );
        if (availability[0] === 0) {
            return res.status(404).json({ message: 'Availability not found' });
        }
        res.json({ message: 'Availability updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating specialist availability' });
    }
});

// DELETE request to delete a specialist's availability
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const availability = await SpecialistAvailability.destroy({ where: { id } });
        if (!availability) {
            return res.status(404).json({ message: 'Availability not found' });
        }
        res.json({ message: 'Availability deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting specialist availability' });
    }
});

export default router;
