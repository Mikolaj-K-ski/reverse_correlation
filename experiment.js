<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reverse Correlation Experiment</title>

    <!-- Poprawione linki do jsPsych -->
    <script src="https://cdn.jsdelivr.net/npm/jspsych@7.3.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/@jspsych/plugin-html-keyboard-response@7.3.0"></script>
    <script src="https://cdn.jsdelivr.net/npm/@jspsych/plugin-image-button-response@7.3.0"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspsych@7.3.0/css/jspsych.css">
</head>
<body></body>

<script>
document.addEventListener("DOMContentLoaded", function() {
    if (typeof initJsPsych === 'undefined') {
        console.error("initJsPsych is not defined. Sprawdź, czy jsPsych jest poprawnie załadowany.");
        return;
    }
    
    let jsPsych = initJsPsych({
        on_finish: function() {
            jsPsych.data.displayData();
        }
    });

    fetch("stimuli.csv")
    .then(response => response.text())
    .then(csvText => {
        let stimuli = Papa.parse(csvText, { header: true, delimiter: ";" }).data;

        let trials = stimuli.map(row => ({
            type: "image-button-response",
            stimulus: [
        'https://mikolaj-k-ski.github.io/reverse_correlation/images/' + row.image1,
        'https://mikolaj-k-ski.github.io/reverse_correlation/images/' + row.image2
            ],


            
            choices: ['Obraz po lewej', 'Obraz po prawej'],
            prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
            data: { chosen_image: row.image1 }
        }));

        let timeline = [
            {
                type: "html-keyboard-response",
                stimulus: "<p>Naciśnij spację, aby rozpocząć eksperyment.</p>",
                choices: [' ']
            },
            ...trials
        ];

        jsPsych.run(timeline);
    })
    .catch(error => console.error("Błąd:", error.message));

});
</script>
</html>
