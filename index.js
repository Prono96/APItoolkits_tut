require('dotenv').config()
const fs = require('fs');
const express = require('express');
const data = require('./data.json')
const APIToolkit = require('apitoolkit-express').default

const app = express();

const port = 8000;
(async ()=>{
const apitoolkit =  await APIToolkit.NewClient({ apiKey: process.env.API_KEY})
app.use(apitoolkit.expressMiddleware);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// APYtoolkit middleware ends here  


// Get All the Student Data route
app.get('/data', (req, res) => {
  return res.status(200).json(data)
})

// Post student route
app.post('/student', (req, res) => {

   // Create a new student object
   const newStudent = {
    name: 'Speed Darlington',
    age:   25,
    class: 'graduate',
    school: 'Uni Lag'
  };

   // Add the new student to the data array
   data.push(newStudent);

   // Save the updated data back to the JSON file
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));

  res.status(200).json({ 
    message: 'Student data added successfully',
    data
   });

} )

// Delete a student by name endpoint 
app.delete('/student/:name', (req, res) => {
  const studentName = decodeURIComponent(req.params.name);

  // Filter the data array to exclude the student(s) with the provided name
  const filteredStudents = data.filter(student => student.name !== studentName);

  if (filteredStudents.length < data.length) {
    // Save the updated data back to the JSON file
    fs.writeFileSync('./data.json', JSON.stringify(filteredStudents, null, 2));

    res.status(200).json({ message: 'Student data deleted successfully' });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
});



app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});

})();
