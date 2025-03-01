<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reverse Correlation Experiment</title>
    <script src="https://cdn.jsdelivr.net/npm/jspsych@7.3.0/jspsych.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspsych@7.3.0/plugins/jspsych-html-keyboard-response.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jspsych@7.3.0/plugins/jspsych-image-button-response.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/jspsych@7.3.0/css/jspsych.css">
</head>
<body></body>

<script>
document.addEventListener("DOMContentLoaded", function() {
    if (typeof initJsPsych === 'undefined') {
        console.error("initJsPsych is not defined. Ensure that jsPsych is correctly loaded.");
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
            let stimuli = Papa.parse(csvText, { header: true }).data;
            let trials = stimuli.map(row => ({
                type: jsPsychImageButtonResponse,
                stimulus: [row.image1, row.image2],
                choices: ['Obraz po lewej', 'Obraz po prawej'],
                prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
                data: { chosen_image: row.image1 }
            }));

            let timeline = [
                {
                    type: jsPsychHtmlKeyboardResponse,
                    stimulus: "<p>Naciśnij spację, aby rozpocząć eksperyment.</p>",
                    choices: [' ']
                },
                ...trials
            ];

            jsPsych.run(timeline);
        })
        .catch(error => console.error("Błąd wczytywania stimuli.csv:", error));
});
</script>
</html>
