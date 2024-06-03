document.addEventListener('DOMContentLoaded', function() {
    // Get the form element
    var form = document.getElementById('analysisForm');

    // Add event listener for form submission
    form.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();

        // Get all input elements in the form
        var inputs = document.querySelectorAll('input');

        // Iterate through each input element
        for (var i = 0; i < inputs.length; i++) {
            // Check if the input is empty (after trimming whitespace)
            if (inputs[i].value.trim() === '') {
                // If input is empty, display an alert message
                alert(inputs[i].name + ' is required!');
                // Stop form submission
                return;
            }

            if (!isValidFloat(inputs[i].value)) {
                alert(inputs[i].name + ' must be a valid float!');
                return; // Stop form submission if input value is not a valid float
            }
        }

        // Simulate form submission and display the prediction text
        setTimeout(function() {
            document.getElementById('prediction-text').style.display = 'block';
            form.submit(); // Actually submit the form
        }, 1000); // Delay to simulate form processing time
    });
});

// Function to check if a value is a valid float
function isValidFloat(value) {
    return !isNaN(parseFloat(value)) && isFinite(value);
}
