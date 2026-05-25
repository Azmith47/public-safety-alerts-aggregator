import AlertDAO from "../database/dao/AlertDAO.js";
import AlertMarkerDAO from "../database/dao/AlertMarkersDAO.js";
import AlertPolygonDAO from "../database/dao/AlertPolygonDAO.js";
import AlertRoadDAO from "../database/dao/AlertRoadDAO.js";
import AlertAdviceDAO from "../database/dao/AlertAdviceDAO.js";
import AlertLinkDAO from "../database/dao/AlertLinkDAO.js";
import AlertRegionDAO from "../database/dao/AlertRegionDAO.js";
import NotificationDAO from "../database/dao/NotificationDAO.js";

class MaintenanceService {
    constructor() {
        this.alertRetentionDays = parseInt(process.env.ALERT_RETENTION_DAYS, 10) || 30;
        this.notificationRetentionDays = parseInt(process.env.NOTIFICATION_RETENTION_DAYS, 10) || 30;
    }

    _buildThreshold(days) {
        return `datetime('now', '-${days} days')`;
    }

    async getExpiredAlertIds(days) {
        const threshold = this._buildThreshold(days);
        const records = await AlertDAO.all(
            `SELECT id FROM ${AlertDAO.tableName} WHERE (end_date IS NOT NULL AND end_date < ${threshold}) OR (end_date IS NULL AND issued_at IS NOT NULL AND issued_at < ${threshold})`
        );
        return records.map(record => record.id);
    }

    async _deleteAlertData(alertIds) {
        if (!alertIds || !alertIds.length) {
            return { deletedAlerts: 0 };
        }

        const placeholders = alertIds.map(() => "?").join(",");

        await AlertMarkerDAO.delete(AlertMarkerDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertPolygonDAO.delete(AlertPolygonDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertRoadDAO.delete(AlertRoadDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertAdviceDAO.delete(AlertAdviceDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertLinkDAO.delete(AlertLinkDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertRegionDAO.delete(AlertRegionDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await NotificationDAO.delete(NotificationDAO.tableName, `alert_id IN (${placeholders})`, alertIds);
        await AlertDAO.delete(AlertDAO.tableName, `id IN (${placeholders})`, alertIds);

        return { deletedAlerts: alertIds.length };
    }

    async cleanupExpiredAlerts(days = this.alertRetentionDays) {
        const expiredAlertIds = await this.getExpiredAlertIds(days);
        if (!expiredAlertIds.length) {
            return { expiredAlerts: 0, message: `No alerts older than ${days} days were found.` };
        }

        const result = await AlertDAO.transaction(async () => {
            return await this._deleteAlertData(expiredAlertIds);
        });

        return {
            expiredAlerts: result.deletedAlerts,
            thresholdDays: days
        };
    }

    async cleanupOldNotifications(days = this.notificationRetentionDays) {
        const threshold = this._buildThreshold(days);
        const result = await NotificationDAO.delete(
            NotificationDAO.tableName,
            `created_at < ${threshold}`
        );
        return {
            cleanedNotifications: result.changes || 0,
            thresholdDays: days
        };
    }

    async cleanup() {
        const alertResult = await this.cleanupExpiredAlerts();
        const notificationResult = await this.cleanupOldNotifications();
        return {
            alertRetentionDays: this.alertRetentionDays,
            notificationRetentionDays: this.notificationRetentionDays,
            ...alertResult,
            ...notificationResult
        };
    }
}

export default new MaintenanceService();
