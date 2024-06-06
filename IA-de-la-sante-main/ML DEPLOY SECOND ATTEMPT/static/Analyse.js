document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('analysisForm');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        var inputs = form.querySelectorAll('input[type="text"]');
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

        var formData = new FormData(form);
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('prediction-text').textContent = `The predicted diagnosis is ${data.prediction}`;
            document.getElementById('prediction-container').style.display = 'block';
            document.getElementById('classification-report').style.display = 'block';
        })
        .catch(error => {
            console.error('Error:', error);
        });

        form.reset();
    });
});

function isValidFloat(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
