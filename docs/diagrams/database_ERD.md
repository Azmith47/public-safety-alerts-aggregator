# Database ERD Diagram

``` mermaid
erDiagram

    %% Tables
    USERS {
        int id PK
        string email
        datetime created_at
    }

    SUBSCRIPTIONS {
        int id PK
        int user_id FK
        int category_id FK
        int region_id FK
        int council_area_id FK
        string severity
        datetime created_at
    }

    NOTIFICATIONS {
        int id PK
        int user_id FK
        int alert_id FK
        string sent_status
        datetime created_at
    }

    ALERTS {
        int id PK
        string external_id
        string title
        string description
        int category_id FK
        int source_id FK
        int location_id FK
        string status
        string severity
        float latitude
        float longitude
        datetime issued_at
        datetime updated_at
        string source_url
    }

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

    %% Relationships
    USERS ||--o{ SUBSCRIPTIONS : "has"
    USERS ||--o{ NOTIFICATIONS : "receives"
    
    ALERTS ||--o{ NOTIFICATIONS : "triggers"
    
    SUBSCRIPTIONS }o--|| CATEGORIES : "filters by"
    SUBSCRIPTIONS }o--|| REGIONS : "filters by"
    SUBSCRIPTIONS }o--|| COUNCIL_AREAS : "filters by"
    
    ALERTS }o--|| CATEGORIES : "belongs to"
    ALERTS }o--|| SOURCES : "from"
    ALERTS }o--|| LOCATIONS : "occurs at"
    
    LOCATIONS }o--|| COUNCIL_AREAS : "belongs to"
    COUNCIL_AREAS }o--|| REGIONS : "belongs to"
```