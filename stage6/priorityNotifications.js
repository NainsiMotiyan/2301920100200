const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

// Paste your Bearer token here
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJjc2UyMzMyOEBnbGJpdG0uYWMuaW4iLCJleHAiOjE3ODI0NTQzNTMsImlhdCI6MTc4MjQ1MzQ1MywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6Ijk4MmNjY2ExLWJmMzUtNGNhMi1hN2FhLWVkZWM2OTYxOGZjMyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6Im5haW5zaSBtb3RpeWFuIiwic3ViIjoiNDNmYTRhNWEtOWE3ZC00OWU4LWI2NzItMTZmNmE3YjA5ZDM1In0sImVtYWlsIjoiY3NlMjMzMjhAZ2xiaXRtLmFjLmluIiwibmFtZSI6Im5haW5zaSBtb3RpeWFuIiwicm9sbE5vIjoiMjMwMTkyMDEwMDIwMCIsImFjY2Vzc0NvZGUiOiJ4eGtKbmsiLCJjbGllbnRJRCI6IjQzZmE0YTVhLTlhN2QtNDllOC1iNjcyLTE2ZjZhN2IwOWQzNSIsImNsaWVudFNlY3JldCI6ImJNeVBQcXhwdWRYelFxekoifQ.JXCMP1mhEnDPDNdP0A2pEmlAv-A3PqijqLh0g-sJTbQ";
async function fetchNotifications() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data = await response.json();

    console.log("Notifications fetched successfully.");
    console.log(data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

fetchNotifications();