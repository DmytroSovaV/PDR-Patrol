function setupForm({ formId, inputId, previewId, labelTextId, maxFiles = 3 }) {
  const form = document.getElementById(formId);
  const inputFile = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const labelText = document.getElementById(labelTextId);

  let selectedFiles = [];

  // Обробка вибору файлів
  inputFile.addEventListener("change", (e) => {
    const newFiles = Array.from(e.target.files);

    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} photos or videos.`);
      inputFile.value = "";
      return;
    }

    selectedFiles = selectedFiles.concat(newFiles);
    renderPreviews();
    inputFile.value = "";
  });

  function renderPreviews() {
    preview.innerHTML = "";
    labelText.style.display = selectedFiles.length > 0 ? "none" : "block";

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const wrapper = document.createElement("div");
        wrapper.style.position = "relative";
        wrapper.style.display = "inline-block";
        wrapper.style.margin = "5px";
        wrapper.style.width = "50px";
        wrapper.style.height = "50px";
        wrapper.style.overflow = "hidden";
        wrapper.style.borderRadius = "8px";

        let element;
        if (file.type.startsWith("image/")) {
          element = document.createElement("img");
          element.src = e.target.result;
          element.style.width = "50px";
          element.style.height = "50px";
          element.style.objectFit = "cover";
        } else if (file.type.startsWith("video/")) {
          element = document.createElement("video");
          element.src = e.target.result;
          element.controls = true;
          element.style.width = "50px";
          element.style.height = "50px";
          element.style.objectFit = "cover";
        }

        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "×";
        deleteBtn.style.position = "absolute";
        deleteBtn.style.top = "0";
        deleteBtn.style.right = "0";
        deleteBtn.style.background = "#ff3b3b";
        deleteBtn.style.border = "none";
        deleteBtn.style.borderRadius = "50%";
        deleteBtn.style.color = "#fff";
        deleteBtn.style.width = "20px";
        deleteBtn.style.height = "20px";
        deleteBtn.style.fontWeight = "bold";
        deleteBtn.style.fontSize = "16px";
        deleteBtn.style.lineHeight = "18px";
        deleteBtn.style.padding = "0";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.zIndex = "10";

        deleteBtn.addEventListener("click", (ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          selectedFiles.splice(index, 1);
          renderPreviews();
        });

        wrapper.appendChild(element);
        wrapper.appendChild(deleteBtn);
        preview.appendChild(wrapper);
      };

      reader.readAsDataURL(file);
    });
  }

  // Відправка форми
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";

    const formData = new FormData(form);

    // Видаляємо старі файли з FormData, додаємо вибрані файли
    for (const key of formData.keys()) {
      if (key === inputFile.name) formData.delete(key);
    }
    selectedFiles.forEach((file) => formData.append(inputFile.name, file));

    fetch(form.action, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        if (data.status === "success") {
          form.reset();
          selectedFiles = [];
          renderPreviews();
          const modal = document.getElementById("formModal");
          if (modal) modal.style.display = "none";
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error submitting the form.");
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      });
  });
}

// Виклики для твоїх форм
setupForm({
  formId: "form1",
  inputId: "media-top",
  previewId: "preview-top",
  labelTextId: "media-label-text-top",
  maxFiles: 3,
});

setupForm({
  formId: "form2",
  inputId: "media-bottom",
  previewId: "preview-bottom",
  labelTextId: "media-label-text-bottom",
  maxFiles: 3,
});

setupForm({
  formId: "form3",
  inputId: "media-modal",
  previewId: "preview-modal",
  labelTextId: "media-label-text-modal",
  maxFiles: 3,
});
