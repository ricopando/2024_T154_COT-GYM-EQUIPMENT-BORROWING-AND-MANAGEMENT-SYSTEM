import React, { useEffect, useState } from "react";
import { Box, SimpleGrid, Card, CardHeader, CardBody, Image, Text, Button, useBreakpointValue, Stack, Badge, Flex, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select } from "@chakra-ui/react";
import Navbar from '../components/NavbarUser'; // Import Navbar Component
import axios from 'axios';

function UserDashboard() {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(''); // New state for selected category
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedItem, setSelectedItem] = useState(null);

  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchEquipment();
  }, []);

  // Fetch equipment items from the backend
  const fetchEquipment = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/equipment');
      setEquipmentItems(response.data);
    } catch (error) {
      console.error("Error fetching equipment:", error);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedItem(item);
    onOpen();
  };

  // Group items by category
  const groupedByCategory = equipmentItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  // Filter items based on the search query and selected category
  const filteredItems = Object.keys(groupedByCategory).reduce((acc, category) => {
    // Apply category filter if any
    if (selectedCategory && selectedCategory !== category) return acc;

    const filteredCategoryItems = groupedByCategory[category].filter((item) => {
      const lowerCaseQuery = searchQuery.toLowerCase();
      return (
        item.name.toLowerCase().includes(lowerCaseQuery) ||
        item.description.toLowerCase().includes(lowerCaseQuery) ||
        item.category.toLowerCase().includes(lowerCaseQuery) ||
        item.serialNumber.toLowerCase().includes(lowerCaseQuery)
      );
    });

    if (filteredCategoryItems.length > 0) {
      acc[category] = filteredCategoryItems;
    }
    return acc;
  }, {});

  return (
    <Box>
      {/* Navbar */}
      <Navbar /> {/* Use Navbar here */}

      {/* Search and Category Filter */}
      <Box p={6} mb={6} display="flex" flexDirection="column" gap={4}>
        <Input
          placeholder="Search equipment..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="lg"
        />
        
        {/* Category Filter */}
        <Select
          placeholder="Filter by category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          size="lg"
        >
          <option value="">All Categories</option>
          {Object.keys(groupedByCategory).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </Box>

      {/* Equipment Cards Display */}
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6}>Equipment Inventory</Text>

        {/* Render equipment by category */}
        {Object.keys(filteredItems).length === 0 ? (
          <Text>No results found for "{searchQuery}"</Text>
        ) : (
          Object.keys(filteredItems).map((category) => (
            <Box key={category} mb={8}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>{category}</Text>
              
              {/* SimpleGrid to display cards in a responsive layout */}
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {filteredItems[category].map((item) => (
                  <Card
                    key={item._id}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    _hover={{ boxShadow: "md", transform: "scale(1.05)" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                    onClick={() => handleViewDetails(item)}
                  >
                    <CardHeader>
                      <Image
                        src={item.image || 'https://via.placeholder.com/150'}
                        alt={item.name}
                        borderRadius="md"
                        boxSize="200px"
                        objectFit="cover"
                        mx="auto"
                      />
                    </CardHeader>
                    <CardBody>
                      <Text fontSize="xl" fontWeight="bold" mb={2}>{item.name}</Text>
                      <Text fontSize="md" color="gray.600" mb={2}>{item.description}</Text>
                      <Text fontSize="sm" color="gray.500" mb={2}>Category: {item.category}</Text>
                      <Text fontSize="sm" color="gray.500" mb={2}>Serial Number: {item.serialNumber}</Text>
                      <Stack direction="row" mt={4} spacing={4}>
                        <Badge colorScheme="blue">{item.availabilityStatus}</Badge>
                        <Button colorScheme="blue" width="100%">View Details</Button>
                      </Stack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </Box>
          ))
        )}
      </Box>

      {/* Modal to view more details of the selected item */}
      {selectedItem && (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent maxWidth="600px" mx="auto">
            <ModalHeader>{selectedItem.name}</ModalHeader>
            <ModalBody>
              <Flex direction="column" align="center" mb={4}>
                <Image
                  src={selectedItem.image || 'https://via.placeholder.com/150'}
                  alt={selectedItem.name}
                  boxSize="250px"
                  objectFit="cover"
                  mb={4}
                />
                <Text fontSize="lg" fontWeight="bold">{selectedItem.name}</Text>
                <Text fontSize="md" color="gray.600" mt={2}>{selectedItem.description}</Text>
                <Text fontSize="sm" color="gray.500" mt={2}>Category: {selectedItem.category}</Text>
                <Text fontSize="sm" color="gray.500" mt={2}>Serial Number: {selectedItem.serialNumber}</Text>
                <Text fontSize="md" color="gray.700" mt={4} fontWeight="bold">Additional Info</Text>
                <Text color="gray.500" mt={2}>{selectedItem.additionalInfo}</Text>
                <Stack direction="row" mt={4} spacing={4}>
                  <Badge colorScheme="green">{selectedItem.availabilityStatus}</Badge>
                  <Button colorScheme="blue">Add to Cart</Button>
                </Stack>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button variant="outline" onClick={onClose} mr={3}>Close</Button>
              <Button colorScheme="blue" onClick={() => { /* Handle Add to Cart Logic */ }}>Add to Cart</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

export default UserDashboard;
