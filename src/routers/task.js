const express = require('express');

const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async(req, res) => {
    const task =  new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save();
        res.status(201).send(task);
    } catch(err) {
        res.status(400).send(err);
    }
});

//GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async(req,res) => {
    const match = {};
    const sort = {};
    if(req.query.completed) {
        match['completed'] = req.query.completed === 'true';
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    try {
        // const task = await Task.find({owner: req.user._id});
        //res.send(task);
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        });
        res.send(req.user.tasks);
    } catch(err) {
        res.status(500).send(err);
    }
});

router.get('/tasks/:id', auth, async(req,res) => {
    const {id: _id} = req.params;
    try {
        //const task = await Task.findById(__id);
        const task = await Task.findOne({ _id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('Task not found!');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch('/tasks/:id', auth, async(req, res) => {
    const {id} = req.params;
    const updates = Object.keys(req.body);
    const allowedUpdate = ['description', 'completed'];
    const isValidOperation = updates.every(task => allowedUpdate.includes(task));
    if(!isValidOperation) {
        return res.status(400).send('Invalid updates!');
    }
    try {
        // const task = await Task.findById(id);
        const task = await Task.findOne({_id: id, owner: req.user._id});
        if(!task) {
            return res.status(404).send('Task not found!');
        }
        updates.forEach( update => task[update] = req.body[update]);
        await task.save();
        
        //const task = await Task.findByIdAndUpdate(id, req.body, {new: true, runValidators: true});
        
        res.send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/tasks/:id', auth, async(req, res) => {
    try {
        //const task = await Task.findByIdAndDelete(req.params.id);
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id});
        if(!task) {
            return res.status(404).send('Task not found!');
        }
        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;