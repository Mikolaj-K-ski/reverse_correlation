fetch("stimuli.csv")
    .then(response => response.text())
    .then(csvText => {
        let stimuli = Papa.parse(csvText, { header: true, delimiter: "," }).data;

        let trials = stimuli.map(row => {
            let image1 = row.image1.trim(); // Usunięcie zbędnych spacji
            let image2 = row.image2.trim();

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
        });

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
    .catch(error => console.error("Błąd wczytywania stimuli.csv:", error));
