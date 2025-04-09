import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    victimName: '',
    mobileNumber: '',
    address: '', // Combined state and nearestTown
    category: '',
    subCategories: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [towns, setTowns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchLocationData = async () => {
      try {
        const response = await fetch('/india-states-towns.json');
        const data = await response.json();
        setStates(Object.keys(data));
        setTowns([]);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };

    const fetchCaseCategories = async () => {
      try {
        const response = await fetch('/CaseCategories.json');
        const data = await response.json();
        setCategories(Object.keys(data));
        setSubCategories([]);
      } catch (error) {
        console.error('Error fetching case categories:', error);
      }
    };

    fetchLocationData();
    fetchCaseCategories();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = {
        ...prevFormData,
        [name]: value
      };

      // Update address when state changes
      if (name === 'state') {
        fetch('/india-states-towns.json')
          .then(response => response.json())
          .then(data => {
            setTowns(data[value]);
            updatedFormData.address = `${value}, `; // Start address with state
          })
          .catch(error => console.error('Error fetching towns:', error));
      }

      // Update subCategories when category changes
      if (name === 'category') {
        fetch('/CaseCategories.json')
          .then(response => response.json())
          .then(data => {
            setSubCategories(data[value]);
            updatedFormData.subCategories = []; // Reset subcategories when category changes
          })
          .catch(error => console.error('Error fetching subcategories:', error));
      }

      return updatedFormData;
    });
    setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
  };

  const handleTownChange = (e) => {
    const town = e.target.value;
    setFormData((prevFormData) => ({
      ...prevFormData,
      nearestTown: town,
      address: `${prevFormData.state}, ${town}` // Update address with town
    }));
  };

  const handleSubCategoryChange = (subCategory) => {
    setFormData((prevFormData) => {
      const currentSubCategories = [...prevFormData.subCategories];
      
      if (currentSubCategories.includes(subCategory)) {
        // Remove if already selected
        return {
          ...prevFormData,
          subCategories: currentSubCategories.filter(item => item !== subCategory)
        };
      } else {
        // Add if not already selected
        return {
          ...prevFormData,
          subCategories: [...currentSubCategories, subCategory]
        };
      }
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.victimName.trim()) {
      newErrors.victimName = 'Victim Name is required';
      isValid = false;
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile Number is required';
      isValid = false;
    }

    if (!formData.address) {
      newErrors.address = 'Address (State and Town) is required';
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = 'Case Category is required';
      isValid = false;
    }

    if (formData.subCategories.length === 0) {
      newErrors.subCategories = 'At least one Sub-Category must be selected';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found.');
      }

      const data = new FormData();
      data.append('victimName', formData.victimName);
      data.append('mobileNumber', formData.mobileNumber);
      data.append('address', formData.address); // Use combined address
      data.append('category', formData.category);
      formData.subCategories.forEach(subCategory => {
        data.append('subCategories', subCategory);
      });

      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cases/create-case/`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage('Case created successfully!');
      setFormData({
        victimName: '',
        mobileNumber: '',
        address: '',
        category: '',
        subCategories: []
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating case:', error);
      setMessage(
        error.response?.data?.message ||
          'Failed to create case. Please try again.'
      );
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("refresh");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-200 pt-16">
      <div className="container mx-auto mb-5">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
          <h2 className="text-center bg-green-600 text-white p-4 rounded-t-lg">
            Create New Case
          </h2>
          <div className="p-6">
            {message && (
              <div
                className={`alert ${
                  message.includes('success')
                    ? 'alert-success'
                    : 'alert-danger'
                } p-4 mb-4 rounded-lg`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="victimName">
                    Victim Name
                  </label>
                  <input
                    className={`form-control w-full px-3 py-2 border ${errors.victimName ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    type="text"
                    name="victimName"
                    id="victimName"
                    value={formData.victimName}
                    onChange={handleChange}
                    placeholder="Enter victim's full name"
                    required
                  />
                  {errors.victimName && <p className="text-red-500 text-sm">{errors.victimName}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="mobileNumber">
                    Mobile Number
                  </label>
                  <input
                    className={`form-control w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    type="tel"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                    required
                  />
                  {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="state">
                    State
                  </label>
                  <select
                    className={`form-control w-full px-3 py-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    name="state"
                    id="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select State</option>
                    {states.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="nearestTown">
                    Nearest Town
                  </label>
                  <select
                    className={`form-control w-full px-3 py-2 border ${errors.nearestTown ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    name="nearestTown"
                    id="nearestTown"
                    value={formData.nearestTown}
                    onChange={handleTownChange}
                    required
                  >
                    <option value="">Select Town</option>
                    {towns.map((town) => (
                      <option key={town} value={town}>
                        {town}
                      </option>
                    ))}
                  </select>
                  {errors.nearestTown && <p className="text-red-500 text-sm">{errors.nearestTown}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="category">
                    Case Category
                  </label>
                  <select
                    className={`form-control w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Case Category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label block mb-2">
                    Sub-Categories (Select all that apply)
                  </label>
                  <div className={`border ${errors.subCategories ? 'border-red-500' : 'border-gray-300'} rounded-md p-3 max-h-40 overflow-y-auto`}>
                    {subCategories.length > 0 ? (
                      subCategories.map((subCategory) => (
                        <div key={subCategory} className="flex items-center mb-2">
                          <input
                            type="checkbox"
                            id={`subCategory-${subCategory}`}
                            checked={formData.subCategories.includes(subCategory)}
                            onChange={() => handleSubCategoryChange(subCategory)}
                            className="mr-2"
                          />
                          <label htmlFor={`subCategory-${subCategory}`}>{subCategory}</label>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">Select a category first</p>
                    )}
                  </div>
                  {errors.subCategories && <p className="text-red-500 text-sm">{errors.subCategories}</p>}
                </div>
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCase;