const Department = require('../model/Department');

exports.createDepartment = async (req, res) => {
  try {
    const { name, code } = req.body;

    const department = await Department.create({ name, code });

    res.status(201).json({
      message: 'Department created successfully',
      department
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
