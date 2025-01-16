async function sendDelete(url, filename) {
  try {
    console.log(url, filename);
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "content-Type": "application/json"
      },
      body: JSON.stringify({
        name: filename
      })
    });
    console.log(response);
    const data = await response.json();
    console.log(data);
    // location.reload();
    return data.message;
  } catch (e) {
    console.log(e);
  }
}