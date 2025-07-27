let selectedFiles = [];

document.getElementById('media').addEventListener('change', function(event) {
    const newFiles = Array.from(event.target.files);
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles > 3) {
        alert('You can upload a maximum of 6 photos or videos.');
        event.target.value = '';
        return;
    }

    selectedFiles = selectedFiles.concat(newFiles);
    event.target.value = ''; // дозволити вибрати ті самі файли ще раз

    renderPreviews();
});

function renderPreviews() {
    const preview = document.getElementById('preview');
    const labelText = document.getElementById('media-label-text');
    
    preview.innerHTML = '';

    // Показати/сховати текст в лейблі
    if (selectedFiles.length > 0) {
        labelText.style.display = 'none';
    } else {
        labelText.style.display = 'block';
    }

    selectedFiles.forEach((file, index) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.style.display = 'inline-block';

            let element;
            if (file.type.startsWith('image/')) {
                element = document.createElement('img');
                element.src = e.target.result;
            } else if (file.type.startsWith('video/')) {
                element = document.createElement('video');
                element.src = e.target.result;
                element.controls = true;
            }

            element.classList.add('media-preview');

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.innerHTML = '×';
            deleteBtn.style.position = 'absolute';
            deleteBtn.style.top = '-5px';
            deleteBtn.style.right = '-5px';
            deleteBtn.style.background = '#ff3b3b';
            deleteBtn.style.color = '#fff';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '50%';
            deleteBtn.style.width = '20px';
            deleteBtn.style.height = '20px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.fontSize = '14px';
            deleteBtn.style.lineHeight = '18px';
            deleteBtn.style.padding = '0';

            deleteBtn.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
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


