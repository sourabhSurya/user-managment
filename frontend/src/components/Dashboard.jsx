import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Modal,
  Box,
  TextField,
  Typography,
  Container,
} from "@mui/material";

import axios from "axios";
import { useHistory } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]); // State for storing users (replace with actual user data)

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [addUserModalOpen, setAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return; // Handle when token is not present, e.g., redirect to login
      }

      const response = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: token,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (userId, name, email) => {
    setEditUserId(userId);
    setEditedName(name);
    setEditedEmail(email);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditUserId(null);
    setEditModalOpen(false);
    fetchUsers();
  };

  const handleSaveChanges = () => {
    // Logic to update user details (replace with actual API call)
    const updatedUsers = users.map((user) => {
      if (user._id === editUserId) {
        return { ...user, name: editedName, email: editedEmail };
      }
      return user;
    });
    setUsers(updatedUsers);
    handleCloseEditModal();

    axios
      .post(`http://localhost:5000/users/${editUserId}`, {
        username: editedName,
        email: editedEmail,
      })
      .then((response) => {
        // Handle successful update
        handleCloseEditModal();
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
  };

  // Function to handle delete button click
  const handleDelete = (userId) => {
    // Logic to handle delete user
    console.log(`Delete user with ID ${userId}`);

    // Assuming you're using axios for HTTP requests
    axios
      .delete(`http://localhost:5000/users/${userId}`)
      .then((response) => {
        // Handle successful deletion
        console.log(`User with ID ${userId} deleted successfully`);
        // Update the user list after deletion (if needed)
        fetchUsers(); // Assuming fetchUsers fetches the updated user list
      })
      .catch((error) => {
        // Handle error
        console.error(`Error deleting user with ID ${userId}`, error);
      });
  };

  const handleAddUser = () => {
    setAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPassword("");
    setAddUserModalOpen(false);
  };

  const handleCreateUser = () => {
    // Logic to create a new user (replace with actual API call)
    axios
      .post("http://localhost:5000/register", {
        username: newUserName,
        email: newUserEmail,
        password: newUserPassword,
      })
      .then((response) => {
        // Handle successful user creation
        console.log("User created:", response.data);
        handleCloseAddUserModal();
        fetchUsers(); // Fetch updated user list after creation
      })
      .catch((error) => {
        // Handle error
        console.error("Error creating user:", error);
      });
  };

  const handleLogout = () => {
    console.log("logged out");
    localStorage.removeItem("token");
    window.location.assign("/login");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        width: "100vw",
        height: "100vh",
        padding: "2rem",
        overflow: "auto",
      }}
    >
      <Box
        sx={{
          width: "90%",
          margin: "0 auto",
          overflow: "auto",
        }}
      >
        <Typography variant="h4" mb={3}>
          Dashboard
        </Typography>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell
                    sx={{
                      display: "flex",
                      gap: "0 1rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleEdit(user._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={editModalOpen} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 400,
            }}
          >
            <Typography variant="h5" mb={2}>
              Edit User Details
            </Typography>
            <TextField
              label="Name"
              fullWidth
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              mb={2}
              sx={{
                marginBottom: "1rem",
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
              mb={2}
              sx={{
                marginBottom: "1rem",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChanges}
            >
              Save Changes
            </Button>
          </Box>
        </Modal>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        sx={{
          position: "absolute",
          top: "2rem",
          right: "1rem",
        }}
      >
        Logout
      </Button>

      <Box
        sx={{
          position: "absolute",
          top: "2rem",
          right: "10rem",
          display: "flex",
          gap: "0 1rem",
        }}
      >
        <Button variant="contained" color="primary" onClick={handleAddUser}>
          Add User
        </Button>

        {/* Logout button (existing code) */}

        {/* Add User Modal */}
        <Modal open={addUserModalOpen} onClose={handleCloseAddUserModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              p: 4,
              width: 400,
            }}
          >
            <Typography variant="h5" mb={2}>
              Add User
            </Typography>
            <TextField
              label="Name"
              fullWidth
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              mb={2}
              sx={{
                marginBottom: "1rem",
              }}
            />
            <TextField
              label="Email"
              fullWidth
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              mb={2}
              sx={{
                marginBottom: "1rem",
              }}
            />

            <TextField
              label="Password"
              fullWidth
              type="password"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              mb={2}
              sx={{
                marginBottom: "1rem",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateUser}
            >
              Create User
            </Button>
          </Box>
        </Modal>
      </Box>
    </Container>
  );
};

export default Dashboard;
