// Initialize Firebase
var config = {
    apiKey: "AIzaSyB45LQrv5hSjMJ7skEX4GsphPOELBh28VA",
    authDomain: "new-tab-3250b.firebaseapp.com",
    databaseURL: "https://new-tab-3250b.firebaseio.com",
    projectId: "new-tab-3250b",
    storageBucket: "new-tab-3250b.appspot.com",
    messagingSenderId: "130229537"
};
firebase.initializeApp(config);

// write a post to Firebase
function writeNewPost(title, message) {
    firebase.database().ref('posts/' + title).set({
        message: message
    });
}

// event handler for buttons
function clickHandler(e) {
    var title = '';
    var message = '';
    var buttoncol = e.target.closest(".col");
    var desc = buttoncol.previousElementSibling;
    if (desc.classList.contains("col-desc")) {
        message = String(desc.innerHTML);
    }
    var titlecol = desc.previousElementSibling;
    if (titlecol.classList.contains("col-title")) {
        title = String(titlecol.querySelector("h3").innerHTML);
    }
    writeNewPost(title, message);
}

// creates a div to be added to the HTML DOM
function addContainer(title, message) {
    var container = document.createElement("div");
    container.className = "col item-container";

    var titleelement = document.createElement("div");
    titleelement.className = "col col-title";
    var h3 = document.createElement("h3");
    var h3text = document.createTextNode(title);
    h3.appendChild(h3text);
    titleelement.appendChild(h3);
    container.appendChild(titleelement);

    var description = document.createElement("div");
    description.className = "col col-desc";
    description.contentEditable = "true";
    var descriptiontext = document.createTextNode(message);
    description.appendChild(descriptiontext);
    container.appendChild(description);

    var buttoncol = document.createElement("div");
    buttoncol.className = "col";
    var button = document.createElement("button");
    button.className = "btn btn-primary";
    button.innerText = "Update";
    buttoncol.appendChild(button);
    container.appendChild(buttoncol);

    document.querySelector("#base").appendChild(container);
}

// adds event listener to the buttons
function refreshEventListeners() {
    var buttonItems = [].slice.call(document.querySelectorAll('button'));
    buttonItems.forEach(function (item, idx) {
        item.addEventListener('click', clickHandler);
    })
}

// create a new container to HTML
// move the plus sign
// refresh listeners
function newContainer(title, message) {
    addContainer(title, message);
    // move the PLUS SIGN
    var add = document.getElementById("add");
    document.getElementById("base").appendChild(add);
    //refresh eventlisteners
    refreshEventListeners();
}

// wait for the DOMContentLoaded to be finished,
// then insert the containers into HTML
// and add eventlisteners
document.addEventListener("DOMContentLoaded", function(event) {
    titles = [];
    posts = firebase.database().ref('posts');
    posts.on("value", function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            var title = childSnapshot.key;
            if(!titles.includes(title)){
                var childData = childSnapshot.val();
                var message = childData.message;
                newContainer(title, message);
                titles.push(title);
            }
        });
    });
    document.getElementById("add").addEventListener("click", function() {
        var newTitle = "New";
        var newMessage = "New Message";
        newContainer(newTitle, newMessage);
        titles.push(newTitle);
    });
});
