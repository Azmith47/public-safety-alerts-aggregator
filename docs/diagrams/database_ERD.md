# Database ERD Diagram

``` mermaid
erDiagram

    %% Users Table
    USERS {
        int id PK "Primary key for user"
        string email "User's email address"
        datetime created_at "Account creation timestamp"
    }

    %% Subscriptions Table
    SUBSCRIPTIONS {
        int id PK "Primary key for subscription"
        int user_id FK "FK to USERS"
        int category_id FK "FK to CATEGORIES"
        int region_id FK "FK to REGIONS"
        int council_area_id FK "FK to COUNCIL_AREAS"
        int severity_level_id FK "FK to SEVERITY_LEVELS"
        datetime created_at "Timestamp when subscription was created"
    }

    %% Notifications Table
    NOTIFICATIONS {
        int id PK "Primary key for notification"
        int user_id FK "FK to USERS"
        int alert_id FK "FK to ALERTS"
        string sent_status "Sent / Pending"
        datetime created_at "Timestamp when notification created"
    }

    %% Alerts Table
    ALERTS {
        int id PK "Primary key for alert"
        string external_id "Unique ID from source"
        string title "Title of the alert"
        string description "Detailed description of alert"
        int category_id FK "FK to CATEGORIES"
        int source_id FK "FK to SOURCES"
        int location_id FK "FK to LOCATIONS"
        int status_type_id FK "FK to STATUS_TYPES"
        int severity_level_id FK "FK to SEVERITY_LEVELS"
        datetime issued_at "Timestamp when alert was issued"
        datetime updated_at "Timestamp when alert was last updated"
        string source_url "Direct link back to original source"
    }

    %% Alerts to Regions (many-to-many)
    ALERTS_TO_REGIONS {
        int alert_id FK "FK to ALERTS"
        int region_id FK "FK to REGIONS"
    }

    %% Spatial Data: Marker Points
    ALERT_MARKERS {
        int id PK "Primary key for marker"
        int alert_id FK "FK to ALERTS"
        float latitude "Marker latitude"
        float longitude "Marker longitude"
    }

    %% Spatial Data: Polygon Points
    ALERT_POLYGONS {
        int id PK "Primary key for polygon point"
        int alert_id FK "FK to ALERTS"
        int point_order "Order to reconstruct polygon"
        float latitude "Polygon point latitude"
        float longitude "Polygon point longitude"
    }

    %% Lookup Tables
    CATEGORIES {
        int id PK "Category ID"
        string name "Category name, e.g., Bush Fire, Flood"
    }

    SOURCES {
        int id PK "Source ID"
        string name "Source agency, e.g., RFS, SES"
        string website_url "URL of the source"
    }

    REGIONS {
        int id PK "Region ID"
        string name "Region name, e.g., Northern NSW"
    }

    COUNCIL_AREAS {
        int id PK "Council area ID"
        string name "Council area name"
        int region_id FK "FK to REGIONS"
    }

    LOCATIONS {
        int id PK "Location ID"
        string name "Suburb / street name"
        string postcode "Postcode"
        int council_area_id FK "FK to COUNCIL_AREAS"
    }

    STATUS_TYPES {
        int id PK "Status type ID"
        string name "e.g., Active, Expired"
    }

    SEVERITY_LEVELS {
        int id PK "Severity level ID"
        string name "Severity name, e.g., Advice, Watch & Act"
        string description "Optional description of severity"
    }

    %% Relationships
    USERS ||--o{ SUBSCRIPTIONS : "has subscriptions"
    USERS ||--o{ NOTIFICATIONS : "receives notifications"
    
    ALERTS ||--o{ NOTIFICATIONS : "triggers notifications"
    ALERTS ||--o{ ALERT_MARKERS : "has marker points"
    ALERTS ||--o{ ALERT_POLYGONS : "has polygon points"
    ALERTS ||--o{ ALERTS_TO_REGIONS : "linked to regions"

    SUBSCRIPTIONS }o--|| CATEGORIES : "filters by category"
    SUBSCRIPTIONS }o--|| REGIONS : "filters by region"
    SUBSCRIPTIONS }o--|| COUNCIL_AREAS : "filters by council area"
    SUBSCRIPTIONS }o--|| SEVERITY_LEVELS : "filters by severity"
    
    ALERTS }o--|| CATEGORIES : "belongs to category"
    ALERTS }o--|| SOURCES : "from source"
    ALERTS }o--|| LOCATIONS : "occurs at location"
    ALERTS }o--|| STATUS_TYPES : "has status"
    ALERTS }o--|| SEVERITY_LEVELS : "has severity level"
    
    LOCATIONS }o--|| COUNCIL_AREAS : "belongs to council area"
    COUNCIL_AREAS }o--|| REGIONS : "belongs to region"
    
    ALERTS_TO_REGIONS }o--|| REGIONS : "maps to"
```

