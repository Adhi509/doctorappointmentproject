import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Container } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [userid, setUserid] = useState();
  const [type, setType] = useState();

  // Fetch logged-in user's info
  const getUser = async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/getUserData',
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setUserid(res.data.data._id);
        setType(res.data.data.isdoctor);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Memoized: Fetch normal user appointments
  const getUserAppointment = useCallback(async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/user/user-appointments',
        { userid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userid]);

  // Memoized: Fetch doctor appointments
  const getDoctorAppointment = useCallback(async () => {
    try {
      const res = await axios.post(
        'http://localhost:5000/api/doctor/doctor-appointments',
        { doctorId: userid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  }, [userid]);

  // Run once: get user info
  useEffect(() => {
    getUser();
  }, []);

  // Run after userid & type are set
  useEffect(() => {
    if (userid && type !== undefined) {
      if (type) {
        getDoctorAppointment();
      } else {
        getUserAppointment();
      }
    }
  }, [userid, type, getDoctorAppointment, getUserAppointment]);

  return (
    <div>
      <h4 className="p-3 text-center">Your Appointments</h4>
      <Container>
        <Table striped bordered hover className="my-3">
          <thead>
            <tr>
              <th>Doctor Name</th>
              <th>Specialization</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((record) => (
                <tr key={record._id}>
                  <td>{record.doctorInfo?.fullName}</td>
                  <td>{record.doctorInfo?.specialization}</td>
                  <td>{record.date}</td>
                  <td>{record.time}</td>
                  <td>{record.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>
                  <Alert variant="info" className="text-center mb-0">
                    No appointments to show
                  </Alert>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default UserAppointments;


