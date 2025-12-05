// utils/predictionLogic.js

/**
 * Predicts a potential disease based on sensor readings.
 * This is a highly simplified example using thresholds.
 * In a real-world scenario, this would involve more sophisticated
 * algorithms, medical expertise, or machine learning models.
 *
 * @param {Object} data - Object containing sensor readings.
 * @param {number} data.bpm - Beats Per Minute.
 * @param {number} data.spo2 - Blood Oxygen Saturation percentage.
 * @param {number} data.temperature - Body Temperature in Celsius.
 * @returns {string} The predicted disease or 'Undetermined'.
 */
exports.predictDisease = ({ bpm, spo2, temperature }) => {
    let prediction = 'Undetermined'; // Default if no specific pattern matches
    if (spo2 < 65 && temperature > 25.0) {
        return 'Severe Respiratory & Febrile Illness';
    }
    // --- Critical Conditions / High Priority Alerts ---
    // Example: A combination of very low SpO2, high BPM, and high temp
    if (spo2 < 88 && bpm > 110 && temperature > 39.0) {
        return 'Severe Respiratory & Febrile Illness';
    }
    // Example: Very low SpO2 indicating acute respiratory distress
    if (spo2 < 85) {
        return 'Critical Hypoxemia';
    }

    // --- Specific Disease Patterns (can be refined with more conditions) ---

    // Respiratory Issues (based on SpO2)
    if (spo2 < 90) {
        prediction = 'Disease A (Possible Respiratory Distress)'; // e.g., Asthma Exacerbation, Pneumonia
    } else if (spo2 >= 90 && spo2 <= 95) {
        prediction = 'Borderline Oxygen Saturation (Monitor Closely)';
    }

    // Febrile Illnesses (based on Temperature)
    if (temperature > 38.5) {
        // If already low spo2, prioritize that, otherwise suggest febrile disease
        if (prediction === 'Undetermined' || prediction === 'Borderline Oxygen Saturation (Monitor Closely)') {
            prediction = 'Disease B (Fever/Infection)'; // e.g., Flu, Common Cold, other infections
        } else if (prediction === 'Disease A (Possible Respiratory Distress)') {
             // If already Disease A and also fever, refine prediction
            prediction = 'Disease A + Febrile Illness';
        }
    } else if (temperature < 35.0) {
        prediction = 'Hypothermia';
    }

    // Heart Rate Anomalies (based on BPM)
    if (bpm > 100) {
        // If a more critical prediction already exists, prioritize it.
        // Otherwise, suggest Tachycardia/Stress.
        if (prediction === 'Undetermined' || prediction === 'Borderline Oxygen Saturation (Monitor Closely)') {
            prediction = 'Tachycardia (High Heart Rate / Stress)';
        } else if (prediction === 'Disease A (Possible Respiratory Distress)' || prediction === 'Disease B (Fever/Infection)') {
            // If already a disease, indicate tachycardia as a symptom
            prediction += ' (with Tachycardia)';
        }
    } else if (bpm < 60) {
        // Similar logic for Bradycardia
        if (prediction === 'Undetermined' || prediction === 'Borderline Oxygen Saturation (Monitor Closely)') {
            prediction = 'Bradycardia (Low Heart Rate)';
        } else if (prediction === 'Disease A (Possible Respiratory Distress)' || prediction === 'Disease B (Fever/Infection)') {
            prediction += ' (with Bradycardia)';
        }
    }

    // --- All Readings Normal ---
    // This condition should only apply if no other specific condition was met
    const isBpmNormal = bpm >= 60 && bpm <= 100;
    const isSpo2Normal = spo2 > 95;
    const isTempNormal = temperature >= 35.0 && temperature <= 37.5;

    if (isBpmNormal && isSpo2Normal && isTempNormal && prediction === 'Undetermined') {
        prediction = 'No Disease Detected';
    }

    return prediction;
};

module.exorts={prediction};