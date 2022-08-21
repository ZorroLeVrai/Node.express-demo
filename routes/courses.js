const express = require('express');
//A class is returned from the module
const Joi = require('joi');

//in the module, we work with a `router` object
const router = express.Router();

const courses = [
  { id: 1, name: 'course1' },
  { id: 2, name: 'course2' },
  { id: 3, name: 'course3' }
];

const courseSchema = Joi.object({
  name: Joi.string().min(3).required()
});

router.get('/', (req, res) => {
  res.send(courses);
});

router.post('/', (req, res) => {
  const validationResult = courseSchema.validate(req.body);

  if (validationResult.error)
  {
    //400 Bad request
    res.status(400).send(validationResult.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course);
});

router.put('/:id', (req, res) => {
  //Look up the course
  let course = courses.find(c => c.id === Number(req.params.id));
  //If not existing, return 404
  if (!course)
  {
    res.status(404).send(`The course id ${req.params.id} has not be found`);
    return;
  }
    
  //Validate the course
  const { error } = courseSchema.validate(req.body);
  //If invalid, return 400 - Bad request
  if (error)
  {
    //400 Bad request
    res.status(400).send(error.details[0].message);
    return;
  }
  //Update the course
  course.name = req.body.name;
  //Return the updated course to the client
  res.send(course);
});

router.delete('/:id', (req, res) => {
  let course = courses.find(c => c.id === Number(req.params.id));
  if (!course)
  {
    res.status(404).send(`The course id ${req.params.id} has not be found`);
    return;
  }

  //Delete the course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  //Return the same course
  res.send(course);
});

router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) //404: object not found
    return res.status(404).send(`The course with the id ${req.params.id} was not found`);
  
  res.send(course);
});

//Export Express router
module.exports = router;