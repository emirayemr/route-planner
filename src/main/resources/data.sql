-- ======================================================================
-- Title: data.sql
-- Purpose: Sample dataset for the Route Planner case study.
-- Notes:
--   - Location codes: airports use IATA (e.g., IST, LHR). Others are custom.
--   - Non-FLIGHT transports get reverse edges auto-added at the end.
-- ======================================================================

-- ======================================================================
-- LOCATIONS
-- ======================================================================
INSERT INTO locations (name, country, city, location_code) VALUES
                                                               -- Istanbul
                                                               ('Taksim Square',                'TR', 'Istanbul', 'TAK'),
                                                               ('Istanbul Airport',             'TR', 'Istanbul', 'IST'),
                                                               ('Sabiha Gokcen Airport',        'TR', 'Istanbul', 'SAW'),
                                                               ('Kadikoy Pier',                 'TR', 'Istanbul', 'KDK'),
                                                               ('Galata Tower',                 'TR', 'Istanbul', 'GLT'),

                                                               -- Izmir
                                                               ('Izmir Adnan Menderes Airport', 'TR', 'Izmir',    'ADB'),
                                                               ('Konak Square',                 'TR', 'Izmir',    'KONAK'),

                                                               -- Antalya
                                                               ('Antalya Airport',              'TR', 'Antalya',  'AYT'),
                                                               ('Kas Marina',                   'TR', 'Antalya',  'KAS'),

                                                               -- London
                                                               ('London Heathrow Airport',      'UK', 'London',   'LHR'),
                                                               ('Wembley Stadium',              'UK', 'London',   'WEM'),
                                                               ('London City Center',           'UK', 'London',   'LONCEN'),

                                                               -- Paris
                                                               ('Paris Charles de Gaulle',      'FR', 'Paris',    'CDG'),
                                                               ('Eiffel Tower',                 'FR', 'Paris',    'EIF'),
                                                               ('Louvre Museum',                'FR', 'Paris',    'LOUVR'),

                                                               -- Frankfurt
                                                               ('Frankfurt Airport',            'DE', 'Frankfurt','FRA'),
                                                               ('Frankfurt Central Station',    'DE', 'Frankfurt','FRAH'),
                                                               ('Romerberg Square',             'DE', 'Frankfurt','ROMER'),

                                                               -- Tokyo
                                                               ('Tokyo Haneda Airport',         'JP', 'Tokyo',    'HND'),
                                                               ('Shinjuku Station',             'JP', 'Tokyo',    'SHINJ'),

                                                               -- New York
                                                               ('John F. Kennedy Airport',      'US', 'New York', 'JFK'),
                                                               ('Times Square',                 'US', 'New York', 'TSQ'),
                                                               ('Central Park',                 'US', 'New York', 'CPARK');

-- ======================================================================
-- TRANSPORTATIONS (GROUND / METRO / RIDE-HAIL)
-- ======================================================================

-- Istanbul city -> airports
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='TAK'  AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'SUBWAY' FROM locations o, locations d WHERE o.location_code='TAK'  AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='TAK'  AND d.location_code='SAW';

-- Kadikoy / Galata -> IST / SAW
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'SUBWAY' FROM locations o, locations d WHERE o.location_code='KDK'  AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='KDK'  AND d.location_code='SAW';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='GLT'  AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='GLT'  AND d.location_code='SAW';

-- Izmir city -> airport
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='KONAK' AND d.location_code='ADB';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'SUBWAY' FROM locations o, locations d WHERE o.location_code='KONAK' AND d.location_code='ADB';

-- Antalya city -> airport
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='KAS'  AND d.location_code='AYT';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='KAS'  AND d.location_code='AYT';

-- London ground options
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='WEM';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='WEM';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'SUBWAY' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='LONCEN';

-- Paris ground options
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='CDG' AND d.location_code='EIF';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='CDG' AND d.location_code='LOUVR';

-- Frankfurt ground options
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'SUBWAY' FROM locations o, locations d WHERE o.location_code='FRA' AND d.location_code='FRAH';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='FRA' AND d.location_code='ROMER';

-- Tokyo ground options
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='HND' AND d.location_code='SHINJ';

-- New York ground options
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'BUS'    FROM locations o, locations d WHERE o.location_code='JFK' AND d.location_code='TSQ';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'UBER'   FROM locations o, locations d WHERE o.location_code='JFK' AND d.location_code='CPARK';

-- ======================================================================
-- FLIGHTS
-- ======================================================================

-- Istanbul <-> major hubs
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='LHR';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='IST';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='CDG';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='CDG' AND d.location_code='IST';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='FRA';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='FRA' AND d.location_code='IST';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='HND';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='HND' AND d.location_code='IST';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='JFK';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='JFK' AND d.location_code='IST';

-- SAW alternatives
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='SAW' AND d.location_code='LHR';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='SAW';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='SAW' AND d.location_code='FRA';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='FRA' AND d.location_code='SAW';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='SAW' AND d.location_code='HND';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='HND' AND d.location_code='SAW';

-- Izmir / Antalya domestic links
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='ADB' AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='ADB';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='AYT' AND d.location_code='IST';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='IST' AND d.location_code='AYT';

-- Europe / long-haul connections
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='CDG';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='CDG' AND d.location_code='LHR';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='FRA';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='FRA' AND d.location_code='LHR';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='HND';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='HND' AND d.location_code='LHR';

INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='LHR' AND d.location_code='JFK';
INSERT INTO transportations (origin_id, destination_id, type)
SELECT o.id, d.id, 'FLIGHT' FROM locations o, locations d WHERE o.location_code='JFK' AND d.location_code='LHR';

-- ======================================================================
-- AUTO-ADD REVERSE EDGES FOR NON-FLIGHT TYPES
-- (Keep ground transports bidirectional unless explicitly inserted)
-- ======================================================================
INSERT INTO transportations (origin_id, destination_id, type)
SELECT t.destination_id, t.origin_id, t.type
FROM transportations t
WHERE t.type <> 'FLIGHT'
  AND NOT EXISTS (
    SELECT 1
    FROM transportations x
    WHERE x.origin_id = t.destination_id
      AND x.destination_id = t.origin_id
      AND x.type = t.type
);
