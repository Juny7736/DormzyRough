import express from 'express';
import pool from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all properties
router.get('/', async (req, res) => {
  try {
    // Get query parameters for filtering
    const { 
      minPrice, 
      maxPrice, 
      bedrooms, 
      bathrooms, 
      city, 
      state,
      limit = 20,
      offset = 0
    } = req.query;
    
    // Build the query with potential filters
    let query = `
      SELECT p.*, 
        GROUP_CONCAT(DISTINCT pi.image_url) as images,
        GROUP_CONCAT(DISTINCT pa.amenity) as amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
    `;
    
    const queryParams = [];
    const conditions = [];
    
    if (minPrice) {
      conditions.push('p.price >= ?');
      queryParams.push(minPrice);
    }
    
    if (maxPrice) {
      conditions.push('p.price <= ?');
      queryParams.push(maxPrice);
    }
    
    if (bedrooms) {
      conditions.push('p.bedrooms = ?');
      queryParams.push(bedrooms);
    }
    
    if (bathrooms) {
      conditions.push('p.bathrooms = ?');
      queryParams.push(bathrooms);
    }
    
    if (city) {
      conditions.push('p.city LIKE ?');
      queryParams.push(`%${city}%`);
    }
    
    if (state) {
      conditions.push('p.state LIKE ?');
      queryParams.push(`%${state}%`);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Group by property ID to handle the GROUP_CONCAT
    query += ' GROUP BY p.id';
    
    // Add pagination
    query += ' LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), Number(offset));
    
    const [rows] = await pool.query(query, queryParams);
    
    // Format the results
    const properties = Array.isArray(rows) ? rows.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: {
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        coordinates: {
          lat: property.lat,
          lng: property.lng
        }
      },
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      images: property.images ? property.images.split(',') : [],
      amenities: property.amenities ? property.amenities.split(',') : [],
      hostId: property.host_id,
      createdAt: property.created_at,
      updatedAt: property.updated_at
    })) : [];
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get property by ID
router.get('/:id', async (req, res) => {
  try {
    const [propertyRows] = await pool.query(
      'SELECT * FROM properties WHERE id = ?',
      [req.params.id]
    );
    
    if (Array.isArray(propertyRows) && propertyRows.length === 0) {
      return res.status(404).json({ error: 'Property not found' });
    }
    
    const property = propertyRows[0];
    
    // Get property images
    const [imageRows] = await pool.query(
      'SELECT image_url FROM property_images WHERE property_id = ?',
      [req.params.id]
    );
    
    // Get property amenities
    const [amenityRows] = await pool.query(
      'SELECT amenity FROM property_amenities WHERE property_id = ?',
      [req.params.id]
    );
    
    // Format the response
    const formattedProperty = {
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: {
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        coordinates: {
          lat: property.lat,
          lng: property.lng
        }
      },
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      images: Array.isArray(imageRows) ? imageRows.map(img => img.image_url) : [],
      amenities: Array.isArray(amenityRows) ? amenityRows.map(a => a.amenity) : [],
      hostId: property.host_id,
      createdAt: property.created_at,
      updatedAt: property.updated_at
    };
    
    res.json(formattedProperty);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create a new property
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      size,
      images,
      amenities,
      hostId
    } = req.body;
    
    const propertyId = uuidv4();
    
    // Insert property
    await connection.query(
      `INSERT INTO properties (
        id, title, description, price, address, city, state, zip_code, 
        lat, lng, bedrooms, bathrooms, size, host_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        propertyId, title, description, price, 
        location.address, location.city, location.state, location.zipCode,
        location.coordinates?.lat, location.coordinates?.lng,
        bedrooms, bathrooms, size, hostId
      ]
    );
    
    // Insert images
    if (Array.isArray(images) && images.length > 0) {
      const imageValues = images.map(imageUrl => [uuidv4(), propertyId, imageUrl]);
      
      await connection.query(
        'INSERT INTO property_images (id, property_id, image_url) VALUES ?',
        [imageValues]
      );
    }
    
    // Insert amenities
    if (Array.isArray(amenities) && amenities.length > 0) {
      const amenityValues = amenities.map(amenity => [uuidv4(), propertyId, amenity]);
      
      await connection.query(
        'INSERT INTO property_amenities (id, property_id, amenity) VALUES ?',
        [amenityValues]
      );
    }
    
    await connection.commit();
    
    res.status(201).json({ 
      id: propertyId, 
      message: 'Property created successfully' 
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  } finally {
    connection.release();
  }
});

// Update a property
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      size,
      images,
      amenities
    } = req.body;
    
    // Update property
    const [result] = await connection.query(
      `UPDATE properties SET 
        title = ?, 
        description = ?, 
        price = ?, 
        address = ?, 
        city = ?, 
        state = ?, 
        zip_code = ?, 
        lat = ?, 
        lng = ?, 
        bedrooms = ?, 
        bathrooms = ?, 
        size = ?
      WHERE id = ?`,
      [
        title, description, price, 
        location.address, location.city, location.state, location.zipCode,
        location.coordinates?.lat, location.coordinates?.lng,
        bedrooms, bathrooms, size,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Property not found' });
    }
    
    // Update images - delete existing and insert new ones
    if (Array.isArray(images)) {
      await connection.query('DELETE FROM property_images WHERE property_id = ?', [req.params.id]);
      
      if (images.length > 0) {
        const imageValues = images.map(imageUrl => [uuidv4(), req.params.id, imageUrl]);
        
        await connection.query(
          'INSERT INTO property_images (id, property_id, image_url) VALUES ?',
          [imageValues]
        );
      }
    }
    
    // Update amenities - delete existing and insert new ones
    if (Array.isArray(amenities)) {
      await connection.query('DELETE FROM property_amenities WHERE property_id = ?', [req.params.id]);
      
      if (amenities.length > 0) {
        const amenityValues = amenities.map(amenity => [uuidv4(), req.params.id, amenity]);
        
        await connection.query(
          'INSERT INTO property_amenities (id, property_id, amenity) VALUES ?',
          [amenityValues]
        );
      }
    }
    
    await connection.commit();
    
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  } finally {
    connection.release();
  }
});

// Get properties by host ID
router.get('/host/:hostId', async (req, res) => {
  try {
    const query = `
      SELECT p.*, 
        GROUP_CONCAT(DISTINCT pi.image_url) as images,
        GROUP_CONCAT(DISTINCT pa.amenity) as amenities
      FROM properties p
      LEFT JOIN property_images pi ON p.id = pi.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      WHERE p.host_id = ?
      GROUP BY p.id
    `;
    
    const [rows] = await pool.query(query, [req.params.hostId]);
    
    // Format the results
    const properties = Array.isArray(rows) ? rows.map(property => ({
      id: property.id,
      title: property.title,
      description: property.description,
      price: property.price,
      location: {
        address: property.address,
        city: property.city,
        state: property.state,
        zipCode: property.zip_code,
        coordinates: {
          lat: property.lat,
          lng: property.lng
        }
      },
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      size: property.size,
      images: property.images ? property.images.split(',') : [],
      amenities: property.amenities ? property.amenities.split(',') : [],
      hostId: property.host_id,
      createdAt: property.created_at,
      updatedAt: property.updated_at
    })) : [];
    
    res.json(properties);
  } catch (error) {
    console.error('Error fetching host properties:', error);
    res.status(500).json({ error: 'Failed to fetch host properties' });
  }
});

export default router;