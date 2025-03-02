let globalCsvText = ""; // Globalna zmienna do debugowania

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
            globalCsvText = csvText; // Zapisujemy CSV globalnie dla testów w konsoli
            console.log("🔍 Zawartość CSV (surowa):", csvText);

            // Próbujemy parsować CSV z różnymi delimiterami
            let stimuli = Papa.parse(csvText, { header: true, delimiter: "," }).data;
            if (stimuli.length === 0 || !stimuli[0].image1) {
                console.warn("⚠️ CSV może używać średnika zamiast przecinka! Próbuję ponownie...");
                stimuli = Papa.parse(csvText, { header: true, delimiter: ";" }).data;
            }

           
        window.globalCsvText = csvText;
        console.log("🔍 Zawartość CSV zapisana w globalCsvText:", window.globalCsvText);

            // Tworzymy próby eksperymentalne
            let trials = stimuli.map(row => {
                let image1 = row.image1 ? row.image1.trim() : ""; 
                let image2 = row.image2 ? row.image2.trim() : "";

                if (!image1 || !image2) {
                    console.warn("⚠️ Pusta nazwa obrazu w wierszu CSV:", row);
                    return null; // Pomijamy błędne wiersze
                }

                return {
                    type: "image-button-response",
                    stimulus: [
                        `https://mikolaj-k-ski.github.io/reverse_correlation/images/${image1}`,
                        `https://mikolaj-k-ski.github.io/reverse_correlation/images/${image2}`
                    ],
                    choices: ['Obraz po lewej', 'Obraz po prawej'],
                    prompt: "<p>Wybierz obraz, który lepiej pasuje do opisu.</p>",
                    data: { chosen_image: image1 }
                };
            }).filter(trial => trial !== null); // Usuwamy błędne wiersze

            if (trials.length === 0) {
                console.error("❌ Brak poprawnych prób w pliku stimuli.csv!");
                return;
            }

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
        .catch(error => console.error("❌ Błąd wczytywania stimuli.csv:", error));
});
