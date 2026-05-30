# Project Context

Your project is:

* Public Safety Alerts Aggregator & Explorer

A Node.js backend that:

* ingests public safety alerts from multiple NSW sources
* normalizes them into a canonical internal format
* stores them in SQLite
* provides querying/filtering APIs
* supports subscriptions + notifications
* supports geospatial filtering
* supports future self-hosting via Docker

Primary sources currently:

* NSW RFS
* Transport for NSW

Future likely sources:

* BoM
* SES
* Air Quality
* Flood warnings
* Power outages

---

## Current Architecture Direction

You are implementing:

    SOURCE API
        ↓
    Collector
        ↓
    Normalizer
        ↓
    Canonical Alert
        ↓
    Transformer Layer
        ↓
    Persistence Layer
        ↓
    SQLite Database
        ↓
    Query Services
        ↓
    REST API

This is the correct architecture.

---

## Key Architectural Principle

The database layer should **NEVER** know:

* source-specific field names
* raw API formats
* API inconsistencies

Only canonical normalized alerts reach persistence.

## Current Major Components

### 1. Collectors

Folder:

* `data-collection/api_collectors/`

Responsibility:

fetch raw source data **ONLY**

Should **NOT**:

* normalize
* parse
* transform
* persist

---

#### Desired Final Collector Pattern

Example:

``` js
rfsCollector.js
export const run = async () => {

    const response = await fetch(...);

    const data = await response.json();

    return data.features || [];
};
```

---

### 2. Normalizers

Folder:

* `normalization/normalizers/`

Responsibility:

* convert raw source payloads → canonical alert objects

This is the **MOST** important layer.

#### Desired Final Flow:

    RFS raw feature
        ↓
    rfsNormalizer
        ↓
    CanonicalFireAlert

---

### 3. Canonical Models

Folder:

* `normalization/canonical/`

These define:

* internal standardized structure

The **ENTIRE** system should operate on canonical alerts.

Important Rule

Canonical alerts use:

* normalized strings
**NOT**:
* DB IDs

GOOD:

``` js
severity = "EMERGENCY_WARNING"
```

BAD:

``` js
severity_level_id = 4
```

---

### 4. Transformers

Folder:

* `normalization/transformers/`

Responsibility:

map messy source values → standardized internal values

Example:

* `"Emergency Warning" → "EMERGENCY_WARNING"`

---

### 5. Persistence Layer

Folder:

* `services/AlertPersistenceService.js`

Responsibility:

* resolve lookup IDs
* deduplicate
* insert/update alerts
* insert geometry
* insert related entities

Persistence should **ONLY** receive canonical alerts.

---

### 6. DAOs

Folder:

* `database/dao/`

Responsibility:

* database access only

**NO** business logic.

DAO methods should look like:

``` js
findByExternalId()
create()
update()
delete()
```

NOT:

* normalization
* orchestration
* transformations

---

### 7. Query Services

Folder:

* `services/AlertQueryService.js`

Responsibility:

* filtering
* pagination
* sorting
* search
* joins

---

### 8. GeoSpatial Services

Folder:

* `services/GeoSpatialService.js`

Responsibility:

* nearby alerts
* bounding box queries
* polygon handling

SQLite does not support native GIS well, so:

* you are approximating spatial queries manually
* acceptable for university scope

---

### Database Design

Important normalized entities:

#### Lookup Tables

These represent:

* canonical system values

Tables:

* categories
* severity_levels
* status_types
* regions

These should contain:

GOOD:

    EMERGENCY_WARNING
    ROAD_CLOSED
    FIRE

NOT:

    Emergency Warning
    Road Closed

Display formatting belongs in frontend.

---

#### Geographic Hierarchy

    Region
        ↓
    Council Area
        ↓
    Location/Suburb

This is correct.

Your spatial import pipeline is good.

---

#### Alert Relationships

You already support:

* polygons
* markers
* advice
* roads
* links
* regions

Very scalable design.

---

#### Important Schema Improvement Needed

Use:

* soft expiration
* lifecycle management

---

### Recommended Final Ingestion Pipeline

#### Stage 1 — Collect

Collector returns raw source payloads.

---

#### Stage 2 — Normalize

Normalizer converts:

* source-specific structure → canonical structure

---

#### Stage 3 — Transform

Transformer standardizes:

* categories
* severity
* status
* locations
* dates

---

#### Stage 4 — Persist

Persistence resolves:

* lookup IDs
* relationships
* updates/inserts

---

#### Stage 5 — Query APIs

Frontend consumes:

* stable REST APIs
* NOT raw source APIs

---

### Recommended File-by-File Build Order

This is the important part.

You should now proceed in **THIS** order.

---

#### PHASE 1 — Canonical Models

Implement fully first.

Files:

    CanonicalAlert.js
    CanonicalFireAlert.js
    CanonicalTrafficAlert.js
    CanonicalWeatherAlert.js

Goal:

* stable internal schema

---

#### PHASE 2 — Transformers

Implement next.

Files:

    categoryTransformer.js
    severityTransformer.js
    statusTransformer.js
    locationTransformer.js

Add:

* normalizeString()
* enum mapping
* alias handling

---

#### PHASE 3 — Normalizers

Implement after transformers.

Files:

    rfsNormalizer.js
    tfnswNormalizer.js

Goal:

* raw payload → canonical alert

---

#### PHASE 4 — Rewrite Collectors

Simplify collectors heavily.

Collectors should:

* fetch only
* return raw payloads

---

#### PHASE 5 — AlertPersistenceService

Update to consume **ONLY** canonical alerts.

This becomes:

* source-agnostic

Very important.

---

#### PHASE 6 — LookupService

Centralize:

* category lookup
* severity lookup
* status lookup
* source lookup

Avoid duplicate lookup logic everywhere.

---

#### PHASE 7 — Query APIs

Finish:

* filtering
* pagination
* geo queries
* search

---

#### PHASE 8 — Subscription Flow

Implement:

* email verification
* unsubscribe tokens
* rate limiting

---

#### PHASE 9 — Containerization

Later.

But yes:

Podman Rootless
self-hosting
isolated SQLite
isolated email credentials

is the correct direction.

---

### Important Design Principle Going Forward

Every layer should know **LESS** than the previous one.

Example:

* Collector knows:
  * API structure
* Normalizer knows:
    * source semantics
* Persistence knows:
    * DB structure
* Query layer knows:
    * frontend needs
* Frontend knows:
    * presentation only

---

### What You Should Implement NEXT

The BEST next step is:

#### 1. Finish `CanonicalAlert` classes

Because:

* everything depends on them

---

#### 2. Implement ALL transformers

Because:

* every normalizer depends on them

---

#### 3. Implement `rfsNormalizer.js` completely

Then:

* test end-to-end
* validate DB persistence

---

### 4. Then implement `tfnswNormalizer.js`

After RFS pipeline is stable.

Recommended Development Style

Do NOT:

* build everything at once

Do:

* fully complete ONE ingestion pipeline first

Example:

    RFS Collector
    → RFS Normalizer
    → Canonical Alert
    → Persistence
    → Query API

THEN:

add TFNSW

This massively reduces debugging complexity.