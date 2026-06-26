import { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notifications";

export function useNotifications({
  page = 1,
  filter = "All",
  limit = 10,
}) {
  const [notifications, setNotifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadNotifications();
  }, [page, filter]);

  async function loadNotifications() {
    try {
      setLoading(true);
      setError("");

      const data = await fetchNotifications({
        page,
        limit,
        notification_type: filter,
      });

      setNotifications(data);

      // The current API doesn't return total records,
      // so this can be updated later if pagination metadata is added.
      setTotal(data.length);
      setTotalPages(1);
    } catch (err) {
      setError(err.message || "Something went wrong");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }

  return {
    notifications,
    total,
    totalPages,
    loading,
    error,
  };
}