PRAGMA foreign_keys = ON;

-- Lookup Tables
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    website_url TEXT
);

CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS status_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS severity_levels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT
);

-- Geographic Tables
CREATE TABLE IF NOT EXISTS council_areas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id INTEGER,
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

CREATE TABLE IF NOT EXISTS locations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    postcode TEXT,
    council_area_id INTEGER,
    FOREIGN KEY (council_area_id) REFERENCES council_areas(id)
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category_id INTEGER,
    source_id INTEGER,
    location_id INTEGER,
    status_type_id INTEGER,
    severity_level_id INTEGER,
    issued_at DATETIME,
    updated_at DATETIME,
    source_url TEXT,
    planned INTEGER DEFAULT 0,
    is_major INTEGER DEFAULT 0,
    impacting_network INTEGER DEFAULT 0,
    delay INTEGER DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    raw_payload TEXT,

    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (source_id) REFERENCES sources(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (status_type_id) REFERENCES status_types(id),
    FOREIGN KEY (severity_level_id) REFERENCES severity_levels(id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    region_id INTEGER,
    council_area_id INTEGER,
    severity_level_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (region_id) REFERENCES regions(id),
    FOREIGN KEY (council_area_id) REFERENCES council_areas(id),
    FOREIGN KEY (severity_level_id) REFERENCES severity_levels(id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    alert_id INTEGER NOT NULL,
    sent_status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Alert Region Mapping
CREATE TABLE IF NOT EXISTS alerts_to_regions (
    alert_id INTEGER NOT NULL,
    region_id INTEGER NOT NULL,

    PRIMARY KEY (alert_id, region_id),

    FOREIGN KEY (alert_id) REFERENCES alerts(id),
    FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- Alert Roads
CREATE TABLE IF NOT EXISTS alert_roads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    main_street TEXT,
    cross_street TEXT,
    second_location TEXT,
    suburb TEXT,
    region TEXT,

    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Alert Links
CREATE TABLE IF NOT EXISTS alert_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    link_text TEXT,
    link_url TEXT,

    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Alert Advice
CREATE TABLE IF NOT EXISTS alert_advice (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    message TEXT,

    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Alert Markers
CREATE TABLE IF NOT EXISTS alert_markers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    latitude REAL,
    longitude REAL,

    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);

-- Alert Polygons
CREATE TABLE IF NOT EXISTS alert_polygons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    alert_id INTEGER NOT NULL,
    point_order INTEGER,
    latitude REAL,
    longitude REAL,

    FOREIGN KEY (alert_id) REFERENCES alerts(id)
);