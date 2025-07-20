const btCreateRecipe = document.querySelector('.btn-create-menu');
const recipeCont = document.querySelector('.recipes-container');
const RecipeTitle = document.querySelectorAll('.recipe');
let recipes = []; 
let randIndex = [];

fetch('recipes_full.json')
  .then(response => response.json())
  .then(data => {
    recipes = data;
    console.log('Данные загружены:', recipes[0].title);

    const savedRecipes = localStorage.getItem('selectedRecipes');
    if (savedRecipes) {
      const parsedRecipes = JSON.parse(savedRecipes);
      updateRecipesDisplay(parsedRecipes);
    }
  })
  .catch(error => console.error('Ошибка загрузки:', error));


btCreateRecipe.addEventListener('click', () => {
    const selectedRecipes = [];
    RecipeTitle.forEach((recipe, index) => {
      const RecipeTitle = recipe.querySelector(".recipe-title");
      const RecipeCategory = recipe.querySelector(".category");
      const RecipeIngridients = recipe.querySelector(".ingridients");
      const RecipeIngrLink = recipe.querySelector(".link");

      let Value = randomValueForRecipe();

      const selectedRecipe = recipes[Value];
      selectedRecipes.push(selectedRecipe)

      recipeCont.style.display = "flex";

      RecipeTitle.textContent = recipes[Value].title;
      RecipeCategory.textContent = recipes[Value].category;
      RecipeIngridients.textContent = recipes[Value].ingredients[0].name;
      RecipeIngrLink.textContent = "Ссылка на рецепт";
      RecipeIngrLink.href = recipes[Value].link;

    });

    localStorage.setItem('selectedRecipes', JSON.stringify(selectedRecipes));
});



const randomValueForRecipe = () => {
  let randSingleIndex;
  do{
    randSingleIndex = Math.floor(Math.random() * recipes.length);
  } while(randIndex.includes(randSingleIndex));
  randIndex.push(randSingleIndex);
  return randSingleIndex;
}


function updateRecipesDisplay(recipesToShow) {
  RecipeTitle.forEach((recipe, index) => {
    if (recipesToShow[index]) {
      const RecipeTitleEl = recipe.querySelector(".recipe-title");
      const RecipeCategory = recipe.querySelector(".category");
      const RecipeIngridients = recipe.querySelector(".ingridients");
      const RecipeIngrLink = recipe.querySelector(".link");

      recipeCont.style.display = "flex";

      RecipeTitleEl.textContent = recipesToShow[index].title;
      RecipeCategory.textContent = recipesToShow[index].category;
      RecipeIngridients.textContent = recipesToShow[index].ingredients[0].name;
      RecipeIngrLink.textContent = "Ссылка на рецепт";
      RecipeIngrLink.href = recipesToShow[index].link;
    }
  });
}


