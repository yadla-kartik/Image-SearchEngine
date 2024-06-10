const img = document.querySelector(".images");
const btn = document.querySelector(".load-more");
const search = document.querySelector(".search-box input");
const lightbox = document.querySelector(".lightbox");
const closebtn = document.querySelector(".uil-times");
const downloadImgbtn = document.querySelector(".uil-import");

const apikey = "g24d88sCFOZECczaIj314u5L1IpejNC4zMl6hDNzpilWOrV6RdeoH3gP";
const perpg = 15;
let currentpg = 1;
let term = null;

function downloadImg(imgUrl) {
    fetch(imgUrl)
        .then(res => res.blob())
        .then(file => {
            const a = document.createElement("a");
            a.href = URL.createObjectURL(file);
            a.download = `${new Date().getTime()}.jpg`; 
            a.click();
        })
        .catch(() => {
            alert("Failed to download Image!!");
        });
}

function showlightbox(name, ph) {
    lightbox.querySelector("img").src = ph;
    lightbox.querySelector("span").innerText = name;
    lightbox.style.display = "block";
    downloadImgbtn.setAttribute("data-img", ph);
    document.body.style.overflow = "hidden";
}

closebtn.addEventListener("click", function () {
    lightbox.style.display = "none";
    document.body.style.overflow = "auto";
});

const abc = (a) => {
    img.innerHTML += a.map(b =>
        `<li class="card" onclick="showlightbox('${b.photographer}', '${b.src.large2x}')">
            <img src="${b.src.large2x}" alt="">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${b.photographer}</span>
                </div>
                <button onclick="downloadImg('${b.src.large2x}'); event.stopPropagation();">
                <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join("");
};

function getImages(url) {
    btn.innerText = "Loading...";
    btn.classList.add("disabled");
    fetch(url, {
        headers: { Authorization: apikey }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            abc(data.photos);
            btn.innerText = "Load More";
            btn.classList.remove("disabled");
        }).catch(() => {
            alert("Failed to load Images!!");
        });
}

getImages(`https://api.pexels.com/v1/curated?page=${currentpg}&per_page=${perpg}`);

btn.addEventListener("click", function () {
    currentpg++;
    let url = `https://api.pexels.com/v1/curated?page=${currentpg}&per_page=${perpg}`;
    if (term !== null) {
        url = `https://api.pexels.com/v1/search?query=${term}&page=${currentpg}&per_page=${perpg}`;
    }
    getImages(url);
});

search.addEventListener("keyup", function (e) {
    if (e.target.value === "") return term = null;

    if (e.key === "Enter") {
        currentpg = 1;
        term = e.target.value;
        img.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${term}&page=${currentpg}&per_page=${perpg}`);
    }
});

downloadImgbtn.addEventListener("click", function (e) {
    downloadImg(e.target.dataset.img); 
});
