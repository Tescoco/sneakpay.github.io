window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const webhookId = urlParams.get("webhook_id");

  fetch(
    `https://ntgnx4sm-3000.euw.devtunnels.ms/v1/friend/webhook/${webhookId}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data.payload.webhook.data);

      let { url } = JSON.parse(data.payload.webhook.data);

      const avatar = document.getElementById("avatar");
      console.log(avatar);
      avatar.src = url;
      avatar.alt = webhookId;
      avatar.style.display = "block";
    })
    .catch((error) => {
      console.error(error);
    });

  console.log(webhookId);
});
