let db;

const request = indexedDB.open("budget_tracker", 1);

request.onupgradeneeded = function (event) {
    const db = event.target.result;

    db.createObjectStore("new_transactions", { autoIcrement: true });
};

//if succesful
request.onsuccess = function (event) {

    db = event.target.result;
    if (navigator.onLine) {

    }
}; request.onerror = function (event) {
    console.log(event.target.errorCode);
};

function saveRecord(record) {
    const transaction = db.transaction(["new_transaction"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_transaction");

    budgetObjectStore.add(record);
}
function uploadTransaction() {
    const transaction = db.transaction(["new_transaction"], "readwrite");
    const budgetObjectStore = transaction.objectStore("new_transaction");
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function () {
        if (getAll.result.length > 0) {
            fetch("/api/transaction", {
                method: "POST",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "applications/json"
                }
            })
                .then(res => res.json())
                .then(serverResponse => {
                    if (serverResponse.message) {
                        throw new Error(serverResponse);
                    }
                    //open another transaction
                    const transaction = db.transaction(["new_transaction"], "readwrite");
                    const budgetObjectStore = transaction.objectStore("new_transacion");

                    budgetObjectStore.clear();

                    alert("SAVED TRANSACTIONS HAVE BEEN SUBMITTED!");
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }
}
window.addEventListener("online", uploadTransaction);