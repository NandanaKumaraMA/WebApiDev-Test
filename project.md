# Taxi Fleet Tracking API — Project Plan

## 1. Overview

A RESTful API for a taxi company to manage its fleet vehicles, track real-time GPS location data, and organize operational hierarchy. Built with Node.js + Express 5, backed by a JSON file (seed data) as the data store.

---

## 2. Data Model

### Entity-Relationship

```
Province (1) ──< (N) District (1) ──< (N) Station (1) ──< (N) Vehicle (1) ──< (N) Ping
```

### 2.1 Province

| Field | Type   | Description              |
|-------|--------|--------------------------|
| id    | number | Primary key              |
| name  | string | Province name (e.g. "Western Province") |

### 2.2 District

| Field       | Type   | Description                  |
|-------------|--------|------------------------------|
| id          | number | Primary key                  |
| name        | string | District name (e.g. "Colombo") |
| province_id | number | Foreign key → Province.id    |

### 2.3 Station

| Field      | Type   | Description                         |
|------------|--------|-------------------------------------|
| id         | number | Primary key                         |
| name       | string | Station name (e.g. "Colombo Police Station") |
| district_id| number | Foreign key → District.id           |

### 2.4 Vehicle

| Field           | Type   | Description                              |
|-----------------|--------|------------------------------------------|
| id              | number | Primary key                              |
| register_number | string | License plate (e.g. "HB-6168")           |
| device_id       | string | On-board GPS device identifier           |
| station_id      | number | Foreign key → Station.id                 |

### 2.5 Ping

| Field      | Type   | Description                                |
|------------|--------|--------------------------------------------|
| id         | number | Primary key                                |
| vehicle_id | number | Foreign key → Vehicle.id                   |
| latitude   | number | GPS latitude (decimal degrees)             |
| longitude  | number | GPS longitude (decimal degrees)            |
| timestamp  | string | ISO 8601 UTC datetime (e.g. "2026-06-14T00:00:00Z") |

---

## 3. API Routes

### 3.1 Provinces

| Method | Path                 | Description              |
|--------|----------------------|--------------------------|
| GET    | /provinces           | List all provinces       |
| GET    | /provinces/:id       | Get a single province    |
| POST   | /provinces           | Create a province        |
| PUT    | /provinces/:id       | Update a province        |
| DELETE | /provinces/:id       | Delete a province        |

### 3.2 Districts

| Method | Path                                | Description                       |
|--------|-------------------------------------|-----------------------------------|
| GET    | /provinces/:provinceId/districts    | List districts in a province      |
| GET    | /districts                          | List all districts                |
| GET    | /districts/:id                      | Get a single district             |
| POST   | /districts                          | Create a district                 |
| PUT    | /districts/:id                      | Update a district                 |
| DELETE | /districts/:id                      | Delete a district                 |

### 3.3 Stations

| Method | Path                            | Description                      |
|--------|---------------------------------|----------------------------------|
| GET    | /districts/:districtId/stations | List stations in a district      |
| GET    | /stations                       | List all stations                |
| GET    | /stations/:id                   | Get a single station             |
| POST   | /stations                       | Create a station                 |
| PUT    | /stations/:id                   | Update a station                 |
| DELETE | /stations/:id                   | Delete a station                 |

### 3.4 Vehicles

| Method | Path                         | Description                              |
|--------|------------------------------|------------------------------------------|
| GET    | /stations/:stationId/vehicles| List vehicles at a station                |
| GET    | /vehicles                    | List all vehicles                        |
| GET    | /vehicles/:id                | Get a vehicle (includes latest ping)     |
| POST   | /vehicles                    | Register a new vehicle                   |
| PUT    | /vehicles/:id                | Update a vehicle                         |
| DELETE | /vehicles/:id                | Delete a vehicle                         |

### 3.5 Pings (GPS Tracking)

| Method | Path                              | Description                              |
|--------|-----------------------------------|------------------------------------------|
| GET    | /vehicles/:vehicleId/pings        | List all pings for a vehicle             |
| GET    | /vehicles/:vehicleId/pings/latest | Get the most recent ping for a vehicle   |
| POST   | /vehicles/:vehicleId/pings        | Record a new GPS ping                    |
| GET    | /pings?vehicle_id=&from=&to=      | Query pings with optional filters        |

---

## 4. Request/Response Representations

### 4.1 Province

