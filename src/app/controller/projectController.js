import Project from '../models/project.js';
import Task from '../models/task.js';

export async function index(req, res) {

    try {
        const projects = await Project.find().populate(['user', 'tasks']);

        return res.send({ projects });
    } catch (error) {
        return res.status(400).send({ error: 'Error loading projects' });
    }
}

export async function show(req, res) {
    try {
        const project = await Project.findById(req.params.projectId).populate(['user', 'tasks']);

        return res.send({ project });
    } catch (error) {
        return res.status(400).send({ error: 'Error loading project' });
    }
}

export async function update(req, res) {
    try {

        const { title, description, tasks } = req.body;

        const project = await Project.findByIdAndUpdate(
            req.params.projectId,
            {
                title,
                description,
            },
            { new: true }
        );
        project.tasks = [];
        await Task.remove({ project: project._id });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
}

export async function store(req, res) {
    try {

        const { title, description, tasks } = req.body;

        const project = await Project.create({ title, description, user: req.userId });

        await Promise.all(tasks.map(async task => {
            const projectTask = new Task({ ...task, project: project._id });
            await projectTask.save();
            project.tasks.push(projectTask);
        }));

        await project.save();

        return res.send({ project });
    } catch (error) {
        console.log(error);
        return res.status(400).send({ error: 'Error creating new project' });
    }
}

export async function remove(req, res) {
    try {
        await Project.findByIdAndRemove(req.params.projectId).populate('user');

        return res.send();
    } catch (error) {
        return res.status(400).send({ error: 'Error loading project' });
    }
}