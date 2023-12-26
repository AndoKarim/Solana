const removeCallback = async () => {
    try {
        const response = await fetch(
            "https://api.shyft.to/sol/v1/callback/remove",
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': '4TRQjXoLAkXRY289'
                },
                body: JSON.stringify({
                    "id": "*"
                }),
            }
        );
        const data = await response.json();
        console.log(data);
    } catch (e) {
        console.error("callback removal error", e);
    }
}
removeCallback();
