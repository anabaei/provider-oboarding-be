import express from 'express';
import Organization from '../models/Organization.js';
import Clinic from '../models/Clinic.js';
import connection from '../db/connection.js';

const router = express.Router();

// Create organization
router.post("/", async (req, res, next) => {
    const userId = req.userId;
    const { company_name, company_code, main_contact, website, email, phone, image, location } = req.body;

    try {
        const newOrganization = await connection.models.Organization.upsert({
            user_id: userId,
            company_name,
            company_code,
            main_contact,
            website,
            email,
            phone,
            image,
            location,
        });
        const clinic = await connection.models.Clinic.upsert({
            clinic_name: "Main Clinic",
            org_id: newOrganization.org_id,
            clinic_code: "MC",  // You can generate a unique code
            main_contact,
            website,
            email,
            phone,
            image,
            location,
        });
        
        return clinic[0].clinic_id;
    } catch (error) {
        return next(error);
    }
});

// Get all organizations for the user
router.get("/", async (req, res, next) => {
    const userId = req.userId;

    try {
        const organizations = await connection.models.Organization.findAll({
            where: { UserId: userId }
        });
        return res.json(organizations);
    } catch (error) {
        return next(error);
    }
});

// Get a specific organization by id
router.get("/:id", async (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;

    try {
        const organization = await connection.models.Organization.findOne({
            where: {
                org_id: id,
                UserId: userId
            }
        });
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        return res.json(organization);
    } catch (error) {
        return next(error);
    }
});

// Update an organization by id
router.put("/:id", async (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;
    const { company_name, company_code, main_contact, website, email, phone, image, location } = req.body;

    try {
        const organization = await connection.models.Organization.findOne({
            where: {
                org_id: id,
                UserId: userId
            }
        });

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        organization.company_name = company_name || organization.company_name;
        organization.company_code = company_code || organization.company_code;
        organization.main_contact = main_contact || organization.main_contact;
        organization.website = website || organization.website;
        organization.email = email || organization.email;
        organization.phone = phone || organization.phone;
        organization.image = image || organization.image;
        organization.location = location || organization.location;

        await organization.save();

        return res.json(organization);
    } catch (error) {
        return next(error);
    }
});

// Delete an organization by id
router.delete("/:id", async (req, res, next) => {
    const userId = req.userId;
    const { id } = req.params;

    try {
        const organization = await connection.models.Organization.findOne({
            where: {
                org_id: id,
                UserId: userId
            }
        });

        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }

        await organization.destroy();

        return res.json({ message: "Organization deleted successfully" });
    } catch (error) {
        return next(error);
    }
});

/////////////////////////////////////
/// Add a clinic to an organization ////
/////////////////////////////////////
router.post('/:org_code/clinics', async (req, res) => {
    try {
        const {org_code} =req.params;
        const { clinic_name, clinic_code, main_contact, website, email, phone, image, location } = req.body;

        // Validate required fields (e.g., clinic_name and email)
        if (!clinic_name || !email) {
            return res.status(400).json({ error: 'Clinic name and email are required.' });
        }

        const newClinic = await Clinic.create({
            clinic_name,
            org_id: org_code,
            clinic_code,
            main_contact,
            website,
            email,
            phone,
            image,
            location
        });

        res.status(201).json(newClinic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create clinic.' });
    }
});

// READ - Get all clinics
router.get('/clinics', async (req, res) => {
    try {
        const clinics = await Clinic.findAll({
            include: Organization, // You can include Organization data if needed
        });
        res.status(200).json(clinics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve clinics.' });
    }
});

// READ - Get clinic by ID
router.get('/clinics/:id', async (req, res) => {
    try {
        const clinicId = req.params.id;
        const clinic = await Clinic.findByPk(clinicId, {
            include: Organization, // You can include Organization data if needed
        });

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found.' });
        }

        res.status(200).json(clinic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to retrieve clinic.' });
    }
});

// UPDATE - Update a clinic by ID
router.put('/clinics/:id', async (req, res) => {
    try {
        const clinicId = req.params.id;
        const { clinic_name, clinic_code, main_contact, website, email, phone, image, location } = req.body;

        const clinic = await Clinic.findByPk(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found.' });
        }

        // Update clinic data
        clinic.clinic_name = clinic_name || clinic.clinic_name;
        // clinic.org_id = org_id || clinic.org_id;
        clinic.clinic_code = clinic_code || clinic.clinic_code;
        clinic.main_contact = main_contact || clinic.main_contact;
        clinic.website = website || clinic.website;
        clinic.email = email || clinic.email;
        clinic.phone = phone || clinic.phone;
        clinic.image = image || clinic.image;
        clinic.location = location || clinic.location;

        await clinic.save();

        res.status(200).json(clinic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update clinic.' });
    }
});

// DELETE - Delete a clinic by ID
router.delete('/clinics/:id', async (req, res) => {
    try {
        const clinicId = req.params.id;
        const clinic = await Clinic.findByPk(clinicId);

        if (!clinic) {
            return res.status(404).json({ error: 'Clinic not found.' });
        }

        await clinic.destroy();
        res.status(200).json({ message: 'Clinic deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete clinic.' });
    }
});



export default router;
