let fullMeal = [];
let mealName = [];
let mealCategory = [];
let mealOrigin = [];
let mealInstruction = [];

//Div elements
let mealListDiv = document.getElementById('mealListDiv'); //Div for List of Meals
let mealSec = document.getElementById("mealSec"); //Div for meals with selected category
let countMealAppDiv = document.getElementById('countMealAppDiv'); //Div for number of meals within each type
let grpByDiv = document.getElementById('grpByDiv'); //Div for GroupBy

//Button elements
const mealList = document.getElementById('mealList'); //Button for List of Meals
const mealCat = document.getElementById('mealCat'); //Button for meals with selected category
const mealByCat = document.getElementById('mealByCat'); //Button for number of meals within each type
const groupBy = document.getElementById('groupBy'); //Button for GroupBy
const reshapeBtn = document.getElementById('reshapeBtn'); //Button for Select & Reshape
const freqBtn = document.getElementById('freqBtn'); //Button for Ingredient Frequency

//Input element
const catName = document.getElementById('catName'); //User input


//Fetching data using API
async function main() {
  const meal = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s=s")
  const data = await meal.json()
  if (data.meals && data.meals.length > 0) {
    fullMeal=data.meals;
    data.meals.forEach(gotMeal);
  }
}
main();

//List of meals---
function gotMeal(pick) {
  //(pick.strMeal) {mealName.push(pick);} - it picks, each element as a FULL OBJECT from the API
  if (pick.strMeal) {mealName.push(pick);}//Or, (pick.strMeal) {mealName.push(pick.strMeal); - it just a string
  if (pick.strCategory) {mealCategory.push(pick);}
  if (pick.strArea) {mealOrigin.push(pick.strArea);}
  if (pick.strInstructions) {mealInstruction.push(pick.strInstructions);}
}

function printScreen1(msg) {
  let mealLiDi = document.createElement('div');
  mealLiDi.classList.add('mealLiD');

  let mealLiPa = document.createElement('p');
  mealLiPa.classList.add('mealLiP');

  mealLiPa.innerHTML = msg

  mealLiDi.appendChild(mealLiPa)
  mealListDiv.appendChild(mealLiDi)
}

mealList.addEventListener('click', function () {
  let removeElement = document.getElementsByClassName('mealLiD');
  [...removeElement].forEach(el => el.remove());

  mealName.sort((a, b) => a.strMeal.localeCompare(b.strMeal)); //If we use, if (pick.strMeal) {mealName.push(pick);}

  printScreen1('<span style="color: purple;"><b><u>List of Meals</u></b></span>')

  for (let i = 0; i < mealName.length; i++) {
    printScreen1(`<b>${i + 1}</b>. <span style="color: red;"><b>${mealName[i].strMeal}</b><span`)
  }
})

//Category based meal---
function printScreen2(msg) {
  let mealCaDi = document.createElement('div');
  mealCaDi.classList.add('mealCaD');

  let mealCaPa = document.createElement('p');
  mealCaPa.classList.add('mealCaP');

  mealCaPa.innerHTML = msg;
  mealCaDi.appendChild(mealCaPa);
  mealSec.appendChild(mealCaDi);
}

//To listen button function about the request---
mealCat.addEventListener("click", function() {
  //To remove the collection past elements from the class of a previously declared Div 'mealCaD'
  let removeElement = document.getElementsByClassName('mealCaD');
  [...removeElement].forEach(el => el.remove());

  //Store user input in lower case
  let userCat = catName.value.trim().toLowerCase()

  //Check inserted user category with listed category in fullMeal then store the matched items in filterCategory
  let filterCategory = fullMeal.filter(cat => cat.strCategory.toLowerCase() === userCat);

  printScreen2('<span style="color: purple;"><b><u>Meals of Category</u></b></span>')
  //Applied condition for user's convenience
  if(userCat === '') {
    printScreen2('Oops! You forgot to enter category name. Please try again!');
  }
    //filterCategory.length === 0 -> means the item is not in the list. Hence, 0.
  //If inserted user category name is spelled wrong, it will not be in the list. So, length will render 0.
  else if (filterCategory.length === 0) {
    printScreen2(`Oops! <u>${userCat}</u> is a wrong name. Please enter a correct category name!`)
  }
  else {
    let count = 1;
    filterCategory.forEach(cat => {
      //printScreen(count++ + '. ' + cat.strMeal + ': ' + cat.strCategory) --> General code
      //To highlight the category within .js, I used style within span-tag
      printScreen2(`<span style="color: darkgreen;"><b>${count++}. ${cat.strMeal}:</b></span> <span style="color: red;"><b>${cat.strCategory}</b></span>`)
    })
  }
})

