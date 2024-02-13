const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const port = 8080;
const helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.json());

// Read car data from the JSON file
let carsData = fs.readFileSync('cars.json');
let carList = JSON.parse(carsData).cars;

// View all cars
app.get('/api', (req, res) => {
  res.json(carList);
});

// Variable to keep track of current maximum ID
let highestCarId = Math.max(...carList.map(car => car.id), 0);

// Add a car
app.post('/api', (req, res) => {
  const newCar = req.body;
  // Generate next ID and assign it to new car
  const nextId = highestCarId + 1;
  newCar.id = nextId;
  // Add to carlist
  carList.push(newCar);
  // Update the current maximum ID
  highestCarId = nextId;
  // Update cars.json
  saveCarsListData();
  res.json(newCar);
});

// Delete a car by id
app.delete('/api/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Filter carslist by id
  carList = carList.filter(car => car.id !== id);
  // Update cars.json
  saveCarsListData();
  res.send(`Car with id ${id} deleted.`);
});

// Update the model or number of seats of a car
app.put('/api/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const updatedCar = req.body;
  carList = carList.map(car => {
    // Check if id matches
    if (car.id === id) {
      // Merge current with updated car
      return { ...car, ...updatedCar };
    }
    return car;
  });
  saveCarsListData();
  res.json(updatedCar);
});

// Function to save the updated car data to the JSON file
function saveCarsListData() {
  const updatedData = JSON.stringify({ cars: carList });
  fs.writeFileSync('cars.json', updatedData);
};

app.listen(port, ()=>console.log('Listening engaged'));
