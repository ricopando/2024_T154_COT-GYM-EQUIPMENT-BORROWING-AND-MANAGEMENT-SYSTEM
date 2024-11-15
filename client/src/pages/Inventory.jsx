import React, { useEffect, useState } from 'react';
import {
  Box,
  Flex,
  Text,
  Spinner,
  Alert,
  Button,
  Input,
  useToast,
  Stack,
  FormControl,
  FormLabel,
  Select,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  IconButton,
  Center,
  useBreakpointValue,
  useDisclosure
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Inventory = () => {
  const [userdata, setUserdata] = useState(null);
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [newEquipment, setNewEquipment] = useState({
    name: '',
    description: '',
    category: 'Electronics',
    serialNumber: '',
    image: '',
    availabilityStatus: 'Available',
    model: '',
    additionalInfo: '',
  });
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const toast = useToast();
  const navigate = useNavigate();
  
  const { isOpen, onToggle } = useDisclosure(); // For toggling sidebar
  const isSidebarDefaultOpen = useBreakpointValue({ base: false, md: true }); // Sidebar open by default on larger screens

  const [isSidebarOpen, setIsSidebarOpen] = useState(isSidebarDefaultOpen);

  useEffect(() => {
    setIsSidebarOpen(isSidebarDefaultOpen);
  }, [isSidebarDefaultOpen]);

  const handleSidebarToggle = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    getUser();
    fetchEquipment();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = searchQuery
      ? equipmentItems.filter(item =>
          ['name', 'description', 'category', 'serialNumber']
            .some(key => item[key].toLowerCase().includes(lowercasedQuery))
        )
      : equipmentItems;
    
    setFilteredItems(filtered);
  
    // If the filteredItems length is less than currentPage * itemsPerPage, reset to the last valid page
    if (filtered.length <= (currentPage - 1) * itemsPerPage) {
      setCurrentPage(Math.ceil(filtered.length / itemsPerPage)); // Set to the last page
    } else {
      setCurrentPage(1); // Reset to page 1 if filtering results in a smaller dataset
    }
  }, [searchQuery, equipmentItems]);

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/auth/status', { withCredentials: true });
      setUserdata(response.data.user);
      setIsAdmin(response.data.user.role === 'Admin');
      if (!response.data.user) {
        navigate('/');
      }
    } catch {
      navigate('/');
      setError('An error occurred while fetching user data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipment');
      setEquipmentItems(response.data);
    } catch {
      setError('Failed to fetch equipment data.');
    }
  };

  const handleAddOrEditEquipment = async () => {
    try {
      if (isEditMode) {
        await axios.put(`http://localhost:8000/api/equipment/${selectedItem._id}`, newEquipment);
        setEquipmentItems(equipmentItems.map(item => item._id === selectedItem._id ? newEquipment : item));
        toast({ title: 'Equipment updated successfully', status: 'success', isClosable: true });
      } else {
        const response = await axios.post('http://localhost:8000/api/equipment', newEquipment);
        setEquipmentItems([...equipmentItems, response.data]);
        toast({ title: 'Equipment added successfully', status: 'success', isClosable: true });
      }
      closeModal();
    } catch {
      toast({ title: 'Failed to save equipment.', status: 'error', isClosable: true });
    }
  };

  const handleDeleteEquipment = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/equipment/${id}`);
      setEquipmentItems(equipmentItems.filter(item => item._id !== id));
      toast({ title: 'Equipment deleted successfully.', status: 'success', isClosable: true });
    } catch {
      toast({ title: 'Failed to delete equipment.', status: 'error', isClosable: true });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setNewEquipment({
      name: '',
      description: '',
      category: 'Electronics',
      serialNumber: '',
      image: '',
      availabilityStatus: 'Available',
      model: '',
      additionalInfo: '',
    });
  };

  const paginatedItems = filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Center h="100vh"><Spinner size="xl" /></Center>;
  if (error) return <Center h="100vh"><Alert status="error">{error}</Alert> </Center>;
  if (!isAdmin) return <Center h="100vh"><Alert status="error">You are not authorized to access this page.</Alert></Center>;

  return (
    <Box width="100vw" height="100vh" overflow="hidden">
      <Flex direction="column" height="100%">
        <Navbar userdata={userdata} onSidebarToggle={handleSidebarToggle} />
        <Flex flex="1" direction="row" overflow="hidden">
          <Sidebar userdata={userdata} isSidebarOpen={isSidebarOpen} onSidebarToggle={handleSidebarToggle} />

          <Box bg="#F7FAFC" flex="1" p="6" overflowY="auto">
            <Text fontSize="2xl" fontWeight="bold" color="#2D3748" mb="6">Inventory Management</Text>
            <Flex justify="space-between" mb="4">
              <Input placeholder="Search all fields..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <Button colorScheme="teal" onClick={() => setIsModalOpen(true)}>Add New Equipment</Button>
            </Flex>
            <Table variant="striped" colorScheme="teal">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Description</Th>
                  <Th>Category</Th>
                  <Th>Serial Number</Th>
                  <Th>Image</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedItems.map((item, index) => (
                  <Tr key={item._id}>
                    <Td>{(currentPage - 1) * itemsPerPage + index + 1}</Td>
                    <Td>{item.name}</Td>
                    <Td>{item.description}</Td>
                    <Td>{item.category}</Td>
                    <Td>{item.serialNumber}</Td>
                    <Td><img src={item.image} alt={item.name} width="50" height="50" /></Td>
                    <Td>
                      <ButtonGroup>
                        <IconButton
                          icon={<MdEdit />}
                          onClick={() => {
                            setIsEditMode(true);
                            setSelectedItem(item);
                            setNewEquipment(item);
                            setIsModalOpen(true);
                          }}
                          colorScheme="blue"
                        />
                        <IconButton
                          icon={<MdDelete />}
                          onClick={() => handleDeleteEquipment(item._id)}
                          colorScheme="red"
                        />
                      </ButtonGroup>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Flex justify="center" mt="4">
  <ButtonGroup>
    <Button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
    <Button>{currentPage}</Button>
    <Button disabled={(currentPage * itemsPerPage) >= filteredItems.length} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
  </ButtonGroup>
</Flex>
          </Box>
        </Flex>
      </Flex>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isEditMode ? 'Edit Equipment' : 'Add New Equipment'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  value={newEquipment.name}
                  onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  value={newEquipment.description}
                  onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select
                  value={newEquipment.category}
                  onChange={(e) => setNewEquipment({ ...newEquipment, category: e.target.value })}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Sports">Sports</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Serial Number</FormLabel>
                <Input
                  value={newEquipment.serialNumber}
                  onChange={(e) => setNewEquipment({ ...newEquipment, serialNumber: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Model</FormLabel>
                <Input
                  value={newEquipment.model}
                  onChange={(e) => setNewEquipment({ ...newEquipment, model: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={newEquipment.image}
                  onChange={(e) => setNewEquipment({ ...newEquipment, image: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Availability Status</FormLabel>
                <Select
                  value={newEquipment.availabilityStatus}
                  onChange={(e) => setNewEquipment({ ...newEquipment, availabilityStatus: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Borrow">Borrow</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Additional Information</FormLabel>
                <Input
                  value={newEquipment.additionalInfo}
                  onChange={(e) => setNewEquipment({ ...newEquipment, additionalInfo: e.target.value })}
                />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handleAddOrEditEquipment}>
              {isEditMode ? 'Save Changes' : 'Add Equipment'}
            </Button>
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Inventory;
