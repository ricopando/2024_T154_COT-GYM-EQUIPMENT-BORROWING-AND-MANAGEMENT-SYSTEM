const Equipment = [
    {
        "id": "1",
        "equipmentNumber": "EQ001",
        "name": "Treadmill",
        "category": "sports equipment",
        "description": "A high-quality treadmill for running and walking.",
        "image": "https://example.com/images/treadmill.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "2",
        "equipmentNumber": "EQ002",
        "name": "Weight Bench",
        "category": "sports equipment",
        "description": "A sturdy weight bench for strength training.",
        "image": "https://example.com/images/weight_bench.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "3",
        "equipmentNumber": "EQ003",
        "name": "Yoga Mat",
        "category": "sports equipment",
        "description": "A comfortable mat for yoga and exercises.",
        "image": "https://example.com/images/yoga_mat.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "4",
        "equipmentNumber": "EQ004",
        "name": "Office Chair",
        "category": "furniture",
        "description": "An ergonomic office chair for comfort.",
        "image": "https://example.com/images/office_chair.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "5",
        "equipmentNumber": "EQ005",
        "name": "Projector",
        "category": "electronics",
        "description": "A portable projector for presentations.",
        "image": "https://example.com/images/projector.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "6",
        "equipmentNumber": "EQ006",
        "name": "Dumbbells Set",
        "category": "sports equipment",
        "description": "A set of adjustable dumbbells for strength training.",
        "image": "https://example.com/images/dumbbells.jpg",
        "status": "borrowed",
        "borrowedBy": "60d5f8a0c8c45f3f2456e5f8", // Example ObjectId of a user
        "reservation": []
    },
    {
        "id": "7",
        "equipmentNumber": "EQ007",
        "name": "Lounge Sofa",
        "category": "furniture",
        "description": "A cozy lounge sofa for relaxation.",
        "image": "https://example.com/images/lounge_sofa.jpg",
        "status": "under maintenance",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "8",
        "equipmentNumber": "EQ008",
        "name": "Smart TV",
        "category": "electronics",
        "description": "A 55-inch smart TV with streaming capabilities.",
        "image": "https://example.com/images/smart_tv.jpg",
        "status": "reserved",
        "borrowedBy": null,
        "reservation": [
            {
                "userId": "60d5f8a0c8c45f3f2456e5f9", // Example ObjectId of a user
                "reserveDate": "2024-10-20T10:00:00Z",
                "duration": 3 // Reserved for 3 days
            }
        ]
    },
    {
        "id": "9",
        "equipmentNumber": "EQ009",
        "name": "Foldable Table",
        "category": "furniture",
        "description": "A convenient foldable table for events.",
        "image": "https://example.com/images/foldable_table.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    },
    {
        "id": "10",
        "equipmentNumber": "EQ010",
        "name": "Cycling Machine",
        "category": "sports equipment",
        "description": "An indoor cycling machine for cardio workouts.",
        "image": "https://example.com/images/cycling_machine.jpg",
        "status": "available",
        "borrowedBy": null,
        "reservation": []
    }
];

export default Equipment;
