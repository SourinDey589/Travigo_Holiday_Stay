import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Button, Form, FormGroup } from 'reactstrap';
import { AuthContext } from './../context/AuthContext';
import axios from 'axios';
import { BASE_URL } from './../utils/config';
import './profile.css';

const Profile = () => {
  const { user, dispatch } = useContext(AuthContext);
  const [updatedUser, setUpdatedUser] = useState({
    username: user.username || '',
    email: user.email || '',
    password: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(user.photo ? `${BASE_URL}${user.photo}` : '');

  useEffect(() => {
    if (user.photo) {
      setPreviewPhoto(`${BASE_URL}${user.photo}`);
    }
  }, [user.photo]);

  const handleChange = (e) => {
    setUpdatedUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewPhoto(URL.createObjectURL(file)); // Preview the selected photo
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!user._id) {
      alert('User ID is missing!');
      return;
    }
  
    const formData = new FormData();
    formData.append('username', updatedUser.username);
    formData.append('email', updatedUser.email);
    if (updatedUser.password) {
      formData.append('password', updatedUser.password);
    }
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }
  
    try {
      const res = await axios.put(`${BASE_URL}/Users/Update/${user._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert(res.data.message);
  
      // Correctly update the AuthContext with the new user data
      dispatch({ 
        type: 'UPDATE_USER', 
        payload: res.data.updatedUser // Updated user with new photo URL from response
      });
  
      setPreviewPhoto(`${BASE_URL}${res.data.updatedUser.photo}`);
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <Container>
      <Row>
        <div className="booking__form">
          <Form className='profile__update-form' onSubmit={handleUpdate}>
            <FormGroup>
              <input type="text" placeholder="Enter your Full Name" required id="username" name="username" value={updatedUser.username} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <input type="email" placeholder="Email" required id="email" name="email" value={updatedUser.email} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <input type="password" placeholder="Password" id="password" name="password" value={updatedUser.password} onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {previewPhoto && (
                  <img
                    src={previewPhoto}
                    alt="Profile"
                    style={{ width: '3rem', height: '3rem', borderRadius: '50%', marginRight: '1rem' }}
                  />
                )}
                <label htmlFor="file-upload" className="custom-file-upload">
                  Upload Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  id="file-upload"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>
            </FormGroup>
            <Button color="primary" type="submit" className="w-100 mt-3">
              Update
            </Button>
          </Form>
        </div>
      </Row>
    </Container>
  );
};

export default Profile;