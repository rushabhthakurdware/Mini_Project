import apiClient from './apiClient';
import { Report, MediaItem } from '@/lib/types';

export async function createReport(
    title: string,
    description: string,
    location: { lat: number, lng: number, address?: string } = { lat: 21.1458, lng: 79.0882, address: 'LocationName' },
    category: "pothole" | "streetlight" | "garbage" | "water" | "other" = "other",
    mediaList?: MediaItem[],
    status?: "submitted" | "in-progress" | "resolved",
): Promise<Report | null> {
    try {
        // Map to strict backend input requirements
        const payload = {
            location: {
                lat: location.lat,
                lon: location.lng
            },
            asset: {
                type: category || "road",
                geometry: {
                    area_m2: 1.0 // Default or estimated
                }
            },
            description: description,
            title: title,
            // Additional fields expected by analyze-complete
            severity_override: "moderate"
        };

const res = await apiClient.post("/analyze-issue", {
  report: {
    damage_severity: 0.7,
    confidence_score: 0.8,
    days_unresolved: 5,
    lat: location.lat,
    lon: location.lng
  },
  asset: {
    asset_type: "road",
    severity_level: "moderate",
    geometry: { area_m2: 1.0 }
  }
});

        console.log("Report submitted successfully:", res.data);

        // Return a mock Report object since the backend returns a different structure
        return {
            _id: res.data.issue_id,
            title: title,
            description: description,
            location: location,
            category: category,
            media: [],
            createdBy: { _id: "user", name: "User", email: "", role: "citizen" },
            createdByName: "User",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: "submitted"
        };
    } catch (error: any) {
        console.error("Error creating report:", error.response?.data || error.message);
        return null;
    }
}

export async function getReports(): Promise<Report[]> {
    try {
        const res = await apiClient.get("/health");

        console.log("Health response:", res.data);

        return [{
            _id: "1",
            title: "Backend Connected",
            description: `Status: ${res.data.status}`,
            category: "other",
            location: { lat: 0, lng: 0 },
            media: [],
            status: "submitted",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdByName: "System",
            createdBy: { _id: "sys", name: "System", email: "", role: "admin" }
        }];
    } catch (error: any) {
        console.error("Error fetching reports:", error.response?.data || error.message);
        return [];
    }
}


/*not workig?? */
export async function getReportById(reportId: string): Promise<Report[]> {
    // Not implemented in new backend
    return [];
}

// ... getMyReports, updateReportStatus, editMyReport functions updated similarly

export async function getMyReports(): Promise<Report[]> {
    // Alias to getReports for now
    return getReports();
}

/**
 * ADMIN: Update a report's status and/or assigned user.
 */
export async function updateReportStatus(reportId: string, status?: string, assignedTo?: string): Promise<Report | null> {
    try {
        const payload: { status?: string; assignedTo?: string } = {};
        if (status) payload.status = status;
        if (assignedTo) payload.assignedTo = assignedTo;

        // ✅ Uses the central apiClient directly
        const res = await apiClient.put(`/reports/${reportId}`, payload);
        return res.data.data;
    } catch (error: any) {
        console.error("Error updating report:", error.response?.data || error.message);
        return null;
    }
}


/**
 * USER: Edit the title and description of their own report.
 */
export async function editMyReport(reportId: string, title: string, description: string): Promise<Report | null> {
    try {
        // ✅ Uses the central apiClient directly
        const res = await apiClient.put(`/reports/my/${reportId}`, { title, description });
        return res.data.data;
    } catch (error: any) {
        console.error("Error editing report:", error.response?.data || error.message);
        return null;
    }
}

export { Report };
