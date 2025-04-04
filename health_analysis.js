const addPatientButton = document.getElementById("addPatient");
const report = document.getElementById("report");
const btnSearch = document.getElementById('btnSearch');
const patients = [];

function addPatient() {
    const name = document.getElementById("name").value;
    const gender = document.querySelector('input[name="gender"]:checked');
    const age = document.getElementById("age").value;
    const condition = document.getElementById("condition").value;

    if (name && gender && age && condition) {
      patients.push({ name, gender: gender.value, age, condition }); // Agrega los detalles del paciente al array patients[]
      resetForm(); // Restablece los campos del formulario
      generateReport(); // Para actualizar y mostrar el informe de análisis basado en los datos del paciente recién agregado
    }
}

function resetForm() { // Asigna un valor vacío a todos los campos para limpiar los detalles ingresados anteriormente.
    document.getElementById("name").value = "";
    document.querySelector('input[name="gender"]:checked').checked = false;
    document.getElementById("age").value = "";
    document.getElementById("condition").value = "";
}

function generateReport() { // Calcula y construye un informe de análisis basado en los datos de pacientes recopilados almacenados en el arreglo patients[]
    const numPatients = patients.length; // Representa el total de pacientes almacenados en el arreglo patients[]
    const conditionsCount = { // Una estructura de datos (objeto) que inicializa contadores para condiciones médicas específicas
      Diabetes: 0,
      Thyroid: 0,
      "High Blood Pressure": 0,
    };
    const genderConditionsCount = { // Un objeto anidado con contadores de condiciones específicas por género (masculino y femenino) para cada condición médica
      Male: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
      Female: {
        Diabetes: 0,
        Thyroid: 0,
        "High Blood Pressure": 0,
      },
    };

    for (const patient of patients) {
      conditionsCount[patient.condition]++; // Incrementa el conteo para la condición médica específica de cada paciente en el objeto conditionsCount.
      genderConditionsCount[patient.gender][patient.condition]++; // Aumenta el conteo de cada condición médica dentro de la categoría de género respectiva en el objeto genderConditionsCount basado en el género y la condición del paciente.
    }
    // Actualiza dinámicamente el contenido HTML dentro del elemento report designado.
    report.innerHTML = `Number of patients: ${numPatients}<br><br>`; // Muestra el número total de pacientes.
    report.innerHTML += `Conditions Breakdown:<br>`;
    for (const condition in conditionsCount) { // Enumera los conteos para cada condición médica en el objeto conditionsCount.
      report.innerHTML += `${condition}: ${conditionsCount[condition]}<br>`;
    }

    // Mostrar condiciones por género: Ilustra los conteos de cada condición
    // categorizados por género en el objeto genderConditionsCount,
    // mostrando la distribución de condiciones entre hombres y mujeres por separado.
    report.innerHTML += `<br>Gender-Based Conditions:<br>`;
    for (const gender in genderConditionsCount) {
      report.innerHTML += `${gender}:<br>`;
      for (const condition in genderConditionsCount[gender]) {
        report.innerHTML += `&nbsp;&nbsp;${condition}: ${genderConditionsCount[gender][condition]}<br>`;
      }
    }
}

addPatientButton.addEventListener("click", addPatient); //  Para agregar detalles del paciente cuando el usuario haga clic en el botón Agregar Paciente.

function searchCondition() {
    const input = document.getElementById('conditionInput').value.toLowerCase(); // Esto recupera el valor ingresado en el campo de entrada con el ID conditionInput. Convierte el texto ingresado a minúsculas para asegurar una comparación que no distinga entre mayúsculas y minúsculas.
    const resultDiv = document.getElementById('result'); // Esto recupera el elemento HTML con el ID ‘result’.
    resultDiv.innerHTML = ''; // Limpia cualquier contenido previo dentro de este elemento HTML.

    fetch('health_analysis.json') // Este método de API inicia una solicitud de recuperación al archivo llamado ‘health.json’.
      .then(response => response.json()) // Convierte la respuesta recuperada en formato JSON.
      .then(data => { // Esto maneja los datos JSON recuperados. Busca una condición de salud que coincida con la entrada del usuario.
        const condition = data.conditions.find(item => item.name.toLowerCase() === input); // Esto busca dentro de los datos JSON una condición de salud cuyo nombre coincida con la entrada ingresada.

        if (condition) { // Este código verifica si hay una condición coincidente. 
          const symptoms = condition.symptoms.join(', ');
          const prevention = condition.prevention.join(', ');
          const treatment = condition.treatment;

          resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
          resultDiv.innerHTML += `<img src="${condition.imagesrc}" alt="hjh">`;

          resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
          resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
          resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;
        } else {
          resultDiv.innerHTML = 'Condition not found.';
        }
      })
      .catch(error => {
        console.error('Error:', error);
        resultDiv.innerHTML = 'An error occurred while fetching data.';
      });
}

btnSearch.addEventListener('click', searchCondition);

