document.addEventListener('DOMContentLoaded', function() {
    var analysisForm = document.getElementById('add-analysis-form');
    var uploadForm = document.getElementById('upload-analysis-form');
    var messageDiv = document.getElementById('message');

    function handleFormSubmit(event) {
        event.preventDefault();

        var inputs = event.target.querySelectorAll('input[type="text"]');
        for (var i = 0; i < inputs.length; i++) {
            if (inputs[i].value.trim() === '') {
                alert(inputs[i].name + ' is required!');
                return;
            }

            if (!isValidFloat(inputs[i].value)) {
                alert(inputs[i].name + ' must be a valid float!');
                return;
            }
        }

        // Immediately show success message
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);

        // Proceed with form submission
        var formData = new FormData(event.target);
        fetch(event.target.action, {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.error('Error:', error);
        });

        event.target.reset();
    }

    function handleFileUpload(event) {
        event.preventDefault();

        var fileInput = event.target.querySelector('input[type="file"]');
        if (!fileInput.files.length) {
            alert('Please select a file to upload.');
            return;
        }

        // Immediately show success message
        messageDiv.classList.remove('hidden');
        setTimeout(() => {
            messageDiv.classList.add('hidden');
        }, 3000);

        // Proceed with form submission
        var formData = new FormData(event.target);
        fetch(event.target.action, {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.error('Error:', error);
        });

        event.target.reset();
    }

    analysisForm.addEventListener('submit', handleFormSubmit);
    uploadForm.addEventListener('submit', handleFileUpload);
});

function isValidFloat(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
