
async function verifyQuizAPI() {
  const baseUrl = "http://localhost:3000/api";
  
  console.log("1. Fetching public quiz questions...");
  try {
    const publicRes = await fetch(`${baseUrl}/quiz`);
    console.log("Public API Status:", publicRes.status);
    
    if (publicRes.status === 200) {
        const responseData = await publicRes.json();
        // Check for standard response wrapper
        if (responseData.success === false || responseData.error) {
           console.error("❌ API returned error:", responseData.error || responseData.message);
        } else if (responseData.data) {
           console.log("✅ Public API is accessible. Questions count:", responseData.data.length);
        } else {
           console.log("⚠️ API returned unexpected format (migth be direct array):", Array.isArray(responseData) ? responseData.length : responseData);
        }
    } else {
        const text = await publicRes.text();
        console.error(`❌ Public API failed (${publicRes.status}):`, text.substring(0, 200));
    }
  } catch (error) {
    console.error("❌ Fetch error:", error);
  }
}

verifyQuizAPI();