``` mermaid
erDiagram

    %% Users Table
    USERS {
        int id PK
        string email
        datetime created_at
        %% User's email and creation timestamp
    }

    %% Subscriptions Table
    SUBSCRIPTIONS {
        int id PK
        int user_id FK
        int category_id FK
        int region_id FK
        int council_area_id FK
        int severity_level_id FK
        datetime created_at
        %% Links users to their alert preferences / filters
    }

    %% Notifications Table
    NOTIFICATIONS {
        int id PK
        int user_id FK
        int alert_id FK
        string sent_status
        datetime created_at
        %% Stores which notifications have been sent or pending
    }

    %% Alerts Table
    ALERTS {
        int id PK
        string external_id
        string title
        string description
        int category_id FK
        int source_id FK
        int location_id FK
        int status_type_id FK
        int severity_level_id FK
        datetime issued_at
        datetime updated_at
        string source_url
        %% Stores alert info including link back to source
    }

    %% Alerts-to-Regions (many-to-many)
    ALERTS_TO_REGIONS {
        int alert_id FK
        int region_id FK
        %% Allows an alert to be linked to multiple regions
    }

    %% Spatial Data
    ALERT_MARKERS {
        int id PK
        int alert_id FK
        float latitude
        float longitude
        %% Single marker point for alert location
    }

    ALERT_POLYGONS {
        int id PK
        int alert_id FK
        int point_order
        float latitude
        float longitude
        %% Polygon points to define affected area
    }

    %% Lookup Tables
    CATEGORIES {
        int id PK
        string name
    }

    SOURCES {
        int id PK
        string name
        string website_url
    }

    REGIONS {
        int id PK
        string name
    }

    COUNCIL_AREAS {
        int id PK
        string name
        int region_id FK
    }

    LOCATIONS {
        int id PK
        string name
        string postcode
        int council_area_id FK
    }

    STATUS_TYPES {
        int id PK
        string name
    }

    SEVERITY_LEVELS {
        int id PK
        string name
        string description
    }

    %% Relationships
    USERS ||--o{ SUBSCRIPTIONS : "has subscriptions"
    USERS ||--o{ NOTIFICATIONS : "receives notifications"
    
    ALERTS ||--o{ NOTIFICATIONS : "triggers notifications"
    ALERTS ||--o{ ALERT_MARKERS : "has marker points"
    ALERTS ||--o{ ALERT_POLYGONS : "has polygon points"
    ALERTS ||--o{ ALERTS_TO_REGIONS : "linked to regions"

    SUBSCRIPTIONS }o--|| CATEGORIES : "filters by category"
    SUBSCRIPTIONS }o--|| REGIONS : "filters by region"
    SUBSCRIPTIONS }o--|| COUNCIL_AREAS : "filters by council area"
    SUBSCRIPTIONS }o--|| SEVERITY_LEVELS : "filters by severity"
    
    ALERTS }o--|| CATEGORIES : "belongs to category"
    ALERTS }o--|| SOURCES : "from source"
    ALERTS }o--|| LOCATIONS : "occurs at location"
    ALERTS }o--|| STATUS_TYPES : "has status"
    ALERTS }o--|| SEVERITY_LEVELS : "has severity level"
    
    LOCATIONS }o--|| COUNCIL_AREAS : "belongs to council area"
    COUNCIL_AREAS }o--|| REGIONS : "belongs to region"
    
    ALERTS_TO_REGIONS }o--|| REGIONS : "maps to"
```