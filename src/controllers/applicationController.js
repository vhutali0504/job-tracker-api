const { 
  getAllApplications, 
  createApplication, 
  updateApplication, 
  deleteApplication,
  getSummary
} = require('../models/applicationModel');


const getApplications = async (req, res) => {
  try {
    const applications = await getAllApplications(req.userId);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addApplication = async (req, res) => {
  try {
    const { company, role, status = 'Applied', date_applied, notes } = req.body;

    if (!company || !role) {
      return res.status(400).json({ error: 'Company and role are required' });
    }

    const application = await createApplication(
      req.userId, company, role, status, date_applied, notes
    );
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await updateApplication(id, req.userId, req.body);

    if (!updated) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteApplication(id, req.userId);

    if (!deleted) {
      return res.status(404).json({ error: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getApplicationSummary = async (req, res) => {
  try {
    const summary = await getSummary(req.userId);
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getApplications, addApplication, editApplication, removeApplication, getApplicationSummary };
