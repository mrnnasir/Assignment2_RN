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
//Picks each element as a FULL OBJECT from the API and add it to the specified variables
function gotMeal(pick) {
  if (pick.strMeal) {mealName.push(pick);}
  if (pick.strCategory) {mealCategory.push(pick);}
  if (pick.strArea) {mealOrigin.push(pick);}
  if (pick.strInstructions) {mealInstruction.push(pick);}
}

//Created a 'printScreen1' function, which will execute the following tasks once it's called upon
//'msg' in 'printScreen1' function is a parameter that acts as a placeholder which holds the value passed into the function once it's called
function printScreen1(msg) {
  //'mealLiDi' variable stores newly created 'div' element that can be added in the HTML
  let mealLiDi = document.createElement('div');
  //'mealLiD' can be used for styling in style.css
  mealLiDi.classList.add('mealLiD');

  //'mealLiPa' variable stores newly created 'p' element within 'div' element
  let mealLiPa = document.createElement('p');
  //'mealLiP' is a newly created class to the 'p' element that can be used for styling in style.css
  mealLiPa.classList.add('mealLiP');

  //'msg' parameter will be entered within the newly created 'mealLiPa' element of 'div' as HTML content
  mealLiPa.innerHTML = msg

  //To display the information, we need to append it to the body of HTML
  mealLiDi.appendChild(mealLiPa)
  mealListDiv.appendChild(mealLiDi)
}

//'mealList' will listen to the button, once it is clicked and execute what is inside the callback function
mealList.addEventListener('click', function () {
  //'removeElement' is a variable that stores a collection of all Div elements with the 'mealLiD' class
  let removeElement = document.getElementsByClassName('mealLiD');
  //Then using the forEach loop, it removes each element from the DOM
  [...removeElement].forEach(el => el.remove());

  //We need to sort the values
  mealName.sort((a, b) => a.strMeal.localeCompare(b.strMeal));

  printScreen1('<span style="color: purple;"><b><u>List of Meals</u></b></span>')

  //Print first 5 meals alphabetically, which we sorted earlier and return information to 'printScreen1' to execute
  for (let i = 0; i < 5; i++) {
    printScreen1(`<b>${i + 1}</b>. <span style="color: red;"><b>${mealName[i].strMeal}</b><span`)
  }
})

//Category based meal---
//Created a 'printScreen2' function, which will execute the following tasks once it's called upon
//'msg' in 'printScreen2' function is a parameter that acts as a placeholder which holds the value passed into the function once it's called
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
    //If the inserted user category name is spelled wrong, it will not be in the list. So, length will render 0.
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
//Created 'mealNum' function, which will execute the following tasks once it's called upon
function mealNum() {
  //Reduce method is applied to fullMeal, where 'res' is accumulator and 'curr' takes current value
  const catCount = fullMeal.reduce((res, curr) => {
    //'curr.strCategory' takes the value and put it in 'name' variable
    const name = curr.strCategory;
    //res[name] acts as a key, if it exists in 'res' add 1 in a dictionary format. If it doesn't exist add 1
    res[name] = (res[name] || 0) + 1;
    //Return 'res'
    return res;
    //Checks the next item
    }, {});
  //Returns the function
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

  //Takes the output from 'mealNum' function
  const catCounts = mealNum();

  printScreen3('<span style="color: magenta;"><b><u>Number of Meals by Category</u></b></span>')

  //It loops through each object in the 'catCounts' and publish category and count, which are in dictionary format
  for (const [category, count] of Object.entries(catCounts)) {
    printScreen3(`<span style="color: green;"><b>${category}:</b></span> <span style="color: red;"><b>${count}</b></span>`);
  }
})

//Group meal by area---
//'groupByMeal' function takes two parameters
function groupByMeal(item, key) {
  const groupMeals = item.reduce((res, curr) => {
    //Checks if the key is missing or falsy -> unknown
    const groupKey = curr[key] || 'Unknown';
    //If this group doesn't exist yet, initialize it as an empty array.
    if (!res[groupKey]) {
      res[groupKey] = [];
    }
    //Add the current item to the appropriate group array.
    res[groupKey].push(curr);
    return res;
    //Continue to the next item in the array.
  }, {})
  //Return the final grouped object.
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

  //Takes information from 'groupByMeal' function
  const groupMeal = groupByMeal(fullMeal, 'strArea');

  printScreen4('<span style="color: magenta;"><b><u>Type of Meals by Area</u></b></span>')

  for (const [area, meals] of Object.entries(groupMeal)) {
    const mealNames = meals.map(m => m.strMeal).join(', ');
    printScreen4(`<span style="color: green;"><b>${area}:</b></span> <span style="color: mediumvioletred;"><b>${mealNames}</b></span>`);
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

    // Return brief summary
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
  //Create an empty array to collect *all* ingredients from all meals
  const allIngredients = [];

  //Loop through each meal in the 'items' array
  items.forEach(meal => {
    //Each meal can have up to 20 ingredient fields (strIngredient1 to strIngredient20)
    for (let i = 1; i <= 20; i++) {
      //Access the ingredient field dynamically using template literal
      const ing = meal[`strIngredient${i}`];
      //If the ingredient exists (is not null or empty), push it into the allIngredients array
      if (ing) allIngredients.push(ing);
    }
  });

  //Reduce all ingredients into a frequency map (object)
  const freqMap = allIngredients.reduce((res, curr) => {
    //If the ingredient already exists in 'res', increment its count; otherwise start at 1
    res[curr] = (res[curr] || 0) + 1;
    //Return the accumulator object for the next iteration
    return res;
  }, {}); //Start with an empty object as the initial value
  return freqMap;
}

freqBtn.addEventListener('click', function() {
  // remove old ingredient frequency display
  let removeElement = document.getElementsByClassName('mealLiD');
  [...removeElement].forEach(el => el.remove());

  //Generate the frequency map using all meals fetched earlier (stored in fullMeal)
  const freq = ingredientFrequency(fullMeal);

  //Convert object into array and sort alphabetically by ingredient name
  //Object.entries(freq) → turns { Salt: 5, Beef: 3 } into [["Salt", 5], ["Beef", 3]]
  //.sort(([a], [b]) => a.localeCompare(b)) → sorts alphabetically by the ingredient name
  const sortedFreq = Object.entries(freq).sort(([a], [b]) => a.localeCompare(b));

  printScreen1('<span style="color: purple;"><b><u>Frequency of Ingredient</u></b></span>')
  for (const [ingredient, count] of sortedFreq) {
    printScreen1(`<span style="color: green;"><b>${ingredient}:</b></span> <span style="color: red;"><b>${count}</b></span>`);
  }
});
