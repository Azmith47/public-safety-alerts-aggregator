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
        string sent_status "Delivery status (e.g., Sent, Pending, Failed)"
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
        bool planned "Indicates if event is planned (Transport NSW)"
        bool is_major "Indicates if alert is classified as major"
        bool impacting_network "Indicates if alert impacts transport network"
        int delay "Delay in minutes (traffic-related alerts)"
        datetime start_date "Start time of planned or ongoing event"
        datetime end_date "Expected end time of event"
        string raw_payload "Raw JSON/XML payload from source for traceability and debugging"
    }

    %% Alerts to Regions (many-to-many)
    ALERTS_TO_REGIONS {
        int alert_id FK "FK to ALERTS"
        int region_id FK "FK to REGIONS"
    }

    %% Road-specific data (Transport NSW)
    ALERT_ROADS {
        int id PK "Primary key"
        int alert_id FK "FK to ALERTS"
        string main_street "Primary road affected"
        string cross_street "Cross street reference"
        string second_location "Secondary location reference"
        string suburb "Suburb(s) affected"
        string region "Region label provided by source (may differ from internal mapping)"
    }

    %% Related links (Transport NSW)
    ALERT_LINKS {
        int id PK "Unique identifier for related link"
        int alert_id FK "Associated alert"
        string link_text "Display text for link"
        string link_url "External URL for additional information"
    }

    %% Advice messages (Transport NSW + RFS)
    ALERT_ADVICE {
        int id PK "Unique identifier for advice message"
        int alert_id FK "Associated alert"
        string message "Advice text for users (e.g., 'Exercise caution')"
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
        string name "Category name (e.g., Bush Fire, Flood, Traffic)"
    }

    SOURCES {
        int id PK "Source ID"
        string name "Source system (e.g., RFS, SES, Transport NSW)"
        string website_url "Base URL of source provider"
    }

    REGIONS {
        int id PK "Region ID"
        string name "Region name (e.g., Northern Rivers, Sydney Metro)"
    }

    COUNCIL_AREAS {
        int id PK "Council area ID"
        string name "Local government area name"
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
        string name "Standardised status (e.g., Active, Under Control, Ended)"
    }

    SEVERITY_LEVELS {
        int id PK "Severity level ID"
        string name "Severity name (e.g., Advice, Watch & Act)"
        string description "Optional description of severity"
    }

    %% Relationships
    USERS ||--o{ SUBSCRIPTIONS : "has subscriptions"
    USERS ||--o{ NOTIFICATIONS : "receives notifications"
    
    ALERTS ||--o{ NOTIFICATIONS : "triggers notifications"
    ALERTS ||--o{ ALERT_MARKERS : "has marker points"
    ALERTS ||--o{ ALERT_POLYGONS : "has polygon points"
    ALERTS ||--o{ ALERTS_TO_REGIONS : "linked to regions"
    ALERTS ||--o{ ALERT_ROADS : "has road segments"
    ALERTS ||--o{ ALERT_ADVICE : "has advice messages"
    ALERTS ||--o{ ALERT_LINKS : "has related links"

    ALERTS }o--|| CATEGORIES : "belongs to category"
    ALERTS }o--|| SOURCES : "originates from source"
    ALERTS }o--|| LOCATIONS : "mapped to primary location"
    ALERTS }o--|| STATUS_TYPES : "has operational status"
    ALERTS }o--|| SEVERITY_LEVELS : "has severity level"

    SUBSCRIPTIONS }o--|| CATEGORIES : "filters by category"
    SUBSCRIPTIONS }o--|| REGIONS : "filters by region"
    SUBSCRIPTIONS }o--|| COUNCIL_AREAS : "filters by council area"
    SUBSCRIPTIONS }o--|| SEVERITY_LEVELS : "filters by severity"    
    
    LOCATIONS }o--|| COUNCIL_AREAS : "belongs to council area"
    COUNCIL_AREAS }o--|| REGIONS : "belongs to region"
    
    ALERTS_TO_REGIONS }o--|| REGIONS : "maps alert to affected regions"
```