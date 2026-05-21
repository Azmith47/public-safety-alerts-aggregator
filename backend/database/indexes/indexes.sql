CREATE INDEX IF NOT EXISTS idx_regions_name
ON regions(name);

CREATE INDEX IF NOT EXISTS idx_locations_name
ON locations(name);

CREATE INDEX IF NOT EXISTS idx_locations_postcode
ON locations(postcode);

CREATE INDEX IF NOT EXISTS idx_council_areas_name
ON council_areas(name);

CREATE INDEX IF NOT EXISTS idx_alerts_external_id
ON alerts(external_id);

CREATE INDEX IF NOT EXISTS idx_alerts_updated_at
ON alerts(updated_at);

CREATE INDEX IF NOT EXISTS idx_alerts_category
ON alerts(category_id);

CREATE INDEX IF NOT EXISTS idx_alerts_issued_at
ON alerts(issued_at);

CREATE INDEX IF NOT EXISTS idx_alerts_severity_level
ON alerts(severity_level_id);

CREATE INDEX IF NOT EXISTS idx_alerts_status
ON alerts(status_type_id);

-- Composite index to accelerate queries filtering by category and severity and
-- ordering by issued time (common for list endpoints and dashboards).
CREATE INDEX IF NOT EXISTS idx_alerts_category_severity_issued
ON alerts(category_id, severity_level_id, issued_at);