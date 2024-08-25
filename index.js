document.addEventListener("DOMContentLoaded", function () {
  function triggerVideoAction() {
    document.getElementById("demo-text").innerHTML =
      "Please turn on your camera";

    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then(function (mediaStream) {
        document.getElementById("demo-text").innerHTML =
          "Recording. Please hold a close-mouthed pose until satisfied. Then click 'stop', 'send', or 'delete' and then 'record'.";

        var video = document.getElementById("video");
        document.getElementById("image").style.display = "none";
        document.getElementById("video-action").style.display = "none";
        document.getElementById("upload-action").style.display = "none";
        document.getElementById("video").style.display = "block";
        document.getElementById("hollowSquare").style.display = "block";

        video.srcObject = mediaStream;
        video.onloadedmetadata = function (e) {
          video.play();
        };

        // Capture after 2 seconds
        setTimeout(function () {
          var canvas = document.createElement("canvas");
          var send = document.getElementById("send");
          var send_disable = document.getElementById("send-disable");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          var image = document.getElementById("image");
          image.src = canvas.toDataURL("image/png");
          image.style.display = "block";
          send.style.display = "block";
          send_disable.style.display = "none";
          video.style.display = "none";
          document.getElementById("hollowSquare").style.display = "none";

          // After 2 seconds, show loading gif and record audio
          setTimeout(function () {
            document.getElementById("demo-text").innerHTML =
              "Allowing a few moments for processing";
            let previousImage = image.src;
            image.src = "/img/loading.gif";
            image.style.display = "block";
            video.style.display = "none";
            video.srcObject.getVideoTracks().forEach(function (track) {
              track.stop();
            });

            setTimeout(function () {
              document.getElementById("demo-text").innerHTML =
                "Please now record your voice. You can talk about yourself, should be one minute or more.";
              document.getElementById("countdown").style.display = "flex";

              startAudioRecording();

              var countdown = document.getElementById("countdown");
              var minutes = 1;
              var seconds = 0;

              function updateCountdown() {
                countdown.innerHTML =
                  formatTime(minutes) + ":" + formatTime(seconds);
                if (minutes === 0 && seconds === 0) {
                  image.src = "/img/loading.gif";
                  setTimeout(function () {
                    var demo = document.getElementById("demo");
                    demo.style.display = "none";
                    subscription.style.display = "flex";
                    image.src = previousImage;
                  }, 4000);
                  return;
                }
                if (seconds === 0) {
                  minutes--;
                  seconds = 59;
                } else {
                  seconds--;
                }
                setTimeout(updateCountdown, 1000);
              }

              function formatTime(time) {
                return time < 10 ? "0" + time : time;
              }

              updateCountdown();

              image.src = previousImage;
            }, 4000);
          }, 4000);
        }, 4000);
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  function triggerUploadAction() {
    document.getElementById("video-action").style.display = "none";
    document.getElementById("upload-action").style.display = "none";

    setTimeout(function () {
      var image = document.getElementById("image");

      document.getElementById("demo-text").innerHTML =
        "Allowing a few moments for processing";
      let previousImage = image.src;
      image.src = "/img/loading.gif";
      image.style.display = "block";

      setTimeout(function () {
        document.getElementById("demo-text").innerHTML =
          "Please now record your voice. You can talk about yourself, should be one minute or more.";
        document.getElementById("countdown").style.display = "flex";

        startAudioRecording();

        image.src = previousImage;
        var countdown = document.getElementById("countdown");
        var minutes = 1;
        var seconds = 0;

        function updateCountdown() {
          countdown.innerHTML = formatTime(minutes) + ":" + formatTime(seconds);
          if (minutes === 0 && seconds === 0) {
            image.src = "/img/loading.gif";
            setTimeout(function () {
              var demo = document.getElementById("demo");
              demo.style.display = "none";
              subscription.style.display = "flex";
              image.src = previousImage;
            }, 4000);
            return;
          }
          if (seconds === 0) {
            minutes--;
            seconds = 59;
          } else {
            seconds--;
          }
          setTimeout(updateCountdown, 1000);
        }

        function formatTime(time) {
          return time < 10 ? "0" + time : time;
        }

        updateCountdown();
      }, 4000);
    }, 4000);
  }

  // Handle image upload and then trigger video action
  document
    .getElementById("upload-image")
    .addEventListener("change", function () {
      var image = document.getElementById("image");
      var file = this.files[0];
      var reader = new FileReader();

      reader.onload = function (e) {
        image.src = e.target.result;
        triggerUploadAction();
      };

      reader.readAsDataURL(file);
    });

  document
    .getElementById("video-action")
    .addEventListener("click", function () {
      triggerVideoAction(); // Trigger video action when the button is clicked
    });

  document.getElementById("capture").addEventListener("click", function () {
    var video = document.getElementById("video");
    var canvas = document.createElement("canvas");
    var send = document.getElementById("send");
    var send_disable = document.getElementById("send-disable");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var image = document.getElementById("image");
    image.src = canvas.toDataURL("image/png");
    image.style.display = "block";
    send.style.display = "block";
    send_disable.style.display = "none";
    video.style.display = "none";
  });

  document.getElementById("delete").addEventListener("click", function () {
    var image = document.getElementById("image");
    var video = document.getElementById("video");
    var send = document.getElementById("send");
    var send_disable = document.getElementById("send-disable");
    image.style.display = "none";
    video.style.display = "block";
    send.style.display = "none";
    send_disable.style.display = "block";
  });

  document.getElementById("send").addEventListener("click", function () {
    var video = document.getElementById("video");
    var image = document.getElementById("image");
    var hollowSquare = document.getElementById("hollowSquare");
    var audioDisabled = document.getElementById("audio-action-diabled");
    var videoDisabled = document.getElementById("video-action-disabled");
    var videoAction = document.getElementById("video-action");
    var audioAction = document.getElementById("audio-action");
    var videoSetting = document.getElementById("video-setting");

    if (image.src.indexOf("loading.gif") > -1) {
      alert("No image to send");
      return;
    }
    document.getElementById("demo-text").innerHTML =
      "Allowing a few moments for processing";
    let previousImage = image.src;
    image.src = "/img/loading.gif";
    image.style.display = "block";
    video.style.display = "none";
    videoAction.style.display = "none";
    hollowSquare.style.display = "none";
    videoDisabled.style.display = "flex";
    videoSetting.style.display = "none";
    video.srcObject.getVideoTracks().forEach(function (track) {
      track.stop();
    });

    setTimeout(function () {
      document.getElementById("demo-text").innerHTML =
        "Please now record your voice. You can talk about yourself, should be one minute or more.";
      audioDisabled.style.display = "none";
      audioAction.style.display = "flex";
      image.src = previousImage;
    }, 2000);
  });

  // Audio recording event handlers
  function startAudioRecording() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (mediaStream) {
        var audio = document.getElementById("audio");

        var mediaRecorder = new MediaRecorder(mediaStream);
        var audioChunks = [];

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = function () {
          var audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          var audioUrl = URL.createObjectURL(audioBlob);
          audio.src = audioUrl;

          mediaStream.getTracks().forEach(function (track) {
            track.stop();
          });
        };

        mediaRecorder.start();

        // Stop recording after 1 minute
        setTimeout(function () {
          mediaRecorder.stop();
          console.log("Recording stopped");
        }, 60000);
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  async function upload() {
    var image = document.getElementById("image");
    var audio = document.getElementById("audio");
    var name = document.getElementById("name");
    var email = document.getElementById("email");

    if (image.src.indexOf("loading.gif") > -1) {
      alert("No image to send");
      return;
    } else if (audio.src.indexOf("default.mp3") > -1) {
      alert("No audio to send");
      return;
    } else if (name.value === "") {
      alert("No text to send");
      return;
    } else if (email.value === "" || email.value.indexOf("@") === -1) {
      alert("Invalid email");
      return;
    }

    var formData = new FormData();
    formData.append("name", name.value);
    formData.append("email", email.value);

    // Convert image and audio URLs to Blob objects
    var imageBlob = await fetch(image.src).then((r) => r.blob());
    var audioBlob = await fetch(audio.src).then((r) => r.blob());

    // Append the Blobs to the FormData
    formData.append("image", imageBlob, "image.jpg");
    formData.append("audio", audioBlob, "audio.mp3");

    document.getElementById("demo-text").innerHTML =
      "Allowing a few moments for processing";
    image.src = "/img/loading.gif";

    try {
      let response = await fetch(
        "https://ntgnx4sm-3000.euw.devtunnels.ms/v1/friend/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Submission received");
        location.reload();
      } else {
        alert("Submission failed");
      }
    } catch (error) {
      alert("Submission failed");
      console.error(error);
    }
  }
  document.getElementById("subscribe").addEventListener("click", function () {
    upload();
  });
});
