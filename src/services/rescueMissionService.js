// src/services/rescueMissionService.js

import { fetchWithAuth } from "./apiClient";

const BASE = "/RescueMission";

/* ================= COMPLETE MISSION ================= */

export const completeMission = async (rescueMissionID) => {
  if (!rescueMissionID) {
    throw new Error("rescueMissionID is required");
  }

  const json = await fetchWithAuth(`${BASE}/complete`, {
    method: "PUT",
    body: JSON.stringify({ rescueMissionID }),
  });

  if (!json?.success) {
    throw new Error(json?.message || "Complete mission failed");
  }

  return json.content;
};

/* ================= SERVICE ================= */

export const rescueMissionService = {
  /* -------- DISPATCH (Coordinator) -------- */

  dispatch: async ({ rescueRequestID, rescueTeamID }) => {
    const res = await fetchWithAuth(`${BASE}/dispatch`, {
      method: "POST",
      body: JSON.stringify({
        rescueRequestID,
        rescueTeamID,
      }),
    });

    return await res.json();
  },

  /* -------- ACCEPT / REJECT -------- */

  respond: async ({ rescueMissionID, isAccepted, rejectReason }) => {
    const res = await fetchWithAuth(`${BASE}/respond`, {
      method: "POST",
      body: JSON.stringify({
        rescueMissionID,
        isAccepted,
        rejectReason: rejectReason ?? null,
      }),
    });

    return await res.json();
  },

  /* -------- CONFIRM PICKUP -------- */

  confirmPickup: ({ rescueMissionID, reliefOrderID }) => {
    if (!rescueMissionID || !reliefOrderID) {
      throw new Error("rescueMissionID and reliefOrderID are required");
    }

    return fetchWithAuth(`${BASE}/confirm-pickup`, {
      method: "PUT",
      body: JSON.stringify({
        rescueMissionID,
        reliefOrderID,
      }),
    });
  },

  /* ================= LOAD MISSIONS ================= */

  /* -------- FILTER MISSIONS (MAIN API) -------- */

  filter: async ({ rescueTeamID, statuses, pageNumber = 1, pageSize = 20 }) => {
    const params = new URLSearchParams();

    if (rescueTeamID) params.append("RescueTeamID", rescueTeamID);

    if (statuses) {
      statuses.forEach((s) => params.append("Statuses", s));
    }

    params.append("PageNumber", pageNumber);
    params.append("PageSize", pageSize);

    const res = await fetchWithAuth(`${BASE}/filter?${params.toString()}`, {
      method: "GET",
    });

    const json = await res.json(); // 🔥 THIẾU DÒNG NÀY

    return json;
  },
  /* -------- GET MISSION DETAIL -------- */

  getById: (id) => {
    return fetchWithAuth(`${BASE}/${id}`, {
      method: "GET",
    });
  },

  /* -------- TEAM MEMBERS -------- */

  getTeamMembers: (teamId) => {
    return fetchWithAuth(`${BASE}/teams/${teamId}/members`, {
      method: "GET",
    });
  },
};
