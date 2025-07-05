import { Col, Form, Input, Row, TimePicker, message } from 'antd';
import { Container } from 'react-bootstrap';
import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';

function ApplyDoctor({ userId }) {
  const [doctor, setDoctor] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    timings: [],
  });

  // Handles changes in normal input fields
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // Handles change in TimePicker and formats time values
  const handleTimingChange = (value) => {
    const formattedTimings = value.map((time) => moment(time).format('HH:mm'));
    setDoctor({ ...doctor, timings: formattedTimings });
  };

  // Handles form submission
  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/registerdoc',
        {
          doctor,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message || 'Submission failed');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  return (
    <Container>
      <h2 className="text-center p-3">Apply for Doctor</h2>
      <Form onFinish={handleSubmit} className="m-3" layout="vertical">
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Full Name" name="fullName" required>
              <Input
                name="fullName"
                value={doctor.fullName}
                onChange={handleChange}
                placeholder="Enter full name"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Phone" name="phone" required>
              <Input
                name="phone"
                type="number"
                value={doctor.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Email" name="email" required>
              <Input
                name="email"
                type="email"
                value={doctor.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Address" name="address" required>
              <Input
                name="address"
                value={doctor.address}
                onChange={handleChange}
                placeholder="Enter address"
              />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Specialization" name="specialization" required>
              <Input
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                placeholder="Specialization"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Experience (Years)" name="experience" required>
              <Input
                name="experience"
                type="number"
                value={doctor.experience}
                onChange={handleChange}
                placeholder="Years of experience"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Fees (per consultation)" name="fees" required>
              <Input
                name="fees"
                type="number"
                value={doctor.fees}
                onChange={handleChange}
                placeholder="Enter fees"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Form.Item label="Available Timings" name="timings" required>
              <TimePicker.RangePicker
                format="HH:mm"
                onChange={handleTimingChange}
              />
            </Form.Item>
          </Col>
        </Row>

        <div className="d-flex justify-content-end">
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
      </Form>
    </Container>
  );
}

export default ApplyDoctor;


