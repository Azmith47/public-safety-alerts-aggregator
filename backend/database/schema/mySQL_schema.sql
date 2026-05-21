-- 2. Lookup Tables (No Foreign Keys)
CREATE TABLE `public-safety-alerts-aggregator`.`categories` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE `public-safety-alerts-aggregator`.`source` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    website_url VARCHAR(255)
);

CREATE TABLE `public-safety-alerts-aggregator`.`regions` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE `public-safety-alerts-aggregator`.`status_types` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE `public-safety-alerts-aggregator`.`severity_levels` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 3. Dependent Geographic Tables
CREATE TABLE `public-safety-alerts-aggregator`.`council_areas` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    region_id INT,
    FOREIGN KEY (region_id) REFERENCES REGIONS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`locations` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    postcode VARCHAR(10),
    council_area_id INT,
    FOREIGN KEY (council_area_id) REFERENCES COUNCIL_AREAS(id)
);

-- 4. User and Alert Tables
CREATE TABLE `public-safety-alerts-aggregator`.`users` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `public-safety-alerts-aggregator`.`alerts` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    external_id VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INT,
    source_id INT,
    location_id INT,
    status_type_id INT,
    severity_level_id INT,
    issued_at DATETIME,
    updated_at DATETIME,
    source_url VARCHAR(255),
    planned BOOLEAN DEFAULT FALSE,
    is_major BOOLEAN DEFAULT FALSE,
    impacting_network BOOLEAN DEFAULT FALSE,
    delay INT DEFAULT 0,
    start_date DATETIME,
    end_date DATETIME,
    raw_payload JSON,
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(id),
    FOREIGN KEY (source_id) REFERENCES SOURCES(id),
    FOREIGN KEY (location_id) REFERENCES LOCATIONS(id),
    FOREIGN KEY (status_type_id) REFERENCES STATUS_TYPES(id),
    FOREIGN KEY (severity_level_id) REFERENCES SEVERITY_LEVELS(id)
);

-- 5. Subscriptions and Notifications
CREATE TABLE `public-safety-alerts-aggregator`.`subscriptions` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT,
    region_id INT,
    council_area_id INT,
    severity_level_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (category_id) REFERENCES CATEGORIES(id),
    FOREIGN KEY (region_id) REFERENCES REGIONS(id),
    FOREIGN KEY (council_area_id) REFERENCES COUNCIL_AREAS(id),
    FOREIGN KEY (severity_level_id) REFERENCES SEVERITY_LEVELS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`notifications` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    alert_id INT NOT NULL,
    sent_status VARCHAR(50),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES USERS(id),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);

-- 6. Alert Details & Spatial Tables
CREATE TABLE `public-safety-alerts-aggregator`.`alerts_to_regions` (
    alert_id INT NOT NULL,
    region_id INT NOT NULL,
    PRIMARY KEY (alert_id, region_id),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id),
    FOREIGN KEY (region_id) REFERENCES REGIONS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`alert_roads` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    main_street VARCHAR(255),
    cross_street VARCHAR(255),
    second_location VARCHAR(255),
    suburb VARCHAR(100),
    region VARCHAR(100),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`alert_links` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    link_text VARCHAR(255),
    link_url VARCHAR(255),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`alert_advice` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    message TEXT,
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`alert_markers` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);

CREATE TABLE `public-safety-alerts-aggregator`.`alert_polygons` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    alert_id INT NOT NULL,
    point_order INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    FOREIGN KEY (alert_id) REFERENCES ALERTS(id)
);