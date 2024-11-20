window.addEventListener("load", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const webhookId = urlParams.get("url");

  // url is currently been encoded
  let url = decodeURIComponent(webhookId);

  console.log(url);

  const avatar = document.getElementById("avatar");
  console.log(avatar);
  avatar.src = url;
  avatar.alt = "webhookId";
  avatar.style.display = "block";

  console.log(webhookId);
});