```json
// GET /provinces
[
  { "id": 1, "name": "Western Province" },
  { "id": 2, "name": "Central Province" }
]

// GET /provinces/1
{ "id": 1, "name": "Western Province" }

// POST /provinces — Body
{ "name": "New Province" }
```

### 4.2 District (with optional nested province)

```json
// GET /districts/1
{
  "id": 1,
  "name": "Colombo",
  "province_id": 1,
  "province": { "id": 1, "name": "Western Province" }  // ← when ?embed=province
}

// GET /provinces/1/districts
[
  { "id": 1, "name": "Colombo", "province_id": 1 },
  { "id": 2, "name": "Gampaha", "province_id": 1 }
]

// POST /districts — Body
{ "name": "New District", "province_id": 1 }
```

### 4.3 Station (with optional nested district and province)

```json
// GET /stations/1
{
  "id": 1,
  "name": "Colombo Police Station",
  "district_id": 1,
  "district": {                         // ← when ?embed=district
    "id": 1,
    "name": "Colombo",
    "province": { "id": 1, "name": "Western Province" }
  }
}

// POST /stations — Body
{ "name": "New Station", "district_id": 1 }
```

### 4.4 Vehicle (with latest location)

```json
// GET /vehicles/1
{
  "id": 1,
  "register_number": "HB-6168",
  "device_id": "TUK-DEV-520651",
  "station_id": 4,
  "latest_ping": {                      // ← always included
    "id": 49,
    "latitude": 7.330193,
    "longitude": 80.622542,
    "timestamp": "2026-06-16T00:00:00Z"
  },
  "station": {                          // ← when ?embed=station
    "id": 4,
    "name": "Kandy Police Station"
  }
}

// POST /vehicles — Body
{ "register_number": "ABC-1234", "device_id": "DEV-000001", "station_id": 1 }
```

### 4.5 Ping

```json
// POST /vehicles/1/pings — Body
{
  "latitude": 7.312694,
  "longitude": 80.60383,
  "timestamp": "2026-06-14T00:00:00Z"
}

// GET /vehicles/1/pings
[
  {
    "id": 1,
    "vehicle_id": 1,
    "latitude": 7.312694,
    "longitude": 80.60383,
    "timestamp": "2026-06-14T00:00:00Z"
  }
]

// GET /vehicles/1/pings/latest
{
  "id": 49,
  "vehicle_id": 1,
  "latitude": 7.330193,
  "longitude": 80.622542,
  "timestamp": "2026-06-16T00:00:00Z"
}

// GET /pings?vehicle_id=1&from=2026-06-14T00:00:00Z&to=2026-06-15T00:00:00Z
// — returns pings filtered by vehicle and time range
```

### 4.6 Error Response (standard)

```json
{
  "error": "Resource not found",
  "status": 404
}
```

```json
{
  "error": "Validation failed",
  "status": 400,
  "details": [
    { "field": "name", "message": "Name is required" }
  ]
}
```

---

## 5. Query Parameters (Common)

| Parameter | Used On           | Description                          |
|-----------|-------------------|--------------------------------------|
| `?embed=province,district,station` | GET /:resource/:id | Include nested related resources |
| `?vehicle_id=` | GET /pings      | Filter pings by vehicle             |
| `?from=`   | GET /pings        | Start of ISO 8601 time range         |
| `?to=`     | GET /pings        | End of ISO 8601 time range           |

---

## 6. Implementation Notes

- **Express 5** — already set up in `package.json`.
- **Data store** — currently reads from `seed.json` via `db.js`. Future: replace with SQLite/PostgreSQL.
- **ID generation** — auto-increment based on current max ID in the array.
- **Data validation** — validate required fields before insert/update; return 400 with details on failure.
- **404 handling** — return `{ "error": "Resource not found", "status": 404 }` for missing resources.
- **Nested resource routes** — use Express router params (`:provinceId`, `:districtId`, `:stationId`, `:vehicleId`).
- **Typo fixes needed** — `index.js` currently uses `/provinves` instead of `/provinces`.

---

## 7. Suggested Implementation Order

| Step | Work                                   |
|------|----------------------------------------|
| 1    | Fix typos in existing routes           |
| 2    | Implement Province CRUD                |
| 3    | Implement District CRUD + nested routes|
| 4    | Implement Station CRUD + nested routes |
| 5    | Implement Vehicle CRUD                 |
| 6    | Implement Ping recording & querying    |
| 7    | Add `?embed=` expansion support       |
| 8    | Add validation & error handling        |
