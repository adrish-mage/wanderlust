document.addEventListener('DOMContentLoaded', () => {
  const starControl = document.getElementById('starControl');
  const hiddenInput = document.getElementById('reviewRating');
  if (!starControl || !hiddenInput) return;

  const stars = Array.from(starControl.querySelectorAll('.star'));

  function setRating(value) {
    hiddenInput.value = value;
    stars.forEach(s => {
      const v = parseInt(s.getAttribute('data-value'), 10);
      if (v <= value) {
        s.classList.remove('fa-regular');
        s.classList.add('fa-solid', 'text-warning');
      } else {
        s.classList.remove('fa-solid', 'text-warning');
        s.classList.add('fa-regular', 'text-muted');
      }
    });
  }

  // initialize to 3 (or value in input)
  setRating(parseInt(hiddenInput.value, 10) || 3);

  stars.forEach(s => {
    s.addEventListener('click', () => {
      const val = parseInt(s.getAttribute('data-value'), 10);
      setRating(val);
    });
    s.addEventListener('mouseover', () => {
      const val = parseInt(s.getAttribute('data-value'), 10);
      stars.forEach(st => {
        const v = parseInt(st.getAttribute('data-value'), 10);
        if (v <= val) {
          st.classList.remove('fa-regular');
          st.classList.add('fa-solid', 'text-warning');
        } else {
          st.classList.remove('fa-solid', 'text-warning');
          st.classList.add('fa-regular', 'text-muted');
        }
      });
    });
    s.addEventListener('mouseout', () => {
      setRating(parseInt(hiddenInput.value, 10));
    });
  });

  // client-side validation hook to trim comment
  const form = starControl.closest('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      const ta = form.querySelector('textarea[name="review[comment]"]');
      if (ta) {
        ta.value = ta.value.trim();
        if (!ta.value) {
          ta.classList.add('is-invalid');
          e.preventDefault();
          e.stopPropagation();
        }
      }
    });
  }
});
