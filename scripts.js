"use strict";

const dropDownBtn = document.querySelector(".dropdown-btn");
const dropDown = document.querySelector(".menu-dropdown");
const search = document.querySelector(".search");
const searchInput = document.querySelector(".search__input");
const spinner = document.querySelector(".loader");
const gifGrid = document.querySelector(".gif-grid");
const API_KEY = "HngwKadr2NwovQy6FKRQa21EBNeqwAji";

// Functions

const startSearch = (e) => {
  e.preventDefault();
  if (!searchInput.value) return;

  showSpinner(true);

  const query = searchInput.value;
  searchInput.value = "";
  gifGrid.innerHTML = "";
  searchGifs("search", query);
};

const searchGifs = async (param, query) => {
  let html;
  const url = query
    ? `https://api.giphy.com/v1/gifs/${param}?api_key=${API_KEY}&q=${query}&limit=20&rating=pg`
    : `https://api.giphy.com/v1/gifs/${param}?api_key=${API_KEY}&limit=20&rating=pg`;

  try {
    const res = await fetch(url);
    const { data } = await res.json();
    const gifData = data.map(({ title, images }) => ({
      title,
      imgUrl: images.original.url,
    }));

    if (gifData.length === 0) {
      html = showError();
    } else {
      html = convertToHtml(gifData);
    }
    showSpinner(false);
    gifGrid.insertAdjacentHTML("beforeend", html);
  } catch (error) {
    console.error(error);
    const html = showError();
    showSpinner(false);
    gifGrid.insertAdjacentHTML("beforeend", html);
  }
};

const convertToHtml = (data) => {
  return data
    .map(({ title, imgUrl }) => {
      return `
      <a href=${imgUrl} target="_blank">   
        <div class="gif-grid__item">
        <img
          src=${imgUrl}
          alt=${title}
        />
        </div> 
      </a>
      `;
    })
    .join("");
};

const showError = () => {
  return '<div class="gif-grid__item"> <img src=https://media2.giphy.com/media/L07HHhtWjmQ5l2RRJa/giphy.gif?cid=8ef8861cjg3q565bs674phtlol0w6j08l1r48wc88f8cxvg4&rid=giphy.gif&ct=g alt=I see nothing /> </div>';
};

const showSpinner = (bool) => {
  if (bool) {
    spinner.style.display = "flex";
  } else {
    spinner.style.display = "none";
  }
};

// EventListeners

dropDownBtn.addEventListener("mouseover", () => {
  dropDown.style.display = "block";
});

dropDownBtn.addEventListener("mouseout", () => {
  dropDown.style.display = "none";
});

search.addEventListener("submit", startSearch);
searchGifs("trending");
