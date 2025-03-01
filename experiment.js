document.addEventListener("DOMContentLoaded", function() {
    console.log("Skrypt się uruchomił!"); // Sprawdzenie, czy kod działa

    // Inicjalizacja jsPsych
    const jsPsych = new JsPsych({
        on_finish: function() {
            jsPsych.data.displayData(); // Pokazuje dane po zakończeniu eksperymentu
        }
    });

    // Wczytaj plik CSV z listą bodźców
    fetch("stimuli.csv")
        .then(response => response.text())
        .then(csvText => {
            let stimuli = Papa.parse(csvText, { header: true }).data;

            let trials = stimuli.map(row => ({
                type: jsPsychImageButtonResponse,
                stimulus: [row.image1, row.image2],
                choices: ['Obraz po lewej', 'Obraz po prawej'],
                prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
                data: { chosen_image: row.image1 } // Zapisujemy, który obraz był wybrany
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
        .catch(error => console.error("Błąd wczytywania pliku stimuli.csv:", error));
});
