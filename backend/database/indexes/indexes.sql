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

CREATE INDEX IF NOT EXISTS idx_alerts_source_external
ON alerts(source_id, external_id);

CREATE INDEX IF NOT EXISTS idx_alerts_updated_at
ON alerts(updated_at);

CREATE INDEX IF NOT EXISTS idx_alerts_source_updated_at
ON alerts(source_id, updated_at);

CREATE INDEX IF NOT EXISTS idx_alerts_category
ON alerts(category_id);

CREATE INDEX IF NOT EXISTS idx_alerts_issued_at
ON alerts(issued_at);

CREATE INDEX IF NOT EXISTS idx_alerts_severity_level
ON alerts(severity_level_id);

CREATE INDEX IF NOT EXISTS idx_alerts_status
ON alerts(status_type_id);

CREATE INDEX IF NOT EXISTS idx_alerts_end_date
ON alerts(end_date);

CREATE INDEX IF NOT EXISTS idx_alerts_is_active_issued_at
ON alerts(is_active, issued_at);

-- Composite index to accelerate queries filtering by category and severity and
-- ordering by issued time (common for list endpoints and dashboards).
CREATE INDEX IF NOT EXISTS idx_alerts_category_severity_issued
ON alerts(category_id, severity_level_id, issued_at);

CREATE INDEX IF NOT EXISTS idx_alert_markers_lat_lng
ON alert_markers(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_alert_polygons_lat_lng
ON alert_polygons(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_source_health_source_id
ON source_health(source_id);

CREATE INDEX IF NOT EXISTS idx_alerts_category_issued_at
ON alerts(category_id, issued_at);

CREATE INDEX IF NOT EXISTS idx_alerts_severity_issued_at
ON alerts(severity_level_id, issued_at);

CREATE INDEX IF NOT EXISTS idx_alert_roads_alert_id
ON alert_roads(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_links_alert_id
ON alert_links(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_advice_alert_id
ON alert_advice(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_fire_details_alert_id
ON alert_fire_details(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_markers_alert_id
ON alert_markers(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_markers_lat_lng
ON alert_markers(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_alert_polygons_alert_id
ON alert_polygons(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_polygons_lat_lng
ON alert_polygons(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_alert_polylines_alert_id
ON alert_polylines(alert_id);

CREATE INDEX IF NOT EXISTS idx_alert_polylines_lat_lng
ON alert_polylines(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_alerts_to_regions_region_id
ON alerts_to_regions(region_id);

CREATE INDEX IF NOT EXISTS idx_notifications_alert_id
ON notifications(alert_id);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id
ON notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_source_health_source_id
ON source_health(source_id);
