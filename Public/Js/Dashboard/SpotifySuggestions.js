const API_URL = `${document.location.origin}/api/spotify`;

axios
    .get(API_URL)
    .then((response) => {
        console.log(response);
    })
    .catch((err) => {
        console.log(err);
    });
