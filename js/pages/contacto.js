// Funcion principal
document.addEventListener("DOMContentLoaded", function() {
    
    let form = document.getElementById('form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const serviceID = 'default_service';
        const templateID = 'template_7jmtx1e';

        // Enviar el formulario usando EmailJS
        emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            alert('Correo enviado exitosamente');
        }, (err) => {
            alert(JSON.stringify(err));
        });
    });
})