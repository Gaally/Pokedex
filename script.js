let pokeList;
let currentIndex = -1;
let currentPokemon;
let currentSprite = 4;

try {
  pokeList = JSON.parse(localStorage["pokemonList"]);
} catch (error) {
  fetch("https://pokeapi.co/api/v2/pokemon/?offset=0&limit=1000")
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      pokeList = data.results;
      localStorage["pokemonList"] = JSON.stringify(pokeList);
    })
    .catch((error) => {});
}

function doc(id) {
  return document.getElementById(id);
}

function firstUp(word) {
  return word[0].toUpperCase() + word.slice(1);
}

function setSprite() {
  let sprites = currentPokemon.sprites;

  sprites = Object.entries(sprites);

  sprites.forEach((index) => {
    if (index[1] == null) {
      index[1] =
        "https://cdn-0.emojis.wiki/emoji-pics/mozilla/question-mark-mozilla.png";
    }
  });

  if (currentSprite > 7) {
    currentSprite = 0;
  } else if (currentSprite < 0) {
    currentSprite = 7;
  }
  doc("pokeSprite").src = sprites[currentSprite][1];
}

function PokeInfo() {
  let poke = currentPokemon;
  let name = firstUp(poke.name);
  let types = "";

  setSprite();

  if (poke.id < pokeList.length) {
    currentIndex = poke.id - 1;
    doc("pokeId").title = "";
    doc("pokeId").style.cursor = "unset";
  } else {
    currentIndex = pokeList.findIndex((key) => {
      return key.name === poke.name;
    });
    doc("pokeId").title =
      "Pokémon with IDs over 10000 are variations of other Pokémon";
    doc("pokeId").style.cursor = "help";
  }

  Object.keys(poke.types).forEach((i) => {
    types += firstUp(poke.types[i].type.name) + "<br>";
  });

  // Main Info
  doc("pokeName").innerHTML = name;
  doc("pokeId").innerHTML = "#" + poke.id;
  doc("pokeType").innerHTML = types;

  // Extra Info
  doc("hp").innerHTML = "HP: " + poke.stats[5].base_stat;
  doc("attack").innerHTML = "Attack: " + poke.stats[4].base_stat;
  doc("defense").innerHTML = "Defense: " + poke.stats[3].base_stat;
  doc("speed").innerHTML = "Speed: " + poke.stats[0].base_stat;
  doc("special-atk").innerHTML = "Special Atk: " + poke.stats[2].base_stat;
  doc("special-def").innerHTML = "Special Def: " + poke.stats[1].base_stat;
  doc("weight").innerHTML = "Weight: " + poke.weight / 10 + "kg";
  doc("height").innerHTML = "Height: " + poke.height * 10 + "cm";
}

function getPokemon(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Request error, status " + response.status);
      }
      return response.json();
    })
    .then((data) => {
      currentPokemon = data;
      PokeInfo();
    })
    .catch((error) => {});
}

function searchPokemon(key, input) {
  let search = pokeList.find(
    (poke) => poke[key].indexOf(input.toLowerCase()) >= 0
  );

  if (search == null) {
    doc("pokeWrong").style.display = "block";
  } else {
    doc("pokeWrong").style.display = "none";
    let url = search.url;

    if (input == 2) {
      url = `https://pokeapi.co/api/v2/pokemon/2/`;
    }
    getPokemon(url);
  }
  searchPokemon.reset();
}

doc("pokeBtn").onclick = () => {
  let input = doc("pokeInput").value.replace(/[^a-zA-Z0-9-]+/g, "");
  doc("pokeInput").value = input;

  if (input !== "" && input != null) {
    if (isNaN(input)) {
      searchPokemon("name", input);
    } else {
      searchPokemon("url", input);
    }
  }
};

doc("pokeInput").onkeypress = () => {
  if (event.keyCode === 13) {
    doc("pokeBtn").click();
  }
};

// ArrowLeft
doc("prev").onclick = () => {
  if (currentIndex - 1 < 0) {
    currentIndex = pokeList.length;
  }
  getPokemon(pokeList[currentIndex - 1].url);
};

// ArrowRight
doc("next").onclick = () => {
  if (currentIndex + 1 > pokeList.length - 1) {
    currentIndex = -1;
  }
  getPokemon(pokeList[currentIndex + 1].url);
};

document.onkeydown = () => {
  if (document.activeElement === doc("pokeInput")) {
    return;
  }
  if (event.keyCode === 37) {
    // ArrowLeft
    doc("prev").click();
    doc("prev").classList.add("btnActive");
  }

  if (event.keyCode === 39) {
    // ArrowRight
    doc("next").click();
    doc("next").classList.add("btnActive");
  }
};

document.onkeyup = () => {
  if (document.activeElement === doc("pokeInput")) {
    return;
  }
  if (event.keyCode === 37) {
    // ArrowLeft
    doc("prev").classList.remove("btnActive");
  }
  if (event.keyCode === 39) {
    // ArrowRight
    doc("next").classList.remove("btnActive");
  }
};
