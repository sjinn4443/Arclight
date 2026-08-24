from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

import httpx

from .config import Settings


class RailwayStatusClient:
    """Read-only Railway GraphQL client with deliberately narrow responses."""

    def __init__(self, settings: Settings):
        self._settings = settings

    def _query(self, query: str, variables: dict[str, Any]) -> dict[str, Any]:
        if not self._settings.railway_project_token:
            raise RuntimeError("railway_token_not_configured")
        response = httpx.post(
            self._settings.railway_api_url,
            headers={
                "Project-Access-Token": self._settings.railway_project_token,
                "Content-Type": "application/json",
            },
            json={"query": query, "variables": variables},
            timeout=10.0,
        )
        response.raise_for_status()
        payload = response.json()
        if payload.get("errors") or not isinstance(payload.get("data"), dict):
            raise RuntimeError("railway_graphql_error")
        return payload["data"]

    def deployment(self) -> dict[str, Any]:
        result: dict[str, Any] = {
            "status": "running",
            "deployment_id": self._settings.railway_deployment_id or None,
            "deployed_sha": self._settings.railway_git_commit_sha or None,
        }
        if not all(
            (
                self._settings.railway_project_token,
                self._settings.railway_project_id,
                self._settings.railway_environment_id,
                self._settings.railway_service_id,
            )
        ):
            result["api_check"] = "not_configured"
            return result

        query = """
        query latestDeployment($input: DeploymentListInput!) {
          deployments(input: $input, first: 1) {
            edges { node { id status createdAt } }
          }
        }
        """
        try:
            data = self._query(
                query,
                {
                    "input": {
                        "projectId": self._settings.railway_project_id,
                        "environmentId": self._settings.railway_environment_id,
                        "serviceId": self._settings.railway_service_id,
                    }
                },
            )
            edges = data.get("deployments", {}).get("edges", [])
            if not edges:
                result.update(status="unknown", api_check="no_deployment")
                return result
            node = edges[0].get("node", {})
            result.update(
                status=str(node.get("status", "unknown")).lower(),
                deployment_id=node.get("id") or result["deployment_id"],
                deployed_at=node.get("createdAt"),
                api_check="ok",
            )
            return result
        except Exception:
            result["api_check"] = "unavailable"
            return result

    def backup(self) -> dict[str, Any]:
        if not self._settings.postgres_volume_instance_id:
            return {
                "status": "unknown",
                "configured": False,
                "error_code": "postgres_volume_not_configured",
            }
        if not self._settings.railway_project_token:
            return {
                "status": "unknown",
                "configured": False,
                "error_code": "railway_project_token_not_configured",
            }

        query = """
        query backupStatus($volumeInstanceId: String!) {
          volumeInstanceBackupList(volumeInstanceId: $volumeInstanceId) {
            id name createdAt expiresAt usedMB referencedMB
          }
          volumeInstanceBackupScheduleList(volumeInstanceId: $volumeInstanceId) {
            id name cron kind retentionSeconds createdAt
          }
        }
        """
        try:
            data = self._query(
                query,
                {"volumeInstanceId": self._settings.postgres_volume_instance_id},
            )
            backups = data.get("volumeInstanceBackupList") or []
            schedules = data.get("volumeInstanceBackupScheduleList") or []
            created_values = [item.get("createdAt") for item in backups if item.get("createdAt")]
            latest = max(created_values) if created_values else None
            age_hours = None
            if latest:
                parsed = datetime.fromisoformat(str(latest).replace("Z", "+00:00"))
                age_hours = round((datetime.now(UTC) - parsed).total_seconds() / 3600, 1)
            schedule_kinds = sorted(
                {str(item.get("kind", "unknown")).lower() for item in schedules}
            )
            has_daily = any("daily" in kind for kind in schedule_kinds)
            return {
                "status": "ok" if backups and schedules else "degraded",
                "configured": True,
                "backup_count": len(backups),
                "latest_backup_at": latest,
                "latest_backup_age_hours": age_hours,
                "schedule_count": len(schedules),
                "schedule_kinds": schedule_kinds,
                "daily_schedule_present": has_daily,
                "latest_backup_within_36_hours": (age_hours is not None and age_hours <= 36),
            }
        except Exception:
            return {
                "status": "unknown",
                "configured": True,
                "error_code": "railway_backup_api_unavailable",
            }
