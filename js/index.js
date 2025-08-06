window.addEventListener('scroll', () => {
  const header = document.querySelector('header'); // або заміни 'header' на свій селектор хедера
  if (window.scrollY > 10) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

function slowScrollTo(targetId) {
  const target = document.getElementById(targetId);
  if (!target) return;

  const targetPosition = target.getBoundingClientRect().top + window.scrollY;
  const startPosition = window.scrollY;
  const distance = targetPosition - startPosition;
  const duration = 2000;
  let startTime = null;

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutQuad(timeElapsed / duration) * distance + startPosition;
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

function setupForm({ formId, inputId, previewId, labelTextId, maxFiles = 3 }) {
  const form = document.getElementById(formId);
  const inputFile = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  const labelText = document.getElementById(labelTextId);

  let selectedFiles = [];

  inputFile.addEventListener('change', (e) => {
    const newFiles = Array.from(e.target.files);

    if (selectedFiles.length + newFiles.length > maxFiles) {
      alert(`You can upload a maximum of ${maxFiles} photos or videos.`);
      inputFile.value = '';
      return;
    }

    selectedFiles = selectedFiles.concat(newFiles);
    renderPreviews();
    inputFile.value = '';
  });

  function renderPreviews() {
    preview.innerHTML = '';

    if (selectedFiles.length > 0) {
      labelText.style.display = 'none';
    } else {
      labelText.style.display = 'block';
    }

    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = function (e) {
        const wrapper = document.createElement('div');
        // Інлайн стилі, щоб не міняти CSS
        wrapper.style.position = 'relative';
        wrapper.style.display = 'inline-block';
        wrapper.style.margin = '5px';
        wrapper.style.width = '50px';
        wrapper.style.height = '50px';
        wrapper.style.overflow = 'hidden';
        wrapper.style.borderRadius = '8px';
        // wrapper.style.border = '1px solid #aaa';
        // wrapper.style.background = 'transparent';   // <-- Ось тут
        // wrapper.style.padding = '0';       

        let element;
        if (file.type.startsWith('image/')) {
          element = document.createElement('img');
          element.src = e.target.result;
          element.classList.add('media-preview'); // клас з твоїм CSS
        } else if (file.type.startsWith('video/')) {
          element = document.createElement('video');
          element.src = e.target.result;
          element.controls = true;
          element.classList.add('media-preview');
          element.style.width = '50px';
          element.style.height = '50px';
          element.style.objectFit = 'cover';
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '×';
        // Інлайн стилі для кнопки, щоб була маленька та у верхньому правому куті
        deleteBtn.style.position = 'absolute';
        deleteBtn.style.top = '0';
        deleteBtn.style.right = '0';
        deleteBtn.style.background = '#ff3b3b';
        deleteBtn.style.border = 'none';
        deleteBtn.style.borderRadius = '50%';
        deleteBtn.style.color = '#fff';
        deleteBtn.style.width = '20px';
        deleteBtn.style.height = '20px';
        deleteBtn.style.fontWeight = 'bold';
        deleteBtn.style.fontSize = '16px';
        deleteBtn.style.lineHeight = '18px';
        deleteBtn.style.padding = '0';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.style.userSelect = 'none';
        deleteBtn.style.zIndex = '10';

        deleteBtn.addEventListener('click', (ev) => {
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
    
    form.addEventListener('submit', (ev) => {
  ev.preventDefault();

  if (selectedFiles.length === 0) {
    alert('Please select at least one photo or video.');
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  const originalBtnText = submitBtn.textContent;
  submitBtn.textContent = 'Senting...';

  const formData = new FormData(form);

  for (const key of formData.keys()) {
    if (key === inputFile.name) formData.delete(key);
  }
  selectedFiles.forEach((file) => {
    formData.append(inputFile.name, file);
  });

  fetch(form.action, {
    method: 'POST',
    body: formData,
  })
    .then((response) => response.text())
    .then((result) => {
      alert('Form submitted successfully!');
      form.reset();
      selectedFiles = [];
      renderPreviews();
    })
    .catch((error) => {
      alert('Error submitting the form.');
      console.error(error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    });
});
}

// Виклики для двох форм:
setupForm({
  formId: 'form1',
  inputId: 'media-top',
  previewId: 'preview-top',
  labelTextId: 'media-label-text-top',
  maxFiles: 3,
});
setupForm({
  formId: 'form2',
  inputId: 'media-bottom',
  previewId: 'preview-bottom',
  labelTextId: 'media-label-text-bottom',
  maxFiles: 3,
});
setupForm({
  formId: 'form3',
  inputId: 'media-modal',
  previewId: 'preview-modal',
  labelTextId: 'media-label-text-modal',
  maxFiles: 3,
});
document.querySelectorAll(".openModalBtn").forEach((button) => {
  button.addEventListener("click", () => {
    document.getElementById("formModal").style.display = "block";
  });
});
document.getElementById("closeModalBtn").addEventListener("click", () => {
  document.getElementById("formModal").style.display = "none";
});
window.addEventListener("click", (event) => {
  const modal = document.getElementById("formModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
///// active page
document.addEventListener("DOMContentLoaded", function () {
  const links = document.querySelectorAll("a[href]");
  const current = window.location.pathname.split("/").pop(); // наприклад "franchise.html"

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) {
      link.classList.add("active");
    }
  });
});
