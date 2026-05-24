onload = () => {
  const albumTrigger = document.querySelector(".album-trigger");
  const album = document.querySelector(".album");
  const albumClose = document.querySelector(".album__close");
  const albumUpload = document.querySelector(".album__upload-input");
  const albumGrid = document.querySelector(".album__grid");
  const musicPlayer = document.querySelector(".music-player");
  const musicAudio = document.querySelector(".music-player__audio");
  const musicButton = document.querySelector(".music-player__button");
  const musicButtonText = document.querySelector(".music-player__text");
  const musicUpload = document.querySelector(".music-player__input");
  const photoViewer = document.querySelector(".photo-viewer");
  const photoViewerImage = document.querySelector(".photo-viewer__image");
  const photoViewerClose = document.querySelector(".photo-viewer__close");

  document.body.classList.remove("container");

  setTimeout(() => {
    albumTrigger.classList.add("album-trigger--show");
    musicPlayer.classList.add("music-player--show");
    playMusic();
  }, 6800);

  const openAlbum = () => {
    album.classList.add("album--open");
    album.setAttribute("aria-hidden", "false");
    albumTrigger.setAttribute("aria-expanded", "true");
  };

  const closeAlbum = () => {
    album.classList.remove("album--open");
    album.setAttribute("aria-hidden", "true");
    albumTrigger.setAttribute("aria-expanded", "false");
  };

  const openPhotoViewer = (image) => {
    photoViewerImage.src = image.src;
    photoViewerImage.alt = image.alt;
    photoViewer.classList.add("photo-viewer--open");
    photoViewer.setAttribute("aria-hidden", "false");
  };

  const closePhotoViewer = () => {
    photoViewer.classList.remove("photo-viewer--open");
    photoViewer.setAttribute("aria-hidden", "true");
    photoViewerImage.src = "";
    photoViewerImage.alt = "";
  };

  albumTrigger.addEventListener("click", openAlbum);
  albumClose.addEventListener("click", closeAlbum);
  album.addEventListener("click", (event) => {
    if (event.target === album) {
      closeAlbum();
    }
  });
  albumGrid.addEventListener("click", (event) => {
    const image = event.target.closest(".album__photo img");

    if (image) {
      openPhotoViewer(image);
    }
  });
  photoViewerClose.addEventListener("click", closePhotoViewer);
  photoViewer.addEventListener("click", (event) => {
    if (event.target === photoViewer) {
      closePhotoViewer();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && photoViewer.classList.contains("photo-viewer--open")) {
      closePhotoViewer();
    }
  });

  if (albumUpload && albumGrid) {
    albumUpload.addEventListener("change", (event) => {
      const files = Array.from(event.target.files).filter((file) =>
        file.type.startsWith("image/")
      );

      files.forEach((file, index) => {
        const reader = new FileReader();

        reader.addEventListener("load", () => {
          const photo = document.createElement("figure");
          photo.className = "album__photo";

          const image = document.createElement("img");
          image.src = reader.result;
          image.alt = file.name || `Foto upload ${index + 1}`;

          const caption = document.createElement("figcaption");
          caption.textContent = file.name || `Foto upload ${index + 1}`;

          photo.append(image, caption);
          albumGrid.prepend(photo);
        });

        reader.readAsDataURL(file);
      });

      event.target.value = "";
    });
  }

  const updateMusicButton = () => {
    const isPlaying = !musicAudio.paused;

    musicPlayer.classList.toggle("music-player--playing", isPlaying);
    musicButton.setAttribute("aria-label", isPlaying ? "Jeda musik" : "Putar musik");
    musicButtonText.textContent = isPlaying ? "Jeda Musik" : "Putar Musik";
  };

  const playMusic = () => {
    musicAudio.play().then(updateMusicButton).catch(() => {
      musicButtonText.textContent = "Putar Musik";
    });
  };

  musicButton.addEventListener("click", () => {
    if (musicAudio.paused) {
      playMusic();
      return;
    }

    musicAudio.pause();
    updateMusicButton();
  });

  musicUpload.addEventListener("change", (event) => {
    const [file] = event.target.files;

    if (!file || !file.type.startsWith("audio/")) {
      event.target.value = "";
      return;
    }

    musicAudio.src = URL.createObjectURL(file);
    musicAudio.play().then(updateMusicButton).catch(updateMusicButton);
    event.target.value = "";
  });

  musicAudio.addEventListener("play", updateMusicButton);
  musicAudio.addEventListener("pause", updateMusicButton);
};
