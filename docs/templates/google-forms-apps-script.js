/**
 * Google Apps Script - Webhook para Google Forms → Grafono API
 *
 * INSTALAÇÃO:
 * 1. Abra o Google Forms → ⋮ (3 pontos) → Editor de Scripts
 * 2. Cole este código inteiro
 * 3. Substitua WEBHOOK_URL e FORM_SECRET pelos valores corretos
 * 4. Menu: Editar → Acionadores do projeto atual
 * 5. Adicionar acionador:
 *    - Função: onFormSubmit
 *    - Evento: Ao enviar formulário
 * 6. Autorize o script quando solicitado
 * 7. Teste enviando uma resposta no form
 */

// === CONFIGURAÇÃO ===
var WEBHOOK_URL = "https://gra-fono.vercel.app/api/n8n/form/response";
var FORM_SECRET = "ad25d42fb7ce0620d3d86e7dc8507cc5";

function onFormSubmit(e) {
  try {
    var responses = e.response.getItemResponses();

    // Map form fields by question title
    var data = {};
    var allResponses = {};

    for (var i = 0; i < responses.length; i++) {
      var title = responses[i].getItem().getTitle();
      var answer = responses[i].getResponse();
      allResponses[title] = answer;
    }

    // Extract key fields
    var payload = {
      phone: allResponses["Telefone de contato"] || "",
      email: allResponses["Email do responsável"] || "",
      childName: allResponses["Nome completo da criança"] || "",
      childBirthDate: allResponses["Data de nascimento"] || "",
      responsibleName: allResponses["Nome do responsável"] || "",
      responses: allResponses,
      formId: e.response.getEditResponseUrl ? "google-forms" : "google-forms",
      timestamp: new Date().toISOString()
    };

    // Send to Grafono API
    var options = {
      method: "post",
      contentType: "application/json",
      headers: {
        "x-form-secret": FORM_SECRET
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
    var responseCode = response.getResponseCode();

    if (responseCode !== 200) {
      Logger.log("Webhook error: " + responseCode + " - " + response.getContentText());
    } else {
      Logger.log("Webhook success: " + response.getContentText());
    }

  } catch (error) {
    Logger.log("Script error: " + error.toString());
  }
}

/**
 * Função de teste - rode manualmente para verificar conectividade
 */
function testWebhook() {
  var testPayload = {
    phone: "5511999999999",
    email: "teste@email.com",
    childName: "Criança Teste",
    childBirthDate: "2023-01-15",
    responsibleName: "Mãe Teste",
    responses: {
      "Nome completo da criança": "Criança Teste",
      "Telefone de contato": "5511999999999"
    },
    timestamp: new Date().toISOString()
  };

  var options = {
    method: "post",
    contentType: "application/json",
    headers: {
      "x-form-secret": FORM_SECRET
    },
    payload: JSON.stringify(testPayload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(WEBHOOK_URL, options);
  Logger.log("Status: " + response.getResponseCode());
  Logger.log("Body: " + response.getContentText());
}
