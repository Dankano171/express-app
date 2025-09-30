// server.js

const express = require('express');
const app = express();
const PORT = 3000;

// --- 3. Data Management (In-Memory Store) ---
// Initialize a simple data store. IDs will be simple integers.
let items = [
    { id: 1, name: 'Laptop', description: 'A powerful computing device.' },
    { id: 2, name: 'Smartphone', description: 'A portable communication device.' }
];
let nextId = 3; // Counter for new items

// --- 1. Setting Up Middleware ---
// Middleware to parse incoming JSON data (Crucial for POST and PUT requests)
app.use(express.json());

// --- Helper Functions for Validation ---
const validateItem = (item) => {
    if (!item.name || typeof item.name !== 'string' || item.name.trim().length === 0) {
        return 'Item name is required and must be a non-empty string.';
    }
    if (!item.description || typeof item.description !== 'string' || item.description.trim().length === 0) {
        return 'Item description is required and must be a non-empty string.';
    }
    return null; // Validation passed
};

// --- 1. Setting Up API Routes ---

// Root Route: Returns a simple message
app.get('/', (req, res) => {
    res.send('Hello, World! Welcome to the Simple Node.js REST API.');
});

// --- 2. Creating Routes (CRUD Operations) ---

// GET /items - Retrieve all items
app.get('/items', (req, res) => {
    // This is an I/O-bound operation (though currently in-memory)
    // Node.js handles this non-blocking way, ready for concurrent requests.
    res.status(200).json(items);
});

// GET /items/:id - Retrieve a single item by ID
app.get('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    // 4. Validate request parameter
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }
    
    const item = items.find(i => i.id === id);

    // 4. Return appropriate error response (404)
    if (!item) {
        return res.status(404).json({ error: 'Item not found.' });
    }
    res.status(200).json(item);
});

// POST /items - Create a new item
app.post('/items', (req, res) => {
    const newItem = req.body;
    
    // 4. Implement proper validation for incoming data (400)
    const validationError = validateItem(newItem);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    // Assign new ID and add to store
    const itemToAdd = {
        id: nextId++,
        name: newItem.name,
        description: newItem.description
    };
    items.push(itemToAdd);

    // 4. Return meaningful error response (201 Created)
    res.status(201).json(itemToAdd);
});

// PUT /items/:id - Update an item by ID
app.put('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    
    // 4. Validate request parameter & body
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }
    const validationError = validateItem(updatedData);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    const index = items.findIndex(i => i.id === id);

    if (index === -1) {
        // 4. Return appropriate error response (404)
        return res.status(404).json({ error: 'Item not found for update.' });
    }

    // Update the item
    items[index] = {
        id: id,
        name: updatedData.name,
        description: updatedData.description
    };

    res.status(200).json(items[index]);
});

// DELETE /items/:id - Delete an item by ID
app.delete('/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    // 4. Validate request parameter
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid ID format. ID must be an integer.' });
    }

    const initialLength = items.length;
    // Filter out the item with the given ID
    items = items.filter(i => i.id !== id);

    if (items.length === initialLength) {
        // 4. Return appropriate error response (404)
        return res.status(404).json({ error: 'Item not found for deletion.' });
    }

    // 4. Return meaningful error response (204 No Content)
    res.status(204).send();
});


// --- 1. Implement Error Handling for Invalid Routes (404) ---
// This middleware runs if no route above matched the request
app.use((req, res, next) => {
    res.status(404).json({ error: `The requested resource was not found at ${req.originalUrl}` });
});

// --- General Error Handler (500 Internal Server Error) ---
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging
    res.status(500).json({ error: 'An unexpected internal server error occurred.' });
});

// Start the server
server = app.listen(PORT, () => {
    console.log(`Node.js REST API running on http://localhost:${PORT}`);
});
