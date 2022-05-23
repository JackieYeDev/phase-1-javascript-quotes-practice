const quoteURL = 'http://localhost:3000/quotes'
const likeURL = 'http://localhost:3000/likes'

document.addEventListener("DOMContentLoaded", () => {
    clearCards();

    fetch(quoteURL+`?_embed=likes`)
        .then((res) => res.json())
        .then((data) => {
            data.map((d) => createCards(d))
        });
    
    const form = document.querySelector('form#new-quote-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        createQuote(e);
    })
});

function clearCards() {
    const ulList = document.querySelector('ul#quote-list');
    ulList.innerHTML = '';
};

function reloadCards() {
    fetch(quoteURL+'?_embed=likes')
    .then((res)=>res.json())
    .then((data)=>data.map((d) => createCards(d)));
};

function createCards(data) {
    const ulList = document.querySelector('ul#quote-list');

    const li = document.createElement('li');
    const blockquote = document.createElement('blockquote');
    const p = document.createElement('p');
    const footer = document.createElement('footer');
    const br = document.createElement('br');
    const likeButton = document.createElement('button');
    const span = document.createElement('span');
    const deleteButton = document.createElement('button');
    const quoteId = data.id;

    li.className = 'quote-card';
    blockquote.className = 'blockquote';
    p.className = 'mb-0';
    p.innerText = data.quote;
    footer.className = 'blockquote-footer';
    footer.innerText = data.author;
    likeButton.className = 'btn-sucess';
    likeButton.innerText = 'Likes: ';
    likeButton.addEventListener('click', (e) => {
        e.preventDefault();
        likeQuote(quoteId);
        clearCards();
        reloadCards();
    });
    span.innerText = data.likes != undefined ? data.likes.length:0;
    deleteButton.className = 'btn-danger';
    deleteButton.innerText = 'Delete';
    deleteButton.addEventListener('click', (e) => {
        e.preventDefault();
        deleteQuote(quoteId);
        clearCards();
        reloadCards();
    });

    likeButton.appendChild(span);
    blockquote.append(p, footer, br, likeButton, deleteButton);
    li.appendChild(blockquote);
    ulList.appendChild(li);
};

function createQuote(data) {
    const configuration = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            quote: data.target[0].value,
            author: data.target[1].value
        })
    };

    fetch(quoteURL, configuration)
        .then((res) => res.json())
        .then((data) => createCards(data));
}

function likeQuote(dataId) {
    const configuration = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body:JSON.stringify({
            "quoteId": dataId,
            "createdAt": Date.now()
        })
    };
    fetch(likeURL, configuration)
    .then((res)=>res.json())
    .then((data)=>console.log(data));
}

function deleteQuote(dataId) {
    fetch(quoteURL+`/${dataId}`, {method:"DELETE"});
}