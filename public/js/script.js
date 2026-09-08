// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        return
      }

      form.classList.add('was-validated')

      const submitButton = form.querySelector('button[type="submit"], button:not([type])')
      if (submitButton && !submitButton.disabled) {
        submitButton.disabled = true
        submitButton.classList.add('is-submitting')
        submitButton.dataset.originalLabel = submitButton.innerHTML
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>Working...'
        submitButton.setAttribute('aria-busy', 'true')
      }
    }, false)
  })
})()

document.querySelectorAll('.flash-message').forEach(message => {
  window.setTimeout(() => {
    if (window.bootstrap) {
      bootstrap.Alert.getOrCreateInstance(message).close()
    }
  }, 5500)
})

const imageInput = document.querySelector('#image')
const imagePreview = document.querySelector('#image-preview')

if (imageInput && imagePreview) {
  imageInput.addEventListener('change', () => {
    const [selectedImage] = imageInput.files

    if (selectedImage) {
      imagePreview.src = URL.createObjectURL(selectedImage)
    }
  })
}