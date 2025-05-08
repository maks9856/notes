import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export default function useAutoTokenRefresh() {
    useEffect(() => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        if (!accessToken || !refreshToken) return;

        let timeoutId;

        try {
            const decoded = jwtDecode(accessToken);
            const now = Date.now() / 1000;
            const expiresIn = decoded.exp - now;

            if (expiresIn <= 60) return;

            timeoutId = setTimeout(async () => {
                try {
                    const res = await api.post("api/user/token/refresh/", {
                        refresh: refreshToken,
                    });

                    if (res.status === 200) {
                        const { access, refresh } = res.data;
                        localStorage.setItem(ACCESS_TOKEN, access);
                        localStorage.setItem(REFRESH_TOKEN, refresh);
                    } else {
                        console.warn("Failed to auto-refresh token");
                    }
                } catch (err) {
                    console.error("Auto token refresh error:", err);
                }
            }, (expiresIn - 60) * 1000);
        } catch (e) {
            console.error("Token decode error:", e);
        }

        return () => clearTimeout(timeoutId);
    }, []);
}
