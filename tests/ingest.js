const fs = require("fs");
const mysql = require("mysql2/promise");

// DB credentials
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "CameraMonitorFan47#"/*"Critical_Signal_#47"*/,
  database: "public-safety-alerts-aggregator"
};

// Load JSON file
//const filePath = "./tests/data/traffic_alert.json";
const filePath = "./tests/data/rfs_alert.json";
const rawData = fs.readFileSync(filePath);
const alert = JSON.parse(rawData);

async function ingest() {
  const conn = await mysql.createConnection(dbConfig);

  try {
    console.log("Connected to database");

    // 1. Check if alert already exists
    const [existing] = await conn.execute(
      "SELECT id FROM ALERTS WHERE external_id = ?",
      [alert.id || alert.title]
    );

    if (existing.length > 0) {
      console.log("Alert already exists, skipping insert");
      return;
    }

    // 2. Insert into ALERTS
    const [result] = await conn.execute(
      `INSERT INTO ALERTS 
      (external_id, title, description, issued_at, updated_at, source_url, planned, is_major, impacting_network, delay, start_date, end_date, raw_payload)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        alert.id || alert.title,
        alert.title,
        alert.type || "",
        normalise_date(alert.startDate) || normalise_date(alert.pubDate) || new Date(),
        normalise_date(alert.pubDate) || normalise_date(alert.lastUpdated) || new Date(),
        alert.link || "",
        alert.planned || false,
        alert.isMajor || false,
        alert.impactingNetwork || false,
        alert.delay || 0,
        normalise_date(alert.startDate),
        normalise_date(alert.endDate),
        JSON.stringify(alert)
      ]
    );

    const alertId = result.insertId;
    console.log("Inserted ALERT ID:", alertId);

    // 3. Insert marker point
    if (alert.markerPoint) {
      let lat, lng;

      if (Array.isArray(alert.markerPoint)) {
        lat = alert.markerPoint[0];
        lng = alert.markerPoint[1];
      } else {
        lat = alert.markerPoint.lat;
        lng = alert.markerPoint.lng;
      }

      await conn.execute(
        `INSERT INTO ALERT_MARKERS (alert_id, latitude, longitude)
         VALUES (?, ?, ?)`,
        [alertId, lat, lng]
      );

      console.log("Inserted marker");
    }

    // 4. Insert polygon points (if exists)
    let poly = [];

    if (alert.polygon) {
      console.log("Polygon data found, inserting points...");
      poly = [alert.polygon];
    }
    if (alert.polyline) {
      console.log("Polyline data found, inserting points...");
      poly = [alert.polyline];
    }
    if (poly && poly.length > 0) {
      let order = 0;

      for (const shape of poly) {
        for (const point of shape) {
          await conn.execute(
            `INSERT INTO ALERT_POLYGONS (alert_id, point_order, latitude, longitude)
             VALUES (?, ?, ?, ?)`,
            [alertId, order++, point.lat, point.lng]
          );
        }
      }

      console.log("Inserted poly points");
    }

    console.log("Ingestion complete");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await conn.end();
  }
}

function normalise_date(dateStr) {
  if (!dateStr) return null;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    console.warn("Invalid date format:", dateStr);
    return null;
  }
  return date;
}

ingest();

