const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  const task = await Task.create(req.body);
  req.app.get('io').emit('updateTasks');
  res.json(task);
};

exports.getTasks = async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { owner: req.query.user },
      { sharedWith: req.query.user }
    ]
  });
  res.json(tasks);
};

exports.updateTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  req.app.get('io').emit('updateTasks');
  res.json(task);
};

exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  req.app.get('io').emit('updateTasks');
  res.json({ message: 'Task deleted' });
};