//Counting appearance of a meal based on category---
function mealNum() {
  const catCount = fullMeal.reduce((res, curr) => {
    const name = curr.strCategory;
    res[name] = (res[name] || 0) + 1;
    return res;
    }, {});
  return catCount;
}

function printScreen3(msg) {
  let mealCatDiv = document.createElement('div');
  mealCatDiv.classList.add('mealCatDivCl');

  let mealCatPa = document.createElement('p');
  mealCatPa.classList.add('mealCatP');

  mealCatPa.innerHTML = msg;
  mealCatDiv.appendChild(mealCatPa);
  countMealAppDiv.appendChild(mealCatDiv);
}

mealByCat.addEventListener("click", function() {
  let removeElement = document.getElementsByClassName('mealCatDivCl');
  [...removeElement].forEach(el => el.remove());

  const catCounts = mealNum();

  printScreen3('<span style="color: magenta;"><b><u>Number of Meal by Category</u></b></span>')
  for (const [category, count] of Object.entries(catCounts)) {
    printScreen3(`<span style="color: green;"><b>${category}:</b></span> <span style="color: red;"><b>${count}</b></span>`);
  }
})

function groupByMeal(item, key) {
  const groupMeals = item.reduce((res, curr) => {
    const groupKey = curr[key] || 'Unknown';
    if (!res[groupKey]) {
      res[groupKey] = [];
    }
    res[groupKey].push(curr);
    return res;
  }, {})
  return groupMeals;
}

function printScreen4(msg) {
  let groupDiv = document.createElement('div');
  groupDiv.classList.add('groupDivCl');

  let groupP = document.createElement('p');
  groupP.classList.add('groupPCl');

  groupP.innerHTML = msg;
  groupDiv.appendChild(groupP);
  grpByDiv.appendChild(groupDiv);
}

groupBy.addEventListener("click", function() {
  let removeElement = document.getElementsByClassName('groupDivCl');
  [...removeElement].forEach(el => el.remove());

  const groupMeal = groupByMeal(fullMeal, 'strCategory');

  printScreen4('<span style="color: magenta;"><b><u>Type of Meals by Category</u></b></span>')
  for (const [category, meals] of Object.entries(groupMeal)) {
    const mealNames = meals.map(m => m.strMeal).join(', ');
    printScreen4(`<span style="color: green;"><b>${category}:</b></span> <span style="color: mediumvioletred;"><b>${mealNames}</b></span>`);
  }
})

//Select & Shape---
function reshapeMeals(items) {
  return items.map(meal => {
    // Extract only desired fields
    const ingredients = [];

    // Loop through ingredient keys (strIngredient1 ... strIngredient20)
    for (let i = 1; i <= 25; i++) {
      const ing = meal[`strIngredient${i}`];
      if (ing) ingredients.push(ing);
    }

    // Return compact summary
    return {
      id: meal.idMeal,
      name: meal.strMeal,
      category: meal.strCategory,
      ingredients: ingredients
    };
  });
}

reshapeBtn.addEventListener('click', function() {
  // remove past reshaped elements
  let removeElement = document.getElementsByClassName('mealLiD');
  [...removeElement].forEach(el => el.remove());

  // reshape data
  const reshaped = reshapeMeals(fullMeal);

  printScreen1('<span style="color: purple;"><b><u>Meal Details</u></b></span>')
  reshaped.forEach(meal => {
    printScreen1(
      `<span style="color: red;"><b>${meal.name}</b></span> <span style="color: green;">(${meal.category})</span><br>
      ID: ${meal.id}<br>
      <span style="color: darkviolet;"><b>Ingredients:</b></span> <b>${meal.ingredients.join(', ')}</b>`
    );
  });
});


//Ingredient Count---
function ingredientFrequency(items) {
  // Flatten all ingredients into one array
  const allIngredients = [];

  items.forEach(meal => {
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      if (ing) allIngredients.push(ing);
    }
  });

  // Reduce to frequency map
  const freqMap = allIngredients.reduce((res, curr) => {
    res[curr] = (res[curr] || 0) + 1;
    return res;
  }, {});
  return freqMap;
}

freqBtn.addEventListener('click', function() {
  // remove old ingredient frequency display
  let removeElement = document.getElementsByClassName('mealLiD');
  [...removeElement].forEach(el => el.remove());

  const freq = ingredientFrequency(fullMeal);

  // Sort ingredients alphabetically for readability
  const sortedFreq = Object.entries(freq).sort(([a], [b]) => a.localeCompare(b));

  printScreen1('<span style="color: purple;"><b><u>Ingredient Frequenies</u></b></span>')
  for (const [ingredient, count] of sortedFreq) {
    printScreen1(`<span style="color: green;"><b>${ingredient}:</b></span> <span style="color: red;"><b>${count}</b></span>`);
  }
});
