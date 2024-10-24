const users = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john.doe@example.com",
        "role": "student",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5f8",
                "borrowDate": "2024-10-20T10:30:00Z",
                "returnDate": "2024-10-27T10:30:00Z",
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane.smith@example.com",
        "role": "teaching personnel",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5fa",
                "borrowDate": "2024-10-22T12:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "3",
        "name": "Alice Johnson",
        "email": "alice.johnson@example.com",
        "role": "non-teaching personnel",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5fb",
                "borrowDate": "2024-10-15T08:00:00Z",
                "returnDate": "2024-10-22T08:00:00Z",
                "status": "returned"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "4",
        "name": "Bob Brown",
        "email": "bob.brown@example.com",
        "role": "student",
        "borrowedItems": [],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "5",
        "name": "Karen White",
        "email": "karen.white@example.com",
        "role": "teaching personnel",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5fc",
                "borrowDate": "2024-10-21T09:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "6",
        "name": "Michael Green",
        "email": "michael.green@example.com",
        "role": "non-teaching personnel",
        "borrowedItems": [],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "7",
        "name": "Sara Lee",
        "email": "sara.lee@example.com",
        "role": "student",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5fd",
                "borrowDate": "2024-10-18T14:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "8",
        "name": "David Wilson",
        "email": "david.wilson@example.com",
        "role": "teaching personnel",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5fe",
                "borrowDate": "2024-10-23T10:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "9",
        "name": "Laura Adams",
        "email": "laura.adams@example.com",
        "role": "non-teaching personnel",
        "borrowedItems": [],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "10",
        "name": "Chris Martin",
        "email": "chris.martin@example.com",
        "role": "student",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e5ff",
                "borrowDate": "2024-10-20T15:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    },
    {
        "id": "11",
        "name": "Jessica Taylor",
        "email": "jessica.taylor@example.com",
        "role": "teaching personnel",
        "borrowedItems": [
            {
                "equipmentId": "60d5f8a0c8c45f3f2456e600",
                "borrowDate": "2024-10-24T11:00:00Z",
                "returnDate": null,
                "status": "borrowed"
            }
        ],
        "createdAt": "2024-10-19T10:30:00Z",
        "updatedAt": "2024-10-19T10:30:00Z"
    }
]
export default users;