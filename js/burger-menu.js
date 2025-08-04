  document.addEventListener('DOMContentLoaded', function () {
    const burgerBtn = document.querySelector('.burger-btn-open');
    const burgerMenu = document.querySelector('.burger-menu');

    burgerBtn.addEventListener('click', () => {
      burgerMenu.classList.toggle('active');
    });

    // Якщо хочеш закривати меню по кліку поза ним:
    document.addEventListener('click', (e) => {
      if (!burgerMenu.contains(e.target) && !burgerBtn.contains(e.target)) {
        burgerMenu.classList.remove('active');
      }
    });
  });