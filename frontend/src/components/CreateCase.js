import React, { useState, useRef, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCase = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    victimName: '',
    mobileNumber: '',
    address: '', // Combined state and nearestTown
    statement: '',
    documents: [],
    videoFile: null
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [states, setStates] = useState([]);
  const [towns, setTowns] = useState([]);

  const documentsInputRef = useRef(null);
  const videoInputRef = useRef(null);

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

    fetchLocationData();
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

  const handleStatementChange = (content) => {
    setFormData({
      ...formData,
      statement: content
    });
  };

  const handleDocumentsChange = (e) => {
    setFormData({
      ...formData,
      documents: [...e.target.files]
    });
  };

  const handleVideoChange = (e) => {
    setFormData({
      ...formData,
      videoFile: e.target.files[0]
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
      data.append('statement', formData.statement);

      formData.documents.forEach((doc, index) => {
        data.append(`document_${index}`, doc);
      });

      if (formData.videoFile) {
        data.append('videoFile', formData.videoFile);
      }

      await axios.post('http://localhost:8000/api/cases/create-case/', data, {
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
        statement: '',
        documents: [],
        videoFile: null,
      });
      setErrors({});

      if (documentsInputRef.current) documentsInputRef.current.value = '';
      if (videoInputRef.current) videoInputRef.current.value = '';
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
                    onChange={handleTownChange} // Update to handle town change
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

              <div className="mb-4">
                <label className="form-label block mb-2" htmlFor="statement">
                  Statement of Injustice
                </label>
                <ReactQuill
                  theme="snow"
                  value={formData.statement}
                  onChange={handleStatementChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="documents">
                    Upload Documents
                  </label>
                  <input
                    className="form-control w-full"
                    type="file"
                    ref={documentsInputRef}
                    id="documents"
                    onChange={handleDocumentsChange}
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <p className="text-muted mt-1">
                    Upload relevant documents related to the case (PDF, DOC, DOCX,
                    JPG, PNG)
                  </p>
                </div>

                <div className="mb-3">
                  <label className="form-label block mb-2" htmlFor="videoFile">
                    Upload Video Evidence
                  </label>
                  <input
                    className="form-control w-full"
                    type="file"
                    ref={videoInputRef}
                    id="videoFile"
                    onChange={handleVideoChange}
                    accept="video/*"
                  />
                  <p className="text-muted mt-1">
                    Upload any video evidence related to the case (MP4, MOV, AVI)
                  </p>
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
