const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3001;

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to SQLite database
const path = require('path');
const dbPath = path.join(__dirname, 'caipu.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to the caipu SQLite database.");
  }
});

// API endpoint for recipes
app.get("/api/recipes", (req, res) => {
  let sql = "SELECT * FROM recipes";
  const params = [];

  if (req.query.query) {
    const searchQuery = `%${req.query.query}%`;
    sql += ` WHERE title LIKE ? OR id LIKE ?`;
    params.push(searchQuery, searchQuery);
  } else if (Object.keys(req.query).length > 0) {
    sql += " WHERE 1=1";
    for (const key in req.query) {
      const allowedColumns = [
        "id",
        "did",
        "cid",
        "zid",
        "title",
        "thumb",
        "videourl",
        "desc",
        "difficulty",
        "costtime",
        "tip",
        "yl",
        "fl",
        "steptext",
        "steppic",
        "grade",
        "up",
        "viewnum",
        "favnum",
        "outdate",
        "status",
        "健康度",
        "制作难易",
        "制作速度",
        "素食偏好",
        "辛辣程度",
        "甜度",
      ];

      if (allowedColumns.includes(key)) {
        sql += ` AND ${key} LIKE ?`;
        params.push(`%${req.query[key]}%`);
      }
    }
  }

  sql += " LIMIT 12";

  db.all(sql, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint for updating a recipe
app.put("/api/recipes/:id", (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  // 验证必需字段
  if (!updateData.title) {
    return res.status(400).json({ error: "Title is required." });
  }

  // 构建动态更新SQL
  const allowedFields = [
    'title', 'yl', 'steptext', 'did', 'cid', 'zid', 'difficulty', 
    'costtime', 'grade', 'thumb', 'videourl', 'desc', 'tip', 'fl', 
    'steppic', 'up', 'viewnum', 'favnum', 'outdate', 'status',
    '健康度', '制作难易', '制作速度', '素食偏好', '辛辣程度', '甜度'
  ];

  const updateFields = [];
  const updateValues = [];

  // 只更新提供的字段
  for (const field of allowedFields) {
    if (updateData.hasOwnProperty(field)) {
      updateFields.push(`${field} = ?`);
      updateValues.push(updateData[field]);
    }
  }

  if (updateFields.length === 0) {
    return res.status(400).json({ error: "No valid fields to update." });
  }

  updateValues.push(id); // 添加WHERE条件的ID

  const sql = `UPDATE recipes SET ${updateFields.join(', ')} WHERE id = ?`;
  
  db.run(sql, updateValues, function (err) {
    if (err) {
      console.error('Database update error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ message: "Recipe not found or no changes made." });
    } else {
      // 返回更新后的数据
      db.get("SELECT * FROM recipes WHERE id = ?", [id], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.json({
          message: "Recipe updated successfully",
          changes: this.changes,
          recipe: row
        });
      });
    }
  });
});

// API endpoint for recipe recommendations based on preferences
app.post("/api/recommendations", (req, res) => {
  const preferences = req.body;
  
  // Validate preferences
  if (!preferences || typeof preferences !== 'object') {
    return res.status(400).json({ error: "Invalid preferences data" });
  }

  // Build SQL query to get recipes with scoring and randomization
  let sql = `
    SELECT *,
    (
      ABS(健康度 - ?) * 1.0 +
      ABS((10 - 制作难易) - ?) * 1.0 +
      ABS(制作难易 - ?) * 1.0 +
      ABS(制作速度 - ?) * 1.0 +
      ABS(素食偏好 - ?) * 1.0 +
      ABS(辛辣程度 - ?) * 1.0
    ) as preference_distance
    FROM recipes 
    WHERE title IS NOT NULL AND title != ''
    ORDER BY preference_distance ASC, RANDOM()
    LIMIT 20
  `;

  const params = [
    preferences.healthy || 5,
    preferences.simple || 5,
    preferences.difficulty || 5,
    preferences.quick || 5,
    preferences.vegetarian || 5,
    preferences.spicy || 5
  ];

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Add diversity by filtering out repeated dishes and shuffling results
    const diverseResults = [];
    const seenTitles = new Set();
    
    // First, add dishes with different preference distances to ensure variety
    const distanceGroups = {};
    rows.forEach(row => {
      const distance = Math.floor(row.preference_distance);
      if (!distanceGroups[distance]) {
        distanceGroups[distance] = [];
      }
      distanceGroups[distance].push(row);
    });
    
    // Take at most 2 dishes from each distance group, with special handling for problematic dishes
    const problematicDishes = ['酸菜猪肉水饺']; // Add dishes that appear too frequently
    
    Object.keys(distanceGroups).sort((a, b) => a - b).forEach(distance => {
      const group = distanceGroups[distance];
      // Shuffle the group and take up to 2 dishes
      const shuffled = group.sort(() => Math.random() - 0.5);
      
      // For the first distance group, reduce chance of problematic dishes appearing first
      if (distance === Object.keys(distanceGroups).sort((a, b) => a - b)[0]) {
        const nonProblematic = shuffled.filter(dish => !problematicDishes.includes(dish.title));
        const problematic = shuffled.filter(dish => problematicDishes.includes(dish.title));
        
        // 70% chance to prioritize non-problematic dishes
        const finalOrder = Math.random() < 0.7 ? [...nonProblematic, ...problematic] : shuffled;
        
        finalOrder.slice(0, 2).forEach(dish => {
          if (diverseResults.length < 12 && !seenTitles.has(dish.title)) {
            diverseResults.push(dish);
            seenTitles.add(dish.title);
          }
        });
      } else {
        shuffled.slice(0, 2).forEach(dish => {
          if (diverseResults.length < 12 && !seenTitles.has(dish.title)) {
            diverseResults.push(dish);
            seenTitles.add(dish.title);
          }
        });
      }
    });
    
    // If we still need more dishes, add remaining ones
    if (diverseResults.length < 12) {
      rows.forEach(row => {
        if (diverseResults.length < 12 && !seenTitles.has(row.title)) {
          diverseResults.push(row);
          seenTitles.add(row.title);
        }
      });
    }
    
    res.json(diverseResults.slice(0, 12));
  });
});

// Start the server
app.get("/", (req, res) => {
  res.send("Welcome to the Caipu API! Try /api/recipes or /api/recommendations");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
