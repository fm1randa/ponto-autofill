// ==UserScript==
// @name         PontoAutofill
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autofills date and just. code 2 for WFH
// @author       Filipe Miranda
// @match        https://web21.senior.com.br:38001/rubiweb/conector?redir=hrgeral.htm&ACAO=ENTRASISTEMA&SIS=HR
// @icon         https://www.google.com/s2/favicons?sz=64&domain=senior.com.br
// @grant        none
// ==/UserScript==

(function () {
    "use strict";
    function getDocumentFromFrame(document, frameName) {
        return document?.getElementsByName(frameName)?.[0]?.contentWindow
            ?.document;
    }

    function fetchDocuments() {
        const containerDocument = getDocumentFromFrame(
            window.document,
            "MESTRE"
        );
        const mainDocument = getDocumentFromFrame(
            containerDocument,
            "DADOSACERTO"
        );
        const titleDocument = getDocumentFromFrame(mainDocument, "TITULO");
        const markDocument = getDocumentFromFrame(mainDocument, "DADOS");
        return {
            titleDocument: titleDocument,
            markDocument: markDocument,
        };
    }

    window.document.getElementsByTagName("html")[0].focus();

    let titleFound = false;
    let interval = setInterval(() => {
        const { titleDocument, markDocument } = fetchDocuments();
        const getInputs = (inputNames) => {
            return inputNames.map((name) => {
                return markDocument.getElementsByName(name)[0];
            });
        };
        if (titleDocument) {
            titleFound = true;

            const headerDateInput =
                titleDocument.getElementsByName("lbDesData")[0];
            const headerDateValue = headerDateInput.value;

            const parsedDateValue = headerDateValue.split("-")[0].trim();
            const dateInputNames = ["DDM01", "DDM02", "DDM03", "DDM04"];
            const justificationCodeInputNames = [
                "DJU01",
                "DJU02",
                "DJU03",
                "DJU04",
            ];
            const dateInputs = getInputs(dateInputNames);
            const justificationCodeInputs = getInputs(
                justificationCodeInputNames
            );
            if (!dateInputs[0])
                return console.warn("PontoAutofill failed to find inputs");

            dateInputs.forEach((input) => {
                input.value = parsedDateValue;
            });
            justificationCodeInputs.forEach((input) => {
                input.value = "2";
            });
            console.log("PontoAutofill executed sucessfully :)");
            return clearInterval(interval);
        }
    }, 1500);
})();
