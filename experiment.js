document.addEventListener("DOMContentLoaded", function() {
    console.log("Skrypt się uruchomił!"); // Sprawdzenie, czy kod działa

    // Inicjalizacja jsPsych
    const jsPsych = initJsPsych({
        on_finish: function() {
            jsPsych.data.displayData(); // Pokazuje dane po zakończeniu eksperymentu
        }
    });

    // Funkcja do wczytania CSV
    function loadCSV(filename) {
        return fetch(filename)
            .then(response => response.text())
            .then(csvText => {
                let rows = csvText.trim().split("\n").slice(1); // Pominięcie nagłówka
                return rows.map(row => {
                    let cols = row.split(",");
                    return { image1: cols[0], image2: cols[1] };
                });
            });
    }

    loadCSV("stimuli.csv").then(stimuli => {
        let trials = stimuli.map(row => ({
            type: jsPsychImageButtonResponse,
            stimulus: [row.image1, row.image2],
            choices: ['Obraz po lewej', 'Obraz po prawej'],
            prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
            data: { chosen_image: row.image1 } // Zapisujemy wybór
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
    }).catch(error => console.error("Błąd wczytywania stimuli.csv:", error));
});

