document.addEventListener("DOMContentLoaded", function () {
  // get element by id video when click trigger allow video , hence project the video on  id image
  document
    .getElementById("video-action")
    .addEventListener("click", function () {
      document.getElementById("demo-text").innerHTML =
        "Please turn on your camera on";

      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(function (mediaStream) {
          document.getElementById("demo-text").innerHTML =
            "Recording. Please hold close mouthed pose until your satisfaction. Then click 'stop'. Then 'send'. Or 'delete'. Then 'record'.";

          var video = document.getElementById("video");
          document.getElementById("image").style.display = "none";
          document.getElementById("video-action").style.display = "none";
          document.getElementById("video").style.display = "block";
          document.getElementById("video-setting").style.display = "flex";

          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    });

  document.getElementById("capture").addEventListener("click", function () {
    var video = document.getElementById("video");
    var image = document.getElementById("image");
    var canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var image = document.getElementById("image");
    image.src = canvas.toDataURL("image/png");
    image.style.display = "block";
    video.style.display = "none";
  });

  document.getElementById("stop").addEventListener("click", function () {
    var video = document.getElementById("video");
    var image = document.getElementById("image");
    document.getElementById("video-action").style.display = "flex";
    document.getElementById("video-setting").style.display = "none";
    document.getElementById("demo-text").innerHTML =
      "Click on Capture Selfie to start";
    image.src = "/img/loading.gif";
    image.style.display = "block";
    video.style.display = "none";
    video.srcObject.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  });

  document.getElementById("delete").addEventListener("click", function () {
    var image = document.getElementById("image");
    var video = document.getElementById("video");
    image.style.display = "none";
    video.style.display = "block";
  });

  document.getElementById("send").addEventListener("click", function () {
    var video = document.getElementById("video");
    var image = document.getElementById("image");

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
    video.srcObject.getVideoTracks().forEach(function (track) {
      track.stop();
    });

    setTimeout(function () {
      document.getElementById("demo-text").innerHTML =
        "Processing completes. Please record voice.";
      image.src = previousImage;
    }, 5000);
  });

  function addEventListenerToElements(ids, event, handler) {
    ids.forEach(function (id) {
      document.getElementById(id).addEventListener(event, handler);
    });
  }

  // Event handler for starting the audio recording
  function startAudioRecording() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (mediaStream) {
        var audio = document.getElementById("audio");
        document.getElementById("audio-action").style.display = "none";
        document.getElementById("audio-setting").style.display = "flex";
        document.getElementById("stop-audio-loading").style.display = "block";
        document.getElementById("stop-audio").style.display = "none";

        // Create an AudioContext and connect the mediaStream to it
        var mediaRecorder = new MediaRecorder(mediaStream);
        var audioChunks = [];

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = function () {
          var audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          var audioUrl = URL.createObjectURL(audioBlob);
          audio.src = audioUrl;

          // Stop the mediaStream to prevent feedback
          mediaStream.getTracks().forEach(function (track) {
            track.stop();
          });

          // Close the audio context
          audioContext.close();
        };

        // Start recording
        mediaRecorder.start();

        document
          .getElementById("capture-audio")
          .addEventListener("click", function () {
            document.getElementById("stop-audio-loading").style.display =
              "none";
            document.getElementById("stop-audio").style.display = "block";
            mediaRecorder.stop();
            mediaRecorder.stop();
          });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  // Event handler for deleting the audio
  function deleteAudio() {
    var audio = document.getElementById("audio");
    audio.src = "/default.mp3";
  }

  // Add event listeners to both buttons
  addEventListenerToElements(
    ["audio-action", "delete-audio"],
    "click",
    startAudioRecording
  );
  addEventListenerToElements(["delete-audio"], "click", deleteAudio);

  document.getElementById("stop-audio").addEventListener("click", function () {
    var audio = document.getElementById("audio");
    document.getElementById("audio-action").style.display = "flex";
    document.getElementById("audio-setting").style.display = "none";
    //  mediaRecorder.stop();
    audio.srcObject.getAudioTracks().forEach(function (track) {
      track.stop();
    });
  });

  document.getElementById("send-audio").addEventListener("click", function () {
    var audio = document.getElementById("audio");
    var image_audio = document.getElementById("image-audio");
    var image = document.getElementById("image");
    if (audio.src.indexOf("default.mp3") > -1) {
      alert("No audio to send");
      return;
    }

    document.getElementById("demo-text").innerHTML =
      "Allowing a few moments for processing";

    image_audio.src = "/img/loading.gif";
    image_audio.style.display = "block";
    image.style.display = "none";

    setTimeout(function () {
      document.getElementById("demo-text").innerHTML =
        "Processing completes. Here is YOO";
      image_audio.src = "/img/loading.gif";
      image_audio.style.display = "none";
      image.style.display = "block";
    }, 5000);
  });

  // document
  //   .getElementById("delete-audio")
  //   .addEventListener("click", function () {
  //     var audio = document.getElementById("audio");
  //     audio.src = "/default.mp3";

  //     // restart recording
  //   });

  // play audio
  document.getElementById("play-audio").addEventListener("click", function () {
    var audio = document.getElementById("audio");
    audio.play();
  });

  //   capture audio
  // document
  //   .getElementById("capture-audio")
  //   .addEventListener("click", function () {
  //     mediaRecorder.stop();
  //   });

  // document
  //   .getElementById("delete-audio")
  //   .addEventListener("click", function () {
  //     var audioCapture = document.getElementById("audio-capture");
  //     audioCapture.style.display = "none";
  //   });
});
document.addEventListener("DOMContentLoaded", function () {
  // get element by id video when click trigger allow video , hence project the video on  id image
  document
    .getElementById("video-action-md")
    .addEventListener("click", function () {
      document.getElementById("demo-text-md").innerHTML =
        "Please turn on your camera on";

      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then(function (mediaStream) {
          document.getElementById("demo-text-md").innerHTML =
            "Recording. Please hold close mouthed pose until your satisfaction. Then click 'stop'. Then 'send'. Or 'delete'. Then 'record'.";

          var video = document.getElementById("video-md");
          document.getElementById("image-md").style.display = "none";
          document.getElementById("video-action-md").style.display = "none";
          document.getElementById("video-md").style.display = "block";
          document.getElementById("video-setting-md").style.display = "flex";

          video.srcObject = mediaStream;
          video.onloadedmetadata = function (e) {
            video.play();
          };
        })
        .catch(function (err) {
          console.log(err.name + ": " + err.message);
        });
    });

  document.getElementById("capture-md").addEventListener("click", function () {
    var video = document.getElementById("video-md");
    var image = document.getElementById("image-md");
    var canvas = document.createElement("canvas-md");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    var image = document.getElementById("image-md");
    image.src = canvas.toDataURL("image/png");
    image.style.display = "block";
    video.style.display = "none";
  });

  document.getElementById("stop-md").addEventListener("click", function () {
    var video = document.getElementById("video-md");
    var image = document.getElementById("image-md");
    document.getElementById("video-action-md").style.display = "flex";
    document.getElementById("video-setting-md").style.display = "none";
    document.getElementById("demo-text-md").innerHTML =
      "Click on Capture Selfie to start";
    image.src = "/img/loading.gif";
    image.style.display = "block";
    video.style.display = "none";
    video.srcObject.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  });

  document.getElementById("delete-md").addEventListener("click", function () {
    var image = document.getElementById("image-md");
    var video = document.getElementById("video-md");
    image.style.display = "none";
    video.style.display = "block";
  });

  document.getElementById("send-md").addEventListener("click", function () {
    var video = document.getElementById("video-md");
    var image = document.getElementById("image-md");

    if (image.src.indexOf("loading.gif-md") > -1) {
      alert("No image to send-md");
      return;
    }
    document.getElementById("demo-text-md").innerHTML =
      "Allowing a few moments for processing";
    let previousImage = image.src;
    image.src = "/img/loading.gif";
    image.style.display = "block";
    video.style.display = "none";
    video.srcObject.getVideoTracks().forEach(function (track) {
      track.stop();
    });

    setTimeout(function () {
      document.getElementById("demo-text-md").innerHTML =
        "Processing completes. Please record voice.";
      image.src = previousImage;
    }, 5000);
  });

  function addEventListenerToElements(ids, event, handler) {
    ids.forEach(function (id) {
      document.getElementById(id).addEventListener(event, handler);
    });
  }

  // Event handler for starting the audio recording
  function startAudioRecording() {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(function (mediaStream) {
        var audio = document.getElementById("audio-md");
        document.getElementById("audio-action-md").style.display = "none";
        document.getElementById("audio-setting-md").style.display = "flex";
        document.getElementById("stop-audio-loading-md").style.display =
          "block";
        document.getElementById("stop-audio-md").style.display = "none";

        // Create an AudioContext and connect the mediaStream to it
        var mediaRecorder = new MediaRecorder(mediaStream);
        var audioChunks = [];

        mediaRecorder.ondataavailable = function (event) {
          audioChunks.push(event.data);
        };
        mediaRecorder.onstop = function () {
          var audioBlob = new Blob(audioChunks, { type: "audio/wav" });
          var audioUrl = URL.createObjectURL(audioBlob);
          audio.src = audioUrl;

          // Stop the mediaStream to prevent feedback
          mediaStream.getTracks().forEach(function (track) {
            track.stop();
          });

          // Close the audio context
          audioContext.close();
        };

        // Start recording
        mediaRecorder.start();

        document
          .getElementById("capture-audio-md")
          .addEventListener("click", function () {
            document.getElementById("stop-audio-loading-md").style.display =
              "none";
            document.getElementById("stop-audio-md").style.display = "block";
            mediaRecorder.stop();
            mediaRecorder.stop();
          });
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  // Event handler for deleting the audio
  function deleteAudio() {
    var audio = document.getElementById("audio-md");
    audio.src = "/default.mp3";
  }

  // Add event listeners to both buttons
  addEventListenerToElements(
    ["audio-action-md", "delete-audio-md"],
    "click",
    startAudioRecording
  );
  addEventListenerToElements(["delete-audio-md"], "click", deleteAudio);

  document
    .getElementById("stop-audio-md")
    .addEventListener("click", function () {
      var audio = document.getElementById("audio-md");
      document.getElementById("audio-action-md").style.display = "flex";
      document.getElementById("audio-setting-md").style.display = "none";
      //  mediaRecorder.stop();
      audio.srcObject.getAudioTracks().forEach(function (track) {
        track.stop();
      });
    });

  document
    .getElementById("send-audio-md")
    .addEventListener("click", function () {
      var audio = document.getElementById("audio-md");
      var image_audio = document.getElementById("image-audio-md");
      var image = document.getElementById("image-md");
      if (audio.src.indexOf("default.mp3") > -1) {
        alert("No audio to send");
        return;
      }

      document.getElementById("demo-text-md").innerHTML =
        "Allowing a few moments for processing";

      image_audio.src = "/img/loading.gif";
      image_audio.style.display = "block";
      image.style.display = "none";

      setTimeout(function () {
        document.getElementById("demo-text-md").innerHTML =
          "Processing completes. Here is YOO";
        image_audio.src = "/img/loading.gif";
        image_audio.style.display = "none";
        image.style.display = "block";
      }, 5000);
    });

  // document
  //   .getElementById("delete-audio-md")
  //   .addEventListener("click", function () {
  //     var audio = document.getElementById("audio-md");
  //     audio.src = "/default.mp3";

  //     // restart recording
  //   });

  // play audio
  document
    .getElementById("play-audio-md")
    .addEventListener("click", function () {
      var audio = document.getElementById("audio-md");
      audio.play();
    });

  //   capture audio
  // document
  //   .getElementById("capture-audio-md")
  //   .addEventListener("click", function () {
  //     mediaRecorder.stop();
  //   });

  // document
  //   .getElementById("delete-audio-md")
  //   .addEventListener("click", function () {
  //     var audioCapture = document.getElementById("audio-capture-md");
  //     audioCapture.style.display = "none";
  //   });
});
