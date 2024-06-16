import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const countryCodes = ['+1', '+44', '+91', '+81']; // Example country codes

function Form() {
  const { formType } = useParams();
  const [name, setName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load data from local storage if available
    const savedData = JSON.parse(localStorage.getItem('formData'));
    if (savedData) {
      setName(savedData.name);
      setCountryCode(savedData.countryCode);
      setPhoneNumber(savedData.phoneNumber);
    }
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!name || !/^[a-zA-Z]+$/.test(name)) newErrors.name = 'Name is required and should contain only alphabetic characters';
    if (!countryCode) newErrors.countryCode = 'Country code is required';
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) newErrors.phoneNumber = 'Phone number is required and should contain only numbers';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate();
    if (Object.keys(formErrors).length === 0) {
      try {
        await axios.post('/submitForm', { formType, name, countryCode, phoneNumber });
        localStorage.setItem('formData', JSON.stringify({ name, countryCode, phoneNumber }));
        alert('Form submitted successfully');
      } catch (error) {
        console.error('Error submitting form', error);
      }
    } else {
      setErrors(formErrors);
    }
  };

  return (
    <div className='formContainer'>
      <h1>{`Form ${formType}`}</h1>
      <form  onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div>
          <label>Country Code:</label>
          <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            <option value="">Select Country Code</option>
            {countryCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
          {errors.countryCode && <p>{errors.countryCode}</p>}
        </div>
        <div>
          <label>Phone Number:</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          {errors.phoneNumber && <p>{errors.phoneNumber}</p>}
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Form;

