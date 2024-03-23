import PocketBase from './assets/scripts/pocketbase.es.mjs';
import { Render } from '../wailsjs/go/internals/Context';

// Helpers
function render(elm, tmpl, data) {
    if (!elm) return;
    Render(tmpl, data)
        .then(res => (elm.innerHTML = res))
        .catch(err => (elm.innerHTML = err))
    ;
}

function renderNotes() {
    pb.collection('notes').getFullList({ sort: '-created' })
        .then(notes => render(main, "notes-list", { notes }))
        .catch(err => render(main, "notes-list", { error: err.message }))
    ;
}

// Global Dom Elements
const main = document.getElementById("main");

// Begin Setup Script
const pb = new PocketBase("https://pupusa-demo.fly.dev");

// Check PB Auth Store
if (pb.authStore.isValid) {
    renderNotes()
} else {
    render(main, "signin", { });
}

// Admin Signin callback for Demo
window.signin = async () => {
    event.preventDefault();

    const email = event.target.email.value,
          pass  = event.target.password.value

    pb.admins.authWithPassword(email, pass)
        .then(authData => renderNotes())
        .catch(error =>   render(main, "signin", { error: error.message }))
    ;
}

// Create Note callback for Demo
window.createNote = async () => {
    event.preventDefault();

    const title = event.target.title.value,
          body = event.target.body.value

    pb.collection('notes').create({ title, body })
        .then(() => renderNotes())
        .catch(error =>   render(main, "create-note-modal", { error: error.message }))
    ;
}









