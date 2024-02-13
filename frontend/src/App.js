import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [carList, setCarList] = useState([]);
  const [newCar, setNewCar] = useState({ make: '', model: '', seats: '' });
  const [updatingCar, setUpdatingCar] = useState(null);

  // Fetch backend API
  useEffect(() => {
    fetch("/api").then(
      // Retrieve as json
      response => response.json()
    ).then(
      data => {
        // Set data
        setCarList(data);
      }
    )
  }, []);

  // Delete a car
  function handleDeleteCar(id) {
    fetch(`/api/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.text())
      .then(message => {
        // Update frontend
        const updatedData = carList.filter(car => car.id !== id);
        setCarList(updatedData);
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Add a car
  function handleAddCar(e) {
    // prevent page reload
    e.preventDefault();
  
    fetch('/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCar)
    })
      .then(response => response.json())
      .then(data => {
        // Update frontend
        setCarList([...carList, data]);
        // Reset form inputs
        setNewCar({ make: '', model: '', seats: '' });
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Update a car
  function handleUpdateCar(e, carId) {
    e.preventDefault();
    // Find matching car id
    const updatedCar = carList.find(car => car.id === carId);
    // Send PUT request to server
    fetch(`/api/${carId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedCar)
    })
      .then(response => response.json())
      .then(data => {
        // Update frontend
        const updatedData = carList.map(car => {
          if (car.id === carId) {
            // Replace updated data
            return data;
          }
          // Keep unchanged data
          return car;
        });
        setCarList(updatedData);
        // Reset update state to indicate no car is being updated
        setUpdatingCar(null);
      })
      .catch(error => {
        console.error(error);
      });
    }
  return (
    <div>
      <h1>My Car Collection</h1>
      <form>
        <label>Make: 
          <input 
            type="text" 
            value={newCar.make} 
            // Update the 'make' property of 'newCar' state when input value changes
            onChange={e => setNewCar({ ...newCar, make: e.target.value })} />
        </label>
        <label>Model: 
          <input 
            type="text" 
            value={newCar.model} 
            // Update the 'model' property of 'newCar' state when input value changes
            onChange={e => setNewCar({ ...newCar, model: e.target.value })} />
        </label>
        <label>Seats: 
          <input 
            type="text" 
            value={newCar.seats} 
            // Update the 'seats' property of 'newCar' state when input value changes
            onChange={e => setNewCar({ ...newCar, seats: e.target.value })} />
            </label>
          <button type="submit" onClick={handleAddCar}>Add Car</button>
      </form>
      {/* Display cars */}
      {carList.map((car, i) => (
          <div key={i}>
            <p>Make: {car.make}</p>
            <p>Model: {car.model}</p>
            <p>Seats: {car.seats}</p>
            {updatingCar === car.id ? (
              <form onSubmit={e => handleUpdateCar(e, car.id)}>
                <label>New Make: <input type="text" value={car.make} onChange={e => {
                  // Update the make of the car in the state
                  const updatedCar = { ...car, make: e.target.value };
                  setCarList(prevData => prevData.map(prevCar => prevCar.id === car.id ? updatedCar : prevCar));
                }} /></label>
                <label>New Model: <input type="text" value={car.model} onChange={e => {
                  // Update the model of the car in the state
                  const updatedCar = { ...car, model: e.target.value };
                  setCarList(prevData => prevData.map(prevCar => prevCar.id === car.id ? updatedCar : prevCar));
                }} /></label>
                <label>New Seats: <input type="text" value={car.seats} onChange={e => {
                  // Update the seats of the car in the state
                  const updatedCar = { ...car, seats: e.target.value };
                  setCarList(prevData => prevData.map(prevCar => prevCar.id === car.id ? updatedCar : prevCar));
                }} /></label>
                <button type="submit">Update</button>
              </form>
            ) : (
              <button onClick={() => setUpdatingCar(car.id)}>Update</button>
            )}
            <button onClick={() => handleDeleteCar(car.id)}>Delete</button>
          </div>
        )
      )}
    </div>
  );
}

export default App;